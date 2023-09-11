import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert } from "../../hooks";
import { FaTimes } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

export default function ViewLocationContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [company, setCompany] = useState("");
    const [branch, setBranch] = useState("");
    const [plant, setPlant] = useState("");
    
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

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Location{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/location/${params.id}/update`, {state: { from: location }})}>Update Location</Button>
                    <Button small iconPadding danger onClick={() => navigate("/location", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="name">{name}</Card.ViewTitle>
                        <Card.ViewSubtitle id="code">{code}</Card.ViewSubtitle>
                        <Card.ViewSubtitle id="company">{company?.name} <Card.RightArrow /> {branch?.name} <Card.RightArrow /> {plant?.name}</Card.ViewSubtitle>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
        </Card>
        </>
    );
}