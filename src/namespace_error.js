function NamespaceError (message) {
    if (!(this instanceof NamespaceError)) 
        return new NamespaceError(message)

    this.name = 'NamespaceError'
    this.message = message
}

NamespaceError.prototype = Error.prototype

export {NamespaceError}