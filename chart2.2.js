async function drawChart1() {
    //Load data form csv file
    const data = await d3.csv("chart2_reason.csv");
    //sort data
    data.sort(function(b, a) {
        return a.arrival - b.arrival;
    });
    var ids = ["arrival", "departure"];
    var catagories = ["Arrival", "Departure"];
    // categoeries checkboxes
    d3.select("#label")
        .selectAll("#label")
        .data(ids)
        .enter()
        .append('div')
        .attr('class', 'checkbox')
        .append('label').html(function(id, index) {
            var checkbox = '<input id="' + id + '" type="checkbox" id="label">';
            return checkbox + catagories[index];
        });

    // some variables declarations
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // the scale for the reason value
    var x = d3.scale.linear()
        .range([0, width]);

    // the scale for each reason
    var y0 = d3.scale.ordinal()
        .rangeBands([0, height], .1);
    // the scale for each state age
    var y1 = d3.scale.ordinal();

    // just a simple scale of colors
    var color = d3.scale.ordinal()
        .range(['#41b6c4', '#2c7fb8']);

    // create xAsis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom") //set the orientation and returns the axis. If the orientation is not specified, returns the current orientation which defaults to “bottom”.
        //.tickFormat(d3.format(".2s"));

    var yAxis = d3.svg.axis()
        .scale(y0)
        .orient("left"); //set the orientation and returns the axis. If the orientation is not specified, returns the current orientation which defaults to “left”.

    //Append svg
    var svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // When select arrival or departute it will append value to Axis
    d3.select("#chart1")
        .selectAll("#chart1")
        .on('change', function() {
            var x = d3.select("#label")
                .selectAll('#lable:checked');
            var ids = x[0].map(function(category) {
                return category.id;
            });
            updateGraph(ids);
        });
    renderGraph();

    function renderGraph() {
        x.domain([0, 0]);
        // y0 domain is all the state names
        y0.domain(data.map(function(d) { return d.state; }));
        // y1 domain is all the age names, we limit the range to from 0 to a y0 band
        y1.domain(catagories).rangeRoundBands([0, y0.rangeBand()]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
    }

    function updateGraph(selectedIds) {

        var statesData = data.map(function(stateData) {
            return {
                state: stateData.state,
                ages: selectedIds.map(function(selectedId) {
                    var index = ids.findIndex(function(id) {
                        return selectedId === id;
                    });
                    return {
                        id: ids[index],
                        name: catagories[index],
                        value: stateData.stats[index]
                    };
                })
            }
        });


        // x domain is between 0 and the maximun value in any ages.value
        x.domain([0, d3.max(statesData, function(d) { return d3.max(d.ages, function(d) { return d.value }); })]);
        // y0 domain is all the state names
        y0.domain(statesData.map(function(d) { return d.state; }));
        // y1 domain is all the age names, we limit the range to from 0 to a y0 band
        y1.domain(ids).rangeRoundBands([0, y0.rangeBand()]);

        svg.selectAll('.axis.x').call(xAxis);
        svg.selectAll('.axis.y').call(yAxis);

        var state = svg.selectAll(".state")
            .data(statesData);

        state.enter().append("g")
            .attr("class", "state")
            .attr("transform", function(d) { return "translate(0, " + y0(d.state) + ")"; });

        var age = state.selectAll("rect")
            .data(function(d) { return d.ages; });

        // we append a new rect every time we have an extra data vs dom element
        age.enter().append("rect")
            .attr('width', 0);

        // this updates will happend neither inserting new elements or updating them
        age
            .attr("x", 0)
            .attr("y", function(d, index) { return y1(ids[index]); })
            .attr("id", function(d) { return d.id; })
            .style("fill", function(d) { return color(d.name); })
            .text(function(d) { return d.name })
            .transition()
            .attr("width", function(d) { return x(d.value); })
            .attr("height", y1.rangeBand());

        age.exit().transition().attr("width", 0).remove();

        var legend = svg.selectAll(".legend")
            .data(statesData[0].ages.map(function(age) { return age.name; }));

        legend.enter().append("g");
        legend
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + (200 + i * 20) + ")"; });

        var legendColor = legend.selectAll('.legend-color').data(function(d) { return [d]; });
        legendColor.enter().append("rect");
        legendColor
            .attr('class', 'legend-color')
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        var legendText = legend.selectAll('.legend-text').data(function(d) { return [d]; });;

        legendText.enter().append("text");
        legendText
            .attr('class', 'legend-text')
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        legend.exit().remove();
    }
};
// wait for web page to load first then execute draw method.
window.addEventListener("load", (event) => {
    drawChart1();
});