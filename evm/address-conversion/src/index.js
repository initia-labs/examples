const converter = require("bech32-converting")

let bech32Address = "init1735qkcsrxa438ezvsnhj4csyrelrdr7a2xkxas";

const hexAddress = converter('init').toHex(bech32Address)
console.log(hexAddress) // 0xd6c82a78C3c898449A63c85fed7C4c6cDdb20CD5

bech32Address = converter('init').toBech32(hexAddress)
console.log(bech32Address) // init1735qkcsrxa438ezvsnhj4csyrelrdr7a2xkxas