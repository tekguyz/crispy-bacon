
import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { useAppStore } from '../store/useAppStore';
import { AppView } from '../types';

export const useFilteredInsights = () => {
  const {
    insights,
    view,
    searchQuery,
    activeSourceTypeFilter,
    activeCollectionFilterId,
    activeTagFilterIds,
    activeDomainFilter,
    startDateFilter,
    endDateFilter,
    sortOrder
  } = useAppStore();

  return useMemo(() => {
    let data = insights;

    // View Filtering - Synchronized with new DB Schema
    if (view === AppView.TRASH) {
      data = data.filter(i => !!i.deleted_at);
    } else if (view === AppView.ARCHIVED) {
      data = data.filter(i => i.is_archived && !i.deleted_at);
    } else if (view === AppView.FAVORITES) {
      data = data.filter(i => i.is_favorite && !i.is_archived && !i.deleted_at);
    } else if (view === AppView.ALL || view === AppView.DASHBOARD) {
      data = data.filter(i => !i.is_archived && !i.deleted_at);
    } else if (view === AppView.SETTINGS) {
        return []; 
    }

    // Type Filter
    if (activeSourceTypeFilter !== 'all') {
      data = data.filter(i => i.type === activeSourceTypeFilter);
    }

    // Collection Filter
    if (activeCollectionFilterId) {
      data = data.filter(i => i.collections?.some(c => c.id === activeCollectionFilterId));
    }

    // Tag Filter
    if (activeTagFilterIds.length > 0) {
      data = data.filter(i => activeTagFilterIds.every(filterTagId => 
        i.tags?.some(tag => tag.id === filterTagId)
      ));
    }

    // Domain Filter
    if (activeDomainFilter) {
      const domainQuery = activeDomainFilter.toLowerCase();
      data = data.filter(i => i.site_name?.toLowerCase().includes(domainQuery) || i.original_content?.toLowerCase().includes(domainQuery));
    }

    // Date Filters
    if (startDateFilter) {
      const start = new Date(startDateFilter).setHours(0, 0, 0, 0);
      data = data.filter(i => new Date(i.created_at).getTime() >= start);
    }
    if (endDateFilter) {
      const end = new Date(endDateFilter).setHours(23, 59, 59, 999);
      data = data.filter(i => new Date(i.created_at).getTime() <= end);
    }

    // Advanced Search - Optimized for high-signal retrieval
    if (searchQuery) {
      // Map data for Fuse to handle tags and collections as flat strings
      const fuseData = data.map(item => ({
        ...item,
        tags_flat: item.tags?.map(t => t.name).join(' ') || '',
        collections_flat: item.collections?.map(c => c.name).join(' ') || ''
      }));

      const fuseOptions = {
        keys: [
          { name: 'title', weight: 1.4 },        // Highest priority
          { name: 'tags_flat', weight: 1.2 },    // Tactical priority
          { name: 'collections_flat', weight: 1.0 },
          { name: 'summary', weight: 0.8 },
          { name: 'topics', weight: 0.7 },
          { name: 'processed_text', weight: 0.4 }, // Deep search
          { name: 'site_name', weight: 0.3 },
        ],
        threshold: 0.35,                         // Standard clarity
        ignoreLocation: true,
      };
      
      const fuse = new Fuse(fuseData, fuseOptions);
      data = fuse.search(searchQuery).map(result => result.item);
    }

    // Sort
    return [...data].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortOrder === 'updated') {
        const dateA = new Date(a.metadata?.originalDate || a.created_at).getTime(); 
        const dateB = new Date(b.metadata?.originalDate || b.created_at).getTime(); 
        return dateB - dateA; 
      }
      return 0;
    });
  }, [
    insights, view, searchQuery, activeSourceTypeFilter,
    activeCollectionFilterId, activeTagFilterIds, sortOrder,
    activeDomainFilter, startDateFilter, endDateFilter
  ]);
};
