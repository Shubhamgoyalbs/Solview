import { useState, useEffect } from "react";
import { WalletType } from "@/utils/types";
import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from 'bs58';
import { toast } from "sonner";

export const useWallets = () => {
    const [mnemonic, setMnemonic] = useState("");
    const [derivePathWalletIndex, setDerivePathWalletIndex] = useState<number>(0);
    const [wallets, setWallets] = useState<WalletType[]>([]);

    useEffect(() => {
        const savedMnemonic = localStorage.getItem('mnemonic');
        const savedWallets = localStorage.getItem('wallets');
        const savedIndex = localStorage.getItem('derivePathWalletIndex');

        if (savedMnemonic) {
	        setMnemonic(savedMnemonic);
        }
        if (savedWallets) setWallets(JSON.parse(savedWallets));
        if (savedIndex) setDerivePathWalletIndex(parseInt(savedIndex));
    }, []);

    const addWallet = (mnemonicInput?: string) => {
        const currentMnemonic = mnemonicInput || mnemonic;
        if (!currentMnemonic) return;

        try {
            const seedBuffer = mnemonicToSeedSync(currentMnemonic);

            setDerivePathWalletIndex((prevIndex) => {
                const path = `m/44'/501'/0'/${prevIndex}'`;
                const derivedPath = derivePath(path, seedBuffer.toString('hex'));
                const secret = nacl.sign.keyPair.fromSeed(derivedPath.key).secretKey;
                const keypair = Keypair.fromSecretKey(secret);
                const pubKey = keypair.publicKey.toBase58();
                const secretEncoded = bs58.encode(secret);

                const newWallet: WalletType = {
                    id: prevIndex,
                    publicKey: pubKey,
                    privateKey: secretEncoded
                };

                setWallets((prevWallets) => {
                    const updatedWallets = [...prevWallets, newWallet];
                    localStorage.setItem('wallets', JSON.stringify(updatedWallets));
                    return updatedWallets;
                });

                const nextIndex = prevIndex + 1;
                localStorage.setItem('derivePathWalletIndex', nextIndex.toString());
                return nextIndex;
            });

            toast.success('Wallet added successfully');
        } catch (error) {
            console.error("Failed to add wallet:", error);
            toast.error("Failed to add wallet");
        }
    };

    const clearWallets = () => {
        setMnemonic("");
        setWallets([]);
        setDerivePathWalletIndex(0);
        localStorage.removeItem('mnemonic');
        localStorage.removeItem('wallets');
        localStorage.removeItem('derivePathWalletIndex');
        toast.success('Wallets cleared successfully');
    };

    const handleMnemonicGeneration = (mnemonicValue?: string) => {
        let finalMnemonic = mnemonicValue;
        if (finalMnemonic) {
            const length = finalMnemonic.trim().split(/\s+/).length;
            if (length !== 24) {
                toast.error("Mnemonic must be exactly 24 words");
                return false;
            }
            if (!validateMnemonic(finalMnemonic)) {
                toast.error("Invalid mnemonic phrase");
                return false;
            }
        } else {
            finalMnemonic = generateMnemonic(256);
        }
        setMnemonic(finalMnemonic);
        localStorage.setItem('mnemonic', finalMnemonic);

        setWallets([]);
        setDerivePathWalletIndex(0);

        addFirstWallet(finalMnemonic);
        return true;
    };

    const addFirstWallet = (currentMnemonic: string) => {
        try {
            const seedBuffer = mnemonicToSeedSync(currentMnemonic);
            const path = `m/44'/501'/0'/0'`;
            const derivedPath = derivePath(path, seedBuffer.toString('hex'));
            const secret = nacl.sign.keyPair.fromSeed(derivedPath.key).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            const pubKey = keypair.publicKey.toBase58();
            const secretEncoded = bs58.encode(secret);

            const newWallet: WalletType = {
                id: 0,
                publicKey: pubKey,
                privateKey: secretEncoded
            };

            const updatedWallets = [newWallet];
            const nextIndex = 1;

            setWallets(updatedWallets);
            setDerivePathWalletIndex(nextIndex);

            localStorage.setItem('wallets', JSON.stringify(updatedWallets));
            localStorage.setItem('derivePathWalletIndex', nextIndex.toString());
            toast.success('Wallet added successfully');
        } catch (error) {
            console.error("Failed to add initial wallet:", error);
            toast.error("Failed to add initial wallet");
        }
    };

    const deleteWallet = (id: number) => {
        setWallets((prevWallets) => {
            const updatedWallets = prevWallets.filter((wallet) => wallet.id !== id);
            localStorage.setItem('wallets', JSON.stringify(updatedWallets));
            return updatedWallets;
        });
    };

    return {
        mnemonic,
        wallets,
        addWallet,
        clearWallets,
        handleMnemonicGeneration,
        deleteWallet
    };
};
