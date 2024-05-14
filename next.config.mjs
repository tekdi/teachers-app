/** @type {import('next').NextConfig} */
import nextI18nextConfig from './next-i18next.config.js';

const nextConfig = {
  reactStrictMode: true,
  i18n: nextI18nextConfig.i18n
};

export default nextConfig;
