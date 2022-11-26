// Usernames designated as demo accounts

export const testAccountUser: any = { username: process.env.demoUsername, password: process.env.demoPassword };

// Demo Delay

const minDelay: number = 250;
const offSetMaxDelay: number = 300;

export function demoDelay(): Promise<any> {
    return new Promise(res => setTimeout(res, minDelay + Math.floor(Math.random() * offSetMaxDelay)))
}

// Determines If account is a demo based upon username

export function isDemo(username: string): Boolean {
    if (testAccountUser.username.toLowerCase() === username.toLowerCase()) {
        return true
    } else return false
}

// Generates ID since Demo accounts Create, Update, And Delete From Local Storage To Not Alter Original Data On Server

export function demoIdGen(): String {
    return `DEMO-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`
}