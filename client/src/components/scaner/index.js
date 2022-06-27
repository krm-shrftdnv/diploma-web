import React, {useEffect, useState} from "react";
import "./index.scss";
import {useCamera} from "./hook/camera";
import {api} from "../../axios";
import {useParams} from "react-router-dom";

export const ScannerPage = () => {
    const [file, setFile] = useState();
    const [locationImage, setLocationImage] = useState();
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {captureImage, imageData} = useCamera();
    const params = useParams();

    useEffect(() => {
        if (file) {
            setIsLoading(true);
            setIsError(false);
            api.post(`/api/recognize`, {
                map_id: params.mapId,
                image: file
            }).then(res => {
                getLocationImage(res.data.image_id);
            });
        }
    }, [file]);

    const getLocationImage = (id) => {
        api.get('/api/get_info', {
            params: {
                image_id: id
            }
        }).then((res) => {
            if (res.data.status === "ready") {
                setLocationImage(res.data.location_image);
                setIsLoading(false);
            } else if (res.data.status === "processing") {
                setInterval(() => getLocationImage(id), 5000);
            } else {
                setIsLoading(false);
                setIsError(true);
            }
        });
    }

    const takePhoto = () => {
        captureImage();
        setFile(imageData);
        // fetch(imageData)
        //     .then((res) => res.blob())
        //     .then((blob) => {
        //         const file = new File([blob], "File name", {
        //             type: "image/png",
        //         });
        //         setFile(file);
        //     });
    };

    return (
        <div className="scannerPage">
            {!file && (
                <>
                    <h5>Наведите камеру на объект и сделайте фото</h5>
                    <div
                        className="cameraComponent"
                        onClickCapture={() => takePhoto()}
                    >
                        <div className="cameraContainer">
                            <video width={window.innerWidth}/>
                            <canvas/>
                        </div>
                    </div>
                </>
            )}
            {(!!file && isLoading) && (
                <>
                    <h5>Пожалуйста, подождите.<br/> Результат загружается</h5>
                    <div style={{position: "relative"}}>
                        <img src={imageData} className="imageOnLoad img-fluid"/>
                        <div className="loader spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </>
            )}
            {(!!file && !isLoading && locationImage && !isError) && (
                <div className="result">
                    <h5>

                    </h5>
                    <img src={locationImage} className="map img-fluid"/>
                    <button
                        className=" btn btn-primary me-md-2"
                        type="button"
                        onClick={() => window.location.href = "/scan"}
                    >
                        Сканировать объект
                    </button>
                </div>
            )}
            {isError && (
                <div className="result">
                    <h5>Что-то пошло не так. Попробуйте снова</h5>
                    <button
                        className=" btn btn-primary me-md-2"
                        type="button"
                        onClick={() => window.location.href = "/scan"}
                    >
                        Сканировать объект
                    </button>
                </div>
            )}
        </div>
    )
}