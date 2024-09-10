import { ThemeConfig } from '../theme.config';

export type Color = string | [number, number, number] | [number, number, number, number]

export interface ElementState<Prop> {
  default: Prop;
  hover: Prop;
  active: Prop;
  disabled: Prop;
}

export function update<T, P = Partial<T>>(def: T, update: { hover?: P, active?: P, disabled?: P} ): ElementState<T> {
  const { hover = {}, active = {}, disabled = {} } = update
  return {
    default: { ...def },
    hover: { ...def, ...hover },
    active: { ...def, ...active },
    disabled: { ...def, ...disabled },
  }
}

export function resolveVariable(name: string): string {
  const fields = name.split('-');
  let value: any = ThemeConfig.minimal;

  for (const field of fields) {
    if (field && value && field in value) {
      value = value[field];
    } else {
      break;
    }
  }

  if (typeof value === 'object' || value == null) {
    return 'none';
  } else if (typeof value === 'number') {
    return `${value}px`;
  } else {
    return value;
  }
}