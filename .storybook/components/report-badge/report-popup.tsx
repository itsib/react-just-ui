import { FC, Fragment, useMemo } from 'react';
import { ModuleReport } from './types';
import { BoxIcon } from '@storybook/icons';
import './styles.css';

const LABEL: Record<string, string> = {
  js: 'ECM',
  cjs: 'CJS',
  css: 'CSS',
};

export interface ReportPopupProps {
  title?: string;
  report?: ModuleReport;
}

export const ReportPopup: FC<ReportPopupProps> = ({ title, report }) => {
  const badges = useMemo(() => {
    if (!report) return;

    return Object.keys(report)
      .sort((a, b) => a === 'css' ? 1 : b === 'css' ? -1 : 0)
      .map(ext => ({ ext, size: report[ext][0], gzip: report[ext][1] }));
  }, [report]);

  return (
    <div className="report-popup-wrap">
      <button type="button" className="report-popup-open-btn">
        <span>Show Report</span>
      </button>

      <div className="report-popup">
        {title ? <div className="label">{title.split('/')[1]} bundle size</div> : null}
        {badges?.map(({ ext, size, gzip }) => (
          <Fragment key={ext}>
            <div><BoxIcon className="icon" size={12} /></div>
            <div>{LABEL[ext]}</div>
            <div>{(size / 1000).toFixed(2)} Kb</div>
            <div>gzip: {(gzip / 1000).toFixed(2)} Kb</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};


