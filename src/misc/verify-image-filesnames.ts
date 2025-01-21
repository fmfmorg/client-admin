const imageExtAccepted = ['jpeg','jpg','png']

export const verifyImageFilenames = (filenameStr:string, section:string) => {
    const filenames = filenameStr.split('\n').map(e=>e.trim())
    const filenamesWithErr = filenames.filter(e=>{
        const parts = e.split('.')
        const len = parts.length
        if (len < 2) return true
        const ext = parts[len-1].toLowerCase()
        return imageExtAccepted.indexOf(ext) === -1
    })

    if (!!filenamesWithErr.length) {
        alert(`Invalid ${section} images:\n${filenamesWithErr.join('\n')}`)
        return []
    } else return filenames
}