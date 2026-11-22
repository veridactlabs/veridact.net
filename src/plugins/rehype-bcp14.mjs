// Marks BCP 14 requirement keywords (MUST, SHOULD, MAY…) on pages whose frontmatter sets `bcp14: true`.
import { visit, SKIP } from 'unist-util-visit';

const KEYWORDS = /\b(MUST NOT|SHALL NOT|SHOULD NOT|NOT RECOMMENDED|MUST|REQUIRED|SHALL|SHOULD|RECOMMENDED|MAY|OPTIONAL)\b/g;

export default function rehypeBcp14() {
  return (tree, file) => {
    if (!file.data?.astro?.frontmatter?.bcp14) return;
    visit(tree, (node, index, parent) => {
      if (node.type === 'element' && ['code', 'pre', 'h1', 'h2', 'h3', 'h4'].includes(node.tagName)) return SKIP;
      if (node.type !== 'text' || !parent || !KEYWORDS.test(node.value)) return;
      KEYWORDS.lastIndex = 0;
      const parts = [];
      let last = 0;
      for (const m of node.value.matchAll(KEYWORDS)) {
        if (m.index > last) parts.push({ type: 'text', value: node.value.slice(last, m.index) });
        parts.push({ type: 'element', tagName: 'span', properties: { className: ['bcp14'] }, children: [{ type: 'text', value: m[0] }] });
        last = m.index + m[0].length;
      }
      if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
      parent.children.splice(index, 1, ...parts);
      return [SKIP, index + parts.length];
    });
  };
}
