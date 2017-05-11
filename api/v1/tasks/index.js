const express  		= require("express");
const app 			= module.exports = express();
var mongoose 		= require('mongoose');
mongoose.Promise	= global.Promise;

mongoose.connect('mongodb://localhost/tasks');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	var Schema = mongoose.Schema;
	
	var taskSchema = new Schema({
		name: { type: [String], index:true},
		desc: { type: [String], index:true},
		isopen: Boolean,
		user: String
	});

	var task = mongoose.model('task', taskSchema);

	app.get('/', function(req, res) {
		var filter = (req.query.find) ? {'$text':{'$search':req.query.find}} : {};
		task.find(filter,function(err, doc){
			if (err){
				console.log("Ошибка получения списка задач: " + err);
				send(res, new Error("Ошибка получения списка задач: " + err));
			}else{
				send(res, err, doc); 
			}
		});
	});
	
	app.post('/', function(req, res) {
		if (req.body){
			if (req.body.open) {var isOpen = false} else { var isOpen = true};
			var newTask = new task({ name: req.body.name, desc: req.body.desc, isopen: isOpen, user:req.body.user});
			newTask.save(function (err, newTask) {
				if (err){
					console.log("Что-то не так с задачей " + newTask.name);
					send(res, new Error("Что-то не так с задачей " + newTask.name));
				}else{
					console.log("Добавлена задача: " + newTask.name);
					send(res, err, newTask);
				}
			});
		} else {
			send(res, new Error("Нет данных"));
		}
	});
	
	app.put('/:id', function(req, res) {
		if (req.body && req.params.id && req.body.name){
			task.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, desc: req.body.desc, isopen: req.body.open, user:req.body.user}}, { new: true }, function (err, doc) {
				if (err) return send(res, new Error("Ошибка редактирования"));
				console.log("Обновление: ", doc);
				send(res, err, doc);
			});

		}else {
			send(res, new Error("Не все параметры"));
		}
	});
	
	app.delete('/:id', function(req, res) {
		if (req.params.id){
			task.remove({_id: req.params.id}, function(err, doc){
				if (err) return send(res, new Error("Ошибка удаления"));
				console.log("Удаление: ", req.params.id);
				send(res, err, doc);
			});			
		}
	});

	app.use(function(err, req, res, next) {
		console.error(err.stack);
		res.status(500).send('500 Internal error - ' + err.message);
	});
	
});

const send = (res, err, data) => {
    if (err)
        return res.status(400).send(err.message);

    res.status(200).json(data);
}