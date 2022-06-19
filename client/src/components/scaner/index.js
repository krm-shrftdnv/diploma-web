import React, {useState} from "react";
import "./index.scss";
import {useCamera} from "./hook/camera";

export const ScannerPage = () => {
    const [file, setFile] = useState();
    const {captureImage, imageData} = useCamera();

    const takePhoto = () => {
        captureImage();
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
            {!file ? (
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
            ) : (
                <>
                    <h5>Пожалуйста, подождите.<br/> Результат загружается</h5>
                    <img src={imageData} className="imageOnLoad img-fluid" />
                </>
            )}
        </div>
    )
}