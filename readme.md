# Reified namespaces in Javascript
## Please don't use this
### It's `with`, but with functions and more hacks

The basic idea (& excusing my perverse preference for `snake_case`):
```javascript
import {ns, using} from '@kredati/namespace'

const my_namespace = ns(
    {foo: () => 'bar', quux: () => 'baz'},
    {id: x => x},
) //-> {foo: ..., quux: ..., id: ..., [Symbol('namespace')]: true}
// "namespaces" all normal keys of all objects
// no duplicate keys are allowed, and it will only allow object literals

const my_function = () => id(foo())

my_function() //-> throws ReferenceError: id is not defined

using(my_namespace, my_function) //-> 'bar'
using(my_namespace, () => quux()) //-> 'baz'
using(my_namespace, () => __namespace__) //-> my_namespace
```
As I said, don't use this.

`using` uses what is effectively a stupid version of a macro to do this, although it's nowhere near as sophisticated as anything in, say, sweetjs or, uh, a real lisp. It's reasonably robust, however, since the transformation is so simple. 

The `namespace`/`ns` function ensures there are no duplicate properties on namespace objects. `using` will only accept a "safe" namespace object that has been built by the `ns` function. And, for every property on that object, it adds a `const` variable declaration & definition before executing the passed function inside a newly-constructed lexical scope. Because of this, it follows normal lexical scoping rules for `const` and `let`: everything in the namespace can be shadowed to no ill effect. Pass-by-reference values (objects, arrays, &c.) can, of course, be mutated.

To do all this, it uses the `Function` constructor, the `toString` method of the passed function, and some very simple template strings.

Unlike `with`, namespaces can be modified, returned, and accessed, using the `__namespace__` variable inside the function.

`using` executes the passed function immediately and passes through its return value.

Why would you want to do this? Well, you don't. It might be useful at a repl, maybe? (How?) The only real use case I can think of for something like this would be to automate the bootstrapping of environments for early learners of a language. And even then it's a disaster because it explodes linters and stack traces and line numbers. (Better off programmatically manipulating the global context until you learn them what they need to handle scope & imports.)

But if you do want to? Well, `with` is not possible in es6 modules (for good reason!), so this stands as a substitute. It's an experiment, to see how hard it would be to do. (It was easy!) It arose as a thing I wanted to try as part of an ongoing project to see how hard you have to push JS to get really lisp-ish behavior and constructs. See, e.g., [this essay](https://medium.com/thinking-with-computers/javascript-is-not-scheme-7a84889e9b3c). Perhaps it is one step closer to [Clojure's first-class namespaces](https://clojure.org/reference/namespaces), a discussion of which is what got this idea in my head.

Not that it's earth-shattering--but ultimately this stands as an iteration of the (relative) power of the way JS represents functions, especially including its `toString` method. Code really is data! And can be transformed, reasonably easily. (So long as the code is inside a function. And doesn't violate JS's parsing rules. &c...)