/**
 * ArrowUpRightIcon - Outgoing/sent transaction icon
 */

interface IconProps {
  className?: string;
}

export function ArrowUpRightIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
