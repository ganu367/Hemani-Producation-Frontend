import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useGridColumnDefns, useAuth, useDateFormat } from "../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function BatchContainer() {
    const {getNow,getDateTime,defaultDate,defaultTime} = useDateFormat();
    const {JWT} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const location = useLocation();
    const [stock, setStock] = useState("");
    const [BOM, setBOM] = useState("");
    const [stockList, setStockList] = useState([]);
    const [BOMList, setBOMList] = useState([]);
    const [startDate, setStartDate] = useState(defaultDate());
    const [startTime, setStartTime] = useState(defaultTime());
    const [UOM, setUOM] = useState("");
    const [quantity, setQuantity] = useState("");

    const stockRef = useRef();
    const [stockDD, setStockDD] = useState(false);
    const BOMRef = useRef();
    const [BOMDD, setBOMDD] = useState(false);

    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const isInvalid = () => {
        return (stock?.id === (null || undefined) || UOM === ""|| BOM?.id === (null || undefined) || startDate === "" || startTime === "" || quantity === "");
    };
    const resetInputFields = () => {
        setStock("");
        setBOM("");
        setStartDate("");
        setStartTime("");
        setUOM("");
        setQuantity("");
    }

    useEffect(() => {
        axiosPrivate
        .get("/api/get-finished-goods")
        .then(function (response) {
            // console.log(response?.data);
            setStockList(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/bom");
        });
    }, []);

    useEffect(() => {
        setBOM({});
        setBOMList(() => []);
        if (stock?.id) {
            axiosPrivate
            .get("/api/get-bom/"+stock?.id)
            .then(function (response) {
                // console.log(response?.data);
                setBOMList(response?.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
                navigate("/batch/start");
            });
        }
    }, [stock]);

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
            if(BOMDD && !BOMRef?.current?.contains(e.target)) {
                setBOMDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [BOMDD, BOMRef]);
    const changeBOM = (item) => {
        setBOM(item);
        setBOMDD(false);
    }
    
    const handleStartBatch = () => {
        axiosPrivate
        .post("/batch/create-batch", {}, {params: {stock_id: stock?.id, bom_id: BOM?.id, uom: UOM, batch_quantity: Number(quantity), start_date: getDateTime(startDate,startTime), created_by: JWT?.user?.username, created_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/batch/view");
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
        <Card>
            <Card.Title>
                Start Batch
            </Card.Title>
            <Card.Line />
        {/* </Card>
        <Card width="75%"> */}
            <Card.InputColumn>
                <Card.InputContainer refPointer={stockRef}>
                    <Card.Input readOnly type="text" id="stock" placeholder=" " autoComplete="off" value={stock?.item_name ? stock?.item_name : ""} onClick={() => setStockDD((stockDD) => !stockDD)} />
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
                    <Card.Label htmlFor="UOM" mandatory>UOM</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer refPointer={BOMRef}>
                    <Card.Input readOnly type="text" id="BOM" placeholder=" " autoComplete="off" value={BOM?.bom_name ? BOM?.bom_name : ""} onClick={() => setBOMDD((BOMDD) => !BOMDD)} />
                    <Card.Label htmlFor="BOM" mandatory>BOM</Card.Label>
                    <Card.Dropdown empty={!BOMList.length} dropdown={BOMDD} flexDirection="column">
                        {BOMList.map((item) => {
                            return <Card.Option selected={(BOM?.bom_name === item.bom_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeBOM(item)}>{item?.bom_name}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(BOMDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.Input type="date" id="startDate" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={startDate} onChange={({ target }) => setStartDate(target.value)} />
                    <Card.Label htmlFor="startDate" mandatory>Start Date</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input type="time" step={1} id="startTime" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={startTime} onChange={({ target }) => setStartTime(target.value)} />
                    <Card.Label htmlFor="startTime" mandatory>Start Time</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input type="number" id="quantity" placeholder=" " autoComplete="off" value={quantity} onKeyDown={blockInvalidNumber} onChange={({target}) => handleQuantity(target.value)} />
                    <Card.Label htmlFor="quantity" mandatory>Batch quantity</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                <Button disabled={isInvalid()} onClick={() => handleStartBatch()}>Start batch</Button>
            </Card.ButtonGroup>
        </Card>
        </>
    );
}