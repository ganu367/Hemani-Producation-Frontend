import React, { useState, useMemo, useRef, useContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Grid, Card } from "../../components";
import { DeleteModalContainer } from "..";
import { useAxiosPrivate, useAlert, useGridColumnDefns } from "../../hooks";
import { FaFileCsv } from "react-icons/fa";
import { ThemeContext } from "styled-components";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function ViewAllBatchContainer() {
    const {batchesGridDefn} = useGridColumnDefns();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [deleteModal,setDeleteModal] = useState(false);

    const [rowSelected,setRowSelected] = useState({});
    const [gridApi, setGridApi] = useState(null);
    const operationInvalid = () => {
        if (rowSelected?.BATCH?.id) {
            return false;
        }
        else {
            return true;
        }
    }

    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState(batchesGridDefn);
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

    const toggleViewGrid = async () => {
        try {
            const response = await axiosPrivate.get("/batch/get-all-batch");
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
            navigate("/batch/start", { state: { from: location }, replace: true });
        }
        finally {
            setRowSelected({});
        }
    }

    const handleDeleteBom = () => {
        axiosPrivate
        .delete("/batch/delete-batch/"+rowSelected?.BATCH?.id)
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
        <Grid minHeight="95%">
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
            {rowSelected?.BATCH?.id && <Grid.Text>Selected: {rowSelected?.BATCH?.batch_number}</Grid.Text>}
            {/* {rowSelected.id && */}
                <Grid.ButtonGroup flexStart>
                    <Button disabled={operationInvalid()} small onClick={() => navigate(`/batch/${rowSelected?.BATCH?.id}/view`)}>View</Button>
                    <Button disabled={operationInvalid()} small onClick={() => navigate(`/batch/${rowSelected?.BATCH?.id}/update`)}>Update</Button>
                    <Button disabled={operationInvalid()} danger small onClick={() => setDeleteModal(true)}>Delete</Button>
                </Grid.ButtonGroup>
            {/* } */}
        </Grid>
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteBom} setDeleteModal={setDeleteModal}>Are you sure you want to delete this batch?</DeleteModalContainer>
        : null}
        </>
    );
}