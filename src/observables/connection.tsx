import * as RX from 'rxjs';
import * as constants from '../consts';

let failureCount = 0;

export default RX.Observable.timer(0, 1000)
    .throttle(() => {
        let timer = failureCount == 0 ? 12000 : (failureCount / 2 * 12000) + 12000;
        timer = timer > 30000 ? 30000 : timer;
        return RX.Observable.interval(timer);
    })
    .switchMap(
        () => sendPingRequest()
            .catch(() => {
                failureCount++;
                return RX.Observable.of(false);
            })
            .map((input: boolean) => {
                if (input !== false) {
                    failureCount = 0;
                }

                return input;
            })
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