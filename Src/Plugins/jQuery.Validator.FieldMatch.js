/*
	File: jQuery.Validator.FieldMatch.js
	Version: 0.8 (jQuery.Validator 1.4.7)
	Author: Jeff Hansen (Jeffijoe) - Livesys.com
	jQuery: Tested with v1.8.2
	Description: Field-match plugin for jQuery.Validator.js to ensure 2 fields are equal.
*/
jQuery(function () {
	// Default error message.
	var _defaultErrorMessage = "Fields did not match.";

	// Extend the validator object.
	$.Validator.Extend({
		dataProp: "mustmatch", // The property on the element - eg. <input type="text" data-mustmatch="#passwordAgain" />
		configProp: "mustMatch", // The property on the config. This case, a jQuery selector for the field to match values against.
		messageDataProp: "msg_invalidmatch", // The error message property on the element
		messageConfigProp: "msg_invalidmatch", // The error message property on the config
		defaultErrorMessage: _defaultErrorMessage, // Default error message when validation fails and no message has been explicitly set.
		method: function (paramObj) {
			// The property value indicates if this is an email field or not.
			// Obviously, if it wasnt, the property wouldnt be there, but oh well. :P
		    if (paramObj.propertyValue)
		        return $(paramObj.propertyValue).val() == paramObj.input.val();
			// Success, return true!
			return true;
		}
	});
});