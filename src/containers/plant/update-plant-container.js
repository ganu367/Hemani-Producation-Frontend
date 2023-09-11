import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";

export default function UpdatePlantContainer() {
    const {JWT} = useAuth();
    const {getNow} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const location = useLocation();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [company, setCompany] = useState({});
    const [branch, setBranch] = useState({});

    const isInvalid = () => {
        return (name === "" || code === "" || company?.id === (null || undefined) || branch?.id === (null || undefined));
    };
    const resetInputFields = () => {
        setName("");
        setCode("");
    }

    useEffect(() => {
        axiosPrivate
        .get("/plant/get-by-plant-ids/"+params.id)
        .then(function (response) {
            // console.log(response.data);
            const plant = response?.data?.Plants;
            setName(plant?.plant_name ? plant?.plant_name : "");
            setCode(plant?.plant_code ? plant?.plant_code : "");
            const companyName = response.data?.company_name;
            setCompany(companyName ? {id: plant?.company_id, name: companyName} : "");
            const branchName = response.data?.branch_name;
            setBranch(branchName ? {id: plant?.branch_id, name: branchName} : "");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/plant");
        });
    },[]);

    const handleUpdatePlant = () => {
        axiosPrivate
        .put("/plant/update-plant/"+params.id, {}, {params: {plant_name: name, plant_code: code, company_id: company?.id, branch_id: branch?.id, modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/plant");
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
                <Card.Title>Plant{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate("/plant", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="company" placeholder=" " autoComplete="off" value={company?.name} />
                    <Card.Label htmlFor="company" mandatory>Company</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="branch" placeholder=" " autoComplete="off" value={branch?.name} />
                    <Card.Label htmlFor="branch" mandatory>Branch</Card.Label>
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
                <Button disabled={isInvalid()} onClick={() => handleUpdatePlant()} type="submit">Update plant</Button>
            </Card.ButtonGroup>
        </Card>
        </>
    );
}