import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface IngredientsListProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onGenerateRecipes: () => void;
  isGenerating: boolean;
}

export const IngredientsList = ({ 
  ingredients, 
  onIngredientsChange,
  onGenerateRecipes,
  isGenerating 
}: IngredientsListProps) => {
  const [newIngredient, setNewIngredient] = useState("");

  const removeIngredient = (index: number) => {
    onIngredientsChange(ingredients.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      onIngredientsChange([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
        <h3 className="text-xl font-semibold mb-4">Detected Ingredients</h3>
        
        {ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ingredient, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-sm py-2 px-3 flex items-center gap-2"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(index)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-4">No ingredients detected yet</p>
        )}

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Want to add more? (Optional)
          </p>
          <div className="flex gap-2">
            <Input
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add an ingredient..."
              className="flex-1"
            />
            <Button
              onClick={addIngredient}
              variant="outline"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {ingredients.length > 0 && (
        <Button
          onClick={onGenerateRecipes}
          disabled={isGenerating}
          size="lg"
          className="w-full bg-gradient-hero shadow-soft hover:shadow-elevated transition-smooth text-white"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Generating Recipes...
            </>
          ) : (
            "Generate Recipes"
          )}
        </Button>
      )}
    </div>
  );
};
