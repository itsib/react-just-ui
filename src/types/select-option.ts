import React from 'react';

export interface SelectOption {
  icon?: string | React.JSX.Element;
  label?: string;
  value: string;
}