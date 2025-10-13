import type { MarkdownInstance } from 'astro';

interface NoteFrontmatter {
  title: string;
  description?: string;
  date?: string | Date;
  keywords?: string[];
  tags?: string[];
  slug?: string;
}

interface CategoryMeta {
  label: string;
  position?: number;
}

interface NoteEntry {
  id: string;
  category: string;
  segments: string[];
  slug: string;
  url: string;
  frontmatter: {
    title: string;
    description?: string;
    date?: Date;
    keywords?: string[];
    tags?: string[];
  };
  Content: MarkdownInstance<NoteFrontmatter>['Content'];
  getHeadings: MarkdownInstance<NoteFrontmatter>['getHeadings'];
}

interface CategoryNoteItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  date?: Date;
  tags: string[];
}

interface CategoryWithNotes {
  id: string;
  label: string;
  position: number;
  notes: CategoryNoteItem[];
}

const markdownModules = import.meta.glob<MarkdownInstance<NoteFrontmatter>>('../../docs/notes/**/*.md', {
  eager: true,
});

const categoryModules = import.meta.glob<CategoryMeta>('../../docs/notes/**/_category_.json', {
  eager: true,
  import: 'default',
});

const notes: NoteEntry[] = [];
const noteMap = new Map<string, NoteEntry>();

const normalizePath = (path: string): string => path.replace(/\\/g, '/');

for (const [path, mod] of Object.entries(markdownModules)) {
  const normalizedPath = normalizePath(path);
  const relativePath = normalizedPath.split('/docs/notes/')[1];
  if (!relativePath) {
    continue;
  }

  const segments = relativePath.split('/');
  const fileName = segments.pop();

  if (!fileName) {
    continue;
  }

  const category = segments[0];

  if (!category) {
    continue;
  }

  const fileSlug = fileName.replace(/\.md$/, '');
  const slug = mod.frontmatter.slug ?? fileSlug;
  const relativeSegments = [...segments.slice(1), slug];
  const idSegments = [category, ...relativeSegments];
  const id = idSegments.join('/');
  const url = `/notes/${id}`;

  const rawDate = mod.frontmatter.date;
  let date: Date | undefined;

  if (rawDate) {
    const parsedDate = new Date(rawDate);
    if (!Number.isNaN(parsedDate.getTime())) {
      date = parsedDate;
    }
  }

  const entry: NoteEntry = {
    id,
    category,
    segments: idSegments,
    slug,
    url,
    frontmatter: {
      title: mod.frontmatter.title,
      description: mod.frontmatter.description,
      date,
      keywords: mod.frontmatter.keywords,
      tags: mod.frontmatter.tags,
    },
    Content: mod.Content,
    getHeadings: mod.getHeadings,
  };

  notes.push(entry);
  noteMap.set(id, entry);
}

const categoryMetaMap = new Map<string, CategoryMeta>();

for (const [path, meta] of Object.entries(categoryModules)) {
  const normalizedPath = normalizePath(path);
  const relativePath = normalizedPath.split('/docs/notes/')[1];
  if (!relativePath) {
    continue;
  }

  const category = relativePath.split('/')[0];

  if (!category) {
    continue;
  }

  categoryMetaMap.set(category, meta);
}

const groupedCategories = new Map<string, CategoryWithNotes>();

for (const note of notes) {
  const meta = categoryMetaMap.get(note.category);
  const existing = groupedCategories.get(note.category);

  const categoryData: CategoryWithNotes = existing ?? {
    id: note.category,
    label: meta?.label ?? note.category,
    position: meta?.position ?? Number.MAX_SAFE_INTEGER,
    notes: [],
  };

  categoryData.notes.push({
    id: note.id,
    title: note.frontmatter.title,
    description: note.frontmatter.description,
    url: note.url,
    date: note.frontmatter.date,
    tags: note.frontmatter.tags ?? [],
  });

  groupedCategories.set(note.category, categoryData);
}

for (const category of groupedCategories.values()) {
  category.notes.sort((a, b) => {
    if (a.date && b.date) {
      return b.date.getTime() - a.date.getTime();
    }

    if (a.date) {
      return -1;
    }

    if (b.date) {
      return 1;
    }

    return a.title.localeCompare(b.title, 'zh-TW');
  });
}

const orderedCategories = Array.from(groupedCategories.values()).sort((a, b) => {
  if (a.position === b.position) {
    return a.label.localeCompare(b.label, 'zh-TW');
  }

  return a.position - b.position;
});

export function getAllNotes(): NoteEntry[] {
  return notes;
}

export function getNoteById(id: string): NoteEntry | undefined {
  return noteMap.get(id);
}

export function getNoteByParams(category: string, ...segments: string[]): NoteEntry | undefined {
  const id = [category, ...segments].join('/');
  return noteMap.get(id);
}

export function getNavigation(): CategoryWithNotes[] {
  return orderedCategories;
}

export type { CategoryNoteItem, CategoryWithNotes, NoteEntry };
