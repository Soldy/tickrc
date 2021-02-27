# Ultra simple tick engine.


## install

```bashrc
  npm i tickrc

```

## init

```javascript
const tick  = new (require('./index.js')).base({
    'tick_time' :100
});

```

## add function

```javascript
tick.add(
    ()=>{}
);
```

## start tick

```javascript
tick.start();
```


## stop tick

```javascript
tick.stop();
```


## set param
```javascript
tick.set(
    param,
    value
);
```

