import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GradCAMVisualizationProps {
  imageUrl: string;
  heatmapUrl?: string | null;
  showHeatmap: boolean;
}

export const GradCAMVisualization = ({ imageUrl, heatmapUrl, showHeatmap }: GradCAMVisualizationProps) => {
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(true);

  // Use the heatmap image if available and toggled on, otherwise original image, or if not analyzed yet just original
  const displayImage = (showHeatmap && isHeatmapVisible && heatmapUrl) ? heatmapUrl : imageUrl;

  return (
    <div className="space-y-4">
      <div className="relative bg-black/90 rounded-2xl overflow-hidden aspect-square flex items-center justify-center shadow-inner border border-white/10 group">
        <img
          src={displayImage}
          alt="Medical scan"
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-4 right-4 text-xs text-white/50 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
          {showHeatmap && isHeatmapVisible && heatmapUrl ? "Grad-CAM Active" : "Original Scan"}
        </div>
      </div>

      {showHeatmap && heatmapUrl && (
        <Card className="p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Heatmap Overlay
              </label>
              <Button
                variant={isHeatmapVisible ? "default" : "outline"}
                size="sm"
                onClick={() => setIsHeatmapVisible(!isHeatmapVisible)}
                className={`h-9 px-4 transition-all duration-300 ${isHeatmapVisible ? "bg-accent hover:bg-accent/90" : ""}`}
              >
                {isHeatmapVisible ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" /> Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" /> Hidden
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500 opacity-80" />
              <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                <span>Low Activation</span>
                <span>High Activation</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
