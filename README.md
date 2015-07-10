<!-- Copyright 2015. Author: Jeffrey Hing. All Rights Reserved. MIT License -->

TODO: Check if handler is called on showing of first tab!!!!!

# AngularCabinetDirective

CabinetDirective is a directive which can be used to create a 
variety of user interface components that share a simple trait: show
content when a trigger is invoked.
Examples include accordions, menus, tabs, navigation sidebars, etc. 

The goal of cabinetDirective is to make it easy for front-end 
developers to create their own user interface components rather than use off-the-shelf
components. By creating their own components, front-end developers can easily 
adapt their components (or create new ones) in response to ever-changing user 
interface requirements. As such, CabinetDirective does not provide a UI 
style, but rather provides the structure and behaviors needed to implement a 
component. The front-end developer provides the CSS.

CabinetDirective is modeled on the concept of a cabinet of drawers. Content
to be shown is contained within a drawer, drawers are contained
within a cabinet. An open drawer shows the content. A closed drawer 
hides the content.


## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
   
## Features

* Simplifies creation of user interface components.
* Provides a consistent API across multiple components
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
from a horizontal list of tabs to show the content associated with each tab.

### 1. Add the Directives

Add the cabinet directives to an Angular module. When adding the directives,
you typically want to rename the directives to reflect the purpose of the
user interface component. In this case, the directive names are renamed to 
use tab names:

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

### 2. Add the HTML

Add the HTML with the directives. The optional drawer ids associated with the 
directives allows the elements to be moved around in any order but still 
maintain the correct relationship between trigger and content. For example, 
the tab triggers could be moved after the tab contents to display tabs at the 
bottom of the form instead.

This displays three tabs:

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

### 3. Add the CSS

Add the CSS for the classes associated with each element. To make it easy to 
apply your CSS, every directive automatically adds a class to its element based 
upon the directive's name. For example, the 'tab-trigger' directive adds
the 'tab-trigger' class to the element. When the tab is open, the
directive also adds the 'tab-trigger-open' class to the element.

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

### You're Done

That's it. What you can implement is really only limited by what CSS provides.


## Usage

### cabinet Directive

The cabinet directive contains the drawer directives. It manages
which drawers can be open based upon the option settings.

```html
<div cabinet>
    <div drawer-trigger></div>
    <div drawer-contents></div>
    <div drawer-class></div>
</div>

```

The following options can be passed into the cabinet directive:

```html
<div cabinet="{
    openOnHover: false,
    oneAlwaysOpen: false,
    allowMultipleOpen: true,
    openStates: {
        'myDrawer': true
        'myOtherDrawer': false
    }
}">
```

#### Option Definitions:

<dl>
    <dt>
    openOnHover
    </dt>
    <dd>
    True to open the drawer when the mouse pointer hovers over the 
    drawer trigger.
    </dd>
    
    <dt>
    oneAlwaysOpen
    </dt>
    <dd>
    True to ensure one drawer is always open. By default, it opens the first drawer 
    on startup.
    </dd>
    
    <dt>
    allowMutlipleOpen
    </dt>
    <dd>
    True to allow multiple drawers to be open at the same time. Otherwise allow
    only one drawer to be open at a time.
    </dd>
    
    <dt>
    openStates
    </dt>
    <dd>
    Allows you to specify which drawers to open or close. The key is the
    drawer id, and the value is a boolean indicating the open state of the 
    drawer.
    </dd>
</dl>

### drawerTrigger Directive

The drawerTrigger directive triggers the opening or closing of the 
drawer contents. It is usually applied to an anchor or button element to 
ensure that keyboard navigation works properly, but it can be applied
to any element.

```html
<a drawer-trigger href=""></a>

```

A drawer id can be assigned to the directive to allow other directives 
to associate themselves with this specific trigger. The drawer id can be 
any string or number. A number is automatically converted to a string.

```html
<a drawer-trigger="0" href=""></a>
```

It's legal to assign multiple drawerTrigger directives the same drawer id:

```html
<a drawer-trigger="0" href="">trigger A</a>
<a drawer-trigger="0" href="">trigger B</a>
```

### drawerContents Directive

The drawerContents directive shows or hides its contents as indicated by
the the associated drawer trigger.

```html
<div drawer-contents></div>
```
A drawer id can be assigned to the directive to associate it with a 
drawerTrigger directive. The drawer id can be any string or number. A
number is automatically converted to a string.

```html
<div drawer-contents="0"></div>
```

If no drawer id is is assigned, the drawerContents directive associates itself 
with the preceding drawerTrigger directive.

You can assign multiple drawerContent directives the same drawer id:

```html
<div drawer-contents="0">contents A</div>
<div drawer-contents="0">contents B</div>
```

To be notified when the contents of a drawer is shown or hidden, pass in a handler
function to the drawerContents directive:

```javascript```
angular.module('app', []).controller('MyController', function() {
    this.myHandler = function(state) {
        if (state === 'closed') {
            ...    
            // I'm not ready to be closed.
            return false;
        }
        ...
    }
});
```

```html
<div drawer-contents="ctrl.myHandler" 
     ng-controller="MyController as ctrl">...</div>

```

The handler function will be passed an open state of either 'open' or 'closed'.
You can prevent the drawer from being closed by returning the value
`false` from the handler function.

If you need to specify both a drawer id and a handler function, 
use array notation:

```html
<div drawer-contents="[0, ctrl.myHandler]"></div>
```


### drawerClass Directive

```html

```

### The Factory Method

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


