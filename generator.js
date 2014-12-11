/**
 * Created by Марко on 11.12.2014.
 */

function generatePat(varianceTemp, varianceBlood1, varianceBlood2, variancePulse, dateStart, dateEnd) {
    // TODO generatePat 30 samples
    // (is 30 enough?) depends on d3.js
    var hh = 0;
    var raz = 4;
    var i = 0;
    var results = [];
    var zdravilo = false;
    var temp = (varianceTemp >= 7) ? 37.2 : 36.5;
    var blood1 = (varianceBlood1 > 10) ? 90 : 80;
    var blood2 = (varianceBlood1 > 10) ? 130 : 120;
    var pulse = (variancePulse > 20) ? 80 : 60;
    console.log(temp,blood1, blood2, pulse);
    while(dateStart.getTime() < dateEnd.getTime()) {
        var entry = {};
        entry.data = dateStart;
       // console.log(i,dateStart);
        if(i % 2 == true) {
            entry.zdravilo = true;
            entry.temperatura = Math.floor(Math.random() * (varianceTemp/2)) + temp;
            entry.tlakDias = Math.floor(Math.random() * varianceBlood1/2) + blood1;
            entry.tlakSis = Math.floor(Math.random() * varianceBlood2/2) + blood2;
            entry.puls = Math.floor(Math.random() * variancePulse/2) + pulse;
        } else {
            entry.zdravilo = false;
            entry.temperatura = Math.random() * (varianceTemp) + temp;
            entry.tlakDias = Math.floor(Math.random() * varianceBlood1) + blood1;
            entry.tlakSis = Math.floor(Math.random() * varianceBlood2) + blood2;
            entry.puls = Math.floor(Math.random() * variancePulse) + pulse;
        }
        results.push(entry);
        dateStart.setHours(dateStart.getHours() + raz)
        console.log(entry);
        i++;
    }
    return results;
}

function generate(name, patient) { // 1, 2, 3
    array = []; // JSON
    // equal dateStart for either case (randomly generated every time it is called)
    var day = Math.floor(Math.random()*31) + 1;
    var month = Math.floor(Math.random()*12);
    var year = Math.floor(Math.random()*5) + 2010;
   // day =  (month == 2 && day > 28) ? 28 : day; // ternary operator
    /*if(month == 2 && day > 28) {
        day = 28;
    }*/
    var hour = Math.floor(Math.random()*23) + 1;
    var min = Math.floor(Math.random()*59) + 1;
    var dateStart = new Date(year, month, day, hour, min, 0);
    day += Math.floor(Math.random() * 7) + 3;
    hour = Math.floor(Math.random()*23) + 1;
    min = Math.floor(Math.random()*59) + 1;
    var dateEnd = new Date(year, month, day, hour, min, 0);
    console.log(dateStart, dateEnd);
    array.ime = name;
    array.datumZacetek = dateStart;
    array.datumKonec = dateEnd;
    // blood1 = diastolic
    // blood2 = systolic
    var varianceTemp, varianceBlood1, varianceBlood2, variancePulse;
    switch (patient) {
        //TODO check the variances!!!
        case 1: // fever
            console.log(1);
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
            break;c
        case 2: // blood pressure
            console.log(2);
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
            console.log(3);
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
$(document).ready(function (){
    var xx = generate("Marko", 3);
    console.log(xx);
    $("#gendata").append(JSON.stringify(xx));
});
