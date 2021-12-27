// Globala konstanter och variabler
// Städer och bilder
const allWords = ["Borgholm", "Gränna", "Gävle", "Göteborg", "Halmstad", "Jönköping", "Kalmar", "Karlskrona", "Kiruna", "Ljungby", "Malmö", "Norrköping", "Skara", "Stockholm", "Sundsvall", "Umeå", "Visby", "Västervik", "Växjö", "Örebro"];	// Array med namn på städer
const allDescriptions = ["Kyrkan", "Storgatan", "Julbock", "Operan", "Picassoparken", "Sofiakyrkan", "Domkyrkan", "Rosenbom", "Stadshus", "Garvaren", "Stortorget", "Spårvagn", "Domkyrka", "Rosenbad", "Hotell Knaust", "Storgatan", "Stadsmur", "Hamnen", "Teater", "Svampen"];	// Array med kort beskrivning av bilderna för städerna
// Element i gränssnittet
var startGameBtn;		// Referenser till start-knappen (button)
var checkAnswersBtn;	// Referens till knappen för att kontrollera svar (button)
var wordListElem;		// Referens till listan med de ord som kan dras (ul-elemntet)
var wordElems;			// Array med referenser till elementen för de åtta orden (li-elemnten)
var imgElems;			// Array med referenser till elementen med de fyra bilderna (img)
var answerElems;		// Array med referenser till elementen för orden intill bilderna (p)
var correctElems;		// Array med referenser till element för rätta svar (p)
var largeImgElem;		// Referens till elementet med den stora bilden (img)
var msgElem; 			// Referens till div-element för utskrift av meddelanden (div)
// Element vid drag and drop
var dragWordElem;		// Det ord som dras (kan vara både li och p)
// ------------------------------
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd.
// Initiering av globala variabler samt händelsehanterare.
function init() {
	// Referenser till element i gränssnittet
	startGameBtn = document.getElementById("startGameBtn");
	checkAnswersBtn = document.getElementById("checkAnswersBtn");
	wordListElem = document.getElementById("wordList").getElementsByTagName("ul")[0];// refererar till ul listan och sparar det i wordListElem.
	wordElems = document.getElementById("wordList").getElementsByTagName("li");// refererar till li listan och sparar det i wordElems.
	imgElems = document.getElementById("imgList").getElementsByTagName("img");// Tar fram en array inom img och sparar i imgElems.
	answerElems = document.getElementsByClassName("userAnswer");// P element föt användarens svar.
	correctElems = document.getElementsByClassName("correctAnswer");// p element för rätt svar.
	largeImgElem = document.getElementById("largeImg");// refererar till den stora bilden när man håller musen över.
	msgElem = document.getElementById("message");
	// Lägg på händelsehanterare
	startGameBtn.addEventListener("click", startGame); // startar spelet
	checkAnswersBtn.addEventListener("click", checkAnswers);// knappen för att rätta svaren.
	for (let i = 0; i < imgElems.length; i++) {
		imgElems[i].addEventListener("mouseenter", showLargeImg);
		imgElems[i].addEventListener("mouseleave", hideLargeImg);
	}

	// Aktivera/inaktivera knappar
	startGameBtn.disabled = false; // strat knappen aktiveras.
	checkAnswersBtn.disabled = true;// check knappen inaktiv.
} // End init
window.addEventListener("load", init); // Se till att init aktiveras då sidan är inladdad
// ------------------------------
// Initiera spelet. Välj ord slumpmässigt. Visa ord och bilder.
function startGame() {
	let tempList = allWords.slice(0); // kopierar alla ord i array. Anväder slice(0) för att få en kopia som börjar från position noll.
	let words = []; // words som en tom array.
	for (let i = 0; i < 4; i++) { // loop som genomförs fyra gånger eftersom vi har fyra bilder som ska vissas.
		let r = Math.floor(Math.random() * tempList.length); // väljer bilderna slumpmässigt och sparar i variabel r.
		words.push(tempList[r]); // lägger på ett till element i slutet av en array.
		let ix = allWords.indexOf(tempList[r]); // Sparar bildens nummer och lägger det i ix variabeln
		imgElems[i].src = "img/" + ix + ".jpg"; // lägger bilden som bestäms av ix variabeln.
		tempList.splice(r, 1); // tar bort order som är valt från tempList.
		imgElems[i].id = ix; // sparar ix variabeln i img-taggens id-attribut.
	}
	for (let i = 0; i < 4; i++) { // ytelligare fyra nya ord ur tempList och sparas i words.
		let r = Math.floor(Math.random() * tempList.length);
		words.push(tempList[r]); // lägger till ett element i slutet av en array.
		words.sort(); // sorterar words.
	}
	for (let i = 0; i < wordElems.length; i++) { // Går igenom alla ord i wordElems.
		wordElems[i].innerHTML = words[i]; // tilldela alla ord.
		wordElems[i].addEventListener("dragstart", dragstartWord);// händelsehanterare flr när man drar
		wordElems[i].addEventListener("dragend", dragendWord);// händelsehanterare för när man slutar att dra på ett ord.
		wordElems[i].draggable = true; // Kunna dra på orden
	}
	for (let i = 0; i < answerElems.length; i++) {
		answerElems[i].addEventListener("dragstart", dragstartWord); // händelsehanterare flr när man drar
		answerElems[i].addEventListener("dragend", dragendWord);// händelsehanterare för när man slutar att dra på ett ord.
		answerElems[i].draggable = true; // Kunna dra orden
		answerElems[i].innerHTML = ""; // tar bort användarens svar.
		correctElems[i].innerHTML = ""; // tar bort det rätta svaret.
	}
	msgElem.innerHTML = ""; // tar bort texten.
	startGameBtn.disabled = true; // start knappen akttiveras
	checkAnswersBtn.disabled = false; // check knappen inaktiveras
} // End startGame
// ------------------------------
// Visa förstorad bild
function showLargeImg() {
	this.addEventListener("mouseenter", largeImgElem); // "this" blir en referens till immg taggen som musen pekar över
	largeImgElem.src = this.src; // avläser src attribut som läggs in i largImgElems
} // End showLargeImg
// ------------------------------
// Dölj förstorad bild
function hideLargeImg() {
	largeImgElem.src = "img/empty.png"; // tar bort bilen som visas efter at man slutar peka på den.
} // End hideLargeImg
// ------------------------------
// Ett ord börjar dras. Spara data om elementet som dras. Händelsehanterare för drop zones
function dragstartWord(e) { // e är Event-objektet
	for (let i = 0; i < imgElems.length; i++) {
		imgElems[i].addEventListener("dragover", wordOverImg); //händelsehanterare för när drag är över
		imgElems[i].addEventListener("drop", wordOverImg); //händelsehanterare för när man släpper ordet.
	}
	wordListElem.addEventListener("dragover", wordOverList); // Samma händelsehanterare som ovan men detta gäller för wordListElems istället för img.
	wordListElem.addEventListener("drop", wordOverList);// Samma händelsehanterare som ovan men detta gäller för wordListElems istället för img.
	dragWordElem = this; // drar det som man håller musen över.
	e.dataTransfer.setData("text", this.innerHTML); // det man drar ska vara det man pekade på. Lägger ordet i dataTransfer för att det ska fungera på andra webbläsare.

} // End dragstartWord
// ------------------------------
// Drag-händelsen avslutas. Ta bort händelsehanterare på drop zones
function dragendWord() {
	for (let i = 0; i < imgElems.length; i++) { // går igenom imgElems.
		imgElems[i].removeEventListener("dragover", wordOverImg); //händelsehanterare för när drag är över
		imgElems[i].removeEventListener("drop", wordOverImg); //händelsehanterare för när man släpper ordet.
	}
	wordListElem.addEventListener("dragover", wordOverList); //händelsehanterare för wordListelem. när drag är över
	wordListElem.removeEventListener("drop", wordOverList); // händelsehanterare för wordListelem. när man släpper ordet.
} // End dragendWord
// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över en bild
function wordOverImg(e) { // e är Event-objektet
	e.preventDefault(); // förhindra default beteende vid drag and drop.
	if (e.type == "drop") { // kontroll om händelsen är drop.
		dragWordElem.innerHTML = ""; // tar bord ord som dras.
		let dropWordElem = this.nextElementSibling; // tar fram referens till element som ligger efter img-taggen.
		if (dropWordElem.innerHTML != "") // kontrollerar om det finns något i p-elemetet
			moveBackToList(dropWordElem.innerHTML); // skickar tilbaks order som ligger i p-elemetet
		dropWordElem.innerHTML = e.dataTransfer.getData("text"); // hämtar det ord som dras och lägger det i p-elemetet
	}
} // End wordOverImg
// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över listan med ord
function wordOverList(e) { // e är Event-objektet
	e.preventDefault(); // förhindrar default beteende vid drag and drop.
	if (e.type == "drop") { // kontrollerar att händelsen är drop
		dragWordElem.innerHTML = ""; // tar bort ord som dras
		moveBackToList(e.dataTransfer.getData("text")); // skickar tillbaks ord.
	}
} // End wordOverList
// ------------------------------
// Flytta tillbaks ordet till listan
function moveBackToList(word) { // word är det ord som ska flyttas tillbaks
	for (i = 0; i < wordElems.length; i++) { // går igenom all ord i wordElems.
		if (wordElems[i].innerHTML == "") { // kontrollerar att elemtet är tomt.
			wordElems[i].innerHTML = word;
			break; // hitar en ledig plats att sätta ordet och sendan avbryter loopen.
		}
	}
} // End moveBackToList
// ------------------------------
// Kontrollera användarens svar och visa de korrekta svaren
function checkAnswers() {
	for (let i = 0; i < answerElems.length; i++) { // kontrollerar orden som har blivit dragna till bilder.
		if (answerElems[i].innerHTML == "") { // kontrollerar om elementet är tomt.
			alert("Lägg in ett ett ord för varje bild."); // alert som visas när man inte dragit ett ord till alla bilder.
			return; // avbryter funkitonen.
		}
	}
	for (let i = 0; i < wordElems.length; i++) {
		wordElems[i].draggable = false; // kan inte dra ord.
		wordElems[i].removeEventListener("dragstart", dragstartWord); // tar bort händelsehanteraren.
		wordElems[i].removeEventListener("dragend", dragendWord); // tar bort händelsehanteraren.
	}
	for (let i = 0; i < answerElems.length; i++) {
		answerElems[i].draggable = false; // kan inte dra ord.
		answerElems[i].removeEventListener("dragstart", dragstartWord); // tar bort händelsehanteraren.
		answerElems[i].removeEventListener("dragend", dragendWord); // tar bort händelsehanteraren.
	}
	let points = 0; // inför en ny variabel och sätter den nya variablen till 0.
	for (let i = 0; i < answerElems.length; i++) { // går igenom orden i answerElems.
		let ix = imgElems[i].id; // inför variabeln ix och lägger den i id-attributet som ImgElems refererar till.
		if (answerElems[i].innerHTML == allWords[ix]) // gemför orden i answerElems med allWords.
			points++; // om orden matchar ska det gå upp med ett poäng.
		correctElems[i].innerHTML = allWords[ix] + "-" + allDescriptions[ix]; // Skriver ut det rätta svaret från arrayen allwords och alldescriptions.
	}

	msgElem.innerHTML = "Du fick " + points + " poäng"; //skriver ut hur många poäng man fick.
	startGameBtn.disabled = false; // start knappen inaktiveras
	checkAnswersBtn.disabled = true; // check knappen aktiveras
} // End checkAnswers
// ------------------------------