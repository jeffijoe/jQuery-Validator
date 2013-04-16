/*
	File: jQuery.Validator.Url.js
	Version: 0.2 (jQuery.Validator 1.4.6)
	Author: Jeff Hansen (Jeffijoe) - Livesys.com
	jQuery: Tested with v1.9.1
	Description: URL Validation.

    Regex author: Diego Perini
*/
jQuery(function () {
    // Extend the validator object.
    $.Validator.Extend({
        dataProp: "url", // The property on the element
        configProp: "isUrl", // The property on the config.
        messageDataProp: "msg_invalid_url", // The error message property on the element
        messageConfigProp: "msg_invalidUrl", // The error message property on the config
        method: function (paramObj) {
            // The property is a bool, indicating if this is an URL field.
            if (paramObj.propertyValue) {                
                // Check if this is a valid URL
                var pattern = new RegExp(
                                                "^" +
                                                // protocol identifier
                                                "(?:(?:https?|ftp)://)" +
                                                // user:pass authentication
                                                "(?:\\S+(?::\\S*)?@)?" +
                                                "(?:" +
                                                // IP address exclusion
                                                // private & local networks
                                                "(?!10(?:\\.\\d{1,3}){3})" +
                                                "(?!127(?:\\.\\d{1,3}){3})" +
                                                "(?!169\\.254(?:\\.\\d{1,3}){2})" +
                                                "(?!192\\.168(?:\\.\\d{1,3}){2})" +
                                                "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                                                // IP address dotted notation octets
                                                // excludes loopback network 0.0.0.0
                                                // excludes reserved space >= 224.0.0.0
                                                // excludes network & broacast addresses
                                                // (first & last IP address of each class)
                                                "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                                                "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                                                "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                                                "|" +
                                                // host name
                                                "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
                                                // domain name
                                                "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
                                                // TLD identifier
                                                "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                                                ")" +
                                                // port number
                                                "(?::\\d{2,5})?" +
                                                // resource path
                                                "(?:/[^\\s]*)?" +
                                                "$", "i"
                                            );
                
                // Do the test
                return (pattern.test(paramObj.input.val()));
            }

            // Success, return true!
            return true;
        }
    });
});