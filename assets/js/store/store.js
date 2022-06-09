const { createStore } = Vue;
export default () => {
    return createStore({
        state() {
            return {
                count: 0
            }
        },
        mutations: {
            increment (state) {
                state.count++;
            }
        }
    })
}