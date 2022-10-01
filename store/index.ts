// State Interface

export interface State {
    darkModeToggled: boolean
}

// State Declarations

export const state = () => ({
    darkModeToggled: true
});

// State Mutations

export const mutations = {
    toggleDarkMode(state: State): void {
        state.darkModeToggled = !state.darkModeToggled
    }
}