"use client"
import { useState } from "react";
import { IconWallet } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
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
    Empty,
    EmptyHeader,
    EmptyContent,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InitialStateProps {
    handleMnemonicGeneration: (mnemonicValue?: string) => void;
}

const InitialState = ({ handleMnemonicGeneration }: InitialStateProps) => {
    const [inputMnemonic, setInputMnemonic] = useState("");

    return (
        <div className='flex-1 flex justify-center items-center h-full w-full'>
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
    );
};

export default InitialState;
