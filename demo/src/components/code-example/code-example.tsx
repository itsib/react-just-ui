import React, { FC, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/common';
import './code-example.css';
import { useTranslation } from 'react-i18next';
import { copyText } from '../../utils/copy-text.ts';

hljs.configure({ languages: ['tsx', 'html'] });

export interface ICodeSnippet {
  source?: string;
}

export const CodeExample: FC<ICodeSnippet> = ({ source }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLPreElement | null>(null);

  function onCopy(event: React.MouseEvent) {
    event.stopPropagation();
    if (source) {
      const button = event.currentTarget as HTMLButtonElement;
      copyText(source).then(() => {
        button.setAttribute('aria-label', t('copied'));
      });
    }
  }

  function onMouseLeave(event: React.MouseEvent) {
    const button = event.currentTarget as HTMLButtonElement;
    setTimeout(() => button.setAttribute('aria-label', t('copy_source')), 120);
  }

  useEffect(() => {
    const code = ref.current;
    if (!code || !source) return;

    code.innerHTML = hljs.highlightAuto(source, ['tsx', 'html']).value;
  }, [source]);

  return (
    <fieldset className="code-example jui-scroll">
      <legend>{t('source')}</legend>
      <button
        className="btn btn-copy"
        aria-label={t('copy_source')}
        data-position="top"
        onClick={onCopy}
        onMouseLeave={onMouseLeave}
      >
        <i className="icon icon-copy"/>
      </button>
      <div className="content">
        <div className="source">
          <pre>
            <code className="language-html" ref={ref}/>
          </pre>
        </div>
      </div>
    </fieldset>
  );
};
