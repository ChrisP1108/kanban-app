import axios from 'axios';

// Base Url

const baseUrl: string = '/api';

// HTTP Error Handling

export function httpErrMsg(res: any): any {
    if (res && res.message && res.message.response 
        && res.message.response.data && res.message.response.data.message) {
        return res.message.response.data.message
    }
    if (res.message) {
        return res.message
    } else return null
}

// Error Status Code Handler

export function httpStatusCode(res: any): any {
    if (res && res.message && res.message.response && res.message.response.status) {
        return res.message.response.status
    } else return null
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