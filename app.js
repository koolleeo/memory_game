// set base URL
const pokeAPIbaseURL = `https://pokeapi.co/api/v2/pokemon/`;

const loadPokemon = async () => {

    // create new SET to hold random ids
    const randomIds = new Set();

    // create loop to generate random IDs and add them to the SET
    while(randomIds.size < 8){

        // generate a random number between 1 and 150
        const randomNumber = Math.ceil(Math.random() * 150);

        // add number to SET
        randomIds.add(randomNumber);

    }

    // map baseURL and random IDs to an array of promises
    const pokePromises = [...randomIds].map(id => fetch(`${pokeAPIbaseURL}${id}`));
    
    console.log(pokePromises);

}

loadPokemon();