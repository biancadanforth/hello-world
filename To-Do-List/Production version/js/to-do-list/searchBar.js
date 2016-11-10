/*
* To Do List application by Bianca Danforth
* searchBar.js module
* last edited 11/10/16
*/

var app = app ? app : {};

!(function () {
  
  'use strict';

  var searchLink = document.getElementById('search-link');
  var searchBox = document.getElementById('search-box');
  var listContainer = document.getElementById(
    'list-container');
  var noResults = document.getElementById('no-results');

  searchLink.onclick = showSearchBar;

  searchBox.onblur = hideSearchBar;

  searchBox.oninput = filterList;

  /*
  * Any time the user deletes a task or undoes a delete,
  * filter the list again.
  */
  document.body.addEventListener('delete', filterList);
  document.body.addEventListener('undo', filterList);

  // Displays the search bar using CSS transitions
  function showSearchBar() {
    searchLink.classList.add('search-link-active');
    searchBox.classList.remove('hidden');
    searchBox.removeAttribute('aria-hidden');
    searchBox.focus();
  }
  
  // Hides the search bar using CSS transitions
  function hideSearchBar() {
    if (searchBox.value === '') {
      searchLink.classList.remove('search-link-active');
      searchBox.classList.add('hidden'); 
      searchBox.setAttribute('aria-hidden', 'true');
    }
  }

  /* Updates the list contents to only display the tasks
  * that contain the substring input by the user.
  */
  function filterList() {             
    
    if (searchBox.classList.contains('hidden')) {
      return;
    }
    var subString = searchBox.value.toLowerCase();
    var tasks = app.store.getTasks();

    for (var taskId in tasks) {
      var string = tasks[taskId].text.toLowerCase();
      var taskElem = document
      .getElementById('task-container-' + taskId);
      
      if (string.indexOf(subString) === -1 
        && subString !== '') {
        taskElem.classList.add('hidden');
        taskElem.setAttribute('aria-hidden', 'true');
        taskElem.classList.add('search');
      
      } else {
        taskElem.classList.remove('hidden');
        taskElem.removeAttribute('aria-hidden');
        taskElem.classList.remove('search');
      }
      
      if (subString === '') {
        taskElem.classList.remove('hidden');
        taskElem.removeAttribute('aria-hidden');
        taskElem.classList.remove('search');
      }
    }

    checkResults(subString);
  }

  /*
  * If there are no matching results in the list,
  * display a notification in place of the list.
  * subString is a string.
  */
  function checkResults(subString) {
    /* 
    * Don't check the last child, since that's not a
    * submitted task.
    */
    for (var i = 0; i < listContainer.children
      .length-1; i++) {
      
      if (!listContainer.children.item(i).classList
        .contains('hidden')) {
        noResults.classList.add('hidden');
        noResults.setAttribute('aria-hidden', 'true');
        noResults.classList.add('search');
        listContainer.classList.remove('hidden');
        listContainer.removeAttribute('aria-hidden');
        listContainer.classList.remove('search');
        return;
      }
    }

    if (subString === '') {
      noResults.classList.add('hidden');
      noResults.setAttribute('aria-hidden', 'true');
      noResults.classList.add('search');
      listContainer.classList.remove('hidden');
      listContainer.removeAttribute('aria-hidden');
      listContainer.classList.remove('search');
      return;
    }
    
    noResults.classList.remove('hidden');
    noResults.removeAttribute('aria-hidden');
    noResults.classList.remove('search');
    listContainer.classList.add('hidden');
    listContainer.setAttribute('aria-hidden', 'true');
    listContainer.classList.add('search');
  }
  
}());
