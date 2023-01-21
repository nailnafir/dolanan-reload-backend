const CategoryModel = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            let category = await CategoryModel.find();

            res.render('admin/category/view_category', { category });
        } catch (error) {
            console.log(error);
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/category/create');
        } catch (error) {
            console.log(error);
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name } = req.body;

            let category = await CategoryModel({ name });
            await category.save();

            res.redirect('/category');
        } catch (error) {
            console.log(error);
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;

            let category = await CategoryModel.findOne({ _id: id });

            res.render('admin/category/edit', { category });
        } catch (error) {
            console.log(error);
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            let category = await CategoryModel.findOneAndUpdate({ _id: id }, { name });

            res.redirect('/category');
        } catch (error) {
            console.log(error);
        }
    }
}