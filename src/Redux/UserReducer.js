import { combineReducers } from 'redux';
import { UPDATE_USER } from './types';

const INITIAL_STATE = {
  userid:1,
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case UPDATE_USER:
           
          const {userid} = state;
          const newState = action.payload;
      
          return newState;

      default:
        return state.userid
    }
};
  
export default combineReducers({
  UserId: userReducer
});