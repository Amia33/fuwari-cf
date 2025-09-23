import type {
  ExpressiveCodeConfig,
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
  title: "Amia33 Workshop",
  subtitle: "ボクのまま描く明日",
  lang: "ja", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
  themeColor: {
    hue: 317, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: true, // Hide the theme color picker for visitors
  },
  banner: {
    enable: true,
    src: "https://object.amia.work/images/banner.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
    credit: {
      enable: true, // Display the credit text of the banner image
      text: 'プロセカ 176th イベント "ほどけぬ明日に手を伸ばして"', // Credit text to be displayed
      url: "https://pjsekai.sega.jp", // (Optional) URL link to the original artwork or artist's page
    },
  },
  toc: {
    enable: true, // Display the table of contents on the right side of the post
    depth: 3, // Maximum heading depth to show in the table, from 1 to 3
  },
  favicon: [
    // Leave this array empty to use the default favicon
    {
      src: "/favicon.ico", // Path of the favicon, relative to the /public directory
      //   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
      //   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
    },
  ],
};

export const navBarConfig: NavBarConfig = {
  links: [LinkPreset.Home, LinkPreset.Archive, LinkPreset.About],
};

export const profileConfig: ProfileConfig = {
  avatar: "https://object.amia.work/images/avatar.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  name: "Amia",
  bio: "ずっと……本当に、ありがとう",
  links: [
    {
      name: "Cloudflare",
      icon: "fa6-solid:cloud", // Visit https://icones.js.org/ for icon codes
      // You will need to install the corresponding icon set if it's not already included
      // `pnpm add @iconify-json/<icon-set-name>`
      url: "https://www.cloudflare.com",
    },
    {
      name: "RSS",
      icon: "fa6-solid:rss",
      url: "https://amia.work/rss.xml",
    },
    {
      name: "Sitemap",
      icon: "fa6-solid:sitemap",
      url: "https://amia.work/sitemap-index.xml",
    },
  ],
};

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: "表示 - 非営利 - 継承 4.0 国際",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ja",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
  // Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
  // Please select a dark theme, as this blog theme currently only supports dark background color
  theme: "github-dark",
};
