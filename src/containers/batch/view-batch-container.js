import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";

export default function ViewBatchContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const {dateConverter,timeConverter} = useDateFormat();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [number, setNumber] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [status, setStatus] = useState("");
    const [stock, setStock] = useState("");
    const [UOM, setUOM] = useState("");
    const [BOM, setBOM] = useState("");
    
    useEffect(() => {
        axiosPrivate
        .get("/batch/get-batch-by-ids/"+params.id)
        .then(function (response) {
            console.log(response.data);
            const batch = response?.data?.BATCH;
            const stock = response?.data?.StockMaster;
            const bom = response?.data?.BOM;
            setNumber(batch?.batch_number ? batch?.batch_number : "");
            setStatus(batch?.status ? batch?.status : "");
            setStartDate(batch?.start_date ? batch?.start_date : "");
            setEndDate(batch?.end_date ? batch?.end_date : "");
            setQuantity(batch?.batch_quantity ? batch?.batch_quantity : "");
            setStock(stock?.item_name ? stock?.item_name : "");
            setUOM(stock?.uom ? stock?.uom : "-");
            setBOM(bom?.bom_name ? bom?.bom_name : "-");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/batch/view");
        });
    },[]);

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Batch{number ? ` ${number}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/batch/${params.id}/update`, {state: { from: location }})}>Update Batch</Button>
                    <Button small iconPadding danger onClick={() => navigate("/batch/view", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="name">Batch {number}</Card.ViewTitle>
                        <Card.Status id="status" status={status} marginTop>{status}</Card.Status>
                        <Card.InputContainer notAlone width="fit-content" noMarginBottom>
                            <Card.ViewDash>From: </Card.ViewDash>
                            <Card.ViewText id="startDate" noWrap>{dateConverter(startDate)} {timeConverter(startDate)}</Card.ViewText>
                            {endDate &&
                                <>
                                    <Card.ViewDash>To: </Card.ViewDash>
                                    <Card.ViewText id="endDate" noWrap>{dateConverter(endDate)} {timeConverter(endDate)}</Card.ViewText>
                                </>
                            }
                        </Card.InputContainer>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>STOCK ITEM: </Card.ViewLabel>
                        <Card.ViewText id="stock">{stock}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>UNIT OF MEASURE: </Card.ViewLabel>
                        <Card.ViewText id="UOM">{UOM}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>BILL OF MATERIAL: </Card.ViewLabel>
                        <Card.ViewText id="BOM">{BOM}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>QUANTITY: </Card.ViewLabel>
                        <Card.ViewText id="quantity">{quantity}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
        </Card>
        </>
    );
}