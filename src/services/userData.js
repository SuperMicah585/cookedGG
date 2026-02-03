const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log(baseURL)
export async function userValidation(name,tag,region){
    try {
    const response = await fetch(
      `${baseURL}/api/player/${name}/${tag}/${region}`
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetch failed:', error.message);
    throw error; 
  }


}



export async function getMatchData(puiid, region, limit = 10){
    try {
        const params = new URLSearchParams();
        if (limit != null) params.set('limit', String(limit));
        const query = params.toString();
        const url = `${baseURL}/api/getmatches/forplayer/${puiid}/inregion/${region}${query ? `?${query}` : ''}`;
        const response = await fetch(url);
      
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetch failed:', error.message);
    throw error; 
  }


}


export async function getUserMetaData(puuid, region){
    try {
        const response = await fetch(
      `${baseURL}/api/getMetaDataFor/${puuid}/inregion/${region}`
    );
      
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetch failed:', error.message);
    throw error; 
  }
}
export async function getUsers(quantity){

    try {
        const response = await fetch(
      `${baseURL}/api/getusers/top/${quantity}`
    );
      
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetch failed:', error.message);
    throw error; 
  }

}


export async function getUserPosition(puuid){

    try {
        const response = await fetch(
      `${baseURL}/api/users/${puuid}/rank`
    );
      
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetch failed:', error.message);
    throw error; 
  }

}


export async function updateUser(userData) {
  try {
    const response = await fetch(`${baseURL}/api/updateUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user');
    }

    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}


