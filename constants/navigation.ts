
import { Home, History, Star, Archive, Trash2 } from 'lucide-react';
import { AppView } from '../types';

export const PRIMARY_NAV_ITEMS = [
  { id: AppView.DASHBOARD, label: 'Home', icon: Home },
  { id: AppView.ALL, label: 'History', icon: History },
  { id: AppView.FAVORITES, label: 'Pinned', icon: Star },
  { id: AppView.ARCHIVED, label: 'Archive', icon: Archive },
  { id: AppView.TRASH, label: 'Trash', icon: Trash2 },
];
