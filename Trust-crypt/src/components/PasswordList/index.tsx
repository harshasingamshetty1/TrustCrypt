import Password from '@/components/Password'
const index = ({ setIsEditModalOpen }) => {
    const passwords = true //get passwords from blockchain or decentralized Database
    return (
        <>
            <h1 className='text-xl font-bold p-2'>Passwords</h1>
            {
                //Map Over all the Stored Passwords
                passwords ? <Password setIsEditModalOpen={setIsEditModalOpen} siteUrl={"youtube.com"} userName={"bilalshaikh_15"} /> : "No Saved passWords"
            }
        </>
    )
}

export default index