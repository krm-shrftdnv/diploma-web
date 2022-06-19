import { useEffect, useState } from "react";

export const useCamera = () => {
    const [videoDem, handleVideoDem] = useState({
        w: 0,
        h: 0,
    });
    const [cameraFacingMode, handleCameraFacingMode] =
    useState("environment");
    const [imageData, handleImageData] = useState("");
    let video;
    let canvas;

    useEffect(() => {
        try {
            //find video and canvas elements by tagNames
            video = document.getElementsByTagName("video")[0];
            canvas = document.getElementsByTagName("canvas")[0];
            let constraint = {
                video: {
                    width: { ideal: 4096 },
                    height: { ideal: 2160 },
                    facingMode: cameraFacingMode,
                },
                audio: false,
            };
            navigator.mediaDevices
                .getUserMedia(constraint)
                .then((stream) => {
                    video.setAttribute("playsinline", "true");
                    video.srcObject = stream;
                    video.onloadedmetadata = () => {
                        //get position of video tag;
                        let { clientLeft, clientTop, clientWidth, clientHeight } =
                            video;
                        handleVideoDem({ w: clientWidth, h: clientHeight });
                        //align canvas position with video position
                        canvas.style.position = "absolute";
                        canvas.style.left = clientLeft.toString();
                        canvas.style.top = clientTop.toString();
                        canvas.setAttribute("width", clientWidth.toString());
                        canvas.setAttribute("height", clientHeight.toString());
                        video.play();
                    };
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (e) {
            console.log(e);
        }
    }, [cameraFacingMode]);

    const switchCameraFacingMode = () => {
        handleCameraFacingMode((old) =>
            old === "environment" ? "user" : "environment"
        );
    };

    const captureImage = async () => {
        //take photo
        try {
            let video =
                document.getElementsByTagName("video")[0];
            let canvas =
                document.getElementsByTagName("canvas")[0];
            let context = canvas.getContext("2d");
            context?.drawImage(video, 0, 0, videoDem.w, videoDem.h);
            let imageData1 = canvas.toDataURL("image/png", 1.0);
            handleImageData(imageData1);
            return imageData1;
        } catch (e) {
            console.log(e);
            alert("Error in Capturing Image: " + e);
            return "";
        }
    };

    return {
        cameraFacingMode,
        switchCameraFacingMode,
        imageData,
        captureImage,
    };
};