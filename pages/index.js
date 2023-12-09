export const metadata = {
  title: 'Home - Simple',
  description: 'Page description',
}

import {React, useEffect} from "react";
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
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

export default function Home() {
  let loading =false;



function setAddress (account_name) {
  document.getElementById("account").innerHTML += account_name
}


 async function deployContract(){
  console.log("starting")

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_1_PRIVATE_KEY, provider)
const owner2Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_2_PRIVATE_KEY, provider)
const owner3Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_3_PRIVATE_KEY, provider)

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner2Signer
})

const safeApiKit = new SafeApiKit({
  chainId: 1n
})

console.log("Waiting to initialise safe")
const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })

const safeAccountConfig = {
  owners: [
    await owner1Signer.getAddress(),
    await owner2Signer.getAddress(),
    await owner3Signer.getAddress()
  ],
  threshold: 2,
  // ... (Optional params)
}

console.log(safeAccountConfig)

/* This Safe is tied to owner 1 because the factory was initialized with
an adapter that had owner 1 as the signer. */
console.log("DEploy safe")
const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })

const safeAddress = await safeSdk.getAddress()

console.log('Your Safe has been deployed:')
console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
console.log(`https://app.safe.global/gor:${safeAddress}`)
}
  


  return (
    <>
      {/* <Hero />
      <Features />
      <FeaturesBlocks />
      <Testimonials />
      <Newsletter /> */}
      <h1>Welcome to your homepage</h1>
      <p onClick={async()=>{
          await deployContract()
          
          }}>Execure server side rendering code</p>
      <p hidden={loading}>WAIT</p>
      
    </>
  )
}

