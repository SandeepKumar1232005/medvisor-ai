import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "primary" | "accent" | "medical-blue";
}

export const FeatureCard = ({ icon: Icon, title, description, color }: FeatureCardProps) => {
  const colorClasses = {
    primary: "from-primary/20 to-primary/10 text-primary",
    accent: "from-accent/20 to-accent/10 text-accent",
    "medical-blue": "from-medical-blue/20 to-medical-blue/10 text-medical-blue",
  };

  return (
    <Card className="group p-6 shadow-sm hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-card backdrop-blur-sm border-border/60 hover:border-primary/20 hover:-translate-y-1">
      <div className={`inline-flex p-3 rounded-2xl mb-4 bg-gradient-to-br ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </Card>
  );
};
