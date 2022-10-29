function caseFormatAll(string) {
    return string.toString().split(' ')
        .map(letter => letter[0].toUpperCase() + letter.slice(1).toLowerCase())
        .join(' ')
}

function caseFormatFirst(string) {
    return string[0].toUpperCase() + string.slice(1)
}

module.exports = { caseFormatAll, caseFormatFirst }