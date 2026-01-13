import { useState } from "react";
import { Upload, Brain, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploader } from "@/components/ImageUploader";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { GradCAMVisualization } from "@/components/GradCAMVisualization";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { toast } from "sonner";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImageUpload = (imageData: string, file: File) => {
    setUploadedImage(imageData);
    setImageFile(file);
    setShowResults(false);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysisResult(data);
      setShowResults(true);
      toast.success("Analysis complete");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze image. Ensure backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImageFile(null);
    setShowResults(false);
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Hero Section */}
      {!uploadedImage && <HeroSection />}

      {/* Features Section */}
      {!uploadedImage && (
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Our explainable AI system combines deep learning with visual explanations
                to provide transparent, trustworthy medical diagnoses
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <FeatureCard
                icon={Upload}
                title="Upload Medical Image"
                description="Upload X-rays, CT scans, or MRI images for AI analysis"
                color="primary"
              />
              <FeatureCard
                icon={Brain}
                title="AI Analysis"
                description="CNN model classifies images with high accuracy and confidence scores"
                color="accent"
              />
              <FeatureCard
                icon={Eye}
                title="Grad-CAM Visualization"
                description="Visual heatmaps show exactly where the AI focused its attention"
                color="medical-blue"
              />
            </div>
          </div>
        </section>
      )}

      {/* Analysis Interface */}
      {!uploadedImage && (
        <section className="py-24 px-4 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-10 shadow-elevated bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-none ring-1 ring-border/50 animate-in fade-in zoom-in-95 duration-700 delay-300 fill-mode-both">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Start Your Analysis
                </h2>
                <p className="text-muted-foreground text-lg">
                  Upload a medical image to begin AI-powered diagnosis
                </p>
              </div>
              <ImageUploader onImageUpload={(data) => {
                fetch(data).then(res => res.blob()).then(blob => {
                  const file = new File([blob], "upload.jpg", { type: "image/jpeg" });
                  handleImageUpload(data, file);
                });
              }} />
            </Card>
          </div>
        </section>
      )}

      {/* Results View */}
      {uploadedImage && (
        <section className="py-12 px-4 min-h-screen bg-muted/20">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Medical Image Analysis
                  </h2>
                  <p className="text-sm text-muted-foreground">AI Diagnostic Report</p>
                </div>
              </div>
              <Button onClick={handleReset} variant="outline" className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                Analyze New Image
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Visualization */}
              <Card className="p-1 shadow-elevated bg-white dark:bg-slate-900 border-none ring-1 ring-black/5 animate-in fade-in slide-in-from-left duration-700">
                <div className="p-6 pb-2">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Image & Grad-CAM Heatmap
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Original scan vs. AI attention map</p>
                </div>
                <div className="p-2">
                  <GradCAMVisualization
                    imageUrl={uploadedImage}
                    heatmapUrl={analysisResult?.gradcam_image}
                    showHeatmap={showResults}
                  />
                </div>
                {!showResults && (
                  <div className="p-6 pt-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-primary to-medical-blue hover:opacity-90 transition-opacity h-12 text-lg shadow-lg shadow-primary/20"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Brain className="mr-2 h-5 w-5 animate-pulse" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-5 w-5" />
                          Run AI Diagnosis
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Diagnosis Results */}
              <div className="space-y-6">
                {showResults && analysisResult && <DiagnosisResult result={analysisResult} />}

                {!showResults && !isAnalyzing && (
                  <Card className="p-12 shadow-sm bg-white/50 border-dashed border-2 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-6 bg-slate-50 rounded-full mb-6">
                      <Brain className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ready for Analysis</h3>
                    <p className="text-lg text-muted-foreground max-w-sm">
                      Click the "Run AI Diagnosis" button to start the classification process.
                    </p>
                  </Card>
                )}

                {isAnalyzing && (
                  <Card className="p-12 shadow-elevated bg-white border-none text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="inline-block relative mb-6">
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                      <Brain className="relative z-10 h-16 w-16 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Processing Image...
                    </h3>
                    <p className="text-muted-foreground">
                      Running CNN classification and generating Grad-CAM heatmap
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Explanation Footer */}
            {showResults && (
              <Card className="mt-8 p-6 shadow-sm bg-blue-50/50 dark:bg-slate-900/50 border border-blue-100 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    About These Results
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
                    This explainable AI system uses Gradient-weighted Class Activation Mapping (Grad-CAM)
                    to visualize the regions that most influenced the diagnosis. The red/yellow areas in the
                    heatmap indicate where the neural network focused its attention. This transparency helps
                    clinicians verify that the AI is examining relevant anatomical features.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Trust & Transparency Section */}
      {!uploadedImage && (
        <section className="py-24 px-4 bg-slate-50 border-t border-border">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 view-timeline-name:--trust-section">
              <AlertTriangle className="mx-auto h-12 w-12 text-warning-amber mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Built for Clinical Trust
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                This demonstration system showcases how explainable AI can enhance medical
                decision-making. In production environments, such systems undergo rigorous
                validation, regulatory approval, and continuous monitoring to ensure patient safety.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
