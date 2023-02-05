const config = require('../../config');
const jwt = require('jsonwebtoken');
const PlayerModel = require('../player/model');

module.exports = {
    isLoginAdmin: (req, res, next) => {
        if (req.session.user === null || req.session.user === undefined) {
            req.flash('alertMessage', 'Mohon maaf, sesi Anda telah habis. Silakan masuk kembali');
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        } else {
            next();
        }
    },
    isLoginPlayer: async (req, res, next) => {
        try {
            const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
            const data = jwt.verify(token, config.jwtKey);
            const player = await PlayerModel.findOne({ _id: data.player.id });

            if (!player) {
                throw new Error();
            }

            req.player = player;
            req.token = token;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Tidak ada hak akses' })
        }
    }
}