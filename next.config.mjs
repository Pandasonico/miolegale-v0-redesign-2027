/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Dev only: miolegale.it sends no CORS headers, so the preview's element screenshot
  // (design mode) can't load its images. Serving them same-origin avoids that.
  async rewrites() {
    if (process.env.NODE_ENV === 'production') return []
    return [{ source: '/wp-img/:path*', destination: 'https://miolegale.it/wp-content/uploads/:path*' }]
  },
}

export default nextConfig
