// Refuses to build without the marketing site in public/, so a deploy can never replace veridact.net with docs alone.
import { existsSync } from 'node:fs';
if (!existsSync(new URL('../public/index.html', import.meta.url)) && process.env.ALLOW_NO_HOME !== '1') {
  console.error('public/index.html is missing. Copy the current veridact.net site into public/ (see README), or set ALLOW_NO_HOME=1 for a docs-only preview.');
  process.exit(1);
}
