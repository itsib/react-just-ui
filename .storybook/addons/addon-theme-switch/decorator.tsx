import { DecoratorFunction, PartialStoryFn, StoryContext } from '@storybook/csf';
import { ReactRenderer } from '@storybook/react';
import { useEffect, useMemo } from 'react';
import { PARAM_KEY } from './tool';

export const decorator: DecoratorFunction<ReactRenderer> = (
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext<ReactRenderer>,
): ReactRenderer['storyResult'] => {
  const isDarkMode = context.globals?.[PARAM_KEY] ?? context.initialGlobals?.[PARAM_KEY];
  const backgrounds = context.parameters?.[PARAM_KEY] as { name: string; value: string }[];

  const backgroundColor = useMemo(() => {
    return backgrounds?.find(({ name }) => name === (isDarkMode ? 'dark' : 'light'))?.value;
  }, [backgrounds, isDarkMode]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="switch-theme" style={{ backgroundColor }}>
      <Story />
    </div>
  );
};