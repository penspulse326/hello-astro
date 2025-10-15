import type { MarkdownInstance } from 'astro';

interface PostFrontmatter {
  title: string;
  description?: string;
  date?: string | Date;
  keywords?: string[];
  tags?: string[];
  slug?: string;
}

export interface PostEntry {
  id: string;
  slug: string;
  url: string;
  frontmatter: {
    title: string;
    description?: string;
    date?: Date;
    keywords?: string[];
    tags?: string[];
  };
  Content: MarkdownInstance<PostFrontmatter>['Content'];
  getHeadings: MarkdownInstance<PostFrontmatter>['getHeadings'];
}

export interface CategoryPostItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  date?: Date;
  tags: string[];
}

// 載入所有文章
const markdownModules = import.meta.glob<MarkdownInstance<PostFrontmatter>>('../../docs/posts/*.md', {
  eager: true,
});

const posts: PostEntry[] = [];

for (const [path, mod] of Object.entries(markdownModules)) {
  const fileName = path.split('/').pop();
  if (!fileName) continue;

  const fileSlug = fileName.replace(/\.md$/, '');
  const slug = mod.frontmatter.slug ?? fileSlug;
  const id = slug;
  const url = `/posts/${slug}`;

  const rawDate = mod.frontmatter.date;
  let date: Date | undefined;

  if (rawDate) {
    const parsedDate = new Date(rawDate);
    if (!Number.isNaN(parsedDate.getTime())) {
      date = parsedDate;
    }
  }

  const entry: PostEntry = {
    id,
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

  posts.push(entry);
}

export const getAllPosts = (): PostEntry[] => posts;
export const getPostById = (id: string): PostEntry | undefined => posts.find((p) => p.id === id);

/**
 * 取得所有文章，按日期由新到舊排序
 */
export function getPostsSortedByDate(): PostEntry[] {
  const posts = getAllPosts();
  return posts.sort((a, b) => {
    if (a.frontmatter.date && b.frontmatter.date) {
      return b.frontmatter.date.getTime() - a.frontmatter.date.getTime();
    }
    if (a.frontmatter.date) return -1;
    if (b.frontmatter.date) return 1;
    return 0;
  });
}

/**
 * 取得最近的 N 篇文章
 */
export function getRecentPosts(limit: number = 5): CategoryPostItem[] {
  const posts = getPostsSortedByDate();
  return posts.slice(0, limit).map((post) => ({
    id: post.id,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    url: post.url,
    date: post.frontmatter.date,
    tags: post.frontmatter.tags ?? [],
  }));
}

/**
 * 取得所有標籤及其文章數量
 */
export function getAllTags(): Map<string, number> {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    const tags = post.frontmatter.tags ?? [];
    for (const tag of tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  return tagMap;
}

/**
 * 取得標籤雲資料（按文章數量排序）
 */
export function getTagCloud(): Array<{ tag: string; count: number }> {
  const tagMap = getAllTags();
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
