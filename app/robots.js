// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap:'https://syedcode.netlify.app/sitemap.xml', // Replace with your actual live URL
  }
}