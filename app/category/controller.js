const CategoryModel = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            let category = await CategoryModel.find();

            res.render('admin/category/view_category', { category, alert });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('category');
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/category/create');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('category');
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name } = req.body;

            let category = await CategoryModel({ name });
            await category.save();

            req.flash('alertMessage', "Berhasil tambah data");
            req.flash('alertStatus', "success");

            res.redirect('/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('category');
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            let category = await CategoryModel.findOne({ _id: id });

            res.render('admin/category/edit', { category });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('category');
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            await CategoryModel.findOneAndUpdate({ _id: id }, { name });

            req.flash('alertMessage', "Berhasil ubah data");
            req.flash('alertStatus', "success");

            res.redirect('/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('category');
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await CategoryModel.findOneAndRemove({ _id: id });

            req.flash('alertMessage', "Berhasil hapus data");
            req.flash('alertStatus', "success");

            res.redirect('/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('category');
        }
    }
}