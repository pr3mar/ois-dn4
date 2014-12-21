// Janez Novak, 4da990b8-a066-4b39-8d7b-a026312da57b ; 145d115b-a65e-4956-98c3-8cbd21161738 ; 6a3a47e2-59b6-471e-a076-26b7e8540ba0
// Tone Oblak, b5855ad0-7eae-4a8a-a762-70a333ec9fce  ; 20b47ce8-6be7-4a39-a0fa-4435fd77cc6d ; b006f48d-84a4-43ab-a15b-29a4aa4fd742
// Metka Polen, 76160f51-92d8-4541-ae16-84fd887c4e8e ; 8b52d97a-7f90-4706-8840-861f6463cc09 ; e7932a9f-3a0f-4fb3-a0c0-9bbb0988cbdc

var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
        "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

function getFormattedDate(date) {
    var datum = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    var ura = (date.getUTCHours().toString().length == 1) ? "0" + date.getUTCHours() : date.getUTCHours();
    var minute = (date.getUTCMinutes().toString().length == 1) ? "0" + date.getUTCMinutes() : date.getUTCMinutes();
    var cas = ura + ":" + minute;
    return datum + ", " + cas;
}

function dodajNoviPacijentDropDown(ime, priimek, ehrId) {
    $("#preberiObstojeciVitalniZnak").append("<option value='" + ehrId + "' selected>" + ime + " " + priimek + "</option>");
    $("#bolnikiEHR").append("<li role=\"presentation\"><a role=\"menuitem\" tabindex=\"-1\" href=\"#\" onclick=\"izpisZdravila('"+ehrId+"')\">"+ime +" "+ priimek +"</a></li>");
    $("#preberiEhrIdZaVitalneZnake").append("<option value='" + ehrId + "'>" + ime + " " + priimek + "</option>");
}

function kreirajEHRzaBolnika() {
    sessionId = getSessionId();

    var ime = $("#kreirajIme").val();
    var priimek = $("#kreirajPriimek").val();
    var datumRojstva = $("#kreirajDatumRojstva").val();
    var zdrNum = $("#kreirajZdravilo").val();
    var datumZacZdravil = $("#kreirajZacetekZdravila").val();
    var datumKonZdravil = $("#kreirajKonecZdravila").val();
    var zdravilo = "x";
    switch (zdrNum) {
        case '1':
            console.log(1);
            zdravilo = "Lecadol plus C";
            break;
        case '2':
            console.log(2);
            zdravilo = "Amlessa";
            break;
        case '3':
            console.log(3);
            zdravilo = "Amiokordin";
            break;
        default:
            console.log("blah");
    }
    if (!ime || !priimek || !datumRojstva || !zdravilo || !datumZacZdravil || !datumKonZdravil ||
        ime.trim().length == 0 || priimek.trim().length == 0 || datumRojstva.trim().length == 0 ||
        zdravilo.trim().length == 0 || datumZacZdravil.trim().length == 0 || datumKonZdravil.trim().length == 0) {
        $("#kreirajSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
    } else {
        datumZacZdravil = new Date(datumZacZdravil);
        datumKonZdravil = new Date(datumKonZdravil);
        if(datumZacZdravil.getTime() > datumKonZdravil.getTime() ||
            datumRojstva.getTime() > datumZacZdravil.getTime() ||
                datumRojstva.getTime() > datumKonZdravil.getTime()) {
            $("#kreirajSporocilo").html("<span class='obvestilo label label-danger fade-in'>Prosim vnesite pravilne podatke!</span>");
            return;
        }
        $.ajaxSetup({
            headers: {"Ehr-Session": sessionId}
        });
        $.ajax({
            url: baseUrl + "/ehr",
            type: 'POST',
            success: function (data) {
                var ehrId = data.ehrId;
                var partyData = {
                    firstNames: ime,
                    lastNames: priimek,
                    dateOfBirth: new Date(datumRojstva).toISOString(),
                    partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
                };
                $.ajax({
                    url: baseUrl + "/demographics/party",
                    type: 'POST',
                    contentType: 'application/json',
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
                                "medications/medication_instruction/order/medicine": zdravilo,
                                "medications/medication_instruction/narrative": "take medication every 8 hours",
                                "medications/medication_instruction/order/timing": "R1",
                                "medications/medication_instruction/order/medication_timing/start_date": datumZacZdravil.toISOString(),
                                "medications/medication_instruction/order/medication_timing/stop_date": datumKonZdravil.toISOString()
                            };
                            var parametriZahteve = {
                                ehrId: ehrId,
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
                                    console.log("uspesno kreiran EHR: " + ehrId);
                                    $("#kreirajSporocilo").html("<span class='obvestilo label label-success fade-in'>Uspešno kreiran EHR '" + ehrId + "'.</span>");
                                    dodajNoviPacijentDropDown(ime, priimek, ehrId);
                                },
                                error: function(err){
                                    $("#kreirajSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                                    console.log(JSON.parse(err.responseText).userMessage);
                                }
                            })
                        }
                    },
                    error: function (err) {
                        $("#kreirajSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                        console.log(JSON.parse(err.responseText).userMessage);
                    }
                });
            }
        });
    }
}

