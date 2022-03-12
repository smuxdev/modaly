import { Dialog } from "./Dialog.js";

(function () {

    console.log("Starting Dialog.js app..");

    let btnModal = document.querySelector("button");

    btnModal.addEventListener("click", () => {
        let modal = new Dialog({
            title: "El Título de la Modal",
            labelCancel: "Cancelar",
            labelAccept: "Aceptar"
        });
        modal.open({
            content: `<p>Aquí puede ir cualquier contenido HTML :)</p>
            <br><br><input type="text"></input><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><p>fin</p>`
        }).then(valueReturned => {
            if (valueReturned) {
                console.log("La modal dice: " + valueReturned);
            } else {
                console.log("La modal se cierra sin aceptar.");
            }

        })
    });


})();
