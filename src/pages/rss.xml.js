import rss from '@astrojs/rss';
import { site } from '../config/site';
import { getSortedPosts } from '../utils/posts';

export async function GET(context) {
  const posts = await getSortedPosts();

  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    trailingSlash: true,
    customData: '<language>sr-RS</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
  });
}
