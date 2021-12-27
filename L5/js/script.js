// Globala konstanter och variabler
var boardElem;			// Referens till div-element för "spelplanen"
const carImgs = ["car_up.png", "car_right.png", "car_down.png", "car_left.png"];
// Array med filnamn för bilderna med bilen
var carDir = 1;			// Riktning för bilen, index till carImgs
var carElem;			// Referens till img-element för bilen
const xStep = 5;		// Antal pixlar som bilen ska förflytta sig i x-led
const yStep = 5;		// eller y-led i varje steg
const timerStep = 20;	// Tid i ms mellan varje steg i förflyttningen
var timerRef = null;	// Referens till timern för bilens förflyttning
var startBtn;			// Referens till startknappen
var stopBtn;			// Referens till stoppknappen
/* === Tillägg i labben === */
var pigElem; // referens till vildsvinet.
var pigTimerRef = null; // timern ska starta från noll.
const pigDuration = 2000; // var annan sekund ska grisent position ändras
var pigNr; // nummer för aktuell gris.
var hitCounter; // antal träffar.
var pigNrElem;
var hitCounterElem
var catchedPig; // Om man har träffat grisen.
// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	// Referenser till element i gränssnittet
	boardElem = document.getElementById("board");
	carElem = document.getElementById("car");
	startBtn = document.getElementById("startBtn");
	stopBtn = document.getElementById("stopBtn");
	// Lägg på händelsehanterare
	document.addEventListener("keydown", checkKey);
	// Känna av om användaren trycker på tangenter för att styra bilen
	startBtn.addEventListener("click", startGame);
	stopBtn.addEventListener("click", stopGame);
	// Aktivera/inaktivera knappar
	startBtn.disabled = false;
	stopBtn.disabled = true;
	/* === Tillägg i labben === */
	pigElem = document.getElementById("pig"); // refererar till gris bilden.
	pigNrElem = document.getElementById("pigNr");
	hitCounterElem = document.getElementById("hitCounter");
} // End init
window.addEventListener("load", init);
// ------------------------------
// Kontrollera tangenter och styr bilen
function checkKey(e) {
	let k = e.key;
	switch (k) {
		case "ArrowLeft":
		case "z":
			carDir--; // Bilens riktning 90 grader åt vänster
			if (carDir < 0) carDir = 3;
			carElem.src = "img/" + carImgs[carDir];
			break;
		case "ArrowRight":
		case "-":
			carDir++; // Bilens riktning 90 grader åt höger
			if (carDir > 3) carDir = 0;
			carElem.src = "img/" + carImgs[carDir];
			break;
	}
} // End checkKey
// ------------------------------
// Initiera spelet och starta bilens rörelse
function startGame() {
	startBtn.disabled = true; // inaktiverar start knappen.
	stopBtn.disabled = false; -// inaktiverar star knappen.
		document.activeElement.blur(); // Knapparna sätts ur focus, så att webbsidan kommer i fokus igen
	// Detta behövs för att man ska kunna känna av keydown i Firefox.
	carElem.style.left = "0px";
	carElem.style.top = "0px";
	carDir = 1;
	carElem.src = "img/" + carImgs[carDir]; // byter ut bilden för bilen.
	moveCar();
	/* === Tillägg i labben === */
	pigTimerRef = setTimeout(newPig, pigDuration); // grisen vissas inte innan två sekunder efter man har startat.
	pigNr = 0; // sätter värdet till noll.
	hitCounter = 0; //sätter värdet till noll.
	pigNrElem.innerHTML = 0; // sätter värdet till noll innom innerHTML så att det nollställs även i bildskärmen
	hitCounterElem.innerHTML = 0;  // sätter värdet till noll innom innerHTML så att det nollställs även i bildskärmen
	catchedPig = true; // ingen kontroll ska göras.

} // End startGame
// ------------------------------
// Stoppa spelet
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);
	startBtn.disabled = false;
	stopBtn.disabled = true;
	/* === Tillägg i labben === */
	if (pigTimerRef != null) clearTimeout(pigTimerRef); // timern för grisarna stoppas.
	pigElem.style.visibility = "hidden"; // för att inte visa gris bilden.

} // End stopGame
// ------------------------------
// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	let xLimit = boardElem.offsetWidth - carElem.offsetWidth;
	let yLimit = boardElem.offsetHeight - carElem.offsetHeight;
	let x = parseInt(carElem.style.left);	// x-koordinat (left) för bilen
	let y = parseInt(carElem.style.top);	// y-koordinat (top) för bilen
	switch (carDir) {
		case 0: // Uppåt
			y -= yStep;
			if (y < 0) y = 0;
			break;
		case 1: // Höger
			x += xStep;
			if (x > xLimit) x = xLimit;
			break;
		case 2: // Nedåt
			y += yStep;
			if (y > yLimit) y = yLimit;
			break;
		case 3: // Vänster
			x -= xStep;
			if (x < 0) x = 0;
			break;
	}
	carElem.style.left = x + "px";
	carElem.style.top = y + "px";
	timerRef = setTimeout(moveCar, timerStep);
	/* === Tillägg i labben === */
	checkHit();

} // End moveCar
// ------------------------------

/* === Tillägg av nya funktioner i labben === */
function newPig() {
	if (pigNr < 10) {
		let xLimit = boardElem.offsetWidth - pigElem.offsetWidth - 20;
		let yLimit = boardElem.offsetHeight - pigElem.offsetHeight - 20;
		let x = Math.floor(xLimit * Math.random()) + 10; // slumptal för grisens x koordinat.
		let y = Math.floor(yLimit * Math.random()) + 10; // salumptal för grisent y koordinat.
		pigElem.style.left = x + "px"; // lägger x som nytt värde
		pigElem.style.top = y + "px"; // lägger y som nytt värde.
		pigElem.src = "img/pig.png";
		pigElem.style.visibility = "visible"; // gör grisen synlig.
		pigTimerRef = setTimeout(newPig, pigDuration); // gris ändrar position efter två sekunder.
		pigNr++;
		pigNrElem.innerHTML = pigNr;
		catchedPig = false; // när catchedpig är false så har man inte träffat den.
	}
	else stopGame();
}

function checkHit() {
	if (catchedPig == true) return;
	let cSize = carElem.offsetWidth; // storlek på bilen.
	let pSize = pigElem.offsetWidth; // storlek på grisen.
	let cL = parseInt(carElem.style.left); // sparar bilens left i variabel.
	let cT = parseInt(carElem.style.top); // sparar bilens top ii variabel.
	let pL = parseInt(pigElem.style.left); // sparar grisens left i variabel.
	let pT = parseInt(pigElem.style.top); // sparar grisens top i variabel.
	if (cL + 10 < pL + pSize && cL + cSize - 10 > pL && cT + 10 < pT + pSize && cT + cSize - 10 > pT) { //vilkår för krock.
		if (pigTimerRef != null) clearTimeout(pigTimerRef)// stoppar timern för grisen
		pigElem.src = "img/smack.png"; // byter ut gris bilden mot smack.
		pigTimerRef = setTimeout(newPig, pigDuration); // starta timer för ny gris
		hitCounter++; // varje gång man träffar grisen ska counter gå upp.
		hitCounterElem.innerHTML = hitCounter; // När poängen går upp vissas det på skärmen.
		catchedPig = true; // när man träfgfas så är catchedpig sant.
	}
}
