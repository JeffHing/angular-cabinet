<!-- Copyright 2015. Author: Jeffrey Hing. All Rights Reserved. MIT License -->

# AngularCabinetDirective

CabinetDirective is a directive which can be used to easily create a wide 
variety of user interface components that share a simple trait: show
content when a trigger is invoked.
Examples include menus, tabs, navigation sidebars, etc. 

The motiviation behind cabinetDirective is to allow, you, as a front-end developer,
to be nimble in the face of ever-changing user interface requirements.
By creating your own user interface components, rather than using off-the-shelf
components, you can easily adapt your component (or create new ones) whenever 
the need requires. As such, CabinetDirective does not provide a
UI look-and-feel, but rather provides the structure and 
behaviors needed to implement a component. You provide the CSS.

CabinetDirective is modeled on the concept of a cabinet of drawers. Content
to be shown is contained within a drawer, drawers are contained
within a cabinet. An open drawer shows the content. A closed drawer 
hides the content.


## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
   
## Features

* Compatible with CommonJS, AMD, and non-module build environments.

## Installation

To install the package:

    npm install angular-cabinet-directive
    
To require the package:    

```javascript
var cabinetDirective = require("angular-cabinet-directive");
```     

## A Quick Example

The easist way to understand how cabinetDirective works is to walk 
through a quick example of creating a "tabs" directive which allows the user to select
from a horizontal list of tabs to show the content associated with the tab.

### Add the Directive

Add a cabinetDirective to the 'app' Angular module, but rename the directive
to use tab names:

```javascript
cabinetDirective('app', {
    oneAlwaysOpen: true,

    directiveNames: {
        cabinet: 'tabs',
        drawerTrigger: 'tabTrigger',
        drawerContents: 'tabContents',
        drawerClass: 'tabClass'
    }
});
```    

### Add the HTML

Add the tab directives to the HTML. This example will display three tabs:

```html
<div tabs>
    <a tab-trigger="0" href="">Tab 1</a>
    <a tab-trigger="1" href="">Tab 2</a>
    <a tab-trigger="2" href="">Tab 3</a>

    <div tab-contents="0">
        Lorem ipsum dolor sit amet...
    </div>
    <div tab-contents="1">
        Duis aute irure dolor in...
    </div>
    <div tab-contents="2">
        Sed ut perspiciatis unde...
    </div>
</div>
```

### Add the CSS

By default, every directive automatically adds a class to its element based 
upon the directive's name. For example, the 'tab-trigger' directive adds
the 'tab-trigger' class to the element. When the tab is opened, the
'tab-trigger-open' class is added to the element.

```css
.tab-trigger {
    border-top: 1px solid #d0d0d0;
    border-right: 1px solid #d0d0d0;
    border-left: 1px solid #d0d0d0;
    color: inherit;
    cursor: pointer;
    display: inline-block;
    padding: 6px;
    position: relative;
    text-align: center;
    text-decoration: none;
    top: 1px;
    width: 70px;
}

.tab-trigger-open {
    background-color: #f4f4f4;
}

.tab-contents {
    background-color: #f4f4f4;
    border: 1px solid #d0d0d0;
    display: none;
    padding: 10px;
}

.tab-contents-open {
    display: block;
    left: 0;
}
```


## Usage

### Directives

#### cabinet
```html
```

#### drawerTrigger
```html
```
#### drawerContents
```html
```
#### drawerClass
```html
```

### Adding the Directive

To add a cabinetDirective directive to an Angular module, call `cabinetDirective()` with
the name of the Angular module, and any options:

```javascript
    cabinetDirective('app', options);
```

### Directive Options

The options object can consist of any of the following properties:

```javascript
    var options = {
        openOnHover: false,
        oneAlwaysOpen: false,
        allowMultipleOpen: false,
        openStates: {},
        directiveNames: {
            cabinet: '...',
            drawerTrigger: '...',
            drawerContents: '...',
            drawerClass: '...'
        }
    };
```

#### openOnHover

True to open the drawer when the mouse pointer hovers over the drawer trigger.

#### oneAlwaysOpen

True to ensure one drawer is always open. By default, it opens the first drawer 
on startup.

#### allowMultipleOpen

True to allow multiple drawers to be open at the same time. Otherwise allow
only one drawer to be open at a time.

#### openStates

Specify whether one or more drawers should be opened by default. The drawer
is identified by a drawer id, and the open state should be true.

```javscript
    openStates: {
        'myDrawerId': true
    }
```
#### directiveNames

### HTML Structure

#### Natural Mapping

#### Forced Mapping

```html
<div tabs>
    <a tab-trigger="0" href="">Tab 1</a>
    <a tab-trigger="1" href="">Tab 2</a>
    <a tab-trigger="2" href="">Tab 3</a>

    <div tab-contents="0">
        Lorem ipsum dolor sit amet...
    </div>
    <div tab-contents="1">
        Duis aute irure dolor in...
    </div>
    <div tab-contents="2">
        Sed ut perspiciatis unde...
    </div>
</div>
```


