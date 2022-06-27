import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import HomePage from "./home";
import {MapPage} from "./map";
import {ScannerPage} from "./scaner";

export const Routing = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map/:mapId" element={<MapPage />} />
                <Route path="/scan/:mapId" element={<ScannerPage />} />
            </Routes>
        </BrowserRouter>
    );
};