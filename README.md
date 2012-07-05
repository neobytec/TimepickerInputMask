TimepickerInputMask
===================

A timepicker jQuery plugin with two modes: input mask, and with spinners for increase and decrease the time. 
You can also increase or decrease the time with the mousewheel.
The plugin doesn't uses css, only jQuery and the mousewheel event plugin from Brandon Aaron.

For use the plugin you only have to put this code on an input field.

    $('input').TimepickerInputMask();

This plugin, doesn't made use of css, only javascript, but if you needed it, you can add css styles.

The plugin has two properties for changing spinners colors, if you use this mode.

## Demos

You can find the following demos in jsfiddle.

* Input mask mode.
* Spinner mode.
* Loading a default value from the input.
* Change the spinners colors.
* Using a diferent separator.
* Using styles with the plugin.

## Options

The plugin has the following list of options:

* seconds:      Default true. If is set to true (default) show the seconds in the input.
* spinners:		Default false. If is set to true show the spinners to increase and decrease hours, minutes and seconds.
* separator:	Default ':'. Set the separator between hours, minutes and seconds.
* currentHour:	Default 'now', Set the initial hour. The default behaviour if this is no set and the input hasn't a default value i show the current hour. If the input has a value following the next format: HH[separator]mm[spearator]ss, this time will be load.
* bgcolor:		Default '#fff'. Set the color for the spinner background.
* arrowColor:	Default '#000'. Set the arrow color for the spinners.

## Dependences

This plugin depens of jQuery 1.7.1, of course, and from jQuery Mouse Wheel Plugin which is located in https://github.com/brandonaaron/jquery-mousewheel and has a MIT license like this plugin.

## Browsers

This plugin has been tested in:

* Internet Explorer 7+
* Firefox 3+
* Chrome 8+

## License

This plugin is licensed under the MIT License (LICENSE.txt).

Copyright (c) 2012 Víctor Bueno (http://blog.neobytec.com)