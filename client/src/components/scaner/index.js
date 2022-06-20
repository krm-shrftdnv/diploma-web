import React, {useEffect, useState} from "react";
import "./index.scss";
import {useCamera} from "./hook/camera";

export const ScannerPage = () => {
    const [file, setFile] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const {captureImage, imageData} = useCamera();

    useEffect(() => {
        if (file) {
            setIsLoading(true);
            setInterval(() => setIsLoading(false), 10000);

        }
    }, [file]);

    const takePhoto = () => {
        captureImage();
        // setFile(imageData);
        fetch(imageData)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], "File name", {
                    type: "image/png",
                });
                setFile(file);
            });
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
            {(!!file && !isLoading) && (
                <div className="result">
                    <h5>
                        КФУ, ИТИС, 15 этаж
                    </h5>
                    <img src="/itis15map-result.png" className="map img-fluid"/>
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