<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="/js/jquery.min.js"></script>
    <link rel="stylesheet" href="/css/main.css">
    <title>GST_Demo</title>
</head>
<body>
<input type="file" placeholder="请选择文件" id="file">
<select name="lang" id="lang">
    {% for item in langList %}
    <option value="{{ item.value }}">{{ item.name }}</option>
    {% endfor %}
</select>
<button id="ibm">IBM Speech to Text</button>
<select name="googleLang" id="googleLang">
    {% for item in googleLang %}
    <option value="{{ item.value }}">{{ item.name }}</option>
    {% endfor %}
</select>
<button id="google">Google Speech to Text</button>
<button id="baidu">Baidu Cloud</button>

<div class="value"></div>
<script>
    var file = $("#file");
    file.on('change',function (obj) {
        var image = new Image();
        image.dynsrc=obj.value;
        console.log(image.dynsrc);
    });
    $('#ibm').on('click',function () {
        var file = $('#file').val().split('\\');
        var fileName = file[file.length-1];
        var type = fileName.split('.');
        var fileType = type[type.length-1];
        $.ajax({
            type: "get",
            url: "/stt/ibm",
            data: {
                file: fileName,
                type: fileType,
                lang: $('#lang').val()
            },
            success: function (data) {
                console.log(data);
                $('.value').eq(0).text(JSON.stringify(data,null,4));
//                window.location.href = 'file://'+data.url;
            }
        })
    })
    $('#google').on('click', function () {
        var file = $('#file').val().split('\\');
        var fileName = file[file.length-1];
        var type = fileName.split('.');
        var fileType = type[type.length-1];
        $.ajax({
            type: "get",
            url: "/stt/google",
            data: {
                file: fileName,
                type: fileType,
                lang: $('#googleLang').val()
            },
            success: function (data) {
                $('.value').eq(0).text(JSON.stringify(data,null,4));
                if(data.errno == 0){
                    window.location.href = '/result/transcriptionGoogle.txt';
                }
            }
        })
    })
    $('#baidu').on('click', function () {
        var file = $('#file').val().split('\\');
        var fileName = file[file.length-1];
        var type = fileName.split('.');
        var fileType = type[type.length-1];
        $.ajax({
            type: "get",
            url: "/stt/baidu",
            data: {
                file: fileName,
                type: fileType,
                lang: $('#googleLang').val()
            },
            success: function (data) {
                $('.value').eq(0).text(JSON.stringify(data,null,4));
                if(data.errno == 0){
                    // window.location.href = '/result/transcriptionGoogle.txt';
                    alert("百度转录完成");
                }
            }
        })
    })
</script>
</body>
</html>