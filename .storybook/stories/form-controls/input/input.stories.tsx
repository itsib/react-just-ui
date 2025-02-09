import { Input } from '../../../../src';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta = {
  title: 'Form Controls/Input',
  component: Input,
  parameters: {
    controls: {
      sort: 'alpha',
    }
  },
  argTypes: {
    // id: { required: true, type: 'string' },
    type: {
      type: { name: 'enum', value: ['text', 'password', 'email', 'search', 'tel', 'url', 'number'] },
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'search', 'tel', 'url', 'number'],
    },
    label: {
      control: { type: 'text' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    prefix: {
      control: { type: 'text' },
    },
    suffix: {
      control: { type: 'text' },
    },
  },
  args: {
    type: 'text',
    value: '',
    prefix: '',
    suffix: '',
    placeholder: '',
    disabled: false,
    loading: false,
    hint: '',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof Input>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    id: 'test-input',
    label: 'First Name',
    onChange: action('onChange'),
    markRequired: false,
  },
  argTypes: {
    markRequired: {
      type: 'boolean'
    }
  },
  render: function Render(args) {
    const [text, setText] = useState('')

    return (
      <div style={{ width: 300 }}>
        <Input {...args} value={text} onChange={e => setText((e.target as any).value)} />
      </div>
    );
  }
};
