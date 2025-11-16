import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CameraCaptureProps {
  onIngredientsDetected: (ingredients: string[], hasNonFoodItems: boolean, nonFoodItems: string[], imageData: string) => void;
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

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
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
          description: "Try taking a clearer photo with good lighting and visible items",
          variant: "destructive",
        });
      } else {
        toast({
          title: data.hasNonFoodItems ? "⚠️ Items detected with warning" : "✨ Ingredients detected!",
          description: data.hasNonFoodItems 
            ? `Found ${data.ingredients.length} food items. Note: ${data.nonFoodItems.join(', ')} detected (non-food).`
            : `Found ${data.ingredients.length} ingredients in your fridge!`,
          variant: data.hasNonFoodItems ? "destructive" : "default",
        });
        onIngredientsDetected(data.ingredients, data.hasNonFoodItems, data.nonFoodItems, imageData);
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
        <div className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col items-center justify-center p-8 hover:bg-primary/10 transition-smooth">
          <Camera className="w-16 h-16 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-black">Capture Your Fridge</h3>
          <p className="text-sm text-black text-center mb-2">
            Take a photo of your fridge or ingredients
          </p>
          <p className="text-xs text-black font-medium mb-6">
            💡 Tip: Use good lighting and make items clearly visible
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={handleCameraClick}
              size="lg"
              className="bg-primary text-black shadow-soft hover:shadow-elevated transition-smooth rounded-full hover:bg-primary/90 font-semibold"
            >
              <Camera className="mr-2 h-5 w-5" />
              Take Photo
            </Button>
            <Button 
              onClick={handleCameraClick}
              size="lg"
              className="bg-secondary text-black shadow-soft hover:shadow-elevated transition-smooth rounded-full hover:bg-secondary/90 font-semibold"
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
                <p className="text-lg font-semibold text-black">Analyzing ingredients...</p>
                <p className="text-sm text-black">This may take a moment</p>
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
              className="absolute bottom-4 right-4 bg-secondary text-black rounded-full shadow-soft hover:shadow-elevated font-semibold"
            >
              Retake Photo
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
