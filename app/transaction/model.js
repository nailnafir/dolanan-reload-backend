const mongoose = require('mongoose');
let transactionSchema = mongoose.Schema({
    historyVoucherTopUp: {
        gameName: {
            type: String,
            require: [true, 'Nama game harus diisi!'],
        },
        category: {
            type: String,
            require: [true, 'Kategori harus diisi!'],
        },
        thumbnail: {
            type: String,
        },
        coinName: {
            type: String,
            require: [true, 'Nama koin harus diisi!'],
        },
        coinQuantity: {
            type: Number,
            require: [true, 'Jumlah koin harus diisi!'],
        },
        price: {
            type: Number,
        },
    },
    historyPayment: {
        name: {
            type: String,
            require: [true, 'Nama harus diisi!'],
        },
        type: {
            type: String,
            require: [true, 'Tipe pembayaran harus diisi!'],
        },
        bankName: {
            type: String,
            require: [true, 'Nama bank harus diisi!'],
        },
        accountNumber: {
            type: String,
            require: [true, 'Nomor rekening harus diisi!'],
        },
    },
    name: {
        type: String,
        require: [true, 'Nama harus diisi!'],
        maxlength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
        minlength: [3, 'Panjang nama harus antara 3 - 255 karakter'],
    },
    userAccount: {
        type: String,
        require: [true, 'Nama akun harus diisi!'],
        maxlength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
        minlength: [3, 'Panjang nama harus antara 3 - 255 karakter'],
    },
    tax: {
        type: Number,
        default: 0,
    },
    totalValue: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    },
    historyUser: {
        name: {
            type: String,
            require: [true, 'Nama pemain harus diisi!'],
        },
        phoneNumber: {
            type: Number,
            require: [true, 'Nama akun harus diisi!'],
            maxlength: [13, 'Panjang nama harus antara 9 - 13 karakter'],
            minlength: [9, 'Panjang nama harus antara 9 - 13 karakter'],
        },
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);