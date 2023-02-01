const PlayerModel = require('./model');
const VoucherModel = require('../voucher/model');

module.exports = {
    landingPage: async (req, res) => {
        try {
            const voucher = await VoucherModel.find()
                .select('_id name status category thumbnail')
                .populate('category');
            res.status(200).json({ data: voucher });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Terjadi Kesalahan Pada Server' });
        }
    },
    detailPage: async (req, res) => {
        try {
            const { id } = req.params;
            const voucher = await VoucherModel.findOne({ _id: id })
                .populate('category')
                .populate('nominal')
                .populate('user', '_id name phoneNumber');

            if (!voucher) {
                return res.status(404).json({ message: 'Voucher Game Tidak Ditemukan' });
            }
            res.status(200).json({ data: voucher });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Terjadi Kesalahan Pada Server' });
        }
    },
}