"use client"

import {useEffect, useState} from "react";
import {WalletType} from "@/utils/types";
import {cn} from "@/lib/utils";
import {generateMnemonic, validateMnemonic, mnemonicToSeedSync} from "bip39";
import {
	Empty,
	EmptyHeader,
	EmptyContent,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription
} from "@/components/ui/empty";
import { Button } from '@/components/ui/button';
import bs58  from 'bs58'
import {IconWallet, IconCaretDown, IconCaretUp} from '@tabler/icons-react'
import {derivePath} from 'ed25519-hd-key';
import {Keypair} from "@solana/web3.js";
import nacl from "tweetnacl";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {toast} from "sonner";
import Wallet from "@/components/Wallet";
import SecretPhraseWord from "@/components/SecretPhraseWord";

const Body = () => {

	const [mnemonic, setMnemonic] = useState("");
	const [inputMnemonic, setInputMnemonic] = useState<string>("");
	const [derivePathWalletIndex, setDerivePathWalletIndex] = useState<number>(0);
	const [sheetOpenIndex, setSheetOpenIndex] = useState<number | null>(null)
	const [wallets, setWallets] = useState<WalletType[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false)

	useEffect(() => {
		const loadData = () => {
			const savedMnemonic = localStorage.getItem('mnemonic');
			const savedWallets = localStorage.getItem('wallets');
			const savedIndex = localStorage.getItem('derivePathWalletIndex');

			if (savedMnemonic) {
				setMnemonic(savedMnemonic);
			}
			if (savedWallets) {
				setWallets(JSON.parse(savedWallets));
			}
			if (savedIndex) {
				setDerivePathWalletIndex(parseInt(savedIndex));
			}
		};

		loadData();
	}, []);
	const addWallet = (mnemonicInput?: string) => {
		const currentMnemonic = mnemonicInput || mnemonic;
		if (!currentMnemonic) return;

		const seedBuffer = mnemonicToSeedSync(currentMnemonic);
		const path = `m/44'/501'/0'/${derivePathWalletIndex}'`;
		const derivedPath = derivePath(path, seedBuffer.toString('hex'));
		const secret = nacl.sign.keyPair.fromSeed(derivedPath.key).secretKey;
		const keypair = Keypair.fromSecretKey(secret);
		const pubKey = keypair.publicKey.toBase58();
		const secretEncoded = bs58.encode(secret);

		const newWallet: WalletType = {
			id: derivePathWalletIndex,
			publicKey: pubKey,
			privateKey: secretEncoded
		};

		const updatedWallets = [...wallets, newWallet];
		const nextIndex = derivePathWalletIndex + 1;

		setWallets(updatedWallets);
		setDerivePathWalletIndex(nextIndex);

		localStorage.setItem('wallets', JSON.stringify(updatedWallets));
		localStorage.setItem('derivePathWalletIndex', nextIndex.toString());
		toast.success('Wallet added successfully');
	};
	const clearWallets = () => {
		setMnemonic("");
		setWallets([]);
		setDerivePathWalletIndex(0);
		localStorage.removeItem('mnemonic');
		localStorage.removeItem('wallets');
		localStorage.removeItem('derivePathWalletIndex');
		toast.success('Wallets cleared successfully');
	}
	const handleMnemonicGeneration = (mnemonicValue?: string) => {
		let finalMnemonic = mnemonicValue;
		if (finalMnemonic){
			const length = finalMnemonic.trim().split(/\s+/).length
			if (length != 24){
				toast.error("Mnemonic must be exactly 24 words");
				return false;
			}
			if (!validateMnemonic(finalMnemonic)){
				toast.error("Invalid mnemonic phrase");
				return false
			}
		} else {
			finalMnemonic = generateMnemonic(256)
		}
		setMnemonic(finalMnemonic)
		localStorage.setItem('mnemonic', finalMnemonic);
		addWallet(finalMnemonic)
		return true
	}
	const deleteWallet = (index: number)=> {
		const updatedWallets = wallets.filter((wallet) => {
			return wallet.id != index
		})
		setWallets(updatedWallets);
	}

	return (
		<div className='py-2 px-4 h-full w-full'>
			{ mnemonic ?
				<div>
					<div className='w-full overflow-y-auto h-full flex flex-col gap-3'>
						<div className={isOpen ? 'my-2 rounded-lg border flex flex-col gap-4 px-8 py-7 cursor-pointer' : 'my-2 rounded-lg border flex flex-col gap-4 px-8 py-7'} onClick={async () => {
							await navigator.clipboard.writeText(mnemonic);
							toast.success('Secret phrase copied')
						}}>
							<div className='flex items-center justify-between'>
								<p className='text-3xl font-bold text-white'>
									Your secret phrase
								</p>
								<button className='cursor-pointer focus:outline-0 focus:ring-0 text-white/50 hover:text-white transition-colors' onClick={(e) => {
									e.stopPropagation();
									setIsOpen(!isOpen)
								}}>{
									isOpen ? <IconCaretUp size={32} /> : <IconCaretDown size={32} />
								}</button>
							</div>
							{isOpen && (
								<div>
									<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 my-6 w-full">
										{mnemonic.split(' ').map((word, index) => (
											<SecretPhraseWord key={index} word={word}/>
										))}
									</div>
									<p className='text-white/50'>
										click anywhere to copy
									</p>
								</div>
							)}
						</div>
						<div className='flex justify-between items-center my-2'>
							<h2 className='text-2xl font-bold'>Wallets</h2>
							<div className='flex gap-2'>
								<Button size='lg' variant="outline" onClick={() => addWallet()}>Add Wallet</Button>
								<Button size='lg' variant='destructive' onClick={clearWallets}>Clear All</Button>
							</div>
						</div>
						<div className='flex flex-col gap-6 mt-4'>
							{wallets.map((wallet, index) => (
								<Wallet key={wallet.id} wallet={wallet} setSheetOpenIndex={setSheetOpenIndex} walletNumber={index+1} deleteWallet={deleteWallet}/>
							))}
						</div>
						<Sheet open={sheetOpenIndex !== null}
			        onOpenChange={
								(open) => {
									if(!open) {
										setSheetOpenIndex(null);
									}
								}
							}
						>
							<SheetContent>
								<SheetHeader>
									<SheetTitle className='mx-auto text-2xl'>Wallet{sheetOpenIndex}</SheetTitle>
									<SheetDescription>
										Make changes to your profile here. Click save when you&apos;re done.
									</SheetDescription>
								</SheetHeader>
								{/*code for swap*/}
								<SheetFooter>
									<SheetClose asChild>
										<Button variant="outline">Close</Button>
									</SheetClose>
								</SheetFooter>
							</SheetContent>
						</Sheet>
					</div>
				</div>
				:
				<div className='flex justify-center items-center h-full w-full'>
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<IconWallet />
							</EmptyMedia>
							<EmptyTitle>No wallets yet</EmptyTitle>
							<EmptyDescription>
								SolView uses a 24-word recovery phrase to securely manage your Solana wallets.
								Generate a new one to get started, or import your existing phrase.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent className="flex-row justify-center gap-2">
							<Dialog >
								<DialogTrigger asChild>
									<Button size='lg' variant="outline">Import Seed</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-xl">
									<DialogHeader>
										<DialogTitle>Import Seed Phrase</DialogTitle>
										<DialogDescription>
											Enter your 24-word recovery phrase to import your wallet.
										</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="grid gap-2">
											<Label htmlFor="mnemonic">Seed Phrase</Label>
											<Input
												id="mnemonic"
												type="password"
												placeholder="Enter 24 words separated by spaces"
												value={inputMnemonic}
												onChange={(e) => setInputMnemonic(e.target.value)}
												className={cn("h-20 py-2 items-start")}
											/>
										</div>
									</div>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline">Cancel</Button>
										</DialogClose>
										<DialogClose asChild>
											<Button
												type="button"
												onClick={() => handleMnemonicGeneration(inputMnemonic)}
											>
												Import
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
							<Button
								size='lg'
								onClick={() => handleMnemonicGeneration()}
							>
								Generate Seed
							</Button>
						</EmptyContent>
					</Empty>
				</div>
			}
		</div>
	);
};

export default Body;
