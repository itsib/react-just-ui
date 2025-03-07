import { OtpInput } from '../../../../src';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { ExtendedDemo } from './extended-demo';
import { SimpleDemo } from './simple-demo';

type Story = StoryObj<typeof OtpInput>;

export default {
  title: 'Form Controls/OTP Input',
  component: OtpInput,
  args: {
    value: '',
    layout: 'ddd-ddd',
    disabled: false,
    hint: '',
  },
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    error: {
      control: {
        type: 'object',
      }
    }
  },

} satisfies Meta<typeof OtpInput>;

export const Basic: Story = {
  args: {
    id: 'otp-input',
    label: 'Enter the code from the SMS',
    onChange: action('onChange'),
  },
  render: ({ ...args }) => <SimpleDemo {...args} />
};

export const Extended: Story = {
  args: {
    label: 'Enter the code from the SMS',
    hint: 'This is an additional hint text',
    layout: 'sss-sss',
    disabled: false,
  },
  argTypes: {
    disabled: {
      type: 'boolean',
    },
    id: { table: { disable: true } },
    error: { table: { disable: true } },
    onChange: { table: { disable: true } },
    ref: { table: { disable: true } },
    value: { table: { disable: true } },
  },
  render: ({ label, disabled, layout, hint }) => <ExtendedDemo label={label as any} hint={hint} disabled={disabled} layout={layout} />
};
