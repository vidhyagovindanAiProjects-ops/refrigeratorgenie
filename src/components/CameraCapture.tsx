import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CameraCaptureProps {
  onIngredientsDetected: (ingredients: string[], hasNonFoodItems: boolean, nonFoodItems: string[]) => void;
}

export const CameraCapture = ({ onIngredientsDetected }: CameraCaptureProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      setCapturedImage(base64Image);
      await analyzeImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    
    try {
      console.log('Sending image for analysis...');
      
      const { data, error } = await supabase.functions.invoke('analyze-ingredients', {
        body: { image: imageData }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      console.log('Analysis result:', data);

      if (data.hasNonFoodItems && data.nonFoodItems.length > 0) {
        toast({
          title: "⚠️ Non-food items detected",
          description: `Found: ${data.nonFoodItems.join(', ')}. Please capture only food items.`,
          variant: "destructive",
        });
      }

      if (data.ingredients.length === 0) {
        toast({
          title: "No ingredients found",
          description: "Could not detect any food items. Try a clearer photo with better lighting.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "✓ Ingredients detected!",
          description: `Found ${data.ingredients.length} ingredient(s)`,
        });
        onIngredientsDetected(data.ingredients, data.hasNonFoodItems, data.nonFoodItems);
      }

    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!capturedImage ? (
        <div className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-border bg-secondary/30 flex flex-col items-center justify-center p-8 hover:bg-secondary/50 transition-smooth">
          <Camera className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Capture Your Fridge</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Take a photo of your fridge or ingredients
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={handleCameraClick}
              size="lg"
              className="bg-gradient-fresh shadow-soft hover:shadow-elevated transition-smooth"
            >
              <Camera className="mr-2 h-5 w-5" />
              Take Photo
            </Button>
            <Button 
              onClick={handleCameraClick}
              size="lg"
              variant="outline"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img 
            src={capturedImage} 
            alt="Captured fridge"
            className="w-full aspect-[4/3] object-cover rounded-2xl shadow-elevated"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold">Analyzing ingredients...</p>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </div>
            </div>
          )}
          {!isAnalyzing && (
            <Button
              onClick={() => {
                setCapturedImage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              variant="outline"
              className="absolute bottom-4 right-4"
            >
              Retake Photo
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
