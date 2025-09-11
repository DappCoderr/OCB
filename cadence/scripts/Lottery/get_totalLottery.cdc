import BagLottery from "../../contracts/BagLottery.cdc"

access(all) fun main(): UInt64 {
    return BagLottery.totalLottery
}