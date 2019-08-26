var submitBtn = document.getElementById('submit');

// submitBtn.onclick = function(){
    
//     var nameValue = document.getElementById('name');
//     var xml = new XMLHttpRequest();
//     var postData = {
//         name: nameValue.value
//     }
//     var stringData=JSON.stringify(postData);
//     xml.open('post','/admin/category/add',true);
//     xml.setRequestHeader("Content-type","application/html;charset=UTF-8");
//     xml.send(stringData);
//     xml.onreadystatechange = function(){
//         if(xml.readyState ==4){
//             try{
//                 console.log(xml.responseText)
//                 // var getData = JSON.parse(xml.responseText);
//                 // console.log(getData)
//                 // if(getData.message == "kong")
//                 // window.location.href = "/admin/error.html"
//                 // window.location.href = "https:www.baidu.com"
//             }catch(e){
//                 console.log('err')
//             }
//         }
//     }
// }