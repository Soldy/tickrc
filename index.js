/*
 *  @Soldy\tickrc\2021.02.07\GPL3
 */
'use strict';

const setupBase = (require('setuprc')).base;
/*
 * @prototype
 */
const TickBase = function(setup_in){
    /*
     * @param {string}
     * @public 
     * @return {bool}
    */
    this.del=function(i){
        if(typeof _t_function[i] === 'undefined')
            return false;
        delete _t_functions[i];
        return true;
    };
    /* @param {function}
     * @public
     * @return {string}
    */
    this.add=function(fun){
        let id = 'a'+_t_serial.toString()+'a';
        _t_functions[id] = fun;
        _t_serial++;
        return id;
    };
    /*
     * @public
     * @return {bool}
    */
    this.start=function(){
        if(_t_running)
            return false;
        _t_running = true;
        _t_stop = false;
        _tTick();
        return true;
    };
    /*
     * @public 
     * @return {bool}
    */
    this.stop=function(){
        if(_t_stop === true)
            return true;
        if(_t_running === false)
            return false;
        _t_stop = true;
        return true;
    };
    /*
     * @param {string}
     * @public 
     * @return {bool}
    */
    this.set=function(type, value){
        if(!_setup.get('changeable'))
             return false;
        let out = _setup.set(
            type,
            value
        );
        if(out)
            _booster();
        return out;
    };
    /* @param {function}
     * @public
     * @return {string}
    */

    let _setup = new setupBase({
        'tick_time':{
            'type'    : 'integer',
            'min'     : 1,
            'max'     : 200000,
            'default' : 1000
        },
        'changeable': {
             'type'    : 'boolean',
             'default' : true
        }
    });
    /*
     *
     * setup init 
     *
     */
    let _t_serial = 0;
    let _t_stop = false;
    let _t_running = false;
    let _t_functions = {};
    let _t_history = [];
    let _t_last = {};
    let _t_ticks = 0;
    let _t_tick_time = _setup.get('tick_time');
    let _t_timeout ;
    /*
     * @param {string}
     * @private
    */
    const _tStop = function(e){
        _t_stop = false;
        _t_running = false;

    };
    /*
     * @param {string}
     * @private
    */
    const _tError = function(e){
        console.log(e);
    };
    /*
     * @private
    */
    const _tTick=function(){ // the performance is a priority, so no separated OOP in here
        if(_t_stop)
            return _tStop();
        //reset last
        _t_last = {
            start:Date.now(),
            end:0
        };
        //increase serial
        _t_ticks++;
        // start time
        for(let i in _t_functions)
            try{
                _t_functions[i]();
            }catch(e){
                _tError(e);
            }

        //end time
        _t_last.end = Date.now();
        // add to history 
        _t_history.push({
            start:parseInt(_t_last.start),
            end:parseInt(_t_last.end)
        });
        _t_timeout = setTimeout(
            _tTick,
            (   
                _t_tick_time - Math.abs(
                    _t_last.end - _t_last.start
                )
            )
        );
    };
    const _reSetup = function(setup_in){
         if(typeof setup_in === 'undefined')
             return false;
         _setup.setup(setup_in);
         _booster();
    }
    const _booster = function(){
         _t_tick_time = _setup.get('tick_time');

    }
    _reSetup(setup_in);
};


exports.base = TickBase;




