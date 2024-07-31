const converter = require("bech32-converting")

let bech32Address = "init1pyq6amga29zfsldw8k26kgvl7a0fhf3kftflmr";

const hexAddress = converter('init').toHex(bech32Address)
console.log(hexAddress) // 0x0901aeeD1d5144987DaE3D95AB219ff75e9bA636

bech32Address = converter('init').toBech32(hexAddress)
console.log(bech32Address) // init1pyq6amga29zfsldw8k26kgvl7a0fhf3kftflmr