/*
	File: jQuery.Validator.js
	Version: 1.4.6
	Author: Jeff Hansen (Jeffijoe) - Livesys.com
	jQuery: Tested with v1.8.2
	Description: Formless validation of input elements
	Usage: Use .Validate() on a single (or collection of)
	jQuery elements to validate them. Pass an optional object
	for customization. See the GitHub Repo for demos, as well
	as parameter explanation: 
	https://github.com/Livesys/jQuery-Validator
*/
(function ($) {
    // The Validate Function
    jQuery.fn.Validate = function (options) {
        // Defaults
        var config = jQuery.extend({
            returnBool: true, // Return bool, or an object with more info?
            useInlineErrors: false, // Display errors in the field?
            required: false, // Are all fields required?
            minLength: 1, // Minimum length in the field?
            maxLength: 0, // Maximum length in the field?
            regex: null, // Do all fields need to pass a regex test?
            selectTextOnFocus: false, // Select all text when focusing a field displaying an error?
            customChecks: [], // Are there any custom checks you'd like to do? (Array of functions)
            noInlineErrors: "", // Any fields who should not display inline errors?
            msg_empty: "This field is required!", // Default global error for empty fields
            msg_lengthreq: "Value must be between $MINLEN$ and $MAXLEN$ characters long.", // Default global error for length requirements
            msg_invalidchars: "The following characters cannot be used: $CHARS$", // Default global error for invalid characters
            msg_regex: "This field did not pass the RegEx test." // Default global error for regex mismatch
        }, options),

        // All inputs are valid until proven otherwise.
        allValid = true,
        returnObj = {};

        // Initialize returnObj
        returnObj.valid = allValid;
        returnObj.validInputs = [];
        returnObj.invalidInputs = [];
        returnObj.messages = [];

        // WebKit Bugfix for text selection
        var onMouseUp = function (e) {
            e.preventDefault();
        };


        // Lets loop through all the inputs that shall be validated.
        $(this).each(function () {
            // Function for getting the value to validate upon
            function getVal(elem) {
                if (!elem)
                    elem = $this;
                // The value
                var val;
                if (!data.validateon)
                    val = elem.val();
                else if (data.validateon == "html")
                    val = elem.html();
                else if (data.validateon == "text")
                    val = elem.text();
                else val = elem.prop(data.validateon);
                return val;
            }
            
            // Function for setting the value
            function setVal(val, elem) {
                if (!elem)
                    elem = $this;

                if (!data.validateon)
                    elem.val(val);
                else if (data.validateon == "html")
                    elem.html(val);
                else if (data.validateon == "text")
                    elem.text(val);
                else elem.prop(data.validateon,val);
            }

            // We're working with THIS input!
            var $this = $(this);
            // Let's get the data of this input.
            var data = $this.data();

            

            // Should we validate this field?
            if ((config.required) || (data.required) || (data.validate)) {
                // Create an Invalid Input object
                var invalidObject = { messages: [] },

                // Is THIS field invalid?
                thisValid = true,

                // Are we using inline errors?
                inlineErrors = (data.use_inline_errors || config.useInlineErrors),

                // Create onFocus event
                onFocus = function () {
                    // Replace error value with the entered value
                    if (inlineErrors && !$(this).is(config.noInlineErrors)) {
                        // Set value to what it was before
                        if ($(this).data("current_value") == $(this).attr("placeholder"))
                            setVal("",$(this));
                        else
                            setVal($(this).data("current_value"),$(this));

                        // If selectTextOnFocus is true, select the text after removing error text
                        if ((data.selecttextonfocus || config.selectTextOnFocus) && $(this).data("showing_error"))
                            $(this).select();
                        else {
                            // IE7-8 bugfix
                            try
                            {
                                var oSel = document.selection.createRange();
                                oSel.moveStart('character', this.value.length);
                                oSel.moveEnd('character', 0);
                                oSel.select(); 
                            }
                            catch(error){
                                // Do nothing
                            }
                        }

                        // Set showing error to false
                        $(this).data("showing_error", false);
                    }
                    // Remove error class(es) if any
                    $this.removeClass(data.error_class || config.errorClass || "");

                    // Unbind events
                    $this.unbind("focus.Validator mouseup.Validator");
                };

                // -- Validation -- //

                // If we're using Inline Errors, check it.
                if (inlineErrors && data.showing_error) {
                    // Set field value to what it was before, to validate it again
                    setVal(data.current_value);

                    // We're not showing an error anymore
                    data.showing_error = false;
                }

                // Check if the field is required, and if it is, check if it's empty.
                if ((data.required || config.required) && $this.isEmpty()) {
                    // All are not valid anymore.
                    thisValid = false;

                    // Add error message to array
                    invalidObject.messages.push(data.msg_empty || config.msg_empty);
                }

                // Length Check
                var doLengthCheck = false,
                minLength,
                maxLength,
                val = getVal();
                
                //  Determine what setting we're using - config or data?
                if (data.lengthreq != undefined) {
                    // Get the length requirements
                    doLengthCheck = true;
                    var lengthReqArr = (data.lengthreq.indexOf("-") != -1)
                        ? data.lengthreq.split("-")
                        : (data.lengthreq += "-0").split("-");
                    minLength = lengthReqArr[0];
                    maxLength = lengthReqArr[1];
                } else if (config.minlength != undefined || config.maxlength != undefined) {
                    // Check if the min length req is being satisfied
                    doLengthCheck = true;
                    minLength = config.minLength;
                    maxLength = config.maxLength;
                }
                
                // Only check length if the field has a value
                if (data.validate && val.length == 0) {
                    doLengthCheck = false;
                }
                
                // Do the actual length check, if any.
                if (doLengthCheck && (val.length < minLength || val.length > maxLength)) {                    
                    var errMsg = (data.msg_lengthreq || config.msg_lengthreq).replace("$MINLEN$", minLength).replace("$MAXLEN$", maxLength);
                    invalidObject.messages.push(errMsg);
                    thisValid = false;
                }
                
                // Char check
                if (data.invalidchars != undefined || config.invalidChars != undefined) {
                    // What are we testing against?
                    var chars = (data.invalidchars || config.invalidChars);
                    var val = getVal();
                    // Loop, for gods sake, LOOOOOP!
                    for (var i = 0; i < chars.length; i++) {
                        // Get the char we're testing for
                        var thisChar = chars.charAt(i);

                        // Test
                        
                        if (val.indexOf(thisChar) != -1) {
                            // The field contains this char, mark it as invalid
                            thisValid = false;

                            // Push invalid message onto the messages stack
                            invalidObject.messages.push((data.msg_invalidchars || config.msg_invalidchars).replace("$CHARS$", data.invalidchars));

                            // Break the loop
                            break;
                        }
                    }
                }

                // Regex check
                if (data.regex != undefined || config.regex != undefined) {
                    // If the value does not match the regex, its a fail.
                    if (!new RegExp(data.regex || config.regex).test(getVal())) {
                        thisValid = false;
                        invalidObject.messages.push(data.msg_regex || config.msg_regex);
                    }
                }

                // Use the plugins
                if (jQuery.Validator._validatorPlugins.length > 0) {
                    // Loop the list
                    jQuery.each(jQuery.Validator._validatorPlugins, function () {
                        // Short reference
                        $plugin = this;

                        // Check if the config or data obj contains the key
                        if (data[$plugin.dataProp] != undefined || config[$plugin.configProp] != undefined) {
                            // Get the property & error message values
                            var propValue = data[$plugin.dataProp] != undefined ? data[$plugin.dataProp] : config[$plugin.configProp];
                            var errorMessage = data[$plugin.messageDataProp] || config[$plugin.messageConfigProp];

                            // Param object
                            var params = {
                                input: $this, // Input being validated
                                propertyValue: propValue, // The value of the property
                                configObject: config, // The config object
                                dataObject:data // The data object of the current input
                            };

                            // Run the method
                            var passed = $plugin.method(params);
                            // Did the method pass?
                            if (!passed) {
                                thisValid = false;
                                invalidObject.messages.push(errorMessage);
                            }
                        }
                    });
                }

                // Do the custom checks
                if (config.customChecks.length > 0) {
                    // Loop thru functions and execute them
                    $.each(config.customChecks, function () {
                        var thisCheck = this;
                        var param = { input: $this };
                        if (!thisCheck(param)) {
                            thisValid = false;
                            invalidObject.messages.push(param.message);
                        }
                    });
                }

                // Once all validation is done, push it
                if (!thisValid) {
                    // All is not valid!
                    allValid = false;
                    invalidObject.elem = $this;
                    returnObj.invalidInputs.push(invalidObject);

                    // Aggregate all error messages to a single collection
                    returnObj.messages = returnObj.messages.concat(invalidObject.messages);
                    
                    // Set the text of the field to the error message if we're using inline errors,
                    // and if this field is not excluded from using inline errors
                    if (inlineErrors && !data.showing_error && !$this.is(config.noInlineErrors)) {
                        // Get the current value of the text, so we can restore it on focus!
                        data.current_value = $this.val();

                        // Let the rest of the code know we're showing an error in this field
                        data.showing_error = true;

                        // Set value
                        setVal(invalidObject.messages[0]);
                    }

                    // Unbind and Bind the mouseUp event - Webkit Bugfix
                    $this.unbind("mouseup.Validator").bind("mouseup.Validator", onMouseUp);

                    // Unbind, and Bind focus event.
                    $this.unbind("focus.Validator").bind("focus.Validator", onFocus);

                    // If any classes are to be applied, apply them
                    $this.addClass(data.error_class || config.errorClass || "");
                } else {
                    // This field passed validation! Remove the error class 
                    // if any, as well as the saved text, onFocus event, and onMouseUp event.
                    $this.removeClass(data.error_class || config.errorClass || "");
                    $this.data({ current_value: undefined, showing_error: false });

                    // Add this field to the validInputs collection
                    returnObj.validInputs.push($this);
                }
                // Call the onFieldValidated callback
                if (config.onFieldValidated != undefined)
                    config.onFieldValidated($this, thisValid, invalidObject);
            }
        });
        // Set the valid result on the returnObject
        returnObj.valid = allValid;

        // In the end, we return the bit, or the object.
        if (config == undefined || config.returnBool)
            return allValid;

        // Not returning a bit? Ok! Return object
        return returnObj;

    };

    // Clear Validation data
    jQuery.fn.Validate_Clear = function (clearFields) {
        // Get this.
        return $(this).each(function() {
            // Unbind events
            var $this = $(this);
            $this.unbind("mouseup.Validator focus.Validator");

            // Clear data
            $this.data({
                showing_error: false,
                current_value: ""
            });

            // Remove error class
            $this.removeClass("error");

            // Check if we should clear fields
            if (clearFields) {
                $this.val("");
            }
        });

        
    };

    // The Validator Object, for extending the validator
    // with custom checks (plugin-style)
    jQuery.Validator = {
        // Internal list of validator plugins
        _validatorPlugins: [],

        // The Extend method - adds the plugin to the list.
        // Takes a ValidatorPlugin Object as input
        Extend: function (validatorPlugin) {
            // Push the plugin to the list
            this._validatorPlugins.push(validatorPlugin);
        }
    };
})(jQuery);