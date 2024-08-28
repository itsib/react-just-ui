// Copyright (c) Example Company. All rights reserved. Licensed under the MIT license.
/**
 * Validation functions for form fields.
 *
 * @remarks
 * Functions for checking fields for pattern matching.
 * The functions perform the initial input check, so there are no heavy
 * operations, but there is a regular expression for matching the
 * pattern. The functions are compatible with the
 * {@link https://www.npmjs.com/package/react-hook-form | react-hook-form} package
 *
 * @packageDocumentation
 */

export * from './types.ts';
export * from './email';
export * from './url';
export * from './address';
export * from './merge';