import type { Meta, StoryObj } from '@storybook/react';
import { Input } from 'react-just-ui/input'
import { useState } from 'react';

interface ButtonControls {
  disabled: boolean;
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
  },
  args: {
    disabled: false,
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<ButtonControls>;

export const Basic: Story = {
  args: {
    disabled: false,
  },

  render: function Render({ disabled }) {
    const [value, setValue] = useState('')
    return (
      <section>
        <Input id="input-1" value={value} onChange={e => setValue((e.target as any).value)}  />
        <button className="jj jj-button w-full" disabled={disabled}>
          <span>Submit</span>
        </button>
      </section>
    );
  }
}