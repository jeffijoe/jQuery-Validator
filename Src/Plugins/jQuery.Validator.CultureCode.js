/*
	File: jQuery.Validator.CultureCode.js
	Version: 0.8 (jQuery.Validator 1.4.7)
	Author: Jeff Hansen (Jeffijoe) - Livesys.com
	jQuery: Tested with v2.0
	Description: E-Mail validation plugin for jQuery.Validator.js
*/
jQuery(function () {
	// Default error message.
	var _defaultErrorMessage = "Not a valid E-mail address.";

	// Extend the validator object.
	$.Validator.Extend({
		dataProp: "culturecode", // The property on the element - eg. <input type="text" data-email="true" />
		configProp: "isCultureCode", // The property on the config.
		messageDataProp: "msg_invalidculturecode", // The error message property on the element
		messageConfigProp: "msg_invalidculturecode", // The error message property on the config
		defaultErrorMessage: _defaultErrorMessage, // Default error message when validation fails and no message has been explicitly set.
		method: function (paramObj) {
			// The property value indicates if this is an email field or not.
			// Obviously, if it wasnt, the property wouldnt be there, but oh well. :P
			if (paramObj.propertyValue)
				// E-Mail regex check
			    if (!new RegExp(/^[a-z]{2,3}(?:-[A-Z]{2,3}(?:-[a-zA-Z]{4})?)?$/).test(paramObj.input.val())) {
					return false;
				}
			// Success, return true!
			return true;
		}
	});
});