/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
// <!-- https://www.w3schools.com/howto/howto_js_collapse_sidebar.asp -->
// Disabled ESLint as function wasn't being recognised as it wasn't defined
function openNav () {
  document.getElementById('mySidebar').style.width = '250px'
  document.getElementById('main').style.marginLeft = '250px'
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
// <!-- https://www.w3schools.com/howto/howto_js_collapse_sidebar.asp -->
function closeNav () {
  document.getElementById('mySidebar').style.width = '0'
  document.getElementById('main').style.marginLeft = '0'
}

const submitForm = document.getElementById('submitForm')
submitForm.addEventListener('submit', (e) => {
  e.preventDefault()
  swal(
    'Success',
    'You successfully submitted feedback!',
    'success'
  )
  const inputs = document.querySelectorAll('#fullName, #emailAddress, #userFeedback')
  inputs.forEach(input => {
    input.value = ''
  })
  const slider = document.getElementById('userRange')
  slider.value = 5
  output.innerHTML = 5
})

// https://www.w3schools.com/howto/howto_js_rangeslider.asp
const slider = document.getElementById('userRange')
const output = document.getElementById('demo')
output.innerHTML = slider.value // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value
}

// https://d3-graph-gallery.com/graph/line_filter.html
// Code for Filterable graph
const margin = { top: 30, right: 30, bottom: 30, left: 60 }
const width = 650 - margin.left - margin.right
const height = 450 - margin.top - margin.bottom

// append the svg object to the body of the page
const svg = d3.select('#my_dataviz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Read the data
d3.csv('CSV/CyberSal.csv').then(function (data) {
  // List of groups (here I have one group per column)
  const allGroup = new Set(data.map(d => d.work_year))

  // add the options to the button
  d3.select('#selectButton')
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d }) // text showed in the menu
    .attr('value', function (d) { return d }) // corresponding value returned by the button

  // A color scale: one color for each group
  const myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2)

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain([1, 12])
    .range([0, width])
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(12))

  // Add Y axis
  const y = d3.scaleLinear()
    // .domain([0, d3.max(data, function (d) { return +d.salary })])
    .domain([50000, 70000])
    .range([height, 0])
  svg.append('g')
    .call(d3.axisLeft(y))

  // Initialize line with first group of the list
  const line = svg
    .append('g')
    .append('path')
    .datum(data.filter(function (d) { return d.work_year === '1985' }))
    .attr('d', d3.line()
      .x(function (d) { return x(d.work_month) })
      .y(function (d) { return y(+d.salary) })
    )
    .attr('stroke', function (d) { return myColor('valueA') })
    .style('stroke-width', 4)
    .style('fill', 'none')

  // A function that update the chart
  function update (selectedGroup) {
    // Create new data with the selection?
    const dataFilter = data.filter(function (d) { return d.work_year === selectedGroup })

    // Give these new data to update line
    line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr('d', d3.line()
        .x(function (d) { return x(d.work_month) })
        .y(function (d) { return y(+d.salary) })
      )
      .attr('stroke', function (d) { return myColor(selectedGroup) })
  }

  // When the button is changed, run the updateChart function
  d3.select('#selectButton').on('change', function (event, d) {
    // recover the option that has been chosen
    const selectedOption = d3.select(this).property('value')
    // run the updateChart function with this selected option
    update(selectedOption)
  })
})

svg.append('text')
  .attr('class', 'x label')
  .attr('text-anchor', 'end')
  .attr('x', width)
  .attr('y', height + 30)
  .text("Years' Months")

svg.append('text')
  .attr('class', 'y label')
  .attr('text-anchor', 'end')
  .attr('y', 6)
  .attr('dy', width - 610)
  .attr('transform', 'rotate(-90)')
  .text('Salary (USD)')

// https://d3-graph-gallery.com/graph/scatter_tooltip.html
const margin2 = { top: 10, right: 30, bottom: 30, left: 60 }
const width2 = 650 - margin2.left - margin2.right
const height2 = 450 - margin2.top - margin2.bottom

// append the svg object to the body of the page
const svg2 = d3.select('#my_dataviz2')
  .append('svg')
  .attr('width', width2 + margin2.left + margin2.right)
  .attr('height', height2 + margin2.top + margin2.bottom)
  .append('g')
  .attr('transform',
          `translate(${margin2.left}, ${margin2.top})`)

