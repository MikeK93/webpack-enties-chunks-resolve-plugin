class WebpackEntriesChunksResolvePlugin {
    /**
     * @param {bool} options.generateWithScriptTags define if the output file will contain script tags associated with entry(ies). Default is true.
     * @param {string} options.scriptTagPathPrefix define the prefix path of the script tag source attribute. Default is an empty string.
     * @param {string} options.fileNameTemplate resulting filename that should contain [entryname] placeholder. Default is [entryname].txt.
     */
    constructor(options) {
        this.options = options;

        if (!options || !options.fileNameTemplate) {
            this.options.fileNameTemplate = '[entryname].txt';
        }

        if (!options) {
            this.options.generateWithScriptTags = true;
        }

        if (!options || !options.scriptTagPathPrefix) {
            this.options.scriptTagPathPrefix = '';
        }
    }

    apply(compiler) {
        compiler.hooks.emit.tap(
            'WebpackEntriesChunksResolvePlugin',
            (compilation) => {

                const entriesIterator = compilation.entrypoints.entries();
                for (let entry = entriesIterator.next(); !entry.done; entry = entriesIterator.next()) {
                    let name = entry.value[0];
                    let chunks = entry.value[1].chunks;
                    
                    const entryDependenciesAsset = {
                        name: this.options.fileNameTemplate.replace('[entryname]', name),
                        data: ''
                    };

                    chunks.map(x => x.files).forEach(files =>
                        files.forEach(file => 
                            entryDependenciesAsset.data += `${this._resolveFile(file)}\n`
                        )
                    );

                    this._addAsset(compilation, entryDependenciesAsset);

                }
            }
        );
    }

    _resolveFile(file) {
        if (!this.options.generateWithScriptTags) {
            return file;
        }

        return `<script src="${this._resolvePath(file)}"></script>`;
    }

    _resolvePath(file) {
        if (!this.options.scriptTagPathPrefix) {
            return file;
        }

        return `${this.options.scriptTagPathPrefix}/${file}`;
    }

    _addAsset(compilation, asset) {
        compilation.assets[asset.name] = {
            source: () => asset.data,
            size: () => asset.data.length
        };
    }
}

module.exports = WebpackEntriesChunksResolvePlugin;