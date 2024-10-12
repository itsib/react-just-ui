import type { Meta, StoryObj } from '@storybook/react';
import './button.stories.css';

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
    return (
      <section className="button-stories">
        <div className="header">Normal</div>

        <div className="header">Outline</div>

        <button className={`btn btn-primary w-full ${loading ? 'loading' : ''}`} disabled={disabled}>
          <span>Primary</span>
        </button>

        <button className={`btn btn-outline-primary w-full ${loading ? 'loading' : ''}`} disabled={disabled}>
          <span>Primary</span>
        </button>

        <button className={`btn btn-secondary w-full ${loading ? 'loading' : ''}`} disabled={disabled}>
          <span>Secondary</span>
        </button>

        <button className={`btn btn-outline-secondary w-full ${loading ? 'loading' : ''}`} disabled={disabled}>
          <span>Secondary</span>
        </button>

        <button className={`btn btn-danger w-full ${loading ? 'loading' : ''}`} disabled={disabled}>
          <span>Danger</span>
        </button>

        <button className={`btn btn-outline-danger w-full ${loading ? 'loading' : ''}`} disabled={disabled}>
          <span>Danger</span>
        </button>
      </section>
    );
  }
}