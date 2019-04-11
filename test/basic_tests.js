/* eslint no-undef: 0 */

import * as t from 'tap'
import {ns, using} from '../src/main.js'

// TODO: make the testing more robust, but only if I want to actually use this terrible idea
t.test('A namespace function: does it work in the happy path', t => {
    const space = ns(
        {id: x => x}, 
        {thunk: x => () => x}, 
        {
            foo: 'foo', 
            bar: () => 'bar', 
            baz: {1: 1, 2: 2, 3: 3}
        }
    )

    const result = using(space,
        () => [
            bar(),
            baz['2'],
            id(foo)
        ]
    )

    t.same(result, ['bar', 2, 'foo'])

    const result_2 = using(space, 
        () => thunk(bar)    
    )

    t.is(result_2()(), 'bar')

    t.end()
})