function generirajNakljucnePodatke() {
    sessionId = getSessionId();

    var ime = $("#kreirajIme").val();
    var priimek = $("#kreirajPriimek").val();
    var datumRojstva = $("#kreirajDatumRojstva").val();
    var zdravilo = $("#kreirajZdravilo").val();
    var datumZacZdravil = $("#kreirajZacetekZdravila").val();
    var datumKonZdravil = $("#kreirajKonecZdravila").val();
    console.log(">>>" + zdravilo, datumZacZdravil, datumKonZdravil);

    if (!ime || !priimek || !datumRojstva || !zdravilo || !datumZacZdravil || !datumKonZdravil ||
        ime.trim().length == 0 || priimek.trim().length == 0 || datumRojstva.trim().length == 0 ||
        zdravilo.trim().length == 0 || datumZacZdravil.trim().length == 0 || datumKonZdravil.trim().length == 0) {
        $("#kreirajSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
    } else {
        var name = ime + " " + priimek;
        var datum = new Date(datumRojstva).toISOString();
        var bolezen = Math.floor(Math.random()*3) + 1;
        console.log(name, datum, bolezen);
        var data = generate(name, datum, bolezen, new Date(datumZacZdravil), new Date(datumKonZdravil));
        console.log(data);
        var ehrID = insertData(data);
    }
}

function preberiEHRodBolnika() {
    sessionId = getSessionId();

    var ehrId = $("#preberiEHRid").val();

    if (!ehrId || ehrId.trim().length == 0) {
        $("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
    } else {
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $("#preberiSporocilo").html("<br/><span class='label label-success fade-in'>Bolnik '" + party.firstNames + " " + party.lastNames + "', ki se je rodil '" + getFormattedDate(new Date(party.dateOfBirth)) + "'.</span>");
                console.log("Bolnik '" + party.firstNames + " " + party.lastNames + "', ki se je rodil '" + party.dateOfBirth + "'.");
            },
            error: function (err) {
                $("#preberiSporocilo").html("<br/><span class='label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                console.log(JSON.parse(err.responseText).userMessage);
            }
        });
    }
}


