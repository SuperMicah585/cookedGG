export async function userValidation(name,tag,region){
    try {
    const response = await fetch(
      `http://localhost:3000/api/player/${name}/${tag}/${region}`
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



export async function getMatchData(puiid, region){
    try {
        const response = await fetch(
      `http://localhost:3000/api/getmatches/forplayer/${puiid}/inregion/${region}`
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


export async function getUserMetaData(puuid, region){
    try {
        const response = await fetch(
      `http://localhost:3000/api/getMetaDataFor/${puuid}/inregion/${region}`
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