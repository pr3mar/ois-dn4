/**
 * Created by Марко on 12.12.2014.
 */

var dimX, dimY;
dimX = 600; dimY = 350;

var tmpData;

function resizeGraphs() {
    drawGraphTemp();
    drawGraphPuls();
    drawGraphTlakDia();
    drawGraphTlakSis();
}
function drawGraphPuls(patient) {
    if(patient == undefined && tmpData != undefined) {
        patient = tmpData;
    } else if(patient != undefined && tmpData == undefined) {
        tmpData = patient;
    } else if (patient == undefined && tmpData == undefined) {
        return;
    }
    console.log(tmpData);
    //console.log(patient);
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = $("#getH").width() - margin.left - margin.right,
        height = $("#getH").height() - margin.top - margin.bottom;

    //var parseDate = d3.time.format("%a %b %d %Y %H:%M:%S %Z").parse;
    var iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });
    $("#grafPuls").empty();
    var svg = d3.select("#grafPuls").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var data = [];
    patient.forEach(function (d) {
        var entry = {};
        entry.date = iso(new Date(d.datum.value).toISOString());
        entry.close = +d.puls.magnitude;
        data.push(entry);
    });
    //console.log(data);

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.close;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Puls");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}
function drawGraphTlakSis(patient) {
    if(patient == undefined && tmpData != undefined) {
        patient = tmpData;
    } else if(patient != undefined && tmpData == undefined) {
        tmpData = patient;
    } else if (patient == undefined && tmpData == undefined) {
        return;
    }
    //console.log(patient);
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = $("#getH").width() - margin.left - margin.right,
        height = $("#getH").height() - margin.top - margin.bottom;

    //var parseDate = d3.time.format("%a %b %d %Y %H:%M:%S %Z").parse;
    var iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });
    $("#grafSis").empty();
    var svg = d3.select("#grafSis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var data = [];
    patient.forEach(function (d) {
        var entry = {};
        entry.date = iso(new Date(d.datum.value).toISOString());
        entry.close = +d.sistolicen.magnitude;
        data.push(entry);
    });
    //console.log(data);

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.close;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Sistolicni tlak");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}
function drawGraphTlakDia(patient) {
    if(patient == undefined && tmpData != undefined) {
        patient = tmpData;
    } else if(patient != undefined && tmpData == undefined) {
        tmpData = patient;
    } else if (patient == undefined && tmpData == undefined) {
        return;
    }
    //console.log(patient);
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = $("#getH").width() - margin.left - margin.right,
        height = $("#getH").height() - margin.top - margin.bottom;

    //var parseDate = d3.time.format("%a %b %d %Y %H:%M:%S %Z").parse;
    var iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });
    $("#grafDia").empty();
    var svg = d3.select("#grafDia").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var data = [];
    patient.forEach(function (d) {
        var entry = {};
        entry.date = iso(new Date(d.datum.value).toISOString());
        entry.close = +d.diastolicen.magnitude;
        data.push(entry);
    });
    //console.log(data);

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.close;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Diastolicni tlak");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}

function drawGraphTemp(patient) {
    if(patient == undefined && tmpData != undefined) {
        patient = tmpData;
    } else if(patient != undefined && tmpData == undefined) {
        tmpData = patient;
    } else if (patient == undefined && tmpData == undefined) {
        return;
    }
    //console.log(patient);
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = $("#getH").width() - margin.left - margin.right,
        height = $("#getH").height() - margin.top - margin.bottom;
    //console.log(width, height);
    //var parseDate = d3.time.format("%a %b %d %Y %H:%M:%S %Z").parse;
    var iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });
    $("#grafTemp").empty();
    var svg = d3.select("#grafTemp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var data = [];
    //console.log(patient);
    patient.forEach(function (d) {
        //console.log("d");
        //console.log(d);
        var entry = {};
        entry.date = iso(new Date(d.datum.value).toISOString());
        entry.close = +d.temperatura.magnitude;
        data.push(entry);
    });
    //console.log(data);

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.close;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temperatura");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}