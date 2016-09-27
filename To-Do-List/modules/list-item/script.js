// Toggle input checkbox element to display checkmark in CSS and strikethrough list item when checked

var fakeCheckbox = document.getElementById("fake-checkbox");
var realCheckbox = document.getElementById("real-checkbox");
var checkmarkIcon = document.getElementById("checkmark-icon");

function toggleCheckbox() {
  if (realCheckbox.checked == false) {
    realCheckbox.checked = true;
    listItemLabel.style.textDecoration = "line-through";
    checkmarkIcon.style.visibility = "visible";
  } else {
    realCheckbox.checked = false;
    listItemLabel.style.textDecoration = "none";
    checkmarkIcon.style.visibility = "hidden";
  }
}

fakeCheckbox.onclick = toggleCheckbox;

// Dynamically update aria-label value on input element to match list item span element text content

var listItemLabel = document.getElementById("list-item-label");

function setAriaLabel() {
  var labelText = listItemLabel.textContent;
  realCheckbox.setAttribute('aria-label', labelText);
}

listItemLabel.onblur = setAriaLabel;

// Deleting a task

var deleteIcon = document.getElementById("delete-icon");
var listItemContainer = document.getElementById("list-item-container");

deleteIcon.onclick = deleteItem;

function deleteItem() {
  listItemContainer.classList.add("list-item-container-delete");
  setTimeout(removeListItemFromDOM, 1500);
}

function removeListItemFromDOM() {
  listItemContainer.remove();
}

// Adding a task

var listContainer = document.getElementById("list-container");
var addListLink = document.getElementById("add-list");
var listItemContainerPrime = listItemContainer.cloneNode(true);
  var addListContainer = document.getElementById("add-list-container");
  var addListContainerPrime = addListContainer.cloneNode(true);

addListLink.onclick = addItem;

function addItem() {
  addListContainer = listContainer.replaceChild(listItemContainerPrime, addListContainer);
  listContainer.appendChild(addListContainerPrime);
}
