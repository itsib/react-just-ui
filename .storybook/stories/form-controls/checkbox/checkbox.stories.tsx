import { Checkbox } from '../../../../src';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta = {
  id: 'story-checkbox',
  title: 'Form Controls/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  args: {
    id: 'test-checkbox',
    label: 'I agree to the privacy policy and terms of use',
    checked: false,
    disabled: false,
    rowReverse: false,
    hint: '',
    onChange: action('onChange'),
  },
  render: function Render(args: any) {
    const [checked, setChecked] = useState(args.checked);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
      setChecked((event.target as any).checked);
      args.onChange?.(event);
    }

    return (
      <Checkbox {...args} checked={checked} onChange={onChange} />
    );
  },
};
