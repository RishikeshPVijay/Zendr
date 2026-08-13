import type { Peer } from '@zendr/protocol';
import { useRef, type ChangeEventHandler } from 'react';
import type { IconType } from 'react-icons';
import { CgSpinner } from 'react-icons/cg';
import { FaDesktop, FaMobileAlt, FaTabletAlt, FaWifi } from 'react-icons/fa';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { LuTv } from 'react-icons/lu';
import { PiWarningCircleFill } from 'react-icons/pi';
import { usePeerConnection, usePeerConnectionState } from '../providers/peer-connection/context';
import { useTransfer } from '../providers/transfer/context';
import { cn } from '../utils';
import { Card } from './Card';

interface DeviceCardProps {
  device: Peer;
  pairable?: boolean;
}

const deviceIconMap: Record<Peer['deviceType'], IconType> = {
  mobile: FaMobileAlt,
  tablet: FaTabletAlt,
  tv: LuTv,
  desktop: FaDesktop,
};

const CONNECTION_STATE_TO_DISPLAY_TEXT: Partial<Record<RTCPeerConnectionState, string>> = {
  connecting: 'Connecting...',
  connected: 'Tap to send files',
  failed: 'Failed to connect',
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, pairable = true }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { connect } = usePeerConnection();
  const { name, deviceType, browser, os, id } = device;
  const connectionState = usePeerConnectionState(id);
  const { sendRequest } = useTransfer();

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

  const cardClassName = cn('cursor-pointer', {
    'border-success': connectionState === 'connected',
    'border-error': connectionState === 'failed',
    'border-info': connectionState === 'connecting',
  });

  const connectionStateColorClassName = cn('text-info', {
    'text-success': connectionState === 'connected',
    'text-error': connectionState === 'failed',
  });

  const connectionStateClassName = cn('text-body mt-0.5', connectionStateColorClassName);

  const connectionIconContainerClassName = cn(
    'flex items-center gap-2 text-3xl',
    connectionStateColorClassName,
  );

  const displayText = connectionState
    ? (CONNECTION_STATE_TO_DISPLAY_TEXT[connectionState] ?? null)
    : null;

  const handleCardClick = () => {
    if (connectionState === 'connected') {
      inputRef.current?.click();
    } else {
      connect(id);
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;

    if (!files || files.length === 0) {
      return;
    }

    sendRequest(id, files);
  };

  const renderConnectionStateIcon = () => {
    switch (connectionState) {
      case 'connected':
        return <IoIosCheckmarkCircle />;
      case 'connecting':
        return <CgSpinner className="animate-spin" />;
      case 'failed':
        return <PiWarningCircleFill />;
      default:
        return <FaWifi />;
    }
  };

  return (
    <>
      <Card
        role="button"
        className={cardClassName}
        onClick={pairable ? handleCardClick : undefined}
        tabIndex={0}
      >
        <div className="text-text-primary text-body-large flex items-center justify-between">
          <div className="flex flex-1 gap-4">
            <div className={iconContainerClassName}>
              <Icon className={iconClassName} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">{name}</span>
              <span className="text-text-tertiary text-body">
                {os} • {browser}
              </span>
              {pairable && (
                <span className={connectionStateClassName}>{displayText ?? 'Tap to connect'}</span>
              )}
            </div>
          </div>
          {pairable && (
            <div className={connectionIconContainerClassName}>{renderConnectionStateIcon()}</div>
          )}
        </div>
      </Card>

      {connectionState === 'connected' && (
        <form>
          <input
            ref={inputRef}
            hidden
            type="file"
            multiple
            name="files[]"
            onChange={handleInputChange}
          />
        </form>
      )}
    </>
  );
};
