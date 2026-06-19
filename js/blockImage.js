// js/blockImage.js
// Bloque Image - PDF seccion 02.04

import { Block } from './block.js';

class BlockImage extends Block {

    constructor() {
        super('image');
        this.upscale = true;
        this.units = '%';
        this.maxWidth = 100;
    }

    parse(jsonBlock) {
        super.parse(jsonBlock);
        this.upscale = jsonBlock.config.upscale !== undefined ? jsonBlock.config.upscale : true;
        this.units = jsonBlock.config.units || '%';
        this.maxWidth = jsonBlock.config['max-width'] || 100;
    }

    plain() {
        return {
            type: this.type,
            content: this.content,
            config: {
                upscale: this.upscale,
                units: this.units,
                'max-width': this.maxWidth
            }
        };
    }

    render() {
        if (!this.content) {
            return `<div class="block-item block-image">Sin imagen</div>`;
        }
        const maxWidthStyle = this.upscale ?
            `max-width:${this.maxWidth}${this.units}` :
            `max-width:auto`;
        return `<div class="block-item block-image">
      <img src="${this.content}" style="width:100%;height:auto;${maxWidthStyle}" />
    </div>`;
    }

}

export { BlockImage };