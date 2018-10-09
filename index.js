class WebpackEntriesChunksResolvePlugin {
    /**
     * @param {bool} options.generateWithScriptTags define if the output file will contain script tags associated with entry(ies)
     * @param {string} options.scriptTagPathPrefix define the prefix path of the script tag source attribute.
     * @param {string} options.fileName resulting filename. Default is entries-dependencies.txt.
     */
    constructor(options) {
        this.options = options;

        if (!options || !optiosn.fileName) {
            this.options.fileName = 'entries-dependencies.txt';
        }
    }

    apply(compiler) {
        compiler.hooks.emit.tap(
            'WebpackEntriesChunksResolvePlugin',
            (compilation) => {
                
                debugger;

                const dependenciesGraph = {};

                const entriesIterator = compilation.entrypoints.entries();
                for (let entry = entriesIterator.next(); !entry.done; entry = entriesIterator.next()) {
                    let name = entry.value[0];
                    let chunks = entry.value[1].chunks;
                    dependenciesGraph[name] = [];

                    chunks.map(x => x.files).forEach(files =>
                        files.forEach(file => dependenciesGraph[name].push(file))
                    );

                    // for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
                    //     let files = chunks[chunkIndex].files;
                    //     for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
                    //         dependenciesGraph[name].push(files[fileIndex]);
                    //     }
                    // }
                }

                let scriptsPerEntry = "";

                for (const entry in dependenciesGraph) {
                    scriptsPerEntry += `${entry}\n`;
                    if (dependenciesGraph.hasOwnProperty(entry)) {
                        dependenciesGraph[entry].forEach(file => {
                            scriptsPerEntry += `<script src="./${file}"></script>\n`;
                        });
                    }
                }

                compilation.assets["dependency-graph.txt"] = {
                    source: () => scriptsPerEntry,
                    size: () => scriptsPerEntry.length
                }
            }
        );
    }
}

module.exports = WebpackEntriesChunksResolvePlugin;