"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TokenType, WalletType } from "@/utils/types";
import SheetTokenCard from "@/components/SheetTokenCard";
import { toast } from "sonner";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Spinner} from "@/components/ui/spinner";
import {
	Keypair,
	SystemProgram,
	LAMPORTS_PER_SOL,
	Transaction,
	sendAndConfirmTransaction,
	PublicKey
} from "@solana/web3.js";
import {heliusClient, connection, getTokenBalance, getTokenPrice, mintId, isValidSolanaAddress} from "@/utils/sol";
import bs58 from "bs58";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";

interface SwapSheetProps {
	sheetOpenWallet: WalletType | null;
	setSheetOpenWallet: (wallet: WalletType | null) => void;
}

const SwapSheet = ({ sheetOpenWallet, setSheetOpenWallet }: SwapSheetProps) => {
	const [data, setData] = useState<null | {
		sol: TokenType,
		usdc: TokenType,
		usdt: TokenType,
	}>(null);
	const [loading, setLoading] = useState(false);
	const [recipientPublicKey, setRecipientPublicKey] = useState('')
	const [sendAmount, setSendAmount] = useState(0.0)
	const [isSendingToken, setIsSendingToken] = useState(false)

	const fetchData = async () => {
		if (!sheetOpenWallet) return;
		setLoading(true);

		try {
			const solPrice = await getTokenPrice(mintId.sol);
			const usdcPrice = await getTokenPrice(mintId.usdc);
			const usdtPrice = await getTokenPrice(mintId.usdt);

			const solBalance = await heliusClient.wallet.getBalances({
				wallet: sheetOpenWallet.publicKey
			}).then((data) => {
				return (data.balances[0]?.balance || 0) / 1e9;
			})

			const usdcAmount = await getTokenBalance(mintId.usdc, sheetOpenWallet.publicKey);
			const usdtAmount = await getTokenBalance(mintId.usdt, sheetOpenWallet.publicKey);

			setData({
				sol: { tokenPrice: solPrice, tokenAmount: solBalance },
				usdt: { tokenPrice: usdtPrice, tokenAmount: usdtAmount },
				usdc: { tokenPrice: usdcPrice, tokenAmount: usdcAmount }
			});
		} catch (error: any) {
			console.log('Error: ' + error);
			const errorMessage = error.message || "Error fetching data";
			setSheetOpenWallet(null);
			toast.error(`Error: ${errorMessage}`);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (sheetOpenWallet) {
			fetchData();
		} else {
			setData(null);
			setLoading(false);
		}
	}, [sheetOpenWallet]);

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setSheetOpenWallet(null);
		}
	};

	const handleSolanaSend = async () => {
		try {
		setIsSendingToken(true);
		const isValidPublicKey = isValidSolanaAddress(recipientPublicKey)
		if (data!.sol.tokenAmount < sendAmount){
			toast.error('Insufficient balance');
			return;
		}
		if (sendAmount <= 0){
			toast.error('Amount must greater than 0');
			return;
		}
		if(!isValidPublicKey){
			toast.error('Public must a valid key');
			return;
		}
		const fromKeypair = Keypair.fromSecretKey(bs58.decode(sheetOpenWallet!.privateKey));

			const transferTransaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: fromKeypair.publicKey,
					toPubkey: new PublicKey(recipientPublicKey),
					lamports: LAMPORTS_PER_SOL * sendAmount
				})
			);

			const signature = await sendAndConfirmTransaction(
				connection,
				transferTransaction,
				[fromKeypair]
			);
			console.log('Signature of transaction: ' + signature);
			toast.success('Solana transferred successfully')
		}catch (e){
			console.log('Error while transfer: ' + e);
			toast.error('Error while transfer! try again')
		}finally {
			setIsSendingToken(false);
		}
	}

	return (
		<Sheet open={sheetOpenWallet !== null} onOpenChange={handleOpenChange}>
			<SheetContent showCloseButton={false} className='overflow-y-auto'>
				<SheetHeader>
					<SheetTitle className='w-full text-center text-lg'>
						Wallet
					</SheetTitle>
					<SheetDescription className='w-full text-center text-sm'>Send token to someone or swap your tokens here</SheetDescription>
				</SheetHeader>

				{loading && (
					<div className="flex flex-col items-center justify-center min-h-[200px] py-10 w-full">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
						<p className="text-[#fafafa]">Loading wallet data...</p>
					</div>
				)}

				{!loading && data && (
					<div className='w-full h-full px-4 gap-3 flex flex-col justify-between'>
						<div className="flex flex-col w-full gap-2 items-center">
							<SheetTokenCard
								tokenName="Solana"
								tokenSymbol="SOL"
								tokenIcon={
									<img
										src="/solana-sol-logo.svg"
										alt="SOL"
										className="w-8 h-8 bg-transparent"
									/>
								}
								tokenAmount={data.sol.tokenAmount}
								tokenPrice={data.sol.tokenPrice}
							/>
							<SheetTokenCard
								tokenName="Tether"
								tokenSymbol="USDT"
								tokenIcon={
									<img
										src="/tether-usdt-logo.svg"
										alt="USDT"
										className="w-8 h-8 bg-transparent"
									/>
								}
								tokenAmount={data.usdt.tokenAmount}
								tokenPrice={data.usdt.tokenPrice}
							/>
							<SheetTokenCard
								tokenName="USD Coin"
								tokenSymbol="USDC"
								tokenIcon={
									<img
										src="/usd-coin-usdc-logo.svg"
										alt="USDC"
										className="w-8 h-8 bg-transparent"
									/>
								}
								tokenAmount={data.usdc.tokenAmount}
								tokenPrice={data.usdc.tokenPrice}
							/>
						</div>
						<div className='w-full h-full border rounded-md flex flex-col justify-between gap-3 px-3 py-4'>
							<p className='font-semibold text-lg text-center mb-3'>Send Solana</p>
							<div className='w-full flex gap-3'>
								<div className="flex flex-col gap-1.5 flex-1">
									<Label htmlFor="publicKey">Public Key</Label>
									<Input
										id="publicKey"
										placeholder="Recipient address"
										className='w-full focus-visible:ring-0 focus-visible:outline-0'
										value={recipientPublicKey}
										onChange={(e) => setRecipientPublicKey(e.target.value)}
									/>
								</div>
								<div className="flex flex-col gap-1.5 w-24">
									<Label htmlFor="amount">Amount</Label>
									<Input
										id="amount"
										type="number"
										placeholder="0.00"
										className='w-full focus-visible:ring-0 focus-visible:outline-0'
										value={sendAmount}
										onChange={(e) => {
											const val = parseFloat(e.target.value);
											setSendAmount(isNaN(val) ? 0 : val);
										}}
									/>
								</div>
							</div>
							<Button variant="default" className="w-full"
								onClick={handleSolanaSend}
				        disabled={isSendingToken}
							>
								{isSendingToken && <Spinner data-icon="inline-start" />}
								{isSendingToken ? 'Sending' : 'Send'}
							</Button>
						</div>
					</div>
				)}

				<SheetFooter>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="default" disabled={loading} className="w-full">
								Swap
							</Button>
						</DialogTrigger>

						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Swap Tokens</DialogTitle>
								<DialogDescription>
									Swap between your available tokens
								</DialogDescription>
							</DialogHeader>

							{/*SwapUI*/}
						</DialogContent>
					</Dialog>
					<SheetClose asChild>
						<Button variant="outline" disabled={loading}>Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default SwapSheet;
