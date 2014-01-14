/*
	File: jQuery.Validator.CheckboxGroup.js
	Version: 0.1 (jQuery.Validator 1.5.8)
	Author: Jeff Hansen (Jeffijoe) - Jeffijoe.com
	jQuery: Tested with v2
	Description: Adds support for checkbox groups. See example in Demos folder.
    This was requested on my blog: http://jeffijoe.com/2013/06/validation-in-knockout-js/#comment-1199334982
*/
jQuery(function () {
    // Extend the validator object.
    $.Validator.Extend({
        dataProp: "checkboxgroup", // The property on the element - eg. <div data-checkboxgroup="1" /> for alteast 1 checkbox to have been checked.
        configProp: "checkboxgroup", // The property on the config. You wouldn't use this in this case though.
        messageDataProp: "msg_checkboxgroup", // The error message property on the element
        messageConfigProp: "msg_checkboxgroup", // The error message property on the config
        defaultErrorMessage: "You need to check atleast $VALUE$ values.",
        // (New in Validator 1.5.8) allows you to modify the error message.
        messageMutator: function(paramObj, errorMessage) {
            return errorMessage.replace("$VALUE$", paramObj.propertyValue);
        },
        method: function (paramObj) {
            // The property value tells us the required amount of checkboxes 
            // that must be checked.
            console.log("param:", paramObj);
            if (paramObj.propertyValue) {
                var requiredCount = paramObj.propertyValue;
                // Get checkboxes in this container
                var checked = paramObj.input.find("INPUT:checkbox:checked").length;
                console.log("Checked: ", checked);
                if (checked < requiredCount) {
                    console.log("False");
                    return false;
                }
            }
            console.log("True");
            // Success, return true!
            return true;
        }
    });
});