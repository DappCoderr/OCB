import BagRaffle from "../contracts/BagRaffle.cdc"

access(all) fun main(id:UInt64): &BagRaffle.Raffle {
    return BagRaffle.getRaffle(raffleId:id)
}