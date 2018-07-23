'use strict';
var dm = require('../src/deep-mock');

describe('automock', function () {
    it('should mock stuff automatically', function () {
	
    })
})

describe('compile', function () {

    it('when given a literal value, should return it unaltered', function () {
        var mock1 = dm.compile(5);
        expect(mock1).toEqual(5);
        var mock2 = dm.compile('foo');
        expect(mock2).toEqual('foo');
        var mock3 = dm.compile(true);
        expect(mock3).toEqual(true);
        var mock4 = dm.compile([1, 2, 3]);
        expect(mock4).toEqual([1, 2, 3]);
    });

    it('when given a Value, should compile and return the result', function () {
        var value1 = new dm.Value();
        value1.compile = jest.fn(function () {
            return 'compiledResult';
        });

        var result = dm.compile(value1);
        expect(value1.compile).toHaveBeenCalledTimes(1);
        expect(result).toEqual('compiledResult');
    });
});

describe('FunctionType#compile', function () {

    it('should return a function that returns the given value', function () {
        var mock1 = new dm.FunctionType(5).compile();
        expect(mock1()).toEqual(5);
        var mock2 = new dm.FunctionType(new dm.FunctionType(11)).compile();
        expect(mock2()()).toEqual(11);
    });
});

describe('ObjectType#compile', function () {

    it('should recursively compile each property', function () {
        var mock1 = new dm.ObjectType({
            foo: 5,
            bar: new dm.FunctionType(false),
            quux: new dm.ObjectType({
                bing: 'gnib',
                bif: new dm.FunctionType('bif')
            })
        }).compile();
        expect(mock1.foo).toEqual(5);
        expect(mock1.bar()).toEqual(false);
        expect(mock1.quux.bing).toEqual('gnib');
        expect(mock1.quux.bif()).toEqual('bif');
    });
});

describe('ArrayType#compile', function () {

    it('should recursively compile each item', function () {
        var mock1 = new dm.ArrayType([
            5,
            new dm.FunctionType('hey'),
            new dm.ObjectType({
                bing: 'gnib'
            }),
            'lizard'
        ]).compile();

        expect(mock1[0]).toEqual(5);
        expect(mock1[1]()).toEqual('hey');
        expect(mock1[2]).toEqual({ bing: 'gnib' });
        expect(mock1[3]).toEqual('lizard');
    });
});
