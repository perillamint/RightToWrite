// ==UserScript==
// @name        RightToWrite
// @namespace   http://gmscript.gentoo.moe
// @include     *
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://raw.githubusercontent.com/perillamint/RightToWrite/master/RightToWrite.user.js
// @updateURL   https://raw.githubusercontent.com/perillamint/RightToWrite/master/RightToWrite.meta.js
// @grant       none
// @license     GPLv3 or later
// ==/UserScript==

//Prevent compat issue.
this.$ = this.jQuery = jQuery.noConflict(true);

// Configuration object.
var config = {
    "makePasswordVisible": false,
    "removeReadonlyAttr": true,
    "removeDisabledAttr": true,
};

function do_unlock(inputDOM) {
    if(config.makePasswordVisible &&
       inputDOM.getAttribute("type").toLowerCase() === "password") {
        $(inputDOM).attr("type", "text");
        console.log("Changed password to text.");
    }

    if(config.removeReadonlyAttr && inputDOM.getAttribute("readonly") !== null) {
        $(inputDOM).removeAttr("readonly");
        console.log("Readonly attribute removed.");
    }

    if(config.removeDisabledAttr && inputDOM.disabled) {
        $(inputDOM).prop("disabled", false);
        console.log("Disabled attribute removed.");
    }
}

function find_all_input(cb) {
    $("input").each(function (i, inputDOM) {
        cb(inputDOM);
    });
}

var obs_config = {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true
};

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(mutation.type === "attributes") {
            //Attributes
            if(mutation.target.tagName.toLowerCase() === "input") {
                do_unlock(mutation.target);
            }
        } else {
            var added_nodes = mutation.addedNodes;
            for (var i = 0; i < added_nodes.length; i++) {
                if(added_nodes[i].tagName.toLowerCase() === "input") {
                    do_unlock(added_nodes[i]);
                }
            }
        }
    });
});

observer.observe(document, obs_config);
find_all_input(function (inputDOM) {
    do_unlock(inputDOM);
});
