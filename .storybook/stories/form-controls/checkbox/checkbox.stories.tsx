import type { Meta, StoryObj,  } from '@storybook/react';
import { useArgs, useMemo } from '@storybook/preview-api';
import { action } from '@storybook/addon-actions';
import { userEvent, within, expect } from '@storybook/test';
import { Checkbox, sleep } from '../../../../src';

const meta = {
  id: 'story-checkbox',
  title: 'Form Controls/Checkbox',
  component: Checkbox,

  args: {
    id: '',
    label: '',
    checked: false,
    disabled: false,
    rowReverse: false,
    size: 20,
    hint: '',
  },
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
    error: {
      control: 'text',
      type: 'string'
    },
    hint: {
      control: 'text',
      type: 'string'
    },
    size: {
      type: 'number',
      control: {
        type: 'range',
        min: 16,
        max: 50,
      },
    },
  } as unknown as any,
  parameters: {

  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  name: 'Basic Usage',
  args: {
    id: 'test-checkbox',
    label: 'I agree to the privacy policy and terms of use',
    error: '' as any,
  },
  argTypes: {
    ref: {
      control: { disable: true },
      value: { disable: true }
    },
    error: {
      control: { type: 'text' }
    }
  },
  parameters: {
    controls: {},
  },
  render: function Render(_) {
    const [{ id, error, checked, onChange, ...args }, updateArgs]  = useArgs();
    const validation = useMemo(() => {
      if (!error) return undefined;

      return { message: error };
    }, [error]);


    function onChangeCallback() {
      action('onchange', { depth: 0 })
      setTimeout(() => updateArgs({ checked: !checked }), 10)
    }

    return (
      <Checkbox
        id={id}
        error={validation}
        onChange={onChangeCallback}
        checked={checked}
        {...args}
      />
    );
  },
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByLabelText(args.label as string) as HTMLInputElement;
    checkbox.checked = false;

    await sleep(500);
    await expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox);

    await sleep(500);
    await expect(checkbox).toBeChecked()

    await userEvent.click(checkbox);
  }
};

