import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pinegrove-map-media.nyc3.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'nyc3.digitaloceanspaces.com'
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/shows',
        destination: '/',
        permanent: false,
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4500kb'
    }
  }
}
  
  // Export the combined configuration for Next.js with PWA support
// export default withSerwist(withPayload(nextConfig));
  
export default withPayload(nextConfig);
