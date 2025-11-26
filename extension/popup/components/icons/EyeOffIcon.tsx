import EyeOffIconSvg from '../../assets/eye-off-icon.svg';

/**
 * EyeOffIcon - Hide/conceal icon
 */

interface IconProps {
  className?: string;
}

export function EyeOffIcon({ className = 'w-4 h-4' }: IconProps) {
  return <img src={EyeOffIconSvg} alt="" className={className} />;
}
