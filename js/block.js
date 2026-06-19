class Block {

    type;
    content;

    constructor(type) {
        this.type = type;
        this.content = '';
    }

    render() {
        return '';
    }

    parse(jsonBlock) {
        if (jsonBlock.type !== this.type) {
            throw new Error(`ERROR_PARSE. El tipo "${jsonBlock.type}" no corresponde con "${this.type}".`);
        }
        this.content = jsonBlock.content || '';
    }

    plain() {
        return {
            type: this.type,
            content: this.content,
            config: {}
        };
    }

}

export {
    Block
};