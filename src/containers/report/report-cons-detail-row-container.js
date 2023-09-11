import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, ReportTable, Modal } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ReportConsDetailRowContainer({item, setViewDetailConsumption, setDetailParams}) {
    const {dateConverter} = useDateFormat();

    return (
        <>
        <ReportTable.Row>
            {/* <ReportTable.Data>{item?.batch_number}</ReportTable.Data> */}
            <ReportTable.Data>{item?.entry_number}</ReportTable.Data>
            <ReportTable.Data>{dateConverter(item?.entry_date)}</ReportTable.Data>
            <ReportTable.Data>{item?.process_name}</ReportTable.Data>
            <ReportTable.Data>{item?.item_code}</ReportTable.Data>
            <ReportTable.Data>{item?.item_name}</ReportTable.Data>
            <ReportTable.Data>{item?.uom}</ReportTable.Data>
            <ReportTable.Data textRight>{item?.quantity}</ReportTable.Data>
            <ReportTable.Data>{item?.in_out}</ReportTable.Data>
            <ReportTable.Data>{item?.location_name}</ReportTable.Data>
        </ReportTable.Row>
        </>
    );
}