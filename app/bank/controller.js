const BankModel = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            let bank = await BankModel.find();

            res.render('admin/bank/view_bank', { bank, alert });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/bank/create');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name, bankName, accountNumber } = req.body;

            let bank = await BankModel({ name, bankName, accountNumber });
            await bank.save();

            req.flash('alertMessage', "Berhasil tambah data");
            req.flash('alertStatus', "success");

            res.redirect('/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            let bank = await BankModel.findOne({ _id: id });

            res.render('admin/bank/edit', { bank });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, bankName, accountNumber } = req.body;

            await BankModel.findOneAndUpdate({ _id: id }, { name, bankName, accountNumber });

            req.flash('alertMessage', "Berhasil ubah data");
            req.flash('alertStatus', "success");

            res.redirect('/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await BankModel.findOneAndRemove({ _id: id });

            req.flash('alertMessage', "Berhasil hapus data");
            req.flash('alertStatus', "success");

            res.redirect('/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    }
}