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
 
    	//Html elements, first the original after the spinner element and the last is the current element.
        var $element		= null,
        	$spinnerElement = null,
        	$currentElement = null;

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

        //Control position vars, flag of focus and spinnerSeparator.
        var counter				= 2,
        	currentPosition 	= 0,
        	lastPosition 		= ((options.seconds) ? 2 : 1),
        	isActive 			= false,
        	spinnerSeparator	= options.separator;
 
		//Methods var with the events and common methods.
		var methods = {
			init:   function () {
				$currentElement = $element;
				//Using spinners if the option is set.
				if (options.spinners) {
					methods.initSpinners();
					$currentElement = $spinnerElement;
				}
				
				//Events.
				$currentElement.bind('focus', methods.events.focus);
				$currentElement.bind('blur', methods.events.blur);
				$currentElement.bind('click', methods.events.focus);
				$currentElement.bind('keydown', methods.events.keyDown);
				$currentElement.bind('keyup', methods.events.keyUp);
				$(document).bind('mousewheel', methods.events.mousewheel);
	
				//Disabling drag and drop in the input.
				$currentElement.bind('drag drop', function () {return false;});
	
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
			//Show the time in format hh[separator]mm[separator]ss always show in both input if we used spinners.
			showValue:	function (asText, showSpinner) {
				
				var time = [
				            ((hours < 10) ? '0' + hours	: hours),
				            ((minutes < 10)	? '0' + minutes	: minutes)
				];
				
				if (options.seconds) {
					time[2] = ((seconds < 10) ? '0' + seconds : seconds);
				}
				
				if (options.spinners) {
					$spinnerElement.val(time.join(spinnerSeparator));
				}
				
				if (asText) {
					return (showSpinner) ? time.join(spinnerSeparator) : time.join(options.separator);
				}
				
				$element.val(time.join(options.separator));
			},
			//Selecting a text range.
			selectText:	function (start, end) {
				if	($currentElement.get(0).createTextRange) {
		            var selRange = $currentElement.get(0).createTextRange();
		            selRange.collapse(true);
		            selRange.moveStart('character', start);
		            selRange.moveEnd('character', end);
		            selRange.select();
		        } else if ($currentElement.get(0).setSelectionRange) {
		        	$currentElement.get(0).setSelectionRange(start, end);
		        } else if ($currentElement.get(0).selectionStart) {
		        	$currentElement.get(0).selectionStart	= start;
		        	$currentElement.get(0).selectionEnd		= end;
		        }
			},
			//Select the current position.
			setPosition:	function (position) {
				var step			= (options.spinners) ? spinnerSeparator.length : options.separator.length,
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
				spinnerSeparator = options.separator + options.separator + options.separator + options.separator;
				
				//Duplicating the input and hide the original.
				$spinnerElement = $element.clone().attr('name', 'spinnerElement'); 
				
				//Current input position and size.
				var position		= $element.position(),
					height			= $element.height(),
					width			= $element.width();
				
				//Obtaining the text width to positioning the spinners.
				var valueToPrint	= methods.showValue(true, true),
					partsValue	 	= valueToPrint.split(spinnerSeparator),
					hoursPos		= methods.getTextWidth(partsValue[0]),
					minutesPos		= hoursPos + methods.getTextWidth(spinnerSeparator + partsValue[1]),
					secondsPos		= minutesPos + methods.getTextWidth(spinnerSeparator + partsValue[2]),
					separatorSize	= methods.getTextWidth(spinnerSeparator),
					borderTop		= parseInt($element.css('border-top-width').replace('px', ''), 10),
					borderLeft		= parseInt($element.css('border-left-width').replace('px', ''), 10);

				//Arrow positions and size.
				var	topUp			= (2 * height) / 21,
					topDown			= (12 * height) / 21,
					arrowSize		= (6 * height) / 21,
					arrowLeft		= (2 * height) / 21;
				
				//Templates to append with the options specified.
				var spinners		= '<div class="TimepickerInputMask.spinners" style="position: absolute; background: transparent;"></div>',
					spinnersContent = '<div class="spinners.container" style="position: absolute; background: transparent;"></div>',
					arrowsContainer	= '<div style="position: absolute;background: ' + options.bgcolor + ';height: 100%;width: ' +
						separatorSize + 'px;top: 0;"></span>',
					upSpinner		= '<a href="javascript:;" class="up" style="position: absolute;width: 0;height: 0;border-left: ' + 
						arrowSize + 'px solid transparent;border-right: ' + arrowSize + 'px solid transparent;border-bottom: ' + 
						arrowSize + 'px solid ' + options.arrowColor + ';" tabindex="9999"></a>',
					downSpinner 	= '<a href="javascript:;" class="down" style="position: absolute;width: 0;height: 0;border-left: ' +
						arrowSize + 'px solid transparent;border-right: ' + arrowSize + 'px solid transparent;border-top: ' + 
						arrowSize + 'px solid ' + options.arrowColor + ';" tabindex="9999"></a>';
				
				//Main container of the spinner layer.
				var $spinners = $(spinners).insertAfter($element).css({
					top:	position.top,
					left:	position.left,
					height:	height
				});
				
				//Change the index tab for the original input to prevent the access. 
				$element.attr('tabindex', '9999');
				$spinners.append($spinnerElement);
				
				//Container for the spinners blocks. We put at the beginning for the behaviour of the tab key.
				var $spinnersContent = $(spinnersContent).appendTo($spinners).css({
					top:	borderTop,
					left:	borderLeft,
					height:	height + 2,
				});
				
				//Hours spinner container.
				var $hoursContainer = $(arrowsContainer).appendTo($spinnersContent).css({
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
				var $minutesContainer = $(arrowsContainer).appendTo($spinnersContent).css({
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
					var $secondsContainer = $(arrowsContainer).appendTo($spinnersContent).css({
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