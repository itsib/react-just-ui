export interface ValidatorFn {
  (value: any, formValues: Record<string, any>): boolean | string | Promise<boolean | string>;
}