import { Block } from './block.js';

class BlockHeading extends Block {

    constructor() {
        super('heading');
        this.level = 1;
        this.color = '000000';
    }

    parse(jsonBlock) {
        super.parse(jsonBlock);
        this.level = jsonBlock.config.level || 1;
        this.color = jsonBlock.config.color || '000000';
    }

    plain() {
        return {
            type: this.type,
            content: this.content,
            config: {
                level: this.level,
                color: this.color
            }
        };
    }

    render() {
        return `<div class="block-item block-heading-${this.level}" style="color:#${this.color}">
      ${this.content || 'Heading vacío'}
    </div>`;
    }

}

export { BlockHeading };