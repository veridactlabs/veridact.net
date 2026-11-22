// Which repository files become which pages on veridact.net/docs.
// The repositories stay the source of truth: edit the markdown there, and the site rebuilds from it.

export const repos = {
  veridact: {
    github: 'veridactlabs/veridact',
    ref: process.env.VERIDACT_REF || 'main',
    local: process.env.VERIDACT_LOCAL, // optional: build from a local checkout instead of cloning
  },
  valet: {
    github: 'veridactlabs/veridact-valet',
    ref: process.env.VALET_REF || 'main',
    local: process.env.VALET_LOCAL,
  },
};

// slug is the page path under /docs/. label is the sidebar label (defaults to the page title).
export const pages = [
  {
    repo: 'veridact', path: 'docs/specification.md', slug: 'veridact/spec',
    label: 'Specification', title: 'Veridact specification', bcp14: true,
    badge: { text: 'Draft 0.5', variant: 'caution' },
    banner: 'This is a <strong>draft</strong> (v0.5). It replaces v0.4 and may still change. The reference implementation is moving to it package by package.',
  },
  { repo: 'veridact', path: 'docs/proposals/0.5-sd-jwt-vc.md', slug: 'veridact/proposals/v0-5-sd-jwt-vc', label: '0.5: SD-JWT VC and known assistants' },
  { repo: 'veridact', path: 'docs/proposals/0.4-iiw42-proposals.md', slug: 'veridact/proposals/v0-4-iiw42', label: '0.4: IIW 42 proposals' },
  { repo: 'veridact', path: 'docs/proposals/0.3-issuer-gaps.md', slug: 'veridact/proposals/v0-3-issuer-gaps', label: '0.3: Issuer gaps' },
  { repo: 'veridact', path: 'docs/proposals/0.2-verifier-gaps.md', slug: 'veridact/proposals/v0-2-verifier-gaps', label: '0.2: Verifier gaps' },

  { repo: 'valet', path: 'README.md', slug: 'valet/overview', label: 'Overview', title: 'Veridact Valet', sections: { drop: ['Run it', 'Click through it', 'Configuration', 'Layout'] } },
  { repo: 'valet', path: 'docs/where-valet-fits.md', slug: 'valet/where-valet-fits', label: 'Where Valet fits' },
  { repo: 'valet', path: 'docs/valet-profile.md', slug: 'valet/profile', label: 'The Valet profile', bcp14: true },
  { repo: 'valet', path: 'docs/technical-design.md', slug: 'valet/technical-design', label: 'Technical design' },
  { repo: 'valet', path: 'docs/threat-model.md', slug: 'valet/threat-model', label: 'Threat model' },
  { repo: 'valet', path: 'docs/veridact-agent-identity.md', slug: 'valet/veridact-agent-identity', label: 'Veridact agent identity', badge: { text: 'Draft', variant: 'note' } },
  { repo: 'valet', path: 'docs/mcp-gateway-design.md', slug: 'valet/mcp-gateway', label: 'MCP gateway', badge: { text: 'Draft', variant: 'note' } },
  { repo: 'valet', path: 'docs/decision-service.md', slug: 'valet/decision-service', label: 'Decision service', badge: { text: 'Draft', variant: 'note' } },
  { repo: 'valet', path: 'docs/control-framework-mapping.md', slug: 'valet/control-framework-mapping', label: 'Control framework mapping' },
  { repo: 'valet', path: 'README.md', slug: 'guides/run-valet', label: 'Run the Valet proof of concept', title: 'Run the Valet proof of concept', sections: { keep: ['Run it', 'Click through it', 'Configuration', 'Layout'] } },
  { repo: 'valet', path: 'extensions/keycloak-valet/README.md', slug: 'guides/keycloak-extension', label: 'Keycloak extension' },
  { repo: 'valet', path: 'deploy/azure/README.md', slug: 'guides/deploy-valet-azure', label: 'Deploy Valet on an Azure VM' },
];

// Sidebar, in the order Poppy's docs use: introduction and changelog, then the specifications, then guides.
export const sidebar = [
  { label: 'Introduction', slug: 'docs/introduction' },
  { label: 'Changelog', slug: 'docs/changelog' },
  {
    label: 'Veridact',
    items: [
      'veridact/spec',
      { label: 'Proposals', collapsed: true, items: ['veridact/proposals/v0-5-sd-jwt-vc', 'veridact/proposals/v0-4-iiw42', 'veridact/proposals/v0-3-issuer-gaps', 'veridact/proposals/v0-2-verifier-gaps'] },
    ],
  },
  {
    label: 'Veridact Valet',
    items: ['valet/overview', 'valet/where-valet-fits', 'valet/profile', 'valet/technical-design', 'valet/threat-model', 'valet/veridact-agent-identity', 'valet/mcp-gateway', 'valet/decision-service', 'valet/control-framework-mapping'],
  },
  {
    label: 'Guides',
    items: [{ label: 'How Veridact and Valet fit together', slug: 'docs/guides/how-they-fit' }, 'guides/run-valet', 'guides/keycloak-extension', 'guides/deploy-valet-azure'],
  },
];
