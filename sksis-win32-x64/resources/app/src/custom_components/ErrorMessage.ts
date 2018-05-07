export class ErrorMessage{
    public message:string;
    error:boolean;
    hasError(){
        return this.error;
    }
    getMessage(){
        return this.error;
    }
    setMessage(m:string){
        this.message = m;
    }
    constructor(m:string, e:boolean){
        this.message = m;
        this.error = e;
    }
}