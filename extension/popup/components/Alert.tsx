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

const alertStyles: Record<AlertType, string> = {
  error: 'bg-red-900/20 border-red-500/50 text-red-300',
  success: 'bg-green-900/20 border-green-500/50 text-green-300',
  warning: 'bg-orange-900/20 border-orange-500/50 text-orange-300',
  info: 'bg-blue-900/20 border-blue-500/50 text-blue-300',
};

export function Alert({ type = 'info', children, className = '' }: AlertProps) {
  const typeStyles = alertStyles[type];
  const combinedClasses = `border rounded p-3 ${typeStyles} ${className}`;

  return (
    <div className={combinedClasses}>
      <p className="text-sm">{children}</p>
    </div>
  );
}
