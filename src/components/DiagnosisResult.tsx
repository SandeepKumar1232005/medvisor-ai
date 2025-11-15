import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PredictionResult {
  condition: string;
  confidence: number;
  severity: "normal" | "mild" | "moderate" | "severe";
}

export const DiagnosisResult = () => {
  // Simulated prediction results
  const predictions: PredictionResult[] = [
    { condition: "Pneumonia", confidence: 87.3, severity: "moderate" },
    { condition: "Normal", confidence: 8.2, severity: "normal" },
    { condition: "Tuberculosis", confidence: 3.1, severity: "severe" },
    { condition: "COVID-19", confidence: 1.4, severity: "severe" },
  ];

  const topPrediction = predictions[0];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "normal":
        return "bg-diagnostic-green text-white";
      case "mild":
        return "bg-warning-amber text-white";
      case "moderate":
        return "bg-warning-amber text-white";
      case "severe":
        return "bg-destructive text-white";
      default:
        return "bg-clinical-gray text-white";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-diagnostic-green";
    if (confidence >= 60) return "text-warning-amber";
    return "text-clinical-gray";
  };

  return (
    <div className="space-y-4">
      {/* Primary Diagnosis */}
      <Card className="p-6 shadow-elevated bg-gradient-card border-2 border-primary">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-foreground">
                Primary Diagnosis
              </h3>
              <Badge className={getSeverityColor(topPrediction.severity)}>
                {topPrediction.severity.toUpperCase()}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-primary">
              {topPrediction.condition}
            </p>
          </div>
          <AlertCircle className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className={`font-bold text-lg ${getConfidenceColor(topPrediction.confidence)}`}>
              {topPrediction.confidence.toFixed(1)}%
            </span>
          </div>
          <Progress value={topPrediction.confidence} className="h-2" />
        </div>

        <div className="mt-4 p-4 bg-medical-blue-light rounded-lg">
          <p className="text-sm text-foreground">
            <strong>Clinical Note:</strong> The model detected features consistent with{" "}
            {topPrediction.condition.toLowerCase()} in the highlighted regions. The Grad-CAM 
            heatmap indicates primary attention on the lower lung fields, suggesting potential 
            consolidation or infiltrates.
          </p>
        </div>
      </Card>

      {/* Differential Diagnoses */}
      <Card className="p-6 shadow-clinical bg-gradient-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-foreground">Differential Diagnoses</h4>
        </div>
        
        <div className="space-y-3">
          {predictions.slice(1).map((prediction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-clinical-gray-light rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{prediction.condition}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24">
                  <Progress value={prediction.confidence} className="h-1.5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                  {prediction.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendation */}
      <Card className="p-6 shadow-clinical bg-diagnostic-green-light border-diagnostic-green">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-diagnostic-green flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Recommended Next Steps
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Review patient history and clinical presentation</li>
              <li>Consider additional imaging (CT scan) for confirmation</li>
              <li>Correlate with laboratory findings and vital signs</li>
              <li>Consult with radiologist for expert interpretation</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
