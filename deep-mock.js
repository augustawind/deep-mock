'use strict';

function inherit(subclass, superclass, methods) {
    methods = methods || {}

    subclass.prototype = Object.create(superclass.prototype);
    subclass.prototype.constructor = superclass;

    // Assign methods to subclass prototype
    for (var methodName in methods) {
        if (methods.hasOwnProperty(methodName))
            subclass.prototype[methodName] = methods[methodName];
    }

    // Inherit class properties from superclass
    for (var property in superclass) {
        if (superclass.hasOwnProperty(property))
            subclass[property] = superclass[property];
    }
}

function Value(value) {
    this.value = value;
}
Value.prototype.compile = function compile() {
    return this.value;
};

function FunctionType(value) {
    Value.call(this, value);
}
inherit(FunctionType, Value, {
    compile: function compile() {
        var retVal = deepMock(this.value);
        return function () {
            return retVal;
        };
    }
});

function ObjectType(value) {
    Value.call(this, value);
}
inherit(ObjectType, Value, {
    compile: function compile() {
        var mockObject = {};
        for (var key in this.value) {
            if (this.value.hasOwnProperty(key)) {
                mockObject[key] = deepMock(this.value[key])
            }
        }
        return mockObject;
    }
});

function ArrayType(value) {
    Value.call(this, value);
}
// inherit(ArrayType, Value);
//
//     switch (value.type) {
//         case 'function':
//
//         case 'object':
//             return (function () {
//                 var object = value.value
//                 var mockObject = {};
//                 for (var key in object) {
//                     if (value.value.hasOwnProperty(key)) {
//                         mockObject[key] = deepMock(value.value[key])
//                     }
//                 }
//                 return mock;
//             })()
//
//         case 'array':
//             return value.value.map(function (item) {
//                 return deepMock(item)
//             });
//
//         // NOTE: Experimental
//         case 'promise':
//             return (function () {
//                 var thenVal = deepMock(value.value);
//
//                 return {
//                     then: function (handler) {
//                         return Prom(handler(thenVal));
//                     },
//                     catch: function (handler) {
//                         handler();
//                         return Prom();
//                     }
//                 }
//             })

// function Prom(value) {
//     return new Value('promise', value);
// }

function deepMock(value) {
    if (!(value instanceof Value))
        return value;
    return value.compile();
}

function isObject(value) {
    return value instanceof Object
        && typeof value === 'object'
        && !isArray(value);
}

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

module.exports = {
    deepMock: deepMock,
    Value: Value,
    FunctionType: FunctionType,
    ObjectType: ObjectType,
    ArrayType: ArrayType,
};
