import {WalletType} from "@/utils/types";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {IconTrash, IconEye, IconEyeOff} from "@tabler/icons-react";
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

interface WalletProps {
	wallet: WalletType,
	setSheetOpenIndex: (index: number | null) => void,
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
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className='text-red-500 hover:text-red-600 hover:bg-red-500/10'
							>
								<IconTrash stroke={1.5} />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Delete Wallet {props.walletNumber}</DialogTitle>
								<DialogDescription>
									Are you sure you want to delete this wallet? This action cannot be undone.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button variant="destructive" onClick={() => props.deleteWallet(props.wallet.id)}>
										Delete
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
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
							{eyeOpen ? <IconEye size={24} /> : <IconEyeOff size={24} />}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Wallet;
