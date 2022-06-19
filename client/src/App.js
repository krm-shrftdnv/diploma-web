import React, {useEffect, useState} from "react";
import "./App.scss";
import {Routing} from "./components/routing";
import {Navbar} from "./components/navbar";

function App() {
    const [width, setWidth] = useState(window.innerWidth);
    // const [data, setData] = useState(null);
    //
    // useEffect(() => {
    //     fetch("/api")
    //         .then((res) => res.json())
    //         .then((data) => setData(data.message));
    // }, []);

    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    };

    return (
        <div className="App">
            {width < 768 ? (
                <>
                    <Navbar />
                    <Routing />
                </>
            ) : (
                <h2>
                    Этот сайт доступен только на мобильных браузерах!
                </h2>
            )}
        </div>
    );
}

export default App;