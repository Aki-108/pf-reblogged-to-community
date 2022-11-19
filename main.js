// ==UserScript==
// @name         Reblogged to Community
// @version      1.4
// @description  Shows where a post has been reblogged to.
// @author       aki108
// @match        http*://www.pillowfort.social/posts/*
// @icon         https://www.pillowfort.social/assets/favicon/Favicon%202%20-%20Dark%20Blue@3x-d11c16147c2ce6136e0925765773e734b35102fe045adf98f1d9cf71040d8d05.png
// @updateURL    https://raw.githubusercontent.com/Aki-108/pf-reblogged-to-community/main/main.js
// @downloadURL  https://raw.githubusercontent.com/Aki-108/pf-reblogged-to-community/main/main.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /* Initialize. When the loading circle disapears, a click event gets added to the "Reblogs" button. */
    var styleObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            if (loadingIndicator != null && loadingIndicator.style.display == "none") {
                addEventListener();
            }
        });
    });
    var loadingIndicator = document.getElementById("comments_loading");
    if (loadingIndicator != null) {
        styleObserver.observe(loadingIndicator, {
            attributes: true,
            attributeFilter: ["style"],
        });
    }
    function addEventListener() {
        let reblogButton = document.getElementsByClassName("nav-tabs")[0].children[1];
        reblogButton.addEventListener("click", run);
    }

    let reblogJSON;
    $.getJSON(document.URL.split("?")[0]+'/reblogs?p=1', function(data) {
        reblogJSON = data;
    });

    /* Cache of communities with most members. */
    let comms = []
    comms.push([3, "BetaUsers"]);
    comms.push([37, "PillowArtists"]);
    comms.push([15, "Pokemon"]);
    comms.push([113, "NSFW"]);
    comms.push([84, "cats"]);
    comms.push([112, "LGBT"]);
    comms.push([223, "ArtistAlley"]);
    comms.push([352, "DnD"]);
    comms.push([509, "Active_Users"]);
    comms.push([853, "femslash"]);
    comms.push([54, "Science"]);
    comms.push([49, "Gaming"]);
    comms.push([107, "Witchcraft"]);
    comms.push([157, "dragon-age"]);
    comms.push([202, "Webcomics"]);
    comms.push([177, "AnimalCrossing"]);
    comms.push([293, "Memes"]);
    comms.push([80, "horror"]);
    comms.push([614, "FandomOlds"]);
    comms.push([136, "Marvel"]);
    comms.push([56, "KingdomHearts"]);
    comms.push([86, "Nintendo"]);
    comms.push([51, "Overwatch"]);
    comms.push([1062, "Writing-Prompts"]);
    comms.push([17, "~Queers on TV~"]);
    comms.push([11, "ffxiv"]);
    comms.push([135, "Fanfiction"]);
    comms.push([964, "Teratophilia 🔞"]);
    comms.push([4514, "Tumblr NSFW Art, BDSM, Kink and Sex-Work Refugees"]);
    comms.push([161, "startrek"]);
    comms.push([153, "StevenUniverse"]);
    comms.push([557, "Bookworms"]);
    comms.push([145, "Dogs"]);
    comms.push([92, "YuriOnIce"]);
    comms.push([211, "Anime"]);
    comms.push([147, "TAZ"]);
    comms.push([304, "OCs"]);
    comms.push([39, "fallout"]);
    comms.push([82, "stardew-valley"]);
    comms.push([287, "HarryPotterSeries"]);
    comms.push([632, "BakersBakingStuff"]);
    comms.push([218, "Ghibli"]);
    comms.push([1419, "Writing"]);
    comms.push([131, "CriticalRole"]);
    comms.push([351, "omgcheckplease"]);
    comms.push([3244, "NSFW-Furries"]);
    comms.push([166, "Legend-of-Zelda"]);
    comms.push([1256, "OriginalContent"]);
    comms.push([132, "LewdDraws"]);
    comms.push([455, "Queer"]);

    /* Collect post IDs when "Reblogs" button is clicked. */
    function run() {
        let reblogButton = document.getElementsByClassName("nav-tabs")[0].children[1];
        reblogButton.removeEventListener("click", run);

        let notes = document.getElementById("reblogs").getElementsByClassName("reblog-note");
        for (let note of notes) {
            findComm(note.getElementsByTagName("a")[1]);
        }
    }

    /* Match a community from cache with the reblog. */
    function findComm(reblog) {
        let postId = reblog.href.substring(reblog.href.search("/posts/")+7);
        let commId = Object.values(reblogJSON)[0].filter(function(value){
            return value.id == postId;
        })[0].community_id;
        if (commId == null) return;
        let comm = comms.filter(function(value){
            return value[0] == commId;
        });
        if (comm.length > 0) {
            reblog.outerHTML += " to <a href='https://www.pillowfort.social/community/" + comm[0][1] + "'>" + comm[0][1] + "</a>";
        } else {
            commByPost(reblog);
        }
    }

    /* When a community isn't in the cache, it is requested from the Pillowfort server.*/
    function commByPost(reblog) {
        let postId = reblog.href.substring(reblog.href.search("/posts/")+7);
        $.getJSON('https://www.pillowfort.social/posts/'+postId+'/json', function(data) {
            reblog.outerHTML += " to <a href='https://www.pillowfort.social/community/" + data.comm_name + "'>" + data.comm_name + "</a>";
        }).fail(function(value) {
            reblog.outerHTML += " to <abbr title='" + value.statusText + "'>???</abbr>";
        });
    }
})();
