const tick  = new (require('./index.js')).base({
    'tick_time' :100
});

let test = 0;
tick.add(
    ()=>{
        console.log(test);
        test ++;
        console.log(
            tick.set(
               'tick_time',
               2**test
            )
        );
        if(test > 8)
            tick.set(
                'changeable',
                false
            );
        if(test >10 )
           tick.stop();
    }
);
tick.start();
