# Form Builder

- [Overview](#Overview)
- [Installation](#Installation)
- [Usage](#Usage)

## Overview

A small and simple form builder, written in pure Vanilla JavaScript (web components).

The idea with this form builder is to be able to build framework agnostic forms. You can reuse the same component with React, Angular, Vanilla JS...etc.
The way how it works is that you have to pass configuration and set of controls that you want to display and the rest is handled by the form builder.

## Installation

Install with npm:

`npm i clean-web-ui-form-builder --save`

## Usage

If you are using typescript, in your main.ts (or simular) file:

```JS
import 'clean-web-ui-form-builder';
import { initFormBuilder } from 'clean-web-ui-form-builder';

// this will register the web component
initFormBuilder();
```

With JavaScript, just import the script in the html body:

```HTML
<script src="clean-web-ui-form-builder.js"></script>
<script>
// this will register the web component
initFormBuilder();
</script>
```
