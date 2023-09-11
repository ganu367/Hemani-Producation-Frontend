import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";

export default function UpdateActualCostContainer() {
    const {JWT} = useAuth();
    const {getNow,getDate} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const location = useLocation();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const [stock, setStock] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [UOM, setUOM] = useState("");
    const [rate, setRate] = useState("");

    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const isInvalid = () => {
        return (stock === "" || fromDate === "" || UOM === "" || rate === "");
    };
    const resetInputFields = () => {
        setFromDate("");
        setRate("");
    }

    useEffect(() => {
        axiosPrivate
        .get("/acost/get-actual-cost-by-ids/"+params.id)
        .then(function (response) {
            console.log(response.data);
            const actCost = response?.data;
            setStock(actCost?.item_name ? actCost?.item_name : "");
            setFromDate(actCost?.from_date ? actCost?.from_date.substring(0,10) : "");
            setUOM(actCost?.uom ? actCost?.uom : "");
            setRate(actCost?.rate ? actCost?.rate : "");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/actual-cost");
        });
    },[]);

    const handleUpdateActualCost = () => {
        axiosPrivate
        .put("/acost/update-actual-cost/"+params.id, {}, {params: {from_date: getDate(fromDate), uom: UOM, rate: Number(rate), modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/actual-cost");
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    const handleRate = (num) => {
        if ((num >= 1) || num == "") {
            const validated = num.match(/^(\d*\.{0,1}\d{0,2}$)/)
            if (validated) {
                setRate(num);
            }
        }
    }

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Actual Cost{stock ? ` for ${stock}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate("/actual-cost", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="stock" placeholder=" " autoComplete="off" value={stock} />
                        <Card.Label htmlFor="stock" mandatory>Stock item</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="UOM" placeholder=" " autoComplete="off" value={UOM} />
                        <Card.Label htmlFor="UOM" mandatory>UOM</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Input type="date" id="fromDate" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={fromDate} onChange={({ target }) => setFromDate(target.value)} />
                        <Card.Label htmlFor="fromDate" mandatory>From Date</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer prefixx={"₹ "}>
                        <Card.Input type="number" id="rate" placeholder=" " autoComplete="off" value={rate} onKeyDown={blockInvalidNumber} onChange={({target}) => handleRate(target.value)} />
                        <Card.Label htmlFor="rate" prefixx mandatory>Rate</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                <Button disabled={isInvalid()} onClick={() => handleUpdateActualCost()} type="submit">Update actual cost</Button>
            </Card.ButtonGroup>
        </Card>
        </>
    );
}