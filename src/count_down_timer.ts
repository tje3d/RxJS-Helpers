import * as RX from 'rxjs';

RX.Observable.interval(1000)
    .map(value => 10 - value)
    .takeWhile(value => value > -1) // Will unsubscribe when the condition is true
    .subscribe(value => console.log(value))