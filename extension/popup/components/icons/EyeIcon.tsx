import EyeOpenIconSvg from '../../assets/eye-open-icon.svg';

/**
 * EyeIcon - View/show icon
 */

interface IconProps {
  className?: string;
}

export function EyeIcon({ className = 'w-4 h-4' }: IconProps) {
  return <img src={EyeOpenIconSvg} alt="" className={className} />;
}
