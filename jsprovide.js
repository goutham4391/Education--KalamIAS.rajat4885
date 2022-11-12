var verifyOTP = {
    NotRequired: 0,
    Optional: 1,
    Mandatory: 2,
    Str: ['NotRequired', 'Optional', 'Mandatory']
};
var Type = {
    Question: 0,
    Test: 1,
    Lesson: 2,
    ExamInfo: 3,
    Assignment: 4,
    CutoffInfo: 5,
    ECommercePackage: 6,
    StudyPlan: 7,
    TypingTest: 8,
    LiveClasses: 9,
    Quizlist: 10,
    Str: ['Question', 'Test', 'Lesson', 'ExamInfo', 'Assignment', 'CutoffInfo', 'ECommercePackage', 'StudyPlan', 'TypingTest', 'LiveClasses', 'Quizlist']
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

function loadScript(url, callback, async) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (typeof callback === 'function') {
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback()
                }
            }
        } else {
            script.onload = function() {
                callback()
            }
        }
    }
    if (async) {
        script.async = !0
    }
    script.src = url;
    document.getElementsByTagName("body")[0].appendChild(script)
}

function objLength(obj) {
    return (typeof obj === 'object' && obj != null) ? Object.keys(obj).length : -1
};

function isNum(num) {
    return !isNaN(parseFloat(num))
}

function popUp(msg, cb, timeout) {
    var $popup = $('.pop-up');
    if (!$popup.length) {
        $popup = $('<div class="pop-up"></div>').appendTo($(document.body))
    }
    $popup.text(msg).show();
    setTimeout(function() {
        $popup.fadeOut(timeout || 600, function() {
            typeof cb === 'function' && cb()
        })
    }, timeout || 600)
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

function validateMobile(number) {
    return /^\d{10}$/.test(number)
}
dateFormat = function(inputDate) {
    var dateObj = new Date(inputDate);
    if (dateObj == 'Invalid Date') {
        return inputDate
    }
    date = dateObj.getDate();
    month = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",")[dateObj.getMonth()];
    year = dateObj.getFullYear();
    suffix = '';
    if (date > 3 && date < 21) {
        suffix = "th"
    } else {
        switch (date % 10) {
            case 1:
                suffix = "st";
                break;
            case 2:
                suffix = "nd";
                break;
            case 3:
                suffix = "rd";
                break;
            default:
                suffix = "th"
        }
    }
    return date + suffix + '-' + month + '-' + year
};

function dateAndTimeFormat(inputDate) {
    var formattedDate = dateFormat(inputDate);
    dateObj = new Date(inputDate);
    hours = dateObj.getHours();
    minutes = dateObj.getMinutes();
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var formatedTime = hours + ':' + minutes + ' ' + ampm;
    return formattedDate + ' ' + formatedTime
}
var _userObj = null;

