/**
 * ReceiveArrowIcon
 */

import ArrowDownIcon from '../../assets/arrow-down-icon.svg';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export function ReceiveArrowIcon({ className = 'w-4 h-4', style }: IconProps) {
  return <img src={ArrowDownIcon} alt="" className={className} style={style} />;
}
