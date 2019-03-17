// ==UserScript==
// @name         Video.Aktualne - video player shortcuts
// @namespace    https://video.aktualne.cz
// @version      2.1.0
// @description  Installs videojs plugin to the video player on video.aktualne.cz
//               Focuses the video element so that keyboard events arrive to the jvs-player.
// @author       bubblefoil
// @license      MIT
// @match        https://video.aktualne.cz/*
// @require      https://cdn.sc.gl/videojs-hotkeys/latest/videojs.hotkeys.min.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let initialized = false;

    function getVideo(){
        return document.querySelector('video.vjs-tech');
    }

    function init(){
        if (initialized) return;

        console.info('Extension: initializing shortcuts.');
        videojs(getVideo().id).ready(function() {
            this.hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableModifiersForNumbers: false,
                alwaysCaptureHotkeys: true
            });
        });
        getVideo().focus();
        console.info('Extension: shortcuts initialized.');
        initialized = true;
    }

    const hasAddedNodes = (mutation) => mutation.addedNodes.length > 0;

    const mutationObserver = new MutationObserver(function (mutations) {
        if (mutations.some(hasAddedNodes)) {
            init();
        }
    });

    const observeOptions = {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false,
    };
    mutationObserver.observe(document.body, observeOptions);

})();
