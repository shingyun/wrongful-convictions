function TimelineForEach(){

    function exports(d, selection){

         console.log(d);
          //occurred text
         selection.append('text')
             .attr('class','notes')
             .attr('x',scaleX(d.occurred))
             .attr('y',y_base-60)
             .text('Occurred  '+d.occurred)

         //convicted text
         selection.append('text')
            .attr('class','notes')
             .attr('x',scaleX(d.convicted))
             .attr('y',y_base-45)
             .text('Convicted  '+d.convicted)

         //exonerated text
         selection.append('text')
             .attr('class','notes')
             .attr('x',scaleX(d.exonerated))
             .attr('y',y_base-30)
             .text('Exonerated  '+d.exonerated)

         if(d.age == 0){
          
           selection
             .append('text')
             .attr('class','age-notes')
             .text('age unknown')
             .attr('x',scaleX(d.occurred))
             .attr('y',y_base+30);
           
           selection.append('line')
             .attr('class','re-line')
             .attr('x1',scaleX(d.occurred))
             .attr('x2',scaleX(d.occurred))
             .attr('y1',y_base-60)
             .attr('y2',y_base);

           selection.append('line')
             .attr('class','re-line')
             .attr('x1',scaleX(d.convicted))
             .attr('x2',scaleX(d.convicted))
             .attr('y1',y_base-40)
             .attr('y2',y_base);

           selection.append('line')
             .attr('class','re-line')
             .attr('x1',scaleX(d.exonerated))
             .attr('x2',scaleX(d.exonerated))
             .attr('y1',y_base-25)
             .attr('y2',y_base);

         } else {
               //occurred age text
             selection.append('text')
             .attr('class','age-notes')
             .attr('x',scaleX(d.occurred))
             .attr('y',y_base+70)
             .text(d.age +' years old')

            //convicted age text
             selection.append('text')
            .attr('class','age-notes')
             .attr('x',scaleX(d.convicted))
             .attr('y',y_base+55)
             .text((d.age+ (d.convicted-d.occurred))+' years old')

            //exonerated age text
            selection.append('text')
             .attr('class','age-notes')
             .attr('x',scaleX(d.exonerated))
             .attr('y',y_base+40)
             .text((d.age+ (d.exonerated-d.convicted))+' years old')

                   //reference line1
            selection.append('line')
             .attr('class','re-line')
             .attr('x1',scaleX(d.occurred))
             .attr('x2',scaleX(d.occurred))
             .attr('y1',y_base-60)
             .attr('y2',y_base+60);

            //reference line2
            selection.append('line')
             .attr('class','re-line')
             .attr('x1',scaleX(d.convicted))
             .attr('x2',scaleX(d.convicted))
             .attr('y1',y_base-40)
             .attr('y2',y_base+40);

            //reference line3
            selection.append('line')
             .attr('class','re-line')
             .attr('x1',scaleX(d.exonerated))
             .attr('x2',scaleX(d.exonerated))
             .attr('y1',y_base-25)
             .attr('y2',y_base+25);
         }

         //duration1 line
         selection.append('line')
             .attr('class','timeline-each')
             .attr('x1',scaleX(d.occurred))
             .attr('x2',scaleX(d.occurred))
             .transition().duration(1000)
             .attr('x2',scaleX(d.convicted))
             .attr('y1','70')
             .attr('y2','70')
             .style('stroke-dasharray', ('1, 0.5'));

         //duration2 line
         selection.append('line')
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

    // exports.selectMeasure = function(_mea){
    // 	if(!arguments.length) return _measure;
    // 	_measure = _mea;
    // 	return this;
    // }

    // exports.geoData = function(_geo){
    //     if(!arguments.length) return _geoData;
    // 	_geoData = _geo;
    // 	return this;
    // }

    // exports.mapData = function(_map){
    // 	if(!arguments.length) return _mapData;
    // 	_mapData = _map;
    // 	return this;
    // }

    // exports.measureScale = function(_sca){
    // 	if(!arguments.length) return _meaScale;
    // 	_meaScale = _sca;
    // 	return this;
    // }
    
    return exports;

}