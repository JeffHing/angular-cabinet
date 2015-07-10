<!-- Copyright 2015. Author: Jeffrey Hing. All Rights Reserved. MIT License -->

TODO: Check if handler is called on showing of first tab!!!!!

# AngularCabinetDirective

CabinetDirective is a directive which can be used to create a 
variety of user interface components that share a simple trait: show
or hide content when a trigger is invoked.
Examples include accordions, menus, tabs, navigation sidebars, etc. 

The goal of cabinetDirective is to make it easy for you, the front-end 
developer, to create your own user interface components rather than use off-the-shelf
components. By creating your own user interface components, you can easily 
adapt your components (or create new ones) to meet the demands of changing user 
interface requirements. As such, CabinetDirective does not provide a UI 
style, but rather provides the structure and behaviors needed to implement a 
component. You provide the CSS.

CabinetDirective is modeled on the concept of a cabinet of drawers. Content
to be shown is contained within a drawer, drawers are contained
within a cabinet. An open drawer shows the content. A closed drawer 
hides the content.


## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Example](#example)
- [Examples List](#examples-list)
- [Usage](#usage)
    - [cabinet Directive](#cabinet-directive)
    - [drawerTrigger Directive](#drawerTrigger-directive)
    - [drawerContents Directive](#drawerContents-directive)
    - [drawerClass Directive](#drawerClass-directive)
    - [Factory Method](#factory-method)
   
## Features

* Simplifies creation of user interface components that show or hide content.
* Provides a consistent API across multiple user interface components
* Compatible with CommonJS, AMD, and non-module build environments.

## Installation

To install the package:

    npm install angular-cabinet-directive
    
To require the package:    

```javascript
var cabinetDirective = require("angular-cabinet-directive");
```     

## Example

The easist way to understand how cabinetDirective works is to walk 
through a quick example of creating a "tabs" directive which allows the user to select
from a horizontal list of tabs.

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/tabs.png)

### 1. Add the Tab Directives

When adding the directives to an Angular module, you typically want to name 
the directives to reflect the purpose of the user interface component. 
In this case, the default directive names are renamed to use tab names:

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

### 2. Create the HTML Structure

How the HTML is structured depends upon the layout of the particular user 
interface component and the limits of CSS.

For tabs that appear at the top of the content, we need to specify the
tabTrigger directives before the tabContents directives.

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

The optional drawer ids associated with the directives allows the elements to 
be moved around in any order but still maintain the correct relationship between
trigger and content.

### 3. Create the CSS

To make it easy to create the CSS rules, every directive (except drawerClass)
automatically adds a class to its element based upon the directive's name. 
For example, by default, the tabTrigger directive adds the 'tab-trigger' 
class to the element. When the tab is open, the directive adds the 
'tab-trigger-open' class to the element.

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

That's it. You're done.

## Examples List

What you can implement is limited by what can be achieved through CSS. 
Here are the examples provided in the GitHub project for 
angular-cabinet-directive.

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/accordion.png)

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/menus.png)

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/sidebar.png)

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/tabs.png)



## Usage

### Factory Method

The `cabinetDirective()` factory method allows you to add a cabinet directive and
its drawer directives to any Angular module.

To add the directives to an Angular module, call `cabinetDirective()` with
the name of the Angular module, and any options:

```javascript
cabinetDirective('app', options);
```

The options object can consist of any of the following properties:

```javascript
var options = {
    openOnHover: <boolean>,
    oneAlwaysOpen: <boolean>,
    allowMultipleOpen: <boolean>,
    openStates: {
        <string>: <boolean>
    },
    directiveNames: {
        cabinet: <string>,
        drawerTrigger: <string>,
        drawerContents: <string>,
        drawerClass: <string>
    }
};
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
    True to allow multiple drawers to be open at the same time.
    </dd>
    
    <dt>
    openStates
    </dt>
    <dd>
    Allows you to specify which drawers should be open. The key is the
    drawer id, and the value should be true.
    </dd>
    
    <dt>
    directiveNames
    </dt>
    <dd>
    Allows you to rename the directives when they are added to the module. The
    key is the default directive name, and the value is the new directive name.
    </dd>
</dl>

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
    openOnHover: <boolean>,
    oneAlwaysOpen: <boolean>,
    allowMultipleOpen: <boolean>
    openStates: {
        <string>: <boolean>
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
    True to allow multiple drawers to be open at the same time. 
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
to associate themselves with this specific drawerTrigger directive. 
The drawer id can be any string or number. A number is automatically 
converted to a string.

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
specific drawerTrigger directive. The drawer id can be any string or number. A
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

The drawerClass directive assigns a particular class to the element depending
upon if the drawer is opened or closed.

```html
<div drawer-class="['myOpenClass', 'myClosedClass']"></div>

```
A drawer id can be assigned to the directive to associate it with a 
specific drawerTrigger directive. The drawer id can be any string or number. A
number is automatically converted to a string.

```html
<div drawer-class="[0, 'myOpenClass', 'myClosedClass']"></div>
```

If no drawer id is is assigned, the drawerClass directive associates itself 
with the preceding drawerTrigger directive.

