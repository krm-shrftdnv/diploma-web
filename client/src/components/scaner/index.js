import React, {useState} from "react";
import "./index.scss";
import {useCamera} from "./hook/camera";

export const ScannerPage = () => {
    const [file, setFile] = useState();
    const { captureImage, imageData } = useCamera();

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
            <div
                className="cameraComponent"
                onClickCapture={() => takePhoto()}
            >
                <div className="cameraContainer">
                    <video width={window.innerWidth} />
                    <canvas />
                </div>
            </div>
        </div>
    )
}