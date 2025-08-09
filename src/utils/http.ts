import config from '@/constants/config';
import axios, { type AxiosInstance } from 'axios';

export class Http {
    instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: config.baseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

const http = new Http().instance;

export default http;
