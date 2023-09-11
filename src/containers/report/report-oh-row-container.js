import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, ReportTable, Modal } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ReportOhRowContainer({item}) {
    const isNegative = (num) => {
        if (num < 0) {
            return "down";
        }
        return "up";
    }

    return (
        <>
        <ReportTable.Row>
            <ReportTable.Data>{item?.process_name}</ReportTable.Data>
            <ReportTable.Data>{item?.overhead}</ReportTable.Data>
            <ReportTable.Data>{item?.oh_uom}</ReportTable.Data>
            <ReportTable.Data textRight>{item?.standard_quantity}</ReportTable.Data>
            <ReportTable.Data textRight>{item?.oh_quantity}</ReportTable.Data>
            <ReportTable.Data textRight arrow={isNegative(item?.quantity_variance)}>{Math.abs(item?.quantity_variance)}</ReportTable.Data>
            <ReportTable.Data textRight>{item?.oh_standard_cost}</ReportTable.Data>
            <ReportTable.Data textRight>{item?.oh_cost}</ReportTable.Data>
            <ReportTable.Data textRight arrow={isNegative(item?.cost_variance)}>{Math.abs(item?.cost_variance)}</ReportTable.Data>
        </ReportTable.Row>
        </>
    );
}