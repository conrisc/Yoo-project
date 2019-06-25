function signIn(req, res) {
    if (req.body.login === 'john' && req.body.password === 'dorian')
        res.send({ 'login': 'success'});
    else 
        res.send({ 'login': 'fail'});
}

export {
    signIn
}