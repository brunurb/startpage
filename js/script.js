/*=====================================================================================================*/
/* Giving credit where credit is due, The JS is all built off of my original mod of Twily's homepage. */
/* If there are any similarities left, it's probably because it's based on his code.                 */
/*==================================================================================================*/

var $ = function(id) {
  return document.getElementById(id);
};
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THRUSDAY", "FRIDAY", "SATURDAY"];

/*==============*/
/*== Options ==*/
/*============*/

var CookiePrefix = "taco_stpg_"; //prefix for cookies.
var cmdPrefix = "!"; //prefix for commands.
var ssi = 1; //set default search provider. Use array index of the array below. (Starting with 0)
// Format: [Keyword, Search URL (Search query replaces "{Q}"), "Input placeholder text"]
var searchSources = [
  ["bbt",      "http://bakabt.me/browse.php?q={Q}",                      "BakaBT"],
  ["g",        "https://www.google.com/#q={Q}",                          "google_logo"],
  ["im",       "https://www.google.com/search?tbm=isch&q={Q}",           "google_logo Images"],
  ["imdb",     "http://www.imdb.com/find?q={Q}",                         "IMDB"],
  ["nya",      "https://www.nyaa.se/?page=search&term={Q}",              "Nyaa Torrents"],
  ["ud",       "http://www.urbandictionary.com/define.php?term={Q}",     "Urban Dictionary"],
  ["wp",       "http://en.wikipedia.org/w/index.php?search={Q}",         "Wikipedia"],
  ["yt",       "https://www.youtube.com/results?search_query={Q}",       "YouTube"]
];

// Because I care about readability in my JS. kthx.
var svgClover  = "<svg style=\"width:34px;height:34px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z\" /></svg>";
var svgCode    = "<svg style=\"width:24px;height:24px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z\" /></svg>";
var svgGamepad = "<svg style=\"width:24px;height:24px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7,6H17A6,6 0 0,1 23,12A6,6 0 0,1 17,18C15.22,18 13.63,17.23 12.53,16H11.47C10.37,17.23 8.78,18 7,18A6,6 0 0,1 1,12A6,6 0 0,1 7,6M6,9V11H4V13H6V15H8V13H10V11H8V9H6M15.5,12A1.5,1.5 0 0,0 14,13.5A1.5,1.5 0 0,0 15.5,15A1.5,1.5 0 0,0 17,13.5A1.5,1.5 0 0,0 15.5,12M18.5,9A1.5,1.5 0 0,0 17,10.5A1.5,1.5 0 0,0 18.5,12A1.5,1.5 0 0,0 20,10.5A1.5,1.5 0 0,0 18.5,9Z\" /></svg>";
var svgMore    = "<svg style=\"width:34px;height:34px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M 0 9.6 L 0 14.4 C 0 15.064 0.536 15.6 1.2 15.6 L 2.4 15.6 L 2.4 8.4 L 1.2 8.4 C 0.536 8.4 0 8.936 0 9.6 Z  M 17.4 3.6 L 13.2 3.6 L 13.2 1.2 C 13.2 0.536 12.664 0 12 0 C 11.336 0 10.8 0.536 10.8 1.2 L 10.8 3.6 L 6.6 3.6 C 4.943 3.6 3.6 4.943 3.6 6.6 L 3.6 16.8 C 3.6 18.124 4.676 19.2 6 19.2 L 18 19.2 C 19.324 19.2 20.4 18.124 20.4 16.8 L 20.4 6.6 C 20.4 4.943 19.057 3.6 17.4 3.6 Z  M 9.6 15.6 L 7.2 15.6 L 7.2 14.4 L 9.6 14.4 L 9.6 15.6 Z  M 8.4 11.1 C 7.571 11.1 6.9 10.429 6.9 9.6 C 6.9 8.771 7.571 8.1 8.4 8.1 C 9.229 8.1 9.9 8.771 9.9 9.6 C 9.9 10.429 9.229 11.1 8.4 11.1 Z  M 13.2 15.6 L 10.8 15.6 L 10.8 14.4 L 13.2 14.4 L 13.2 15.6 Z  M 16.8 15.6 L 14.4 15.6 L 14.4 14.4 L 16.8 14.4 L 16.8 15.6 Z  M 15.6 11.1 C 14.771 11.1 14.1 10.429 14.1 9.6 C 14.1 8.771 14.771 8.1 15.6 8.1 C 16.429 8.1 17.1 8.771 17.1 9.6 C 17.1 10.429 16.429 11.1 15.6 11.1 Z  M 22.8 8.4 L 21.6 8.4 L 21.6 15.6 L 22.8 15.6 C 23.464 15.6 24 15.064 24 14.4 L 24 9.6 C 24 8.936 23.464 8.4 22.8 8.4 Z\" /></svg>";
var svgSocial  = "<svg style=\"width:24px;height:24px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z\" /></svg>";
var svgTrash   = "<svg style=\"width:34px;height:34px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-2 0 24 24\"><path d=\"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z\" /></svg>";

