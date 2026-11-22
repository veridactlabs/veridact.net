// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { sidebar as sidebarConfig } from './docs.config.mjs';

// Page slugs in docs.config.mjs are relative to /docs/.
const prefix = (item) => (typeof item === 'string' ? `docs/${item}` : item.items ? { ...item, items: item.items.map(prefix) } : item);
const sidebar = sidebarConfig.map(prefix);
import remarkMermaid from './src/plugins/remark-mermaid.mjs';
import rehypeBcp14 from './src/plugins/rehype-bcp14.mjs';

export default defineConfig({
  site: 'https://veridact.net',
  trailingSlash: 'ignore',
  redirects: { '/docs': '/docs/introduction/' },
  markdown: {
    remarkPlugins: [remarkMermaid],
    rehypePlugins: [rehypeBcp14],
  },
  integrations: [
    starlight({
      title: 'Veridact docs',
      description: 'Open specifications for AI agent identity (Veridact) and agent access to accounts (Veridact Valet).',
      logo: { src: './src/assets/mark.svg', alt: '' },
      favicon: '/docs-favicon.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/veridactlabs' },
        { icon: 'email', label: 'Email', href: 'mailto:hello@veridact.net' },
      ],
      sidebar,
      customCss: ['./src/styles/docs.css'],
      components: { PageTitle: './src/components/PageTitle.astro' },
      lastUpdated: false,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      expressiveCode: { themes: ['github-light', 'github-dark'], styleOverrides: { borderRadius: '6px' } },
    }),
  ],
});
