const VoucherModel = require('./model');
const CategoryModel = require('../category/model');
const NominalModel = require('../nominal/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            let voucher = await VoucherModel.find().populate('category').populate('nominal');

            res.render('admin/voucher/view_voucher', {
                voucher, 
                alert, 
                name: req.session.user.name,
                title: 'Halaman Voucher'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    viewCreate: async (req, res) => {
        try {
            let category = await CategoryModel.find();
            let nominal = await NominalModel.find();
            res.render('admin/voucher/create', { 
                category, 
                nominal,
                name: req.session.user.name,
                title: 'Halaman Tambah Voucher'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name, category, nominal } = req.body;

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
                        const voucher = await VoucherModel({ name, category, nominal, thumbnail: fileName });
                        await voucher.save();

                        req.flash('alertMessage', "Berhasil tambah data");
                        req.flash('alertStatus', "success");

                        res.redirect('/voucher');
                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/voucher');
                    }
                });
            } else {
                const voucher = await VoucherModel({ name, category, nominal });
                await voucher.save();

                req.flash('alertMessage', "Berhasil tambah data");
                req.flash('alertStatus', "success");

                res.redirect('/voucher');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            let category = await CategoryModel.find();
            let nominal = await NominalModel.find();

            let voucher = await VoucherModel.findOne({ _id: id }).populate('category').populate('nominal');

            res.render('admin/voucher/edit', { 
                voucher, 
                category, 
                nominal,
                name: req.session.user.name,
                title: 'Halaman Ubah Voucher'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, category, nominal } = req.body;

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
                        const voucher = await VoucherModel.findOne({ _id: id });
                        let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage);
                        }

                        await VoucherModel.findOneAndUpdate({ _id: id }, { name, category, nominal, thumbnail: fileName });

                        req.flash('alertMessage', "Berhasil ubah data");
                        req.flash('alertStatus', "success");

                        res.redirect('/voucher');
                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/voucher');
                    }
                });
            } else {
                await VoucherModel.findOneAndUpdate({ _id: id }, { name, category, nominal });

                req.flash('alertMessage', "Berhasil ubah data");
                req.flash('alertStatus', "success");

                res.redirect('/voucher');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            const voucher = await VoucherModel.findOne({ _id: id });
            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

            if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage);
            }

            await VoucherModel.findOneAndRemove({ _id: id });

            req.flash('alertMessage', "Berhasil hapus data");
            req.flash('alertStatus', "success");

            res.redirect('/voucher');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            let voucher = await VoucherModel.findOne({ _id: id });

            let status = voucher.status === 'Y' ? 'N' : 'Y';

            voucher = await VoucherModel.findOneAndUpdate({ _id: id }, { status });

            req.flash('alertMessage', "Berhasil ubah status");
            req.flash('alertStatus', "success");

            res.redirect('/voucher');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    }
}