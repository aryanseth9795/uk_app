// src/data/categories.ts
import { Ionicons } from '@expo/vector-icons';

export type CategoryId = 'all' | 'skincare' | 'makeup' | 'perfume' | 'gifts' | 'jewellery';

export type Category = {
  id: CategoryId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const CATEGORIES: Category[] = [
  { id: 'all',      label: 'All',      icon: 'grid-outline' },
  { id: 'skincare', label: 'Skincare', icon: 'leaf-outline' },
  { id: 'makeup',   label: 'Makeup',   icon: 'color-palette-outline' },
  { id: 'perfume',  label: 'Perfume',  icon: 'rose-outline' },
  { id: 'gifts',    label: 'Gifts',    icon: 'gift-outline' },
  { id: 'jewellery', label: 'Jewellery', icon: 'gift-outline' },
];
