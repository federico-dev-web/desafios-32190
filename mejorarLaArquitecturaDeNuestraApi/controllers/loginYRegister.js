import logger from '../loggers/loggers.js'


export const login = async (req, res) => {
    logger.info('/login')
    if (await req.isAuthenticated()) {
        return res.redirect('/succesfull-login')
    }
    res.render('login')
}


export const register = async (req, res) => {
    logger.info('/register')
    if (await req.isAuthenticated()) {
        return res.redirect('/succesfull-login')
    }
    res.render('register')
}

export const failLogin = (req, res) => {
    logger.info('/fail-login')
    res.render('failLogin')
}

export const failRegister = (req, res) => {
    logger.info('/fail-register')
    res.render('failRegister')
}


export const succesfullLogin = async (req, res) => {
    logger.info('/succesfull-login')
    if (await req.isAuthenticated()) {
        return res.render('loginExitoso', {user: req.user.username})
    } else {
        res.redirect('/login')
    }
}

export const logout = (req, res) => {
    logger.info('/logout')
    req.logout(err => {
        res.redirect('/login')
    })
} 