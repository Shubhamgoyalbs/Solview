"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TokenType, WalletType } from "@/utils/types";
import SheetTokenCard from "@/components/SheetTokenCard";
import axios from "@/utils/axios";
import { toast } from "sonner";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Spinner} from "@/components/ui/spinner";
import {
	Connection,
	Keypair,
	SystemProgram,
	LAMPORTS_PER_SOL,
	Transaction,
	sendAndConfirmTransaction,
	PublicKey
} from "@solana/web3.js";

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

	useEffect(() => {
		if (sheetOpenWallet) {
			fetchData();
		} else {
			setData(null);
			setLoading(false);
		}
	}, [sheetOpenWallet]);

	const fetchData = async () => {
		if (!sheetOpenWallet) return;
		setLoading(true);

		const alchemyUrl = process.env.NEXT_PUBLIC_SOL_RPC_URL || '';
		const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

		if (!alchemyApiKey) {
			console.error('NEXT_PUBLIC_ALCHEMY_API_KEY is not defined');
			toast.error("Server error");
			setLoading(false);
			return;
		}

		try {
			const priceResult = await axios.get(
				'https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=SOL&symbols=USDC&symbols=USDT',
				{
					headers: {
						'Accept': 'application/json',
						'Authorization': `Bearer ${alchemyApiKey}`
					}
				}
			);

			const prices = priceResult.data.data;
			const solPrice = parseFloat(prices.find((p: any) => p.symbol === 'SOL')?.prices[0]?.value || "0");
			const usdcPrice = parseFloat(prices.find((p: any) => p.symbol === 'USDC')?.prices[0]?.value || "0");
			const usdtPrice = parseFloat(prices.find((p: any) => p.symbol === 'USDT')?.prices[0]?.value || "0");

			const balanceResponse = await axios.post(alchemyUrl, {
				jsonrpc: "2.0",
				id: 1,
				method: "getBalance",
				params: [sheetOpenWallet.publicKey]
			});

			const solBalance = balanceResponse.data.result.value / 1e9;

			const tokenBalanceResponse = await axios.post(alchemyUrl, {
				jsonrpc: "2.0",
				id: 1,
				method: "getTokenAccountsByOwner",
				params: [
					sheetOpenWallet.publicKey,
					{ programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
					{ encoding: "jsonParsed" }
				]
			});

			let usdcAmount = 0;
			let usdtAmount = 0;

			const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
			const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

			tokenBalanceResponse.data.result.value.forEach((account: any) => {
				const info = account.account.data.parsed.info;
				if (info.mint === USDC_MINT) {
					usdcAmount = info.tokenAmount.uiAmount || 0;
				} else if (info.mint === USDT_MINT) {
					usdtAmount = info.tokenAmount.uiAmount || 0;
				}
			});

			setData({
				sol: { tokenPrice: solPrice, tokenAmount: solBalance },
				usdt: { tokenPrice: usdtPrice, tokenAmount: usdtAmount },
				usdc: { tokenPrice: usdcPrice, tokenAmount: usdcAmount }
			});
		} catch (error: any) {
			console.log('Error: ' + error);
			const errorMessage = error.response?.data?.message || error.message || "Error fetching data";
			toast.error(`Error: ${errorMessage}`);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setSheetOpenWallet(null);
		}
	};

	const handleSolanaSend = async () => {
		setIsSendingToken(true);
		const isValidPublicKey = PublicKey.isOnCurve(new PublicKey(recipientPublicKey).toBytes());
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
		const fromKeypair = Keypair.fromSecretKey(new PublicKey(sheetOpenWallet!.publicKey).toBytes());
		const lamportsToSend = 1_000_000;

		try {
			const connection = new Connection("http://localhost:8899", "confirmed");

			const transferTransaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: fromKeypair.publicKey,
					toPubkey: new PublicKey(recipientPublicKey),
					lamports: lamportsToSend * sendAmount
				})
			);

			const signature = await sendAndConfirmTransaction(
				connection,
				transferTransaction,
				[fromKeypair]
			);
			toast.success('Solana transferred successfully')
		}catch (e){
			console.log('Error while transfer: ' + e);
			toast.error('Error while transfer! try again')
		}finally {
			setLoading(false);
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
					<Button variant='default' disabled={loading} onClick={() => {
						toast.info('swap feature is in development')
					}}>Swap</Button>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default SwapSheet;
