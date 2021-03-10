const bcrypt = require('bcryptjs')
const User = require('../model/user')
const Customer = require('../model/customer')
const Group = require('../model/group')
const Payment = require('../model/payment')

class App {
    getAuthPage = async (req, res, next) => {
        if(req.session.email){
            res.redirect(303, '/dashboard')
        }else{
            const users = await User.find({})
            if(users.length > 0){
                res.render('login', {title: 'Login to your account'})
            }else{
                res.redirect(303, '/create-account')
            }
            res.send('Our auth Page')
        }
    }

    getRegisterPage = async (req, res, next) =>{
        const users = await User.find({})
        if (users.length > 0){
            res.redirect(303, '/')
        }else{
            res.render('reg', {title: 'Create an account'})
        }
    }

    registerUser = async (req, res, next) => { 
        const {name, email, number, password, cPassword, secret} = req.body
        if(password !== cPassword){
            res.render('reg', {title: 'Create an account', error: 'Your Password is incorrect'})
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                mobile: number,
                secret: secret
            })
            const saveUser = newUser.save()
            if(saveUser){
                res.redirect(303, '/')
            }else{
                res.send('There is an error saving this')
            }
        }
    }

    showDashboard = async (req, res, next) => {
        if(req.session.email){
            const customers = await Customer.find({})
            const groups = await Group.find({})
            const payments = await Payment.find({}).limit(5).sort({createdAt: -1}).populate('group')
            res.render('dashboard', {
                dash_active: 'active' 
                ,customers: customers.length, 
                groups: groups.length, 
                title: 'Dashboard',
                payments
            }
            )
        }else{
            res.redirect(303, '/')
        } 
    }

    postLogin = async (req, res, next) => {
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if(user){
            const validUser = await bcrypt.compare(password, user.password)
            if(validUser){
                req.session.email= user.email
                res.redirect(303, '/dashboard')
            }else{
                res.render('login', {title: 'Login to your account', error: 'Invalid credentials'})
            }
            res.send('Welcome to Ajo')
        }else{
            res.render('login', {title: 'Login to your account', error: 'Invalid credentials'})
        }
    }

    logOut = (req, res, next) => {
        if(req.session.email){
            delete req.session.email
            res.redirect(303, '/')
        }else{
            throw new Error('No session found')
        }
    }

    getGroups = async (req, res, next) => {
        if(req.session.email){
            const customers = await Customer.find({})
            console.log(customers)
            const groups = await Group.find({}).populate('createdBy')
            console.log(groups)
            res.render('groups', {group_active: 'active', title: 'Groups', groups: groups})
        }else{
            res.redirect(303, '/')
        }
    }

    postGroups = async (req, res, next) => {
        if(req.session.email){
            const findUser = await User.findOne({email: req.session.email})
            const{name, amount, period} = req.body
            const group = new Group({
                name,
                amount,
                period,
                createdBy : findUser._id
            })
            const saveGroup = group.save()
            if(saveGroup){
                res.redirect(303, '/dashboard/groups')
            }else{
                res.send('Error in saving')
            }

        }else{
            res.redirect(303,'/')
        }
    }

    editGroup = (req, res, next) => {
        if(req.session.email){
            Group.findByIdAndUpdate(req.params.id,{
                name: req.body.name,
                amount: req.body.amount,
                period: req.body.period
            }, {new:true, useFindAndModify: false}, (err,item) => {
                if(err){
                    console.log(err)
                }else{
                    res.redirect(303, '/dashboard/groups')
                }
            })
        }else{
            res.redirect(303, '/')
        }
    }
    
    getEditGroup= async (req, res, next) => {
        if(req.session.email){
            const group = await Group.findOne({_id: req.params.id})
            console.log(group)
            res.render('editgroup', {group})
        }else{
            res.redirect(303, '/')
        }
    }

    deleteGroup = (req, res, next) => {
        if(req.session.email){
            Group.findOneAndDelete(req.params.id,(err) => {
                if(err){
                    console.log(err)
                }
                res.redirect(303, '/dashboard/groups')
            })
        }else{
            res.redirect(303,'/')
        }
    }

    showProfile = async (req, res, next) => {
        if(req.session.email){
            let user = await User.findOne({email: req.session.email})
            console.log(user)
            res.render('profile', {user: user})
        }else{
            res.redirect('/')
        }  
    }

    editProfile = async (req, res,next) => {
        if(req.session.email){
            if(req.file){
                const user = await User.findOne({email : req.session.email})
                let updateUser = await User.findByIdAndUpdate(user.id, {
                    profileImage : req.file.filename
                }, {new: true, useFindAndModify: false})
                if(updateUser){
                    res.redirect(303, '/profile')
                }else{
                    res.send('unable to upload')
                }
            }else{
                res.send('You do not have a file')
            }
            // User.findOneAndUpdate({email: req.session.email}, {
            //     name: req.body.name,
            //     mobile: req.body.number,
            // }, {new:true, useFindAndModify: false}, (err,item) => {
            //     if(err){
            //         console.log(err)
            //     }else{
            //         res.redirect(303, '/profile')
            //     }
            // })
        }else{
            res.redirect(303,'/')
        }
    }

    getResetPassword = (req, res, next) => {
        res.render('resetpassword')
    }

    verifyUser = async (req, res, next) => {
        const {email, secret} = req.body
        // const usersecret = await User.findOne({secret: secret})
        const usermail = await User.findOne({email: email})
        console.log(usermail)
        if(usermail){
            res.redirect(303, '/updatepassword')
        }else{
            res.render('resetpassword')
        }
    }

    showUpdate = (req, res, next) => {
        res.render('updatepassword')
    }

    updatePassword = async (req, res, next) => {
        const {password, cpassword, email} = req.body
        if(password === cpassword){
            const hashedPassword = await bcrypt.hash(password, 10) 
            User.findOneAndUpdate({email: email},{
                password: hashedPassword,
            }, {new:true, useFindAndModify: false}, (err,item) => {
                if(err){
                    console.log(err)
                }else{
                    res.redirect(303, '/')
                }  
        })}else{
            res.render("updatepassword", {error: 'Your Passwords are not the same'})
        }
    }

    showCustomers = async (req, res, next) => {
        if(req.session.email){
            const groups = await Group.find({completed : false})
            // console.log(groups)
            const customer = await Customer.find({}).populate('group').populate('createdBy')
            console.log(customer)
            res.render('customers', {customer_active: 'active', customers : customer, groups})
        }else{
            res.redirect(303, '/')
        }
    }

    postCustomers = async (req, res, next) => {
        if(req.session.email){
            const findUser = await User.findOne({email: req.session.email})
            const{firstname, lastname, email, mobile,group , address} = req.body
            const customer = new Customer({
                firstName :firstname,
                lastName :lastname,
                email,
                mobile,
                group,
                address,
                createdBy : findUser._id
            })
            const saveCustomer = customer.save()
            if(saveCustomer){
                const findGroup = await Group.findOne({_id: group})
                // console.log(findGroup)
                let groupTotal = findGroup.totalUsers
                let rem = 1 + groupTotal
                const updateGroup = await Group.findByIdAndUpdate(group, {
                    totalUsers: rem
                }, {new: true, useFindAndModify: false})
                if(updateGroup){
                    res.redirect(303, '/dashboard/customers')
                }else{
                    res.send('Error in updating')
                }
            }else{
                res.send('Error in saving')
            }
        }else{
            res.redirect(303,'/')
        }
    }

    deleteCustomer = (req, res, next) => {
        if(req.session.email){
            Customer.findOneAndDelete(req.params.id,(err) => {
                if(err){
                    console.log(err)
                }
                res.redirect(303, '/dashboard/customers')
            })
        }else{
            res.redirect(303,'/')
        }
    }

    editCustomer = (req, res, next) => {
        if(req.session.email){
            Customer.findByIdAndUpdate(req.params.id,{
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                mobile: req.body.mobile,
                address: req.body.address, 
                group: req.body.group
            }, {new:true, useFindAndModify: false}, (err,item) => {
                if(err){
                    console.log(err)
                }else{
                    res.redirect(303, '/dashboard/customers')
                }
            })
        }else{
            res.redirect(303, '/')
        }
    }
    
    showEditCustomer= async (req, res, next) => {
        if(req.session.email){
            const customer = await Customer.findOne({_id: req.params.id})
            const groups = await Group.find({})
            res.render('editcustomer', {groups, customer})
        }else{
            res.redirect(303, '/')
        }
    }

    saveProfit = async (req, res, next) => {
        if(req.session.email){
            const findGroup = await Group.findById(req.body.id)
            let totalAmount = findGroup.totalUsers * findGroup.amount
            let percentage = (req.body.profit * totalAmount) / 100
            await Group.findByIdAndUpdate(req.body.id, {
                completed : true,
                profit : {
                    percentage : req.body.profit,
                    amount: percentage
                }
            }, {new: true , useFindAndModify: false})
            res.json({message: `You will be getting a profit of ${percentage} ${findGroup.period}`})
        }else{
            res.json({message: 'You are not logged in'})
        }
    }

    displayCustomer = async (req, res, next) => {
        if(req.session.email){
            const {name, type} = req.body
            let singleCustomer = await Customer.findOne({_id : name}).populate('group')
            console.log(singleCustomer)
            let lastname = singleCustomer.lastName
            let groupName = singleCustomer.group.name
            let amount
            if(type === 'Credit'){
                amount = singleCustomer.group.amount
            }else{
                amount= (singleCustomer.group.totalUsers * singleCustomer.group.amount) - singleCustomer.group.profit.amount
            }
            res.json({
                lastname,
                groupName,
                amount
            })
        }else{
            redirect(303, '/')
        }
    }

    getPayment = async (req, res, next) => {
        if(req.session.email){
            const customers = await Customer.find({})
            const payments = await Payment.find({ $or : [{paymentType: 'Debit'}, {paymentType: 'Credit'}]}).populate('customer').populate('group')
            res.render('payment', {payment_active : 'active', customers: customers, payments})
        }else{
            res.redirect(303, '/')
        }
    }

    showProfit = async (req, res, next) => {
        if(req.session.email){
            const payments = await Payment.find({paymentType : 'Profit'}).populate('group')
            res.render('profit', {payment_active : 'active', payments})
        }else{
            res.redirect(303, '/')
        }
    }

    postPayment = async (req, res, next) => {
        if(req.session.email){
            const user = await User.findOne({email: req.session.email})
            const {type, customer, group, means, date, amount} = req.body
            const findGroup = await Group.findOne({name: group})
            if(type ==='Debit'){
                const newProfit = new Payment({
                    paymentType: 'Profit',
                    group: findGroup._id,
                    amount: findGroup.profit.amount,
                    paymentMeans : means,
                    paymentDate: date,
                    createdBy: user._id
                })
                await newProfit.save()
            }
            const payment = new Payment({
                paymentType: type,
                customer: customer,
                group: findGroup._id,
                amount: amount,
                paymentMeans: means,
                paymentDate: date,
                createdBy: user._id
            })
            const savePayment = payment.save()
            if(savePayment){
                res.redirect(303, '/dashboard/payment')
            }else{
                res.send('Error in saving')
            }
        }else{
            res.redirect(303, '/')
        }
    }

    getStats = async (req, res, next) => {
        if(req.session.email){
            const payments = await Payment.find({}).populate('group').populate('customer')
            const groups = await Group.find({completed: true})
            // console.log(groups)
            console.log(payments)
            res.render('stats', {stats_active: 'active', payments, groups})
        }else{
            res.redirect(303, '/')
        }
    }

    showGroupStats = async (req, res, next) =>  {
        if(req.session.email){
            const groupID = req.params.id
            const group = await Group.findOne({_id: groupID})
            const payments = await Payment.find({group: groupID}).populate('customer')
            const singleDebit = await Payment.findOne({paymentType : 'Debit'})
            const singleCredit = await Payment.findOne({paymentType : 'Credit'})
            const singleProfit = await Payment.findOne({paymentType : 'Profit'})
            console.log(payments)
            res.render('group-stat', {stats_active: 'active', payments, group, singleCredit,singleDebit, singleProfit})
        }else{
            res.redirect(303, '/')
        }
    }

    getCredit = async (req, res, next) => {
        if(req.session.email){
            const credits = await Payment.find({ $and : [{paymentType: 'Credit'}, {group: req.params.id}]}).populate('customer').populate('group')
            const credit = await Payment.find({})
            console.log(credit)
            res.render('credit-stat', {stats_active: 'active', credits})
        }else{
            res.redirect(303, '/')
        }
    }

    getDebit = async (req, res, next) => {
        if(req.session.email){
            const debits = await Payment.find({ $and : [{paymentType: 'Debit'}, {group: req.params.id}]}).populate('customer').populate('group')
            // console.log(credit)
            res.render('debit-stat', {stats_active: 'active', debits})
        }else{
            res.redirect(303, '/')
        }
    }

    getProfit = async (req, res, next) => {
        if(req.session.email){
            const profits = await Payment.find({ $and : [{paymentType: 'Profit'}, {group: req.params.id}]}).populate('customer').populate('group')
            // console.log(credit)
            res.render('profit-stat', {stats_active: 'active', profits})
        }else{
            res.redirect(303, '/')
        }
    }

    getCustomerTransaction = async (req, res, next) => {
        if(req.session.email){
            const customerPay = await Payment.find({customer: req.params.id}).populate('customer')
            console.log(customerPay)
            res.render('customer-stat', {stats_active: 'active', customerPay})
        }else{
            res.redirect(303, '/')
        }
    }
}
const returnApp = new App
module.exports = returnApp