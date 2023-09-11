import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Card, Button } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { inOutList } from "../../../constants";

export default function UpdateBatchStockDetailsContainer() {
    const {getNow,getDate,getDateTime} = useDateFormat();
    const {JWT} = useAuth();
    const params = useParams();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    // const location = useLocation();
    const [stockList, setStockList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [entryNumber, setEntryNumber] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [inOut, setInOut] = useState("");
    const [inOutRenders, setInOutRenders] = useState(0);
    const [quantity, setQuantity] = useState("");
    const [stock, setStock] = useState("");
    const [UOM, setUOM] = useState("");
    const [process, setProcess] = useState("");
    const [location, setLocation] = useState("");
    const [actualRate, setActualRate] = useState("");
    const [standardRate, setStandardRate] = useState("");

    const stockRef = useRef();
    const [stockDD, setStockDD] = useState(false);
    const inOutRef = useRef();
    const [inOutDD, setInOutDD] = useState(false);
    const locationRef = useRef();
    const [locationDD, setLocationDD] = useState(false);

    const blockInvalidNumber = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

    const isInvalid = () => {
        return (stock?.id === (null || undefined) || location?.id === (null || undefined) || entryDate === "" || UOM === "" || quantity === "" || inOut === "");
    };
    const resetInputFields = () => {
        setStock({});
        setInOut("");
        setUOM("");
        setLocation({});
        setQuantity("");
    }

    useEffect(() => {
        axiosPrivate
        .get("/batch-actual-consumption/get-batch-ack-consumption-by-ids/"+params.id)
        .then(function (response) {
            console.log(response.data);
            const batchStock = response?.data?.BATCH_ACTUAL_CONSUMPTION;
            const batch = response?.data?.BATCH;
            const stock = response?.data?.StockMaster;
            const process = response?.data?.PROCESS;
            const location = response?.data?.Location;
            setEntryNumber(batchStock?.entry_number ? batchStock?.entry_number : "");
            setBatchNumber(batch?.batch_number ? batch?.batch_number : "");
            setEntryDate(batchStock?.entry_date ? batchStock?.entry_date.substring(0,10) : "");
            setInOut(batchStock?.in_out ? batchStock?.in_out : "");
            setQuantity(batchStock?.quantity ? batchStock?.quantity : "");
            setStock(stock?.item_name ? {id: batchStock?.stock_id, item_name: stock?.item_name} : "");
            setUOM(stock?.uom ? stock?.uom : "-");
            setProcess(process?.process_name ? process?.process_name : "-");
            setLocation(location?.location_name ? {id: batchStock?.location_id, location_name: location?.location_name} : "-");
            setStandardRate(batchStock?.standard_rate ? batchStock?.standard_rate : "-");
            setActualRate(batchStock?.actual_rate ? batchStock?.actual_rate : "-");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/batch/stock");
        });
    },[]);

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
    
    const handleUpdateBatch = () => {
        axiosPrivate
        .put("/batch-actual-consumption/update-batch-ack-consumption/"+params.id, {}, {params: {location_id: parseInt(location?.id), stock_id: parseInt(stock?.id), uom: UOM, in_out: inOut, entry_date: getDate(entryDate), quantity: Number(quantity), modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/batch/stock");
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
        <Card width="75%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Update Batch stock entry {entryNumber ? ` ${entryNumber}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate(-1, {state: { from: location }})}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="batchNumber" placeholder=" " autoComplete="off" value={batchNumber} />
                    <Card.Label htmlFor="batchNumber" mandatory>Batch no.</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="process" placeholder=" " autoComplete="off" value={process} />
                    <Card.Label htmlFor="process" mandatory>Process</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.InputColumn>
                <Card.InputContainer>
                    <Card.Input readOnly type="date" id="entryDate" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={entryDate} /> {/* onChange={({ target }) => setEntryDate(target.value)}  */}
                    <Card.Label htmlFor="entryDate" mandatory>Entry Date</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer refPointer={inOutRef}>
                    <Card.Input readOnly type="text" id="inOut" placeholder=" " autoComplete="off" value={inOut} onClick={() => setInOutDD((inOutDD) => !inOutDD)} />
                    <Card.Label htmlFor="inOut" mandatory>In / Out</Card.Label>
                    <Card.Dropdown dropdown={inOutDD} flexDirection="column">
                        {inOutList.map((item) => {
                            return <Card.Option selected={(inOut === item.type) ? "selected" : undefined} key={item.id} onClick={({target}) => changeInOut(item?.type)}>{item?.type}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(inOutDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.InputColumn>
                <Card.InputContainer refPointer={stockRef}>
                    <Card.Input readOnly type="text" id="stock" placeholder=" " autoComplete="off" value={stock?.item_name || ''} onClick={() => setStockDD((stockDD) => !stockDD)} />
                    <Card.Label htmlFor="stock" mandatory>Stock item</Card.Label>
                    <Card.Dropdown dropdown={stockDD} flexDirection="column">
                        {stockList.map((item) => {
                            return <Card.Option selected={(stock?.item_name === item.item_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeStock(item)}>{item?.item_name}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(stockDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
                {/* <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="stock" placeholder=" " autoComplete="off" value={stock} />
                    <Card.Label htmlFor="stock" mandatory>Stock</Card.Label>
                </Card.InputContainer> */}
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="UOM" placeholder=" " autoComplete="off" value={UOM} />
                    <Card.Label htmlFor="UOM" mandatory>UOM</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            {/* <Card.InputColumn>
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="actualRate" placeholder=" " autoComplete="off" value={actualRate} />
                    <Card.Label htmlFor="actualRate" mandatory>Actual Rate</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="standardRate" placeholder=" " autoComplete="off" value={standardRate} />
                    <Card.Label htmlFor="standardRate" mandatory>Standard Rate</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn> */}
            <Card.InputColumn>
                <Card.InputContainer refPointer={locationRef}>
                    <Card.Input readOnly type="text" id="location" placeholder=" " autoComplete="off" value={location?.location_name || ''} onClick={() => setLocationDD((locationDD) => !locationDD)} />
                    <Card.Label htmlFor="location" mandatory>Location</Card.Label>
                    <Card.Dropdown dropdown={locationDD} flexDirection="column">
                        {locationList.map((item) => {
                            return <Card.Option selected={(location?.location_name === item.location_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeLocation(item)}>{item?.location_name}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(locationDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input type="number" id="quantity" placeholder=" " autoComplete="off" value={quantity} onKeyDown={blockInvalidNumber} onChange={({target}) => handleQuantity(target.value)} />
                    <Card.Label htmlFor="quantity" mandatory>Quantity</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                <Button disabled={isInvalid()} onClick={() => handleUpdateBatch()}>Update batch stock</Button>
            </Card.ButtonGroup>
        </Card>
        </>
    );
}