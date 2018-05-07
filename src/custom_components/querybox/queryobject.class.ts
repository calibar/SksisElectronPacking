export class QueryStore {
    private queries: QueryContainer[];

    constructor(){
        this.queries = [];
    }

    public addQuery(q:QueryContainer) {
        this.queries.push(q)
    }

    public removeQuery(q:QueryContainer) {
        this.queries = this.queries.filter(obj => obj !== q);
    }

    public getQueries(){
        return this.queries;
    }

    public parensAreBalanced() {
        let starts = 0;
        let ends = 0;

        this.queries.forEach( (q) => {
            for (let s = 0; s < q.startParens; s++) {
                starts++;
            }
            for (let e = 0; e < q.endParens; e++) {
                ends++;
            }
        })

        return starts == ends;
    }
}

export class QueryContainer {
    attribute:string;
    value:string;
    logicalOperator:string;
    attributeName:string;
    valueName:string;

    startParens:number;
    endParens:number;

    constructor(){
        this.attribute = '';
        this.value = '';
        this.logicalOperator = '';
        this.attributeName = '';
        this.valueName = '';
        this.startParens = 0;
        this.endParens = 0;
    }

    getStartParens(){
        let ps = ' ';
        for(let i = 0; i < this.startParens; i++) {
            ps += '(';
        }
        return ps;
    }

    getEndParens(){
        let ps = '';
        for(let i = 0; i < this.endParens; i++) {
            ps += ')';
        }
        return ps;
    }


}
