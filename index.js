

const tickBase = function(){
     this.del=function(i){
         delete functions[i];
     }
     this.add=function(fun){
         let id = 'a'+serial.toString()+'a';
         functions[id] = fun;
         serial++;
     }
     let Tserial = 0;
     let Tfunctions = [];
     let Thistory = [];
     let Tlast = {};
     let Tticks = 0;
     let TtickTimes = 100;
     const tick=function(){ // the performance is a priority, so no separated OOP in here
         //reset last
         Tlast = {
             start:(+new Date),
             end:0
         }
         //increase serial
         Tticks++;
         // start time
         for(let i in Tfunctions)
             Tfunctions[i[();

         //end time
         last.end = (+new Date)
         // add to history 
         Thistory.push({
             start:parseInt(Tlast.start),
             end:parseInt(Tlast.end)
         });
         setTimeout(
             Ttick,
             (TtickTimes-Math.abs(Tlast.end-Tlast.start))
         );
     }
}


exports.tick = new tickBase();




