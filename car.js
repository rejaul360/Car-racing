const scoor = document.querySelector('.scoor');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const pauseBtn = document.getElementById('pauseBtn');
const playBtn = document.getElementById('playBtn');
let gamePaused = false;

startScreen.addEventListener('click', start);
pauseBtn.addEventListener('click', pauseGame);
playBtn.addEventListener('click', playGame);

let player = {speed: 5, scoor: 0};

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}

function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function isCollied(a, b) {
    aRect = a.getBoundingClientRect();
    bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function moveLines() {
    let lines = document.querySelectorAll('.lines');

    lines.forEach(function (item) {
        if (item.y >= 700) {
            item.y -= 750;
        }

        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

function endGame() {
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game over <br /> Your Final Scoor is  <br />" + (player.scoor / 100).toFixed(0) + " <br /> Press Any Key to restart game"

}

function moveEnemyCar(car) {
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function (item) {
        if (isCollied(car, item)) {
            endGame();
        }

        if (item.y >= 750) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 350) + 'px';
        }

        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

let lastUpdateTime = 0;
const increaseScoreInterval = 1000;

function gamePlay(timestamp) {
    let car = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();

    if (!lastUpdateTime) {
        lastUpdateTime = timestamp;
    }
    const deltaTime = timestamp - lastUpdateTime;


    moveLines();
    moveEnemyCar(car);

    if (player.start && !gamePaused) {
        if (keys.ArrowUp && player.y > road.top + 200) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < road.bottom - 90) {
            player.y += player.speed;
        }
        if (keys.ArrowLeft && player.x > 5) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x < road.width - 70) {
            player.x += player.speed;
        }

        car.style.top = player.y + 'px';
        car.style.left = player.x + 'px';

        if (deltaTime >= increaseScoreInterval) {
            player.scoor++;
            scoor.innerText = 'SCOOR : ' + ' ' + (player.scoor / 100).toFixed(0);
            lastUpdateTime = timestamp; // Reset lastUpdateTime
        }



        window.requestAnimationFrame(gamePlay);
        player.scoor++;
        scoor.innerText = 'SCOOR : ' + ' ' + (player.scoor / 100).toFixed(0);
    }
}

function start() {
    startScreen.classList.add('hide');
    gameArea.innerHTML = '';

    player.start = true;
    player.scoor = 0;
    window.requestAnimationFrame(gamePlay);

    for (let x = 0; x < 5; x++) {
        let rodeline = document.createElement('div');
        rodeline.setAttribute('class', 'lines');
        rodeline.y = x * 150;
        rodeline.style.top = rodeline.y + 'px';
        gameArea.appendChild(rodeline);
    }

    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    for (let x = 0; x < 3; x++) {
        let eneymeCar = document.createElement('div');
        eneymeCar.setAttribute('class', 'enemy');
        eneymeCar.y = (x + 1) * 350 * -1;
        eneymeCar.style.top = eneymeCar.y + 'px';
        eneymeCar.style.backgroundColor = randomColor();
        eneymeCar.style.left = Math.floor(Math.random() * 350) + 'px';
        gameArea.appendChild(eneymeCar);
    }
}

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ('0' + String(hex)).substr(-2);
    }
    return '#' + c() + c() + c();
}

function pauseGame() {
    gamePaused = true;
    pauseBtn.disabled = true;
    playBtn.disabled = false;
}

function playGame() {
    gamePaused = false;
    pauseBtn.disabled = false;
    playBtn.disabled = true;
    if (!player.start) {
        start();
    }
    resumeGame();
}

function resumeGame() {
    if (!gamePaused) {
        player.start = true;
        gamePlay();
    }
}


function pressKey(){
    document.body.addEventListener('keydown', () => {
        if (!player.start) {
            start();
        }
    });
}

document.body.addEventListener('keydown', () => {
    if (!player.start) {
        start();
    }
});