import {
    Menubar,
    MenubarMenu
} from "@/components/ui/menubar"
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const index = ({ setIsAddModalOpen }) => {
    return (
        <>
            <h1 className="text-3xl font-bold text-center p-2">
                Crypto Lock-Box
            </h1>
            <Menubar>
                <MenubarMenu>
                    <Input placeholder="Search your vault" />
                    <Button size={'sm'} color="red">Vault</Button>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        +
                    </Button>
                </MenubarMenu>
            </Menubar>
        </>
    )
}

export default index