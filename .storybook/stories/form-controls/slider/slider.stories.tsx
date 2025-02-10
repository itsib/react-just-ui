import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Slider } from '../../../../src/slider';

const meta = {
  title: 'Form Controls/Slider',
  component: Slider,
  parameters: {
    controls: {
      sort: 'alpha',
    }
  },
  argTypes: {
    // id: { required: true, type: 'string' },
    label: {
      control: { type: 'text' },
    },
  },
  args: {
    value: '0',
    disabled: false,
    hint: '',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof Slider>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    id: 'test-slider',
    label: 'Tune Volume',
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
        <Slider {...args} value={text} size="md" onChange={e => setText((e.target as any).value)} />
      </div>
    );
  }
};
