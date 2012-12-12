/*
	File: jQuery.Validator.js
	Version: 0.8 (jQuery.Validator 1.4.6)
	Author: Jeff Hansen (Jeffijoe) - Livesys.com
	jQuery: Tested with v1.8.2
	Description: E-Mail validation plugin for jQuery.Validator.js
*/
jQuery(function () {
    // Extend the validator object.
    $.Validator.Extend({
        dataProp: "email", // The property on the element - eg. <input type="text" data-email="true" />
        configProp: "isEmail", // The property on the config.
        messageDataProp: "msg_invalidemail", // The error message property on the element
        messageConfigProp: "msg_invalidemail", // The error message property on the config
        method: function (paramObj) {
            // The property value indicates if this is an email field or not.
            // Obviously, if it wasnt, the property wouldnt be there, but oh well. :P
            if (paramObj.propertyValue)
                // E-Mail regex check
                if (!new RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test(paramObj.input.val())) {
                    // Failed, return false
                    return false;
                }
            // Success, return true!
            return true;
        }
    });
});