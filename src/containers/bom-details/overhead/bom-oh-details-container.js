import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../../hooks";
import { FaTimes } from "react-icons/fa";
import BomOhDetailsEditModal from "../overhead/bom-oh-details-edit-modal";
import DeleteModalContainer from "../../delete-modal-container";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import BomOhDetailsList from "./bom-oh-details-list";

export default function BomOhDetailsContainer() {
    const {JWT} = useAuth();
    const {getNow,getDate} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const [BOM, setBOM] = useState({});
    const BOMRef = useRef();
    const [BOMDD, setBOMDD] = useState(false);
    const [process, setProcess] = useState({});
    const processRef = useRef();
    const [processDD, setProcessDD] = useState(false);
    const [overheadDetails, setOverheadDetails] = useState([{overhead: "", oh_uom: "", oh_quantity: "", oh_rate: ""}]);
    const [retOverheadDetails, setRetOverheadDetails] = useState([]);
    const [BOMList, setBOMList] = useState([]);
    const [processList, setProcessList] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [deleteMode, setDeleteMode] = useState(null);

    const [stock, setStock] = useState("");
    const stockRef = useRef();
    const [stockList, setStockList] = useState([]);
    const [stockDD, setStockDD] = useState(false);

    useEffect(() => {
        axiosPrivate
        .get("/api/get-finished-goods")
        .then(function (response) {
            // console.log(response?.data);
            setStockList(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/bom");
        });
    }, []);

    useEffect(() => {
        setBOM({});
        setBOMList(() => []);
        if (stock?.id) {
            axiosPrivate
            .get("/api/get-bom/"+stock?.id)
            .then(function (response) {
                // console.log(response?.data);
                setBOMList(response?.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
                navigate("/batch/start");
            });
        }
    }, [stock]);

    // useEffect(() => {
    //     axiosPrivate
    //     .get("/bom/get-all-bom")
    //     .then(function (response) {
    //         setBOMList(response?.data);
    //     })
    //     .catch(function (error) {
    //         setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
    //     });
    // }, []);

    useEffect(() => {
        setProcess({});
        setProcessList(() => []);
        if (BOM?.id) {
            axiosPrivate
            .get("/api/get-process/"+BOM?.id)
            .then(function (response) {
                // console.log(response?.data);
                setProcessList(response?.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            });
        }
    }, [BOM]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(stockDD && !stockRef?.current?.contains(e.target)) {
                setStockDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [stockDD, stockRef]);
    const changeStock = (item) => {
        setStock(item);
        setStockDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(BOMDD && !BOMRef?.current?.contains(e.target)) {
                setBOMDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [BOMDD, BOMRef]);
    const changeBOM = (item) => {
        setBOM(item);
        setBOMDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(processDD && !processRef?.current?.contains(e.target)) {
                setProcessDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [processDD, processRef]);
    const changeProcess = (item) => {
        setProcess(item);
        setProcessDD(false);
    }

    const [viewBomOverheadDetails, setViewBomOverheadDetails] = useState(false);
    const [addBomOverheadDetails,setAddBomOverheadDetails] = useState(false);

    const [deleteModal,setDeleteModal] = useState(false);

    const checkOverheadDetailFields = () => {
        return !overheadDetails.every((proc) => {
            return !(proc.overhead === "" || proc.oh_uom === "" || proc.oh_quantity === "" || proc.oh_rate === "");
        });
    }

    const toggleAddBomOverheadDetails = () => {
        setAddBomOverheadDetails(true);
        setViewBomOverheadDetails(false);
    }
    const toggleViewBomOverheadDetails = async () => {
        if (BOM?.id && process?.id) {
            axiosPrivate
            .get(`/bom-oh-details/get-all-bom-oh-details/${BOM?.id}/${process?.id}`)
            .then(function (response) {
                console.log(response?.data);
                setRetOverheadDetails(response?.data);
                setViewBomOverheadDetails(true);
                setAddBomOverheadDetails(false);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
                navigate("/bom");
            });
        }
    }

    const isInvalid = () => {
        if (overheadDetails.length === 0) {
            return (BOM === "" || process === "");
        }
        else {
            return (BOM === "" || process === "" || checkOverheadDetailFields());
        }
    };
    const resetInputFields = () => {
        setBOM({});
        setProcess({});
    }

    const addOverheadDetails = () => {
        setOverheadDetails([...overheadDetails, {overhead: "", oh_uom: "", oh_quantity: "", oh_rate: ""}]);
    }

    const removeOverheadDetails = (i) => {
        const tempProcs = [...overheadDetails];
        if (tempProcs.length === 1) {
            setOverheadDetails([{overhead: "", oh_uom: "", oh_quantity: "", oh_rate: ""}]);
            return;
        }
        tempProcs.splice(i, 1);
        setOverheadDetails(tempProcs);
    }
    const removeRetOverheadDetails = (i) => {
        const tempProcs = [...retOverheadDetails];
        if (tempProcs.length === 1) {
            setRetOverheadDetails([]);
            return;
        }
        tempProcs.splice(i, 1);
        setRetOverheadDetails(tempProcs);
    }

    // const removeAllProcesses = () => {
    //     setNewProcesses([]); //{process_name: ""}
    // }

    const handleDeleteOverheadDetail = (funcProps) => {
        const {id, index} = funcProps;
        axiosPrivate
        .delete("/bom-oh-details/delete-bom-oh-details/"+id)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            removeRetOverheadDetails(index);
            setDeleteMode(null);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        if(BOM?.id && process?.id) {
            toggleViewBomOverheadDetails();
        }
    }, [BOM, process]);

    const handleAddOverheadDetails = () => {
        var overheadIDsList = overheadDetails.map((proc) => { return proc.overhead });
        console.log(overheadDetails)
        var isDuplicate = overheadIDsList.some((proc, idx) => {
            return overheadIDsList.indexOf(proc) != idx 
        });
        if (isDuplicate) {
            setAlert({msg: `Error: Unique overheads only!`, type: "error"});
            return;
        }
        const overheadDetailsMOD = overheadDetails.map((proc) => {
            proc.bom_id = BOM?.id;
            proc.process_id = process?.id;
            proc.created_by = JWT?.user?.username; 
            proc.created_on = getNow();
            return proc;
        });
        axiosPrivate
        .post("/bom-oh-details/create-bom-oh-details", overheadDetailsMOD)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            // resetInputFields();
            setOverheadDetails([{overhead: "", oh_uom: "", oh_quantity: "", oh_rate: ""}]);
            toggleViewBomOverheadDetails();
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    // useEffect(() => {
    //     console.log(overheadDetails)
    // }, [overheadDetails])

    return (
        <>
        <Card>
            <Card.Title>
                Overhead details for BoM
            </Card.Title>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer refPointer={stockRef}>
                    <Card.Input readOnly type="text" id="stock" placeholder=" " autoComplete="off" value={stock?.item_name ? stock?.item_name : ""} onClick={() => setStockDD((stockDD) => !stockDD)} />
                    <Card.Label htmlFor="stock" mandatory>Stock item</Card.Label>
                    <Card.Dropdown empty={!stockList.length} dropdown={stockDD} flexDirection="column">
                        {stockList.map((item) => {
                            return <Card.Option selected={(stock?.item_name === item.item_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeStock(item)}>{item?.item_name}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(stockDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
                <Card.InputContainer refPointer={BOMRef}>
                    <Card.Input readOnly type="text" id="BOM" placeholder=" " autoComplete="off" value={BOM?.bom_name ? BOM?.bom_name : ""} onClick={() => setBOMDD((BOMDD) => !BOMDD)} />
                    <Card.Label htmlFor="BOM" mandatory>BoM</Card.Label>
                    <Card.Dropdown empty={!BOMList.length} dropdown={BOMDD} flexDirection="column">
                        {BOMList.map((item) => {
                            return <Card.Option selected={(BOM?.bom_name === item.bom_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeBOM(item)}>{item?.bom_name}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(BOMDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
                <Card.InputContainer refPointer={processRef}>
                    <Card.Input readOnly type="text" id="process" placeholder=" " autoComplete="off" value={process?.process_name ? process?.process_name : ""} onClick={() => setProcessDD((processDD) => !processDD)} />
                    <Card.Label htmlFor="process" mandatory>Process</Card.Label>
                    <Card.Dropdown empty={!processList.length} dropdown={processDD} flexDirection="column">
                        {processList.map((item) => {
                            return <Card.Option selected={(process?.process_name === item.process_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeProcess(item)}>{item?.process_name}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(processDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
            </Card.ButtonGroup>
        </Card>
        {BOM?.id && process?.id &&
            <Card width="100%">
                <Card.ButtonGroup flexStart>
                    <Button small onClick={() => toggleViewBomOverheadDetails()}>View all</Button>
                    <Button small onClick={() => toggleAddBomOverheadDetails()}>Add overhead details</Button>
                </Card.ButtonGroup>
                <Card.Line />
                {(addBomOverheadDetails || (viewBomOverheadDetails && retOverheadDetails.length !== 0)) &&
                    <Card.InputColumn center notResponsive>
                        <Card.Header>
                            <Card.HeaderText>Overhead</Card.HeaderText>
                        </Card.Header>
                        <Card.Header>
                            <Card.HeaderText>Unit of Measure</Card.HeaderText>
                        </Card.Header>
                        <Card.Header marginRight={viewBomOverheadDetails ? "0.75rem" : null}>
                            <Card.HeaderText>Rate</Card.HeaderText>
                        </Card.Header>
                        <Card.Header>
                            <Card.HeaderText>Quantity</Card.HeaderText>
                        </Card.Header>
                        {viewBomOverheadDetails &&
                            <Card.ButtonContainer width="fit-content" notVisible={true}>
                                <Card.AddButton small />
                            </Card.ButtonContainer>
                        }
                        <Card.ButtonContainer width="fit-content" notVisible={viewBomOverheadDetails}>
                            <Card.AddButton small onClick={() => {
                                addOverheadDetails();
                            }} />
                        </Card.ButtonContainer>
                    </Card.InputColumn>
                }
                {(viewBomOverheadDetails && retOverheadDetails.length === 0) &&
                    <Card.InputColumn center notResponsive>
                        <Card.MultiInputContainer>
                            No overhead details to view!
                        </Card.MultiInputContainer>
                    </Card.InputColumn>
                }
                {viewBomOverheadDetails &&
                    <>
                    {retOverheadDetails.map((element, index) => {
                        return (
                            <Card.InputColumn center key={index} notResponsive>
                                <Card.MultiInputContainer>
                                    <Card.ViewText id="overhead">{element.BOM_OH_DETAILS.overhead}</Card.ViewText>
                                </Card.MultiInputContainer>
                                <Card.MultiInputContainer>
                                    <Card.ViewText id="uom">{element.BOM_OH_DETAILS.oh_uom}</Card.ViewText>
                                </Card.MultiInputContainer>
                                <Card.MultiInputContainer>
                                    <Card.ViewText id="in_out">₹ {element.BOM_OH_DETAILS.oh_rate}</Card.ViewText>
                                </Card.MultiInputContainer>
                                <Card.MultiInputContainer>
                                    <Card.ViewText id="bom_quantity">{element.BOM_OH_DETAILS.oh_quantity}</Card.ViewText>
                                </Card.MultiInputContainer>
                                <Card.ButtonContainer width="fit-content">
                                    <Card.AddButton danger deletes small onClick={() => {
                                        setDeleteMode({id: element.BOM_OH_DETAILS.id, index: index})
                                        setDeleteModal(true);
                                    }} />
                                </Card.ButtonContainer>
                                <Card.ButtonContainer width="fit-content">
                                    <Card.AddButton edits small onClick={() => setEditMode({element: element, index: index})} />
                                </Card.ButtonContainer>
                            </Card.InputColumn>
                        );
                    })}
                    </>
                }
                {addBomOverheadDetails &&
                    <>
                    {overheadDetails.map((element, index) => {
                        return (
                            <BomOhDetailsList key={index} element={element} index={index} overheadDetails={overheadDetails} setOverheadDetails={setOverheadDetails} removeOverheadDetails={removeOverheadDetails} />
                        );
                    })}
                    <Card.ButtonGroup marginTop>
                        <Button disabled={isInvalid()} onClick={() => handleAddOverheadDetails()} type="submit">Add overhead details</Button>
                    </Card.ButtonGroup>
                    </>
                }
            </Card>
        }
        {(editMode !== null) ?
            <BomOhDetailsEditModal editItem={editMode} setEditMode={setEditMode} retOverheadDetails={retOverheadDetails} setRetOverheadDetails={setRetOverheadDetails} />
        : null}
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteOverheadDetail} funcProps={deleteMode} setDeleteModal={setDeleteModal}>Are you sure you want to delete this overhead detail?</DeleteModalContainer>
        : null}
        </>
    );
}