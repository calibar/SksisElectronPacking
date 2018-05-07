export class User {
    constructor (
        public name: string = '',
        public firstName:string = '',
        public lastName:string = '',
        public password:string = ''
    ) {}

    static fromJson (json:any) {
        if (!json) return;

        return new User (
            json.name,
            json.first_name,
            json.last_name,
            json.password
        );
    }

    toJson (stringify?: boolean):any {
        var doc = {
            name: this.firstName,
            first_name: this.firstName,
            last_name: this.lastName,
            password: this.password
        };

        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}