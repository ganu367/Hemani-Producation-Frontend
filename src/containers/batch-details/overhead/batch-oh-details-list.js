import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Modal, Button } from "../../../components";
import { useAxiosPrivate, useAlert, useGridColumnDefns, useAuth, useDateFormat } from "../../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function BomOhDetailsList({element, index, overheadDetails, setOverheadDetails, removeOverheadDetails}) {
    const axiosPrivate = useAxiosPrivate();
    const {getNow} = useDateFormat();
    const navigate = useNavigate();
    const {setAlert} = useAlert();
    const {JWT} = useAuth();
    const [overhead, setOverhead] = useState("");
    const [UOM, setUOM] = useState("");
    const [quantity, setQuantity] = useState("");
    const [rate, setRate] = useState("");
    const [overheadList, setOverheadList] = useState([]);
    const [overheadDD, setOverheadDD] = useState(false);
    const overheadRef = useRef();
    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
    const blockInvalidFloat = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
    
    const [overheadModal, setOverheadModal] = useState(false);
    const [newOverhead, setNewOverhead] = useState("");
    const [newOverheadUOM, setNewOverheadUOM] = useState("");

    const handleRate = (num) => {
        if ((num >= 1) || num == "") {
            const validated = num.match(/^(\d*\.{0,1}\d{0,2}$)/)
            if (validated) {
                setRate(num);
            }
        }
    }

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(overheadDD && !overheadRef?.current?.contains(e.target)) {
                setOverheadDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [overheadDD, overheadRef]);
    const changeOverhead = (item) => {
        setOverhead(item?.overhead_name);
        setUOM(item?.overhead_uom);
        setOverheadDD(false);
    }

    const handleOverheadDetails = () => {
        const tempProcs = [...overheadDetails];
        tempProcs[index]["overhead"] = overhead;
        tempProcs[index]["oh_uom"] = UOM;
        tempProcs[index]["oh_quantity"] = quantity;
        tempProcs[index]["oh_rate"] = rate;
        setOverheadDetails(tempProcs);
    }
    useEffect(() => {
        handleOverheadDetails();
    }, [overhead, quantity, rate]);    

    const handleAddNewOverhead = () => {
        const lowerCaseNewOverhead = newOverhead.toLowerCase(); //newOverhead.charAt(0).toUpperCase() + newOverhead.slice(1).toLowerCase();
        const lowerCaseNewOverheadUOM = newOverheadUOM.toLowerCase();
        const isNotPresent = overheadList.every((item) => {
            // console.log(lowerCaseNewOverhead, " != ",item.Overhead_name, " ? ",lowerCaseNewOverhead !== item.Overhead_name);
            return lowerCaseNewOverhead !== item.overhead_name;
        });
        if(isNotPresent) {
            axiosPrivate
            .post("/overhead/create-overhead", {}, {params: {overhead_name: lowerCaseNewOverhead, overhead_uom: lowerCaseNewOverheadUOM, created_by: JWT?.user?.username, created_on: getNow()}, 
            headers: {
                "Content-Type": "application/json"
            }})
            .then(function (response) {
                // console.log(response?.data)
                setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            })
            .then(() => {
                setNewOverhead("");
                setNewOverheadUOM("");
                setOverheadModal(false);
                setOverhead(lowerCaseNewOverhead);
                setUOM(lowerCaseNewOverheadUOM);
                showOverhead();
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            });
        }
        else {
            setAlert({msg: `Error: Unit of Measure already exists!`, type: "error"});
        }
    }

    const showOverhead = () => {
        axiosPrivate
        .get("/overhead/shows-overhead")
        .then(function (response) {
            // console.log(response?.data);
            setOverheadList(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        showOverhead();
    }, []);

    const handleQuantity = (num) => {
        if ((num >= 1) || num == "") {
        //     setQuantity(num.replace(/^0+/, ''));
            const validated = num.match(/^(\d*\.{0,1}\d{0,2}$)/)
            if (validated) {
                setQuantity(num);
            }
        }
    }

    return (
        <>
        <Card.InputColumn center notResponsive>
            <Card.MultiInputContainer refPointer={overheadRef}>
                <Card.MultiInput readOnly type="text" id="overhead" placeholder=" " autoComplete="off" value={element?.overhead || ''} onClick={() => setOverheadDD((overheadDD) => !overheadDD)} />
                <Card.Dropdown empty={!overheadList.length} dropdown={overheadDD} flexDirection="column">
                    {overheadList.map((item) => {
                        return <Card.Option selected={(element?.overhead === item.overhead_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeOverhead(item)}>{item.overhead_name}</Card.Option>
                    })}
                    <Card.OptionButton onClick={() => setOverheadModal(true)}><Button small>Add new</Button></Card.OptionButton>
                </Card.Dropdown>
                <Card.Icon style={{pointerEvents: "none"}}>
                    {(overheadDD) ? <FiChevronUp /> : <FiChevronDown />}
                </Card.Icon>
            </Card.MultiInputContainer>
            <Card.MultiInputContainer>
                <Card.MultiInput readOnly required type="text" id="UOM" placeholder=" " autoComplete="off" value={element?.oh_uom || ''} />
            </Card.MultiInputContainer>
            <Card.MultiInputContainer prefixx={"₹ "}>
                <Card.MultiInput type="number" id="rate" placeholder=" " prefixx autoComplete="off" onKeyDown={blockInvalidFloat} value={element?.oh_rate || ''} onChange={({target}) => handleRate(target.value)} />
            </Card.MultiInputContainer>
            <Card.MultiInputContainer>
                <Card.MultiInput type="number" id="quantity" placeholder=" " autoComplete="off" onKeyDown={blockInvalidNumber} value={element?.oh_quantity || ''} onChange={({target}) => handleQuantity(target.value)} />
            </Card.MultiInputContainer>
            <Card.ButtonContainer width="fit-content">
                <Card.AddButton danger deletes small onClick={() => removeOverheadDetails(index)} />
            </Card.ButtonContainer>
        </Card.InputColumn>
        {(overheadModal) ?
            <Modal>
                <Modal.Container>
                    <Modal.Title>Add new overhead</Modal.Title>
                    <Modal.Line />
                    <Modal.InputContainer>
                        <Modal.Input type="text" id="newOverhead" placeholder=" " autoComplete="off" value={newOverhead} onChange={({target}) => setNewOverhead(target.value)} />
                        <Modal.Label htmlFor="newOverhead">New overhead</Modal.Label>
                    </Modal.InputContainer>
                    <Modal.InputContainer>
                        <Modal.Input type="text" id="newOverheadUOM" placeholder=" " autoComplete="off" value={newOverheadUOM} onChange={({target}) => setNewOverheadUOM(target.value)} />
                        <Modal.Label htmlFor="newOverheadUOM">Unit of Measure</Modal.Label>
                    </Modal.InputContainer>
                    <Modal.ButtonContainer>
                        <Button nofill onClick={() => {
                            setOverheadModal(false);
                            // setNewOverhead("");
                        }}>Cancel</Button>
                        <Button onClick={() => handleAddNewOverhead()}>Confirm</Button>
                    </Modal.ButtonContainer>
                </Modal.Container>
            </Modal>
        : null}
        </>
    );
}