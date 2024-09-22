import type { Meta, StoryObj } from '@storybook/react';

interface TooltipControls {
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right',
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
  title: 'Components/Tooltip',
  parameters: {
    docs: {
      description: {
        component: description,
      }
    },
    controls: {
      sort: 'alpha',
    }
  },
  argTypes: {
    text: {
      name: 'aria-label',
      description: 'The text of the popup hint',
      type: { name: 'string', required: true },
      control: { type: 'text' },
    },
    position: {
      name: 'data-position',
      description: 'The position of the hint. <br>Can be <b>top</b>, <b>bottom</b>, <b>left</b>, <b>right</b>',
      type: { required: true, name: 'enum', value: ['top', 'bottom', 'left', 'right'] },
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
    },
    width: {
      name: 'data-width',
      description: 'Sets the width of the tooltip. It will be useful for content of different sizes.',
      type: {
        name: 'enum',
        value: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
  args: {
    text: 'Tooltip text',
    position: 'top',
    width: 'md',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<TooltipControls>;

export const Basic: Story = {
  args: {
    position: 'top',
  },

  render: function Render(args) {

    return (
      <section style={{ padding: '20px' }}>
        <div aria-label={args.text} data-position={args.position} data-width={args.width}>
          <img src="/images/question.svg" alt="" />
        </div>
      </section>
    );
  }
};