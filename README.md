Given the move towards web extensions and the deprecation of certain Add-on SDK features, I am no longer actively working on this. 

From [the announcement](https://blog.mozilla.org/addons/2015/08/21/the-future-of-developing-firefox-add-ons/)
>We will also continue supporting SDK add-ons **as long as they don’t use require(‘chrome’) or some of the low-level APIs that provide access to XUL elements**.

Emphasis mine. This is exactly what this custom button did. Old Readme below

---------


Menu Button For Firefox add-on SDK
==================================

The Firefox add-on SDK allows for simple action buttons and toggle buttons. This creates a menu-button instead, which displays an icon on the left and a drop-marker on the right, like so:

![Firefox menu-button](http://i.imgur.com/vvVeW0g.jpg?1)

How to use it
-------------

Place both files in the `lib` directory of your extension.  
Usage is similar to other button types. Include the following code in `main.js` (or any js file in the `lib` directory)

    const { MenuButton } = require('./menu-button');
    var btn = MenuButton({
      id: 'my-menu-button',
      label: 'My menu-button',
      icon: {
        "16": "./firefox-16.png",
        "32": "./firefox-32.png"
      },
      onClick: click
    });
    
The `click` function will be passed the same `state` object as the `toggle` and `action` buttons, and will be passed an additional boolean argument: `isMenu`. It should be used like so
     
    function click(state, isMenu) {
      if (isMenu) {
        //menu-button clicked
      } else {
        //icon clicked
      }
    }
