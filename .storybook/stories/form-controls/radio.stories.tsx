import { RadioButton } from '../../../src/radio';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta = {
  id: 'story-radio-button',
  title: 'Form Controls/Radio Button',
  component: RadioButton,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    checked: false,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioButton>;

export default meta;

type Story = StoryObj<typeof RadioButton>;

export const Basic: Story = {
  args: {
    id: 'test-radio-button',
    disabled: false,
    rowReverse: false,
    hint: '',
    onChange: action('onChange'),
  },
  render: function Render(args) {
    const { id, onChange: _onChange, ...props } = args;
    const [value, setValue] = useState('Winter');

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
      console.log(event);
      setValue((event.target as any).value);
      _onChange?.(event);
    }

    return (
      <div style={{ minWidth: '300px', padding: '1.5rem 2rem' }}>
        <p style={{ color: 'rgb(var(--jui-label-rgb))', marginTop: '0' }}>Pick your favorite season</p>
        <RadioButton {...props} id={`${id}-1`} label="Winter" value="Winter" checked={value === 'Winter'} onChange={onChange} />
        <RadioButton {...props} id={`${id}-2`} label="Spring" value="Spring" checked={value === 'Spring'} onChange={onChange} />
        <RadioButton {...props} id={`${id}-3`} label="Summer" value="Summer" checked={value === 'Summer'} onChange={onChange} />
        <RadioButton {...props} id={`${id}-4`} label="Autumn" value="Autumn" checked={value === 'Autumn'} onChange={onChange} />

        <div style={{ color: 'rgb(var(--jui-label-rgb))', marginTop: '1rem' }}>Your favorite season is: {value}</div>
      </div>
    );
  },
};
