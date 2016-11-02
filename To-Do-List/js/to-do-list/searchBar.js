/*
Using a ternary operator to declare variable 'app' as an empty object regardless of which script is run first. Pseudocode: If app already exists (first condition), then do nothing. If it doesn't, then create it as an object with a nested store object.
*/
var app = app ? app : {};

//Wrap entire module in an immediately invoked function so global variables in this module don't pollute the global namespace for the application.
!(function () {
  var searchLink = document.getElementById("search-link");
  var searchBox = document.getElementById("search-box");
  
  //Get the <div> element containing the list
  var listContainer = document.getElementById("list-container");

  //Get the <p> element that displays when no search results are found
  var noResults = document.getElementById("no-results");

  function showSearchBar() {
    searchLink.classList.add("search-link-active");
    searchBox.classList.remove("hidden");
    searchBox.removeAttribute("aria-hidden");
    searchBox.focus();
  }
  
  function hideSearchBar() {
    if (searchBox.value === "") {
      searchLink.classList.remove("search-link-active");
      searchBox.classList.add("hidden"); 
      searchBox.setAttribute("aria-hidden", "true");
    }
  }

  // activate CSS3 transitions!
  searchLink.onclick = showSearchBar;

  // return to initial state
  searchBox.onblur = hideSearchBar;

  // Any time the value of the input changes, filter the list
  searchBox.oninput = filterList;

  /*
  Any time the user deletes an item or returns an item to the list from deletion, filter the list again.
  */
  document.body.addEventListener("delete", filterList);
  document.body.addEventListener("undo", filterList);

  // Updates the list contents to only display the tasks that contain the substring input by the user. If the input field is empty, all tasks are visible. If the user input does not match any tasks, no tasks are shown and the user is notified that there are no matching results.
  function filterList() {             
    // if search box is not active, don't filter list.
    if (searchBox.classList.contains("hidden")) {
      return;
    }
    var subString = searchBox.value.toLowerCase();
    var tasks = app.store.getTasks();
    for (let taskId in tasks) {
      let string = tasks[taskId].text.toLowerCase();
      let taskElem = document.getElementById("list-item-container-" + taskId);
      //indexOf returns -1 if the substring is not contained in the string
      //indexOf is case sensitive, so convert tasks to lowercase to check if all lowercase characters have been entered into the search field.
      if (string.indexOf(subString) === -1 && subString !== "") {
        // substring is not contained in the string
        taskElem.classList.add("hidden");
        taskElem.setAttribute("aria-hidden", "true");
        // adding an additional search class when toggling hidden state, to alter transitions in CSS when user is searching tasks. (.hidden.search {} in CSS)
        taskElem.classList.add("search");
      } else {
        taskElem.classList.remove("hidden");
        taskElem.removeAttribute("aria-hidden");
        taskElem.classList.remove("search");
      }
      if (subString === "") {
        taskElem.classList.remove("hidden");
        taskElem.removeAttribute("aria-hidden");
        taskElem.classList.remove("search");
      }
    }
    // If the user input does not match any of the tasks, there are no matching results, no tasks are shown, and and a notification message is displayed to that effect.
    checkResults(subString);
  }

  // Checks to see if there are any matching results to the user's input. If at least one result matches (i.e. it is currently visible in the list and does not have the "hidden" class applied), then don't show the 'no results' notification in place of the list. Otherwise, if there are no matching results, display the notification in place of the list.
  function checkResults(subString) {
    //don't check the last child, since that's the blank input element automatically generated upon submitting a task.
    for (let i = 0; i < listContainer.children.length-1; i++) {
      if (!listContainer.children.item(i).classList.contains("hidden")) {
        noResults.classList.add("hidden");
        noResults.setAttribute("aria-hidden", "true");
        noResults.classList.add("search");
        listContainer.classList.remove("hidden");
        listContainer.removeAttribute("aria-hidden");
        listContainer.classList.remove("search");
        return;
      }
    }
     //Check if the input field is blank to remove noResults
    if (subString === "") {
      noResults.classList.add("hidden");
      noResults.setAttribute("aria-hidden", "true");
      noResults.classList.add("search");
      listContainer.classList.remove("hidden");
      listContainer.removeAttribute("aria-hidden");
      listContainer.classList.remove("search");
      return;
    }
    noResults.classList.remove("hidden");
    noResults.removeAttribute("aria-hidden");
    noResults.classList.remove("search");
    listContainer.classList.add("hidden");
    listContainer.setAttribute("aria-hidden", "true");
    listContainer.classList.add("search");
  }
  
}());