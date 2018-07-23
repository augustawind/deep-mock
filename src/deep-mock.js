/**
 * @fileoverview Tools for creating deeply nested mocks.
 * @author dustin.rohde@gmail.com (Dustin Rohde)
 * @license
 * Copyright (c) 2016 Dustin Rohde
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
'use strict';

// x =
//     {
// 	doStuff: ['function', {
// 	    otherStuff: ['function', {
// 		bob: 5,
// 		bill: "lol",
// 	    }],
// 	}],
//     }



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
            return compile(item);
        });
    }
});

function inherit(subclass, superclass, methods) {
    methods = methods || {};

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

// function isObject(value) {
//     return value instanceof Object
//         && typeof value === 'object'
//         && !isArray(value);
// }
//
// function isArray(value) {
//     return Object.prototype.toString.call(value) === '[object Array]';
// }

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
