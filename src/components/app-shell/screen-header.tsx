import { cn } from "@/lib/utils";

/**
 * Sticky, frosted header for app-shell screens. Sits above scrolling content
 * with a blur so content slides under it — the standard native-app pattern.
 */
export function ScreenHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-end justify-between gap-3 bg-card/80 px-5 pb-3 pt-[max(16px,env(safe-area-inset-top))] backdrop-blur-xl",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  );
}
