# stylable-scrollbar
Easy to use, and fully stylable custom JS scrollbar.

## INSTALLATION

```
 npm i stylable-scrollbar
```

## USAGE

Import:
```JS

```
Initialising:
```HTML
<!-- The stylable-scrollbar-scrollable attribute must have a value which acts as an ID. -->
<div stylable-scrollbar-scrollable="1"></div>
<!-- The stylable-scrollbar attribute must have a matching ID to it's scrollable container as seen above. -->
<div stylable-scrollbar="1" direction="horizontal">
    <div stylable-scrollbar-inner>
        <div stylable-scrollbar-handle></div>
    </div>
</div>

<div stylable-scrollbar-scrollable="2">
</div>
<!-- If a direction is not applied to the scrollbar, vertical is the default. -->
<div stylable-scrollbar="2" direction="vertical">
    <div stylable-scrollbar-inner>
        <div stylable-scrollbar-handle></div>
    </div>
</div>
```