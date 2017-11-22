var y_base = 70;

var screenH = $(window).height();
$('.cover').css('min-height',screenH).css('background-color','#181818');
$('.duration').css('min-height',screenH).css('background-color','#181818');
$('.time').css('min-height',screenH).css('background-color','#181818');

//Click and change views
d3.selectAll('.navigation')
  .on('mouseenter',function(){
     d3.select(this).style('opacity',0.6);
  })
  .on('mouseleave',function(){
    d3.select(this).style('opacity',1);
  })

d3.select('.nav1')
  .on('click',function(){
    d3.select(this).style('opacity',1);
    $('html,body').animate({
        scrollTop: $(".duration").offset().top},
        'slow');
  })

d3.select('.nav2')
  .on('click',function(){
    d3.select(this).style('opacity',1);
    $('html,body').animate({
        scrollTop: $(".time").offset().top},
        'slow');
  })

duration = d3.select('.duration-plot')
   .append('svg')
   .attr('width','1000px')
   .attr('height','350px')
   .append('g')

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
  

  //CAlCULATE 
  var du_arr = [], du_each = 0;
  
  data.forEach(function(d,i){
      du_each = d.exonerated - d.occurred;
      du_arr.push(du_each);
  })
 
  console.log('du_arr',du_arr)
  var du_total = 0;
  du_arr.forEach(function(d){
      du_total += d;
  })

  var du_ave = du_total/du_arr.length,
      du_max = Math.max(...du_arr),
      du_min = Math.min(...du_arr)
   
  // console.log('du_ave',du_ave);
  // console.log('du_max',du_max);
  // console.log('du_min',du_min);

  //SIMPLE DURATION CHART
  scaleDuration = d3.scaleLinear()
      .domain([0,du_max+1])
      .range([35,700])

  scaleAge = d3.scaleLinear()
      .domain([0,70])
      .range([280,5])

  axisDuration = d3.axisBottom()
      .scale(scaleDuration);

  axisAge = d3.axisLeft()
      .tickValues([0,10,20,30,40,50,60,70])
      .scale(scaleAge)

  //LABELS
  duration.append('text')
      .attr('class','duration-label')
      .attr('transform','translate(5,15)')
      .text('Age of the murder occurred')

  duration.append('text')
      .attr('class','duration-label')
      .attr('transform','translate(225,340)')
      .text('Years from murder occurred to exoneration')

  //AXIS DURATION
  duration.append('g')
     .attr('class','axis axis-duration')
     .attr('transform','translate(0,305)')
     .call(axisDuration);

  duration.append('g')
     .attr('class','axis axis-age')
     .attr('transform','translate(25,25)')
     .call(axisAge);
  
  //AGE AND DURATION GRAPHIC
  duration.append('g')
     .attr('class','duration-wrap')
     .attr('transform','translate(0,25)')
     .selectAll('.duration-rect')
     .data(data)
     .enter()
     .append('rect')
     .attr('class','duration-rect')
     .attr('width',12)
     .attr('height',6)
     .attr('x',d => scaleDuration(d.exonerated-d.occurred)-6)
     .attr('y',function(d){
        if(d.age === 0){
          return -2000;
        } else {
          return scaleAge(d.age)-3
        }
     })
     .style('fill','#009FB7')
     .style('opacity',0.35)
     .on('mouseover',function(d){
        // console.log(d.age,d.exonerated-d.occurred)
        d3.select(this)
          .style('fill','#C1AB42')
          .style('opacity',1);

        //Horizontal line
        duration.append('line')
          .attr('transform','translate(0,25)')
          .attr('x1',25)
          .attr('x2',scaleDuration(d.exonerated-d.occurred))
          .attr('y1',scaleAge(d.age))
          .attr('y2',scaleAge(d.age))
          .style('stroke-width','1px')
          .style('stroke','#C1AB42')

        //Vertical line
        duration.append('line')
          .attr('transform','translate(0,25)')
          .attr('x1',scaleDuration(d.exonerated-d.occurred))
          .attr('x2',scaleDuration(d.exonerated-d.occurred))
          .attr('y2',scaleAge(d.age))
          .attr('y1',280)
          .style('stroke-width','1px')
          .style('stroke','#C1AB42')
     })
     .on('mouseleave',function(d){
        d3.select(this)
          .style('fill','#009FB7')
          .style('opacity',0.35);

        d3.select('.duration')
          .selectAll('line')
          .remove();
     });


  //NEST THE DATA FOR TIMELINE
  time = d3.nest().key(d=> d.exonerated)
    .sortKeys(d3.ascending)
    .entries(data);

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

  //EXONERATION BY EXONERATED TIME
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

         d3.selectAll('.timeline-each').remove();
         d3.selectAll('.notes').remove();
         d3.selectAll('.age-notes').remove();
         d3.selectAll('.re-line').remove();
         d3.selectAll('.exo-time-each')
           .style('opacity',0.35)
           .style('background-color','#009FB7');
         d3.select(this)
           .style('background-color','#C1AB42')
           .style('opacity',1)

         drawTime(d)
         // TimelineForEach(d, timeline);
      });
  
  //Axis X
  timeline.append('g') 
     .attr('class','axis axis-x')
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
  d3.select('.David1984').style('background-color','#C1AB42').style('opacity',1);
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



 
