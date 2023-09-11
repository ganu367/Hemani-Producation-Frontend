import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, ReportTable, Checkbox, Modal } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { TbReportAnalytics } from "react-icons/tb";
import ReportConsRowContainer from "./report-cons-row-container";
import ReportConsDetailRowContainer from "./report-cons-detail-row-container";
import ReportOhRowContainer from "./report-oh-row-container";
import ReportOutputRowContainer from "./report-output-row-container";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';
import domtoimage from 'dom-to-image';

export default function ReportContainer() {
    const printRef = useRef();
    const currBatchRef = useRef();
    const stateRef = useRef(1);
    const {getNow,getDate,dateConverter} = useDateFormat();
    const {setAlert} = useAlert();
    const {JWT} = useAuth();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const {state} = location;

    const [product, setProduct] = useState({});
    const [productDD, setProductDD] = useState(false);
    const [productList, setProductList] = useState([]);
    const productRef = useRef();

    const [batch, setBatch] = useState({});
    const [batchDD, setBatchDD] = useState(false);
    const [batchList, setBatchList] = useState([]);
    const batchRef = useRef();
    
    const [basic, setBasic] = useState([]);
    const [consumptionDetails, setConsumptionDetails] = useState([]);
    const [consumption, setConsumption] = useState([]);
    const [overhead, setOverhead] = useState([]);
    const [output, setOutput] = useState([]);
    const [viewDetailConsumption, setViewDetailConsumption] = useState(false);
    const [detailParams, setDetailParams] = useState({});

    const resetInputFields = () => {
        setProduct({});
        setBatch({});
    }

    useEffect(() => {
        if(state) {
            console.log("state: ",state);
            setProduct({id: state?.stockID, item_name: state?.itemName});
            setBatch({id: state?.batchID, batch_number: state?.batchNumber});
        }
    }, []);

    const downloadReport = () => {
        html2canvas(document.querySelector("#captureReport")).then(canvas => {
            // document.body.appendChild(canvas);  // if you want see your screenshot in body.
            const imgData = canvas.toDataURL('image/jpeg');
            const pdf = new jsPDF("p", "mm", "a4");
            var width = pdf.internal.pageSize.getWidth();
            pdf.addImage(imgData, 'JPEG', 0, 0, width, 0);
            pdf.save("download.pdf"); 
    });
    }

    // const downloadReport = useReactToPrint({
    //     content: () => printRef.current,
    //     // pageStyle: `
    //     //     @page {
    //     //         size: landscape;
    //     //     }
    //     //     @media print {
    //     //         body {
    //     //         transform: scale(1);
    //     //         }
    //     //     }
    //     // `,
    //     onBeforeGetContent: () => {
    //     return new Promise((resolve) => {
    //         const node = printRef.current;
    //         const options = {
    //         scrollX: -window.scrollX,
    //         scrollY: -window.scrollY,
    //         width: node.scrollWidth,
    //         height: node.scrollHeight,
    //         style: {
    //             'transform-origin': 'top left',
    //             transform: 'scale(1)',
    //             'background-color': 'white',
    //         },
    //         };
    //         domtoimage.toPng(node, options).then((dataUrl) => {
    //         resolve(dataUrl);
    //         });
    //     });
    //     },
    //     onAfterPrint: () => {
    //     const node = printRef.current;
    //     node.style.transform = '';
    //     node.style['transform-origin'] = '';
    //     },
    // });

    useEffect(() => {
        axiosPrivate
        .get("/api/get-finished-goods")
        .then(function (response) {
            setProductList(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }, []);

    useEffect(() => {
        console.log("stateRef.current: ",stateRef.current)
        if(state) {
            stateRef.current += 1;
        }
        if(!state || stateRef.current > 3) {
            setBatch(() => {});
        }
        setBatchList(() => []);
        if (product?.id) {
            axiosPrivate
            .get("/api/show-closed-batches-for-stock/"+product?.id)
            .then(function (response) {
                // console.log(response?.data);
                setBatchList(response?.data);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
                setBatchList([]);
            });
        }
    }, [product]);

    // useEffect(() => {
    //     console.log(currBatchRef.current)
    // }, [currBatchRef.current]);

    useEffect(() => {
        if(product?.id && batch?.id && currBatchRef?.current !== batch?.id) {
            currBatchRef.current = batch?.id;
            axiosPrivate
            .get(`/api/all-generate-report/${product?.id}/${batch?.id}`)
            .then(function (response) {
                // console.log(response?.data);
                setBasic(response?.data?.Basic[0]);
                setConsumptionDetails(response?.data?.Consumpation_data);
                setConsumption(JSON.parse(response?.data?.consumption));
                setOverhead(JSON.parse(response?.data?.overhead_reports));
                setOutput(JSON.parse(response?.data?.consumption_out));
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
                navigate("/reports");
            });
        }
    }, [product, batch]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(productDD && !productRef?.current?.contains(e.target)) {
                setProductDD(false);
            }
        }
        window.addEventListener("click",handleOutsideClick);
        return () => window.removeEventListener("click",handleOutsideClick);
    }, [productDD, productRef]);
    const changeProduct = (item) => {
        setProduct(item);
        setProductDD(false);
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

    // useEffect(() => {
    //     console.log(output);
    // }, [output]);

    return (
        <>
        <Card>
            <Card.Title>Reports</Card.Title>
            <Card.Line />
            <Card.InputColumn width="75%">
                <Card.InputContainer refPointer={productRef}>
                    <Card.Input readOnly type="text" id="product" placeholder=" " autoComplete="off" value={product?.item_name ? product?.item_name : ""} onClick={() => setProductDD((productDD) => !productDD)} />
                    <Card.Label htmlFor="product" mandatory>Product</Card.Label>
                    <Card.Dropdown empty={!productList.length} dropdown={productDD} flexDirection="column">
                        {productList.map((item) => {
                            return <Card.Option selected={(product?.item_name === item.item_name) ? "selected" : undefined} key={item.id} onClick={({target}) => changeProduct(item)}>{item?.item_name}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(productDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
                <Card.InputContainer refPointer={batchRef}>
                    <Card.Input readOnly type="text" id="batch" placeholder=" " autoComplete="off" value={batch?.batch_number ? batch?.batch_number : ""} onClick={() => setBatchDD((batchDD) => !batchDD)} />
                    <Card.Label htmlFor="batch" mandatory>Batch no.</Card.Label>
                    <Card.Dropdown empty={!batchList.length} dropdown={batchDD} flexDirection="column">
                        {batchList.map((item) => {
                            return <Card.Option selected={(batch?.batch_number === item.batch_number) ? "selected" : undefined} key={item.id} onClick={({target}) => changeBatch(item)}>{item?.batch_number}</Card.Option>
                        })}
                    </Card.Dropdown>
                    <Card.Icon style={{pointerEvents: "none"}}>
                        {(batchDD) ? <FiChevronUp /> : <FiChevronDown />}
                    </Card.Icon>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
            </Card.ButtonGroup>
        </Card>
        {basic?.batch_number && product?.id && batch?.id && // consumption.length !== 0 
            <div ref={printRef}>
            <Card id="captureReport">
                <Card.InputColumn notResponsive center>
                    <Card.ButtonGroup flexEnd>
                        <Button onClick={downloadReport}><Button.Icon><TbReportAnalytics /></Button.Icon>Download</Button>
                    </Card.ButtonGroup>
                </Card.InputColumn>
                <Card.Line />
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>BATCH NUMBER: </Card.ViewLabel>
                            <Card.ViewText id="batch_number">{basic?.batch_number}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>START DATE: </Card.ViewLabel>
                            <Card.ViewText id="start_date">{dateConverter(basic?.start_date)}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>END DATE: </Card.ViewLabel>
                            <Card.ViewText id="end_date">{dateConverter(basic?.end_date)}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>BATCH QUANTITY: </Card.ViewLabel>
                            <Card.ViewText id="batch_quantity">{basic?.batch_quantity}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>PRODUCT: </Card.ViewLabel>
                            <Card.ViewText id="item_name">{basic?.item_name}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.ViewRow>
                            <Card.ViewLabel>BILL OF MATERIAL: </Card.ViewLabel>
                            <Card.ViewText id="bom_name">{basic?.bom_name}</Card.ViewText>
                        </Card.ViewRow>
                    </Card.InputContainer>
                </Card.InputColumn>
                <Card.Line />
                <Card.ViewTitle2>Material Consumption</Card.ViewTitle2>
                {(consumption.length !== 0) &&
                    <ReportTable marginVertical="1rem">
                        <ReportTable.Head>
                            <ReportTable.Row header>
                                <ReportTable.Header>
                                    Process
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Stock code
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Stock
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Unit of Measure
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Standard Quantity
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Actual Quantity
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Quantity Variance
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Standard Cost
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Actual Cost
                                </ReportTable.Header>
                                <ReportTable.Header last={true}>
                                    Cost Variance
                                </ReportTable.Header>
                            </ReportTable.Row>
                        </ReportTable.Head>
                        <ReportTable.Body>
                            {consumption.map((item, index) => {
                                return <ReportConsRowContainer key={index} item={item} setViewDetailConsumption={setViewDetailConsumption} setDetailParams={setDetailParams} />;
                            })}
                        </ReportTable.Body>
                    </ReportTable>
                }
                {(consumption.length === 0) &&
                    <ReportTable.EmptyRow>
                        No data found!
                    </ReportTable.EmptyRow>
                }
                <Card.ViewTitle2>Overhead</Card.ViewTitle2>
                {(overhead.length !== 0) &&
                    <ReportTable marginVertical="1rem">
                        <ReportTable.Head>
                            <ReportTable.Row header>
                                <ReportTable.Header>
                                    Process
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Overhead
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Unit of Measure
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Standard Quantity
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Actual Quantity
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Quantity Variance
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Standard Cost
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Actual Cost
                                </ReportTable.Header>
                                <ReportTable.Header last={true}>
                                    Cost Variance
                                </ReportTable.Header>
                            </ReportTable.Row>
                        </ReportTable.Head>
                        <ReportTable.Body>
                            {overhead.map((item, index) => {
                                return <ReportOhRowContainer key={index} item={item} />;
                            })}
                        </ReportTable.Body>
                    </ReportTable>
                }
                {(overhead.length === 0) &&
                    <ReportTable.EmptyRow>
                        No data found!
                    </ReportTable.EmptyRow>
                }
                <Card.ViewTitle2>Output</Card.ViewTitle2>
                {(output.length !== 0) &&
                    <ReportTable marginVertical="1rem">
                        <ReportTable.Head>
                            <ReportTable.Row header>
                                <ReportTable.Header>
                                    Stock code
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Stock
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Unit of Measure
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Standard Quantity
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Actual Quantity
                                </ReportTable.Header>
                                <ReportTable.Header last={true}>
                                    Quantity Variance
                                </ReportTable.Header>
                            </ReportTable.Row>
                        </ReportTable.Head>
                        <ReportTable.Body>
                            {output.map((item, index) => {
                                return <ReportOutputRowContainer key={index} item={item} />;
                            })}
                        </ReportTable.Body>
                    </ReportTable>
                }
                {(output.length === 0) &&
                    <ReportTable.EmptyRow>
                        No data found!
                    </ReportTable.EmptyRow>
                }
            </Card>
            </div>
        }
        {viewDetailConsumption &&
            <Modal>
                <Modal.Container width="fit-content">
                    <Modal.Title>Details</Modal.Title>
                    <Modal.Line />
                    <ReportTable marginVertical="1rem" maxHeight="25rem">
                        <ReportTable.Head>
                            <ReportTable.Row header>
                                {/* <ReportTable.Header>
                                    Batch number
                                </ReportTable.Header> */}
                                <ReportTable.Header>
                                    Entry number
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Entry date
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Process
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Stock code
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Stock
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Unit of Measure
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    Quantity
                                </ReportTable.Header>
                                <ReportTable.Header>
                                    In / Out
                                </ReportTable.Header>
                                <ReportTable.Header last={true}>
                                    Location
                                </ReportTable.Header>
                            </ReportTable.Row>
                        </ReportTable.Head>
                        <ReportTable.Body>
                            {consumptionDetails.map((item, index) => {
                                if (item.process_name === detailParams?.process_name && item.item_name === detailParams?.item_name)
                                    return <ReportConsDetailRowContainer key={index} item={item} setViewDetailConsumption={setViewDetailConsumption} setDetailParams={setDetailParams} />;
                            })}
                        </ReportTable.Body>
                    </ReportTable>
                    <Modal.ButtonContainer>
                        <Button nofill onClick={() => {
                            setViewDetailConsumption(false);
                            setDetailParams({});
                        }}>Close</Button>
                        {/* <Button>Confirm</Button> */}
                    </Modal.ButtonContainer>
                </Modal.Container>
            </Modal>
        }
        </>
    );
}