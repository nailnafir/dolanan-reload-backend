const PlayerModel = require('../player/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const payload = req.body;

            if (req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let fileName = req.file.filename + '.' + originalExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${fileName}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);
                src.on('end', async () => {
                    try {
                        const player = await PlayerModel({ ...payload, avatar: fileName });
                        await player.save();

                        delete player._doc.password;

                        res.status(201).json({ data: player });
                    } catch (error) {
                        if (error && error.name === "ValidationError") {
                            return res.status(422).json({
                                error: 1,
                                message: error.message,
                                fields: error.errors
                            });
                        }
                        next(error);
                    }
                });
            } else {
                let player = new PlayerModel(payload);

                await player.save();
                delete player._doc.password;

                res.status(201).json({ data: player });
            }
        } catch (error) {
            if (error && error.name === "ValidationError") {
                return res.status(422).json({
                    error: 1,
                    message: error.message,
                    fields: error.errors
                });
            }
            next(error);
        }
    },
    signIn: (req, res, next) => {
        const { email, password } = req.body;

        PlayerModel.findOne({ email: email }).then((player) => {
            if (player) {
                const checkPassword = bcrypt.compareSync(password, player.password);
                if (checkPassword) {
                    const token = jwt.sign({
                        player: {
                            id: player.id,
                            username: player.username,
                            email: player.email,
                            name: player.name,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar,
                        }
                    }, config.jwtKey);

                    res.status(200).json({ data: { token } });
                } else {
                    res.status(403).json({ message: 'Password yang Anda masukkan salah' });
                }
            } else {
                res.status(403).json({ message: 'Email yang Anda masukkan belum terdaftar' });
            }
        }).catch((error) => {
            res.status(500).json({ message: error.message || 'Terjadi Kesalahan Pada Server' });
            next();
        });
    }
}