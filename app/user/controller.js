const UserModel = require('./model');
const bcrypt = require('bcryptjs');

module.exports = {
    viewSignIn: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };

            if (req.session.user === null || req.session.user === undefined) {
                res.render('admin/user/view_sign_in', { alert });
            } else {
                res.redirect('/dashboard');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        }
    },
    actionSignIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const check = await UserModel.findOne({ email: email });

            if (check) {
                if (check.status === 'Y') {
                    const checkPassword = await bcrypt.compare(password, check.password);
                    if (checkPassword) {
                        req.session.user = {
                            id: check._id,
                            email: check.email,
                            status: check.status,
                            name: check.name
                        };
                        res.redirect('/dashboard');
                    } else {
                        req.flash('alertMessage', 'Password yang Anda masukkan salah');
                        req.flash('alertStatus', 'danger');
                        res.redirect('/');
                    }
                } else {
                    req.flash('alertMessage', 'Mohon maaf, status Anda belum aktif');
                    req.flash('alertStatus', 'danger');
                    res.redirect('/');
                }
            } else {
                req.flash('alertMessage', 'Email yang Anda masukkan salah');
                req.flash('alertStatus', 'danger');
                res.redirect('/');
            }

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        }
    }
}