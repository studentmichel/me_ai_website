window.addEventListener('DOMContentLoaded', (event) => {
    fetch('./Content/lang.json')
        .then(response => response.json())
        .then(data => {
            populateDropdown(data);
            document.getElementById('lang-select').addEventListener('change', function () {
                populateDropdown(data, this.value);
            });
        });
});

function populateDropdown(data, selectedCode = 'eng') {
    const select = document.getElementById('lang-select');
    select.innerHTML = '';
    for (let language of data.languages) {
        let option = document.createElement('option');
        option.value = language.code;
        if (selectedCode != 'eng')
            option.text = language.translations[selectedCode] + ' [' + language.translations['eng'] + ']';
        else
            option.text = language.translations[selectedCode];
        if (language.code === selectedCode) {
            option.selected = true;
        }
        select.appendChild(option);
    }
}

function getCurrentLang() {
    var selectElement = document.getElementById("lang-select");
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var selectedText = selectedOption.textContent;
    return selectedText;
}

function handleLangSelection() {
    var selectElementValue = document.getElementById("lang-select").value;
    fetch('./Content/lang.json')
        .then(response => response.json())
        .then(data => {
            var message = data.intro_sentences[selectElementValue];
            console.log(message);
            addAIText(message, true);
        });
}