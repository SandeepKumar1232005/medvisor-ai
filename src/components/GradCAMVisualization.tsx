import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GradCAMVisualizationProps {
  imageUrl: string;
  showHeatmap: boolean;
}

export const GradCAMVisualization = ({ imageUrl, showHeatmap }: GradCAMVisualizationProps) => {
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.6);
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Generate simulated Grad-CAM heatmap
  useEffect(() => {
    if (!showHeatmap || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    // Wait for image to load
    const drawHeatmap = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Create gradient for heatmap effect (simulated Grad-CAM)
      const centerX = img.width * (0.4 + Math.random() * 0.2);
      const centerY = img.height * (0.4 + Math.random() * 0.2);
      const radius = Math.min(img.width, img.height) * 0.3;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
      gradient.addColorStop(0.3, 'rgba(255, 100, 0, 0.6)');
      gradient.addColorStop(0.6, 'rgba(255, 200, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some secondary attention spots
      const spots = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < spots; i++) {
        const spotX = img.width * (0.2 + Math.random() * 0.6);
        const spotY = img.height * (0.2 + Math.random() * 0.6);
        const spotRadius = radius * (0.3 + Math.random() * 0.3);

        const spotGradient = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotRadius);
        spotGradient.addColorStop(0, 'rgba(255, 100, 0, 0.5)');
        spotGradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.2)');
        spotGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

        ctx.fillStyle = spotGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (img.complete) {
      drawHeatmap();
    } else {
      img.onload = drawHeatmap;
    }
  }, [showHeatmap, imageUrl]);

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-square flex items-center justify-center">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Medical scan"
          className="max-w-full max-h-full object-contain"
        />
        {showHeatmap && isHeatmapVisible && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ opacity: heatmapOpacity, mixBlendMode: 'multiply' }}
          />
        )}
      </div>

      {showHeatmap && (
        <Card className="p-4 bg-clinical-gray-light border-border">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Heatmap Overlay
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHeatmapVisible(!isHeatmapVisible)}
                className="h-8 w-8 p-0"
              >
                {isHeatmapVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {isHeatmapVisible && (
              <div className="space-y-2">
                <Slider
                  value={[heatmapOpacity]}
                  onValueChange={(value) => setHeatmapOpacity(value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Transparent</span>
                  <span>Opacity: {Math.round(heatmapOpacity * 100)}%</span>
                  <span>Opaque</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-yellow-300 via-orange-500 to-red-600" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">Low → High Attention</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
