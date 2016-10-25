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
        const mock1 = dm.deepMock(5)
        expect(mock1).toEqual(5)
        const mock2 = dm.deepMock('foo')
        expect(mock2).toEqual('foo')
        const mock3 = dm.deepMock(true)
        expect(mock3).toEqual(true)
        const mock4 = dm.deepMock([1, 2, 3])
        expect(mock4).toEqual([1, 2, 3])
    })

    it('should return the result of #compile, given a Value instance', () => {
        const value = new dm.Value(6)
        value.compile = jest.fn()

        dm.deepMock(value)
        expect(value.compile).toHaveBeenCalledTimes(1)
    })
})

describe('FunctionType#compile', () => {

    it('should return a function that returns the given value', () => {
        const mock1 = dm.deepMock(new dm.FunctionType(5))
        expect(mock1()).toEqual(5)
        const mock2 = dm.deepMock(new dm.FunctionType(new dm.FunctionType(11)))
        expect(mock2()()).toEqual(11)
    })
})
