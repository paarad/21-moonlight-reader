export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Moonlight Reader"
    >
      {/* Crescent moon */}
      <circle cx="28" cy="24" r="16" fill="currentColor" className="text-primary" />
      <circle cx="34" cy="24" r="16" fill="currentColor" className="text-background" />
      {/* Open book */}
      <path d="M12 40c6-4 12-4 20 0v12c-8-4-14-4-20 0V40Z" fill="currentColor" className="text-card" />
      <path d="M52 40c-6-4-12-4-20 0v12c8-4 14-4 20 0V40Z" fill="currentColor" className="text-card" />
      <path d="M32 40v12" stroke="currentColor" className="text-border" strokeWidth="2" />
    </svg>
  );
} 