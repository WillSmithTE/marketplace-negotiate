waitForElement('textarea')
    .then(() => {
        var cancelButton = document.querySelector('[aria-label="Cancel"]')?.parentNode!!
        var newButton = cancelButton.cloneNode(true)
        styleNewButton(newButton as HTMLElement, 'SmartText');
        (newButton as HTMLElement).onclick = (ev) => {
            showLoader()
            getSuggestedMessage()
                .then(setMessage)
                .finally(hideLoader)
        }
        cancelButton.parentNode!!.insertBefore(newButton, cancelButton)
    })


function setMessage(msg: string) {
    const EVENT_OPTIONS = { bubbles: true, cancelable: false, composed: true };
    const EVENTS = {
        BLUR: new Event("blur", EVENT_OPTIONS),
        CHANGE: new Event("change", EVENT_OPTIONS),
        INPUT: new Event("input", EVENT_OPTIONS),
    };
    (document.querySelector('[aria-label="Please type your message to the seller"]')!! as HTMLElement).click();
    const textInput = document.querySelector('textarea')!!;
    textInput.value = msg;
    const tracker = (textInput as any)._valueTracker;
    tracker && tracker.setValue(msg);
    textInput.dispatchEvent(EVENTS.INPUT);
    textInput.dispatchEvent(EVENTS.BLUR);
}

function showLoader() {
    const elemDiv = document.createElement('div');
    elemDiv.className = 'loading'
    elemDiv.id = 'spinner'
    document.body.appendChild(elemDiv);
}
function hideLoader() {
    document.getElementById('spinner')?.remove()
}

async function getSuggestedMessage() {
    console.log('getting message')
    const header = document.querySelector('h1')!!
    const itemName = header.innerText
    const listedPriceString = (header.parentElement!!.parentElement!!.children[1] as HTMLElement).innerText
    const listedPrice = toNumber(listedPriceString)
    const sellerName = ''
    const response = await (await fetch("https://hh5turw0d7.execute-api.us-west-2.amazonaws.com/Prod/suggestion/new", {
        "body": JSON.stringify({
            sellerName,
            itemName,
            listedPrice,
            "maxPrice": undefined,
            "availableTimes": "",
            "buyerName": "",
        }),
        "method": "POST",
        "mode": "cors",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },      
    })).json();
    return response!!.message
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    // return "hey  whatup"
}

function waitForElement(selector: string) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function styleNewButton(element: Element, newText: string) {
    replaceText(element, newText);
    (element as HTMLElement).style.backgroundColor = 'orange'
}
function replaceText(element: Element, newText: string) {
    const descendants = element.querySelectorAll("*");
    descendants.forEach(descendant => {
        if (descendant.childElementCount === 0 && (descendant as HTMLElement).innerText == 'Cancel') {
            (descendant as HTMLElement).focus();
            (descendant as HTMLElement).innerText = newText;
            (descendant as HTMLElement).style.color = 'white';
        } else replaceText(descendant, newText)
    });
}

function toNumber(str: string): number {
    return Number(str.replace(/[^\d.-]/g, ''))
}


export { }
