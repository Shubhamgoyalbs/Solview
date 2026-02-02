import React from "react";

interface SheetTokenCardProps {
	tokenName: string,
	tokenSymbol: string,
	tokenIcon: React.ReactNode,
	tokenAmount: number,
	tokenPrice: number,
}

const SheetTokenCard = ({tokenName, tokenSymbol, tokenIcon, tokenPrice, tokenAmount}: SheetTokenCardProps) => {
	const totalValue = (tokenAmount * tokenPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	return (
		<div className='flex justify-between items-center border p-3 rounded-md w-full'>
			<div className='flex items-center h-full gap-3'>
				<div className='w-12 h-12 rounded-full flex items-center justify-center overflow-hidden'>
					{tokenIcon}
				</div>
				<div className='flex flex-col'>
					<div className='flex items-center gap-1'>
						<p className='font-medium text-lg text-white'>{tokenName}</p>
					</div>
					<p className='text-sm text-white/50 font-medium'>{tokenAmount} {tokenSymbol}</p>
				</div>
			</div>
			<div className='flex flex-col items-end'>
				<p className='font-semibold text-lg text-white'>${totalValue}</p>
				<p className='text-sm text-white/50 font-normal'>${tokenPrice.toFixed(2)}</p>
			</div>
		</div>
	);
};

export default SheetTokenCard;
