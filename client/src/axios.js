import axios from "axios";

export const api = axios.create({
    // baseURL: 'http://localhost:3001',
    baseURL: 'https://offigator-app.herokuapp.com' +
        '',
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
});