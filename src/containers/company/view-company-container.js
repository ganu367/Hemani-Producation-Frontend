import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useBase64ToFile } from "../../hooks";
import { FaTimes } from "react-icons/fa";
import { acecomLogo } from "../../constants";

export default function ViewCompanyContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const location = useLocation();
    const dataURLtoFile = useBase64ToFile();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [logo, setLogo] = useState({});
    const [logoPreview, setLogoPreview] = useState(acecomLogo);
    const [GST, setGST] = useState("");
    const [PAN, setPAN] = useState("");
    const [email, setEmail] = useState("");
    const [SMTPport, setSMTPport] = useState("");
    const [SMTPserver, setSMTPserver] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        axiosPrivate
        .get("/company/get-by-company-ids/"+params.id)
        .then(function (response) {
            // console.log(response.data);
            const company = response.data;
            setName(company?.company_name ? company?.company_name : "");
            setCode(company?.company_code ? company?.company_code : "");
            setGST(company?.gst_number ? company?.gst_number : "-");
            setPAN(company?.pan_number ? company?.pan_number : "-");
            setLogo(company?.company_logo ? company?.company_logo : "");
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

    const viewFile = async (path, filePath) => {
        try {
            const response = await axiosPrivate.get("/api/utility/send-file", {params: {file_path: path}}, {responseType: "arraybuffer"});
            if(response?.data) {
                const previewURL = "data:image/jpeg;base64," + response?.data;
                const docFile = dataURLtoFile(previewURL, path.substring(path.lastIndexOf('\\')+10), {type: "image/jpeg"});
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
                setLogo(file);
                setLogoPreview(URL.createObjectURL(file));
            }
            else {
                setLogo({});
                setLogoPreview(acecomLogo);
            }
        }
    }

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Company{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/company/${params.id}/update`, {state: { from: location }})}>Update Company</Button>
                    <Button small iconPadding danger onClick={() => navigate("/company", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="name">{name}</Card.ViewTitle>
                        <Card.ViewSubtitle id="code">{code}</Card.ViewSubtitle>
                    </Card.ViewRow>
                </Card.InputContainer>
                <Card.InputContainer flexEnd>
                    <Card.ImagePreview alone id="logoPreview" src={logoPreview} />
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn alignEnd>
                <Card.InputColumn alignEnd>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>GST NUMBER: </Card.ViewLabel>
                            <Card.ViewText id="GST">{GST}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>PAN NUMBER: </Card.ViewLabel>
                            <Card.ViewText id="PAN">{PAN}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                </Card.InputColumn>
            </Card.InputColumn>
            {email &&
                <>
                    <Card.InputColumn>
                        <Card.InputContainer>
                            <Card.ViewRow>
                                <Card.ViewLabel>EMAIL ADDRESS: </Card.ViewLabel>
                                <Card.ViewText id="email">{email}</Card.ViewText>
                            </Card.ViewRow>
                        </Card.InputContainer>
                        <Card.InputContainer>
                            <Card.ViewRow>
                                <Card.ViewLabel>PASSWORD: </Card.ViewLabel>
                                <Card.ViewText id="password">{password}</Card.ViewText>
                            </Card.ViewRow>
                        </Card.InputContainer>
                    </Card.InputColumn>
                    <Card.InputColumn>
                        <Card.InputContainer>
                            <Card.ViewRow>
                                <Card.ViewLabel>SMTP PORT: </Card.ViewLabel>
                                <Card.ViewText id="SMTPport">{SMTPport}</Card.ViewText>
                            </Card.ViewRow>
                        </Card.InputContainer>
                        <Card.InputContainer>
                            <Card.ViewRow>
                                <Card.ViewLabel>SMTP SERVER: </Card.ViewLabel>
                                <Card.ViewText id="SMTPserver">{SMTPserver}</Card.ViewText>
                            </Card.ViewRow>
                        </Card.InputContainer>
                    </Card.InputColumn>
                </>
            }
        </Card>
        </>
    );
}