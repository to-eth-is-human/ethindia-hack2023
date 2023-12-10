import { ethers, Transaction, TransactionResponse, Wallet } from 'ethers'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import dotenv from 'dotenv'
import SafeApiKit from '@safe-global/api-kit'
import { SafeAccountConfig } from '@safe-global/protocol-kit'
import { SafeFactory } from '@safe-global/protocol-kit'
let Web3 = require('web3');
import Script from "next/script";
import Head from "next/head";
import Hero from '@/components/hero'
import Features from '@/components/features'
import FeaturesBlocks from '@/components/features-blocks'
import Testimonials from '@/components/testimonials'
import Newsletter from '@/components/newsletter'
import { MetaTransactionData, OperationType, SafeMultisigTransactionResponse, SafeTransaction, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'


/*
TO ASK
* Get all Safes of a given person
* Hex to string conversion not happening
* Deploy to a safe?
* How to get address of a safe, given only EOA
* pendingtransaction results?


*/



export default class SafeUtil {

    /*
    Flow: AFter signing in, user will have all his/her safe addresses.

    A script should poll periodically poll for pending transactions in each safe, and update a table

    A form must be available to create a safe
    A from must be available to create a new transaction
    A form must be available to propose an existing transaction
    A form must be available to execute a transation
    A from must be available to send ethereum to the safe

    */
    env_map: { [name: string]: string } = {}


    constructor() {

        this.env_map['NEXT_PUBLIC_OWNER_1_PRIVATE_KEY'] = "0xe09beba9fea5b199962185220114ab415065546b90424f473162691ce24c7b41"
        this.env_map['NEXT_PUBLIC_OWNER_2_PRIVATE_KEY'] = "0xbae26c4c4e44ed8e6e8d1c41c84072c83ec91d507db101cc372c77c94fc3b1ff"
        this.env_map['NEXT_PUBLIC_OWNER_3_PRIVATE_KEY'] = "0x6d8b619bed6d73c2cea6f5c2f0977a85dc4b7d24d9e052ab477ad747d6508e54"
        this.env_map['NEXT_PUBLIC_OWNER_4_PRIVATE_KEY'] = "0x82104fef98e49f6c3e8d644d8d81b8ed4f3eb88f10ce2abc6e4dd341a54f6ea2"

    }

    getProvider = () => {
        return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    }

    getSigner = (env_var: string) => {
        let provider = this.getProvider()
        return new ethers.Wallet(String(env_var), provider)

    }

    getOwnerSigner = () => {
        return this.getSigner(String(process.env.NEXT_PUBLIC_OWNER_2_PRIVATE_KEY))
    }

    getOwnerEthAdapter = () => {
        return new EthersAdapter({
            ethers,
            signerOrProvider: this.getOwnerSigner()
        })

    }

    getSafeService = () => {
        return new SafeApiKit({
            chainId: 5n,
            txServiceUrl: "https://safe-transaction-goerli.safe.global"
        })

    }

    debugLog = async() => {
        const safeFactory = await SafeFactory.create({ ethAdapter: this.getOwnerEthAdapter() })
        let owner_config = {
            owners: ["0x5982197C06Ecb24E3456595faeD1978e96ccf592", "0xD6c9CAdF5AC7C704218dC8F74787f4E3ACC69223", "0x34ff4569C5aCBA43Ad2526DB6a43e6313F7051CA"],
            threshold: 2,
        }
        let addr = await safeFactory.predictSafeAddress(owner_config)
        console.log(addr)


    }

    getConfig = (owners_list: string[], threshold: number, SALT_NONCE: string = '150000', SAFE_VERSION: string = '1.3.0') => {
        return {
            RPC_URL: (String(process.env.NEXT_PUBLIC_RPC_URL)),
            DEPLOYER_ADDRESS_PRIVATE_KEY: String(process.env.NEXT_PUBLIC_OWNER_2_PRIVATE_KEY),
            DEPLOY_SAFE: {
                OWNERS: owners_list,
                THRESHOLD: threshold,
                SALT_NONCE: '150000',
                SAFE_VERSION: '1.3.0'
            },
        }
    }

    

    sendEth = async (to_address: string) => {
        console.log("Sending eth")

        const ownerSigner = this.getOwnerSigner()

        // const safeAddress = "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2" //safeSdk.getAddress()
        const safeAddress = to_address

        // const safeAmount = 'Ox0080'

        // TODO: Unable to convcert to hex without errors
        const safeAmount = ethers.parseUnits('0.01', 'ether').toString();

        const transactionParameters = {
            to: safeAddress,
            value: safeAmount,
            gasLimit: 1000000, // Manually specify the gas limit
        };


        // const transactionParameters = {
        //   to: safeAddress,
        //   value: safeAmount
        // }
        console.log(transactionParameters)

        const tx = await ownerSigner.sendTransaction(transactionParameters)

        console.log('Fundraising.')
        console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`)
    }




    deployContract = async (n: number) => {
        console.log(this.env_map)

        console.log(`Deploy contract of ${n} accounts and threshold = ${Math.ceil(n)}`)

        // Initialize signers
        let signers: Wallet[] = [];
        for (let i = 1; i <= n; i++) {
            let env_var = "NEXT_PUBLIC_OWNER_" + i.toString() + "_PRIVATE_KEY"
            const signer = this.getSigner(this.env_map[env_var])
            signers.push(signer)
        }


        // This must be the person who has eth
        console.log("Waiting to initialise safe")
        const safeFactory = await SafeFactory.create({ ethAdapter: this.getOwnerEthAdapter() })


        let owners: string[] = [];
        for (let i = 0; i < n; i++) {
            let address = await signers[i].getAddress();
            owners.push(address)
        }
        const safeAccountConfig = {
            owners: owners,
            threshold: Math.ceil(n),
        }

        console.log(safeAccountConfig)

        /* This Safe is tied to owner 1 because the factory was initialized with
        an adapter that had owner 1 as the signer. */
        console.log("Deploy safe")

        try {
            // Error: SafeProxy was not deployed correctly
            // if "was not deployed" in error message,
            // Just display this URL
            // https://goerli.etherscan.io/address/0xd6c9cadf5ac7c704218dc8f74787f4e3acc69223 (address of whoever tried to deploy)



            // Error: Create 2 call failed
            // TODO: CAll failing sometimes.
            const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
            const safeAddress = await safeSdk.getAddress()

            console.log('Your Safe has been deployed:')
            console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
            console.log(`https://app.safe.global/gor:${safeAddress}`)

        }
        catch (err) {
            console.log(err)
        }
    };

    createTransaction = async (safe_address: string, dest_address: string, ether: string) => {

        const ethAdapter = this.getOwnerEthAdapter()
        const safe = await Safe.create({
            ethAdapter,
            safeAddress: safe_address
        })

        // const amount = ethers.parseUnits(ether, 'ether').toString()

        const safeTransactionData: SafeTransactionDataPartial = {
            to: '0x',
            data: '0x',
            value: "1",
            operation: OperationType.Call
        }
        // Create a Safe transaction with the provided parameters
        const safeTransaction = await safe.createTransaction({ transactions: [safeTransactionData] })
        console.log("Transaction created: ", safeTransaction.data)
    }


    proposeTransaction = async (safe_address: string, transaction: SafeTransaction) => {

        // Deterministic hash based on transaction parameters

        const ethAdapter = this.getOwnerEthAdapter()
        const safe = await Safe.create({
            ethAdapter,
            safeAddress: safe_address
        })

        const safeTxHash = await safe.getTransactionHash(transaction)

        const senderSignature = await safe.signTransactionHash(safeTxHash)

        const safeService = this.getSafeService()


        await safeService.proposeTransaction({
            safeAddress: safe_address,
            safeTransactionData: transaction.data,
            safeTxHash,
            senderAddress: await this.getOwnerSigner().getAddress(),
            senderSignature: senderSignature.data,
        })

    }

    getPendingTransactions = async (safeAddress: string) => {
        // TODO: GEt safeService, safeaddress
        const pendingTransactions = (await this.getSafeService().getPendingTransactions(safeAddress)).results
        console.log("Pending TRansactions", pendingTransactions)
        return pendingTransactions
    }

    confirmTransaction = async (safe_address: string, transaction: SafeMultisigTransactionResponse) => {
        // Assumes that the first pending transaction is the transaction you want to confirm
        const safeTxHash = transaction.safeTxHash

        // TODO: Choose env variable from client
        const provider = new ethers.JsonRpcProvider(String(process.env.NEXT_PUBLIC_RPC_URL))
        const ownerSigner = new ethers.Wallet(String(process.env.NEXT_PUBLIC_OWNER_3_PRIVATE_KEY), provider)

        const ethAdapterOwner2 = new EthersAdapter({
            ethers,
            signerOrProvider: ownerSigner
        })

        // TODO: Safe create?
        // TODO: Get safe address
        const safeSdkOwner2 = await Safe.create({
            ethAdapter: ethAdapterOwner2,
            safeAddress: safe_address
        })

        const signature = await safeSdkOwner2.signTransactionHash(safeTxHash)
        const response = await this.getSafeService().confirmTransaction(safeTxHash, signature.data)
    }

    executeTransaction = async (safe_address: string, transaction: SafeMultisigTransactionResponse) => {
        // TODO: GEt safeService

        const ethAdapter = this.getOwnerEthAdapter()
        const safe = await Safe.create({
            ethAdapter,
            safeAddress: safe_address
        })

        const safeTransaction = await this.getSafeService().getTransaction(transaction.safeTxHash)
        const executeTxResponse = await safe.executeTransaction(safeTransaction)
        const receipt = await executeTxResponse.transactionResponse?.wait()

        console.log('Transaction executed:')
        // @ts-ignore
        console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`)
    }

    getBalance = async (safe_address: string) => {
        const ethAdapter = this.getOwnerEthAdapter()
        const safe = await Safe.create({
            ethAdapter,
            safeAddress: safe_address
        })
        const afterBalance = await safe.getBalance()
        console.log(`The final balance of the Safe: ${ethers.formatUnits(afterBalance, 'ether')} ETH`)
    }

    getSafesByOwner = async (owner_address: string) => {
        let { safes } = await this.getSafeService().getSafesByOwner(owner_address)
        console.info(safes)
        return safes

    }


}

