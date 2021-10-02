/*
 *  @Soldy\tickrc\2021.02.07\GPL3
 */
'use strict';

const $setup = new (require('setuprc')).base({
    'tick_time' : {
        'type'    : 'integer',
        'min'     : 1,
        'max'     : 200000,
        'default' : 1000
    },
    'changeable' : {
        'type'    : 'boolean',
        'default' : true
    },
    'error_log' : {
        'type'    : 'boolean',
        'default' : false
    },
    'error_throw' : {
        'type'    : 'boolean',
        'default' : false
    },
    'history' : {
        'type'    : 'boolean',
        'default' : false
    },

});

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
        return _tDel(i);
    };
    /* @param {function}
     * @public
     * @return {string}
    */
    this.add=function(fun){
        return _tAdd(fun);
    };
    /*
     * @public
     * @return {bool}
    */
    this.start=function(){
        return _tStart();
    };
    /*
     * @public 
     * @return {bool}
    */
    this.stop=function(){
        return _tStop();
    };
    /*
     * @param {string}
     * @public 
     * @return {bool}
    */
    this.set=function(type, value){
        return _tSet(type,value);
    };
    /*
     *
     * setup init 
     *
     */
    /*
     * tickable function serial counter
     * @private
     * @var {integer}
    */
    let _t_serial = 0;
    /*
     * stop signal. 
     * the next signal will stop the ticking.
     * @private
     * @var {boolean}
     *
    */
    let _t_stop = false;
    /* running indicator. true if the ticking are running
     * @private
     * @var {boolean}
     */
    let _t_running = false;
    /*
     * function dictonary.
     * @private
     * @var {object}
     */
    let _t_functions = {};
    /*
     * ticking history
     * @private
     * @var {object}
     */
    let _t_history = [];
    /*
     * error log
     * @private
     * @var {array}
     *
     */
    let _t_errors = [];
    /*
     * last event time log
     * @private
     * @var {object}
     */
    let _t_last = {};
    /*
     * tick counter
     * @private
     * @var {integer}
     */
    let _t_ticks = 0;
    /*
     * tick timing
     * @private
     * @var {integer}
     */
    let _t_tick_time = 1000;
    /*
     * tick time out
     * @private
     * @var {integer}
     */
    let _t_timeout ;
    /*
     * tick error log booster
     * @private
     * @var {boolean}
     */
    let _t_booster_error_log = false;
    /*
     * tick error log throw
     * @private
     * @var {boolean}
     */
    let _t_booster_error_throw = false;
    /*
     * @private
     * @var {boolean}
    */
    let _t_booster_history = false;
    /*
     * @param {string}
     * @private
     * @return {bool}
    */
    const _tDel=function(i){
        if(typeof _t_function[i] === 'undefined')
            return false;
        delete _t_functions[i];
        return true;
    };
    /* @param {function}
     * @private
     * @return {string}
    */
    const _tAdd=function(fun){
        const id = 'a'+_t_serial.toString()+'a';
        _t_functions[id] = fun;
        _t_serial++;
        return id;
    };
    /*
     * @private
     * @return {bool}
    */
    const _tStart=function(){
        if(_t_running)
            return false;
        _t_running = true;
        _t_stop = false;
        _tTick();
        return true;
    };
    /*
     * @private
     * @return {bool}
    */
    const _tStop=function(){
        if(_t_stop === false)
            return _t_stop = true;
        if(_t_running === true)
            return _t_running = false;
        return true;
    };
    /*
     * @param {string}
     * @private
     * @return {bool}
    */
    const _tSet=function(type, value){
        if(!$setup.get('changeable'))
             return false;
        let out = $setup.set(
            type,
            value
        );
        if(out)
            _booster();
        return out;
    };
    /*
     * @param {string}
     * @private
    */
    const _tError = function(e){
         if(_t_booster_error_log)
              _t_errors.push(e);
         if(_t_booster_error_throw)
              throw e;
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
        if(_t_booster_history)
            _t_history.push({
                start:parseInt(_t_last.start),
                end:parseInt(_t_last.end)
            });
        _t_timeout = setTimeout(
            _tTick,
            (
                $setup.get('tick_time') - Math.abs(
                    _t_last.end - _t_last.start
                )
            )
        );
    };
    /*
     * @param {object}
     * @private
    */
    const _reSetup = function(setup_in){
         if(typeof setup_in === 'undefined')
             return false;
         $setup.setup(setup_in);
         _booster();
    }
    /*
     * @private
    */
    const _booster = function(){
         _t_tick_time = $setup.get('tick_time');
         _t_booster_error_log = $setup.get('error_log');
         _t_booster_error_throw = $setup.get('error_throw');
         _t_booster_history = $setup.get('history');

    }
    //init
    _reSetup(setup_in);
};


exports.base = TickBase;




