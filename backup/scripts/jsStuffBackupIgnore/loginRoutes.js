import express from 'express'; 

export default express.Router().get('/',  (req, res) => {
    const name = process.env.NAME || 'Dev';
    res.render('login',{name:name});
});
