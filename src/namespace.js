import {NamespaceError} from './namespace_error.js'

const namespace_symbol = Symbol('namespace')

const is_object = o => o != null && typeof o === 'object'

const is_namespace = o =>
    is_object(o) &&
    namespace_symbol in o

const is_record = o =>
    is_object(o) &&
    Reflect.getPrototypeOf(Reflect.getPrototypeOf(o)) === null

const namespace = (...nses) => {
    if (nses.some(ns => !is_record(ns)))
        throw NamespaceError('I can only use records to make namespaces.')

    const the_namespace = nses.reduce(
        (nses, ns) => {
            Object.keys(ns).forEach(key => {
                if (key === '__namespace__')
                    throw NamespaceError(`The key __namespace__ is reserved.`)
                if ((key in nses)) 
                    throw NamespaceError(`Conflict in namespaces: ${key} is in multiple namespaces.`)
            })
            return {...nses, ...ns}
        },
    {})
    
    return Object.assign(
        the_namespace, 
        {[namespace_symbol]: true}
    )
}

export {namespace, is_namespace}