// Read the data
d3.csv('CSV/DataTheft.csv').then(function (data) {
  // Add X axis
  const x = d3.scaleLinear()
    .domain([1990, 2022])
    .range([0, width2])
  svg2.append('g')
    .attr('transform', `translate(0, ${height2})`)
    .call(d3.axisBottom(x))

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([1000, 44000])
    .range([height2, 0])
  svg2.append('g')
    .call(d3.axisLeft(y))

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  const tooltip = d3.select('#my_dataviz2')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '1px')
    .style('border-radius', '5px')
    .style('padding', '10px')

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  const mouseover = function (event, d) {
    tooltip
      .style('opacity', 1)
  }

  const mousemove = function (event, d) {
    tooltip
      // .html(`The exact value of records stolen is: ${d.Records}<br>${d.Entity}`)
      .html(`${d.Entity} had ${d.Records} records stolen in ${d.Year}, they were obtained by ${d.Method}`)
      .style('left', (event.x) / 2 + 'px') // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style('top', (event.y) / 2 + 'px')
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  const mouseleave = function (event, d) {
    tooltip
      .transition()
      .duration(200)
      .style('opacity', 0)
  }

  // Add dots
  svg2.append('g')
    .selectAll('dot')
    .data(data.filter(function (d, i) { return i < 310 })) // the .filter part is just to keep a few dots on the chart, not all of them
    .enter()
    .append('circle')
    .attr('cx', function (d) { return x(d.Year) })
    .attr('cy', function (d) { return y(d.Records) })
    .attr('r', 7)
    .style('fill', '#f50202')
    .style('opacity', 0.3)
    .style('stroke', 'white')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave)
})

svg2.append('text')
  .attr('class', 'x label')
  .attr('text-anchor', 'end')
  .attr('x', width + 20)
  .attr('y', height + 47)
  .text('Year')

svg2.append('text')
  .attr('class', 'y label')
  .attr('text-anchor', 'end')
  .attr('y', 6)
  .attr('dy', width - 610)
  .attr('transform', 'rotate(-90)')
  .text('Records Stolen')

// https://d3-graph-gallery.com/graph/heatmap_style.html
// set the dimensions and margins of the graph
// set the dimensions and margins of the graph
const margin3 = { top: 30, right: 35, bottom: 30, left: 150 }
const width3 = 650 - margin3.left - margin3.right
const height3 = 450 - margin3.top - margin3.bottom

// append the svg object to the body of the page
const svg3 = d3.select('#my_dataviz3')
  .append('svg')
  .attr('width', width3 + margin3.left + margin3.right)
  .attr('height', height3 + margin3.top + margin3.bottom)
  .append('g')
  .attr('transform', `translate(${margin3.left}, ${margin3.top})`)

// Read the data
d3.csv('CSV/DataTheft.csv').then(function (data) {
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022']
  const myVars = Array.from(new Set(data.map(d => d.OrganizationType)))

  // Build X scales and axis:
  const x = d3.scaleBand()
    .range([0, width3])
    .domain(myGroups)
    .padding(0.05)
  svg3.append('g')
    .style('font-size', 15)
    .attr('transform', `translate(0, ${height3})`)
    .call(d3.axisBottom(x).tickSize(0))
    .select('.domain').remove()

  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([height3, 0])
    .domain(myVars)
    .padding(0.05)
  svg3.append('g')
    .style('font-size', 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select('.domain').remove()

  // Build color scale
  const myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1000, 40000])

  // create a tooltip
  const tooltip = d3.select('#my_dataviz3')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px')

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function (event, d) {
    tooltip
      .style('opacity', 1)
    d3.select(this)
      .style('stroke', 'black')
      .style('opacity', 1)
  }
  const mousemove = function (event, d) {
    tooltip
      .html(d.Records + ' records stolen in ' + d.Year + ' from ' + d.Entity + ', which is within the ' + d.OrganizationType + ' industry')
      .style('left', (event.x) / 2 + 'px')
      .style('top', (event.y) / 2 + 'px')
  }
  const mouseleave = function (event, d) {
    tooltip
      .style('opacity', 0)
    d3.select(this)
      .style('stroke', 'none')
      .style('opacity', 0.8)
  }

  // add the squares
  svg3.selectAll()
    .data(data, function (d) { return d.Year + ':' + d.OrganizationType })
    .join('rect')
    .attr('x', function (d) { return x(d.Year) })
    .attr('y', function (d) { return y(d.OrganizationType) })
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .style('fill', function (d) { return myColor(d.Records) })
    .style('stroke-width', 4)
    .style('stroke', 'none')
    .style('opacity', 0.8)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave)
})
