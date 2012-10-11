jQuery-Validator
================

A formless validation plugin for all kinds of validation - even your own!

Simplest use case
==================

Consider the following markup:

    <input type="text" id="username" data-required="true" data-lengthreq="4-16" data-msg_empty="Please enter a username" />

And you wish to validate it now. All the requirements have already been declared in the markup, so all you have to do, is make the plugin do it's magic:

    if($("#username").Validate()){
        // SUCCESS!
    }

This can be extended, please reffer to the demos.