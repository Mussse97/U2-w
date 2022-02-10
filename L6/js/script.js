// Globala konstanter och variabler
const roomPrice = [600, 800, 950];	// Pris för rumstyperna
const extraPrice = [40, 80, 100];		// Pris för extravalen
var formElem;		// Referens till elementet med hela formuläret
var totalCostElem;	// Referens till elementet för totalpris
// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	formElem = document.getElementById("booking");
	totalCostElem = document.getElementById("totalCost"); // Totala kostnaden för allt man har valt.
	for (let i = 0; i < formElem.roomType.length; i++) { // Går igenom alla radio knappar.
		formElem.roomType[i].addEventListener("click", checkIfFamilyRoom); // Händelse där checkIfFamlily room anropas när man klickar.
		formElem.roomType[i].parentNode.lastChild.textContent += " (" + roomPrice[i] + "kr)"; // Priset för de olika rummen ska visas på sidan.
		formElem.roomType[i].addEventListener("click", calculateCost); // händelse där calculatecost anropas när man klickar
	}

	for (let i = 0; i < formElem.extra.length; i++) {
		formElem.extra[i].parentNode.lastChild.textContent += "(" + extraPrice[i] + "kr)"; // Skrive ut priserna för val av rum och tillägg.
		formElem.extra[i].addEventListener("click", calculateCost);
	}
	checkIfFamilyRoom();// ser till att de inaktiverade valen är där när man laddar in sidan.
	formElem.nrOfNights.addEventListener("change", calculateCost); //händelsehanterare för att räkna ut kostnaden när man klickar i.
	calculateCost(); // anropar funktionen.

	// Händelsehanterare för textfält som ska kontrolleras
	formElem.city.addEventListener("blur", checkCity); //  Blur är en händelsehanterare för när något förlorat focus då anropas checkcity
	formElem.zipcode.addEventListener("blur", checkField); //Blur är en händelsehanterare för när något förlorat focus då anropas checkfield
	formElem.telephone.addEventListener("blur", checkField); //Blur är en händelsehanterare för när något förlorat focus då anropas checkfield
	// Händelsehanterare för kampanjkod
	formElem.campaigncode.addEventListener("focus", checkCampaign); // focus är motsatsen av blur vilket betyder när det är i focus anropas checkcampaign
	formElem.campaigncode.addEventListener("keyup", checkCampaign); // keyup är en händelsehanterare för när man släpper en knapp och då anropas checkcampaign
	formElem.campaigncode.addEventListener("blur", endCheckCampaign); // när det inte är inte är i focus anropas endcheckcampaign

} // End init
window.addEventListener("load", init);
// ------------------------------
// denna funktion kollar familjerum alternativet. Om det är det så ska antal peroner alternativer aktiveras, är det inte det så inaktiveras det.
function checkIfFamilyRoom() {
	if (formElem.roomType[2].checked) { // kontrollerar om man har valt familjerum.
		formElem.persons.disabled = false; // har man valt det så ska "antal personer" alternativet inte vara inaktivt.
		formElem.persons.parentNode.style.color = "#000"; // ändrar färgen till svart
		formElem.extra[2].disabled = true; // inaktiverar ectra valet sjöutsikt
		formElem.extra[2].parentNode.style.color = "#999"; // sätter valet och texten till grå färg
		formElem.extra[2].checked = false; // rad för att avmarkera valet i.
	}
	else {
		formElem.persons.disabled = true; // om familje rum inte är valt så ska antal personer alternativet vara inaktivt
		formElem.persons.parentNode.style.color = "#999"; // Går så att valet och texten blir grå.
		formElem.extra[2].disabled = false; // Nu när familjerum inte är valt så ska sjöutsikten vara aktiv
		formElem.extra[2].parentNode.style.color = "#000"; // Sätter färgen tilbaka till svart.
	}
}
// I denna funktion så kontrollerar den vad för tillägg och rum samt dagar som är i klickade. Ser också till att priset uppdateras beroende på vad man har  valt.
function calculateCost() {
	let price; // inför price som en lokal variabel
	for (let i = 0; i < formElem.roomType.length; i++) {
		if (formElem.roomType[i].checked) { // if sats där vi kontrollerar om roomtype är checked.
			price = roomPrice[i]; // Lägger in priset av rummet i price.
			break;
		}
	}
	for (let i = 0; i < formElem.extra.length; i++) {
		if (formElem.extra[i].checked) { // kontrollerar om tilläggs knapparna är checked.
			price += extraPrice[i]; // om det är det så ska vi addera priset på tillägget till price.
		}
	}
	let nrOfNights = formElem.nrOfNights.value; // inför ny variable där vi tar value från antal nätter.
	totalCostElem.innerHTML = nrOfNights * price; // Skriver ut totala kostnaden.
}
// i denna funktion avläser vi value som ligger i this och sparar i variabeln city. Vi ändrar också till stora bokstäver samt lägger in nya inehållet i city i fältet.
function checkCity() {
	let city = this.value; // spara value på this i city
	city = city.toUpperCase(); // Ändrar till versaler från gemener. 
	this.value = city; // nya inehållet läggs i city.
}
// kontrollerar fälten telefon nummer och postnummer. ser till att det stämmer med de reguljära uttrycken. ger också fel meddelanden om det inte skulle stämma
function checkField() {
	const fieldNames = ["zipcode", "telephone"]; // array med reguljära uttryck för fälten.
	const re = [
		/^\d{3} ?\d{2}$/, // postnummer
		/^0\d{1,3}[-/ ]?\d{5,8}$/ // telefonnummer.
	];
	const errMsg = [ // array med felmeddelanden
		"Postnummer måste bestå av fem siffror.",
		"Telnr måste börja med en 0:a och följas av 6-11 siffor."
	];
	let ix = fieldNames.indexOf(this.name); // index till re och errMsg.
	let errMsgElem = this.nextElementSibling; //element för felmeddelanden
	errMsgElem.innerHTML = "";
	if (!re[ix].test(this.value)) {
		errMsgElem.innerHTML = errMsg[ix];
		return false; // fel i fältet.
	}
	else return true; // fätet är ok.
}
// När man klickar in i fältet så ska det vara en röd färg.
function startCheckCampaign() {
	this.style.backgroundColor = "#F99"; // När man klickar i fätet ska det vara rött.
}
// När man har klickat bort från fätet ska funktionen se till att det blir stora bokstäver.
function endCheckCampaign() {
	this.style.backgroundColor = ""; // sätter bakgrundsfärgen till tom sträng.
	this.value = this.value.toUpperCase(); // omvandlar till stora bokstäver.
}
// kontroll för rätt uttryck som ska vara i kampanj fältet och bestämmer sedan vad för färg det ska vara boroende på om det är rätt eller fel.
function checkCampaign() {
	const re = /^[A-Z]{3}-\d{2}-[A-Z]{1}\d{1}$/i; // reguljär uttryck för att peka ut kampanjkoden. den leter efter mönster som ABC-12-V4.
	if (re.test(this.value)) this.style.backgroundColor = "#6F9"; // kollar om uttrycker är rätt och om det är det ska det bli grönt
	else this.style.backgroundColor = "#F99"; // är det FEL så ska  det bli rött.

}

