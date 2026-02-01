import {IconBrandGithub} from '@tabler/icons-react'

const Navbar = () => {
	return (
		<div className='w-full px-5 py-4 text-[#fafafa] flex justify-between items-center mb-4 border-b-1'>
			<div className='text-3xl font-bold'>Solview</div>
			<a
				href="https://github.com/Shubhamgoyalbs/solview"
				target="_blank"
				rel="noopener noreferrer"
				className="text-white/50 hover:text-white transition-colors"
			>
				<IconBrandGithub />
			</a>
		</div>
	);
};

export default Navbar;
