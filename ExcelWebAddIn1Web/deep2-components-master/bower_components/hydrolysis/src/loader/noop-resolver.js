/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopResolver = void 0;
/**
 * A resolver that resolves to empty string any uri that matches config.
 */
class NoopResolver {
    constructor(config) {
        this.config = config;
    }
    /**
     * @param {string}    uri      The absolute URI being requested.
     * @param {!Deferred} deferred The deferred promise that should be resolved if
     *     this resolver will handle the URI.
     * @return {boolean} Whether the URI is handled by this resolver.
     */
    accept(uri, deferred) {
        const config = this.config;
        if (typeof config === 'string') {
            if (uri.search(config) == -1) {
                return false;
            }
        }
        else {
            if (!config.test(uri)) {
                return false;
            }
        }
        deferred.resolve('');
        return true;
    }
}
exports.NoopResolver = NoopResolver;
