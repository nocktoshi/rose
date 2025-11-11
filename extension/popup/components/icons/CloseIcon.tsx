/**
 * CloseIcon - Close/X icon
 */

interface IconProps {
  className?: string;
}

export function CloseIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        d="M14.4141 3L9.41406 8L14.4141 13L13 14.4141L8 9.41406L3 14.4141L1.58594 13L6.58594 8L1.58594 3L3 1.58594L8 6.58594L13 1.58594L14.4141 3Z"
        fill="currentColor"
      />
    </svg>
  );
}
