'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deferred = void 0;
require("babel-polyfill");
class Deferred {
    constructor() {
        const self = this;
        this.promise = new Promise(function (resolve, reject) {
            self.resolve = resolve;
            self.reject = reject;
        });
    }
}
exports.Deferred = Deferred;
