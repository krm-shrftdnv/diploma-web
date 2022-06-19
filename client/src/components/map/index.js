import React from "react";
import "./index.scss";
import {useParams} from "react-router-dom";

export const MapPage = ({ mapName }) => {
    // const params = useParams();

    const handleOnClick = () => {

    }

    return (
        <div className="mapPage">
            <h5>
                {/*{params.mapName || ''}*/}
                КФУ, ИТИС, 15 этаж
            </h5>
            <img src="/itis15map.png" className="map img-fluid" />
            <button
                className=" btn btn-primary me-md-2"
                type="button"
                onClick={() => window.location.href = "/scan"}
            >
                Сканировать объект
            </button>
        </div>
    )
}