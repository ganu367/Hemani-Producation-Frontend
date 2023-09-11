import React, { useState, useMemo, useRef, useContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Grid, Modal } from "../../components";
import { DeleteModalContainer } from "..";
import { useAxiosPrivate, useAlert, useGridColumnDefns, useAuth, useDateFormat } from "../../hooks";
import { categoriesList, typesList } from "../../constants";
import { FaFileCsv } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { ThemeContext } from "styled-components";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function StockContainer() {
    const {getNow} = useDateFormat();
    const {JWT} = useAuth();
    const {stocksGridDefn} = useGridColumnDefns();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [UOM, setUOM] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("Goods");
    const [HSNSAcode, setHSNSAcode] = useState("");

    const UOMRef = useRef();
    const [UOMDD, setUOMDD] = useState(false);
    const [UOMList, setUOMList] = useState([]);
    const [UOMModal, setUOMModal] = useState(false);
    const [newUOM, setNewUOM] = useState("");
    const categoryRef = useRef();
    const [categoryDD, setCategoryDD] = useState(false);
    const typeRef = useRef();
    const [typeDD, setTypeDD] = useState(false);

    const blockInvalidNumber = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

    const isInvalid = () => {
        return (name === "" || code === "" || description === "" || UOM === "" || category === "" || type === "");
    };
    const [deleteModal,setDeleteModal] = useState(false);
    const resetInputFields = () => {
        setName("");
        setCode("");
        setDescription("");
        setUOM("");
        setCategory("");
        setType("");
        setHSNSAcode("");
    }

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(categoryDD && !categoryRef?.current?.contains(e.target)) {
                setCategoryDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [categoryDD, categoryRef]);
    const changeCategory = (item) => {
        setCategory(item);
        setCategoryDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(typeDD && !typeRef?.current?.contains(e.target)) {
                setTypeDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [typeDD, typeRef]);
    const changeType = (item) => {
        setType(item);
        setTypeDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(UOMDD && !UOMRef?.current?.contains(e.target)) {
                setUOMDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [UOMDD, UOMRef]);
    const changeUOM = (item) => {
        setUOM(item);
        setUOMDD(false);
    }
    
    const [viewGrid, setViewGrid] = useState(false);
    const [addStock,setAddStock] = useState(false);

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
    const [columnDefs, setColumnDefs] = useState(stocksGridDefn);
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

    const toggleAddStock = () => {
        setAddStock(true);
        setViewGrid(false);
    }
    const toggleViewGrid = async () => {
        try {
            const response = await axiosPrivate.get("/stock/get-all-stock");
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
            navigate("/stock", { state: { from: location }, replace: true });
        }
        finally {
            setViewGrid(true);
            setAddStock(false);
            setRowSelected({});
        }
    }
    
    const handleAddStock = () => {
        axiosPrivate
        .post("/stock/create-stock", {},{params: {item_name: name, item_code: code, item_desc: description, uom: UOM, item_category: category, item_type: type, hsn_sa_code: (HSNSAcode ? parseInt(HSNSAcode) : null), created_by: JWT?.user?.username, created_on: getNow()}})
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

    const handleDeleteStock = () => {
        axiosPrivate
        .delete("/stock/delete-stock/"+rowSelected.id)
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

    const handleAddNewUOM = () => {
        const lowerCaseNewUOM = newUOM.toLowerCase(); //newUOM.charAt(0).toUpperCase() + newUOM.slice(1).toLowerCase();
        const isNotPresent = UOMList.every((item) => {
            // console.log(lowerCaseNewUOM, " != ",item.uom_name, " ? ",lowerCaseNewUOM !== item.uom_name);
            return lowerCaseNewUOM !== item.uom_name;
        });
        if(isNotPresent) {
            axiosPrivate
            .post("/uom/create-uom", {}, {params: {uom_name: lowerCaseNewUOM, created_by: JWT?.user?.username, created_on: getNow()}, 
            headers: {
                "Content-Type": "application/json"
            }})
            .then(function (response) {
                // console.log(response?.data)
                setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            })
            .then(() => {
                setNewUOM("");
                setUOMModal(false);
                setUOM(lowerCaseNewUOM);
                showUOM();
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            });
        }
        else {
            setAlert({msg: `Error: Unit of Measure already exists!`, type: "error"});
        }
    }

    const showUOM = () => {
        axiosPrivate
        .get("/uom/shows-uom")
        .then(function (response) {
            // console.log(response?.data);
            setUOMList(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        showUOM();
    }, []);

    const handleHSNSAcode = (num) => {
        if ((num >= 1) || num == "") {
            setHSNSAcode(num.replace(/^0+/, ''));
        }
        if (num == 0) {
            setHSNSAcode(num.replace(/^0+/, 0))
        }
    }

    return (
        <>
        <Card>
            <Card.Title>
                Stock
            </Card.Title>
            <Card.Line />
            <Card.ButtonGroup flexStart>
                <Button small onClick={() => toggleViewGrid()}>View all</Button>
                <Button small onClick={() => toggleAddStock()}>Add stock</Button>
            </Card.ButtonGroup>
        </Card>
        {addStock &&
            <Card width="75%">
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Input required type="text" id="name" placeholder=" " autoComplete="off" value={name} onChange={({target}) => setName(target.value)} />
                        <Card.Label htmlFor="name" mandatory>Name</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input type="text" id="code" placeholder=" " autoComplete="off" value={code} onChange={({target}) => setCode(target.value)} />
                        <Card.Label htmlFor="code" mandatory>Code</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Textarea type="text" id="description" placeholder=" " autoComplete="off" value={description} onChange={({target}) => setDescription(target.value)} />
                        <Card.Label htmlFor="description" mandatory>Description</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.InputColumn>
                    <Card.InputContainer refPointer={UOMRef}>
                        <Card.Input readOnly type="text" id="UOM" placeholder=" " autoComplete="off" value={UOM} onClick={() => setUOMDD((UOMDD) => !UOMDD)} />
                        <Card.Label htmlFor="UOM" mandatory>Unit of Measure</Card.Label>
                        <Card.Dropdown dropdown={UOMDD} flexDirection="column">
                            {UOMList.map((item) => {
                                return <Card.Option selected={(UOM === item.uom_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeUOM(item.uom_name)}>{item.uom_name}</Card.Option>
                            })}
                            <Card.OptionButton onClick={() => setUOMModal(true)}><Button>Add new</Button></Card.OptionButton>
                        </Card.Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(UOMDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
                    <Card.InputContainer refPointer={categoryRef}>
                        <Card.Input readOnly type="text" id="category" placeholder=" " autoComplete="off" value={category} onClick={() => setCategoryDD((categoryDD) => !categoryDD)} />
                        <Card.Label htmlFor="category" mandatory>Category</Card.Label>
                        <Card.Dropdown empty={!categoriesList.length} dropdown={categoryDD} flexDirection="column">
                            {categoriesList.map((item) => {
                                return <Card.Option selected={(category === item.category) ? "selected" : undefined} key={item.id} onClick={({target}) => changeCategory(item.category)}>{item.category}</Card.Option>
                            })}
                        </Card.Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(categoryDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.InputColumn>
                    <Card.InputContainer refPointer={typeRef}>
                        <Card.Input readOnly type="text" id="type" placeholder=" " autoComplete="off" value={type} onClick={() => setTypeDD((typeDD) => !typeDD)} />
                        <Card.Label htmlFor="type" mandatory>Type</Card.Label>
                        <Card.Dropdown empty={!typesList.length} dropdown={typeDD} flexDirection="column">
                            {typesList.map((item) => {
                                return <Card.Option selected={(type === item.type) ? "selected" : undefined} key={item.id} onClick={({target}) => changeType(item.type)}>{item.type}</Card.Option>
                            })}
                        </Card.Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(typeDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input type="number" id="HSNSAcode" placeholder=" " autoComplete="off" value={HSNSAcode} onKeyDown={blockInvalidNumber} onChange={({target}) => handleHSNSAcode(target.value)} />
                        <Card.Label htmlFor="HSNSAcode">HSN / SA code</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.ButtonGroup marginTop>
                    <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                    <Button disabled={isInvalid()} onClick={() => handleAddStock()} type="submit">Add stock</Button>
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
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/stock/${rowSelected.id}/view`)}>View</Button>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/stock/${rowSelected.id}/update`)}>Update</Button>
                        <Button disabled={operationInvalid()} danger small onClick={() => setDeleteModal(true)}>Delete</Button>
                    </Grid.ButtonGroup>
                {/* } */}
            </Grid>
        }
        {(deleteModal) ? 
            <DeleteModalContainer deleteFunction={handleDeleteStock} setDeleteModal={setDeleteModal}>Are you sure you want to delete this stock?</DeleteModalContainer>
        : null}
        {(UOMModal) ?
            <Modal>
                <Modal.Container>
                    <Modal.Title>Add new Unit of Measure</Modal.Title>
                    <Modal.Line />
                    <Modal.InputContainer>
                        <Modal.Input type="text" id="newUOM" placeholder=" " autoComplete="off" value={newUOM} onChange={({target}) => setNewUOM(target.value)} />
                        <Modal.Label htmlFor="newUOM">New Unit of Measure</Modal.Label>
                    </Modal.InputContainer>
                    <Modal.ButtonContainer>
                        <Button nofill onClick={() => {
                            setUOMModal(false);
                            setNewUOM("");
                        }}>Cancel</Button>
                        <Button onClick={() => handleAddNewUOM()}>Confirm</Button>
                    </Modal.ButtonContainer>
                </Modal.Container>
            </Modal>
        : null}
        </>
    );
}