import React, { useState, useMemo, useRef, useContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Grid, Dropdown } from "../../components";
import { DeleteModalContainer } from "..";
import { useAxiosPrivate, useAlert, useBase64ToFile, useGridColumnDefns, useAuth, useDateFormat } from "../../hooks";
import { FaFileCsv } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { ThemeContext } from "styled-components";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function BranchContainer() {
    const {getNow} = useDateFormat();
    const {JWT} = useAuth();
    const {branchesGridDefn} = useGridColumnDefns();
    const dataURLtoFile = useBase64ToFile();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [address, setAddress] = useState("");
    const [GST, setGST] = useState("");
    const [PAN, setPAN] = useState("");
    const [company, setCompany] = useState("");
    const companyRef = useRef();
    const [companyDD, setCompanyDD] = useState(false);
    const [companiesList, setCompaniesList] = useState([]);

    const isInvalid = () => {
        return (name === "" || code === "" || address === "" || company?.id === (null || undefined));
    };
    const [deleteModal,setDeleteModal] = useState(false);
    const resetInputFields = () => {
        setName("");
        setCode("");
        setGST("");
        setPAN("");
        setAddress("");
        setCompany({});
    }

    useEffect(() => {
        axiosPrivate
        .get("/api/get-company")
        .then(function (response) {
            setCompaniesList(response.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/branch");
        });
    }, []);
    
    const [viewGrid, setViewGrid] = useState(false);
    const [addBranch,setAddBranch] = useState(false);

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
    const [columnDefs, setColumnDefs] = useState(branchesGridDefn);
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

    const toggleAddBranch = () => {
        setAddBranch(true);
        setViewGrid(false);
    }
    const toggleViewGrid = async () => {
        try {
            const response = await axiosPrivate.get("/branch/get-all-branches");
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
            navigate("/branch", { state: { from: location }, replace: true });
        }
        finally {
            setViewGrid(true);
            setAddBranch(false);
            setRowSelected({});
        }
    }

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(companyDD && !companyRef?.current?.contains(e.target)) {
                setCompanyDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [companyDD, companyRef]);
    const changeCompany = (item) => {
        setCompany(item);
        setCompanyDD(false);
    }
    
    const handleAddBranch = () => {
        axiosPrivate
        .post("/branch/create-branch", {},{params: {branch_name: name, branch_code: code, gst_number: GST, pan_number: PAN, address: address, company_id: company?.id, created_by: JWT?.user?.username, created_on: getNow()}})
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

    const handleDeleteBranch = () => {
        axiosPrivate
        .delete("/branch/delete-branch/"+rowSelected.id)
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

    return (
        <>
        <Card>
            <Card.Title>
                Branches
            </Card.Title>
            <Card.Line />
            <Card.ButtonGroup flexStart>
                <Button small onClick={() => toggleViewGrid()}>View all</Button>
                <Button small onClick={() => toggleAddBranch()}>Add branch</Button>
            </Card.ButtonGroup>
        </Card>
        {addBranch &&
            <Card width="75%">
                <Card.InputColumn>
                    <Card.InputContainer refPointer={companyRef}>
                        <Card.Input readOnly type="text" id="company" placeholder=" " autoComplete="off" value={company?.company_name ? company?.company_name : ""} onClick={() => setCompanyDD((companyDD) => !companyDD)} />
                        <Card.Label htmlFor="company" mandatory>Company</Card.Label>
                        <Dropdown empty={!companiesList.length} width={"100%"} dropdown={companyDD} flexDirection="column">
                            {companiesList.map((item) => {
                                return <Dropdown.Option selected={(company?.company_name === item.company_name) ? "selected" : undefined} key={item.id} onClick={() => changeCompany(item)}>{item.company_name}</Dropdown.Option>
                            })}
                        </Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(companyDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
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
                        <Card.Textarea type="text" id="address" placeholder=" " autoComplete="off" value={address} onChange={({target}) => setAddress(target.value)} />
                        <Card.Label htmlFor="address" mandatory>Address</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Input required type="text" id="GST" maxLength={15} placeholder=" " autoComplete="off" value={GST} onChange={({target}) => setGST(target.value)} />
                        <Card.Label htmlFor="GST">GST</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input type="text" id="PAN" maxLength={10} placeholder=" " autoComplete="off" value={PAN} onChange={({target}) => setPAN(target.value)} />
                        <Card.Label htmlFor="PAN">PAN</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.ButtonGroup marginTop>
                    <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                    <Button disabled={isInvalid()} onClick={() => handleAddBranch()} type="submit">Add branch</Button>
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
                {rowSelected.id && <Grid.Text>Selected: {rowSelected.branch_name}</Grid.Text>}
                {/* {rowSelected.id && */}
                    <Grid.ButtonGroup flexStart>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/branch/${rowSelected.id}/view`)}>View</Button>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/branch/${rowSelected.id}/update`)}>Update</Button>
                        <Button disabled={operationInvalid()} danger small onClick={() => setDeleteModal(true)}>Delete</Button>
                    </Grid.ButtonGroup>
                {/* } */}
            </Grid>
        }
        {(deleteModal) ? 
            <DeleteModalContainer deleteFunction={handleDeleteBranch} setDeleteModal={setDeleteModal}>Are you sure you want to delete this branch?</DeleteModalContainer>
        : null}
        </>
    );
}