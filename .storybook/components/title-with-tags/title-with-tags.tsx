import { FC } from 'react';
import { DocsStoryProps, useOf } from '@storybook/blocks';
import './title-with-tags.css';

const HINT = 'This component is written in pure CSS, and does not require JavaScript execution on the page.';

export const TitleWithTags: FC<Partial<DocsStoryProps>> = ({ of }) => {
  const resolvedOf = useOf(of || 'story', ['story']);

  switch (resolvedOf.type) {
    case 'story': {
      const titles = resolvedOf.story.title.split('/');
      return <InnerContent title={titles[titles.length - 1]} cssOnly={!!resolvedOf.story.parameters?.cssOnly} />;
    }
    default:
      return null;
  }
};

const InnerContent: FC<{ title: string; cssOnly: boolean }> = ({ title, cssOnly }) => {
  return (
    <h1 className="title-with-tags">
      <>{title}</>
      <div className="tags-container">
        {cssOnly ? (
          <div className="tag purple" aria-label={HINT} data-position="right">CSS Only</div>
        ) : null}
      </div>
    </h1>
  )
}