export const currencyFormatter = Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'})
export const percentageFormatter = Intl.NumberFormat('en-GB',{style:'percent'})
export const dtConfig:Intl.DateTimeFormatOptions = {month:'short',year:'numeric',day:'numeric',hour12:true,minute:'numeric',hour:'numeric',timeZone:'UTC'}

export const formatPrice = (amt:number) => currencyFormatter.format(amt * 0.01)
export const formatDate = (d:number) => new Date(d).toLocaleString('en-GB',dtConfig)