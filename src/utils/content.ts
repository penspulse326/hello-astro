import type { MarkdownInstance } from 'astro';

interface ContentFrontmatter {
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

interface ContentEntry {
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
  Content: MarkdownInstance<ContentFrontmatter>['Content'];
  getHeadings: MarkdownInstance<ContentFrontmatter>['getHeadings'];
}

interface CategoryContentItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  date?: Date;
  tags: string[];
}

interface CategoryWithContent {
  id: string;
  label: string;
  position: number;
  items: CategoryContentItem[];
}

const normalizePath = (path: string): string => path.replace(/\\/g, '/');

/**
 * 創建內容管理器
 * @param contentPath - 內容目錄路徑，例如 'notes' 或 'plans'
 * @param urlPrefix - URL 前綴，例如 '/notes' 或 '/plans'
 */
export function createContentManager(contentPath: string, urlPrefix: string) {
  const markdownModules = import.meta.glob<MarkdownInstance<ContentFrontmatter>>('../../docs/**/*.md', {
    eager: true,
  });

  const categoryModules = import.meta.glob<CategoryMeta>('../../docs/**/_category_.json', {
    eager: true,
    import: 'default',
  });

  const contents: ContentEntry[] = [];
  const contentMap = new Map<string, ContentEntry>();

  // 處理 Markdown 文件
  for (const [path, mod] of Object.entries(markdownModules)) {
    const normalizedPath = normalizePath(path);
    const relativePath = normalizedPath.split(`/docs/${contentPath}/`)[1];
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
    const url = `${urlPrefix}/${id}`;

    const rawDate = mod.frontmatter.date;
    let date: Date | undefined;

    if (rawDate) {
      const parsedDate = new Date(rawDate);
      if (!Number.isNaN(parsedDate.getTime())) {
        date = parsedDate;
      }
    }

    const entry: ContentEntry = {
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

    contents.push(entry);
    contentMap.set(id, entry);
  }

  // 處理分類元數據
  const categoryMetaMap = new Map<string, CategoryMeta>();

  for (const [path, meta] of Object.entries(categoryModules)) {
    const normalizedPath = normalizePath(path);
    const relativePath = normalizedPath.split(`/docs/${contentPath}/`)[1];
    if (!relativePath) {
      continue;
    }

    const category = relativePath.split('/')[0];

    if (!category) {
      continue;
    }

    categoryMetaMap.set(category, meta);
  }

  // 分組和排序
  const groupedCategories = new Map<string, CategoryWithContent>();

  for (const content of contents) {
    const meta = categoryMetaMap.get(content.category);
    const existing = groupedCategories.get(content.category);

    const categoryData: CategoryWithContent = existing ?? {
      id: content.category,
      label: meta?.label ?? content.category,
      position: meta?.position ?? Number.MAX_SAFE_INTEGER,
      items: [],
    };

    categoryData.items.push({
      id: content.id,
      title: content.frontmatter.title,
      description: content.frontmatter.description,
      url: content.url,
      date: content.frontmatter.date,
      tags: content.frontmatter.tags ?? [],
    });

    groupedCategories.set(content.category, categoryData);
  }

  // 排序分類內的項目
  for (const category of groupedCategories.values()) {
    category.items.sort((a, b) => {
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

  return {
    getAllContent: (): ContentEntry[] => contents,
    getContentById: (id: string): ContentEntry | undefined => contentMap.get(id),
    getContentByParams: (category: string, ...segments: string[]): ContentEntry | undefined => {
      const id = [category, ...segments].join('/');
      return contentMap.get(id);
    },
    getNavigation: (): CategoryWithContent[] => orderedCategories,
  };
}

export type { CategoryContentItem, CategoryWithContent, ContentEntry };
