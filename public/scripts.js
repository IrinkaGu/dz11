var API_URL_USERS = '/api/v1/users/';
var API_URL_TASKS = '/api/v1/tasks/';

$(document).ready(function(){
	getList("taskList", API_URL_TASKS);	
	getList("userList", API_URL_USERS);

	//пользователи	
	$("#addForm").submit(function(event) {
        event.preventDefault();
        if ($(this).find("input").val().trim() != ""){
			var posting = $.post(API_URL_USERS,  $(this).serialize());
			posting.done(function(data) {
				alert(`Успешно добавлено - ${JSON.stringify(data.name)}`);
				appendElement("userList", data);
				$("#addForm #name").val('');
			}).fail(function( jqxhr, textStatus, error ) {
				var err = textStatus + ", " + error;
				alert("Ошибка добавления: " + err);
			});
		} else {
			alert("Пустое имя");
			$("#addForm #name").val('');
		}
    });
	
	$(document).on('click', '.deleteUser', (e) => {
        e.preventDefault();
        var id = e.target.id.substr(11);
        deleteUser(id, () => {
            $(e.target).parents('tr').remove();
        })
    });

    $(document).on('click', '.updateUser', (e) => {
        e.preventDefault();
        var id = e.target.id.substr(11);
        updateUser(id, $(e.target).parents('tr'));
    });
	//задачи
	$(document).on('click', '#addTask', function (){
		$(".add_task").toggle("slow");
	});
	
	$("#addTaskForm").submit(function(event) {
        event.preventDefault();
		var posting = $.post(API_URL_TASKS,  $(this).serialize());
		posting.done(function(data) {
			alert(`Успешно добавлена задача - ${JSON.stringify(data)}`);
			appendElement("taskList",data);
		}).fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			alert("Ошибка добавления: " + err);
		});
    });
	
	$(document).on('click', '.deleteTask', (e) => {
        e.preventDefault();
        var id = e.target.id.substr(11);
        deleteTask(id, () => {
            $(e.target).parents('tr').remove();
        })
    });
	
	$(document).on('click', '.updateTask', (e) => {
        e.preventDefault();
        var id = e.target.id.substr(11);
        updateTask(id, $(e.target).parents('tr'));
    });
	
	$("#editTaskForm").submit(function(event) {
		name = $(this).find("#name").val();
		desc = $(this).find("#desc").val();
		if ($(this).find("#open:checked")){
			var open = true;
		} else {var open = false;};
		user = $(this).find("#user").val();
	
		$.ajax({
			url: API_URL_TASKS + $("#editTaskForm #id").val(),
			method: 'put',
			contentType: 'application/json',
			data: JSON.stringify({name:name, desc: desc, open:open, user:user})
		}).done(function(data) {
			alert(`Успешно обновлено - ${JSON.stringify(data)}`);
			location.reload();
		}).fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			alert( "Oшибка обновления: " + err );
		});
		return false;
	});
});

function getList(idPanel, url, find){
	$("#"+idPanel+" #elementTable tbody").empty();
    $.getJSON(url, (find) ? {find: find} : {})
        .done(function(elements) {
            $.each(elements, function(i, element) {
                appendElement(idPanel, element);
            });
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            $("#"+idPanel).html("Ошибка запроса: " + err);
        });
}

function appendElement(idPanel, element) {
	if (element.desc){
		task = element;
		if (task._id){
			if(task.isopen) {var isopen = "Открыта"} else {var isopen = "Закрыта"};
			$("#"+idPanel+" #elementTable").append(`<tr> <th scope="row">${task._id}</th>
							<td class="name">${task.name}</td>
							<td class="desc">${task.desc}</td>
							<td class="isopen">${isopen}</td>
							<td class="user">${task.user}</td>
							<td><a class="updateTask" href="#" id="userUpdate-${task._id}">Редактировать</a></td>
							<td><a class="deleteTask" href="#" id="userDelete-${task._id}">Удалить</a></td>
						</tr>`);
		}
	} else {
		user = element;
		if (user._id){
			$("#"+idPanel+" #elementTable").append(`<tr> <th scope="row">${user._id}</th>
							<td><input type="text" name="name" value="${user.name}"/></td>
							<td><a class="updateUser" href="#" id="userUpdate-${user._id}">Редактировать</a></td>
							<td><a class="deleteUser" href="#" id="userDelete-${user._id}">Удалить</a></td>
						</tr>`);
			$("#evPanel1 #user").append(`<option value="${user.name}">${user.name}</option>`);
		}
	}
}

function updateUser(id, form) {
	var name = $(form).find("input[name='name']").val();
    $.ajax({
        url: API_URL_USERS + id,
        method: 'put',
        contentType: 'application/json',
        data: JSON.stringify({name:name}),
    }).done(function(data) {
        alert(`Успешно обновлено - ${JSON.stringify(data)}`);
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        alert( "Oшибка обновления: " + err );
    });
}

function deleteUser(id, callback) {
    $.ajax({
        url: API_URL_USERS + id,
        method: 'delete'
    }).done(function(data) {
        alert(`Успешно удалено - ${JSON.stringify(data)}`);
        callback();
	}).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        alert( "Oшибка удаления: " + err );
    });
}

function deleteTask(id, callback) {
    $.ajax({
        url: API_URL_TASKS + id,
        method: 'delete'
    }).done(function(data) {
        alert(`Успешно удалена задача - ${JSON.stringify(data)}`);
        callback();
	}).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        alert( "Oшибка удаления: " + err );
    });
}

function updateTask(id, form) {
	$("#editTaskForm #id").val(id);
	$("#editTaskForm #name").val($(form).find(".name").html());
	$("#editTaskForm #desc").val($(form).find(".desc").html());
	if ($(form).find(".isOpen").html() == "Закрыта"){
		$("#editTaskForm #open").attr("checked", "checked");
	}
	$("#editTaskForm #user").val($(form).find(".user").html());
	$(".edit_task").css("display", "block");
}