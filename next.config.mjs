/** @type {import('next').NextConfig} */
import nextI18nextConfig from './next-i18next.config.js';

const nextConfig = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  reactStrictMode: true,
  i18n: nextI18nextConfig.i18n,
};

export default nextConfig;
