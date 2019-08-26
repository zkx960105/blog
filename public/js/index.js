window.onload = function(){
    // var userInfo = document.getElementById('userInfo');
    
    if(document.getElementById('loginbox')){
        var loginBox = document.getElementById('loginbox');
        var nowRegister = loginBox.getElementsByTagName('a')[0];
        nowRegister.onclick = function(){
            registerBox.style.display = 'block';
            loginBox.style.display = 'none';
        }
    }
    if(document.getElementById('registerbox')){
        var registerBox = document.getElementById('registerbox');
        var nowLogin = registerBox.getElementsByTagName('a')[0];
        nowLogin.onclick = function(){
            registerBox.style.display = 'none';
            loginBox.style.display = 'block';
        }
    }
    if(document.getElementById('registerbox')){
        var registerBox = document.getElementById('registerbox');
        var registerBtn = registerBox.getElementsByTagName('button')[0];
        registerBtn.onclick = function(){
            var xml = new XMLHttpRequest();
            var userName = document.getElementById('username');
            var passWord = document.getElementById('password');
            var rePassword = document.getElementById('checkps');
            var postData = {
                username : userName.value,
                password : passWord.value,
                repassword : rePassword.value
            };
            var stringData=JSON.stringify(postData);
            xml.open('post' , '/api/user/register' , true);
            xml.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xml.send(stringData);
            xml.onreadystatechange = function(){
                if(xml.readyState ==4){
                    try{
                        var getData = JSON.parse(xml.responseText);
                        var warning = document.getElementById('warning');
                            warning.innerHTML = getData.message;
                        console.log(getData)
                        if(!getData.code){
                            setTimeout(function(){
                                registerBox.style.display = 'none';
                                loginBox.style.display = 'block';
                            },3000)
                            
                        }
                        
                    }catch(e){
                        console.log('你的访问页面出错了>_<|||');
                    }
                }
            }
        }
    }
    

    if(document.getElementById('loginbox')){
        var loginBox = document.getElementById('loginbox');
        var loginBtn = loginBox.getElementsByTagName('button')[0];
        loginBtn.onclick = function(){
            var xml = new XMLHttpRequest();
            var userName = document.getElementById('username');
            var passWord = document.getElementById('password');
            var postData = {
                username : userName.value,
                password : passWord.value,
            };
            var stringData=JSON.stringify(postData);
            xml.open('post' , '/api/user/login' , true);
            xml.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xml.send(stringData);
            xml.onreadystatechange = function(){
                if(xml.readyState ==4){
                    try{
                        var getData = JSON.parse(xml.responseText);
                        if(!getData.code){
                            window.location.reload();
                        }
                        
                    }catch(e){
                        console.log('你的访问页面出错了>_<|||');
                    }
                }
            }
        
        }
    }
    if(document.getElementById('lgout')){
        var lgOut = document.getElementById('lgout');
        lgOut.onclick = function(){
            var xml = new XMLHttpRequest();
            xml.open('get' , '/api/user/logout' , true);
            xml.send();
            xml.onreadystatechange = function(){
                if(xml.readyState ==4){
                    var getData = JSON.parse(xml.responseText);
                        if(!getData.code){
                            window.location.reload();
                        }
                }
            }
        }
    }
}