import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";

export default function ViewBomContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {dateConverter} = useDateFormat();
    const {setAlert} = useAlert();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [stock, setStock] = useState("");
    const [name, setName] = useState("");
    const [UOM, setUOM] = useState("");
    const [quantity, setQuantity] = useState("");
    const [processes, setProcesses] = useState([{process_name: "-"}]);
    
    useEffect(() => {
        axiosPrivate
        .get("/bom/get-bom-by-ids/"+params.id)
        .then(function (response) {
            // console.log(response?.data);
            const bom = response?.data?.BOM?.BOM;
            const stock = response?.data?.BOM?.item_name;
            const processes = response?.data?.PROCESS;
            setStock(stock ? stock : "");
            setName(bom?.bom_name ? bom?.bom_name : "");
            setUOM(bom?.uom ? bom?.uom : "");
            setQuantity(bom?.bom_quantity ? bom?.bom_quantity : "");
            setProcesses(processes ? processes : []);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/bom");
        });
    },[]);

    useEffect(() => {
        console.log(processes)
    }, [processes])
    

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>BoM{stock ? ` for ${stock}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/bom/${params.id}/update`, {state: { from: location }})}>Update BoM</Button>
                    <Button small iconPadding danger onClick={() => navigate("/bom", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="stock">{stock} (per {UOM.toLowerCase()})</Card.ViewTitle>
                        {/* <Card.ViewSubtitle id="code">{code}</Card.ViewSubtitle> */}
                        <Card.InputContainer notAlone width="fit-content" noMarginBottom>
                            <Card.ViewDash noWrap>BoM Name: </Card.ViewDash>
                            <Card.ViewText id="name" noWrap>{name}</Card.ViewText>
                        {/* </Card.InputContainer>
                        <Card.InputContainer notAlone width="fit-content" noMarginTop noMarginBottom> */}
                            <Card.ViewDash noWrap>BoM Quantity: </Card.ViewDash>
                            <Card.ViewText id="quantity">{quantity}</Card.ViewText>
                        </Card.InputContainer>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
        </Card>
        <Card width="45%" responsiveWidth="75%">
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        {/* <Card.ViewTitle id="stock">{stock} (per {UOM.toLowerCase()})</Card.ViewTitle> */}
                        <Card.ViewTitle2>Processes:</Card.ViewTitle2>
                        {processes.length === 0 ? <Card.ViewSubtitle>None</Card.ViewSubtitle> : null}
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
            {processes.length !== 0 &&
                <Card.InputColumn center notResponsive>
                    <Card.Header noMarginVertical>
                        <Card.HeaderText>Process name</Card.HeaderText>
                    </Card.Header>
                    <Card.Header width="fit-content" />
                    <Card.Header width="fit-content" />
                </Card.InputColumn>
            }
            {processes.map((element, index) => {
                return (
                    <>
                    <Card.InputColumn center key={index} notResponsive>
                        <Card.MultiInputContainer smallMarginBottom>
                            <Card.ViewText id="process_name">{element?.process_name}</Card.ViewText>
                        </Card.MultiInputContainer>
                    </Card.InputColumn>
                    </>
                );
            })}
        </Card>
        </>
    );
}