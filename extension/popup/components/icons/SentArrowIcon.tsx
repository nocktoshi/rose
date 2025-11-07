/**
 * SentArrowIcon
 */

import ArrowUpIcon from '../../assets/arrow-up-icon.svg';

interface IconProps {
  className?: string;
}

export function SentArrowIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <img src={ArrowUpIcon} alt="" style={{ width: '68%', height: '68%' }} />
    </div>
  );
}
