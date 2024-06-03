export const CountBmuId = (index) => {
  const IdObj = {
    ClusterId: 1,
    PackID: 1
  }
  if (index < 50) {
    IdObj.ClusterId = 1
    if (Math.floor(+index / 10) % 2 === 0) {
      IdObj.PackID = +index + 1
    } else {
      const sumcount = Math.floor(+index / 10) * 20 + 10
      IdObj.PackID = sumcount - +index
    }
  } else if (index >= 50 && index < 100) {
    IdObj.ClusterId = 2
    index = index - 50
    if (Math.floor(+index / 10) % 2 === 0) {
      IdObj.PackID = +index + 1
    } else {
      const sumcount = Math.floor(+index / 10) * 20 + 10
      IdObj.PackID = sumcount - +index
    }
  } else if (index >= 100 && index < 150) {
    IdObj.ClusterId = 3
    index = index - 100
    if (Math.floor(+index / 10) % 2 === 0) {
      IdObj.PackID = +index + 1
    } else {
      const sumcount = Math.floor(+index / 10) * 20 + 10
      IdObj.PackID = sumcount - +index
    }
  } else {
    IdObj.ClusterId = 4
    index = index - 150
    if (Math.floor(+index / 10) % 2 === 0) {
      IdObj.PackID = +index + 1
    } else {
      const sumcount = Math.floor(+index / 10) * 20 + 10
      IdObj.PackID = sumcount - +index
    }
  }

  return IdObj
}
