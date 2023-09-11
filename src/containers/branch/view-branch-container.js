import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert } from "../../hooks";
import { FaTimes } from "react-icons/fa";

export default function ViewBranchContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [GST, setGST] = useState("");
    const [PAN, setPAN] = useState("");
    const [address, setAddress] = useState("");
    const [company, setCompany] = useState({});
    
    useEffect(() => {
        axiosPrivate
        .get("/branch/get-branches-by-id/"+params.id)
        .then(function (response) {
            // console.log(response.data);
            const branch = response.data?.Branch;
            setName(branch?.branch_name ? branch?.branch_name : "");
            setCode(branch?.branch_code ? branch?.branch_code : "");
            setGST(branch?.gst_number ? branch?.gst_number : "-");
            setPAN(branch?.pan_number ? branch?.pan_number : "-");
            setAddress(branch?.address ? branch?.address : "-");
            const companyName = response.data?.company_name;
            setCompany(companyName ? {id: branch?.company_id, name: companyName} : "");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/branch");
        });
    },[]);

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Branch{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/branch/${params.id}/update`, {state: { from: location }})}>Update Branch</Button>
                    <Button small iconPadding danger onClick={() => navigate("/branch", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="name">{name}</Card.ViewTitle>
                        <Card.ViewSubtitle id="code">{code}</Card.ViewSubtitle>
                        <Card.ViewSubtitle id="company">{company?.name}</Card.ViewSubtitle>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>ADDRESS: </Card.ViewLabel>
                        <Card.ViewText id="address">{address}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
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
        </Card>
        </>
    );
}