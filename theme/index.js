//IMPORT//
import utils from './_utils';
import data from './configs/config.json';
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


//DODGE-BUTTON-PLUGIN//
 async function dodgeQueue(){
	await fetch("/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]",
		{"body":"[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]", "method":"POST"})
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
	if (utils.phase == "ChampSelect" && document.querySelector(".bottom-right-buttons") && !document.querySelector(".dodge-button-container")){
		generateDodgeAndExitButton(document.querySelector(".bottom-right-buttons"))
	}
 }

 window.addEventListener('load', () => {
	utils.routineAddCallback(addDodgeAndExitButtonObserver, ["bottom-right-buttons"])
})
	
//AUTO-ACCEPT-PLUGIN//
	let auto_accept = data["is_auto_accept_enabled"]
	let queue_accepted = false 
	
	
	function autoAcceptQueueButton(){
		let element = document.getElementById("autoAcceptQueueButton")
		if (element.attributes.selected != undefined) {
			auto_accept = false
			element.removeAttribute("selected")
		}
		else {
			element.setAttribute("selected", "true")
			auto_accept = true
		}
	}
	
	window.autoAcceptQueueButton = autoAcceptQueueButton
	
	
	let autoAcceptCallback = async message => {
		utils.phase = JSON.parse(message["data"])[2]["data"]
		if (utils.phase == "ReadyCheck" && auto_accept && !queue_accepted) {
			await acceptMatchmaking()
			queue_accepted = true
		}
		else if (utils.phase != "ReadyCheck") {
			queue_accepted = false
		}
	}
	
	function fetch_or_create_champselect_buttons_container() {
		if (document.querySelector(".cs-buttons-container")) {
			return document.querySelector(".cs-buttons-container")
		}
		else {
			const div = document.createElement("div")
	
			div.className = "cs-buttons-container"
			document.querySelector(".v2-footer-notifications.ember-view").append(div)
			return div
		}
	}
	
	
	let autoAcceptMutationObserver = (mutations) => {
		if (document.querySelector(".v2-footer-notifications.ember-view") != null && document.getElementById("autoAcceptQueueButton") == null) {
			let newOption = document.createElement("lol-uikit-radio-input-option");
			let container = fetch_or_create_champselect_buttons_container()
		
			newOption.setAttribute("id", "autoAcceptQueueButton");
			newOption.setAttribute("onclick", "window.autoAcceptQueueButton()");
			if (auto_accept){
				newOption.setAttribute("selected", "");
			}
			newOption.innerHTML = "<div class='auto-accept-button-text'>Auto Accept</div>";
			container.append(newOption);
		}
	}
	
	window.addEventListener('load', () => {
		utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', autoAcceptCallback)
		utils.routineAddCallback(autoAcceptMutationObserver, ["v2-footer-notifications.ember-view"])
	})
	
	let acceptMatchmaking = async () => await fetch('/lol-matchmaking/v1/ready-check/accept', { method: 'POST' })

	console.clear()
	console.log('theme injected')
