
const margin = ({top: 40, right: 40, bottom: 40, left: 40});

const width = 700 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;
const svg = d3.select('.chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
    // console.log(data);
    const xScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d=>d.Income)])
                    .range([2, width+2]);
    // console.log(xScale(d3.max(data, d=>d.Income)));

    const yScale = d3.scaleLinear()
                    .domain([d3.max(data, d=>d.LifeExpectancy), 0])
                    .range([0, height]);
    // console.log(yScale(d3.max(data, d=>d.LifeExpectancy)));

    const color = d3.scaleOrdinal().domain(data)
                    .range(d3.schemeTableau10);
    const population = d3.scaleSqrt()
                        .domain([0, d3.max(data, d=>d.Population)])
                        .range([0, 20]);

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr('r', d=>population(d.Population))
        .attr('fill', d=>color(d.Region))
        .on('mouseenter', function(event, d) {
            let country = d.Country;
            let region = d.Region;
            let population = d3.format(',.2r')(d.Population);
            let income = d3.format(',.2r')(d.Income);
            let lifeExpectancy = d3.format('.0f')(d.LifeExpectancy);

            const pos = d3.pointer(event, window);
            d3.select('.tooltip')
                .style('left', pos[0]+'px')
                .style('top', pos[1]+'px')
                .style('position', 'fixed')
                .style('display', 'block')
                .style('color', 'white')
                .style('background-color', 'black')
                .style('padding', '10px')
                .html(
                    'Country: ' + country + '<br/>' +
                    'Region: ' + region + '<br/>' +
                    'Population: ' + population + '<br/>' +
                    'Income: ' + income + '<br/>' +
                    'Life Expectancy: ' + lifeExpectancy
                );
        })
        .on('mouseleave', function(event, d) {
            d3.select('.tooltip')
                .style('display', 'none');
        });

    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(5, 's');

    const yAxis = d3.axisLeft()
                    .scale(yScale);
                    // .ticks(50, 's');

    svg.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + (height) + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'axis y-axis')
        .attr('transform', 'translate(0, ${height})')
        .call(yAxis);

    svg.append('text')
        .attr('x', width - margin.right)
        .attr('y', height + margin.top)
        .text('Income');

    svg.append('text')
        .attr('x', -30)
        .attr('y', height/2 - margin.top)
        .text('Life Expectancy')
        .attr('writing-mode', 'vertical-lr');

        const regions = [... new Set(data.map(data=>data.Region))]

        const svgLegend = svg.append('g')
        .attr('class', 'legend')
        .attr('x', '300px')
        .attr('y','400px')
        .attr('height', 100)
        .attr('width', 100)
   
        
    svgLegend.selectAll('.legendBlocks')
        .data(regions)
        .enter()
        .append('rect')
          .attr('fill', d=>color(d)) 
          .attr('x', 400)
          .attr('y', (d,i)=>(i+1)*25+220+210)
          .attr('height', '20px')
          .attr('width','20px')
        
    svgLegend.selectAll('.legendText')
        .data(regions)
        .enter()
        .append('text')
          .attr('x', 430)
          .attr('y', (d,i)=>(i+1)*25+235+210)
          .text(d=>d)
});