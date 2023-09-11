import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Card, Button } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { inOutList } from "../../../constants";

export default function UpdateBatchOhDetailsContainer() {
    const {getNow,getDate,getDateTime} = useDateFormat();
    const {JWT} = useAuth();
    const {dateConverter,timeConverter} = useDateFormat();
    const params = useParams();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const navigate = useNavigate();
    const location = useLocation();
    const [overheadList, setOverheadList] = useState([]);
    const [entryNumber, setEntryNumber] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [rate, setRate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [overhead, setOverhead] = useState("");
    const [UOM, setUOM] = useState("");
    const [process, setProcess] = useState("");

    const overheadRef = useRef();
    const [overheadDD, setOverheadDD] = useState(false);

    const blockInvalidNumber = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

    const isInvalid = () => {
        return (overhead?.id === (null || undefined) || entryDate === "" || UOM === "" || quantity === "" || rate === "");
    };
    const resetInputFields = () => {
        setOverhead({});
        setRate("");
        setUOM("");
        setQuantity("");
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
        axiosPrivate
        .get("/batch-actual-oh/get-actual-batch-oh-by-ids/"+params.id)
        .then(function (response) {
            console.log(response.data);
            const batchOh = response?.data?.BATCH_ACTUAL_OH;
            const batch = response?.data?.BATCH;
            const process = response?.data?.PROCESS;
            setEntryNumber(batchOh?.entry_number ? batchOh?.entry_number : "");
            setBatchNumber(batch?.batch_number ? batch?.batch_number : "");
            setEntryDate(batchOh?.entry_date ? batchOh?.entry_date.substring(0,10) : "");
            setOverhead(batchOh?.overhead ? {id: batchOh?.id, overhead: batchOh?.overhead} : "");
            setRate(batchOh?.oh_rate ? batchOh?.oh_rate : "-");
            setQuantity(batchOh?.oh_quantity ? batchOh?.oh_quantity : "");
            setUOM(batchOh?.oh_uom ? batchOh?.oh_uom : "-");
            setProcess(process?.process_name ? process?.process_name : "-");
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/batch/overhead");
        });
    },[]);

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
        setOverhead({id: item?.id, overhead: item?.overhead_name});
        setUOM(item?.overhead_uom);
        setOverheadDD(false);
    }
    
    const handleUpdateBatch = () => {
        axiosPrivate
        .put("/batch-actual-oh/update-batch-actual-oh/"+params.id, {}, {params: {overhead: overhead?.overhead, oh_uom: UOM, oh_rate: rate, entry_date: getDate(entryDate), oh_quantity: Number(quantity), modified_by: JWT?.user?.username, modified_on: getNow()}})
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
        })
        .then(() => {
            resetInputFields();
            navigate("/batch/overhead");
        })
        .catch(function (error) {
            // console.log(error)
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    const handleRate = (num) => {
        const validated = num.match(/^(\d*\.{0,1}\d{0,2}$)/)
        if (validated) {
            setRate(num);
        }
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
                <Card.Title>Update Batch overhead entry {entryNumber ? ` ${entryNumber}` : ""}</Card.Title>
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
            </Card.InputColumn>
            <Card.InputColumn>
                <Card.InputContainer refPointer={overheadRef}>
                    <Card.Input readOnly type="text" id="overhead" placeholder=" " autoComplete="off" value={overhead?.overhead || ''} onClick={() => setOverheadDD((overheadDD) => !overheadDD)} />
                    <Card.Label htmlFor="overhead" mandatory>Overhead</Card.Label>
                    <Card.Dropdown dropdown={overheadDD} flexDirection="column">
                        {overheadList.map((item) => {
                            return <Card.Option selected={(overhead?.overhead === item.overhead_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeOverhead(item)}>{item?.overhead_name}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(overheadDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input readOnly required type="text" id="UOM" placeholder=" " autoComplete="off" value={UOM} />
                    <Card.Label htmlFor="UOM" mandatory>UOM</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.InputColumn>
                <Card.InputContainer prefixx={"₹ "}>
                    <Card.Input type="number" id="rate" placeholder=" " autoComplete="off" value={rate} onKeyDown={blockInvalidNumber} onChange={({target}) => handleRate(target.value)} />
                    <Card.Label htmlFor="rate" prefixx mandatory>Rate</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input type="number" id="quantity" placeholder=" " autoComplete="off" value={quantity} onKeyDown={blockInvalidNumber} onChange={({target}) => handleQuantity(target.value)} />
                    <Card.Label htmlFor="quantity" mandatory>Quantity</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
                <Button disabled={isInvalid()} onClick={() => handleUpdateBatch()}>Update batch overhead</Button>
            </Card.ButtonGroup>
        </Card>
        </>
    );
}