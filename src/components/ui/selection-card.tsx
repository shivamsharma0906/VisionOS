import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SelectionCardProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function SelectionCard({
  label,
  description,
  icon,
  selected,
  onClick,
  className,
}: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-6 rounded-xl border-2 transition-all duration-300 text-left w-full",
        "hover:border-primary/50 hover:shadow-md",
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card",
        className
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      {icon && (
        <div className="mb-3 text-2xl">{icon}</div>
      )}
      <h3 className="font-semibold text-foreground mb-1">{label}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </button>
  );
}
