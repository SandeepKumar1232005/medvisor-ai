import { Brain, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Dynamic Background with Mesh Gradient */}
      <div className="absolute inset-0 bg-background z-0">
        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-primary/20 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-medical-blue/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full mb-8 shadow-sm border border-white/20">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-medical-blue-dark bg-clip-text text-transparent">
              Next-Gen AI Healthcare
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-foreground">
            Transparent Medical
            <br />
            <span className="bg-gradient-to-r from-primary via-medical-blue to-accent bg-clip-text text-transparent pb-2">
              Diagnosis
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Deep learning meets interpretability. Our AI system predicts and explains
            diagnoses using advanced Grad-CAM visualizations, ensuring clinical trust.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium text-foreground/80">
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg shadow-sm border border-border/50">
              <Brain className="h-5 w-5 text-primary" />
              <span>CNN Classification</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg shadow-sm border border-border/50">
              <div className="h-5 w-5 rounded bg-gradient-to-br from-accent to-primary flex items-center justify-center text-[10px] font-bold text-white">
                G
              </div>
              <span>Grad-CAM Heatmaps</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg shadow-sm border border-border/50">
              <div className="h-2.5 w-2.5 rounded-full bg-diagnostic-green shadow-[0_0_8px_rgba(var(--diagnostic-green),0.5)]" />
              <span>Clinical Validation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
