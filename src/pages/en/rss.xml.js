import rss from '@astrojs/rss';
import { site } from '../../config/site';
import { getSortedPosts } from '../../utils/posts';

export async function GET(context) {
  const posts = await getSortedPosts('en');

  return rss({
    title: `${site.name} (English)`,
    description:
      'Home Assistant integrations and small open-source tools for hardware and services nobody else supports.',
    site: context.site ?? site.url,
    trailingSlash: true,
    customData: '<language>en</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/en/blog/${post.id}/`,
    })),
  });
}
