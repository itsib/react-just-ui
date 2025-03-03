import { addons, types } from '@storybook/manager-api';
import { Tool, ADDON_ID } from './addons';
import theme from './theme';

addons.register(ADDON_ID, () =>  {
  addons.add(ADDON_ID, {
    type: types.TOOL,
    title: 'Theme Switch Background',
    match: ({ tabId, viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)) && !tabId,
    render: Tool,
  });
});

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
    // },
  // },
  toolbar: {
    title: { hidden: true },
    zoom: { hidden: true },
    eject: { hidden: true },
    copy: { hidden: true },
    fullscreen: { hidden: true },
  },
});