import type { ReactNode } from 'react';

/**
 * Config for select option item
 *
 * @remarks
 * The interface defines the basic configuration for a select list item.
 *
 * @public
 */
export interface SelectOption {
  icon?: string | ReactNode;
  label?: string;
  value: string;
}