import * as RX from 'rxjs';
import * as constants from '../consts';

export default RX.Observable.timer(0, 1000)
    .throttleTime(12000)
    .switchMap(
        () => sendPingRequest()
            .catch(() => RX.Observable.of(false))
            .map((input: boolean) => input)
    )
    .startWith(true)
    .pairwise()
    .filter((input: Array<boolean>) => input[0] !== input[1])
    .map((input: Array<boolean>) => {
        let type = input[0] === input[1] ? constants.CONNECTION_STATUS_STABLE : constants.CONNECTION_STATUS_CHANGED;
        
        return {type, status: input[1]};
    });

function sendPingRequest() {
    return RX.Observable.ajax({
        method: 'HEAD',
        url: 'http://maxwow.ir/',
        timeout: 10000,
    });
}