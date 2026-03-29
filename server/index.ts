import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import { normalizeIngredients, readRecipeCache, writeRecipeCache } from "./cache.js";
import { generateRecipeImage, generateRecipes } from "./openai.js";
import { RecipeResponse } from "./types.js";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env.api.key", override: true });

const app = express();
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "127.0.0.1";

const requestSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(1),
});

const imageRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/recipes/suggest", async (request, response) => {
  const parsed = requestSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ error: "Please send a non-empty ingredients array." });
    return;
  }

  const ingredients = normalizeIngredients(parsed.data.ingredients);
  const cached = readRecipeCache(ingredients);

  if (cached) {
    response.json({ ...cached, cached: true });
    return;
  }

  try {
    const recipes = await generateRecipes(ingredients);
    const payload: RecipeResponse = {
      ingredients,
      recipes,
      cached: false,
    };

    writeRecipeCache(payload);
    response.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate recipes.";
    response.status(500).json({ error: message });
  }
});

app.post("/api/recipes/image", async (request, response) => {
  const parsed = imageRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ error: "Please send a recipe title and description." });
    return;
  }

  try {
    const imageUrl = await generateRecipeImage(parsed.data);
    response.json({ imageUrl: imageUrl ?? null });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate recipe image.";
    response.status(500).json({ error: message });
  }
});

app.listen(port, host, () => {
  console.log(`Recipe Finder server listening on http://${host}:${port}`);
});
