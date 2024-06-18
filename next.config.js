/** @type {import('next').NextConfig} */
const nextI18nextConfig = require ('./next-i18next.config.js')

const nextConfig = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  reactStrictMode: true,
  i18n: nextI18nextConfig.i18n,

};

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports =  withPWA(nextConfig);
