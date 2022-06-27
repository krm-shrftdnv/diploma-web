import React, {useEffect, useState} from "react";
import "./index.scss";
import {useParams} from "react-router-dom";
import {api} from "../../axios";

export const MapPage = () => {
    const [map, setMap] = useState({map_id: 0, map_name: "", image: ""});
    const params = useParams();

    useEffect(() => {
        api.get(`/api/map/${params.mapId}`).then(res => {
            setMap(res.data);
        });
    }, []);

    return (
        <div className="mapPage">
            <h5>
                {map.map_name}
            </h5>
            {!map.image ? (
                <p className="placeholder-glow skeleton">
                    <span className="placeholder col-12 bg-success"></span>
                    <span className="placeholder col-12 bg-success"></span>
                </p>
            ) : (
                <img src={`data:image/png;base64, ${map.image}`} className="map img-fluid" />
            )}
            <button
                className=" btn btn-primary me-md-2"
                type="button"
                onClick={() => window.location.href = `/scan/${params.mapId}`}
            >
                Сканировать объект
            </button>
        </div>
    )
}