import execa from 'execa'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { readFile } from 'fs-extra'
import P from 'path'
import { endent } from '@dword-design/functions'

export default {
  'contrib main css import': () => withLocalTmpDir(async () => {
    await outputFiles({
      'node_modules/bar': {
        'index.js': 'module.exports = 1',
        'index.css': 'html { background: green; }',
        'package.json': JSON.stringify({ main: 'index.css' }),
      },
      'package.json': JSON.stringify({
        dependencies: {
          'bar': '^1.0.0',
        },
      }),
      'src/index.scss': endent`
        @import '~bar';

        body {
          background: red;
        }
      `,
    })
    await execa('node-sass', ['--output', 'dist', '--importer', require.resolve('.'), 'src'])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      html {
        background: green; }

      body {
        background: red; }

    `)
  }),
  'contrib main scss import': () => withLocalTmpDir(async () => {
    await outputFiles({
      'node_modules/bar': {
        'index.js': 'module.exports = 1',
        'index.scss': '$color: red;',
        'package.json': JSON.stringify({ main: 'index.scss' }),
      },
      'package.json': JSON.stringify({
        dependencies: {
          'bar': '^1.0.0',
        },
      }),
      'src/index.scss': endent`
        @import '~bar';

        body {
          background: $color;
        }
      `,
    })
    await execa('node-sass', ['--output', 'dist', '--importer', require.resolve('.'), 'src'])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      body {
        background: red; }

    `)
  }),
  'contrib sass import': () => withLocalTmpDir(async () => {
    await outputFiles({
      'node_modules/bar': {
        'index.scss': '$color: red;',
        'package.json': JSON.stringify({ main: 'index.scss' }),
      },
      'package.json': JSON.stringify({
        dependencies: {
          'bar': '^1.0.0',
        },
      }),
      'src/index.scss': endent`
        @import '~bar';

        body {
          background: $color;
        }
      `,
    })
    await execa('node-sass', ['--output', 'dist', '--importer', require.resolve('.'), 'src'])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      body {
        background: red; }

    `)
  }),
  'contrib scss import without extension': () => withLocalTmpDir(async () => {
    await outputFiles({
      'node_modules/bar/foo.scss': '$color: red;',
      'package.json': JSON.stringify({
        dependencies: {
          'bar': '^1.0.0',
        },
      }),
      src: {
        'index.scss': endent`
          @import '~bar/foo';

          body {
            background: $color;
          }
        `,
      },
    })
    await execa('node-sass', ['--output', 'dist', '--importer', require.resolve('.'), 'src'])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      body {
        background: red; }

    `)
  }),
  'local sass import': () => withLocalTmpDir(async () => {
    await outputFiles({
      src: {
        'bar.scss': '$color: red',
        'index.scss': endent`
          @import 'bar';

          body {
            background: $color;
          }
        `,
      },
    })
    await execa('node-sass', ['--output', 'dist', '--importer', require.resolve('.'), 'src'])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      body {
        background: red; }

    `)
  }),
  'js import': () => withLocalTmpDir(async () => {
    await outputFiles({
      'node_modules/bar/index.js': 'module.exports = { color: \'red\' }',
      'package.json': JSON.stringify({
        dependencies: {
          'bar': '^1.0.0',
        },
      }),
      'src/index.scss': endent`
        @import '~bar';

        body {
          background: $color;
        }
      `,
    })
    await execa('node-sass', ['--output', 'dist', '--importer', require.resolve('.'), 'src'])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      body {
        background: red; }

    `)
  }),
  'local js import': () => withLocalTmpDir(async () => {
    await outputFiles({
      src: {
        'bar.js': 'module.exports = { color: \'red\' }',
        'index.scss': endent`
          @import 'bar.js';

          body {
            background: $color;
          }
        `,
      },
    })
    await execa('node-sass', ['--output', 'dist', '--importer', require.resolve('.'), 'src'])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      body {
        background: red; }

    `)
  }),
}
