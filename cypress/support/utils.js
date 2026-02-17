module.exports = {
  uniqueEmail() {
    const unique = `${Date.now()}_${Math.floor(Math.random() * 10000)}`
    return `usuario_${unique}@exemplo.com`
  },

  uniquePhone() {
    const ddd = 11 + Math.floor(Math.random() * 89)
    const number = 900000000 + Math.floor(Math.random() * 100000000)
    return `${ddd}${number}`
  },

  strongPassword() {
    const unique = `${Date.now()}${Math.floor(Math.random() * 10000)}`
    return `Teste@${unique}`
  }
}