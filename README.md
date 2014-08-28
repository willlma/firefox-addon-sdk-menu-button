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