import { LoaderFunction } from '@storybook/csf';
import { FullReport } from './types';

export const loader: LoaderFunction = async (): Promise<{ reports: FullReport }> => {
  const res = await fetch('./report/report.json');
  if(!res.ok) throw new Error(res.statusText);

  const reports = await res.json();

  return { reports };
}