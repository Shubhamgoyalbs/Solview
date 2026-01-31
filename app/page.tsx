"use client"

import {useState} from "react";
import {generateMnemonic, validateMnemonic, mnemonicToSeedSync} from 'bip39'
import {walletType} from "@/utils/types";

export default function Home() {
  const [mnemonic, setMnemonic] = useState("");
	const [derivePathWalletIndex, setDerivePathWalletIndex] = useState(0);
	const [wallets, setWallets] = useState<walletType[]>([]);
	const addWallet = () => {

	}

	const clearWallets = () => {

	}

	const handleMnemonicGeneratation = (mnemonic?: string) => {
		if (mnemonic){
			const length = mnemonic.split(' ').length
			if (length != 24){
				return false;
			}
			if (!validateMnemonic(mnemonic)){
				return false
			}
		}else {
			mnemonic = generateMnemonic(256)
		}
		setMnemonic(mnemonic)
		localStorage.setItem('mnemonic', mnemonic);
		return true
	}

	return (
	  <div className='bg-[#0a0a0a] flex flex-col w-full h-screen'>
			<div>
				navbar
			</div>
		  <div>
main scrolable conetnt
		  </div>
		  <div>

		  </div>
	  </div>
  );
}
// card #181818 , white #fafafa, light black #151515
