'use strict'
const dm = require('./deep-mock')

// const example = Obj({
//     foo: 5,
//     bar: 'whoa',
//     doStuff: Fun(10),
//     makeThing: Fun(9),
//     makeMany: Fun(Obj({
//         thing1: 'hey',
//         thing2: 'sup'
//     })),
//     children: Obj({
//         wee: 0,
//         woo: 1
//     })
// })

describe('deepMock', () => {

    it('should return a literal value unaltered', () => {
        let mock
        mock = dm.deepMock(5)
        expect(mock).toEqual(5)
        mock = dm.deepMock('foo')
        expect(mock).toEqual('foo')
        mock = dm.deepMock(true)
        expect(mock).toEqual(true)
        mock = dm.deepMock([1,2,3])
        expect(mock).toEqual(mock)
    })

    it('should return the result of #compile, given a Value instance', () => {
        const value = new dm.Value(6)
        value.compile = jest.fn()
        let mock
        mock = dm.deepMock(value)
        expect(value.compile).toHaveBeenCalledTimes(1)
    })
})

describe('FunctionType#compile', () => {

    it('should return a function that returns the given value', () => {
        let mock
        mock = dm.deepMock(new dm.FunctionType(5))
        expect(mock()).toEqual(5)
        mock = dm.deepMock(new dm.FunctionType(new dm.FunctionType(11)))
        expect(mock()()).toEqual(11)
    })
})
