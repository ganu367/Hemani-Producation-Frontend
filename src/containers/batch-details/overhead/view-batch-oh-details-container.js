import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../../../components";
import { useAxiosPrivate, useAlert, useAuth, useDateFormat } from "../../../hooks";
import { FaTimes } from "react-icons/fa";
import UpdateBatchOhDetailsModal from "./update-batch-oh-details-modal";
import DeleteModalContainer from "../../delete-modal-container";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ViewBatchOhDetailsContainer() {
    const {JWT} = useAuth();
    const {getNow,getDate,dateConverter} = useDateFormat();
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();
    const params = useParams();
    const navigate = useNavigate();
    const [overheadDetails, setOverheadDetails] = useState([{stock_id: "", uom: "", bom_quantity: "", in_out: ""}]);
    const [retOverheadDetails, setRetOverheadDetails] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [deleteMode, setDeleteMode] = useState(null);

    const [deleteModal,setDeleteModal] = useState(false);

    const toggleViewBomOverheadDetails = async () => {
        axiosPrivate
        .get(`/batch-actual-oh/get-actual-batch-oh-by-ids/${params.id}`)
        .then(function (response) {
            console.log(response?.data);
            setRetOverheadDetails(response?.data);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
            navigate("/batch/overhead");
        });
    }

    const removeRetOverheadDetails = (i) => {
        const tempProcs = [...retOverheadDetails];
        if (tempProcs.length === 1) {
            setRetOverheadDetails([]);
            return;
        }
        tempProcs.splice(i, 1);
        setRetOverheadDetails(tempProcs);
    }

    const handleDeleteOverheadDetail = (funcProps) => {
        const {id, index} = funcProps;
        axiosPrivate
        .delete("/batch-actual-oh/delete-actual-batch-oh/"+id)
        .then(function (response) {
            setAlert({msg: `Success: ${response?.data[0]}`, type: "success"});
            removeRetOverheadDetails(index);
            setDeleteMode(null);
        })
        .catch(function (error) {
            setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
        });
    }

    useEffect(() => {
        toggleViewBomOverheadDetails();
    }, []);

    return (
        <>
        <Card width="100%">
            <Card.InputColumn notResponsive center>
                <Card.Title>Batch overhead entry{retOverheadDetails.length ? ` ${retOverheadDetails[0]?.BATCH_ACTUAL_OH?.entry_number}` : ""}</Card.Title>
                <Card.ButtonGroup flexEnd>
                    <Button small iconPadding danger onClick={() => navigate("/batch/overhead")}><Button.Icon alone><FaTimes /></Button.Icon></Button>
                </Card.ButtonGroup>
            </Card.InputColumn>
            <Card.Line />
            {(retOverheadDetails.length !== 0) &&
                <Card.InputColumn>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="batch" placeholder=" " autoComplete="off" value={retOverheadDetails[0]?.BATCH?.batch_number || ''} />
                        <Card.Label htmlFor="batch" mandatory>Batch no.</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="process" placeholder=" " autoComplete="off" value={retOverheadDetails[0]?.PROCESS?.process_name || ''} />
                        <Card.Label htmlFor="process" mandatory>Process</Card.Label>
                    </Card.InputContainer>
                    <Card.InputContainer>
                        <Card.Input readOnly required type="text" id="entryDate" placeholder=" " autoComplete="off" value={dateConverter(retOverheadDetails[0]?.BATCH_ACTUAL_OH?.entry_date) || ''} />
                        <Card.Label htmlFor="entryDate" mandatory>Entry Date</Card.Label>
                    </Card.InputContainer>
                </Card.InputColumn>
            }
            {(retOverheadDetails.length !== 0) &&
                <Card.InputColumn center notResponsive>
                    <Card.Header>
                        <Card.HeaderText>Overhead</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Unit of Measure</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Rate</Card.HeaderText>
                    </Card.Header>
                    <Card.Header>
                        <Card.HeaderText>Quantity</Card.HeaderText>
                    </Card.Header>
                    <Card.ButtonContainer width="fit-content" notVisible={true}>
                        <Card.AddButton small />
                    </Card.ButtonContainer>
                    <Card.ButtonContainer width="fit-content" notVisible={true}>
                        <Card.AddButton small />
                    </Card.ButtonContainer>
                </Card.InputColumn>
            }
            {(retOverheadDetails.length === 0) &&
                <Card.InputColumn center notResponsive>
                    <Card.MultiInputContainer>
                        No stock details to view!
                    </Card.MultiInputContainer>
                </Card.InputColumn>
            }
            {retOverheadDetails.map((element, index) => {
                return (
                    <Card.InputColumn center key={index} notResponsive>
                        <Card.MultiInputContainer>
                            <Card.ViewText id="overhead">{element?.BATCH_ACTUAL_OH?.overhead}</Card.ViewText>
                        </Card.MultiInputContainer>
                        <Card.MultiInputContainer>
                            <Card.ViewText id="uom">{element?.BATCH_ACTUAL_OH?.oh_uom}</Card.ViewText>
                        </Card.MultiInputContainer>
                        <Card.MultiInputContainer>
                            <Card.ViewText id="rate">₹ {element?.BATCH_ACTUAL_OH?.oh_rate}</Card.ViewText>
                        </Card.MultiInputContainer>
                        <Card.MultiInputContainer>
                            <Card.ViewText id="quantity">{element?.BATCH_ACTUAL_OH?.oh_quantity}</Card.ViewText>
                        </Card.MultiInputContainer>
                        <Card.ButtonContainer width="fit-content">
                            <Card.AddButton danger deletes small onClick={() => {
                                setDeleteMode({id: element?.BATCH_ACTUAL_OH?.id, index: index});
                                setDeleteModal(true);
                            }} />
                        </Card.ButtonContainer>
                        <Card.ButtonContainer width="fit-content">
                            <Card.AddButton edits small onClick={() => setEditMode({element: element, index: index, entry_date: getDate(retOverheadDetails[0]?.BATCH_ACTUAL_OH?.entry_date)})} />
                        </Card.ButtonContainer>
                    </Card.InputColumn>
                );
            })}
        </Card>
        {(editMode !== null) ?
            <UpdateBatchOhDetailsModal editItem={editMode} setEditMode={setEditMode} retOverheadDetails={retOverheadDetails} setRetOverheadDetails={setRetOverheadDetails} />
        : null}
        {(deleteModal) ? 
            <DeleteModalContainer textAlign={"center"} deleteFunction={handleDeleteOverheadDetail} funcProps={deleteMode} setDeleteModal={setDeleteModal}>Are you sure you want to delete this overhead detail?</DeleteModalContainer>
        : null}
        </>
    );
}