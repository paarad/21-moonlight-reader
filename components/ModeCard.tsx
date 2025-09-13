export function ModeCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-5 bg-card/60 hover:bg-card transition-colors">
      <div className="font-medium mb-1">{title}</div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
} 