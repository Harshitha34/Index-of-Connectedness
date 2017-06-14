//This code is taken from https://github.com/alangrafu/radar-chart-d3
//Some changes have been made according to the requirement
{
var w = 500,
	h = 500;
	var d;
	//added1
	var val3=[];
	//end
	var k;
	//added 2
	var val1=document.getElementById('Date1').value;
	var val2=document.getElementById('Date2').value;
	val3.push(val1,val2);
	//end
	var date;
	var val=document.querySelectorAll('input[type ="checkbox"]:checked');
	var date_row;
	//added 3
	var val_date=document.querySelector('input[type ="checkbox"]:checked').value;
	if(val1=='' && val2 =='')
	{//s5
		//end
		d3.csv("mydata_dup.csv",function(data){//s4//new The map() method creates a new array with the results of calling a function for every array element.
			for(i=0;i<val.length;i++)
			{//s3
				 console.log(val[i]);
				 console.log(val[i].value);
				 date_row=data.filter(function(plk){//s1
				 	if(plk["School Name"] == val[i].value)
				 	{
				 		return plk;
				 	}
				 });//s1
				 var nest = d3.nest()
 				 .key(function(d) { return d.Date; })
  				.entries(date_row);
				if(nest.length==1)
				{
				 	date=nest[0];
				}
				else
				{
				 	console.log(nest);
				 	for(j=0;j<nest.length;j++)
				 	{
				 		var date1=nest[j];
				 		if(date>date1)
				 			date=date;
				 		else
				 			date=date1;
				 	}
				 	/*var date1=nest[0];
				 	var date2=nest[1];
				 	if(date1>date2)
				 	{
				 			date=date1;
				 	}
				 	else{
				 			date=date2;
				 		}*/
				}//else
				console.log(date.key);
					k=date_row.filter(function(row) { //s5
						console.log(i);
						if((row["School Name"] == val[i].value)&& row["Date"]==date.key)//
								return row;
					});//s5
					console.log(k);
					k.map(function(p){//s6
						return [p["Indicator"],p["Indicators_orig"],+p["value"]];
					});//new});//NEW//s6
					if(i<val.length-1)
						d=k;
				}
					var mycfg = {//s7
  						w: w,
  						h: h,	
  						maxValue: 1.0,
  						levels: 6,       
  						ExtraWidthX: 300
					}//s7
				console.log(d);
					RadarChart.draw("#chart1", d, mycfg);
					RadarChart.draw("#chart2", k, mycfg);
				});//s4
		//added 4
	}//s5
	else{
	d3.csv("mydata_dup.csv",function(data){//new The map() method creates a new array with the results of calling a function for every array element. 
			for(i=0;i<val3.length;i++)
			{
				k=data.filter(function(row) {
				 if (row["School Name"]==val_date && row["Date"]==val3[i]) 
				 		{
							return row;
						}
					});
					console.log(k);
					k.map(function(p){
				return [p["Indicator"],p["Indicators_orig"],+p["value"]];
				});//new});//NEW
				if(i<val3.length-1)
				d=k;
			};
			var mycfg = {
  					w: w,
  					h: h,	
  					maxValue: 1.0,
  					levels: 6,       
  					ExtraWidthX: 300
					}
				//console.log(d);
	RadarChart.draw("#chart1", d, mycfg);
	RadarChart.draw("#chart2", k, mycfg);
	});
	
	}
	//end
var RadarChart = {
  draw: function(id, d, options){
  var cfg = {
	 radius: 5,
	 w: 600,
	 h: 600,
	 factor: 1,
	 factorLegend: .85,
	 levels: 3,
	 maxValue: 0,
	 radians: 2 * Math.PI,
	 opacityArea: 0.5,
	 ToRight: 5,
	 TranslateX: 80,
	 TranslateY: 30,
	 ExtraWidthX: 100,
	 ExtraWidthY: 100,
	 color: d3.scale.category10()
	};
	
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){
		  cfg[i] = options[i];
		}
	  }
	}
	/*cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){
								//{return d3.max(i,function(o){
											return +i.value;
										})
							);*/
	var allAxis = (d.map(function(i, j){return i.Indicator}));
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format('%');
	d3.select(id).select("svg").remove();
	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;

	var tooltip;
	
	//Circular segments
	for(var j=0; j<cfg.levels-1; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data(allAxis)
	   .enter()
	   .append("svg:line")
	   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	   .attr("class", "line")
	   .style("stroke", "grey")
	   .style("stroke-opacity", "0.75")
	   .style("stroke-width", "0.3px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
	}

	//Text indicating at what % each level is
	for(var j=0; j<cfg.levels; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
	   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "10px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", "#737373")
	   .text(Format((j+1)*cfg.maxValue/cfg.levels));
	}
	
	series = 0;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.style("font-family", "sans-serif")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

 
	//d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(d,function(j,i){
		 dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		  ]);
		});
	  //dataValues.push(dataValues[0]);
	  //console.log(dataValues);
	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "2px")
					 .style("stroke", cfg.color(series))
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti]+","+d[pti]+" ";
						 }
						 return str;
					  })
					 .style("fill", function(j, i){return cfg.color(series)})
					 .style("fill-opacity", cfg.opacityArea)
					 .on('mouseover', function (d){
										z = "polygon."+d3.select(this).attr("class");
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", 0.1); 
										g.selectAll(z)
										 .transition(200)
										 .style("fill-opacity", .7);
									  })
					 .on('mouseout', function(){
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", cfg.opacityArea);
					 });
	  series++;
	//});
	series=0;


	//d.forEach(function(y, x){
	  g.selectAll(".nodes")
		.data(d).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value, 0)})
		.attr("cx", function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		]);
		return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
		})
		.attr("cy", function(j, i){
		  return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
		})
		.attr("data-id", function(j){return j.axis})
		.style("fill", cfg.color(series)).style("fill-opacity", .9)
		.on('mouseover', function (d){
					newX =  parseFloat(d3.select(this).attr('cx')) - 10;
					newY =  parseFloat(d3.select(this).attr('cy')) - 5;
					
					tooltip
						.attr('x', newX)
						.attr('y', newY)
						.text(Format(d.value))
						.text(d.Indicators_orig)
						.transition(200)
						.style('opacity', 1);
						
					z = "polygon."+d3.select(this).attr("class");
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", 0.1); 
					g.selectAll(z)
						.transition(200)
						.style("fill-opacity", .7);
				  })
		.on('mouseout', function(){
					tooltip
						.transition(200)
						.style('opacity', 0);
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", cfg.opacityArea);
				  })
		.append("svg:title")
		.text(function(j){return Math.max(j.value, 0)});

	  series++;
	//});
	//Tooltip
	tooltip = g.append('text')
			   .style('opacity', 0)
			   .style('font-family', 'sans-serif')
			   .style('font-size', '13px');
  }
};
}