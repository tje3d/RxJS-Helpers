import * as RX from 'rxjs';

let clickObs$ = RX.Observable.fromEvent(document, 'click');
clickObs$.map(x => RX.Observable.interval(1000).take(4))
    .concatAll()
    .subscribe(val => console.log(val));

// Output
// 1,2,3,4,1,2,3,4,1,2,3,4 ...
// and if you replace concatAll with mergeAll the output could be:
// 1,1,2,1,3....