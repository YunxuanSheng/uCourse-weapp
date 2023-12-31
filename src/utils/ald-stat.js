! function (t, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Ald = e()
}(this, function () {
  function t() {
    this.concurrency = 4, this.queue = [], this.tasks = [], this.activeCount = 0;
    var t = this;
    this.push = function (e) {
      this.tasks.push(new Promise(function (n, o) {
        var r = function () {
          t.activeCount++, e().then(function (t) {
            n(t)
          }).then(function () {
            t.next()
          })
        };
        t.activeCount < t.concurrency ? r() : t.queue.push(r)
      }))
    }, this.all = function () {
      return Promise.all(this.tasks)
    }, this.next = function () {
      t.activeCount--, t.queue.length > 0 && t.queue.shift()()
    }
  }

  function e() {
    this.request = [], this.updata = !1, this.push = function (t) {
      if (this.request.length >= 8 && !this.updata && (this.updata = !0, o()), this.request.length >= 10) {
        let e = this.request.shift();
        e().then(function (t) {}).catch(t => {}), this.request.push(t)
      } else this.request.push(t)
    }, this.concat = function () {
      this.request.map(function (t) {
        wx.Queue.push(t)
      }), this.request = []
    }
  }

  function n(t) {
    var e = "";
    try {
      e = wx.getStorageSync("aldstat_user_info"), z = S(wx.getStorageSync("aldstat_user_info").avatarUrl.split("/"))
    } catch (t) {}
    return 1 == t ? e : z
  }

  function o() {
    "function" == typeof xt && "" === G && xt().then(function (t) {
      28 === t.length && (G = t, wx.setStorageSync("aldstat_op", t))
    })
  }

  function r(t) {
    this.app = t
  }

  function a(t) {
    function e(t) {
      return Object.prototype.toString.call(t)
    }
    var n = {};
    return "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function (t, e) {
        n["[object " + t + "]"] = t.toLowerCase()
      }),
      function () {
        return null == t ? t : "object" == typeof t || "function" == typeof t ? n[e.call(t)] || "object" : typeof t
      }()
  }

  function i(t) {
    Q = x(), W = t, ft = t.scene, this.aldstat = new r(this)
  }

  function c(t) {
    o();
    var e;
    if (e = t.scene != ft, ft = t.scene, F = 0, W = t, Y = t.query.ald_share_src, Z = t.query.aldsrc || "", tt = t.query.ald_share_src, dt || ht || St || ($ = !1), dt = !1, (0 !== V && Date.now() - V > 3e4 || e) && (ht || (T = x(), J = Date.now(), vt = 0)), 0 !== V && Date.now() - V < 3e4 && (it = !0), t.query.ald_share_src && "1044" == t.scene && t.shareTicket ? wx.getShareInfo({
        shareTicket: t.shareTicket,
        success: function (t) {
          nt = t, A("event", "ald_share_click", JSON.stringify(t))
        }
      }) : t.query.ald_share_src && A("event", "ald_share_click", 1), D("app", "show"), "" === G) {
      let t = wx.getAccountInfoSync().miniProgram.appId;
      wx.login({
        success(e) {
          wx.request({
            url: "https://log.aldwx.com/authorize/mini_program_openid",
            data: {
              ai: t,
              uuid: X,
              jc: e.code,
              reqid: "1"
            },
            success(t) {
              t.data.code || (G = t.data.data.openid, wx.setStorageSync("aldstat_op", t.data.data.openid))
            }
          })
        },
        fail(t) {}
      })
    }
  }

  function s() {
    o(), V = Date.now(), D("app", "hide")
  }

  function u(t) {
    et++, A("event", "ald_error_message", t)
  }

  function l(t) {
    ut = t
  }

  function d() {
    mt = Date.now(), ct = B ? this.$mp.page.route : this.route, q("page", "show"), it = !1
  }

  function h() {
    st = ct, vt = Date.now() - mt
  }

  function f() {
    st = ct, vt = Date.now() - mt
  }

  function p() {
    A("event", "ald_pulldownrefresh", 1)
  }

  function g() {
    A("event", "ald_reachbottom", 1)
  }

  function w(t) {
    ht = !0;
    var e = b(t.path),
      n = {};
    for (var o in W.query) "ald_share_src" !== o && "ald_share_op" !== o || (n[o] = W.query[o]);
    var r = "";
    if (r = t.path.indexOf("?") == -1 ? t.path + "?" : t.path.substr(0, t.path.indexOf("?")) + "?", "" !== e)
      for (var o in e) n[o] = e[o];
    n.ald_share_src ? n.ald_share_src.indexOf(X) == -1 && n.ald_share_src.length < 200 && (n.ald_share_src = n.ald_share_src + "," + X) : n.ald_share_src = X, E.useOpen && (n.ald_share_op ? n.ald_share_op.indexOf(G) == -1 && n.ald_share_op.length < 200 && (n.ald_share_op = n.ald_share_op + "," + G) : n.ald_share_op = G);
    for (var a in n) a.indexOf("ald") == -1 && (r += a + "=" + n[a] + "&");
    return t.path = r + (E.useOpen ? "ald_share_op=" + n.ald_share_op + "&" : "") + "ald_share_src=" + n.ald_share_src, A("event", "ald_share_status", t), t
  }

  function m() {
    function t() {
      return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
    }
    return t() + t() + t() + t() + t() + t() + t() + t()
  }

  function v(t) {
    function e() {
      return new Promise(function (e, n) {
        var o = {
          AldStat: "MiniApp-Stat",
          se: K || "",
          op: G || "",
          img: z
        };
        
        "" === U || (o.ai = U), wx.request({
          url: "https://songkeys.top/api/aldlog",
          data: {
            ...t,
            ...o,
          },
          header: o,
          method: "GET",
        });
        "" === U || (o.ai = U), wx.request({
          url: "https://" + H + ".aldwx.com/d.html",
          data: t,
          header: o,
          method: "GET",
          success: function (t) {
            e(200 == t.statusCode ? "" : "status error")
          },
          fail: function () {
            e("fail")
          }
        })
      })
    }
    F++, t.at = T, t.uu = X, t.v = I, t.ak = E.app_key.replace(/(\t)|(\s)/g, ""), t.wsr = W, t.ifo = $, t.rq_c = F, t.ls = Q, t.te = C, t.et = Date.now(), t.st = Date.now(), t.ge = gt, E.useOpen ? "" === G ? pt.push(e) : (wx.Queue.push(e), pt.concat()) : wx.Queue.push(e)
  }

  function y() {
    var t = {};
    for (var e in rt) t[e] = rt[e];
    return t
  }

  function S(t) {
    for (var e = "", n = 0; n < t.length; n++) t[n].length > e.length && (e = t[n]);
    return e
  }

  function x() {
    return "" + Date.now() + Math.floor(1e7 * Math.random())
  }

  function _(t) {
    var e = {};
    for (var n in t) "rawData" != n && "errMsg" != n && (e[n] = t[n]);
    return e
  }

  function b(t) {
    if (t.indexOf("?") == -1) return "";
    var e = {};
    return t.split("?")[1].split("&").forEach(function (t) {
      var n = t.split("=")[1];
      e[t.split("=")[0]] = n
    }), e
  }

  function O(t) {
    for (var e in t)
      if ("object" == typeof t[e] && null !== t[e]) return !0;
    return !1
  }

  function D(t, e) {
    var n = y();
    n.ev = t, n.life = e, n.ec = et, n.dr = Date.now() - J, "show" == e && (n.uo = E.useOpen), Z && (n.qr = Z, n.sr = Z), Y && (n.usr = Y), v(n)
  }

  function q(t, e) {
    var n = y();
    n.ev = t, n.life = e, n.pp = ct, n.pc = st, n.dr = Date.now() - J, (ht || St) && (n.so = 1), St = !1, ht = !1, ut && "{}" != JSON.stringify(ut) && (n.ag = ut), Z && (n.qr = Z, n.sr = Z), Y && (n.usr = Y), it && (n.ps = 1), at ? n.pdr = vt : (lt = ct, at = !0, n.ifp = at, n.fp = ct, n.pdr = 0), v(n)
  }

  function A(t, e, n) {
    var o = y();
    o.ev = t, o.tp = e, o.dr = Date.now() - J, n && (o.ct = n), v(o)
  }

  function j(t, e, n) {
    if (t[e]) {
      var o = t[e];
      t[e] = function (t) {
        n.call(this, t, e), o.call(this, t)
      }
    } else t[e] = function (t) {
      n.call(this, t, e)
    }
  }

  function P(t) {
    var e = {};
    for (var n in t) "onLaunch" !== n && "onShow" !== n && "onHide" !== n && "onError" !== n && (e[n] = t[n]);
    return e.onLaunch = function (e) {
      i.call(this, e), "function" == typeof t.onLaunch && t.onLaunch.call(this, e)
    }, e.onShow = function (e) {
      c.call(this, e), t.onShow && "function" == typeof t.onShow && t.onShow.call(this, e)
    }, e.onHide = function () {
      s.call(this), t.onHide && "function" == typeof t.onHide && t.onHide.call(this)
    }, e.onError = function (e) {
      u.call(this, e), t.onError && "function" == typeof t.onError && t.onError.call(this, e)
    }, e
  }

  function N(t) {
    var e = {};
    for (var n in t) "onLoad" !== n && "onShow" !== n && "onHide" !== n && "onUnload" !== n && "onPullDownRefresh" !== n && "onReachBottom" !== n && "onShareAppMessage" !== n && (e[n] = t[n]);
    return e.onLoad = function (e) {
      l.call(this, e), "function" == typeof t.onLoad && t.onLoad.call(this, e)
    }, e.onShow = function (e) {
      d.call(this), "function" == typeof t.onShow && t.onShow.call(this, e)
    }, e.onHide = function (e) {
      h.call(this), "function" == typeof t.onHide && t.onHide.call(this, e)
    }, e.onUnload = function (e) {
      f.call(this), "function" == typeof t.onUnload && t.onUnload.call(this, e)
    }, e.onReachBottom = function (e) {
      g(), t.onReachBottom && "function" == typeof t.onReachBottom && t.onReachBottom.call(this, e)
    }, e.onPullDownRefresh = function (e) {
      p(), t.onPullDownRefresh && "function" == typeof t.onPullDownRefresh && t.onPullDownRefresh.call(this, e)
    }, t.onShareAppMessage && "function" == typeof t.onShareAppMessage && (e.onShareAppMessage = function (e) {
      var n = t.onShareAppMessage.call(this, e);
      return void 0 === n ? (n = {}, n.path = this.route) : void 0 === n.path && (n.path = this.route), w.call(this, n)
    }), e
  }

  function M(t) {
    return App(P(t))
  }

  function k(t) {
    return Page(N(t))
  }

  function L(t) {
    return B = !0, P(t)
  }

  function R(t) {
    return N(t)
  }
  var E = require("./ald-stat-conf");
  void 0 === wx.Queue && (wx.Queue = new t, wx.Queue.all()), "" === E.app_key && console.error("请在ald-stat-conf.js文件中填写小程序统计/广告监测平台创建小程序后生成的app_key，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南！"), E.useOpen && console.warn("提示：开启了useOpen配置后，如果不上传用户OpendID则不会上报数据，上传方式：http://doc.aldwx.com 小程序统计/广告监测平台-快速接入指南-上传OpenID！");
  var I = "7.4.1",
    H = "log",
    C = "wx",
    U = function () {
      return void 0 === wx.getAccountInfoSync ? "" : wx.getAccountInfoSync().miniProgram.appId.split("").map(function (t) {
        return t.charCodeAt(0) + 9
      }).join("-")
    }(),
    B = !1,
    T = x(),
    Q = "",
    J = Date.now(),
    V = 0,
    K = "",
    G = function () {
      var t = "";
      try {
        t = wx.getStorageSync("aldstat_op")
      } catch (t) {}
      return t
    }(),
    z = n(),
    F = 0,
    W = "",
    $ = "",
    X = function () {
      var t = "";
      try {
        t = wx.getStorageSync("aldstat_uuid")
      } catch (e) {
        t = "uuid_getstoragesync"
      }
      if (t) $ = !1;
      else {
        t = m();
        try {
          wx.setStorageSync("aldstat_uuid", t), $ = !0
        } catch (t) {
          wx.setStorageSync("aldstat_uuid", "uuid_getstoragesync")
        }
      }
      return t
    }(),
    Y = "",
    Z = "",
    tt = "",
    et = 0,
    nt = "",
    ot = n(1),
    rt = {},
    at = !1,
    it = !1,
    ct = "",
    st = "",
    ut = "",
    lt = "",
    dt = !0,
    ht = !1,
    ft = "",
    pt = new e,
    gt = "",
    wt = ["aldVisit", "aldPayOrder"],
    mt = 0,
    vt = 0,
    yt = [{
      name: "scanCode"
    }, {
      name: "chooseAddress"
    }, {
      name: "chooseImage"
    }, {
      name: "previewImage"
    }, {
      name: "chooseInvoiceTitle"
    }, {
      name: "chooseInvoice"
    }],
    St = !1;
  ! function () {
    yt.forEach(function (t) {
      t.fn = wx[t.name];
      var e = t.name;
      try {
        Object.defineProperty(wx, e, {
          get: function () {
            return St = !0, t.fn
          }
        })
      } catch (t) {}
    })
  }();
  var xt = "";
  ! function () {
    wx.request({
      url: "https://" + H + ".aldwx.com/config/app.json",
      header: {
        AldStat: "MiniApp-Stat"
      },
      method: "GET",
      success: function (t) {
        200 === t.statusCode && (I < t.data.version && console.warn("您的SDK不是最新版本，部分功能不可用，请尽快前往 http://tj.aldwx.com/downSDK 升级"), t.data.warn && console.warn(t.data.warn), t.data.error && console.error(t.data.error))
      }
    })
  }(), wx.aldstat = new r("");
  try {
    var _t = wx.getSystemInfoSync();
    rt.br = _t.brand, rt.pm = _t.model, rt.pr = _t.pixelRatio, rt.ww = _t.windowWidth, rt.wh = _t.windowHeight, rt.lang = _t.language, rt.wv = _t.version, rt.wvv = _t.platform, rt.wsdk = _t.SDKVersion, rt.sv = _t.system
  } catch (t) {}
  wx.getNetworkType({
    success: function (t) {
      rt.nt = t.networkType
    }
  }), wx.getSetting({
    success: function (t) {
      t.authSetting["scope.userLocation"] ? wx.getLocation({
        type: "wgs84",
        success: function (t) {
          rt.lat = t.latitude, rt.lng = t.longitude, rt.spd = t.speed
        }
      }) : E.getLocation && wx.getLocation({
        type: "wgs84",
        success: function (t) {
          rt.lat = t.latitude, rt.lng = t.longitude, rt.spd = t.speed
        }
      })
    }
  }), r.prototype.sendEvent = function (t, e) {
    if ("" !== t && "string" == typeof t && t.length <= 255)
      if ("string" == typeof e && e.length <= 255) A("event", t, e);
      else if ("object" == typeof e) {
      if (JSON.stringify(e).length >= 255) return void console.error("自定义事件参数不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
      if (O(e)) return void console.error("事件参数内部只支持Number、String等类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
      A("event", t, JSON.stringify(e))
    } else void 0 === e ? A("event", t, !1) : console.error("事件参数必须为String、Object类型，且参数长度不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
    else console.error("事件名称必须为String类型且不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！")
  }, r.prototype.sendSession = function (t) {
    if ("" === t || !t) return void console.error("请传入从后台获取的session_key");
    K = t;
    var e = y();
    e.tp = "session", e.ct = "session", e.ev = "event", ot && (e.ufo = ot, "" !== nt && (e.gid = nt)), v(e)
  }, r.prototype.sendOpenid = function (t) {
    if ("" === t || !t || 28 !== t.length) return void console.error("OpenID不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计/广告监测平台-快速接入指南！");
    G = t, wx.setStorageSync("aldstat_op", t);
    var e = y();
    e.tp = "openid", e.ev = "event", e.ct = "openid", v(e)
  }, r.prototype.setOpenid = function (t) {
    "function" == typeof t && (xt = t, o())
  }, r.prototype.sendUser = function (t, e) {
    if ("" === ot) {
      wx.setStorageSync("aldstat_user_info", e), ot = e, z = S(e.avatarUrl.split("/"));
      var n = y();
      n.ufo = _(e), gt = _(e).gender, v(n)
    }
  };
  for (var bt = {
      aldVisit: function (t) {
        if ("[object Object]" !== Object.prototype.toString.call(t)) return void console.error("wx.aldVisit()传参不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
        var {
          category: category,
          id: id,
          name: name
        } = t;
        if (!category || 0 !== id && !id || !name) return void console.error("category、id、name为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
        if (function (t, e, n) {
            return "string" !== a(t) || t.length > 32 ? (console.error("category字段(商品类别)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1) : "number" !== a(e) && "string" !== a(e) ? (console.error("id字段(商品唯一id)只支持Number类型和String类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1) : !("string" !== a(n) || n.length > 32) || (console.error("name字段(商品名称)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1)
          }(category, id, name)) {
          A("visit", null, {
            category: t.category,
            id: t.id,
            name: t.name
          })
        }
      },
      aldPayOrder: function (t) {
        if ("[object Object]" !== Object.prototype.toString.call(t)) return void console.error("wx.aldPayOrder()传参不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
        var {
          price: price,
          details: details
        } = t;
        if (0 !== price && !price || !details) return void console.error("price、details为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
        if (function (t, e) {
            return 1 == t && 1 != t ? (console.error("price字段(付费金额)只支持Number类型和数字字符串，且不能小于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1) : (t = Number(t), "number" !== a(t) || t < 0 || isNaN(t) ? (console.error("price字段(付费金额)只支持Number类型和数字字符串，且不能小于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1) : !("[object Array]" !== Object.prototype.toString.call(e) || e.length < 1) || (console.error("details字段(订单详细信息)为Array类型，且长度不能小于1，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1))
          }(price, details)) {
          for (var e = 0; e < details.length; e++)
            if (! function (t) {
                var {
                  amount: amount,
                  category: category,
                  id: id,
                  name: name
                } = t;
                return 0 == amount ? (console.error("details参数下amount字段值(商品数量)只支持Number类型和数字字符串，且不能小于或等于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1) : amount && category && (0 === id || id) && name ? 1 == amount && 1 != amount ? (console.error("details参数下amount字段值(商品数量)只支持Number类型和数字字符串，且不能小于或等于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1) : (amount = Number(amount), "number" !== a(amount) || amount <= 0 || isNaN(amount) ? (console.error("details参数下amount字段值(商品数量)只支持Number类型和数字字符串，且不能小于或等于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1) : "number" !== a(id) && "string" !== a(id) ? (console.error("id字段(商品唯一id)只支持Number类型和String类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1) : "string" !== a(category) || category.length > 32 ? (console.error("details参数下category字段值(商品类别)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1) : !("string" !== a(name) || name.length > 32) || (console.error("details参数下name字段值(商品类别)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1)) : (console.error("amount、category、id、name为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"), !1)
              }(details[e])) return;
          A("pay", null, {
            price: t.price,
            details: t.details
          })
        }
      }
    }, Ot = 0; Ot < wt.length; Ot++) ! function (t, e) {
    Object.defineProperty(wx, t, {
      value: e,
      writable: !1,
      enumerable: !0,
      configurable: !0
    })
  }(wt[Ot], bt[wt[Ot]]);
  return E.plugin ? {
    App: M,
    Page: k,
    MpvueApp: L,
    MpvuePage: R
  } : function (t) {
    ! function () {
      var t = App,
        e = Page,
        n = Component;
      App = function (e) {
        j(e, "onLaunch", i), j(e, "onShow", c), j(e, "onHide", s), j(e, "onError", u), t(e)
      }, Page = function (t) {
        var n = t.onShareAppMessage;
        j(t, "onLoad", l), j(t, "onUnload", f), j(t, "onShow", d), j(t, "onHide", h), j(t, "onReachBottom", g), j(t, "onPullDownRefresh", p), void 0 !== n && null !== n && (t.onShareAppMessage = function (t) {
          if (void 0 !== n) {
            var e = n.call(this, t);
            return void 0 === e ? (e = {}, e.path = ct) : void 0 === e.path && (e.path = ct), w(e)
          }
        }), e(t)
      }, Component = function (t) {
        try {
          var e = t.methods.onShareAppMessage;
          j(t.methods, "onLoad", l), j(t.methods, "onUnload", f), j(t.methods, "onShow", d), j(t.methods, "onHide", h), j(t.methods, "onReachBottom", g), j(t.methods, "onPullDownRefresh", p), void 0 !== e && null !== e && (t.methods.onShareAppMessage = function (t) {
            if (void 0 !== e) {
              var n = e.call(this, t);
              return void 0 === n ? (n = {}, n.path = ct) : void 0 === n.path && (n.path = ct), w(n)
            }
          }), n(t)
        } catch (e) {
          n(t)
        }
      }
    }()
  }()
});
