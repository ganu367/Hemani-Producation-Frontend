import React, { useEffect, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { Nav } from "../components";
import { useAlert, useSidebar, useBase64ToFile, useAuth } from "../hooks";
// import { ProtectedComponent } from "../helpers";
import axios from "../api/axios";
import { RoleView } from "../helpers";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { acecomLogo } from "../constants";

export default function SidebarContainer() {
    const location = useLocation();
    const {auth} = useAuth();
    const dataURLtoFile = useBase64ToFile();
    const {sidebarToggle} = useSidebar();
    const {setAlert} = useAlert();
    const [bomDetailsDD, setBomDetailsDD] = useState(false);
    const [batchDD, setBatchDD] = useState(false);
    const [batchEntryDD, setBatchEntryDD] = useState(false);
    const [showLink, setShowLink] = useState(true);
    const [logo, setLogo] = useState([]);
    const [organisationName, setOrganisationName] = useState("Acecom Solutions");
    const [logoPreview, setLogoPreview] = useState(acecomLogo);

    // useEffect(() => {
    //     axios
    //     .get("/api/utility/get-logo")
    //     .then(function (response) {
    //         // console.log(response?.data);
    //         if(response?.data?.logo !== undefined && response?.data?.logo !== null) {
    //             const previewURL = "data:image/jpeg;base64," + response?.data?.logo;
    //             const docFile = dataURLtoFile(previewURL, "logo.png", {type: "image/png"});
    //             fileHandler(docFile);
    //         }
    //         else {
    //             setLogoPreview(acecomLogo);
    //         }
    //         if(response?.data?.organisation_name) {
    //             setOrganisationName(response?.data?.organisation_name)
    //         }
    //         else {
    //             setOrganisationName("Acecom Solutions");
    //         }
    //     })
    //     .catch(function (error) {
    //         setAlert({msg: `Error: ${error?.response?.data?.detail}`, type: "error"});
    //     });
    // }, [auth]);
    
    // const fileHandler = (file) => {
    //     if(file !== undefined) {
    //         setLogo([file]);
    //         setLogoPreview(URL.createObjectURL(file));
    //     }
    // }
    
    return (
        <Nav sidebarToggle={sidebarToggle}>
            <Nav.Header>
                <Nav.Logo id="logoPreview" src={logoPreview} />
                <Nav.Title>{organisationName}</Nav.Title>
            </Nav.Header>
            <Nav.Line />
            <Nav.LinkContainer>
                <RoleView adminOnly>
                    <Nav.Link>
                        <Nav.LinkText to="/company">
                            Company
                        </Nav.LinkText>
                    </Nav.Link>
                    <Nav.Link>
                        <Nav.LinkText to="/branch">
                            Branch
                        </Nav.LinkText>
                    </Nav.Link>
                    <Nav.Link>
                        <Nav.LinkText to="/plant">
                            Plant
                        </Nav.LinkText>
                    </Nav.Link>
                    <Nav.Link>
                        <Nav.LinkText to="/location">
                            Location
                        </Nav.LinkText>
                    </Nav.Link>
                </RoleView>
                <RoleView allowedRoles={["Production Manager", "Production Executive"]}>
                    <Nav.Link>
                        <Nav.LinkText to="/stock">
                            Stock
                        </Nav.LinkText>
                    </Nav.Link>
                    <Nav.Link>
                        <Nav.LinkText to="/bom">
                            Bill of Material
                        </Nav.LinkText>
                    </Nav.Link>
                    <Nav.Link>
                        <Nav.LinkText onClick={() => setBomDetailsDD((bomDetailsDD) => !bomDetailsDD)}>
                            BoM Details
                            <Nav.Icon>
                                {(bomDetailsDD) ? <FiChevronUp /> : <FiChevronDown />}
                            </Nav.Icon>
                        </Nav.LinkText>
                        <Nav.Dropdown dropdown={bomDetailsDD}>
                            <Nav.DropdownItem to="/bom/stock-details">Stock Details</Nav.DropdownItem>
                            <Nav.DropdownItem to="/bom/overhead-details">Overhead Details</Nav.DropdownItem>
                        </Nav.Dropdown>
                    </Nav.Link>
                    <Nav.Link>
                        <Nav.LinkText onClick={() => setBatchDD((batchDD) => !batchDD)}>
                            Batch
                            <Nav.Icon>
                                {(batchDD) ? <FiChevronUp /> : <FiChevronDown />}
                            </Nav.Icon>
                        </Nav.LinkText>
                        <Nav.Dropdown dropdown={batchDD}>
                            <Nav.DropdownItem to="/batch/start">Start</Nav.DropdownItem>
                            <Nav.DropdownItem to="/batch/view">View</Nav.DropdownItem>
                            <Nav.DropdownItem to="/batch/end">End</Nav.DropdownItem>
                        </Nav.Dropdown>
                    </Nav.Link>
                    <Nav.Link>
                        <Nav.LinkText onClick={() => setBatchEntryDD((batchEntryDD) => !batchEntryDD)}>
                            Batch entry
                            <Nav.Icon>
                                {(batchEntryDD) ? <FiChevronUp /> : <FiChevronDown />}
                            </Nav.Icon>
                        </Nav.LinkText>
                        <Nav.Dropdown dropdown={batchEntryDD}>
                            <Nav.DropdownItem to="/batch/stock">Stock</Nav.DropdownItem>
                            <Nav.DropdownItem to="/batch/overhead">Overhead</Nav.DropdownItem>
                        </Nav.Dropdown>
                    </Nav.Link>
                </RoleView>
                <RoleView allowedRoles={["Purchase Manager", "Purchase Executive"]}>
                    <Nav.Link>
                        <Nav.LinkText to="/standard-cost">
                            Standard Cost
                        </Nav.LinkText>
                    </Nav.Link>
                    <Nav.Link>
                        <Nav.LinkText to="/actual-cost">
                            Actual Cost
                        </Nav.LinkText>
                    </Nav.Link>
                </RoleView>
                <RoleView allowedRoles={["Production Executive"]}>
                    <Nav.Link>
                        <Nav.LinkText to="/reports">
                            Reports
                        </Nav.LinkText>
                    </Nav.Link>
                {/* </RoleView>
                <RoleView adminOnly> */}
                    <Nav.Link>
                        <Nav.LinkText to="/admin-reports">
                            Overall Reports
                        </Nav.LinkText>
                    </Nav.Link>
                </RoleView>
            </Nav.LinkContainer>
        </Nav>
    );
}