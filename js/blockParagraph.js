import { Block } from './block.js';

class BlockParagraph extends Block {

    constructor() {
        super('paragraph');
        this.highlight = false;
    }

    parse(jsonBlock) {
        super.parse(jsonBlock);
        this.highlight = jsonBlock.config.highlight || false;
    }

    plain() {
        return {
            type: this.type,
            content: this.content,
            config: {
                highlight: this.highlight
            }
        };
    }

    render() {
        const highlightClass = this.highlight ? 'highlight' : '';
        return `<div class="block-item block-paragraph ${highlightClass}">
      ${this.content || 'Parrafo vacio'}
    </div>`;
    }

}

export { BlockParagraph };