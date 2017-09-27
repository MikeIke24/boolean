var GameLogic = (function () {
    function GameLogic(strictMode) {
        this.currentTurn = 'computer';
        this.totalCount = 0;
        this.userCount = 0;
        this.userCountCheck = 0;
        this.colorSequence = [randomNumber()];
        this.allowPushNum = true;
        this.strictMode = strictMode;
        this.chancesLeft = strictMode ? 0 : 1;
        this.strictButtonLight = document.getElementsByClassName('strict-light');
    }
    GameLogic.prototype.gameReset = function () {
        clearTimeout(gameControls.playerTimeout);
        clearInterval(gameControls.playerInterval);
    };
    GameLogic.prototype.gameOver = function () {
        this.gameReset();
        this.constructor(this.strictMode);
        this.currentTurn = 'computer';
        this.totalCount = 0;
        this.userCount = 0;
        this.userCountCheck = 0;
        this.colorSequence = [randomNumber()];
        this.playerChoice;
        this.allowPushNum = true;
        changeCountText('0');
        document.getElementById('start').innerText = 'START';
    };
    GameLogic.prototype.loseLife = function () {
        if (this.chancesLeft === 1) {
            this.chancesLeft -= 1;
            this.totalCount -= 1;
            this.colorSequence = this.colorSequence.slice(0, length - 1);
            this.currentTurn = 'computer';
            this.allowPushNum = false;
            this.gameReset();
            alert('Lucky you, you get another chance!');
            setTimeout(function () {
                gameControls.logic();
            }, 500);
        }
        else {
            alert('Sorry, Game Over!');
            this.gameOver();
        }
    };
    GameLogic.prototype.strictClick = function () {
        if (switchControls.onSwitch) {
            if (!this.strictMode) {
                this.chancesLeft = 0;
                this.strictMode = !this.strictMode;
                this.strictButtonLight[0].style.filter = 'brightness(1.9)';
            }
            else {
                this.chancesLeft = 1;
                this.strictMode = !this.strictMode;
                this.strictButtonLight[0].style.filter = 'brightness(0.6)';
            }
        }
    };
    GameLogic.prototype.btnClick = function (color) {
        if (startControls.startButtonOn && this.currentTurn === 'user') {
            this.playerChoice = colorToNum(color);
            playAudio(this.playerChoice);
            this.userCount += 1;
        }
    };
    GameLogic.prototype.switchTurn = function () {
        this.currentTurn = this.currentTurn === 'computer' ? 'user' : 'computer';
    };
    GameLogic.prototype.gameWon = function () {
        alert('Congratulations, you won!');
        this.gameOver();
    };
    GameLogic.prototype.logic = function () {
        if (this.currentTurn === 'computer') {
            clearInterval(gameControls.playerInterval);
            this.totalCount += 1;
            if (this.totalCount >= 21) {
                this.gameWon();
                return;
            }
            changeCountText(this.totalCount.toString());
            removeClasses(['btn']);
            gameTiming(this.totalCount);
        }
        else {
            //addClickEvents(['green','red','blue','yellow']);
            this.userCountCheck = this.userCount;
            var iter_1 = 0;
            this.playerTimeout = setTimeout(function () {
                gameControls.loseLife();
            }, 5000);
            this.playerInterval = setInterval(function () {
                if (gameControls.userCountCheck !== gameControls.userCount) {
                    // TODO FIX TIMER
                    if (gameControls.playerChoice == gameControls.colorSequence[iter_1]) {
                        iter_1++;
                        gameControls.userCountCheck = gameControls.userCount;
                        clearTimeout(gameControls.playerTimeout);
                        gameControls.playerTimeout;
                        if (gameControls.totalCount === iter_1) {
                            setTimeout(function () {
                                gameControls.currentTurn = 'computer';
                                clearTimeout(gameControls.playerTimeout);
                                gameControls.logic();
                            }, 1000);
                        }
                    }
                    else {
                        gameControls.loseLife();
                    }
                }
            }, 100);
        }
    };
    return GameLogic;
}());
var SwitchLogic = (function () {
    function SwitchLogic() {
        this.onSwitch = false;
        this.startLight = false;
        this.strictLight = false;
    }
    SwitchLogic.prototype.onToggle = function () {
        this.onSwitch = !this.onSwitch;
        this["switch"] = document.getElementsByClassName('switch');
        if (this.onSwitch) {
            this["switch"][0].style.transition = 'left 0.5s ease';
            this["switch"][0].style.left = '1.8rem';
            turningOnSequence();
        }
        else {
            this["switch"][0].style.transition = 'left 0.5s ease';
            this["switch"][0].style.left = '0.4rem';
            turningOffSequence();
        }
    };
    return SwitchLogic;
}());
var StartButtonLogic = (function () {
    function StartButtonLogic() {
        this.startButtonOn = false;
        this.ongoingGame = false;
    }
    StartButtonLogic.prototype.startClick = function () {
        if (switchControls.onSwitch) {
            if (!this.startButtonOn) {
                this.startButtonOn = true;
                this.startButtonLight = document.getElementsByClassName('start-light');
                this.startButtonLight[0].style.filter = 'brightness(1.9)';
                changeCountText('0');
                document.getElementById('start').innerText = 'RESTART';
                gameControls.logic();
            }
            else {
                changeCountText('0');
                gameControls.gameOver();
                gameControls.logic();
            }
        }
    };
    return StartButtonLogic;
}());
function turningOffSequence() {
    if (startControls.startButtonLight) {
        startControls.startButtonOn = false;
        startControls.startButtonLight[0].style.filter = 'brightness(0.6)';
        gameControls.strictButtonLight[0].style.filter = 'brightness(0.6)';
    }
    removeClasses(['btn', 'inner-btn']);
    gameControls.gameOver();
    clearTimeout;
    changeCountText('');
}
function turningOnSequence() {
    addClasses(['btn', 'inner-btn']);
    changeCountText('--');
    gameControls.gameOver();
    gameControls.gameReset();
}
function changeCountText(text) {
    var count = document.getElementsByClassName('count-text');
    count[0].textContent = text;
}
function addClickEvents(classNames) {
    for (var j = 0; j < classNames.length; j++) {
        var element = document.getElementsByClassName(classNames[j]);
        element[0].setAttribute('onclick', '``');
    }
}
function removeClickEvents(classNames) {
    for (var j = 0; j < classNames.length; j++) {
        var element = document.getElementsByClassName(classNames[j]);
        element[0].setAttribute('onclick', "\"gameControls.btnClick('" + classNames[j] + "'')\"");
    }
}
function addClasses(classNames) {
    for (var j = 0; j < classNames.length; j++) {
        var elements = document.getElementsByClassName(classNames[j]);
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add(classNames[j] + 'H');
        }
    }
}
function removeClasses(classNames) {
    for (var j = 0; j < classNames.length; j++) {
        var elements = document.getElementsByClassName(classNames[j]);
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove(classNames[j] + 'H');
        }
    }
}
function lastCompPress() {
    gameControls.allowPushNum = true;
    addClasses(['btn']);
    gameControls.currentTurn = 'user';
    gameControls.logic();
    return null;
}
function gameTiming(N) {
    if (N === 0) {
        return lastCompPress();
    }
    if (N === 1 && gameControls.allowPushNum) {
        var randomNum = randomNumber();
        gameControls.colorSequence.push(randomNum);
        //playAudio(randomNum);
    }
    var flippedSeq = (gameControls.colorSequence);
    var elNum = flippedSeq[gameControls.totalCount - (N)];
    if (elNum === undefined) {
        return lastCompPress();
    }
    var el = document.getElementById(String(elNum));
    el.classList.add('btn-comp-click');
    playAudio(elNum);
    setTimeout(function () {
        el.classList.remove('btn-comp-click');
    }, 500);
    setTimeout(function () {
        gameTiming(N - 1);
    }, 1000);
}
function randomNumber() {
    return Math.floor((Math.random() * 4) + 1) - 1;
}
function colorToNum(c) {
    switch (c) {
        case 'green':
            return 0;
        case 'red':
            return 1;
        case 'yellow':
            return 2;
        case 'blue':
            return 3;
        default:
            alert('Something went wrong');
            break;
    }
}
function playAudio(colorId) {
    var x = document.getElementById('s' + colorId.toString());
    x.play()["catch"](function (error) {
        playAudio(colorId);
    });
}
function resizeGameWidth(upperScreenWidth, upperFontSize, lowerScreenWidth, lowerFontSize) {
    /* Takes x2,y2,x1,y1 in that order. x is the screen width, y is the font size.
    Sets the global font size based on a linear relationship*/
    var setFontSize;
    var x = window.innerWidth;
    if (x < lowerScreenWidth) {
        return lowerFontSize;
    }
    else if (x > upperScreenWidth) {
        return upperFontSize;
    }
    else {
        var slope = (upperFontSize - lowerFontSize) / (upperScreenWidth - lowerScreenWidth);
        var yint = upperFontSize - (slope * upperScreenWidth);
        return (slope * x) + yint;
    }
}
function resizeGameHeight(upperScreenHeight, upperFontSize, lowerScreenHeight, lowerFontSize) {
    /* Takes x2,y2,x1,y1 in that order. x is the screen width, y is the font size.
    Sets the global font size based on a linear relationship*/
    var setFontSize;
    var y = window.innerHeight;
    if (y < lowerScreenHeight) {
        return lowerFontSize;
    }
    else if (y > upperScreenHeight) {
        return upperFontSize;
    }
    else {
        var slope = (upperFontSize - lowerFontSize) / (upperScreenHeight - lowerScreenHeight);
        var yint = upperFontSize - (slope * upperScreenHeight);
        return (slope * y) + yint;
    }
}
function completeResize() {
    var widthFont = resizeGameWidth(600, 18, 250, 8);
    var heightFont = resizeGameHeight(650, 18, 250, 8);
    var setFontSize = widthFont < heightFont ? widthFont : heightFont;
    document.documentElement.style.fontSize = (setFontSize + "px");
}
var gameControls = new GameLogic(false);
var switchControls = new SwitchLogic();
var startControls = new StartButtonLogic();
completeResize();
window.addEventListener('resize', function () {
    completeResize();
});
//removeClickEvents(['green','red','blue','yellow']); 
