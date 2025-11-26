/**
 * ArrowUpRightIcon - Simple diagonal arrow pointing up-right
 */

interface IconProps {
  className?: string;
}

export function ArrowUpRightIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 11 11"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.16667 10.8333L9.16667 2.83333L9.16667 10L10.8333 10V0H0.833333L0.833334 1.66667H8L0 9.66667L1.16667 10.8333Z" />
    </svg>
  );
}
