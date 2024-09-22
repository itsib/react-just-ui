import { Textarea } from '../../../src/textarea';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Form Controls/Textarea',
  component: Textarea,
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
  },
  args: {
    type: 'text',
    value: '',
    label: 'Overview',
    placeholder: '',
    disabled: false,
    loading: false,
    hint: '',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof Textarea>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    id: 'test-input',
    onChange: action('onChange'),
  },
  render: function Render(args) {

    return (
      <Textarea {...args} />
    );
  }
};
