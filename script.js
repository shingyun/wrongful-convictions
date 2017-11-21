console.log('6.2');

var y_base = 70;

timeline = d3.select('.timeline')
   .append('svg')
   .attr('width','1000px')
   .attr('height','200px')
   .append('g')


//Import data and parse
d3.csv('data/N=1984.csv',parse, dataloaded);

function dataloaded(err, data) {

  data = data.filter(function(d){
    return d.worstCrime == 'Murder'
  })
  
  data.sort(function(a,b){
    return a.age -b.age
  })

  console.log(data)

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
      .attr('class',function(d){
        return d.firstName+d.occurred;
      })
      .classed('exo-time-each',true)
      .style('width','80%')
      .style('height','6px')
      .style('background-color','#009FB7')
      .style('margin-top','2px')
      .on('mouseenter',function(d){
         
         d3.selectAll('circle').remove();
         d3.selectAll('.timeline-each').remove();
         d3.selectAll('.notes').remove();
         d3.selectAll('.age-notes').remove();
         d3.selectAll('.re-line').remove();
         d3.selectAll('.exo-time-each').style('opacity',0.35)
         d3.select(this)
           .style('opacity',1)

         drawTime(d)
         // TimelineForEach(d, timeline);
      });


  year = [];
  yInit = 1949;

  for(i=0; i<71; i++){
    yInit = yInit+1;
    year.push(yInit)
  }


  scaleX = d3.scaleBand()
     .domain(year)
     .range([35,890]);

  axisX = d3.axisBottom()
     .tickValues([1950,2020])
     .scale(scaleX);
  
  //Axis X
  timeline.append('g') 
     .attr('class','axis-x')
     .attr('transform','translate(0,'+y_base+')')
     .call(axisX);


  function drawTime(d){

     //occurred text
     timeline.append('text')
         .attr('class','notes')
         .attr('x',scaleX(d.occurred))
         .attr('y',y_base-60)
         .text('Occurred  '+d.occurred)

     //convicted text
     timeline.append('text')
        .attr('class','notes')
         .attr('x',scaleX(d.convicted))
         .attr('y',y_base-45)
         .text('Convicted  '+d.convicted)

     //exonerated text
     timeline.append('text')
         .attr('class','notes')
         .attr('id','note-exoneration')
         .attr('x',scaleX(d.exonerated))
         .attr('y',y_base-30)
         .text('Exonerated  '+d.exonerated)

     if(d.age == 0){
      
       timeline
         .append('text')
         .attr('class','age-notes')
         .text('age unknown')
         .attr('x',scaleX(d.occurred))
         .attr('y',y_base+30);
       
       timeline.append('line')
         .attr('class','re-line')
         .attr('x1',scaleX(d.occurred))
         .attr('x2',scaleX(d.occurred))
         .attr('y1',y_base-60)
         .attr('y2',y_base);

       timeline.append('line')
         .attr('class','re-line')
         .attr('x1',scaleX(d.convicted))
         .attr('x2',scaleX(d.convicted))
         .attr('y1',y_base-40)
         .attr('y2',y_base);

       timeline.append('line')
         .attr('class','re-line')
         .attr('x1',scaleX(d.exonerated))
         .attr('x2',scaleX(d.exonerated))
         .attr('y1',y_base-25)
         .attr('y2',y_base);

     } else {
           //occurred age text
         timeline.append('text')
         .attr('class','age-notes')
         .attr('x',scaleX(d.occurred))
         .attr('y',y_base+70)
         .text(d.age +' years old')

        //convicted age text
         timeline.append('text')
        .attr('class','age-notes')
         .attr('x',scaleX(d.convicted))
         .attr('y',y_base+55)
         .text((d.age+ (d.convicted-d.occurred))+' years old')

        //exonerated age text
        timeline.append('text')
         .attr('class','age-notes')
         .attr('id','age-note-exoneration')
         .attr('x',scaleX(d.exonerated))
         .attr('y',y_base+40)
         .text((d.age+ (d.exonerated-d.convicted))+' years old')

        //reference line1
        timeline.append('line')
         .attr('class','re-line')
         .attr('x1',scaleX(d.occurred))
         .attr('x2',scaleX(d.occurred))
         .attr('y1',y_base-60)
         .attr('y2',y_base+60);

        //reference line2
        timeline.append('line')
         .attr('class','re-line')
         .attr('x1',scaleX(d.convicted))
         .attr('x2',scaleX(d.convicted))
         .attr('y1',y_base-40)
         .attr('y2',y_base+40);

        //reference line3
        timeline.append('line')
         .attr('class','re-line')
         .attr('id','re-exoneration')
         .attr('x1',scaleX(d.exonerated))
         .attr('x2',scaleX(d.exonerated))
         .attr('y1',y_base-25)
         .attr('y2',y_base+25);
     }

     //duration1 line
     timeline.append('line')
         .attr('class','timeline-each')
         .attr('x1',scaleX(d.occurred))
         .attr('x2',scaleX(d.occurred))
         .transition().duration(1000)
         .attr('x2',scaleX(d.convicted))
         .attr('y1','70')
         .attr('y2','70')
         .style('stroke-dasharray', ('1, 0.5'));

     //duration2 line
     timeline.append('line')
         .attr('class','timeline-each')
         .attr('x1',scaleX(d.convicted))
         .attr('x2',scaleX(d.convicted))
         .transition().duration(1000)
         .attr('x2',scaleX(d.exonerated))
         .attr('y1','70')
         .attr('y2','70');

     //Exoneree Info
     var du2 = d.exonerated - d.convicted, 
         gender;

     if(d.sex == 'Female'){
        gender = 'her';
     } else{
        gender = 'his';
     }
  
     d3.select('.name')
       .html(d.firstName + ' ' + d.lastName)
     d3.select('.tag')
       .html(d.sex + ', ' + d.race)
     d3.select('.des')
       .html(
        'The crime happened in '+ d.occurred + 
        ', and was wrongly convicted in '+ d.convicted + '. '+
        d.firstName + ' had been waiting for '+ du2 + 
        ' years for '+ gender +' innocence.')
  }
  
  data.sort(function(a,b){return a.exonerated - b.exonerated})
  d3.select('.David1984').style('opacity',1);
  // TimelineForEach(data[0],timeline);  
  drawTime(data[0])


}//dataloaded

 
function parse(d) {
  return {
    lastName:d['Last Name'],
    firstName:d['First Name'],
    age:+d['Age'],
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



 
