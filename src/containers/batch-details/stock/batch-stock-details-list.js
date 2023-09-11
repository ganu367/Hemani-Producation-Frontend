import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "../../../components";
import { useAxiosPrivate, useAlert, useGridColumnDefns, useAuth, useDateFormat } from "../../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { inOutList } from "../../../constants";

export default function BatchStockDetailsList({element, index, stockDetails, setStockDetails, removeStockDetails}) {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const {setAlert} = useAlert();
    const [stock, setStock] = useState("");
    const [UOM, setUOM] = useState("");
    const [quantity, setQuantity] = useState("");
    const [inOut, setInOut] = useState("in");
    const [location, setLocation] = useState("");
    const [stockList, setStockList] = useState([]);
    const [stockDD, setStockDD] = useState(false);
    const [locationList, setLocationList] = useState([]);
    const [locationDD, setLocationDD] = useState(false);
    const [inOutDD, setInOutDD] = useState(false);
    const stockRef = useRef();
    const inOutRef = useRef();
    const locationRef = useRef();
    const blockInvalidNumber = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const resetInputFields = () => {
        setStock("");
        setUOM("");
        setQuantity("");
        setInOut("in");
        setLocation("");
    }

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
        setStock({});
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

    const handleStockDetails = () => {
        const tempProcs = [...stockDetails];
        tempProcs[index]["stock_id"] = stock?.id;
        tempProcs[index]["stock_name"] = stock?.item_name;
        tempProcs[index]["location_id"] = location?.id;
        tempProcs[index]["location_name"] = location?.location_name;
        tempProcs[index]["uom"] = UOM;
        tempProcs[index]["quantity"] = quantity;
        tempProcs[index]["in_out"] = inOut;
        setStockDetails(tempProcs);
    }
    useEffect(() => {
        handleStockDetails();
    }, [stock, quantity, inOut, location]);    

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
        <Card.InputColumn center notResponsive>
            <Card.MultiInputContainer refPointer={inOutRef}>
                <Card.MultiInput readOnly type="text" id="inOut" placeholder=" " autoComplete="off" value={element?.in_out || ''} onClick={() => setInOutDD((inOutDD) => !inOutDD)} />
                <Card.Dropdown empty={!inOutList.length} dropdown={inOutDD} flexDirection="column">
                    {inOutList.map((item) => {
                        return <Card.Option selected={(inOut === item.type) ? "selected" : undefined} key={item.id} onClick={({target}) => changeInOut(item.type)}>{item?.type}</Card.Option>
                    })}
                </Card.Dropdown>
                <Card.Icon style={{pointerEvents: "none"}}>
                    {(inOutDD) ? <FiChevronUp /> : <FiChevronDown />}
                </Card.Icon>
            </Card.MultiInputContainer>
            <Card.MultiInputContainer refPointer={stockRef}>
                <Card.MultiInput readOnly type="text" id="stock" placeholder=" " autoComplete="off" value={element?.stock_name || ''} onClick={() => setStockDD((stockDD) => !stockDD)} />
                <Card.Dropdown empty={!stockList.length} dropdown={stockDD} flexDirection="column">
                    {stockList.map((item) => {
                        return <Card.Option selected={(stock?.item_name === item.item_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeStock(item)}>{item?.item_name}</Card.Option>
                    })}
                </Card.Dropdown>
                <Card.Icon style={{pointerEvents: "none"}}>
                    {(stockDD) ? <FiChevronUp /> : <FiChevronDown />}
                </Card.Icon>
            </Card.MultiInputContainer>
            <Card.MultiInputContainer>
                <Card.MultiInput readOnly required type="text" id="UOM" placeholder=" " autoComplete="off" value={element?.uom || ''} />
            </Card.MultiInputContainer>
            <Card.MultiInputContainer>
                <Card.MultiInput type="number" id="quantity" placeholder=" " autoComplete="off" onKeyDown={blockInvalidNumber} value={element?.quantity || ''} onChange={({target}) => handleQuantity(target.value)} />
            </Card.MultiInputContainer>
            <Card.MultiInputContainer refPointer={locationRef}>
                <Card.MultiInput readOnly type="text" id="location" placeholder=" " autoComplete="off" value={element?.location_name || ''} onClick={() => setLocationDD((locationDD) => !locationDD)} />
                <Card.Dropdown empty={!locationList.length} dropdown={locationDD} flexDirection="column">
                    {locationList.map((item) => {
                        return <Card.Option selected={(location?.location_name === item.location_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeLocation(item)}>{item?.location_name}</Card.Option>
                    })}
                </Card.Dropdown>
                <Card.Icon style={{pointerEvents: "none"}}>
                    {(locationDD) ? <FiChevronUp /> : <FiChevronDown />}
                </Card.Icon>
            </Card.MultiInputContainer>
            <Card.ButtonContainer width="fit-content">
                <Card.AddButton danger deletes small onClick={() => {
                    removeStockDetails(index);
                    resetInputFields();
                }} />
            </Card.ButtonContainer>
        </Card.InputColumn>
    );
}