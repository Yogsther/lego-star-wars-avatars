const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 256;
canvas.height = 256;

const background = document.getElementById("background");
const bctx = background.getContext("2d");

const circles = new Image();
const characters = new Image();
const starImage = new Image();

const selection = document.getElementById("selection");
const profile = document.getElementById("profile-image");
const name = document.getElementById("character-name");
const controlpanel = document.getElementById("control-panel");
const mode = document.getElementById("mode");

const download = document.getElementById("download");

circles.src = `circles.png`;
characters.src = "characters.png";
starImage.src = "star.png";

var selectedCharacter = 0;
var selectedColor = 0;
var selectedMode = 0;

var starAmount = 0.5;
var starSize = 15;
var starMargin = 10;
var starSpeed = 0.4;

var stars = [];

const modes = ["stars", "transparent", "black"];
const colors = ["blue", "green", "orange", "purple", "yellow"];

class Star {
    constructor() {
        this.x = Math.random() * background.width;
        this.y = Math.random() * background.height;
        this.instensity = Math.random() * 0.8;
    }
}

window.onload = () => {
    summonSelectionCharacters();
    chooseCharacter(selectedCharacter);
    setWidthOfSelection();
    summonStars();
    updateMode();
    setInterval(() => {
        drawBackground();
    }, 1000 / 30);
    controlpanel.style.visibility = "visible";
};

mode.onclick = () => {
    selectedMode = (selectedMode + 1) % modes.length;
    updateMode();
};

function updateMode() {
    var modeText = modes[selectedMode].split("");
    modeText[0] = modeText[0].toUpperCase();
    mode.innerText = "Background: " + modeText.join("");
}

profile.onclick = () => {
    selectedColor = (selectedColor + 1) % 5;
    chooseCharacter(selectedCharacter);
};

window.onresize = setWidthOfSelection;

function generateProfile(characterIndex = 0, circle = 0) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.drawImage(circles, -(circle * 256), 0, 256 * 5, 256);

    var x = (-characterIndex % 12) * 256;
    var y = -Math.floor(characterIndex / 12) * 256;

    ctx.drawImage(characters, x, y, 256 * 12, 256 * 12);
    return canvas.toDataURL();
}

function summonSelectionCharacters() {
    for (let character of data) {
        let img = new Image();
        img.src = generateProfile(character.id, 2);
        img.classList.add("character-select");
        img.onclick = () => {
            chooseCharacter(character.id);
        };

        selection.appendChild(img);
    }
}

function downloadProfile() {
    let tempCanvas = document.createElement("canvas");
    let tctx = tempCanvas.getContext("2d");
    tempCanvas.width = 256;
    tempCanvas.height = 256;

    tctx.clearRect(0, 0, 256, 256);

    if (modes[selectedMode] == "stars") {
        var startX = background.width / 2 - 256 / 2;
        tctx.drawImage(background, startX, 20, 256, 256, 0, 0, 256, 256);
    }

    if (modes[selectedMode] == "black") {
        tctx.fillStyle = "black";
        tctx.fillRect(0, 0, 256, 256);
    }

    generateProfile(selectedCharacter, selectedColor);

    tctx.drawImage(canvas, 0, 0);

    download.innerHTML = "";
    download.href = tempCanvas.toDataURL();
    download.download = `${data[getIndex(selectedCharacter)].name
        .replace(/[\W_]+/g, "_")
        .toLowerCase()}_${colors[selectedColor]}_${modes[selectedMode]}.png`;
    download.click();
}

function getIndex(id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) return i;
    }
}

function chooseCharacter(id) {
    name.innerText = data[getIndex(id)].name;
    selectedCharacter = id;
    profile.src = generateProfile(selectedCharacter, selectedColor);
}

function setWidthOfSelection() {
    var body = document.body,
        html = document.documentElement;

    var height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight
    );

    background.width = window.innerWidth;
    background.height = height;

    summonStars();

    var maxWidth = window.innerWidth * 0.9;
    var width = Math.floor(maxWidth / 40) * 40;
    selection.style.width = width + "px";
}

function drawBackground() {
    bctx.globalAlpha = 1;
    bctx.fillStyle = "#000";
    bctx.fillRect(0, 0, background.width, background.height);

    for (let star of stars) {
        star.x = star.x - star.instensity * starSpeed;
        if (star.x < -starMargin) star.x = background.width + starMargin;

        let size = (star.instensity > 0.5 ? star.instensity : 0.5) * starSize;
        bctx.globalAlpha = star.instensity;
        bctx.drawImage(starImage, star.x, star.y, size, size);
    }
}

function summonStars() {
    stars = [];
    for (
        var i = 0;
        i < background.width * background.height * (starAmount / 1000);
        i++
    ) {
        stars.push(new Star());
    }
}
