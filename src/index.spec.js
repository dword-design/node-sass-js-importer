import execa from 'execa'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { readFile } from 'fs-extra'
import P from 'path'
import { endent } from '@dword-design/functions'

export default {
  contrib: () => withLocalTmpDir(async () => {
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
  local: () => withLocalTmpDir(async () => {
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
