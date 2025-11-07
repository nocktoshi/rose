/**
 * SendPaperPlaneIcon
 */

interface IconProps {
  className?: string;
}

export function SendPaperPlaneIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.682286 6.74231C-0.228035 6.43728 -0.227221 5.14941 0.683484 4.84554L15.0466 0.0529811C15.8097 -0.201652 16.5459 0.503244 16.3245 1.27669L12.1665 15.8069C11.9098 16.7041 10.673 16.7918 10.2922 15.9399L8.02397 10.8654C7.87575 10.5338 7.91899 10.1479 8.13692 9.85734L9.0263 8.6715C9.72014 7.74639 8.55142 6.57766 7.6263 7.2715L6.38962 8.19901C6.12666 8.39623 5.78358 8.45163 5.47191 8.3472L0.682286 6.74231Z"
        fill="currentColor"
      />
    </svg>
  );
}
