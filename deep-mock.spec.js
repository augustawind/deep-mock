'use strict'
const dm = require('./deep-mock')
const deepMock = dm.deepMock
const Val = dm.Val
const Fun = dm.Fun
const Obj = dm.Obj
const Arr = dm.Arr

describe('deepMock()', function () {

    it('should return a Val unaltered', function () {
        let mock
        mock = deepMock(Val(5))
        expect(mock).toEqual(5)
        mock = deepMock(Val('foo'))
        expect(mock).toEqual('foo')
        mock = deepMock(Val(true))
        expect(mock).toEqual(true)
        mock = deepMock(Val([1,2,3]))
        expect(mock).toEqual(mock)
    })
})
