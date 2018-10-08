function debounce(callback, wait, withLoading) {
    var timeout;
    return function() {
        if(withLoading){
            toggleLoadingState(true)
        } 
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			timeout = null;
			callback()
		}, wait);
	}
}

function removeNodeByID(nodeId) {
    var node = document.getElementById(nodeId);
    var parent = node.parentNode;
    parent.removeChild(node);
}

function toggleLoadingState(isLoading) {
    var IS_VISIBLE = "is-visible"

    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }
    if(isLoading && loadingPacman.className != IS_VISIBLE){
        loadingPacman.className += ' '+IS_VISIBLE;
    } else if(!isLoading) {
        loadingPacman.classList.remove(IS_VISIBLE);
    }
}

function navKeyHandler(event){
    var nextSibling = document.activeElement.nextSibling;
    var previousSibling = document.activeElement.previousSibling;

    if (event.keyCode === 13) { // "Enter"
        event.preventDefault();  
        document.activeElement.click();
    }
    if (event.keyCode == 40) { // "Down"
        event.preventDefault();
        if(nextSibling && nextSibling.className){
            nextSibling.focus();
        } else if(results.firstChild){
            results.firstChild.focus();
        }
    }
    if (event.keyCode == 38) { // "Up"
        event.preventDefault();
        if(previousSibling && previousSibling.className){
            previousSibling.focus()
        } else if(results.lastChild) {
            results.lastChild.focus();
        }
    }

    if (event.keyCode == 8) { // "Delete"
        event.preventDefault();
        console.log(event.path[0].className);
        if(event.path[0].className.indexOf("selected-element") > -1 ){
            removeNodeByID(event.path[0].id);
        }
    }
}