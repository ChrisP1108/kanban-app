export function caseFormatAll(string: string): string {
    return string.toString().split(' ')
        .map(letter => letter[0].toUpperCase() + letter.slice(1).toLowerCase())
        .join(' ')
}

export function caseFormatFirst(string: string): string {
    return string[0].toUpperCase + string.slice(1)
}