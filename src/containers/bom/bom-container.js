import React, { useState, useMemo, useRef, useContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Grid, Modal } from "../../components";
import BomEditModal from "..";
import { DeleteModalContainer } from "..";
import { useAxiosPrivate, useAlert, useGridColumnDefns, useAuth, useDateFormat } from "../../hooks";
import { FaFileCsv } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { ThemeContext } from "styled-components";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function BomContainer() {
    const {getNow,getDate} = useDateFormat();
    const {JWT} = useAuth();
    const {bomsGridDefn} = useGridColumnDefns();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [stock, setStock] = useState("");
    const [stockList, setStockList] = useState([]);
    const [name, setName] = useState("");
    const [UOM, setUOM] = useState("");
    const [quantity, setQuantity] = useState("");
    const [processes, setProcesses] = useState([{process_name: ""}]);

    const stockRef = useRef();
    const [stockDD, setStockDD] = useState(false);

    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const checkProcessFields = () => {
        return !processes.every((proc) => {
            return !(proc.process_name === "");
        });
    }

    const isInvalid = () => {
        if (processes.length === 0) {
            return (stock === "" || name === "" || UOM === "" || quantity === "");
        }
        else {
            return (stock === "" || name === "" || UOM === "" || quantity === "" || checkProcessFields());
        }
    };
    const [deleteModal,setDeleteModal] = useState(false);
    const resetInputFields = () => {
        setStock("");
        setName("");
        setUOM("");
        setQuantity("");
    }

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
        setUOM(item?.uom);
        setStockDD(false);
    }
    
    const [viewGrid, setViewGrid] = useState(false);
    const [addBom,setAddBom] = useState(false);
    // const [addProcessesTab,setAddProcessesTab] = useState(false);
    // const [addProcessesButton,setAddProcessesButton] = useState(true);

    const [rowSelected,setRowSelected] = useState({});
    const [gridApi, setGridApi] = useState(null);
    const operationInvalid = () => {
        if (rowSelected?.id) {
            return false;
        }
        else {
            return true;
        }
    }

    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState(bomsGridDefn);
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

    const toggleAddBom = () => {
        setAddBom(true);
        setViewGrid(false);
    }
    const toggleViewGrid = async () => {
        try {
            const response = await axiosPrivate.get("/bom/get-all-bom");
            if(response?.data) {
                // console.log(response?.data);
                setRowData(() => []);
                setRowData(response?.data);
            }
            else {
                throw new Error();
            }
        }
        catch (err) {
            setAlert({msg: err, type: "error"});
            navigate("/bom", { state: { from: location }, replace: true });
        }
        finally {
            setViewGrid(true);
            setAddBom(false);
            // setAddProcessesTab(false);
            // setAddProcessesButton(true);
            setRowSelected({});
        }
    }
    
    const handleAddBom = () => {
        var processNamesList = processes.map((proc) => { return proc.process_name.toLowerCase() });
        var isDuplicate = processNamesList.some((proc, idx) => { 
            return processNamesList.indexOf(proc) != idx 
        });
        if (isDuplicate) {
            setAlert({msg: `Error: Unique processes only!`, type: "error"});
            return;
        }
        // axiosPrivate
        // .post("/bom/create-bom", {},{params: {processes: processes, stock_id: stock?.id, bom_name: name, uom: UOM, bom_quantity: Number(quantity), created_by: JWT?.user?.username, created_on: getNow()}})
        // .then(function (response) {
        //     setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        // })
        // .then(() => {
        //     resetInputFields();
        //     toggleViewGrid();
        // })
        // .catch(function (error) {
        //     // console.log(error)
        //     setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        // });
        const newProcesses = processes.map((proc) => {
            proc.created_by = JWT?.user?.username; 
            proc.created_on = getNow();
            return proc;
        });
        axiosPrivate
        .post("/bom/create-bom", {process: newProcesses, stock_id: stock?.id, bom_name: name, uom: UOM, bom_quantity: Number(quantity), created_by: JWT?.user?.username, created_on: getNow()})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            toggleViewGrid();
            setProcesses([{process_name: ""}]);
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    const handleDeleteBom = () => {
        axiosPrivate
        .delete("/bom/delete-bom/"+rowSelected.id)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        toggleViewGrid();
    }, []);

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

    const addProcess = () => {
        setProcesses([...processes, {process_name: ""}]);
    }

    const removeProcess = (i) => {
        // setProcesses(processes.filter((proc, index) => index !== i));
        const tempProcs = [...processes];
        if (tempProcs.length === 1) {
            setProcesses([{process_name: ""}]);
            // setAddProcessesTab(false);
            // setAddProcessesButton(true);
            return;
        }
        tempProcs.splice(i, 1);
        setProcesses(tempProcs);
    }

    const removeAllProcesses = () => {
        setProcesses([{process_name: ""}]);
        // setAddProcessesTab(false);
        // setAddProcessesButton(true);
    }

    return (
        <>
        <Card>
            <Card.Title>
                Bill of Material (BoM)
            </Card.Title>
            <Card.Line />
            <Card.ButtonGroup flexStart>
                <Button small onClick={() => toggleViewGrid()}>View all</Button>
                <Button small onClick={() => toggleAddBom()}>Add bill of material</Button>
            </Card.ButtonGroup>
        </Card>
        {addBom &&
            <>
            <Card width="75%">
                <Card.InputColumn>
                    <Card.InputContainer refPointer={stockRef}>
                        <Card.Input readOnly stock="text" id="stock" placeholder=" " autoComplete="off" value={stock?.item_name ? stock?.item_name : ""} onClick={() => setStockDD((stockDD) => !stockDD)} />
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
                    {/* {addProcessesButton &&
                        <>
                            <Button onClick={() => {
                                setAddProcessesTab(true);
                                setAddProcessesButton(false);
                                setProcesses([{process_sequence: "", process_name: ""}]);
                            }}>Add processes</Button>
                            <Button disabled={isInvalid()} onClick={() => handleAddBom()} type="submit">Add bill of material</Button>
                        </>
                    } */}
                </Card.ButtonGroup>
            </Card>
            {/* {addProcessesTab && */}
            <Card width="45%" responsiveWidth="75%">
                <Card.InputColumn center notResponsive>
                    {/* <Card.Header width="20%">
                        <Card.HeaderText>Sr. No.</Card.HeaderText>
                    </Card.Header> */}
                    <Card.Header>
                        <Card.HeaderText>Process name</Card.HeaderText>
                    </Card.Header>
                    <Card.ButtonContainer width="fit-content">
                        <Card.AddButton small onClick={() => addProcess()} />
                    </Card.ButtonContainer>
                    {/* <Card.Header width="buttonWidth" /> */}
                    {/* <Card.Header width="buttonWidth" /> */}
                </Card.InputColumn>
                {processes.map((element, index) => {
                    return (
                        <Card.InputColumn center key={index} notResponsive>
                            {/* <Card.MultiInputContainer width="20%">
                                <Card.MultiInput type="number" id="process_sequence" name="process_sequence" placeholder=" " autoComplete="off" value={element.process_sequence} onChange={(evnt) => handleProcess(index, evnt)} />
                            </Card.MultiInputContainer> */}
                            <Card.MultiInputContainer>
                                <Card.MultiInput type="text" id="process_name" name="process_name"  placeholder=" " autoComplete="off" value={element.process_name} onChange={(evnt) => handleProcess(index, evnt)} />
                            </Card.MultiInputContainer>
                            <Card.ButtonContainer width="fit-content">
                                <Card.AddButton danger deletes small onClick={() => removeProcess(index)} />
                            </Card.ButtonContainer>
                            {/* <Card.ButtonContainer width="fit-content" notVisible={index !== (processes.length - 1)}>
                                <Card.AddButton small onClick={() => addProcess()} />
                            </Card.ButtonContainer> */}
                            {/* <Card.ButtonContainer width="fit-content">
                                <Card.AddButton small onClick={() => addProcess()} />
                            </Card.ButtonContainer> */}
                        </Card.InputColumn>
                    );
                })}
                {/* {!addProcessesButton &&
                    <> */}
                <Card.ButtonGroup marginTop>
                    <Button danger nofill onClick={() => removeAllProcesses()}>Remove all</Button>
                    <Button disabled={isInvalid()} onClick={() => handleAddBom()} type="submit">Add bill of material</Button>
                </Card.ButtonGroup>
                    {/* </>
                } */}
            </Card>
            {/* } */}
            </>
        }
        {viewGrid &&
            <Grid>
                <Grid.ButtonGroup flexEnd marginBottom>
                    <Button small onClick={() => exportCSV()}><Button.Icon><FaFileCsv /></Button.Icon>Export</Button>
                </Grid.ButtonGroup>
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
                {rowSelected.id && <Grid.Text>Selected: {rowSelected.item_name}</Grid.Text>}
                {/* {rowSelected.id && */}
                    <Grid.ButtonGroup flexStart>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/bom/${rowSelected.id}/view`)}>View</Button>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/bom/${rowSelected.id}/update`)}>Update</Button>
                        <Button disabled={operationInvalid()} danger small onClick={() => setDeleteModal(true)}>Delete</Button>
                    </Grid.ButtonGroup>
                {/* } */}
            </Grid>
        }
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteBom} setDeleteModal={setDeleteModal}>Are you sure you want to delete this bill of material?</DeleteModalContainer>
        : null}
        </>
    );
}