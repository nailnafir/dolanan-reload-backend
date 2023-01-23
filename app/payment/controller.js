const PaymentModel = require('./model');
const BankModel = require('../bank/model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            let payment = await PaymentModel.find().populate('bank');
            console.log(payment);

            res.render('admin/payment/view_payment', { payment, alert });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('payment');
        }
    },
    viewCreate: async (req, res) => {
        try {
            let bank = await BankModel.find();
            res.render('admin/payment/create', { bank });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('payment');
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { bank, type } = req.body;

            let payment = await PaymentModel({ bank, type });
            await payment.save();

            req.flash('alertMessage', "Berhasil tambah data");
            req.flash('alertStatus', "success");

            res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('payment');
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            let payment = await PaymentModel.findOne({ _id: id }).populate('bank');
            let bank = await BankModel.find();

            res.render('admin/payment/edit', { payment, bank });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('payment');
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { bank, type } = req.body;

            await PaymentModel.findOneAndUpdate({ _id: id }, { bank, type });

            req.flash('alertMessage', "Berhasil ubah data");
            req.flash('alertStatus', "success");

            res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('payment');
        }
    },
    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            let payment = await PaymentModel.findOne({ _id: id });

            let status = payment.status === 'Y' ? 'N' : 'Y';

            payment = await PaymentModel.findOneAndUpdate({ _id: id }, { status });

            req.flash('alertMessage', "Berhasil ubah status");
            req.flash('alertStatus', "success");

            res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('payment');
        }
    }
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