import type { FamilyId } from '../../lib/motion/types';

export function FamilyGlyph({ family }: { family: FamilyId }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (family) {
    case 'buttons':
      return (
        <svg {...common}>
          <rect x="1.5" y="4.5" width="13" height="7" rx="2" />
          <path d="M4.5 8h3" />
        </svg>
      );
    case 'text':
      return (
        <svg {...common}>
          <path d="M2.5 4h11M2.5 8h8M2.5 12h10" />
        </svg>
      );
    case 'toasts':
      return (
        <svg {...common}>
          <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
          <path d="M4.5 6.5h5M4.5 9h3" />
        </svg>
      );
    case 'modals':
      return (
        <svg {...common}>
          <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
          <rect x="4.5" y="5.5" width="7" height="5" rx="1" />
        </svg>
      );
    case 'cards':
      return (
        <svg {...common}>
          <rect x="1.5" y="3" width="8" height="10" rx="1.2" />
          <path d="M12 3h2.5v6H12" />
        </svg>
      );
    case 'toggles':
      return (
        <svg {...common}>
          <rect x="1.5" y="5" width="13" height="6" rx="3" />
          <circle cx="10.5" cy="8" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'loading':
      return (
        <svg {...common}>
          <path d="M13 8a5 5 0 1 1-1.6-3.7" />
          <path d="M13 2.5V6h-3.5" />
        </svg>
      );
    case 'heroes':
    default:
      return (
        <svg {...common}>
          <rect x="1.5" y="2.5" width="13" height="11" rx="1.3" />
          <path d="M4.5 6h4M4.5 9h7M4.5 11.5h5" />
        </svg>
      );
  }
}
