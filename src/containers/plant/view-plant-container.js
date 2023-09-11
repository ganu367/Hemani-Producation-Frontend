import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert } from "../../hooks";
import { FaTimes } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

export default function ViewPlantContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [company, setCompany] = useState("");
    const [branch, setBranch] = useState("");
    
    useEffect(() => {
        axiosPrivate
        .get("/plant/get-by-plant-ids/"+params.id)
        .then(function (response) {
            // console.log(response.data);
            const plant = response.data?.Plants;
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

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Plant{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/plant/${params.id}/update`, {state: { from: location }})}>Update Plant</Button>
                    <Button small iconPadding danger onClick={() => navigate("/plant", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="name">{name}</Card.ViewTitle>
                        <Card.ViewSubtitle id="code">{code}</Card.ViewSubtitle>
                        <Card.ViewSubtitle id="company">{company?.name} <Card.RightArrow /> {branch?.name}</Card.ViewSubtitle>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
        </Card>
        </>
    );
}