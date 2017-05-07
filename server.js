var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/tasks');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	var Schema = mongoose.Schema;
	
	var userSchema = new Schema({
		name: String
	});
	
	var taskSchema = new Schema({
		name: String,
		desc: String,
		isOpen: Boolean,
		user: String
	});
	
	var user = mongoose.model('user', userSchema);
	var task = mongoose.model('task', taskSchema);
	
	//добаление
	
	var newUser = new user({ name: "Леша"});
	newUser.save(function (err, newUser) {
		if (err){
			console.log("Something goes wrong with user " + newUser.name);
		}else{
			console.log("Добавлен: " + newUser.name);
		}
	});
	
	//Вывод списка
	user.find(function(err, doc){
		console.log(doc);
	});
	
	//обновление
	/*Tank.findByIdAndUpdate(id, { $set: { size: 'large' }}, { new: true }, function (err, doc) {
		if (err) return console.log(err);
		console.log("Обновление: ", doc);
	});*/
	
});