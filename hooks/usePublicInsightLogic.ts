
import { useAppStore } from '../store/useAppStore';

export const usePublicInsightLogic = () => {
  const { publicSharedInsight: insight } = useAppStore();

  return {
    insight
  };
};
