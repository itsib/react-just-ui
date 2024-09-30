import { addons } from '@storybook/manager-api';
import theme from './theme';

addons.setConfig({
  theme: theme,
  // navSize: 300,
  bottomPanelHeight: 500,
  // rightPanelWidth: 300,
  // panelPosition: 'bottom',
  enableShortcuts: false,
  // showToolbar: true,
  selectedPanel: 'Get Started',
  initialActive: 'Get Started',
  // sidebar: {
    // showRoots: true,
    // collapsedRoots: ['other'],
    // renderLabel(item: any, api) {
    //   console.log(item);
    //
    //   if (item.root) {
    //     return <>{item.name}</>;
    //   }
    //   return <>{item.name}</>;
    // },
  // },
  // toolbar: {
  //   title: { hidden: false },
  //   zoom: { hidden: false },
  //   eject: { hidden: false },
  //   copy: { hidden: false },
  //   fullscreen: { hidden: false },
  // },
});