TimepickerInputMask
===================

A timepicker jQuery plugin with two modes: input mask, and with spinners to go forward or back in time. 
You can also go forward or back in time with the mousewheel.
The plugin doesn't uses css, only jQuery and the mousewheel event plugin from Brandon Aaron.

To use the plugin you only have to type this code in an input field.

    $('input').TimepickerInputMask();

This plugin, doesn't made use of css, only javascript, but if you need it, you can add css styles.

The plugin has two properties for changing the color of the spinners, if you use this mode.

## Demos

You can find the following demos in samples.html.

* Input mask mode.
* Spinner mode.
* Loading a default value from the input.
* Changing the color of the spinners.
* Using a distinct separator.

## Options

The plugin has the following list of options:

* seconds:      Default true. If it is set to true (default) it shows the seconds in the input.
* spinners:		Default false. If it is set to true it shows the spinners to go forward or back in hours, minutes and seconds.
* separator:	Default ':'. Sets the separator between hours, minutes and seconds.
* currentHour:	Default 'now', Sets the initial hour. The default behaviour if this is not set and the input hasn't a default value it shows the current hour. If the input has a value following the next format: HH[separator]mm[spearator]ss, this time will be loaded.
* bgcolor:		Default '#fff'. Sets the color for the spinner background.
* arrowColor:	Default '#000'. Sets the arrow color for the spinners.

## Dependences

This plugin depends on jQuery 1.7.1, of course, and from jQuery Mouse Wheel Plugin which is located in https://github.com/brandonaaron/jquery-mousewheel and has a MIT license like this plugin.

## Browsers

This plugin has been tested in:

* I'm testing now...

## License

This plugin is licensed under the MIT License (LICENSE.txt).

Copyright (c) 2012 Víctor Bueno (http://blog.neobytec.com)