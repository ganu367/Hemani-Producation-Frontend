import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";

export default function UpdateBranchContainer() {
    const {JWT} = useAuth();
    const {getNow} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const location = useLocation();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [address, setAddress] = useState("");
    const [GST, setGST] = useState("");
    const [PAN, setPAN] = useState("");
    const [company, setCompany] = useState({});

    const isInvalid = () => {
        return (name === "" || code === "" || address === "" || company?.id === (null || undefined));
    };
    const resetInputFields = () => {
        setName("");
        setCode("");
        setGST("");
        setPAN("");
        setAddress("");
    }

    useEffect(() => {
        axiosPrivate
        .get("/branch/get-branches-by-id/"+params.id)
        .then(function (response) {
            // console.log(response.data);
            const branch = response.data?.Branch;
            setName(branch?.branch_name ? branch?.branch_name : "");
            setCode(branch?.branch_code ? branch?.branch_code : "");
            setGST(branch?.gst_number ? branch?.gst_number : "");
            setPAN(branch?.pan_number ? branch?.pan_number : "");
            setAddress(branch?.address ? branch?.address : "");
            const companyName = response.data?.company_name;
            setCompany(companyName ? {id: branch?.company_id, name: companyName} : "");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/branch");
        });
    },[]);

    const handleUpdateBranch = () => {
        axiosPrivate
        .put("/branch/update-branch/"+params.id, {}, {params: {branch_name: name, branch_code: code, gst_number: GST, pan_number: PAN, address: address, company_id: company?.id, modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/branch");
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Branch{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate("/branch", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="company" placeholder=" " autoComplete="off" value={company?.name} />
                    <Card.Label htmlFor="company" mandatory>Company</Card.Label>
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
                <Button disabled={isInvalid()} onClick={() => handleUpdateBranch()} type="submit">Update branch</Button>
            </Card.ButtonGroup>
        </Card>
        </>
    );
}