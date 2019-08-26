var subBtn = document.getElementById('subBtn');
subBtn.onclick = function(){
    var xml = new XMLHttpRequest();
    var commentText = document.getElementById('commentText');
    var contentId = document.getElementById('contentId');
    var postData = {
        contentid: contentId.value,
        content: commentText.value
    }
    var stringData=JSON.stringify(postData);
    xml.open('post' , '/api/comment/post' , true);
    xml.setRequestHeader("Content-type","application/json;charset=UTF-8");
    xml.send(stringData);
    xml.onreadystatechange = function(){
        if(xml.readyState ==4){
            try{
                commentText.value = '';
                var getData = JSON.parse(xml.responseText);
                console.log(getData);
                renderComment(getData.data);
                
            }catch(e){
                console.log('你的访问页面出错了>_<|||');
            }
        }
}
}
function renderComment(comments){
    console.log(comments.comments.length)
    var msgList = document.getElementById('msgList');
    // var l = comments.length;
    var html = '';
    for(var i=0; i<comments.comments.length; i++){
        html += `<div class="msgHtml"><p class="msgName">${comments.comments[i].username}</p><p class="msgCon">${comments.comments[i].content}</p></div>`;
        console.log(html)
    }
    
    msgList.innerHTML = html;
}