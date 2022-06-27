import axios from "axios";

export const api = axios.create({
    // baseURL: 'http://localhost:3001',
    baseURL: 'https://offigator-app.herokuapp.com:3001',
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
});