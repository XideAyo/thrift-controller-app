const Todo = require('../model/todo')

class App {

    showTodo = (req, res, next) => {
        res.render("todolist")
    }

    createTodo = (req, res, next) => {
        let date = req.body.date
        let title = req.body.title
        let description = req.body.description

        //const {date, title, description} = req.body

        const newTodo = new Todo({
            title: title,
            description : description,
            todo_date : date
        })
        const saveTodo = newTodo.save()
        if(saveTodo){
            res.redirect(303, '/')
        }else{
            res.send('There is an error saving this')
        }
        res.send("Todo is created")
    }

    showToDoList = async (req, res, next) => {
        const todos = await Todo.find({})
        
        res.render('alltodo', {todos: todos})
    }

    getSingleToDo = async (req, res, next) => {
        const id = req.params.id
        const findTodo = await Todo.findById(id)
        // const find = await Todo.findOne({_id: id})
        console.log(findTodo)
        res.render('singletodo', {todo: findTodo})
    }

    updateToDo = async (req, res, next) => {
        let completed
        if (req.body.complete){
            completed= true
        }else{
            completed= false
        }
        Todo.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            completed: completed
        }, {new:true, useFindAndModify: false}, (err,item) => {
            if(err){
                console.log(err)
            }else{
                res.redirect(303, '/todolist/all')
            }
        })
    }

    deleteToDo = (req, res, next) =>  {
        Todo.findByIdAndDelete(req.params.id,(err) => {
            if(err){
                console.log(err)
            }
            res.redirect(303, '/todolist/all')
        })
    }
}

const returnApp = new App
module.exports = returnApp