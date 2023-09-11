import React from "react";
import { Modal, Button } from "../components";

export default function DeleteModalContainer({children, setDeleteModal, deleteFunction, textAlign, funcProps}) {
    const functionParams = funcProps || null;
    // console.log(functionParams);

    const handleDelete = () => {
        deleteFunction(functionParams);
        setDeleteModal(false);
    }

    return (
        <>
            <Modal>
                <Modal.Container>
                    <Modal.Title>Caution</Modal.Title>
                    <Modal.Line />
                    <Modal.Text textAlign={textAlign}>{children}</Modal.Text>
                    <Modal.ButtonContainer>
                        <Button nofill onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button danger onClick={() => handleDelete()}>Confirm</Button>
                    </Modal.ButtonContainer>
                </Modal.Container>
            </Modal>
        </>
    );
}