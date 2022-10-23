import axios from 'axios';

// Base Url

const baseUrl: string = '/api';

// Error Message Handler

export function httpErrMsg(res: any) {
    return res.message.response.data.message
}

// GET Request

export async function httpGet(route: string): Promise<any> {
    try {
        const res: any = await axios.get(baseUrl + route);
        return res
    } catch(err: any) {
        return { message: err }
    }
}

// POST Request

export async function httpPost(route: string, body: Object): Promise<any> {
    try {
        const res: any = await axios.post(baseUrl + route, body);
        return res
    } catch(err: any) {
        return { message: err }
    }
}

// PUT Request

export async function httpPut(route: string, body: Object): Promise<any> {
    try {
        const res: any = await axios.put(baseUrl + route, body);
        return res
    } catch(err: any) {
        return { message: err }
    }
}

// DELETE Request

export async function httpDelete(route: string, body: Object): Promise<any> {
    try {
        const res: any = await axios.delete(baseUrl + route, body);
        return res
    } catch(err: any) {
        return { message: err }
    }
}