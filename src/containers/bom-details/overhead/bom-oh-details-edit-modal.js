import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Card } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function BomOhDetailsEditModal({element, children, editItem, setEditMode, retOverheadDetails, setRetOverheadDetails}) {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const {JWT} = useAuth();
    const {getNow} = useDateFormat();
    const [overhead, setOverhead] = useState(editItem?.element?.BOM_OH_DETAILS.overhead);
    const [UOM, setUOM] = useState(editItem?.element?.BOM_OH_DETAILS.oh_uom);
    const [quantity, setQuantity] = useState(editItem?.element?.BOM_OH_DETAILS.oh_quantity);
    const [rate, setRate] = useState(editItem?.element?.BOM_OH_DETAILS.oh_rate);
    const [overheadList, setOverheadList] = useState([]);
    const [overheadDD, setOverheadDD] = useState(false);
    const overheadRef = useRef();
    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
    const blockInvalidFloat = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const handleRate = (num) => {
        if ((num >= 1) || num == "") {
            const validated = num.match(/^(\d*\.{0,1}\d{0,2}$)/)
            if (validated) {
                setRate(num);
            }
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

    const updateOverheadDetailsBack = () => {
        const tempProcs = [...retOverheadDetails];
        tempProcs[editItem?.index].BOM_OH_DETAILS.overhead = overhead;
        tempProcs[editItem?.index].BOM_OH_DETAILS.oh_uom = UOM;
        tempProcs[editItem?.index].BOM_OH_DETAILS.oh_quantity = quantity;
        tempProcs[editItem?.index].BOM_OH_DETAILS.oh_rate = rate;
        setRetOverheadDetails(tempProcs);
    }

    const handleSubmit = () => {
        axiosPrivate
        .put("/bom-oh-details/update-bom-oh-details/"+editItem.element.BOM_OH_DETAILS.id, {}, {params: {overhead: overhead, oh_uom: UOM, oh_quantity: quantity, oh_rate: rate, modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            setEditMode(null);
            updateOverheadDetailsBack();
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

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
            <Modal>
                <Modal.Container>
                    <Modal.Title>Update overhead detail</Modal.Title>
                    <Modal.Line />
                    {/* <Modal.Text>{children}</Modal.Text> */}
                    <Card.InputContainer refPointer={overheadRef}>
                        <Card.Input readOnly type="text" id="overhead" placeholder=" " autoComplete="off" value={overhead} onClick={() => setOverheadDD((overheadDD) => !overheadDD)} />
                        <Card.Label htmlFor="overhead" mandatory>Overhead</Card.Label>
                        <Card.Dropdown dropdown={overheadDD} flexDirection="column">
                            {overheadList.map((item) => {
                                return <Card.Option selected={(overhead === item.overhead_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeOverhead(item)}>{item?.overhead_name}</Card.Option>
                            })}
                        </Card.Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(overheadDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="UOM" placeholder=" " autoComplete="off" value={UOM} />
                        <Card.Label htmlFor="UOM" mandatory>Unit of Measure</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input type="number" id="rate" placeholder=" " autoComplete="off" onKeyDown={blockInvalidFloat} value={rate} onChange={({target}) => handleRate(target.value)} />
                        <Card.Label htmlFor="rate" mandatory>Rate</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input type="number" id="quantity" placeholder=" " autoComplete="off" onKeyDown={blockInvalidNumber} value={quantity} onChange={({target}) => handleQuantity(target.value)} />
                        <Card.Label htmlFor="quantity" mandatory>Quantity</Card.Label>
                    </Card.InputContainer>
                    <Modal.ButtonContainer>
                        <Button nofill onClick={() => {
                            setEditMode(null);
                        }}>Cancel</Button>
                        <Button onClick={() => handleSubmit()}>Update overhead detail</Button>
                    </Modal.ButtonContainer>
                </Modal.Container>
            </Modal>
        </>
    );
}