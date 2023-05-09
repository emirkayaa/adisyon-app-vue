const formatter = new Intl.NumberFormat('tr-TR', {
    //style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

export default formatter