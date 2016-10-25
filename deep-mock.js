'use strict';

function compile(value) {
    if (!(value instanceof Value))
        return value;
    return value.compile();
}

var Fun = function Fun(value) {
    return new FunctionType(value);
};

var Obj = function Obj(value) {
    return new ObjectType(value);
};

var Arr = function Arr(value) {
    return new ArrayType(value);
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

function Value(value) {
    this.value = value;
}
Value.prototype.compile = function () {
    return this.value;
};

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

    Fun: Fun,
    F: Fun,
    Obj: Obj,
    O: Obj,
    Arr: Arr,
    A: Arr,

    Value: Value,
    FunctionType: FunctionType,
    ObjectType: ObjectType,
    ArrayType: ArrayType,
};