/* Header Format: ["(Label)", "(Accent Color)", "-HEAD-"],
*   - The labels are setup for 24px SVGs. by default they are separated from the linkMenu for readability.
*   - Accent color can be: black, white, blue, green, cyan, red, magenta, and yellow. by default, the accent color is white.
*   - ALL categories need a header to start them. Headers are signified by the -HEAD- in the 3rd position.
* Link Format: ["Name", "URL",""],
*   - Name and URL are pretty self explanitory. 
*   - 3rd position may be used in the future, but right now it's not used and can be left blank.
*/
// Also yes I could totally use a json object to represent the menus, but I didn't feel like reprogramming the whole script. Probably doing that next site, though.
var linkMenu = [
  [svgTrash,                   "white",                                        "-HEAD-"], // Anime
  ["gravit designer",          "https://designer.gravit.io/",""],
  ["canva",                    "https://www.canva.com/",""],
  ["vectorizer",                    "https://www.vectorizer.io/",""],
  ["spreadshirt",              "https://partner.spreadshirt.co.uk/designs",""],
  ["discord",                  "https://discordapp.com/",""],
  ["GIFVideo",                 "https://ezgif.com/",""],
  ["scantheworld",                 "https://www.myminifactory.com/scantheworld/",""],
  
  [svgSocial,                  "white",                                       "-HEAD-"], // Media
  ["YouTube",                  "https://www.youtube.com/",""],
  ["openclipart",              "https://openclipart.org/",""],
  ["Reddit",                   "https://www.reddit.com/",""],
  ["Twitch",                   "https://www.twitch.tv/",""],
  ["DeviantArt",               "https://www.deviantart.com/brunurb",""],
  ["music-map",                   "https://www.music-map.com/",""],
  
  [svgClover,                  "white",                                        "-HEAD-"], // tools
  ["FeedReader",               "https://www.inoreader.com/",""],
  ["glitch",           "https://glitch.com/",""],
  ["pdfcandy",     "https://pdfcandy.com/",""],
  ["paletton",   "http://www.paletton.com",""],
 ["Font design",   "https://www.metaflop.com/modulator",""],
  ["photopea",   "https://www.photopea.com/",""],
  ["symbolab",   "https://www.symbolab.com/",""],
    ["gdeltproject",   "https://www.gdeltproject.org/",""],
  ["gdeltproject",   "https://github.com/sindresorhus/awesome",""],
   ["touch-mapper",   "https://www.touch-mapper.org/en/",""],
  
  
  [svgCode,                    "white",                                         "-HEAD-"], // FuelRats
  ["GitHub",                   "https://github.com/brunurb",""],
  ["Gist",                     "",""],
  ["JSFiddle",                 "",""],
  ["Stack Overflow",           "https://stackoverflow.com",""],
   
  [svgGamepad,                 "white",                                     "-HEAD-"], // Gaming
  ["pizzamaking",                    "https://www.pizzamaking.com",""],
  ["moddb",            "https://www.moddb.com/",""],
  ["0 A.D.",                  "https://play0ad.com/",""],
  ["openra",                "http://www.openra.net/",""],
   ["flightgear",                "http://home.flightgear.org/",""],
    ["opencity",                    "http://www.opencity.info/",""],
    ["Steam",                    "",""],
    ["Steam",                    "",""],
    ["Steam",                    "",""],
    ["Steam",                    "",""],
    ["Steam",                    "",""],
    ["Steam",                    "",""],
  
  [svgMore,                    "white",                                      "-HEAD-"], // Other
  ["Gmail",                    "https://mail.google.com/",""],
  ["the-eye",                  "https://the-eye.eu//",""],
  ["weboas.is",                "https://weboas.is/",""],
  ["inbox",                    "https://inbox.google.com/",""],
  ["Amazon",                   "https://merch.amazon.com/landing",""],
  ["torrents",                 "https://rarbgunblock.com/torrents.php",""],
  ["tviplayer",                "http://tviplayer.iol.pt/direto/TVI24",""],
  ["rtp",                      "https://www.rtp.pt/play/direto/rtp3",""],
  ["twitter",                  "https://twitter.com",""],
  ["cwseed",                   "http://www.cwseed.com/",""]
];
// DID I FORGET TO MENTION?! THE DEMO LINKS DO NOTHING!

