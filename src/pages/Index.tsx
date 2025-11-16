import { useState } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { IngredientsList } from "@/components/IngredientsList";
import { RecipeCard } from "@/components/RecipeCard";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Recipe {
  name: string;
  description: string;
  cookTime: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
}

const Index = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleIngredientsDetected = (
    detectedIngredients: string[],
    hasNonFoodItems: boolean,
    nonFoodItems: string[]
  ) => {
    setIngredients(detectedIngredients);
    setRecipes([]); // Clear previous recipes
  };

  const generateRecipes = async (preferences: {
    cuisine: string;
    timeAvailable: string;
    dietaryPreference: string;
    mood: string;
    tastePreference: string;
  }) => {
    if (ingredients.length === 0) return;

    setIsGenerating(true);
    
    try {
      console.log('Generating recipes with preferences:', preferences);
      
      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: { ingredients, ...preferences }
      });

      if (error) {
        console.error('Recipe generation error:', error);
        throw error;
      }

      console.log('Generated recipes:', data);

      if (data.recipes && data.recipes.length > 0) {
        setRecipes(data.recipes);
        toast({
          title: "✨ Recipes generated!",
          description: `Found ${data.recipes.length} delicious recipe(s) for you`,
        });
      } else {
        toast({
          title: "No recipes found",
          description: "Could not generate recipes with the provided ingredients.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error generating recipes:', error);
      toast({
        title: "Generation failed",
        description: "Could not generate recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-fresh">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-primary drop-shadow-sm">
            🧞 Refrigerator Genie
          </h1>
          <p className="text-lg text-foreground/80 font-medium">
            Transform your leftovers into delicious meals! ✨
          </p>
        </div>

        {/* Camera Section */}
        <div className="mb-12">
          <CameraCapture onIngredientsDetected={handleIngredientsDetected} />
        </div>

        {/* Ingredients Section */}
        {ingredients.length > 0 && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <IngredientsList
              ingredients={ingredients}
              onIngredientsChange={setIngredients}
              onGenerateRecipes={generateRecipes}
              isGenerating={isGenerating}
            />
          </div>
        )}

        {/* Recipes Section */}
        {recipes.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-2xl font-bold text-center text-primary mb-8">
              Your Recipe Suggestions 🍳
            </h2>
            <div className="grid gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
