"use client"
import { useState } from "react";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import { toast } from "sonner";
import SecretPhraseWord from "./SecretPhraseWord";

interface SecretPhraseProps {
    mnemonic: string;
}

const SecretPhrase = ({ mnemonic }: SecretPhraseProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const copyToClipboard = async () => {
        if (!isOpen) return;
        await navigator.clipboard.writeText(mnemonic);
        toast.success('Secret phrase copied');
    };

    return (
        <div
            className={isOpen ? 'my-2 rounded-lg border flex flex-col gap-4 px-8 py-7 cursor-pointer' : 'my-2 rounded-lg border flex flex-col gap-4 px-8 py-7'}
            onClick={copyToClipboard}
        >
            <div className='flex items-center justify-between'>
                <p className='text-3xl font-bold text-white'>
                    Your secret phrase
                </p>
                <button
                    className='cursor-pointer focus:outline-0 focus:ring-0 text-white/50 hover:text-white transition-colors'
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen)
                    }}
                >
                    {isOpen ? <IconCaretUp size={32} /> : <IconCaretDown size={32} />}
                </button>
            </div>
            {isOpen && (
                <div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 my-6 w-full">
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
    );
};

export default SecretPhrase;
