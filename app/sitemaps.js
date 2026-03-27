// app/sitemap.js
export default async function sitemap() {
  return [
    {
      url: 'https://syedcode.netlify.app', // Replace with your actual live URL
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // If you have other pages (like /about or /contact), add them here:
    // {
    //   url: 'https://your-nextjs-domain.com/about',
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ]
}