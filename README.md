<!-- Copyright 2015. Author: Jeffrey Hing. All Rights Reserved. MIT License -->

# AngularCabinetDirective

AngularCabinetDirective is a set of directives that can be used to create a 
wide variety of user interface components that share a simple trait: show
or hide content when a trigger is invoked.
Examples include accordions, menus, tabs, navigation sidebars, etc. 

AngularCabinetDirective is modeled after the structure of a cabinet of drawers 
which has the following properties:

* A cabinet contains one or more drawers.
* A drawer contains content.
* An open drawer shows the content. 
* A closed drawer hides the content. 

Applying CSS to this structure can emulate many existing user interface 
components, and allows for the creation of many others.

A goal of AngularCabinetDirective is to make it easy for you, a front-end 
developer, to create your own user interface components
rather than use off-the-shelf components. By creating your 
own user interface components, you can easily adapt your components (or create 
new ones) to meet the demands of changing user 
interface requirements. As such, AngularCabinetDirective does not provide a UI 
style, but rather provides the structure and behaviors needed to implement a 
cabinet-like component. It's entirely up to you what CSS rules are applied.



## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Example](#example)
- [Provided Examples](#provided-examples)
- [Usage](#usage)
    - [Factory Method](#factory-method)
    - [Cabinet Directive](#cabinet-directive)
    - [DrawerTrigger Directive](#drawerTrigger-directive)
    - [DrawerContents Directive](#drawerContents-directive)
    - [DrawerClass Directive](#drawerClass-directive)
   
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

The easist way to understand how AngularCabinetDirective works is to walk 
through a quick example of creating a "tabs" directive which allows the user 
to select from a horizontal list of tabs.

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/tabs.png)

### 1. Add the Directives

First, add the directives from AngularCabinetDirective to an Angular module.
The directive names should reflect the purpose of the user interface component.
In this case, the  default directive names are renamed to use tab names:

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

Next, structure the HTML based on the layout of the particular user 
interface component and the demands of CSS.

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

Lastly, create the CSS rules using the default class names. Every directive
(except drawerClass) automatically adds a class to its element based upon the
directive's name. For example, by default, the tabTrigger directive adds the 
'tab-trigger' class to the element. When the tab is open, the directive adds 
the 'tab-trigger-open' class to the element.

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

## Provided Examples

Here are the
[examples](https://github.com/JeffHing/angular-cabinet-directive/tree/master/src/examples)
provided in the
[AngularCabinetDirective](https://github.com/JeffHing/angular-cabinet-directive/tree/master/src/examples) GitHub project.

### Accordion

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/accordion.png)

[Source code](https://github.com/JeffHing/angular-cabinet-directive/tree/master/src/examples/accordionDirective)

### Menus

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/menus.png)

[Source code](https://github.com/JeffHing/angular-cabinet-directive/tree/master/src/examples/menusDirective)

### Sidebar

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/sidebar.png)

[Source code](https://github.com/JeffHing/angular-cabinet-directive/tree/master/src/examples/sidebarDirective)

### Tabs

![alt tag](https://raw.githubusercontent.com/JeffHing/angular-cabinet-directive/master/src/examples/images/tabs.png)

[Source code](https://github.com/JeffHing/angular-cabinet-directive/tree/master/src/examples/tabsDirective)

## Usage

### Factory Method

The `cabinetDirective()` factory method adds a cabinet directive and
the drawer directives to any Angular module.

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

These options (except directiveNames) can be overridden by each usage
of the cabinet directive. See [Cabinet Directive](cabinet-directive).

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

### Cabinet Directive

The cabinetDirective identifies the element as a cabinet which contains
one or more drawer directives. It is responsible for determining which
drawers should be opened or closed based upon the drawers' open states and
user specified policy options. For applying CSS rules, it adds the 'cabinet' 
class to the element.

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

### DrawerTrigger Directive

The drawerTrigger directive toggles the opening and closing of the
drawer. It adds mouse and focus event handlers to the element
to know when the directive has been triggered. For applying CSS rules,
it adds a 'drawer-trigger' class to the element, and a
'drawer-trigger-open' class to the element when the drawer is opened.

The drawerTrigger directive is usually applied to an anchor or button element to 
ensure that keyboard navigation works properly, but it can be applied
to any element.

```html
<a drawer-trigger href=""></a>

```
A drawer id can be assigned to the directive to associate it with a specific drawer. Directives that share the same drawer id, share the open state of that drawer. The drawer id can be any string or number. A number
is automatically converted to a string.

```html
<a drawer-trigger="0" href=""></a>
```

A drawer can have multiple triggers by assigning the same drawer id to the
directives.

```html
<a drawer-trigger="0" href="">trigger A</a>
<a drawer-trigger="0" href="">trigger B</a>
```

### DrawerContents Directive

The drawerContents directive contains the contents of the drawer.
For applying CSS rules, it adds a 'drawer-contents' class to the element,
and a 'drawer-contents-open' class to the element when the drawer 
is opened.

```html
<div drawer-contents></div>
```
A drawer id can be assigned to the directive to associate it with a 
specific drawer. Directives that share the same drawer id, share the
open state of that drawer. The drawer id can be any string or number. A number
is automatically converted to a string.

```html
<div drawer-contents="0"></div>
```

A drawer can have multiple contents by assigning the drawerContents directives 
the same drawer id:

```html
<div drawer-contents="0">contents A</div>
<div drawer-contents="0">contents B</div>
```
If no drawer id is assigned, the drawerContents directive associates itself 
with the drawer of the preceding drawerTrigger directive.

To be notified when the contents of a drawer is shown or hidden, pass in a handler
function to the drawerContents directive. The handler function will be passed 
an open state of either 'open' or 'closed'. You can prevent the drawer from 
being closed by returning the value `false` from the handler function.

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

If you need to specify both a drawer id and a handler function, 
use array notation:

```html
<div drawer-contents="[0, ctrl.myHandler]"></div>
```

### DrawerClass Directive

The drawerClass directive assigns a particular class to the element whenever
the open state of the drawer changes.

```html
<div drawer-class="['myOpenClass', 'myClosedClass']"></div>

```
A drawer id can be assigned to the directive to associate it with a specific
drawer. Directives that share the same drawer id, share the
open state of that drawer. The drawer id can be any string or number. A number
is automatically converted to a string.

```html
<div drawer-class="[0, 'myOpenClass', 'myClosedClass']"></div>
```

If no drawer id is assigned, the drawerClass directive associates itself 
with the drawer of the preceding drawerTrigger directive.

An example of using the drawerClass directive is in the
[accordion](https://github.com/JeffHing/angular-cabinet-directive/tree/master/src/examples/accordionDirective).
It uses the drawerClass directive to change the Font Awesome chevron icon
depending upon the current open state of the drawer:

```html
 <i class="fa" accordion-class="[
            'fa-chevron-down',
            'fa-chevron-right']"></i>
```
