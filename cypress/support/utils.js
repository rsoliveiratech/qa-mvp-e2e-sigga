class Util {
    getRandomPhone() {
        return Math.floor(Math.random() * 99999999999 + 1)
    }

    getRandonPassword() {
        return Math.random().toString(36).slice(-7)
    }

    getRandonCode(tamanho = 6) {
        const letras = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        let aleatorio = '';
        for (let i = 0; i < tamanho; i++) {
            const rnum = Math.floor(Math.random() * letras.length);
            aleatorio += letras.substring(rnum, rnum + 1);
        }
        return aleatorio;
    }

    screenshot() {
        const dateFull = new Date();

        const d = String(dateFull.getDate()).padStart(2, '0')
        const month = String(dateFull.getMonth() + 1).padStart(2, '0')
        const y = dateFull.getFullYear()
        const hh = String(dateFull.getHours()).padStart(2, '0')
        const mm = String(dateFull.getMinutes()).padStart(2, '0')
        const ss = String(dateFull.getSeconds()).padStart(2, '0')

        // Use a filesystem-safe filename (no colons or spaces)
        const dateTimeCurrent = `${y}-${month}-${d}_${hh}-${mm}-${ss}`

        cy.screenshot(dateTimeCurrent)
    }
}

export default new Util()