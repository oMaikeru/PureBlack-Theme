//IMPORT//
import utils from './_utils';
import '//plugins/theme/assets/theme.css';

//SHADOWROOT//
window.setInterval(() => {
	try {
		document.getElementsByClassName("lol-settings-container")[0].style.backgroundColor = "black";
		document.querySelector(".lol-settings-container").
			shadowRoot.querySelector("div").style.background = "black";
	} catch { }
	try {
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div").style.backgroundColor = "black";
		document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame").
			shadowRoot.querySelector("div").style.background = "black";
	} catch { }
	try {
		document.querySelector("#lol-uikit-layer-manager-wrapper > div.modal > div > lol-uikit-dialog-frame").
			shadowRoot.querySelector("div").style.background = "black"
	} catch { }
})

window.setInterval(() => {
	try {
		let el = document.querySelector("div.identity-and-parties").querySelector("lol-social-panel > lol-parties-game-info-panel").shadowRoot.querySelector("div > div.parties-game-info-panel-content > lol-parties-status-card").shadowRoot.querySelector("div > div.parties-status-card-bg-container")

		if (el) {
			el.removeChild(el.firstElementChild);
			el.parentElement.style.background = "#000000";
		}
	} catch { }
})

window.setInterval(() => {
	try {
		let doc = document.querySelector("lol-social-panel>lol-parties-game-info-panel")
		let shadowDoc1 = doc.shadowRoot.querySelector(".parties-game-section .parties-game-info-panel-content>lol-parties-game-search")
		let shadowDoc2 = shadowDoc1.shadowRoot.querySelector(".parties-game-search-status .parties-game-search-divider")

		shadowDoc2.style.backgroundColor = "black"
	} catch { }
})

const removePartiesTooltip = async () => {
	let targetNode
	while (!document.getElementById('lol-uikit-layer-manager-wrapper')) {
		await new Promise(r => setTimeout(r, 300))
	}
	targetNode = document.getElementById('lol-uikit-layer-manager-wrapper')
	const config = {
		childList: true,
		subtree: true
	};
	const callback = function (mutationsList) {
		for (let mutation of mutationsList) {
			if (mutation.addedNodes.length > 0 &&
				mutation.addedNodes[0].className === "lol-uikit-contextual-notification-targeted-layer" &&
				mutation.addedNodes[0].hasChildNodes("lol-uikit-content-block.parties-first-experience-tooltip")
			) {

				targetNode.removeChild(mutation.addedNodes[0])
				console.log("target removed")
			}

		}
	}
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
}

window.addEventListener('load', async () => {
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', autoAcceptCallback)
	utils.routineAddCallback(autoAcceptMutationObserver, ["v2-footer-notifications.ember-view"])
	removePartiesTooltip()
})


//DODGE-BUTTON//
async function dodgeQueue() {
	await fetch("/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]", {
		"body": "[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]",
		"method": "POST"
	})
}

window.dodgeQueue = dodgeQueue

function generateDodgeAndExitButton(siblingDiv) {
	const div = document.createElement("div");
	const parentDiv = document.createElement("div")

	parentDiv.setAttribute("class", "dodge-button-container")
	parentDiv.setAttribute("style", "position: absolute;right: 10px;bottom: 57px;display: flex;align-items: flex-end;")
	div.setAttribute("class", "quit-button ember-view");
	div.setAttribute("onclick", "window.dodgeQueue()")
	div.setAttribute("id", "dodgeButton");

	const button = document.createElement("lol-uikit-flat-button");
	button.innerHTML = "Dodge";

	div.appendChild(button);

	parentDiv.appendChild(div);
	console.log(parentDiv)
	siblingDiv.parentNode.insertBefore(parentDiv, siblingDiv)
}

let addDodgeAndExitButtonObserver = (mutations) => {
	if (utils.phase == "ChampSelect" && document.querySelector(".bottom-right-buttons") && !document.querySelector(".dodge-button-container")) {
		generateDodgeAndExitButton(document.querySelector(".bottom-right-buttons"))
	}
}

window.addEventListener('load', () => {
	utils.routineAddCallback(addDodgeAndExitButtonObserver, ["bottom-right-buttons"])
})

console.log('theme injected')
