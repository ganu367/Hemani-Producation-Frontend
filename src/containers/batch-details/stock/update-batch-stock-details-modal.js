import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Card } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { inOutList } from "../../../constants";

export default function UpdateBatchStockDetailsModal({element, children, editItem, setEditMode, retStockDetails, setRetStockDetails}) {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const {JWT} = useAuth();
    const {getNow} = useDateFormat();
    const [inOut, setInOut] = useState(editItem?.element?.BATCH_ACTUAL_CONSUMPTION.in_out);
    const [inOutRenders, setInOutRenders] = useState(0);
    const [stock, setStock] = useState({id: editItem?.element?.StockMaster?.id, item_name: editItem?.element?.StockMaster?.item_name});
    const [UOM, setUOM] = useState(editItem?.element?.BATCH_ACTUAL_CONSUMPTION.uom);
    const [quantity, setQuantity] = useState(editItem?.element?.BATCH_ACTUAL_CONSUMPTION.quantity);
    const [location, setLocation] = useState({id: editItem?.element?.Location?.id, location_name: editItem?.element?.Location.location_name});
    const [stockList, setStockList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [stockDD, setStockDD] = useState(false);
    const [inOutDD, setInOutDD] = useState(false);
    const [locationDD, setLocationDD] = useState(false);
    const stockRef = useRef();
    const inOutRef = useRef();
    const locationRef = useRef();
    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const isInvalid = !stock?.id || UOM === "" || quantity === "" || inOut === "" || !location?.id;

    useEffect(() => {
        axiosPrivate
        .get("/api/get-locations-for-user-plant")
        .then(function (response) {
            setLocationList(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }, []);

    useEffect(() => {
        if (inOutRenders > 0) {
            setStock({});
            setUOM("");
        }
        setStockList(() => []);
        if (inOut !== "") {
            axiosPrivate
            .get("/api/get-stock-for-"+inOut)
            .then(function (response) {
                setStockList(response?.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            });
        }
    }, [inOut]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(stockDD && !stockRef?.current?.contains(e.target)) {
                setStockDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [stockDD, stockRef]);
    const changeStock = (item) => {
        setStock(item);
        setUOM(item?.uom);
        setStockDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(inOutDD && !inOutRef?.current?.contains(e.target)) {
                setInOutDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [inOutDD, inOutRef]);
    const changeInOut = (item) => {
        setInOut(item);
        setInOutDD(false);
        setInOutRenders((prevVal) => prevVal + 1);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(locationDD && !locationRef?.current?.contains(e.target)) {
                setLocationDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [locationDD, locationRef]);
    const changeLocation = (item) => {
        setLocation(item);
        setLocationDD(false);
    }

    const updateStockDetailsBack = () => {
        const tempProcs = [...retStockDetails];
        tempProcs[editItem?.index].BATCH_ACTUAL_CONSUMPTION.in_out = inOut;
        tempProcs[editItem?.index].StockMaster.stock_id = stock?.id;
        tempProcs[editItem?.index].StockMaster.item_name = stock?.item_name;
        tempProcs[editItem?.index].BATCH_ACTUAL_CONSUMPTION.uom = UOM;
        tempProcs[editItem?.index].BATCH_ACTUAL_CONSUMPTION.quantity = quantity;
        tempProcs[editItem?.index].Location.id = location?.id;
        tempProcs[editItem?.index].Location.location_name = location?.location_name;
        setRetStockDetails(tempProcs);
    }

    const handleSubmit = () => {
        axiosPrivate
        .put("/batch-actual-consumption/update-batch-ack-consumption/"+editItem.element.BATCH_ACTUAL_CONSUMPTION.id, {}, {params: {entry_date: editItem?.entry_date, stock_id: stock?.id, location_id: location?.id, uom: UOM, quantity: quantity, in_out: inOut, modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            setEditMode(null);
            updateStockDetailsBack();
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        console.log(editItem)
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
                    <Modal.Title>Update stock detail</Modal.Title>
                    <Modal.Line />
                    {/* <Modal.Text>{children}</Modal.Text> */}
                    <Card.InputContainer refPointer={inOutRef}>
                        <Card.Input readOnly type="text" id="inOut" placeholder=" " autoComplete="off" value={inOut} onClick={() => setInOutDD((inOutDD) => !inOutDD)} />
                        <Card.Label htmlFor="inOut" mandatory>In / Out</Card.Label>
                        <Card.Dropdown empty={!inOutList.length} dropdown={inOutDD} flexDirection="column">
                            {inOutList.map((item) => {
                                return <Card.Option selected={(inOut === item.type) ? "selected" : undefined} key={item.id} onClick={({target}) => changeInOut(item.type)}>{item?.type}</Card.Option>
                            })}
                        </Card.Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(inOutDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
                    <Card.InputContainer refPointer={stockRef}>
                        <Card.Input readOnly type="text" id="stock" placeholder=" " autoComplete="off" value={stock?.item_name || ''} onClick={() => setStockDD((stockDD) => !stockDD)} />
                        <Card.Label htmlFor="stock" mandatory>Stock item</Card.Label>
                        <Card.Dropdown empty={!stockList.length} dropdown={stockDD} flexDirection="column">
                            {stockList.map((item) => {
                                return <Card.Option selected={(stock?.item_name === item.item_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeStock(item)}>{item?.item_name}</Card.Option>
                            })}
                        </Card.Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(stockDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="UOM" placeholder=" " autoComplete="off" value={UOM} />
                        <Card.Label htmlFor="UOM" mandatory>Unit of Measure</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input type="number" id="quantity" placeholder=" " autoComplete="off" onKeyDown={blockInvalidNumber} value={quantity} onChange={({target}) => handleQuantity(target.value)} />
                        <Card.Label htmlFor="quantity" mandatory>Quantity</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer refPointer={locationRef}>
                        <Card.Input readOnly type="text" id="location" placeholder=" " autoComplete="off" value={location?.location_name || ''} onClick={() => setLocationDD((locationDD) => !locationDD)} />
                        <Card.Label htmlFor="location" mandatory>Location</Card.Label>
                        <Card.Dropdown empty={!locationList.length} dropdown={locationDD} flexDirection="column">
                            {locationList.map((item) => {
                                return <Card.Option selected={(location?.location_name === item.location_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeLocation(item)}>{item?.location_name}</Card.Option>
                            })}
                        </Card.Dropdown>
                        <Card.Icon style={{pointerEvents: "none"}}>
                            {(locationDD) ? <FiChevronUp /> : <FiChevronDown />}
                        </Card.Icon>
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