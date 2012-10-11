/*
File: jQuery.IsEmpty.js
Author: Jeff Hansen (Jeffijoe) - Livesys.com
Description: Check if a field is empty - handles placeholders.
*/
(function($){
   jQuery.fn.isEmpty = function () {
    var txt = $.trim(this.val());
    if (txt == this.attr("placeholder") || txt == "") {
        return true;
    }
    return false;
}; 
})(jQuery);
