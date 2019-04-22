<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="/js/jquery.min.js"></script>
    <link rel="stylesheet" href="/css/main.css">
    <title>工行签约</title>
</head>
<body>
<button id="sign">签约测试</button>
<script>
    $('#sign').on('click', function () {
        $.ajax({
            type: "post",
            url: "/api/sign",
            data: {

            },
            success: function (data) {
                var newWin = window.open('');
                newWin.document.write(data);
            }
        })
    })
</script>
</body>
</html>