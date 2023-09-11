import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../../components";
import { useAxiosPrivate, useAlert, useDateFormat } from "../../../hooks";
import { FaTimes } from "react-icons/fa";

export default function ViewBatchStockDetailsContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const {dateConverter,timeConverter} = useDateFormat();
    const params = useParams();
    const navigate = useNavigate();
    const [entryNumber, setEntryNumber] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [inOut, setInOut] = useState("");
    const [quantity, setQuantity] = useState("");
    const [stock, setStock] = useState("");
    const [UOM, setUOM] = useState("");
    const [process, setProcess] = useState("");
    const [location, setLocation] = useState("");
    const [actualRate, setActualRate] = useState("");
    const [standardRate, setStandardRate] = useState("");
    
    useEffect(() => {
        axiosPrivate
        .get("/batch-actual-consumption/get-batch-ack-consumption-by-ids/"+params.id)
        .then(function (response) {
            console.log(response.data);
            const batchStock = response?.data?.BATCH_ACTUAL_CONSUMPTION;
            const batch = response?.data?.BATCH;
            const stock = response?.data?.StockMaster;
            const process = response?.data?.PROCESS;
            const location = response?.data?.Location;
            setEntryNumber(batchStock?.entry_number ? batchStock?.entry_number : "");
            setBatchNumber(batch?.batch_number ? batch?.batch_number : "");
            setEntryDate(batchStock?.entry_date ? batchStock?.entry_date : "");
            setInOut(batchStock?.in_out ? batchStock?.in_out : "");
            setQuantity(batchStock?.quantity ? batchStock?.quantity : "");
            setStock(stock?.item_name ? stock?.item_name : "");
            setUOM(stock?.uom ? stock?.uom : "-");
            setProcess(process?.process_name ? process?.process_name : "-");
            setLocation(location?.location_name ? location?.location_name : "-");
            setStandardRate(batchStock?.standard_rate ? batchStock?.standard_rate : "-");
            setActualRate(batchStock?.actual_rate ? batchStock?.actual_rate : "-");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/batch/stock");
        });
    },[]);

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Batch stock entry{entryNumber ? ` ${entryNumber}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/batch/stock/${params.id}/update`, {state: { from: location }})}>Update stock detail</Button>
                    <Button small iconPadding danger onClick={() => navigate("/batch/stock", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="name">{stock} ({UOM})</Card.ViewTitle>
                        {/* <Card.ViewSubtitle id="name">Batch no. {batchNumber}</Card.ViewSubtitle> */}
                        {/* <Card.ViewSubtitle id="name">Process - {process}</Card.ViewSubtitle> */}
                        {/* <Card.Status id="status" status={status} marginTop>{status}</Card.Status> */}
                        <Card.InputContainer notAlone width="fit-content" noMarginBottom>
                            <Card.ViewDash noWrap>Batch no: </Card.ViewDash>
                            <Card.ViewText id="batchNumber" noWrap>{batchNumber}</Card.ViewText>
                        </Card.InputContainer>
                        <Card.InputContainer notAlone width="fit-content" noMarginBottom>
                            <Card.ViewDash noWrap>Process: </Card.ViewDash>
                            <Card.ViewText id="process" noWrap>{process}</Card.ViewText>
                        </Card.InputContainer>
                        <Card.InputContainer notAlone width="fit-content" noMarginBottom>
                            <Card.ViewDash noWrap>From: </Card.ViewDash>
                            <Card.ViewText id="location" noWrap>{location}</Card.ViewText>
                        </Card.InputContainer>
                        <Card.InputContainer notAlone width="fit-content" noMarginBottom>
                            <Card.ViewDash noWrap>Entry date: </Card.ViewDash>
                            <Card.ViewText id="location" noWrap>{dateConverter(entryDate)}</Card.ViewText>
                        </Card.InputContainer>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>QUANTITY: </Card.ViewLabel>
                        <Card.ViewText id="quantity">{quantity}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>IN / OUT: </Card.ViewLabel>
                        <Card.ViewText id="inOut">{inOut}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
            {/* <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>ACTUAL RATE: </Card.ViewLabel>
                        <Card.ViewText id="actualRate">{actualRate}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>STANDARD RATE: </Card.ViewLabel>
                        <Card.ViewText id="standardRate">{standardRate}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn> */}
        </Card>
        </>
    );
}