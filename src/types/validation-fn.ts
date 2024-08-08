export interface ValidationFn {
  (value: any, formValues: Record<string, any>): boolean | string | Promise<boolean | string>;
}