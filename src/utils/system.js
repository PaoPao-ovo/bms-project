function getDeviceType() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  if (/Android/i.test(userAgent)) {
    return 'Mobile'
  } else if (/iPhone/i.test(userAgent) || /iPad/i.test(userAgent)) {
    return 'Mobile'
  } else if (/Windows/i.test(userAgent) || /Linux/i.test(userAgent) || /Mac/i.test(userAgent)) {
    return 'PC'
  } else {
    return 'Other'
  }
}

export default getDeviceType
