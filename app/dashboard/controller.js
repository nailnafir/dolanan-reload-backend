const TransactionModel = require('../transaction/model');
const VoucherModel = require('../voucher/model');
const PlayerModel = require('../player/model');
const CategoryModel = require('../category/model');

module.exports = {
    index: async (req, res) => {
        try {
            const transaction = await TransactionModel.countDocuments();
            const voucher = await VoucherModel.countDocuments();
            const player = await PlayerModel.countDocuments();
            const category = await CategoryModel.countDocuments();
            res.render('admin/dashboard/view_dashboard', {
                name: req.session.user.name,
                title: 'Halaman Beranda',
                count: {
                    transaction,
                    voucher,
                    player,
                    category
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}