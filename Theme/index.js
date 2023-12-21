function injectCSS(url) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', url);
    document.body.appendChild(link);
  }
  
  window.addEventListener('load', () => {
    const url = 'https://omaikeru.github.io/PureBlack-Theme/Theme/theme.css';
    injectCSS(url);
  });

export function load() {
    domOps()
    shadowDomOps()
}

export function domOps() {
    removePartiesTooltip()
}

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

export function shadowDomOps() {
    window.setInterval(() => {
        try {
            document.getElementsByClassName("lol-settings-container")[0].style.backgroundColor = "black";
            document.querySelector(".lol-settings-container").
                document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div").style.backgroundColor = "black";
            document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame").
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
}
