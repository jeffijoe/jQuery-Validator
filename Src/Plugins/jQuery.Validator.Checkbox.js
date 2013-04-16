/*
	File: jQuery.Validator.Checkbox.js
	Version: 0.1 (jQuery.Validator 1.4.6)
	Author: Jeff Hansen (Jeffijoe) - Livesys.com
	jQuery: Tested with v1.8.2
	Description: Adds support for checkboxes with data-required.
*/
jQuery(function () {
    // Extend the validator object.
    $.Validator.Extend({
        dataProp: "required", // The property on the element - eg. <input type="text" data-email="true" />
        configProp: "required", // The property on the config.
        messageDataProp: "msg_empty", // The error message property on the element
        messageConfigProp: "msg_empty", // The error message property on the config
        method: function (paramObj) {
            // The property value indicates if this is a required field or not.
            // Also make sure its a checkbox.
            if (paramObj.input.is("[type=checkbox]") && paramObj.propertyValue)
                // If the field is not checked, return false.
                if (!paramObj.input.prop("checked"))
                    return false;
            // Success, return true!
            return true;
        }
    });
});