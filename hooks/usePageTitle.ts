import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AppView } from '../types';

export const usePageTitle = () => {
  const { view, selectedInsight, activeCollectionFilterId, collections } = useAppStore();

  useEffect(() => {
    let title = 'Crispy Bacon | Professional Research';

    if (selectedInsight) {
      title = `${selectedInsight.title} | Bacon`;
    } else if (activeCollectionFilterId) {
        const col = collections.find(c => c.id === activeCollectionFilterId);
        if (col) title = `${col.name} | Vault`;
    } else {
      switch (view) {
        case AppView.DASHBOARD: title = 'Overview | Crispy Bacon'; break;
        case AppView.ALL: title = 'History | Crispy Bacon'; break;
        case AppView.FAVORITES: title = 'Pinned | Crispy Bacon'; break;
        case AppView.ARCHIVED: title = 'Archive | Crispy Bacon'; break;
        case AppView.TRASH: title = 'Trash | Crispy Bacon'; break;
        case AppView.SETTINGS: title = 'Settings | Crispy Bacon'; break;
        case AppView.HELP: title = 'Guide | Crispy Bacon'; break;
        case AppView.INSIGHT: title = 'Note Detail | Crispy Bacon'; break;
      }
    }

    document.title = title;
  }, [view, selectedInsight, activeCollectionFilterId, collections]);
};