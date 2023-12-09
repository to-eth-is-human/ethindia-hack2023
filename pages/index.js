export const metadata = {
  title: 'Home - Simple',
  description: 'Page description',
}

import {React, useEffect} from "react";
let Web3 = require('web3');
import Script from "next/script";
import Head from "next/head";
import Hero from '@/components/hero'
import Features from '@/components/features'
import FeaturesBlocks from '@/components/features-blocks'
import Testimonials from '@/components/testimonials'
import Newsletter from '@/components/newsletter'

export default function Home({data}) {


function setAddress (account_name) {
  document.getElementById("account").innerHTML += account_name
}
  
useEffect(() => {
  window.ethereum ?
    ethereum.request({ method: "eth_requestAccounts" }).then(
      (accounts) => {
        console.log(accounts)
        // setAddress(accounts[0])
        // let w3 = new Web3(ethereum)
        // setWeb3(w3)
        setAddress(accounts[0])
    }).catch((err) => console.log(err))
  : console.log("Please install MetaMask")
}, [])

  return (
    <>
      {/* <Hero />
      <Features />
      <FeaturesBlocks />
      <Testimonials />
      <Newsletter /> */}
      <h1>Welcome to your homepage</h1>
      <p id="account">Your account ID is: </p>
      
    </>
  )
}
