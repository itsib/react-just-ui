import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/common';
import type { HLJSApi } from 'highlight.js';
// import 'highlight.js/styles/base16/bespin.css';
// import 'highlight.js/styles/github.css';
// import 'highlight.js/styles/github-dark.css';
import './code-snippet.css'

export interface ICodeSnippet {

}

export const CodeSnippet: FC<PropsWithChildren<ICodeSnippet>> = ({ children }) => {
  const [instance, setInstance] = useState<HLJSApi | null>(null);
  const ref = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    if (instance) return;

    setInstance(hljs.newInstance());
  }, [instance]);

  useEffect(() => {
    const code = ref.current;
    if (!code || code.dataset.highlighted === 'yes' || !instance) return;


    console.log(instance.listLanguages());

    instance.configure({ languages: ['html', 'jsx'] });

    hljs.highlightElement(code);
  }, [instance]);

  return (
    <div className="code-snippet">
      <pre>
        <code className="language-html" ref={ref}>{children}</code>
      </pre>
    </div>
  );
};
