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
exports.elementFinder = void 0;
const estraverse = require("estraverse");
const esutil = require("./esutil");
const declaration_property_handlers_1 = require("./declaration-property-handlers");
const docs = require("./docs");
function elementFinder() {
    /**
     * The list of elements exported by each traversed script.
     */
    var elements = [];
    /**
     * The element being built during a traversal;
     */
    var element = null;
    var propertyHandlers = null;
    var visitors = {
        classDetected: false,
        enterClassDeclaration: function enterClassDeclaration(node, parent) {
            this.classDetected = true;
            element = {
                type: 'element',
                desc: esutil.getAttachedComment(node),
                events: esutil.getEventComments(node).map(function (event) {
                    return { desc: event };
                }),
                properties: [],
                behaviors: [],
                observers: []
            };
            propertyHandlers = declaration_property_handlers_1.declarationPropertyHandlers(element);
        },
        leaveClassDeclaration: function leaveClassDeclaration(node, parent) {
            element.properties.map(property => docs.annotate(property));
            if (element) {
                elements.push(element);
                element = null;
                propertyHandlers = null;
            }
            this.classDetected = false;
        },
        enterAssignmentExpression: function enterAssignmentExpression(node, parent) {
            if (!element) {
                return;
            }
            const left = node.left;
            if (left && left.object && left.object.type !== 'ThisExpression') {
                return;
            }
            const prop = left.property;
            if (prop && prop.name) {
                var name = prop.name;
                if (name in propertyHandlers) {
                    propertyHandlers[name](node.right);
                }
            }
        },
        enterMethodDefinition: function enterMethodDefinition(node, parent) {
            if (!element) {
                return;
            }
            var prop = {
                key: node.key,
                value: node.value,
                kind: node.kind,
                method: true,
                leadingComments: node.leadingComments,
                shorthand: false,
                computed: false,
                type: 'Property'
            };
            const propDesc = docs.annotate(esutil.toPropertyDescriptor(prop));
            if (prop && prop.kind === 'get' && (propDesc.name === 'behaviors' || propDesc.name === 'observers')) {
                var returnStatement = node.value.body.body[0];
                var argument = returnStatement.argument;
                if (propDesc.name === 'behaviors') {
                    argument.elements.forEach((elementObject) => {
                        element.behaviors.push(elementObject.name);
                    });
                }
                else {
                    argument.elements.forEach((elementObject) => {
                        element.observers.push({ javascriptNode: elementObject, expression: elementObject.raw });
                    });
                }
            }
            else {
                element.properties.push(propDesc);
            }
        },
        enterCallExpression: function enterCallExpression(node, parent) {
            // When dealing with a class, enterCallExpression is called after the parsing actually starts
            if (this.classDetected) {
                return estraverse.VisitorOption.Skip;
            }
            var callee = node.callee;
            if (callee.type == 'Identifier') {
                const ident = callee;
                if (ident.name == 'Polymer') {
                    element = {
                        type: 'element',
                        desc: esutil.getAttachedComment(parent),
                        events: esutil.getEventComments(parent).map(function (event) {
                            return { desc: event };
                        })
                    };
                    propertyHandlers = declaration_property_handlers_1.declarationPropertyHandlers(element);
                }
            }
        },
        leaveCallExpression: function leaveCallExpression(node, parent) {
            var callee = node.callee;
            var args = node.arguments;
            if (callee.type == 'Identifier' && args.length === 1 && args[0].type === 'ObjectExpression') {
                const ident = callee;
                if (ident.name == 'Polymer') {
                    if (element) {
                        elements.push(element);
                        element = null;
                        propertyHandlers = null;
                    }
                }
            }
        },
        enterObjectExpression: function enterObjectExpression(node, parent) {
            // When dealing with a class, there is no single object that we can parse to retrieve all properties
            if (this.classDetected) {
                return estraverse.VisitorOption.Skip;
            }
            if (element && !element.properties) {
                element.properties = [];
                element.behaviors = [];
                element.observers = [];
                var getters = {};
                var setters = {};
                var definedProperties = {};
                for (var i = 0; i < node.properties.length; i++) {
                    var prop = node.properties[i];
                    var name = esutil.objectKeyToString(prop.key);
                    if (!name) {
                        throw {
                            message: 'Cant determine name for property key.',
                            location: node.loc.start
                        };
                    }
                    if (name in propertyHandlers) {
                        propertyHandlers[name](prop.value);
                        continue;
                    }
                    var descriptor = esutil.toPropertyDescriptor(prop);
                    if (descriptor.getter) {
                        getters[descriptor.name] = descriptor;
                    }
                    else if (descriptor.setter) {
                        setters[descriptor.name] = descriptor;
                    }
                    else {
                        element.properties.push(esutil.toPropertyDescriptor(prop));
                    }
                }
                Object.keys(getters).forEach(function (getter) {
                    var get = getters[getter];
                    definedProperties[get.name] = get;
                });
                Object.keys(setters).forEach(function (setter) {
                    var set = setters[setter];
                    if (!(set.name in definedProperties)) {
                        definedProperties[set.name] = set;
                    }
                    else {
                        definedProperties[set.name].setter = true;
                    }
                });
                Object.keys(definedProperties).forEach(function (p) {
                    var prop = definedProperties[p];
                    element.properties.push(prop);
                });
                return estraverse.VisitorOption.Skip;
            }
        }
    };
    return { visitors: visitors, elements: elements };
}
exports.elementFinder = elementFinder;
;
