var Buy = require('../Model/Buy');
const Product = require('../Model/Product')
const User = require('../Model/User')
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

describe('Buy Schema test', () => {
    // the code below is for insert testing
    it('Buy Product testing', () => {
        const buyy = {
            'product_id': '5dc0e3aa15e8fe5b488444ad',
            'user_id': '5dc0e4615e05916450a4caee'
            // 'comments': 'comm'

        };
        return Buy.create(buyy)
            .then((j) => {
                expect(j.product_id).toEqual('5dc0e3aa15e8fe5b488444ad');
            });
    });
});
describe('Buy delete test', () => {
    //delete test
it('Testing of Buy Deletion', async () => {
    const status = await Buy.deleteOne({_id:"5dc116791737a76ab8c12bac"});
    expect(status.ok).toBe(1);  
});
});

