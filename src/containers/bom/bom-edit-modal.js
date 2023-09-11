import React, { useState } from "react";
import { Modal, Button, Card } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";

export default function BomEditModal({children, editItem, setEditMode, processes, setProcesses}) {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const {JWT} = useAuth();
    const {getNow} = useDateFormat();
    const [name, setName] = useState(editItem?.element.process_name);

    const updateProcessBack = () => {
        const tempProcs = [...processes];
        tempProcs[editItem?.index].process_name = name;
        setProcesses(tempProcs);
    }

    const handleSubmit = () => {
        axiosPrivate
        .put("/process/update-process/"+editItem.element?.id, {}, {params: {process_name: name, modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            setEditMode(null);
            updateProcessBack();
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });

    }

    return (
        <>
            <Modal>
                <Modal.Container>
                    <Modal.Title>Update process</Modal.Title>
                    <Modal.Line />
                    {/* <Modal.Text>{children}</Modal.Text> */}
                    <Modal.InputContainer>
                        {/* <Card.MultiInput type="text" id="process_name" placeholder=" " autoComplete="off" value={editItem.element.process_name} onChange={({target}) => handleProcess(target.value)} /> */}
                        <Card.MultiInput type="text" id="name" placeholder=" " autoComplete="off" value={name} onChange={({target}) => setName(target.value)} />
                    </Modal.InputContainer>
                    <Modal.ButtonContainer>
                        <Button nofill onClick={() => {
                            setEditMode(null);
                        }}>Cancel</Button>
                        <Button onClick={() => handleSubmit()}>Update process</Button>
                    </Modal.ButtonContainer>
                </Modal.Container>
            </Modal>
        </>
    );
}