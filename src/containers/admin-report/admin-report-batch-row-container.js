import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, ReportTable, Modal } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function AdminReportBatchRowContainer({item, setViewDetailConsumption, setDetailParams}) {
    const {gridDateTime} = useDateFormat();
    const navigate = useNavigate();

    const handleClick = (event) => {
        if (event.detail === 2) {
            navigate("/reports", {state: {batchID: item?.id, stockID: item?.stock_id, batchNumber: item?.batch_number, itemName: item?.item_name}});
        }
    };

    const isNegative = (num) => {
        if (num < 0) {
            return "down";
        }
        return "up";
    }

    return (
        <>
        <ReportTable.Row onClick={(e) => handleClick(e)}>
            <ReportTable.Data>{item?.plant_name}</ReportTable.Data>
            <ReportTable.Data>{item?.item_code}</ReportTable.Data>
            <ReportTable.Data>{item?.item_name}</ReportTable.Data>
            <ReportTable.Data>{item?.bom_name}</ReportTable.Data>
            <ReportTable.Data>{item?.batch_number}</ReportTable.Data>
            <ReportTable.Data>{gridDateTime(item?.start_date)}</ReportTable.Data>
            <ReportTable.Data>{gridDateTime(item?.end_date)}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.standard_material_cost}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.standard_oh_cost}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.standard_total_cost}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.actual_material_cost}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.actual_oh_cost}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.actual_total_cost}</ReportTable.Data>
            <ReportTable.Data textRight={true} arrow={isNegative(item?.materail_variance)}>{Math.abs(item?.materail_variance)}</ReportTable.Data>
            <ReportTable.Data textRight={true} arrow={isNegative(item?.oh_variance)}>{Math.abs(item?.oh_variance)}</ReportTable.Data>
            <ReportTable.Data textRight={true} arrow={isNegative(item?.total_variance)}>{Math.abs(item?.total_variance)}</ReportTable.Data>
        </ReportTable.Row>
        </>
    );
}