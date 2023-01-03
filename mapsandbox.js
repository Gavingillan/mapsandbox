d3.json('../uscounties.json').then(function(bb) {
    let width = 1000, height = 550;
    let projection = d3.geoAlbersUsa().scale(1100);
    /* projection.fitSize([width, height], bb);
    projection.fitExtent([[20, 20], [width, height]], bb); */
    let geoGenerator = d3.geoPath().projection(projection);
    
    let svg = d3.select("#svg").style("width", width).style("height", height);
    
    var b = geoGenerator.bounds('uscounties.json');
    console.log(b);

    /* projection
    .scale(s)
    .translate(t); */

    function logButtons(e) {
        console.log(e.buttons);
    }
    
    let cenx;
    let ceny;

    svg.append('g').selectAll('path')
        .data(bb.features)
        
        .join('path')
        .attr('d', geoGenerator)
        .attr('fill', '#F0ECE3')
        .attr('stroke', '#C7B198')
        //.attr("geoid", bb.features[0].geometry.coordinates)
        .on("mouseover", function(d) {
            //logButtons(d);
        })
        .on("click", function(d) {
            //logButtons(d);

            console.log(`d is ${d}`)
            
            d3.select(this).transition().style("fill", "#FF0000");
            cenx = geoGenerator.centroid(d)[0].toFixed(3);
            ceny = geoGenerator.centroid(d)[1].toFixed(3);
            clearMap();
            tstart = performance.now()
            let count = traceDistances(cenx, ceny);
            tend = performance.now()
            console.log(`The paint of ${count} elements took ${tend - tstart}ms.`)
        });
    
    var counties = svg.selectAll('path');

    document.getElementById("clearButton").onclick = function(d) {
        clearMap();
    }

    function traceDistances(cenx, ceny) {
        let count = 0;
        counties.each(function (d, i) {
            countyx = geoGenerator.centroid(d)[0];
            countyy = geoGenerator.centroid(d)[1];
            max_range = 80
            if (Math.abs(cenx - countyx) <= max_range && Math.abs(ceny - countyy) <= max_range) {
                count++;
                dist = (255-Math.sqrt((cenx - countyx)**2 + (ceny - countyy)**2)).toString(16);
                dist = dist.substring(0,dist.indexOf("."))
                
                console.log(dist)

                d3.select(this).style('fill', `#${dist}a8b0`);  
            }
        });
        return count;
    }
    
    function clearMap() {
        counties.style('fill', '#F0ECE3');
    }
});

