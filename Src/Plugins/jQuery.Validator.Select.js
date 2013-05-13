/*
	File: jQuery.Validator.Select.js
	Version: 0.2 (jQuery.Validator 1.4.6)
	Author: Jeff Hansen (Jeffijoe) - Livesys.com
	jQuery: Tested with v1.9.1
	Description: Selectbox Validation

    Regex author: Diego Perini
*/
jQuery(function () {
    // Extend the validator object.
    $.Validator.Extend({
        dataProp: "required", // The property on the element
        configProp: "required", // The property on the config.
        messageDataProp: "msg_empty", // The error message property on the element
        messageConfigProp: "msg_empty", // The error message property on the config
        method: function (paramObj) {
            
            // Success, return true!
            return true;
        }
    });
});