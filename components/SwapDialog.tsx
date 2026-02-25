"use client"
import {
	Dialog, DialogClose,
	DialogContent,
	DialogDescription, DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

const SwapDialog = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='default'>Swap</Button>
			</DialogTrigger>
		</Dialog>
	);
};

export default SwapDialog;
