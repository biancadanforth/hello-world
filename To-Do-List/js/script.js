// To Do Project JavaScript

var searchBar = document.getElementById("search-bar");
var searchIcon = document.getElementById("search-icon");
var searchTextBox = document.getElementById("search-text-box");

function showSearchBar() {
  searchBar.style.display="inline";
  searchIcon.style.display="none";
}

function hideSearchBar() {
  searchBar.style.display="none";
  searchIcon.style.display="inline-block";
}

searchIcon.onclick = showSearchBar;
searchTextBox.onblur = hideSearchBar;