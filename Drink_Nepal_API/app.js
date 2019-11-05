require('./Model/config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var passport = require('passport');
var fs = require('fs');
const User = require('./Model/User');
const Cart = require('./Model/cart');
const Buy = require('./Model/Buy');
const Product = require('./Model/Product');
const auth = require('./middleware/auth')
const multer = require('multer')
const path = require('path');
const async = require('async');
const app = express();
// app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

date = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    return today;
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));
var storage = multer.diskStorage({
    destination: "./public/drinks", //this is folder name
    filename: function(req, file, callback) {
        const ext = path.extname(file.originalname); //.js,.pdf etc extenstion linchha
        callback(null, "DrinkNepal" + Date.now() + ext); //renaming file
    }
});
var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|PNG)$/)) { return cb(("You can upload only image files!"), false); }
    cb(null, true);
};

var uploadDrinks = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10000000
    }
});
//this will upload the pictures in a public folder of users and products
app.post('/DrinkNepal/uploadpic', uploadDrinks.single('files'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
app.get('/DrinkNepal/me',auth, function(req, res) {
   console.log(req.user);
    // res.send(req.user);
});

//this is the api for login
app.post("/DrinkNepal/login", async function(req, res) {
    const user = await User.checkCrediantialsDb(req.body.phone,
        req.body.password)
    // const token = await user.generateAuthToken();
    // console.log(token);
    console.log(user);
    // res.send({ token: token, user: user });
    res.json("logged in")//while test
})
app.post('/DrinkNepal/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//this is post method that will log out the user from all devices
app.post('/DrinkNepal/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//this will upload the pictures in a public folder of users and drinks
app.post('/DrinkNepal/uploadpic', uploadDrinks.single('files'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})

//this post api is for posting or adding trek
app.post('/DrinkNepal/AddProduct', function(req, res) {
    console.log(req.body);
    var product = new Product(req.body);
    product.save().then(function(response, err) {
        // if (err) {
        //     console.log({ message: +err, success: false })
        //     res.send({ message: 'Cannot Save your product', success: false })
        // } else {
        //     console.log({ message: 'Your product is successfully added', success: true })
        //     res.send({ message: 'Your product is successfully added', success: true })
        // }
        res.json("product added")

    });
});
var nodemailer = require('nodemailer')

function sendMail(cart_id, res, status) {
    Cart.findById(cart_id).populate('user_id').populate('product_id').exec(function(err, response) {
        var data = response;
        console.log(data);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '',
                pass: ''
            }
        });
        var mailOptions = {
            from: '',
            to: 'czaject111@gmail.com',
            subject: 'Drink Nepal - Product Confirmation',
            text: ' Product details and delivery details',
            html: `
             <div style="text-align: center;">
                <h1>${response.user_id.name} Order Product Details</h1>
                <table style="width:50%; margin: 0 auto;">
                <tr>
                  <th>Name</th>
                  <th>Lastname</th>
                  <th>Age</th>
                </tr>
                <tr>
                  <td>Jill</td>
                  <td>Smith</td>
                  <td>50</td>
                </tr>
                <tr>
                  <td>Eve</td>
                  <td>Jackson</td>
                  <td>94</td>
                </tr>
              </table>
             </div>
        `
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                res.send('Failed to send email.')
                console.log(error);
            } else {
                res.send('Please check email to verify user')
            }
        });
    })

}
// app.get('/send/mail/:id', function(req, res) {
//     Cart.findById(req.params.id).populate('user_id').populate('product_id').exec(function(err, resp) {
//         var Cart = resp.data;
//         sendMail(res, Cart)
//     })
// });
app.get('/DrinkNepal/cart', function(req, res) {
    Cart.find({ isTouched: false }).populate('user_id').populate('product_id').exec(function(err, resp) {
        if (err) {
            console.log(err);

        } else {
            res.send(resp)

        }
    })
});

app.post('/DrinkNepal/acceptreject/:id/:status', function(req, res) {
    Cart.findByIdAndUpdate(req.params.id, { isTouched: true }, function(err, response) {
        // Cart.findByIdAndRemove(req.params.id, function(err, respo) {
        var buy = new Buy({
            product: response._id,
            date: Date.now(),
            status: req.params.status
        });
        buy.save(function(err, respo) {
            // res.send({message:'Order Accpeted'})
             sendMail(response._id, res, req.params.status)
        })

        // })
    })
    // res.send({ message: 'Accepted' })
})

