/**
 * Created by Марко on 11.12.2014.
 * Vnos dodan za: Janez Novak, z ehrID-jem: 5ea2885f-ba68-4824-9eb5-6b8dcc5a5f1e
 * Vnos dodan za: Tone Oblak, z ehrID-jem: c110c81d-7fdb-45d8-9041-e2aa9233252d
 * Vnos dodan za: Metka Polen, z ehrID-jem: fbd604da-ac73-4622-868a-3ccfdcd65874
 */
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var username = "ois.seminar";
var password = "ois4fri";
var mer = [];
var counter = 0;

function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
        "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

function generatePat(varianceTemp, varianceBlood1, varianceBlood2, variancePulse, dateStart, dateEnd) {
    // TODO (is 30 enough?) depends on d3.js
    var hh = 0;
    var raz = 4;
    var i = 0;
    var results = [];
    var zdravilo = false;
    var temp = (varianceTemp >= 7) ? 37.2 : 36.5;
    var blood1 = (varianceBlood1 > 10) ? 90 : 80;
    var blood2 = (varianceBlood1 > 10) ? 130 : 120;
    var pulse = (variancePulse > 20) ? 80 : 60;
    //console.log(temp,blood1, blood2, pulse);
    var tmpDate = new Date(dateStart.getTime());
    while (tmpDate.getTime() < dateEnd.getTime()) {
        var entry = {};
        //console.log(entry.data);
        // console.log(i,dateStart);
        if (i % 2 == true) {
            entry.zdravilo = true;
            entry.temperatura = Math.floor(Math.random() * (varianceTemp / 2)) + temp;
            entry.tlakDias = Math.floor(Math.random() * varianceBlood1 / 2) + blood1;
            entry.tlakSis = Math.floor(Math.random() * varianceBlood2 / 2) + blood2;
            entry.puls = Math.floor(Math.random() * variancePulse / 2) + pulse;
        } else {
            entry.zdravilo = false;
            entry.temperatura = Math.random() * (varianceTemp) + temp;
            entry.tlakDias = Math.floor(Math.random() * varianceBlood1) + blood1;
            entry.tlakSis = Math.floor(Math.random() * varianceBlood2) + blood2;
            entry.puls = Math.floor(Math.random() * variancePulse) + pulse;
        }
        entry.data = new Date(tmpDate.getTime());
        results.push(entry);
        tmpDate.setHours(tmpDate.getHours() + raz);
        //console.log(entry.data);
        //console.log(entry);
        i++;
    }
    return results;
}

function generate(name, bday, patient) { // 1, 2, 3
    array = []; // JSON
    // equal dateStart for either case (randomly generated every time it is called)
    var day = Math.floor(Math.random() * 31) + 1;
    var month = Math.floor(Math.random() * 12);
    var year = Math.floor(Math.random() * 5) + 2010;
    // day =  (month == 2 && day > 28) ? 28 : day; // ternary operator
    /*if(month == 2 && day > 28) {
     day = 28;
     }*/
    var hour = Math.floor(Math.random() * 23) + 1;
    var min = Math.floor(Math.random() * 59) + 1;
    var dateStart = new Date(year, month, day, hour, min, 0, 0);
    array.datumZacetek = dateStart;
    day += Math.floor(Math.random() * 7) + 3;
    hour = Math.floor(Math.random() * 23) + 1;
    min = Math.floor(Math.random() * 59) + 1;
    var dateEnd = new Date(year, month, day, hour, min, 0, 0);
    array.datumKonec = dateEnd;
    //console.log(dateStart, dateEnd);
    array.ime = name;
    array.rojstniDan = bday;

    // blood1 = diastolic
    // blood2 = systolic
    var varianceTemp, varianceBlood1, varianceBlood2, variancePulse;
    switch (patient) {
        case 1: // fever
            //console.log(1);
            array.zdravilo = "Lecadol plus C";
            varianceTemp = 6;
            varianceBlood1 = 10;
            varianceBlood2 = 10;
            variancePulse = 20;
            array.odstopanjeTemp = varianceTemp;
            array.odstopanjeTlakDia = varianceBlood1;
            array.odstopanjeTlakSis = varianceBlood2;
            array.odstopanjePuls = variancePulse;
            var meritve = generatePat(varianceTemp, varianceBlood1, varianceBlood2, variancePulse, dateStart, dateEnd);
            array.meritve = meritve;
            break;
            c
        case 2: // blood pressure
            //console.log(2);
            array.zdravilo = "Amlessa";
            varianceTemp = 2;
            varianceBlood1 = 30;
            varianceBlood2 = 30;
            variancePulse = 20;
            array.odstopanjeTemp = varianceTemp;
            array.odstopanjeTlakDia = varianceBlood1;
            array.odstopanjeTlakSis = varianceBlood2;
            array.odstopanjePuls = variancePulse;
            var meritve = generatePat(varianceTemp, varianceBlood1, varianceBlood2, variancePulse, dateStart, dateEnd);
            array.meritve = meritve;
            break;
        case 3: // pulse
            //console.log(3);
            array.zdravilo = "Amiokordin";
            varianceTemp = 2;
            varianceBlood1 = 10;
            varianceBlood2 = 10;
            variancePulse = 40;
            array.odstopanjeTemp = varianceTemp;
            array.odstopanjeTlakDia = varianceBlood1;
            array.odstopanjeTlakSis = varianceBlood2;
            array.odstopanjePuls = variancePulse;
            var meritve = generatePat(varianceTemp, varianceBlood1, varianceBlood2, variancePulse, dateStart, dateEnd);
            array.meritve = meritve;
            break;
        default:
            console.log(-1);
            break;
    }
    return array;
}

