import { Note } from './note.js';

class StorageAPI {

    // Clave base para las notas en LocalStorage
    static NOTES_INDEX_KEY = 'notes_index';
    static COUNTER_KEY = 'notes_counter';

    // Obtiene el contador actual y lo incrementa para el siguiente id
    getNextId() {
        const counter = parseInt(localStorage.getItem(StorageAPI.COUNTER_KEY) || '0');
        const nextCounter = counter + 1;
        localStorage.setItem(StorageAPI.COUNTER_KEY, nextCounter);
        return `note_${nextCounter}`;
    }

    // Devuelve el array de ids de notas guardadas
    _getIndex() {
        const index = localStorage.getItem(StorageAPI.NOTES_INDEX_KEY);
        return index ? JSON.parse(index) : [];
    }

    // Guarda el array de ids
    _saveIndex(index) {
        localStorage.setItem(StorageAPI.NOTES_INDEX_KEY, JSON.stringify(index));
    }

    // Guarda o actualiza una nota
    saveNote(note) {
        const index = this._getIndex();

        // Si el id no esta en el indice lo añadimos
        if (!index.includes(note.id)) {
            index.push(note.id);
            this._saveIndex(index);
        }

        localStorage.setItem(note.id, note.plain());
    }

    // Carga todas las notas y las devuelve ordenadas por date_updated (mas reciente primero)
    // PDF seccion 03.02
    loadAllNotes() {
        const index = this._getIndex();
        const notes = [];

        index.forEach(id => {
            const raw = localStorage.getItem(id);
            if (raw) {
                const note = new Note();
                note.parse(raw);
                notes.push(note);
            }
        });

        // Ordenamos de mas reciente a mas antigua
        notes.sort((a, b) => {
            const dateA = new Date(a.date_updated.split('/').reverse().join('-'));
            const dateB = new Date(b.date_updated.split('/').reverse().join('-'));
            return dateB - dateA;
        });

        return notes;
    }

    // Elimina una nota por id
    deleteNote(id) {
        const index = this._getIndex();
        const newIndex = index.filter(noteId => noteId !== id);
        this._saveIndex(newIndex);
        localStorage.removeItem(id);
    }

}

export { StorageAPI };