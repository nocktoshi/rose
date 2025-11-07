/**
 * ReceiveCircleIcon
 */

interface IconProps {
  className?: string;
}

export function ReceiveCircleIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM10 5.8252C9.53884 5.8252 9.16504 6.199 9.16504 6.66016V11.3232L7.25098 9.40918C6.92489 9.08309 6.39542 9.08309 6.06934 9.40918C5.74325 9.73527 5.74325 10.2647 6.06934 10.5908L9.40918 13.9307C9.73527 14.2568 10.2647 14.2568 10.5908 13.9307L13.9307 10.5908C14.2568 10.2647 14.2568 9.73527 13.9307 9.40918C13.6046 9.08309 13.0751 9.08309 12.749 9.40918L10.835 11.3232V6.66016C10.835 6.199 10.4612 5.8252 10 5.8252Z"
        fill="currentColor"
      />
    </svg>
  );
}
