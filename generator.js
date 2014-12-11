/**
 * Created by Марко on 11.12.2014.
 */

function generate(varianceTemp, varianceBlood1, varianceBlood2, variancePulse, date) {
    // TODO generate 30 samples
    // (is 30 enough?) depends on d3.js
}

function generate(patient) { // 1, 2, 3
    array = []; // JSON
    // equal date for either case (randomly generated every time it is called)
    var day = Math.floor(Math.random()*31) + 1;
    var month = Math.floor(Math.random()*12) + 1;
    var year = Math.floor(Math.random()*5) + 2010;
    day =  (month == 2 && day > 28) ? 28 : day; // ternary operator
    /*if(month == 2 && day > 28) {
        day = 28;
    }*/
    var hour = Math.floor(Math.random()*23) + 1;
    var min = Math.floor(Math.random()*59) + 1;
    var date = new Date(year, month, day, hour, min);
    // blood1 = diastolic
    // blood2 = systolic
    var varianceTemp, varianceBlood1, varianceBlood2, variancePulse;
    switch (patient) {
        //TODO check the variances!!!
        case 1: // fever
            varianceTemp = 7;
            varianceBlood1 = 10;
            varianceBlood2 = 10;
            variancePulse = 20;
            array = generate(varianceTemp, varianceBlood1, varianceBlood2, variancePulse, date);
            break;
        case 2: // blood pressure
            varianceTemp = 2;
            varianceBlood1 = 30;
            varianceBlood2 = 30;
            variancePulse = 20;
            array = generate(varianceTemp, varianceBlood1, varianceBlood2, variancePulse, date);
            break;
        case 3: // pulse
            varianceTemp = 2;
            varianceBlood1 = 10;
            varianceBlood2 = 10;
            variancePulse = 50;
            array = generate(varianceTemp, varianceBlood1, varianceBlood2, variancePulse, date);
            break;
        default:
            break;
    }
    return array;
}

var xx = generate();