import Bag from 0xdb2133aaf990813c

access(all) fun main(addr:Address): Bool{
    let account = getAccount(addr)
    let capRef = account.capabilities.get<&Bag.Collection>(Bag.CollectionPublicPath)
    return capRef.check()
}