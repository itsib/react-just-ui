
<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/itsib/react-just-ui/raw/refs/heads/master/.storybook/public/images/brand-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/itsib/react-just-ui/raw/refs/heads/master/.storybook/public/images/brand-dark.svg">
  <img alt="React Just UI" src="https://github.com/itsib/react-just-ui/raw/refs/heads/master/.storybook/public/images/brand-light.svg" width="240" height="60">
</picture>

---

[![npm version](https://badge.fury.io/js/react-just-ui.svg)](https://badge.fury.io/js/react-just-ui)
[![Publish](https://github.com/itsib/react-just-ui/actions/workflows/main.yaml/badge.svg?event=push)](https://github.com/itsib/react-just-ui/actions)

UI components library for react.

## Features

- Simple integration
- Supports [react-hook-form](https://react-hook-form.com/)
- Elastic textarea
- Simple styling width css variables
- Display validation error

## Installation

```shell
npm install react-just-ui
```

Add imports in index.tsx

```typescript jsx
import 'react-just-ui/theme/minimal.css';
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