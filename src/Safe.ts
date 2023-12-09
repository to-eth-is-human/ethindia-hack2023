
import { React, useEffect } from "react";
import { ethers, Wallet } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
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
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'





class SafeUtil {

    sendEth = async (to_address: string) => {
        console.log("Sending eth")


        const provider = new ethers.JsonRpcProvider(String(process.env.NEXT_PUBLIC_RPC_URL))

        const owner2Signer = new ethers.Wallet(String(process.env.NEXT_PUBLIC_OWNER_2_PRIVATE_KEY), provider)


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

        const tx = await owner2Signer.sendTransaction(transactionParameters)

        console.log('Fundraising.')
        console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`)
    }



    deployContract = async (n: number) => {

        console.log("DEploy contract of N accounts and threshold = N/2 + 1")

        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)

        // Initialize signers
        let signers: Wallet[] = [];
        for (let i = 1; i <= n; i++) {

            const signer = new ethers.Wallet(String(process.env[`NEXT_PUBLIC_OWNER_${String(i)}_PRIVATE_KEY`]), provider)
            signers.push(signer)
        }


        // This must be the person who has eth
        const ownerSigner = new ethers.Wallet(String(process.env['NEXT_PUBLIC_OWNER_2_PRIVATE_KEY']), provider)
        const ethAdapterOwner = new EthersAdapter({
            ethers,
            signerOrProvider: ownerSigner
        })

        const safeApiKit = new SafeApiKit({
            chainId: 1n
        })

        console.log("Waiting to initialise safe")
        const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner })

        let owners: String[] = [];
        for (let i = 0; i < n; i++) {
            let address = await signers[i].getAddress();
            owners.push(address)
        }
        const safeAccountConfig = {
            owners: owners,
            threshold: n / 2 + 1,
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

        // Any address can be used. In this example you will use vitalik.eth
        const amount = ethers.parseUnits(ether, 'ether').toString()

        const safeTransactionData: MetaTransactionData = {
            to: dest_address,
            data: '0x',
            value: amount
        }
        // Create a Safe transaction with the provided parameters
        // TODO: Get safesdkowner
        const safeTransaction = await safeSdkOwner1.createTransaction({ transactions: [safeTransactionData] })
    }


    proposeTransaction = async (tx_hash: string) => {

        // Deterministic hash based on transaction parameters
        // TODO: Get safeSdkOwner1, safe service,
        \
        const senderSignature = await safeSdkOwner1.signTransactionHash(tx_hash)

        await safeService.proposeTransaction({
            safeAddress,
            safeTransactionData: safeTransaction.data,
            safeTxHash,
            senderAddress: await owner1Signer.getAddress(),
            senderSignature: senderSignature.data,
        })

    }

    getPendingTransactions = async () => {
        // TODO: GEt safeService, safeaddress
        const pendingTransactions = await safeService.getPendingTransactions(safeAddress).results
        return pendingTransactions
    }

    confirmTransaction = async (transaction) => {
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
            safeAddress
        })

        const signature = await safeSdkOwner2.signTransactionHash(safeTxHash)
        const response = await safeService.confirmTransaction(safeTxHash, signature.data)
    }

    executeTransaction = async (safeTxHash) => {
        // TODO: GEt safeService
        const safeTransaction = await safeService.getTransaction(safeTxHash)
        const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
        const receipt = await executeTxResponse.transactionResponse?.wait()

        console.log('Transaction executed:')
        console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`)
    }

    getBalance = async () => {
        const afterBalance = await safeSdk.getBalance()

        console.log(`The final balance of the Safe: ${ethers.formatUnits(afterBalance, 'ether')} ETH`)
    }


}


