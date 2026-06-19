import { Note } from './note.js';
import { BlockHeading } from './blockHeading.js';
import { BlockParagraph } from './blockParagraph.js';
import { BlockImage } from './blockImage.js';

class NoteDetail {

    _storage;
    _nota;
    _esNueva;
    _bloqueEditando;
    _indiceBloqueEditando;
    _onSave;
    _onDiscard;
    _onDelete;

    constructor(storage, onSave, onDiscard, onDelete) {
        this._storage = storage;
        this._onSave = onSave;
        this._onDiscard = onDiscard;
        this._onDelete = onDelete;
    }

    init() {
        // Menu 3 puntos
        document.querySelector('#screen-detail .btn-menu').addEventListener('click', () => {
            document.getElementById('note-menu').classList.toggle('hidden');
        });

        // Guardar nota
        document.getElementById('btn-save-note').addEventListener('click', () => {
            this._guardar();
        });

        // Descartar
        document.getElementById('btn-discard-note').addEventListener('click', () => {
            document.getElementById('note-menu').classList.add('hidden');
            this._onDiscard();
        });

        // Eliminar nota
        document.getElementById('btn-delete-note').addEventListener('click', () => {
            document.getElementById('note-menu').classList.add('hidden');
            this._onDelete(this._nota);
        });

        // Editar nombre
        document.getElementById('note-name-display').addEventListener('click', () => {
            this._editarNombre();
        });

        // Botones añadir bloque
        document.querySelectorAll('.btn-add-block').forEach(btn => {
            btn.addEventListener('click', () => {
                this._addBlock(btn.dataset.type);
            });
        });

        // Cancelar edicion de bloque
        document.getElementById('btn-cancel-block').addEventListener('click', () => {
            this._cerrarEditorBloque();
        });

        // Guardar cambios del bloque
        document.getElementById('btn-save-block').addEventListener('click', () => {
            this._guardarBloque();
        });
    }

    load(nota) {
        this._nota = nota;
        this._esNueva = false;
        document.getElementById('btn-delete-note').classList.remove('hidden');
        this._render();
    }

    loadNueva() {
        const id = this._storage.getNextId();
        this._nota = new Note(id, '');
        this._esNueva = true;
        document.getElementById('btn-delete-note').classList.add('hidden');
        this._render();
    }

    _render() {
        document.getElementById('note-name-display').textContent = this._nota.name || 'Nueva nota';

        const contenedor = document.getElementById('note-blocks');
        contenedor.innerHTML = '';

        if (this._nota.blocks.length === 0) {
            contenedor.innerHTML = '<p class="empty-msg">Añade bloques usando los botones de abajo.</p>';
            return;
        }

        this._nota.blocks.forEach((block, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'block-wrapper';
            wrapper.dataset.index = index;

            wrapper.innerHTML = `
        <div class="block-inner">
          ${block.render()}
        </div>
        <button class="btn-delete-block" data-index="${index}" title="Eliminar bloque">✕</button>
      `;

            // Click en el bloque -> abrir editor
            wrapper.querySelector('.block-inner').addEventListener('click', () => {
                this._abrirEditorBloque(block, index);
            });

            // Click en eliminar bloque
            wrapper.querySelector('.btn-delete-block').addEventListener('click', (e) => {
                e.stopPropagation();
                this._nota.removeBlock(index);
                this._render();
            });

            contenedor.appendChild(wrapper);
        });
    }

    _editarNombre() {
        const nuevoNombre = prompt('Nombre de la nota:', this._nota.name);
        if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
            this._nota.name = nuevoNombre.trim();
            document.getElementById('note-name-display').textContent = this._nota.name;
        }
    }

    _guardar() {
        if (this._esNueva && !this._nota.name) {
            alert('La nota necesita un nombre para poder guardarse.');
            this._editarNombre();
            return;
        }
        this._nota._updateDate();
        this._storage.saveNote(this._nota);
        document.getElementById('note-menu').classList.add('hidden');
        this._onSave();
    }

    _addBlock(tipo) {
        let block;
        if (tipo === 'heading') {
            block = new BlockHeading();
        } else if (tipo === 'paragraph') {
            block = new BlockParagraph();
        } else if (tipo === 'image') {
            block = new BlockImage();
        }
        this._nota.addBlock(block);
        this._render();
    }

    _abrirEditorBloque(block, index) {
        this._bloqueEditando = block;
        this._indiceBloqueEditando = index;

        const contenedor = document.getElementById('block-editor-content');
        contenedor.innerHTML = this._renderFormularioBloque(block);

        document.getElementById('block-editor').classList.remove('hidden');
    }

    _cerrarEditorBloque() {
        document.getElementById('block-editor').classList.add('hidden');
        this._bloqueEditando = null;
        this._indiceBloqueEditando = null;
    }

    _renderFormularioBloque(block) {
            if (block.type === 'heading') {
                return `
        <h3>Edit heading</h3>
        <label>Content</label>
        <input type="text" id="input-heading-content" value="${block.content}" placeholder="Titulo..." />
        <label>Level</label>
        <select id="input-heading-level">
          <option value="1" ${block.level === 1 ? 'selected' : ''}>H1 - Principal</option>
          <option value="2" ${block.level === 2 ? 'selected' : ''}>H2 - Secundario</option>
          <option value="3" ${block.level === 3 ? 'selected' : ''}>H3 - Terciario</option>
        </select>
        <label>Color (hex)</label>
        <input type="color" id="input-heading-color" value="#${block.color}" />
      `;
            }

            if (block.type === 'paragraph') {
                return `
        <h3>Edit text</h3>
        <label>
          <input type="checkbox" id="input-paragraph-highlight" ${block.highlight ? 'checked' : ''} />
          highlight
        </label>
        <label>Content</label>
        <textarea id="input-paragraph-content" rows="5">${block.content}</textarea>
      `;
            }

            if (block.type === 'image') {
                return `
        <h3>Edit image</h3>
        <label>URL de la imagen</label>
        <input type="text" id="input-image-url" value="${block.content}" placeholder="https://..." />
        ${block.content ? `<img src="${block.content}" style="width:100%;height:auto;margin-top:8px;border-radius:6px;" />` : ''}
        <label>
          <input type="checkbox" id="input-image-upscale" ${block.upscale ? 'checked' : ''} />
          Upscale
        </label>
        <label>Units</label>
        <div>
          <label><input type="radio" name="units" value="px" ${block.units === 'px' ? 'checked' : ''} /> px</label>
          <label><input type="radio" name="units" value="%" ${block.units === '%' ? 'checked' : ''} /> percentage (%)</label>
        </div>
        <label>Max width</label>
        <input type="number" id="input-image-maxwidth" value="${block.maxWidth}" />
      `;
    }
  }

  _guardarBloque() {
    const block = this._bloqueEditando;

    if (block.type === 'heading') {
      block.content = document.getElementById('input-heading-content').value;
      block.level = parseInt(document.getElementById('input-heading-level').value);
      block.color = document.getElementById('input-heading-color').value.replace('#', '');
    }

    if (block.type === 'paragraph') {
      block.content = document.getElementById('input-paragraph-content').value;
      block.highlight = document.getElementById('input-paragraph-highlight').checked;
    }

    if (block.type === 'image') {
      block.content = document.getElementById('input-image-url').value;
      block.upscale = document.getElementById('input-image-upscale').checked;
      block.units = document.querySelector('input[name="units"]:checked').value;
      block.maxWidth = parseInt(document.getElementById('input-image-maxwidth').value) || 100;
    }

    this._cerrarEditorBloque();
    this._render();
  }

}

export { NoteDetail };