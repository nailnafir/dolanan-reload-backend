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
            res.redirect('bank');
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/bank/create');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('bank');
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
            res.redirect('bank');
        }
    },
    // viewEdit: async (req, res) => {
    //     try {
    //         const { id } = req.params;

    //         let nominal = await NominalModel.findOne({ _id: id });

    //         res.render('admin/nominal/edit', { nominal });
    //     } catch (error) {
    //         req.flash('alertMessage', `${error.message}`);
    //         req.flash('alertStatus', 'danger');
    //         res.redirect('nominal');
    //     }
    // },
    // actionEdit: async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const { coinName, coinQuantity, price } = req.body;

    //         await NominalModel.findOneAndUpdate({ _id: id }, { coinName, coinQuantity, price });

    //         req.flash('alertMessage', "Berhasil ubah data");
    //         req.flash('alertStatus', "success");

    //         res.redirect('/nominal');
    //     } catch (error) {
    //         req.flash('alertMessage', `${error.message}`);
    //         req.flash('alertStatus', 'danger');
    //         res.redirect('nominal');
    //     }
    // },
    // actionDelete: async (req, res) => {
    //     try {
    //         const { id } = req.params;

    //         await NominalModel.findOneAndRemove({ _id: id });

    //         req.flash('alertMessage', "Berhasil hapus data");
    //         req.flash('alertStatus', "success");

    //         res.redirect('/nominal');
    //     } catch (error) {
    //         req.flash('alertMessage', `${error.message}`);
    //         req.flash('alertStatus', 'danger');
    //         res.redirect('nominal');
    //     }
    // }
}