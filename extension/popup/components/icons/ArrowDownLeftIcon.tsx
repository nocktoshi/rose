/**
 * ArrowDownLeftIcon - Incoming/received transaction icon
 */

interface IconProps {
  className?: string;
}

export function ArrowDownLeftIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 7L7 17M7 17H17M7 17V7"
      />
    </svg>
  );
}
