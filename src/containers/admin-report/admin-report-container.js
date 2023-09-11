import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, ReportTable, Checkbox, Modal } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { TbReportAnalytics } from "react-icons/tb";
import AdminReportBatchRowContainer from "./admin-report-batch-row-container";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';
import domtoimage from 'dom-to-image';

export default function AdminReportContainer() {
    const printRef = useRef();
    const {getNow,getBackDate,getDate,dateConverter} = useDateFormat();
    const {setAlert} = useAlert();
    const {JWT} = useAuth();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    
    const [batchList, setBatchList] = useState([]);

    const resetInputFields = () => {
        setFromDate("");
        setToDate("");
    }

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

    useEffect(() => {
        if(fromDate !== "" && toDate !== "") {
            axiosPrivate
            .post(`/api/generate-report-for-stock-wise/`, {from_date: getDate(fromDate), to_date: getDate(toDate)}) //${getBackDate(fromDate)}/${getBackDate(toDate)}`)
            .then(function (response) {
                console.log(response?.data);
                // setBatchList(response?.data?.batch_list);
                setBatchList(response?.data?.batch_actual_cost);
            })
            .catch(function (error) {
                setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
                navigate("/admin-reports");
            });
        }
    }, [fromDate, toDate]);

    return (
        <>
        <Card>
            <Card.Title>Reports</Card.Title>
            <Card.Line />
            <Card.InputColumn width="75%">
                <Card.InputContainer>
                    <Card.Input type="date" id="fromDate" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={fromDate} onChange={({ target }) => setFromDate(target.value)} />
                    <Card.Label htmlFor="fromDate" mandatory>From Date</Card.Label>
                </Card.InputContainer>
                <Card.InputContainer>
                    <Card.Input type="date" id="toDate" placeholder=" " onKeyDown={(e) => e.preventDefault()} autoComplete="off" value={toDate} onChange={({ target }) => setToDate(target.value)} />
                    <Card.Label htmlFor="toDate" mandatory>To Date</Card.Label>
                </Card.InputContainer>
            </Card.InputColumn>
            <Card.ButtonGroup marginTop>
                <Button nofill onClick={() => resetInputFields()}>Reset</Button>
            </Card.ButtonGroup>
        </Card>
        {batchList.length !== 0 && fromDate !== "" && toDate !== "" &&
            <div ref={printRef}>
            <Card id="captureReport">
                <Card.InputColumn notResponsive center>
                    <Card.ButtonGroup flexEnd>
                        <Button onClick={downloadReport}><Button.Icon><TbReportAnalytics /></Button.Icon>Download</Button>
                    </Card.ButtonGroup>
                </Card.InputColumn>
                <Card.Line />
                <Card.ViewTitle2>Batches</Card.ViewTitle2>
                <ReportTable marginVertical="1rem">
                    <ReportTable.Head>
                        <ReportTable.Row header>
                            <ReportTable.Header>
                                Plant
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Stock Code
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Stock Item
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Bill of Material
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Batch Number
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Start Date
                            </ReportTable.Header>
                            <ReportTable.Header>
                                End Date
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Standard Material Cost
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Standard Overhead Cost
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Standard Total Cost
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Actual Material Cost
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Actual Overhead Cost
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Actual Total Cost
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Material Variance
                            </ReportTable.Header>
                            <ReportTable.Header>
                                Overhead Variance
                            </ReportTable.Header>
                            <ReportTable.Header last={true}>
                                Total Variance
                            </ReportTable.Header>
                        </ReportTable.Row>
                    </ReportTable.Head>
                    <ReportTable.Body>
                        {batchList.map((item, index) => {
                            return <AdminReportBatchRowContainer key={index} item={item} />;
                        })}
                    </ReportTable.Body>
                </ReportTable>
            </Card>
            </div>
        }
        </>
    );
}