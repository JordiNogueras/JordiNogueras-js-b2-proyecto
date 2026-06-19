class NoteList {

    _storage;
    _onNewNote;
    _onSelectNote;
    _onDeleteNote;

    constructor(storage, onNewNote, onSelectNote, onDeleteNote) {
        this._storage = storage;
        this._onNewNote = onNewNote;
        this._onSelectNote = onSelectNote;
        this._onDeleteNote = onDeleteNote;
    }

    init() {
        // Boton nueva nota
        document.querySelector('.btn-new-note').addEventListener('click', () => {
            this._onNewNote();
        });
    }

    // Renderiza el listado de notas en el DOM
    render() {
        const notas = this._storage.loadAllNotes();
        const contenedor = document.querySelector('.note-list');
        contenedor.innerHTML = '';

        if (notas.length === 0) {
            contenedor.innerHTML = `
        <p class="empty-msg">No hay notas. Crea la primera.</p>
      `;
            return;
        }

        notas.forEach(nota => {
            const item = document.createElement('div');
            item.className = 'note-item';
            item.innerHTML = `
        <div class="note-item-info">
          <span class="note-item-date">${nota.date_updated}</span>
          <span class="note-item-name">${nota.name}</span>
        </div>
        <button class="btn-delete-item" data-id="${nota.id}" title="Eliminar">🗑</button>
      `;

            // Click en la nota -> editar
            item.querySelector('.note-item-info').addEventListener('click', () => {
                this._onSelectNote(nota);
            });

            // Click en eliminar -> confirmacion
            item.querySelector('.btn-delete-item').addEventListener('click', (e) => {
                e.stopPropagation();
                this._onDeleteNote(nota);
            });

            contenedor.appendChild(item);
        });
    }

}

export { NoteList };