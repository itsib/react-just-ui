import { LoaderFunction } from '@storybook/csf';

export const loader: LoaderFunction = async () => {
  const res = await fetch('/report/report.json');
  if(!res.ok) throw new Error(res.statusText);

  const reports = await res.json();

  return { reports };
}