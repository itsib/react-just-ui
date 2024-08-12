# react-just-ui

A set of html form elements for react, with support for react-hook-form.

## Features

- Simple integration
- Supports [react-hook-form](https://react-hook-form.com/)
- Elastic textarea
- Display validation error
- Simple styling width css variables
- Code size 12.03 kB (4.26 kB compressed)
- Style size 14.41 kB (2.69 kB compressed)

<img src="demo/public/screenshot.png">

## Installation

```shell
npm install react-just-ui
```

Add imports in index.tsx
```typescript jsx
import 'react-just-ui/theme-default';
import 'react-just-ui/styles';
```

## Usage

All the props are passed to the input inside the component, and the internal input is tipped out through the ref. So any component can be used as a regular form element.

```typescript jsx
<Input
    id="text-input"
    label="first_name"
    hint="first_name_hint"
    error={errors?.text}
    value={vaue}
    onChange={event => setValue(event.target.value)}
/>
```

There is a demo project in the demo [folder](./demo), where there are examples of using all form elements.