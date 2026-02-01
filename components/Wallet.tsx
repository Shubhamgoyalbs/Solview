import {WalletType} from "@/utils/types";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Eye, EyeOff, Trash2} from "lucide-react";

interface WalletProps {
	wallet: WalletType,
	setSheetOpenIndex: (value: (((prevState: (number | null)) => (number | null)) | number | null)) => void,
	deleteWallet: (index: number) => void,
	walletNumber: number
}

const Wallet = (props: WalletProps) => {

	const [eyeOpen, setEyeOpen] = useState<boolean>(false)

	return (
		<div className='w-full flex flex-col gap-0 rounded-lg border-1'>
			<div className='flex justify-between items-center px-12 py-8 text-3xl font-semibold text-[#fafafa]'>
				<span>Wallet {props.walletNumber}</span>

				<div className='flex justify-center items-center w-8'>
					<Button
						variant="ghost"
						size="icon"
						className='text-red-500 hover:text-red-600 hover:bg-red-500/10'
						onClick={() => props.deleteWallet(props.wallet.id)}
					>
						<Trash2 size={24} />
					</Button>
				</div>
			</div>
			<div className='py-6 px-12 rounded-lg bg-[#181818] mx-auto w-full'>
				<div className='flex justify-between items-end mb-8 gap-10'>
					<div className='flex flex-col gap-2 min-w-0'>
						<p className='text-2xl font-bold text-white'>Public key</p>
						<p className='text-lg text-white/50 truncate'>{props.wallet.publicKey}</p>
					</div>
					<div className='flex justify-center items-center w-12 flex-shrink-0'>
						<Button size='lg' className='bg-[#fafafa] text-black px-8 h-10' onClick={() => {
							props.setSheetOpenIndex(props.walletNumber)
						}}>View</Button>
					</div>
				</div>
				<div className='flex justify-between items-end gap-4'>
					<div className='flex flex-col gap-2 min-w-0'>
						<p className='text-2xl font-bold text-white'>Secret</p>
						<p className={'text-lg text-white/50 truncate ' + (eyeOpen ? '' : 'tracking-widest font-bold')}>
							{eyeOpen ? props.wallet.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
						</p>
					</div>
					<div className='flex justify-center items-center w-12 flex-shrink-0'>
						<Button
							variant="ghost"
							size="icon"
							className="text-white/50 hover:text-white hover:bg-white/10"
							onClick={() => setEyeOpen(!eyeOpen)}
						>
							{eyeOpen ? <EyeOff size={24} /> : <Eye size={24} />}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Wallet;
