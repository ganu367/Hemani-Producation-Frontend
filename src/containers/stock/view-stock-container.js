import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert } from "../../hooks";
import { FaTimes } from "react-icons/fa";

export default function ViewStockContainer() {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [UOM, setUOM] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [HSNSAcode, setHSNSAcode] = useState("");
    
    useEffect(() => {
        axiosPrivate
        .get("/stock/get-by-stock-ids/"+params.id)
        .then(function (response) {
            // console.log(response.data);
            const stock = response?.data;
            setName(stock?.item_name ? stock?.item_name : "");
            setCode(stock?.item_code ? stock?.item_code : "");
            setDescription(stock?.item_desc ? stock?.item_desc : "");
            setUOM(stock?.uom ? stock?.uom : "");
            setCategory(stock?.item_category ? stock?.item_category : "");
            setType(stock?.item_type ? stock?.item_type : "");
            setHSNSAcode(stock?.hsn_sa_code ? stock?.hsn_sa_code : "-");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/stock");
        });
    },[]);

    return (
        <>
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Stock{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small onClick={() => navigate(`/stock/${params.id}/update`, {state: { from: location }})}>Update Stock</Button>
                    <Button small iconPadding danger onClick={() => navigate("/stock", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewTitle id="name">{name}</Card.ViewTitle>
                        <Card.ViewSubtitle id="code">{code}</Card.ViewSubtitle>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>DESCRIPTION: </Card.ViewLabel>
                        <Card.ViewText id="description">{description}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>UNIT OF MEASURE: </Card.ViewLabel>
                        <Card.ViewText id="UOM">{UOM}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.ViewRow>
                        <Card.ViewLabel>CATEGORY: </Card.ViewLabel>
                        <Card.ViewText id="category">{category}</Card.ViewText>
                    </Card.ViewRow>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.InputColumn alignEnd>
                <Card.InputColumn alignEnd>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>TYPE: </Card.ViewLabel>
                            <Card.ViewText id="type">{type}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>HSN / SA CODE: </Card.ViewLabel>
                            <Card.ViewText id="HSNSAcode">{HSNSAcode}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                </Card.InputColumn>
            </Card.InputColumn>
        </Card>
        </>
    );
}