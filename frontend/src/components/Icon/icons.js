/* eslint sort-imports: 'error' */
/* eslint sort-keys: 'error' */
import pencil from '!svg-sprite-loader!@/assets/svg/icon-pencil.svg'
import upload from '!svg-sprite-loader!@/assets/svg/icon-upload.svg'

const ICONS = {
  pencil,
  upload,
}

function camelCaseToDash(str) {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

Object.keys(ICONS).forEach((key) => {
  const dashKey = camelCaseToDash(key)
  ICONS[dashKey] = ICONS[key]
})

export default ICONS
