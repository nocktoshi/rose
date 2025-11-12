/**
 * SentArrowIcon
 */

import ArrowUpIcon from '../../assets/arrow-up-icon.svg';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SentArrowIcon({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}
    >
      <img src={ArrowUpIcon} alt="" style={{ width: '68%', height: '68%' }} />
    </div>
  );
}
