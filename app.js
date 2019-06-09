// public key: 12343d0e102d5b0f46931faaa61a717c
// privae key: c3121829a15dbfb21724a594e5dd290ebb1066a7

const jumbotron = document.querySelector(".jumbotron");
const lead = document.querySelector(".lead");
const thanosSnap = document.querySelector(".btn");
const charactersContainer = document.querySelector("#characters-container");
const charactersURL = "https://gateway.marvel.com/v1/public/events/29/characters?limit=58&apikey=12343d0e102d5b0f46931faaa61a717c";
const eventURL = "https://gateway.marvel.com:443/v1/public/events/29?apikey=12343d0e102d5b0f46931faaa61a717c";
const hiddenCharacters = {
    1009652: true,
    1009165: true,
    1009726: true,
    1009299: true
};

function getEventData() {
    if (localStorage.eventData) {
        return Promise.resolve(JSON.parse(localStorage.eventData));
    }

    return fetch(eventURL).then((response) => {
        // parse response as JSON
        return response.json();
    }).then((data) => {
        // console.log(data);
        localStorage.eventData = JSON.stringify(data);
        return data;
    });
}

function getCharacterData() {
    if (localStorage.characterData) {
        return Promise.resolve(JSON.parse(localStorage.characterData));
    }

    return fetch(charactersURL).then((response) => {
        // parse response as JSON
        return response.json();
    }).then((data) => {
        //console.log(data);
        localStorage.characterData = JSON.stringify(data);
        return data;
    });
}

const addEventToPage = (eventData) => {
    const eventImg = eventData.data.results[0].thumbnail.path + "/landscape_incredible.jpg";
    const eventDescription = eventData.data.results[0].description;
    lead.innerHTML = eventDescription;
    jumbotron.style.backgroundImage = `url(${eventImg}`;
};

const addCharactersToPage = (characterData) => {
    // array of individual characters
    //console.log(characterData.data.results);
    const characterArray = characterData.data.results;
    let card = "";
    let output = ``;
    characterArray.forEach(character => {
        if (!hiddenCharacters[character.id]) {
            const characterImg = character.thumbnail.path + "/standard_medium.jpg";
            const characterName = character.name.replace(/\(.*\)/, "");

            card = document.createElement("div");
            card.setAttribute("class", "card character alive");
            output = `
                <img class="card-img-top" src="${characterImg}" alt="Card image cap">
                <div class="card-body text-center">
                    <p class="card-title text-info">${characterName}</>
                </div>
            `;
            card.innerHTML = output;
            charactersContainer.appendChild(card);
        }
    });
};

const balanceUniverse = () => {
    const characters = [...document.querySelectorAll(".character")];
    let survivingCharacters = Math.floor(characters.length/2);
    destroyCharacters(characters, survivingCharacters);
};

const destroyCharacters = (characterArray, survivingCharacters) => {
    if (survivingCharacters > 0) {
        const randomIndex = Math.floor(Math.random() * characterArray.length);
        const [randomCharacter] = characterArray.splice(randomIndex, 1);

        randomCharacter.style.transform = "scale(0)";
        randomCharacter.classList.remove("alive");
        randomCharacter.classList.add("dead");

        setTimeout(() => {
            destroyCharacters(characterArray, survivingCharacters - 1);
        }, 1000);
    } else {
        document.querySelectorAll(".dead").forEach(character => {
            charactersContainer.removeChild(character);
        });
    }
};

getEventData().then(addEventToPage);

getCharacterData().then(addCharactersToPage);

thanosSnap.addEventListener("click", () => {
    balanceUniverse();
});
