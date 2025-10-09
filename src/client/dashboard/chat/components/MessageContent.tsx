'use client';

import { Fragment, useState, type ReactNode } from 'react';

type MessageBlock =
  | {
      type: 'heading';
      text: string;
    }
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'list';
      items: string[];
    }
  | {
      type: 'code';
      text: string;
      language: string;
    };

type MessageContentProps = {
  content: string;
};

export default function MessageContent({ content }: MessageContentProps) {
  const blocks = parseMessageBlocks(content);

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <Fragment key={index}>{renderBlock(block)}</Fragment>
      ))}
    </div>
  );
}

function renderBlock(block: MessageBlock): ReactNode {
  if (block.type === 'heading') {
    return (
      <h3 className="text-[17px] leading-7 font-semibold text-gray-100">
        {block.text}
      </h3>
    );
  }

  if (block.type === 'list') {
    return (
      <ul className="ml-5 list-disc space-y-1 text-gray-300">
        {block.items.map((item, index) => (
          <li key={index} className="pl-1 leading-7">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'code') {
    return <CodeBlock language={block.language} text={block.text} />;
  }

  return <p className="leading-7 text-gray-300">{block.text}</p>;
}

function CodeBlock({ language, text }: { language: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="overflow-hidden rounded-[6px] border border-[#3c3c3c] bg-[#1e1e1e] shadow-sm">
      <div className="flex h-9 items-center justify-between border-b border-[#2d2d2d] bg-[#252526] px-3">
        <span className="font-mono text-[11px] leading-none text-[#cccccc]">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="rounded-[4px] border border-[#3c3c3c] bg-[#2d2d30] px-2 py-1 font-mono text-[11px] leading-none text-[#cccccc] transition-colors hover:border-[#5a5a5a] hover:bg-[#37373d] hover:text-white"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#1e1e1e] p-4 font-mono text-[13px] leading-6 text-[#d4d4d4]">
        <code>{highlightCode(text)}</code>
      </pre>
    </div>
  );
}

function highlightCode(code: string) {
  return code
    .split(
      /(\s+|\/\/.*|\/\*[\s\S]*?\*\/|(["'`])(?:\\.|(?!\2).)*\2|\b\d+(?:\.\d+)?\b|\b(?:async|await|break|case|catch|class|const|continue|default|else|export|extends|finally|for|from|function|if|import|in|interface|let|new|null|return|string|switch|throw|try|type|undefined|var|void|while)\b)/g
    )
    .map((part, index) => {
      if (!part) return null;

      if (/^\/\/|^\/\*/.test(part)) {
        return (
          <span key={index} className="text-[#6a9955]">
            {part}
          </span>
        );
      }

      if (/^(["'`])/.test(part)) {
        return (
          <span key={index} className="text-[#ce9178]">
            {part}
          </span>
        );
      }

      if (/^\d/.test(part)) {
        return (
          <span key={index} className="text-[#b5cea8]">
            {part}
          </span>
        );
      }

      if (
        /^(async|await|break|case|catch|class|const|continue|default|else|export|extends|finally|for|from|function|if|import|in|interface|let|new|null|return|string|switch|throw|try|type|undefined|var|void|while)$/.test(
          part
        )
      ) {
        return (
          <span key={index} className="text-[#569cd6]">
            {part}
          </span>
        );
      }

      return part;
    });
}

function parseMessageBlocks(content: string) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: MessageBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;

    blocks.push({
      type: 'paragraph',
      text: cleanInlineText(paragraphLines.join(' ')),
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;

    blocks.push({
      type: 'list',
      items: listItems.map(cleanInlineText),
    });
    listItems = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    const fenceLanguage = getFenceLanguage(line);

    if (fenceLanguage !== null) {
      flushParagraph();
      flushList();

      const codeLines: string[] = [];
      index += 1;

      while (
        index < lines.length &&
        getFenceLanguage(lines[index].trim()) === null
      ) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({
        type: 'code',
        text: codeLines.join('\n').trimEnd(),
        language: fenceLanguage,
      });
      continue;
    }

    if (!line || isRuleLine(line)) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = getHeadingText(line);

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', text: heading });
      continue;
    }

    const listItem = getListItemText(line);

    if (listItem) {
      flushParagraph();
      listItems.push(listItem);
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function getFenceLanguage(line: string) {
  if (!line.startsWith('```')) return null;

  return line
    .slice(3)
    .trim()
    .replace(/[^\w+#.-]/g, '');
}

function isRuleLine(line: string) {
  return /^([*_=-]\s*){3,}$/.test(line);
}

function getHeadingText(line: string) {
  const hashHeading = line.match(/^#{1,6}\s+(.+)$/);

  if (hashHeading) {
    return cleanInlineText(hashHeading[1]);
  }

  const emphasizedHeading = line.match(/^(\*{2,3}|_{2,3})(.+)\1:?$/);

  if (emphasizedHeading) {
    return cleanInlineText(emphasizedHeading[2]);
  }

  const shortColonHeading = line.match(/^([A-Z][^.!?]{2,60}):$/);

  if (shortColonHeading) {
    return cleanInlineText(shortColonHeading[1]);
  }

  return '';
}

function getListItemText(line: string) {
  const bullet = line.match(/^[-*+]\s+(.+)$/);

  if (bullet) {
    return bullet[1];
  }

  const numbered = line.match(/^\d+[.)]\s+(.+)$/);

  if (numbered) {
    return numbered[1];
  }

  return '';
}

function cleanInlineText(text: string) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*\*|___)(.*?)\1/g, '$2')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^[*_#>\s-]+/, '')
    .replace(/[*_#>`]+$/g, '')
    .trim();
}
