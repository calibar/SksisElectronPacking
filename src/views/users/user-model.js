"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(name = '', firstName = '', lastName = '', password = '') {
        this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }
    static fromJson(json) {
        if (!json)
            return;
        return new User(json.name, json.first_name, json.last_name, json.password);
    }
    toJson(stringify) {
        var doc = {
            name: this.firstName,
            first_name: this.firstName,
            last_name: this.lastName,
            password: this.password
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}
exports.User = User;
//# sourceMappingURL=user-model.js.map