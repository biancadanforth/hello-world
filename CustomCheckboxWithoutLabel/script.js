// Dynamically updates aria-label attribute value on input element based on content of <span> next to 'fake' checkbox

var fakeCheckbox = document.getElementById("fake-checkbox");
var realCheckbox = document.getElementById("real-checkbox");

function toggleCheckbox() {
  if (realCheckbox.checked == false) {
    realCheckbox.checked = true;
  } else {
    realCheckbox.checked = false;
  }
}

fakeCheckbox.onclick = toggleCheckbox;

var listItemLabel = document.getElementById("list-item-label");

function setAriaLabel() {
  var labelText = listItemLabel.textContent;
  realCheckbox.setAttribute('aria-label', labelText);
  console.log(realCheckbox);
}

listItemLabel.onblur = setAriaLabel;