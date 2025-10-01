import BagLottery from "../../contracts/BagLottery.cdc"

access(all) fun main(): UFix64 {
    return BagLottery.getLotteryVaultBalance()
}