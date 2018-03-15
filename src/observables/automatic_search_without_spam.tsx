import * as RX from 'rxjs';

RX.Observable.fromEvent(document.getElementById('input'), 'keydown')
    .debounceTime(300)
    // .switchMap(api.search)