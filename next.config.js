/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), '@libsql/client', '@mastra/core']
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['punycode', '@mastra/core'],
  }
}

module.exports = nextConfig