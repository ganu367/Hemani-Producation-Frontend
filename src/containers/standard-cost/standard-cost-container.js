import React, { useState, useMemo, useRef, useContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Grid, Modal } from "../../components";
import { DeleteModalContainer } from "..";
import { useAxiosPrivate, useAlert, useGridColumnDefns, useAuth, useDateFormat } from "../../hooks";
import { FaFileCsv } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { ThemeContext } from "styled-components";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function StandardCostContainer() {
    const {getNow,getDate,defaultDate} = useDateFormat();
    const {JWT} = useAuth();
    const {costsGridDefn} = useGridColumnDefns();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [stock, setStock] = useState("");
    const [stockList, setStockList] = useState([]);
    const [fromDate, setFromDate] = useState(defaultDate());
    const [UOM, setUOM] = useState("");
    const [rate, setRate] = useState("");

    const stockRef = useRef();
    const [stockDD, setStockDD] = useState(false);

    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const isInvalid = () => {
        return (stock === "" || fromDate === "" || UOM === "" || rate === "");
    };
    const [deleteModal,setDeleteModal] = useState(false);
    const resetInputFields = () => {
        setStock("");
        setFromDate("");
        setUOM("");
        setRate("");
    }

    useEffect(() => {
        axiosPrivate
        .get("/stock/get-all-stock")
        .then(function (response) {
            // console.log(response?.data);
            setStockList(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/standard-cost");
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
    const [addStandardCost,setAddStandardCost] = useState(false);

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
    const [columnDefs, setColumnDefs] = useState(costsGridDefn);
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

    const toggleAddStandardCost = () => {
        setAddStandardCost(true);
        setViewGrid(false);
    }
    const toggleViewGrid = async () => {
        try {
            const response = await axiosPrivate.get("/scost/get-all-standard-cost");
            if(response?.data) {
                console.log(response?.data);
                setRowData(() => []);
                setRowData(response?.data);
            }
            else {
                throw new Error();
            }
        }
        catch (err) {
            setAlert({msg: err, type: "error"});
            navigate("/standard-cost", { state: { from: location }, replace: true });
        }
        finally {
            setViewGrid(true);
            setAddStandardCost(false);
            setRowSelected({});
        }
    }
    
    const handleAddStandardCost = () => {
        axiosPrivate
        .post("/scost/create-standard-cost", {},{params: {stock_id: stock?.id, from_date: getDate(fromDate), uom: UOM, rate: Number(rate), created_by: JWT?.user?.username, created_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            toggleViewGrid();
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    const handleDeleteStandardCost = () => {
        axiosPrivate
        .delete("/scost/delete-standard-cost/"+rowSelected.id)
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

    const handleRate = (num) => {
        if ((num >= 1) || num == "") {
            const validated = num.match(/^(\d*\.{0,1}\d{0,2}$)/)
            if (validated) {
                setRate(num);
            }
        }
    }

    return (
        <>
        <Card>
            <Card.Title>
                Standard Costs
            </Card.Title>
            <Card.Line />
            <Card.ButtonGroup flexStart>
                <Button small onClick={() => toggleViewGrid()}>View all</Button>
                <Button small onClick={() => toggleAddStandardCost()}>Add standard cost</Button>
            </Card.ButtonGroup>
        </Card>
        {addStandardCost &&
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
                        <Card.Input type="date" id="fromDate" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={fromDate} onChange={({ target }) => setFromDate(target.value)} />
                        <Card.Label htmlFor="fromDate" mandatory>From Date</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer prefixx={"₹ "}>
                        <Card.Input type="number" id="rate" placeholder=" " autoComplete="off" value={rate} onKeyDown={blockInvalidNumber} onChange={({target}) => handleRate(target.value)} />
                        <Card.Label htmlFor="rate" prefixx mandatory>Rate</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.ButtonGroup marginTop>
                    <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                    <Button disabled={isInvalid()} onClick={() => handleAddStandardCost()} type="submit">Add standard cost</Button>
                </Card.ButtonGroup>
            </Card>
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
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/standard-cost/${rowSelected.id}/view`)}>View</Button>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/standard-cost/${rowSelected.id}/update`)}>Update</Button>
                        <Button disabled={operationInvalid()} danger small onClick={() => setDeleteModal(true)}>Delete</Button>
                    </Grid.ButtonGroup>
                {/* } */}
            </Grid>
        }
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteStandardCost} setDeleteModal={setDeleteModal}>Are you sure you want to delete this standard cost?</DeleteModalContainer>
        : null}
        </>
    );
}