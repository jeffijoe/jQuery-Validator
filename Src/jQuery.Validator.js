/*
File: jQuery.Validator.js
Version: 1.2.9
Author: Jeff Hansen
jQuery: Tested with v1.7.2
Description: Formless validation of input elements
Usage: Use .Validate() on a single (or collection of)
jQuery elements to validate them. 

Parameters:
- [object] config: Configuration Object:
    - [bool] returnBool: Return a bool or an object. 
        The object will contain valid and invalid fields.

    - [string] errorClass: Class(es) to be added when a field
        is invalid.

    - [bool] required: Are these fields required?

    - [bool] useInlineErrors: If true, the first error of each
        field will be printed in the fields value.

    - [string] invalidChars: String of invalid characters, besides the ones in the
        input field's data.

    - [int] minLength: Minimum length required for all elements.
        If an element has explicitly specified a min. length, 
        the explicit value is used.

    - [int] maxLength: Same applies to maxLength as to minLength

    - [string/object] noInlineErrors: Selector/collection of elements 
       that wont display inline errors

    - [string] msg_empty: Empty Field error message

    - [string] msg_lengthreq: Length Requirements error message

    - [string] msg_invalidchars: Invalid Characters error message

    - [string] msg_regex: No RegEx match error message

    - [object] customChecks: An object array of functions for custom checks.
        Return true if it passed validation, false if not. The function takes 2 arguments:
         - [object] input: The current field being validated. This is for you to validate upon.
         - [string] errorMessage: If false is returned, what error should be used?

    - [function] onFieldValidated(field, passed, invalidObject) 
        Callback function that gets called once per field validation.
        "passed" represents its validation result. True if the field 
        passed validation, false if not. If passed is false, an 
        invalidInput is also passed.
        - [object] field: jQuery object representing the field that was
            being validated.

        - [bool] passed: Boolean value representing the fields validation result.

        - [object] invalidInput: If passed is false, an invalidInput is also
            passed, containing all the validation messages for that field, as
            well as the field itself.

Return:
- [bool/object] True/false, or Object - depending on the configuration.
    - [bool] valid: Was all inputs valid?

    - [object] validInputs: Collection of inputs that passed validation.

    - [object] invalidInputs: Collection of inputs that failed validation.
        - [array of string] messages: Array of error messages

        - [object] elem: jQuery Input Field
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

        // WebKit Bugfix for text selection
        var onMouseUp = function (e) {
            e.preventDefault();
        };

        // Lets loop through all the inputs that shall be validated.
        $(this).each(function () {
            // We're working with THIS input!
            var $this = $(this);

            // Let's get the data of this input.
            var data = $this.data();

            // Is this field required?
            if (data.required != undefined && data.required) {
                // Create an Invalid Input object
                var invalidInput = { messages: [] },

                // Is THIS field invalid?
                thisValid = true,

                // Are we using inline errors?
                inlineErrors = (data.use_inline_errors || config.useInlineErrors),

                // Create onFocus event
                onFocus = function () {
                    // Replace error value with the entered value
                    if (inlineErrors) {
                        // Set value to what it was before
                        if ($(this).data("current_value") == $(this).attr("placeholder"))
                            $(this).val("");
                        else
                            $(this).val($(this).data("current_value"));

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
                    $this.val(data.current_value);

                    // We're not showing an error anymore
                    data.showing_error = false;
                }

                // Check if the field is required, and if it is, check if it's empty.
                if ((data.required || config.required) && $this.isEmpty()) {
                    // All are not valid anymore.
                    thisValid = false;

                    // Add error message to array
                    invalidInput.messages.push(data.msg_empty || config.msg_empty);
                }

                // Length Check
                var doLengthCheck = false,
                minLength,
                maxLength;

                // First, determine what setting we're using - config or data?
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
                // Do the actual length check, if any.
                if (doLengthCheck && ($this.val().length < minLength || $this.val().length > maxLength)) {
                    var errMsg = (data.msg_lengthreq || config.msg_lengthreq).replace("$MINLEN$", minLength).replace("$MAXLEN$", maxLength);
                    invalidInput.messages.push(errMsg);
                    thisValid = false;
                }

                // Char check
                if (data.invalidchars != undefined || config.invalidChars != undefined) {
                    // What are we testing against?
                    var chars = (data.invalidchars || config.invalidChars);

                    // Loop, for gods sake, LOOOOOP!
                    for (var i = 0; i < chars.length; i++) {
                        // Get the char we're testing for
                        var thisChar = chars.charAt(i);

                        // Test
                        if ($this.val().indexOf(thisChar) != -1) {
                            // The field contains this char, mark it as invalid
                            thisValid = false;

                            // Push invalid message onto the messages stack
                            invalidInput.messages.push((data.msg_invalidchars || config.msg_invalidchars).replace("$CHARS$", data.invalidchars));

                            // Break the loop
                            break;
                        }
                    }
                }

                // Regex check (at this point, only assignable on the data level)
                if (data.regex != undefined) {
                    // If the value does not match the regex, its a fail.
                    if (!new RegExp(data.regex).test($this.val())) {
                        thisValid = false;
                        invalidInput.messages.push(data.msg_regex || config.msg_regex);
                    }
                }

                // Do the custom checks
                if (config.customChecks.length > 0) {
                    // Loop thru functions and execute them
                    $.each(config.customChecks, function () {
                        var thisCheck = this;
                        var param = { input: $this };
                        if (!thisCheck(param)) {
                            thisValid = false;
                            invalidInput.messages.push(param.message);
                        }
                    });
                }

                // Once all validation is done, push it
                if (!thisValid) {
                    // All is not valid!
                    allValid = false;
                    invalidInput.elem = $this;
                    returnObj.invalidInputs.push(invalidInput);

                    // Set the text of the field to the error message if we're using inline errors,
                    // and if this field is not excluded from using inline errors
                    if (inlineErrors && !data.showing_error && !$this.is(config.noInlineErrors)) {
                        // Get the current value of the text, so we can restore it on focus!
                        data.current_value = $this.val();

                        // Let the rest of the code know we're showing an error in this field
                        data.showing_error = true;

                        // Set value
                        $this.val(invalidInput.messages[0]);
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
                    config.onFieldValidated($this, thisValid, invalidInput);
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
        var $this = $(this);

        // Unbind events
        $this.unbind("mouseup.Validator focus.Validator");

        // Clear data
        $this.data({
            showing_error: false,
            current_value: ""
        });

        // Check if we should clear fields
        if (clearFields) {
            $this.val("");
        }
        return $this;
    };
})(jQuery);