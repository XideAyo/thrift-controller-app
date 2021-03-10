import {selector, sendData} from './api.js'

const customer = selector('#customer')
const type = selector('#type')
const group = selector("#group")
const amount = selector('#amount')
const lastname = selector('#lastname')



customer.addEventListener('change', event => {
    // console.log(customer.value)
    sendData('/display-customer', {name: customer.value, type: type.value})
    .then(res => {
        group.value = res.groupName
        amount.value = res.amount
        lastname.value = res.lastname
        // console.log(res.lastname)
        // console.log(res.amount)
        // console.log(res.groupName)
    })
    .catch(err => {
        console.log(err.message)
    })
})