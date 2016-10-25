# deep-mock

Painlessly create deeply nested mocks for testing.

## Example

```javascript
var deepMock = require('deep-mock');
var Obj = deepMock.Obj;
var Fun = deepMock.Fun;

var myComplexObject = Obj({
    name: 'Foo',
    getNumbers: Fun([1, 2, 3]),
    discombobulate: Fun(Obj({
        speed: 5,
        complete: true,
        thingamajig: Fun(Obj({
            actions: Obj({
                getDoohickey: Fun(Obj({
                    name: 'Bob',
                    energy: -5
                }))
            })
        }))
    })),
});

var discombobulator = myComplexObject.compile()

discombulator.name
// 'Foo'

discombobulator.getNumbers()
// [1, 2, 3]

discombobulator.discombobulate().complete
// true

discombobulator.discombobulate().thingamajig().actions.getDoohickey().energy
// -5
```
