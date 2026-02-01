"use client"
import { WalletType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import Wallet from "@/components/Wallet";
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

interface WalletListProps {
    wallets: WalletType[];
    addWallet: () => void;
    clearWallets: () => void;
    deleteWallet: (index: number) => void;
    setSheetOpenIndex: (index: number | null) => void;
}

const WalletList = ({ 
    wallets, 
    addWallet, 
    clearWallets, 
    deleteWallet, 
    setSheetOpenIndex 
}: WalletListProps) => {
    return (
        <>
            <div className='flex justify-between items-center my-2'>
                <h2 className='text-2xl font-bold'>Wallets</h2>
                <div className='flex gap-2'>
                    <Button size='lg' variant="outline" onClick={() => addWallet()}>Add Wallet</Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size='lg' variant='destructive'>Clear All</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete all your wallets and recovery phrase.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button variant="destructive" onClick={clearWallets}>
                                        Clear All
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className='flex flex-col gap-6 mt-4'>
                {wallets.map((wallet, index) => (
                    <Wallet 
                        key={wallet.id} 
                        wallet={wallet} 
                        setSheetOpenIndex={setSheetOpenIndex} 
                        walletNumber={index + 1} 
                        deleteWallet={deleteWallet}
                    />
                ))}
            </div>
        </>
    );
};

export default WalletList;