function User() {
    this.userId = 0;
    this.userName = "Guest";
    this.tempUserId = "";
    this.phoneNo = "";
    this.emailId = "";
    this.subscribedExams = [];
    this.settings = [];
    this.addressPresent = null
}
User.getObj = function() {
    if (_userObj == null) {
        _userObj = new User();
        _userObj.BindEvents()
    }
    return _userObj
};
User.prototype.BindEvents = function() {
    if (typeof userData !== 'undefined') {
        this.userId = userData.id;
        this.userName = userData.displayName;
        if (userData.emailId == null) this.emailId = "";
        else
            this.emailId = userData.emailId;
        this.tempUserId = userData.tempId;
        this.subscribedExams = userData.tr2exams;
        this.settings = userData.settings;
        if (typeof userData.settings[2] !== 'undefined' && userData.settings[2].length == 10 && parseInt(userData.settings[2]) > 999999999) {
            this.phoneNo = userData.settings[2]
        }
        if (typeof userData.addressPresent !== 'undefined') {
            this.addressPresent = userData.addressPresent
        }
    }
    if (this.userId <= 0) {
        $("body").unbind("_showLoginDialogEvt").bind("_showLoginDialogEvt", this, function(e) {
            e.data.ShowDialog(e)
        })
    }
    if (this.userId <= 0) {
        $("body").unbind("_showLoginDialogEvt").bind("_showLoginDialogEvt", this, function(e) {
            e.data.ShowDialog(e)
        })
    }
    $('.refer-earn-section').find('.refer-inputs').hide();
    $('.js-refer-mail').off().on('click', function() {
        $(this).closest('.refer-options').hide();
        $('#refer-mail-input').show()
    });
    $('.js-refer-sms').off().on('click', function() {
        $(this).closest('.refer-options').hide();
        $('#refer-sms-input').show()
    });
    $('.js-send-refer-mail').off().on('click', this, function(e) {
        var email = $('#refer-mail-input input').val().trim();
        if (!validateEmail(email)) {
            return popUp("Invalid Email")
        }
        e.data.SendReferralMail(email, function(data) {
            if (data == 'SUCCESS') {
                return popUp('Mail sent Successfully!', function() {
                    $('.refer-inputs').hide();
                    $('.refer-options').show()
                })
            }
            console.error(data);
            return alert('Internal Error')
        })
    });
    $('.js-send-refer-sms').off().on('click', this, function(e) {
        var mobile = $('#refer-sms-input input').val().trim();
        if (!validateMobile(mobile)) {
            return popUp("Invalid Mobile Number")
        }
        e.data.SendReferralSMS(mobile, function(data) {
            if (data == 'SUCCESS') {
                return popUp('SMS sent Successfully!', function() {
                    $('.refer-inputs').hide();
                    $('.refer-options').show()
                })
            }
            console.error(data);
            return alert('Internal Error')
        })
    });
    if (this.userId <= 0) {
        try {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('login_required') === !0) {
                $("body").trigger({
                    type: "_showLoginDialogEvt",
                    tabName: "logintab"
                })
            }
        } catch (e) {}
    } else {
        $.ajax({
            type: "POST",
            url: "/?route=common/ajax",
            data: {
                mod: "viducampaign",
                ack: "getNotificationCenterConfig",
            },
            complete: function(event) {
                reply = event.responseJSON;
                if (reply.result.state == "ok") {
                    if (reply.data.useNotificationCenter) {
                        if (reply.data.viduNotification) {
                            userObj = User.getObj();
                            userObj.NotificationPanel(event.responseJSON.data.viduNotification)
                        }
                    }
                }
            }
        })
    }
};
User.prototype.NotificationPanel = function(ViduNotificaitonCenter) {
    $(".in-app-notification").removeClass("hidden");
    $('.in-app-notification').unbind('click').bind('click', this, function(e) {
        var display = $('#in-app-notification-dev').css('display');
        $('#in-app-notification-dev').css('display', display === 'none' ? 'block' : 'none');
        $('.in-app-notification').toggleClass("active")
    });
    const cookieName = "tr_" + window.location.host.split(".").join("_");
    const cookieData = getCookie(cookieName);
    if (cookieData == "") {
        alert("Unable to connect notification right now.");
        return !1
    }
    const notificationRoomName = "notify_" + domainId;
    var notificationCount = 0;
    const notificationSocket = new WebSocket(ViduNotificaitonCenter.wsUrl + notificationRoomName + "/?cookieName=" + cookieName + "&cookieData=" + cookieData);
    notificationSocket.onopen = function(e) {
        $.ajax({
            url: ViduNotificaitonCenter.apiUrl + "get_all_notification",
            type: "POST",
            data: {
                cookieName: cookieName,
                cookieData: cookieData,
            },
            complete: function(reply) {
                response = reply.responseJSON;
                data = response.data;
                notificationList = data.notifications;
                notificationCount = data.unread_count;
                if (notificationCount === 0) {
                    $(".badge").hide()
                }
                $(".in-app-notification .badge").html(notificationCount);
                notificationList.forEach(notification => {
                    const notificationData = notification.notificationData;
                    appendNotificationDiv(notificationData.scheduleDateTime, notificationData.notificationMessage, notificationData.launchUrl, notification.notificationId, notification.isNotificationRead)
                })
            }
        });
        $(document.body).append('<div class="message-flash-area"></div>')
    };
    notificationSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const notificationData = data.notificationData;
        showNotificationFlash(notificationData.notificationMessage);
        appendNotificationDiv(notificationData.scheduleDateTime, notificationData.notificationMessage, notificationData.launchUrl, data.notificationId, !1);
        $(".badge").show();
        $(".in-app-notification .badge").html(++notificationCount)
    };

    function showNotificationFlash(message) {
        $('.message-flash-area').append('<div class="message-flash">+' + message + '</div>');
        $('.message-flash').delay(3000).fadeOut(600)
    };
    notificationSocket.onclose = function(e) {
        console.log("notification disconnected.....")
    };

    function appendNotificationDiv(scheduleDateTime, notificationMessage, launchUrl, notificationId, isNotificationRead) {
        const senderLogo = "../img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/000000/external-user-interface-kiranshastry-lineal-kiranshastry-1.png";
        let notifyDiv = '	<div class="notificaion-details-container" data-notificaion-id =' + notificationId + '>' + '		<a class="notify-link-url" href="' + launchUrl + '">' + '         <div class="sender-avatar-container">' + '               <img src=' + senderLogo + '/>' + '         </div>' + '   	  <div class="notify-heading">' + '				<div class="notify-main-heading">' + '						<h3 class="notify-h3-heading">' + notificationMessage + '<span class="notify-time">' + getTimeGap(scheduleDateTime) + '</span>' + '						</h3>' + '				</div>' + '		   </div>' + '		   <div class="notificaion-read-container' + (isNotificationRead ? ' hidden' : '') + '">' + '		   		<div class="is-read-indicator">' + '		   		</div>' + '		   </div>' + '	  </a>' + '	</div>';
        $(".notification-content-container").prepend(notifyDiv);
        $(".notification-content-container [data-notificaion-id=" + notificationId + "]").unbind().bind("click", this, function(e) {
            if ($(this).find(".notificaion-read-container").hasClass('hidden')) {
                return
            }
            $(this).find(".notificaion-read-container").addClass("hidden");
            updateNotificationStatus(notificationId)
        })
    };

    function updateNotificationStatus(notificationId) {
        $.ajax({
            url: ViduNotificaitonCenter.apiUrl + "update_notification_status",
            type: "POST",
            data: {
                cookieName: cookieName,
                cookieData: cookieData,
                notificationId: notificationId,
            },
            complete: function(reply) {
                response = reply.responseJSON;
                if (response.status === "Success") {
                    $(".in-app-notification .badge").html(--notificationCount);
                    if (notificationCount == 0) {
                        $(".badge").hide()
                    }
                }
            }
        })
    };

    function getTimeGap(scheduleDateTime) {
        scheduleDateTime = new Date(scheduleDateTime);
        var currentDateTime = new Date();
        const milliDiff = currentDateTime - scheduleDateTime;
        return getSeconds(milliDiff) + " ago"
    };

    function getSeconds(milliDiff) {
        var sec = milliDiff / 1000;
        var fsec = Math.floor(sec);
        if (fsec < 60) {
            return fsec + " seconds"
        }
        return getMinutes(sec)
    };

    function getMinutes(seconds) {
        var mins = seconds / 60;
        var fmins = Math.floor(mins);
        if (fmins < 60) {
            return fmins + " minutes"
        }
        return getHours(mins)
    };

    function getHours(minutes) {
        var hours = minutes / 60;
        var fhours = Math.floor(hours);
        if (fhours < 24) {
            return fhours + " hours"
        }
        return getDays(hours)
    };

    function getDays(hours) {
        var days = hours / 24;
        var fdays = Math.floor(days);
        if (fdays < 7) {
            return fdays + " days"
        }
        return getWeeks(days)
    };

    function getWeeks(days) {
        var weeks = days / 7;
        var fweeks = Math.floor(weeks);
        if (fweeks < 5) {
            return fweeks + " weeks"
        }
        return getMonth(weeks)
    };

    function getMonth(week) {
        var months = week / 4.345;
        var fmonths = Math.floor(months);
        if (fmonths < 12) {
            return fmonths + " months"
        }
        return getYears(months)
    };

    function getYears(months) {
        return Math.floor(months / 12) + " years"
    }
};
User.prototype.ShowDialog = function(e) {
    this.LoadDialog(function() {
        GoogleSignInInit();
        LoadFacebookSDK();
        $('#loginModal').modal('show');
        $('.nav-tabs a[href="#' + this.tabName + '"]').tab('show');
        $("#txt_name").val("");
        $("#txt_email").val("");
        $("#txt_phno").val("");
        $("#txt_password").val("");
        if ($('button[data-action="SSOlogin"]').length > 0) {
            $('input.SSOField').each(function(e) {
                $(this).val("")
            })
        }
    }.bind(e))
};
User.prototype.LoadDialog = function(callback) {
    if ($('#loginModal').length == 0) {
        $.ajax({
            type: "POST",
            context: this,
            complete: function(data) {
                try {
                    $("#loginModalAppend").append(data.responseText);
                    $("[data-action='login']").unbind().bind("click", this, function(e) {
                        e.data.Login()
                    });
                    $('button[data-action="SSOlogin"]').unbind().bind("click", this, function(e) {
                        e.data.SSOLogin()
                    });
                    var loginFields = document.querySelectorAll('#txt_login_email, #txt_login_password ');
                    var loginFieldsArr = Array.prototype.slice.call(loginFields);
                    loginFieldsArr.forEach(function(el, i, arr) {
                        el.addEventListener('keypress', function(e) {
                            if (e.keyCode == 13 || e.which == 13) {
                                this.Login()
                            }
                        }.bind(this))
                    }.bind(this));
                    $("[data-action='register']").unbind().bind("click", this, function(e) {
                        e.data.Register()
                    });
                    var registerFields = document.querySelectorAll('#txt_name, #txt_email, #txt_phno, #txt_password ');
                    var registerFieldsArr = Array.prototype.slice.call(registerFields);
                    registerFieldsArr.forEach(function(el, i, arr) {
                        el.addEventListener('keypress', function(e) {
                            if (e.keyCode == 13 || e.which == 13) {
                                this.Register()
                            }
                        }.bind(this))
                    }.bind(this));
                    $("[data-action='forgotPassword']").unbind().bind("click", function() {
                        $("[data-action='forgotPassword']").css("display", "none");
                        $(".forgotPasswdDiv").css("display", "block")
                    });
                    $("[data-action='forget_login_submit']").unbind().bind("click", function() {
                        this.ForgotPassword()
                    }.bind(this));
                    $("[data-action='submit-mobile']").unbind().bind("click", this, function(e) {
                        e.data.GetOtpForLogin()
                    });
                    $("[data-action='got-otp']").unbind().bind("click", this, function(e) {
                        $(".loginMobileMsg").html("<div class='errorMsg'></div>");
                        var phoneno = $("#txt_login_mobile").val();
                        if (!validateMobile(phoneno)) {
                            $(".loginMobileMsg").html("<div class='errorMsg'>Invalid Mobile Number</div>");
                            return
                        }
                        $("[data-action='got-otp']").css("display", "none");
                        $('.MobileLogin .mobile_otp_div .validateOtp input').attr("disabled", !1);
                        $('.MobileLogin .mobile_otp_div .validateOtp input').css('background-color', '#fff')
                    });
                    $(".validateOtp .form-control").on("input", this, function(e) {
                        if ($(this).val().length == 1) {
                            var number = $(this).data("otp-index");
                            if (number == 4) {
                                e.data.OtpLogin()
                            } else if (number < 5) {
                                $("[data-otp-index = '" + (++number) + "']").focus()
                            }
                        }
                    });
                    callback()
                } catch (e) {
                    alert("Internal System Error!");
                    console.error(e)
                }
            },
            url: "/?route=common/login"
        })
    } else {
        callback()
    }
};
User.prototype.SSOLogin = function() {
    var fields = {};
    $('input.SSOField').each(function(e) {
        fields[$(this).attr("name")] = $(this).val()
    });
    $.ajax({
        type: "POST",
        context: this,
        data: {
            mod: "user",
            ack: "auth",
            sso: 1,
            platform: 'web',
            fields: fields
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == 'ok') {
                    var userData = reply.data;
                    _userObj.userId = userData.id;
                    _userObj.userName = userData.displayName;
                    _userObj.emailId = userData.emailId;
                    _userObj.subscribedExams = userData.tr2exams;
                    _userObj.settings = userData.settings[0];
                    $('#loginModal').modal('hide');
                    $("body").trigger({
                        type: "_loginSuccessEvt"
                    })
                } else {
                    $(".loginMsg").html("<div class='errorMsg'>" + reply.result.meta + "!</div>")
                }
            } catch (e) {
                $(".loginMsg").html("<div class='errorMsg'>Internal System Error!</div>");
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
User.prototype.Login = function(loginId, passwd, rememberMe) {
    if (typeof loginId === 'undefined') {
        loginId = $("#txt_login_email").val();
        passwd = $("#txt_login_password").val();
        rememberMe = $("#signin_rememberMe").prop('checked') ? 1 : 0
    }
    $.ajax({
        type: "POST",
        context: this,
        data: {
            mod: "user",
            ack: "auth",
            preRegisteredRequired: "0",
            loginId: loginId,
            passwd: passwd,
            rememberMe: rememberMe,
            platform: 'web'
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == 'ok') {
                    var userData = reply.data;
                    _userObj.userId = userData.id;
                    _userObj.userName = userData.displayName;
                    _userObj.emailId = userData.emailId;
                    _userObj.subscribedExams = userData.tr2exams;
                    _userObj.settings = userData.settings[0];
                    $('#loginModal').modal('hide');
                    $("body").trigger({
                        type: "_loginSuccessEvt"
                    })
                } else {
                    $(".loginMsg").html("<div class='errorMsg'>" + reply.result.meta + "!</div>")
                }
            } catch (e) {
                $(".loginMsg").html("<div class='errorMsg'>Internal System Error!</div>");
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
User.prototype.Register = function(displayName, email, pwd, phno, checkaddress) {
    if (typeof checkaddress === 'undefined') {
        checkaddress = !1;
        if ($(".Address-details").length > 0) {
            checkaddress = !0;
            _userObj.addressInRegister = !0
        }
    }
    if (typeof email === 'undefined') {
        var displayName = $("#txt_name").val();
        email = $("#txt_email").val();
        pwd = $("#txt_password").val();
        phno = $("#txt_phno").val()
    }
    $(".msg").html('');
    if (displayName == "") {
        $(".msg").html("<div class='errorMsg'>Name can not be empty!</div>");
        return
    }
    if (displayName.length > 42) {
        $(".msg").html("<div class='errorMsg'>Name can not be of more than 42 characters!</div>");
        return
    }
    if (email == "") {
        $(".msg").html("<div class='errorMsg'>Email Id can not be empty!</div>");
        return
    }
    if (email.length > 256) {
        $(".msg").html("<div class='errorMsg'>Email Id can not be of more than 256 characters!</div>");
        return
    }
    if (phno == "") {
        $(".msg").html("<div class='errorMsg'>Mobile number can not be empty!</div>");
        return
    }
    if (phno.length != 10 || phno.match(/[^0-9]/)) {
        $(".msg").html("<div class='errorMsg'>Mobile number should be of 10 digits!</div>");
        return
    }
    if (pwd == "") {
        $(".msg").html("<div class='errorMsg'>Password can not be empty!</div>");
        return
    }
    if (pwd.length > 48) {
        $(".msg").html("<div class='errorMsg'>Password can not be of more than 48 characters!</div>");
        return
    }
    var isaddressrequired = !0;
    if (checkaddress == !0) {
        isaddressrequired = this.checkaddressfields();
        if ((typeof _userObj.addressInRegister != "undefined" && _userObj.addressInRegister) && !isaddressrequired) {
            var addressField = $(".Address-details.register").find(".ErrorMsg").text();
            $(".Address-details.register").siblings(".msg").html("<div class='errorMsg'>" + addressField + "</div>");
            return
        }
    }
    if (isaddressrequired !== !1) {
        $.ajax({
            type: "POST",
            context: this,
            data: {
                mod: "user",
                ack: "new",
                preRegisteredRequired: "",
                registrationCode: "",
                registrationPassword: "",
                loginId: email,
                displayName: displayName,
                code: "+91",
                phno: phno,
                passwd: pwd,
                captcha: "",
                referral: ""
            },
            complete: function(event) {
                var reply = event.responseJSON;
                try {
                    if (reply.result.state == 'multiLogindetected') {
                        User.getObj().PageRefresh()
                    } else if (reply.result.state == 'ok') {
                        var userData = reply.data;
                        _userObj.userId = userData.id;
                        _userObj.userName = userData.displayName;
                        _userObj.emailId = userData.emailId;
                        _userObj.subscribedExams = Exam.getObj().myExams;
                        _userObj.settings = userData.settings[0];
                        User.getObj().RestoreMyExams(userData.id);
                        $('#loginModal').modal('hide');
                        $("body").trigger({
                            type: "_registerSuccessEvt"
                        })
                    } else {
                        $(".msg").html("<div class='errorMsg'>" + reply.result.meta + "!</div>")
                    }
                } catch (e) {
                    $(".msg").html("<div class='errorMsg'>Internal System Error!</div>");
                    console.error(e)
                }
            },
            url: "/?route=common/ajax"
        })
    }
};
User.prototype.checkaddressfields = function() {
    var addressclass = (typeof _userObj.addressInRegister != "undefined" && _userObj.addressInRegister ? ".register" : ".checkout");
    var addressdiv = $(".Address-details" + addressclass);
    var vError = !1;
    $(addressdiv).find(".fieldDiv").each(function() {
        var typeId = parseInt($(this).attr("data-typeid"));
        var required = parseInt($(this).attr("isrequired"));
        var plaintxt = parseInt($(this).parents('.Address-details').attr("data-plaintxt"));
        var number = parseInt($(this).parents('.Address-details').attr("data-number"));
        var selectenum = parseInt($(this).parents('.Address-details').attr("data-enum"));
        $(this).find(".ErrorMsg").text('');
        $(this).siblings(".fieldDiv").find(".ErrorMsg").text('');
        switch (typeId) {
            case plaintxt:
                var val = $(this).find("input").val();
                var fieldName = (typeof $(this).find("input").attr("placeholder") != "undefined" && $(this).find("input").attr("placeholder") != '') ? $(this).find("input").attr("placeholder") : "field";
                if (required == 1 && val.length == 0) {
                    $(this).addClass("ErrorInput");
                    $(this).find(".ErrorMsg").text(fieldName + ' cannot be empty');
                    vError = !0
                } else if (val.length > 0) {
                    $(this).find(".ErrorMsg").text('')
                }
                break;
            case number:
                var val = $(this).find("input").val();
                var fieldName = (typeof $(this).find("input").attr("placeholder") != "undefined" && $(this).find("input").attr("placeholder") != '') ? $(this).find("input").attr("placeholder") : "field";
                if (required == 1 && (val.length == 0 || val.match(/[^0-9]/))) {
                    $(this).addClass("ErrorInput");
                    $(this).find(".ErrorMsg").text(fieldName + ' cannot be empty and should contain only digits');
                    vError = !0
                } else if (val.length > 0) {
                    $(this).find(".ErrorMsg").text('')
                }
                break;
            case selectenum:
                var val = $(this).find("select").val();
                if (required == 1 && val == -1) {
                    $(this).addClass("ErrorInput");
                    $(this).find(".ErrorMsg").text('Please select a valid option');
                    vError = !0
                } else if (val != -1) {
                    $(this).find(".ErrorMsg").text('')
                }
                break
        }
        if (vError == !0) {
            return !1
        }
    });
    if (vError == !0) {
        if ($(".Address-details.checkout").length !== 0 && !_userObj.addressInRegister) {
            $('html, body').animate({
                scrollTop: $(".Address-details.checkout").offset().top - 110
            }, 800)
        }
        return !1
    } else {
        return !0
    }
};
User.prototype.UpdateAddress = function(callBack) {
    var addressclass = (typeof _userObj.addressInRegister != "undefined" && _userObj.addressInRegister ? ".register" : ".checkout");
    var addressdiv = $(".Address-details" + addressclass);
    var sectionId = $(addressdiv).attr("data-addresssectionId");
    var postData = {};
    $(addressdiv).find(".fieldDiv").each(function() {
        var typeId = parseInt($(this).attr("data-typeid"));
        var required = parseInt($(this).attr("isrequired"));
        var plaintxt = parseInt($(this).parents('.Address-details').attr("data-plaintxt"));
        var selectenum = parseInt($(this).parents('.Address-details').attr("data-enum"));
        var number = parseInt($(this).parents('.Address-details').attr("data-number"));
        $(this).find(".ErrorMsg").text('');
        $(this).siblings(".fieldDiv").find(".ErrorMsg").text('');
        switch (typeId) {
            case plaintxt:
                var val = $(this).find("input").val();
                if (val.length > 0) {
                    $(this).find(".ErrorMsg").text('');
                    postData[$(this).attr("data-fieldid")] = val
                }
                break;
            case number:
                var val = $(this).find("input").val();
                if (required == 1 && (val.length == 0 || val.match(/[^0-9]/))) {
                    $(this).addClass("ErrorInput");
                    $(this).find(".ErrorMsg").text('field cannot be empty and should contain only digits');
                    vError = !0
                } else if (val.length > 0) {
                    $(this).find(".ErrorMsg").text('');
                    postData[$(this).attr("data-fieldid")] = val
                }
                break;
            case selectenum:
                var val = $(this).find("select").val();
                if (val != -1) {
                    $(this).find(".ErrorMsg").text('');
                    postData[$(this).attr("data-fieldid")] = val
                }
                break
        }
    });
    if (!jQuery.isEmptyObject(postData)) {
        if (typeof callBack === 'undefined') {
            callBack = null
        }
        $.ajax({
            type: "POST",
            data: {
                mod: "profilefields",
                ack: "saveprofile",
                data: postData,
                id: sectionId
            },
            complete: function(event) {
                try {
                    var reply = event.responseJSON;
                    if (reply.result.state == 'multiLogindetected') {
                        User.getObj().PageRefresh()
                    } else if (reply.result.state == "ok") {
                        $(this.addressdiv).find('.fieldDiv').each(function() {
                            if ($(this).find('input').length > 0) {
                                $(this).find('input').addClass("edit_disabled")
                            } else if ($(this).find('select').length > 0) {
                                $(this).find('select').addClass("edit_disabled")
                            }
                        });
                        $('.Address-details').find('.UpdateAddress').text('Edit Address');
                        if (this.callBack == null) {
                            if (typeof _userObj.addressInRegister === 'undefined') {
                                alert("Saved Details Successfully!");
                                location.reload()
                            }
                        } else {
                            this.callBack()
                        }
                    } else {
                        alert("Error: " + reply.result.meta + " ")
                    }
                } catch (e) {
                    alert("Internal Error");
                    console.log(e)
                }
            }.bind({
                obj: this,
                callBack: callBack,
                addressdiv: addressdiv
            }),
            url: "/?route=common/ajax"
        })
    }
};
User.prototype.ForgotPassword = function(loginId) {
    if (typeof loginId === 'undefined') {
        var loginId = $("#txt_login_email_forget").val()
    }
    $.ajax({
        type: "POST",
        data: {
            mod: "user",
            ack: "forgetpassword",
            loginId: loginId
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    $(".msgForgetPwd").html("<div class='errorMsg'>We have sent you the password reset link via email at " + loginId + " </div>")
                } else {
                    $(".msgForgetPwd").html("<div class='errorMsg'> " + reply.result.meta + "! </div>")
                }
            } catch (e) {
                $(".msgForgetPwd").html("<div class='errorMsg'>Internal System Error!</div>");
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
User.prototype.GetOtpForLogin = function() {
    var phoneno = $("#txt_login_mobile").val();
    if (!validateMobile(phoneno)) {
        $(".loginMobileMsg").html("<div class='errorMsg'>Invalid Mobile Number</div>");
        return
    }
    var data = {
        mod: "user",
        ack: "getotp",
        phone: phoneno
    };
    $.ajax({
        type: "POST",
        data: data,
        context: this,
        complete: function(event) {
            var reply = event.responseJSON;
            if (reply.result.state == 'multiLogindetected') {
                User.getObj().PageRefresh()
            } else if (reply.result.state == "ok") {
                if (reply.data.state == "ok") {
                    $(".loginMobileMsg").html("<div class='successMsg'>" + reply.data.msg + "</div>");
                    $('.MobileLogin .mobile_otp_div .validateOtp input').attr("disabled", !1);
                    $('.MobileLogin .mobile_otp_div .validateOtp input').css('background-color', '#fff');
                    return
                }
            } else {
                $(".loginMobileMsg").html("<div class='errorMsg'>" + reply.result.meta + "</div>");
                return
            }
        },
        url: "/?route=common/ajax"
    })
};
User.prototype.OtpLogin = function(phoneno, otp) {
    if (typeof phoneno === 'undefined') {
        phoneno = $("#txt_login_mobile").val();
        otp = '';
        $(".validateOtp .form-control").each(function(i, el) {
            otp += $(el).val()
        })
    }
    if (!validateMobile(phoneno)) {
        $(".loginMobileMsg").html("<div class='errorMsg'>Invalid Mobile number</div>");
        return
    }
    $.ajax({
        type: "POST",
        context: this,
        data: {
            mod: "user",
            ack: "otpauth",
            phoneno: phoneno,
            otp: otp,
            platform: 'web'
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == 'ok') {
                    if (reply.data.state == "error") {
                        $(".loginMobileMsg").html("<div class='errorMsg'>" + reply.data.msg + "</div>")
                    } else {
                        var userData = reply.data;
                        _userObj.userId = userData.id;
                        _userObj.userName = userData.displayName;
                        _userObj.emailId = userData.emailId;
                        _userObj.subscribedExams = userData.tr2exams;
                        _userObj.settings = userData.settings[0];
                        $('#loginModal').modal('hide');
                        $("body").trigger({
                            type: "_loginSuccessEvt"
                        })
                    }
                } else {
                    $(".loginMobileMsg").html("<div class='errorMsg'>" + reply.result.meta + "</div>")
                }
            } catch (e) {
                $(".loginMobileMsg").html("<div class='errorMsg'>Internal System Error</div>");
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
User.prototype.Logout = function() {
    $.ajax({
        type: "POST",
        data: {
            mod: "user",
            ack: "logout"
        },
        complete: function(event) {
            var reply = event.responseJSON;
            if (reply.result.state == 'multiLogindetected') {
                User.getObj().PageRefresh()
            } else if (reply.result.state == "ok") {
                $(" .profilepic").css("display", "none");
                _userObj.userId = 0;
                GoogleLogout();
                if (typeof TRTracker !== 'undefined') {
                    TRTracker.getObj().TrackEvent("logout", function() {})
                }
            }
        },
        url: "/?route=common/ajax"
    })
};
User.prototype.RestoreMyExams = function(userId) {
    $.ajax({
        type: "POST",
        data: {
            mod: "user",
            ack: "restoremyexams",
            userId: userId
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state !== "ok") {
                    alert("Error")
                }
            } catch (e) {
                alert("Internal System Error");
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
User.prototype.RedirectToProfile = function(userId) {
    $.ajax({
        type: "GET",
        data: {
            mod: "user",
            ack: "getprofileurl"
        },
        complete: function(event) {
            var res = event.responseJSON;
            try {
                if (res.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (res.result.state == "ok") {
                    window.location.href = res.data
                } else {
                    alert("Internal Error");
                    console.error(res.result.meta)
                }
            } catch (e) {
                alert("Internal Error");
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
User.prototype.OptForOtpLogin = function() {
    var OptForOtpModal = '<div class="modal fade" id="OptForOtpFrame" tabindex="-1" role="dialog" aria-labelledby="memberModalLabel" aria-hidden="true">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>' + '<h3 class="modal-title" id="memberModalLabel">OTP Login</h3>' + '</div>' + '<div class="modal-body text-center">' + '<div class="">' + '<span>Do you want to Opt for OTP Login?</span>' + '<div class="buttonsDiv">' + '<button class="btn btn-primary yesOptForOtp" href="javascript:;"><strong>Yes</strong></button>' + '<button class="btn btn-primary noOptForOtp" href="javascript:;"><strong>No</strong></button>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
    if (!document.getElementById('OptForOtpFrame')) {
        $("#optForOtpModalAppend").append(OptForOtpModal);
        $('#OptForOtpFrame').modal('show')
    } else {
        $('#OptForOtpFrame').modal('show')
    }
    $('#OptForOtpFrame').find('.yesOptForOtp').unbind().bind('click', function() {
        console.log("Yes");
        $('#OptForOtpFrame').modal('hide');
        var data = {
            mod: "user",
            ack: "optForOtpLogin"
        };
        $.ajax({
            type: "POST",
            data: data,
            complete: function(event) {
                var reply = event.responseJSON;
                console.log(reply);
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    User.getObj().RedirectToProfile()
                } else {
                    alert(reply.result.meta)
                }
            },
            url: "/?route=common/ajax"
        });
        $('.otpMargin').removeClass('.otpMargin');
        $('.otpMargin').addClass('.otpMargin-verified')
    });
    $('#OptForOtpFrame').find('.noOptForOtp').unbind().bind('click', function() {
        console.log("No");
        $('#OptForOtpFrame').modal('hide');
        User.getObj().RedirectToProfile()
    });
    $('#OptForOtpFrame').find('button.close').unbind().bind('click', function() {
        $('#OptForOtpFrame').modal('hide');
        User.getObj().RedirectToProfile()
    })
};
User.prototype.GetContactDetails = function() {
    var getContactDetails = '<div class="modal fade" id="getContactDetails" tabindex="-1" role="dialog" aria-labelledby="memberModalLabel" aria-hidden="true">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button>' + '<h3 class="modal-title text-center" id="memberModalLabel">Contact Details</h3></div>' + '<div class="modal-body text-center">' + '<h4>Please Fill up your contact details</h4>' + '<div class="contact-element">' + '<input type = "text" data-contact-type="mobileNo" placeholder="Enter mobile number" value="' + this.phoneNo + '">' + '</div>' + '<div class="contact-element">' + '<input type = "text" data-contact-type="emailId" placeholder="Enter email" value="' + this.emailId + '">' + '</div>' + '<h5 class="warning-msg msg1">* Phone no. can not have charecters.</h5>' + '<h5 class="warning-msg msg2">* Phone no. should have 10 numbers.</h5>' + '<h5 class="warning-msg msg3">* Please fill atleast one of the details.</h5>' + '<h5 class="warning-msg msg4">* Please give a valid email.</h5>' + '<button type="button" class="btn btn-primary" data-action="detailsSubmit">Submit</button>' + '</div>' + '</div>' + '</div>' + '</div>';
    $("#ContactDetailsAppend").append(getContactDetails);
    if (this.emailId == "" && this.phoneNo == "") {
        function modalShow() {
            var activeModal = $("#ContactDetailsAppend").find(".modal.fade.in");
            setTimeout(function() {
                if (activeModal.length == 0) {
                    $(".warning-msg").hide();
                    $('#getContactDetails').modal('show')
                }
            }, 1000);
            setTimeout(function() {
                if (this.emailId == "" && this.phoneNo == "") {
                    modalShow()
                }
            }, 5000)
        }
        modalShow()
    } else {
        $('#getContactDetails').modal('show')
    }
    $('[data-action="detailsSubmit"]').unbind().bind("click", this, function() {
        $(".warning-msg").hide();
        var phoneNoTxt = $("[data-contact-type='mobileNo']").val();
        var phoneNo = phoneNoTxt == "" ? "" : parseInt(phoneNoTxt);
        var emailId = $("[data-contact-type='emailId']").val();
        var detailerror = 0;
        if (phoneNoTxt == "" && emailId == "") {
            $(".warning-msg").hide();
            $(".warning-msg.msg3").show();
            return
        }
        if (phoneNoTxt != "") {
            if (isNaN(phoneNo)) {
                $(".warning-msg.msg1").show();
                detailerror = 1
            }
            if (phoneNo < 1000000000 || phoneNo > 9999999999) {
                $(".warning-msg.msg2").show();
                detailerror = 1
            }
        }
        if (emailId != "") {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!regex.test(emailId)) {
                $(".warning-msg.msg4").show();
                detailerror = 1
            }
        }
        if (detailerror == 1) return;
        $.ajax({
            type: "POST",
            data: {
                mod: "user",
                ack: "getContactDetails",
                userId: userData.id,
                phno: phoneNo,
                emailId: emailId,
                code: "+91"
            },
            complete: function(event) {
                var reply = event.responseJSON;
                try {
                    if (reply.result.state == 'multiLogindetected') {
                        User.getObj().PageRefresh()
                    } else if (reply.result.state == "ok") {
                        location.reload()
                    }
                } catch (e) {
                    alert("Internal System Error");
                    console.error(e)
                }
            },
            url: "/?route=common/ajax"
        })
    })
};
User.prototype.VerifyOTP = function(userinfo) {
    var verifyOTPhtml = '<div class="modal fade" id="VerifyMobileFrame" tabindex="-1" role="dialog" aria-labelledby="memberModalLabel" aria-hidden="true">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">';
    if (typeof verifyOtp != "undefined" && verifyOtp != verifyOTP.Mandatory) {
        verifyOTPhtml += '<button type="button" class="close" data-dismiss="modal" data-action="pauseOnBoarding" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>'
    }
    verifyOTPhtml += '<h3 class="modal-title" id="memberModalLabel"> Verify Mobile Number</h3></div>' + '<div class="modal-body text-center">' + '<div class="row msg msg1"><span>Click on \'Resend OTP\' to get new OTP</span></div>' + '<div class="phoneNoDiv"><span id="MobileNoToVerify" ></span><span class="glyphicon glyphicon-edit editPhoneBtn" aria-hidden="true"></span></div>' + '<div class="editPhoneDiv Hidden">' + '<input type="text" class="form-control" placeholder="Enter mobile number here">' + '<div class="text-center">' + '<button class="btn btn-primary submitPhoneNo" href="javascript:;"><strong>Submit</strong></button>' + '</div>' + '</div>' + '<div class="input-group OTPToValidate">' + '<input class="form-control" data-otp-index = "1" type="password" aria-describedby="basic-addon1" maxlength="1">' + '<input class="form-control" data-otp-index = "2" type="password" aria-describedby="basic-addon1" maxlength="1">' + '<input class="form-control" data-otp-index = "3" type="password" aria-describedby="basic-addon1" maxlength="1">' + '<input class="form-control" data-otp-index = "4" type="password" aria-describedby="basic-addon1" maxlength="1">' + '</div>' + '<div class="row msg msg2"></div>' + '<div class="row OPTBtns"> <a id="VerifyOTP" href="javascript:;" class="btn btn-primary text-center"><strong>Verify ></strong></a></div>' + '<div>Not received OTP yet?</div>' + '<div><a id="GetOTP" href="javascript:;" class="btn btn-default"><strong>Resend OTP</strong></a></div>' + '</div>' + '</div>' + '</div>' + '</div>';
    var UserSettings = {
        PhoneNumber: 2,
        PhoneNumberVerified: 3
    };
    if (typeof userinfo.settings != "undefined" && typeof userinfo.settings != "undefined" && ((typeof userinfo.settings[UserSettings.PhoneNumberVerified] == "undefined" || parseInt(userinfo.settings[UserSettings.PhoneNumberVerified]) != 1) || (typeof userinfo.settings[UserSettings.PhoneNumber] == "undefined" || userinfo.settings[UserSettings.PhoneNumber] == ""))) {
        if (!document.getElementById('VerifyMobileFrame')) {
            $("#verifyOTPModalAppend").append(verifyOTPhtml);
            if (typeof verifyOtp != "undefined" && verifyOtp == verifyOTP.Mandatory) {
                $("#VerifyMobileFrame").attr("data-backdrop", "static");
                $("#VerifyMobileFrame").attr("data-keyboard", "false")
            }
            $('#VerifyMobileFrame').modal('show');
            $("#GetOTP").prop("disabled", !1);
            $("#VerifyMobileFrame input").val("");
            $("#VerifyMobileFrame .msg").empty();
            var phonenoValidator = /^\d{10}$/;
            var phoneno = "";
            if (typeof userinfo.settings != "undefined" && typeof userinfo.settings[UserSettings.PhoneNumber] != "undefined") {
                phoneno = userinfo.settings[UserSettings.PhoneNumber]
            }
            if (phoneno.match(phonenoValidator)) {
                $("#MobileNoToVerify").text(phoneno);
                this.GetOTP();
                $("#VerifyMobileFrame .msg.msg1").html('<span>Click on Get new OTP button</span>')
            } else {
                $("#VerifyMobileFrame .msg.msg1").html('<span>Please enter 10 digit mobile number</span>');
                editPhoneNumber()
            }
            $("[data-action='pauseOnBoarding']").click(function() {
                $("body").trigger({
                    type: "_pauseOnBoardingEvt"
                })
            });
            $("#VerifyMobileFrame").css("display", "block");
            if (typeof forceOTP !== 'undefined') {
                $(".closeButton").css("visibility", "hidden")
            }
            $(".editPhoneBtn").unbind().bind("click", editPhoneNumber);

            function editPhoneNumber() {
                $(".editPhoneDiv").css("display", "block");
                $(".phoneNoDiv").css("display", "none")
            }
            $(".submitPhoneNo").unbind().bind("click", this, function(e) {
                var enteredPhno = $('.editPhoneDiv input').val().trim();
                phnoValidator = /^\d{10}$/;
                if (enteredPhno.match(phnoValidator)) {
                    $("#MobileNoToVerify").text(enteredPhno);
                    $(".phoneNoDiv").css("display", "block");
                    $(".editPhoneDiv").css("display", "none");
                    e.data.GetOTP()
                } else {
                    $("#VerifyMobileFrame .msg.msg1").html('<div class="errorMsg">Please provide 10 digit mobile number</div>')
                }
            });
            $(".OTPToValidate .form-control").on("input", function() {
                if ($(this).val().length == 1) {
                    var number = $(this).data("otp-index");
                    if (number < 5) $("[data-otp-index = '" + (++number) + "']").focus()
                }
            });
            $('#GetOTP').unbind().bind("click", this, function(e) {
                e.data.GetOTP()
            });
            $('#VerifyOTP').unbind().bind("click", function() {
                var phonenoValidator = /^\d{10}$/;
                var phoneno = $("#MobileNoToVerify").text().trim();
                var otp = "";
                $(".OTPToValidate .form-control").each(function(i, el) {
                    otp += $(el).val()
                });
                $("#VerifyMobileFrame .msg").html('');
                if (phoneno.match(phonenoValidator)) {
                    var data = {
                        mod: "user",
                        ack: "verifyotp",
                        phone: phoneno,
                        otp: otp
                    };
                    $.ajax({
                        type: "POST",
                        data: data,
                        complete: function(event) {
                            var reply = event.responseJSON;
                            if (reply.result.state == 'multiLogindetected') {
                                User.getObj().PageRefresh()
                            } else if (reply.result.state == "ok") {
                                switch (reply.data.state) {
                                    case "ok":
                                        $('#VerifyMobileFrame').modal('hide');
                                        User.getObj().OptForOtpLogin();
                                        break;
                                    case "error":
                                        $("#VerifyMobileFrame .msg.msg2").html('<div class="errorMsg">' + reply.data.msg + '</div>');
                                        break;
                                    default:
                                        $("#VerifyMobileFrame .msg.msg2").html('<span>' + reply.data.msg + '</span>');
                                        $("#VerifyMobileFrame").css("display", "none")
                                }
                            }
                        },
                        url: "/?route=common/ajax"
                    })
                } else {
                    $("#VerifyMobileFrame .msg.msg1").html('<div class="errorMsg">Error: Please provide 10 digit mobile number</div>');
                    $("#GetOTP").prop("disabled", !1)
                }
            })
        } else {
            $('#VerifyMobileFrame').modal('show')
        }
        $("#OTPToValidate").val("")
    }
};
User.prototype.GetOTP = function() {
    var phonenoValidator = /^\d{10}$/;
    var phoneno = $("#MobileNoToVerify").text().trim();
    $("#OTPToValidate").val('');
    $("#VerifyMobileFrame .msg").html('');
    if (phoneno.match(phonenoValidator)) {
        var data = {
            mod: "user",
            ack: "sentotp",
            phone: phoneno
        };
        $.ajax({
            type: "POST",
            data: data,
            complete: function(event) {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    if (reply.data.state == "error") {
                        $("#VerifyMobileFrame .msg.msg1").html('<div class="errorMsg">' + reply.data.msg + '</div>');
                        $("#GetOTP").prop("disabled", !0)
                    } else {
                        $("#VerifyMobileFrame .msg.msg1").html('<span class="successMsg">' + reply.data.msg + '</span>')
                    }
                } else {
                    $("#VerifyMobileFrame .msg.msg1").html('<div class="errorMsg">' + reply.data.msg + '</div>')
                }
            },
            url: "/?route=common/ajax"
        })
    } else {
        $("#VerifyMobileFrame .msg.msg1").html('<div class="errorMsg">Error: Please provide 10 digit mobile number</div>');
        $("#GetOTP").prop("disabled", !1)
    }
};
User.prototype.GetReferralCode = function(callback) {
    console.log('Refer called');
    $.ajax({
        type: 'POST',
        url: "/?route=common/ajax",
        data: {
            mod: 'tr2ecomm',
            ack: 'refer',
        },
        complete: function(event) {
            var res = event.responseJSON;
            try {
                if (res.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (res.result.state == "ok") {
                    console.log(res.data);
                    typeof callback === 'function' && callback(res.data)
                }
            } catch (e) {
                console.error(e);
                alert('Internal Error!')
            }
        },
    })
};
User.prototype.ShowReferalModal = function() {
    if ($('#referral-modal').length == 0) {
        return this.GetReferralCode(function(data) {
            this.LoadReferralModal(data, function() {
                $('#referral-modal').modal('show')
            })
        }.bind(this))
    }
    $('#referral-modal').modal('show')
};
User.prototype.LoadReferralModal = function(data, callback) {
    console.log('load modal');
    var referModal = '<div id="referral-modal" class="modal fade refer-modal"  role="dialog">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal"><img src="https://' + systemSettings.cdn.bucket + '/images/blue-close-023e934e06031.png"/></button>' + '<h4 class="modal-title">Refer &amp; Earn</h4>' + '<div>' + data.userMsg + '</div>' + '</div>' + '<div class="modal-body">' + '<div class="text-center">' + '<div>Your Referral Code:</div>' + '<div class="refer-code">' + data.referralCode + '</div>' + '</div>' + '<div class="refer-options">' + '<div data-media="facebook" class="js-refer-mail"><img src="https://' + systemSettings.cdn.bucket + '/images/fb_02228a17014d5.png"/>Send Email</div>' + '<div data-media="facebook" class="js-refer-sms"><img src="https://' + systemSettings.cdn.bucket + '/images/fb_02228a17014d5.png"/>Send SMS</div>' + '<div data-media="facebook" class="js-refer-copy"><img src="https://' + systemSettings.cdn.bucket + '/images/fb_02228a17014d5.png"/>Copy Code	</div>' + '</div>' + '<div class="send-coupon-mail">' + '<div>Enter email of friend whom you want to refer</div>' + '<div class="input-group">' + '<input id="refer-mail-input" type="text" class="form-control" placeholder="abc@example.com">' + '<span class="input-group-btn">' + '<button class="btn btn-primary js-send-refer-mail" type="button">SEND</button>' + '</span>' + '</div>' + '</div>' + '<div class="send-coupon-sms">' + '<div><input type="text" id="refer-mail-input" class="form-control" placeholder="9XXXXXXXXX"/></div>' + '<div><button class="btn btn-primary">SEND</button></div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
    var $modal = $(referModal).appendTo('body');
    var resetModal = function() {
        $('.refer-options').show();
        $('.send-coupon-mail').hide();
        $('.send-coupon-sms').hide()
    };
    $modal.find('.close').on('click', resetModal);
    $('.js-refer-mail').off().on('click', function() {
        $(this).closest('.refer-options').hide();
        $('.send-coupon-mail').show()
    });
    $('.js-refer-sms').off().on('click', function() {
        $(this).closest('.refer-options').hide();
        $('.send-coupon-sms').show()
    });
    $('.js-send-refer-mail').off().on('click', function() {});
    typeof callback === 'function' && callback()
};
User.prototype.SendReferralMail = function(email, callback) {
    console.log('Sending Mail');
    $.ajax({
        type: 'POST',
        url: "/?route=common/ajax",
        data: {
            mod: 'tr2ecomm',
            ack: 'sendrefermail',
            email: email
        },
        complete: function(event) {
            var res = event.responseJSON;
            try {
                if (res.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (res.result.state == "ok") {
                    console.log(res.data);
                    typeof callback === 'function' && callback(res.data)
                } else {
                    throw res.result.meta
                }
            } catch (e) {
                console.error(e);
                alert('Internal Error!')
            }
        },
    })
};
User.prototype.SendReferralSMS = function(mobile, callback) {
    $.ajax({
        type: 'POST',
        url: "/?route=common/ajax",
        data: {
            mod: 'tr2ecomm',
            ack: 'sendrefersms',
            mobile: mobile
        },
        complete: function(event) {
            var res = event.responseJSON;
            try {
                if (res.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (res.result.state == 'ok') {
                    typeof callback === 'function' && callback(res.data)
                } else {
                    throw res.result.meta
                }
            } catch (e) {
                console.error(e);
                alert('Internal Error!')
            }
        },
    })
};
User.prototype.PageRefresh = function() {
    if ($('#multiLogin').length == 0) {
        var multiLoginhtml = '<div class="modal fade" id="multiLogin" tabindex="-1" role="dialog" aria-labelledby="memberModalLabel" aria-hidden="true">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-body text-center">' + '<h3>Multiple login detected. Please refresh your page to keep continue.</h3>' + '<div class="btn-div"><a class="btn btn-primary " data-action="page-reload">Page Reload</a></div>' + '</div>' + '</div>' + '</div>' + '</div>';
        $('#multiLoginModalAppend').append(multiLoginhtml);
        $("#multiLogin").modal({
            backdrop: 'static',
            keyboard: !1,
            show: !0
        })
    }
    $('[data-action="page-reload"]').unbind().bind('click', function() {
        window.location.reload()
    });
    $('#multiLogin').modal('show')
};
User.prototype.GetAddressModal = function(callback) {
    if ($('#forcedAddressModal').length == 0) {
        $.ajax({
            type: "POST",
            context: this,
            complete: function(data) {
                try {
                    $("#forcedAddressModalAppend").append(data.responseText);
                    $(".UpdateAddress").unbind().bind("click", this, function(e) {
                        _userObj.addressInRegister = !0;
                        if (!User.getObj().checkaddressfields()) {
                            var addressField = $(".Address-details.register").find(".ErrorMsg").text();
                            $(".Address-details.register").siblings(".msg").html("<div class='errorMsg'>" + addressField + "</div>");
                            return
                        } else {
                            User.getObj().UpdateAddress();
                            $("#forcedAddressModal").modal("hide");
                            alert("successfully updated profile.");
                            location.reload()
                        }
                    });
                    callback()
                } catch (e) {
                    alert("Internal System Error!");
                    console.error(e)
                }
            },
            url: "/?route=common/forcedaddress"
        })
    } else {
        callback()
    }
};

function GoogleSignInInit() {
    var clientId = "";
    if (typeof domainId == 'undefined' || domainId == 0) {
        clientId = "259635830021-qo5aalp6t7uc3q5m657em2vua5o2i6iu.apps.googleusercontent.com"
    } else if ((typeof googleClientId != "undefined" && googleClientId.length > 5)) {
        clientId = googleClientId
    }
    if (clientId != "") {
        $('head').append('<meta name="google-signin-client_id" content="' + clientId + '">' + '<script src="https://apis.google.com/js/platform.js?onload=onLoadGApi" async defer></script>')
    }
}

function onLoadGApi() {
    gapi.load('auth2', function() {
        gapi.auth2.init()
    })
}

function onGoogleSignIn(googleUser) {
    if (typeof User.getObj().userId == "undefined" || User.getObj().userId <= 0) {
        var id_token = googleUser.getAuthResponse().id_token;
        $.ajax({
            type: "POST",
            data: {
                mod: "user",
                ack: "googlelogin",
                id_token: id_token
            },
            complete: function(event) {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    var userData = reply.data;
                    _userObj.userId = userData.id;
                    _userObj.userName = userData.displayName;
                    _userObj.emailId = userData.emailId;
                    var newUser = reply.data.newUser;
                    if (newUser) {
                        $('#loginModal').modal('hide');
                        $("body").trigger({
                            type: "_googleRegisterSuccessEvt"
                        })
                    } else {
                        $("body").trigger({
                            type: "_loginSuccessEvt"
                        })
                    }
                }
            },
            url: "/?route=common/ajax"
        })
    }
}

function GoogleLogout() {
    var logoutSuccess = function() {
        $("body").trigger({
            type: "_logoutSuccessEvt"
        })
    };
    try {
        if (typeof gapi !== 'undefined') {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(logoutSuccess, logoutSuccess)
        } else {
            logoutSuccess()
        }
    } catch (e) {
        console.error(e);
        logoutSuccess()
    }
}

function LoadFacebookSDK() {
    if (typeof fbAppId != "undefined" && fbAppId.length > 5) {
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "../connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs)
        }(document, 'script', 'facebook-jssdk'))
    }
}
window.fbAsyncInit = function() {
    if (typeof fbAppId != "undefined" && fbAppId.length > 5) {
        FB.init({
            appId: fbAppId,
            cookie: !0,
            xfbml: !0,
            version: 'v2.1'
        })
    }
};

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response)
    })
}

function statusChangeCallback(response) {
    if (typeof User.getObj().userId == "undefined" || User.getObj().userId <= 0) {
        switch (response.status) {
            case "connected":
                $.ajax({
                    type: "POST",
                    data: {
                        mod: "user",
                        ack: "fblogin",
                        response: response
                    },
                    complete: function(event) {
                        var reply = event.responseJSON;
                        if (reply.result.state == 'multiLogindetected') {
                            User.getObj().PageRefresh()
                        } else if (reply.result.state == "ok") {
                            var userData = reply.data;
                            _userObj.userId = userData.id;
                            _userObj.userName = userData.displayName;
                            var newUser = reply.data.newUser;
                            if (newUser) {
                                $('#loginModal').modal('hide');
                                $("body").trigger({
                                    type: "_facebookRegisterSuccessEvt"
                                })
                            } else {
                                $("body").trigger({
                                    type: "_loginSuccessEvt"
                                })
                            }
                        }
                    },
                    url: "/?route=common/ajax"
                });
                break;
            case "unknown":
                break;
            case "not_authorized":
                break
        }
    }
}
var _ecomObj = null;

function EComm() {
    this.purchaseInprogerss = !1;
    this.applyCouponInprogerss = !1
}
EComm.getObj = function() {
    if (_ecomObj == null) {
        _ecomObj = new EComm();
        _ecomObj.BindEvents()
    }
    return _ecomObj
};
EComm.prototype.BindEvents = function() {
    $("body").unbind("_PurchaseItem").bind("_PurchaseItem", this, function(e) {
        if (User.getObj().userId <= 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            })
        } else {
            e.data.Buy(e)
        }
    });
    $("body").unbind("_ApplyCoupon").bind("_ApplyCoupon", this, function(e) {
        if (User.getObj().userId <= 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            })
        } else {
            e.data.ApplyCoupon(e)
        }
    })
};
EComm.prototype.Buy = function(e) {
    if (this.purchaseInprogerss == !0) {
        return
    }
    this.purchaseInprogerss = !0;
    this.redirect = e.redirect;
    $.ajax({
        type: "POST",
        url: "/?route=common/ajax",
        context: this,
        data: {
            mod: "tr2ecomm",
            ack: "purchaseitem",
            id: e.itemId,
            coupon: e.coupon,
            redirect: e.redirect,
            gateway: e.gateway
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    if (reply.data.ack == "unlocked") {
                        alert("Thank you for your recent purchase.");
                        if (typeof TRTracker !== 'undefined') {
                            TRTracker.getObj().TrackEvent("proceedToPay", function() {
                                window.location.href = this
                            }.bind(this.redirect))
                        }
                    } else if (reply.data.ack == "redirect") {
                        if (reply.data.hasOwnProperty("rezorpay")) {
                            if (typeof TRTracker !== 'undefined') {
                                TRTracker.getObj().TrackEvent("proceedToPay", function() {})
                            }
                            var txId = reply.data.id;
                            var redirectUrl = this.redirect;
                            var options = {
                                "key": reply.data.keyId,
                                "amount": parseInt(reply.data.amount) * 100,
                                "name": window.location.host,
                                "order_id": reply.data.externalId,
                                "handler": function(response) {
                                    console.log(response, txId);
                                    $.ajax({
                                        url: "/?route=common/ajax",
                                        type: "POST",
                                        data: {
                                            mod: "ecomm",
                                            ack: "verifypayment",
                                            txId: txId
                                        },
                                        complete: function(event) {
                                            try {
                                                response = event.responseJSON;
                                                if (response.result.state == 'multiLogindetected') {
                                                    User.getObj().PageRefresh()
                                                } else if (response.data == 5) {
                                                    window.document.location = "/checktransaction?txnid=" + txId + "&redirect=" + encodeURIComponent(redirectUrl)
                                                } else {
                                                    alert("Unexpected Error!")
                                                }
                                            } catch (e) {
                                                alert("Unexpected Error!")
                                            }
                                        },
                                        error: function(jqXHR, textStatus, errorThrown) {
                                            alert("Unexpected Error!")
                                        }
                                    })
                                },
                                "prefill": {
                                    "name": typeof(_userObj.userName) != "undefined" ? _userObj.userName : "",
                                    "email": typeof(_userObj.emailId) != "undefined" ? _userObj.emailId : "",
                                    "contact": typeof(_userObj.phoneNo) != "undefined" ? _userObj.phoneNo : "",
                                },
                                "notes": {},
                                "theme": {
                                    "color": "#F37254"
                                }
                            };
                            var rzp = new Razorpay(options);
                            rzp.open();
                            console.log("3");
                            this.purchaseInprogerss = !1;
                            return
                        }
                        if (typeof TRTracker !== 'undefined') {
                            TRTracker.getObj().TrackEvent("proceedToPay", function() {
                                window.location.href = this
                            }.bind(reply.data.payment_url))
                        } else {
                            window.location.href = reply.data.payment_url
                        }
                    }
                } else if (reply.result.meta == "loginRequired") {
                    $("body").trigger({
                        type: "_showLoginDialogEvt",
                        tabName: "logintab"
                    });
                    setTimeout(function() {
                        $(".loader-img").hide();
                        $(".package-buy-div").show()
                    }, 2000)
                } else {
                    alert(reply.result.meta)
                }
                this.purchaseInprogerss = !1
            } catch (e) {
                this.purchaseInprogerss = !1
            }
        }
    })
};
EComm.prototype.ApplyCoupon = function(e) {
    if (this.applyCouponInprogerss == !0) {
        return
    }
    this.applyCouponInprogerss = !0;
    $.ajax({
        type: "POST",
        url: "/?route=common/ajax",
        context: e,
        data: {
            mod: "tr2ecomm",
            ack: "couponcheck",
            item: e.itemId,
            code: e.coupon
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                _ecomObj.applyCouponInprogerss = !1;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.meta == "loginRequired") {
                    $("body").trigger({
                        type: "_showLoginDialogEvt",
                        tabName: "logintab"
                    })
                } else if (typeof this.callback == "function") {
                    this.callback(reply)
                }
            } catch (e) {
                _ecomObj.applyCouponInprogerss = !1;
                if (typeof callback == "function") this.callback({
                    data: null,
                    result: {
                        state: "error",
                        meta: e.message + "\n" + JSON.stringify(event.responseJSON)
                    }
                })
            }
        }
    })
};

function Exam() {
    this.dataLoaded = !1;
    this.categories = {};
    this.exams = {};
    this.examCount = 0;
    this.myExams = [];
    this.node = null;
    this.subscriptionModal = null
}
Exam.getObj = (function() {
    var _examObj;
    return function() {
        if (!_examObj) {
            _examObj = new Exam()
        }
        return _examObj
    }
})();
Exam.prototype.setter = function(examData) {
    this.dataLoaded = !0;
    this.categories = examData.categories;
    this.exams = examData.exams;
    this.examCount = examData.examCount;
    var examIds = this.myExams.concat(examData.myExams);
    var uniqueExamIds = [];
    for (var i = 0; i < examIds.length; i++) {
        var NumberVal = Number(examIds[i]),
            stringVal = String(examIds[i]);
        if (uniqueExamIds.indexOf(NumberVal) === -1 && uniqueExamIds.indexOf(stringVal) === -1) {
            uniqueExamIds.push(NumberVal)
        }
    }
    this.myExams = uniqueExamIds;
    var div = document.createElement("div");
    document.body.appendChild(div);
    this.node = $(div)
};
Exam.prototype.GetExamData = function(callback) {
    if (this.dataLoaded) {
        return callback()
    }
    this.GetExamDataAjax(function(examData) {
        this.setter(examData);
        callback()
    }.bind(this))
};
Exam.prototype.GetExamDataAjax = function(callback) {
    $.ajax({
        data: {
            mod: 'tr2exam',
            ack: 'getexamsforsubsciption'
        },
        complete: function(result) {
            var res = result.responseJSON;
            try {
                if (res.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (res.result.state == 'ok') {
                    callback(res.data)
                } else {
                    console.error(res.meta);
                    alert('Internal Error')
                }
            } catch (err) {
                console.error(err);
                alert('Internal Error')
            }
        },
        type: "POST",
        url: "/?route=common/ajax"
    })
};
Exam.prototype.ShowSubscriptionDialog = function(msg) {
    this.GetExamData(function() {
        this.LoadSubscriptionModal()
    }.bind(this))
};
Exam.prototype.LoadSubscriptionModal = function(callback, msg) {
    if (!this.subscriptionModal) {
        var modalHtml = '<div class="modal fade subscription" id="subscription-modal" tabindex="-1" role="dialog" aria-labelledby="memberModalLabel" aria-hidden="true">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<span class="close" data-dismiss="modal">' + '<img src="https://' + systemSettings.cdn.bucket + '/images/blue-close-023e934e06031.png" alt="close-btn"/>' + '</span>' + '<h4 class="modal-title">Subscribe Exams</h4>' + '<span>Add all exams you are preparing for</span>' + '</div>' + '<div class="modal-body">';
        for (var categoryId in this.categories) {
            var category = this.categories[categoryId];
            var categoryhtml = "";
            categoryhtml = '<div class="category-box" data-category="' + categoryId + '">' + '<div class="category-title">' + '<img src="' + category.iconUrl + '" alt="' + category.title + ' icon"/>' + '<span>' + category.title + '</span>' + '</div>' + '<div>';
            var countExam = 0;
            for (var examId in category.exams) {
                examId = category.exams[examId];
                var exam = this.exams[examId];
                var numberVal = Number(exam.id),
                    stringVal = String(exam.id);
                var selected = (this.myExams.indexOf(numberVal) === -1 && this.myExams.indexOf(stringVal) === -1) ? '' : 'selected';
                categoryhtml += '<span class="exam-btn js-select ' + selected + '" data-examid=' + exam.id + ' >' + exam.title + '</span>';
                countExam++
            }
            categoryhtml += '</div>' + '</div>';
            if (countExam === 0) {
                categoryhtml = ""
            }
            modalHtml += categoryhtml
        }
        modalHtml += '</div>' + '<div class="modal-footer">' + '<button class="js-subscribe btn btn-primary">Continue</button>' + '</div>' + '</div>' + '</div>';
        this.subscriptionModal = $(modalHtml).appendTo(this.node);
        if (this.subscriptionModal.find('.selected').length == 0) {
            $('.js-subscribe').removeClass('btn-primary').addClass('btn-primary-alt')
        }
        this.subscriptionModal.find('.close').click(function() {
            $("body").trigger({
                type: "_pauseOnBoardingEvt"
            })
        });
        $('.js-select').click(this, function(e) {
            var examId = $(this).data('examid');
            var $modal = e.data.subscriptionModal;
            $modal.find('[data-examid="' + examId + '"]').toggleClass('selected');
            var msg = ($(this).hasClass('selected')) ? 'Exam selected' : 'Exam unselected';
            popUp(msg, undefined, 300);
            if ($modal.find('.selected').length == 0) {
                return $('.js-subscribe').removeClass('btn-primary').addClass('btn-primary-alt')
            }
            $('.js-subscribe').removeClass('btn-primary-alt').addClass('btn-primary')
        });
        $('.js-subscribe').click(this, function(e) {
            var selectedExams = [];
            var examDomArr = e.data.subscriptionModal.find('.selected').toArray();
            for (var i = 0; i < examDomArr.length; i++) {
                var $exam = $(examDomArr[i]);
                var examId = parseInt($exam.data('examid'));
                if (isNum(examId)) {
                    selectedExams.push(examId)
                }
            }
            e.data.Subscribe(selectedExams)
        })
    }
    $('#subscription-modal').modal('show')
};
Exam.prototype.Subscribe = function(selectedExams) {
    var uniqueExamIds = [];
    subscribeIds = [];
    myExams = [];
    for (var i = 0; i < this.myExams.length; i++) {
        myExams.push(parseInt(this.myExams[i]))
    }
    for (var i = 0; i < selectedExams.length; i++) {
        if (uniqueExamIds.indexOf(selectedExams[i]) == -1) {
            uniqueExamIds.push(selectedExams[i]);
            subscribeIds.push(selectedExams[i])
        }
    }
    if (subscribeIds.length == 0) {
        return popUp('Please select your exams')
    }
    for (var i = 0; i < uniqueExamIds.length; i++) {
        if (myExams.indexOf(uniqueExamIds[i]) > -1) {
            myExams.splice(myExams.indexOf(uniqueExamIds[i]), 1);
            subscribeIds.splice(subscribeIds.indexOf(uniqueExamIds[i]), 1)
        }
    }
    var examData = {};
    for (var i = 0; i < myExams.length; i++) {
        examData[myExams[i]] = 0
    }
    for (var i = 0; i < subscribeIds.length; i++) {
        examData[subscribeIds[i]] = 1
    }
    if (objLength(examData) > 0) {
        $.ajax({
            type: "POST",
            data: {
                mod: "user",
                ack: "examsubscription",
                exams: examData
            },
            complete: function(event) {
                try {
                    var res = event.responseJSON;
                    console.log();
                    if (res.result.state == 'multiLogindetected') {
                        User.getObj().PageRefresh()
                    } else if (res.data == 'subscribed') {
                        $("body").trigger({
                            type: "_subscriptionSuccessEvt"
                        })
                    } else {
                        alert("Internal Error!");
                        console.error(res.result)
                    }
                } catch (e) {
                    alert("Internal Error!");
                    console.error(e)
                }
            },
            url: "/?route=common/ajax"
        })
    } else {
        $("body").trigger({
            type: "_subscriptionSuccessEvt"
        })
    }
};

function showLiveStatus() {
    var liveMenu = $('.TRHeader .MainList[data-class-status="true"]');
    if (liveMenu.length == 0) return;
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2headermenu",
            ack: "getLiveStatusForVidu"
        },
        complete: function(event) {
            try {
                var res = event.responseJSON;
                if (res.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (res.data != null) {
                    var ongoing = res.data.ongoing;
                    var upcoming = res.data.upcoming;

                    function checkBatchs(batchArr) {
                        batchArr.forEach(function(batch) {
                            var batchUrl = $(batch).children('a').attr('href');
                            if (batchUrl && batchUrl.length > 0) {
                                var urlSegments = batchUrl.split('index.html');
                                var batchUrlKey = urlSegments[urlSegments.length - 1];
                                if (ongoing.indexOf(batchUrlKey) > -1) {
                                    $(batch).removeClass('nothing upcoming').addClass("ongoing");
                                    if (liveMenu.find('.ongoingblink').length === 0) {
                                        var blink = $('<div class="ongoingblink"></div>');
                                        liveMenu.children('a').prepend(blink)
                                    }
                                    var batchParents = $(batch).parents('li.SubList');
                                    if (batchParents.length > 0) {
                                        batchParents.toArray().forEach(function(batchParent) {
                                            $(batchParent).removeClass('nothing upcoming').addClass("ongoing")
                                        })
                                    }
                                } else if (typeof upcoming[batchUrlKey] !== 'undefined') {
                                    $(batch).removeClass('nothing').addClass("upcoming");
                                    var date = "Upcoming: " + dateAndTimeFormat(upcoming[batchUrlKey]);
                                    $(batch).attr("title", date);
                                    var batchParents = $(batch).parents('li.SubList');
                                    if (batchParents.length > 0) {
                                        batchParents.toArray().forEach(function(batchParent) {
                                            if (!$(batchParent).hasClass('ongoing')) {
                                                $(batchParent).removeClass('nothing').addClass("upcoming")
                                            }
                                        })
                                    }
                                }
                            }
                            var childBatches = $(batch).find('ul > .SubList').toArray();
                            if (childBatches.length > 0) {
                                checkBatchs(childBatches)
                            }
                        })
                    };
                    if (objLength(ongoing) > 0 || objLength(upcoming) > 0) {
                        var batchArr = $(liveMenu).find('.listHolder > .SubList').toArray();
                        checkBatchs(batchArr)
                    }
                }
            } catch (e) {
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
}
$(document).ready(function() {
    if (document.getElementsByClassName('lazy').length > 0) {
        var v = "IntersectionObserver" in window ? "10.19.0" : "8.17.0";
        window.lazyLoadOptions = {};
        loadScript("https://" + systemSettings.cdn.bucket + "/js/lazyload-v" + v + ".min.js", function() {
            var ll = new LazyLoad({
                elements_selector: ".lazy"
            })
        }, !0)
    }
    var userObj = User.getObj();
    if (userObj.addressPresent != null && !userObj.addressPresent) {
        userObj.GetAddressModal(function() {
            $("#forcedAddressModal").attr("data-backdrop", "static");
            $("#forcedAddressModal").attr("data-keyboard", "false");
            $('#forcedAddressModal').modal('show')
        }.bind(this))
    } else if (typeof verifyOtp != "undefined" && verifyOtp == verifyOTP.Mandatory && userObj.userId > 0) {
        userObj.VerifyOTP(User.getObj())
    }
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        if (typeof examsubscribed != 'undefined' && examsubscribed == '0') {
            if (typeof verifyOtp != "undefined" && verifyOtp != verifyOTP.NotRequired) {
                User.getObj().VerifyOTP(User.getObj())
            }
        } else {
            Exam.getObj().ShowSubscriptionDialog()
        }
    }
    $('.TRMenuList').find(".menuItem .dropdown-menu").each(function() {
        if ($(window).width() > 767) {
            var widthstr = ($(this).find('.data-block').length * 242 + 40) + 'px';
            if ($(this).find('.data-block').length <= 2) {
                $(this).css('min-width', widthstr)
            } else {
                $(this).css('position', 'fixed')
            }
        }
    });
    var userObj = User.getObj();
    $('.ClickOnVedio').unbind().bind("click", function() {
        $("#ShowYoutubeVideo .modal-dialog").width('100%');
        $("#ShowYoutubeVideo .modal-dialog").css('margin', '0');
        var height = $(window).height();
        $("#ShowYoutubeVideo .modal-body").html('<iframe width="100%" height="' + height + 'px" src="' + $(this).attr("data-video-url") + '" frameborder="0" allowfullscreen></iframe>');
        $("#ShowYoutubeVideo").modal()
    });
    $('#ShowYoutubeVideo').on('hidden.bs.modal', function() {
        $("#ShowYoutubeVideo .modal-body > iframe").remove()
    });
    $("body").unbind("_GetContact").bind("_GetContact", this, function(e) {
        User.getObj().GetContactDetails()
    });
    if (userObj.userId <= 0) {
        $("[data-action='login-modal']").unbind().bind("click", function(e) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            })
        });
        $("[data-action='register-modal']").unbind().bind("click", function(e) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "registertab"
            })
        });
        $("body").unbind("_loginSuccessEvt").bind("_loginSuccessEvt", function(e) {
            if (typeof TRTracker !== 'undefined') {
                TRTracker.getObj().TrackEvent("login", function() {
                    location.reload()
                })
            } else {
                location.reload()
            }
            if (typeof fcmAppId != "undefined" && fcmAppId.length > 5) {
                TRTracker.getObj().isFcmSubscribed()
            } else if (typeof onesignalAppId != "undefined" && onesignalAppId.length > 5) {
                TRTracker.getObj().isOnesignalSubscribed()
            }
        });
        $("body").unbind("_registerSuccessEvt").bind("_registerSuccessEvt", function(e) {
            if (typeof TRTracker !== 'undefined') {
                TRTracker.getObj().TrackEvent("register", function() {});
                TRTracker.getObj().TrackEvent("login", function() {})
            }
            $("body").unbind("_loginSuccessEvt").bind("_loginSuccessEvt", function(e) {
                if (typeof _userObj.addressInRegister !== 'undefined' && _userObj.addressInRegister) {
                    User.getObj().UpdateAddress()
                }
                sessionStorage.setItem("reloading", "true");
                if (typeof fcmAppId != "undefined" && fcmAppId.length > 5) {
                    TRTracker.getObj().isFcmSubscribed()
                } else if (typeof onesignalAppId != "undefined" && onesignalAppId.length > 5) {
                    TRTracker.getObj().isOnesignalSubscribed()
                }
                location.reload()
            });
            $("body").unbind("_subscriptionSuccessEvt").bind("_subscriptionSuccessEvt", function(e) {
                Exam.getObj().subscriptionModal.modal('hide');
                popUp("Subscription Successful!", function() {
                    if (typeof verifyOtp != "undefined" && verifyOtp != verifyOTP.NotRequired) {
                        $("body").trigger({
                            type: "_showVerifyOTPDialogEvt"
                        })
                    }
                })
            });
            $("body").unbind("_pauseOnBoardingEvt").bind("_pauseOnBoardingEvt", function(e) {
                location.reload()
            });
            setTimeout(function() {
                User.getObj().Login($("#txt_email").val(), $("#txt_password").val(), 1)
            }, 1000)
        });
        $("body").unbind("_googleRegisterSuccessEvt").bind("_googleRegisterSuccessEvt", function(e) {
            if (typeof TRTracker !== 'undefined') {
                TRTracker.getObj().TrackEvent("register", function() {});
                TRTracker.getObj().TrackEvent("login", function() {})
            }
            $("body").trigger({
                type: "_showSubscriptionDialogEvt"
            })
        });
        $("body").unbind("_facebookRegisterSuccessEvt").bind("_facebookRegisterSuccessEvt", function(e) {
            if (typeof TRTracker !== 'undefined') {
                TRTracker.getObj().TrackEvent("register", function() {});
                TRTracker.getObj().TrackEvent("login", function() {})
            }
            $("body").trigger({
                type: "_showSubscriptionDialogEvt"
            })
        })
    } else {
        GoogleSignInInit();
        LoadFacebookSDK();
        $("body").unbind("_logoutEvt").bind("_logoutEvt", function(e) {
            User.getObj().Logout()
        });
        $("body").unbind("_logoutSuccessEvt").bind("_logoutSuccessEvt", function(e) {
            window.location.href = 'index.html'
        })
    }
    $("body").unbind("_showVerifyOTPDialogEvt").bind("_showVerifyOTPDialogEvt", function(e) {
        User.getObj().VerifyOTP(User.getObj())
    });
    if (typeof(userData) != "undefined" && userData.id > 0 && userData.emailId == null && (typeof(userData.settings[2]) == "undefined" || userData.settings[2] == "")) {
        $("body").trigger({
            type: "_GetContact",
        })
    }
    var ecomObj = EComm.getObj();
    $('.purchaseitem').unbind().bind("click", function(e) {
        $("body").trigger({
            type: "_PurchaseItem",
            itemId: $(this).attr("data-itemId"),
            coupon: $(this).attr("data-coupon"),
            redirect: $(this).attr("data-redirect"),
            gateway: $(this).attr("data-gateway"),
        })
    });
    $("body").unbind("_showSubscriptionDialogEvt").bind("_showSubscriptionDialogEvt", function(e) {
        if (typeof examsubscribed != 'undefined' && examsubscribed == '0') {
            location.reload()
        } else {
            Exam.getObj().ShowSubscriptionDialog()
        }
    });
    $("body").unbind("_subscriptionSuccessEvt").bind("_subscriptionSuccessEvt", function(e) {
        Exam.getObj().subscriptionModal.modal('hide');
        popUp("Subscription Successful!", function() {
            location.reload()
        })
    });
    showLiveStatus();
    setTimeout(function() {
        var userObj = User.getObj();
        if (typeof userObj.settings != "undefined" && typeof userObj.settings[3] != "undefined" && typeof userObj.settings[3] != 1) {
            var key = "verifyOtp";
            if (getCookie(key) && typeof forceOTP === 'undefined') {
                return
            }
            var date = new Date();
            var minutes = 1440;
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            setCookie(key, "Shown", date);
            if (typeof verifyOtp != "undefined" && verifyOtp != verifyOTP.NotRequired) {
                $("body").trigger({
                    type: "_showVerifyOTPDialogEvt"
                })
            }
        }
    }, 5000);
    if ($('.HideQuizePatti').length > 0 && $('.Daily-quizediv').length > 0) {
        $('.Daily-quizediv').remove()
    }
    $('.js-refer').off().on('click', function() {
        User.getObj().ShowReferalModal()
    });
    $('.js-explore').off().on('click', function() {
        const links = $(this).data('links');
        const title = $(this).closest('.package').find('h3').text();
        var $modal = $('#package-explore-modal');
        if ((typeof links.batch === 'undefined' && typeof links.testlist === 'undefined') || (links.batch.length == 0 && links.testlist.length == 0)) {
            window.location.href = $(this).attr('data-urlKey')
        }
        if ($modal.length === 0) {
            var exploreModal = '<div id="package-explore-modal" class="modal fade"  role="dialog">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal"><img src="https://' + systemSettings.cdn.bucket + '/images/blue-close-023e934e06031.png"/></button>' + '<h4 class="modal-title">Explore</h4>' + '</div>' + '<div class="modal-body">' + '<div class="explore-box"></div>' + '</div>' + '</div>' + '</div>' + '</div>';
            $modal = $(exploreModal).appendTo('body')
        }
        var linkHtml = '';
        if (links.batch.length > 0) {
            linkHtml += '<div>' + '<div class="link-type">' + '<img class="coaching" src="https://' + systemSettings.cdn.bucket + '/images/online-coaching-02392c400b8c9.png" alt="Online Coaching">' + '<span>Online Coaching</span>' + '</div>' + '<div class="links">';
            for (var i in links.batch) {
                linkHtml += '<div>' + links.batch[i] + '</div>'
            }
            linkHtml += '</div>' + '</div>'
        }
        if (links.testlist.length > 0) {
            linkHtml += '<div>' + '<div class="link-type">' + '<img src="https://' + systemSettings.cdn.bucket + '/images/mock-test-02392bdfffea0.png" alt="Mock Tests">' + '<span>Mock Tests</span>' + '</div>' + '<div class="links">';
            for (var i in links.testlist) {
                linkHtml += '<div>' + links.testlist[i] + '</div>'
            }
            linkHtml += '</div>' + '</div>'
        }
        $modal.find('h4').text(title || 'Explore');
        $modal.find('.explore-box').html(linkHtml);
        $modal.modal('show')
    });
    if (typeof fcmAppId != "undefined" && fcmAppId.length > 5) {
        if (typeof(userData.googleFCMmapping) == "undefined") {
            TRTracker.getObj().isFcmSubscribed()
        }
    } else if (typeof onesignalAppId != "undefined" && onesignalAppId.length > 5) {
        if (typeof(userData.onesignalmapping) == "undefined") {
            TRTracker.getObj().isOnesignalSubscribed()
        }
    }
});
var _commontrv = null;

function CommonTrv() {
    this.node = $('.TRMenuItem.menuItem.SearchIcon');
    this.commonTrv = null;
    this.xhr = null
}
CommonTrv.getObj = function() {
    if (_commontrv == null) {
        _commontrv = new CommonTrv();
        _commontrv.Init()
    }
    return _commontrv
};
CommonTrv.prototype.Init = function() {
    this.searchcontainer = $('.tr-search-landing #search');
    this.searchdisplayer = $('.tr-search-landing .dropdown-content');
    this.searchcontainer.val("");
    $('.TRSearchContainer').find('.form-group').unbind().bind("click", this, function(e) {
        $('.TRSearchContainer').hide();
        $('.tr-search-landing').show();
        e.data.searchdisplayer.hide();
        e.data.searchcontainer.focus()
    });
    $('.tr-search-landing').find('.glyphicon-remove').unbind().bind("click", this, function(e) {
        e.data.searchcontainer.val("");
        $('.tr-search-landing').hide();
        $('.TRSearchContainer').show()
    });
    this.searchcontainer.keypress(function(e) {
        var query = e.currentTarget.value;
        if (query == 0)
            if (e.which == 13) {
                $('.tr-search-landing').find('p').last().show()
            }
    });
    $('.tr-search-landing').find('.search-button').unbind("click").bind("click", this, function(e) {
        var query = e.data.searchcontainer.val();
        if (query == 0) {
            $('.tr-search-landing').find('p').last().show();
            return
        }
    });
    this.searchcontainer.bind('keyup', function(e) {
        if (CommonTrv.getObj().xhr && CommonTrv.getObj().xhr.readyState != 4) {
            CommonTrv.getObj().xhr.onreadystatechange = null;
            CommonTrv.getObj().xhr.abort()
        }
        var query = e.currentTarget.value;
        if (query == 0) {
            this.searchdisplayer.css('display', 'none');
            return
        }
        if (e.keyCode === 13) {
            if (query == 0) {
                return
            }
            var hvalue = $('.tr-search-landing .dropdown-content').find("p.sactive").attr('data-index');
            if (typeof hvalue != "undefined") {
                text = $('.tr-search-landing .dropdown-content').find("p.sactive").text();
                this.searchcontainer.val(text);
                $('.tr-search-landing .dropdown-content').find('p').removeClass('sactive');
                this.searchdisplayer.hide()
            }
            $('.tr-search-landing').find('.search-button').click();
            return
        }
        if (e.which == 40 || e.which == 38) {
            openNavbar = $('.tr-search-landing .dropdown-content').find('p');
            if (openNavbar[0]) {
                hovered = $('.tr-search-landing .dropdown-content').find("p.sactive").attr('data-index');
                if (typeof hovered != "undefined") {
                    if (e.which == 40) {
                        hovered = parseInt(hovered);
                        if (hovered != 4) {
                            $(openNavbar[hovered]).removeClass('sactive');
                            $(openNavbar[hovered + 1]).addClass('sactive')
                        }
                        return
                    } else {
                        hovered = parseInt(hovered);
                        if (hovered != 0) {
                            $(openNavbar[hovered]).removeClass('sactive');
                            $(openNavbar[hovered - 1]).addClass('sactive')
                        }
                        return
                    }
                } else $('.tr-search-landing .dropdown-content').find("p").first().addClass('sactive');
                return
            }
        }
        $('.tr-search-landing').find('.search-button').unbind("click").bind("click", this, function(e) {
            query = e.data.searchcontainer.val();
            if (query == 0) {
                $('.tr-search-landing').find('p').last().show();
                return
            }
            window.location.href = "/search?q=" + query + "&pageno=1"
        });
        query = encodeURIComponent(query.trim());
        CommonTrv.getObj().xhr = $.ajax({
            type: 'POST',
            url: "/?route=common/ajax",
            data: {
                mod: "tr2searchcurl",
                ack: "getautosuggest",
                query: query,
            },
            complete: function(reply) {
                var response = reply.responseJSON;
                if (response.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (response && response.result.state == "ok") {
                    CommonTrv.getObj().searchdisplayer.css('display', 'block');
                    CommonTrv.getObj().searchdisplayer.empty();
                    if (response.data[0])
                        for (var i = 0; i < 5 && i < Object.keys(response.data[0]).length; i++) CommonTrv.getObj().searchdisplayer.append('<p data-index=' + i + '>' + response.data[0][i] + '</p>');
                    else
                        CommonTrv.getObj().searchdisplayer.append("<span>No Record Found</span>");
                    $(CommonTrv.getObj().searchdisplayer).find('p').unbind("mouseenter").bind("mouseenter", function(e) {
                        $(".dropdown-content").find('p.sactive').removeClass("sactive");
                        $(this).addClass("sactive")
                    });
                    $(CommonTrv.getObj().searchdisplayer).find('p').unbind("click").bind("click", this, function(event) {
                        event.stopPropagation();
                        var text = $(event.target).text();
                        CommonTrv.getObj().searchcontainer.val(text);
                        CommonTrv.getObj().searchdisplayer.hide();
                        $('.tr-search-landing').find('.search-button').click()
                    })
                } else {
                    console.log("Cancelled")
                }
            }
        })
    }.bind(this));
    $(window).unbind("click.search").bind("click.search", this, function(e) {
        e.data.searchdisplayer.hide()
    })
};
var commontrv = null;
$(document).ready(function() {
    var initiated = !1;
    var window_width = $(window).width();
    $(window).resize(function() {
        if (initiated == !1) {
            initiated = !0;
            setTimeout(function() {
                $(window).trigger('resizeTriggered');
                initiated = !1
            }, 300)
        }
        window_width = $(window).width()
    });
    $(window).on('resizeTriggered', function() {
        if (window_width >= 768) {
            $(".TRMenuContainer").css("bottom", "0px")
        }
    });
    if (commontrv == null) {
        commontrv = CommonTrv.getObj()
    }
    var megamenuslide = new Array();
    var megamenuVerticalslide = new Array();
    $(".TRMenuItem.menuItem").bind({
        mouseenter: function(e) {
            for (i = 0; i < $('.TRMenuItem:hover').length; i++) {
                megamenuslide[i] = new slidediv();
                megamenuslide[i].Init("TRMenuItem:hover", "alldatablocks", "data-block", i)
            }
            for (c = 0; c < $('.TRMenuItem:hover .alldatablocks .data-block').length; c++) {
                megamenuVerticalslide[c] = new slideVertical();
                megamenuVerticalslide[c].Init("TRMenuItem:hover .alldatablocks .data-block", "content", "megamenuList", c)
            }
        }
    });
    $(".closeOffer").on('click', function(c) {
        $(this).parent().fadeOut('slow')
    });
    $("div.TRMenuItem").bind("click mouseenter", function() {
        var drop_down_margin = 0;
        if ($(".offer_top_div").length && $(".offer_top_div").css("display") == "block") {
            var offer_height = $(".offer_top_div")[0].clientHeight;
            var window_pos = $(window).scrollTop();
            if (window_pos <= offer_height) {
                drop_down_margin = offer_height - window_pos
            }
        }
        $(".TRMenuItem .dropdown-menu").css("margin-top", drop_down_margin)
    });
    if ($(".quickaccess")[0]) {
        if (window.location.href.indexOf("#") > -1) {
            var hash = "#" + window.location.href.split("#").pop();
            checkPage(hash)
        }
    }
    $("a.scrollTo").on('click', function(event) {
        event.preventDefault();
        var hash = $(this).attr("href");
        checkPage(hash)
    });
    var offElement = $('#countdownInOffer');
    if ($(offElement).length) {
        var timeNow = $(offElement).attr("data-current");
        timeNow = new Date(timeNow).getTime();
        var timeTill = $(offElement).attr("data-ends");
        timeTill = new Date(timeTill).getTime();
        var localTimeDIff = 0;
        var currentDate = new Date().getTime();
        localTimeDiff = timeNow - currentDate;
        var x = setInterval(function() {
            var currentDate = new Date().getTime();
            currentDate = currentDate + localTimeDiff;
            var diff = timeTill - currentDate;
            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var secs = Math.floor((diff % (1000 * 60)) / 1000);
            if (days == 0) $(".days").hide();
            else {
                $(".days").show();
                $("#days").html((days < 10) ? "0" + days : days)
            }
            if (days == 0 && hours == 0) $(".hours").hide();
            else {
                $(".hours").show();
                $("#hours").html((hours < 10) ? "0" + hours : hours)
            }
            if (days == 0 && hours == 0 && mins == 0) $(".mins").hide();
            else {
                $(".mins").show();
                $("#mins").html((mins < 10) ? "0" + mins : mins)
            }
            $("#secs").html((secs < 10) ? "0" + secs : secs);
            if (diff < 0) {
                $("#OffCountdown").html("");
                $("#countdownInOffer").html("EXPIRED.!");
                $(".offer_top_div").fadeOut('slow');
                clearInterval(x)
            }
        }, 500)
    }
    $("[forApp=1]").unbind().bind("click", function(e) {
        e.preventDefault();
        var onlyforapphtml = '<div class="modal fade" id="onlyforapp-modal" tabindex="-1" role="dialog" aria-labelledby="memberModalLabel" aria-hidden="true">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" data-action="pauseOnBoarding" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>' + '<h3 class="modal-title" id="memberModalLabel"> Only For App</h3></div>' + '<div class="modal-body text-center">' + '<div class="row msg msg1"><span>This Video is only meant for the Mobile App</span></div>' + '<a  class="linktoPlaystore btn btn-primary text-center" target="_blank" href="https://play.google.com/store/apps' + ((typeof appId !== undefined && appId.length > 5) ? ('/details?id=' + appId) : '') + '"><strong>Go to Play Store</strong></a>' + '</div>' + '</div>' + '</div>' + '</div>';
        if ($('#onlyforapp-modal').length < 1) {
            $('body').append(onlyforapphtml)
        }
        $('#onlyforapp-modal').modal('show');
        return
    });
    if ($(".TRMenuContainer.customMenucontainer").length > 0) {
        $(".TRMenuContainer.customMenucontainer").find(".MainList").each(function() {
            if ($(this).find('.ongoingblink').length > 0) {
                $(this).find(".listHolder").children(".SubList").each(function() {
                    $(this).find(".SubList").each(function() {
                        if ($(this).parents(".SubList").hasClass('ongoing')) {
                            if ($(this).parents(".SubList").hasClass('upcoming')) {
                                $(this).parents(".SubList").removeClass('upcoming')
                            }
                            return !1
                        } else {
                            if ($(this).find(".ongoing").length > 0) {
                                $(this).parents(".SubList").addClass("ongoing");
                                if ($(this).parents(".SubList").hasClass('upcoming')) {
                                    $(this).parents(".SubList").removeClass('upcoming')
                                }
                            } else if ($(this).find(".upcoming").length > 0) {
                                $(this).parents(".SubList").addClass("upcoming")
                            }
                        }
                    })
                })
            }
        })
    }
    if ($(window).width() < 991) {
        if ($(".TRMenuContainer.customMenucontainer").length > 0) {
            $(".customMenucontainer").addClass("customMenuMobile")
        }
    } else {
        if ($(".tr2-header.marketplace").length > 0) {
            if ($(".TRLoginRegister").find(".profileData").length > 0) {
                $(".tr2-header.marketplace").addClass("mydashboard")
            }
            $(window).scroll();
            $(window).scroll(function() {
                var scroll = $(window).scrollTop();
                if (scroll > 276) {
                    $(".tr2-header.marketplace").css("opacity", "1")
                } else {
                    if ($(".menubodyoverlay").css("height") == "0px") {
                        $(".tr2-header.marketplace").css("opacity", "0.85")
                    }
                }
            })
        }
        $(".TRcustomMenu").find(".mainlistHolder").find(".MainList").hover(function() {
            $(".menubodyoverlay").css("height", "100%");
            $(".tr2-header.marketplace").css("opacity", "1");
            $("body").addClass("nobodyscroll")
        }, function() {
            $(".menubodyoverlay").css("height", "0");
            $(".tr2-header.marketplace").css("opacity", "0.85");
            $("body").removeClass("nobodyscroll")
        })
    }
    $(".customMenuMobile").find(".MainList").children("a").unbind().bind("click", function(e) {
        $(this).siblings("ul").css("display", "flex");
        $(".MainList").children("a").css("display", "none")
    });
    $(".TRcustomMenu").find(".MainList").hover(function() {
        $(this).addClass("mainlisthover")
    });
    $(".TRcustomMenu").find(".listHolder").find(".SubList").hover(function() {
        $(this).parents(".MainList").removeClass("mainlisthover")
    });
    $(".customMenuMobile").find(".SubList").find("ul").removeClass("dropdown-menu");
    $(".customMenuMobile").find(".SubList").find("ul").removeAttr("style");
    $(".js-closebtn").unbind().bind("click", function(e) {
        $(".customMenucontainer").find(".TRcustomMenu").removeClass("mobilemenuexpand");
        $(".menubodyoverlay").css("height", "0");
        $("body").removeClass("nobodyscroll");
        var zopim = $("body").find(".zopim");
        $(zopim.eq(2)).show()
    });
    $(".js-menuopenbtn").unbind().bind("click", function(e) {
        $(".customMenucontainer").find(".TRcustomMenu").addClass("mobilemenuexpand");
        $("body").addClass("nobodyscroll");
        $(".menubodyoverlay").css("height", "100%");
        var zopim = $("body").find(".zopim");
        $(zopim.eq(2)).hide();
        $('.menubodyoverlay').unbind().bind('click', function() {
            if ($(".customMenuMobile").find('.MainList > a').css("display") === "none") {
                $(".customMenuMobile").find(".js-menuback").trigger("click")
            }
            $(".customMenucontainer").find(".TRcustomMenu").removeClass("mobilemenuexpand");
            $("body").removeClass("nobodyscroll");
            $(".menubodyoverlay").css("height", "0");
            var zopim = $("body").find(".zopim");
            $(zopim.eq(2)).show()
        })
    });
    $(".listHolder > .SubList > a").bind("click", function() {
        $(this).parents(".SubList").siblings().children("ul").slideUp(200);
        $(this).parents(".SubList").siblings().removeClass("selected");
        if ($(this).parents(".SubList").hasClass("selected")) {
            $(this).siblings("ul").slideUp(200);
            $(this).parents("li.SubList").removeClass("selected")
        } else {
            $(this).parents("li.SubList").addClass("selected");
            $(this).siblings("ul").slideDown(200)
        }
    });
    $(".js-menuback").unbind().bind("click", function(e) {
        $(this).parents("ul").css("display", "none");
        $(".MainList").children("a").css("display", "flex")
    })
});

function scrollTo(hash, extraHeader) {
    if ($(hash).length == 0) {
        return
    }
    $('html, body').animate({
        scrollTop: ($(hash).offset().top - 75 - extraHeader)
    }, 800, function() {
        window.location.hash = hash
    })
}

function checkPage(hash) {
    if ($(".submenudiv")[0]) {
        scrollTo(hash, $(".submenudiv").outerHeight(!0))
    } else {
        scrollTo(hash, 0)
    }
}

function faqs() {
    $(".faqAnswer").hide();
    $('.faqdropdown').find('.faq').click(function() {
        $(".faqAnswer").not($(this).children('.faqQuestion').next()).slideUp('fast');
        $(this).children('.faqQuestion').next().slideToggle('fast');
        var closing = $(this).children('.faqQuestion').find('span.glyphicon.glyphicon-chevron-down').length == 0;
        $(this).parents('.faqdropdown').find('span.glyphicon.glyphicon-chevron-up').each(function() {
            $(this).parents(".faq").removeClass('faqselected');
            $(this).removeClass('glyphicon-chevron-up');
            $(this).addClass('glyphicon-chevron-down')
        });
        if (!closing) {
            $(this).addClass("faqselected");
            $(this).children('.faqQuestion').find('span.glyphicon').removeClass('glyphicon-chevron-down');
            $(this).children('.faqQuestion').find('span.glyphicon').addClass('glyphicon-chevron-up')
        }
    })
}
var review_ajaxcount = 0;

function reviewCardBindEvents() {
    $('.reviewcard .rating span').unbind('click').bind('click', this, function() {
        $(this).closest('.rating').find('.active').removeClass("active");
        $(this).addClass("active");
        $('.reviewcard .rating span').unbind('mouseenter mouseleave')
    });
    $('.reviewcard .rating span').hover(function() {
        var prerating = $(this).closest('.rating').attr("data-rating");
        if (typeof prerating == 'undefined' || prerating == '') {
            $(this).closest('.rating').find('.active').removeClass("active");
            $(this).addClass("active")
        }
    }, function() {
        var prerating = $(this).closest('.rating').attr("data-rating");
        if (typeof prerating == 'undefined' || prerating == '') {
            $(this).closest('.rating').find('[data="5"]').addClass("active")
        }
    });
    $("[data-action='cancel_editreview']").unbind().bind("click", this, function(e) {
        $(".OverallRating").addClass("alreadyaquired");
        $(".OverallRating").find(".reviewcard").removeClass("editingreview")
    });
    $("[data-action='edit_myreview']").unbind().bind("click", this, function(e) {
        $(".OverallRating").removeClass("alreadyaquired");
        $(".OverallRating").find(".reviewcard").addClass("editingreview");
        $('html, body').animate({
            scrollTop: parseInt($(".reviewcard").offset().top - 110)
        }, 1000)
    });
    $("[data-action='submit_review']").unbind().bind("click", this, function(e) {
        $(this).addClass("disabled");
        var Overall_rating = $(this).closest('.reviewcard').find('.reviewheader .rating').find('span.active').attr("data");
        var review_text = $(this).closest('.reviewcard').find('.reviewComments').find('textarea').val();
        var reviewItemIndex = $(this).closest('.reviewcard').find('.reviewheader .rating').attr("data-reviewItemIndex");
        var itemType = $(this).closest('.reviewcard').attr("data-itemType");
        var deliveryId = $(this).closest('.reviewcard').attr("data-deliveryId");
        var reviewItemIndex_length = $(this).closest('.reviewcard').find('.content').length;
        var stararray = [0, 0, 0, 0, 0];
        review_ajaxcount = reviewItemIndex_length;
        for (var i = 0; i < reviewItemIndex_length; i++) {
            var review_text = null,
                prereview_text = null;
            var rating = null,
                prerating = null;
            var reviewItemIndex = $($(this).closest(".reviewcard").find('.content')[i]).attr('data-reviewItemIndex');
            var type = $($(this).closest(".reviewcard").find('.content')[i]).attr('data-type');
            if (type == 1) {
                review_text = $($(this).closest(".reviewcard").find('.reviewComments.content')).find('textarea').val();
                prereview_text = $($(this).closest(".reviewcard").find('.reviewComments.content')).attr("data-review");
                if (review_text == prereview_text) {
                    --review_ajaxcount;
                    continue
                }
                if (prereview_text != '' && review_text == '') {
                    alert('You are not allowed to remove the comment');
                    --review_ajaxcount;
                    continue
                }
            } else if (type == 0) {
                rating = $(this).closest(".reviewcard").find('.rating.content').find('span.active').attr("data");
                prerating = $(this).closest(".reviewcard").find('.rating.content').attr("data-rating");
                if (rating == prerating || typeof rating == 'undefined') {
                    --review_ajaxcount;
                    continue
                } else {
                    if (prerating == "") {
                        stararray[rating - 1] = 1
                    } else {
                        stararray[prerating - 1] = -1;
                        stararray[rating - 1] = 1
                    }
                }
            }
            sendUsersreview({
                itemType: itemType,
                reviewItemIndex: reviewItemIndex,
                deliveryId: deliveryId,
                rating: rating,
                review_text: review_text,
                stararray: stararray
            });
            if (review_ajaxcount == 0) {
                $(this).removeClass("disabled")
            }
        }
        if (review_ajaxcount == 0) {
            $(this).removeClass("disabled")
        }
    });
    $("[data-action='delete_myreview']").unbind().bind("click", this, function(e) {
        getConfirm = confirm("Delete Review?");
        if (getConfirm) {
            $(this).addClass("disabled");
            var stararray = [0, 0, 0, 0, 0];
            var itemType = $(this).parents('.descriptivereview').attr("data-itemType");
            var deliveryId = $(this).parents('.descriptivereview').attr("data-deliveryId");
            var prerating = $(this).parents('.descriptivereview').attr("data-rating");
            stararray[prerating - 1] = -1;
            deleteUsersreview({
                itemType: itemType,
                deliveryId: deliveryId,
                stararray: stararray
            })
        }
    });
    $(".reviewComments").find("textarea").bind('keydown', this, function(e) {
        autoSize($(this))
    });
    if ($("#review_Rating_div").length > 0) {
        var rating1 = $(".dynamicbannner").attr("data-rating");
        var count = $(".dynamicbannner").attr("data-ratingcount");
        if (typeof rating1 != "undefined" && typeof count != "undefined") {
            var removedecimal = rating1 | 0;
            var length = removedecimal * 36;
            length = length + (rating1 - removedecimal) * 36;
            if ((rating1 - removedecimal) > 0) {
                length = length + 2.5 * (removedecimal)
            } else {
                length = length + 2.5 * (removedecimal - 1)
            }
            if (length < 0) {
                length = 0
            }
            var trReview = "<div class='tr-rev-rate listpage'  data-type='0' data-rating='" + rating1 + "' >" + "<div class='tr-rev-rate-tran'>" + "<img src='https://'+systemSettings.cdn.bucket+'/svg/star-o.svg'>" + "</div>" + "<div class='tr-rev-rate-fill' style='width:" + length + "px;'>" + "</div>" + "<span class='ratingcount'>(" + (typeof(count) != "undefined" ? count : 0) + ")</span>" + "</div>";
            $("#review_Rating_div").html(trReview)
        }
        scrolltoUsersreview()
    }
    scrolltoUsersreview()
}

function autoSize(dom) {
    var el = dom;
    setTimeout(function() {
        el.css('height', '97px');
        var scrollHeight = Math.max(el.prop("scrollHeight"));
        el.css('height', scrollHeight + 'px')
    }, 0)
}

function sendUsersreview(review_data) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2review",
            ack: "addreview",
            itemType: review_data.itemType,
            reviewItemIndex: review_data.reviewItemIndex,
            deliveryId: review_data.deliveryId,
            rating: review_data.rating,
            data: review_data.review_text,
            ratingarray: review_data.stararray,
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == 'ok') {
                    if (--review_ajaxcount == 0) {
                        $('.reviewcard .reviewSubmitDiv button').removeClass("disabled");
                        alert("Thanks For Sharing Your Review!");
                        location.reload()
                    }
                } else if (reply.result.state == 'error') {
                    if (--review_ajaxcount == 0) {
                        $('.reviewcard .reviewSubmitDiv button').removeClass("disabled");
                        alert(reply.result.meta);
                        location.reload()
                    }
                }
            } catch (e) {
                alert(e)
            }
        }.bind(this),
        url: "/?route=common/ajax"
    })
}

