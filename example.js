const tick  = new (require('./index.js')).base({
    'tick_time' :100
});

let test = 0;
tick.add(
    ()=>{
        console.log(test);
        test ++;
        if(test >10 )
            process.exit();
    }
);
tick.run();
tick.set('tick_time',1000);
