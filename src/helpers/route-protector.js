import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";

export default function ProtectedRoutes({userType}) {
    const location = useLocation();
    const {auth} = useAuth();

    return (
        (auth?.accessToken) ? <Outlet /> : <Navigate to={`/signin`} state={{ from: location }} replace />
    );
}

export function RedirectRoutes({userType}) {
    const location = useLocation();
    const {auth} = useAuth();

    return (
        !(auth?.accessToken) ? <Outlet /> : <Navigate to={`/company`} state={{ from: location }} replace />
    );
}

export function RedirectisAdmin() {
    const location = useLocation();
    const {JWT} = useAuth();

    return (
        !(JWT?.user?.isAdmin) && !(JWT?.user?.companyID) ? <Outlet /> : <Navigate to="/company" state={{ from: location }} replace />
    );
}

export function RedirectisNotAdmin() {
    const location = useLocation();
    const {JWT} = useAuth();

    return (
        (JWT?.user?.isAdmin) || (JWT?.user?.companyID) ? <Outlet /> : <Navigate to="/stock" state={{ from: location }} replace />
    );
}

export function ProtectedRoleRoutes({allowedRoles, adminOnly}) {
    const location = useLocation();
    const {JWT} = useAuth();

    return (
        ((adminOnly) && (JWT?.user?.isAdmin)) ?
            <Outlet />
            :
            ((allowedRoles?.includes(JWT?.user?.role)) && !(JWT?.user?.isAdmin)) ? 
                <Outlet />
                : 
                <Navigate to="/" state={{ from: location }} replace />
    );
}