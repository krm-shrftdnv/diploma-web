import React from "react";
import "./index.scss";

export const Navbar = () => {
    return (
        <div className={window.location.pathname === "/" ? "navbarComponent home" : "navbarComponent"}>
            <div className="main d-flex">
                <p onClick={event =>  window.location.href=`/`}>Offigator</p>
                {/*<button className=" btn btn-primary me-md-2" type="button">Создать карту</button>*/}
            </div>
            <div className="description">
                <p>Offigator - приложение для навигации внутри помещений.</p>
                <p>Вы можете создать карту помещения  или определить своё местонахождение  в здании.</p>
            </div>
        </div>
    )
}