// set base URL
const pokeAPIbaseURL = `https://pokeapi.co/api/v2/pokemon/`;

// define variable for game element
const game = document.getElementById('game');

// define variable for game paused - default to false
let isPaused = false;

// define variable to track first picked card to validate match against
let firstPick;


// add a color mapping object
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    pyschic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
}

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
    
    // await responses using promise ALL
    const responses = await Promise.all(pokePromises);

    // return responses as JSON
    return await Promise.all(responses.map(response => response.json()));

}


// create a function to reset game
const resetGame = async () => {

    // use loadPokemon function to return 8 random pokemon
    const pokemon = await loadPokemon();

    // call displayPokemon function - need 2 randomised arrays (to match one against the other).
    displayPokemon([...pokemon, ...pokemon])

}

// create a funtion to display the pokemon card
const displayPokemon = (pokemon) => {

// randomise pokemon
pokemon.sort( _ => Math.random() - 0.5);

// map pokemon to a card and HTML template
const pokemonHTML = pokemon.map(pokemon => {

    // capture type of pokemon and define as variable
    const type = pokemon.types[0]?.type?.name || 'normal';

    // map color to pokemon based on type
    const color = colors[type];

    return `
            <div class="card" style="background-color:${color}" onclick="clickCard(event)" data-pokename="${pokemon.name}">
                <div class="front">
                </div>
                <div class="back rotated" style="background-color:${color}">
                    <h2>${pokemon.name}</h2>
                    <img src="${pokemon.sprites.front_default}" alt=${pokemon.name}>
                </div>
            </div>    
            `
}).join('');

// display HTML on page
game.innerHTML = pokemonHTML;

}

const clickCard = (event) => {

    // console.log(event.currentTarget.dataset.pokename);

    // use event.currentTarget to capture card click, rather than just front card (if using event.target)
    const pokemonCard = event.currentTarget;

    const [front, back] = getFrontAndBackFromCard(pokemonCard);
    
    // add logic to prevent rotation if already flipped
    if(front.classList.contains('rotated') || isPaused) return;
    
    // game in flight
    isPaused = true;

    // toogle 'rotated' class when card clicked
    front.classList.toggle('rotated');
    back.classList.toggle('rotated');

    // add game logic
    if(!firstPick){

        firstPick = pokemonCard;
        isPaused = false;

    } else {

        const secondPokemonName = pokemonCard.dataset.pokename;
        const firstPokemonName = firstPick.dataset.pokename;

        if(firstPokemonName != secondPokemonName){

            const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);

        }
    }
}

// create function to rotate elements if no match found
const rotateElements = (elements) => {

    if(typeof elements != 'object' || !elements.length) return;

    elements.forEach(element => element.classList.toggle('rotated'));

}

// create function to capture front and back of card and return as [front, back] array
const getFrontAndBackFromCard = (card) => {

    const front = card.querySelector(".front");

    const back = card.querySelector(".back");
    
    return [front , back]

}

resetGame();