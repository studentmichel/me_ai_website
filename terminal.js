// Get elements
const terminalBody = document.querySelector('.terminal-body');
const terminalInput = document.querySelector('.terminal-input')
const terminalInputField = document.querySelector('.terminal-input-field');

toggleVisibility(terminalInput);

const aiTag = "<span class='ai-tag'>&lt;Michel[AI]&gt;</span>";
const userTag = "<span class='user-tag'>&lt;You[Human?]&gt;</span>";

document.addEventListener("DOMContentLoaded", () => {
    const greetingText = `<div><p>${aiTag} Moin, I'm Michel in AI form!</p><p>I'm here to answer any questions you may have about my work history and experience.</p><p>Feel free to ask me anything!</p><div id="prompt-examples"><button class="button-prompt-examples" onclick="addPrompt('Tell me about yourself.')">Tell me about yourself.</button><button class="button-prompt-examples" onclick="addPrompt('Why should I hire you?')">Why should I hire you?</button><button class="button-prompt-examples" onclick="addPrompt('Can you show me your CV?')">Can you show me your CV?</button></div></div>`;
    addHtmlElementsFromString(greetingText, true, activateUserInputField);
});


function activateUserInputField() {
    toggleVisibility(terminalInput);
    focusInputField(terminalInputField);
}

function addPrompt(promptText) {
    console.log("called function with ", promptText);
    // deactivate user input field while response is running
    toggleVisibility(terminalInput);

    // disable all buttons
    const buttons = document.querySelectorAll(".button-prompt-examples");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    // add user message div
    addHtmlElementsFromString(`<p>${userTag} ${promptText}</p>`, true);

    // clear input field
    terminalInputField.value = '';

    // get response
    getGptResponse(promptText, () =>{
        // reactivate the buttons after answer was given
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
    });
}

terminalInputField.addEventListener('input', () => {
    terminalInputField.style.height = 'auto';
    terminalInputField.style.height = terminalInputField.scrollHeight + 'px';
});

// Get elements for scrolling
let scroller = document.querySelector('#scroller');
let anchor = document.querySelector('#anchor');
// initial scroll to activate scrolling behaviour
scroller.scroll(0, 1);

// Handle user input
terminalInputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const userPrompt = terminalInputField.value;

        // if user hasn't typed any, return
        if (!userPrompt)
            return

        // deactivate user input field while response is running
        toggleVisibility(terminalInput);

        // add user message div
        addHtmlElementsFromString(`<p>${userTag} ${userPrompt}</p>`);

        // clear input field
        terminalInputField.value = '';

        // get response
        getGptResponse(userPrompt);
    }
});



function addHtmlElementsFromString(text, withAnimation = false, callback) {

    // create div for new message
    var msgDiv = document.createElement('div');

    // add div to class to add styling
    msgDiv.classList.add('message-div');

    // insert message div right above input field inside scroll view
    terminalBody.insertBefore(msgDiv, anchor);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;

    // Get all the child nodes of the temporary div
    const childNodes = tempDiv.childNodes;
    const delay = withAnimation ? 20 : 0;
    addChildNodesWithDelay(msgDiv, childNodes, delay, callback);
}

async function addChildNodesWithDelay(parentNode, childNodes, delay, callback) {
    for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        await new Promise(resolve => {
            setTimeout(() => {
                if (childNode.nodeName === "DIV") {
                    const newParentNode = document.createElement("div");
                    if (childNode.id !== '')
                        newParentNode.id = childNode.id;
                    parentNode.appendChild(newParentNode);
                    addChildNodesWithDelay(newParentNode, childNode.children, delay, i === childNodes.length - 1 ? callback : null);
                    resolve();
                } else if (childNode.nodeName === "P" && delay !== 0) {

                    const text = childNode.innerHTML;
                    childNode.innerHTML = "";
                    const newParentNode = document.createElement("P");
                    if (childNode.id !== '')
                        newParentNode.id = childNode.id;
                    parentNode.appendChild(newParentNode);
                    animateText(newParentNode, text, delay, () => {
                        if (i === childNodes.length - 1) {
                            if (callback) {
                                callback();
                            }
                        }
                        resolve();
                    });
                } else {
                    parentNode.appendChild(childNode.cloneNode(true));
                    if (i === childNodes.length - 1) {
                        if (callback) {
                            callback();
                        }
                    }
                    resolve();
                }
            }, i * 50);
        });
    }
}

function animateText(content, htmlText, delay, callback) {
    const elements = getHtmlElements(htmlText);
    var elementIndex = 0;
    var charIndex = 0;
    var textIndex = 0;
    const intervalId = setInterval(() => {
        const curElement = elements[elementIndex];
        const firstChar = curElement.charAt(charIndex);
        if (firstChar === "<") {
            content.innerHTML += elements[elementIndex];
            textIndex += elements[elementIndex].length;
            elementIndex++;
        }
        else {
            content.innerHTML += elements[elementIndex].charAt(charIndex);
            charIndex++;
            textIndex++;
            if (charIndex >= elements[elementIndex].length) {
                charIndex = 0;
                elementIndex++;
            }
        }
        if (textIndex === htmlText.length) {
            clearInterval(intervalId);
            if (callback) {
                callback();
            }
        }
    }, delay);
}

function getHtmlElements(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    const nodes = Array.from(div.childNodes);
    return nodes.map(node => node.outerHTML || node.textContent);
}

// Handle Sending Prompt to GPT API and add response to chat
async function getGptResponse(prompt, callback) {
    // code for sending prompt to gpt api:
    const stringResponse = await getResponse(prompt);
    var htmlResponse = '';
    if (stringResponse == '')
        htmlResponse = `<p>${aiTag} Sorry, my AI brain (aka the API of GPT3.5) is currently not connected. Por eso everything I say is bullshit:)</p>`;
    else
        htmlResponse = `<p>${aiTag} ${stringResponse}</p>`;
    //...

    // add div and animate text
    if(callback)
        addHtmlElementsFromString(htmlResponse, true, () => {
            activateUserInputField();
            callback();
        });
    else{
        addHtmlElementsFromString(htmlResponse, true, activateUserInputField);
    }
}

// OPEN AI CODE
const apiInput = document.querySelector('.api-key');

async function getResponse(prompt) {
    const API_KEY = apiInput.value;
    var responseText = '';
    const failText = 'Sorry, my AI brain (aka the API of GPT3.5) is currently not connected. Por eso everything I say is bullshit:)';
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Act like Michel Hartmann, a charismatic Mechatronics Student working at Mercedes-Benz that likes to do Software Developement' },
                    { role: 'user', content: prompt }
                ],
                temperature: 1.0,
                top_p: 0.7,
                n: 1,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 0,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            responseText = data.choices[0].message.content;
            console.log(data);
        } else {
            responseText = failText;
        }
    } catch (error) {
        console.error(error);
        responseText = failText;
    }
    return responseText;
}




function focusInputField(inputField) {
    if (inputField) {
        inputField.focus();
    } else {
        console.error(`Input field with id ${inputField.id} not found.`);
    }
}

function toggleVisibility(div) {
    if (div.style.display === 'none') {
        div.style.display = 'flex';
    } else {
        div.style.display = 'none';
    }
}







/*
##############################################################################
*/
// Handle scrolling
terminalBody.addEventListener('wheel', (event) => {
    terminalBody.scrollBy(0, event.deltaY);
    event.preventDefault();
});


// Make the DIV element draggable:
dragElement(document.getElementById("terminal"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}