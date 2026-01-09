let comuni = [];

function showFile(input) { //mettere file
    let file = input.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
        comuni = reader.result.split("\r\n");
        document.getElementById("comune").disabled = false;
    };
}

function codCat(nomeComune) { //trovo comune
    nomeComune = nomeComune.toUpperCase();
    for (let i = 0; i < comuni.length; i++) {
        let parti = comuni[i].split(";");
        let comune = parti[0];
        let codice = parti[1];

        if (comune === nomeComune) {
            return codice;
        }
    }
    return;
}

function controllo() {
    let cognome = document.getElementById("cognome").value;
    let nome = document.getElementById("nome").value;
    let sesso = document.getElementById("sesso").value;
    let comune = document.getElementById("comune").value;
    let data = document.getElementById("data");
    let parag = document.getElementById("parag");

    let n0 = cognome.toUpperCase();
    let n1 = nome.toUpperCase();
    let n2 = sesso;
    let n5 = data.value;

    parag.textContent = "";

    if (!n0 || !n1 || !n2 || !comune || !n5) {
        parag.textContent = "Compila tutti i campi.";
        return;
    }

    let anno = parseInt(n5[0] + n5[1] + n5[2] + n5[3]); //controllo anno valido
    if (anno < 1900 || anno > 2026) {
        parag.textContent = "Anno non valido (1900-2026).";
        document.getElementById("data").value = "";
        return;
    }

    let codiceComune = codCat(comune); //codice non trovato
    if (!codiceComune) {
        parag.textContent = "Comune non trovato nel file.";
        return;
    }

    let n3 = codiceComune[0];
    let n4 = codiceComune.slice(1,4);

    for (let i = 0; i < n0.length; i++) {   //controllo lettere nel cognome
        if ((n0.charCodeAt(i) > 90 || n0.charCodeAt(i) < 65)) {
            parag.textContent += "Errore: scrivi il tuo cognome correttamente";
            document.getElementById('cognome').value = "";
            return;
        }
    }

    for (let i = 0; i < n1.length; i++) {   //controllo lettere nel nome
        if ((n1.charCodeAt(i) > 90 || n1.charCodeAt(i) < 65)) {
            parag.textContent += "Errore: scrivi il tuo nome correttamente";
            document.getElementById('nome').value = "";
            return;
        }
    }

    if (n2 !== "M" && n2 !== "F") {     //controllo sesso
        parag.textContent += "Errore: seleziona M o F";
        document.getElementById('sesso').value = "";
        return;
    }

    let codice = [];    //array codice fiscale
    codice = cogn(codice, n0);
    codice = nom(codice, n1);
    codice = annmes(codice, n5);
    codice = gg(codice, n5, n2);
    codice = codicecat(codice, n3, n4);
    codice = ultima(codice);

    parag.innerHTML = "Il tuo codice fiscale: " + codice.join(""); //stampa codice fiscale
}
//cognome
function cogn(codice, n0) {
    for (let i=0; i< n0.length; i++) {
            if (n0.charCodeAt(i)!= 65 && n0.charCodeAt(i)!= 69 && n0.charCodeAt(i)!= 73 && n0.charCodeAt(i)!= 79 && n0.charCodeAt(i)!= 85) { //ricerca consonanti
                codice.push(n0[i]);
            }
    }
    for (let i=0; i<n0.length; i++) {
        if (codice.length < 3) { //vocali
            if (n0.charCodeAt(i)== 65 || n0.charCodeAt(i)== 69 || n0.charCodeAt(i)== 73 || n0.charCodeAt(i)== 79 || n0.charCodeAt(i)== 85) {
                codice.push(n0[i]);
            } 
        } else { 
            codice.splice(3,codice.length);
            return codice;
        }
    }
    while (codice.length < 3) { //se mancano lettere 
        codice.push("X");
    }
    return codice;
}
//nome (simile al cognome)
function nom(codice, n1) {
    let cons = [];
    let temp = [];
    for (let i=0; i< n1.length; i++) {  
            if (n1.charCodeAt(i)!= 65 && n1.charCodeAt(i)!= 69 && n1.charCodeAt(i)!= 73 && n1.charCodeAt(i)!= 79 && n1.charCodeAt(i)!= 85) {
                cons.push(n1[i]);
                temp.push(n1[i]);
            }

    } 
    if (cons.length > 3) {
        codice.push(cons[0], cons[2], cons[3]);
        return codice;
    } 

    for (let i=0; i<n1.length; i++) {
        if (temp.length < 3) {
            if (n1.charCodeAt(i)== 65 || n1.charCodeAt(i)== 69 || n1.charCodeAt(i)== 73 || n1.charCodeAt(i)== 79 || n1.charCodeAt(i)== 85) {
                temp.push(n1[i]);
            } 
        } else {
            temp.splice(3,temp.length);
            codice.push(temp[0], temp[1], temp[2]);
            return codice;
        }
    }
    while (temp.length < 3) {
        temp.push("X");
    }
    codice.push(temp[0], temp[1], temp[2]);
    return codice;
}
//anno e mese 
function annmes(codice, n5) {
    codice.push(n5[n5.length-8], n5[n5.length-7]); //anno
    switch (parseInt(n5[n5.length-5] + n5[n5.length-4])){ //switch che trasforma mese in rispettivo carattere
        case 1:
            codice.push("A");
            break;
        case 2:
            codice.push("B");
            break;
        case 3:
            codice.push("C");
            break;
        case 4:
            codice.push("D");
            break;
        case 5:
            codice.push("E");
            break;
        case 6:
            codice.push("H");
            break;
        case 7:
            codice.push("L");
            break;
        case 8:
            codice.push("M");
            break;
        case 9:
            codice.push("P");
            break;
        case 10:
            codice.push("R");
            break;
        case 11:
            codice.push("S");
            break;
        case 12:
            codice.push("T");
            break;
        default:    
            alert("ERRORE");
            return;
    }
    return codice;
}
//giorno
function gg(codice, n5, n2){
    let giorno = parseInt(n5[n5.length-2] + n5[n5.length-1]);
    let giornostr;
    if (n2 == "F") { //femmina
        giorno += 40;
        giornostr = giorno.toString();
        codice.push(giornostr[0],giornostr[1]);
    } else if (giorno < 10) {
        giornostr = giorno.toString();
        codice.push("0", giornostr);
    } else { //maschio
        giornostr = giorno.toString();
        codice.push(giornostr[0],giornostr[1]);
    }
    return codice;
}
//codice catastale
function codicecat(codice, n3, n4) {
    codice.push(n3);
    codice.push(n4[0], n4[1], n4[2]);
    return codice;
}
//ultima lettera di controllo
function ultima(codice) {
    let somma =0;
    for (let i=0; i<15; i++) {
        if ((i%2)!==0) {
            switch (codice[i]) { //switch dispari
                case "0": case "A": somma += 0; break;
                case "1": case "B": somma += 1; break;
                case "2": case "C": somma += 2; break;
                case "3": case "D": somma += 3; break;
                case "4": case "E": somma += 4; break;
                case "5": case "F": somma += 5; break;
                case "6": case "G": somma += 6; break;
                case "7": case "H": somma += 7; break;
                case "8": case "I": somma += 8; break;
                case "9": case "J": somma += 9; break;
                case "K": somma += 10; break;
                case "L": somma += 11; break;
                case "M": somma += 12; break;
                case "N": somma += 13; break;
                case "O": somma += 14; break;
                case "P": somma += 15; break;
                case "Q": somma += 16; break;
                case "R": somma += 17; break;
                case "S": somma += 18; break;
                case "T": somma += 19; break;
                case "U": somma += 20; break;
                case "V": somma += 21; break;
                case "W": somma += 22; break;
                case "X": somma += 23; break;
                case "Y": somma += 24; break;
                case "Z": somma += 25; break;
            }
        } else { //switch pari
            switch (codice[i]) {
                case "0": case "A": somma += 1; break;
                case "1": case "B": somma += 0; break;
                case "2": case "C": somma += 5; break;
                case "3": case "D": somma += 7; break;
                case "4": case "E": somma += 9; break;
                case "5": case "F": somma += 13; break;
                case "6": case "G": somma += 15; break;
                case "7": case "H": somma += 17; break;
                case "8": case "I": somma += 19; break;
                case "9": case "J": somma += 21; break;
                case "K": somma += 2; break;
                case "L": somma += 4; break;
                case "M": somma += 18; break;
                case "N": somma += 20; break;
                case "O": somma += 11; break;
                case "P": somma += 3; break;
                case "Q": somma += 6; break;
                case "R": somma += 8; break;
                case "S": somma += 12; break;
                case "T": somma += 14; break;
                case "U": somma += 16; break;
                case "V": somma += 10; break;
                case "W": somma += 22; break;
                case "X": somma += 25; break;
                case "Y": somma += 24; break;
                case "Z": somma += 23; break;
            }
        }
    }

    somma = somma%26; //resto della divisione per 26

    switch (somma) { //lettera per ogni resto
        case 0: somma = "A"; break;
        case 1: somma = "B"; break;
        case 2: somma = "C"; break;
        case 3: somma = "D"; break;
        case 4: somma = "E"; break;
        case 5: somma = "F"; break;
        case 6: somma = "G"; break;
        case 7: somma = "H"; break;
        case 8: somma = "I"; break;
        case 9: somma = "J"; break;
        case 10: somma = "K"; break;
        case 11: somma = "L"; break;
        case 12: somma = "M"; break;
        case 13: somma = "N"; break;
        case 14: somma = "O"; break;
        case 15: somma = "P"; break;
        case 16: somma = "Q"; break;
        case 17: somma = "R"; break;
        case 18: somma = "S"; break;
        case 19: somma = "T"; break;
        case 20: somma = "U"; break;
        case 21: somma = "V"; break;
        case 22: somma = "W"; break;
        case 23: somma = "X"; break;
        case 24: somma = "Y"; break;
        case 25: somma = "Z"; break;
    }

    codice.push(somma);
    return codice;
}