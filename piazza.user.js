// ==UserScript==
//
// @name           Piazza to Autograder
// @description    Piazza/Autograder quick link generator
// @namespace      https://plus.google.com/u/0/+MarcusDarden/chrome-extension/piazza
// @author         Marcus M. Darden (mmdarden@umich.edu)
// @license        GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html) 
// @homepage       https://plus.google.com/u/0/+MarcusDarden/
// @version        0.3
//
// Urls process this user script on
// @include        https://piazza.com/*
// @include        http://piazza.com/*
//
// Add any library dependencies here, so they are loaded before your script is loaded.
//
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @history        0.3 Refactored. Works on page load AND feed item clicks!
// @history        0.2 New and (slightly) improved
// @history        0.1 It works! (kinda)
//
// ==/UserScript==

// Eventual link template
var hyperlink_template = '(<a href="https://g281-1.eecs.umich.edu/submission/{uniqname}" target="_blank">{uniqname}</a>)';

// User names are in a span with a class "user_name".
// This function searches user_name content for a uniqname in parentheses and
// converts it to a hyperlink to a student's submission page on the EECS 281
// autograder.
var aghyperlink_user_name = function($user_name) {
    var str = $user_name.innerHTML;
    var match_found = false;
    $user_name.innerHTML = str.replace(/\((\w*)\)/, function(match, uniqname) {
        if (match)
            match_found = true;
        return hyperlink_template.replace(/\{uniqname\}/g, uniqname.toLowerCase());
    });
    return match_found;
}

// user_name elements are asynchronously loaded, this function tries to catch
// them all, and then stop looking when no more changes are being made, and
// all of them have been turned into hyperlinks.
var aghyperlink_piazza = function() {
    var $user_names = $('.user_name');
    var links_added = 0;
    for (var i = 0; i < $user_names.length; ++i) {
        if (aghyperlink_user_name($user_names[i]))
            links_added++;
    }
    if (links_added)
        window.setTimeout(aghyperlink_piazza, 1000);
}

// Hyperlink the entire page, and register an event on the feed items on the
// left, that will hyperlink the page whenever a new post is selected.
$(function() {
    window.setTimeout(aghyperlink_piazza, 1000);
    $(document).on('click', '.feed_item', function() { window.setTimeout(aghyperlink_piazza, 1000); });
    //$(document).ajaxComplete(function() {
        //aghyperlink_piazza();
    //});
});
