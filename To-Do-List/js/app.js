/*
Using a ternary operator to declare variable 'app' as an empty object regardless of which script is run first. Pseudocode: If app already exists (first condition), then do nothing. If it doesn't, then create it as an object with a nested store object.
*/
var app = app? app : {
  store: { 
    /*
    The submittedTasks object is appended with a new property every time the user submits a task (by hitting 'Enter') in the list-item.js module, with key: value pairs of the form: row-x: "Task content string". Deleting or completing a task removes the corresponding property from this object.
    */
    submittedTasks: {},
};


// ---------------------------------------------------------
// !----------CUSTOM EVENT LISTENERS/DISPATCHERS ----------!
// ---------------------------------------------------------

document.body.addEventListener("search", function() {
  // put code here
  console.log("search event fired!");
  }
);

//If a task is clicked in the search results, dispatch the 'search' event (highlight the corresponding task in the list for a few seconds).
var searchEvent = new Event('search');
document.body.dispatchEvent(searchEvent);
