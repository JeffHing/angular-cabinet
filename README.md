<!-- Copyright 2015. Author: Jeffrey Hing. All Rights Reserved. MIT License -->

# AngularCabinetDirective

CabinetDirective is a directive which can be used to easily create a wide 
variety of user interface components that share a simple trait: toggle the
visibility of content when a trigger is invoked.
Examples include menus, tabs, navigation sidebars, etc. 

The idea behind cabinetDirective is to allow you, as a front-end developer,
to be nimble in the face of ever-changing user interface requirements.
By creating your own user interface components, rather than using off-the-shelf
components, you can easily adapt your component (or create new ones) whenever 
the need requires. As such, CabinetDirective does not provide a
particular UI look-and-feel, but rather provides the structure and 
behaviors needed to implement your component.

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

## Usage

### 
