import Bag from "../../contracts/Bag.cdc"

access(all) fun main(addr:Address): Int{
    return Bag.getCollectionLength(user: addr)
}