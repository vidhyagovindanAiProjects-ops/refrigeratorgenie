import { Clock, ChefHat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Recipe {
  name: string;
  description: string;
  cookTime: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'medium':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'hard':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="p-6 hover:shadow-elevated transition-smooth border-border">
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-2xl font-bold text-heading">{recipe.name}</h3>
          </div>
          <p className="text-muted-foreground">{recipe.description}</p>
        </div>

        <div className="flex gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recipe.cookTime}
          </Badge>
          <Badge variant="outline" className={`flex items-center gap-1 ${getDifficultyColor(recipe.difficulty)}`}>
            <ChefHat className="h-3 w-3" />
            {recipe.difficulty}
          </Badge>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-heading">Ingredients:</h4>
          <ul className="space-y-1">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start">
                <span className="text-primary mr-2">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-heading">Instructions:</h4>
          <ol className="space-y-2">
            {recipe.instructions.map((instruction, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start">
                <span className="font-semibold text-primary mr-2 min-w-[1.5rem]">{idx + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
};