function deleteUsersreview(review_data) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2review",
            ack: "deletereview",
            itemType: review_data.itemType,
            deliveryId: review_data.deliveryId,
            ratingarray: review_data.stararray,
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == 'ok') {
                    $('.reviewcard .reviewSubmitDiv button').removeClass("disabled");
                    alert("Review Successfully Deleted");
                    location.reload()
                } else if (reply.result.state == 'error') {
                    $('.reviewcard .reviewSubmitDiv button').removeClass("disabled");
                    alert(reply.result.meta);
                    location.reload()
                }
            } catch (e) {
                alert(e)
            }
        }.bind(this),
        url: "/?route=common/ajax"
    })
}

function scrolltoUsersreview() {
    $(".tr-rev-rate.listpage").unbind().bind("click", function() {
        if ($('.OverallRating').length > 0 && $('.OverallRating').css("display") != 'none') {
            $("html, body").animate({
                scrollTop: parseInt($('.OverallRating').offset().top - 65)
            }, 1000)
        } else {
            var p = $('.OverallRating').siblings('.descriptiveHolder');
            $("html, body").animate({
                scrollTop: parseInt($(p).find('.descriptivereview').offset().top - 65)
            }, 1000)
        }
    })
}
var _trTracker = null;

function TRTracker() {
    (function(i, s, o, g, r, a, m) {
        i.GoogleAnalyticsObject = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o), m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '../www.google-analytics.com/analytics.js', 'ga');
    ! function(f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function() {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script', '../connect.facebook.net/en_US/fbevents.js');
    if (typeof onesignalAppId != "undefined" && onesignalAppId.length > 5) {
        (function() {
            var as = document.createElement('script');
            as.type = 'text/javascript';
            as.src = "../cdn.onesignal.com/sdks/OneSignalSDK.js";
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(as, s)
        })();
        OneSignal = window.OneSignal || [];
        var oneSignalData = {
            appId: onesignalAppId,
            autoRegister: !0,
            notifyButton: {
                size: "medium",
                position: "bottom-left",
                enable: !0
            }
        };
        if (safariWebId.length > 5) {
            oneSignalData.safari_web_id = safariWebId
        }
        OneSignal.push(["init", oneSignalData])
    }
}
TRTracker.getObj = function() {
    if (_trTracker == null) {
        _trTracker = new TRTracker();
        _trTracker.BindEvents()
    }
    return _trTracker
};
TRTracker.prototype.BindEvents = function() {
    try {
        var tempUserId = '0';
        var userId = '0';
        var userName = 'Guest';
        var userEmailId = '';
        if (typeof getCookie !== 'undefined') {
            tempUserId = getCookie(systemSettings.siteSettings.tempUserCookieName)
        }
        if (typeof User !== 'undefined' && typeof User.getObj !== 'undefined') {
            var userObj = User.getObj();
            userId = userObj.userId;
            userName = userObj.userName;
            userEmailId = userObj.emailId
        } else {
            userId = 'Guest-' + tempUserId
        }
        if (typeof ga !== 'undefined') {
            var analyticsId = googleAnalyticsId;
            ga('create', analyticsId, 'auto');
            var client = "Client";
            if (typeof domainId !== undefined) {
                client = domainId
            }
            ga('set', 'userId', userId);
            ga('set', 'dimension1', userId);
            ga('set', 'dimension2', client);
            ga('set', 'dimension3', "false");
            ga('set', 'dimension5', "Vidu");
            try {
                ga('set', 'dimension4', document.referrer)
            } catch (e) {}
            ga('send', 'pageview', window.location.pathname);
            if (enableEcommTracking == "1") {
                ga('require', 'ec')
            }
        }
        if (typeof fbq !== 'undefined') {
            fbq('init', facebookPixelId);
            fbq('track', "PageView")
        }
        if (typeof CustomTracker !== 'undefined') {
            try {
                var ct = CustomTracker.getObj()
            } catch (e) {}
        }
        if (typeof onesignalAppId != "undefined" && onesignalAppId.length > 5) {
            try {
                OneSignal.push(function() {
                    OneSignal.on('subscriptionChange', function(isSubscribed) {
                        OneSignal.getUserId(function(userId) {
                            _trTracker.pushNotificationPlayerIdUserIdMapping(isSubscribed, userId, 2)
                        })
                    })
                })
            } catch (e) {}
        }
    } catch (e) {}
};
TRTracker.prototype.TrackEvent = function(evt, callback) {
    if (typeof ga === 'undefined') {
        if (typeof callback === 'function') {
            callback()
        }
        return
    }
    try {
        if (typeof CustomTracker !== 'undefined') {
            try {
                var ct = CustomTracker.getObj();
                ct.TrackEvent(evt)
            } catch (e) {}
        }
        var userId = null;
        var userName = null;
        var userEmailId = null;
        var userPhone = null;
        var userObj = null;
        if (typeof User !== 'undefined' && typeof User.getObj !== 'undefined') {
            userObj = User.getObj();
            userId = userObj.userId;
            userName = userObj.userName;
            userEmailId = userObj.emailId;
            userPhone = userObj.settings[2]
        }
        switch (evt) {
            case "VideoComplete_Event":
                {
                    var pageURL = $(location).attr("href");
                    var title = $(".container.lvTitle").attr("data-lvTitle");
                    var itemId = lvInfo.id;
                    var batchUrl = pageURL.substring(0, pageURL.lastIndexOf("index.html"));
                    if (typeof webengage !== 'undefined') {
                        webengage.track("VideoComplete_Event", {
                            "userId": userId,
                            "url": pageURL,
                            "title": title,
                            "itemId": itemId,
                            "batchUrl": batchUrl
                        })
                    }
                }
                break;
            case "pageView_Home":
                {
                    var pageURL = $(location).attr("href");
                    if (typeof webengage !== 'undefined') {
                        webengage.track("PageView_Home", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                        })
                    }
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'PageView')
                    }
                }
                break;
            case "pageView_Collection":
                {
                    var pageURL = $(location).attr("href");
                    if (enableEcommTracking == "1") {
                        $('#PlansAndPackages .package').each(function(e) {
                            ga('ec:addImpression', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Collection-page',
                            });
                            ga('ec:addProduct', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Collection-page',
                            })
                        });
                        ga('ec:setAction', 'detail')
                    }
                    ga('send', 'event', 'vEcomEvt', 'ViewCollectionPage', $('title').text());
                    if (typeof webengage !== 'undefined') {
                        webengage.track("Pageview_product", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                            "onPage": "CollectionPage",
                        })
                    }
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'PageView')
                    }
                }
                break;
            case "pageView_Checkout":
                {
                    var pageURL = $(location).attr("href");
                    var cost = parseInt($('.GrandTotal').attr('data-cost').substr(4));
                    if ($('.ItemInfo').length > 0) {
                        if (enableEcommTracking == "1") {
                            $('#PlansAndPackages .package').each(function(e) {
                                ga('ec:addImpression', {
                                    id: $(this).attr("data-itemid"),
                                    name: $(this).find('.pkgHeader > h3').text(),
                                    category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                    list: 'Checkout-page',
                                })
                            });
                            var cost = 0;
                            if ($('.GrandTotal').length > 0) {
                                cost = parseInt($('.GrandTotal').attr('data-cost').substr(4))
                            }
                            ga('ec:addProduct', {
                                id: $('.ItemInfo').attr("data-id"),
                                name: $('.ItemInfo').attr("data-name"),
                                price: cost,
                                quantity: 1
                            });
                            ga('ec:setAction', 'add')
                        }
                        ga('send', 'event', 'vEcomEvt', 'checkoutPage', $('.ItemInfo').attr("data-name"))
                    }
                    if (typeof webengage !== 'undefined') {
                        webengage.track("PageView_CheckOut", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                            "title": $('[data-webengage-prod="webengage"]').html(),
                            "productId": $('[data-webengage-prod="id"]').html(),
                            "price_new": cost,
                        })
                    }
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'AddToCart')
                    }
                }
                break;
            case "pageView_TestList":
                {
                    var pageURL = $(location).attr("href");
                    if (enableEcommTracking == "1") {
                        $('#PlansAndPackages .package').each(function(e) {
                            ga('ec:addImpression', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Test-list',
                            });
                            ga('ec:addProduct', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Test-list',
                            })
                        });
                        ga('ec:setAction', 'detail')
                    }
                    ga('send', 'event', 'vEcomEvt', 'ViewTestList', $('title').text());
                    if (typeof webengage !== 'undefined') {
                        webengage.track("Pageview_product", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                            "onPage": "TestList",
                        })
                    }
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'PageView')
                    }
                }
                break;
            case "pageView_BatchList":
                {
                    var pageURL = $(location).attr("href");
                    if (typeof webengage !== 'undefined') {
                        webengage.track("Pageview_product", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                            "onPage": "Batch",
                        })
                    }
                    if (enableEcommTracking == "1") {
                        $('#PlansAndPackages .package').each(function(e) {
                            ga('ec:addImpression', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Batch',
                            });
                            ga('ec:addProduct', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Batch',
                            })
                        });
                        ga('ec:setAction', 'detail')
                    }
                    ga('send', 'event', 'vEcomEvt', 'ViewBatch', $('title').text());
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'PageView')
                    }
                }
                break;
            case "pageView_PackageList":
                {
                    var pageURL = $(location).attr("href");
                    if (typeof webengage !== 'undefined') {
                        webengage.track("Pageview_product", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                        });
                        webengage.track("PageView_TestList", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                        })
                    }
                    if (enableEcommTracking == "1") {
                        $('.packageList .package').each(function(e) {
                            ga('ec:addImpression', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Package-list',
                            });
                            ga('ec:addProduct', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Package-list',
                            })
                        });
                        ga('ec:setAction', 'detail')
                    }
                    ga('send', 'event', 'vEcomEvt', 'ViewPackageList', $('title').text());
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'PageView')
                    }
                }
                break;
            case "pageView_PackageExplore":
                {
                    var pageURL = $(location).attr("href");
                    if (typeof webengage !== 'undefined') {
                        webengage.track("Pageview_product", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                        });
                        webengage.track("PageView_PackageExplore", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                        })
                    }
                    if (enableEcommTracking == "1") {
                        $('.packageList .package').each(function(e) {
                            ga('ec:addImpression', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Package-explore',
                            });
                            ga('ec:addProduct', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Package-explore',
                            })
                        });
                        ga('ec:setAction', 'detail')
                    }
                    ga('send', 'event', 'vEcomEvt', 'ViewPackagExplore', $('title').text());
                    if (typeof fbq !== 'undefined' && typeof pkgInfo != 'undefined') {
                        fbq('track', 'ViewContent', {
                            content_type: 'product',
                            content_ids: [pkgInfo.itemId],
                            content_name: pkgInfo.itemName,
                            value: Math.round(parseFloat(cost)),
                            currency: 'INR'
                        })
                    }
                }
                break;
            case "pageView_QuizeList":
                {
                    if (enableEcommTracking == "1") {
                        $('#PlansAndPackages .package').each(function(e) {
                            ga('ec:addImpression', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Quiz-List',
                            });
                            ga('ec:addProduct', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'Quiz-List',
                            })
                        });
                        ga('ec:setAction', 'detail')
                    }
                    ga('send', 'event', 'vEcomEvt', 'ViewQuizList', $('title').text());
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'PageView')
                    }
                }
                break;
            case "pageView_Exam":
                {
                    var pageURL = $(location).attr("href");
                    if (typeof webengage !== 'undefined') {
                        webengage.track("PageView_Exam", {
                            "tempID": userData.tempId,
                            "url": pageURL,
                        })
                    }
                    ga('send', 'event', 'vEcomEvt', 'ViewExam', $('title').text());
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'PageView')
                    }
                }
                break;
            case "pageView_LiveClass":
                {
                    if (enableEcommTracking == "1") {
                        $('#PlansAndPackages .package').each(function(e) {
                            ga('ec:addImpression', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'LiveClass',
                            });
                            ga('ec:addProduct', {
                                id: $(this).attr("data-itemid"),
                                name: $(this).find('.pkgHeader > h3').text(),
                                category: $(this).attr("data-type") == "1" ? "Plan" : "Package",
                                list: 'LiveClass',
                            })
                        });
                        ga('ec:setAction', 'detail')
                    }
                    ga('send', 'event', 'vEcomEvt', 'ViewLiveClass', $('title').text());
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'PageView')
                    }
                }
                break;
            case "login":
                {
                    if (typeof webengage !== 'undefined') {
                        webengage.user.login(userId);
                        if (typeof userEmailId !== 'undefined' && userEmailId != null && userEmailId.trim() != '') {
                            webengage.user.setAttribute('we_email', userEmailId)
                        }
                        if (typeof userPhone !== 'undefined' && userPhone != null && userPhone.trim() != '') {
                            webengage.user.setAttribute('we_phone', userPhone)
                        }
                        if (typeof userName !== 'undefined' && userName.trim() != '') {
                            webengage.user.setAttribute('we_first_name', userName)
                        }
                    }
                    ga('send', 'event', {
                        eventCategory: 'login',
                        eventAction: 'UserAction',
                        eventLabel: window.location.pathname,
                        eventValue: 1,
                        hitCallback: function() {
                            callback()
                        },
                        hitCallbackFail: function() {
                            callback()
                        }
                    })
                }
                break;
            case "logout":
                {
                    if (typeof webengage !== 'undefined') {
                        webengage.user.logout()
                    } else {
                        callback()
                    }
                }
                break;
            case "register":
                {
                    if (typeof webengage !== 'undefined') {
                        webengage.track("Registration", {
                            "UserId": userId,
                            "UserName": userName,
                            "EmailId": userEmailId,
                        })
                    }
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'CompleteRegistration', {
                            "UserId": userId,
                            "UserName": userName,
                            "ln": userName,
                            "Email": userEmailId,
                        })
                    }
                    ga('send', 'event', {
                        eventCategory: 'register',
                        eventAction: 'UserAction',
                        eventLabel: window.location.pathname,
                        eventValue: 1,
                        hitCallback: function() {
                            callback()
                        },
                        hitCallbackFail: function() {
                            callback()
                        }
                    })
                }
                break;
            case "proceedToPay":
                if ($('.ItemInfo').length > 0) {
                    var cost = $('.GrandTotal').attr('data-cost').substr(4);
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'InitiateCheckout', {
                            contents: [{
                                id: $('.ItemInfo').attr("data-id"),
                                quantity: 1
                            }]
                        })
                    }
                    if (enableEcommTracking == "1") {
                        ga('ec:addProduct', {
                            id: $('.ItemInfo').attr("data-id"),
                            name: $('.ItemInfo').attr("data-name"),
                            price: cost,
                            quantity: 1
                        });
                        ga('ec:setAction', 'checkout', {
                            step: 1
                        })
                    }
                    ga('send', 'event', {
                        eventCategory: 'vEcomEvt',
                        eventAction: 'ProceedToPay',
                        eventLabel: $('.ItemInfo').attr("data-name"),
                        eventValue: cost,
                        hitCallback: function() {
                            callback()
                        },
                        hitCallbackFail: function() {
                            callback()
                        }
                    })
                } else {
                    callback()
                }
                break;
            case "pageView_CheckTransaction":
                {
                    if (typeof txnInfo === 'object') {
                        if (typeof fbq !== 'undefined') {
                            fbq('track', 'Purchase', {
                                value: txnInfo.amount,
                                currency: 'INR',
                                contents: [{
                                    id: txnInfo.itemid,
                                    quantity: 1
                                }],
                                content_type: 'product'
                            })
                        }
                        if (enableEcommTracking == "1") {
                            ga('require', 'ec');
                            ga('ec:addProduct', {
                                id: txnInfo.itemid,
                                name: txnInfo.itemname,
                                category: txnInfo.itemType,
                                price: txnInfo.amount,
                                quantity: 1
                            });
                            ga('ec:setAction', 'purchase', {
                                id: txnInfo.txnid,
                                revenue: txnInfo.amount,
                                coupon: txnInfo.couponid
                            })
                        }
                        ga('send', 'event', 'vEcomEvt', 'TransactionSuccess', txnInfo.itemname, txnInfo.amount)
                    } else {
                        callback()
                    }
                }
                break;
            case "webinarSubscribe":
                {
                    ga('send', 'event', {
                        eventCategory: 'Webinar',
                        eventAction: 'Subscribe',
                        eventLabel: Webinar.getObj().title,
                        eventValue: Webinar.getObj().itemId,
                        hitCallback: function() {
                            callback()
                        },
                        hitCallbackFail: function() {
                            callback()
                        }
                    })
                }
                break;
            case "webinarPlay":
                {
                    ga('send', 'event', {
                        eventCategory: 'Webinar',
                        eventAction: 'Play',
                        eventLabel: Webinar.getObj().title,
                        eventValue: Webinar.getObj().itemId,
                        hitCallback: function() {
                            callback()
                        },
                        hitCallbackFail: function() {
                            callback()
                        }
                    })
                }
                break;
            default:
                callback()
        }
    } catch (e) {
        if (typeof callback === 'function') {
            callback()
        }
    }
};
TRTracker.prototype.isOnesignalSubscribed = function() {
    try {
        OneSignal.push(function() {
            OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                if (isEnabled) {
                    OneSignal.getUserId(function(userId) {
                        var isSubscribed = "true";
                        _trTracker.pushNotificationPlayerIdUserIdMapping(isSubscribed, userId, 2)
                    })
                }
            })
        })
    } catch (e) {}
};
TRTracker.prototype.pushNotificationPlayerIdUserIdMapping = function(isSubscribed, playerId, provider) {
    var userObj = User.getObj();
    var data = {
        mod: "user",
        ack: "notificationPlayerIdUserIdMapping",
        userId: userObj.userId,
        tempUserId: userObj.tempUserId,
        playerId: playerId,
        isSubscribed: isSubscribed,
        provider: provider
    };
    $.ajax({
        type: "POST",
        data: data,
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {}
            } catch (e) {
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
TRTracker.prototype.isFcmSubscribed = function() {
    var data = {
        mod: "vidupushnotification",
        ack: "fcmInitializeData",
        domainId: domainId
    };
    $.ajax({
        type: "POST",
        data: data,
        complete: function(event) {
            try {
                var data = event.responseJSON.data;
                _trTracker.registerUserForFCM(data.fcmApiKey, data.fcmAuthDomain, data.fcmProjectId, data.fcmStorageBucket, data.fcmMessagingSenderId, data.fcmAppId, data.fcmMeasurementId)
            } catch (e) {
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
TRTracker.prototype.registerUserForFCM = function(apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId) {
    $.getScript("../www.gstatic.com/firebasejs/4.1.3/firebase-app.js", function() {
        $.getScript("../www.gstatic.com/firebasejs/4.1.3/firebase-database.js", function() {
            $.getScript("../www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js", function() {
                firebase.initializeApp({
                    apiKey: apiKey,
                    authDomain: authDomain,
                    projectId: projectId,
                    storageBucket: storageBucket,
                    messagingSenderId: messagingSenderId,
                    appId: appId,
                    measurementId: measurementId,
                });
                const messaging = firebase.messaging();
                let userToken = null,
                    isSubscribed = !1;
                if ("serviceWorker" in navigator) {
                    navigator.serviceWorker.register("service-worker-fcm9a04.html?i=1").then((registration) => {
                        messaging.useServiceWorker(registration);
                        userToken = localStorage.getItem("pushToken");
                        if (userToken) {
                            isSubscribed = "true";
                            console.log("Old userToken >> ", userToken);
                            _trTracker.pushNotificationPlayerIdUserIdMapping(isSubscribed, userToken, 1)
                        } else {
                            subscribeUser()
                        }
                    }).catch((err) => console.log("Service Worker Error", err))
                } else {
                    console.log("Push not supported.")
                }

                function subscribeUser() {
                    messaging.requestPermission().then(() => messaging.getToken()).then((token) => {
                        isSubscribed = "true";
                        userToken = token;
                        localStorage.setItem("pushToken", token);
                        _trTracker.pushNotificationPlayerIdUserIdMapping(isSubscribed, userToken, 1);
                        console.log("New userToken >> ", userToken)
                    }).catch((err) => console.log("FCM Service Denied >> ", err))
                }
            })
        })
    })
};
$(document).ready(function(e) {
    TRTracker.getObj()
});
$(document).ready(function() {
    var activeTab = $(".tab-content.p2List").find(".tab-pane.active").find(".packageDiv");
    if (activeTab.length > 0) {
        var packageDiv = new slidediv();
        packageDiv.Init(activeTab, "packageList", "package")
    }
    var pkgdescriptionslide = new Array();
    if ($(".packageposition").find('.pkgDetail').length > 0) {
        setTimeout(function() {
            for (c = 0; c < $(".packageposition").find('.pkgDetail').length; c++) {
                pkgdescriptionslide[c] = new slideVertical();
                pkgdescriptionslide[c].Init("pkgDetail", "pkgDescription", "description", c)
            }
        }, 200)
    }
    $(".packageContainerTab .nav.nav-tabs").bind("click", function() {
        setTimeout(function() {
            var activeTab = $(".tab-content.p2List").find(".tab-pane.active").find(".packageDiv");
            var packageDiv = new slidediv();
            packageDiv.Init(activeTab, "packageList", "package");
            for (c = 0; c < $(".packageposition").find('.pkgDetail').length; c++) {
                pkgdescriptionslide[c].CheckPosition()
            }
        }, 200)
    });
    if ($(".pkgList").length > 0) {
        slider("pkgList", "tabList", "package-head")
    }
    faqs();
    if (typeof TRTracker !== 'undefined') {
        var pathname = window.location.pathname;
        if (pathname == "index.html") {
            TRTracker.getObj().TrackEvent("pageView_Home", function() {})
        } else {
            TRTracker.getObj().TrackEvent("pageView_Collection", function() {})
        }
    }
});
var TR2PostType = {
    AskQuery: 0,
    MCQ: 1,
    ShareInfo: 2,
    Str: ['AskQuery', 'MCQ', 'ShareInfo', ]
};
var TR2ActionType = {
    Upvote: 0,
    Comment: 1,
    Str: ['Upvote', 'Comment']
};
var TR2DiscussionItemType = {
    Post: 0,
    Comment: 1,
    Str: ['Post', 'Comment']
};
var TR2FilterType = {
    0: "query",
    1: "mcq",
    2: "info",
    3: "myposts",
};

function Discussion() {
    this.threadId = 0;
    this.node = null;
    this.isAdmin = !1;
    this.mod = "tr2discussion"
}
Discussion.getObj = (function() {
    var _discussionObj;
    return function() {
        if (!_discussionObj) {
            _discussionObj = new Discussion();
            _discussionObj.BindEvents()
        }
        return _discussionObj
    }
})();
Discussion.prototype.BindEvents = function() {
    this.threadId = $("#thread").data("threadid");
    this.isAdmin = $("#thread").data("showapprove") == 1;
    $("#thread").find("textarea").unbind().bind('keydown', this, function(e) {
        e.data.autoSize($(this))
    });
    var div = document.createElement("div");
    document.body.appendChild(div);
    this.node = $(div);
    $('.AskQuery').unbind().bind("click", this, function(e) {
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        var $queryCard = $('.createall').find(".create-jsquery");
        $queryCard.siblings().hide();
        $queryCard.show();
        e.data.ScrolltoDiv($queryCard)
    });
    $('.pmcq').unbind().bind("click", this, function(e) {
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        var $mcqCard = $('.createall').find(".create-jsmcq");
        $mcqCard.siblings().hide();
        $mcqCard.show();
        e.data.ScrolltoDiv($mcqCard)
    });
    $('.shareinfo').unbind().bind("click", this, function(e) {
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        var $infoCard = $('.createall').find(".create-jsinfo");
        $infoCard.siblings().hide();
        $infoCard.show();
        e.data.ScrolltoDiv($infoCard)
    });
    $(".discard-post").unbind().bind("click", this, function(e) {
        $(".create-post div").removeClass("active");
        $(".common-create").hide();
        var parentDom = $(this).closest(".common-create");
        parentDom.find("textarea").val('');
        parentDom.find("input:text").val('');
        parentDom.find("textarea").trigger('keydown');
        parentDom.find(".select-correct-option").find(".active").removeClass("active")
    });
    $(".queryPost").unbind().bind("click", this, function(e) {
        var $queryCard = $(this).closest('.create-jsquery');
        postId = parseInt($(this).attr('data-postid'));
        postTitle = $queryCard.find(".query-title").val().trim();
        query = $queryCard.find(".query-description").val().trim();
        postType = TR2PostType.AskQuery;
        $msg = $queryCard.find(".errorMsg");
        attachmentId = parseInt($queryCard.find('.image-preview').attr('data-attachmentid'));
        if (postTitle.length > 160) {
            $msg.text('Title cannot be more than 160 characters!');
            return
        }
        if (query.length == 0) {
            $msg.text('Query cannot be empty!');
            return
        }
        var content = {
            query: query,
        };
        e.data.CreatePost(postId, postTitle, content, postType, attachmentId)
    });
    $(".js-submit-mcq").unbind().bind("click", this, function(e) {
        var $mcqCard = $(this).closest('.create-jsmcq');
        postId = parseInt($(this).attr('data-postid'));
        postTitle = $mcqCard.find(".mcq-title").val().trim();
        question = $mcqCard.find(".mcq-question").val().trim();
        alloptions = $mcqCard.find(".mcq-option");
        answer = $mcqCard.find(".select-correct-option").find(".active").attr("data-select");
        postType = TR2PostType.MCQ;
        options = [];
        $msg = $mcqCard.find(".errorMsg");
        attachmentId = parseInt($mcqCard.find('.image-preview').attr('data-attachmentid'));
        if (postTitle.length > 160) {
            $msg.text('Title cannot be more than 160 characters!');
            return
        }
        if (question.length == 0) {
            $msg.text('Question cannot be empty!');
            return
        }
        for (i = 0; i < alloptions.length; i++) {
            var option = alloptions[i].value.trim();
            if (option.length == 0) {
                $msg.text('Options cannot be empty!');
                return
            }
            options.push(option)
        }
        if (answer == undefined) {
            $msg.text('Correct Answer not selected!');
            return
        }
        var content = {
            question: question,
            options: options,
            answer: answer
        };
        e.data.CreatePost(postId, postTitle, content, postType, attachmentId)
    });
    $(".post-info").unbind().bind("click", this, function(e) {
        var $infoCard = $(this).closest('.create-jsinfo');
        postId = parseInt($(this).attr('data-postid'));
        postTitle = $infoCard.find(".info-title").val().trim();
        postType = TR2PostType.ShareInfo;
        info = $infoCard.find(".info-description").val().trim();
        $msg = $infoCard.find(".errorMsg");
        attachmentId = parseInt($infoCard.find('.image-preview').attr('data-attachmentid'));
        if (postTitle.length > 160) {
            $msg.text('Title cannot be more than 160 characters!');
            return
        }
        if (info.length == 0) {
            $msg.text('Info cannot be empty!');
            return
        }
        content = {
            info: info,
        };
        e.data.CreatePost(postId, postTitle, content, postType, attachmentId)
    });
    $(".post-approve input").unbind().change(this, function(e) {
        var itemId = $(this).parents(".Card").attr("data-postid");
        isApproved = $(this).prop("checked") ? 1 : 0;
        msg = isApproved == 1 ? "Approve Post?" : "Disapprove Post?";
        getConfirm = confirm(msg);
        if (getConfirm) {
            e.data.SetApprove(isApproved, itemId, TR2DiscussionItemType.Post)
        } else {
            $(this).prop('checked', !isApproved)
        }
    });
    $(".mcqOptions").unbind().bind("click", this, function(e) {
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        if (!$(this).parents(".mcq-description").children(".mcqOptions").hasClass("correct")) {
            e.data.ValidateMcq($(this))
        }
    });
    $('.AddOption').unbind().bind("click", this, function(e) {
        var $mcqCard = $(this).closest('.create-jsmcq');
        optionCount = $mcqCard.attr('data-optcount');
        if (optionCount < 5) {
            $mcqCard.attr('data-optcount', ++optionCount);
            var optionHtml = '<div class="option">' + '<label class="mcq-option-label">' + String.fromCharCode(64 + optionCount) + '</label>' + '<div>' + '<textarea class="mcq-option" placeholder="Option ' + String.fromCharCode(64 + optionCount) + '"></textarea>' + '</div>' + '</div>';
            $mcqCard.find(".mcq-options").append(optionHtml);
            $mcqCard.find(".select-correct-option").append("<a data-select=" + parseInt(optionCount - 1) + ">" + String.fromCharCode(64 + optionCount) + "</a>");
            $mcqCard.find('.optionremove').css('display', 'block');
            $mcqCard.find(".mcq-options .option div").find("textarea").unbind().bind('keydown', e.data, function(e) {
                e.data.autoSize($(e.currentTarget))
            }.bind(this))
        }
        if (optionCount > 4) {
            $(this).hide()
        }
    });
    $('.optionremove').unbind().click(function() {
        var $mcqCard = $(this).closest('.create-jsmcq');
        optionCount = $mcqCard.attr('data-optcount');
        if (optionCount > 2) {
            $mcqCard.find(".option").last().remove();
            $mcqCard.find(".select-correct-option a").last().remove();
            $mcqCard.find('.AddOption').show();
            $mcqCard.find('.select-correct-option').css("margin", "unset");
            $mcqCard.attr('data-optcount', --optionCount)
        }
        if (optionCount < 3) {
            $(this).hide()
        }
    });
    $('.select-correct-option ').unbind().click(function(e) {
        $('.select-correct-option a').removeClass("active");
        $(e.target).addClass("active")
    });
    $(".submit-comment").unbind().bind("click", this, function(e) {
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        var itemId = $(this).data('postid');
        itemType = TR2DiscussionItemType.Post;
        query = $(this).siblings('.write-comment-text').val().trim();
        mail = 1;
        if (query.length < 1) {
            alert("Comment cannot be empty");
            return
        }
        var content = {
            Query: query
        };
        e.data.SubmitComment(itemId, itemType, content, mail)
    });
    $(".js-showcomments").unbind().one("click", this, function(e) {
        var itemId = $(this).closest(".Card").attr("data-postid");
        $('#post-' + itemId + '').find(".write-comment").show();
        itemType = TR2DiscussionItemType.Post;
        e.data.GetComment(itemId, itemType)
    });
    $(".js-getcomments").unbind().bind("click", this, function(e) {
        var itemId = $(this).closest(".Card").attr("data-postid");
        itemType = TR2DiscussionItemType.Post;
        e.data.GetComment(itemId, itemType)
    });
    $(".post-upvote").unbind().bind("click", this, function(e) {
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        $(this).find("img").toggle();
        var itemId = $(this).data('postid');
        itemType = TR2DiscussionItemType.Post;
        deleted = parseInt($(this).data('upvote'));
        counterDom = $("#post-" + itemId).find('.upvotes-count');
        upvotesCount = parseInt(counterDom.text());
        if (deleted) {
            $(this).find("span").removeClass().addClass("like");
            $(this).find("span").text("LIKE");
            $(this).data("upvote", 0);
            counterDom.text(--upvotesCount)
        } else {
            $(this).find("span").text("LIKED");
            $(this).find("span").removeClass().addClass("liked");
            $(this).data("upvote", 1);
            counterDom.text(++upvotesCount)
        };
        e.data.Upvote(itemId, itemType, deleted)
    });
    $(".post-comment").unbind().bind("click", this, function(e) {
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        $(this).parents().siblings(".write-comment").find("textarea").val('');
        $(this).parents().siblings(".write-comment").show();
        $(this).parents().siblings(".write-comment").find("textarea").css("height", "40px")
    });
    $(".post-share").unbind().bind("click", this, function(e) {
        var postId = $(this).data('postid');
        e.data.GetpostOgImg(postId)
    });
    $(".js-page").unbind().bind('click', function() {
        var page = $(this).attr('data-page');
        var posttype = parseInt($("#thread").attr("data-posttype"));
        var query = (typeof posttype === "number" && posttype > -1) ? "&filter=" + TR2FilterType[posttype] : "";
        var url = location.href.split('#')[0];
        url = url.split('?')[0];
        window.location = url + '?page=' + page + query + "#thread"
    });
    $(".js-filter-post").unbind().bind('click', function() {
        var postType = $(this).data('posttype');
        var url = location.href.split('#')[0];
        url = url.split('?')[0];
        window.location = url + '?filter=' + postType + '#thread'
    });
    $(".js-clear-filter").unbind().bind('click', function() {
        var url = location.href.split('#')[0];
        url = url.split('?')[0];
        window.location = url + '#thread'
    });
    $(".js-myposts").unbind().bind('click', function() {
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        var myposts = $(this).data('posttype');
        var url = location.href.split('#')[0];
        url = url.split('?')[0];
        window.location = url + '?filter=' + myposts + '#thread'
    });
    $(".js-pinpost").unbind().bind('click', this, function(e) {
        var pinindex = prompt("Please enter the pin index");
        var postId = $(this).parents(".Card").attr("data-postid");
        if ($.isNumeric(pinindex)) {
            e.data.PinPost(pinindex, postId)
        } else {
            alert("Pin unsuccesful. Enter only numbers!")
        }
    });
    $(".js-unpin").unbind().bind('click', this, function(e) {
        var postId = $(this).parents(".Card").attr("data-postid");
        console.log(postId);
        getConfirm = confirm("Unpin?");
        if (getConfirm) {
            e.data.UnPinPost(postId)
        }
    });
    $(".js-delete-post").unbind().bind('click', this, function(e) {
        var itemId = $(this).closest('.Card').attr('data-postid');
        itemType = TR2DiscussionItemType.Post;
        getConfirm = confirm("Delete Post?");
        if (getConfirm) {
            e.data.DeleteItem(itemId, itemType)
        }
    });
    $('.js-upload-img').unbind().bind('click', this, function(e) {
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        $(this).siblings('.img-file').trigger('click')
    });
    $('.img-file').change(this, function(e) {
        $createCard = $(this).closest('.common-create');
        var file = $(this)[0].files[0];
        e.data.UploadImage(file, $createCard)
    });
    $('.js-delete-img').unbind().bind('click', function() {
        $imagePreview = $(this).closest('.common-create').find('.image-preview').empty();
        $imagePreview.empty();
        $imagePreview.attr('data-attachmentid', 0);
        $(this).hide()
    });
    this.QueryClone = $('.create-jsquery').clone(!0);
    this.QueryClone.find('.discard-post').unbind();
    this.QueryClone.find('.queryPost').text('Edit Query');
    this.MCQClone = $('.create-jsmcq').clone(!0);
    this.MCQClone.find('.discard-post').unbind();
    this.MCQClone.find('.js-submit-mcq').text('Edit MCQ');
    this.InfoClone = $('.create-jsinfo').clone(!0);
    this.InfoClone.find('.discard-post').unbind();
    this.InfoClone.find('.post-info').text('Edit Info');
    $(".js-edit-query").unbind().bind('click', this, function(e) {
        if ($('#thread').find(e.data.QueryClone).length > 0) {
            e.data.QueryClone.find('.discard-post').trigger('click')
        }
        var $post = $(this).closest('.query-post');
        postId = parseInt($post.attr('data-postid'));
        postTitle = e.data.GetHtmlForEdit($post.find(".post-title"));
        query = e.data.GetHtmlForEdit($post.find(".post-questn"));
        imageId = 0;
        imageUrl = null;
        if ($post.find(".post-img").length != 0) {
            imageId = parseInt($post.find(".post-img").attr('data-attachmentid'))
        }
        if ($post.find(".post-img img").length != 0) {
            imageUrl = $post.find(".post-img img").attr('src')
        }
        e.data.EditQuery(postId, postTitle, query, imageId, imageUrl)
    });
    $(".js-edit-info").unbind().bind('click', this, function(e) {
        if ($('#thread').find(e.data.InfoClone).length > 0) {
            e.data.InfoClone.find('.discard-post').trigger('click')
        }
        var $post = $(this).closest('.info-post');
        postId = parseInt($post.attr('data-postid'));
        postTitle = e.data.GetHtmlForEdit($post.find(".post-title"));
        query = e.data.GetHtmlForEdit($post.find(".post-questn"));
        imageId = 0;
        imageUrl = null;
        if ($post.find(".post-img").length != 0) {
            imageId = parseInt($post.find(".post-img").attr('data-attachmentid'))
        }
        if ($post.find(".post-img img").length != 0) {
            imageUrl = $post.find(".post-img img").attr('src')
        }
        e.data.EditInfo(postId, postTitle, query, imageId, imageUrl)
    });
    $(".js-noposts").unbind().bind('click', this, function(e) {
        if ($(".common-create:visible").length == 0) {
            $('.create-jsquery').show();
            $('.AskQuery').addClass("active")
        }
        var $createcard = $(".common-create:visible");
        e.data.ScrolltoDiv($createcard)
    });
    $(".js-scrolltotop").unbind().bind('click', function() {
        var ofsettop = $("#thread").offset().top;
        $('html, body').animate({
            scrollTop: ofsettop - 130
        }, 800)
    });
    if ($("#thread").length > 0) {
        $(window).scroll(function() {
            var ofsettop = $("#thread").offset().top;
            var currentScroll = $(window).scrollTop() - 100;
            if (currentScroll >= ofsettop) {
                $("body").find(".js-comnscrolltotop").removeClass("comnscrolltotop");
                $('.js-scrolltotop').addClass("discussscrolltop")
            } else {
                $('.js-scrolltotop').removeClass("discussscrolltop");
                $("body").find(".js-comnscrolltotop").addClass("comnscrolltotop")
            }
        })
    }
};
Discussion.prototype.ScrolltoDiv = function(eleid) {
    $('html, body').animate({
        scrollTop: parseInt(eleid.offset().top - 140)
    }, 1000)
};
Discussion.prototype.autoSize = function(dom) {
    var el = dom;
    setTimeout(function() {
        el.css('height', 'auto');
        var scrollHeight = Math.max(38, el.prop("scrollHeight"));
        el.css('height', scrollHeight + 'px')
    }, 0)
};
Discussion.prototype.CreatePost = function(postId, postitle, query, posttype, attachmentId) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2discussion",
            ack: "addtopic",
            threadid: this.threadId,
            postid: postId,
            title: postitle,
            content: JSON.stringify(query),
            posttype: posttype,
            attachmentid: attachmentId,
        },
        complete: function(event) {
            try {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    if (attachmentId > 0) {
                        alert("Your post has been submitted successfully and waiting for approval from Admin.")
                    } else {
                        alert("Your post has been submitted successfully")
                    }
                    var url = location.href.split('#')[0];
                    url = url.split('?')[0];
                    url += "?filter=myposts#thread";
                    window.location.href = url;
                    if (window.location.href == url) {
                        location.reload()
                    }
                } else if (reply.result.state == "error") {
                    if (reply.result.meta == "LoginRequired") {
                        $("body").trigger({
                            type: "_showLoginDialogEvt",
                            tabName: "logintab"
                        })
                    } else if (reply.result.meta == "EMPTYCONTENT") {
                        alert("Post cannot be empty!")
                    } else {
                        alert("Internal Error!")
                    }
                    console.error(reply.result.meta)
                }
            } catch (e) {
                alert("Internal Error!");
                console.log(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
Discussion.prototype.ValidateMcq = function($optionDom) {
    var selectedoption = $optionDom.attr("data-option");
    $post = $optionDom.closest(".mcq-post");
    postId = $post.attr("data-postid");
    itemType = TR2DiscussionItemType.Post;
    username = User.getObj().userName;
    $post.find(".mcqOptions").unbind("click");
    $post.find(".mcqOptions").removeClass("hover");
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2discussion",
            ack: "mcqvalidate",
            postId: postId,
            selectedoption: selectedoption,
        },
        complete: function(event) {
            try {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    var answerjson = JSON.parse(reply.data.content);
                    answer = answerjson.answer;
                    query = '';
                    if (selectedoption == answer) {
                        query += '' + username + ' has attempted correctly';
                        $optionDom.addClass("correct");
                        $optionDom.find("span").addClass("glyphicon glyphicon-ok")
                    } else {
                        query += '' + username + ' has attempted';
                        $optionDom.addClass("wrong");
                        $optionDom.find("span").addClass("glyphicon glyphicon-remove");
                        $optionDom.siblings(".mcqOptions").each(function() {
                            var choosen = $(this).attr("data-option");
                            if (choosen == answer) {
                                $(this).addClass("correct");
                                $(this).find("span").addClass("glyphicon glyphicon-ok")
                            }
                        })
                    }
                    var attemptsCount = parseInt($post.find('.attempts-count').text());
                    $post.find('.attempts-count').text(++attemptsCount);
                    if (query.length > 0) {
                        var content = {
                            Query: query
                        };
                        this.SubmitComment(postId, itemType, content, 0)
                    }
                } else {
                    alert("Internal Error!");
                    console.error(reply.result.meta)
                }
            } catch (e) {
                alert("Internal Error");
                console.error(e)
            }
        }.bind(this),
        url: "/?route=common/ajax"
    })
};
Discussion.prototype.SetApprove = function(isApproved, itemId, itemType) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2discussion",
            ack: "setapprove",
            threadid: this.threadId,
            itemid: itemId,
            itemtype: itemType,
            isapproved: isApproved
        },
        complete: function(event) {
            try {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    var msg = TR2DiscussionItemType.Str[itemType] + (reply.data == 1 ? " approved" : " disapproved") + " successfully!";
                    alert(msg)
                } else {
                    alert("Internal Error!");
                    console.log(reply.result.meta)
                }
            } catch (e) {
                alert("Internal Error");
                console.log(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
Discussion.prototype.PinPost = function(index, postId) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2discussion",
            ack: "pinpost",
            postid: postId,
            threadid: this.threadId,
            index: index
        },
        complete: function(event) {
            try {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    alert("Post is pinned succesfully!");
                    var url = location.href.split('#')[0];
                    url = url.split('?')[0];
                    url += "#thread";
                    window.location.href = url;
                    if (window.location.href == url) {
                        location.reload()
                    }
                } else {
                    alert("Internal Error!");
                    console.log(reply.result.meta)
                }
            } catch (e) {
                alert("Internal Error");
                console.log(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
Discussion.prototype.UnPinPost = function(postId) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2discussion",
            ack: "unpinpost",
            threadid: this.threadId,
            postid: postId
        },
        complete: function(event) {
            try {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    alert("Post is unpinned successfully!");
                    var url = location.href.split('#')[0];
                    url = url.split('?')[0];
                    url += "#thread";
                    window.location.href = url;
                    if (window.location.href == url) {
                        location.reload()
                    }
                } else {
                    alert("Internal Error!");
                    console.log(reply.result.meta)
                }
            } catch (e) {
                alert("Internal Error");
                console.log(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
Discussion.prototype.Upvote = function(itemId, itemType, value) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2discussion",
            ack: "upvote",
            itemId: itemId,
            itemType: itemType,
            deleted: value,
        },
        complete: function(event) {
            try {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    console.log("success", reply.result)
                } else if (reply.result.state == "error") {
                    if (reply.result.meta == "LoginRequired") {
                        $("body").trigger({
                            type: "_showLoginDialogEvt",
                            tabName: "logintab"
                        })
                    } else {
                        alert("Internal Error!");
                        console.log(reply.result.meta)
                    }
                }
            } catch (e) {
                alert("Internal Error");
                console.log(e)
            }
        }.bind(this),
        url: "/?route=common/ajax"
    })
};
Discussion.prototype.SubmitComment = function(itemId, itemType, content, mail) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2discussion",
            ack: "addcomment",
            content: JSON.stringify(content),
            itemid: itemId,
            itemtype: itemType,
            threadid: this.threadId,
            mail: mail
        },
        complete: function(event) {
            try {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    var comment = reply.data;
                    comment.isApproved = 1;
                    comment.updatedOn = "Just Now";
                    comment.upvoteCount = 0;
                    var commentArr = [comment];
                    var displayNames = {};
                    displayNames[User.getObj().userId] = User.getObj().userName;
                    this.PopulateComment(reply.data.itemId, commentArr, displayNames, 0, !0);
                    var $post = $('#post-' + reply.data.itemId);
                    var limit = parseInt($post.attr("data-commntlimit"));
                    $post.attr("data-commntlimit", ++limit);
                    $post.find('.write-comment-text').val('');
                    var commentsCount = parseInt($post.find('.comments-count').text());
                    $post.find('.comments-count').text(++commentsCount)
                } else {
                    if (reply.result.meta == "LoginRequired") {
                        $("body").trigger({
                            type: "_showLoginDialogEvt",
                            tabName: "logintab"
                        })
                    } else if (reply.result.meta == "EMPTYCOMMENT") {
                        alert("Comment cannot be empty!")
                    } else {
                        alert("Internal Error!")
                    }
                    console.error(reply.result.meta)
                }
            } catch (e) {
                alert("Internal Error");
                console.error(e)
            }
        }.bind(this),
        url: "/?route=common/ajax"
    })
};
Discussion.prototype.GetComment = function(itemId, itemType) {
    var postDom = $('#post-' + itemId + '');
    limit = parseInt(postDom.attr("data-commntlimit"));
    once = postDom.attr('data-cmtsloaded') == 0;
    count = once ? 3 : 5;
    totalCount = parseInt($('#post-' + itemId + '').attr("data-remaincommnts"));
    if (totalCount > 0 || once) {
        $.ajax({
            type: "POST",
            data: {
                mod: "tr2discussion",
                ack: "getcomment",
                itemid: itemId,
                itemtype: itemType,
                limit: limit,
                count: count,
                threadid: this.threadId,
            },
            complete: function(event) {
                try {
                    var reply = event.responseJSON;
                    if (reply.result.state == 'multiLogindetected') {
                        User.getObj().PageRefresh()
                    } else if (reply.result.state == "ok") {
                        console.log(reply);
                        var limitchange = limit + count;
                        var postDom = $('#post-' + itemId + '');
                        postDom.attr("data-commntlimit", limitchange);
                        postDom.attr("data-cmtsloaded", 1);
                        this.isAdmin = reply.data.showApprove == 1;
                        this.PopulateComment(itemId, reply.data.comments, reply.data.displayNames, reply.data.userComntUpvote, !1);
                        postDom.attr("data-remaincommnts", reply.data.remain_comments);
                        if (reply.data.remain_comments > 0) {
                            postDom.find('.more_comments').show()
                        } else {
                            postDom.find('.more_comments').hide()
                        }
                    } else {
                        alert("Internal Error!");
                        console.error(reply.result.meta)
                    }
                } catch (e) {
                    alert("Internal Error");
                    console.error(e)
                }
            }.bind(this),
            url: "/?route=common/ajax"
        })
    }
};
Discussion.prototype.PopulateComment = function(postId, commentArr, displayNames, userComntUpvote, userComment) {
    console.log(commentArr);
    var postDom = $('#post-' + postId);
    commentDiv = postDom.find('.show-comments');
    writeCmtDom = commentDiv.siblings('.write-comment');
    curtime = $.now();
    writeCmtDom.find("textarea").val('');
    writeCmtDom.find("textarea").css("height", "40px");
    writeCmtDom.show();
    var html = '';
    for (var i = 0; i < commentArr.length; i++) {
        var comment = commentArr[i];
        content = JSON.parse(comment.content);
        usercomupvote = jQuery.inArray(comment.id, userComntUpvote) !== -1 ? "1" : "0";
        html += '<div id="comment-' + comment.id + '" class="eachcomment" data-commentid="' + comment.id + '"  data-comreply = ' + comment.commentCount + ' >' + '<div>' + '<span class="userpic" style="background-image: url(/attachment/profile-thumbnail/' + comment.userId + '/' + curtime + ');"></span>' + '<div class="usercomment">' + '<p id="uname-' + comment.id + '">' + displayNames[comment.userId] + '</p>' + '<p>' + content.Query + '</p>' + '</div>';
        if (comment.userId == User.getObj().userId || this.isAdmin) {
            html += '<div class="btn-group moreactions">' + '<a class="dropdown-toggle" data-toggle="dropdown">' + '<span class="glyphicon glyphicon-option-vertical"></span>' + '</a>' + '<ul class="dropdown-menu">' + '<li><a class="js-delete-comment"><span class="glyphicon glyphicon-trash"></span>Delete Comment</a></li>';
            if (this.isAdmin) {
                html += '<li>' + '<a class="comment-approve">' + '<input type="checkbox" ' + (comment.isApproved == 1 ? 'checked="true"' : '') + '/>' + 'Approve' + '</a>' + '</li>'
            }
            html += '</ul>' + '</div>'
        }
        html += '</div>' + '<div class="comentacions">' + '<span class="coment-upvote" data-usercomupvote = ' + usercomupvote + ' data-comupvotecount = ' + comment.upvoteCount + '>';
        if (usercomupvote == 1) {
            html += '<img src="https://' + systemSettings.cdn.bucket + '/images/liked@2x-023c6c29c5d7e.png" alt="Comment Upvoted"/>' + '<img src="https://' + systemSettings.cdn.bucket + '/images/like@2x-023c6c275248f.png" alt="Comment Upvote" style="display: none;"/>'
        } else {
            html += '<img src="https://' + systemSettings.cdn.bucket + '/images/liked@2x-023c6c29c5d7e.png " alt="Comment Upvoted" style="display: none;"/>' + '<img src="https://' + systemSettings.cdn.bucket + '/images/like@2x-023c6c275248f.png" alt="Comment Upvote"/>'
        }
        html += '<span class="comntupvotecount"> ' + comment.upvoteCount + ' </span>LIKE </span>' + '<span class="js-reply">' + '<a><img src="https://' + systemSettings.cdn.bucket + '/images/reply@2x-023ca552b2dfb.png" alt="Comment Reply"/>REPLY</a>' + '</span>' + '<span class="duration">' + this.DisplayDate(comment.updatedOn) + '</span>' + '</div>' + '</div>'
    }
    if (userComment) {
        commentDiv.prepend(html)
    } else {
        commentDiv.append(html)
    }
    $(".coment-upvote").unbind().bind("click", this, function(e) {
        var comId = $(this).closest(".eachcomment").attr("data-commentid");
        if (User.getObj().userId == 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "logintab"
            });
            return
        }
        $(this).find("img").toggle();
        var itemId = $(this).closest(".eachcomment").attr("data-commentid");
        itemType = TR2DiscussionItemType.Comment;
        deleted = parseInt($(this).attr('data-usercomupvote'));
        counterDom = $("#comment-" + itemId).find('.comntupvotecount');
        comupvotesCount = parseInt(counterDom.text());
        if (deleted) {
            $(this).attr("data-usercomupvote", 0);
            counterDom.text(--comupvotesCount)
        } else {
            $(this).attr("data-usercomupvote", 1);
            counterDom.text(++comupvotesCount)
        };
        e.data.Upvote(itemId, itemType, deleted)
    });
    $(".js-reply").unbind().bind("click", this, function(e) {
        var postId = $(this).parents(".Card").attr("data-postid");
        var comId = $(this).closest(".eachcomment").attr("data-commentid");
        var username = '@' + $('#post-' + postId + '').find('#uname-' + comId + '').text() + '';
        $('#post-' + postId + '').find(".write-comment-text").show();
        $('#post-' + postId + '').find(".write-comment-text").css("height", "40px");
        $('#post-' + postId + '').find(".write-comment-text").val('');
        $('#post-' + postId + '').find(".write-comment-text").val(username);
        e.data.ScrolltoDiv($('#post-' + postId + '').find(".write-comment-text"))
    });
    $(".comment-approve input").unbind().change(this, function(e) {
        var itemId = $(this).parents('.eachcomment').attr("data-commentid");
        isApproved = $(this).prop("checked") ? 1 : 0;
        msg = isApproved == 1 ? "Approve Comment?" : "Disapprove Comment?";
        getConfirm = confirm(msg);
        if (getConfirm) {
            e.data.SetApprove(isApproved, itemId, TR2DiscussionItemType.Comment)
        }
    });
    $(".js-delete-comment").unbind().bind('click', this, function(e) {
        var itemId = $(this).closest('.eachcomment').attr('data-commentid');
        itemType = TR2DiscussionItemType.Comment;
        getConfirm = confirm("Delete Comment?");
        if (getConfirm) {
            e.data.DeleteItem(itemId, itemType)
        }
    })
};
Discussion.prototype.GetpostOgImg = function(postId) {
    var hasogimage = $('#post-' + postId + '').attr("data-ogimg");
    var threadurlkey = $("#thread").attr("data-threadurlkey");
    if (hasogimage == 1) {
        this.ShowShareDialog(postId, threadurlkey)
    } else {
        var domobj = this;
        var postofsettop = $('#post-' + postId + '').offset().top;
        $('html, body').animate({
            scrollTop: postofsettop - 100
        }, 0);
        var options = {
            useCORS: !0
        };
        html2canvas($('#post-' + postId + '')[0], options).then(function(canvas) {
            try {
                var dataURL = canvas.toDataURL("image/jpeg");
                $.ajax({
                    type: "POST",
                    data: {
                        mod: "tr2discussion",
                        ack: "ogimage",
                        dataurl: dataURL,
                        postid: postId
                    },
                    complete: function(event) {
                        try {
                            var reply = event.responseJSON;
                            if (reply.result.state == 'multiLogindetected') {
                                User.getObj().PageRefresh()
                            } else if (reply.result.state == "ok") {
                                $('#post-' + postId + '').attr("data-ogimg", "1")
                            } else {
                                alert("Internal Error!");
                                console.log(reply.result.meta)
                            }
                        } catch (e) {
                            alert("Internal Error");
                            console.log(e)
                        } finally {
                            domobj.ShowShareDialog(postId, threadurlkey)
                        }
                    },
                    url: "/?route=common/ajax"
                })
            } catch (e) {
                domobj.ShowShareDialog(postId, threadurlkey)
            }
        })
    }
};
Discussion.prototype.ShowShareDialog = function(postId, threadurlkey) {
    if ($('#share-modal').length == 0) {
        var shareHtml = '<div class="common-modal-style modal fade share_modal"" id="share-modal" role="dialog">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal">&times</button>' + '<h5 class="modal-title">Share Post!</h5>' + '</div>' + '<div class="modal-body">' + '<div data-media="facebook" class="js-share"><img src="https://' + systemSettings.cdn.bucket + '/images/fb_02228a17014d5.png" alt="Share Facebook"/>Facebook</div>' + '<div data-media="twitter" class="js-share"><img src="https://' + systemSettings.cdn.bucket + '/images/twitter_02228a1e92bcc.png" alt="Share Twitter"/>Twitter</div>' + '<div data-media="whatsapp" class="js-share"><img src="https://' + systemSettings.cdn.bucket + '/images/whatsapp-0251d13f506d7.png" alt="Share Whatsapp"/>Whatsapp</div>' + '<div data-media="telegram" class="js-share"><img src="https://' + systemSettings.cdn.bucket + '/images/telegram-0251d14161d91.png" alt="Share Telegram"/>Telegram</div>' + '</div>' + '</div>' + '</div>' + '</div>';
        this.node.append(shareHtml)
    }
    $(".js-share").unbind().bind("click", this, function(e) {
        $("#share-modal").modal('hide');
        var url = document.URL.split("#")[0];
        url = url.split("?")[0];
        url += '' + threadurlkey + '?post-id=' + postId + '#thread';
        var media = $(this).data("media");
        e.data.SharePost(url, media)
    });
    $("#share-modal").modal('show')
};
Discussion.prototype.SharePost = function(url, media) {
    switch (media) {
        case "facebook":
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), 'facebook-popup', 'height=350,width=600').focus();
            break;
        case "twitter":
            window.open('https://twitter.com/share?url=' + encodeURIComponent(url), 'twitter-popup', 'height=350,width=600').focus();
            break;
        case "google-plus":
            window.open('https://plus.google.com/share?url=' + encodeURIComponent(url), 'gshare', 'height=450,width=600').focus();
            break;
        case "whatsapp":
            window.open('https://web.whatsapp.com/send?text=' + encodeURIComponent(url), 'whatsapp-share', 'height=350,width=600').focus();
            break;
        case "telegram":
            window.open('https://t.me/share/url?url=' + encodeURIComponent(url), 'telegram-popup', 'height=350,width=600').focus();
            break
    }
};
Discussion.prototype.DeleteItem = function(itemId, itemType) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2discussion",
            ack: "deleteitem",
            itemid: itemId,
            itemtype: itemType,
            threadid: this.threadId
        },
        complete: function(event) {
            try {
                var reply = event.responseJSON;
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == "ok") {
                    var msg = TR2DiscussionItemType.Str[reply.data.itemType] + " deleted successfully!";
                    if (itemType == TR2DiscussionItemType.Post) {
                        $('#post-' + itemId).remove()
                    } else if (itemType == TR2DiscussionItemType.Comment) {
                        var commentDom = $('#comment-' + itemId);
                        var postDom = commentDom.closest('.Card');
                        var limit = parseInt(postDom.attr("data-commntlimit"));
                        postDom.attr("data-commntlimit", --limit);
                        var commentsCount = parseInt(postDom.find(".comments-count").text());
                        if (typeof commentsCount === 'number' && commentsCount != NaN) {
                            var newCount = Math.max(commentsCount - 1, 0);
                            postDom.find(".comments-count").text(newCount)
                        }
                        commentDom.remove()
                    }
                    alert(msg)
                } else {
                    alert("Internal Error!");
                    console.error(reply.result.meta)
                }
            } catch (e) {
                alert("Internal Error");
                console.error(e)
            }
        },
        url: "/?route=common/ajax"
    })
};
Discussion.prototype.EditQuery = function(postId, postTitle, query, imageId, imageUrl) {
    var $post = $('#post-' + postId);
    $post.hide();
    this.QueryClone.find('.query-title').val(postTitle);
    this.QueryClone.find('.query-description').val(query);
    this.QueryClone.find('.queryPost').attr('data-postid', postId);
    this.QueryClone.find("textarea").trigger('keydown');
    var $imagePreview = this.QueryClone.find('.image-preview');
    if (imageId > 0 && typeof imageUrl === 'string') {
        $imagePreview.attr('data-attachmentid', imageId);
        $imagePreview.html('<img src="' + imageUrl + '" />');
        this.QueryClone.find('.js-delete-img').css('display', 'block')
    }
    this.QueryClone.find('.discard-post').unbind().bind('click', this, function(e) {
        e.data.QueryClone.hide();
        e.data.QueryClone.find('.query-title').val('');
        e.data.QueryClone.find('.query-description').val('');
        e.data.QueryClone.find('.queryPost').attr('data-postid', 0);
        $post.show()
    });
    $post.after(this.QueryClone);
    this.QueryClone.show()
};
Discussion.prototype.EditInfo = function(postId, postTitle, query) {
    var $post = $('#post-' + postId);
    $post.hide();
    this.InfoClone.find('.info-title').val(postTitle);
    this.InfoClone.find('.info-description').val(query);
    this.InfoClone.find('.post-info').attr('data-postid', postId);
    this.InfoClone.find("textarea").trigger('keydown');
    var $imagePreview = this.InfoClone.find('.image-preview');
    if (imageId > 0 && typeof imageUrl === 'string') {
        $imagePreview.attr('data-attachmentid', imageId);
        $imagePreview.html('<img src="' + imageUrl + '" />');
        this.InfoClone.find('.js-delete-img').css('display', 'block')
    }
    this.InfoClone.find('.discard-post').unbind().bind('click', this, function(e) {
        e.data.InfoClone.hide();
        e.data.InfoClone.find('.info-title').val('');
        e.data.InfoClone.find('.info-description').val('');
        e.data.InfoClone.find('.post-info').attr('data-postid', 0);
        $post.show()
    });
    $post.after(this.InfoClone);
    this.InfoClone.show()
};
Discussion.prototype.UploadImage = function(file, $createCard) {
    if (typeof file != 'undefined') {
        console.log(file);
        if (file.size > 8e+6) {
            alert("Image too large, image cannot be more than 8mb!");
            return
        }
        var validFileTypes = ['image/jpeg', 'image/png'];
        if (validFileTypes.indexOf(file.type) == -1) {
            alert('Sorry, unsupported image! Allowed image extensions are jpeg, jpg and png.');
            return
        }
        var formData = new FormData();
        formData.append("image", file);
        formData.append("mod", this.mod);
        formData.append("ack", "imgupload");
        return $.ajax({
            url: '/?route=common/ajax',
            type: 'POST',
            data: formData,
            enctype: "multipart/form-data",
            cache: !1,
            processData: !1,
            contentType: !1,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function(e) {
                        var percent = Math.round(e.loaded * 100 / e.total);
                        if (percent < 100) {
                            $createCard.find(".upload-progress").html('<div class="successMsg">Uploading ' + percent + '%</div>')
                        } else {
                            $createCard.find(".upload-progress").html('')
                        }
                    }, !1)
                }
                return myXhr
            }.bind(this),
            complete: function(event) {
                try {
                    var reply = event.responseJSON;
                    if (reply.result.state == 'multiLogindetected') {
                        User.getObj().PageRefresh()
                    } else if (reply.result.state == "ok") {
                        var url = reply.data.url;
                        var $imagePreview = $createCard.find('.image-preview');
                        $imagePreview.html('<img src="' + url + '" />');
                        $imagePreview.attr('data-attachmentid', reply.data.attachmentId);
                        $createCard.find('.js-delete-img').css('display', 'block')
                    } else if (reply.result.meta == "ERR_LOGIN_REQUIRED") {
                        $("body").trigger({
                            type: "_showLoginDialogEvt",
                            tabName: "logintab"
                        })
                    } else if (reply.result.meta == "ERR_IMG_SIZE") {
                        alert("Image too large, image cannot be more than 8mb!");
                        console.error(reply.result.meta)
                    } else if (reply.result.meta == "ERR_IMG_HEIGHT") {
                        alert("Image height cannot be more than double of width!");
                        console.error(reply.result.meta)
                    } else {
                        alert("Internal Error!");
                        console.error(reply.result.meta)
                    }
                } catch (e) {
                    alert("Internal Error!");
                    console.error(e)
                }
            }
        })
    }
};
Discussion.prototype.DisplayDate = function(dateString) {
    if (dateString == "Just Now") {
        return "Just Now"
    }
    var date = new Date(dateString);
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 0) {
        if (interval == 1) {
            return "1 year ago"
        }
        return interval + " years ago"
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
        if (interval == 1) {
            return "1 month ago"
        }
        return interval + " months ago"
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 0) {
        if (interval == 1) {
            return "1 day ago"
        }
        return interval + " days ago"
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 0) {
        if (interval == 1) {
            return "1 hour ago"
        }
        return interval + " hours"
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
        if (interval == 1) {
            return "1 min ago"
        }
        return interval + " mins ago"
    }
    if (seconds > 0) {
        return "Just Now"
    }
    return ""
};
Discussion.prototype.GetHtmlForEdit = function($dom) {
    var html = $dom.html();
    if (/<[a-z][\s\S]*>/i.test(html)) {
        return html
    }
    return $dom.text()
};
$(document).ready(function() {
    if ($("#thread").length > 0) {
        var discussion = Discussion.getObj()
    }
});
var _dailyQuizObj = null;
var QTimer = function() {
    this.seconds = 0;
    this.TimeCountCheck = !0;
    this.cancel = null;
    this.questionTimer = null
};

