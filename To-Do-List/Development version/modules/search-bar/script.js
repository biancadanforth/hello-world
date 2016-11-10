/* document.getElementsByClassName(...) returns an array-like object of all child elements which have all of the given class names. Just choose the first element in the array, array[0]. */
var searchIcon = document.getElementsByClassName("search-icon")[0];
var searchButton = document.getElementsByClassName("search-button")[0];
var searchBox = document.getElementsByClassName("search-box")[0];

function toggleClass() {
// IE11 bug workaround to toggle class names for search icon svg, since element.classList doesn't work on SVGs. *sigh*
/*   searchIcon.classList.toggle("search-icon");
  searchIcon.classList.toggle("js-search-icon-active"); */
  searchButton.classList.toggle("search-button");
  searchButton.classList.toggle("js-search-button-active");
  searchBox.classList.toggle("js-search-box-active");
  if (searchBox.classList.contains("js-search-box-active")) {
    searchBox.focus();
  }
}

// activate CSS3 transitions!
searchButton.onclick = toggleClass;

// return to initial state
//searchBox.onblur = toggleClass;

