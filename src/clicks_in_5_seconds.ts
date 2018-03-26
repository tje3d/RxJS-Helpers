import * as RX from 'rxjs';

RX.Observable.fromEvent(window, 'click')
    .takeUntil(RX.Observable.interval(5000))
    .mapTo(1)
    .scan((acc: number, value: number) => acc + value, 0)