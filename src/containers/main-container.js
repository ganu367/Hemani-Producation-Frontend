import React from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components/macro";
import {HomePage,
        HeaderContainer,
        FooterContainer,
        DisplayContainer,
        Signin,
        CompanyContainer,
        ViewCompanyContainer,
        UpdateCompanyContainer,
        BranchContainer,
        ViewBranchContainer,
        UpdateBranchContainer,
        PlantContainer,
        ViewPlantContainer,
        UpdatePlantContainer,
        LocationContainer,
        ViewLocationContainer,
        UpdateLocationContainer,
        StockContainer,
        ViewStockContainer,
        UpdateStockContainer,
        StandardCostContainer,
        ViewStandardCostContainer,
        UpdateStandardCostContainer,
        ActualCostContainer,
        ViewActualCostContainer,
        UpdateActualCostContainer,
        BomContainer,
        ViewBomContainer,
        UpdateBomContainer,
        BomStockDetailsContainer,
        BomOhDetailsContainer,
        BatchContainer,
        ViewAllBatchContainer,
        ViewBatchContainer,
        UpdateBatchContainer,
        CloseBatchContainer,
        BatchStockDetailsContainer,
        ViewBatchStockDetailsContainer,
        UpdateBatchStockDetailsModal,
        BatchOhDetailsContainer,
        ViewBatchOhDetailsContainer,
        UpdateBatchOhDetailsModal,
        ReportContainer,
        AdminReportContainer} from "../containers";
import {PersistSignin,
        ProtectedRoutes,
        RedirectRoutes,
        RedirectisAdmin,
        RedirectisNotAdmin,
        ProtectedRoleRoutes} from "../helpers";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export default function MainContainer({children}) {
    const {state} = useLocation();

    return (
        <Container>
            <HeaderContainer />
            <DisplayContainer>
                <Routes>
                    <Route element={<RedirectRoutes />}>
                        <Route exact path="/signin" element={<Signin />} />
                    </Route>
                    <Route element={<PersistSignin />}>
                        <Route element={<ProtectedRoutes />}>
                        <Route exact path="/" element={<HomePage />} />
                            <Route element={<ProtectedRoleRoutes adminOnly />}>
                                <Route exact path="/company" element={<CompanyContainer />} />
                                <Route exact path="/company/:id/view" element={<ViewCompanyContainer />} />
                                <Route exact path="/company/:id/update" element={<UpdateCompanyContainer />} />
                                <Route exact path="/branch" element={<BranchContainer />} />
                                <Route exact path="/branch/:id/view" element={<ViewBranchContainer />} />
                                <Route exact path="/branch/:id/update" element={<UpdateBranchContainer />} />
                                <Route exact path="/plant" element={<PlantContainer />} />
                                <Route exact path="/plant/:id/view" element={<ViewPlantContainer />} />
                                <Route exact path="/plant/:id/update" element={<UpdatePlantContainer />} />
                                <Route exact path="/location" element={<LocationContainer />} />
                                <Route exact path="/location/:id/view" element={<ViewLocationContainer />} />
                                <Route exact path="/location/:id/update" element={<UpdateLocationContainer />} />
                            </Route>
                            <Route element={<ProtectedRoleRoutes allowedRoles={["Production Manager", "Production Executive"]} />}>
                                <Route exact path="/stock" element={<StockContainer />} />
                                <Route exact path="/stock/:id/view" element={<ViewStockContainer />} />
                                <Route exact path="/stock/:id/update" element={<UpdateStockContainer />} />
                                <Route exact path="/bom" element={<BomContainer />} />
                                <Route exact path="/bom/:id/view" element={<ViewBomContainer />} />
                                <Route exact path="/bom/:id/update" element={<UpdateBomContainer />} />
                                <Route exact path="/bom/stock-details" element={<BomStockDetailsContainer />} />
                                <Route exact path="/bom/overhead-details" element={<BomOhDetailsContainer />} />
                                <Route exact path="/batch/start" element={<BatchContainer />} />
                                <Route exact path="/batch/view" element={<ViewAllBatchContainer />} />
                                <Route exact path="/batch/:id/view" element={<ViewBatchContainer />} />
                                <Route exact path="/batch/:id/update" element={<UpdateBatchContainer />} />
                                <Route exact path="/batch/end" element={<CloseBatchContainer />} />
                                <Route exact path="/batch/stock" element={<BatchStockDetailsContainer />} />
                                <Route exact path="/batch/stock/:id/view" element={<ViewBatchStockDetailsContainer />} />
                                <Route exact path="/batch/stock/:id/update" element={<UpdateBatchStockDetailsModal />} />
                                <Route exact path="/batch/overhead" element={<BatchOhDetailsContainer />} />
                                <Route exact path="/batch/overhead/:id/view" element={<ViewBatchOhDetailsContainer />} />
                                <Route exact path="/batch/overhead/:id/update" element={<UpdateBatchOhDetailsModal />} />
                            </Route>
                            <Route element={<ProtectedRoleRoutes allowedRoles={["Purchase Manager", "Purchase Executive"]} />}>
                                <Route exact path="/standard-cost" element={<StandardCostContainer />} />
                                <Route exact path="/standard-cost/:id/view" element={<ViewStandardCostContainer />} />
                                <Route exact path="/standard-cost/:id/update" element={<UpdateStandardCostContainer />} />
                                <Route exact path="/actual-cost" element={<ActualCostContainer />} />
                                <Route exact path="/actual-cost/:id/view" element={<ViewActualCostContainer />} />
                                <Route exact path="/actual-cost/:id/update" element={<UpdateActualCostContainer />} />
                            </Route>
                            <Route exact path="/admin-reports" element={<AdminReportContainer />} />
                            <Route exact path="/reports" element={<ReportContainer />} />
                        </Route>
                    </Route>
                </Routes>
            </DisplayContainer>
            <FooterContainer />
        </Container>
    );
}