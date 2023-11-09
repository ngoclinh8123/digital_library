import * as React from "react";
import { Outlet, Navigate } from "react-router-dom";
import StorageUtil from "service/helper/storage_util";

export default function PrivateRoute() {
    return StorageUtil.getToken() ? <Outlet /> : <Navigate to="/login" />;
}

PrivateRoute.displayName = "PrivateRoute";
