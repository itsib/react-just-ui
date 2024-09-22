import { addons } from '@storybook/manager-api';
import { themeDark } from './theme';



addons.setConfig({
  navSize: 300,
  bottomPanelHeight: 300,
  rightPanelWidth: 300,
  panelPosition: 'bottom',
  enableShortcuts: true,
  showToolbar: true,
  theme: themeDark,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
    // renderLabel(item: any, api) {
    //   console.log(item);
    //
    //   if (item.root) {
    //     return <>{item.name}</>;
    //   }
    //   return <>{item.name}</>;
    // },
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});