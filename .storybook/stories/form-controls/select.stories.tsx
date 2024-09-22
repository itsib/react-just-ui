import { Select } from '../../../src/select';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Form Controls/Select',
  component: Select,
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    options: {
      name: 'options',
      type: {
        name: 'array',
        required: true,
        value: {
          name: 'object',
          raw: 'SelectOption',
          value: {
            icon: { name: 'string', required: false },
            label: { name: 'string', required: false, },
            value: { name: 'string', required: true },
          },
        }
      },
      control: {
        type: 'object',
        disable: true,
      },
    },

    ...({
      optionValue: {
        name: 'value',
        description: 'Value of the option',
        type: { name: 'string', required: true },
        control: { disable: true },
        table: {
          subcategory: 'SelectOption',
        }
      },
      optionLabel: {
        name: 'label',
        description: 'The text that will be displayed in the option. If not specified, the value of the value field will be displayed.',
        type: { name: 'string' },
        control: { disable: true },
        table: {
          subcategory: 'SelectOption',
        }
      },
      optionIcon: {
        name: 'icon',
        description: 'The displayed icon, you can also transfer the class of the icon, the icon font.',
        type: { name: 'ReactNode' },
        control: { disable: true },
        table: {
          subcategory: 'SelectOption',
        }
      }
    } as Meta<any>)
  },
  args: {
    id: 'test-select',
    label: 'What is your favorite programming language?',
    options: [
      { value: 'ts', label: 'TypeScript', icon: '/images/typescript.svg' },
      { value: 'rust', label: 'Rust', icon: '/images/rust.svg' },
      { value: 'python', label: 'Python', icon: '/images/python.svg' },
    ],
    value: 'ts',
    disabled: false,
    loading: false,
    hint: '',
  },
  tags: ['autodocs'],
} as Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  args: {
    onChange: action('onChange'),
  },
  render: function Render(args) {

    return (
      <div style={{ width: '300px' }}>
        <Select {...args} />
      </div>
    );
  }
};
