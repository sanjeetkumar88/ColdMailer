import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://coldmailer.me';
  
  const routes = [
    '',
    '/features',
    '/pricing',
    '/security',
    '/integrations',
    '/customers',
    '/about',
    '/blog',
    '/login',
    '/signup'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/blog' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/blog' ? 0.9 : 0.8,
  }));
}
