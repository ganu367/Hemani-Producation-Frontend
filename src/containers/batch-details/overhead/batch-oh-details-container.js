import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Grid } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat, useGridColumnDefns } from "../../../hooks";
import { FaTimes } from "react-icons/fa";
import DeleteModalContainer from "../../delete-modal-container";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import BatchOhDetailsList from "./batch-oh-details-list";
import { FaFileCsv } from "react-icons/fa";
import { ThemeContext } from "styled-components";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function BatchOhDetailsContainer() {
    const {batchOhsGridDefn} = useGridColumnDefns();
    const themeContext = useContext(ThemeContext);
    const {JWT} = useAuth();
    const {getNow,getDate,defaultDate} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const [entryDate, setEntryDate] = useState(defaultDate());
    const [batch, setBatch] = useState({});
    const batchRef = useRef();
    const [batchDD, setBatchDD] = useState(false);
    const [batchStock, setBatchStock] = useState({});
    const batchStockRef = useRef();
    const [batchStockDD, setBatchStockDD] = useState(false);
    const [process, setProcess] = useState({});
    const processRef = useRef();
    const [processDD, setProcessDD] = useState(false);
    const [overheadDetails, setOverheadDetails] = useState([{overhead: "", oh_uom: "", oh_quantity: "", oh_rate: ""}]);
    const [retOverheadDetails, setRetOverheadDetails] = useState([]);
    const [batchList, setBatchList] = useState([]);
    const [batchStockList, setBatchStockList] = useState([]);
    const [processList, setProcessList] = useState([]);
    const [deleteMode, setDeleteMode] = useState(null);

    const [rowSelected,setRowSelected] = useState({});
    const [gridApi, setGridApi] = useState(null);
    const operationInvalid = () => {
        if (rowSelected?.BATCH_ACTUAL_OH?.entry_number) {
            return false;
        }
        else {
            return true;
        }
    }

    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState(batchOhsGridDefn);
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
    }),[]);
    const gridRef = useRef();
    const autoSizeAll = useCallback((skipHeader) => {
        const allColumnIds = [];
        gridRef.current?.columnApi.getColumns().forEach((column) => {
            allColumnIds.push(column.getId());
        });
        gridRef.current?.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    }, []);
    const onGridReady = (params) => {
        setGridApi(params.api);
        setTimeout(() => autoSizeAll(false), 1000);
    };
    const exportCSV = () => {
        gridApi.exportDataAsCsv();
    }
    const onSelectionChanged = () => {
        const row = gridRef.current.api.getSelectedRows();
        if(row[0] !== undefined) {
            setRowSelected(row[0]);
        }
        else
            setRowSelected({});
    }

    useEffect(() => {
        axiosPrivate
        .get("/api/show-stock-with-batches")
        .then(function (response) {
            setBatchStockList(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }, []);

    useEffect(() => {
        setBatch({});
        setBatchList(() => []);
        if (batchStock?.id) {
            axiosPrivate
            .get("/api/show-batches-for-stock/"+batchStock?.id)
            .then(function (response) {
                // console.log(response?.data);
                setBatchList(response?.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            });
        }
    }, [batchStock]);

    useEffect(() => {
        setProcess({});
        setProcessList(() => []);
        if (batch?.id) {
            axiosPrivate
            .get("/api/get-processes-for-batch/"+batch?.id)
            .then(function (response) {
                // console.log(response?.data);
                setProcessList(response?.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            });
        }
    }, [batch]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(batchDD && !batchRef?.current?.contains(e.target)) {
                setBatchDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [batchDD, batchRef]);
    const changeBatch = (item) => {
        setBatch(item);
        setBatchDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(batchStockDD && !batchStockRef?.current?.contains(e.target)) {
                setBatchStockDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [batchStockDD, batchStockRef]);
    const changeBatchStock = (item) => {
        setBatchStock(item);
        setBatchStockDD(false);
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

    const [viewBatchOverheadDetails, setViewBatchOverheadDetails] = useState(false);
    const [addBatchOverheadDetails,setAddBatchOverheadDetails] = useState(false);

    const [deleteModal,setDeleteModal] = useState(false);

    const checkOverheadDetailFields = () => {
        return !overheadDetails.every((proc) => {
            return !(proc.overhead === "" || proc.oh_uom === "" || proc.oh_quantity === "" || proc.oh_rate === "");
        });
    }

    const toggleAddBatchOverheadDetails = () => {
        setAddBatchOverheadDetails(true);
        setViewBatchOverheadDetails(false);
    }
    const toggleViewBatchOverheadDetails = async () => {
        axiosPrivate
        .get(`/batch-actual-oh/get-all-actual-batch-oh-entries`)
        .then(function (response) {
            console.log(response?.data);
            setRowData(() => []);
            setRowData(response?.data);
            // setRetOverheadDetails(response?.data);
            setViewBatchOverheadDetails(true);
            setAddBatchOverheadDetails(false);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/batch/overhead");
        });
    }

    const isInvalid = () => {
        if (overheadDetails.length === 0) {
            return (!batch?.id || !process?.id || entryDate === "");
        }
        else {
            return (!batch?.id || !process?.id || entryDate === "" || checkOverheadDetailFields());
        }
    };
    const resetInputFields = () => {
        setBatchStock({});
        setBatch({});
        setProcess({});
        setEntryDate("");
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

    const handleDeleteOhDetail = (funcProps) => {
        const {id} = funcProps;
        axiosPrivate
        .delete("/batch-actual-oh/delete-actual-batch-oh-entries/"+id)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            setDeleteMode(null);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        // if(batch?.id && batchStock?.id && process?.id) {
            toggleViewBatchOverheadDetails();
        // }
    }, []); //batchStock, batch, process

    const handleAddOverheadDetails = () => {
        var overheadIDsList = overheadDetails.map((proc) => { return proc.overhead });
        var isDuplicate = overheadIDsList.some((proc, idx) => { 
            return overheadIDsList.indexOf(proc) != idx 
        });
        if (isDuplicate) {
            setAlert({msg: `Error: Unique overheads only!`, type: "error"});
            return;
        }
        const overheadDetailsMOD = overheadDetails.map((proc) => {
            proc.batch_id = parseInt(batch?.id);
            proc.process_id = parseInt(process?.id);
            proc.created_by = JWT?.user?.username; 
            proc.created_on = getNow();
            proc.entry_date = getDate(entryDate);
            return proc;
        });
        axiosPrivate
        .post("/batch-actual-oh/create-batch-actual-oh", overheadDetailsMOD)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            // resetInputFields();
            setOverheadDetails([{overhead: "", oh_uom: "", oh_quantity: "", oh_rate: ""}]);
            toggleViewBatchOverheadDetails();
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        console.log(overheadDetails)
    }, [overheadDetails]);

    return (
        <>
        <Card>
            <Card.Title>
                Overhead details for batch
            </Card.Title>
            <Card.Line />
            <Card.ButtonGroup flexStart>
                <Button small onClick={() => toggleViewBatchOverheadDetails()}>View all</Button>
                <Button small onClick={() => toggleAddBatchOverheadDetails()}>Add overhead details</Button>
            </Card.ButtonGroup>
        </Card>
        {viewBatchOverheadDetails &&
            <>
                <Grid>
                    <Card.InputColumn notResponsive center>
                        <Grid.Title>
                            View Batch
                        </Grid.Title>
                        <Grid.ButtonGroup flexEnd>
                            <Button small onClick={() => exportCSV()}><Button.Icon><FaFileCsv /></Button.Icon>Export</Button>
                        </Grid.ButtonGroup>
                    </Card.InputColumn>
                    <Grid.Line />
                    {/* <Grid.Line /> */}
                    <div style={{width: "100%", height: "100%", marginBottom: "1rem"}}>
                        <AgGridReact className={(themeContext.type === "dark") ? "ag-theme-alpine-dark" : "ag-theme-alpine"} 
                            rowData={rowData} 
                            columnDefs={columnDefs} 
                            defaultColDef={defaultColDef}
                            animateRows={true} 
                            ref={gridRef}
                            onGridReady={onGridReady}
                            suppressSizeToFit={true}
                            onSelectionChanged={onSelectionChanged}
                            pagination={true}
                            paginationPageSize={15}
                            suppressColumnVirtualisation={true}
                        />
                    </div>
                    {rowSelected?.BATCH_ACTUAL_OH?.entry_number && <Grid.Text>Selected: {rowSelected?.BATCH_ACTUAL_OH?.entry_number}</Grid.Text>}
                        <Grid.ButtonGroup flexStart>
                            <Button disabled={operationInvalid()} onClick={() => navigate(`/batch/overhead/${rowSelected?.BATCH_ACTUAL_OH?.entry_number}/view`)} small>View / Update</Button>
                            {/* <Button disabled={operationInvalid()} small onClick={() => navigate(`/batch/overhead/${rowSelected?.BATCH_ACTUAL_OH?.id}/view`)}>View</Button>
                            <Button disabled={operationInvalid()} small onClick={() => navigate(`/batch/overhead/${rowSelected?.BATCH_ACTUAL_OH?.id}/update`)}>Update</Button> */}
                            <Button disabled={operationInvalid()} danger small onClick={() => {
                                setDeleteMode({id: rowSelected?.BATCH_ACTUAL_OH.entry_number});
                                setDeleteModal(true);
                            }}>Delete</Button>
                        </Grid.ButtonGroup>
                </Grid>
            </>
        }
        {addBatchOverheadDetails &&
            <>
            <Card width="100%">
                <Card.InputColumn width="100%">
                    <Card.InputContainer refPointer={batchStockRef}>
                        <Card.Input readOnly type="text" id="batchStock" placeholder=" " autoComplete="off" value={batchStock?.item_name ? batchStock?.item_name : ""} onClick={() => setBatchStockDD((batchStockDD) => !batchStockDD)} />
                        <Card.Label htmlFor="batchStock" mandatory>Stock item</Card.Label>
                        <Card.Dropdown empty={!batchStockList.length} dropdown={batchStockDD} flexDirection="column">
                            {batchStockList.map((item) => {
                                return <Card.Option selected={(batchStock?.item_name === item.item_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeBatchStock(item)}>{item?.item_name}</Card.Option>
                            })}
                        </Card.Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(batchStockDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
                    <Card.InputContainer refPointer={batchRef}>
                        <Card.Input readOnly type="text" id="batch" placeholder=" " autoComplete="off" value={batch?.batch_number ? batch?.batch_number : ""} onClick={() => setBatchDD((batchDD) => !batchDD)} />
                        <Card.Label htmlFor="batch" mandatory>Batch no.</Card.Label>
                        <Card.Dropdown empty={!batchList.length} dropdown={batchDD} flexDirection="column">
                            {batchList.map((item) => {
                                return <Card.Option selected={(batch?.batch_number === item.batch_number) ? "selected" : undefined} key={item.id} onClick={({target}) => changeBatch(item)}>{item?.batch_number}</Card.Option>
                            })}
                        </Card.Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(batchDD) ? <FiChevronUp /> : <FiChevronDown />}
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
                    <Card.InputContainer>
                        <Card.Input type="date" id="entryDate" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={entryDate} onChange={({ target }) => setEntryDate(target.value)} />
                        <Card.Label htmlFor="entryDate" mandatory>Entry Date</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.Line />
                <Card.InputColumn center notResponsive>
                    <Card.Header>
                        <Card.HeaderText>Overhead</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Unit of Measure</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Rate</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Quantity</Card.HeaderText>
                    </Card.Header>
                    {viewBatchOverheadDetails &&
                        <Card.ButtonContainer width="fit-content" notVisible={true}>
                            <Card.AddButton small />
                        </Card.ButtonContainer>
                    }
                    <Card.ButtonContainer width="fit-content" notVisible={viewBatchOverheadDetails}>
                        <Card.AddButton small onClick={() => {
                            addOverheadDetails();
                        }} />
                    </Card.ButtonContainer>
                </Card.InputColumn>
                {overheadDetails.map((element, index) => {
                    return (
                        <BatchOhDetailsList key={index} element={element} index={index} overheadDetails={overheadDetails} setOverheadDetails={setOverheadDetails} removeOverheadDetails={removeOverheadDetails} />
                    );
                })}
                <Card.ButtonGroup marginTop>
                    <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                    <Button disabled={isInvalid()} onClick={() => handleAddOverheadDetails()} type="submit">Submit</Button>
                </Card.ButtonGroup>
            </Card>
            </>
        }
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteOhDetail} funcProps={deleteMode} setDeleteModal={setDeleteModal}>Are you sure you want to delete this entry?</DeleteModalContainer>
        : null}
        </>
    );
}