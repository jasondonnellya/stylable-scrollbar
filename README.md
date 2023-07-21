# stylable-scrollbar

Easy to use, super lightweight (only 4KB~ for UMD Module) and fully stylable, customisable JS scrollbar.

Once you define your scrollbar and scrollbar scrollable containers with the same ID, as can be seen in the examples,
you can easily place them anywhere on the page and style them to your liking.

You can even add more HTML inside the defined scrollbars and style that too. e.g. icons, backgrounds, extra buttons etc.

## INSTALLATION

```
npm i stylable-scrollbar
```

## USAGE

### Import

ESM

```JS
import initStylableScrollbars from 'stylable-scrollbar'
initStylableScrollbars()
```

CJS

```JS
const initStylableScrollbars = require('stylable-scrollbar')
initStylableScrollbars()
```

Vanilla JS

```HTML
<script src="https://unpkg.com/stylable-scrollbar@1.0.3/dist/umd/index.umd.js"></script>
<script>
    window.initStylableScrollbars()
</script>
```

### Example

Check out a minimal example at https://jasondonnellya.github.io/stylable-scrollbar/ and below is a basic usage
example containing two seperate scrollbars.

```HTML
<!-- The stylable-scrollbar-scrollable attribute must have a value which acts as an ID. -->
<div stylable-scrollbar-scrollable="example"></div>

<!-- The stylable-scrollbar attribute must have a matching ID to it's scrollable container as seen above. -->
<div stylable-scrollbar="example" direction="horizontal">
    <div stylable-scrollbar-handle></div>
</div>



<div stylable-scrollbar-scrollable="2"></div>

<!-- If a direction is not applied to the scrollbar, vertical is the default. -->
<div stylable-scrollbar="2" direction="vertical">
    <div stylable-scrollbar-handle></div>
</div>
```

## DOCUMENTATION

### Attributes

#### stylable-scrollbar-scrollable

(*) Requires a value that acts as an 'id' matching the scrollable container.

#### stylable-scrollbar

(*) Requires a value that acts as an 'id' matching the scrollable container.

#### stylable-scrollbar-handle

The handle of the scrollbar.

#### direction

The direction which the scollbar scrolls. ("horizontal", "vertical") defaults to "vertical".

### Settings

It is possible to pass an object that contains settings for stylable-scrollbar as shown.

```
initStylableScrollbars({ keepContainerScrollbars: true })
```

#### keepContainerScrollbars: Boolean

This will ignore the CSS that is generated to remove scrollbars from any element with selector [stylable-scrollbar-scrollable] so you can keep the default scrollbars within the containers.

### Custom CSS.

It is easy to target all the built in HTML of stylable-scrollbar using the attribute selector, see below example.

```CSS
:root {
  --width: 300px;
  --height: 20px;
}

[stylable-scrollbar-scrollable] {
  width: var(--width);
  height: var(--width);
  padding: 10px;
  background: rgb(240, 240, 240);
}

[stylable-scrollbar] {
  width: var(--width);
  height: var(--height);
  background: lightgray;
  border: solid transparent 0px;
  border-radius: 20px;
}
[stylable-scrollbar-handle] {
  width: 40px;
  height: 20px;
  background: darkgrey;
  border: solid transparent 0px;
  border-radius: 20px;
  box-shadow: 0px 0px 5px 1px black;
}

[stylable-scrollbar] [direction="vertical"] {
  width: var(--height);
  height: var(--width);

  [stylable-scrollbar-handle] {
    width: 20px;
    height: 40px;
  }
}
```

## SUPPORT

If you notice any constraints or bugs with this scrollbar, or you would just like to suggest features, don't hesitate
to open an issue on the GitHub repository. Thanks!
