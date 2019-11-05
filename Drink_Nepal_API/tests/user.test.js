var User = require('../Model/User');
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

//schema test of 
describe('user Schema test', () => {
    // the code below is for insert testing
    it('Add user testing', () => {
        const userr = {
            'name': 'gg',
            'phone': '9840',
            'email': 'gg@gmail.com',
            'dob': 'date',
            'address': 'ok',
            'password': 'hello'
            // 'comments': 'comm'

        };

        return User.create(userr)
            .then((j) => {
                expect(j.name).toEqual('gg');
            });
    });
});

describe('User Schema test', () => {
    //user update test
it('Testing of Updating User', async () => {
    return User.findOneAndUpdate({ _id: '5dc10f337a6d0a4754915dd7' }, { $set: { name: 'manik' } })
        .then((updateuser) => {
            expect(updateuser.name).toEqual('manik')
        })
});

describe('User delete test', () => {
    //delete test
it('Testing of Product Deletion', async () => {
    const status = await User.deleteOne({_id:"5dc1110adfd2586404c3662d"});
    expect(status.ok).toBe(1);  
});
});


});
