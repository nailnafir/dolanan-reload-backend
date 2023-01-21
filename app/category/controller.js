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
    }
}