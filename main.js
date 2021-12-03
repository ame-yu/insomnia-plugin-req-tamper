const pluginName = "insomnia-plugin-req-tamper"
const globalVariableName = "tamper"

console.log(`\n[${pluginName}] Loaded
check ReadMe.md in plugin directory for Usage.`)

init()

function getOnceInstance() {
  return new Proxy(
    {},
    {
      unread: new Set(),
      get: function (target, prop, receiver) {
        if (prop === "more") {
          return { ...target }
        }
        if (this.unread.has(prop)) {
          this.unread.delete(prop)
          return target[prop]
        }
        return undefined
      },
      set: function (obj, prop, value) {
        this.unread.add(prop)

        obj[prop] = value
        return true
      },
    }
  )
}
function getPluginInstance(initObj) {
  const once = getOnceInstance()
  const pluginStaticProperty = {
    once,
    init,
  }
  return new Proxy(
    { ...initObj, ...pluginStaticProperty },
    {
      set: function (obj, prop, value) {
        if (prop === "once" && typeof value === "object") {
          obj[prop] = getOnceInstance()
          for (let key in value) {
            obj[prop][key] = value[key]
          }
        } else {
          obj[prop] = value
        }
        return true
      },
    }
  )
}
function init() {
  if (global[globalVariableName] !== undefined) {
    global[globalVariableName] = {}
    return
  }

  var instance = getPluginInstance()

  Object.defineProperty(global, globalVariableName, {
    set: function (newObj) {
      if (typeof newObj === "object") {
        instance = getPluginInstance(newObj)
      }
    },
    get: function () {
      return instance
    },
  })
}

async function tamperReqeust(context) {
  console.debug("RequestContext", context)
  let injectOptions = global[globalVariableName]
  if (!injectOptions) return

  injectOptions = {
    ...injectOptions,
    ...injectOptions.once,
  }
  // Set headers
  console.debug("RequestSetHeader")
  for (const headerName of Object.keys(injectOptions?.headers ?? {})) {
    const value = injectOptions.headers[headerName]
    await context.request.setHeader(headerName, value)
  }
  // Set method
  if (injectOptions.method) {
    await context.request.setMethod(injectOptions.method)
  }
  if (injectOptions.body) {
    await context.request.setBodyText(injectOptions.body)
  }
  if (injectOptions.url) {
    await context.request.setUrl(injectOptions.url)
  }
}

exports.requestHooks = [tamperReqeust]
