

  export const  getApiData = async ( page,tipo, character = '' ) =>{
    try{
        const api = `https://rickandmortyapi.com/api/${tipo}?page=${page}&${character}`;
        const res = await fetch(api);
        const { results, info } = await res.json();
        if( tipo === 'character' ){
            const characters = results.map(({ id, name, status, image, gender, origin, species }) => ({
                id,
                name,
                status,
                image,
                gender,
                origin: origin.name,
                species,
                img: species === 'Human'
                  ? 'https://p4.wallpaperbetter.com/wallpaper/140/900/941/rick-and-morty-adult-swim-cartoon-morty-smith-wallpaper-preview.jpg'
                  : 'https://okdiario.com/img/2023/02/19/ovni-655x368.jpg',
              }));
            
            
            return {characters, info};
        }else{
            const characters = results.map( ({ id, name, episode, air_date }) => ({
                id,
                name,
                episode,
                air_date
            } ) )
            return {
                characters,
                info
            }
        }
        
    
    }catch(error){
        console.log(error);
        return { characters: [], info:{ count:1, next:null, pages:1,prev:null } };
    }

}
