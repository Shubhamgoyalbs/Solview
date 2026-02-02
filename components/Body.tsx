"use client"

import { useState } from "react";
import { useWallets } from "@/hooks/useWallets";
import SecretPhrase from "@/components/SecretPhrase";
import WalletList from "@/components/WalletList";
import InitialState from "@/components/InitialState";
import SwapSheet from "@/components/SwapSheet";
import {WalletType} from "@/utils/types";

const Body = () => {
	const {
		mnemonic,
		wallets,
		addWallet,
		clearWallets,
		handleMnemonicGeneration,
		deleteWallet
	} = useWallets();

	const [sheetOpenWallet, setSheetOpenWallet] = useState<WalletType | null>(null);

	return (
		<div className='py-2 px-4 flex-1 w-full flex flex-col min-h-0'>
			{mnemonic ? (
				<div className="flex-1">
					<div className='w-full overflow-y-auto h-full flex flex-col gap-3'>
						<SecretPhrase mnemonic={mnemonic} />

						<WalletList
							wallets={wallets}
							addWallet={addWallet}
							clearWallets={clearWallets}
							deleteWallet={deleteWallet}
							setSheetOpenWallet={setSheetOpenWallet}
						/>

						<SwapSheet
							sheetOpenWallet={sheetOpenWallet}
							setSheetOpenWallet={setSheetOpenWallet}
						/>
					</div>
				</div>
			) : (
				<InitialState handleMnemonicGeneration={handleMnemonicGeneration} />
			)}
		</div>
	);
};

export default Body;
