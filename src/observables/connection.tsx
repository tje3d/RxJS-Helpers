import * as RX from 'rxjs';
import * as constants from '../consts';

let failureCount = 0;

// An observable which emits every second
let runEverySecond$     = RX.Observable.timer(0, 1000);

// Throttle emitions based on failureCount
let throttleBasedOnFailure$ = runEverySecond$.throttle(() => {
        let timer = failureCount == 0 ? 12000 : (failureCount / 2 * 12000) + 12000;
        timer = timer > 30000 ? 30000 : timer;
        return RX.Observable.interval(timer);
    })

// Send ping request and emit a boolean
let pingRequest$ = throttleBasedOnFailure$.switchMap(
        () => sendPingRequest()
            // Increment failureCount and emit false value
            .catch(() => {
                failureCount++;
                return RX.Observable.of(false);
            })
            // Reset failureCount if connection was successful
            .map((input: boolean) => {
                if (input !== false) {
                    failureCount = 0;
                }

                return input;
            })
    )

// Emit the connection status if its changed
let connectionStatusNotifier$ = pingRequest$
    // Need initial value, or we have to wait for two emittion
    .startWith(true)
    .pairwise()
    // If status changed
    .filter((input: Array<boolean>) => input[0] !== input[1])
    .map((input: Array<boolean>) => {
        let type = input[0] === input[1] ? constants.CONNECTION_STATUS_STABLE : constants.CONNECTION_STATUS_CHANGED;
        return {type, status: input[1]};
    })

// Emit connection status
let connectionStatus$ = pingRequest$
    // Need initial value, or we have to wait for two emittion
    .startWith(true)
    .pairwise()
    .map((input: Array<boolean>) => {
        let type = input[0] === input[1] ? constants.CONNECTION_STATUS_STABLE : constants.CONNECTION_STATUS_CHANGED;
        return {type, status: input[1]};
    })

// The connection status checker logic
function sendPingRequest() {
    return RX.Observable.ajax({
        method: 'HEAD',
        url: 'http://maxwow.ir/',
        timeout: 10000,
    });
}

export default connectionStatusNotifier$