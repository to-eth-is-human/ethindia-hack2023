
import {FusionSDK, OrderInfo} from "@1inch/fusion-sdk";
import Web3 from "web3";
import {PresetEnum} from "@1inch/fusion-sdk/api";


class fusionUtil {

    createOrder =  async function (sdk: FusionSDK, from: string, to: string, amount: string, walletAddress: string, preset: PresetEnum): Promise<OrderInfo | undefined> {
        try {
            return await sdk.placeOrder({
                fromTokenAddress: from,
                toTokenAddress: to,
                amount: amount,
                walletAddress,
                preset,
            })
        } catch (e) {
            console.log(e)
            return undefined;
        }

    }

    getAddressFromPrivateKey = function (privateKey: string): string {
        const web3 = new Web3();
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        return account.address;
    }


}

