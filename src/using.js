import {NamespaceError} from './namespace_error.js'
import {is_namespace} from './namespace.js'

const build_preamble = (ns_object, ns_name) => 
    Object.keys(ns_object)
        .map(name => `const ${name} = ${ns_name}.${name}`)
        .join('\n')

const build_namespaced = (ns, fn, ns_name) => 
    Function(ns_name, 
        `${build_preamble(ns, ns_name)}
        return (${fn.toString()})()`
    )

const using = (ns, fn) => {
    const ns_name = '__namespace__'

    if (!is_namespace(ns)) 
        throw NamespaceError(
            'I can only use purpose-built namespace objects as namespaces.'
        )
    
    return build_namespaced(ns, fn, ns_name)(ns)
}

export {using}