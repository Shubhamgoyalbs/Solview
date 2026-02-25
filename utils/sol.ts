import axios from "axios";
import { createHelius } from "helius-sdk";
import { toast } from "sonner";
import {Connection, PublicKey} from "@solana/web3.js";

const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

if (!apiKey) {
	toast.error('Server environment error')
	throw new Error('Server env error')
}

export const heliusClient = createHelius({
	apiKey: apiKey,
	network: "mainnet",
});


export const connection = new Connection(
	`https://mainnet.helius-rpc.com/?api-key=${apiKey}`,
	"finalized"
);

export const getTokenPrice = async (mintId: string): Promise<number> => {
	try {
		const response = await heliusClient.getAsset({
			id: mintId,
		});

		const price =
			response?.token_info?.price_info?.price_per_token;

		return price ? Number(price) : 0;
	} catch (e) {
		console.error("Error fetching token price:", e);
		return 0;
	}
};

export const getTokenBalance = async (mintId: String, publicKey: string) => {
	try {
		const response = await connection.getParsedTokenAccountsByOwner(
			new PublicKey(publicKey),
			{
				mint: new PublicKey(mintId)
			}
		);

		const balance = response.value[0]?.account.data.parsed.info.tokenAmount.uiAmount

		return balance ? Number(balance) : 0;
	} catch (e) {
		console.log(e);
		return 0
	}
}

export const getQuote = async (prvtKey: string, pubKey: string, inMIntId: string, outMintId: string, amount: number) => {
	try {
		const response = await axios.get(
			"https://api.jup.ag/ultra/v1/order",
			{
				params: {
					inputMint: inMIntId,
					outputMint: outMintId,
					amount,
					taker: pubKey
				},
				headers: {
					"x-api-key": process.env.NEXT_PUBLIC_JUPYITER_API_KEY
				}
			}
		);

		if (response.status !== 200) {
			throw new Error('Server Error please try again later')
		}

		const transaction: string = response.data.transaction || '';
		const outAmount: number = response.data.routePlan.outAmount;

		return {
			transaction,
			outAmount
		}

	} catch (error: any) {
		console.error("Error fetching quote:", error.response?.data || error.message);
	}
};

export const isValidSolanaAddress = (address: string): boolean => {
	try {
		new PublicKey(address);
		return true;
	} catch (err) {
		return false;
	}
}

export const mintId = {
	sol: 'So11111111111111111111111111111111111111112',
	usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
	usdt: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
}

export const execute = async () => {

}
