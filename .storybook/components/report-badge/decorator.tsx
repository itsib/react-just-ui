import { DecoratorFunction, PartialStoryFn, StoryContext } from '@storybook/csf';
import { ReactRenderer } from '@storybook/react';
import { ReactNode, useMemo } from 'react';
import { ReportPopup } from './report-popup';
import { ModuleReport } from './types';

export const decorator: DecoratorFunction<ReactRenderer> = (
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext<ReactRenderer>,
): ReactRenderer['storyResult'] => {
  const report = useMemo(() => {
    const ids = context.componentId.split('-');
    const reports = context.loaded.reports;
    const key = ids.find(id => id in reports.modules);

    return key && reports.modules[key] as ModuleReport | undefined;
  }, [context]);

  return (
    <div className="report-badge-decorator">
      <div className="story-wrap">{Story() as ReactNode}</div>

      {report ? (
        <div className="report-wrap">
          <ReportPopup title={context.title} report={report} />
        </div>
      ) : null}
    </div>
  );
};