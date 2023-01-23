const mongoose = require('mongoose');
let paymentSchema = mongoose.Schema({
    type: {
        type: String,
        require: [true, 'Tipe pembayaran harus diisi!'],
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y',
    },
    bank: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
    }],
});

module.exports = mongoose.model('Payment', paymentSchema);