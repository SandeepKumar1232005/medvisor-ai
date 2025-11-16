import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Brain, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploader } from "@/components/ImageUploader";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { GradCAMVisualization } from "@/components/GradCAMVisualization";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { AuthHeader } from "@/components/AuthHeader";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
    setShowResults(false);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setShowResults(false);
    setIsAnalyzing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Brain className="h-12 w-12 text-medical-blue animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AuthHeader />
      {/* Hero Section */}
      {!uploadedImage && <HeroSection />}

      {/* Features Section */}
      {!uploadedImage && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-clinical-gray max-w-2xl mx-auto">
                Our explainable AI system combines deep learning with visual explanations
                to provide transparent, trustworthy medical diagnoses
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
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
        <section className="py-16 px-4 bg-clinical-gray-light">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-8 shadow-elevated bg-gradient-card">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Start Your Analysis
                </h2>
                <p className="text-muted-foreground">
                  Upload a medical image to begin AI-powered diagnosis
                </p>
              </div>
              <ImageUploader onImageUpload={handleImageUpload} />
            </Card>
          </div>
        </section>
      )}

      {/* Results View */}
      {uploadedImage && (
        <section className="py-8 px-4 min-h-screen">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Medical Image Analysis
              </h2>
              <Button onClick={handleReset} variant="outline">
                Analyze New Image
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Image Visualization */}
              <Card className="p-6 shadow-elevated bg-gradient-card">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Image & Grad-CAM Heatmap
                </h3>
                <GradCAMVisualization
                  imageUrl={uploadedImage}
                  showHeatmap={showResults}
                />
                {!showResults && (
                  <div className="mt-6">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-primary hover:opacity-90"
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
                          Analyze Image
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Diagnosis Results */}
              <div className="space-y-6">
                {showResults && <DiagnosisResult />}
                
                {!showResults && !isAnalyzing && (
                  <Card className="p-8 shadow-clinical bg-gradient-card">
                    <div className="text-center text-muted-foreground">
                      <Brain className="mx-auto h-16 w-16 mb-4 opacity-40" />
                      <p className="text-lg">
                        Click "Analyze Image" to start AI diagnosis
                      </p>
                    </div>
                  </Card>
                )}

                {isAnalyzing && (
                  <Card className="p-8 shadow-clinical bg-gradient-card">
                    <div className="text-center">
                      <Brain className="mx-auto h-16 w-16 mb-4 text-primary animate-pulse" />
                      <p className="text-lg font-medium text-foreground mb-2">
                        Processing Image...
                      </p>
                      <p className="text-muted-foreground">
                        Running CNN classification and generating Grad-CAM heatmap
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Explanation Footer */}
            {showResults && (
              <Card className="mt-6 p-6 shadow-clinical bg-diagnostic-green-light border-diagnostic-green">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-diagnostic-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      About These Results
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      This explainable AI system uses Gradient-weighted Class Activation Mapping (Grad-CAM) 
                      to visualize the regions that most influenced the diagnosis. The red/yellow areas in the 
                      heatmap indicate where the neural network focused its attention. This transparency helps 
                      clinicians verify that the AI is examining relevant anatomical features.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Trust & Transparency Section */}
      {!uploadedImage && (
        <section className="py-16 px-4 bg-medical-blue-light">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-warning-amber mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Built for Clinical Trust
              </h3>
              <p className="text-clinical-gray max-w-2xl mx-auto">
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
