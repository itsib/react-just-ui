import { DecoratorFunction, PartialStoryFn, StoryContext } from '@storybook/csf';
import { ReactRenderer } from '@storybook/react';
import { useEffect, useMemo, useRef } from 'react';
import { ReportPopup } from './report-popup';
import { ModuleReport } from './types';

export const decorator: DecoratorFunction<ReactRenderer> = (
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext<ReactRenderer>,
): ReactRenderer['storyResult'] => {
  const reports = context.loaded.reports;
  const componentId = context.componentId;
  const mode = context.viewMode;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mode === 'docs') return;
    const element = ref.current;
    if (!element) return;

    const setHeight = (height: number) => {
      height -= 16;
      height = height < 0 ? 0 : height;
      element.style.height = height + 'px';
    };

    const onResize = (event: UIEvent) => {
      setHeight((event.target as Window).innerHeight)
    }

    setHeight(window.innerHeight);

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [mode]);

  const report = useMemo(() => {
    const ids = componentId.split('-');
    const key = ids.find(id => id in reports.modules);

    return key && reports.modules[key] as ModuleReport | undefined;
  }, [reports, componentId]);

  return (
    <div className="report-badge-decorator">
      <div className="story-wrap" ref={ref}>
        <Story />
      </div>

      {mode === 'docs' && report ? (
        <div className="report-wrap">
          <ReportPopup title={context.title} report={report} total={reports.total} />
        </div>
      ) : null}
    </div>
  );
};