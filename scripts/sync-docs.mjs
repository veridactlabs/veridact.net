// Pulls the markdown named in docs.config.mjs from the Veridact repositories and writes it as Starlight pages.
// Run by `npm run build` (and `npm run dev`). Generated files are git-ignored.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, repos } from '../docs.config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cache = join(root, '.sources');
const contentOut = join(root, 'src/content/docs/docs');
const rawOut = join(root, 'public/docs');
const GENERATED = ['veridact', 'valet', 'guides/run-valet.md', 'guides/keycloak-extension.md', 'guides/deploy-valet-azure.md'];

// Names that must never appear on the public site:
// the build fails rather than publish them.
const FORBIDDEN = [/old\s+mutual/i, /standard\s+bank/i];

function checkout(name) {
  const r = repos[name];
  if (r.local) return r.local;
  const dir = join(cache, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(cache, { recursive: true });
  execFileSync('git', ['clone', '--quiet', '--depth', '1', '--branch', r.ref, `https://github.com/${r.github}.git`, dir], { stdio: 'inherit' });
  return dir;
}

function headCommit(dir) {
  try { return execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD']).toString().trim(); } catch { return 'local'; }
}

// Split markdown into the preamble and its level-2 sections, outside code fences.
function sections(md) {
  const lines = md.split('\n');
  const out = [{ heading: null, lines: [] }];
  let fence = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (!fence && /^## /.test(line)) out.push({ heading: line.replace(/^## /, '').trim(), lines: [] });
    out.at(-1).lines.push(line);
  }
  return out;
}

function pickSections(md, rule) {
  if (!rule) return md;
  const parts = sections(md);
  const keep = parts.filter((p, i) => {
    if (i === 0) return !rule.keep; // the preamble belongs to the "drop" variant only
    return rule.keep ? rule.keep.includes(p.heading) : !rule.drop.includes(p.heading);
  });
  return keep.map((p) => p.lines.join('\n')).join('\n');
}

function splitTitle(md) {
  const m = md.match(/^\s*# (.+)\n/);
  if (!m) return { h1: null, body: md };
  return { h1: m[1].trim(), body: md.slice(m[0].length) };
}

function firstParagraph(body) {
  for (const block of body.split(/\n\s*\n/)) {
    const t = block.trim();
    if (!t || /^[#>|`<-]|^\d+\./.test(t) || /^Version|^Status/.test(t)) continue;
    const plain = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ');
    return plain.length > 200 ? plain.slice(0, 197).replace(/\s+\S*$/, '') + '…' : plain;
  }
  return '';
}

// Map every source file we publish, so links between them stay on the site.
const published = new Map(); // "repo:path" -> slug
for (const p of pages) if (!published.has(`${p.repo}:${p.path}`)) published.set(`${p.repo}:${p.path}`, p.slug);
const githubToRepo = Object.fromEntries(Object.entries(repos).map(([k, r]) => [r.github.toLowerCase(), k]));

function rewriteLinks(md, page) {
  const repo = repos[page.repo];
  const baseDir = posix.dirname(page.path);
  const rewrite = (url) => {
    // Old personal-account URLs moved to the organisation.
    url = url.replace(/github\.com\/richard-craig\/(veridact(?:-valet)?)/gi, 'github.com/veridactlabs/$1');
    const gh = url.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/(?:blob|tree)\/[^/]+\/([^#?]+)(#.*)?$/i);
    if (gh && githubToRepo[gh[1].toLowerCase()]) {
      const slug = published.get(`${githubToRepo[gh[1].toLowerCase()]}:${gh[2]}`);
      if (slug) return `/docs/${slug}/${gh[3] || ''}`;
      return url;
    }
    if (url.startsWith('#') && page.sections) {
      // The anchor may be in the part of the same file that another page carries.
      const here = sections(rawSource.get(page)).filter((p) => p.heading).map((p) => slugify(p.heading));
      const sibling = pages.find((q) => q !== page && q.repo === page.repo && q.path === page.path);
      if (sibling && !here.includes(url.slice(1))) return `/docs/${sibling.slug}/${url}`;
      return url;
    }
    if (/^([a-z]+:|#|\/)/i.test(url)) return url;
    const [path, hash = ''] = url.split('#');
    const target = posix.normalize(posix.join(baseDir, path)).replace(/\/$/, '');
    const slug = published.get(`${page.repo}:${target}`);
    if (slug) return `/docs/${slug}/${hash ? '#' + hash : ''}`;
    const kind = /\.[a-z0-9]+$/i.test(target) ? 'blob' : 'tree';
    return `https://github.com/${repo.github}/${kind}/${repo.ref}/${target}${hash ? '#' + hash : ''}`;
  };
  let fence = false;
  return md.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return line; }
    if (fence) return line;
    return line.replace(/\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (_, url, t = '') => `](${rewrite(url)}${t})`);
  }).join('\n');
}

const slugify = (h) => h.toLowerCase().replace(/[`*_]/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s/g, '-');
const rawSource = new Map(); // page -> the markdown it keeps, for anchor checks

const yaml = (s) => JSON.stringify(s); // JSON strings are valid YAML scalars

for (const g of GENERATED) rmSync(join(contentOut, g), { recursive: true, force: true });
rmSync(rawOut, { recursive: true, force: true });

const dirs = {};
const problems = [];
for (const page of pages) {
  dirs[page.repo] ??= checkout(page.repo);
  const src = join(dirs[page.repo], page.path);
  if (!existsSync(src)) { problems.push(`missing source ${page.repo}:${page.path}`); continue; }
  let md = readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
  md = pickSections(md, page.sections);
  rawSource.set(page, md);
  const { h1, body: rawBody } = splitTitle(md);
  const title = page.title || h1 || page.label;
  // Old personal-account URLs moved to the organisation, code blocks included.
  const body = rewriteLinks(rawBody, page).replace(/github\.com\/richard-craig\/(veridact(?:-valet)?)/gi, 'github.com/veridactlabs/$1');
  for (const re of FORBIDDEN) if (re.test(body)) problems.push(`${page.repo}:${page.path} contains a name that must not be published (${re})`);

  const editUrl = `https://github.com/${repos[page.repo].github}/edit/${repos[page.repo].ref}/${page.path}`;
  const fm = [
    '---',
    `title: ${yaml(title)}`,
    `description: ${yaml(firstParagraph(body))}`,
    `editUrl: ${yaml(editUrl)}`,
    `sourceRepo: ${yaml(repos[page.repo].github)}`,
    `sourceCommit: ${yaml(headCommit(dirs[page.repo]))}`,
    page.bcp14 ? 'bcp14: true' : null,
    page.banner ? `banner:\n  content: ${yaml(page.banner)}` : null,
    `sidebar:\n  label: ${yaml(page.label)}${page.badge ? `\n  badge:\n    text: ${yaml(page.badge.text)}\n    variant: ${page.badge.variant}` : ''}`,
    '---',
    '',
  ].filter((l) => l !== null).join('\n');

  const out = join(contentOut, `${page.slug}.md`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, fm + body);

  // Plain markdown copy, for the "Copy page" button and for agents reading the docs.
  const raw = join(rawOut, `${page.slug}.md`);
  mkdirSync(dirname(raw), { recursive: true });
  writeFileSync(raw, `# ${title}\n\nSource: https://github.com/${repos[page.repo].github}/blob/${repos[page.repo].ref}/${page.path}\n\n${body.replace(/\]\(\/docs\//g, '](https://veridact.net/docs/')}`);
}

// Hand-written pages get a raw copy too.
for (const hand of ['introduction', 'changelog', 'guides/how-they-fit']) {
  const src = join(contentOut, `${hand}.md`);
  if (!existsSync(src)) continue;
  const text = readFileSync(src, 'utf8');
  const title = text.match(/^title:\s*"?(.+?)"?\s*$/m)?.[1] ?? hand;
  const body = text.replace(/^---[\s\S]*?---\n/, '');
  const raw = join(rawOut, `${hand}.md`);
  mkdirSync(dirname(raw), { recursive: true });
  writeFileSync(raw, `# ${title}\n\n${body.replace(/\]\(\/docs\//g, '](https://veridact.net/docs/')}`);
}

if (problems.length) {
  console.error('sync-docs failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log(`sync-docs: ${pages.length} pages from ${Object.keys(dirs).length} repositories`);
