import type { Meta, StoryObj } from '@storybook/react';
import { Input } from 'react-just-ui/input'
import { useState } from 'react';

interface ButtonControls {
  disabled: boolean;
  loading: boolean;
}

const description = `
Tooltip provides a text label that is displayed 
when the user hovers over or longpresses an element. 
The tooltip element is implemented in pure css, 
without using javascript code. It is configured 
by native css variables, data attributes and tooltip 
text defines in aria-label attribute.
`;

const meta = {
  title: 'Components/Button',
  parameters: {
    cssOnly: true,
    docs: {
      description: {
        component: description,
      }
    },
  },
  argTypes: {
    disabled: {
      name: 'disabled',
      description: 'Disable button',
      type: { name: 'boolean' },
      control: { type: 'boolean' },
    },
    loading: {
      name: 'loading',
      description: 'Display loading state',
      type: { name: 'boolean' },
      control: { type: 'boolean' },
    },
  },
  args: {
    disabled: false,
    loading: false,
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<ButtonControls>;

export const Basic: Story = {
  args: {
    disabled: false,
    loading: false,
  },

  render: function Render({ disabled, loading }) {
    const [value, setValue] = useState('')
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input id="input-1" value={value} onChange={e => setValue((e.target as any).value)}  />
        <button className={`jj jj-button primary w-full ${loading ? 'loading' : ''}`} disabled={disabled}>
          <span>Primary</span>
        </button>


        <button className={`jj jj-button secondary w-full ${loading ? 'loading' : ''}`} disabled={disabled}>
          <span>Secondary</span>
        </button>
      </section>
    );
  }
}