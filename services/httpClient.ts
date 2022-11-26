import axios from 'axios';
import { isDemo, demoIdGen, demoDelay } from './demoAccount';

// Base Url

const baseUrl: any = process.env.baseUrl;

// HTTP Error Handling

export function httpErrMsg(res: any): any {
    if (res && res.status && res.status === 200) {
        return 'no errors'
    }
    if (res && res.message && res.message.response 
        && res.message.response.data && res.message.response.data.message) {
        return res.message.response.data.message
    }
    if (res.message) {
        return res.message
    } 
    return 'no message'
}

// Error Status Code Handler

export function httpStatusCode(res: any): any {
    if (res && res.status) {
        return res.status
    }
    if (res && res.message && res.message.response && res.message.response.status) {
        return res.message.response.status
    } 
    return 500
}

// GET Request

export async function httpGet(route: string): Promise<any> {

     // Demo Mode Only

    const localData: any = localStorage.getItem("data");
    const parsedData: any = JSON.parse(localData);
    const demoMode: any = localStorage.getItem("demoMode")
 
    if (parsedData &&  parsedData.user && isDemo(parsedData.user.username) && demoMode === 'true') { 
        await demoDelay();
        return { data: { ...parsedData }, status: 200}

    // Perform Actual HTTP Request If Not In Demo Mode
    
    } else try {
        const res: any = await axios.get(baseUrl + route);
        return res
    } catch(err: any) {
        return { message: err }
    }
}

// POST Request

export async function httpPost(route: string, body: any): Promise<any> {

    // Demo Mode Only

    const localData: any = localStorage.getItem("data");
    let parsedData: any = JSON.parse(localData);

    if (route.includes('/logout')) {
        try {
            const res: any = await axios.post(baseUrl + route, body);
        } catch (err) {
            return { message: err }
        }
        localStorage.removeItem("demoMode")
    }

    if (parsedData && parsedData.user && !route.includes('/login') && isDemo(parsedData.user.username)) {
        await demoDelay();
        if (Object.keys(body).includes('subtasks')) {
            return { 
                data: { 
                    ...body,
                    _id: demoIdGen(), 
                    subtasks: body.subtasks.map((subtask: any) => ({ ...subtask, _id: demoIdGen() }))
                },
                status: 201 
            }
        } else return { data: { ...body, _id: demoIdGen() }, status: 201 }

    // Perform Actual HTTP Request If Not In Demo Mode Or Logging In

    } else try {
        const res: any = await axios.post(baseUrl + route, body);
        return res
    } catch(err: any) {
        return { message: err }
    }
}

// PUT Request

export async function httpPut(route: string, body: any): Promise<any> {

    // Demo Mode Only

    const localData: any = localStorage.getItem("data");
    const parsedData: any = JSON.parse(localData);

    if (parsedData && parsedData.user && isDemo(parsedData.user.username)) {
        await demoDelay();
        if (Object.keys(body).includes('subtasks')) {
            return { 
                data: { 
                    ...body,
                    _id: demoIdGen(), 
                    subtasks: body.subtasks.map((subtask: any) => ({ ...subtask, _id: demoIdGen() }))
                },
                status: 200
            }
        } else return { data: { ...body, _id: demoIdGen() }, status: 200 }

    // Perform Actual HTTP Request If Not In Demo Mode

    } else try {
        const res: any = await axios.put(baseUrl + route, body);
        return res
    } catch(err: any) {
        return { message: err }
    }
}

// DELETE Request

export async function httpDelete(route: string, body: Object): Promise<any> {

    // Demo Mode Only

    const localData: any = localStorage.getItem("data");
    const parsedData: any = JSON.parse(localData);

    if (parsedData && parsedData.user && isDemo(parsedData.user.username)) {
        await demoDelay();
        return { ...body, status: 200 } 

    // Perform Actual HTTP Request If Not In Demo Mode

    } else try {
        const res: any = await axios.delete(baseUrl + route, body);
        return res
    } catch(err: any) {
        return { message: err }
    }
}