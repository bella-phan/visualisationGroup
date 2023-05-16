async function draw() {
    //creating a new variable svg so we can easily reference it later
    var w = 500;
    var h = 300;
    var margin = 50;
    //Append svg to the body page
    var svg = d3.select("#chart2")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //load data from datase
    const data = await d3.csv("chart2_reason.csv");

    // List of subgroups = header of the csv file = soil condition here
    var subgroups = data.columns.slice(1);
    //list of groups = species here = value of girst colum called group => show them in X axis
    var groups = d3.map(data, function(d) {
            return d.reason
        })
        .keys();
    //Scale x and add X asis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, w])
        .padding([0.2]);

    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(x).tickSize(0));
    //Scale y and add Y asis
    var y = d3.scaleLinear()
        .domain([0, 40])
        .range([h, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    //Another scale for subgroup position
    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);

    // color
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#41b6c4', '#2c7fb8']);

    //Draw the bars
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d) {
            return "translate(" + x(d.reason) + ",0)";
        })
        .selectAll("rect")
        .data(function(d) {
            return subgroups.map(function(key) {
                return { key: key, value: d[key] }
            })
        })
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return xSubgroup(d.key);
        })
        .attr("y", function(d) {
            return y(d.value);
        })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) {
            return h - y(d.value);
        })
        .attr("fill", function(d) {
            return color(d.key);
        })

};
// wait for web page to load first then execute draw method.
window.onload = draw;