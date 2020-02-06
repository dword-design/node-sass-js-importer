import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { readFile } from 'fs-extra'
import P from 'path'
import { endent } from '@dword-design/functions'

export default () => withLocalTmpDir(__dirname, async () => {
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
  await spawn('node-sass', ['--output', 'dist', '--importer', require.resolve('@dword-design/node-sass-importer'), 'src'])
  expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
    body {
      background: red; }
  ` + '\n')
})