function DailyQuiz() {
    this.quizDetails = new Object();
    this.questionData = new Object();
    this.quizSession = new Object();
    this.reportdata = new Object();
    this.userreport = new Object();
    this.timedata = [];
    this.totaltime = [];
    this.takenTempTime = 0;
    this.tempdata = {
        useranswer: new Array(),
        questionanswer: new Array(),
        solution: new Array(),
        solutionHindi: new Array(),
        currentPointer: new Object(),
        modal: new Object(),
        body: new Object(),
    };
    this.timer = new QTimer();
    this.reportstate = null;
    this.click = !0;
    this.deliveryId = 0;
    this.itemType = 0;
    this.reviewData = null;
    this.descreviewData = null;
    this.quizid = null;
    this.quizlistDetails = {
        itemId: -1
    }
}
DailyQuiz.getObj = function() {
    if (_dailyQuizObj == null) {
        _dailyQuizObj = new DailyQuiz();
        _dailyQuizObj.Init()
    }
    return _dailyQuizObj
};
DailyQuiz.prototype.Init = function() {
    this.BindEvents();
    if ((window.location.href).indexOf('quizId') > -1) {
        var userObj = User.getObj();
        if (userObj.userId <= 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "registertab"
            });
            return
        }
        var quizId = (window.location.href).split('quizId=')[1].split('&')[0];
        var quizDom = $("[data-quizid='" + quizId + "']");
        quizDom.find('.startQuiz').text("Resume");
        this.ValidateAndProceed(quizId)
    }
};
DailyQuiz.prototype.ValidateAndProceed = function(quizId) {
    $.ajax({
        type: 'POST',
        url: "/?route=common/ajax",
        data: {
            mod: "tr2dailyquizlist",
            ack: "canuserattemptquiz",
            quizId: quizId,
            quizlistId: DailyQuiz.getObj().quizlistDetails.itemId,
            domainId: ((domainId == 0) ? -100 : domainId)
        },
        complete: function(reply) {
            var response = reply.responseJSON;
            if (response.result.state == 'multiLogindetected') {
                User.getObj().PageRefresh()
            } else if (response.result.state == "ok") {
                DailyQuiz.getObj().QuizMetaDataFetch(this.quizId)
            } else {
                alert(response.result.meta)
            }
        }.bind({
            quizId: quizId
        })
    })
};
DailyQuiz.prototype.BindEvents = function() {
    $(".quiz.startQuiz").unbind().bind("click", this, function(e) {
        e.data.deliveryId = $(this).attr("data-deliveryid");
        e.data.itemType = $(this).attr("data-itemtype");
        $('#faq-bot-button').css('display', 'none');
        var modalState = !1;
        $('#quizModal').find('.modal').each(function(key, value) {
            if ($(value).css('display') == 'block') {
                modalState = !0
            }
        });
        if (modalState) {
            return
        }
        var userObj = User.getObj();
        if (userObj.userId <= 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "registertab"
            });
            return
        }
        var quizid = $(this).attr("data-quizid");
        DailyQuiz.getObj().ValidateAndProceed(quizid);
        if ($(this).find(".startQuiz").text().indexOf("Start") != -1) {
            $(this).find(".startQuiz").removeClass("btn-primary");
            $(this).find(".startQuiz").text("Resume");
            $(this).find(".startQuiz").addClass("btn-default")
        }
    });
    $(".quizFooter").find('.shareQuiz').unbind().bind("click", this, function(e) {
        e.preventDefault();
        var userObj = User.getObj();
        if (userObj.userId <= 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "registertab"
            });
            return
        }
        e.data.ShowShareDialog($(e.currentTarget).closest('.quiz').attr('data-quizid'));
        e.stopPropagation()
    });
    $(".quiz.report").unbind().bind("click", this, function(e) {
        var modalState = !1;
        e.data.deliveryId = $(this).attr("data-deliveryid");
        e.data.itemType = $(this).attr("data-itemtype");
        $('#quizModal').find('.modal').each(function(key, value) {
            if ($(value).css('display') == 'block') {
                modalState = !0
            }
        });
        if (modalState) {
            return
        }
        var userObj = User.getObj();
        if (userObj.userId <= 0) {
            $("body").trigger({
                type: "_showLoginDialogEvt",
                tabName: "registertab"
            });
            return
        }
        var quizid = $(this).attr("data-quizid");
        e.data.QuizMetaDataFetch(quizid)
    });
    $(".quiz.buyQuiz").unbind().bind("click", this, function(e) {
        window.location = $(this).find("a.js-purchaseRequired").attr("href")
    });
    reviewCardBindEvents()
};
DailyQuiz.prototype.ShowShareDialog = function(quizId) {
    if ($('#report-share-modal').length == 0) {
        var shareHtml = '<div class="modal fade share_modal" id="report-share-modal" role="dialog">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal"><img src="https://' + systemSettings.cdn.bucket + '/images/close-discard@2x-023c540eda784.png"/></button>' + '<h4 class="modal-title">Share quiz report!</h4>' + '</div>' + '<div class="modal-body">' + '<div data-media="facebook" class="js-share"><img src="https://' + systemSettings.cdn.bucket + '/images/fb_02228a17014d5.png"/>Facebook</div>' + '<div data-media="twitter" class="js-share"><img src="https://' + systemSettings.cdn.bucket + '/images/twitter_02228a1e92bcc.png"/>Twitter</div>' + '<div data-media="whatsapp" class="js-share"><img src="https://' + systemSettings.cdn.bucket + '/images/whatsapp-0251d13f506d7.png" alt="Share Whatsapp" width="35"/>Whatsapp</div>' + '<div data-media="telegram" class="js-share"><img src="https://' + systemSettings.cdn.bucket + '/images/telegram-0251d14161d91.png" alt="Share Telegram" width="35"/>Telegram</div>' + '</div>' + '</div>' + '</div>' + '</div>';
        $('body').append(shareHtml)
    }
    $('#report-share-modal').modal('show');
    $(".js-share").unbind().bind("click", this, function(e) {
        $("#report-share-modal").modal('hide');
        var url = document.URL.split("?")[0];
        url += "?quizId=" + quizId;
        var media = $(this).data("media");
        e.data.SharePost(url, media)
    })
};
DailyQuiz.prototype.SharePost = function(url, media) {
    switch (media) {
        case "facebook":
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), 'facebook-popup', 'height=350,width=600').focus();
            break;
        case "twitter":
            window.open('https://twitter.com/share?url=' + encodeURIComponent(url), 'twitter-popup', 'height=350,width=600').focus();
            break;
        case "google-plus":
            window.open('https://plus.google.com/share?url=' + encodeURIComponent(url), 'gshare', 'height=350,width=600').focus();
            break;
        case "whatsapp":
            window.open('https://web.whatsapp.com/send?text=' + encodeURIComponent(url), 'whatsapp-share', 'height=350,width=600').focus();
            break;
        case "telegram":
            window.open('https://t.me/share/url?url=' + encodeURIComponent(url), 'telegram-popup', 'height=350,width=600').focus();
            break
    }
};
DailyQuiz.prototype.QuizMetaDataFetch = function(quizid) {
    if (!this.quizDetails.hasOwnProperty(quizid)) {
        $.ajax({
            type: 'POST',
            url: "/?route=common/ajax",
            data: {
                mod: "tr2dquiz",
                ack: "getquizdata",
                quizid: quizid,
            },
            complete: function(reply) {
                var response = reply.responseJSON;
                if (response.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (response.result.state == "ok") {
                    DailyQuiz.getObj().quizDetails[quizid] = new Object();
                    DailyQuiz.getObj().quizDetails[quizid] = response.data;
                    DailyQuiz.getObj().QuizSession(quizid)
                }
            }
        })
    } else {
        this.QuizSession(quizid)
    }
};
DailyQuiz.prototype.QuizSession = function(quizid) {
    $.ajax({
        type: 'POST',
        url: "/?route=common/ajax",
        data: {
            mod: "tr2dquiz",
            ack: "getQuizSession",
            quizid: quizid,
        },
        complete: function(reply) {
            var response = reply.responseJSON;
            if (response.result.state == 'multiLogindetected') {
                User.getObj().PageRefresh()
            } else if (response.result.state == "ok") {
                if (!DailyQuiz.getObj().quizSession.hasOwnProperty(quizid)) {
                    DailyQuiz.getObj().quizSession[quizid] = new Object()
                }
                DailyQuiz.getObj().quizSession[quizid] = response.data;
                DailyQuiz.getObj().QuizContainer(quizid)
            }
        }
    })
};
DailyQuiz.prototype.GetUserReview = function(quizid) {
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2review",
            ack: "getItemReviewInfofront",
            itemType: this.itemType,
            deliveryId: this.deliveryId,
            domain: ((domainId == 0) ? -100 : domainId)
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == 'ok') {
                    this.reviewData = {
                        reviewData: reply.data,
                        itemType: this.itemType,
                        deliveryId: this.deliveryId
                    };
                    DailyQuiz.getObj().GetUserDescReview(reply.data, quizid)
                } else if (reply.result.state == 'error') {
                    alert(reply.result.meta)
                }
            } catch (e) {
                alert(e)
            }
        }.bind(this),
        url: "/?route=common/ajax"
    })
};
DailyQuiz.prototype.GetUserDescReview = function(userdata, quizid) {
    var userdetails = {};
    if (typeof userdata[0][-1].userData != "undefined") {
        userdetails.rating = userdata[0][-1].userData.rating;
        userdetails.userId = userdata[0][-1].userData.userId;
        if (typeof userdata[1][-2].userData != "undefined") {
            userdetails.data = userdata[1][-2].userData.data
        }
    } else {
        userdetails = null
    }
    $.ajax({
        type: "POST",
        data: {
            mod: "tr2review",
            ack: "getcardsdescriptivereview",
            itemType: this.itemType,
            deliveryId: this.deliveryId,
            userdetails: userdetails,
        },
        complete: function(event) {
            var reply = event.responseJSON;
            try {
                if (reply.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (reply.result.state == 'ok') {
                    this.descreviewData = reply.data;
                    console.log(this.descreviewData);
                    DailyQuiz.getObj().QuizContainer(quizid)
                } else if (reply.result.state == 'error') {
                    alert(reply.result.meta)
                }
            } catch (e) {
                alert(e)
            }
        }.bind(this),
        url: "/?route=common/ajax"
    })
};
DailyQuiz.prototype.reviewCard = function(data, descdata, title) {
    if (typeof data == "undefined" || data == null) {
        return
    }
    var review_cardhtml = '';
    var alreadyaquired = '';
    var ratewithreview = '';
    var checklevel;
    if (typeof descdata.userdescreview != "undefined") {
        alreadyaquired = "alreadyaquired"
    }
    if (typeof descdata.userdescreview != "undefined" || typeof data.reviewData[0][-1] != "undefined") {
        ratewithreview = "ratewithreview"
    }
    if (typeof data != "undefined" && data != null) {
        review_cardhtml += '<div class="OverallRating ' + alreadyaquired + ' ' + ratewithreview + '"><div class="reviewcard container" data-itemType="' + data.itemType + '" data-deliveryId="' + data.deliveryId + '"' + 'data-aquire="' + data.reviewData[-1].aquire + '">' + '<div class="heading-rating">' + '<div class="rating_text">Rate Us:</div>';
        var usersreviewgiven = 0;
        for (dataIndex in data.reviewData[0]) {
            if (data.reviewData[0][dataIndex].aquire == 1) {
                review_cardhtml += '<div class="rating content" data-aquire="' + data.reviewData[0][dataIndex].aquire + '" data-type="0" data-reviewItemIndex="' + dataIndex + '" data-rating="' + (data.reviewData[0][dataIndex].userData ? data.reviewData[0][dataIndex].userData.rating : '') + '" >';
                if (typeof data.reviewData[0][dataIndex].userData != "undefined") {
                    usersreviewgiven = 1;
                    review_cardhtml += '<span class="' + ((data.reviewData[0][dataIndex].userData.rating == 5) ? 'active' : '') + '" data=\'5\'>☆</span>' + '<span class="' + ((data.reviewData[0][dataIndex].userData.rating == 4) ? 'active' : '') + '" data=\'4\'>☆</span>' + '<span class="' + ((data.reviewData[0][dataIndex].userData.rating == 3) ? 'active' : '') + '" data=\'3\'>☆</span>' + '<span class="' + ((data.reviewData[0][dataIndex].userData.rating == 2) ? 'active' : '') + '" data=\'2\'>☆</span>' + '<span class="' + ((data.reviewData[0][dataIndex].userData.rating == 1) ? 'active' : '') + '" data=\'1\'>☆</span>'
                } else {
                    review_cardhtml += '<span data="5" class="active">☆</span>' + '<span data="4">☆</span>' + '<span data="3">☆</span>' + '<span data="2">☆</span>' + '<span data="1">☆</span>'
                }
                review_cardhtml += '</div>'
            }
        }
        review_cardhtml += '</div>';
        review_cardhtml += '<div class="content-submit">';
        for (dataIndex in data.reviewData[1]) {
            if (data.reviewData[1][dataIndex].aquire == 1) {
                if (data.reviewData[1][dataIndex].userData) {
                    usersreviewgiven = 1
                }
                review_cardhtml += '<div class="reviewComments content" data-aquire="' + data.reviewData[1][dataIndex].aquire + '" data-type="1" data-reviewItemIndex="' + dataIndex + '" data-review="' + (data.reviewData[1][dataIndex].userData ? data.reviewData[1][dataIndex].userData.data : '') + '">' + '<textarea class="js-inputkeyboard" placeholder="' + data.reviewData[1][dataIndex].title + '" onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'' + data.reviewData[1][dataIndex].title + '\'">' + (data.reviewData[1][dataIndex].userData ? data.reviewData[1][dataIndex].userData.data : '') + '</textarea>' + '</div>'
            }
        }
        review_cardhtml += '<div class="reviewSubmitDiv text-right">' + '<button type="button" class="btn btn-primary btn-large" data-action="submit_review">';
        if (usersreviewgiven == 0) {
            review_cardhtml += 'SUBMIT'
        } else {
            review_cardhtml += 'UPDATE'
        }
        review_cardhtml += '</button> ';
        if (usersreviewgiven == 1) {
            review_cardhtml += '<button type="button" class="btn btn-primary btn-large" data-action="cancel_editreview">' + 'CANCEL' + '</button>'
        }
        review_cardhtml += '</div>' + '</div></div></div>'
    }
    var rating1 = data.reviewData[0][-1].actualRating;
    var removedecimal = rating1 | 0;
    var length = removedecimal * 36;
    length = length + (rating1 - removedecimal) * 36;
    if ((rating1 - removedecimal) > 0) {
        length = length + 2.5 * (removedecimal)
    } else {
        length = length + 2.5 * (removedecimal - 1)
    }
    if (length < 0) {
        length = 0
    }
    review_cardhtml += '<div class="descriptiveHolder ' + alreadyaquired + ' container">';
    var isusersreview = !1;
    if (typeof descdata.userdescreview != "undefined") {
        checklevel = 1;
        review_cardhtml += '<h3>MY REVIEW</h3>';
        var userdescreviewdata = {};
        userdescreviewdata[0] = descdata.userdescreview;
        isusersreview = !0;
        var descrhtml = this.populateDescrReview(userdescreviewdata, data, isusersreview);
        review_cardhtml += descrhtml
    }
    if (typeof data.reviewData[0][-1].totalstarcount != "undefined" && data.reviewData[0][-1].totalstarcount > 0) {
        review_cardhtml += '<h3>REVIEWS</h3>' + '<div class="row starratecount_card">' + '<div class="rating-part-left">' + '<p class="rateval">' + (Math.round((data.reviewData[0][-1].actualRating) * 10) / 10) + '</p>' + '<div class="tr-rev-rate reviewstastistics"  data-type="0" data-rating="' + rating1 + '" >' + '<div class="tr-rev-rate-tran">' + '<img src="https://' + systemSettings.cdn.bucket + '/svg/star-o.svg">' + '</div>' + '<div class="tr-rev-rate-fill"  style="width:' + length + 'px;">' + '</div>' + '<div class="revusercount"><span class="glyphicon glyphicon-user"></span><span class="ratingcount">' + data.reviewData[0][-1].totalstarcount + '</span><span class="totaltext">total</span></div>' + '</div>' + '</div>' + '<div class="progress-bar-section_div">';
        var count = 1,
            maxstarcount = 0;
        for (starcoutdata in data.reviewData[0][-1].starcount) {
            if (data.reviewData[0][-1].starcount[starcoutdata] > maxstarcount) {
                maxstarcount = data.reviewData[0][-1].starcount[starcoutdata]
            }
        }
        for (starcoutdata in data.reviewData[0][-1].starcount) {
            review_cardhtml += '<div class="progress-bar-section">' + '<span>' + (count) + '</span>' + '<div class="progress progress-bar-horizontal">' + '<div class="progress-bar color' + (count++) + '" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="    width: ' + (data.reviewData[0][-1].starcount[starcoutdata] / ((maxstarcount == 0) ? 1 : maxstarcount)) * 100 + '%;"></div>' + '</div>' + '<span>(' + data.reviewData[0][-1].starcount[starcoutdata] + ')</span>' + '</div>'
        }
        review_cardhtml += '</div>' + '</div>';
        if (data.reviewData[1][-2].show == 1) {
            if (descdata.data.length > 0) {
                isusersreview = !1;
                var descrhtml = this.populateDescrReview(descdata.data, data, isusersreview);
                review_cardhtml += descrhtml
            }
        }
    }
    review_cardhtml += '</div>';
    return review_cardhtml
};
DailyQuiz.prototype.populateDescrReview = function(descriptivedata, revdata, isusersreview) {
    var deschtml = "";
    curtime = $.now();
    for (data in descriptivedata) {
        if (!isusersreview && descriptivedata[data].userId == User.getObj().userId) {
            continue
        }
        deschtml += '<div class="descriptivereview" data-itemType= "' + revdata.itemType + '" data-deliveryId="' + revdata.deliveryId + '"' + 'data-rating="' + (typeof revdata.reviewData[0][-1].userData != 'undefined' ? revdata.reviewData[0][-1].userData.rating : '') + '">' + '<div class="userprofile">' + '<span class="descuserpic" style="background-image: url(/attachment/profile-thumbnail/' + descriptivedata[data].userId + '/' + curtime + ');"></span>' + '</div>' + '<div class="ratingreview">' + '<span class = "displayName">' + descriptivedata[data].displayName + '</span>' + '<span class="rating content" >';
        if (typeof descriptivedata[data].rating != "undefined") {
            deschtml += '<span class=" ' + ((descriptivedata[data].rating == 5) ? 'active' : '') + '" data="5">☆</span>' + '<span class=" ' + ((descriptivedata[data].rating == 4) ? 'active' : '') + '" data="4">☆</span>' + '<span class=" ' + ((descriptivedata[data].rating == 3) ? 'active' : '') + '" data="3">☆</span>' + '<span class=" ' + ((descriptivedata[data].rating == 2) ? 'active' : '') + '" data="2">☆</span>' + '<span class=" ' + ((descriptivedata[data].rating == 1) ? 'active' : '') + '" data="1">☆</span>'
        }
        deschtml += '</span>';
        if (typeof descriptivedata[data].data != "undefined") {
            deschtml += '<span class="desc-content">' + descriptivedata[data].data + '</span>'
        }
        deschtml += '</div>';
        if (descriptivedata[data].userId == User.getObj().userId) {
            deschtml += '<span class="glyphicon glyphicon-pencil" title="Edit Review" data-action="edit_myreview"></span>'
        }
        deschtml += '</div>'
    }
    return deschtml
};
DailyQuiz.prototype.QuizContainer = function(quizid) {
    var zopim = $("body").find(".zopim");
    $(zopim.eq(0)).hide();
    $(zopim.eq(2)).hide();
    if ($("body").find("#quizModal").length == 0) {
        var quizDiv = '<div id="quizModal">' + '</div>';
        $("#loginModalAppend").after(quizDiv)
    }
    this.tempdata.currentPointer[quizid] = 1;
    var languages = this.quizDetails[quizid].info.languages;
    languages = typeof languages != 'undefined' ? languages : [];
    if ($("body").find("#quizModal #lcq-" + quizid).length == 0) {
        var quizContainer = '<div id="lcq-' + this.quizDetails[quizid].id + '" class="modal fade" role="dialog">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<span>Ongoing Quiz</span>';
        if (languages.length > 1) {
            quizContainer += '<div class="quiz-toggle"><div class="tr-toggle-btn demo-rebrand-1">' + '<input id="lang_' + quizid + '" data-action="selectLang_' + quizid + '" type="checkbox">' + '<label for="lang_' + quizid + '">' + '<div class="can-toggle__switch" data-checked="Hindi" data-unchecked="English"></div>' + '</label>' + '</div> </div>'
        }
        quizContainer += '<button type="button" class="close" data-dismiss="modal">&times;</button>' + '</div>' + '<div class="modal-body quizSection container" data-quizid="' + this.quizDetails[quizid].id + '" style="display:none;">' + '<div class="description clearfix">' + '<div class="ques-Detail col-lg-5 col-md-5 col-sm-12 col-xs-12">' + '<div class="quizquestnno">' + this.tempdata.currentPointer[quizid] + '</div>' + '<div class="quiztitle">' + this.quizDetails[quizid].title + '</div>' + '<div class="ongoingQues">' + '<span class="quizquestnno">' + this.tempdata.currentPointer[quizid] + '</span>/<span class="marks"><span>' + this.quizDetails[quizid].info.totalQuestions + '</span></span>' + '</div>' + '</div>' + '<div class="marks col-lg-2 col-md-2 col-sm-4 col-xs-4"><span>' + this.quizDetails[quizid].info.totalQuestions + '</span>&nbsp Questions</div>' + '<div class="marks col-lg-2 col-md-2 col-sm-4 col-xs-4"><span>' + this.quizDetails[quizid].info.totalmarks + '</span>&nbsp Marks</div>' + '<div class="timer col-lg-3 col-md-3 col-sm-4 col-xs-4">' + '<span class="timerHead">Time Left:&nbsp;</span>' + '<span class="questionTimer">0</span>' + '</div>' + '</div>' + '<div class="progress-div"><span class="time-progress"></span></div>' + '<div id="dailyquizCarousel-' + this.quizDetails[quizid].id + '" class="carousel slide" data-ride="carousel" data-interval="false">' + '<div class="carousel-inner" data-quiz="' + this.quizDetails[quizid].id + '">' + '</div>' + '</div>' + '</div>' + '<div class="modal-footer"><div class="questionNavigation"></div><div class="question-pallete container"></div>' + '</div>' + '</div>' + '</div>' + '</div>';
        $(quizContainer).appendTo("#quizModal");
        this.tempdata.modal[quizid] = $("#quizModal #lcq-" + quizid);
        this.tempdata.body[quizid] = $("#dailyquizCarousel-" + this.quizDetails[quizid].id)
    }
    this.QuestionFetch(quizid)
};
DailyQuiz.prototype.QuestionFetch = function(quizid) {
    if (this.quizSession[quizid].state != "2") {
        $.ajax({
            type: 'POST',
            url: "/?route=common/ajax",
            data: {
                mod: "tr2dquiz",
                ack: "fetchQuestion",
                quizid: quizid,
            },
            complete: function(reply) {
                var response = reply.responseJSON;
                if (response.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (response.result.state == "ok") {
                    if (!DailyQuiz.getObj().questionData.hasOwnProperty(quizid)) DailyQuiz.getObj().questionData[quizid] = new Object();
                    DailyQuiz.getObj().questionData[quizid].data = response.data.questionData;
                    DailyQuiz.getObj().PopulateQuestionData(quizid)
                }
            }
        })
    } else {
        $.ajax({
            type: 'POST',
            url: "/?route=common/ajax",
            data: {
                mod: "tr2dquiz",
                ack: "getReportData",
                quizid: quizid,
            },
            complete: function(reply) {
                var response = reply.responseJSON;
                if (response.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (response.result.state == "ok") {
                    if (!DailyQuiz.getObj().questionData.hasOwnProperty(quizid)) DailyQuiz.getObj().questionData[quizid] = new Object();
                    DailyQuiz.getObj().questionData[quizid].data = response.data.questionData;
                    if (!DailyQuiz.getObj().reportdata.hasOwnProperty(quizid)) DailyQuiz.getObj().reportdata[quizid] = new Object();
                    DailyQuiz.getObj().reportdata[quizid] = response.data.resultData;
                    if (!DailyQuiz.getObj().userreport.hasOwnProperty(quizid)) DailyQuiz.getObj().userreport[quizid] = new Object();
                    DailyQuiz.getObj().userreport[quizid] = response.data.reportAnswer;
                    DailyQuiz.getObj().PopulateQuestionData(quizid)
                }
            }
        })
    }
};
DailyQuiz.prototype.PopulateQuestionData = function(quizid) {
    $(this.tempdata.body[quizid]).find(".item").each(function() {
        $(this).remove()
    });
    var qno = 0;
    var html = "<div class='question-status-info'>" + "<p class='head'>All Questions: </p>" + "<p class='correct-status'>Correct</p>" + "<p class='incorrect-status'>Incorrect</p>" + "<p class='unattempted-status'>Unattempted</p>" + "</div>" + "<div class='question-status'>" + "<div class='questionsholder'>" + '<span class="glyphicon glyphicon-menu-left question-numberbtnleft"></span>' + "<div class='questionsslider'>";
    for (var i in this.questionData[quizid].data) {
        if (this.questionData[quizid].data[i].subtypeId == "0") {
            qno++;
            var state = "notvisited";
            if (typeof this.questionData[quizid].data[i].correct != 'undefined') {
                if (this.questionData[quizid].data[i].correct == '1') {
                    state = "correct"
                } else if (this.questionData[quizid].data[i].correct == '0') {
                    state = "incorrect"
                } else if (this.questionData[quizid].data[i].correct == '-1') {
                    state = "unattempted"
                }
            }
            html += "<p class='question-number " + state + "' data-state='" + state + "' data-quesno='" + qno + "'>" + qno + "</p>";
            quesHtml = this.ShowQuestion({
                "quizId:": quizid,
                "questData": this.questionData[quizid].data[i],
                "qno": qno,
                "qId": i
            });
            $(quesHtml).appendTo('.carousel-inner[data-quiz="' + this.quizDetails[quizid].id + '"]')
        } else {
            for (var j in this.questionData[quizid].data[i].question.subQuestion) {
                qno++;
                var state = "notvisited";
                if (typeof this.questionData[quizid].data[i].question.subQuestion[j].correct != 'undefined') {
                    if (this.questionData[quizid].data[i].question.subQuestion[j].correct == '1') {
                        state = "correct"
                    } else if (this.questionData[quizid].data[i].question.subQuestion[j].correct == '0') {
                        state = "incorrect"
                    } else if (this.questionData[quizid].data[i].question.subQuestion[j].correct == '-1') {
                        state = "unattempted"
                    }
                }
                html += "<p class='question-number " + state + "' data-state='" + state + "' data-quesno='" + qno + "'>" + qno + "</p>";
                quesHtml = this.ShowQuestion({
                    "quizId:": quizid,
                    "questData": this.questionData[quizid].data[i],
                    "qno": qno,
                    "qId": i,
                    "subqno": j
                });
                $(quesHtml).appendTo('.carousel-inner[data-quiz="' + this.quizDetails[quizid].id + '"]')
            }
        }
    }
    html += "</div>" + '<span class="glyphicon glyphicon-menu-right question-numberbtnright"></span>' + "</div>";
    html += "<button class='submit btn btn-primary'>Submit Quiz</button>" + "<button class='rfinish btn btn-primary' style='display:none;'>Quiz Score</button>";
    $(this.tempdata.modal[quizid]).find(".modal-footer").find('.question-pallete').html(html);
    if (this.quizSession[quizid].lastQuestion == undefined) this.tempdata.currentPointer[quizid] = 1;
    else
        this.tempdata.currentPointer[quizid] = ((parseInt(this.quizSession[quizid].lastQuestion) % parseInt(qno)) + 1);
    if (this.quizSession[quizid].state != "2") {
        $(this.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + this.tempdata.currentPointer[quizid] + ']').removeClass('notvisited correct incorrect unattempted').addClass('current')
    }
    $(this.tempdata.modal[quizid]).find(".quizquestnno").text(this.tempdata.currentPointer[quizid]);
    $(this.tempdata.modal[quizid]).find(".marks span").text(qno);
    this.quizDetails[quizid].info.totalQuestions = qno;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    $(".item").find("img").addClass("img-responsive");
    this.AttemptControls(quizid)
};
DailyQuiz.prototype.ShowQuestion = function(data) {
    var quizid = data.quizId;
    var quesData = data.questData;
    var qno = data.qno;
    var qId = data.qId;
    var qdata = "";
    var subqno = data.subqno;
    var selectEngLang = (typeof quesData.questionHindi != 'undefined') ? 'langauge="english"' : "";
    var selectHindiLang = (typeof quesData.question != 'undefined') ? 'langauge="hindi"' : "";
    if (typeof subqno == 'undefined') {
        qdata = qdata + '<div class="item container quizQuestDiv" data-quesno="' + qno + '" data-quesid="' + qId + '">';
        if (typeof quesData.question != 'undefined') {
            var qquestion = quesData.question.question;
            qquestion = qquestion.replace(/<br>/g, "").replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
            qdata = qdata + '<div class="selectQuesLang" ' + selectEngLang + '><div class="dquizquestion">' + qquestion + '</div>';
            for (var j in quesData.question.answers) {
                var str = "" + quesData.question.answers[j].text;
                str = str.replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
                qdata = qdata + '<label class="quizlabel">' + '<input type="radio" class="radioButton" name="' + quizid + '+' + qId + '"value="' + j + '"/>' + '<div class="labelDiv container">' + '<div class="indexpadding">' + String.fromCharCode(65 + parseInt(j)) + '</div>' + '<div class="option_msg">' + '<div class="radioText">' + str + '</div>' + '<div class="indicator"></div>' + '</div>' + '</div>' + '</label>'
            }
            qdata = qdata + '<div class="col-xs-12 solutionTab">' + '</div></div>'
        }
        if (typeof quesData.questionHindi != 'undefined') {
            var qquestion = quesData.questionHindi.question;
            qquestion = qquestion.replace(/<br>/g, "").replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
            qdata = qdata + '<div class="selectQuesLang" ' + selectHindiLang + '><div class="dquizquestion">' + qquestion + '</div>';
            for (var j in quesData.questionHindi.answers) {
                var str = "" + quesData.questionHindi.answers[j].text;
                str = str.replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
                qdata = qdata + '<label class="quizlabel">' + '<input type="radio" class="radioButton" name="' + quizid + '+' + qId + '"value="' + j + '"/>' + '<div class="labelDiv container">' + '<div class="indexpadding">' + String.fromCharCode(65 + parseInt(j)) + '</div>' + '<div class="option_msg">' + '<div class="radioText">' + str + '</div>' + '<div class="indicator"></div>' + '</div>' + '</div>' + '</label>'
            }
            qdata = qdata + '<div class="col-xs-12 solutionTabHindi">' + '</div></div>'
        }
    } else {
        qdata = qdata + '<div class="item container quizQuestDiv" data-quesno="' + qno + '" data-quesid="' + qId + '" data-subquesno="' + subqno + '">';
        if (typeof quesData.question != 'undefined') {
            var qcommonText = quesData.question.commonText;
            qcommonText = qcommonText.replace(/<br>/g, "").replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
            var sqquestion = quesData.question.subQuestion[subqno].question;
            sqquestion = sqquestion.replace(/<br>/g, "").replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
            qdata = qdata + '<div class="selectQuesLang" ' + selectEngLang + '><div class="dquizquestion">' + qcommonText + '</div>' + '<div class="dquizquestion">' + sqquestion + '</div>' + '<div class="dsubquesquestion" data-subquesno="' + subqno + '"</div>';
            for (var k in quesData.question.subQuestion[subqno].answers) {
                var str = "" + quesData.question.subQuestion[subqno].answers[k].text;
                str = str.replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
                qdata = qdata + '<label class="quizlabel">' + '<input type="radio" name="' + quizid + '+' + qId + '+' + subqno + '"  value="' + k + '"/>' + '<div class="labelDiv container">' + '<div class="indexpadding">' + String.fromCharCode(65 + parseInt(k)) + '</div>' + '<div class="option_msg">' + '<div class="radioText">' + str + '</div>' + '<div class="indicator"></div>' + '</div>' + '</div>' + '</label>'
            }
            qdata = qdata + '<div class="col-xs-12 solutionTab">' + '</div></div></div>'
        }
        if (typeof quesData.questionHindi != 'undefined') {
            var qcommonText = quesData.questionHindi.commonText;
            qcommonText = qcommonText.replace(/<br>/g, "").replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
            var sqquestion = quesData.questionHindi.subQuestion[subqno].question;
            sqquestion = sqquestion.replace(/<br>/g, "").replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
            qdata = qdata + '<div class="selectQuesLang" ' + selectHindiLang + '><div class="dquizquestion">' + qcommonText + '</div>' + '<div class="dquizquestion">' + sqquestion + '</div>' + '<div class="dsubquesquestion" data-subquesno="' + subqno + '"</div>';
            for (var k in quesData.questionHindi.subQuestion[subqno].answers) {
                var str = "" + quesData.questionHindi.subQuestion[subqno].answers[k].text;
                str = str.replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
                qdata = qdata + '<label class="quizlabel">' + '<input type="radio" name="' + quizid + '+' + qId + '+' + subqno + '"  value="' + k + '"/>' + '<div class="labelDiv container">' + '<div class="indexpadding">' + String.fromCharCode(65 + parseInt(k)) + '</div>' + '<div class="option_msg">' + '<div class="radioText">' + str + '</div>' + '<div class="indicator"></div>' + '</div>' + '</div>' + '</label>'
            }
            qdata = qdata + '<div class="col-xs-12 solutionTabHindi">' + '</div></div></div>'
        }
    }
    qdata = qdata + "</div>";
    return qdata
};
DailyQuiz.prototype.AttemptControls = function(quizid) {
    $(this.tempdata.modal[quizid]).find(".modal-footer").find(".questionNavigation").empty();
    if (this.quizSession[quizid].state != "2") {
        $("#quizModal #lcq-" + quizid).find('.progress-div').hide();
        var qdata = '<div>' + '<button class="checkSolution btn btn-primary-alt" style="display:none;">Solution</button>';
        if ((typeof this.quizSession[quizid].lastQuestion != 'undefined' && this.quizSession[quizid].lastQuestion == parseInt(this.quizDetails[quizid].info.totalQuestions) - 1) || (this.quizDetails[quizid].info.totalQuestions == 1)) {
            qdata += '<button class="nextQuestion btn btn-primary-alt" style="display:none;">Next</button>' + '<button class="submit btn btn-primary">Submit Quiz</button>' + '</div>'
        } else {
            qdata += '<button class="nextQuestion btn btn-primary-alt">Next</button>' + '<button class="submit btn btn-primary" style="display:none;">Submit Quiz</button>' + '</div>'
        }
        $(qdata).appendTo($(this.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation'));
        this.BindQuizEvents(quizid)
    } else {
        $("#quizModal #lcq-" + quizid).find('.progress-div').hide();
        $("#lcq-" + this.quizDetails[quizid].id).find("description").hide();
        $(this.tempdata.modal[quizid]).find(".modal-footer").find(".questionNavigation").hide();
        var qdata = '<div>' + '<button class="rprev btn btn-primary-alt" style="display:none;">Previous</button>' + '<button class="rnext btn btn-primary-alt">Next</button>' + '<button class="rfinish btn btn-primary-alt" style="display:none;">Finish</button>' + '</div>';
        $(qdata).appendTo($(this.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation'));
        this.ResultState(quizid)
    }
};
DailyQuiz.prototype.BindQuizEvents = function(quizid) {
    var quizObj = this;
    var flag = !1;
    var submit = null;
    if ($(this.tempdata.modal[quizid]).find(".modal-footer").find('.question-pallete').find(".questionsholder").length > 0) {
        setTimeout(function() {
            slider("questionsholder", "questionsslider", "question-number")
        }, 200)
    }
    $(this.tempdata.modal[quizid]).find(".quizSection").show();
    var start = $(this.tempdata.modal[quizid]).find(this.tempdata.body[quizid]).find(".item");
    $(start[this.tempdata.currentPointer[quizid] - 1]).addClass("active");
    $(this.tempdata.modal[quizid]).find(".quizlabel").unbind().bind("change", this, function(e) {
        var current = $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item.active");
        var parent = $(e.data.tempdata.modal[quizid]);
        var time = e.data.timer.seconds;
        e.data.takenTempTime = time;
        e.data.timer.seconds = 0;
        clearInterval(e.data.timer.cancel);
        clearInterval(e.data.timer.questionTimer);
        $(current).find(".quizlabel").unbind('change');
        $(current).find(".quizlabel").addClass("no_hover");
        var quesid = $(current).attr("data-quesid");
        var option = $(current).find("input[type=radio]:checked").val();
        var quesno = $(current).attr("data-quesno");
        var name = $(current).find("input[type=radio]:checked").attr('name');
        name = name.split("+");
        if (typeof name[2] !== 'undefined') {
            var subquesno = name[2]
        } else {
            var subquesno = -1
        }
        submit = (e.data.tempdata.currentPointer[quizid] == e.data.quizDetails[quizid].info.totalQuestions) ? 1 : 0;
        flag = !0;
        var session = DailyQuiz.getObj().quizSession[quizid].id;
        var quizListItemId = DailyQuiz.getObj().quizlistDetails.itemId;
        var requestParams = {
            questionId: quesid,
            userAns: option,
            quesno: quesno,
            subquesno: subquesno,
            submit: submit,
            flag: flag,
            sessionId: session,
            timeTaken: time,
            quizId: quizid,
            quizListItemId: quizListItemId,
        };
        e.data.SubmitQuestion(requestParams, function(response) {
            try {
                if (response.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (response.result.state == "ok") {
                    if (response.data.correct == 1) {
                        $(current).find("input[value='" + response.data.answer + "'] ~ .labelDiv").addClass("correct");
                        $(current).find(".labelDiv.correct").find(".indicator").addClass("glyphicon glyphicon-ok");
                        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + quesno + ']').removeClass('notvisited current incorrect unattempted').addClass('correct')
                    } else {
                        $(current).find("input[value='" + option + "'] ~ .labelDiv").addClass("wrong");
                        $(current).find("input[value='" + response.data.answer + "'] ~ .labelDiv").addClass("correct");
                        $(current).find(".correct").find(".indicator").addClass("glyphicon glyphicon-ok");
                        $(current).find(".wrong").find(".indicator").addClass("glyphicon glyphicon-remove");
                        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + quesno + ']').removeClass('notvisited correct current unattempted').addClass('incorrect')
                    }
                    if (!submit) {
                        $(parent).find(".nextQuestion").css('display', 'inline')
                    } else {
                        $(parent).find(".nextQuestion").hide();
                        $(parent).find('.submit').show()
                    }
                    var str = response.data.solution;
                    if (typeof str == "object") str = str[0];
                    str = "" + str;
                    str = str.replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
                    $(current).find(".solutionTab").hide();
                    if (str != "") {
                        $(parent).find(".checkSolution").show();
                        $(current).find(".solutionTab").html("<hr><h3 style='color:#1A94BA;'>Solution:<h3>" + str + "<hr>");
                        $(current).find(".solutionTab img").addClass("img-responsive");
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
                    }
                    if (typeof response.data.solutionHindi != 'undefined') {
                        var strHindi = response.data.solutionHindi;
                        if (typeof strHindi == "object") strHindi = strHindi[0];
                        strHindi = "" + strHindi;
                        strHindi = strHindi.replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
                        $(current).find(".solutionTabHindi").hide();
                        if (strHindi != "") {
                            $(parent).find(".checkSolution").show();
                            $(current).find(".solutionTabHindi").html("<hr><h3 style='color:#1A94BA;'>Solution:<h3>" + strHindi + "<hr>");
                            $(current).find(".solutionTabHindi img").addClass("img-responsive");
                            MathJax.Hub.Queue(["Typeset", MathJax.Hub])
                        }
                    }
                }
            } catch (e) {
                console.log("Exception: " + e)
            }
        })
    });
    $(this.tempdata.modal[quizid]).find(".nextQuestion").unbind().bind("click", this, function(e) {
        e.data.takenTempTime = undefined;
        if (e.data.click == !0) {
            e.data.ClickGuard()
        } else {
            return
        }
        var current = $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item.active");
        var parent = $(e.data.tempdata.modal[quizid]);
        var option = $(current).find("input[type=radio]:checked").val();
        if (option == undefined) {
            option = -1;
            var time = e.data.timer.seconds;
            e.data.timer.seconds = 0;
            clearInterval(e.data.timer.cancel);
            clearInterval(e.data.timer.questionTimer);
            $(current).find("label").unbind('click');
            $(current).find("label").addClass("no_hover");
            var quesid = $(current).attr("data-quesid");
            var quesno = $(current).attr("data-quesno");
            var name = $($(current).find("input[type=radio]")[0]).attr('name');
            name = name.split("+");
            if (typeof name[2] !== 'undefined') {
                var subquesno = name[2]
            } else {
                var subquesno = -1
            }
            submit = (e.data.tempdata.currentPointer[quizid] == e.data.quizDetails[quizid].info.totalQuestions) ? 1 : 0;
            flag = !0;
            var session = DailyQuiz.getObj().quizSession[quizid].id;
            var quizListItemId = DailyQuiz.getObj().quizlistDetails.itemId;
            var requestParams = {
                questionId: quesid,
                userAns: option,
                quesno: quesno,
                subquesno: subquesno,
                submit: submit,
                flag: flag,
                sessionId: session,
                timeTaken: time,
                quizId: quizid,
                quizListItemId: quizListItemId,
            };
            e.data.SubmitQuestion(requestParams, function(response) {
                try {
                    if (response.result.state == 'multiLogindetected') {
                        User.getObj().PageRefresh()
                    } else if (response.result.state == "ok") {
                        if ($(this.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + this.data.tempdata.currentPointer[quizid] + ']').hasClass('current')) {
                            $(this.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + this.data.tempdata.currentPointer[quizid] + ']').removeClass('notvisited correct incorrect current').addClass('unattempted')
                        }
                        this.data.tempdata.currentPointer[quizid]++;
                        $(this.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + this.data.tempdata.currentPointer[quizid] + ']').removeClass('notvisited correct incorrect unattempted').addClass('current');
                        if (this.data.tempdata.currentPointer[quizid] == this.data.quizDetails[quizid].info.totalQuestions) {
                            $(this.data.tempdata.modal[quizid]).find(".nextQuestion").hide();
                            $(this.data.tempdata.modal[quizid]).find(".submit").show()
                        }
                        this.data.ModalBodyCalc(quizid, !1);
                        $(this.event).siblings('.checkSolution').hide();
                        $(this.data.tempdata.body[quizid]).carousel("next");
                        $(this.data.tempdata.body[quizid]).carousel("pause");
                        $(this.data.tempdata.modal[quizid]).find(".quizquestnno").text(this.data.tempdata.currentPointer[quizid]);
                        this.data.TimeMgmt(quizid)
                    }
                } catch (ex) {
                    console.log("Exception: " + ex)
                }
            }.bind({
                data: e.data,
                event: this
            }))
        } else {
            e.data.tempdata.currentPointer[quizid]++;
            $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + e.data.tempdata.currentPointer[quizid] + ']').removeClass('notvisited correct incorrect unattempted').addClass('current');
            if (e.data.tempdata.currentPointer[quizid] == e.data.quizDetails[quizid].info.totalQuestions) {
                $(this).hide();
                $(e.data.tempdata.modal[quizid]).find(".submit").show()
            }
            e.data.ModalBodyCalc(quizid, !1);
            $(this).siblings('.checkSolution').hide();
            $(e.data.tempdata.body[quizid]).carousel("next");
            $(e.data.tempdata.body[quizid]).carousel("pause");
            $(e.data.tempdata.modal[quizid]).find(".quizquestnno").text(e.data.tempdata.currentPointer[quizid]);
            e.data.TimeMgmt(quizid)
        }
    });
    $(this.tempdata.modal[quizid]).find('.checkSolution').unbind().bind("click", this, function(e) {
        var current = $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item.active");
        $(current).find(".solutionTab").show();
        var dist = $(current).find(".solutionTab").position(0).top;
        var distHindi = null;
        if ($(current).find(".solutionTabHindi").length > 0) {
            $(current).find(".solutionTabHindi").show();
            distHindi = $(current).find(".solutionTabHindi").position(0).top
        }
        var sdiff = $(current).scrollTop();
        if ($('[data-action="selectLang_' + quizid + '"]').prop('checked')) {
            $(e.data.tempdata.modal[quizid]).find('.modal-body').animate({
                scrollTop: (distHindi + sdiff)
            }, 1000)
        } else {
            $(e.data.tempdata.modal[quizid]).find('.modal-body').animate({
                scrollTop: (dist + sdiff)
            }, 1000)
        }
        $(this).hide()
    });
    $(this.tempdata.modal[quizid]).find(".submit").unbind().bind("click", this, function(e) {
        var current = $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item.active");
        var parent = $(e.data.tempdata.modal[quizid]);
        var option = $(current).find("input[type=radio]:checked").val();
        if (option == undefined) {
            option = -1
        }
        var time = e.data.takenTempTime;
        if (typeof time == 'undefined' || e.data.timer.seconds > time) {
            time = e.data.timer.seconds
        }
        e.data.timer.seconds = 0;
        clearInterval(e.data.timer.cancel);
        clearInterval(e.data.timer.questionTimer);
        $(current).find("label").unbind('click');
        $(current).find("label").addClass("no_hover");
        var quesid = $(current).attr("data-quesid");
        var quesno = $(current).attr("data-quesno");
        var name = $($(current).find("input[type=radio]")[0]).attr('name');
        name = name.split("+");
        if (typeof name[2] !== 'undefined') {
            var subquesno = name[2]
        } else {
            var subquesno = -1
        }
        submit = 1;
        flag = !0;
        var session = DailyQuiz.getObj().quizSession[quizid].id;
        var quizListItemId = DailyQuiz.getObj().quizlistDetails.itemId;
        var requestParams = {
            questionId: quesid,
            userAns: option,
            quesno: quesno,
            subquesno: subquesno,
            submit: submit,
            sessionId: session,
            timeTaken: time,
            lastQues: $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item").length,
            quizId: quizid,
            quizListItemId: quizListItemId,
        };
        e.data.SubmitQuestion(requestParams, function(response) {
            try {
                if (response.result.state == 'multiLogindetected') {
                    User.getObj().PageRefresh()
                } else if (response.result.state == "ok") {
                    this.data.QuizSession(quizid);
                    $('.quiz[data-quizid="' + quizid + '"]').find('.startQuiz').hide();
                    $('.quiz[data-quizid="' + quizid + '"]').find('.report').show();
                    $('.quiz[data-quizid="' + quizid + '"]').find('.shareQuiz').show();
                    $('.quiz[data-quizid="' + quizid + '"]').find(".dquizDescription").hide();
                    clearInterval(this.data.timer.cancel);
                    clearInterval(this.data.timer.questionTimer)
                }
            } catch (ex) {
                console.log("Exception: " + ex)
            }
        }.bind({
            data: e.data,
            event: this
        }))
    });
    $(this.tempdata.modal[quizid]).find(".close").unbind().bind("click", this, function(e) {
        if (e.data.click == !0) {
            e.data.ClickGuard()
        } else {
            return
        }
        var x = confirm("Do you want to exit ?");
        if (x == !1) return !1;
        var zopim = $("body").find(".zopim");
        $(zopim.eq(0)).show();
        $(zopim.eq(2)).show();
        $(e.data.tempdata.body[quizid]).find(".item").each(function() {
            $(this).remove()
        });
        if (flag == !0) {
            if (submit) {
                $('.quiz[data-quizid="' + quizid + '"]').find('.startQuiz').hide();
                $('.quiz[data-quizid="' + quizid + '"]').find('.report').show();
                $('.quiz[data-quizid="' + quizid + '"]').find('.shareQuiz').show();
                $('.quiz[data-quizid="' + quizid + '"]').find(".dquizDescription").hide()
            } else {
                $(e.data.tempdata.modal[quizid]).find(".quizquestnno").text(e.data.tempdata.currentPointer[quizid]);
                flag = !1
            }
        }
        e.data.timer.seconds = 0;
        clearInterval(e.data.timer.cancel);
        clearInterval(e.data.timer.questionTimer);
        $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item.active").removeClass("active");
        $('#faq-bot-button').css('display', 'block')
    });
    $('#lcq-' + quizid).modal('show');
    $('#lcq-' + quizid).on('shown.bs.modal', this, function(e) {
        if (e.data.quizSession[quizid].state != "2") e.data.TimeMgmt(quizid);
        e.data.ModalBodyCalc(quizid, !1);
        history.pushState(null, null, null)
    });
    $(window).on('popstate', this, function(e) {
        $('#lcq-' + quizid).modal('hide');
        if (flag == !0) {
            if (submit) {
                $('.quiz[data-quizid="' + quizid + '"]').find('.startQuiz').hide();
                $('.quiz[data-quizid="' + quizid + '"]').find('.report').show();
                $('.quiz[data-quizid="' + quizid + '"]').find('.shareQuiz').show();
                $('.quiz[data-quizid="' + quizid + '"]').find(".dquizDescription").hide()
            } else {
                $(e.data.tempdata.modal[quizid]).find(".quizquestnno").text(e.data.tempdata.currentPointer[quizid]);
                flag = !1
            }
        }
        e.data.timer.seconds = 0;
        clearInterval(e.data.timer.cancel);
        clearInterval(e.data.timer.questionTimer);
        $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item.active").removeClass("active")
    });
    $(window).on("resize", this, function(e) {
        clearTimeout(e.data.intervalset);
        e.data.intervalset = setTimeout(e.data.ModalBodyCalc(quizid, !1), 500)
    });
    $('#lcq-' + quizid).on('hidden.bs.modal', this, function(e) {
        if ((window.location.href).indexOf('quizId') > -1) {
            window.location.href = (window.location.href).split('?')[0]
        }
    });
    $('[data-action="selectLang_' + quizid + '"]').prop('checked', !1);
    $('[data-action="selectLang_' + quizid + '"]').unbind().bind('click', function(e) {
        if (!$(e.currentTarget).prop('checked')) {
            $('#dailyquizCarousel-' + quizid).find('[langauge="english"]').css('display', 'block');
            $('#dailyquizCarousel-' + quizid).find('[langauge="hindi"]').css('display', 'none')
        } else {
            console.log($('#dailyquizCarousel-' + quizid).find('[langauge="hindi"]'));
            $('#dailyquizCarousel-' + quizid).find('[langauge="hindi"]').css('display', 'block');
            $('#dailyquizCarousel-' + quizid).find('[langauge="english"]').css('display', 'none')
        }
    })
};
DailyQuiz.prototype.SubmitQuestion = function(requestParams, callback) {
    requestParams.mod = "tr2dquiz";
    requestParams.ack = "checkAnswer";
    $.ajax({
        type: 'POST',
        url: "/?route=common/ajax",
        data: requestParams,
        complete: function(reply) {
            try {
                var response = reply.responseJSON;
                callback(response)
            } catch (e) {
                console.log("error=" + e)
            }
        }
    })
};
DailyQuiz.prototype.ResultState = function(quizid) {
    var correct = 0;
    var total = 0;
    var unattempted = 0;
    var reportdatasession = this.reportdata[quizid];
    var userdatasession = this.userreport[quizid];
    for (var i in this.reportdata[quizid]) {
        for (var j in this.reportdata[quizid][i].answer) {
            this.tempdata.questionanswer[total] = reportdatasession[i].answer[j].indexOf(!0);
            this.tempdata.useranswer[total] = -1;
            userdatasession[i][j].answer = JSON.parse(userdatasession[i][j].answer);
            if (Array.isArray(userdatasession[i][j].answer)) {
                this.tempdata.useranswer[total] = userdatasession[i][j].answer.indexOf(!0)
            }
            if (this.tempdata.useranswer[total] == -1) {
                unattempted++
            } else if (this.tempdata.questionanswer[total] == this.tempdata.useranswer[total]) correct++;
            total++
        }
    }
    var accuracy = 0;
    if (total - unattempted > 0) {
        accuracy = Math.round(Math.round((parseFloat((correct / (total - unattempted)) * 100)) * 100) / 100)
    }
    var container = $('.quiz[data-quizid="' + quizid + '"]').find(".dquizStates");
    $(container).empty();
    var radius = 10;
    var correctPercent = (correct * 100) / total;
    var correctFill = parseFloat((2 * 22 * radius * correctPercent) / (7 * 100));
    var incorrectPercent = ((total - correct - unattempted) * 100) / total;
    var incorrectFill = parseFloat((2 * 22 * radius * incorrectPercent) / (7 * 100));
    var rdata = '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' + '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 descriptionBlock svg">' + '<span class="report-text">Correct</span>' + '<div class="svgholder">' + '<svg style="position: absolute;top: 0%;left: 0%;" viewBox="0 0 36 36">' + '<path d="M18 8 a 10 10 0 0 1 0 20 a 10 10 0 0 1 0 -20" fill="none" stroke="#E4E4E4" stroke-width="2" stroke-dasharray="100, 100"/>' + '</svg>' + '<svg class="progress-loader" style="position: absolute;top: 0%;left: 0%;" viewBox="0 0 36 36">' + '<path d="M18 8 a 10 10 0 0 1 0 20 a 10 10 0 0 1 0 -20" fill="none" stroke="#30B8E2" stroke-width="2" stroke-dasharray="' + correctFill + ', 100"/>' + '</svg>' + '</div>' + '<span class="label">' + correct + '/' + total + '</span>' + '</div>' + '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 descriptionBlock svg">' + '<span class="report-text">Incorrect</span>' + '<div class="svgholder">' + '<svg style="position: absolute;top: 0%;left: 0%;" viewBox="0 0 36 36">' + '<path d="M18 8 a 10 10 0 0 1 0 20 a 10 10 0 0 1 0 -20" fill="none" stroke="#E4E4E4" stroke-width="2" stroke-dasharray="100, 100"/>' + '</svg>' + '<svg class="progress-loader" style="position: absolute;top: 0%;left: 0%;" viewBox="0 0 36 36">' + '<path d="M18 8 a 10 10 0 0 1 0 20 a 10 10 0 0 1 0 -20" fill="none" stroke="#30B8E2" stroke-width="2" stroke-dasharray="' + incorrectFill + ', 100"/>' + '</svg>' + '</div>' + '<span class="label">' + (total - correct - unattempted) + '/' + total + '</span>' + '</div>' + '</div>';
    $(rdata).appendTo(container);
    this.ReportScreen(quizid)
};
DailyQuiz.prototype.ReportScreen = function(quizid) {
    var correct = 0;
    var total = 0;
    var unattempted = 0;
    var reportdatasession = this.reportdata[quizid];
    var userdatasession = this.userreport[quizid];
    this.timedata[quizid] = new Array();
    this.tempdata.solution[quizid] = new Array();
    this.tempdata.solutionHindi[quizid] = new Array();
    $(this.tempdata.modal[quizid]).find('.question-pallete').find('button').hide();
    for (var i in this.reportdata[quizid]) {
        for (var j in this.reportdata[quizid][i].answer) {
            this.tempdata.questionanswer[total] = reportdatasession[i].answer[j].indexOf(!0);
            this.tempdata.useranswer[total] = -1;
            if (Array.isArray(userdatasession[i][j].answer)) {
                this.tempdata.useranswer[total] = userdatasession[i][j].answer.indexOf(!0)
            }
            DailyQuiz.getObj().timedata[quizid][total] = 0;
            if (userdatasession[i][j].timeConsumed != null) {
                DailyQuiz.getObj().timedata[quizid][total] = (parseInt(userdatasession[i][j].timeConsumed))
            }
            this.tempdata.solution[quizid][total] = reportdatasession[i].solution[j];
            if (typeof reportdatasession[i].solutionHindi != 'undefined') {
                this.tempdata.solutionHindi[quizid][total] = reportdatasession[i].solutionHindi[j]
            }
            if (this.tempdata.useranswer[total] == -1) {
                unattempted++
            } else if (this.tempdata.questionanswer[total] == this.tempdata.useranswer[total]) {
                correct++
            }
            total++
        }
    }
    var accuracy = 0;
    if (total - unattempted > 0) {
        accuracy = Math.round(Math.round((parseFloat((correct / (total - unattempted)) * 100)) * 100) / 100)
    }
    var parentcontainer = $('.quizSection[data-quizid="' + quizid + '"]');
    $(parentcontainer).find(".reportdiv").remove();
    $(parentcontainer).find(".description").hide();
    $(this.tempdata.modal[quizid]).find(".modal-footer").find(".questionNavigation").hide();
    var radius = 12;
    var correctPercent = (correct * 100) / total;
    var correctFill = (2 * 22 * radius * correctPercent) / (7 * 100);
    var incorrectPercent = ((total - correct - unattempted) * 100) / total;
    var incorrectFill = (2 * 22 * radius * incorrectPercent) / (7 * 100);
    var unattemptPercent = ((unattempted) * 100) / total;
    var unattemptFill = (2 * 22 * radius * unattemptPercent) / (7 * 100);
    var accuracyFill = parseFloat((2 * 22 * radius * accuracy) / (7 * 100));
    var reviewhtml = this.reviewCard(this.reviewData, this.descreviewData, this.quizDetails[quizid].title);
    var report = '<div class="reportdiv">' + '<div>' + '<img src = "https://' + systemSettings.cdn.bucket + '/images/liveclasquiz-023b11deb59b4.png"/>' + '</div>' + '<div>' + this.quizDetails[quizid].title + '</div>' + '<div class="description clearfix container">' + '<div class="marks col-lg-4 col-md-4 col-sm-4 col-xs-6">' + '<span>' + total + ' </span> Questions' + '</div>' + '<div class="marks col-lg-4 col-md-4 col-sm-4 col-xs-6">' + '<span>' + total + ' </span> Marks' + '</div>' + '<div class="timer col-lg-4 col-md-4 col-sm-4 col-xs-12">' + '<span>Time Spent: </span>' + '<span class="questionTimer">000</span>' + '<span>sec</span>' + '</div>' + '</div>' + '<div class="quizStates quizdetails container">' + '<div>' + '<div class="description-block">' + '<span class="report-text">CORRECT</span>' + '<div class="svgholder">' + '<svg viewBox="0 0 36 36">' + '<path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#E4E4E4" stroke-width="2" stroke-dasharray="100, 100"/>' + '</svg>' + '<svg class="progress-loader" viewBox="0 0 36 36">' + '<path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#30B8E2" stroke-width="2" stroke-dasharray="' + correctFill + ', 100"/>' + '</svg>' + '</div>' + '<span class="label">' + correct + '/' + total + '</span>' + '</div>' + '</div>' + '<div>' + '<div class="description-block">' + '<span class="report-text">INCORRECT</span>' + '<div class="svgholder">' + '<svg viewBox="0 0 36 36">' + '<path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#E4E4E4" stroke-width="2" stroke-dasharray="100, 100"/>' + '</svg>' + '<svg class="progress-loader" viewBox="0 0 36 36">' + '<path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#30B8E2" stroke-width="2" stroke-dasharray="' + incorrectFill + ', 100"/>' + '</svg>' + '</div>' + '<span class="label">' + (total - correct - unattempted) + '/' + total + '</span>' + '</div>' + '</div>' + '<div>' + '<div class="description-block">' + '<span class="report-text">UNATTEMPTED</span>' + '<div class="svgholder">' + '<svg viewBox="0 0 36 36">' + '<path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#E4E4E4" stroke-width="2" stroke-dasharray="100, 100"/>' + '</svg>' + '<svg class="progress-loader" viewBox="0 0 36 36">' + '<path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#30B8E2" stroke-width="2" stroke-dasharray="' + unattemptFill + ', 100"/>' + '</svg>' + '</div>' + '<span class="label">' + unattempted + '/' + total + '</span>' + '</div>' + '</div>' + '<div>' + '<div class="description-block">' + '<span class="report-text">ACCURACY</span>' + '<div class="svgholder">' + '<svg viewBox="0 0 36 36">' + '<path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#E4E4E4" stroke-width="2" stroke-dasharray="100, 100"/>' + '</svg>' + '<svg class="progress-loader" viewBox="0 0 36 36">' + '<path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#30B8E2" stroke-width="2" stroke-dasharray="' + accuracyFill + ', 100"/>' + '</svg>' + '</div>' + '<span class="label">' + accuracy + '%</span>' + '</div>' + '</div>' + '</div>' + '<div class="quiz-btns">' + '<div class="btn btn-primary-alt reviewQuiz">Review Question</div>' + '<div class="btn btn-primary-alt" data-dismiss="modal">More Quizzes</div>' + '</div>' + (typeof reviewhtml != "undefined" ? reviewhtml : '') + '</div>';
    $(report).appendTo(parentcontainer);
    this.reportstate = !0;
    this.ReviewQuestion(quizid);
    var htmlinnercontent = '';
    if ($('.featuredContainer').length > 0) {
        htmlinnercontent = $('.featuredContainer').html()
    }
    var html = '<div class="featuredContainer">' + htmlinnercontent + '</div>';
    $('#quizModal').find('.reportdiv').append(html);
    $('#quizModal').find('.reportdiv').find('.featuredContainer').find('#FeaturedArticles').hide();
    new LazyLoad({
        elements_selector: ".lazy"
    });
    $('#quizModal').find('.quiz-toggle').css('display', 'none');
    $('#faq-bot-button').css('display', 'none')
};
DailyQuiz.prototype.ReviewQuestion = function(quizId) {
    var i = 0;
    var correct = 0;
    var reportdatasession = this.reportdata[quizId];
    var userdatasession = this.userreport[quizId];
    $('.quizSection[data-quizid="' + quizId + '"]').find('.item').each(function() {
        var index = DailyQuiz.getObj().tempdata.questionanswer[i];
        var userindex = DailyQuiz.getObj().tempdata.useranswer[i];
        if (index == userindex) {
            $(this).find("label").addClass("no_hover");
            $(this).find("input[value='" + index + "'] ~ .labelDiv").addClass("correct");
            $(this).find(".labelDiv.correct").find(".indicator").addClass("glyphicon glyphicon-ok");
            correct++
        } else {
            $(this).find("label").addClass("no_hover");
            $(this).find("input[value='" + userindex + "'] ~ .labelDiv").addClass("wrong");
            $(this).find("input[value='" + index + "'] ~ .labelDiv").addClass("correct");
            $(this).find(".correct").find(".indicator").addClass("glyphicon glyphicon-ok");
            $(this).find(".wrong").find(".indicator").addClass("glyphicon glyphicon-remove")
        }
        $(this).find("label").unbind('click');
        var str = DailyQuiz.getObj().tempdata.solution[quizId][i];
        if (typeof str == "object") str = str[0];
        str = "" + str;
        str = str.replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
        if (str != "") $(this).find(".solutionTab").html("<hr><h3 style='color:#1A94BA;'>Solution:<h3>" + str + "<hr>");
        else
            $(this).find(".solutionTab").html("<hr><h3 style='color:#1A94BA;'>Solution:<h3>No Solution Available<hr>");
        if (typeof DailyQuiz.getObj().tempdata.solutionHindi[quizId][i] != 'undefined') {
            var strHindi = DailyQuiz.getObj().tempdata.solutionHindi[quizId][i];
            if (typeof strHindi == "object") strHindi = strHindi[0];
            strHindi = "" + strHindi;
            strHindi = strHindi.replace(/<inlineformula>/g, "\\(").replace(/<\/inlineformula>/g, "\\)").replace("attachment/index.html", "attachment5445.html?id=").replace(/<formula>/g, "$$$$").replace(/<\/formula>/g, "$$$$");
            if (strHindi != "") $(this).find(".solutionTabHindi").html("<hr><h3 style='color:#1A94BA;'>Solution:<h3>" + strHindi + "<hr>");
            else
                $(this).find(".solutionTabHindi").html("<hr><h3 style='color:#1A94BA;'>Solution:<h3>No Solution Available<hr>")
        }
        $(this).find("img").addClass("img-responsive");
        i++
    });
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    DailyQuiz.getObj().totaltime[quizId] = new Array();
    this.totaltime[quizId] = this.timedata[quizId].reduce(function(a, b) {
        return a + b
    }, 0);
    $('.quizSection[data-quizid=' + quizId + ']').find('.description .questionTimer').text(this.totaltime[quizId]);
    $('.quizSection[data-quizid=' + quizId + ']').find('.reportdiv .quizStates .label-success').text(correct + "/" + i);
    $('.quizSection[data-quizid=' + quizId + ']').find('.reportdiv .quizStates .label-danger').text((i - correct) + "/" + i);
    $('.quizSection[data-quizid=' + quizId + ']').find('.reportdiv .quizStates .label-info').text(Math.round(Math.round((parseFloat((correct / i) * 100)) * 100) / 100) + "%");
    this.BindReportEvents(quizId)
};
DailyQuiz.prototype.BindReportEvents = function(quizid) {
    var cpointer = 1;
    var clickflag = !0;
    var start = $(this.tempdata.modal[quizid]).find(this.tempdata.body[quizid]).find(".item");
    var len = start.length;
    if ($(this.tempdata.modal[quizid]).find(".modal-footer").find('.question-pallete').find(".questionsholder").length > 0) {
        setTimeout(function() {
            slider("questionsholder", "questionsslider", "question-number")
        }, 200)
    }
    $('.quizSection[data-quizid="' + quizid + '"]').find(".reviewQuiz").unbind().bind("click", this, function(e) {
        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('button.submit').hide();
        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('button.rfinish').show();
        cpointer = 1;
        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').removeClass('notvisited correct incorrect unattempted').addClass('current');
        $('.quizSection[data-quizid="' + quizid + '"]').find(".reportdiv").hide();
        $('#quizModal').find('.quiz-toggle').css('display', 'block');
        if (cpointer == len) {
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rprev").show();
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rnext").hide();
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rfinish").show();
            if (len == 1) {
                $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rprev").hide()
            }
        } else if (cpointer == 1) {
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rprev").hide();
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rnext").show();
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rfinish").hide()
        } else {
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rprev").show();
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rnext").show();
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rfinish").hide()
        }
        $(e.data.tempdata.modal[quizid]).find(".modal-footer").find(".questionNavigation").css("display", "inline-flex");
        $(e.data.tempdata.modal[quizid]).find(".quizquestnno").text(cpointer);
        $(e.data.tempdata.modal[quizid]).find(".timer .timerHead").text("Time Spent: ");
        $(e.data.tempdata.modal[quizid]).find(".timer .questionTimer").text(e.data.timedata[quizid][cpointer - 1] + ' Sec');
        $('.quizSection[data-quizid="' + quizid + '"]').find(".description").show();
        $(start[0]).addClass("active");
        e.data.reportstate = !1;
        e.data.ModalBodyCalc(quizid, e.data.reportstate);
        var obj = e.data;
        $(e.data.tempdata.modal[quizid]).find(".question-pallete").find('p[data-quesno]').css('cursor', 'pointer');
        $(e.data.tempdata.modal[quizid]).find(".question-pallete").find('p[data-quesno]').unbind().bind("click", this, function(ev) {
            var quesno = $(this).attr('data-quesno');
            var state = $(obj.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').attr('data-state');
            $(obj.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').removeClass('notvisited correct incorrect unattempted current').addClass(state);
            cpointer = quesno;
            $(obj.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').removeClass('notvisited correct incorrect unattempted').addClass('current');
            $(obj.tempdata.body[quizid]).carousel(cpointer - 1);
            $(obj.tempdata.body[quizid]).carousel("pause");
            if (cpointer == len) {
                $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rprev").show();
                $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rnext").hide();
                $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rfinish").show();
                if (len == 1) {
                    $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rprev").show();
                    $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rnext").hide()
                }
            } else if (cpointer == 1) {
                $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rprev").hide();
                $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rnext").show();
                $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rfinish").hide()
            } else {
                $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rprev").show();
                $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rnext").show();
                $(obj.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rfinish").hide()
            }
            $(obj.tempdata.modal[quizid]).find(".quizquestnno").text(cpointer);
            $(obj.tempdata.modal[quizid]).find(".timer .questionTimer").text(obj.timedata[quizid][cpointer - 1] + ' Sec');
            obj.ModalBodyCalc(quizid, e.data.reportstate)
        })
    });
    $(this.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rnext").unbind().bind("click", this, function(e) {
        if (e.data.click == !0) {
            e.data.ClickGuard()
        } else {
            return
        }
        var state = $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').attr('data-state');
        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').removeClass('notvisited correct incorrect unattempted current').addClass(state);
        cpointer++;
        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').removeClass('notvisited correct incorrect unattempted').addClass('current');
        $(e.data.tempdata.body[quizid]).carousel("next");
        $(e.data.tempdata.body[quizid]).carousel("pause");
        $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rprev").show();
        if (cpointer == len) {
            $(this).hide();
            $(e.data.tempdata.modal[quizid]).find(".modal-footer").find('.questionNavigation').find(".rfinish").show()
        }
        $(e.data.tempdata.modal[quizid]).find(".quizquestnno").text(cpointer);
        $(e.data.tempdata.modal[quizid]).find(".timer .questionTimer").text(e.data.timedata[quizid][cpointer - 1] + ' Sec');
        e.data.ModalBodyCalc(quizid, e.data.reportstate)
    });
    $(this.tempdata.modal[quizid]).find(".modal-footer").find(".rprev").unbind().bind("click", this, function(e) {
        if (e.data.click == !0) {
            e.data.ClickGuard()
        } else {
            return
        }
        var state = $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').attr('data-state');
        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').removeClass('notvisited correct incorrect unattempted current').addClass(state);
        cpointer--;
        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').removeClass('notvisited correct incorrect unattempted').addClass('current');
        $(e.data.tempdata.body[quizid]).carousel("prev");
        $(e.data.tempdata.body[quizid]).carousel("pause");
        $(e.data.tempdata.modal[quizid]).find(".modal-footer").find(".questionNavigation").find(".rnext").show();
        $(e.data.tempdata.modal[quizid]).find(".modal-footer").find(".questionNavigation").find(".rfinish").hide();
        if (cpointer == 1) {
            $(this).hide()
        }
        $(e.data.tempdata.modal[quizid]).find(".quizquestnno").text(cpointer);
        $(e.data.tempdata.modal[quizid]).find(".timer .questionTimer").text(e.data.timedata[quizid][cpointer - 1] + ' Sec');
        e.data.ModalBodyCalc(quizid, e.data.reportstate)
    });
    $(this.tempdata.modal[quizid]).find(".modal-footer").find(".rfinish").unbind().bind("click", this, function(e) {
        if (e.data.click == !0) {
            e.data.ClickGuard()
        } else {
            return
        }
        var state = $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').attr('data-state');
        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('p[data-quesno=' + cpointer + ']').removeClass('notvisited correct incorrect unattempted current').addClass(state);
        $(e.data.tempdata.modal[quizid]).find('.question-pallete').find('button').hide();
        $('.quizSection[data-quizid="' + quizid + '"]').find(".reportdiv").show();
        $('.quizSection[data-quizid="' + quizid + '"]').find(".description").hide();
        $('.quizSection[data-quizid="' + quizid + '"]').find(".reportdiv .description").show();
        $(e.data.tempdata.modal[quizid]).find(".modal-footer").find(".questionNavigation").hide();
        $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item.active").removeClass("active");
        $(e.data.tempdata.modal[quizid]).find(".timer .questionTimer").text(e.data.totaltime[quizid]);
        e.data.reportstate = !0;
        e.data.ModalBodyCalc(quizid, e.data.reportstate);
        $(e.data.tempdata.modal[quizid]).find(".question-pallete").find('p[data-quesno]').unbind("click");
        $('#quizModal').find('.quiz-toggle').css('display', 'none')
    });
    $(this.tempdata.modal[quizid]).find(".close").unbind().bind("click", this, function(e) {
        var x = confirm("Do you want to exit ?");
        if (x == !1) return !1;
        var zopim = $("body").find(".zopim");
        $(zopim.eq(0)).show();
        $(zopim.eq(2)).show();
        $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item.active").removeClass("active");
        $('#faq-bot-button').css('display', 'block')
    });
    $('.reportdiv').find(".quiz-btns").find(("[data-dismiss='modal']")).unbind().bind("click", this, function(e) {
        $('#faq-bot-button').css('display', 'block')
    });
    $('#lcq-' + quizid).modal('show');
    $(this.tempdata.modal[quizid]).find(".quizSection").show();
    this.ModalBodyCalc(quizid, this.reportstate);
    $('#lcq-' + quizid).on('shown.bs.modal', this, function(e) {
        e.data.ModalBodyCalc(quizid, e.data.reportstate);
        history.pushState(null, null, null)
    });
    $(window).on('popstate', this, function(e) {
        $('#lcq-' + quizid).modal('hide');
        $(e.data.tempdata.modal[quizid]).find(e.data.tempdata.body[quizid]).find(".item.active").removeClass("active")
    });
    $(window).on("resize", this, function(e) {
        clearTimeout(e.data.intervalset);
        e.data.intervalset = setTimeout(e.data.ModalBodyCalc(quizid, this.reportstate), 500)
    });
    $('#lcq-' + quizid).on('hidden.bs.modal', this, function(e) {
        if ((window.location.href).indexOf('quizId') > -1) {
            window.location.href = (window.location.href).split('?')[0]
        }
    });
    $('[data-action="selectLang_' + quizid + '"]').prop('checked', !1);
    $('[data-action="selectLang_' + quizid + '"]').unbind().bind('click', function(e) {
        if (!$(e.currentTarget).prop('checked')) {
            $('#dailyquizCarousel-' + quizid).find('[langauge="english"]').css('display', 'block');
            $('#dailyquizCarousel-' + quizid).find('[langauge="hindi"]').css('display', 'none')
        } else {
            $('#dailyquizCarousel-' + quizid).find('[langauge="hindi"]').css('display', 'block');
            $('#dailyquizCarousel-' + quizid).find('[langauge="english"]').css('display', 'none')
        }
    });
    reviewCardBindEvents()
};
DailyQuiz.prototype.incrementSeconds = function() {
    if (this.timer.TimeCountCheck) {
        this.timer.seconds += 1;
        if (this.timer.seconds < 60) {
            $('.timer .questionTimer').html(this.timer.seconds + " Sec")
        } else if (this.timer.seconds / 60 < 60) {
            $('.timer .questionTimer').html(parseInt(this.timer.seconds / 60) + " Mins : " + this.timer.seconds % 60 + " Sec")
        } else {
            $('.timer .questionTimer').html(parseInt(this.timer.seconds / (60 * 60)) + " Hours:" + this.timer.seconds(this.timer.seconds / 60) + " Mins :" + this.timer.seconds % 60 + " Sec")
        }
    }
};
DailyQuiz.prototype.ModalBodyCalc = function(quizid, string) {
    if (string == undefined) {
        string = !0
    }
    var mhheight = 40;
    var header = 42;
    var footer = $('#lcq-' + quizid).find('.modal-footer').outerHeight() + 2;
    var windowheight = $(window).height();
    var bodyheight = windowheight - (header + footer);
    if (string == !0) $('#lcq-' + quizid).find('.reportdiv').css("height", bodyheight);
    else
        $('#lcq-' + quizid).find('.modal-body').css("height", bodyheight)
};
DailyQuiz.prototype.ClickGuard = function(value) {
    if (value == undefined) value = 750;
    this.click = !1;
    setTimeout(function() {
        this.click = !0
    }.bind(this), value)
};
DailyQuiz.prototype.QuestionTimer = function(quizid) {
    var currentPointer = parseInt(this.tempdata.currentPointer[quizid]) - 1;
    var itemId = $($(this.tempdata.modal[quizid]).find('.item')[currentPointer]).attr('data-quesid');
    var time = parseInt(this.questionData[quizid].data[itemId].time);
    $("#quizModal #lcq-" + quizid).find('.progress-div').width('inherit');
    $("#quizModal #lcq-" + quizid).find('.time-progress').width('inherit');
    $("#quizModal #lcq-" + quizid).find('.time-progress').css('background', 'linear-gradient(to right,#37BFDE,#17EB9A)');
    var totalSecs = parseInt(time);
    this.timer.questionTimer = setInterval(function() {
        this.timer.seconds += 1;
        totalSecs = parseInt(totalSecs) - 1;
        var mins = parseInt(totalSecs / 60);
        var secs = parseInt(totalSecs % 60);
        var hrs = parseInt(mins / 60);
        mins = parseInt(mins % 60);
        if (hrs < 10) {
            hrs = '0' + hrs
        }
        if (mins < 10) {
            mins = '0' + mins
        }
        if (secs < 10) {
            secs = '0' + secs
        }
        var html = "";
        if (hrs > 0) {
            html += hrs + " hrs "
        }
        if (mins > 0) {
            html += mins + " mins "
        }
        html += secs + " secs";
        $('.timer .questionTimer').html(html);
        var totalWidth = $("#quizModal #lcq-" + quizid).find('.progress-div').width();
        var secWidth = totalWidth / time;
        var newWidth = $("#quizModal #lcq-" + quizid).find('.time-progress').width() - (secWidth);
        $('.time-progress').css('width', newWidth + "px");
        if (totalSecs <= 10) {
            $('.time-progress').css('background', 'linear-gradient(to right, red, #777)')
        }
        if (totalSecs <= 0) {
            this.TimeModal(quizid);
            clearInterval(this.timer.questionTimer)
        }
    }.bind(this), 1000)
};
DailyQuiz.prototype.TimeMgmt = function(quizid) {
    clearInterval(this.timer.questionTimer);
    clearInterval(this.timer.cancel);
    if (this.quizDetails[quizid].quesTimeRestriction == 1) {
        $("#quizModal #lcq-" + quizid).find('.progress-div').show();
        this.QuestionTimer(quizid);
        $('.timer .timerHead').text("Time Left: ")
    } else {
        $("#quizModal #lcq-" + quizid).find('.progress-div').hide();
        this.timer.cancel = setInterval(this.incrementSeconds.bind(this), 1000);
        $('.timer .timerHead').text("Time Spent: ")
    }
};
DailyQuiz.prototype.TimeModal = function(quizid) {
    if ($('#timesupModal').length == 0) {
        var html = '<div class="modal fade in" id="timesupModal" role="dialog" data-backdrop="static" data-keyboard="false" style="padding-right: 0px;">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h4 class="modal-title">Alert</h4>' + '</div>' + '<div class="modal-body timesup">' + '<span>Time\'s Up !!</span>' + '</div>' + '<div class="modal-footer">' + '<span class="btn btn-primary-alt btnTimesUp">Ok</span>' + '</div>' + '</div>' + '</div>' + '</div>';
        $('body').append(html)
    }
    $("#timesupModal").modal('show');
    $("#timesupModal").find('.btnTimesUp').unbind().bind('click', function() {
        $("#timesupModal").modal('hide');
        if (this.tempdata.currentPointer[quizid] == this.quizDetails[quizid].info.totalQuestions) {
            $(this.tempdata.modal[quizid]).find(".submit").click()
        } else {
            $(this.tempdata.modal[quizid]).find(".nextQuestion").click()
        }
    }.bind(this))
};
DailyQuiz.prototype.Console = function() {
    console.group();
    console.table(DailyQuiz.getObj().reportdata);
    console.table(DailyQuiz.getObj().userreport);
    console.groupEnd()
};
$(document).ready(function() {
    _dailyQuizObj = DailyQuiz.getObj();
    if (typeof g_quizlistDetails != "undefined") _dailyQuizObj.quizlistDetails = g_quizlistDetails;
    var MathJAX = '<script src="MathJax/MathJaxdda6.html?config=TeX-AMS-MML_HTMLorMML"></script>' + '<script type="text/x-mathjax-config">' + 'MathJax.Hub.Config({' + 'config: ["MMLorHTML.js"],' + 'jax: ["input/TeX","input/MathML","input/AsciiMath"],' + 'extensions: ["tex2jax.js","mml2jax.js","asciimath2jax.js","MathMenu.js","MathZoom.js"],' + 'TeX: {' + 'extensions: ["autoload-all.js"]' + '}' + '});' + '</script>';
    $(MathJAX).appendTo("body");
    $(document).keypress(function(e) {
        var key = e.which;
        if (key == 13 || key == 32) {
            if ($('#timesupModal').css('display') == 'block') {
                $('#timesupModal').find('.btnTimesUp').click()
            }
        }
    })
});

function slider(outerdiv, innerdiv, entity) {
    var entityslide = new Array();
    for (i = 0; i < $('.' + outerdiv).length; i++) {
        entityslide[i] = new slidediv();
        entityslide[i].Init(outerdiv, innerdiv, entity, i)
    }
}

function slidediv() {
    this.slidediv = null
}
slidediv.prototype.Init = function(outerdiv, innerdiv, entity, index) {
    if (typeof outerdiv === 'string') {
        this.outdiv = $('.' + outerdiv).eq(index)
    } else
        this.outdiv = outerdiv.eq(0);
    this.indiv = this.outdiv.find('.' + innerdiv);
    if (typeof entity === 'string') {
        this.entity = $('.' + entity);
        this.leftbtn = this.outdiv.find('.' + entity + 'btnleft');
        this.rightbtn = this.outdiv.find('.' + entity + 'btnright');
        this.move = this.indiv[0].clientWidth - (this.indiv[0].clientWidth % this.entity.outerWidth(!0));
        if (this.move <= 0) {
            this.move = this.indiv[0].clientWidth
        }
    } else {
        this.move = entity;
        this.leftbtn = this.outdiv.find('.left');
        this.rightbtn = this.outdiv.find('.right')
    }
    this.CheckPosition();
    this.rightbtn.unbind().bind('click', function() {
        this.indiv.animate({
            scrollLeft: "+=" + this.move + "px"
        }, 1000)
    }.bind(this));
    this.leftbtn.unbind().bind('click', function() {
        this.indiv.animate({
            scrollLeft: "-=" + this.move + "px"
        }, 1000)
    }.bind(this));
    this.Swipebox();
    this.indiv.scroll(function() {
        this.CheckPosition()
    }.bind(this))
};
slidediv.prototype.Swipebox = function() {
    var startx = 0;
    var boxleft = 0;
    var dist = 0;
    touchobj = null;
    this.indiv[0].addEventListener('touchstart', function(e) {
        touchobj = e.changedTouches[0];
        boxleft = parseInt(this.indiv[0].style.left);
        startx = parseInt(touchobj.clientX)
    }.bind(this), !1);
    this.indiv[0].addEventListener('touchmove', function(e) {
        var touchobj = e.changedTouches[0];
        var dist = parseInt(touchobj.clientX) - startx;
        if (dist != 0) {
            this.CheckPosition()
        }
        this.indiv[0].style.left = ((boxleft + dist > 30) ? 30 : (boxleft + dist < 0) ? 0 : boxleft + dist) + 'px'
    }.bind(this), !1)
};
slidediv.prototype.CheckPosition = function() {
    var outer_width = this.indiv[0].clientWidth;
    var inner_width = this.indiv[0].scrollWidth;
    if (inner_width <= outer_width) {
        this.leftbtn.addClass("invisible-btn");
        this.rightbtn.addClass("invisible-btn");
        return
    }
    var menuscrollLeft = this.indiv[0].scrollLeft;
    if (menuscrollLeft <= 0) {
        this.leftbtn.addClass("invisible-btn")
    } else {
        this.leftbtn.removeClass("invisible-btn")
    }
    if ((outer_width + menuscrollLeft) < inner_width) {
        this.rightbtn.removeClass("invisible-btn")
    } else {
        this.rightbtn.addClass("invisible-btn")
    }
};

function slideVertical() {
    this.slideVertical = null
}
slideVertical.prototype.Init = function(outerdiv, innerdiv, entity, index) {
    if (typeof outerdiv === 'string') {
        this.outdiv = $('.' + outerdiv).eq(index)
    } else
        this.outdiv = outerdiv.eq(0);
    this.indiv = this.outdiv.find('.' + innerdiv);
    this.upbtn = this.outdiv.find('.' + entity + 'btnup');
    this.downbtn = this.outdiv.find('.' + entity + 'btndown');
    this.entity = $('.' + entity);
    this.CheckPosition();
    this.downbtn.unbind().bind('click', function() {
        this.indiv.animate({
            scrollTop: "+=" + "50px"
        }, 300, function() {
            this.CheckPosition()
        }.bind(this))
    }.bind(this));
    this.upbtn.unbind().bind('click', function() {
        this.indiv.animate({
            scrollTop: "-=" + "50px"
        }, 300, function() {
            this.CheckPosition()
        }.bind(this))
    }.bind(this));
    this.indiv.on('scroll', function() {
        this.CheckPosition()
    }.bind(this));
    this.Swipebox()
};
slideVertical.prototype.Swipebox = function() {
    var startx = 0;
    var boxTop = 0;
    var dist = 0;
    touchobj = null;
    this.indiv[0].addEventListener('touchstart', function(e) {
        touchobj = e.changedTouches[0];
        boxTop = parseInt(this.indiv[0].style.Top);
        startx = parseInt(touchobj.clientX)
    }.bind(this), !1);
    this.indiv[0].addEventListener('touchmove', function(e) {
        var touchobj = e.changedTouches[0];
        var dist = parseInt(touchobj.clientX) - startx;
        if (dist != 0) {
            this.CheckPosition()
        }
        this.indiv[0].style.Top = ((boxTop + dist > 30) ? 30 : (boxTop + dist < 0) ? 0 : boxTop + dist) + 'px'
    }.bind(this), !1)
};
slideVertical.prototype.CheckPosition = function() {
    var outer_Height = this.indiv[0].clientHeight;
    var inner_Height = this.indiv[0].scrollHeight;
    if (inner_Height <= outer_Height) {
        this.upbtn.addClass("invisible-btn");
        this.downbtn.addClass("invisible-btn");
        return
    }
    var menuscrollTop = this.indiv[0].scrollTop;
    if (menuscrollTop <= 0) {
        this.upbtn.addClass("invisible-btn")
    } else {
        this.upbtn.removeClass("invisible-btn")
    }
    if ((outer_Height + menuscrollTop) < inner_Height) {
        this.downbtn.removeClass("invisible-btn")
    } else {
        this.downbtn.addClass("invisible-btn")
    }
};