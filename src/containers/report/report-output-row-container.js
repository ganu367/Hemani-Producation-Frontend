import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, ReportTable, Modal } from "../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ReportOutputRowContainer({item, setViewDetailConsumption, setDetailParams}) {

    const isNegative = (num) => {
        if (num < 0) {
            return "down";
        }
        return "up";
    }

    return (
        <>
        <ReportTable.Row>
            <ReportTable.Data>{item?.item_code}</ReportTable.Data>
            <ReportTable.Data>{item?.item_name}</ReportTable.Data>
            <ReportTable.Data>{item?.uom}</ReportTable.Data>
            <ReportTable.Data textRight>{item?.bom_quantity}</ReportTable.Data>
            <ReportTable.Data textRight>{item?.quantity}</ReportTable.Data>
            <ReportTable.Data textRight arrow={isNegative((item?.quantity - item?.bom_quantity))}>{Math.abs(item?.quantity - item?.bom_quantity)}</ReportTable.Data>
        </ReportTable.Row>
        </>
    );
}