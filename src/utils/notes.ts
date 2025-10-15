import type { CategoryContentItem, ContentEntry } from './content';
import { createContentManager } from './content';

const manager = createContentManager('notes', '/notes');

export const getAllNotes = manager.getAllContent;
export const getNoteById = manager.getContentById;
export const getNoteByParams = manager.getContentByParams;

// 為了向後兼容，保留舊的類型名稱
export type NoteEntry = ContentEntry;
export type CategoryNoteItem = CategoryContentItem;
export interface CategoryWithNotes {
  id: string;
  label: string;
  position: number;
  notes: CategoryContentItem[];
}

// 包裝 getNavigation 以符合舊的類型結構（使用 notes 而不是 items）
export function getNavigation(): CategoryWithNotes[] {
  return manager.getNavigation().map((cat) => ({
    ...cat,
    notes: cat.items,
  }));
}
