import { useEffect } from 'react';
import { useInsightsQuery, useCollectionsQuery, useTagsQuery } from '../hooks/useQueries';
import { useAppStore } from '../store/useAppStore';

/**
 * DataSynchronizer
 * Bridges the gap between TanStack Query (Server State) and Zustand (Client Store).
 * This allows us to adopt React Query without refactoring the entire codebase.
 */
export const DataSynchronizer = () => {
  const { data: insights, isLoading: isInsightsLoading } = useInsightsQuery();
  const { data: collections } = useCollectionsQuery();
  const { data: tags } = useTagsQuery();

  // Sync Insights
  useEffect(() => {
    // We only update if data is present to avoid clearing the store on mount before fetch
    if (insights) {
        useAppStore.setState({ 
            insights, 
            monthlyUsageCount: insights.length, // Simple count for now
            isInitialLoading: false 
        });
    } else if (isInsightsLoading) {
        useAppStore.setState({ isInitialLoading: true });
    }
  }, [insights, isInsightsLoading]);

  // Sync Collections
  useEffect(() => {
    if (collections) {
        useAppStore.setState({ collections });
    }
  }, [collections]);

  // Sync Tags
  useEffect(() => {
    if (tags) {
        useAppStore.setState({ tags });
    }
  }, [tags]);

  return null;
};