var composer, era;

var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width = 960 - margin.left - margin.right, // 880
		height = 500 - margin.top - margin.bottom; // 450

var body = d3.select("body");

var barHeight = 20;

/*var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-10, 0])
	.html(function(d) {
		return d.name;
	}); */

// mappings
var x = d3.time.scale()
		.domain([1600, 2000]) // input range
		.range([0, width]); 	// output range

var length = d3.scale.linear()
		.domain([0, 400])
		.range([0, width]);

var y = d3.scale.linear()
		.range([height - barHeight, 0]);

var color = d3.scale.category10();

// axis
var axis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.tickFormat(d3.format("y"));

// canvas
var svg = body.select(".d3").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.bottom + margin.top)
  .append("g")
  .attr("transform", "translate("+margin.left+", "+margin.top+")");

svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0, "+height+")")
	.call(axis);

//svg.call(tip);

// data
d3.json("data.json", function(error, json) {
	era = json["era"];
	composer = json["composer"];

	y.domain([0, composer.length]);

	// era
	var bar = svg.append("g").attr("class", "era")
			.selectAll("g")
			.data(era)
	 	 	.enter().append("g");

	bar.append("text")
			.attr("x", function(d) { return x(d.start); })
			.attr("y", 0)
			.attr("dy", ".40em")
			.text(function(d) { return d.name; })
			.attr("fill", function(d, i) { return color(i); })
			.attr("fill-opacity", 0.8);

	bar.append("rect")
			.attr("x", function(d) { return x(d.start); })
			.attr("y", 10)
			.attr("height", height - 10)
			.attr("width", function(d) { return length(d.end - d.start); })
			.attr("fill", function(d, i) { return color(i); })
			.attr("fill-opacity", 0.5);
	
	// composer
	var cBar = svg.append("g").attr("class", "composer")
			.selectAll("rect")
			.data(composer)
	 		.enter().append("g");

	cBar.append("rect")
			.attr("x", function(d) { return x(d.born); })
			.attr("y", function(d, i) { return y(i); })
			.attr("width", function(d) { return length(d.died - d.born); })
			.attr("height", barHeight)
			.attr("fill", "white")
			.attr("fill-opacity", 0.7)
			.on("click", function() { d3.select(this)
																	.transition()
																	.delay(function(d,i) { return i*100; })
																	.duration(1000)
																	.attr("y", height - barHeight); 
															});
			//.on("mouseover", tip.show)
			//.on("mouseout", tip.hide)

	cBar.append("text")
			.attr("x", function(d) { return x(d.born) + 2; })
			.attr("y", function(d, i) { return y(i) + barHeight - 4; })
			.text(function(d) { return d.name; })
			.attr("fill", "#444444");

});
