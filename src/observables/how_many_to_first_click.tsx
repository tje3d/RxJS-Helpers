import * as RX from 'rxjs';

let seconds            = RX.Observable.interval(1000);
let click              = RX.Observable.fromEvent(document, 'click');
let secondsBeforeClick = seconds.takeUntil(click); // Count until a click occur
let result             = secondsBeforeClick.count();
result.subscribe(count => console.log(count));