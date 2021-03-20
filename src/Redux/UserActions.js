
import { UPDATE_USER } from './types';


export const updateUser = (userId) => (
    {
      type: UPDATE_USER,
      payload: userId,
    }
);