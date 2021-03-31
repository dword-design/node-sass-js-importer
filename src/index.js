import jsontosass from 'jsontosass'
import P from 'path'
import resolveFrom from 'resolve-from'

export default (url, prev) => {
  const path = resolveFrom.silent(
    P.dirname(prev),
    url[0] === '~' ? url.substr(1) : `./${url}`
  )
  if (path !== undefined) {
    const extension = P.extname(path)
    if (['.js', '.json'].includes(extension)) {
      return {
        contents: path |> require |> JSON.stringify |> jsontosass.convert,
      }
    }
  }

  return null
}
