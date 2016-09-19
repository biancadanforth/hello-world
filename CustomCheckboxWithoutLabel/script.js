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
var labelText = String(listItemLabel.innerHTML);

function setAriaLabel() {
  realCheckbox.setAttribute("aria-label", labelText);  
}