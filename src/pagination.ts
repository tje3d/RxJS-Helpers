import * as RX from 'rxjs';

RX.Observable.of(1, 4)
    .switchMap((page: number) => multiplePage(page, 3))
    .switchMap(action         => RX.Observable.from(action))
    .subscribe((result: any)  => console.log(result))

function multiplePage(from: number, count: number) {
    let loaders = [];
    for(let i = 0; i < count; i++) {
        loaders.push(loadPage(from + i));
    }

    // if you are not care about order you can use mergeMap
    // also you can use concatMap to load page one by one and not all in once
    return RX.Observable.forkJoin(loaders)
}

function loadPage(page: number) {
    return RX.Observable.ajax({
        method : 'GET',
        url    : '/page/' + page,
    });
}