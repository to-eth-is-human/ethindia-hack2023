'use client';
import { SafeAuthPack, SafeAuthInitOptions, AuthKitSignInData } from "@safe-global/auth-kit";
import Safe, { EthersAdapter, SafeFactory } from "@safe-global/protocol-kit";
import { ethers, BrowserProvider, Eip1193Provider } from "ethers";
import { GelatoRelayPack } from '@safe-global/relay-kit'
import RPC from "../../web3RPC";
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'
import { useState, useEffect, createContext, useContext } from 'react';


import Image from 'next/image'
import SafeLogo from '@/public/images/safe_logo.png'


export default function SignIn() {

  const [safeAuth, setSafeAuth] = useState<SafeAuthPack>();
  const [userInfo, setUserInfo] = useState<any>();
  const [provider, setProvider] = useState<Eip1193Provider | null>(null);
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<AuthKitSignInData | null>(null);


  useEffect(() => {
    const init = async () => {
      try {
        const safeAuthInitOptions: SafeAuthInitOptions = {
          showWidgetButton: false,
          enableLogging: true,
          chainConfig: {
            blockExplorerUrl: "https://goerli.etherscan.io",
            chainId: "0x5",
            displayName: "Ethereum Goerli",
            rpcTarget: "wss://ethereum-goerli.publicnode.com",
            ticker: "ETH",
            tickerName: "Ethereum",
          },
        };

        const safeAuthPack = new SafeAuthPack();
        await safeAuthPack.init(safeAuthInitOptions);

        setSafeAuth(safeAuthPack);
        if (safeAuthPack.isAuthenticated) {
          const signInInfo = await safeAuthPack?.signIn();
          setSafeAuthSignInResponse(signInInfo);
          setProvider(safeAuthPack.getProvider() as Eip1193Provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!safeAuth) {
      return;
    }
    const signInInfo = await safeAuth.signIn();

    const userInfo = await safeAuth.getUserInfo();

    setSafeAuthSignInResponse(signInInfo);
    setUserInfo(userInfo || undefined);
    setProvider(safeAuth.getProvider() as Eip1193Provider);
  };

  const logout = async () => {
    if (!safeAuth) {
      return;
    }
    await safeAuth.signOut();
    setProvider(null);
    setSafeAuthSignInResponse(null);
  };

  const createSafe = async () => {
    const provider = new BrowserProvider(safeAuth?.getProvider() as Eip1193Provider);
    const signer = await provider.getSigner();
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    } as any);

  
    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safe: Safe = await safeFactory.deploySafe({
      safeAccountConfig: { threshold: 1, owners: [safeAuthSignInResponse?.eoa as string] },
    });
    };

    const getChainId = async () => {
      if (!provider) {
        
        return;
      }
      const rpc = new RPC(provider);
      const chainId = await rpc.getChainId();
    };
  
    const getAccounts = async () => {
      if (!provider) {
        return;
      }
      const rpc = new RPC(provider);
      const address = await rpc.getAccounts();
    };
  
    const getBalance = async () => {
      if (!provider) {
        return;
      }
      const rpc = new RPC(provider);
      const balance = await rpc.getBalance();
    };
  
    const sendTransaction = async () => {
      if (!provider) {
        return;
      }
      const rpc = new RPC(provider);
      const receipt = await rpc.sendTransaction();
    };

  
    const signMessage = async () => {
      if (!provider) {
        return;
      }
      const rpc = new RPC(provider);
      const signedMessage = await rpc.signMessage();
    };


  return (
    typeof window !== 'undefined' ? <div></div> :
    <div>
    <section className="bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {!provider ? 
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Page header */}
          <div className="max-w-3xl mx-auto text-center pb-10">
            <h1 className="text-xl">Welcome to DappXChange Boardsuite. Sign up with SafeAuth using Google to get your smart contract wallet.</h1>
          </div>
          
          <Image className="md:max-w-none mx-auto rounded pb-4" src={SafeLogo} width={100} alt="Safe Logo" />           

          {/* Form */}
          <div className="max-w-sm mx-auto">
            <form>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button onClick={login} className="btn text-white bg-blue-600 hover:bg-blue-700 w-full">Sign in using SafeAuth</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        : (
          safeAuthSignInResponse?.eoa ? (
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Page header */}
          <div className="max-w-3xl mx-auto text-center pb-10">
            <h1 className="text-xl">Welcome to DappXChange Boardsuite. <br></br><span className="text-lg">You have been logged in with Safe Auth.</span></h1>
          </div>
          
          <Image className="md:max-w-none mx-auto rounded pb-4" src={SafeLogo} width={100} alt="Safe Logo" />           

          {/* Form */}
          <div className="mx-auto">
            <form>
              <div className="flex flex-wrap mt-6">
                <div className="mx-auto px-3 bg-blue-400">
                <p className="text-center p-4 font-bold">
                  Your EOA{" "}
                  <a className="font-bold text-white underline" href={`https://goerli.etherscan.io/address/${safeAuthSignInResponse?.eoa}`} target="_blank">
                  {safeAuthSignInResponse?.eoa}
                  </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

            
          ) : null
        ) }{" "}
      </div>
    </section>
    </div>
  )
}
