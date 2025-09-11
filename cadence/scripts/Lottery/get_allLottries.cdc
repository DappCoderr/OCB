import BagLottery from "../../contracts/BagLottery.cdc"

access(all) fun main(): [&BagLottery.Lottery] {
    return BagLottery.getAllLotteries()
}