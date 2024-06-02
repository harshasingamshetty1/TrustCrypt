import ModalComponent from "../Modal";

const Index = ({ modalStatus }) => {
  const [isModalOpen, setModalOpen] = modalStatus;
  return (
    <ModalComponent modalStatus={[isModalOpen, setModalOpen]}>
      <div className="w-60 h-30">
        <h1 className="text-2xl">Edit Password</h1>
        <div className="py-5">
          {" "}
          Site:
          <input
            className=" px-3 border-black"
            type="text"
            placeholder="Site Name"
          />
        </div>
        <div className="py-5">
          {" "}
          Username :
          <input className=" px-3" type="text" placeholder="username" />
        </div>
        <div className="py-5">
          {" "}
          Password :
          <input className=" px-3" type="text" placeholder="Password" />
        </div>
      </div>
      <div className="w-full">
        <button
          onClick={() => setModalOpen(false)}
          className="p-2 rounded-xl text-left float-left bg-red-500"
        >
          cancel
        </button>
        <button className=" float-right text-right bg-green-500 p-2 rounded-xl">
          Add
        </button>
      </div>
    </ModalComponent>
  );
};

export default Index;
