import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PredictionResult {
  condition: string;
  confidence: number;
  severity: string;
}

interface DiagnosisResultProps {
  result: {
    predicted_class: string;
    confidence: number;
    severity: string;
    differential: PredictionResult[];
  };
}

export const DiagnosisResult = ({ result }: DiagnosisResultProps) => {
  const { predicted_class, confidence, severity, differential } = result;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "normal":
        return "bg-diagnostic-green text-white";
      case "mild":
        return "bg-warning-amber text-white";
      case "moderate":
        return "bg-orange-500 text-white";
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
    <div className="space-y-4 animate-in fade-in slide-in-from-right duration-700">
      {/* Primary Diagnosis */}
      <Card className="overflow-hidden border-none shadow-elevated bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Primary Diagnosis</span>
                <Badge className={`${getSeverityColor(severity)} px-3 py-1 shadow-sm`}>
                  {severity.toUpperCase()}
                </Badge>
              </div>
              <p className="text-4xl font-extrabold text-foreground tracking-tight">
                {predicted_class}
              </p>
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${confidence >= 80 ? 'from-green-500/20 to-green-500/5' : 'from-amber-500/20 to-amber-500/5'}`}>
              <AlertCircle className={`h-8 w-8 ${confidence >= 80 ? 'text-diagnostic-green' : 'text-warning-amber'}`} />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">AI Confidence Score</span>
              <span className={`font-bold text-lg ${getConfidenceColor(confidence)}`}>
                {confidence.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${confidence >= 80 ? 'bg-diagnostic-green' : 'bg-warning-amber'}`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <div className="p-5 bg-card/50 rounded-xl border border-border/50">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Clinical Note:</strong> The model detected features consistent with{" "}
              {predicted_class.toLowerCase()} in the highlighted regions. The Grad-CAM
              heatmap indicates attention on specific anatomical features.
            </p>
          </div>
        </div>
      </Card>

      {/* Differential Diagnoses */}
      <Card className="p-6 border-none shadow-clinical bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h4 className="font-bold text-foreground">Differential Diagnoses</h4>
        </div>

        <div className="space-y-4">
          {differential.map((prediction, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">{prediction.condition}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/60 rounded-full"
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-muted-foreground w-12 text-right">
                  {prediction.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendation */}
      <Card className="p-6 border-none shadow-clinical bg-gradient-to-br from-diagnostic-green/10 to-transparent border-l-4 border-l-diagnostic-green">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-diagnostic-green flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-foreground mb-3">
              Recommended Next Steps
            </h4>
            <ul className="text-sm text-foreground/80 space-y-2 list-disc list-inside">
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
