import { Textarea } from 'react-just-ui';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { memo, useEffect } from 'react';

type Story = StoryObj<typeof Textarea>;

interface BaseStoryProps {
  id: string;
  disabled?: boolean;
  loading?: boolean;
}

const meta = {
  title: 'Form Controls/Textarea',
  component: Textarea,
  parameters: {
    controls: {
      sort: 'alpha',
    }
  },
  argTypes: {
    id: { required: true, type: 'string' },
    label: {
      control: { type: 'text' },
    },
    placeholder: {
      control: { type: 'text' },
    },
  },
  args: {
    id: 'textarea-id',
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

const BaseStory = memo(function BaseStory({ id, disabled, loading }: BaseStoryProps) {
  const { register, formState, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      textarea: '',
    }
  });
  const { errors } = formState;

  useEffect(() => {
    const { unsubscribe } = watch(({ textarea: _ }, { name, type }) => {
      if (name === 'textarea' && type) {
        action(type)
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={{ width: 300 }}>
      <Textarea
        id={id}
        label="Overview"
        placeholder="Placeholder..."
        loading={loading}
        maxHeight={300}
        limit={50}
        error={errors?.textarea}
        {...register('textarea', {
          required: 'Field is required',
          disabled: !!disabled,
        })}
      />
    </div>
  );
});

export const Basic: Story = {
  args: {
    id: 'textarea-id',
    onChange: action('onChange'),
  },
  render: ({ id, disabled, loading }) => <BaseStory id={id} loading={loading} disabled={disabled} />
};



