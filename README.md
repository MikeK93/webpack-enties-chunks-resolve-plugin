# webpack-enties-chunks-resolve-plugin
Resolves and writes to output directory a file containing dependencies for entries


The module helps with entries' chunks dependencies resolving by creating the file per each entrypoint with all related chunks till the entry itself.


Here is an example of the webpack console build output:
![webpack console build output](https://github.com/MikeK93/webpack-enties-chunks-resolve-plugin/blob/master/images/webpack-console-output.png?raw=true)


The plugin will generate the file for each entry with the following content:

#### one.txt
```
vendors\~one\~three-6bcb772c264febce0b60.js
one.js
```

#### two.txt
```
two.js
```

#### three.txt
```
vendors\~one\~three-6bcb772c264febce0b60.js 
three.js
```

# Available parameters
There is an `options` parameter which has the following shape:

#### fileNameTemplate
```string```

Defines the name of the resulting file which should contain `[entryname]` placeholder.

Default is `[entryname].txt`.

#### generateWithScriptTags
```boolean```

If `true` specified the resulting file will contain generated scrip tag with all files to be inserted in html.
If `false` the file will contain only files.

Default is `true`.

#### scriptTagPathPrefix
```string```

Defines the script tag path prefix to which the file of a chunk/entry will be appended.

Default is empty string.
