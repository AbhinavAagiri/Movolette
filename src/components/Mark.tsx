import type { ReactNode } from 'react';

export function Mark({ className = 'brand__mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <circle cx="8" cy="12" r="2.7" fill="currentColor" />
      <circle className="mark-dot-2" cx="13.4" cy="12" r="1.7" fill="currentColor" opacity="0.55" />
      <circle className="mark-dot-3" cx="18" cy="12" r="1.05" fill="#F18A68" />
    </svg>
  );
}

export function Wordmark({
  light = false,
  href = '#/',
  children,
}: {
  light?: boolean;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <a className={`brand${light ? ' brand--light' : ''}`} href={href} aria-label="Movolette, back to home">
      <Mark />
      <span>Movolette</span>
      {children}
    </a>
  );
}
