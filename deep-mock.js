'use strict';

function Fun(value) {
    return {
        type: 'function',
        value: value
    };
}

function Obj(value) {
    return {
        type: 'object',
        value: value
    };
}

function Arr(value) {
    return {
        type: 'array',
        value: value
    }
}

function Val(value) {
    return {
        type: 'primitive',
        value: value
    };
}

function Prom(value) {
    return {
        type: 'promise',
        value: value
    }
}

function deepMock(obj) {
    switch (obj.type) {

        case 'primitive':
            return obj.value;

        case 'function':
            return (function () {
                var retVal = deepMock(obj.value);
                return function () {
                    return retVal;
                }
            })()

        case 'object':
            return (function () {
                var mockObject = {};
                for (var key in obj.value) {
                    if (obj.value.hasOwnProperty(key)) {
                        mockObject[key] = deepMock(obj.value[key])
                    }
                }
                return mock;
            })()

        case 'array':
            return obj.value.map(function (item) {
                return deepMock(item)
            });

        // NOTE: Experimental
        case 'promise':
            return (function () {
                var thenVal = deepMock(obj.value);

                return {
                    then: function (handler) {
                        return Prom(handler(thenVal));
                    },
                    catch: function (handler) {
                        handler();
                        return Prom();
                    }
                }
            })
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
    deepMock: deepMock,
    Fun: Fun,
    Obj: Obj,
    Val: Val
};
