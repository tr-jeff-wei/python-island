import React from 'react';

const TOKEN_PATTERN =
  /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|\b(?:print|range|len|int|float|str|bool|list|dict|set|tuple|input|type|sum|min|max|abs|enumerate|zip)\b|\b\d+(?:\.\d+)?\b/g;

const tokenClass = (token: string) => {
  if (token.startsWith('#')) return 'text-slate-500';
  if (token.startsWith('"') || token.startsWith("'")) return 'text-amber-300';
  if (/^\d/.test(token)) return 'text-purple-300';
  if (/^(print|range|len|int|float|str|bool|list|dict|set|tuple|input|type|sum|min|max|abs|enumerate|zip)$/.test(token)) {
    return 'text-sky-300';
  }
  return 'text-violet-300';
};

interface PythonCodeBlockProps {
  code: string;
}

export const PythonCodeBlock: React.FC<PythonCodeBlockProps> = ({ code }) => {
  if (!code.trim()) return null;

  const tokens = code.split(TOKEN_PATTERN);
  const matches = code.match(TOKEN_PATTERN) ?? [];

  return (
    <pre className="mb-3 overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs leading-relaxed text-slate-200">
      <code className="font-mono">
        {tokens.map((text, index) => (
          <React.Fragment key={index}>
            {text}
            {matches[index] && (
              <span className={tokenClass(matches[index])}>{matches[index]}</span>
            )}
          </React.Fragment>
        ))}
      </code>
    </pre>
  );
};
