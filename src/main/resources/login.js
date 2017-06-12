$(function () {
    sjcl.random.startCollectors(), loginForm.init(), InfoPanel.init()
});
var loginForm = {
    accountName: $("#accountName"),
    alertCookie: $("#cookie-check"),
    alertHolder: $("#display-errors"),
    alertJsHolder: $("#js-errors"),
    csrfToken: $("#csrftoken"),
    password: null,
    passwordForm: $("#password-form"),
    passwordFill: ".",
    submitButton: $("#submit"),
    srpClientSession: null,
    srpClientCredentials: null,
    inputPassword: $("#password"),
    inputUseSrp: $("#useSrp"),
    inputPublicA: $("#publicA"),
    inputClientEvidenceM1: $("#clientEvidenceM1"),
    networkErrorMessage: null,
    language: null,
    supportSiteUrl: null,
    userAgent: null,
    preventDefault: function (e) {
        e.preventDefault()
    },
    init: function () {
        this.setSubmitButtonDisabled(), this.checkCookie(), this.setFocus(), this.setSrpAjaxCall(), this.setCaptcha(loginForm.passwordForm), this.setFp()
    },
    setSrpAjaxCall: function () {
        this.submitButton.bind("click", this.preventDefault).click(function () {
            try {
                loginForm.getSrpData(loginForm.language)
            } catch (e) {
                setTimeout(function () {
                    loginForm.submitButton.removeAttr("disabled").unbind("click").click()
                })
            }
        })
    },
    setSubmitButtonDisabled: function () {
        this.submitButton.removeClass("unbind")
    },
    checkCookie: function () {
        var e = navigator.cookieEnabled;
        e || ($(loginForm.alertCookie).removeClass("hide"), $(loginForm.alertJsHolder).removeClass("hide"))
    },
    setFocus: function () {
        "responsive" !== loginForm.userAgent && (loginForm.accountName.val() ? loginForm.inputPassword.focus() : loginForm.accountName.focus())
    },
    setCaptcha: function (e) {
        e.hasClass("captcha-required") && $("#captcha-anchor").click(function (e) {
            e.preventDefault(), $("#sec-string").attr("src", "/login/captcha.jpg?" + (new Date).getTime())
        })
    },
    getSrpData: function (e) {
        var t = loginForm.passwordForm.find('input[name="accountName"]').val();
        $.ajax({
            method: "POST",
            url: "/login/srp?csrfToken=true",
            data: JSON.stringify({inputs: [{input_id: "account_name", value: t}]}),
            dataType: "json",
            beforeSend: function (t) {
                t.setRequestHeader("Accept", "application/json"), t.setRequestHeader("Content-Type", "application/json"), t.setRequestHeader("Accept-Language", e)
            }
        }).done(function (e) {
            loginForm.onSuccess(e), loginForm.submitButton.removeAttr("disabled").unbind("click").click()
        }).fail(function (e) {
            loginForm.onFail(e)
        }).complete(function (e) {
            loginForm.onComplete(e)
        })
    },
    onSuccess: function (e) {
        loginForm.csrfToken.val(e.csrf_token), this.password = this.inputPassword.val(),

            this.srpClientSession = new SrpClientSession(e.modulus, e.generator, e.hash_function),


            this.srpClientCredentials = this.srpClientSession.step1(e.username, this.password, e.salt, e.public_B),

        null !== this.password && this.inputPassword.val(Array(this.password.length + 1).join(this.passwordFill)),

            this.inputUseSrp.val("true"),
            this.inputPublicA.val(this.srpClientCredentials.publicA.toString(16)),

            this.inputClientEvidenceM1.val(this.srpClientCredentials.clientEvidenceM1.toString(16))
    },
    onFail: function (e) {
        if (navigator.onLine && 0 != e.status)var t = JSON.parse(e.responseText), n = t.error_code, i = t.support_error_code, s = t.error_message; else var n = "NETWORK_ERROR", i = "", s = loginForm.networkErrorMessage;
        if (loginForm.alertHolder.length && loginForm.alertHolder.remove(), i)var o = s + " <a href='" + loginForm.supportSiteUrl + i + "' rel='external'>" + i + "</a> <i class='icon-external-link'></i>"; else var o = s;
        loginForm.alertJsHolder.html(o).removeClass("hide"), this.inputPassword.val(""), loginForm.submitButton.button("reset"), EmbeddedLogin.errorHandlerRegistration && EmbeddedLogin.errorHandlerRegistration(n, i, s)
    },
    onComplete: function (e) {
        var t = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
        t.test(e.username) || "responsive" != loginForm.userAgent || loginForm.submitButton.button("reset")
    },
    setFp: function () {
        FP.generate(function (e) {
            var t = JSON.stringify(e);
            $("#fp").attr("value", t)
        })
    }
}, InfoPanel = {
    cssHide: "hide",
    cssShow: "show",
    cssGrid: "info-active",
    leftPanel: "#info-wrapper",
    rightPanel: "#login-wrapper",
    phoneInfoToggle: "#info-phone-toggle",
    phoneInfoClose: "#info-phone-close",
    title: null,
    body: null,
    enabled: null,
    domReady: !1,
    init: function () {
        this.domReady = !0, this.$leftPanel = $(this.leftPanel), this.$rightPanel = $(this.rightPanel), this.$mobileToggle = $(this.phoneInfoToggle), this.$mobileClose = $(this.phoneInfoClose), this.enabled && this.toggle(this.enabled, this.title, this.body), this.enableMobile()
    },
    toggle: function (e, t, n) {
        this.title = t, this.body = n, this.enabled = e;
        var i = "InfoPanel.toggle called.";
        return this.domReady && (e ? (this.$leftPanel.find(".info-title").html(t), this.$leftPanel.find(".info-body").html(n), this.$mobileToggle.html(t), this.$leftPanel.removeClass(this.cssHide), this.$rightPanel.addClass(this.cssGrid), this.$mobileToggle.removeClass(this.cssHide)) : (this.$leftPanel.addClass(this.cssHide), this.$rightPanel.removeClass(this.cssGrid), this.$mobileToggle.addClass(this.cssHide)), i += "Dom ready."), i
    },
    enableMobile: function () {
        var e = this, t = function (e, t, n) {
            e.stopPropagation(), e.preventDefault(), t.removeClass(InfoPanel.cssHide), n.addClass(InfoPanel.cssHide)
        };
        this.$mobileToggle.on("click", function (n) {
            t(n, e.$leftPanel, e.$rightPanel)
        }), this.$mobileClose.on("click", function (n) {
            t(n, e.$rightPanel, e.$leftPanel)
        })
    }
}, EmbeddedLogin = {
    inputAccountName: null,
    inputPassword: null,
    inputPersistLogin: $("#persistLogin"),
    inputAccountNameId: "accountName",
    inputPasswordId: "password",
    errorContainer: null,
    errorContainerId: "#display-errors",
    jsErrorContainer: null,
    jsErrorContainerId: "#js-errors",
    errorHandlerRegistration: null,
    init: function () {
        return this.inputAccountName = document.getElementById(this.inputAccountNameId), this.inputPassword = document.getElementById(this.inputPasswordId), this.errorContainer = $(this.errorContainerId), this.jsErrorContainer = $(this.jsErrorContainerId), this
    },
    getSubmitButton: function () {
        return loginForm.submitButton[0]
    },
    fillAccountName: function (e) {
        return this.inputAccountName.value = e ? e.substring(0, Math.min(320, e.length)) : "", this
    },
    fillPassword: function (e) {
        return this.inputPassword.value = e ? e.substring(0, Math.min(16, e.length)) : "", this
    },
    setPersistLogin: function (e) {
        this.inputPersistLogin && this.inputPersistLogin.prop("checked", e)
    },
    registerErrorHandler: function (e) {
        this.errorHandlerRegistration = e
    }
}, FP = {
    generator: new Fpjs, generate: function (e) {
        var t = {};
        t[0] = this.getValue(this.generator.userAgentKey([])), t[1] = this.getValue(this.generator.languageKey([])), t[2] = this.getValue(this.generator.colorDepthKey([])), t[3] = this.getValue(this.generator.screenResolutionKey([])), t[4] = this.getValue(this.generator.timezoneOffsetKey([])), t[5] = this.getValue(this.generator.cpuClassKey([])), t[6] = this.getValue(this.generator.platformKey([])), t[7] = this.getValue(this.generator.pluginsKey([])), t[10] = this.getValue([this.generator.getHasLiedLanguages() || this.generator.getHasLiedResolution() || this.generator.getHasLiedOs() || this.generator.getHasLiedBrowser()]), t[11] = this.getValue(this.generator.touchSupportKey([]));
        var n = this;
        this.generator.fontsKey([], function (i) {
            return t[12] = n.getValue(i), e(t)
        })
    }, getValue: function (e) {
        return Bases.toBase64(MurmurHash3.x86.hash32(e.join(";")))
    }
};