import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../../components";
import { useAxiosPrivate, useAlert, useDateFormat } from "../../../hooks";
import { FaTimes } from "react-icons/fa";

export default function ViewBatchOhDetailsContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const {dateConverter,timeConverter} = useDateFormat();
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [entryNumber, setEntryNumber] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [overhead, setOverhead] = useState("");
    const [rate, setRate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [UOM, setUOM] = useState("");
    const [process, setProcess] = useState("");
    
    useEffect(() => {
        axiosPrivate
        .get("/batch-actual-oh/get-actual-batch-oh-by-ids/"+params.id)
        .then(function (response) {
            console.log(response.data);
            const batchOh = response?.data?.BATCH_ACTUAL_OH;
            const batch = response?.data?.BATCH;
            const process = response?.data?.PROCESS;
            setEntryNumber(batchOh?.entry_number ? batchOh?.entry_number : "");
            setBatchNumber(batch?.batch_number ? batch?.batch_number : "");
            setEntryDate(batchOh?.entry_date ? batchOh?.entry_date : "");
            setOverhead(batchOh?.overhead ? batchOh?.overhead : "");
            setRate(batchOh?.oh_rate ? batchOh?.oh_rate : "-");
            setQuantity(batchOh?.oh_quantity ? batchOh?.oh_quantity : "");
            setUOM(batchOh?.oh_uom ? batchOh?.oh_uom : "-");
            setProcess(process?.process_name ? process?.process_name : "-");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/batch/overhead");
        });
    },[]);

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Batch overhead entry{entryNumber ? ` ${entryNumber}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/batch/overhead/${params.id}/update`, {state: { from: location }})}>Update overhead detail</Button>
                    <Button small iconPadding danger onClick={() => navigate("/batch/overhead", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="name">{overhead} ({UOM})</Card.ViewTitle>
                        <Card.InputContainer notAlone width="fit-content" noMarginBottom>
                            <Card.ViewDash noWrap>Batch no: </Card.ViewDash>
                            <Card.ViewText id="batchNumber" noWrap>{batchNumber}</Card.ViewText>
                        </Card.InputContainer>
                        <Card.InputContainer notAlone width="fit-content" noMarginBottom>
                            <Card.ViewDash noWrap>Process: </Card.ViewDash>
                            <Card.ViewText id="process" noWrap>{process}</Card.ViewText>
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
                        <Card.ViewLabel>RATE: </Card.ViewLabel>
                        <Card.ViewText id="rate">{rate}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
        </Card>
        </>
    );
}