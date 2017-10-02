var ConvertedBoolText = (function () {
    function ConvertedBoolText(text, source) {
        this.activeText = "";
        this.allowAnd = true;
        this.activeText = this.general(text);
        this.activeSource = "agentEM";
        this.activeSource = source;
    }
    ConvertedBoolText.prototype.general = function (text) {
        var textCopy = text;
        for (var i = 0; i < text.length; i++) {
            if (text.charAt(i) == "(" || text.charAt(i) == "[") {
                this.allowAnd = false;
            }
            else if (text.charAt(i) === ")" || text.charAt(i) == "]") {
                this.allowAnd = true;
            }
            else if (text.charAt(i) === " ") {
                if (text.charAt(i + 1) === "-") {
                    var replaceString = "NOT ";
                    text = setCharAt(text, i + 1, replaceString);
                    i = i + replaceString.length;
                }
                else if (this.allowAnd) {
                    var replaceString = " AND ";
                    text = setCharAt(text, i, replaceString);
                    i = i + replaceString.length - 1;
                }
            }
        }
        // if 'or' is in lowercase, convert to uppercase
        text = text.replace(/\sor\s/g, " OR ");
        if (formSettings.radioSelection !== "agentEM") {
            var reOr = /\(([^()]+)\)/g;
            text = text.replace(reOr, orAdder);
            var re = /\[([a-zA-Z0-9-\s\*]+)\]/g;
            switch (formSettings.radioSelection) {
                case "monster":
                    text = text.replace(re, this.monster);
                    break;
                case "careerBuilder":
                    text = text.replace(re, this.careerBuilder);
                    break;
                case "dice":
                    text = text.replace(re, this.dice);
                    break;
            }
        }
        else {
            return textCopy;
        }
        text = text.replace('_', ' ');
        return text;
    };
    ConvertedBoolText.prototype.monster = function (match) {
        return nearAdder(match, formSettings.nearNum, 'monster');
    };
    ConvertedBoolText.prototype.careerBuilder = function (match) {
        return nearAdder(match, formSettings.nearNum, 'careerBuilder');
    };
    ConvertedBoolText.prototype.dice = function (match) {
        return nearAdder(match, formSettings.nearNum, 'dice');
    };
    return ConvertedBoolText;
}());
var FormSettings = (function () {
    function FormSettings() {
        this.radioSelection = "agentEM";
        this.nearNum = $('#near-select').find(":selected").text();
    }
    return FormSettings;
}());
/*----------------------------------------*/
var formSettings = new FormSettings();
modal("#renderPopups", "#settings-btn");
$("#boolUpdate").click(function () {
    var boolText = $("#boolIn").val();
    var convertedBoolText = new ConvertedBoolText(boolText, formSettings.radioSelection);
    $("#boolOut").text(convertedBoolText.activeText);
});
$("#form").submit(function (e) {
    e.preventDefault();
});
$("#form input").on("change", function () {
    formSettings.radioSelection = $("input[name=sources]:checked", "#form").val();
});
$('#near-select').on("change", function () {
    formSettings.nearNum = $('#near-select').find(":selected").text();
    document.getElementById('boolUpdate').click();
});
new Clipboard('#boolOut');
$('#boolOut').click(function () {
    if ($('#boolOut').text()) {
        $('#copiedInfo').html("<div class=\"alert alert-success text-center\">\n    <strong>Success!</strong> Text copied to clipboard.\n  </div>").fadeIn("slow");
        setTimeout(function () {
            $('#copiedInfo').fadeOut("slow");
        }, 1500);
    }
});
/*----------------------------------------*/
function setCharAt(str, index, chr) {
    if (index > str.length - 1)
        return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}
