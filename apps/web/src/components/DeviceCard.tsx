import type { Peer } from '@zendr/protocol';
import type { IconType } from 'react-icons';
import { FaDesktop, FaMobileAlt, FaTabletAlt, FaWifi } from 'react-icons/fa';
import { LuTv } from 'react-icons/lu';
import { cn } from '../utils';
import { Button } from './Button';
import { Card } from './Card';

interface DeviceCardProps {
  device: Peer;
  hideButton?: boolean;
}

const deviceIconMap: Record<Peer['deviceType'], IconType> = {
  mobile: FaMobileAlt,
  tablet: FaTabletAlt,
  tv: LuTv,
  desktop: FaDesktop,
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, hideButton = false }) => {
  const { name, deviceType, browser, os } = device;

  const Icon = deviceIconMap[deviceType];
  const iconClassName = cn('flex-1', {
    'text-primary h-4/7': deviceType === 'mobile',
    'text-success h-3/5': deviceType === 'tablet',
    'text-info h-5/9': deviceType === 'desktop',
    'text-warning h-4/6': deviceType === 'tv',
  });
  const iconContainerClassName = cn(
    'flex shrink-0 min-w-12 items-center aspect-square rounded-md justify-center',
    {
      'bg-primary/10': deviceType === 'mobile',
      'bg-success/10': deviceType === 'tablet',
      'bg-info/10': deviceType === 'desktop',
      'bg-warning/10': deviceType === 'tv',
    },
  );

  return (
    <Card>
      <div className="text-text-primary text-body-large flex items-center justify-between">
        <div className="flex flex-1 gap-4">
          <div className={iconContainerClassName}>
            <Icon className={iconClassName} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold">{name}</span>
            <span className="text-text-tertiary text-body">
              {os} • {browser}
            </span>
          </div>
        </div>
        {!hideButton && (
          <Button className="flex items-center gap-2">
            <FaWifi /> <span className="hidden lg:block">Connect</span>
          </Button>
        )}
      </div>
    </Card>
  );
};
