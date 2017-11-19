console.log('6.2');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;


//Import data and parse
d3.csv('../data/N=1984.csv',parse, dataloaded);

function dataloaded(err, data) {

  data = data.filter(function(d){
    return d.worstCrime == 'Murder'
  })
  
  circle = d3.select('.canvas')
    .selectAll('.exoneree')
    .data(data)
    .enter()
    .append('div')
    .attr('class','exoneree');

  circle
    .on('mouseenter',function (d){
        d3.select(this)
          .transition().duration(700)
          .style('background-color','#009FB7')
          .style('width','60px')
          .style('height','60px');

       d3.select(this)
         .append('p')
         .attr('class','name')
         .html(function (d) { return d.firstName;})
         .style('opacity',0)
         .transition().duration(700)
         .style('opacity',1);

    })
    .on('mouseleave',function (d){
        d3.select(this)
          .transition().duration(500)
          .style('background-color','#272727')
          .style('width','30px')
          .style('height','30px');;
        
        d3.select(this)
         .select('.name')
         .remove();
    });


  time = d3.nest().key(d=> d.exonerated)
    .sortKeys(d3.ascending)
    .entries(data);

  d3.select('.timeplot')
    .selectAll('.exo-time')
    .data(time)
    .enter()
    .append('div')
    .attr('class','exo-time')
    .style('width','3.3%')
    .style('height','200px')
    .append('p')
    .attr('class','exo-year')
    .html(d => d.key)
      .selectAll('.exo-time-each')
      .data(function(d){return d.values})
      .enter()
      .append('div')
      .attr('class','exo-time-each')
      .style('width','80%')
      .style('height','7px')
      .style('background-color','#009FB7')
      .style('margin-top','2px')
      .on('mouseenter',function(d){
         
         d3.selectAll('circle').remove();
      
        d3.selectAll('line').remove();

         d3.select(this)
           .style('opacity',1)
         
         drawTime(d);

      })
      .on('mouseleave',function(d){
         d3.select(this)
           .style('opacity',0.5)
      });

  timeline = d3.select('.timeline')
     .append('svg')
     .attr('width','800px')
     .attr('height','150px')
     .append('g')
     // .attr('transform','translate(50,50)')

  year = [];
  yInit = 1950;

  for(i=0; i<70; i++){
    yInit = yInit+1;
    year.push(yInit)
  }

  console.log(year);

  scaleX = d3.scaleBand()
     .domain(year)
     .range([20,750]);

  axisX = d3.axisBottom()
     .scale(scaleX);


  function drawTime(d){
     // console.log()

     //// year occured
     timeline.append('circle')
         .attr('cx',scaleX(d.occurred))
         .attr('cy','10px')
         .attr('r',5)
         .style('fill','#009FB7')
         .style('stroke-width','1px')
         .style('stroke','#009FB7');

     //year convicted
     timeline.append('circle')
         .attr('cx',scaleX(d.convicted))
         .attr('cy','10')
         .attr('r',5)
         .style('fill','#009FB7')
         .style('stroke-width','1px')
         .style('stroke','#009FB7');
     
     //year exonerated
     timeline.append('circle')
         .attr('cx',scaleX(d.exonerated))
         .attr('cy','10')
         .attr('r',5)
         .style('fill','#009FB7')
         .style('stroke-width','1px')
         .style('stroke','#009FB7');

     //duration1
     timeline.append('line')
         .attr('x1',scaleX(d.occurred))
         .attr('x2',scaleX(d.convicted))
         .attr('y1','10')
         .attr('y2','10')
         .style('stroke-width','2px')
         .style('stroke','#009FB7');

     //duration2
     timeline.append('line')
         .attr('x1',scaleX(d.convicted))
         .attr('x2',scaleX(d.exonerated))
         .attr('y1','10')
         .attr('y2','10')
         .style('stroke-width','2px')
         .style('stroke','#009FB7');

     //Axis X
     timeline.append('g')
         .attr('transform','translate(0,50)')
         .call(axisX);
  
  }

  



}//dataloaded

 
function parse(d) {
  return {
    lastName:d['Last Name'],
    firstName:d['First Name'],
    age:d['Age'],
    race:d['Race'],
    sex:d['Sex'],
    state:d['State'],
    county:d['County'],
    worstCrime:d['Worst Crime Display'],
    occurred:+d['Occurred'],
    convicted:+d['Convicted'],
    exonerated:+d['Exonerated'],
  }

}



 
