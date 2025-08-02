/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {

      images: {
    domains: ['campus-connect-nine-zeta.vercel.app', "images.ctfassets.net", 'localhost'],
  },
};

export default config;
