let args = {};

if (!$argument.includes("填入")) {
  args = Object.fromEntries($argument.split(',').map(item => item.split('&')));
} else {
  $notification.post("获取cookie失败 ❌", "", "请在模块中配置cookie");
  $done();
}

const request = {
  url: `https://www.nodeseek.com/api/attendance?random=${args.NS_RANDOM}`,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    'Origin': 'https://www.nodeseek.com',
    'Referer': 'https://www.nodeseek.com/board',
    'Cookie': args.NS_COOKIE
  }
}

$httpClient.post(request, (error, response, data) => {
  let result = JSON.parse(data);

  if (result.message.includes("收益")) {
    $notification.post("NodeSeek签到 ✅", "", result.message)
  } else if (result.message.includes("完成")) {
    $notification.post("NodeSeek签到 ⚠️", "", result.message)
  } else if (result.message == "USER NOT FOUND") {
    $notification.post("NodeSeek签到 ⚠️", "", "Cookie不正确/已失效，请重新获取")
  } else {
    $notification.post("NodeSeek签到 ❌", "", result.message || "未知错误")
  }
  $done();
});
