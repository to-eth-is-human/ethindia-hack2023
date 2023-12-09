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


/*
Failures:
* deploySafe returns error even after contract creation is successful
* If contract already exists, it should give the right reason
* Unable to convert to hexadecimal from BigInt
*/
export default function Home() {
  let loading =false;

  function bnToHex(bn) {
    bn = BigInt(bn);
  
    var pos = true;
    if (bn < 0) {
      pos = false;
      bn = bitnot(bn);
    }
  
    var hex = bn.toString(16);
    if (hex.length % 2) { hex = '0' + hex; }
  
    if (pos && (0x80 & parseInt(hex.slice(0, 2), 16))) {
      hex = '00' + hex;
    }
  
    return hex;
  }
  
  function bitnot(bn) {
    bn = -bn;
    var bin = (bn).toString(2)
    var prefix = '';
    while (bin.length % 8) { bin = '0' + bin; }
    if ('1' === bin[0] && -1 !== bin.slice(1).indexOf('1')) {
      prefix = '11111111';
    }
    bin = bin.split('').map(function (i) {
      return '0' === i ? '1' : '0';
    }).join('');
    return BigInt('0b' + prefix + bin) + BigInt(1);
  }
  

function setAddress (account_name) {
  document.getElementById("account").innerHTML += account_name
}

async function sendEth(account_name) {
  console.log("Sending eth"
  )
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)

  const owner2Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_2_PRIVATE_KEY, provider)

  const safeAddress = "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"//safeSdk.getAddress()

  // const safeAmount = 'Ox0080'

  const safeAmount = ethers.utils.parseUnits('0.01', 'ether').toString();

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


 async function deployContract(){
  console.log("starting")

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_1_PRIVATE_KEY, provider)
const owner2Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_2_PRIVATE_KEY, provider)
const owner3Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_3_PRIVATE_KEY, provider)
const owner4Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_4_PRIVATE_KEY, provider)


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
    await owner3Signer.getAddress(),
    await owner4Signer.getAddress()
  ],
  threshold: 1,
  // ... (Optional params)
}

console.log(safeAccountConfig)

/* This Safe is tied to owner 1 because the factory was initialized with
an adapter that had owner 1 as the signer. */
console.log("DEploy safe")

try{
  // Error: SafeProxy was not deployed correctly
  // if "was not deployed" in error message,
  // Just display this URL
  // https://goerli.etherscan.io/address/0xd6c9cadf5ac7c704218dc8f74787f4e3acc69223 (address of whoever tried to deploy)



  // Error: Create 2 call failed
const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
 }
 catch(err){
  console.log(err)
 }

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
      <p onClick={async() => {
        await sendEth("0xD6c9CAdF5AC7C704218dC8F74787f4E3ACC69223")
      }}> Send some potatoes!</p>
      
    </>
  )
}

