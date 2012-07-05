/**
 * TimepickerInputMask
 * 
 * @category   jquery
 * @package    plugin
 * @copyright  Víctor Bueno García 2012 neobytec@gmail.com http://www.neobytec.com
 * @license    MIT License (LICENSE.txt)
 * @version    1.0
 * 
 */
(function($) {
    $.fn.TimepickerInputMask = function(options) {
 
        var $element = null;

      	//Default options.
        var options = $.extend({
            seconds:		true,
            spinners:		false,
            separator:		':',
            currentHour:	null,
            bgcolor:		'#fff',
            arrowColor:		'#000'
        }, options);

        //Global vars for the time.
        var hours	= 0,
        	minutes = 0,
        	seconds	= 0;

        //Control position vars.
        var counter	= 2,
        	currentPosition = 0,
        	lastPosition = ((options.seconds) ? 2 : 1),
        	isActive = false;
 
		//Methods var with the events and common methods.
		var methods = {
			init:   function () {
				//Events.
				$element.bind('focus', methods.events.focus);
				$element.bind('blur', methods.events.blur);
				$element.bind('click', methods.events.focus);
				$element.bind('keydown', methods.events.keyDown);
				$element.bind('keyup', methods.events.keyUp);
				$(document).bind('mousewheel', methods.events.mousewheel);

				//Disabling drag and drop in the input.
				$element.bind('drag drop', function () {return false;});

				//Check if the value is valid including the specified separator.
				if (methods.checkHour($element.val())) {
					methods.parseValue($element.val());
				} else {
					//Check currentHour option
					if ((options.currentHour != 'now') && methods.checkHour(options.currentHour)) {
						methods.parseValue(options.currentHour);
					} else {
						//Show current hour.
						var date	= new Date();
						hours		= date.getHours();
						minutes		= date.getMinutes();
						seconds		= date.getSeconds();
					}
				}

				//Using spinners if the option is set.
				if (options.spinners) {
					methods.initSpinners();
				}
				
				methods.showValue();
			},
			events: {
				focus:		function (event) {
					//Puts on true the active flag, and set the current position to 0.
					isActive		= true;
					currentPosition = 0;
					
					event.preventDefault();
					if (!methods.checkHour($element.val())) {
						methods.showValue();
					}
					
					methods.setPosition(currentPosition);
				},
				blur:		function (event) {
					isActive = false;
				},
				keyDown:	function (event) {
					//Check if the key is numeric.
					if (((event.keyCode >= 48) && (event.keyCode <= 57)) || ((event.keyCode >= 96) && (event.keyCode <= 105))) {
						counter--;
					} else if (event.keyCode == 9) {
						//Tab key behaviour.
						if (currentPosition != lastPosition) {
							event.preventDefault();
							methods.setPosition(++currentPosition);
						} else {
							return true;
						}
						
					} else {
						return false;
					}
				},
				keyUp:		function (event) {
					if (counter <= 0) {
						counter = 2;

						if (methods.checkHour($element.val())) {
							methods.parseValue($element.val());

							if (currentPosition < lastPosition) {
								currentPosition++;
							}
						} else {
							methods.showValue();
						}

						methods.setPosition(currentPosition);
					}
				},
				mousewheel:	function (event, delta) {

					if (isActive) {
						var op = (delta == 1) ? 'up' : 'down';

						methods.changeValue(op);
					}
					
				},
				clickSpinner:	function (event) {
					var $target = $(event.currentTarget);
					var type	= $target.parent().attr('class');

					currentPosition = (type == 'hours') ? 0 : ((type == 'minutes') ? 1 : 2);
					methods.changeValue($target.attr('class'));							 
				}
			},
			//Check the time value with a regular expresion, using the separator too.
			checkHour:		function (value) {
				if ((value != null) && (value != undefined)) {
					var regexString	= '^([0-1]{1}[0-9]{1}|2[0-3]{1})\\' + options.separator + '[0-5]{1}[0-9]{1}' + 
						'(\\' + options.separator + '[0-5]{1}[0-9]{1})?$';
		
					var regex = new RegExp(regexString);
					
					return value.match(regex);
				}

				return false;
			},
			//Parse a text string with the specified separator.
			parseValue:		function (value) {
				if (value.indexOf(options.separator) != -1) {
					var hourParts = value.split(options.separator);
		
					hours	= parseInt(hourParts[0], 10);
					minutes = parseInt(hourParts[1], 10);
					seconds = (hourParts[2] != undefined) ? parseInt(hourParts[2], 10) : seconds;
				}
			},
			//Show the time in format hh[separator]mm[separator]ss
			showValue:	function (asText) {
				var finalValue = '';

				finalValue += ((hours < 10)		? '0' + hours	: hours) + options.separator;
				finalValue += ((minutes < 10)	? '0' + minutes	: minutes);

				if (options.seconds) {
					finalValue += options.separator + ((seconds < 10) ? '0' + seconds : seconds);		
				}

				if (asText) {
					return finalValue;
				}
				
				$element.val(finalValue);
			},
			//Selecting a text range.
			selectText:	function (start, end) {
				if	($element.get(0).createTextRange) {
		            var selRange = $element.get(0).createTextRange();
		            selRange.collapse(true);
		            selRange.moveStart('character', start);
		            selRange.moveEnd('character', end);
		            selRange.select();
		        } else if ($element.get(0).setSelectionRange) {
		        	$element.get(0).setSelectionRange(start, end);
		        } else if ($element.get(0).selectionStart) {
		        	$element.get(0).selectionStart	= start;
		        	$element.get(0).selectionEnd	= end;
		        }
			},
			//Select the current position.
			setPosition:	function (position) {
				var step			= options.separator.length,
					positionMinutes	= (2 + step),
					positionSeconds = positionMinutes + (2 + step);
				
				switch (position) {
					case 0:
					default:
						currentPosition = 0;
						methods.selectText(0, 2);
						break;
					case 1:
						currentPosition = position;
						methods.selectText(positionMinutes, positionMinutes + 2);
						break;
					case 2:
						currentPosition = position;
						methods.selectText(positionSeconds, positionSeconds + 2);
						break; 
				}
			},				
			initSpinners:	function () {
				//Increasing the distance between the hours part for include the spinner.
				options.separator = options.separator + options.separator + options.separator + options.separator; 
				
				//Current input position and size.
				var position		= $element.position(),
					height			= $element.height(),
					width			= $element.width();
				
				//Obtaining the text width to positioning the spinners.
				var valueToPrint	= methods.showValue(true),
					partsValue	 	= valueToPrint.split(options.separator),
					hoursPos		= methods.getTextWidth(partsValue[0]),
					minutesPos		= hoursPos + methods.getTextWidth(options.separator + partsValue[1]),
					secondsPos		= minutesPos + methods.getTextWidth(options.separator + partsValue[2]),
					separatorSize	= methods.getTextWidth(options.separator),
					borderTop		= parseInt($element.css('border-top-width').replace('px', '')),
					borderLeft		= parseInt($element.css('border-left-width').replace('px', ''));

				//Arrow positions and size.
				var	topUp			= (2 * height) / 21,
					topDown			= (12 * height) / 21,
					arrowSize		= (6 * height) / 21,
					arrowLeft		= (2 * height) / 21;
				
				//Templates to append with the options specified.
				var spinners		= '<div class="TimepickerInputMask.spinners" style="position: absolute; background: transparent;"></div>',
					arrowsContainer	= '<div style="position: absolute;background: ' + options.bgcolor + ';height: 100%;width: ' +
						separatorSize + 'px;top: 0;"></span>',
					upSpinner		= '<a href="javascript:;" class="up" style="position: absolute;width: 0;height: 0;border-left: ' + 
						arrowSize + 'px solid transparent;border-right: ' + arrowSize + 'px solid transparent;border-bottom: ' + 
						arrowSize + 'px solid ' + options.arrowColor + ';"></a>',
					downSpinner 	= '<a href="javascript:;" class="down" style="position: absolute;width: 0;height: 0;border-left: ' +
						arrowSize + 'px solid transparent;border-right: ' + arrowSize + 'px solid transparent;border-top: ' + 
						arrowSize + 'px solid ' + options.arrowColor + ';"></a>';

				//Main container of the spinner layer.
				var $spinnersContainer = $(spinners).appendTo($element.parent()).css({
					top:	position.top + borderTop,
					left:	position.left + borderLeft,
					height:	height + 2
				});

				//Hours spinner container.
				var $hoursContainer = $(arrowsContainer).appendTo($spinnersContainer).css({
					left:	hoursPos
				}).addClass('hours');					

				$(upSpinner).appendTo($hoursContainer).css({
					top:	topUp,
					left:	arrowLeft
				}).bind('click', methods.events.clickSpinner);
				
				$(downSpinner).appendTo($hoursContainer).css({
					top: 	topDown,
					left:	arrowLeft
				}).bind('click', methods.events.clickSpinner);

				//Minutes spinner container.
				var $minutesContainer = $(arrowsContainer).appendTo($spinnersContainer).css({
					left:	minutesPos
				}).addClass('minutes');						

				$(upSpinner).appendTo($minutesContainer).css({
					top:	topUp,
					left:	arrowLeft
				}).bind('click', methods.events.clickSpinner);
				
				$(downSpinner).appendTo($minutesContainer).css({
					top: 	topDown,
					left:	arrowLeft
				}).bind('click', methods.events.clickSpinner);

				//Seconds spinner container if options.seconds is true.	
				if (options.seconds) {
					var $secondsContainer = $(arrowsContainer).appendTo($spinnersContainer).css({
						left:	secondsPos
					}).addClass('seconds');

					$(upSpinner).appendTo($secondsContainer).css({
						top:	topUp,
						left:	arrowLeft
					}).bind('click', methods.events.clickSpinner);
					
					$(downSpinner).appendTo($secondsContainer).css({
						top: 	topDown,
						left:	arrowLeft
					}).bind('click', methods.events.clickSpinner);
				}
			},
			changeValue:	function (op) {
				//Increasing or decreasing the time values.
				switch (currentPosition) {
					case 0:
						hours = (op == 'up') ? ++hours : --hours;
						hours = (hours >= 24) ? 0 : ((hours < 0) ? 23 : hours);
						break;
					case 1:
						minutes = (op == 'up') ? ++minutes : --minutes;
						minutes = (minutes >= 60) ? 0 : ((minutes < 0) ? 59 : minutes);
						break;
					case 2:
						seconds = (op == 'up') ? ++seconds : --seconds;
						seconds = (seconds >= 60) ? 0 : ((seconds < 0) ? 59 : seconds);
						break;
				}

				methods.showValue();
				methods.setPosition(currentPosition);
			},
			getTextWidth:	function (text) {
				var $span	= $('<span>' + text + '</span>').appendTo($element.parent()).css({
					fontSize:	$element.css('font-size'),
					fontWeight:	$element.css('font-weight'),
					fontFamily:	$element.css('font-family')
				});						
				var width	= $span.width();
				$span.remove();
				return width;
			}
		};
 
        //Applying the function and returning the element for chaining.
        return this.each(function () {
            //Asign the element to a globar var.
            $element = $(this);
 
            //Init the plugin.
            methods.init();
        });
    };
})(jQuery);