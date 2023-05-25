async function draw_chart2() {
    //creating a new variable svg so we can easily reference it later
    var chart_width = 570;
    var chart_height = 400;

    var margin = { top: 70, right: 30, bottom: 140, left: 100 },
        w = chart_width - margin.left - margin.right,
        h = chart_height - margin.top - margin.bottom;

    //Append svg to the body page
    var svg = d3.select("#chart2")
        .append("svg")
        .attr("width", chart_width)
        .attr("height", chart_height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //load data from datase
    const data = await d3.csv("chart2_reason.csv");

    //sort data
    data.sort(function(b, a) {
        return a.arrival - b.arrival;
    });

    // List of subgroups = header of the csv file = soil condition here
    var subgroups = data.columns.slice(1);
    //list of groups = species here = value of girst colum called group => show them in X axis
    var groups = d3.map(data, function(d) {
        return d.reason
    });

    //Scale x and add X asis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, w])
        .padding([0.2]);
    //Append axis x
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text") // rotate text
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    //Scale y and add Y asis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return +d.arrival;
        })])
        .range([h, 0]);
    //Append axis y
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

    // Draw the group bars
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d) {
            return "translate(" + x(d.reason) + ",0)";
        }) // Move new element to the right
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
            return y(+d.value);
        })
        .attr("width", xSubgroup.bandwidth())

    .attr("height", function(d) {
            return h - y(+d.value);
        })
        .attr("fill", function(d) {
            return color(d.key);
        })
        .attr("data-type", function(d) {
            // add a data-type attribute to record the arrival/departure rectangle
            return d.key;
        })
        //add mouse over effect to change bar to organe color
        .on("mouseover", function(d) {
            let val = this.__data__.value; // get value of selected bar
            d3.select(this)
                .attr("fill", "orange")
            var xPosition = parseFloat(d3.select(this).attr("x")) + 4;
            var yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            var reason = this.parentElement.__data__.reason;
            var xTransform = x(reason) + x.bandwidth();
            svg.append("text")
                .attr("transform", function() {
                    return "translate(" + xTransform + ",0)";
                }) // Move new element to the right                
                .attr("x", xPosition)
                .attr("y", yPosition)
                .attr("id", "tooltip")
                .style("font-size", "9px")
                .style("text-anchor", "end")
                .attr("fill", "black")
                .text(val);
        })
        //add mouse out effect to return the colour
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", function(d) {
                    return color(d.key);
                });
            d3.select("#tooltip").remove();

        })

    // Handmade legend
    svg.append("circle")
        .attr("cx", 350)
        .attr("cy", 5)
        .attr("r", 6)
        .style("fill", "#41b6c4");
    svg.append("circle")
        .attr("cx", 350)
        .attr("cy", 35)
        .attr("r", 6)
        .style("fill", "#2c7fb8");

    svg.append("text")
        .attr("x", 370)
        .attr("y", 5)
        .text("Arrival")
        .attr("id", "#arrivalClick")
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")
        //add mouse over effect to only show arrival chart only
        .on("mouseover", function(d) {
            svg.selectAll("rect[data-type=departure]").each(function(d) {
                console.log(d);
                d3.select(this).attr("fill", "white");
            })
        })
        .on("mouseout", function(d) {
            let key = "departure";
            svg.selectAll("rect[data-type=departure]").each(function(d) {
                console.log(d);
                d3.select(this).attr("fill", color(key));
            })
        });

    svg.append("text")
        .attr("x", 370)
        .attr("y", 35)
        .text("Departure")
        .attr("id", "#departure")
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")
        //add mouse over effect to only show arrival chart only
        .on("mouseover", function(d) {
            svg.selectAll("rect[data-type=arrival]").each(function(d) {
                console.log(d);
                d3.select(this).attr("fill", "white");
            })
        })
        .on("mouseout", function(d) {
            let key = "arrival";
            svg.selectAll("rect[data-type=arrival]").each(function(d) {
                console.log(d);
                d3.select(this).attr("fill", color(key));
            })
        });
    svg.append("text")
        .attr("x", -40)
        .attr("y", -40)
        .text("People")
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle");
    svg.append("text")
        .attr("x", 30)
        .attr("y", -20)
        .text("(Average from 2010-2020)")
        .style("font-size", "8px")
        .style("text-anchor", "end");

};
// wait for web page to load first then execute draw method.
window.addEventListener("load", (event) => {
    draw_chart2();
});