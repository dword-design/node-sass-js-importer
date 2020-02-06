import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { readFile } from 'fs-extra'
import P from 'path'
import { endent } from '@dword-design/functions'

export default () => withLocalTmpDir(__dirname, async () => {
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
  await spawn('node-sass', ['--output', 'dist', '--importer', require.resolve('@dword-design/node-sass-importer'), 'src'])
  expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
    html {
      background: green; }

    body {
      background: red; }
  ` + '\n')
})
