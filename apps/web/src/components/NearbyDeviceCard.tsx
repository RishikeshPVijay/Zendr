import type { IconType } from 'react-icons';
import { FaDesktop, FaMobileAlt, FaTabletAlt, FaWifi } from 'react-icons/fa';
import { LuTv } from 'react-icons/lu';
import { cn } from '../utils';
import { Button } from './Button';
import { Card } from './Card';

interface NearbyDeviceCardProps {
  name: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'tv';
  ipAddress: string;
}

const deviceIconMap: Record<NearbyDeviceCardProps['deviceType'], IconType> = {
  mobile: FaMobileAlt,
  tablet: FaTabletAlt,
  tv: LuTv,
  desktop: FaDesktop,
};

export const NearbyDeviceCard: React.FC<NearbyDeviceCardProps> = ({
  name,
  deviceType,
  ipAddress,
}) => {
  const Icon = deviceIconMap[deviceType];
  const iconClassName = cn('flex-1', {
    'text-primary h-4/7': deviceType === 'mobile',
    'text-success h-3/5': deviceType === 'tablet',
    'text-info h-5/9': deviceType === 'desktop',
    'text-warning h-4/6': deviceType === 'tv',
  });
  const iconContainerClassName = cn('flex items-center aspect-square rounded-md justify-center', {
    'bg-primary/10': deviceType === 'mobile',
    'bg-success/10': deviceType === 'tablet',
    'bg-info/10': deviceType === 'desktop',
    'bg-warning/10': deviceType === 'tv',
  });

  return (
    <Card>
      <div className="text-text-primary text-body-large flex justify-between">
        <div className="flex gap-4">
          <div className={iconContainerClassName}>
            <Icon className={iconClassName} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold">{name}</span>
            <span className="text-text-tertiary text-body">{ipAddress}</span>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <FaWifi /> <span>Connect</span>
        </Button>
      </div>
    </Card>
  );
};
