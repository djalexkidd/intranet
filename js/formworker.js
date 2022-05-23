const radio = document.getElementsByName('1')
const inputContainer = document.querySelector('.hardware-lend')

for (var i = 0; i < radio.length; ++i) {
    radio[i].onclick = function() {
      if (this.value == "indirecte") {
        inputContainer.style.display = "block"
      } else {
        inputContainer.style.display = "none"
      }
    }
}