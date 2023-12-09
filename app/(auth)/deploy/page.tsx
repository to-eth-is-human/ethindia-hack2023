'use client'
import React, { useEffect } from "react";
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import { SafeAccountConfig } from '@safe-global/protocol-kit'
import { SafeFactory } from '@safe-global/protocol-kit'
import Script from "next/script";
import Head from "next/head";
import Hero from '@/components/hero'
import Features from '@/components/features'
import FeaturesBlocks from '@/components/features-blocks'
import Testimonials from '@/components/testimonials'
import Newsletter from '@/components/newsletter'

export default function Home() {
  let loading = false;

  function setAddress(account_name: string) {
    const element = document.getElementById("account");
    if (element) {
      element.innerHTML += account_name;
    }
  }

  async function deployContract() {
    console.log("starting");

    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string);

    // Initialize signers
    const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY as string, provider)
    const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY as string, provider)
    const owner3Signer = new ethers.Wallet(process.env.OWNER_3_PRIVATE_KEY as string, provider)

    const ethAdapterOwner1 = new EthersAdapter({
      ethers,
      signerOrProvider: owner2Signer
    })

    const safeApiKit = new SafeApiKit({
      chainId: 1n
    })

    console.log("Waiting to initialize safe");
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 });

    const safeAccountConfig: SafeAccountConfig = {
      owners: [
        await owner1Signer.getAddress(),
        await owner2Signer.getAddress(),
        await owner3Signer.getAddress()
      ],
      threshold: 2,
      // ... (Optional params)
    }

    console.log(safeAccountConfig);

    /* This Safe is tied to owner 1 because the factory was initialized with
    an adapter that had owner 1 as the signer. */
    console.log("Deploy safe");
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

    const safeAddress = await safeSdk.getAddress();

    console.log('Your Safe has been deployed:');
    console.log(`https://goerli.etherscan.io/address/${safeAddress}`);
    console.log(`https://app.safe.global/gor:${safeAddress}`);
  }

  return (
    <>
      <h1 className="mt-24">Welcome to your homepage</h1>
      <p onClick={async () => {
        await deployContract();
      }}>Execute server-side rendering code</p>
      <p hidden={loading}>WAIT</p>
    </>
  )
}

