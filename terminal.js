// Get elements
const terminalBody = document.querySelector('.terminal-body');
const terminalInput = document.querySelector('.terminal-input')
const terminalInputField = document.querySelector('.terminal-input-field');

toggleVisibility(terminalInput);

document.addEventListener("DOMContentLoaded", () => {
    let greetingText = "<p>Moin, I'm Michel in AI form!</p><p>I'm here to answer any questions you may have about my work history and experience. Feel free to ask me anything!</p>";
    addTextDiv(greetingText, true, () => {
        // activate input field once greeting is over
        toggleVisibility(terminalInput);
        focusInputField(terminalInputField);
    });
});


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
        addTextDiv(userPrompt)

        // clear input field
        terminalInputField.value = '';

        // get response
        getGptResponse(userPrompt);
    }
});



function addTextDiv(text, withAnimation = false, callback) {

    // create div for new message
    var msgDiv = document.createElement('div');

    // add div to class to add styling
    msgDiv.classList.add('message-div');

    // insert message div right above input field inside scroll view
    terminalBody.insertBefore(msgDiv, anchor);

    // add animation to text if withAnimation
    if (withAnimation && callback)
        animateText(msgDiv, text, callback)
    else if(withAnimation)
        animateText(msgDiv, text)
    else
        msgDiv.innerHTML += `<p>> ${text}</p>`;
}

// Handle Sending Prompt to GPT API and add response to chat
async function getGptResponse(prompt) {
    // code for sending prompt to gpt api:
    const stringResponse = await getResponse(prompt);
    var htmlResponse = '';
    if(stringResponse == '')
        htmlResponse = '<p>Sorry, my AI brain (aka the API of GPT3.5) is currently not connected. Por eso everything I say is bullshit:)</p>';
    else
        htmlResponse = `<p>${stringResponse}</p>`;
    //...

    // add div and animate text
    addTextDiv(htmlResponse, true, () => {
        // activate input field again after response is finished
        toggleVisibility(terminalInput);
        focusInputField(terminalInputField);
    });
}


// OPEN AI CODE
const API_KEY = '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';

async function getResponse(prompt) {
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
                    { role: 'system', content: 'Act like Michel Hartmann, a charismatic Mechatronics Student working at Mercedes-Benz that likes to do Software Developement'},
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




// function animateText(content, html) {
//     let index = 0;
//     const intervalId = setInterval(() => {
//       content.innerHTML += html.charAt(index);
//       index++;
//       if (index > html.length) {
//         clearInterval(intervalId);
//       }
//     }, 50);
//   }

function animateText(content, htmlText, callback) {
    let index = 0;
    let closingTags = '';
    let listOpened = false;
    let listItemOpened = false;
    const intervalId = setInterval(() => {
        const char = htmlText.charAt(index);
        if (char === '<') {
            // Check if opening or closing tag
            const closingTagIndex = htmlText.indexOf('>', index);
            const tag = htmlText.substring(index, closingTagIndex + 1);
            if (tag.charAt(1) === '/') {
                if (tag === '</li>') {
                    listItemOpened = false;
                    closingTags += tag;
                } else if (tag === '</ul>') {
                    listOpened = false;
                    closingTags += tag;
                } else {
                    closingTags += tag;
                }
            } else {
                if (tag === '<ul>') {
                    listOpened = true;
                    content.innerHTML += tag;
                } else if (tag === '<li>') {
                    listItemOpened = true;
                    content.innerHTML += tag;
                } else {
                    content.innerHTML += tag;
                }
            }
            index = closingTagIndex;
        } else {
            content.innerHTML += char;
        }
        index++;
        if (index === htmlText.length) {
            clearInterval(intervalId);
            content.innerHTML += closingTags;
            if (callback) {
                callback();
            }
            Penis
        }
        if (listOpened && !listItemOpened && char === '\n') {
            content.innerHTML += '<li>';
            listItemOpened = true;
        }
    }, 20);
}


function focusInputField(inputField) {
    if (inputField) {
        inputField.focus();
    } else {
        console.error(`Input field with id ${inputFieldId} not found.`);
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