import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Modal } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FaTimes } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { categoriesList, typesList } from "../../constants";

export default function UpdateStockContainer() {
    const {JWT} = useAuth();
    const {getNow} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const location = useLocation();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [UOM, setUOM] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [HSNSAcode, setHSNSAcode] = useState("");

    const UOMRef = useRef();
    const [UOMDD, setUOMDD] = useState(false);
    const [UOMList, setUOMList] = useState([]);
    const [UOMModal, setUOMModal] = useState(false);
    const [newUOM, setNewUOM] = useState("");
    const categoryRef = useRef();
    const [categoryDD, setCategoryDD] = useState(false);
    const typeRef = useRef();
    const [typeDD, setTypeDD] = useState(false);

    const blockInvalidNumber = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

    const isInvalid = () => {
        return (name === "" || code === "" || description === "" || UOM === "" || category === "" || type === "");
    };
    const resetInputFields = () => {
        setName("");
        setCode("");
        setDescription("");
        setUOM("");
        setCategory("");
        setType("");
        setHSNSAcode("");
    }

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(categoryDD && !categoryRef?.current?.contains(e.target)) {
                setCategoryDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [categoryDD, categoryRef]);
    const changeCategory = (item) => {
        setCategory(item);
        setCategoryDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(typeDD && !typeRef?.current?.contains(e.target)) {
                setTypeDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [typeDD, typeRef]);
    const changeType = (item) => {
        setType(item);
        setTypeDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(UOMDD && !UOMRef?.current?.contains(e.target)) {
                setUOMDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [UOMDD, UOMRef]);
    const changeUOM = (item) => {
        setUOM(item);
        setUOMDD(false);
    }

    const handleAddNewUOM = () => {
        const lowerCaseNewUOM = newUOM.toLowerCase(); //newUOM.charAt(0).toUpperCase() + newUOM.slice(1).toLowerCase();
        const isNotPresent = UOMList.every((item) => {
            // console.log(lowerCaseNewUOM, " != ",item.uom_name, " ? ",lowerCaseNewUOM !== item.uom_name);
            return lowerCaseNewUOM !== item.uom_name;
        });
        if(isNotPresent) {
            axiosPrivate
            .post("/uom/create-uom", {}, {params: {uom_name: lowerCaseNewUOM, created_by: JWT?.user?.username, created_on: getNow()}, 
            headers: {
                "Content-Type": "application/json"
            }})
            .then(function (response) {
                // console.log(response?.data)
                setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            })
            .then(() => {
                setNewUOM("");
                setUOMModal(false);
                setUOM(lowerCaseNewUOM);
                showUOM();
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            });
        }
        else {
            setAlert({msg: `Error: Unit of Measure already exists!`, type: "error"});
        }
    }

    const showUOM = () => {
        axiosPrivate
        .get("/uom/shows-uom")
        .then(function (response) {
            // console.log(response?.data);
            setUOMList(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        showUOM();
    }, []);

    const handleHSNSAcode = (num) => {
        if ((num >= 1) || num == "") {
            setHSNSAcode(num.replace(/^0+/, ''));
        }
        if (num == 0) {
            setHSNSAcode(num.replace(/^0+/, 0))
        }
    }

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
            setHSNSAcode(stock?.hsn_sa_code ? stock?.hsn_sa_code : "");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/stock");
        });
    },[]);

    const handleUpdateStock = () => {
        axiosPrivate
        .put("/stock/update-stock/"+params.id, {}, {params: {item_name: name, item_code: code, item_desc: description, uom: UOM, item_category: category, item_type: type, hsn_sa_code: (HSNSAcode ? parseInt(HSNSAcode) : null), modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/stock");
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
                <Card.Title>Stock{name ? ` - ${name}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate("/stock", {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
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
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.Textarea type="text" id="description" placeholder=" " autoComplete="off" value={description} onChange={({target}) => setDescription(target.value)} />
                    <Card.Label htmlFor="description" mandatory>Description</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.InputColumn>
                <Card.InputContainer refPointer={UOMRef}>
                    <Card.Input readOnly type="text" id="UOM" placeholder=" " autoComplete="off" value={UOM} onClick={() => setUOMDD((UOMDD) => !UOMDD)} />
                    <Card.Label htmlFor="UOM" mandatory>Unit of Measure</Card.Label>
                    <Card.Dropdown dropdown={UOMDD} flexDirection="column">
                        {UOMList.map((item) => {
                            return <Card.Option selected={(UOM === item.uom_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeUOM(item.uom_name)}>{item.uom_name}</Card.Option>
                        })}
                        <Card.OptionButton onClick={() => setUOMModal(true)}><Button>Add new</Button></Card.OptionButton>
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(UOMDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
                <Card.InputContainer refPointer={categoryRef}>
                    <Card.Input readOnly type="text" id="category" placeholder=" " autoComplete="off" value={category} onClick={() => setCategoryDD((categoryDD) => !categoryDD)} />
                    <Card.Label htmlFor="category" mandatory>Category</Card.Label>
                    <Card.Dropdown empty={!categoriesList.length} dropdown={categoryDD} flexDirection="column">
                        {categoriesList.map((item) => {
                            return <Card.Option selected={(category === item.category) ? "selected" : undefined} key={item.id} onClick={({target}) => changeCategory(item.category)}>{item.category}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(categoryDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.InputColumn>
                <Card.InputContainer refPointer={typeRef}>
                    <Card.Input readOnly type="text" id="type" placeholder=" " autoComplete="off" value={type} onClick={() => setTypeDD((typeDD) => !typeDD)} />
                    <Card.Label htmlFor="type" mandatory>Type</Card.Label>
                    <Card.Dropdown empty={!typesList.length} dropdown={typeDD} flexDirection="column">
                        {typesList.map((item) => {
                            return <Card.Option selected={(type === item.type) ? "selected" : undefined} key={item.id} onClick={({target}) => changeType(item.type)}>{item.type}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(typeDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input type="number" id="HSNSAcode" placeholder=" " autoComplete="off" value={HSNSAcode} onKeyDown={blockInvalidNumber} onChange={({target}) => handleHSNSAcode(target.value)} />
                    <Card.Label htmlFor="HSNSAcode">HSN / SA code</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                <Button disabled={isInvalid()} onClick={() => handleUpdateStock()} type="submit">Update stock</Button>
            </Card.ButtonGroup>
        </Card>
        {(UOMModal) ?
            <Modal>
                <Modal.Container>
                    <Modal.Title>Add new Unit of Measure</Modal.Title>
                    <Modal.Line />
                    <Modal.InputContainer>
                        <Modal.Input type="text" id="newUOM" placeholder=" " autoComplete="off" value={newUOM} onChange={({target}) => setNewUOM(target.value)} />
                        <Modal.Label htmlFor="newUOM">New Unit of Measure</Modal.Label>
                    </Modal.InputContainer>
                    <Modal.ButtonContainer>
                        <Button nofill onClick={() => {
                            setUOMModal(false);
                            setNewUOM("");
                        }}>Cancel</Button>
                        <Button onClick={() => handleAddNewUOM()}>Confirm</Button>
                    </Modal.ButtonContainer>
                </Modal.Container>
            </Modal>
        : null}
        </>
    );
}