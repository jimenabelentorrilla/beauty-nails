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
    // Asegúrate de que el usuario hizo clic en un elemento con `data-language`
    const flagItem = e.target.closest(".flags_item");
    if (!flagItem) return;

    // Remueve la clase 'selected' de todos los elementos
    document.querySelectorAll(".flags_item").forEach(item => item.classList.remove("selected"));

    // Agrega la clase 'selected' al elemento clicado
    flagItem.classList.add("selected");

    // Obtiene el idioma y llama a `changeLanguage`
    const language = flagItem.dataset.language;
    changeLanguage(language);
});


document.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = localStorage.getItem("language") || "es"; 
    changeLanguage(savedLanguage);

    // Marca el idioma seleccionado
    document.querySelectorAll(".flags_item").forEach(item => {
        if (item.dataset.language === savedLanguage) {
            item.classList.add("selected");
        }
    });
});

