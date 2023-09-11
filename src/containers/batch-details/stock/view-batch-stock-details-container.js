import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../../hooks";
import { FaTimes } from "react-icons/fa";
import UpdateBatchStockDetailsModal from "./update-batch-stock-details-modal";
import DeleteModalContainer from "../../delete-modal-container";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ViewBatchStockDetailsContainer() {
    const {JWT} = useAuth();
    const {getNow,getDate,dateConverter} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const params = useParams();
    const navigate = useNavigate();
    const [stockDetails, setStockDetails] = useState([{stock_id: "", uom: "", bom_quantity: "", in_out: ""}]);
    const [retStockDetails, setRetStockDetails] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [deleteMode, setDeleteMode] = useState(null);

    const [deleteModal,setDeleteModal] = useState(false);

    const toggleViewBomStockDetails = async () => {
        axiosPrivate
        .get(`/batch-actual-consumption/get-batch-ack-consumption-by-ids/${params.id}`)
        .then(function (response) {
            console.log(response?.data);
            setRetStockDetails(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/batch/stock");
        });
    }

    const removeRetStockDetails = (i) => {
        const tempProcs = [...retStockDetails];
        if (tempProcs.length === 1) {
            setRetStockDetails([]);
            return;
        }
        tempProcs.splice(i, 1);
        setRetStockDetails(tempProcs);
    }

    const handleDeleteStockDetail = (funcProps) => {
        const {id, index} = funcProps;
        axiosPrivate
        .delete("/batch-actual-consumption/delete-batch-ack-consumption/"+id)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            removeRetStockDetails(index);
            setDeleteMode(null);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        toggleViewBomStockDetails();
    }, []);

    return (
        <>
        <Card width="100%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Batch stock entry{retStockDetails.length ? ` ${retStockDetails[0]?.BATCH_ACTUAL_CONSUMPTION?.entry_number}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate("/batch/stock")}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            {(retStockDetails.length !== 0) &&
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="batch" placeholder=" " autoComplete="off" value={retStockDetails[0]?.BATCH?.batch_number || ''} />
                        <Card.Label htmlFor="batch" mandatory>Batch no.</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="process" placeholder=" " autoComplete="off" value={retStockDetails[0]?.PROCESS?.process_name || ''} />
                        <Card.Label htmlFor="process" mandatory>Process</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="entryDate" placeholder=" " autoComplete="off" value={dateConverter(retStockDetails[0]?.BATCH_ACTUAL_CONSUMPTION?.entry_date) || ''} />
                        <Card.Label htmlFor="entryDate" mandatory>Entry Date</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
            }
            {(retStockDetails.length !== 0) &&
                <Card.InputColumn center notResponsive>
                    <Card.Header>
                        <Card.HeaderText>In / Out</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Stock</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Unit of Measure</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Quantity</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Location</Card.HeaderText>
                    </Card.Header>
                    <Card.ButtonContainer width="fit-content" notVisible={true}>
                        <Card.AddButton small />
                    </Card.ButtonContainer>
                    <Card.ButtonContainer width="fit-content" notVisible={true}>
                        <Card.AddButton small />
                    </Card.ButtonContainer>
                </Card.InputColumn>
            }
            {(retStockDetails.length === 0) &&
                <Card.InputColumn center notResponsive>
                    <Card.MultiInputContainer>
                        No stock details to view!
                    </Card.MultiInputContainer>
                </Card.InputColumn>
            }
            {retStockDetails.map((element, index) => {
                return (
                    <Card.InputColumn center key={index} notResponsive>
                        <Card.MultiInputContainer>
                            <Card.ViewText id="in_out">{element?.BATCH_ACTUAL_CONSUMPTION?.in_out}</Card.ViewText>
                        </Card.MultiInputContainer>
                        <Card.MultiInputContainer>
                            <Card.ViewText id="item_name">{element?.StockMaster?.item_name}</Card.ViewText>
                        </Card.MultiInputContainer>
                        <Card.MultiInputContainer>
                            <Card.ViewText id="uom">{element?.BATCH_ACTUAL_CONSUMPTION?.uom}</Card.ViewText>
                        </Card.MultiInputContainer>
                        <Card.MultiInputContainer>
                            <Card.ViewText id="quantity">{element?.BATCH_ACTUAL_CONSUMPTION?.quantity}</Card.ViewText>
                        </Card.MultiInputContainer>
                        <Card.MultiInputContainer>
                            <Card.ViewText id="location_name">{element?.Location?.location_name}</Card.ViewText>
                        </Card.MultiInputContainer>
                        <Card.ButtonContainer width="fit-content">
                            <Card.AddButton danger deletes small onClick={() => {
                                setDeleteMode({id: element?.BATCH_ACTUAL_CONSUMPTION?.id, index: index});
                                setDeleteModal(true);
                            }} />
                        </Card.ButtonContainer>
                        <Card.ButtonContainer width="fit-content">
                            <Card.AddButton edits small onClick={() => setEditMode({element: element, index: index, entry_date: getDate(retStockDetails[0]?.BATCH_ACTUAL_CONSUMPTION?.entry_date)})} />
                        </Card.ButtonContainer>
                    </Card.InputColumn>
                );
            })}
        </Card>
        {(editMode !== null) ?
            <UpdateBatchStockDetailsModal editItem={editMode} setEditMode={setEditMode} retStockDetails={retStockDetails} setRetStockDetails={setRetStockDetails} />
        : null}
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteStockDetail} funcProps={deleteMode} setDeleteModal={setDeleteModal}>Are you sure you want to delete this stock detail?</DeleteModalContainer>
        : null}
        </>
    );
}