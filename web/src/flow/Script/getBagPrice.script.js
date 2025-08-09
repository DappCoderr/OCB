import * as fcl from "@onflow/fcl";

const GET_BAG_PRICE = `
import Bag from 0xdb2133aaf990813c
access(all) fun main(): UFix64 {
    return Bag.bagPrice
}`;

export async function getBagPrice() {
  try {
    const response = await fcl.query({
      cadence: GET_BAG_PRICE,
    });
    return response;
  } catch (error) {
    console.error("Error get bag price:", error);
    throw error;
  }
}
