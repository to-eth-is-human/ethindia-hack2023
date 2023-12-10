"use client"
import { ChangeEvent, useState } from "react";


export default function SignUp() {
  const [memberCount, setMemberCount] = useState(1); // State to track the number of members
  const [walletIDs, setWalletIDs] = useState(Array(memberCount).fill('')); // State to store wallet IDs

  const handleMemberCountChange = (event: { target: { value: string; }; }) => {
    const count = parseInt(event.target.value, 10);
    if (count >= 1) {
      setMemberCount(count);
      setWalletIDs(Array(count).fill('')); // Reset the wallet IDs array based on the count
    }
  };

  const handleWalletIDChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const updatedWalletIDs = [...walletIDs];
    updatedWalletIDs[index] = event.target.value;
    setWalletIDs(updatedWalletIDs);
  };

  const renderWalletIDFields = () => {
    return Array.from({ length: memberCount }, (_, index) => (
      <div key={index} className="flex flex-wrap -mx-3 mb-4">
        <div className="w-full px-3">
          <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={`walletID-${index}`}>
            Wallet ID for Member {index + 1}
          </label>
          <input
            id={`walletID-${index}`}
            type="text"
            className="form-input w-full text-gray-800"
            placeholder={`Private Key of Wallet for Member ${index + 1}`}
            value={walletIDs[index]}
            onChange={(event) => handleWalletIDChange(index, event)}
            required
          />
        </div>
      </div>
    ));
  };
  
  return (
    <section className="bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Page header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2">Welcome. We exist to make Xchanges between DApps easier.</h2>
          </div>

          {/* Form */}
          <div className="max-w-sm mx-auto">
            <form>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="name">Name of the organization <span className="text-red-600">*</span></label>
                  <input id="name" type="text" className="form-input w-full text-gray-800" placeholder="Organization name" required />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email">DAO Members Count<span className="text-red-600">*</span></label>
                  <input
                id="memberCount"
                type="number"
                className="form-input w-full text-gray-800"
                placeholder="1"
                value={memberCount}
                onChange={handleMemberCountChange}
                required
              />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                {renderWalletIDFields()}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button className="btn text-white bg-blue-600 hover:bg-blue-700 w-full">Initiate MultiSig Wallet with Safe</button>
                </div>
              </div>
              <div className="text-sm text-gray-500 text-center mt-3">
                By creating an account, you agree to the <a className="underline" href="#0">terms & conditions</a>, and our <a className="underline" href="#0">privacy policy</a>.
              </div>
            </form>          
            </div>
        </div>
      </div>
    </section>
  )
}
