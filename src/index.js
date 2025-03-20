// DOM CONTENT
const dogInfo = document.getElementById("dog-info");
const filterButton = document.getElementById("good-dog-filter");
const dogbar = document.getElementById("dog-bar");

let filterEnabled = false;
let debounce = false;

// Display all the dogs
function displayDogs(dog) {
    const span = document.createElement("span");
    span.innerText = dog.name;
    dogbar.appendChild(span);

    span.addEventListener("click", () => {
        dogInfo.innerHTML = `
            <img src=${dog.image}>
            <h2>${dog.name}</h2>
            <button id="dog-status">${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;

        const button = document.getElementById("dog-status");
        button.addEventListener("click", () => {
            makeaBadDog(dog);
            button.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
        });
    });
}

// Function to render the list of dogs
function render() {
    dogbar.innerHTML = ""; // Clear the dog bar before rendering new dogs

    fetch("http://localhost:3000/pups")
        .then((response) => response.json())
        .then((pups) => {
            if (filterEnabled) {
                pups.forEach((dog) => {
                    if (dog.isGoodDog) displayDogs(dog);
                });
                filterButton.innerText = "Filter good dogs: ON";
            } else {
                pups.forEach(displayDogs);
                filterButton.innerText = "Filter good dogs: OFF";
            }
        });
}

// Initial render
render();

// Function to toggle between good dog and bad dog
function makeaBadDog(dog) {
    const updatedDog = {
        isGoodDog: !dog.isGoodDog,
    };

    fetch(`http://localhost:3000/pups/${dog.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDog),
    }).then(() => {
        render(); // Re-render dogs after update
    });
}

// Filter button click handler
filterButton.addEventListener("click", () => {
    if (!debounce) {
        debounce = true;
        filterEnabled = !filterEnabled; // Toggle the filterEnabled state
        render(); // Re-render dogs based on filter state
        debounce = false;
    }
});
