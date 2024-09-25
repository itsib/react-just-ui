import { FC, useMemo } from 'react';
import { ModuleReport } from './types';
import { BoxIcon } from '@storybook/icons';
import './report-popup.css';

const LABEL: Record<string, string> = {
  js: 'ECM',
  cjs: 'CJS',
  css: 'CSS',
};

export interface ReportPopupProps {
  title?: string;
  report?: ModuleReport;
  total?: ModuleReport;
}

export const ReportPopup: FC<ReportPopupProps> = ({ title, report, total }) => {
  const component = useMemo(() => {
    if (!report) return;

    return Object.keys(report)
      .sort((a, b) => a === 'css' ? 1 : b === 'css' ? -1 : 0)
      .map(ext => {
        const size = `${(report[ext][0] / 1024).toFixed(2)}`;
        const gzip = `${(report[ext][1] / 1024).toFixed(2)}`;

        return {
          ext,
          label: LABEL[ext],
          size,
          gzip,
        }
      });
  }, [report]);

  const pkgSize = useMemo(() => {
    if (!total) return;

    return Object.keys(total)
      .sort((a, b) => a === 'css' ? 1 : b === 'css' ? -1 : 0)
      .map(ext => {
        const size = `${(total[ext][0] / 1024).toFixed(2)}`;
        const gzip = `${(total[ext][1] / 1024).toFixed(2)}`;

        return {
          ext,
          label: LABEL[ext],
          size,
          gzip,
        }
      });
  }, [total]);

  return (
    <div className="report-popup-wrap">
      <button type="button" className="report-popup-open-btn">
        <span>Show Report</span>
      </button>

      <div className="report-popup">
        <div className="table">
          <div className="label">Total package size</div>
          {pkgSize?.map(({label, ext, size, gzip}) => (
            <Row key={ext} label={label} size={size} gzip={gzip} />
          ))}
        </div>

        <div className="table">
          {title ? <div className="label">{title.split('/')[1]} bundle size</div> : null}
          {component?.map(({label, ext, size, gzip}) => (
            <Row key={ext} label={label} size={size} gzip={gzip} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Row: FC<{ label: string, size: string, gzip: string }> = ({ label, size, gzip }) => {
  return (
    <>
      <div><BoxIcon className="icon" size={12}/></div>
      <div>{label}</div>
      <div>
        <b style={{ color: 'white', fontWeight: 500 }}>{size}</b>
        &nbsp;Kb
      </div>
      <div>
        gzip:&nbsp;
        <b style={{ color: 'white', fontWeight: 500 }}>{gzip}</b>
        &nbsp;Kb
      </div>
    </>
  )
};

