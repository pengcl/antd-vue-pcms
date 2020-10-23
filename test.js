const items = [
  { srNo: '1.1' },
  { srNo: '1.1.1' },
  { srNo: '1.1.2' },
  { srNo: '1.12.1' },
  { srNo: '1.2' },
  { srNo: '1.2.2' },
  { srNo: '1.2.1' },
  { srNo: '1.21.1' },
  { srNo: '1.3' },
  { srNo: '1.3.1' },
  { srNo: '1.3.2' },
  { srNo: '2.1' },
  { srNo: '2.1.1' }
]

function toNum (a) {
  a = a.toString()
  const c = a.split('.')
  return c.join('')
}

function add (str) {
  const filterItems = str ? items.filter(item => item.srNo.indexOf(str) === 0).sort((a, b) => b.srNo - a.srNo) : items
  filterItems.sort((a, b) => {
    return toNum(b.srNo) - toNum(a.srNo)
  })
  console.log(filterItems)
  const arr = str ? filterItems[0].srNo.split('.').reverse() : filterItems[0].srNo.split('.')
  arr[0] = parseInt(arr[0], 10) + 1 + ''
  return arr.reverse()
  // console.log(parseInt(filterItems[0].split('.').reverse()[0],10) + 1)
}

add(0)
