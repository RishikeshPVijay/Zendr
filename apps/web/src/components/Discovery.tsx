import { IoSearchCircleOutline } from 'react-icons/io5';
import { useDiscovery } from '../providers/discovery';
import { Card } from './Card';
import { DeviceCard } from './DeviceCard';

export const Discovery: React.FC = () => {
  const { peers, localPeer } = useDiscovery();

  const peersCount = peers.length;

  return (
    <div>
      <h1 className="text-h1 text-text-primary">Discover Devices</h1>
      <h3 className="text-h3 text-text-primary my-4">This device</h3>
      <DeviceCard hideButton device={localPeer} />
      <h3 className="text-h3 text-text-primary mt-6 mb-4">Nearby devices ({peersCount})</h3>
      <div className="flex flex-col gap-2">
        {peersCount > 0 ? (
          peers.map((peer) => <DeviceCard key={peer.id} device={peer} />)
        ) : (
          <Card>
            <div className="flex flex-col items-center py-10 text-center">
              <IoSearchCircleOutline className="text-text-tertiary mb-4 h-10 w-10" />

              <h4 className="text-text-primary text-body-large font-semibold">
                Looking for nearby devices…
              </h4>

              <p className="text-text-secondary text-body mt-2 max-w-sm">
                Devices on the same network will appear here automatically.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
