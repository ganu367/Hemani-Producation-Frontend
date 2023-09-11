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

export default function LocationContainer() {
    const {getNow} = useDateFormat();
    const {JWT} = useAuth();
    const {locationsGridDefn} = useGridColumnDefns();
    const dataURLtoFile = useBase64ToFile();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [company, setCompany] = useState("");
    const companyRef = useRef();
    const [companyDD, setCompanyDD] = useState(false);
    const [branch, setBranch] = useState("");
    const branchRef = useRef();
    const [branchDD, setBranchDD] = useState(false);
    const [plant, setPlant] = useState("");
    const plantRef = useRef();
    const [plantDD, setPlantDD] = useState(false);
    const [companiesList, setCompaniesList] = useState([]);
    const [branchesList, setBranchesList] = useState([]);
    const [plantsList, setPlantsList] = useState([]);

    const isInvalid = () => {
        return (name === "" || code === "" || company?.id === (null || undefined) || branch?.id === (null || undefined) || plant?.id === (null || undefined));
    };
    const [deleteModal,setDeleteModal] = useState(false);
    const resetInputFields = () => {
        setName("");
        setCode("");
        setCompany({});
        setBranch({});
        setPlant({});
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

    useEffect(() => {
        setBranch({});
        setBranchesList(() => []);
        if (company?.id) {
            axiosPrivate
            .get("/api/get-branch/"+company?.id)
            .then(function (response) {
                setBranchesList(response.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
                navigate("/branch");
            });
        }
    }, [company]);

    useEffect(() => {
        setPlant({});
        setPlantsList(() => []);
        if (branch?.id) {
            axiosPrivate
            .get("/api/get-plant/"+branch?.id)
            .then(function (response) {
                setPlantsList(response.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
                navigate("/branch");
            });
        }
    }, [branch]);
    
    const [viewGrid, setViewGrid] = useState(false);
    const [addLocation,setAddLocation] = useState(false);

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
    const [columnDefs, setColumnDefs] = useState(locationsGridDefn);
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

    const toggleAddLocation = () => {
        setAddLocation(true);
        setViewGrid(false);
    }
    const toggleViewGrid = async () => {
        try {
            const response = await axiosPrivate.get("/location/get-all-location");
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
            navigate("/location", { state: { from: location }, replace: true });
        }
        finally {
            setViewGrid(true);
            setAddLocation(false);
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
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(branchDD && !branchRef?.current?.contains(e.target)) {
                setBranchDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [branchDD, branchRef]);
    const changeBranch = (item) => {
        setBranch(item);
        setBranchDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(plantDD && !plantRef?.current?.contains(e.target)) {
                setPlantDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [plantDD, plantRef]);
    const changePlant = (item) => {
        setPlant(item);
        setPlantDD(false);
    }
    
    const handleAddLocation = () => {
        axiosPrivate
        .post("/location/create-location", {}, {params: {location_name: name, location_code: code, company_id: company?.id, branch_id: branch?.id, plant_id: plant?.id, created_by: JWT?.user?.username, created_on: getNow()}})
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

    const handleDeleteLocation = () => {
        axiosPrivate
        .delete("/location/delete-location/"+rowSelected.id)
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
                Locations
            </Card.Title>
            <Card.Line />
            <Card.ButtonGroup flexStart>
                <Button small onClick={() => toggleViewGrid()}>View all</Button>
                <Button small onClick={() => toggleAddLocation()}>Add location</Button>
            </Card.ButtonGroup>
        </Card>
        {addLocation &&
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
                    <Card.InputContainer refPointer={branchRef}>
                        <Card.Input readOnly type="text" id="branch" placeholder=" " autoComplete="off" value={branch?.branch_name ? branch?.branch_name : ""} onClick={() => setBranchDD((branchDD) => !branchDD)} />
                        <Card.Label htmlFor="branch" mandatory>Branch</Card.Label>
                        <Dropdown empty={!branchesList.length} width={"100%"} dropdown={branchDD} flexDirection="column">
                            {branchesList.map((item) => {
                                return <Dropdown.Option selected={(branch?.branch_name === item.branch_name) ? "selected" : undefined} key={item.id} onClick={() => changeBranch(item)}>{item.branch_name}</Dropdown.Option>
                            })}
                        </Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(branchDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
                    <Card.InputContainer refPointer={plantRef}>
                        <Card.Input readOnly type="text" id="plant" placeholder=" " autoComplete="off" value={plant?.plant_name ? plant?.plant_name : ""} onClick={() => setPlantDD((plantDD) => !plantDD)} />
                        <Card.Label htmlFor="plant" mandatory>Plant</Card.Label>
                        <Dropdown empty={!plantsList.length} width={"100%"} dropdown={plantDD} flexDirection="column">
                            {plantsList.map((item) => {
                                return <Dropdown.Option selected={(plant?.plant_name === item.plant_name) ? "selected" : undefined} key={item.id} onClick={() => changePlant(item)}>{item.plant_name}</Dropdown.Option>
                            })}
                        </Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(plantDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
                </Card.InputColumn>
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
                <Card.ButtonGroup marginTop>
                    <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                    <Button disabled={isInvalid()} onClick={() => handleAddLocation()} type="submit">Add location</Button>
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
                {rowSelected.id && <Grid.Text>Selected: {rowSelected.location_name}</Grid.Text>}
                {/* {rowSelected.id && */}
                    <Grid.ButtonGroup flexStart>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/location/${rowSelected.id}/view`)}>View</Button>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/location/${rowSelected.id}/update`)}>Update</Button>
                        <Button disabled={operationInvalid()} danger small onClick={() => setDeleteModal(true)}>Delete</Button>
                    </Grid.ButtonGroup>
                {/* } */}
            </Grid>
        }
        {(deleteModal) ? 
            <DeleteModalContainer deleteFunction={handleDeleteLocation} setDeleteModal={setDeleteModal}>Are you sure you want to delete this location?</DeleteModalContainer>
        : null}
        </>
    );
}