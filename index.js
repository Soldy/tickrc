/*
 *  @Soldy\tickrc\2021.02.07\GPL3
 */
'use strict';

/*
 * @prototype
 */

const tickBase = function(){
    let Tserial = 0;
    let Tfunctions = {};
    let Thistory = [];
    let Tlast = {};
    let Tticks = 0;
    let TtickTimes = 100;
    /*
     * @param {string}
     * @public 
     * @return {bool}
    */
    this.del=function(i){
        if(typeof Tfunction[i] === 'undefined')
            return false;
        delete Tfunctions[i]; // its delet the original function this is the goal at now // may latter can change
        return true;
    };
    /* @param {function}
     * @public
     * @return {string}
    */
    this.add=function(fun){
        let id = 'a'+Tserial.toString()+'a';
        Tfunctions[id] = fun;
        Tserial++;
        return id;
    };
    /*
     * @param {string}
     * @private
    */
    const Terror = function(e){
        console.log(e);
    };
    /*
     * @private
    */
    const Ttick=function(){ // the performance is a priority, so no separated OOP in here
        //reset last
        Tlast = {
            start:Date.now(),
            end:0
        };
        //increase serial
        Tticks++;
        // start time
        for(let i in Tfunctions)
            try{
                Tfunctions[i]();
            }catch(e){
                Terror(e);
            }

        //end time
        Tlast.end = Date.now();
        // add to history 
        Thistory.push({
            start:parseInt(Tlast.start),
            end:parseInt(Tlast.end)
        });
        setTimeout(
            Ttick,
            (TtickTimes-Math.abs(Tlast.end-Tlast.start))
        );
    };
};


exports.base = tickBase;




