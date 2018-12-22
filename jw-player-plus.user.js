// ==UserScript==
// @name         Video.Aktualne - video player shortcuts
// @namespace    https://video.aktualne.cz
// @version      2.0.0
// @description  Installs videojs plugin to the video player on video.aktualne.cz
//               Focuses the video element so that keyboard events arrive to the jvs-player.
//               Also adds playback speed controls.
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

    var playbackRates = [0.25, 0.5, 0.75, 1, 1.125, 1.25, 1.5, 2];
    const muteVolume = 0.05;

    function slowDown(){
        console.log("slowing down");
        var video = getVideo();
        if(video == null || !video.playbackRate){
            console.log("There is no video player");
            return;
        }
        var currentRate = video.playbackRate;
        var ri = playbackRates.findIndex(r => r >= currentRate);
        video.playbackRate = playbackRates[Math.max(0, ri - 1)];
        console.log("Playback rate =", video.playbackRate);
    }

    function speedUp(){
        console.log("Speeding up");
        var video = getVideo();
        if(video == null || !video.playbackRate){
            console.log("There is no jw-player");
            return;
        }
        var currentRate = Math.min(video.playbackRate, playbackRates[playbackRates.length - 1]);
        var ri = playbackRates.findIndex(r => r >= currentRate);
        video.playbackRate = playbackRates[Math.min(ri + 1, playbackRates.length - 1)];
        console.log("Playback rate =", video.playbackRate);
    }

    let originalSpeed = 1;
    let fastForwarding = false;
    const fastForwardRate = 5;
    function fastForward(){
        if (!fastForwarding){
            originalSpeed = getVideo().playbackRate;
        }
        getVideo().playbackRate = fastForwardRate;
        fastForwarding = true;
    }

    function stopFastForward(){
        let video = getVideo();
        if (fastForwarding && video) video.playbackRate = originalSpeed;
        fastForwarding = false;
    }

    document.onkeydown = function (e) {
        console.debug("keydown: ", e);
        //debugger;
        if(e.shiftKey && e.keyCode === 188){
            slowDown();
        }
        if(e.shiftKey && e.keyCode === 190){
            speedUp();
        }
        //Prevent page scroll when pressing Space key
        if(e.keyCode === 32){
            e.preventDefault();
        }
        var ed = new KeyboardEvent('keydown', {key: e.key, keyCode: e.keyCode, which: e.which, code: e.code});
        //Send the key event to the player
        getVideo().dispatchEvent(ed);
    };

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
