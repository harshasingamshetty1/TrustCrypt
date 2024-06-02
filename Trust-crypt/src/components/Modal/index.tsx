import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useState } from "react";

const ModalComponent = ({ modalStatus, children }) => {
  const [isModalOpen] = useState(modalStatus);
  return (
    <Modal
      open={isModalOpen}
      center
      onClose={function (): void {
        throw new Error("Function not implemented.");
      }}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
