import React, { useState, useMemo, useRef, useContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Grid } from "../../components";
import { DeleteModalContainer } from "../../containers";
import { useAxiosPrivate, useAlert, useBase64ToFile, useGridColumnDefns, useAuth, useDateFormat } from "../../hooks";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaFileCsv } from "react-icons/fa";
import { ThemeContext } from "styled-components";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function CompanyContainer() {
    const {getNow} = useDateFormat();
    const {JWT} = useAuth();
    const {companiesGridDefn} = useGridColumnDefns();
    const dataURLtoFile = useBase64ToFile();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [logo, setLogo] = useState([]);
    const [logoPreview, setLogoPreview] = useState();
    const [GST, setGST] = useState("");
    const [PAN, setPAN] = useState("");
    const [email, setEmail] = useState("");
    const [SMTPport, setSMTPport] = useState("");
    const [SMTPserver, setSMTPserver] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const isInvalid = () => {
        if(email === "") {
            return (name === "" || code === "");
        }
        else {
            return (name === "" || code === "" || email === "" || SMTPport === "" || SMTPserver === "" || password === "");
        }
    };
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }
    const blockInvalidNumber = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
    const [deleteModal,setDeleteModal] = useState(false);
    const resetInputFields = () => {
        setName("");
        setCode("");
        setLogo([]);
        setGST("");
        setPAN("");
        setEmail("");
        setSMTPport("");
        setSMTPserver("");
        setPassword("");
        setLogoPreview();
    }

    useEffect(() => {
        if (email === "") {
            setSMTPport("");
            setSMTPserver("");
            setPassword("");
        }
    }, [email]);
    
    
    const [viewGrid, setViewGrid] = useState(false);
    const [addCompany,setAddCompany] = useState(false);

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
    const [columnDefs, setColumnDefs] = useState(companiesGridDefn);
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

    const toggleAddCompany = () => {
        setAddCompany(true);
        setViewGrid(false);
    }
    const toggleViewGrid = async () => {
        try {
            const response = await axiosPrivate.get("/company/get-all-company");
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
            navigate("/company", { state: { from: location }, replace: true });
        }
        finally {
            setViewGrid(true);
            setAddCompany(false);
            setRowSelected({});
        }
    }

    useEffect(() => {
        toggleViewGrid();
    }, []);
    
    const handleAddCompany = () => {
        if(email !== "") {
            if(!isValidEmail(email)) {
                setAlert({msg: `Error: Email is invalid! Enter a valid email! Example: abc@gmail.com`, type: "error"});
                return;
            }
        }
        const formData = new FormData();
        formData.append('company_logo', logo[0]);
        axiosPrivate
        .post("/company/create-company", (logo.length ? formData : {body: formData}), {params: {company_name: name, company_code: code, gst_number: GST, pan_number: PAN, email_address: email, smtp_port: (SMTPport ? parseInt(SMTPport) : null), smtp_server: SMTPserver, email_password: password, created_by: JWT?.user?.username, created_on: getNow()}, 
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
        }})
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

    const handleDeleteCompany = () => {
        axiosPrivate
        .delete("/company/delete-company/"+rowSelected.id)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    const viewFile = async (path, filePath) => {
        try {
            const response = await axiosPrivate.get("/api/utility/send-file", {params: {file_path: path}}, {responseType: "arraybuffer"});
            if(response?.data) {
                const previewURL = "data:image/jpeg;base64," + response?.data;
                const docFile = dataURLtoFile(previewURL, path.substring(path.lastIndexOf('\\')+9), {type: "image/jpeg"});
                fileHandler(docFile,filePath);
            }
            else {
                throw new Error();
            }
        }
        catch (err) {
            setAlert({msg: err.message, type: "error"});
        }
    }
    const fileHandler = (file,filePath) => {
        if(filePath === "logoPreview") {
            if(file !== undefined) {
                setLogo([file]);
                setLogoPreview(URL.createObjectURL(file));
            }
            else {
                setLogo([]);
                setLogoPreview();
            }
        }
    }

    const imageHandler = (img) => {
        // console.log("img: ",img);
        if(img[0] !== undefined) {
            const imageList = []
            for(let i = 0; i < img.length; i++) {
                imageList.push(img[i]);
            }
            setLogo(imageList);
            setLogoPreview(URL.createObjectURL(imageList[0]));
        }
        else {
            setLogo([]);
            setLogoPreview();
        }
    }

    const removeLogo = (filename) => {
        setLogo(logo.filter((file) => file.name !== filename));
        setLogoPreview();
    }
    
    const handleSMTPport = (num) => {
        if ((num >= 1) || num == "") {
            setSMTPport(num.replace(/^0+/, ''));
        }
        if (num == 0) {
            setSMTPport(num.replace(/^0+/, 0))
        }
    }

    return (
        <>
        <Card>
            <Card.Title>
                Companies
            </Card.Title>
            <Card.Line />
            <Card.ButtonGroup flexStart>
                <Button small onClick={() => toggleViewGrid()}>View all</Button>
                <Button small onClick={() => toggleAddCompany()}>Add company</Button>
            </Card.ButtonGroup>
        </Card>
        {addCompany &&
            <Card width="75%">
                <Card.InputColumn center>
                    <Card.InputRow>
                        <Card.InputColumn>
                            <Card.InputContainer>
                                <Card.Input type="text" id="name" placeholder=" " autoComplete="off" value={name} onChange={({target}) => setName(target.value)} />
                                <Card.Label htmlFor="name" mandatory>Name</Card.Label>
                            </Card.InputContainer>
                        </Card.InputColumn>
                        <Card.InputColumn>
                            <Card.InputContainer>
                                <Card.Input type="text" id="code" placeholder=" " autoComplete="off" value={code} onChange={({target}) => setCode(target.value)} />
                                <Card.Label htmlFor="code" mandatory>Code</Card.Label>
                            </Card.InputContainer>
                        </Card.InputColumn>
                    </Card.InputRow>
                    <Card.InputRow center width={"fit-content"}>
                        <Card.InputColumn>
                            <Card.InputContainer width="100%" noMarginBottom>
                                <Card.Input file={logo[0]?.name} type="file" id="logo" onChange={({target}) => imageHandler(target.files)} accept=".png,.jpeg,.jpg" /> 
                                <Card.Label htmlFor="logo">Logo</Card.Label>
                                <Card.Placeholder visible={logo.length === 0 ? true : false}>
                                    Max size 1MB
                                </Card.Placeholder>
                                <Card.Tooltip>
                                    File size should be less than 1MB. File types can be .jpeg, .jpg, .png
                                </Card.Tooltip>
                            </Card.InputContainer>
                        </Card.InputColumn>
                        <Card.InputColumn>
                            {logo.map((doc) => {
                                return (
                                <Card.InputContainer width="fit-content" key={doc.name}>
                                    <Card.ImagePreview alone id="logoPreview" src={URL.createObjectURL(doc)} />
                                    <Card.ImageRemoveIcon onClick={() => removeLogo(doc.name)} />
                                </Card.InputContainer>
                                );
                            })}
                        </Card.InputColumn>
                    </Card.InputRow>
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
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Input type="text" id="email" placeholder=" " autoComplete="off" value={email} onChange={({target}) => setEmail(target.value)} />
                        <Card.Label htmlFor="email">Email</Card.Label>
                    </Card.InputContainer>
                    {email &&
                        <Card.InputContainer>
                            <Card.Input type={(showPassword) ? "text" : "password"} id="password"  autoComplete="off" placeholder=" " value={password} onChange={({target}) => setPassword(target.value)} />
                            <Card.Label htmlFor="password" mandatory>Password</Card.Label>
                            <Card.Icon onClick={() => {setShowPassword(!showPassword)}}>
                                {(showPassword) ? <AiFillEye /> : <AiFillEyeInvisible />}
                            </Card.Icon>
                        </Card.InputContainer>
                    }
                </Card.InputColumn>
                {email &&
                    <>
                        <Card.InputColumn>
                            <Card.InputContainer>
                                <Card.Input type="number" id="SMTPport" placeholder=" " autoComplete="off" onKeyDown={blockInvalidNumber} value={SMTPport} onChange={({target}) => handleSMTPport(target.value)} />
                                <Card.Label htmlFor="SMTPport" mandatory>SMTP port</Card.Label>
                            </Card.InputContainer>
                            <Card.InputContainer>
                                <Card.Input type="text" id="SMTPserver" placeholder=" " autoComplete="off" value={SMTPserver} onChange={({target}) => setSMTPserver(target.value)} />
                                <Card.Label htmlFor="SMTPserver" mandatory>SMTP server</Card.Label>
                            </Card.InputContainer>
                        </Card.InputColumn>
                    </>
                }
                <Card.ButtonGroup marginTop>
                    <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                    <Button disabled={isInvalid()} onClick={() => handleAddCompany()} type="submit">Add company</Button>
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
                {rowSelected.id && <Grid.Text>Selected: {rowSelected.company_name}</Grid.Text>}
                {/* {rowSelected.id && */}
                    <Grid.ButtonGroup flexStart>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/company/${rowSelected.id}/view`)}>View</Button>
                        <Button disabled={operationInvalid()} small onClick={() => navigate(`/company/${rowSelected.id}/update`)}>Update</Button>
                        <Button disabled={operationInvalid()} danger small onClick={() => setDeleteModal(true)}>Delete</Button>
                    </Grid.ButtonGroup>
                {/* } */}
            </Grid>
        }
        {(deleteModal) ? 
            <DeleteModalContainer deleteFunction={handleDeleteCompany} setDeleteModal={setDeleteModal}>Are you sure you want to delete this company?</DeleteModalContainer>
        : null}
        </>
    );
}