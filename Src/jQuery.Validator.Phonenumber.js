/*
	File: jQuery.Validator.Phonenumber.js
	Version: 0.5 (jQuery.Validator 1.4.6)
	Author: Jeff Hansen (Jeffijoe) - Livesys.com
	jQuery: Tested with v1.8.2
	Description: Phone number validation plugin for jQuery.Validator.js
*/
jQuery(function () {
    // Extend the validator object.
    $.Validator.Extend({
        dataProp: "phone", // The property on the element - eg. <input type="text" data-email="true" />
        configProp: "isPhone", // The property on the config.
        messageDataProp: "msg_invalidphonenumber", // The error message property on the element
        messageConfigProp: "msg_invalidphonenumber", // The error message property on the config
        method: function (paramObj) {
            // The property value indicates if this is a phonenumber field or not.
            if (paramObj.propertyValue)
                // Phone number regex check
                // Requires atleast 7 numbers. Can use +, -, etc (all valid phone number chars)
                if (!(/^\d{7,}$/).test(paramObj.input.val().replace(/[\s()+\-\.]|ext/gi, ''))) {
                    // Failed, return false
                    return false;
                }
            // Success, return true!
            return true;
        }
    });
});