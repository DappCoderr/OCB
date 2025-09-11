import BagRaffle from "../contracts/BagRaffle.cdc"

access(all) fun main(): UFix64{
    return BagRaffle.getPrizePoolVault()
}