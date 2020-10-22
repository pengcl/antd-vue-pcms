const items = [
  { srNo: '1.1' },
  { srNo: '1.1.1' },
  { srNo: '1.1.2' },
  { srNo: '1.2' },
  { srNo: '1.2.2' },
  { srNo: '1.2.1' },
  { srNo: '1.3' },
  { srNo: '1.3.1' },
  { srNo: '1.3.2' }
]

function toNum (a) {
  a = a.toString()
  const c = a.split('.')
  const r = ['', '0', '00', '000', '0000'].reverse()
  for (let i = 0; i < c.length; i++) {
    const len = c[i].length
    c[i] = r[len] + c[i]
  }
  return c.join('')
}

function add (str) {
  const filterItems = items.filter(item => item.srNo.indexOf(str) === 0).sort((a, b) => b.srNo - a.srNo)
  filterItems.sort((a, b) => {
    return toNum(b.srNo) - toNum(a.srNo)
  })
  console.log(filterItems)
}

add('1.2')
