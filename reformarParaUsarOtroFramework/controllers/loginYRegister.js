import logger from '../loggers/loggers.js'


export const login = async ctx => {
    logger.info('/login')
    if (await ctx.isAuthenticated()) {
        return ctx.response.redirect('/succesfull-login')
    }
    await ctx.render('login')
}


export const register = async ctx => {
    logger.info('/register')
    if (await ctx.isAuthenticated()) {
        return ctx.response.redirect('/succesfull-login')
    }
    await ctx.render('register')
}

export const failLogin = async ctx => {
    logger.info('/fail-login')
    await ctx.render('failLogin')
}

export const failRegister = async ctx => {
    logger.info('/fail-register')
    await ctx.render('failRegister')
}


export const succesfullLogin = async ctx => {
    logger.info('/succesfull-login')
    if (await ctx.isAuthenticated()) {
        return await ctx.render('loginExitoso', {user: ctx.session.passport.user})
    } else {
        ctx.response.redirect('/login')
    }
}

export const logout = async ctx => {
    logger.info('/logout')
    ctx.logout(err => {
        ctx.response.redirect('/login')
    })
} 