import type { Meta, StoryObj } from '@storybook/react';
import './button.stories.css';

interface ButtonControls {
  disabled: boolean;
  loading: boolean;
}

const description = `
<p>
The button component is a standard HTML \\<button\\> element styled using css. 
It is configured using several css classes and css variables. Does not use javascript code. 
</p>

<p>
In order for the loading indicator to display correctly, the button content must be 
wrapped in an HTML tag. This is necessary to hide the content of the button.
</p>
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
        <div className="header">Default</div>

        <div className="header">Outline</div>

        <button type="button" className="btn btn-accent w-full" disabled={disabled} data-loading={loading}>
          <span>Accent</span>
        </button>

        <button type="button" className="btn btn-outline-accent w-full" disabled={disabled} data-loading={loading}>
          <span>Accent</span>
        </button>

        <button type="button" className="btn btn-primary w-full" disabled={disabled} data-loading={loading}>
          <span>Primary</span>
        </button>

        <button type="button" className="btn btn-outline-primary w-full" disabled={disabled} data-loading={loading}>
          <span>Primary</span>
        </button>

        <button type="button" className="btn btn-secondary w-full" disabled={disabled} data-loading={loading}>
          <span>Secondary</span>
        </button>

        <button type="button" className="btn btn-outline-secondary w-full" disabled={disabled} data-loading={loading}>
          <span>Secondary</span>
        </button>

        <button type="button" className="btn btn-danger w-full" disabled={disabled} data-loading={loading}>
          <span>Danger</span>
        </button>

        <button type="button" className="btn btn-outline-danger w-full" disabled={disabled} data-loading={loading}>
          <span>Danger</span>
        </button>
      </section>
    );
  }
}