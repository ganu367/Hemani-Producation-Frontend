import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../../hooks";
import { FaTimes } from "react-icons/fa";
import BomStockDetailsEditModal from "../stock/bom-stock-details-edit-modal";
import DeleteModalContainer from "../../delete-modal-container";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import BomStockDetailsList from "./bom-stock-details-list";

export default function BomStockDetailsContainer() {
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
    const [stockDetails, setStockDetails] = useState([{stock_id: "", uom: "", bom_quantity: "", in_out: ""}]);
    const [retStockDetails, setRetStockDetails] = useState([]);
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

    const [viewBomStockDetails, setViewBomStockDetails] = useState(false);
    const [addBomStockDetails,setAddBomStockDetails] = useState(false);

    const [deleteModal,setDeleteModal] = useState(false);

    const checkStockDetailFields = () => {
        return !stockDetails.every((proc) => {
            return !(proc.stock_id === "" || proc.uom === "" || proc.bom_quantity === "" || proc.in_out === "");
        });
    }

    const toggleAddBomStockDetails = () => {
        setAddBomStockDetails(true);
        setViewBomStockDetails(false);
    }
    const toggleViewBomStockDetails = async () => {
        if (BOM?.id && process?.id) {
            axiosPrivate
            .get(`/bom-stock-details/get-all-bom-stk-details/${BOM?.id}/${process?.id}`)
            .then(function (response) {
                // console.log(response?.data);
                setRetStockDetails(response?.data);
                setViewBomStockDetails(true);
                setAddBomStockDetails(false);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
                navigate("/bom");
            });
        }
    }

    const isInvalid = () => {
        if (stockDetails.length === 0) {
            return (BOM === "" || process === "");
        }
        else {
            return (BOM === "" || process === "" || checkStockDetailFields());
        }
    };
    const resetInputFields = () => {
        setBOM({});
        setProcess({});
    }

    // useEffect(() => {
        // axiosPrivate
        // .get("/bom/get-bom-by-ids/"+params.id)
        // .then(function (response) {
        //     console.log(response?.data);
        //     const bom = response?.data?.BOM?.BOM;
        //     const stock = response?.data?.BOM?.item_name;
        //     const processes = response?.data?.processes;
        //     setStock(stock ? stock : "");
        //     setName(bom?.bom_name ? bom?.bom_name : "");
        //     setUOM(bom?.uom ? bom?.uom : "");
        //     setQuantity(bom?.bom_quantity ? bom?.bom_quantity : "");
        //     setProcesses(processes ? processes : []);
        // })
        // .catch(function (error) {
        //     setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        //     navigate("/bom");
        // });
    // },[]);

    // const handleUpdateBomStockDetails = () => {
    //     var processNamesList = newProcesses.map((proc) => { return proc.process_name });
    //     var isDuplicate = processNamesList.some((proc, idx) => { 
    //         return processNamesList.indexOf(proc) != idx 
    //     });
    //     if (isDuplicate) {
    //         setAlert({msg: `Error: Two processes can't have the same name!`, type: "error"});
    //         return;
    //     }
    //     const processesMOD = newProcesses.map((proc) => {
    //         proc.created_by = JWT?.user?.username; 
    //         proc.created_on = getNow();
    //         return proc;
    //     });
    //     axiosPrivate
    //     .put("/bom/update-bom/"+params.id, {process: processesMOD, bom_name: name, uom: UOM, bom_quantity: Number(quantity), modified_by: JWT?.user?.username, modified_on: getNow()})
    //     .then(function (response) {
    //         setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
    //     })
    //     .then(() => {
    //         resetInputFields();
    //         navigate("/bom");
    //     })
    //     .catch(function (error) {
    //         setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
    //     });
    // }

    // const handleQuantity = (num) => {
    //     if ((num >= 1) || num == "") {
    //         setQuantity(num.replace(/^0+/, ''));
    //     }
    // }

    // const handleProcess = (i, evnt) => {
    //     const { name, value } = evnt.target;
    //     const tempProcs = [...processes];
    //     tempProcs[i][name] = value;
    //     setProcesses(tempProcs);
    // }
    // const handleStockDetails = (i, evnt) => {
    //     const { name, value } = evnt.target;
    //     const tempProcs = [...stockDetails];
    //     tempProcs[i][name] = value;
    //     setStockDetails(tempProcs);
    // }
    // const handleDDStockDetails = (i, evnt) => {
    //     const { name, value } = evnt.target;
    //     const tempProcs = [...stockDetails];
    //     tempProcs[i]["stockDD"] = !tempProcs[i]["stockDD"];
    //     setStockDetails(tempProcs);
    // }

    // const addProcess = () => {
    //     setProcesses([...processes, {process_name: ""}]);
    // }
    const addStockDetails = () => {
        setStockDetails([...stockDetails, {stock_id: "", uom: "", bom_quantity: "", in_out: ""}]);
    }

    // const removeProcess = (i) => {
    //     const tempProcs = [...processes];
    //     if (tempProcs.length === 1) {
    //         setProcesses([]);
    //         return;
    //     }
    //     tempProcs.splice(i, 1);
    //     setProcesses(tempProcs);
    // }
    const removeStockDetails = (i) => {
        const tempProcs = [...stockDetails];
        if (tempProcs.length === 1) {
            setStockDetails([{stock_id: "", uom: "", bom_quantity: "", in_out: "in"}]);
            return;
        }
        tempProcs.splice(i, 1);
        setStockDetails(tempProcs);
    }
    const removeRetStockDetails = (i) => {
        const tempProcs = [...retStockDetails];
        if (tempProcs.length === 1) {
            setRetStockDetails([]);
            return;
        }
        tempProcs.splice(i, 1);
        setRetStockDetails(tempProcs);
    }

    // const removeAllProcesses = () => {
    //     setNewProcesses([]); //{process_name: ""}
    // }

    const handleDeleteStockDetail = (funcProps) => {
        const {id, index} = funcProps;
        axiosPrivate
        .delete("/bom-stock-details/delete-bom-stk-details/"+id)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            removeRetStockDetails(index);
            setDeleteMode(null);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        if(BOM?.id && process?.id) {
            toggleViewBomStockDetails();
        }
    }, [BOM, process]);

    const handleAddStockDetails = () => {
        var stockIDsList = stockDetails.map((proc) => { return proc.stock_id });
        var isDuplicate = stockIDsList.some((proc, idx) => { 
            return stockIDsList.indexOf(proc) != idx 
        });
        if (isDuplicate) {
            setAlert({msg: `Error: Unique stocks only!`, type: "error"});
            return;
        }
        const stockDetailsMOD = stockDetails.map((proc) => {
            proc.bom_id = BOM?.id;
            proc.process_id = process?.id;
            proc.created_by = JWT?.user?.username; 
            proc.created_on = getNow();
            return proc;
        });
        axiosPrivate
        .post("/bom-stock-details/create-bom-stk-details", stockDetailsMOD)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            // resetInputFields();
            setStockDetails([{stock_id: "", uom: "", bom_quantity: "", in_out: ""}]);
            toggleViewBomStockDetails();
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    // useEffect(() => {
    //     console.log(stockDetails)
    // }, [stockDetails])

    return (
        <>
        <Card>
            <Card.Title>
                Stock details for BoM
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
                    <Button small onClick={() => toggleViewBomStockDetails()}>View all</Button>
                    <Button small onClick={() => toggleAddBomStockDetails()}>Add stock details</Button>
                </Card.ButtonGroup>
                <Card.Line />
                {(addBomStockDetails || (viewBomStockDetails && retStockDetails.length !== 0)) &&
                    <Card.InputColumn center notResponsive>
                        <Card.Header>
                            <Card.HeaderText>In / Out</Card.HeaderText>
                        </Card.Header>
                        <Card.Header>
                            <Card.HeaderText>Stock</Card.HeaderText>
                        </Card.Header>
                        <Card.Header>
                            <Card.HeaderText>Unit of Measure</Card.HeaderText>
                        </Card.Header>
                        <Card.Header>
                            <Card.HeaderText>Quantity</Card.HeaderText>
                        </Card.Header>
                        {viewBomStockDetails &&
                            <Card.ButtonContainer width="fit-content" notVisible={true}>
                                <Card.AddButton small />
                            </Card.ButtonContainer>
                        }
                        <Card.ButtonContainer width="fit-content" notVisible={viewBomStockDetails}>
                            <Card.AddButton small onClick={() => {
                                addStockDetails();
                            }} />
                        </Card.ButtonContainer>
                    </Card.InputColumn>
                }
                {(viewBomStockDetails && retStockDetails.length === 0) &&
                    <Card.InputColumn center notResponsive>
                        <Card.MultiInputContainer>
                            No stock details to view!
                        </Card.MultiInputContainer>
                    </Card.InputColumn>
                }
                {viewBomStockDetails &&
                    <>
                    {retStockDetails.map((element, index) => {
                        return (
                            <Card.InputColumn center key={index} notResponsive>
                                <Card.MultiInputContainer>
                                    <Card.ViewText id="in_out">{element.BOM_STOCK_DETAILS.in_out}</Card.ViewText>
                                </Card.MultiInputContainer>
                                <Card.MultiInputContainer>
                                    <Card.ViewText id="stock">{element.item_name}</Card.ViewText>
                                </Card.MultiInputContainer>
                                <Card.MultiInputContainer>
                                    <Card.ViewText id="uom">{element.BOM_STOCK_DETAILS.uom}</Card.ViewText>
                                </Card.MultiInputContainer>
                                <Card.MultiInputContainer>
                                    <Card.ViewText id="bom_quantity">{element.BOM_STOCK_DETAILS.bom_quantity}</Card.ViewText>
                                </Card.MultiInputContainer>
                                <Card.ButtonContainer width="fit-content">
                                    <Card.AddButton danger deletes small onClick={() => {
                                        setDeleteMode({id: element.BOM_STOCK_DETAILS.id, index: index});
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
                {addBomStockDetails &&
                    <>
                    {stockDetails.map((element, index) => {
                        return (
                            <BomStockDetailsList key={index} element={element} index={index} stockDetails={stockDetails} setStockDetails={setStockDetails} removeStockDetails={removeStockDetails} />
                        );
                    })}
                    <Card.ButtonGroup marginTop>
                        <Button disabled={isInvalid()} onClick={() => handleAddStockDetails()} type="submit">Add stock details</Button>
                    </Card.ButtonGroup>
                    </>
                }
            </Card>
        }
        {(editMode !== null) ?
            <BomStockDetailsEditModal editItem={editMode} setEditMode={setEditMode} retStockDetails={retStockDetails} setRetStockDetails={setRetStockDetails} />
        : null}
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteStockDetail} funcProps={deleteMode} setDeleteModal={setDeleteModal}>Are you sure you want to delete this stock detail?</DeleteModalContainer>
        : null}
        </>
    );
}