import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const index = ({ siteUrl, userName, setIsEditModalOpen }) => {
    return (
        <div className="border-blue-950 flex bg-gray-900 w-full h-16 p-3 m-2 rounded-xl">
            <div >
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col ml-1">
                <div className="text-lg text-white">{siteUrl}</div>
                <div className="text-lg text-white mb-2">{userName}</div>
            </div>
            <div><Button className="text-lg">View</Button></div>
            <div><Button className="text-lg" onClick={() => setIsEditModalOpen(true)}>Edit</Button></div>
        </div>
    )
}

export default index;

