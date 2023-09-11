import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useBase64ToFile, useAuth, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function UpdateCompanyContainer() {
    const {JWT} = useAuth();
    const {getNow} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const initialRender = useRef(true);
    const params = useParams();
    const location = useLocation();
    const {state} = useLocation();
    const {setAlert} = useAlert();
    const dataURLtoFile = useBase64ToFile();
    const navigate = useNavigate();
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
        axiosPrivate
        .get("/company/get-by-company-ids/"+params.id)
        .then(function (response) {
            console.log(response.data);
            const company = response.data;
            setName(company?.company_name ? company?.company_name : "");
            setCode(company?.company_code ? company?.company_code : "");
            setGST(company?.gst_number ? company?.gst_number : "");
            setPAN(company?.pan_number ? company?.pan_number : "");
            setEmail(company?.email_address ? company?.email_address : "");
            setPassword(company?.email_password ? company?.email_password : "");
            setSMTPport(company?.smtp_port ? company?.smtp_port : "");
            setSMTPserver(company?.smtp_server ? company?.smtp_server : "");
            if(company.company_logo !== null) {
                viewFile(company.company_logo,"logoPreview");
            }
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/company");
        });
    },[]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        }
        else {
            if (email === "") {
                setSMTPport("");
                setSMTPserver("");
                setPassword("");
            }
        }
    }, [email]);

    // useEffect(() => {
    //     console.log("logo length: ",logo.length)
    // }, [logo])
    
    const handleUpdateCompany = () => {
        if(email !== "") {
            if(!isValidEmail(email)) {
                setAlert({msg: `Error: Email is invalid! Enter a valid email! Example: abc@gmail.com`, type: "error"});
                return;
            }
        }

        // original code
        const formData = new FormData();
        formData.append('company_logo', logo[0]);
        axiosPrivate
        .put("/company/update-company/"+params.id, (logo.length ? formData : {body: formData}), {params: {company_name: name, company_code: code, gst_number: GST, pan_number: PAN, email_address: email, smtp_port: (SMTPport ? parseInt(SMTPport) : null), smtp_server: SMTPserver, email_password: password, modified_by: JWT?.user?.username, modified_on: getNow()}, 
        headers: {
            "Content-Type": "multipart/form-data",
            'Accept': 'application/json',
        }})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/company");
        })
        .catch(function (error) {
            // console.log(error)
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

    // useEffect(() => {
    //     console.log("logo log: ",logo)
    // }, [logo])
    

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Company{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate("/company", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
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
                <Button disabled={isInvalid()} onClick={() => handleUpdateCompany()} type="submit">Update company</Button>
            </Card.ButtonGroup>
        </Card>
        </>
    );
}