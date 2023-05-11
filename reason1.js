//idea: create pie chart to see what kind of visa apply to 
async function draw() {
    //creating a new variable svg so we can easily reference it later
    var w = 300;
    var h = 300;
    var padding = 0;
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    var dataset = [56, 18, 10, 45, 25, 20];
    //set up pie chart parameters
    var outerRadius = w / 2;
    var innerRadius = w / 3; //To create donut charts, change this one
    var arc = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);
    var pie = d3.pie();
    console.log(pie(dataset));
    //set up arcs
    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
    var color = d3.scaleOrdinal(['#ffffcc', '#c7e9b4', '#c7e9b4', '#41b6c4', '#2c7fb8']);
    //add text lanle
    //draw the arcs
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", function(d, i) {
            return arc(d, i);
        });

    arcs.append("text")
        .text(function(d) {
            return d.value;
        })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        });

};
// wait for web page to load first then execute draw method.
window.onload = draw;