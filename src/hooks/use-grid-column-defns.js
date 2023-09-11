import React from "react";
import { Grid, Button, Card } from "../components";
import { BiDownload } from "react-icons/bi";
import { useDateFormat, useGetFile } from "../hooks";

export default function useGridColumnDefns() {
    const getFile = useGetFile();
    const {gridDateTime,dateConverter} = useDateFormat();

    const companiesGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Company" ,field: "company_name"},
        {headerName: "Code" ,field: "company_code"},
        {headerName: "Logo" ,field: "company_logo", cellRenderer: (params) => 
            <Grid.ButtonGroup flexStart>
                {params?.value &&
                    <>
                        <Button forGrid small onClick={() => getFile(params?.value)}><Button.Icon alone><BiDownload /></Button.Icon></Button> {params?.value.substring(params?.value.lastIndexOf('\\')+3)}
                    </>
                }
            </Grid.ButtonGroup>
        },
        {headerName: "GST Number" ,field: "gst_number"},
        {headerName: "PAN Number" ,field: "pan_number"},
        {headerName: "Email" ,field: "email_address"},
        {headerName: "Email Password" ,field: "email_password"},
        {headerName: "SMTP port" ,field: "smtp_port", type: 'rightAligned' },
        {headerName: "SMTP server" ,field: "smtp_server"},
        {headerName: "Created by" ,field: "created_by"},
        {headerName: "Created on" ,field: "created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Modified by" ,field: "modified_by"},
        {headerName: "Modified on" ,field: "modified_on", cellRenderer: (params) => gridDateTime(params?.value)},
    ];
    const branchesGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Branch" ,field: "branch_name"},
        {headerName: "Code" ,field: "branch_code"},
        {headerName: "Company" ,field: "company_name"},
        {headerName: "GST Number" ,field: "gst_number"},
        {headerName: "PAN Number" ,field: "pan_number"},
        {headerName: "Address" ,field: "address"},
        {headerName: "Created by" ,field: "created_by"},
        {headerName: "Created on" ,field: "created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Modified by" ,field: "modified_by"},
        {headerName: "Modified on" ,field: "modified_on", cellRenderer: (params) => gridDateTime(params?.value)},
    ];
    const plantsGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Plant" ,field: "plant_name"},
        {headerName: "Code" ,field: "plant_code"},
        {headerName: "Company" ,field: "company_name"},
        {headerName: "Branch" ,field: "branch_name"},
        {headerName: "Created by" ,field: "created_by"},
        {headerName: "Created on" ,field: "created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Modified by" ,field: "modified_by"},
        {headerName: "Modified on" ,field: "modified_on", cellRenderer: (params) => gridDateTime(params?.value)},
    ];
    const locationsGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Location" ,field: "location_name"},
        {headerName: "Code" ,field: "location_code"},
        {headerName: "Company" ,field: "company_name"},
        {headerName: "Branch" ,field: "branch_name"},
        {headerName: "Plant" ,field: "plant_name"},
        {headerName: "Created by" ,field: "created_by"},
        {headerName: "Created on" ,field: "created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Modified by" ,field: "modified_by"},
        {headerName: "Modified on" ,field: "modified_on", cellRenderer: (params) => gridDateTime(params?.value)},
    ];
    const stocksGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Name" ,field: "item_name"},
        {headerName: "Code" ,field: "item_code"},
        {headerName: "Unit of Measure" ,field: "uom"},
        {headerName: "Category" ,field: "item_category"},
        {headerName: "Type" ,field: "item_type"},
        {headerName: "HSN/SA code" ,field: "hsn_sa_code", type: 'rightAligned' },
        {headerName: "Description" ,field: "item_desc"},
        {headerName: "Created by" ,field: "created_by"},
        {headerName: "Created on" ,field: "created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Modified by" ,field: "modified_by"},
        {headerName: "Modified on" ,field: "modified_on", cellRenderer: (params) => gridDateTime(params?.value)},
    ];
    const costsGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Stock item" ,field: "item_name"},
        {headerName: "Unit of Measure" ,field: "uom"},
        {headerName: "Rate" ,field: "rate", type: 'rightAligned' },
        {headerName: "Rate from" ,field: "from_date", cellRenderer: (params) => dateConverter(params?.value)},
        // {headerName: "Rate from" ,field: "from_date"},
        {headerName: "Created by" ,field: "created_by"},
        {headerName: "Created on" ,field: "created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Modified by" ,field: "modified_by"},
        {headerName: "Modified on" ,field: "modified_on", cellRenderer: (params) => gridDateTime(params?.value)},
    ];
    const bomsGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Stock item" ,field: "item_name"},
        {headerName: "Unit of Measure" ,field: "uom"},
        {headerName: "Bill of Material Name" ,field: "bom_name"},
        {headerName: "Bill of Material Quantity" ,field: "bom_quantity", type: 'rightAligned' },
        {headerName: "Total processes" ,field: "total_process", type: 'rightAligned' },
        {headerName: "Created by" ,field: "created_by"},
        {headerName: "Created on" ,field: "created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Modified by" ,field: "modified_by"},
        {headerName: "Modified on" ,field: "modified_on", cellRenderer: (params) => gridDateTime(params?.value)},
    ];
    const batchesGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Batch number" ,field: "BATCH.batch_number"},
        {headerName: "Batch Quantity" ,field: "BATCH.batch_quantity", type: 'rightAligned' },
        {headerName: "Start date" ,field: "BATCH.start_date", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Status" ,field: "BATCH.status", cellRenderer: (params) => <Grid.Status id="status" status={(params?.value)} forGrid>{(params?.value)}</Grid.Status>},
        {headerName: "End date" ,field: "BATCH.end_date", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Stock item" ,field: "item_name"},
        {headerName: "Unit of Measure" ,field: "BATCH.uom"},
        {headerName: "Bill of Material" ,field: "bom_name"},
        // {headerName: "Plant name" ,field: "plant_name"},
        {headerName: "Created by" ,field: "BATCH.created_by"},
        {headerName: "Created on" ,field: "BATCH.created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        {headerName: "Modified by" ,field: "BATCH.modified_by"},
        {headerName: "Modified on" ,field: "BATCH.modified_on", cellRenderer: (params) => gridDateTime(params?.value)},
    ];
    const batchStocksGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Entry number" ,field: "BATCH_ACTUAL_CONSUMPTION.entry_number"},
        {headerName: "Batch Number" ,field: "batch_number"},
        // {headerName: "Stock item" ,field: "item_name"},
        // {headerName: "Unit of Measure" ,field: "uom"},
        {headerName: "Process" ,field: "process_name"},
        // {headerName: "From Location" ,field: "location_name"},
        // {headerName: "Quantity" ,field: "BATCH_ACTUAL_CONSUMPTION.quantity"},
        // {headerName: "In / Out" ,field: "BATCH_ACTUAL_CONSUMPTION.in_out"},
        {headerName: "Entry date" ,field: "BATCH_ACTUAL_CONSUMPTION.entry_date", cellRenderer: (params) => dateConverter(params?.value)},
        // {headerName: "Actual rate" ,field: "BATCH_ACTUAL_CONSUMPTION.actual_rate"},
        // {headerName: "Standard rate" ,field: "BATCH_ACTUAL_CONSUMPTION.standard_rate"},
        // {headerName: "Plant name" ,field: "plant_name"},
        {headerName: "Created by" ,field: "BATCH_ACTUAL_CONSUMPTION.created_by"},
        {headerName: "Created on" ,field: "BATCH_ACTUAL_CONSUMPTION.created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        // {headerName: "Modified by" ,field: "BATCH_ACTUAL_CONSUMPTION.modified_by"},
        // {headerName: "Modified on" ,field: "BATCH_ACTUAL_CONSUMPTION.modified_on"},
    ];
    const batchOhsGridDefn = [
        {headerName: " " ,field: "", cellRenderer: (params) => <></>,checkboxSelection: true, maxWidth: 50},
        {headerName: "ID", field: "id", hide: true },
        {headerName: "Entry number" ,field: "BATCH_ACTUAL_OH.entry_number"},
        {headerName: "Batch Number" ,field: "batch_number"},
        {headerName: "Process" ,field: "process_name"},
        // {headerName: "Overhead" ,field: "BATCH_ACTUAL_OH.overhead"},
        // {headerName: "Unit of Measure" ,field: "BATCH_ACTUAL_OH.oh_uom"},
        // {headerName: "Rate" ,field: "BATCH_ACTUAL_OH.oh_rate"},
        // {headerName: "Quantity" ,field: "BATCH_ACTUAL_OH.oh_quantity"},
        {headerName: "Entry date" ,field: "BATCH_ACTUAL_OH.entry_date", cellRenderer: (params) => dateConverter(params?.value)},
        // {headerName: "Plant name" ,field: "plant_name"},
        {headerName: "Created by" ,field: "BATCH_ACTUAL_OH.created_by"},
        {headerName: "Created on" ,field: "BATCH_ACTUAL_OH.created_on", cellRenderer: (params) => gridDateTime(params?.value)},
        // {headerName: "Modified by" ,field: "BATCH_ACTUAL_OH.modified_by"},
        // {headerName: "Modified on" ,field: "BATCH_ACTUAL_OH.modified_on"},
    ];

    return {companiesGridDefn,branchesGridDefn,plantsGridDefn,locationsGridDefn,stocksGridDefn,costsGridDefn,bomsGridDefn,batchesGridDefn,batchStocksGridDefn,batchOhsGridDefn};
};