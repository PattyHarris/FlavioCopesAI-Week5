import { Recipe, RecipeSearchGroup } from "./types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function getStableRecipeId(recipe: Recipe) {
  const title = slugify(recipe.title);
  const cookTime = slugify(recipe.cookTime);
  const ingredients = recipe.ingredients
    .map((ingredient) => slugify(ingredient))
    .join("-");

  return `${title}-${cookTime}-${ingredients}`.slice(0, 180);
}

export function normalizeRecipe(recipe: Recipe): Recipe {
  return {
    ...recipe,
    id: getStableRecipeId(recipe),
  };
}

export function normalizeRecipes(recipes: Recipe[]) {
  return recipes.map(normalizeRecipe);
}

export function normalizeSearchGroup(group: RecipeSearchGroup): RecipeSearchGroup {
  return {
    ...group,
    recipes: normalizeRecipes(group.recipes),
  };
}
