import type { CategoryContentItem, ContentEntry } from './content';
import { createContentManager } from './content';

const manager = createContentManager('plans', '/plans');

export const getAllPlans = manager.getAllContent;
export const getPlanById = manager.getContentById;
export const getPlanByParams = manager.getContentByParams;

export type PlanEntry = ContentEntry;
export type CategoryPlanItem = CategoryContentItem;
export interface CategoryWithPlans {
  id: string;
  label: string;
  position: number;
  plans: CategoryContentItem[];
}

// 包裝 getNavigation 以使用 plans 屬性
export function getNavigation(): CategoryWithPlans[] {
  return manager.getNavigation().map((cat) => ({
    ...cat,
    plans: cat.items,
  }));
}