function dodajMeritveVitalnihZnakov() {
    sessionId = getSessionId();

    var ehrId = $("#dodajVitalnoEHR").val();
    var datumInUra;// = $("#dodajVitalnoDatumInUra").val();
    var datum = $("#dodajVitalnoDatum").val();
    var ura = $("#dodajVitalnoUra").val();
    var min = $("#dodajVitalnoMinute").val();
    //2014-11-21T11:40Z
    datumInUra = datum + "T" + ura + ":" + min + "Z";
    //console.log(datumInUra);
    var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
    var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();
    var telesnaTemperatura = $("#dodajVitalnoTelesnaTemperatura").val();
    var sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val();
    var diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val();
    var puls = $("#dodajVitalnoPuls").val();
    var nasicenostKrviSKisikom = $("#dodajVitalnoNasicenostKrviSKisikom").val();
    var merilec = $("#dodajVitalnoMerilec").val();

    if (!ehrId || ehrId.trim().length == 0) {
        $("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
    } else if (ura > 23 || ura < 0 || min < 0 || min > 59) {
        $("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite pravilne podatke časa!</span>");
    } else {
        $.ajaxSetup({
            headers: {"Ehr-Session": sessionId}
        });
        var podatki = {
            // Preview Structure: https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
            "ctx/language": "en",
            "ctx/territory": "SI",
            "ctx/time": datumInUra,
            "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
            "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
            "vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
            "vital_signs/body_temperature/any_event/temperature|unit": "°C",
            "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
            "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
            "vital_signs/pulse/any_event/rate|magnitude": puls,
            "vital_signs/pulse/any_event/rate|unit": "/min",
            "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom
        };
        var parametriZahteve = {
            "ehrId": ehrId,
            templateId: 'Vital Signs',
            format: 'FLAT',
            committer: merilec
        };
        $.ajax({
            url: baseUrl + "/composition?" + $.param(parametriZahteve),
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(podatki),
            success: function (res) {
                console.log(res.meta.href);
                /* + res.meta.href + */
                $("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-success fade-in'>Uspešno dodan zapis.</span>");
            },
            error: function (err) {
                $("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                console.log(JSON.parse(err.responseText).userMessage);
            }
        });
    }
}

function izpisZdravila(ehrId, datumZac, datumKon) {
    //console.log("zdravila!");
    $("#preberiSporocilo").empty();
    $("#rezultatiEHR").empty();
    //console.log(ehrId, datumZac, datumKon);
    sessionId = getSessionId();
    if(datumZac == undefined && datumKon == undefined) {
        var AQL =
            "select " +
            "a_a/activities[at0001]/description[at0002]/items[at0003]/value as zdravilo, " +
            "a_a/activities[at0001]/description[at0002]/items[at0010, 'Medication timing']/items[at0012]/value as startDate, " +
            "a_a/activities[at0001]/description[at0002]/items[at0010, 'Medication timing']/items[at0013]/value as endDate " +
            "from EHR e[e/ehr_id/value='" + ehrId + "'] " +
            "contains COMPOSITION a " +
            "contains INSTRUCTION a_a[openEHR-EHR-INSTRUCTION.medication.v1] " +
            "offset 0 limit 10";
        //console.log(AQL);
        $.ajax({
            url: baseUrl + "/query?" + $.param({"aql": AQL}),
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (res) {
                var results = "<table class='table table-striped table-hover'><tr><th>Ime zdravila</th><th class='text-right'>Datum zacetek</th><th class='text-right'>Datum konec</th></tr>";
                if (res) {
                    var rows = res.resultSet;
                    //console.log(rows[0].startDate.value);
                    for (var i in rows) {
                        var dateStart, datumStart, casStart;
                        if (rows[i].startDate != null) {
                            dateStart = new Date(rows[i].startDate.value);
                            datumStart = dateStart.getDate() + "." + (dateStart.getMonth() + 1) + "." + dateStart.getFullYear();
                            casStart = dateStart.getUTCHours() + ":" + dateStart.getUTCMinutes();
                        } else {
                            dateStart = "";
                            datumStart = "";
                            casStart = "";
                        }
                        var dateEnd, datumEnd, casEnd;
                        if (rows[i].endDate != null) {
                            dateEnd = new Date(rows[i].endDate.value);
                            datumEnd = dateEnd.getDate() + "." + (dateEnd.getMonth() + 1) + "." + dateEnd.getFullYear();
                            casEnd = dateEnd.getUTCHours() + ":" + dateEnd.getUTCMinutes();
                        } else {
                            dateEnd = "";
                            datumEnd = "";
                            casEnd = "";
                        }
                        //onclick='console.log(\"click\")'><td id='zdravilo' value='" + ehrId + "'
                        results += "<tr onclick=\"izpisZdravila('" + ehrId + "', '" + dateStart + "', '" + dateEnd + "')\" style=\"cursor: pointer;\">" +
                        "<td>" + rows[i].zdravilo.value + "</td><td  class='text-right'>" + datumStart + ", " + casStart + "</td><td  class='text-right'>" + datumEnd + ", " + casEnd + "</td></tr>";
                    }
                    results += "</table>";
                    $("#rezultatiEHR").append(results);
                    var x = $("#narisiGraf").is(':checked');
                    if(x == true) {
                        document.getElementById("narisiGraf").click();
                    }
                    document.getElementById("narisiGraf").disabled = true;
                    $("#lekarne").css("display","none");
                } else {
                    $("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
                }
            },
            error: function (err) {
                $("#preberiSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                console.log(JSON.parse(err.responseText).userMessage);
            }
        });
    } else {
        var zdrStart = new Date(datumZac);
        var zdrEnd = new Date(datumKon);
        var where = (datumZac == undefined && datumKon == undefined) ? "" : " where a_a/data[at0002]/origin/value>='" + zdrStart.toISOString() + "' and  a_a/data[at0002]/origin/value<='" + zdrEnd.toISOString() + "'";
        var AQL = "select " +
            "a_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as temperatura, " +
            "a_b/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value as diastolicen, " +
            "a_b/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value as sistolicen, " +
            "a_c/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as puls, " +
            "a_a/data[at0002]/origin as datum " +
            "from EHR e[ehr_id/value='" + ehrId + "'] " +
            "contains COMPOSITION a " +
            "contains ( " +
            "OBSERVATION a_a[openEHR-EHR-OBSERVATION.body_temperature.v1] and " +
            "OBSERVATION a_b[openEHR-EHR-OBSERVATION.blood_pressure.v1] and " +
            "OBSERVATION a_c[openEHR-EHR-OBSERVATION.heart_rate-pulse.v1]) " +
            where +
            " order by a_a/data[at0002]/origin";
        //console.log(AQL);
        $.ajax({
            url: baseUrl + "/query?" + $.param({"aql": AQL}),
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (res) {
                var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Temperatura</th><th class='text-right'>Tlak (dias)</th><th class='text-right'>Tlak (sist)</th><th class='text-right'>Puls</th></tr>";
                if (res) {
                    var rows = res.resultSet;
                    //console.log(rows);
                    for (var i in rows) {
                        results += "<tr><td>" + getFormattedDate(new Date(rows[i].datum.value)) + "</td><td class='text-right'>" + Math.round(rows[i].temperatura.magnitude * 100)/100 + " " + rows[i].temperatura.units + "</td>" +
                        "<td class='text-right'>" + rows[i].diastolicen.magnitude + " " + rows[i].diastolicen.units + "</td>" +
                        "<td class='text-right'>" + rows[i].sistolicen.magnitude + " " + rows[i].sistolicen.units + "</td>" +
                        "<td class='text-right'>" + rows[i].puls.magnitude + " " + rows[i].puls.units + "</td></tr>";
                    }
                    results += "</table>";
                    $("#rezultatiEHR").append(results);
                    drawGraphTemp(rows);
                    drawGraphTlakSis(rows);
                    drawGraphTlakDia(rows);
                    drawGraphPuls(rows);
                    $("#narisiGraf").removeAttr("disabled");
                    var dia = rows[rows.length - 1].diastolicen.magnitude;
                    var sis = rows[rows.length - 1].sistolicen.magnitude;
                    var temp = rows[rows.length - 1].temperatura.magnitude;
                    var puls = rows[rows.length - 1].puls.magnitude;
                    if(temp > 36.5 || puls > 100 || puls < 40 || sis > 120 || dia > 90){
                        $("#lekarne").css("display","inline");
                    }
                } else {
                    $("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
                }
            },
            error: function (err) {
                $("#preberiSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                console.log(JSON.parse(err.responseText).userMessage);
            }
        });
    }
}

function preberiMeritveVitalnihZnakov(tipForced, ehrIDForced, zdraviloForced, zdrStart, zdrEnd) {
    //console.log(tipForced, ehrIDForced, zdraviloForced, zdrStart, zdrEnd);
    sessionId = getSessionId();

    var ehrId = (ehrIDForced == undefined) ? $("#meritveVitalnihZnakovEHRid").val() : ehrIDForced;
    var tip = (tipForced == undefined) ? $("#preberiTipZaVitalneZnake").val() : tipForced;
    var zdravilo = (zdraviloForced == undefined) ? "" : zdraviloForced;
    zdrStart = (zdrStart == undefined) ? undefined : new Date(zdrStart);
    zdrEnd = (zdrStart == undefined) ? undefined : new Date(zdrEnd);


    if (!ehrId || ehrId.trim().length == 0 || !tip || tip.trim().length == 0) {
        $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
    } else {
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party
                //console.log(party);
                if (zdraviloForced != undefined && zdrStart != undefined && zdrEnd != undefined) {
                    $("#rezultatMeritveVitalnihZnakov").html("<br/><span>Pridobivanje podatkov v času porabe <b>'" + zdravilo + "', od " + getFormattedDate(zdrStart) + " do " + getFormattedDate(zdrEnd) + "'</b>.</span><br/><br/>");
                } else {
                    $("#rezultatMeritveVitalnihZnakov").html("<br/><span>Pridobivanje podatkov za <b>'" + tip + "'</b> bolnika <b>'" + party.firstNames + " " + party.lastNames + "'</b>.</span><br/><br/>");
                }
                if (tip == "telesna temperatura") {
                    var AQL =
                        "select " +
                        "t/data[at0002]/events[at0003]/time/value as cas, " +
                        "t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as temperatura_vrednost, " +
                        "t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/units as temperatura_enota " +
                        "from EHR e[e/ehr_id/value='" + ehrId + "'] " +
                        "contains OBSERVATION t[openEHR-EHR-OBSERVATION.body_temperature.v1] " +
                        "order by t/data[at0002]/events[at0003]/time/value ";
                    $.ajax({
                        url: baseUrl + "/query?" + $.param({"aql": AQL}),
                        type: 'GET',
                        headers: {"Ehr-Session": sessionId},
                        success: function (res) {
                            var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Telesna temperatura</th></tr>";
                            if (res) {
                                var rows = res.resultSet;
                                for (var i in rows) {
                                    results += "<tr><td>" + getFormattedDate(new Date(rows[i].cas)) + "</td><td class='text-right'>" + Math.round(rows[i].temperatura_vrednost *100)/100 + " " + rows[i].temperatura_enota + "</td>";
                                }
                                results += "</table>";
                                $("#rezultatMeritveVitalnihZnakov").append(results);
                            } else {
                                $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
                            }

                        },
                        error: function () {
                            $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                            console.log(JSON.parse(err.responseText).userMessage);
                        }
                    });
                }else if (tip == "tlak"){
                    var AQL =   "select " +
                                "a_a/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value as sistolicen, " +
                                "a_a/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value as diastolicen, " +
                                "a_a/data[at0001]/origin as cas " +
                                "from EHR e[e/ehr_id/value='" + ehrId + "'] " +
                                "contains COMPOSITION a " +
                                "contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.blood_pressure.v1]";
                    $.ajax({
                        url: baseUrl + "/query?" + $.param({"aql": AQL}),
                        type: 'GET',
                        headers: {"Ehr-Session": sessionId},
                        success: function (res) {
                            var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Sistoličen tlak</th><th class='text-right'>Diastoličen tlak</th></tr>";
                            if (res) {
                                var rows = res.resultSet;
                                for (var i in rows) {
                                    results += "<tr><td>" + getFormattedDate(new Date(rows[i].cas.value)) + "</td>" +
                                    "<td class='text-right'>" + rows[i].sistolicen.magnitude + " " + rows[i].sistolicen.units + "</td>" +
                                    "<td class='text-right'>" + rows[i].diastolicen.magnitude + " " + rows[i].diastolicen.units + "</td>";
                                }
                                results += "</table>";
                                $("#rezultatMeritveVitalnihZnakov").append(results);
                            } else {
                                $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
                            }

                        },
                        error: function () {
                            $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                            console.log(JSON.parse(err.responseText).userMessage);
                        }
                    });
                } else if (tip == "puls") {
                    var AQL =
                        "select " +
                        "a_a/data[at0002]/origin as cas, " +
                        "a_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as puls " +
                        "from EHR e[e/ehr_id/value='" + ehrId + "'] " +
                        "contains COMPOSITION a " +
                        "contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.heart_rate-pulse.v1] " +
                        "order by a_a/data[at0002]/origin ";
                    //console.log(AQL);
                    $.ajax({
                        url: baseUrl + "/query?" + $.param({"aql": AQL}),
                        type: 'GET',
                        headers: {"Ehr-Session": sessionId},
                        success: function (res) {
                            var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Srčni utrip</th></tr>";
                            if (res) {
                                var rows = res.resultSet;
                                //console.log(rows);
                                for (var i in rows) {
                                    results += "<tr><td>" + getFormattedDate(new Date(rows[i].cas.value)) + "</td><td class='text-right'>" + rows[i].puls.magnitude + rows[i].puls.units + "</td>";
                                }
                                results += "</table>";
                                $("#rezultatMeritveVitalnihZnakov").append(results);
                            } else {
                                $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
                            }

                        },
                        error: function () {
                            $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                            console.log(JSON.parse(err.responseText).userMessage);
                        }
                    });
                } else if (tip == "vse podatke") {
                    var where = (zdrStart == undefined && zdrEnd == undefined) ? "" : " where a_a/data[at0002]/origin/value>='" + zdrStart.toISOString() + "' and  a_a/data[at0002]/origin/value<='" + zdrEnd.toISOString() + "'";
                    var AQL = "select " +
                        "a_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as temperatura, " +
                        "a_b/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value as diastolicen, " +
                        "a_b/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value as sistolicen, " +
                        "a_c/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as puls, " +
                        "a_a/data[at0002]/origin as datum " +
                        "from EHR e[ehr_id/value='" + ehrId + "'] " +
                        "contains COMPOSITION a " +
                        "contains ( " +
                        "OBSERVATION a_a[openEHR-EHR-OBSERVATION.body_temperature.v1] and " +
                        "OBSERVATION a_b[openEHR-EHR-OBSERVATION.blood_pressure.v1] and " +
                        "OBSERVATION a_c[openEHR-EHR-OBSERVATION.heart_rate-pulse.v1]) " +
                         where +
                        " order by a_a/data[at0002]/origin";
                    //console.log(AQL);
                    $.ajax({
                        url: baseUrl + "/query?" + $.param({"aql": AQL}),
                        type: 'GET',
                        headers: {"Ehr-Session": sessionId},
                        success: function (res) {
                            var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Temperatura</th><th class='text-right'>Tlak (dias)</th><th class='text-right'>Tlak (sist)</th><th class='text-right'>Puls</th></tr>";
                            if (res) {
                                var rows = res.resultSet;
                                //console.log(rows.length);
                                for (var i in rows) {
                                    results += "<tr><td>" + getFormattedDate(new Date(rows[i].datum.value)) + "</td><td class='text-right'>" + Math.round(rows[i].temperatura.magnitude * 100)/100 + " " + rows[i].temperatura.units + "</td>" +
                                    "<td class='text-right'>" + rows[i].diastolicen.magnitude + " " + rows[i].diastolicen.units + "</td>" +
                                    "<td class='text-right'>" + rows[i].sistolicen.magnitude + " " + rows[i].sistolicen.units + "</td>" +
                                    "<td class='text-right'>" + rows[i].puls.magnitude + " " + rows[i].puls.units + "</td></tr>";
                                }
                                results += "</table>";
                                $("#rezultatMeritveVitalnihZnakov").append(results);
                            } else {
                                $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
                            }
                        },
                        error: function (err) {
                            $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                            console.log(JSON.parse(err.responseText).userMessage);
                        }
                    });
                }
            },
            error: function (err) {
                $("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                console.log(JSON.parse(err.responseText).userMessage);
            }
        });
    }
}


$(document).ready(function () {
    $('#preberiObstojeciEHR').change(function () {
        $("#preberiSporocilo").html("");
        $("#preberiEHRid").val($(this).val());
    });

    $('#preberiPredlogoBolnika').change(function () {
        $("#kreirajSporocilo").html("");
        var podatki = $(this).val().split(",");
        $("#kreirajIme").val(podatki[0]);
        $("#kreirajPriimek").val(podatki[1]);
        $("#kreirajDatumRojstva").val(podatki[2]);
    });

    $('#preberiObstojeciVitalniZnak').change(function () {
        $("#dodajMeritveVitalnihZnakovSporocilo").html("");
        var podatki = $(this).val().split("|");
        console.log(podatki);
        $("#dodajVitalnoEHR").val(podatki[0]);
        $("#dodajVitalnoDatum").val(podatki[1]);
        $("#dodajVitalnoUra").val(podatki[2]);
        $("#dodajVitalnoMinute").val(podatki[3]);
        //$("#dodajVitalnoTelesnaVisina").val(podatki[4]);
        //$("#dodajVitalnoTelesnaTeza").val(podatki[5]);
        $("#dodajVitalnoTelesnaTemperatura").val(podatki[6]);
        $("#dodajVitalnoKrvniTlakSistolicni").val(podatki[7]);
        $("#dodajVitalnoKrvniTlakDiastolicni").val(podatki[8]);
        $("#dodajVitalnoPuls").val(podatki[9]);
        //$("#dodajVitalnoNasicenostKrviSKisikom").val(podatki[10]);
        //$("#dodajVitalnoMerilec").val(podatki[11]);
    });

    $('#preberiEhrIdZaVitalneZnake').change(function () {
        $("#preberiMeritveVitalnihZnakovSporocilo").html("");
        $("#rezultatMeritveVitalnihZnakov").html("");
        $("#meritveVitalnihZnakovEHRid").val($(this).val());
    });
    $("#narisiGraf").click(function (e){
        $("#tabi").toggle(this.checked);
        $("#rezultatiEHR").toggle(!this.checked);
    })
});