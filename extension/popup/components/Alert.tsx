/**
 * Alert component - Displays inline notification messages
 */

import { ReactNode } from 'react';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  type?: AlertType;
  children: ReactNode;
  className?: string;
}

const alertStyles: Record<AlertType, { bg: string; text: string }> = {
  error: {
    bg: 'var(--color-red-light)',
    text: 'var(--color-red)',
  },
  success: {
    bg: 'var(--color-green-light)',
    text: 'var(--color-green)',
  },
  warning: {
    bg: 'var(--color-orange-light)',
    text: 'var(--color-orange)',
  },
  info: {
    bg: 'var(--color-blue-light)',
    text: 'var(--color-blue)',
  },
};

export function Alert({ type = 'info', children, className = '' }: AlertProps) {
  const styles = alertStyles[type];

  return (
    <div
      className={`rounded-lg px-3 py-2.5 ${className}`}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
      }}
    >
      <p className="text-sm font-medium leading-[18px] tracking-[0.14px]">{children}</p>
    </div>
  );
}
