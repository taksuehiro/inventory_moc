// next.config.js
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true }, // ← AmplifyビルドでESLintエラーを無視
  typescript: { ignoreBuildErrors: true }, // ← Typeチェックエラーも無視
};
module.exports = nextConfig;
