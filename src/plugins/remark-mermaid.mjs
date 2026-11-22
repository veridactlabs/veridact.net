// Turns ```mermaid fences into <pre class="mermaid"> so they render as diagrams, as they do on GitHub.
import { visit } from 'unist-util-visit';

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid' || !parent) return;
      parent.children[index] = { type: 'html', value: `<pre class="mermaid not-content">${escape(node.value)}</pre>` };
    });
  };
}
