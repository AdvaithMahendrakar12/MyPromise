
enum PromiseState {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected'
}

// type resolve = (value?: any) => void;

type TPromiseResolve<T> = (value? : T) => void;
type TPromiseReject<T> = (reason?: T) => void;
type TPromiseThenExecutor<T> = (value? : T ) => void;    
type TPromiseCatchExecutor<K> = (reason : K ) => void;   

type TPromiseExecutor<T,K> = (resolve: TPromiseResolve<T>, reject : TPromiseReject<K>) => void;

class MyPromise<T, K>{
    
    private state : PromiseState = PromiseState.Pending;

    constructor(executor: TPromiseExecutor<T,K>) {
        executor(
            this._promiseResolver.bind(this),this._promiseRejector.bind(this)
        ); 
    }

    private _successCallBackHandler: TPromiseThenExecutor<T>[] = [];
    private _errorCallBackHandler: TPromiseCatchExecutor<K>[] = [];


    private _value: T | undefined  = undefined;
    private _reason: K | undefined = undefined;  
    public  then(handleFn: TPromiseThenExecutor<T>) {
        // if(this.state === PromiseState.Fulfilled) {
        //     handleFn();
        // }

        if(this.state === PromiseState.Fulfilled) { 
            handleFn(this._value);
        }

        this._successCallBackHandler.push(handleFn);
        return this; 

    }

    private _promiseResolver(value: T) {
        if(this.state === PromiseState.Fulfilled) return ; 
        this.state = PromiseState.Fulfilled;
        this._value = value;
        this._successCallBackHandler.forEach((handler) => {
            handler(value);
        });
    }

    public catch(handleFn: TPromiseCatchExecutor<K>) {
        if(this.state === PromiseState.Rejected) {
            if (this._reason !== undefined) {
                handleFn(this._reason);
            }
        }
        this._errorCallBackHandler.push(handleFn);
        return this;
    }
    private _promiseRejector(reason: K) {
        if(this.state === PromiseState.Rejected) return ; 
        this.state = PromiseState.Rejected;
        this._reason = reason;  
        this._errorCallBackHandler.forEach((handler) => {
            handler(reason);
        });
    }
}




function prommise(): MyPromise<string, string> {
    return new MyPromise<string, string>((resolve, reject) => {
       setTimeout(() => {    
        resolve("Jai Shree Ram"); 
        }, 3000);
    });
}

const p = prommise()
    .then((value) => {
        console.log(value);
    }).catch((reason) => {
        console.log("Reason"  , reason);
    });

