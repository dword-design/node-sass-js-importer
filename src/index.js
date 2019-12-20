import jsontosass from 'jsontosass'
import resolveFrom from 'resolve-from'
import P from 'path'
import { readFileSync } from 'fs-extra'

export default (url, prev) => {
  if (url[0] === '~') {
    const path = resolveFrom.silent(P.dirname(prev), url.substr(1))
    if (path !== undefined) {
      const extension = P.extname(path)
      if (['.scss', '.sass'].includes(extension)) {
        return { file: path }
      } else if (extension === '.css') {
        return { contents: readFileSync(path, 'utf8') }
      } else if (['.js', '.json'].includes(extension)) {
        return { contents: jsontosass.convert(JSON.stringify(require(path))) }
      }
    }
  }
  return null
}
