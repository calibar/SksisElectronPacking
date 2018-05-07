"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
core_1.Injectable();
class APIService {
    constructor(http) {
        this.http = http;
        this.baseUrl = localStorage.getItem("api");
    }
}
exports.APIService = APIService;
//# sourceMappingURL=Services.js.map