/*
	File: jQuery.Validator.KendoMultiselect.js
	Version: 0.1 (jQuery.Validator 1.4.6)
	Author: Jeff Hansen (Jeffijoe) - Livesys.com
	jQuery: Tested with v1.9.1
	Description: KendoUI Web Multiselect Validation for jQuery.Validator.js
    
    IMPORTANT: Currently only works when the multiselect instance
    is stored in the kendoMultiSelect data property.

    In order for it to function properly at this point,
    you need to add data-required="false" to the select tag.
*/
jQuery(function () {
    // Apply Error Class
    // This applies the error class to the correct
    // element, if specified.
    // TODO: Currently no support for inline errors..
    var applyErrorClass = function(obj,shouldAdd) {
        if (obj.configObject.errorClass && shouldAdd) {
            obj.input.parent().addClass(obj.configObject.errorClass);
        } else
            obj.input.parent().removeClass(obj.configObject.errorClass);
    };

    // Extend the validator object.
    $.Validator.Extend({
        dataProp: "k_multiselect", // The property on the element
        configProp: "isKendoMultiselect", // The property on the config.
        messageDataProp: "msg_invalid_selection", // The error message property on the element
        messageConfigProp: "msg_invalidSelection", // The error message property on the config
        method: function (paramObj) {
            // The property is a bool, indicating if this is a kendo multiselect
            if (paramObj.propertyValue) {                
                // Get the value of the multiselect
                var value = paramObj.dataObject["kendoMultiSelect"].value();

                // If there is a minimum value defined, validate it
                var minValue = paramObj.dataObject["min_selection"] || paramObj.configObject["minSelection"] || 0;
                if (minValue != 0 && value.length < minValue) {
                    applyErrorClass(paramObj, true);
                    return false;
                }
                
                // If there is a maximum value defined, validate it
                var maxValue = paramObj.dataObject["max_selection"] || paramObj.configObject["maxSelection"] || 0;
                if (maxValue != 0 && value.length > maxValue) {
                    applyErrorClass(paramObj, true);
                    return false;
                }
            }

            // Success, return true!
            applyErrorClass(paramObj, false);
            return true;
        }
    });
});