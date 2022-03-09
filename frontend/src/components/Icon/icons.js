/* eslint sort-imports: 'error' */
/* eslint sort-keys: 'error' */
import upload from '!svg-sprite-loader!@/assets/svg/icon-upload.svg'

const ICONS = {
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
