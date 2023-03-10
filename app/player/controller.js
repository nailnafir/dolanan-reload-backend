const PlayerModel = require('./model');
const VoucherModel = require('../voucher/model');
const NominalModel = require('../nominal/model');
const PaymentModel = require('../payment/model');
const BankModel = require('../bank/model');
const TransactionModel = require('../transaction/model');
const CategoryModel = require('../category/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

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
    category: async (req, res) => {
        try {
            const category = await CategoryModel.find();
            res.status(200).json({ data: category });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Terjadi Kesalahan Pada Server' });
        }
    },
    checkout: async (req, res) => {
        try {
            const { userAccount, name, nominal, voucher, payment, bank } = req.body;

            const res_voucher = await VoucherModel.findOne({ _id: voucher })
                .select('name category _id thumbnail user')
                .populate('category')
                .populate('user');
            const res_nominal = await NominalModel.findOne({ _id: nominal });
            const res_payment = await PaymentModel.findOne({ _id: payment });
            const res_bank = await BankModel.findOne({ _id: bank });

            if (!res_voucher) return res.status(404).json({ message: 'Voucher game tidak ditemukan' });
            if (!res_nominal) return res.status(404).json({ message: 'Nominal tidak ditemukan' });
            if (!res_payment) return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
            if (!res_bank) return res.status(404).json({ message: 'Bank tidak ditemukan' });

            let tax = (10 / 100) * res_nominal._doc.price;
            let totalValue = res_nominal._doc.price - tax;

            const payload = {
                historyVoucherTopUp: {
                    gameName: res_voucher._doc.name, // nama game
                    category: res_voucher._doc.category ? res_voucher._doc.category.name : '-',
                    thumbnail: res_voucher._doc.thumbnail,
                    coinName: res_nominal._doc.coinName,
                    coinQuantity: res_nominal._doc.coinQuantity,
                    price: res_nominal._doc.price,
                },
                historyPayment: {
                    name: res_bank._doc.name, // nama pemilik rekening
                    type: res_payment._doc.type,
                    bankName: res_bank._doc.bankName,
                    accountNumber: res_bank._doc.accountNumber,
                },
                name: name, // nama orang yang transfer
                userAccount: userAccount,
                tax: tax,
                totalValue: totalValue,
                player: req.player._id,
                historyUser: {
                    name: res_voucher._doc.user?.name,
                    phoneNumber: res_voucher._doc.phoneNumber,
                },
                category: res_voucher._doc.category?._id,
                user: res_voucher._doc.user?._id,
            }

            const transaction = new TransactionModel(payload);
            await transaction.save();

            res.status(201).json({ data: transaction });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Terjadi Kesalahan Pada Server' });
        }
    },
    history: async (req, res) => {
        try {
            const { status = '' } = req.query;

            let criteria = {};

            if (status.length) {
                criteria = {
                    ...criteria,
                    status: { $regex: `${status}`, $options: 'i' }
                }
            }

            if (req.player._id) {
                criteria = {
                    ...criteria,
                    player: req.player._id
                }
            }

            const history = await TransactionModel.find(criteria);

            let total = await TransactionModel.aggregate([
                { $match: criteria },
                {
                    $group: {
                        _id: null,
                        totalValue: { $sum: "$totalValue" }
                    }
                }
            ]);

            res.status(200).json({ data: history, total: total.length ? total[0].totalValue : 0 });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Terjadi Kesalahan Pada Server' });
        }
    },
    historyDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const history = await TransactionModel.findOne({ _id: id });

            if (!history) return res.status(404).json({ message: 'Riwayat transaksi tidak ditemukan' });

            res.status(200).json({ data: history });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Terjadi Kesalahan Pada Server' });
        }
    },
    dashboard: async (req, res) => {
        try {
            const count = await TransactionModel.aggregate([
                { $match: { player: req.player._id } },
                {
                    $group: {
                        _id: '$category',
                        totalValue: { $sum: '$totalValue' }
                    },
                }
            ]);

            const category = await CategoryModel.find({});

            category.forEach(element => {
                count.forEach(data => {
                    if (data._id.toString() === element._id.toString()) {
                        data.name = element.name;
                    }
                });
            });

            const history = await TransactionModel.find({ player: req.player._id })
                .populate('category')
                .sort({ 'updatedAt': -1 });

            res.status(200).json({ data: history, count: count });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Terjadi Kesalahan Pada Server' });
        }
    },
    profile: async (req, res) => {
        try {
            const player = {
                id: req.player._id,
                username: req.player.username,
                email: req.player.email,
                name: req.player.name,
                avatar: req.player.avatar,
                phoneNumber: req.player.phoneNumber,
            }
            res.status(200).json({ data: player })
        } catch (error) {
            res.status(500).json({ message: error.message || 'Terjadi Kesalahan Pada Server' });
        }
    },
    editProfile: async (req, res, next) => {
        try {
            const { name = '', phoneNumber = '' } = req.body;
            const payload = {};

            if (name.length) payload.name = name;
            if (phoneNumber.length) payload.phoneNumber = phoneNumber;

            if (req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let fileName = req.file.filename + '.' + originalExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${fileName}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);
                src.on('end', async () => {
                    let player = await PlayerModel.findOne({ _id: req.player._id });
                    let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;

                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }

                    player = await PlayerModel.findOneAndUpdate({
                        _id: req.player._id
                    }, {
                        ...payload,
                        avatar: fileName
                    }, { new: true, runValidators: true });

                    res.status(201).json({
                        data: {
                            id: player.id,
                            name: player.name,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar,
                        }
                    });
                });

                src.on('err', async () => {
                    mext(err);
                });
            } else {
                const player = await PlayerModel.findOneAndUpdate({
                    _id: req.player._id,
                }, payload, { new: true, runValidators: true });

                res.status(201).json({
                    data: {
                        id: player.id,
                        name: player.name,
                        phoneNumber: player.phoneNumber,
                        avatar: player.avatar,
                    }
                });
            }
        } catch (error) {
            if (error && error.name === "ValidationError") {
                res.status(422).json({
                    error: 1,
                    message: error.message,
                    fields: error.errors
                });
            }
        }
    }
}