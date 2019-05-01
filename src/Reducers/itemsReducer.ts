import { Item } from "../Api/Item";
import { Action, SET_ITEMS, SELECT_ITEMS, DESELECT_ITEM, FILTER_ITEMS, RESET_FILTER, TOGGLE_SELECTED_ITEM } from "../Actions/actionTypes";

interface ItemsState {
    inCurFolder: Item[];
    filter: string;
    selected: Item[];
}

const initialItemsState: ItemsState = {
    inCurFolder: [],
    filter: '',
    selected: [],
};

export const items = (state = initialItemsState, action: Action<any>): ItemsState => {
    switch(action.type) {
        case SET_ITEMS:
            return { ...state, inCurFolder: action.value as Item[] };
        case SELECT_ITEMS:
            return { ...state, selected: action.value as Item[] };
        case DESELECT_ITEM:
            return { ...state, selected: removeItem(state.selected, action.value as Item) };
        case TOGGLE_SELECTED_ITEM:
            return { 
                ...state,
                selected: state.selected.includes(action.value) ?
                    removeItem(state.selected, action.value as Item)
                    : addItem(state.selected, action.value as Item)
            };
        case FILTER_ITEMS:
            return { ...state, filter: action.value as string };
        case RESET_FILTER:
            return { ...state, filter: '' };
        default:
            return state;
    }
};

const removeItem = (items: Item[], item: Item) => {
    return items.filter(selectedItem => !selectedItem.equals(item));
}

const addItem = (items: Item[], item: Item) => {
    return [...items, item];
}