app.post('/DrinkNepal/AddtoCart/:userid/:lat/:lng', function(req, res) {
    console.log(req.body, req.params.lat, req.params.lng);
    var data = req.body;
    data.forEach(element => {
        // console.log(element._id);
        var cart = new Cart({
            user_id: req.params.userid,
            product_id: element._id,
            quantity: element.quantity,
            created_at: Date.now(),
            sold_price: element.product_price,
            location: { lat: req.params.lat, lng: req.params.lng }
        })
        cart.save(function(err, response) {
            console.log(response);
        })
    });
    res.send('Successful')


    // var cart = new Cart(req.body);
    // product.save().then(function(response, err) {
    //     if (err) {
    //         console.log({ message: +err, success: false })
    //         res.send({ message: 'Cannot Save your cart', success: false })
    //     } else {
    //         console.log({ message: 'Your cart is successfully added', success: true })
    //         res.send({ message: 'Your cart is successfully added', success: true })
    //     }

    // });
});

app.get('/DrinkNepal/users', function(req, res) {
    User.find().then(function(product) {
        res.send(product);
    }).catch(function(e) {
        res.send(e)
    });
});

app.get('/DrinkNepal/products', function(req, res) {
    Product.find().then(function(product) {
        res.send(product);
    }).catch(function(e) {
        res.send(e)
    });
});

app.get('/DrinkNepal/alcoholproduct', function(req, res) {
    Product.find({ type: "Alcohol" }).then(function(product) {
        res.send(product);
    }).catch(function(e) {
        res.send(e)
    });
});

app.get('/DrinkNepal/Sittanproduct', function(req, res) {
    Product.find({ type: "Sitan" }).then(function(product) {
        res.send(product);
    }).catch(function(e) {
        res.send(e)
    });
});

//this will get the value of single product with the help of id
app.get('/DrinkNepal/getprod/:id', function(req, res) { 
    Product.findById(req.params.id).then(function(data) {
        console.log(data);
        res.send(data);
    }).catch(function(e) {
        res.send(e);
    })
});

//this put method api will upadte the user
app.put('/DrinkNepal/updateProduct/:id', auth, function(req, res) {
    uid = req.params.id;

    Product.findByIdAndUpdate({ _id: uid }, req.body).then(function(response, err) {
        if (err) {
            console.log({ message: +err, success: false })
            res.send({ message: 'error on updating product', success: false })
        } else {
            console.log({ message: 'successfully updated a product', data: req.body, success: true })
            res.send({ message: 'successfully updated a product', data: req.body, success: true })
        }
    });
});

//this will delete a drink
app.get('/DrinkNepal/drinkdelete/:id', auth, function(req, res) { //user delete
    Product.findByIdAndDelete(req.params.id).then(function() {
        res.send({ message: 'Selected product is deleted', success: true });
    }).catch(function(e) {
        res.send({ message: 'Selected product cannot be deleted', success: true });
    });
})


//this api will add new users and save the user data in database
app.post('/DrinkNepal/createuser', (req, res) => {
    console.log(req.body);
    var mydata = new User(req.body);

    mydata.save().then(function(response, err) {
        // if (err) {
        //     console.log({ message: +err, success: false })
        //     res.send({ message: 'error on saving user', success: false })
        // } else {
        //     console.log({ message: 'successfully posted user', data: req.body, success: true })
        //     res.send({ message: 'User Created Successfully', data: req.body, success: true })
        // }
        res.json("User Created Successfully");//while test

    });
});

//this will get the value of single product with the help of id
app.get('/DrinkNepal/getuser/:id', auth, function(req, res) { //user delete
    User.findById(req.params.id).then(function(data) {
        console.log(data);
        res.send(data);
    }).catch(function(e) {
        res.send(e);
    });
});
//this will delete a user
app.get('/DrinkNepal/deleteUser/:id', auth, function(req, res) { //user delete
    User.findByIdAndDelete(req.params.id).then(function() {
        res.send({ message: 'Selected user is deleted', success: true });
    }).catch(function(e) {
        res.send({ message: 'Selected user cannot be deleted', success: true });
    });
})

//this put method api will upadte the user
app.put('/DrinkNepal/updateuser/:id', auth, function(req, res) {
    uid = req.params.id;

    User.findByIdAndUpdate({ _id: uid }, req.body).then(function(response, err) {
        if (err) {
            console.log({ message: +err, success: false })
            res.send({ message: 'error on updating user', success: false })
        } else {
            console.log({ message: 'successfully updated a user', data: req.body, success: true })
            res.send({ message: 'successfully updated a user', data: req.body, success: true })
        }
    });
});

app.listen(3000);