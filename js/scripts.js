const flagsElement = document.getElementById("flags");
const textsToChange = document.querySelectorAll("[data-section]");

const changeLanguage = async (language) => {
    const requestJson = await fetch(`../languages/${language}.json`);
    const texts = await requestJson.json();

    for (const textToChange of textsToChange) {
        const section = textToChange.dataset.section;
        const value = textToChange.dataset.value;
        textToChange.innerHTML = texts[section][value];
    }

    
    localStorage.setItem("language", language);
};


flagsElement.addEventListener("click", (e) => {
    const language = e.target.parentElement.dataset.language;
    changeLanguage(language);
});


document.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = localStorage.getItem("language") || "es"; 
    changeLanguage(savedLanguage);
});
