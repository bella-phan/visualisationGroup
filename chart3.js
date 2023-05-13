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
    var color = ["#fdd49e", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#d4b9da", "#1d91c0", "#807dba"];

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
            return color[d.id];
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
            //projection.invert(centroid); to get lat long from pixel
            return "translate(" + centroid[0] + "," + centroid[1] + ")"
        })
        .attr("fill", "white")
        .attr("font-size", "9px");

    //load d3.csv()
    let statePosition = await d3.csv("state.csv");

    //using scaleLinear to create a scale for circle
    var rScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.arrival_people; })])
        .range([2, 5]);

    //Use for loop to merge arrial_people form data to statePosition in order to prepare for draw circle.
    for (let st of statePosition)
        for (let d of data)
            if (st.state == d.state) {
                st.arrival_people = d.arrival_people;
            }

            //create bubble for each state
    svg.selectAll("circle")
        .data(statePosition)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", function(d) {
            return rScale(d.arrival_people);
        })
        .attr("fill", "brown")
        .attr("fill-opacity", 0.5)
        //add mouse over effect to show number of people arrive the state
        .on("mouseover", function(d) {
            let val = this.__data__.arrival_people; // get value of selected bar
            d3.select(this)
                .attr("fill", "orange")
            var xPosition = parseFloat(d3.select(this).attr("cx")) + 4;
            var yPosition = parseFloat(d3.select(this).attr("cy")) + 14;
            svg.append("text")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .attr("id", "tooltip")
                .attr("text-ancho", "middle")
                .attr("font-family", "sans-serif")
                .attr("font-size", "9px")
                .attr("font-weight", "light")
                .attr("fill", "black")
                .text(val);
        })
        //add mouse out effect to return the colour
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", "brown");
            d3.select("#tooltip").remove();
        })

};
// wait for web page to load first then execute draw method.
window.onload = draw;