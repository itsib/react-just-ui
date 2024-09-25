import { OtpInput } from '../../../src/otp-input';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

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
    upper: false,
    hint: '',
  },
} satisfies Meta<typeof OtpInput>;

export const Basic: Story = {
  args: {
    id: 'otp-input',
    label: 'Enter the code from the SMS',
    onChange: action('onChange'),
  },
  render: function Render({ label, id }) {

    return (
      <OtpInput id={id} label={label} />
    );
  }
};
