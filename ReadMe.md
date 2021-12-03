# insomnia-plugin-req-tamper
Modify headers、method、body in insomnia unit test

# Install
1. Download this repo archive [zip](https://github.com/ame-yu/insomnia-plugin-req-tamper/archive/refs/heads/master.zip)
2. (Insominia) Application -> Preferences -> Plugins -> Reveal Plugins Folder
3. make new folder named `insomnia-plugin-req-tamper`, extract archive files to this folder
4. (Insominia) Tools -> ReloadPlugins


# Usage
### Clear(Usually execute in first test unit)
```
global.tamper.init()
```
### Modify all request header
```js
global.tamper = {
    headers: {
        "Authorization": "Bearer xxxxx"
    }
}
```
### Modify next request header
```js
global.tamper.once = {
    headers: {
        "Authorization": "Bearer xxxxx"
    }
}
```

### Modify next request header
```js
global.tamper.once = {
    headers: {
        "Authorization": "Bearer xxxxx"
    }
}
```

### Change request URL, method, body in next request
```js
global.tamper.once = {
    url: (originUrl) => {
        return originUrl.replace("foo", "bar")
    },
    body: `{"foo":"bar"}`,
    method: "PUT"
}
```

<hr>

If this plugin can help you, please star this repo.