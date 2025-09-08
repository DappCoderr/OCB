import Bag from "../contracts/Bag.cdc"

access(all) fun main(): UInt64 {
    return Bag.maxSupply
}