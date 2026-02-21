
import { useMemo } from 'react';
import { useInsightsQuery, useCalendarQuery } from './useQueries';
import { ContentType } from '../types';

export const useDashboardStats = () => {
  const { data: insights = [] } = useInsightsQuery();
  const { data: calendarMeetings = [] } = useCalendarQuery();

  const stats = useMemo(() => {
    const now = Date.now();
    // Exclude archived and deleted items from active stats
    const activeInsights = insights.filter(i => !i.is_archived && !i.deleted_at);
    
    const recent = activeInsights.filter(i => {
      const createdTime = new Date(i.created_at).getTime();
      return (now - createdTime) / (1000 * 60 * 60) < 48;
    });

    const typeCounts = recent.reduce((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantType = Object.entries(typeCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
    const topTopic = recent.flatMap(i => i.topics || []).sort((a,b) => 
      recent.filter(i => i.topics?.includes(b)).length - recent.filter(i => i.topics?.includes(a)).length
    )[0];

    const incompleteActionItems = activeInsights.flatMap(i => {
      const completedIndices = i.metadata?.completedActionIndices || [];
      return (i.action_items || []).filter((_: string, idx: number) => !completedIndices.includes(idx));
    });

    const totalBandwidthSeconds = activeInsights.reduce<number>((acc, i) => {
        const dur = i.metadata?.durationSeconds || (i.metadata?.readingTimeMinutes ? i.metadata.readingTimeMinutes * 60 : 0);
        return acc + dur;
    }, 0);
    
    const bandwidthMinutes = Math.ceil(totalBandwidthSeconds / 60);
    
    return {
      recentCount: recent.length,
      actionItemCount: incompleteActionItems.length,
      bandwidthMinutes,
      savedCount: activeInsights.filter(i => i.is_favorite).length,
      isHighVelocity: recent.length > 5,
      breakdown: dominantType === ContentType.MEETING ? 'Meeting Heavy' : (dominantType === ContentType.URL ? 'Web Research' : 'Mixed Signals'),
      context: topTopic ? `Focus: ${topTopic}` : 'Broad Intel'
    };
  }, [insights]);

  // Ensure recentInsights and activeTasks also respect the deleted_at flag
  const recentInsights = useMemo(() => 
    insights.filter(i => !i.is_archived && !i.deleted_at).slice(0, 10), 
  [insights]);
  
  const activeTasks = useMemo(() => {
    return insights
      .filter(i => !i.is_archived && !i.deleted_at && i.action_items?.length > 0)
      .flatMap(i => {
        const completedIndices = i.metadata?.completedActionIndices || [];
        return i.action_items
          .map((action: string, idx: number) => ({ 
            action, 
            title: i.title, 
            id: i.id, 
            idx, 
            isCompleted: completedIndices.includes(idx),
            insight: i
          }))
          .filter((task: any) => !task.isCompleted);
      })
      .slice(0, 6);
  }, [insights]);

  return {
    stats,
    recentInsights,
    activeTasks,
    allMeetings: calendarMeetings
  };
};
