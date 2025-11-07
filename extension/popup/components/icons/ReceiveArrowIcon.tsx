/**
 * ReceiveArrowIcon
 */

import ArrowDownIcon from '../../assets/arrow-down-icon.svg';

interface IconProps {
  className?: string;
}

export function ReceiveArrowIcon({ className = 'w-4 h-4' }: IconProps) {
  return <img src={ArrowDownIcon} alt="" className={className} />;
}
