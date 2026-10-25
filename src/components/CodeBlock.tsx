import { useMemo } from 'react';

type Language = 'css' | 'html' | 'js';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapNumbers(value: string): string {
  return value.replace(
    /(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:ms|s|px|rem|em|%|deg|vh|vw|svh)?\b)/g,
    '<span class="tok-num">$1</span>',
  );
}

function highlightCss(code: string): string[] {
  let inComment = false;
  return code.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (inComment) {
      if (trimmed.includes('*/')) inComment = false;
      return `<span class="tok-comment">${escapeHtml(line)}</span>`;
    }
    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) inComment = true;
      return `<span class="tok-comment">${escapeHtml(line)}</span>`;
    }
    if (trimmed.startsWith('*')) {
      return `<span class="tok-comment">${escapeHtml(line)}</span>`;
    }
    if (trimmed.startsWith('@')) {
      return `<span class="tok-at">${escapeHtml(line)}</span>`;
    }
    if (trimmed.endsWith('{') || trimmed === '}' || trimmed.endsWith('},')) {
      return `<span class="tok-sel">${escapeHtml(line)}</span>`;
    }
    const match = line.match(/^(\s*)([a-zA-Z-]+)(\s*:\s*)(.*)$/);
    if (match) {
      const [, indent, property, colon, rest] = match;
      return `${indent}<span class="tok-prop">${escapeHtml(property)}</span>${escapeHtml(colon)}<span class="tok-val">${wrapNumbers(escapeHtml(rest))}</span>`;
    }
    return `<span class="tok-val">${escapeHtml(line)}</span>`;
  });
}

function highlightHtml(code: string): string[] {
  return code.split('\n').map((line) => {
    let html = escapeHtml(line);
    html = html.replace(/(&quot;[^&]*?&quot;)/g, '<span class="tok-str">$1</span>');
    html = html.replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="tok-tag">$2</span>');
    return html;
  });
}

function highlightJs(code: string): string[] {
  let inBlockComment = false;
  return code.split('\n').map((line) => {
    if (inBlockComment) {
      if (line.includes('*/')) inBlockComment = false;
      return `<span class="tok-comment">${escapeHtml(line)}</span>`;
    }
    const trimmed = line.trim();
    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) inBlockComment = true;
      return `<span class="tok-comment">${escapeHtml(line)}</span>`;
    }
    if (trimmed.startsWith('//')) {
      return `<span class="tok-comment">${escapeHtml(line)}</span>`;
    }
    let out = '';
    let lastIndex = 0;
    const regex =
      /(\/\/[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(function|var|let|const|return|if|else|for|true|false|null|new|setTimeout|clearTimeout|addEventListener|removeEventListener|querySelector|querySelectorAll|document|window|matchMedia|requestAnimationFrame|performance|setAttribute|getAttribute|classList|focus)\b|\b(\d+(?:\.\d+)?)\b/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      out += escapeHtml(line.slice(lastIndex, match.index));
      const [full, comment, str, keyword, number] = match;
      if (comment) out += `<span class="tok-comment">${escapeHtml(full)}</span>`;
      else if (str) out += `<span class="tok-str">${escapeHtml(full)}</span>`;
      else if (keyword) out += `<span class="tok-kw">${escapeHtml(full)}</span>`;
      else if (number) out += `<span class="tok-num">${escapeHtml(full)}</span>`;
      lastIndex = match.index + full.length;
    }
    out += escapeHtml(line.slice(lastIndex));
    return out;
  });
}

export function CodeBlock({ code, language }: { code: string; language: Language }) {
  const lines = useMemo(() => {
    if (language === 'css') return highlightCss(code);
    if (language === 'html') return highlightHtml(code);
    return highlightJs(code);
  }, [code, language]);

  return (
    <div className="codeblock">
      <pre className="codeblock__pre" tabIndex={0} aria-label={`${language.toUpperCase()} code`}>
        <code>
          {lines.map((line, index) => (
            <span className="code-line" key={`${index}-${line.length}`}>
              <span className="code-line__num" aria-hidden="true">
                {index + 1}
              </span>
              <span className="code-line__text" dangerouslySetInnerHTML={{ __html: line || ' ' }} />
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
