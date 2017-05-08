var API_URL_USERS = '/api/v1/users/';
var API_URL_TASKS = '/api/v1/tasks/';

$(document).ready(function(){
	getList("evPanel1", API_URL_TASKS);	
	getList("userList", API_URL_USERS);
	
	$("#addForm").submit(function(event) {
        event.preventDefault();
        var posting = $.post(API_URL_USERS,  $(this).serialize());
        posting.done(function(data) {
			alert(`Успешно добавлено - ${JSON.stringify(data.name)}`);
			appendElement(data);
			$("#addForm #name").val("");
        });
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
});

function getList(idPanel, url, find){
	$("#"+idPanel+" #elementTable tbody").empty();
    $.getJSON(url, (find) ? {find: find} : {})
        .done(function(elements) {
            $.each(elements, function(i, element) {
                appendElement(element);
            });
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            $("#"+idPanel).html("Ошибка запроса: " + err);
        });
}

function appendElement(user) {
	if (user._id){
		$("#elementTable").append(`<tr> <th scope="row">${user._id}</th>
						<td><input type="text" name="name" value="${user.name}"/></td>
						<td><a class="updateUser" href="#" id="userUpdate-${user._id}">Edit</a></td>
						<td><a class="deleteUser" href="#" id="userDelete-${user._id}">Delete</a></td>
					</tr>`);
	}
}

function updateUser(id, form) {
	var name = $(form).find("input[name='name']").val();
    $.ajax({
        url: API_URL_USERS + id,
        method: 'put',
        contentType: 'application/json',
        data: "name:"+name,
    }).done(function(data) {
        alert(`Успешно обновлено - ${JSON.stringify(data)}`);
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        alert( "Ошибка обновления: " + err );
    });
}

function deleteUser(id, callback) {
    $.ajax({
        url: API_URL_USERS + id,
        method: 'delete'
    }).done(function(data) {
        alert(`Успешно удалено - ${JSON.stringify(data)}`);
        callback();
	});
}