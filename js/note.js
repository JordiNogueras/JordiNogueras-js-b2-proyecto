import { BlockHeading } from './blockHeading.js';
import { BlockParagraph } from './blockParagraph.js';
import { BlockImage } from './blockImage.js';

class Note {

    id;
    name;
    date_created;
    date_updated;
    blocks;

    constructor(id, name) {
        this.id = id;
        this.name = name || 'Sin nombre';
        const ahora = new Date().toLocaleDateString('es-ES');
        this.date_created = ahora;
        this.date_updated = ahora;
        this.blocks = [];
    }

    // addBlock: añade bloque al final
    addBlock(block) {
        this.blocks.push(block);
        this._updateDate();
    }

    //removeBlock: elimina bloque por posicion
    removeBlock(position) {
        this.blocks.splice(position, 1);
        this._updateDate();
    }

    // Actualiza la fecha de modificacion
    _updateDate() {
        this.date_updated = new Date().toLocaleDateString('es-ES');
    }

    //plain: version JSON para persistencia
    plain() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            date_created: this.date_created,
            date_updated: this.date_updated,
            blocks: this.blocks.map(block => block.plain())
        });
    }

    //parse: carga nota desde JSON guardado
    parse(jsonNote) {
        const data = typeof jsonNote === 'string' ? JSON.parse(jsonNote) : jsonNote;
        this.id = data.id;
        this.name = data.name;
        this.date_created = data.date_created;
        this.date_updated = data.date_updated;

        // Reconstruimos cada bloque segun su tipo
        this.blocks = data.blocks.map(blockData => {
            let block;
            if (blockData.type === 'heading') {
                block = new BlockHeading();
            } else if (blockData.type === 'paragraph') {
                block = new BlockParagraph();
            } else if (blockData.type === 'image') {
                block = new BlockImage();
            }
            block.parse(blockData);
            return block;
        });
    }


    render() {
        if (this.blocks.length === 0) {
            return '<p class="empty-msg">Esta nota no tiene bloques todavia.</p>';
        }
        return this.blocks.map(block => block.render()).join('');
    }

}

export { Note };