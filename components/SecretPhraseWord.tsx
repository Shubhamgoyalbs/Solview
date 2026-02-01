interface SecretPhraseWordProps {
    word: string;
}

const SecretPhraseWord = ({ word }: SecretPhraseWordProps) => {
    return (
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all duration-200 cursor-pointer bg-[#151515] rounded-md border border-white/5 min-w-[120px] max-w-[200px]">
            <span className="text-white font-semibold text-md">{word}</span>
        </div>
    );
};

export default SecretPhraseWord;
