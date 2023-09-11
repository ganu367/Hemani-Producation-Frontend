import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";

export default function ViewStandardCostContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {dateConverter} = useDateFormat();
    const {setAlert} = useAlert();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [stock, setStock] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [UOM, setUOM] = useState("");
    const [rate, setRate] = useState("");
    
    useEffect(() => {
        axiosPrivate
        .get("/scost/get-standard-cost-by-ids/"+params.id)
        .then(function (response) {
            console.log(response.data);
            const standCost = response?.data;
            setStock(standCost?.item_name ? standCost?.item_name : "");
            setFromDate(standCost?.from_date ? standCost?.from_date.substring(0,10) : "");
            setUOM(standCost?.uom ? standCost?.uom : "");
            setRate(standCost?.rate ? standCost?.rate : "");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/standard-cost");
        });
    },[]);

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Standard Cost{stock ? ` for ${stock}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/standard-cost/${params.id}/update`, {state: { from: location }})}>Update Standard Cost</Button>
                    <Button small iconPadding danger onClick={() => navigate("/standard-cost", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="stock">{stock} (per {UOM.toLowerCase()})</Card.ViewTitle>
                        {/* <Card.ViewSubtitle id="code">{code}</Card.ViewSubtitle> */}
                        <Card.InputContainer notAlone width="fit-content" noMarginBottom>
                            <Card.ViewDash>Rate: </Card.ViewDash>
                            <Card.ViewText id="fromDate">{dateConverter(fromDate)}</Card.ViewText>
                        {/* </Card.InputContainer>
                        <Card.InputContainer notAlone width="fit-content" noMarginTop noMarginBottom> */}
                            <Card.ViewDash>From: </Card.ViewDash>
                            <Card.ViewText id="rate">₹ {rate}</Card.ViewText>
                        </Card.InputContainer>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
        </Card>
        </>
    );
}