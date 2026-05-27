// @reviewed 2026-05-08
import {createMDX} from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@saasflare/ui'],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
