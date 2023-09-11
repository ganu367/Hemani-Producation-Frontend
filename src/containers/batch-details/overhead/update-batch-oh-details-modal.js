import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Card } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function UpdateBatchOhDetailsModal({element, children, editItem, setEditMode, retOverheadDetails, setRetOverheadDetails}) {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const {JWT} = useAuth();
    const {getNow} = useDateFormat();
    const [rate, setRate] = useState(editItem?.element?.BATCH_ACTUAL_OH.oh_rate);
    const [overhead, setOverhead] = useState(editItem?.element?.BATCH_ACTUAL_OH?.overhead);
    const [UOM, setUOM] = useState(editItem?.element?.BATCH_ACTUAL_OH.oh_uom);
    const [quantity, setQuantity] = useState(editItem?.element?.BATCH_ACTUAL_OH.oh_quantity);
    const [overheadList, setOverheadList] = useState([]);
    const [overheadDD, setOverheadDD] = useState(false);
    const overheadRef = useRef();
    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
    const blockInvalidFloat = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const isInvalid = overhead === "" || UOM === "" || quantity === "" || rate === "";

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
        tempProcs[editItem?.index].BATCH_ACTUAL_OH.overhead = overhead;
        tempProcs[editItem?.index].BATCH_ACTUAL_OH.oh_rate = rate;
        tempProcs[editItem?.index].BATCH_ACTUAL_OH.oh_uom = UOM;
        tempProcs[editItem?.index].BATCH_ACTUAL_OH.oh_quantity = quantity;
        setRetOverheadDetails(tempProcs);
    }

    const handleSubmit = () => {
        axiosPrivate
        .put("/batch-actual-oh/update-batch-actual-oh/"+editItem.element.BATCH_ACTUAL_OH.id, {}, {params: {entry_date: editItem?.entry_date, overhead: overhead, oh_uom: UOM, oh_quantity: quantity, oh_rate: rate, modified_by: JWT?.user?.username, modified_on: getNow()}})
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

    useEffect(() => {
        console.log(editItem)
    }, []);

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
                        <Card.Input readOnly type="text" id="overhead" placeholder=" " autoComplete="off" value={overhead || ''} onClick={() => setOverheadDD((overheadDD) => !overheadDD)} />
                        <Card.Label htmlFor="overhead" mandatory>Overhead</Card.Label>
                        <Card.Dropdown empty={!overheadList.length} dropdown={overheadDD} flexDirection="column">
                            {overheadList.map((item) => {
                                return <Card.Option selected={(overhead === item.overhead_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeOverhead(item)}>{item.overhead_name}</Card.Option>
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
                        <Button disabled={isInvalid} onClick={() => handleSubmit()}>Update stock detail</Button>
                    </Modal.ButtonContainer>
                </Modal.Container>
            </Modal>
        </>
    );
}