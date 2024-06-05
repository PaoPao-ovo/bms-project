export const RetryFun = (fn, delay, maxAttempts, originID) => {
  clearInterval(originID)
  return new Promise(function (resolve) {
    let retryID = setInterval(async () => {
      const result = await fn()
      maxAttempts--
      if (maxAttempts === 0) {
        clearInterval(retryID)
        resolve(null)
      } else if (result !== null) {
        clearInterval(retryID)
        resolve(fn)
      }
    }, delay)
  })
}

export const RetryFun1 = (fn, delay, maxAttempts, originID, args) => {
  clearInterval(originID)
  return new Promise(function (resolve) {
    let retryID = setInterval(async () => {
      const result = await fn(args)
      maxAttempts--
      if (maxAttempts === 0) {
        clearInterval(retryID)
        resolve(null)
      } else if (result !== null) {
        clearInterval(retryID)
        resolve(fn)
      }
    }, delay)
  })
}

export const RetryFun2 = (fn, delay, maxAttempts, originID, args) => {
  clearInterval(originID)
  return new Promise(function (resolve) {
    let retryID = setInterval(async () => {
      const result1 = await fn(args[0])
      const result2 = await fn(args[1])
      maxAttempts--
      if (maxAttempts === 0) {
        clearInterval(retryID)
        resolve(null)
      } else if (result1 !== null && result2 !== null) {
        clearInterval(retryID)
        resolve(fn)
      }
    }, delay)
  })
}
