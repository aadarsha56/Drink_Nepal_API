var cart = require('../Model/cart');
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


describe('Cart  test', () => {
    // the code below is for insert testing
    it('Add cart testing', () => {
        const cartt = {
            'product_id': '5dc0e4615e05916450a4caef',
            'user_id': '5dc111667bc7b16f480a573c'
            // 'comments': 'comm'

        };

        return cart.create(cartt)
            .then((j) => {
                expect(j.product_id).toEqual('5dc0e4615e05916450a4caef');
            });
    });
});

describe('Cart Schema test', () => {
    //product update test
it('Testing of Updating Cart', async () => {
    return cart.findByIdAndUpdate({ _id: '5dc1122ff342814e10516a21' }, { $set: { quantity: '2'} })
        .then((updatedcart) => {
            expect(updatedcart.quantity).toEqual(2)
        })
});

describe('cart delete test', () => {
    //delete test
it('Testing of cart Deletion', async () => {
    const status = await cart.deleteOne({_id:"5dbe9d73d4c8c1234c235601"});
    expect(status.ok).toBe(1);  
});
});


});