/*==================*/
/*== Main Script ==*/
/*================*/

//core element vars
var searchInput = $('searchBar');
var rootMenuUL = $('categoryMenu');
var dateDiv = $('dateContainer');
var notesTextarea = $('notesInput');

function init() {
  initSearchBar();
  buildDate();
  buildMenu();
  $('body').style.opacity = 1;
  $('mainContainer').style.opacity = 1;
  $('dateContainer').style.opacity = 1;
  $('notesWidget').style.opacity = 1;
}

function initSearchBar() {
  if (searchSources[ssi] !== undefined)
    searchInput.placeholder = searchSources[ssi][2];
  else {
    ssi = 0;
    searchInput.placeholder = "Do you know what you're doing?";
    alert("Error: default search engine setting is invalid!");
  }
  
  document.addEventListener('keydown', function(event) { handleKeydown(event); });
  
  searchInput.value = "";
}

function buildDate() {
  var today = new Date();
  dateDiv.innerHTML = "<font class=\"font-3em\">" +
                      monthNames[today.getMonth()] + 
                      " " + 
                      today.getDate() + 
                      "</font><br><font>" + 
                      dayNames[today.getDay()] + 
                      ", " + 
                      today.getFullYear() +
                      "</font>";
}

function buildMenu() {
  var newMenu = "";
  var accent = "";

  if(linkMenu[0][2] === "-HEAD-") {

    if (linkMenu[0][1] !== "") accent = linkMenu[0][1].toLowerCase();
    else accent = "white";

    newMenu += "<li class=\"button-container expanding-down\"><div class=\"button accent-" + accent + "\"><label class=\"button-content\">" + linkMenu[0][0] + "</label><div class=\"button-expanded-content\"><ul class=\"menu-link container\">";
  } else {
    alert("linkMenu is invalid. Ensure to start the list with a -HEAD- entry.");
  }
  for (var i = 1; i < linkMenu.length; i++) {
    if (linkMenu[i][2] === "-HEAD-") {

      if (linkMenu[i][1] !== "") accent = linkMenu[i][1].toLowerCase();
      else accent = "white";

      newMenu += "</ul></div></div></li><li class=\"button-container expanding-down\"><div class=\"button accent-" + accent + "\"><label class=\"button-content\">" + linkMenu[i][0] + "</label><div class=\"button-expanded-content\"><ul class=\"menu-link container\">";
    } else {
      newMenu += "<li class='menu-link-item'><a href=\"" + linkMenu[i][1] + "\" target=\"_self\"><label>" + linkMenu[i][0] + "</label></a></li>";
    }
  }
  newMenu +="</ul></div></div></li>";

  rootMenuUL.innerHTML = newMenu;
}

