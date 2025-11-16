import { useState } from "react";
import { ChefHat, Sparkles } from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";
import { IngredientsList } from "@/components/IngredientsList";
import { RecipeCard } from "@/components/RecipeCard";
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

  const generateRecipes = async () => {
    if (ingredients.length === 0) return;

    setIsGenerating(true);
    
    try {
      console.log('Generating recipes for:', ingredients);
      
      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: { ingredients }
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-fresh rounded-full mb-4 shadow-soft">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-hero bg-clip-text text-transparent">
            Leftover Recipe AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Snap a photo of your fridge, and let AI create delicious recipes from your leftovers
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
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 className="text-3xl font-bold">Your Recipe Suggestions</h2>
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {ingredients.length === 0 && recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Start by capturing a photo of your ingredients!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
