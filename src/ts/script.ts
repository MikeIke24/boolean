class GameLogic {
    chancesLeft: number;
    strictMode: boolean;
    strictButtonLight: any;
    currentTurn: string = 'computer';
    totalCount: number = 0;
    userCount: number = 0;
    userCountCheck: number = 0;
    colorSequence: number[] = [randomNumber()];
    playerChoice: number;
    playerTimeout: any;
    playerInterval: any;
    allowPushNum: boolean = true;
    constructor(strictMode: boolean) {
        this.strictMode = strictMode;
        this.chancesLeft = strictMode ? 0 : 1;
        this.strictButtonLight = document.getElementsByClassName('strict-light');
    }
    gameReset() {
        clearTimeout(gameControls.playerTimeout);
        clearInterval(gameControls.playerInterval);
    }
    gameOver() {
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
    }
    loseLife() {
        if (this.chancesLeft === 1) {
            this.chancesLeft -= 1;
            this.totalCount -= 1;
            this.colorSequence = this.colorSequence.slice(0, length - 1);
            this.currentTurn = 'computer';
            this.allowPushNum = false;
            this.gameReset();
            alert('Lucky you, you get another chance!')
            setTimeout(function () {
                gameControls.logic();
            }, 500);
        } else {
            alert('Sorry, Game Over!');
            this.gameOver();
        }
    }
    strictClick() {
        if (switchControls.onSwitch) {
            if (!this.strictMode) {
                this.chancesLeft = 0;
                this.strictMode = !this.strictMode;
                this.strictButtonLight[0].style.filter = 'brightness(1.9)';
            } else {
                this.chancesLeft = 1;
                this.strictMode = !this.strictMode;
                this.strictButtonLight[0].style.filter = 'brightness(0.6)';
            }
        }
    }
    btnClick(color: string) {
        if (startControls.startButtonOn && this.currentTurn === 'user') {
            this.playerChoice = colorToNum(color);
            playAudio(this.playerChoice);
            this.userCount += 1;

        }
    }
    switchTurn() {
        this.currentTurn = this.currentTurn === 'computer' ? 'user' : 'computer';
    }
    gameWon() {
        alert('Congratulations, you won!');
        this.gameOver();
    }
    logic() {

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
        } else {
            //addClickEvents(['green','red','blue','yellow']);


            this.userCountCheck = this.userCount;
            let iter = 0;
            this.playerTimeout = setTimeout(function () {
                gameControls.loseLife();
            }, 5000);
            this.playerInterval = setInterval(function () {
                if (gameControls.userCountCheck !== gameControls.userCount) {
                    // TODO FIX TIMER
                    if (gameControls.playerChoice == gameControls.colorSequence[iter]) {
                        iter++;
                        gameControls.userCountCheck = gameControls.userCount;
                        clearTimeout(gameControls.playerTimeout);
                        gameControls.playerTimeout;
                        if (gameControls.totalCount === iter) {
                            setTimeout(function () {
                                gameControls.currentTurn = 'computer';
                                clearTimeout(gameControls.playerTimeout);
                                gameControls.logic();
                            }, 1000);

                        }
                    } else {
                        gameControls.loseLife();
                    }
                }

            }, 100);

        }


    }
}

class SwitchLogic {
    onSwitch: boolean = false;
    startLight: boolean = false;
    strictLight: boolean = false;
    switch: any;
    onToggle() {
        this.onSwitch = !this.onSwitch;
        this.switch = document.getElementsByClassName('switch');
        if (this.onSwitch) {
            this.switch[0].style.transition = 'left 0.5s ease';
            this.switch[0].style.left = '1.8rem';
            turningOnSequence();
        } else {
            this.switch[0].style.transition = 'left 0.5s ease';
            this.switch[0].style.left = '0.4rem';
            turningOffSequence();
        }
    }
}

class StartButtonLogic {
    startButtonLight: any;
    startButtonOn: boolean = false;
    ongoingGame: boolean = false;
    startClick() {
        if (switchControls.onSwitch) {
            if (!this.startButtonOn) {
                this.startButtonOn = true;
                this.startButtonLight = document.getElementsByClassName('start-light');
                this.startButtonLight[0].style.filter = 'brightness(1.9)';
                changeCountText('0');
                document.getElementById('start').innerText = 'RESTART';
                gameControls.logic();
            } else {
                changeCountText('0');
                gameControls.gameOver();
                gameControls.logic();
            }
        }
    }
}

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

