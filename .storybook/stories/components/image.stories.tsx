import { Image } from '../../../src/image';
import type { Meta, StoryObj } from '@storybook/react';
import { styled } from 'storybook/internal/theming';
import { ReportPopup } from '../../components/report-badge/report-popup';

const StoryWrapper = styled.div(({ theme }) => ({
  padding: '4rem 20px',
  minHeight: '200px',
  boxSizing: 'border-box',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const meta = {
  title: 'Components/Image',
  component: Image,
  parameters: {
    reportId: 'image',
    controls: {
      sort: 'alpha',
    },
  },
  argTypes: {
    src: {
      type: 'string',
      control: {type: 'select'},
      options: [
        '/images/avatar-1.png',
        '/images/fail-url.png',
        '/images/avatar-2.png',
        '/images/avatar-3.png',
        '/images/avatar-4.png',
        '/images/avatar-5.png',
        '/images/avatar-6.png',
        '/images/avatar-7.png',
        '/images/avatar-8.png',
        '/images/avatar-9.png',
        '/images/avatar-10.png',
      ],
    },
    size: {
      type: 'number',
      control: {
        type: 'range',
        min: 10,
        max: 200,
      },
    },
    border: {
      type: 'number',
      control: {
        type: 'range',
        min: 0,
        max: 8,
      },
    },
    loading: {
      type: 'boolean',
      control: {type: 'boolean'},
    },
    active: {
      control: {type: 'boolean'},
    },
    disabled: {
      control: {type: 'boolean'},
    },
  },
  args: {
    src: '/images/avatar-1.png',
    fallback: '/images/no-avatar.svg',
    size: 48,
    border: 0,
    loading: false,
    active: false,
    disabled: false,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof Image>;

export const Basic: Story = {
  args: {},
  render: function Render(args) {

    return (
      <div>
        <Image {...args} />
      </div>
    );
  },
};