function handleQuery(event, query) {
  var key = event.keyCode || event.which;
  if(query !== "") {
    var qlist;
    if (key === 32) {
      qList = query.split(" ");
      if (qList[0].charAt(0) === cmdPrefix) {
        var keyword = "";
        for (var i = 0; i < searchSources.length; i++) {
          keyword = cmdPrefix + searchSources[i][0];
          if (keyword === qList[0]) {
            ssi = i;
            searchInput.placeholder = searchSources[ssi][2];
            searchInput.value = query.replace(keyword, "").trim();
            event.preventDefault();
            break;
          }
        }
      }
    } else if (key === 13) {
      qList = query.split(" ");
      if (qList[0].charAt(0) === cmdPrefix) {
        var keyword = "";
        for (var i = 0; i < searchSources.length; i++) {
          keyword = cmdPrefix + searchSources[i][0];
          if (keyword === qList[0]) {
            ssi = i;
            break;
          }
        }
        if (qList.length > 1) {
          window.location = searchSources[ssi][1].replace("{Q}", encodeURIComponent(query.replace(keyword, ""))).trim();
        } else {
          searchInput.placeholder = searchSources[ssi][2];
          searchInput.value = "";
        }
      } else {
        window.location = searchSources[ssi][1].replace("{Q}", encodeURIComponent(query));
      }
    } 
  }
  if (key === 27) {
    searchInput.blur();
  }
}

function handleNoteInput(event) {
  var key = event.keyCode || event.which;
  if (key === 27) {
    notesTextarea.blur();
  }
}

var noteText = null;
function handleNotes(event, focus){
  if (focus) {
    if(!noteText) {
      noteText = GetCookie("notes") || "";
    }
    notesTextarea.value = noteText;
    addClass('notesContainer', "active");
  } else {
    removeClass('notesContainer', "active");
    if(noteText !== notesTextarea.value) {
      noteText = notesTextarea.value;
      SetCookie("notes", noteText, 365 * 24 * 60 * 60 * 1000);
    }
  }
}

var ignoredKeys = [9,13,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,46,91,92,93,112,113,114,115,116,117,118,119,120,121,122,123,144,145];
function handleKeydown(event) {
  if(notesInput === document.activeElement) return;
  if(searchInput === document.activeElement) return;
  if (ignoredKeys.includes(event.keyCode)) return;
  searchInput.focus();
}

function addClass(elementID, className) {
  $(elementID).classList.add(className);
}
function removeClass(elementID, className) {
  $(elementID).classList.remove(className);
}

function GetCookie(name) {
    try {
        var cookie = document.cookie;
        name = CookiePrefix + name;
        var valueStart = cookie.indexOf(name + "=") + 1;
        if (valueStart === 0) {
            return null;
        }
        valueStart += name.length;
        var valueEnd = cookie.indexOf(";", valueStart);
        if (valueEnd == -1)
            valueEnd = cookie.length;
        return decodeURIComponent(cookie.substring(valueStart, valueEnd));
    } catch (e) {
      console.log(e);
    }
    return null;
}
function SetCookie(name, value, expire) {
    var temp = CookiePrefix + name + "=" + escape(value) + ";" + (expire !== 0 ? "expires=" + ((new Date((new Date()).getTime() + expire)).toUTCString()) + ";" : " path=/;");
    console.log(temp);
    document.cookie = temp;
}
function CanSetCookies() {
    SetCookie('CookieTest', 'true', 0);
    var can = GetCookie('CookieTest') !== null;
    DelCookie('CookieTest');
    return can;
}
function DelCookie(name) {
    document.cookie = fr.client.CookieBase + name + '=0; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
