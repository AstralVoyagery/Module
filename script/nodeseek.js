if (typeof $request !== 'undefined') {
  $persistentStore.write($request.headers.cookie, "nodeseek_cookie");
  $notification.post("Cookie获取/更新成功✅", "", "");
  $done();
}

let args = {};
if (typeof $argument !== 'undefined') args = Object.fromEntries($argument.split(',').map(item => item.split('&')));

const request = {
  url: `https://www.nodeseek.com/api/attendance?random=${args.NS_RANDOM}`,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    'Origin': 'https://www.nodeseek.com',
    'Referer': 'https://www.nodeseek.com/board',
    'Cookie': $persistentStore.read("nodeseek_cookie")
  }
}

$httpClient.post(request, (error, response, data) => {
  let result = JSON.parse(data);

  if (result.message.includes("收益")) {
    $notification.post("NodeSeek签到 ✅", "", result.message)
  } else if (result.message.includes("完成")) {
    $notification.post("NodeSeek签到 ⚠️", "", result.message)
  } else if (result.message == "USER NOT FOUND") {
    $notification.post("NodeSeek签到 ⚠️", "", "Cookie未获取/已失效，请重新获取")
  } else {
    $notification.post("NodeSeek签到 ❌", "", result.message || "未知错误")
  }

  $done();
});