function nearAdder(match, nearNumber, source) {
    var innerText = match.slice(1, -1);
    var innerTextSplit = innerText.split(" ");
    var nearText;
    switch (source) {
        case 'dice':
            nearText = " NEAR/" + nearNumber + " ";
            break;
        case 'careerBuilder':
            nearText = " NEAR" + nearNumber + " ";
            break;
        default:
            nearText = ' NEAR ';
    }
    innerTextSplit.splice(1, 0, nearText);
    innerTextSplit.push(")");
    innerTextSplit.unshift("(");
    return innerTextSplit.join("");
}
function orAdder(match) {
    return match.replace(new RegExp(' ', 'g'), ' OR ');
}
function modal(containerDiv, clickTrigger) {
    var modalOpen = false;
    $(clickTrigger).on("click", function () {
        modalOpen = true;
        var htmlPopup = "";
        htmlPopup += "<div id=\"popup\">" + modalContent() + "</div>";
        $(containerDiv).html(htmlPopup);
        var _a = modalSizing(modalOpen), modalTop = _a[0], winHeight = _a[1], topPos = _a[2];
        $(containerDiv).fadeIn(450);
        $("#popup").animate({ top: modalTop + "px" }, 425);
        window.onscroll = function () {
            window.scrollTo(0, topPos);
        };
        $(window).resize(function () {
            _a = modalSizing(modalOpen), modalTop = _a[0], winHeight = _a[1], topPos = _a[2];
            var _a;
        });
        $("#xButtonPopup").on("click", function () {
            modalOpen = false;
            $(window).off("resize");
            $(containerDiv).fadeOut(450);
            $("#popup").animate({ top: winHeight + topPos + 10 + "px" }, 425);
            window.onscroll = function () { };
        });
    });
}
function modalSizing(modalOpen) {
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var topPos = document.body.scrollTop;
    var modalHeight = 0.8 * winHeight;
    var stopGrowing = window.screen.width / 1.5;
    if (winWidth >= stopGrowing) {
        var modalWidth = stopGrowing * 0.95;
    }
    else {
        var modalWidth = winWidth * 0.95;
    }
    var modalTop = winHeight * 0.5 - modalHeight * 0.5;
    var modalLeft = winWidth * 0.5 - modalWidth * 0.5;
    if (modalOpen) {
        $("#popup").css("top", modalTop + "px");
    }
    else {
        $("#popup").css("top", winHeight + topPos + 10 + "px");
    }
    $("#popup").css("left", modalLeft + "px");
    $("#popup").css("height", modalHeight + "px");
    $("#popup").css("width", modalWidth + "px");
    return [modalTop, winHeight, topPos];
}
function modalContent() {
    var html = "";
    html += "\n      <div class=\"modal-header\">\n        <div class=\"modal-top-sizing\"></div>\n        <div class=\"modal-title\">\n          Settings\n        </div>\n        <div id=\"xButtonPopup\" class=\"modal-top-sizing\">\n          <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n        </div>\n      </div>\n      <div class=\"modal-body\">\n      <h4 class=\"text-center\">Instructions:</h4>\n  <br>\n  <ul>\n  <li class=\"inst-li\"><b>To add an \"AND\" just add a space.</b>\n  <br>\n   Ex: Java Sql Oracle = Java AND Sql AND Oracle</li>\n  <div class=\"hor-line\"></div>\n  <li class=\"inst-li\"><b>To add an \"OR\" just add a space between words inside parenthesis.</b>\n  <br>\n   Ex: (Java Sql) Oracle = (Java OR Sql) AND Oracle</li>\n  <div class=\"hor-line\"></div>\n  <li class=\"inst-li\"><b>To add a \"NOT\" just add a minus sign before the word to be ommitted.</b>\n  <br>\n   Ex: Java Sql -Oracle = Java AND Sql NOT Oracle</li>\n  <div class=\"hor-line\"></div>\n  <li class=\"inst-li\"><b>Use quotes to find an exact match.</b>\n  <br>\n  Ex: \"develop\" matches \"develop\" but not \"developers\"</li>\n  <div class=\"hor-line\"></div>\n  <li class=\"inst-li\"><b>Use an asterisk to match anything after what's typed.</b>\n  <br>\n  Ex: \"devel*\" matches \"develop\" and \"developers\"</li>\n  <div class=\"hor-line\"></div>\n  <div class=\"hor-line\"></div>\n  <li class=\"inst-li\"><b>Use two words inside of brackets to perform proximity searches.</b>\n  <br>\n  <b>Use the optional proximity selectors to set the max word separation count.</b>\n  <br>\n  Monster Ex: [sql developer] = sql NEAR developer\n  <br>\n  Career Builder Ex: [sql developer] = sql NEAR3 developer\n  <br>\n  Dice Ex: [sql developer] = sql NEAR/3 developer\n  </li>\n  </ul>\n     </div>\n  ";
    return html;
}
