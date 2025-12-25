import { cn } from "@/lib/utils";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "./button";

interface GoalCardProps {
  text: string;
  tag: 'realistic' | 'stretch' | 'aggressive';
  accepted: boolean;
  onAccept: () => void;
  onEdit: () => void;
  onRemove: () => void;
  className?: string;
}

const tagConfig = {
  realistic: { label: 'Realistic', color: 'bg-primary/10 text-primary border-primary/20' },
  stretch: { label: 'Stretch', color: 'bg-accent/10 text-accent-foreground border-accent/20' },
  aggressive: { label: 'Aggressive', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export function GoalCard({
  text,
  tag,
  accepted,
  onAccept,
  onEdit,
  onRemove,
  className,
}: GoalCardProps) {
  const tagStyle = tagConfig[tag];

  return (
    <div
      className={cn(
        "p-5 rounded-xl border-2 transition-all duration-300",
        accepted
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-border/80",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-foreground font-medium mb-3">{text}</p>
          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
              tagStyle.color
            )}
          >
            {tag === 'realistic' && '🟢'} {tag === 'stretch' && '🟡'} {tag === 'aggressive' && '🔴'}{' '}
            {tagStyle.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={accepted ? "default" : "outline"}
            size="sm"
            onClick={onAccept}
            className="h-9 w-9 p-0"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-9 w-9 p-0"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:border-destructive/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
