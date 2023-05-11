async function draw() {
    //creating a new variable svg so we can easily reference it later
    var w = 600;
    var h = 400;
    var margin = 50;
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    //load data from datase
    var dataset = await d3.csv("reason_dataset.csv", function(data) {
        console.log(data)
    });

    // Set up Scale
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([0, width])
        //Access data.csv file by using d3
    function barChart(wombatSightings) {
        svg.selectAll("rect")
            .data(wombatSightings)
            .enter()
            .append("rect")
            .attr("x", function(d, i) { //create a function to assign value of x when it going to the loops of dada
                return i * (w / wombatSightings.length);
            })
            .attr("y", function(d) {
                return h - (d.wombats * 4);
            })
            .attr("width", 20)
            .style("height", function(d) { // function to change the height of the column
                var columeHeight = d.wombats * 4
                return columeHeight
            })
            .attr("fill", "teal");
    };
    d3.csv("data.csv")
        .then(function(data) {
            console.log(data);
            wombatSightings = data;
            barChart(wombatSightings);

        });
};
// wait for web page to load first then execute draw method.
window.onload = draw;