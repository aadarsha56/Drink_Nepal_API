var Product = require('../Model/Product');
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/apitesting';
beforeAll(async () => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true
    });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Product Schema test', () => {
    // the code below is for insert testing
    it('Add Product testing', () => {
        const productt = {
            'product_name': 'Old Durbar',
            'product_price': '2200',
            'product_type':'alcohol'
            // 'comments': 'comm'

        };

        return Product.create(productt)
            .then((j) => {
                expect(j.product_name).toEqual('Old Durbar');
            });
    });
});

describe('Product Schema test', () => {
    //product update test
it('Testing of Updating Product', async () => {
    return Product.findByIdAndUpdate({ '_id': '5dc0e4615e05916450a4caef' }, { $set: { product_price: '1900' } })
        .then((j) => {
            expect(j.product_price).toEqual('1900')
        })
});

describe('Product delete test', () => {
    //delete test
it('Testing of Product Deletion', async () => {
    const status = await Product.deleteOne({_id:"5dc0e3aa15e8fe5b488444ad"});
    expect(status.ok).toBe(1);  
});
});

});