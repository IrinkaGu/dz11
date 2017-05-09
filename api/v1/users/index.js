const express  		= require("express");
const app 			= module.exports = express();
var mongoose 		= require('mongoose');
mongoose.Promise	= global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	var Schema = mongoose.Schema;
	
	var userSchema = new Schema({
		name: String
	});
	
	var user = mongoose.model('user', userSchema);

	app.get('/', function(req, res) {
		user.find(function(err, doc){
			if (err){
				console.log("Ошибка получения списка пользователей: " + err);
				send(res, new Error("Ошибка получения списка пользователей: " + err));
			}else{
				send(res, err, doc); 
			}
		});
	});

	app.post('/', function(req, res) {
		if (req.body.name && req.body.name != ""){
			var newUser = new user({ name: req.body.name});
			newUser.save(function (err, newUser) {
				if (err){
					console.log("Что-то не так с пользователем " + newUser.name);
					send(res, new Error("Что-то не так с пользователем " + newUser.name));
				}else{
					console.log("Добавлен: " + newUser.name);
					send(res, err, newUser);
				}
			});
		} else {
			send(res, new Error("Пустое имя"));
		}
	});
	
	app.put('/:id', function(req, res) {
		if (req.body && req.params.id && req.body.name){
			user.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name }}, { new: true }, function (err, doc) {
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
			user.remove({_id: req.params.id}, function(err, doc){
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