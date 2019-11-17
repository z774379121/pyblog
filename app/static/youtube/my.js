
var APIS = {
  login: {
    url:'https://cloud.vitoreality.com/api/user/login',
    type: 'POST',
    fn: login,
  },
}

toastr.options = {  
  closeButton: false,  
  debug: false,  
  progressBar: false,  
  positionClass: "toast-top-center",  
  onclick: null,  
  showDuration: "300",  
  hideDuration: "1000",  
  timeOut: "1000",  
 extendedTimeOut: "1000",  
 showEasing: "swing",  
hideEasing: "linear",  
 showMethod: "fadeIn",  
 hideMethod: "fadeOut"  
};

function checktoken(params) {
  if (window.location.pathname.search("login.html") != -1) {
      return
}
  var redict = "./login.html"
  if (window.location.pathname.search("starter.html") != -1) {
      redict = "./pages/examples/login.html"
    }
  if (!localStorage.hasOwnProperty('token')) {
    window.location.href = redict
    return 
  }

  const ajax = new XMLHttpRequest();
  ajax.open("GET", "https://cloud.vitoreality.com/api/group/infos")
  ajax.setRequestHeader("Content-type", "application/json");
  ajax.setRequestHeader("Authorization", localStorage.getItem("token"));
  ajax.onreadystatechange = function (e) {
      if (ajax.readyState == 4) {
        if (ajax.status == 200) {
          const data = JSON.parse(ajax.response);
          console.log(data)
          if (data.code == 0) {
              
          }else {
            // alert(data.data, e);
              location.href = redict;
          }
        } else {
          location.href = redict;
        }
      }

  }
  ajax.send();
}

function action1(name) {
  var redict = "./login.html"
  if (window.location.pathname.search("starter.html") != -1) {
      redict = "./pages/examples/login.html"
    }
  route = APIS[name];
  if (name === "login") {
    route.fn();
    return
  }
  if (!localStorage.hasOwnProperty('token')) {
    windows.location.href = redict
  } else {
    console.log(name);
    route = APIS[name];
    console.log(route);
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "https://cloud.vitoreality.com/api/group/infos")
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.setRequestHeader("Authorization", localStorage.getItem("token"));
    ajax.onreadystatechange = function (e) {
        if (ajax.readyState == 4) {
          if (ajax.status == 200) {
            const data = JSON.parse(ajax.response);
            console.log(data)
            if (data.code == 0) {
                // toastr.info("");
                route.fn();
            }else {
              // alert(data.data, e);
                location.href = redict;
            }
          } else {
            location.href = redict;
          }
        }

    }
    ajax.send();
  }


}

var PASSWORDMINLENGTH = 6

function login() {
    // body...
    console.log($('#login').serialize());
    var username = $('#username').val();
    var password = $('#pwd').val();
    console.log(password)
    if (username == ""|| password == ""){
      invaild("请输入账号密码");
      return
    }
    if (password.length < PASSWORDMINLENGTH) {
      invaild("密码不能少于6位");
      return
    }
    $.ajax({
      url: APIS.login.url,
      data: $('#login').serialize(),
      type: APIS.login.type,
          beforeSend: function(request) {        
      //请求前的处理
      request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      // request.setRequestHeader("Authorization","aaw--wssw-ss...");
    },   
    success: function(data) {        
    console.log(data);
        if (data.code != 0) {
          errpass();
          return;
        }
        localStorage.token = data.data.tokenId;
        location.href = "../../starter.html"    
    },   
    complete: function() {        
      //请求完成的处理    
    },    
    error: function() {        
      alert("服务失败");  
    }
    });
  }

  function test(phone, verifyCode) {
    const ajax = new XMLHttpRequest();
    ajax.open("POST", "https://browserapi.kuniao.com/account/register")
    ajax.setRequestHeader("Content-type", "application/json");
    let chars = '';
    for (let i = 0; i < 6; i++) {
        chars += String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65));
    }
    ajax.onreadystatechange = function (e) {
        if (ajax.status == 200 && ajax.readyState == 4) {
            const data = JSON.parse(ajax.response);
            if (data.msg == 'SUCCESS') {
                alert("验证成功");
            }else if(data.code == 50013){
                test(phone,verifyCode);
            }
        }
    }
    ajax.send(JSON.stringify({ invitationCode: chars, phone, verifyCode }));
}

  function test1(username, password) {
    const ajax = new XMLHttpRequest();
    ajax.open("POST", "https://cloud.vitoreality.com/api/class")
    ajax.setRequestHeader("Content-type", "application/json");
        ajax.setRequestHeader("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJ0ZXN0LnRtcCIsInVzZXJfaWQiOiIyYzFiYWEzNC0zNDZiLTQ5ODEtOTJhNi1iZTMzMTA2YjJmZWQiLCJleHAiOjE1NzM4OTk0MDMsImlzcyI6Imp3dF93aXRoX291dF9kZXZpY2VfaWQifQ.PG-qKPVtDp2uwoLWYq9XczlJV8FwmTYRU4i-RoomQXE");
    // let chars = '';
    // for (let i = 0; i < 6; i++) {
    //     chars += String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65));
    // }
    ajax.onreadystatechange = function (e) {
        if (ajax.status == 200 && ajax.readyState == 4) {
            const data = JSON.parse(ajax.response);
            if (data.msg == 'ok') {
                alert("验证成功");
            }else if(data.code == 50013){
                test(phone,verifyCode);
            }
        }
    }
    ajax.send(JSON.stringify({ "name":"tt1" }));
}

  function test2(username, password) {
    const ajax = new XMLHttpRequest();
    ajax.open("PUT", "https://cloud.vitoreality.com/api/class")
    ajax.setRequestHeader("Content-type", "application/json");
        ajax.setRequestHeader("Authorization", localStorage.getItem("token"));
    // let chars = '';
    // for (let i = 0; i < 6; i++) {
    //     chars += String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65));
    // }
    ajax.onreadystatechange = function (e) {
        if (ajax.status == 200 && ajax.readyState == 4) {
            const data = JSON.parse(ajax.response);
            if (data.data == 'ok') {
                alert("验证成功");
            }else if(data.code == 50013){
                test(phone,verifyCode);
            }
        }
    }
    ajax.send(JSON.stringify({ "name":"tt4", "c_id":22}));
}

function errpass() {
  // body...
  // $(document).Toasts('create', {
  // title: '验证失败',
  // body: '请检查账号密码',
  // icon: 'fas fa-ban',
  toastr.error( '账号密码错误', "验证失败", )
}

function imcomplited() {
  // body...
  if (confirm("上联：一但重泥拦子路；下联：两岸夫子笑颜回")) {
  // $(document).Toasts('create', {
  // title: '不支持的功能',
  // body: '请联系网站管理员',
  // icon: 'fas fa-exclamation-triangle',
  // autohide: true,
  toastr.warning("请联系网站管理员", '不支持的功能')
} else{
  
  toastr.info("请检查输入", "无法完成请求"); 
}
}

function todo() {
  toastr.warning("请联系网站管理员", '不支持的功能');
}

function invaild(msg) {
  toastr.info(msg, "请检查输入"); 
}

checktoken()