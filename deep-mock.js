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
Value.prototype.compile = function () {
    return this.value;
};

function FunctionType(value) {
    Value.call(this, value);
}
inherit(FunctionType, Value, {
    compile: function () {
        var retVal = compile(this.value);
        return function () {
            return retVal;
        };
    }
});

function ObjectType(value) {
    Value.call(this, value);
}
inherit(ObjectType, Value, {
    compile: function () {
        var mockObject = {};
        for (var key in this.value) {
            if (this.value.hasOwnProperty(key)) {
                mockObject[key] = compile(this.value[key]);
            }
        }
        return mockObject;
    }
});

function ArrayType(value) {
    Value.call(this, value);
}
inherit(ArrayType, Value, {
    compile: function () {
        return this.value.map(function (item) {
            return compile(item)
        });
    }
});

function compile(value) {
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
    compile: compile,
    Value: Value,
    FunctionType: FunctionType,
    ObjectType: ObjectType,
    ArrayType: ArrayType,
};
