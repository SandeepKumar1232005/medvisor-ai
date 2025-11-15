import { Brain, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-primary overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Explainable AI for Healthcare</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Transparent Medical Diagnosis
            <br />
            <span className="text-white/90">with Grad-CAM</span>
          </h1>

          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Deep learning meets interpretability. Our AI system doesn't just predict—it 
            explains which image regions influenced each diagnosis, building trust through 
            visual transparency.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <span>CNN Classification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-white/30 flex items-center justify-center text-xs font-bold">
                G
              </div>
              <span>Grad-CAM Heatmaps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-diagnostic-green" />
              <span>Clinical Validation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
