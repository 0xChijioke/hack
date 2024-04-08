
import { ShoppingCartIcon } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "~~/app/components/ui/Sheet"

const Cart = () => {
  return (
    <div>
        <Sheet>
            <SheetTrigger><ShoppingCartIcon /></SheetTrigger>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>        
    </div>
  )
}

export default Cart;