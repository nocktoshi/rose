import { useEffect, useState } from 'react';

// Import all wallet icon styles
import WalletStyle1 from '../assets/wallet-icon-style-1.svg';
import WalletStyle2 from '../assets/wallet-icon-style-2.svg';
import WalletStyle3 from '../assets/wallet-icon-style-3.svg';
import WalletStyle4 from '../assets/wallet-icon-style-4.svg';
import WalletStyle5 from '../assets/wallet-icon-style-5.svg';
import WalletStyle6 from '../assets/wallet-icon-style-6.svg';
import WalletStyle7 from '../assets/wallet-icon-style-7.svg';
import WalletStyle8 from '../assets/wallet-icon-style-8.svg';
import WalletStyle9 from '../assets/wallet-icon-style-9.svg';
import WalletStyle10 from '../assets/wallet-icon-style-10.svg';
import WalletStyle11 from '../assets/wallet-icon-style-11.svg';
import WalletStyle12 from '../assets/wallet-icon-style-12.svg';
import WalletStyle13 from '../assets/wallet-icon-style-13.svg';
import WalletStyle14 from '../assets/wallet-icon-style-14.svg';
import WalletStyle15 from '../assets/wallet-icon-style-15.svg';

const iconStyles = [
  { id: 1, icon: WalletStyle1 },
  { id: 2, icon: WalletStyle2 },
  { id: 3, icon: WalletStyle3 },
  { id: 4, icon: WalletStyle4 },
  { id: 5, icon: WalletStyle5 },
  { id: 6, icon: WalletStyle6 },
  { id: 7, icon: WalletStyle7 },
  { id: 8, icon: WalletStyle8 },
  { id: 9, icon: WalletStyle9 },
  { id: 10, icon: WalletStyle10 },
  { id: 11, icon: WalletStyle11 },
  { id: 12, icon: WalletStyle12 },
  { id: 13, icon: WalletStyle13 },
  { id: 14, icon: WalletStyle14 },
  { id: 15, icon: WalletStyle15 },
];

interface AccountIconProps {
  /** Icon style ID (1-15) */
  styleId?: number;
  /** Icon color (hex string) */
  color?: string;
  /** CSS class names */
  className?: string;
}

/**
 * Displays an account icon with custom style and color
 * Fetches the SVG and applies the color dynamically
 */
export function AccountIcon({
  styleId = 1,
  color = '#5968fb',
  className = 'h-6 w-6',
}: AccountIconProps) {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const selectedIcon = iconStyles.find(s => s.id === styleId) || iconStyles[0];

    fetch(selectedIcon.icon)
      .then(res => res.text())
      .then(text => {
        // Replace CSS var `--fill-0` with the chosen color
        const modifiedSvg = text.replace(/var\(--fill-0,\s*#[A-Fa-f0-9]{6}\)/g, color);
        setSvgContent(modifiedSvg);
      })
      .catch(err => {
        console.error('Failed to load SVG:', err);
        // Fallback: just use the default without color
        setSvgContent(
          `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${color}"/></svg>`
        );
      });
  }, [styleId, color]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: svgContent }} />;
}
