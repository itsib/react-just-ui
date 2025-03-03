import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { ChangeEvent } from 'react';
import { Slider } from '../../../../src/slider';

const meta = {
  title: 'Form Controls/Slider',
  component: Slider,
  args: {
    size: 'md',
    orient: 'horizontal',
    dual: false,
    disabled: false,
    markRequired: false,
    min: 0,
    max: 100,
    step: 1,
    hint: '',
  },
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    size: {
      type: 'string',
      control: {
        type: 'radio',
      },
      options: ['sm', 'md', 'lg'],
    },
    orient: {
      control: {
        type: 'inline-radio',
      },
      options: ['vertical', 'horizontal'],
    },
    markRequired: {
      type: 'boolean'
    },
    dual: {
      type: 'boolean'
    },
    min: {
      type: 'number',
      control: { type: 'number' },
    },
    max: {
      type: 'number',
      control: { type: 'number' },
    },
    step: {
      type: 'number',
      control: { type: 'number' },
    },
  },

  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof Slider>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    value: '50',
    id: 'slider-1',
    label: 'Volume',
    onChange: action('onChange'),
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs();

    const { id, dual, markRequired, size, orient, onChange: _onChange, ...props } = args;

    function onChange(event: ChangeEvent<HTMLInputElement>) {
      updateArgs({ value: event.target.value });
    }

    const totalSize = size === 'sm' ? 180 : (size === 'md' ? 200 : 240);

    return (
      <div>
        <Slider
          id={id}
          dual={dual}
          markRequired={markRequired}
          size={size}
          value={value}
          onChange={onChange}
          tabIndex={1}
          orient={orient}
          style={orient === 'horizontal' ? { width: totalSize } : { height: totalSize }}
          {...props}
        />

        {/*<input id="range-native" type="range" {...props} value={value} onChange={onChange} />*/}
      </div>
    );
  }
};
