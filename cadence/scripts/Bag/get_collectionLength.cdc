import Bag from "../../contracts/Bag.cdc"

access(all) fun main(addr:Address): Int{
    let coll =  Bag.getCollectionSize(user: addr)
    return coll.length
}