function changeCountText(text: string) {
    let count = document.getElementsByClassName('count-text');
    count[0].textContent = text;
}

function addClickEvents(classNames: string[]) {
    for (let j = 0; j < classNames.length; j++) {
        let element = document.getElementsByClassName(classNames[j]);
        element[0].setAttribute('onclick', '``');
    }
}

function removeClickEvents(classNames: string[]) {
    for (let j = 0; j < classNames.length; j++) {
        let element = document.getElementsByClassName(classNames[j]);
        element[0].setAttribute('onclick', `"gameControls.btnClick('${classNames[j]}'')"`);
    }
}

function addClasses(classNames: string[]) {
    for (let j = 0; j < classNames.length; j++) {
        let elements = document.getElementsByClassName(classNames[j]);
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add(classNames[j] + 'H');
        }
    }
}

function removeClasses(classNames: string[]) {
    for (let j = 0; j < classNames.length; j++) {
        let elements = document.getElementsByClassName(classNames[j]);
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove(classNames[j] + 'H');
        }
    }
}

function lastCompPress(): void {
    gameControls.allowPushNum = true;
    addClasses(['btn']);
    gameControls.currentTurn = 'user';
    gameControls.logic();
    return null;
}

function gameTiming(N: number): void {
    if (N === 0) {
        return lastCompPress();
    }
    if (N === 1 && gameControls.allowPushNum) {
        let randomNum = randomNumber();
        gameControls.colorSequence.push(randomNum);
        //playAudio(randomNum);
    }
    let flippedSeq = (gameControls.colorSequence);
    let elNum = flippedSeq[gameControls.totalCount - (N)];
    if (elNum === undefined) {
        return lastCompPress();
    }
    let el = document.getElementById(String(elNum));

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

function colorToNum(c: string) {
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

function playAudio(colorId: number) {
    let x = document.getElementById('s' + colorId.toString());
    x.play().catch((error: any) => {
        playAudio(colorId);
    });
}
function resizeGameWidth(upperScreenWidth:number,upperFontSize:number,lowerScreenWidth:number,lowerFontSize:number){
    /* Takes x2,y2,x1,y1 in that order. x is the screen width, y is the font size.
    Sets the global font size based on a linear relationship*/

    let setFontSize;
    let x = window.innerWidth;
    if (x < lowerScreenWidth){
        return lowerFontSize;
    }
    else if(x > upperScreenWidth){
        return upperFontSize;
    }
    else{
        let slope = (upperFontSize-lowerFontSize)/(upperScreenWidth-lowerScreenWidth);
        let yint = upperFontSize - (slope * upperScreenWidth);
        return (slope * x) + yint;
    } 
    
}
function resizeGameHeight(upperScreenHeight:number,upperFontSize:number,lowerScreenHeight:number,lowerFontSize:number){
    /* Takes x2,y2,x1,y1 in that order. x is the screen width, y is the font size.
    Sets the global font size based on a linear relationship*/

    let setFontSize;
    let y = window.innerHeight;
    if (y < lowerScreenHeight){
        return lowerFontSize;
    }
    else if(y > upperScreenHeight){
        return upperFontSize;
    }
    else{
        let slope = (upperFontSize-lowerFontSize)/(upperScreenHeight-lowerScreenHeight);
        let yint = upperFontSize - (slope * upperScreenHeight);
        return (slope * y) + yint;
    } 
    
}

function completeResize(){
let widthFont = resizeGameWidth(600,18,250,8);
let heightFont = resizeGameHeight(650,18,250,8);
let setFontSize = widthFont < heightFont ? widthFont:heightFont;
document.documentElement.style.fontSize = (`${setFontSize}px`);
}

let gameControls = new GameLogic(false);
let switchControls = new SwitchLogic();
let startControls = new StartButtonLogic();
completeResize();
window.addEventListener('resize',function(){
completeResize();
});
//removeClickEvents(['green','red','blue','yellow']);