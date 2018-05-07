"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorMessage {
    hasError() {
        return this.error;
    }
    getMessage() {
        return this.error;
    }
    setMessage(m) {
        this.message = m;
    }
    constructor(m, e) {
        this.message = m;
        this.error = e;
    }
}
exports.ErrorMessage = ErrorMessage;
//# sourceMappingURL=ErrorMessage.js.map