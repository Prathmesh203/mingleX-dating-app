import React from 'react'
import UseUserContext from './UseUserContext'
import { updateProfileName } from '../services/profileServices';


export async function updateName(firstname, lastname) {
  const {setUser} = UseUserContext();

  try {
    const data = await updateProfileName(firstname,lastname);
    if (data) {
      setUser(data);
    }
    return ("Name updated successfully");
  } catch (error) {
    return error.message
  }
}

async function updateInformation(){

}

export default updateName