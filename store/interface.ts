import { ObjectId } from "mongoose";

export interface State {
    darkModeToggled: boolean;
    sidebarToggled: boolean;
    modals: {
        mobileBoards: {
            toggled: boolean
        };
        addTask: {
            toggled: boolean
        };
        editTask: {
            toggled: boolean;
            taskSelected: string
        };
        addBoard: {
            toggled: boolean
        };
        editBoard: {
            toggled: boolean
        };
        deleteTask: {
            toggled: boolean
        };
        deleteBoard: {
            toggled: boolean
        };
        deleteUser: {
            toggled: boolean
        };
    },
    boardSelected: string,
    userData: {
        boards: Array<any>,
        user: Object
    }
    loginRedirect: boolean;
}

export interface Board {
    name: String,
    columns: Array<string>,
    id: ObjectId,
    tasks: []
}