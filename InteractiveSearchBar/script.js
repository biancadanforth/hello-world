var searchIcon = document.getElementsByClassName("search-icon")[0];
var searchButton = document.getElementsByClassName("search-button")[0];
var searchBox = document.getElementsByClassName("search-box")[0];

function toggleClass() {
  searchButton.classList.toggle("search-button");
  searchButton.classList.toggle("js-search-button-active");
  searchBox.classList.toggle("js-search-box-active");
  if (searchBox.classList.contains("js-search-box-active")) {
    searchBox.focus();
  }
}

// activate CSS3 transitions
searchButton.onclick = toggleClass;

// return to initial state
searchBox.onblur = toggleClass;