function insertData(data, next) {
    //console.log(data);
    sessionId = getSessionId();
    //var ehrID = "b931580f-2b05-488b-985b-8d9ffb08ad02";
    var ehrID = "";
    //var ehrID = "63a03c16-c9ca-4554-93e3-416beda1286d";
    if (!data.zdravilo || !data.datumKonec || !data.datumKonec) {
        $("#error").append("error with data!");
    } else {
        var n_ = data.ime;
        ime = n_.split(" ");
        //console.log(ime);
        $.ajaxSetup({
            headers: {"Ehr-Session": sessionId}
        });
        $.ajax({
            url: baseUrl + "/ehr",
            type: 'POST',
            success: function (data_) {
                ehrID = data_.ehrId;
                console.log("kreiran EHRID: " + ehrID);
                var partyData = {
                    firstNames: ime[0],
                    lastNames: ime[1],
                    dateOfBirth: data.rojstniDan,
                    partyAdditionalInfo: [{key: "ehrID", value: ehrID}]
                };
                $.ajax({
                    url: baseUrl + "/demographics/party",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(partyData),
                    success: function (party) {
                        if (party.action == 'CREATE') {
                            $.ajaxSetup({
                                headers: {"Ehr-Session": sessionId}
                            });
                            var podatki = {
                                "ctx/language": "en",
                                "ctx/territory": "SI",
                                "ctx/time": "2014-11-21T11:40Z",
                                "medications/medication_instruction/order/medicine": data.zdravilo,
                                //"medications/medication_instruction/order/dose": "6.0",
                                "medications/medication_instruction/narrative": "take medication every 8 hours",
                                "medications/medication_instruction/order/timing": "R1",
                                //"medications/medication_instruction/order/description": "dsgfdskjbgkjsdfgnsdfkjgnam;gbasjkbadfb;dflskb dfbjsdfjg dfg afglsdjgjsk",
                                "medications/medication_instruction/order/medication_timing/start_date": data.datumZacetek,
                                "medications/medication_instruction/order/medication_timing/stop_date": data.datumKonec
                            };
                            var parametriZahteve = {
                                ehrId: ehrID,
                                templateId: 'Medications',
                                format: 'FLAT'
                            };
                            $.ajax({
                                url: baseUrl + "/composition?" + $.param(parametriZahteve),
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify(podatki),
                                success: function (res) {
                                    //console.log("success:", res.meta.href);
                                    // console.log(data.meritve);
                                    console.log("uspesno kreiran EHR: " + ehrID);
                                    $("#gendata").append("<div> Vnos dodan za: " + data.ime + ", z ehrID-jem: " + ehrID + "</div>");
                                    // console.log(data.meritve);
                                    for (entry in data.meritve) {
                                        // console.log(data.meritve[entry].data);
                                        var podatki = {
                                            // Preview Structure: https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
                                            "ctx/language": "en",
                                            "ctx/territory": "SI",
                                            "ctx/time": data.meritve[entry].data,
                                            "vital_signs/body_temperature/any_event/temperature|magnitude": data.meritve[entry].temperatura,
                                            "vital_signs/body_temperature/any_event/temperature|unit": "°C",
                                            "vital_signs/blood_pressure/any_event/systolic": data.meritve[entry].tlakSis,
                                            "vital_signs/blood_pressure/any_event/diastolic": data.meritve[entry].tlakDias,
                                            "vital_signs/pulse/any_event/rate|magnitude": data.meritve[entry].puls,
                                            "vital_signs/pulse/any_event/rate|unit": "/min"
                                        };
                                        var parametriZahteve = {
                                            "ehrId": ehrID,
                                            templateId: 'Vital Signs',
                                            format: 'FLAT'
                                        };
                                        $.ajax({
                                            url: baseUrl + "/composition?" + $.param(parametriZahteve),
                                            type: 'POST',
                                            contentType: 'application/json',
                                            data: JSON.stringify(podatki),
                                            success: function (res) {
                                                console.log(res.meta.href);
                                                //$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-success fade-in'>" + res.meta.href + ".</span>");
                                            },
                                            error: function (err) {
                                                //$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                                                console.log(JSON.parse(err.responseText).userMessage);
                                            }
                                        });
                                    }
                                    $("#kreirajSporocilo").html("<span class='obvestilo label label-success fade-in'>Uspešno kreiran pacient z EHR: '" + ehrID + "' in naključnimi podatki.</span>");
                                    dodajNoviPacijentDropDown(ime[0], ime[1], ehrID);
                                    /*if (next != undefined)
                                     next();*/
                                    return ehrID;
                                },
                                error: function (err) {
                                    console.log(err.responseText);
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log(JSON.parse(err.responseText));
                    }
                });
            }
        });
    }
}

function theNext() {
    if (counter < mer.length) {
        counter++;
        insertData(mer[counter], theNext);
    } else {
        console.log("finish");
    }
}
/*
 $(document).ready(function (){

 mer.push(generate("Janez Novak", new Date(1990, 11, 25), 1));   // 4da990b8-a066-4b39-8d7b-a026312da57b ;
 mer.push(generate("Tone Oblak", new Date(1974, 7, 1), 2));      // b5855ad0-7eae-4a8a-a762-70a333ec9fce ;
 mer.push(generate("Metka Polen", new Date(2000, 3, 14), 3));    // 76160f51-92d8-4541-ae16-84fd887c4e8e ;
 //console.log(mer[0].datumZacetek, mer[0].datumKonec);
 //insertData(mer[0], theNext);
 drawGraphTemp(mer[2]);
 drawGraphTlakSis(mer[2]);
 drawGraphTlakDia(mer[2]);
 drawGraphPuls(mer[2]);
 //console.log(mer[0].meritve);
 //insertData(mer[0]);

 console.log(mer[0],mer[1],mer[2]);
 $("#gendata").append(JSON.stringify(mer[0].ime) + ", rojstni dan: " + JSON.stringify(mer[0].rojstniDan) + ", zdravilo: " + JSON.stringify(mer[0].zdravilo) + "<br/>");
 $("#gendata").append(JSON.stringify(mer[0].datumZacetek) + " - " + JSON.stringify(mer[0].datumKonec) + "<br/>");
 $("#gendata").append(JSON.stringify(mer[0].meritve) + "<br/>");
 $("#gendata").append("<br/>" + JSON.stringify(mer[1].ime) + ", rojstni dan: " + JSON.stringify(mer[0].rojstniDan) + ", zdravilo: " + JSON.stringify(mer[1].zdravilo) + "<br/>");
 $("#gendata").append(JSON.stringify(mer[1].datumZacetek) + " - " + JSON.stringify(mer[1].datumKonec) + "<br/>");
 $("#gendata").append(JSON.stringify(mer[1].meritve) + "<br/>");
 $("#gendata").append("<br/>" + JSON.stringify(mer[2].ime) + ", rojstni dan: " + JSON.stringify(mer[0].rojstniDan) + ", zdravilo: " + JSON.stringify(mer[2].zdravilo) + "<br/>");
 $("#gendata").append(JSON.stringify(mer[2].datumZacetek) + " - " + JSON.stringify(mer[2].datumKonec) + "<br/>");
 $("#gendata").append(JSON.stringify(mer[2].meritve) + "<br/>");

 });
 */
