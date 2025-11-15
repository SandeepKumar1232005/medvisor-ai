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
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    "medical-blue": "bg-medical-blue text-white",
  };

  return (
    <Card className="p-6 shadow-clinical hover:shadow-elevated transition-all duration-300 bg-gradient-card border-border hover:border-primary/30">
      <div className={`inline-flex p-3 rounded-xl mb-4 ${colorClasses[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </Card>
  );
};
