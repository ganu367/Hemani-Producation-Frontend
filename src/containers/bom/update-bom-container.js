import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";
import BomEditModal from "./bom-edit-modal";
import DeleteModalContainer from "../delete-modal-container";

export default function UpdateBomContainer() {
    const {JWT} = useAuth();
    const {getNow,getDate} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const location = useLocation();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const [stock, setStock] = useState("");
    const [name, setName] = useState("");
    const [UOM, setUOM] = useState("");
    const [quantity, setQuantity] = useState("");
    const [processes, setProcesses] = useState([{process_name: ""}]);
    const [newProcesses, setNewProcesses] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [deleteMode, setDeleteMode] = useState(null);

    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
    const [deleteModal,setDeleteModal] = useState(false);

    const checkNewProcessFields = () => {
        // if (newProcesses.length === 1 && newProcesses[0].process_name === "") {
        //     return false;
        // }
        // return true;
        return !newProcesses.every((proc) => {
            return !(proc.process_name === "");
        });
    }

    const isInvalid = () => {
        if (newProcesses.length === 0) {
            return (stock === "" || name === "" || UOM === "" || quantity === "");
        }
        else {
            return (stock === "" || name === "" || UOM === "" || quantity === "" || checkNewProcessFields());
        }
    };
    const resetInputFields = () => {
        setName("");
        setQuantity("");
    }

    useEffect(() => {
        axiosPrivate
        .get("/bom/get-bom-by-ids/"+params.id)
        .then(function (response) {
            console.log(response?.data);
            const bom = response?.data?.BOM?.BOM;
            const stock = response?.data?.BOM?.item_name;
            const processes = response?.data?.PROCESS;
            setStock(stock ? stock : "");
            setName(bom?.bom_name ? bom?.bom_name : "");
            setUOM(bom?.uom ? bom?.uom : "");
            setQuantity(bom?.bom_quantity ? bom?.bom_quantity : "");
            setProcesses(processes ? processes : []);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/bom");
        });
    },[]);

    const handleUpdateBom = () => {
        var processNamesList = newProcesses.map((proc) => { return proc.process_name });
        var isDuplicate = processNamesList.some((proc, idx) => { 
            return processNamesList.indexOf(proc) != idx 
        });
        if (isDuplicate) {
            setAlert({msg: `Error: Unique processes only!`, type: "error"});
            return;
        }
        const processesMOD = newProcesses.map((proc) => {
            proc.created_by = JWT?.user?.username; 
            proc.created_on = getNow();
            return proc;
        });
        axiosPrivate
        .put("/bom/update-bom/"+params.id, {process: processesMOD, bom_name: name, uom: UOM, bom_quantity: Number(quantity), modified_by: JWT?.user?.username, modified_on: getNow()})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/bom");
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    const handleQuantity = (num) => {
        if ((num >= 1) || num == "") {
        //     setQuantity(num.replace(/^0+/, ''));
            const validated = num.match(/^(\d*\.{0,1}\d{0,2}$)/)
            if (validated) {
                setQuantity(num);
            }
        }
    }

    const handleProcess = (i, evnt) => {
        const { name, value } = evnt.target;
        const tempProcs = [...processes];
        tempProcs[i][name] = value;
        setProcesses(tempProcs);
    }
    const handleNewProcess = (i, evnt) => {
        const { name, value } = evnt.target;
        const tempProcs = [...newProcesses];
        tempProcs[i][name] = value;
        setNewProcesses(tempProcs);
    }

    const addProcess = () => {
        setProcesses([...processes, {process_name: ""}]);
    }
    const addNewProcess = () => {
        setNewProcesses([...newProcesses, {process_name: ""}]);
    }

    const removeProcess = (i) => {
        // setProcesses(processes.filter((proc, index) => index !== i));
        const tempProcs = [...processes];
        if (tempProcs.length === 1) {
            setProcesses([]);
            // setAddProcessesTab(false);
            // setAddProcessesButton(true);
            return;
        }
        tempProcs.splice(i, 1);
        setProcesses(tempProcs);
    }
    const removeNewProcess = (i) => {
        // setProcesses(processes.filter((proc, index) => index !== i));
        const tempProcs = [...newProcesses];
        if (tempProcs.length === 1) {
            setNewProcesses([]); //{process_name: ""}
            // setAddProcessesTab(false);
            // setAddProcessesButton(true);
            return;
        }
        tempProcs.splice(i, 1);
        setNewProcesses(tempProcs);
    }

    const removeAllProcesses = () => {
        setNewProcesses([]); //{process_name: ""}
        // setAddProcessesTab(false);
        // setAddProcessesButton(true);
    }

    const handleDeleteProcess = (funcProps) => {
        const {id, index} = funcProps;
        axiosPrivate
        .delete("/process/delete-process/"+id)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            removeProcess(index);
            setDeleteMode(null);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    // useEffect(() => {
    //     if (processes.length === 0) {
    //         setNewProcesses([{process_name: ""}]);
    //     }
    // }, [processes]);

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>BoM{stock ? ` for ${stock}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate("/bom", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="stock" placeholder=" " autoComplete="off" value={stock} />
                        <Card.Label htmlFor="stock" mandatory>Stock item</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="UOM" placeholder=" " autoComplete="off" value={UOM} />
                        <Card.Label htmlFor="UOM" mandatory>UOM</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Input type="text" id="name" placeholder=" " autoComplete="off" value={name} onChange={({target}) => setName(target.value)} />
                        <Card.Label htmlFor="name" mandatory>BOM name</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input type="number" id="quantity" placeholder=" " autoComplete="off" value={quantity} onKeyDown={blockInvalidNumber} onChange={({target}) => handleQuantity(target.value)} />
                        <Card.Label htmlFor="quantity" mandatory>BOM quantity</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                {/* <Button disabled={isInvalid()} onClick={() => handleUpdateBom()} type="submit">Update bill of material</Button> */}
            </Card.ButtonGroup>
        </Card>
        <Card width="45%" responsiveWidth="75%">
            <Card.InputColumn center notResponsive>
                <Card.Header>
                    <Card.HeaderText>Process name</Card.HeaderText>
                </Card.Header>
                <Card.Header width="fit-content" />
                {/* <Card.Header width="fit-content" /> */}
                <Card.ButtonContainer width="fit-content">
                    <Card.AddButton small onClick={() => {
                        // if ((newProcesses.length === 0) && index === (processes.length - 1)) {
                        //     setNewProcesses([{process_name: ""}]);
                        //     return;
                        // }
                        addNewProcess();
                    }} />
                </Card.ButtonContainer>
            </Card.InputColumn>
            {processes.map((element, index) => {
                // console.log(processes)
                return (
                    <Card.InputColumn center key={index} notResponsive>
                            <Card.MultiInputContainer>
                                {/* <Card.MultiInput readOnly type="text" id="process_name" name="process_name"  placeholder=" " autoComplete="off" value={element.process_name} onChange={(evnt) => handleProcess(index, evnt)} /> */}
                                <Card.ViewText id="process_name">{element?.process_name}</Card.ViewText>
                            </Card.MultiInputContainer>
                            <Card.ButtonContainer width="fit-content">
                                <Card.AddButton danger deletes small onClick={() => {
                                    setDeleteMode({id: element.id, index: index})
                                    setDeleteModal(true);
                                }} /> {/* handleDeleteProcess(element.id, index) */}
                            </Card.ButtonContainer>
                            <Card.ButtonContainer width="fit-content">
                                <Card.AddButton edits small onClick={() => setEditMode({element: element, index: index})} />
                            </Card.ButtonContainer>
                            {/* {newProcesses.length === 0 &&
                                <Card.ButtonContainer width="fit-content" notVisible={!(newProcesses.length === 0) || index !== (processes.length - 1)}>
                                    <Card.AddButton small onClick={() => {
                                        if ((newProcesses.length === 0) && index === (processes.length - 1)) {
                                            setNewProcesses([{process_name: ""}])
                                        }
                                    }} />
                                </Card.ButtonContainer>
                            } */}
                        </Card.InputColumn>
                );
            })}
            {newProcesses.map((element, index) => {
                // console.log(newProcesses)
                return (
                    <Card.InputColumn center key={index} notResponsive>
                        <Card.MultiInputContainer>
                            <Card.MultiInput type="text" id="process_name" name="process_name"  placeholder=" " autoComplete="off" value={element.process_name} onChange={(evnt) => handleNewProcess(index, evnt)} />
                        </Card.MultiInputContainer>
                        <Card.ButtonContainer width="fit-content">
                            <Card.AddButton danger deletes small onClick={() => removeNewProcess(index)} />
                        </Card.ButtonContainer>
                        {processes.length !== 0 &&
                            <Card.ButtonContainer width="fit-content" notVisible={true}>
                                <Card.AddButton small />
                            </Card.ButtonContainer>
                        }
                    </Card.InputColumn>
                );
            })}
            <Card.ButtonGroup marginTop>
                {/* <Button danger nofill onClick={() => removeAllProcesses()}>Remove all</Button> */}
                <Button disabled={isInvalid()} onClick={() => handleUpdateBom()} type="submit">Update bill of material</Button>
            </Card.ButtonGroup>
        </Card>
        {(editMode !== null) ?
            <BomEditModal editItem={editMode} setEditMode={setEditMode} handleProcess={handleProcess} processes={processes} setProcesses={setProcesses} />
        : null}
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteProcess} funcProps={deleteMode} setDeleteModal={setDeleteModal}>Are you sure you want to delete this process?</DeleteModalContainer>
        : null}
        </>
    );
}