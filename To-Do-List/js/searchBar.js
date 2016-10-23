/*
Using a ternary operator to declare variable 'app' as an empty object regardless of which script is run first. Pseudocode: If app already exists (first condition), then do nothing. If it doesn't, then create it as an object with a nested store object.
*/
var app = app? app : {
  store: { 
    /*
    The submittedTasks object is appended with a new property every time the user submits a task (by hitting 'Enter') in the list-item.js module, with key: value pairs of the form: row-x: "Task content string". Deleting or completing a task removes the corresponding property from this object.
    */
    submittedTasks: {}
  }
};

//Wrap entire module in an immediately invoked function so global variables in this module don't pollute the global namespace for the application.
!(function () {
  /* document.getElementsByClassName(...) returns an array-like object (HTML Collection) of all child elements which have all of the given class names. Just choose the first element in the array, array[0]. */
  var searchLink = document.getElementById("search-link");
  var searchBox = document.getElementById("search-box");

  function showSearchBar() {
    searchLink.classList.add("search-link-active");
    searchBox.classList.add("search-box-active");
    searchBox.focus();
  }
  
  function hideSearchBar() {
    if (searchBox.value === "") {
      searchLink.classList.remove("search-link-active");
      searchBox.classList.remove("search-box-active"); 
    }
  }

  // activate CSS3 transitions!
  searchLink.onclick = showSearchBar;

  // return to initial state
 //searchBox.onblur = hideSearchBar;
  
}());
