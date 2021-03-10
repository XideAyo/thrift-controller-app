import {selector, sendData} from './api.js'

const input = selector('#profit')
const submit = selector('#submit')
const display = selector('#displayMessage')
const id = selector('.complete').id



submit.addEventListener('click', event => {
    event.preventDefault()
    if(input.value === ""  || input.value === null){
        display.textContent = 'Profit cannot be empty'
    }else{
        sendData('/save-profit', {profit: input.value, id})
        .then(res => {
            display.textContent = res.message
            setTimeout(() => {
                window.location.replace(`/groups/${id}`)
            }, 2000)
        })
        .catch(err => display.textContent = err.message)
    }
})

