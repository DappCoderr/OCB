import Bag from "../../contracts/Bag.cdc"

access(all) fun main(addr:Address): Bool{
    return Bag.hasCollection(user: addr)
}