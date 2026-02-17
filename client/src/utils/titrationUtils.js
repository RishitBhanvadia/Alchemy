import { INITIAL_STATE } from "./titrationConstants";

export const calculateColor = (count) => {
    // Logic to change color based on count (titration endpoint)
    if (count > 50) return "#ff00ff"; // Phenolphthalein pink
    return "#transparent";
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "INCREMENT_COUNT":
            // Calculate new height path based on count
            // This is a placeholder logic as the actual SVG path math is complex
            // We just ensure count goes up
            return {
                ...state,
                count: state.count + 1,
                color: calculateColor(state.count + 1)
            };
        case "SET_SPEED":
            return {
                ...state,
                speed: action.payload
            };
        case "TOGGLE_VALVE":
            return {
                ...state,
                sk: !state.sk
            };
        case "RESET":
            return INITIAL_STATE;
        default:
            return state;
    }
};
