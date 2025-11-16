import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PreferencesFormProps {
  cuisine: string;
  setCuisine: (value: string) => void;
  timeAvailable: string;
  setTimeAvailable: (value: string) => void;
  dietaryPreference: string;
  setDietaryPreference: (value: string) => void;
  mood: string;
  setMood: (value: string) => void;
  tastePreference: string;
  setTastePreference: (value: string) => void;
}

export const PreferencesForm = ({
  cuisine,
  setCuisine,
  timeAvailable,
  setTimeAvailable,
  dietaryPreference,
  setDietaryPreference,
  mood,
  setMood,
  tastePreference,
  setTastePreference,
}: PreferencesFormProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <h3 className="text-xl font-semibold text-center mb-4 text-heading">Customize Your Recipes ✨</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cuisine">Cuisine Preference</Label>
          <Select value={cuisine} onValueChange={setCuisine}>
            <SelectTrigger id="cuisine" className="w-full bg-card">
              <SelectValue placeholder="Any cuisine" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="italian">Italian 🇮🇹</SelectItem>
              <SelectItem value="mexican">Mexican 🇲🇽</SelectItem>
              <SelectItem value="asian">Asian 🥢</SelectItem>
              <SelectItem value="indian">Indian 🇮🇳</SelectItem>
              <SelectItem value="mediterranean">Mediterranean 🫒</SelectItem>
              <SelectItem value="american">American 🇺🇸</SelectItem>
              <SelectItem value="french">French 🇫🇷</SelectItem>
              <SelectItem value="chinese">Chinese 🇨🇳</SelectItem>
              <SelectItem value="japanese">Japanese 🇯🇵</SelectItem>
              <SelectItem value="thai">Thai 🇹🇭</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time Available</Label>
          <Select value={timeAvailable} onValueChange={setTimeAvailable}>
            <SelectTrigger id="time" className="w-full bg-card">
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="15">15 mins ⚡</SelectItem>
              <SelectItem value="30">30 mins</SelectItem>
              <SelectItem value="45">45 mins</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="60+">1+ hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietary">Dietary Preference</Label>
          <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
            <SelectTrigger id="dietary" className="w-full bg-card">
              <SelectValue placeholder="No restrictions" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="vegetarian">Vegetarian 🥗</SelectItem>
              <SelectItem value="vegan">Vegan 🌱</SelectItem>
              <SelectItem value="gluten-free">Gluten-Free</SelectItem>
              <SelectItem value="dairy-free">Dairy-Free</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
              <SelectItem value="low-carb">Low-Carb</SelectItem>
              <SelectItem value="halal">Halal</SelectItem>
              <SelectItem value="kosher">Kosher</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mood">Mood</Label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger id="mood" className="w-full bg-card">
              <SelectValue placeholder="What's your vibe?" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="any">Surprise me!</SelectItem>
              <SelectItem value="comfort">Comfort 🍲</SelectItem>
              <SelectItem value="quick">Quick & Easy ⚡</SelectItem>
              <SelectItem value="healthy">Healthy 🥗</SelectItem>
              <SelectItem value="indulgent">Indulgent 🍰</SelectItem>
              <SelectItem value="adventurous">Adventurous 🌶️</SelectItem>
              <SelectItem value="light">Light & Fresh 🌿</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="taste">Taste Preference (Optional)</Label>
        <Input
          id="taste"
          value={tastePreference}
          onChange={(e) => setTastePreference(e.target.value)}
          placeholder="e.g., spicy, sweet, savory, tangy, mild..."
          className="w-full bg-card"
        />
      </div>
    </div>
  );
};
