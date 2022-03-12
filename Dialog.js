class Dialog {
    constructor(settings = {}) {
        this.settings = Object.assign(
            {
                // Configuración por defecto
                template: `
                <form method="dialog" data-ref="form">
                    <div class="modal-header">
                        <h4 class="modal-title" data-ref="title"></h4>
                        <span data-ref="closeX">&#x2715</span>
                    </div>
                    <div class="modal-body">
                        <div data-ref="content"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" value="cancel" data-ref="btoCancel">Cancel</button>
                        <button type="button" value="default" data-ref="btoAccept">Accept</button>
                    </div>
                </form>
                `,
                title: "Default Title",
                content: "",
                labelAccept: "Accept",
                labelCancel: "Cancel",
                styleClass: "modal-content"
            },
            settings
        )
        this.init();
    }

    init() {
        console.log("Creating 'dialog' element...");
        this.dialog = document.createElement("dialog"); // Creación del elemento modal
        document.body.appendChild(this.dialog); // Se añade la modal creada al DOM

        this.dialog.classList.add(this.settings.styleClass);
    }

    populate() {
        this.dialog.innerHTML = this.settings.template || "";

        // Recolección de los elementos del modal
        this.elements = {};
        this.dialog.querySelectorAll("[data-ref]").forEach(el => {
            this.elements[el.dataset.ref] = el;
        });

        this.elements.title.textContent = this.settings.title;
        this.elements.btoAccept.textContent = this.settings.labelAccept;
        this.elements.btoCancel.textContent = this.settings.labelCancel;
        this.elements.content.innerHTML = this.settings.content || "";
    }

    waitForUser() {
        return new Promise(resolve => {
            // NOTE: El evento no parece ser capturado nunca...
            /*this.dialog.addEventListener("cancel", evt => {
                console.log("Cancel: El usuario cierra o cancela la modal.");
                console.dir(evt);
                resolve(false);
            });*/

            // Se enfoca el primer elemento input de la ventana tras terminar la animación de apertura
            this.dialog.addEventListener('transitionend', (e) => {
                let el = this.dialog.querySelector('input');
                if (el) {
                    el.focus();
                }
            });

            this.elements.btoAccept.addEventListener("click", () => {
                resolve("Dato devuelto: " + this.elements.btoAccept.value);
                cerrarModal.call(this);
            });

            [this.elements.closeX, this.elements.btoCancel].forEach(el => {
                el.addEventListener("click", () => {
                    resolve(false);
                    cerrarModal.call(this);

                    //this.dialog.dispatchEvent(new Event('cancel'));
                });
            });

            // Cierra la modal con un efecto y la elimina del DOM
            function cerrarModal() {
                this.dialog.classList.add('hide');
                this.dialog.addEventListener('animationend', function () {
                    this.dialog.close();
                    this.dialog.remove();
                }.bind(this), false);
            }

            // Elimina la modal del DOM una vez cerrada
            /* this.dialog.addEventListener("close", () => {
                // Para dar tiempo a la animación de cierre se retrasa la eliminación un tiempo
                setTimeout(() => {
                    this.dialog.remove();
                }, 300);

            }); */
        });
    }

    open(settings = {}) {
        // Se sobrescribe la configuración por defecto
        Object.assign(this.settings, settings);
        this.populate();

        this.dialog.showModal();


        return this.waitForUser(); // Se retorna una promesa
    }
}

export { Dialog }