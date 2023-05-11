async function draw() {
    // set up paths
    var w = 1000;
    var h = 750;

    //    define projection
    var projection = d3.geoMercator()
        .center([133, -25])
        .translate([w / 2, h / 2])
        .scale(800);

    //Define path generator,
    var path = d3.geoPath()
        .projection(projection);

    //add SVG and read GeoJSON
    var svg = d3.select("#chart3")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "#02818a");

    //load in Geojsaon data
    let states = await d3.json("aus_state.json");

    //load d3.csv()
    let data = await d3.csv("state_arrival.csv");

    //define color
    var color = d3.scaleQuantize()
        .domain([
            d3.min(data, function(d) { return +d.arrival_people; }),
            d3.max(data, function(d) { return +d.arrival_people; })
        ])
        .range(["#fdd49e", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#ce1256", "#0c2c84"]);

    //loop through one for each ag. data value
    for (var i = 0; i < data.length; i++) {
        //grab state name
        var dataState = data[i].state;
        //grab data value, and convert from string to float
        var dataValue = parseFloat(data[i].arrival_people);
        //Find the corresponding state inside the GeoJSON
        for (var j = 0; j < states.features.length; j++) {
            var jsonState = states.features[j].properties.STATE_NAME;
            if (dataState == jsonState) {
                //Copy the data value into the Json
                states.features[j].properties.value = dataValue;
                console.log(jsonState, states.features[j].properties.value);
                //stop looking through the Json
                break;
            }
        }
    }
    //bind data and create one path aper GeoJson feature
    svg.selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function(d) {
            return color(d.properties.value);
        });

    svg.selectAll("text")
        .data(states.features)
        .enter()
        // Add State's name on map
        .append("text")
        .text(function(d) {
            return d.properties.STATE_NAME;
        })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            var centroid = path.centroid(d);
            return "translate(" + centroid[0] + "," + centroid[1] + ")"
        });

    //load in Geojsaon data
    let state_name = await d3.csv("state.csv");


    //create bubble for each state
    svg.selectAll("circle")
        .data("state")
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 3)
        .attr("fill", "red");

};
// wait for web page to load first then execute draw method.
window.onload = draw;