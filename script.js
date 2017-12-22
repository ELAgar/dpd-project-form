$(document).ready(function () {


    var $contactForm = $('#contact-form'),
        $messagesBlock = $('#messages'),
        add = "",
        row = "";


    /*  SHOW DATA  */
    $.get({
        url: 'http://localhost:2403/form-reg/',
        success: function (res) {
            for (let i in res) {
                row += '<p class="regInfo" id="' + res[i].id + '">' +
                    '<i>Author: </i><b>' + res[i].name + '</b><br>' +
                    '<i>Message: </i><b>' + res[i].message + '</b>' +
                    '<button class="delete">Delete</button></p>';
            }
            $('#messages').html(row);
        }
    });


    /*  DELETE DATA (with 'id' help)  */
    $messagesBlock.on("click", ".delete", function () {
        var id = $(this).parent().attr('id');
        var $this = $(this);

        $.ajax({
            url: 'http://localhost:2403/form-reg/' + id,
            method: 'DELETE',
            success: function (res) {
                $this.parent().remove();
            }
        })
    });


    // data for error
    var $messages = {
        'required': 'The field is required',
        'invalid': 'The field is invalid',
        'short': 'The value of the field is too short. It must be have at least 4 characters!'
    };

    /*  CHECK VALUE OF INPUT  */
    $contactForm.find('input, textarea').blur(function () {
        var $this = $(this);
        if (!$('#' + $this.attr('id')).val()) {
            $this.next('.error').text($messages['required']);
        } else if ($this.attr('id') === 'email') {
            var str = $('#' + $this.attr('id')).val();
            var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!str.match(reg)) {
                $this.next('.error').text($messages['invalid']);
            } else {
                $this.next('.error').text('');
            }
        } else if ($('#' + $this.attr('id')).val().length <= 3) {
            $this.next('.error').text($messages['short']);
        } else {
            $this.next('.error').text('');
            $this.next('#error').text('');
        }
    });

    /*  ACTION AFTER CLICK SUBMIT  */
    $contactForm.find('input[type="submit"]').click(function (event) {
        event.preventDefault();
        var validation;

        $('.error').each(function () {
            if ($(this).text()) {
                validation = 'error';
            }
        });
        $('input, textarea').not('input[type="submit"], input[type="reset"]').each(function () {
            if (!$(this).val()) {
                validation = 'error';
            }
        });
        $contactForm.find('input[type="reset"]').click(function () {
            $(this).closest('form').find('.error').text('');
            $(this).closest('form').find('#error').text('');
        });


        /*  ADD MESSAGE  */
        if (!validation) {
            var name = $('#name').val();
            var email = $('#email').val();
            var subject = $('#subject ').val();
            var message = $('#message').val();

            $.post({
                url: "http://localhost:2403/form-reg/",
                contentType: 'application/json',
                data: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                }),
                success: function (res) {
                    add += '<p class="regInfo" id="' + res.id + '">' +
                        '<i>Author: </i><b>' + res.name + '</b><br> ' +
                        '<i>Message: </i><b>' + res.message + '</b>' +
                        '<button class="delete">Delete</button></p>';

                    // add to the end
                    $($messagesBlock).append(add);

                    // clear add
                    add = '';
                }
            });
            $contactForm.find('input[type="reset"]').click();
        } else {
            $contactForm.find('#error').text("Заполните все поля!");
        }
    });


});