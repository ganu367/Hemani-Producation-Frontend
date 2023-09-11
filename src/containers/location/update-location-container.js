import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";

export default function UpdateLocationContainer() {
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
    const [plant, setPlant] = useState({});

    const isInvalid = () => {
        return (name === "" || code === "" || company?.id === (null || undefined) || branch?.id === (null || undefined) || plant?.id === (null || undefined));
    };
    const resetInputFields = () => {
        setName("");
        setCode("");
    }

    useEffect(() => {
        axiosPrivate
        .get("/location/get-by-location-ids/"+params.id)
        .then(function (response) {
            // console.log(response.data);
            const location = response.data?.Location;
            setName(location?.location_name ? location?.location_name : "");
            setCode(location?.location_code ? location?.location_code : "");
            const companyName = response.data?.company_name;
            setCompany(companyName ? {id: location?.company_id, name: companyName} : "");
            const branchName = response.data?.branch_name;
            setBranch(branchName ? {id: location?.branch_id, name: branchName} : "");
            const plantName = response.data?.plant_name;
            setPlant(plantName ? {id: location?.plant_id, name: plantName} : "");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/location");
        });
    },[]);

    const handleUpdateLocation = () => {
        axiosPrivate
        .put("/location/update-location/"+params.id, {}, {params: {location_name: name, location_code: code, company_id: company?.id, branch_id: branch?.id, plant_id: plant?.id, modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/location");
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
                <Card.Title>Location{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate("/location", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
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
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="plant" placeholder=" " autoComplete="off" value={plant?.name} />
                    <Card.Label htmlFor="plant" mandatory>Plant</Card.Label>
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
                <Button disabled={isInvalid()} onClick={() => handleUpdateLocation()} type="submit">Update location</Button>
            </Card.ButtonGroup>
        </Card>
        </>
    );
}