import { Switch } from '../../../src/switch';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

type Story = StoryObj<typeof Switch>;

export default {
  id: 'story-switch',
  title: 'Form Controls/Switch',
  component: Switch,
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export const Basic: Story = {
  args: {
    id: 'test-checkbox',
    label: 'Enable dark mode',
    checked: false,
    disabled: false,
    rowReverse: false,
    hint: '',
    onChange: action('onChange'),
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
      setChecked((event.target as any).checked);
      args.onChange?.(event);
    }

    return (
      <Switch {...args} checked={checked} onChange={onChange} />
    );
  },
};
