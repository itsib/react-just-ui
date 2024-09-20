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
  /**
   * Option icon image
   */
  icon?: ReactNode;
  /**
   * Option text label. If empty value property will be used.
   */
  label?: string;
  /**
   * Value for this option
   */
  value: string;
}