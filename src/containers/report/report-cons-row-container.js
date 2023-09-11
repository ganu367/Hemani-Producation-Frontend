import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, ReportTable, Modal } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ReportConsRowContainer({item, setViewDetailConsumption, setDetailParams}) {

    const handleClick = (event) => {
        if (event.detail === 2) {
            setViewDetailConsumption(true);
            setDetailParams({id: item.id, process_name: item.process_name, item_name: item.item_name})
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
            <ReportTable.Data>{item?.process_name}</ReportTable.Data>
            <ReportTable.Data>{item?.item_code}</ReportTable.Data>
            <ReportTable.Data>{item?.item_name}</ReportTable.Data>
            <ReportTable.Data>{item?.uom}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.bom_quantity}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.quantity}</ReportTable.Data>
            <ReportTable.Data textRight={true} arrow={isNegative(item?.quantity_variance)}>{Math.abs(item?.quantity_variance)}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.stadard_cost}</ReportTable.Data>
            <ReportTable.Data textRight={true}>{item?.actual_cost}</ReportTable.Data>
            <ReportTable.Data textRight={true} arrow={isNegative(item?.cost_variance)}>{Math.abs(item?.cost_variance)}</ReportTable.Data>
        </ReportTable.Row>
        </>
    );
}