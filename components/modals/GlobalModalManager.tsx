
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import CollectionManagementModal from './CollectionManagementModal';
import TagManagementModal from './TagManagementModal';
import ShareModal from './ShareModal';
import UpgradeModal from './UpgradeModal';
import ConfirmationModal from './ConfirmationModal';
import OnboardingModal from './OnboardingModal';

export const GlobalModalManager: React.FC = () => {
  const store = useAppStore();

  return (
    <>
      <ConfirmationModal />
      <OnboardingModal />
      <UpgradeModal />
      {store.showCollectionManagementModal && <CollectionManagementModal />}
      {store.showTagManagementModal && <TagManagementModal />}
      {store.showShareModal && <ShareModal />}
    </>
  );
};
