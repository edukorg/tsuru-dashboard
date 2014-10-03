(function($, window){

	var graph = function(kind, graphiteHost, appName) {
		var url = "http://" + graphiteHost + "/render/?target=summarize(statsite.tsuru." + appName + ".*.*." + kind + ", \"10minute\", \"max\")&format=json&jsonp=?&from=-1h";
		$.getJSON( url , function( data ) {
			var g = [];
			$.each(data, function(index, target) {
				var d = [];
				$.each(target["datapoints"], function(index, value) {
					var v = value[0];
					if ( ( kind === "mem_sum" ) || ( kind === "mem_max" ) ) {
						v = v / ( 1024 * 1024 );
					}
					d.push({y: v, x: new Date(value[1] * 1000)});
				});
				g.push({key: target["target"], values: d});
			});

			nv.addGraph(function() {
				var chart = nv.models.lineChart()
				.forceY([0, 100])
				.showLegend(false);

			chart.xAxis
				.tickFormat(function(d){
					return d3.time.format('%X')(new Date(d));
				});

			$("#metrics ." + kind).remove();
			var element = '<div class="' + kind + '"><h2>' + kind + '</h2><svg></svg></div>';
			$('#metrics').append(element);

			d3.select('#metrics .' + kind + ' svg')
				.datum(g)
				.transition().duration(500)
				.call(chart);

			nv.utils.windowResize(chart.update);

			window.setTimeout(graph, 60000, kind, graphiteHost, appName);
			return chart;
			});
		});
	}

	var graphs = function(graphiteHost, appName) {
		var kinds = ["mem_sum", "cpu_sum", "mem_pct_sum", "mem_pct_max", "mem_max", "cpu_max"];
		$.each(kinds, function(i, kind) {
			graph(kind, graphiteHost, appName);
		});
	}

	$.Graph = graphs;


})(jQuery, window);