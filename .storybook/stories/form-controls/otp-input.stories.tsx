import { OtpInput } from 'react-just-ui';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

type Story = StoryObj<typeof OtpInput>;

export default {
  title: 'Form Controls/OTP Input',
  component: OtpInput,
  argTypes: {
    label: {
      control: { type: 'text' },
    },
  },
  args: {
    value: '',
    layout: 'ddd-ddd',
    disabled: false,
    hint: '',
  },
} satisfies Meta<typeof OtpInput>;

export const Basic: Story = {
  args: {
    id: 'otp-input',
    label: 'Enter the code from the SMS',
    onChange: action('onChange'),
  },
  render: function Render({label, id, disabled, layout, onChange}) {
    const [data, setData] = useState('');

    return (
      <OtpInput id={id} label={label} disabled={disabled} layout={layout} value={data} onChange={event => {
        setData(event.target.value);
        onChange(event);
      }}/>
    );
  }
};
