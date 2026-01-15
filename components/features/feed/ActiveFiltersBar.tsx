import React, { useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import RemovableFilterChip from '../../ui/RemovableFilterChip';

export const ActiveFiltersBar: React.FC = () => {
  const { 
    searchQuery, setSearchQuery,
    activeCollectionFilterId, setActiveCollectionFilterId,
    activeTagFilterIds,
    collections
  } = useAppStore();

  const activeCollectionName = useMemo(() => {
    if (!activeCollectionFilterId) return null;
    return collections.find(c => c.id === activeCollectionFilterId)?.name;
  }, [activeCollectionFilterId, collections]);

  const hasFilters = activeCollectionFilterId || searchQuery || activeTagFilterIds.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-3 animate-slide-up-lg">
      {activeCollectionName && (
        <RemovableFilterChip 
          label={`VAULT: ${activeCollectionName.toUpperCase()}`} 
          onRemove={() => setActiveCollectionFilterId(null)} 
        />
      )}
      {searchQuery && (
        <RemovableFilterChip 
          label={`FIND: ${searchQuery.toUpperCase()}`} 
          onRemove={() => setSearchQuery('')} 
        />
      )}
      {activeTagFilterIds.length > 0 && (
        <RemovableFilterChip 
          label={`${activeTagFilterIds.length} SIGNAL TAGS`} 
          onRemove={() => useAppStore.setState({ activeTagFilterIds: [] })} 
        />
      )}
    </div>
  );
};