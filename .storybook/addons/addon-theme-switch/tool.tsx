import * as React from 'react';
import { IconButton } from '@storybook/components';
import { useGlobals, useStorybookApi } from '@storybook/manager-api';

export const ADDON_ID = 'addon-theme-switch';
export const PARAM_KEY = 'isDarkMode';

export const Tool = React.memo(function MyAddonSelector() {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();

  const isDarkMode = [true, 'true'].includes(globals[PARAM_KEY]);

  const toggleMyTool = React.useCallback(() => {
    updateGlobals({
      [PARAM_KEY]: !isDarkMode,
    });
  }, [isDarkMode]);

  React.useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle Theme [8]',
      defaultShortcut: ['8'],
      actionName: PARAM_KEY,
      showInMenu: false,
      action: toggleMyTool,
    });
  }, [toggleMyTool, api]);

  return (
    <IconButton key={ADDON_ID} active={isDarkMode} title="Enable my addon" onClick={toggleMyTool}>
      <svg version="1.1" width="14" height="14"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m11 13c3 3 8 3 11-9e-4 -0.4 5-5 10-11 10-6 0-11-4-11-10 0-5 4-11 10-11-3 3-3 8-9e-4 11z"
          fill={isDarkMode ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </IconButton>
  );
});