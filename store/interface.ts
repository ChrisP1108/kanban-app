import { ObjectId } from "mongoose";

export interface State {
    darkModeToggled: boolean;
    sidebarToggled: boolean;
    taskItemDragging: {
        isDragging: boolean;
        columnName: string;
    };
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
        addColumn: {
            toggled: boolean
        };
        editBoard: {
            toggled: boolean
        };
        deleteTask: {
            toggled: boolean
        };
        viewTask: {
            toggled: boolean
        };
        deleteBoard: {
            toggled: boolean
        };
        deleteUser: {
            toggled: boolean
        };
        userMenu: {
            toggled: boolean
        };
        error: {
            toggled: boolean
        }
    },
    boardSelected: string,
    taskSelected: string,
    userData: {
        boards: Array<any>,
        user: any
    }
    loginRedirect: boolean;
    modalErrorMessage: string;
}

export interface Board {
    _id: ObjectId,
    name: String,
    columns: Array<string>,
    tasks: []
}

export interface Task {
    _id: ObjectId,
    board: ObjectId
    title: String,
    description: String,
    subtasks: [{
        name: string,
        checked: boolean
    }],
    status: string,
}

export interface TaskItemDragging {
    taskDragging: string;
    isDragging: boolean;
    columnName: string;
}