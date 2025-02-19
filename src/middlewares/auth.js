const adminAuth = (req, res, next) => {
    console.log('Authorize Admin!')
    // Logic to check if user is admin
    const token = 'abc123'
    const isAdminAuthorized = token === 'abc123'
    if (!isAdminAuthorized) {
        res.status(401).send('Unauthorized')
    } else {
        next()
    }
}

const userAuth = (req, res, next) => {
    console.log('Authorize User!')
    const token = 'xyz123'
    const isUserAuthorized = token === 'xyz123'
    if(!isUserAuthorized) {
        res.status(401).send('Unauthorized')
    } else {
        next()
    }
}

module.exports = {
    adminAuth,
    userAuth
}