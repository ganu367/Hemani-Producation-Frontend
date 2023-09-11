import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Grid } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat, useGridColumnDefns } from "../../../hooks";
import { FaTimes } from "react-icons/fa";
import DeleteModalContainer from "../../delete-modal-container";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import BatchStockDetailsList from "./batch-stock-details-list";
import { FaFileCsv } from "react-icons/fa";
import { ThemeContext } from "styled-components";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function BatchStockDetailsContainer() {
    const {batchStocksGridDefn} = useGridColumnDefns();
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
    const [stockDetails, setStockDetails] = useState([{stock_id: "", uom: "", quantity: "", in_out: "", location_id: ""}]);
    const [retStockDetails, setRetStockDetails] = useState([]);
    const [batchList, setBatchList] = useState([]);
    const [batchStockList, setBatchStockList] = useState([]);
    const [processList, setProcessList] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [deleteMode, setDeleteMode] = useState(null);

    const [rowSelected,setRowSelected] = useState({});
    const [gridApi, setGridApi] = useState(null);
    const operationInvalid = () => {
        if (rowSelected?.BATCH_ACTUAL_CONSUMPTION?.entry_number) {
            return false;
        }
        else {
            return true;
        }
    }

    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState(batchStocksGridDefn);
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

    const [viewBatchStockDetails, setViewBatchStockDetails] = useState(false);
    const [addBatchStockDetails,setAddBatchStockDetails] = useState(false);

    const [deleteModal,setDeleteModal] = useState(false);

    const checkStockDetailFields = () => {
        return !stockDetails.every((proc) => {
            return !(!proc.stock_id || proc.uom === "" || proc.quantity === "" || proc.in_out === "" || !proc.location_id);
        });
    }

    const toggleAddBatchStockDetails = () => {
        setAddBatchStockDetails(true);
        setViewBatchStockDetails(false);
    }
    const toggleViewBatchStockDetails = async () => {
        axiosPrivate
        .get(`/batch-actual-consumption/get-all-batch-ack-consumption-entries`)
        .then(function (response) {
            console.log(response?.data);
            setRowData(() => []);
            setRowData(response?.data);
            // setRetStockDetails(response?.data);
            setViewBatchStockDetails(true);
            setAddBatchStockDetails(false);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/batch/stock");
        });
    }

    const isInvalid = () => {
        if (stockDetails.length === 0) {
            return (!batch?.id || !process?.id || entryDate === "");
        }
        else {
            return (!batch?.id || !process?.id || entryDate === "" || checkStockDetailFields());
        }
    };
    const resetInputFields = () => {
        setBatchStock({});
        setBatch({});
        setProcess({});
        setEntryDate("");
    }

    const addStockDetails = () => {
        setStockDetails([...stockDetails, {stock_id: "", uom: "", quantity: "", in_out: "in", location_id: ""}]);
    }

    const removeStockDetails = (i) => {
        const tempProcs = [...stockDetails];
        if (tempProcs.length === 1) {
            setStockDetails([{stock_id: "", uom: "", quantity: "", in_out: "in", location_id: ""}]);
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

    const handleDeleteStockDetail = (funcProps) => {
        const {id} = funcProps;
        axiosPrivate
        .delete("/batch-actual-consumption/delete-batch-ack-consumption-entries/"+id)
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
            toggleViewBatchStockDetails();
        // }
    }, []); //batchStock, batch, process

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
            proc.batch_id = parseInt(batch?.id);
            proc.process_id = parseInt(process?.id);
            proc.created_by = JWT?.user?.username; 
            proc.created_on = getNow();
            proc.entry_date = getDate(entryDate);
            return proc;
        });
        axiosPrivate
        .post("/batch-actual-consumption/create-batch-ack-consumption", stockDetailsMOD)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            // resetInputFields();
            setStockDetails([{stock_id: "", uom: "", quantity: "", in_out: "in", location_id: ""}]);
            toggleViewBatchStockDetails();
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        console.log(stockDetails)
    }, [stockDetails]);

    return (
        <>
        <Card>
            <Card.Title>
                Stock details for batch
            </Card.Title>
            <Card.Line />
            <Card.ButtonGroup flexStart>
                <Button small onClick={() => toggleViewBatchStockDetails()}>View all</Button>
                <Button small onClick={() => toggleAddBatchStockDetails()}>Add stock details</Button>
            </Card.ButtonGroup>
        </Card>
        {viewBatchStockDetails &&
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
                    {rowSelected?.BATCH_ACTUAL_CONSUMPTION?.entry_number && <Grid.Text>Selected: {rowSelected?.BATCH_ACTUAL_CONSUMPTION?.entry_number}</Grid.Text>}
                        <Grid.ButtonGroup flexStart>
                            <Button disabled={operationInvalid()} onClick={() => navigate(`/batch/stock/${rowSelected?.BATCH_ACTUAL_CONSUMPTION?.entry_number}/view`)} small>View / Update</Button>
                            {/* <Button disabled={operationInvalid()} small onClick={() => navigate(`/batch/stock/${rowSelected?.BATCH_ACTUAL_CONSUMPTION?.id}/view`)}>View</Button>
                            <Button disabled={operationInvalid()} small onClick={() => navigate(`/batch/stock/${rowSelected?.BATCH_ACTUAL_CONSUMPTION?.id}/update`)}>Update</Button> */}
                            <Button disabled={operationInvalid()} danger small onClick={() => {
                                setDeleteMode({id: rowSelected?.BATCH_ACTUAL_CONSUMPTION.entry_number});
                                setDeleteModal(true);
                            }}>Delete</Button>
                        </Grid.ButtonGroup>
                </Grid>
            </>
        }
        {addBatchStockDetails &&
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
                    <Card.Header>
                        <Card.HeaderText>Location</Card.HeaderText>
                    </Card.Header>
                    {viewBatchStockDetails &&
                        <Card.ButtonContainer width="fit-content" notVisible={true}>
                            <Card.AddButton small />
                        </Card.ButtonContainer>
                    }
                    <Card.ButtonContainer width="fit-content" notVisible={viewBatchStockDetails}>
                        <Card.AddButton small onClick={() => {
                            addStockDetails();
                        }} />
                    </Card.ButtonContainer>
                </Card.InputColumn>
                {stockDetails.map((element, index) => {
                    return (
                        <BatchStockDetailsList key={index} element={element} index={index} stockDetails={stockDetails} setStockDetails={setStockDetails} removeStockDetails={removeStockDetails} />
                    );
                })}
                <Card.ButtonGroup marginTop>
                    <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                    <Button disabled={isInvalid()} onClick={() => handleAddStockDetails()} type="submit">Submit</Button>
                </Card.ButtonGroup>
            </Card>
            </>
        }
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteStockDetail} funcProps={deleteMode} setDeleteModal={setDeleteModal}>Are you sure you want to delete this entry?</DeleteModalContainer>
        : null}
        </>
    );
}