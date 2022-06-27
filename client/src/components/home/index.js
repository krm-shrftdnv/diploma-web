import React, {useEffect, useState} from "react";
import "./index.scss";
import {Link} from "react-router-dom";
import {api} from "../../axios";

export default function HomePage() {
    const [searchItems, setSearchItems] = useState([{map_id: 0, map_name: ""}]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        api.get("/api/maps").then(res => {
            setSearchItems(res.data);
        });
    }, []);

    useEffect(() => {
        setSearchItems(searchItems.filter(item => item.map_name.includes(searchValue)));
    }, [searchValue]);

    return (
        <div className="homePage">
            <h6>
                Поиск помещения
            </h6>
            <div className="search dropdown-center input-group mb-3" id="searchList" data-bs-toggle="dropdown" aria-expanded="false">
                <input type="text" className="form-control" placeholder="Введите название помещения"
                       aria-label="Recipient's username" aria-describedby="button-addon2"
                       onChange={(value) => setSearchValue(value.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" id="button-addon2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-search" viewBox="0 0 16 16">
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </button>

                <ul className="dropdown-menu" aria-labelledby="searchList">
                    {searchItems.map((item, index) => {
                        return (
                            <li key={index} onClick={event =>  window.location.href=`/map/${item.map_id}`}>
                                <Link className="dropdown-item" to={`/map/${item.map_id}`}>
                                    {item.map_name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

        </div>
    )
}