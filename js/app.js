import { StorageAPI } from './storage.js';
import { NoteList } from './noteList.js';
import { NoteDetail } from './noteDetail.js';
import { NoteDelete } from './noteDelete.js';

class App {

    _storage;
    _noteList;
    _noteDetail;
    _noteDelete;

    _screenList;
    _screenDetail;
    _screenDelete;

    constructor() {
        this._storage = new StorageAPI();

        this._screenList = document.getElementById('screen-list');
        this._screenDetail = document.getElementById('screen-detail');
        this._screenDelete = document.getElementById('screen-delete');

        // Instanciamos las vistas pasandoles los callbacks de navegacion
        this._noteList = new NoteList(
            this._storage,
            () => this._onNuevaNota(),
            (nota) => this._onEditarNota(nota),
            (nota) => this._onEliminarNota(nota)
        );

        this._noteDetail = new NoteDetail(
            this._storage,
            () => this._onGuardarNota(),
            () => this._onDescartarNota(),
            (nota) => this._onEliminarNota(nota)
        );

        this._noteDelete = new NoteDelete(
            this._storage,
            () => this._onConfirmarEliminar(),
            () => this._onCancelarEliminar()
        );
    }

    // Inicializa la aplicacion
    init() {
        this._noteList.init();
        this._noteDetail.init();
        this._noteDelete.init();

        // Mostramos el listado inicial
        this._noteList.render();
        this._showScreen(this._screenList);
    }

    // Muestra una pantalla y oculta las demas
    _showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        screen.classList.remove('hidden');
    }

    // Callbacks de navegacion

    _onNuevaNota() {
        this._noteDetail.loadNueva();
        this._showScreen(this._screenDetail);
    }

    _onEditarNota(nota) {
        this._noteDetail.load(nota);
        this._showScreen(this._screenDetail);
    }

    _onGuardarNota() {
        this._noteList.render();
        this._showScreen(this._screenList);
    }

    _onDescartarNota() {
        this._showScreen(this._screenList);
    }

    _onEliminarNota(nota) {
        this._noteDelete.load(nota);
        this._showScreen(this._screenDelete);
    }

    _onConfirmarEliminar() {
        this._noteList.render();
        this._showScreen(this._screenList);
    }

    _onCancelarEliminar() {
        this._showScreen(this._screenList);
    }

}

// Arrancamos la aplicacion cuando el DOM este listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});