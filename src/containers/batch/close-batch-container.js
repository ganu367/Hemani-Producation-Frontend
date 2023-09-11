import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAxiosPrivate, useAlert, useGridColumnDefns, useAuth, useDateFormat } from "../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function CloseBatchContainer() {
    const {getNow,getDate,getDateTime,defaultDate,defaultTime} = useDateFormat();
    const {JWT} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const location = useLocation();
    const [stock, setStock] = useState("");
    const [batch, setBatch] = useState("");
    const [stockList, setStockList] = useState([]);
    const [batchList, setBatchList] = useState([]);
    const [endDate, setEndDate] = useState(defaultDate());
    const [endTime, setEndTime] = useState(defaultTime());
    const [quantity, setQuantity] = useState("");

    const stockRef = useRef();
    const [stockDD, setStockDD] = useState(false);
    const batchRef = useRef();
    const [batchDD, setBatchDD] = useState(false);

    const blockInvalidNumber = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

    const isInvalid = () => {
        return (stock?.id === (null || undefined) || batch?.id === (null || undefined) || endDate === "" || endTime === "");
    };
    const resetInputFields = () => {
        setStock("");
        setBatch("");
        setEndDate("");
        setEndTime("");
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
            navigate("/batch/end");
        });
    }, []);

    useEffect(() => {
        setBatch({});
        setBatchList(() => []);
        if (stock?.id) {
            axiosPrivate
            .get("/api/show-batches-for-stock/"+stock?.id)
            .then(function (response) {
                // console.log(response?.data);
                setBatchList(response?.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
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
        setStockDD(false);
    }
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(batchDD && !batchRef?.current?.contains(e.target)) {
                setBatchDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [batchDD, batchRef]);
    const changeBatch = (item) => {
        setBatch(item);
        setBatchDD(false);
    }
    
    const handleCloseBatch = () => {
        axiosPrivate
        .put("/batch/update-batch-status/"+batch?.id, {}, {params: {end_date: getDateTime(endDate,endTime), modified_by: JWT?.user?.username, modified_on: getNow()}})
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
            setQuantity(num.replace(/^0+/, ''));
        }
    }

    return (
        <>
        <Card>
            <Card.Title>
                End Batch
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
                <Card.InputContainer refPointer={batchRef}>
                    <Card.Input readOnly type="text" id="batch" placeholder=" " autoComplete="off" value={batch?.batch_number ? batch?.batch_number : ""} onClick={() => setBatchDD((batchDD) => !batchDD)} />
                    <Card.Label htmlFor="batch" mandatory>Batch number</Card.Label>
                    <Card.Dropdown empty={!batchList.length} dropdown={batchDD} flexDirection="column">
                        {batchList.map((item) => {
                            return <Card.Option selected={(batch?.batch_number === item.batch_number) ? "selected" : undefined} key={item.id} onClick={({target}) => changeBatch(item)}>{item?.batch_number}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(batchDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input type="date" id="endDate" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={endDate} onChange={({ target }) => setEndDate(target.value)} />
                    <Card.Label htmlFor="endDate" mandatory>End Date</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input type="time" step={1} id="endTime" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={endTime} onChange={({ target }) => setEndTime(target.value)} />
                    <Card.Label htmlFor="endTime" mandatory>End Time</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                <Button disabled={isInvalid()} onClick={() => handleCloseBatch()}>End batch</Button>
            </Card.ButtonGroup>
        </Card>
        </>
    );
}