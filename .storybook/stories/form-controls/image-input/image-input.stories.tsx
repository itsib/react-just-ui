import { ImageInput } from '../../../../src';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

const meta = {
  title: 'Form Controls/Image Input',
  component: ImageInput,
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
    placeholder: {
      control: { type: 'text' },
    },
  },
  args: {
    placeholder: '',
    disabled: false,
    markRequired: false,
    loading: false,
    noPreview: false,
    hint: '',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageInput>;

export default meta;

type Story = StoryObj<typeof ImageInput>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    id: 'test-image-input',
    label: "Upload your photo",
    onChange: action('onChange'),
  },
  render: function Render(args) {
    const [file, setFile] = useState();

    useEffect(() => {
      console.log(file);
    }, [file]);

    return (
      <div style={{ width: 300 }}>
        <ImageInput {...args} onChange={e => setFile((e.target as any).files?.[0])} />
      </div>
    );
  }
};