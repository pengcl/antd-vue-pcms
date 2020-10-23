const items = []

function compare (a, b) {
  if (a === b) {
    return 0
  }

  const aComponents = a.split('.')
  const bComponents = b.split('.')

  const len = Math.min(aComponents.length, bComponents.length)

  // loop while the components are equal
  for (let i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(aComponents[i]) > parseInt(bComponents[i])) {
      return 1
    }

    // B bigger than A
    if (parseInt(aComponents[i]) < parseInt(bComponents[i])) {
      return -1
    }
  }

  // If one's a prefix of the other, the longer one is greater.
  if (aComponents.length > bComponents.length) {
    return 1
  }

  if (aComponents.length < bComponents.length) {
    return -1
  }

  // Otherwise they are the same.
  return 0
}

function add (str) {
  const isRoot = str === '0' || !str
  const filterItems = !isRoot ? items.filter(item => item.srNo.indexOf(str) === 0).sort((a, b) => b.srNo - a.srNo) : items
  filterItems.sort((a, b) => {
    return compare(b.srNo, a.srNo)
  })
  const arr = !isRoot ? filterItems[0].srNo.split('.').reverse() : filterItems[0].srNo.split('.')
  arr[0] = parseInt(arr[0], 10) + 1 + ''
  return !isRoot ? arr.reverse() : arr[0]
}

add(0)
