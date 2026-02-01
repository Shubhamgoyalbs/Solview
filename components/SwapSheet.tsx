"use client"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface SwapSheetProps {
    sheetOpenIndex: number | null;
    setSheetOpenIndex: (index: number | null) => void;
}

const SwapSheet = ({ sheetOpenIndex, setSheetOpenIndex }: SwapSheetProps) => {
    return (
        <Sheet 
            open={sheetOpenIndex !== null}
            onOpenChange={(open) => {
                if(!open) {
                    setSheetOpenIndex(null);
                }
            }}
        >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className='mx-auto text-2xl'>Wallet {sheetOpenIndex}</SheetTitle>
                    <SheetDescription>
                        Swap your tokens
                    </SheetDescription>
                </SheetHeader>
                {/*code for token swap*/}
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default SwapSheet;
