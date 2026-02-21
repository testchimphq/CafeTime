import { Coffee } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface LogoProps {
  size?: number;
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ size = 24, className, iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Coffee size={size} className="text-primary" />
      {!iconOnly && (
        <span className="text-xl font-semibold text-primary">{APP_NAME}</span>
      )}
    </div>
  );
}
