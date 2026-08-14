import { useState } from 'react';
import { useResponsive } from '../hooks';
import { useTransfer } from '../providers/transfer/context';
import { Discovery } from './Discovery';
import { Header } from './Header';
import { MobileNavigationTab } from './MobileNavigationTab';
import { SectionWrapper } from './SectionWrapper';
import { Transfers } from './Transfers';

type Tab = 'discover' | 'transfer';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const { minMd } = useResponsive();
  const { transfers } = useTransfer();

  const pendingTransfers = transfers.filter(
    (transfer) => transfer.direction === 'incoming' && transfer.state === 'pending',
  ).length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Header />
      <SectionWrapper
        sectionClassName="flex flex-1 min-h-0"
        className="flex min-h-0 flex-1 gap-10 p-5"
      >
        {(minMd || activeTab === 'discover') && (
          <div className="min-h-0 flex-1">
            <Discovery />
          </div>
        )}
        {(minMd || activeTab === 'transfer') && (
          <>
            {minMd && <div className="bg-border-hover w-px" />}
            <div className="min-h-0 flex-1">
              <Transfers />
            </div>
          </>
        )}
      </SectionWrapper>
      {!minMd && (
        <MobileNavigationTab
          activeTab={activeTab}
          transferCount={pendingTransfers}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};
