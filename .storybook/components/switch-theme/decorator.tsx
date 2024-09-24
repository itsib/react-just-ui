import { DecoratorFunction, PartialStoryFn, StoryContext } from '@storybook/csf';
import { ReactRenderer } from '@storybook/react';
import { useEffect, useMemo } from 'react';

export const decorator: DecoratorFunction<ReactRenderer> = (
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext<ReactRenderer>,
): ReactRenderer['storyResult'] => {
  const defaultBg = context.parameters?.['backgrounds']?.default || 'dark';
  const background = context.globals?.['backgrounds']?.value;
  const backgrounds = context.parameters?.['backgrounds']?.values;

  const theme = useMemo(() => {
    if (!backgrounds || !Array.isArray(backgrounds) || !background) {
      return defaultBg;
    }

    return backgrounds.find(({ value }) => value === background)?.name || defaultBg;
  }, [background, backgrounds, defaultBg]);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  return <Story />;
};