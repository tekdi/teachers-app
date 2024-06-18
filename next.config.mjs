import nextI18nextConfig from './next-i18next.config.js';
import withPWA from 'next-pwa';

const nextConfig = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  reactStrictMode: true,
  i18n: nextI18nextConfig.i18n,
};

const pwaConfig = withPWA({
  dest: 'public'
});

export default pwaConfig(nextConfig);
