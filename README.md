jQuery-Validator
================

A formless validation plugin for all kinds of validation - even your own!

Simplest use case
==================

You need to include the jQuery library, as well as the IsEmpty plugin (quick utility function, found in the Src folder), and the actual Validator plugin.
    
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script type="text/javascript" src="js/jQuery.IsEmpty.js"></script>
    <script type="text/javascript" src="js/jQuery.Validator.js"></script>

Consider the following markup, this will add a field which is required, has a length requirement of 4 to 16, an error message if the field is empty, and an error message (using placeholders), if the length requirement is not fulfilled:

    <input type="text" id="username" data-required="true" data-lengthreq="4-16" data-msg_empty="Please enter a username" data-msg_lengthreq="Please enter a username between $MINLEN$ characters, and $MAXLEN$ characters." />

And you wish to validate it now. All the requirements have already been declared in the markup, so all you have to do, is make the plugin do it's magic:

    if($("#username").Validate()){
        // SUCCESS!
    }

This can be extended, please reffer to the demos. Also, you can (**and absolutely should**) use the validate on a collection of input elements!

All the messages can be customized for each individual field, as well as for all fields at once.

If you want to customize your validator even further, you can pass the Validate function a config object. This is the parameter list.


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
        
    	- [string] regex: A global regex test all elements must pass
    
        - [string/object] noInlineErrors: Selector/collection of elements
        that wont display inline errors
        
        - [string] msg_empty: Empty Field error message
        
        - [string] msg_lengthreq: Length Requirements error message
        
        - [string] msg_invalidchars: Invalid Characters error message
        
        - [string] msg_regex: No RegEx match error message
        
        - [object] customChecks: An object array of functions for custom checks.
        Return true if it passed validation, false if not. The function takes a param object:
            - [object] paramObject: Object to read from and write to.
                - [object] input (read): The current field being validated. This is for you to validate upon.
                - [string] errorMessage (write): If false is returned, what error should be used?
        
        - [function] onFieldValidated(field, passed, invalidObject)
        Callback function that gets called once per field validation.
        "passed" represents its validation result. True if the field
        passed validation, false if not. If passed is false, an
        invalidInput is also passed.
            - [object] field: jQuery object representing the field that was
            being validated.
            
            - [bool] passed: Boolean value representing the fields validation result.
            
            - [object] invalidObject: If passed is false, an invalidObject is also
            passed, containing all the validation messages for that field, as
            well as the field itself.
    
    Return:
        - [bool/object] True/false, or Object - depending on the configuration.
            - [bool] valid: Was all inputs valid?
            
            - [object] validInputs: Collection of inputs that passed validation.
            
            - [object] invalidInputs: Collection of inputs that failed validation.
            - [array of string] messages: Array of error messages
            
            - [object] elem: jQuery Input Field