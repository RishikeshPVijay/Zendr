import type { Peer } from '@zendr/protocol';
import type { IconType } from 'react-icons';
import { FaDesktop, FaMobileAlt, FaTabletAlt, FaWifi } from 'react-icons/fa';
import { GoUnlink } from 'react-icons/go';
import { LuTv } from 'react-icons/lu';
import { usePeerConnection, usePeerConnectionState } from '../providers/peer-connection/context';
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

const CONNECTION_STATE_TO_DISPLAY_TEXT: Partial<Record<RTCPeerConnectionState, string>> = {
  connecting: 'Connecting...',
  connected: 'Connected',
  failed: 'Failed to connect',
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, hideButton = false }) => {
  const { connect, disconnect } = usePeerConnection();
  const { name, deviceType, browser, os, id } = device;
  const connectionState = usePeerConnectionState(id);

  const Icon = deviceIconMap[deviceType];
  const iconClassName = cn('flex-1', {
    'text-primary h-4/7': deviceType === 'mobile',
    'text-success h-3/5': deviceType === 'tablet',
    'text-info h-5/9': deviceType === 'desktop',
    'text-warning h-4/6': deviceType === 'tv',
  });
  const iconContainerClassName = cn(
    'flex shrink-0 min-w-14 self-start items-center aspect-square rounded-md justify-center',
    {
      'bg-primary/10': deviceType === 'mobile',
      'bg-success/10': deviceType === 'tablet',
      'bg-info/10': deviceType === 'desktop',
      'bg-warning/10': deviceType === 'tv',
    },
  );

  let btnText = 'Connect';
  switch (connectionState) {
    case 'connected':
      btnText = 'Disconnect';
      break;
    case 'connecting': {
      btnText = connectionState;
      break;
    }
    case 'failed': {
      btnText = 'Reconnect';
      break;
    }
  }

  const cardClassName = cn({
    'border-success': connectionState === 'connected',
    'border-error': connectionState === 'failed',
    'border-info': connectionState === 'connecting',
  });

  const connectionStateClassName = cn('text-body', {
    'text-success': connectionState === 'connected',
    'text-error': connectionState === 'failed',
    'text-info': connectionState === 'connecting',
  });

  const displayText = connectionState
    ? (CONNECTION_STATE_TO_DISPLAY_TEXT[connectionState] ?? null)
    : null;

  return (
    <Card className={cardClassName}>
      <div className="text-text-primary text-body-large flex items-center justify-between">
        <div className="flex flex-1 gap-4">
          <div className={iconContainerClassName}>
            <Icon className={iconClassName} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">{name}</span>
            <span className="text-text-tertiary text-body">
              {os} • {browser}
            </span>
            <span className={connectionStateClassName}>{displayText}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!hideButton && (
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                if (connectionState === 'connected') {
                  console.log('calling disconnect');
                  disconnect(id);
                } else {
                  connect(id);
                }
              }}
            >
              {connectionState === 'connected' ? <GoUnlink /> : <FaWifi />}
              <span className="hidden lg:block">{btnText}</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
