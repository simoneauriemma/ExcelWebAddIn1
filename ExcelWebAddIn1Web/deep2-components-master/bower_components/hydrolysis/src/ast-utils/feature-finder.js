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
exports.featureFinder = void 0;
const esutil = require("./esutil");
var numFeatures = 0;
function featureFinder() {
    /** The features we've found. */
    var features = [];
    function _extractDesc(feature, node, parent) {
        feature.desc = esutil.getAttachedComment(parent);
    }
    function _extractProperties(feature, node, parent) {
        var featureNode = node.arguments[0];
        if (featureNode.type !== 'ObjectExpression') {
            console.warn('Expected first argument to Polymer.Base._addFeature to be an object.', 'Got', featureNode.type, 'instead.');
            return;
        }
        const objExpr = featureNode;
        if (!objExpr.properties)
            return;
        feature.properties = objExpr.properties.map(esutil.toPropertyDescriptor);
    }
    var visitors = {
        enterCallExpression: function enterCallExpression(node, parent) {
            const isAddFeatureCall = esutil.matchesCallExpression(node.callee, ['Polymer', 'Base', '_addFeature']);
            if (!isAddFeatureCall) {
                return;
            }
            /** @type {!FeatureDescriptor} */
            var feature = {};
            _extractDesc(feature, node, parent);
            _extractProperties(feature, node, parent);
            features.push(feature);
        },
    };
    return { visitors: visitors, features: features };
}
exports.featureFinder = featureFinder;
;
