class NoteDelete {

    _storage;
    _nota;
    _onConfirm;
    _onCancel;

    constructor(storage, onConfirm, onCancel) {
        this._storage = storage;
        this._onConfirm = onConfirm;
        this._onCancel = onCancel;
    }

    init() {
        document.getElementById('btn-confirm-delete').addEventListener('click', () => {
            this._storage.deleteNote(this._nota.id);
            this._onConfirm();
        });

        document.getElementById('btn-cancel-delete').addEventListener('click', () => {
            this._onCancel();
        });
    }

    // Carga la nota a eliminar y actualiza el mensaje de confirmacion
    load(nota) {
        this._nota = nota;

        // Actualizamos el nombre en el header
        document.getElementById('delete-note-name').textContent = nota.name;

        // Actualizamos el mensaje de confirmacion
        document.getElementById('delete-confirm-msg').innerHTML =
            `We are going to delete "<strong>${nota.name}</strong>" note. To proceed confirm pressing the Delete Note button..`;

        // Mostramos el render de la nota como preview
        document.querySelector('#screen-delete main').innerHTML = nota.render();
    }

}

export { NoteDelete };