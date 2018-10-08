var searchInputForm;
var results;
var fetchedItems = [];
var loadingPacman;
var request = new XMLHttpRequest();

function init(){
    loadingPacman = document.getElementsByClassName("loading-img")[0];
    searchInputForm = document.getElementsByClassName('search-form')[0];
    results = document.getElementsByClassName('results')[0];

    searchInputForm.addEventListener("keydown", navKeyHandler)
}

function getTimeStamp() {
    return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().substr(0, 19).replace('T', ' ');
}

function fetchUsers() {
    if(searchInputForm.value != ''){
        request.addEventListener("load", handleResults);
        request.open("GET", "https://api.github.com/search/users?q=" + searchInputForm.value)
        request.send();
    } else {
        toggleLoadingState(false);
    }
}

function handleResults(event) {
  var response = JSON.parse(event.currentTarget.response);
  toggleLoadingState(false);
  var query = searchInputForm.value;
  if (!response.items) {
    return;
  }
  fetchedItems = response.items;
  fetchedItems.forEach(function(item) {
    if (item.login.indexOf(query) != -1) {
      var newSelected = document.createElement('li');
      var label = document.createTextNode(item.login);
      newSelected.appendChild(label);
      newSelected.setAttribute("value", item.login);
      newSelected.setAttribute("class", "result");
      newSelected.setAttribute("tabIndex", 0)
      newSelected.setAttribute("onclick", "selectUser(item)"); //for the others
      newSelected.onclick = function(){selectUser(item)}; //for IE
      newSelected.addEventListener("keydown", navKeyHandler);
      results.appendChild(newSelected);
    }
  });
}

function createNode(user) {
  return [
    "<img src='"+user.avatar_url+"' class='icon'/>",
    "<span class='segment'>",
    "<span class='user-elements user-name'>"+user.login+"</span>",
    "<span class='user-elements time-stamp'>"+getTimeStamp() +"</span>",
    "</span>",
  ].join(' ');
}

function selectUser(user) {
    var selectedElementList = document.getElementsByClassName('saved-users')[0];
    var elementSelected = document.createElement('div');
    elementSelected.setAttribute("id", user.id);
    elementSelected.setAttribute("tabindex", "0");
    elementSelected.setAttribute("class", 'selected-element');
    elementSelected.setAttribute("onclick", "toggleSelected(this)"); 
    elementSelected.addEventListener("keydown", navKeyHandler);
    var strigElem = createNode(user);
    elementSelected.innerHTML = strigElem;

    //clear dropdown after select
    searchInputForm.value = '';
    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }
    selectedElementList.appendChild(elementSelected);
}

function toggleSelected(element) {
  if (element.className.indexOf("isselected") == -1) {
    element.className += " isselected";
    deleteButton = document.createElement('div');
    deleteButton.setAttribute("class", "column close");
    deleteButton.setAttribute("id", "close_" + element.getAttribute('id'));
    deleteButton.addEventListener('click', function() {
        removeNodeByID(element.id);
    });
    deleteButton.innerHTML = "<div class='delete-icon'></div>";
    element.appendChild(deleteButton)
  } else {
    element.classList.remove("isselected");
    var toDelete = document.getElementById("close_" + element.getAttribute('id'))
    if(toDelete){
        element.removeChild(toDelete);
    }
  }
}

var searchUser = debounce(fetchUsers, 700, true);