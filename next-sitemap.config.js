/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://tumakuruconnect.com',
  generateRobotsTxt: true, // (optional)
  sitemapSize: 5000,
  exclude: ['/dashboard', '/user/*', '/login', '/register'], // Exclude private routes
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' ? 1.0 : config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
