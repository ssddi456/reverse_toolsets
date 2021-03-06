!function (e, t) {
    for (var a in t) e[a] = t[a]
}(exports, function (e) {
    var t = {};
    function a(n) {
        if (t[n]) return t[n].exports;
        var l = t[n] = { i: n, l: !1, exports: {} };
        return e[n].call(l.exports, l, l.exports, a), l.l = !0, l.exports
    }
    a.m = e;
    a.c = t;
    a.d = function (e, t, n) { a.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n }) }, 
    a.r = function (e) { 
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), 
        Object.defineProperty(e, "__esModule", { value: !0 }) 
}, 
    a.t = function (e, t) {
        if (1 & t && (e = a(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (a.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e) for (var l in e) a.d(n, l, function (t) { return e[t] }.bind(null, l));
        return n
    };
    a.n = function (e) {
        var t = e && e.__esModule ? function () { return e.default } : function () { return e };
        return a.d(t, "a", t), t
    };
    a.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    };
    a.p = "";
    return a(a.s = 49)
}([
    function (e, t) { e.exports = require("849c8c1") },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.EditorManager = t.unRegisterEditorPlugin = t.getEditorPlugins = t.registerEditorPlugin = void 0;
        var n = a(0), l = a(26), i = a(2), o = a(6), r = a(25), s = a(17), d = a(55), u = n.__importDefault(a(37)), p = a(5), c = a(38), m = n.__importDefault(a(15)), h = a(57), f = [];
        t.registerEditorPlugin = function (e) { f.push(e) }, t.getEditorPlugins = function () { return f.concat() }, t.unRegisterEditorPlugin = function (e) {
            var t = m.default(f, (function (t) { return t.id === e }));
            ~t && f.splice(t, 1)
        };
        var b = function () {
            function e(e, t, a) {
                var l = this;
                this.config = e, this.store = t, this.parent = a, this.toDispose = [], this.id = o.guid(), this.disableHover = !1, this.listeners = [], this.lazyPatchSchema = u.default(this.patchSchema.bind(this), 250, { leading: !1, trailing: !0 }), this.patching = !1;
                var i = !!a;
                this.env = n.__assign(n.__assign(n.__assign({}, d.env), e.amisEnv), { theme: e.theme }), this.plugins = (null == a ? void 0 : a.plugins) || (e.disableBultinPlugin ? [] : f).concat(e.plugins || []).map((function (e) {
                    var t, a = new e(l);
                    return a.order = null !== (t = a.order) && void 0 !== t ? t : 0, a
                })).sort((function (e, t) { return e.order - t.order })), this.dnd = (null == a ? void 0 : a.dnd) || new h.EditorDNDManager(this, t), this.hackRenderers(), i || this.toDispose.push(r.reaction((function () {
                    var e;
                    return [t.activeContainerId, t.activeContainerId ? null === (e = t.getNodeById(t.activeContainerId)) || void 0 === e ? void 0 : e.childRegions.map((function (e) { return e.key })) : []]
                }), (function (e) {
                    var t = e[0], a = e[1];
                    t && (null == a ? void 0 : a.length) && l.buildRenderers()
                })), o.reactionWithOldValue((function () { return t.activeId }), (function (e, t) { l.store.insertId && l.store.closeInsertPanel(), l.buildJSONSchemaUri(), l.buildRenderers(), l.buildToolbars(), l.buildPanels(), l.trigger("active", e ? n.__assign(n.__assign({}, l.buildEventContext(e)), { active: !0 }) : { id: t, active: !1 }) })), r.reaction((function () { return t.selections.join(",") }), (function () { l.buildPanels() })), r.reaction((function () { return t.needPatch }), (function (e) { e && l.lazyPatchSchema() })), o.reactionWithOldValue((function () { return { id: t.hoverId, region: t.hoverRegion } }), (function (e, a) {
                    var n, l, i = t.getDoc();
                    e.id && e.region ? null === (n = i.querySelector('[data-region="' + e.region + '"][data-region-host="' + e.id + '"]')) || void 0 === n || n.classList.add("is-region-active") : (null == a ? void 0 : a.id) && (null == a ? void 0 : a.region) && (null === (l = i.querySelector('[data-region="' + a.region + '"][data-region-host="' + a.id + '"]')) || void 0 === l || l.classList.remove("is-region-active"))
                })))
            } return e.prototype.buildEventContext = function (e) {
                var t = "string" == typeof e ? this.store.getNodeById(e) : e, a = this.store.getSchema(t.id);
                return { node: t, id: t.id, info: t.info, path: t.path, schemaPath: t.schemaPath, schema: a, data: "" }
            }, e.prototype.buildJSONSchemaUri = function () {
                var e = this.store.activeId, t = "";
                if (e) {
                    var a = this.buildEventContext(e), n = this.trigger("before-resolve-json-schema", a);
                    if (t = n.context.data, !n.prevented) {
                        this.plugins.forEach((function (e) {
                            var n;
                            if (!t) {
                                var l = null === (n = e.buildJSONSchema) || void 0 === n ? void 0 : n.call(e, a);
                                l && (t = l)
                            }
                        })), a.data = t;
                        var l = this.trigger("after-resolve-json-schema", a);
                        t = l.data
                    }
                } this.store.setJSONSchemaUri(t)
            }, e.prototype.buildToolbars = function () {
                var e = this.store.activeId, t = [];
                if (e) {
                    var a = this.buildEventContext(e);
                    this.plugins.forEach((function (e) {
                        var l, i = n.__assign({}, a);
                        null === (l = e.buildEditorToolbar) || void 0 === l || l.call(e, i, t)
                    }))
                } this.store.setActiveToolbars(t.map((function (e) { return n.__assign(n.__assign({}, e), { order: e.order || 0, id: o.guid() }) })))
            }, e.prototype.collectPanels = function (e, t, a) {
                var l = this;
                void 0 === t && (t = !1), void 0 === a && (a = !1);
                var i = [];
                if (e) {
                    var o = n.__assign(n.__assign({}, this.buildEventContext(e)), { secondFactor: a, data: i, selections: this.store.selections.map((function (e) { return l.buildEventContext(e) })) });
                    this.plugins.forEach((function (e) {
                        var t;
                        null === (t = e.buildEditorPanel) || void 0 === t || t.call(e, o, i)
                    })), t && this.trigger("build-panels", o), i = o.data || i
                } return i
            }, e.prototype.buildPanels = function () {
                var e = this.store.activeId, t = [];
                if (e || this.store.selections.length) {
                    e = e || this.store.selections[0];
                    var a = this.store.getNodeById(e);
                    t = a ? this.collectPanels(a, !0) : t
                } this.store.setPanels(t.map((function (e) { return n.__assign(n.__assign({}, e), { order: e.order || 0 }) })))
            }, e.prototype.collectRenderers = function (e, t) {
                void 0 === t && (t = this.store.activeContainerId);
                var a = [];
                if (!t) return a;
                var i = this.store.getNodeById(t);
                if (!i) return a;
                var r = this.store.getSchema(t), s = { node: i, id: i.id, info: i.info, path: i.path, schemaPath: i.schemaPath, schema: r, region: e };
                return this.plugins.forEach((function (e) {
                    var t, r = null === (t = e.buildSubRenderers) || void 0 === t ? void 0 : t.call(e, s, a, l.getRenderers());
                    r && (Array.isArray(r) ? r : [r]).forEach((function (t) { return a.push(n.__assign(n.__assign({}, t), { id: o.guid(), plugin: e, parent: i.info, order: t.order || 0 })) }))
                })), a
            }, e.prototype.buildRenderers = function (e) { this.store.setSubRenderers(this.collectRenderers(e)), this.store.changeSubRendererRegion(e || "") }, e.prototype.rebuild = function () { this.buildRenderers(), this.buildToolbars(), this.buildPanels() }, e.prototype.switchToRegion = function (e) { this.store.activeId && this.buildRenderers(e) }, e.prototype.showInsertPanel = function (e, t, a, n, l, i) {
                var o, r, s;
                if (void 0 === t && (t = this.store.activeId), void 0 === n && (n = "insert"), void 0 === l && (l = ""), void 0 === a && t) {
                    var d = this.store.getNodeById(t);
                    a = null === (s = null === (r = null === (o = null == d ? void 0 : d.info) || void 0 === o ? void 0 : o.regions) || void 0 === r ? void 0 : r.find((function (t) { return t.key === e }))) || void 0 === s ? void 0 : s.preferTag
                } this.store.setInsertRenderers(this.collectRenderers(e, t)), this.store.setInsertRegion(e, t, a, n, l, i)
            }, e.prototype.showReplacePanel = function (e, t) {
                var a = this.store.getNodeById(e), n = null == a ? void 0 : a.parent;
                if (a && n && n.isRegion && n.parent) {
                    var l = n.parent;
                    this.showInsertPanel(n.region, l.id, t, "replace", a.id)
                }
            }, e.prototype.on = function (e, t) { this.listeners.push({ type: e, fn: t }) }, e.prototype.off = function (e, t) {
                var a = m.default(this.listeners, (function (a) { return a.type === e && a.fn === t }));
                ~a && this.listeners.splice(a, 1)
            }, e.prototype.trigger = function (e, t) {
                var a, n, l = i.createEvent(e, t), r = o.camelize(/^(?:before|after)/.test(e) ? e : "on-" + e), s = this.listeners.filter((function (t) { return t.type === e }));
                return this.plugins.forEach((function (t) { return t[r] && s.push({ type: e, fn: t[r].bind(t) }) })), s.some((function (e) {
                    var t = e.fn.call(null, l);
                    return !1 === t ? (l.preventDefault(), l.stopPropagation()) : void 0 !== t && l.setData(t), l.stoped
                })), l.stoped || !1 !== (null === (n = (a = this.config)[r]) || void 0 === n ? void 0 : n.call(a, l)) || (l.preventDefault(), l.stopPropagation()), l
            }, e.prototype.insert = function () {
                return n.__awaiter(this, void 0, void 0, (function () {
                    var e, t, a, l, i, o, r;
                    return n.__generator(this, (function (n) {
                        switch (n.label) {
                            case 0: return e = this.store, (t = e.selectedInsertRendererInfo) ? (a = e.insertId, l = e.insertRegion, i = e.insertBeforeId, o = t.scaffold || { type: t.type }, t.scaffoldForm ? [4, this.scaffold(t.scaffoldForm, o)] : [3, 2]) : [2];
                            case 1: o = n.sent(), n.label = 2;
                            case 2: return (r = this.addChild(a, l, o, i, t)) && (e.closeInsertPanel(), setTimeout((function () { e.setActiveId(r.$$id) }), 100)), [2]
                        }
                    }))
                }))
            }, e.prototype.replace = function () {
                return n.__awaiter(this, void 0, void 0, (function () {
                    var e, t, a, l, i, o = this;
                    return n.__generator(this, (function (n) {
                        switch (n.label) {
                            case 0: return e = this.store, (t = e.selectedInsertRendererInfo) ? (a = e.insertOrigId, l = t.scaffold || { type: t.type }, i = e.insertRegion, t.scaffoldForm ? [4, this.scaffold(t.scaffoldForm, l)] : [3, 2]) : [2];
                            case 1: l = n.sent(), n.label = 2;
                            case 2: return this.replaceChild(a, l, t, i) && (e.closeInsertPanel(), setTimeout((function () { o.rebuild() }), 4)), [2]
                        }
                    }))
                }))
            }, e.prototype.getEditorInfo = function (e, t, a) {
                var l = null, i = a.$$id ? this.store.getSchemaPath(a.$$id) : "", o = { renderer: e, path: t, schemaPath: i, schema: a }, r = this.trigger("before-resolve-editor-info", o);
                return r.prevented ? r.context.data : (this.plugins.some((function (t) {
                    var r, s = null === (r = t.getRendererInfo) || void 0 === r ? void 0 : r.call(t, o);
                    return !!s && (l = n.__assign(n.__assign({ id: a.$$id }, s), { plugin: t, renderer: e, schemaPath: i }), !0)
                })), this.trigger("after-resolve-editor-info", n.__assign(n.__assign({}, o), { data: l })).context.data)
            }, e.prototype.panelChangeValue = function (e, t) {
                var a = this.store, l = n.__assign(n.__assign({}, this.buildEventContext(a.activeId)), { value: e, diff: t });
                this.trigger("before-update", l).prevented || (a.changeValue(e, t), this.trigger("after-update", l))
            }, e.prototype.openSubEditor = function (e) { this.store.openSubEditor(e) }, e.prototype.openContextMenu = function (e, t, a) {
                var l = this, i = [], o = this.buildEventContext(e), r = n.__assign(n.__assign({}, o), { selections: this.store.selections.map((function (e) { return l.buildEventContext(e) })), region: t, data: i });
                (i = this.buildContextMenus(r)).length && (this.store.setContextId(e), p.openContextMenus({ x: a.x, y: a.y }, i, (function () { return l.store.setContextId("") })))
            }, e.prototype.buildContextMenus = function (e) {
                return this.plugins.forEach((function (t) {
                    var a;
                    null === (a = t.buildEditorContextMenu) || void 0 === a || a.call(t, e, e.data)
                })), this.trigger("build-context-menus", e), e.data
            }, e.prototype.closeContextMenu = function () { }, e.prototype.moveUp = function () {
                var e, t = this.store;
                if (t.activeId) {
                    var a = t.getNodeById(t.activeId), l = a.parent, i = a.host, o = this.buildEventContext(i), r = n.__assign(n.__assign({}, o), { sourceId: a.id, direction: "up", beforeId: null === (e = a.prevSibling) || void 0 === e ? void 0 : e.id, region: l.region });
                    this.trigger("before-move", r).prevented || (t.moveUp(a.id), this.buildToolbars(), this.trigger("after-move", r))
                }
            }, e.prototype.moveDown = function () {
                var e, t, a = this.store;
                if (a.activeId) {
                    var l = a.getNodeById(a.activeId), i = l.parent, o = l.host, r = this.buildEventContext(o), s = n.__assign(n.__assign({}, r), { sourceId: l.id, direction: "up", beforeId: null === (t = null === (e = l.nextSibling) || void 0 === e ? void 0 : e.nextSibling) || void 0 === t ? void 0 : t.id, region: i.region });
                    this.trigger("before-move", s).prevented || (a.moveDown(l.id), this.buildToolbars(), this.trigger("after-move", s))
                }
            }, e.prototype.del = function (e) {
                if (e && e.length) {
                    var t = Array.isArray(e) ? e[0] : e, a = n.__assign(n.__assign({}, this.buildEventContext(t)), { data: Array.isArray(e) ? e.concat() : [] });
                    this.trigger("before-delete", a).prevented || (Array.isArray(a.data) && a.data.length ? this.store.delMulti(a.data) : this.store.del(t), this.trigger("after-delete", a))
                }
            }, e.prototype.duplicate = function (e) { this.store.duplicate(e) }, e.prototype.copy = function (e) {
                var t = this.store.getValueOf(e);
                this.clipboardData = c.stringify(t), p.toast.info("??????????????????")
            }, e.prototype.cut = function (e) { this.copy(e), this.del(e) }, e.prototype.paste = function (e, t) {
                return n.__awaiter(this, void 0, void 0, (function () {
                    var a;
                    return n.__generator(this, (function (n) { return this.clipboardData ? (a = c.parse(this.clipboardData), t ? this.addChild(e, t, a) : this.replaceChild(e, a), [2]) : (p.alert("?????????????????????"), [2]) }))
                }))
            }, e.prototype.emptyRegion = function (e, t) { this.store.emptyRegion(e, t) }, e.prototype.addChild = function (e, t, a, l, i, o) {
                var r = this.store, s = -1, d = this.buildEventContext(e);
                if (l) {
                    var u = d.schema[t];
                    Array.isArray(u) && (s = m.default(u, (function (e) { return (null == e ? void 0 : e.$$id) === l })))
                } var p = n.__assign(n.__assign({}, d), { beforeId: l, index: s, region: t, data: a, subRenderer: i, dragInfo: o }), c = this.trigger("before-insert", p);
                if (!c.prevented) {
                    var h = r.insertSchema(c);
                    return this.trigger("after-insert", p), h
                } return null
            }, e.prototype.move = function (e, t, a, l) {
                var i = this.store, o = n.__assign(n.__assign({}, this.buildEventContext(e)), { beforeId: l, region: t, sourceId: a }), r = this.trigger("before-move", o);
                return !r.prevented && (i.moveSchema(r), this.trigger("after-move", o), !0)
            }, e.prototype.replaceChild = function (e, t, a, l) {
                var i = n.__assign(n.__assign({}, this.buildEventContext(e)), { data: t, subRenderer: a, region: l }), o = this.trigger("before-replace", i);
                return !(o.prevented || !o.context.data) && (this.store.replaceChild(e, o.context.data), this.trigger("after-replace", i), !0)
            }, e.prototype.setActiveId = function (e) { this.store.setActiveId(e) }, e.prototype.openConfigPanel = function (e) {
                var t = this.store;
                t.activeId !== e && t.setActiveId(e), t.changePanelKey("config", !0)
            }, e.prototype.openCodePanel = function (e) {
                var t = this.store;
                t.activeId !== e && t.setActiveId(e), t.changePanelKey("code", !0)
            }, e.prototype.toggleSelection = function (e) {
                var t = this.store, a = t.selections.concat();
                !a.length && t.activeId && a.push(t.activeId);
                var n = a.indexOf(e);
                ~n ? a.splice(n, 1) : a.push(e), this.setSelection(a, e)
            }, e.prototype.setSelection = function (e, t) {
                var a = this;
                void 0 === t && (t = e[0]);
                var l = this.store, i = this.buildEventContext(t), o = n.__assign(n.__assign({}, i), { selections: e.map((function (e) { return a.buildEventContext(e) })), data: e });
                this.trigger("selection-change", o).prevented || (1 === (e = o.data).length ? l.setActiveId(e[0]) : l.setActiveId("", e))
            }, e.prototype.startDrag = function (e, t) { t.persist(), this.dnd.startDrag(e, t.nativeEvent) }, e.prototype.scaffold = function (e, t) {
                return n.__awaiter(this, void 0, void 0, (function () {
                    var a = this;
                    return n.__generator(this, (function (l) { return [2, new Promise((function (l) { a.store.openScaffoldForm(n.__assign(n.__assign({}, e), { value: e.pipeIn ? e.pipeIn(t) : t, callback: l })) }))] }))
                }))
            }, e.prototype.reScaffold = function (e, t, a) {
                return n.__awaiter(this, void 0, void 0, (function () {
                    var l;
                    return n.__generator(this, (function (n) {
                        switch (n.label) {
                            case 0: return [4, this.scaffold(t, a)];
                            case 1: return l = n.sent(), this.replaceChild(e, l), [2]
                        }
                    }))
                }))
            }, e.prototype.patchSchema = function (e) {
                var t = this;
                if (void 0 === e && (e = !1), !this.patching) {
                    this.patching = !0;
                    var a = function (n) { n.forEach((function (n) { n.uniqueChildren && n.uniqueChildren.length && a(n.uniqueChildren), n.isRegion || n.patch(t.store, e) })) };
                    a(this.store.root.children), this.patching = !1
                }
            }, e.prototype.hackRenderers = function (e) {
                var t = this;
                void 0 === e && (e = l.getRenderers());
                var a = [];
                e.forEach((function (e) {
                    t.plugins.filter((function (t) {
                        var a;
                        return Array.isArray(null == t ? void 0 : t.regions) && t.regions.some((function (a) {
                            var n;
                            return a.renderMethod && (null !== (n = a.rendererName) && void 0 !== n ? n : t.rendererName) === e.name
                        })) || t.overrides && (null !== (a = t.overrideTargetRendererName) && void 0 !== a ? a : t.rendererName) === e.name
                    })).forEach((function (t) {
                        var n, l, i = null === (n = t.regions) || void 0 === n ? void 0 : n.filter((function (a) {
                            var n;
                            return a.renderMethod && (null !== (n = a.rendererName) && void 0 !== n ? n : t.rendererName) === e.name
                        }));
                        (null == i ? void 0 : i.length) && a.push({ renderer: e, regions: i }), t.overrides && (null !== (l = t.overrideTargetRendererName) && void 0 !== l ? l : t.rendererName) === e.name && a.push({ renderer: e, overrides: t.overrides })
                    }))
                })), a.forEach((function (e) {
                    var t = e.regions, a = e.renderer, n = e.overrides;
                    return s.hackIn(a, t, n)
                }))
            }, e.prototype.makeWrapper = function (e, t) { return s.makeWrapper(this, e, t) }, e.prototype.makeSchemaFormRender = function (e) { return s.makeSchemaFormRender(this, e) }, e.prototype.onWidthChangeStart = function (e, t) { return this.trigger("width-change-start", n.__assign(n.__assign({}, t), { nativeEvent: e })) }, e.prototype.onHeightChangeStart = function (e, t) { return this.trigger("height-change-start", n.__assign(n.__assign({}, t), { nativeEvent: e })) }, e.prototype.onSizeChangeStart = function (e, t) { return this.trigger("size-change-start", n.__assign(n.__assign({}, t), { nativeEvent: e })) }, e.prototype.openNodePopOverForm = function (e) {
                var t, a, n, l, i = "string" == typeof e ? this.store.getNodeById(e) : e;
                if (i && ((null === (a = null === (t = i.info) || void 0 === t ? void 0 : t.plugin) || void 0 === a ? void 0 : a.popOverBody) || (null === (l = null === (n = i.info) || void 0 === n ? void 0 : n.plugin) || void 0 === l ? void 0 : l.popOverBodyCreator))) {
                    var o = i.info.plugin, r = this.store, s = { body: o.popOverBodyCreator ? o.popOverBodyCreator(this.buildEventContext(i)) : o.popOverBody, value: r.getValueOf(i.id), callback: this.panelChangeValue, target: function () { return document.querySelector('[data-editor-id="' + i.id + '"]') } };
                    r.openPopOverForm(s)
                }
            }, e.prototype.dispose = function () { this.toDispose.forEach((function (e) { return e() })), this.toDispose = [], this.listeners.splice(0, this.listeners.length), this.lazyPatchSchema.cancel(), this.dnd.dispose() }, n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object, Object]), n.__metadata("design:returntype", void 0)], e.prototype, "panelChangeValue", null), e
        }();
        t.EditorManager = b
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.BasePlugin = t.createEvent = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = n.__importDefault(a(12));
        t.createEvent = function (e, t) {
            var a = { context: t, type: e, prevented: !1, stoped: !1, preventDefault: function () { a.prevented = !0 }, stopPropagation: function () { a.stoped = !0 }, get data() { return a.context.data }, setData: function (e) { a.context.data = e } };
            return a
        };
        var o = function () {
            function e(e) { this.manager = e } return e.prototype.getRendererInfo = function (e) {
                var t = e.renderer;
                if (e.schema.$$id && this.name && this.rendererName && this.rendererName === t.name) return { name: this.name, regions: this.regions, patchContainers: this.patchContainers, vRendererConfig: this.vRendererConfig, wrapperProps: this.wrapperProps, wrapperResolve: this.wrapperResolve, filterProps: this.filterProps, $schema: this.$schema, renderRenderer: this.renderRenderer, multifactor: this.multifactor, scaffoldForm: this.scaffoldForm }
            }, e.prototype.buildEditorPanel = function (e, t) {
                var a, l, i, o;
                if (!e.selections.length && (!e.info.hostId && (this.panelControls || this.panelControlsCreator || this.panelBody || this.panelBodyCreator) && e.info.plugin === this ? t.push({ key: "config", icon: this.panelIcon || this.icon || "fa fa-cog", title: this.panelTitle || "??????", render: this.manager.makeSchemaFormRender({ definitions: this.panelDefinitions, submitOnChange: this.panelSubmitOnChange, api: this.panelApi, body: this.panelBodyCreator ? this.panelBodyCreator(e) : this.panelBody, controls: this.panelControlsCreator ? this.panelControlsCreator(e) : this.panelControls }) }) : e.info.plugin === this && e.info.hostId && ((null === (a = this.vRendererConfig) || void 0 === a ? void 0 : a.panelControls) || (null === (l = this.vRendererConfig) || void 0 === l ? void 0 : l.panelControlsCreator) || (null === (i = this.vRendererConfig) || void 0 === i ? void 0 : i.panelBody) || (null === (o = this.vRendererConfig) || void 0 === o ? void 0 : o.panelBodyCreator)) && t.push({ key: e.info.multifactor ? "vconfig" : "config", icon: this.vRendererConfig.panelIcon || "fa fa-cog", title: this.vRendererConfig.panelTitle || "??????", render: this.manager.makeSchemaFormRender({ submitOnChange: this.panelSubmitOnChange, api: this.panelApi, definitions: this.vRendererConfig.panelDefinitions, controls: this.vRendererConfig.panelControlsCreator ? this.vRendererConfig.panelControlsCreator(e) : this.vRendererConfig.panelControls, body: this.vRendererConfig.panelBodyCreator ? this.vRendererConfig.panelBodyCreator(e) : this.vRendererConfig.panelBody }) }), e.info.plugin === this && e.info.multifactor)) {
                    var r = e.node.sameIdChild;
                    if (r) this.manager.collectPanels(r, !1, !0).forEach((function (e) {
                        var a, l;
                        if ("code" === e.key) t.some((function (e) { return "code" === e.key })) || t.push(e);
                        else if ("renderers" === e.key) { t.some((function (e) { return "renderers" === e.key })) || t.push(e) } else "commonConfig" === e.key || "name-list" === e.key || t.push(n.__assign(n.__assign({}, e), { key: "sub-" + e.key, icon: (null === (l = null === (a = r.info) || void 0 === a ? void 0 : a.plugin) || void 0 === l ? void 0 : l.icon) || e.icon }))
                    }))
                }
            }, e.prototype.buildSubRenderers = function (e, t) {
                var a = this;
                return Array.isArray(a.scaffolds) ? a.scaffolds.map((function (e) {
                    var t, n, l, i, o, r, s, d;
                    return { name: null !== (t = e.name) && void 0 !== t ? t : a.name, icon: null !== (n = e.icon) && void 0 !== n ? n : a.icon, description: null !== (l = e.description) && void 0 !== l ? l : a.description, previewSchema: null !== (i = e.previewSchema) && void 0 !== i ? i : a.previewSchema, tags: null !== (o = e.tags) && void 0 !== o ? o : a.tags, docLink: null !== (r = e.docLink) && void 0 !== r ? r : a.docLink, type: null !== (s = e.type) && void 0 !== s ? s : a.type, scaffold: null !== (d = e.scaffold) && void 0 !== d ? d : a.scaffold, scaffoldForm: a.scaffoldForm }
                })) : a.name && a.description ? { name: a.name, icon: a.icon, description: a.description, previewSchema: a.previewSchema, tags: a.tags, docLink: a.docLink, type: a.type, scaffold: a.scaffold, scaffoldForm: a.scaffoldForm } : void 0
            }, e.prototype.buildEditorContextMenu = function (e, t) {
                var a, n, l = this, i = e.id, o = e.schema, r = (e.region, e.info), s = this;
                r.plugin === s && ((null === (a = s.scaffoldForm) || void 0 === a ? void 0 : a.canRebuild) || (null === (n = r.scaffoldForm) || void 0 === n ? void 0 : n.canRebuild)) && t.push({ label: "???????????????" + r.plugin.name + "???", disabled: o.$$commonSchema, onSelect: function () { return l.manager.reScaffold(i, r.scaffoldForm || s.scaffoldForm, o) } })
            }, e.prototype.renderPlaceholder = function (e, t) { return l.default.createElement("div", { key: t, className: "wrapper-sm b-a b-light m-b-sm", children: l.default.createElement("span", { className: "text-muted", children: e }) }) }, e.prototype.getPlugin = function (e) { return i.default(this.manager.plugins, (function (t) { return "string" == typeof e ? t.rendererName === e : t instanceof e })) }, e
        }();
        t.BasePlugin = o
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.defaultValue = t.valuePipeOut = t.setSchemaTpl = t.getSchemaTpl = void 0;
        var n, l, i = a(0), o = a(6), r = a(12), s = a(5), d = i.__importDefault(a(18)), u = a(4), p = {
            formItemName: { label: "?????????", name: "name", type: "input-text" }, formItemMode: { label: "?????????????????????", name: "mode", type: "button-group-select", size: "sm", option: "??????", pipeIn: m(""), options: [{ label: "??????", value: "" }, { label: "??????", value: "normal" }, { label: "??????", value: "inline" }, { label: "??????", value: "horizontal" }] }, formItemInline: { label: "???????????????", name: "inline", type: "switch", visibleOn: 'data.mode != "inline"', mode: "inline", className: "w-full", pipeIn: m(!1) }, formItemSize: { name: "size", label: "????????????", type: "button-group-select", size: "sm", pipeIn: m("full"), options: [{ label: "??????", value: "xs" }, { label: "???", value: "sm" }, { label: "???", value: "md" }, { label: "???", value: "lg" }, { label: "??????", value: "" }] }, minLength: { name: "minLength", type: "input-number", label: "??????????????????" }, maxLength: { name: "maxLength", type: "input-number", label: "??????????????????" }, label: [{ label: "Label", name: "label", type: "input-text", hiddenOn: "data.label === false" }, { name: "label", label: "?????? Label", type: "switch", mode: "inline", className: "w-full", pipeIn: function (e) { return !1 === e }, pipeOut: function (e) { return !0 !== e && "" }, visibleOn: '__props__.formMode === "horizontal" || data.mode === "horizontal" || data.label ===false', description: "??? form ??????????????????????????????????????????????????????" }], placeholder: { label: "?????????", name: "placeholder", type: "input-text", placeholder: "?????????" }, tabs: function (e) { return { type: "tabs", tabsMode: "line", contentClassName: "no-border", tabs: e.filter((function (e) { return e })).map((function (e) { return i.__assign(i.__assign({}, e), { body: d.default(e.body) }) })) } }, fieldSet: function (e) { return i.__assign(i.__assign({ collapsable: !0, collapsed: !1 }, e), { type: "fieldset", title: e.title, body: d.default(e.body.filter((function (e) { return e }))) }) }, clearable: { type: "switch", name: "clearable", mode: "inline", className: "w-full", label: "??????????????????" }, hint: { label: "????????????", type: "input-text", name: "hint", description: "???????????????????????????????????????????????????????????????????????????" }, remark: [{ label: "??????????????????", type: "switch", name: "remark", mode: "inline", className: "w-full", description: "????????????????????????????????? icon????????????????????????????????????????????????????????????????????????????????????????????????????????? icon ?????????????????????", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? { icon: "fa fa-question-circle", trigger: ["hover", "focus"], className: "Remark--warning" } : null } }, { type: "combo", name: "remark", className: "no-padder", visibleOn: "this.remark", multiLine: !0, items: [{ name: "title", type: "input-text", label: "??????" }, { name: "content", type: "textarea", label: "??????" }, { name: "placement", type: "button-group-select", size: "xs", label: "????????????", options: [{ label: "???", value: "left" }, { label: "???", value: "top" }, { label: "???", value: "right" }, { label: "???", value: "bottom" }] }, { name: "icon", label: "??????", type: "icon-picker" }, { name: "className", label: "CSS ??????", type: "input-text", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: '?????????????????? CSS ?????????????????? <a href="http://amis.baidu.com/v2/docs/style" target="_blank">????????????</a>????????????????????????????????????????????????????????????????????????????????????????????????', placement: "left" } }, { name: "trigger", type: "select", label: "????????????", multiple: !0, pipeIn: function (e) { return Array.isArray(e) ? e.join(",") : [] }, pipeOut: function (e) { return e && e.length ? e.split(",") : void 0 }, options: [{ label: "????????????", value: "hover" }, { label: "??????", value: "click" }] }, { name: "rootClose", visibleOn: '~this.trigger.indexOf("click")', label: "??????????????????", type: "switch" }] }], labelRemark: [{ label: "?????? Label ????????????", type: "switch", name: "labelRemark", mode: "inline", className: "w-full", description: "??? Label ?????????????????? icon??????????????????????????????????????????", visibleOn: "this.label", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? { icon: "fa fa-question-circle", trigger: ["hover", "focus"], className: "Remark--warning" } : null } }, { type: "combo", name: "labelRemark", className: "no-padder", visibleOn: "this.labelRemark", multiLine: !0, items: [{ name: "title", type: "input-text", label: "??????" }, { name: "content", type: "textarea", label: "??????" }, { name: "placement", type: "button-group-select", size: "xs", label: "????????????", options: [{ label: "???", value: "left" }, { label: "???", value: "top" }, { label: "???", value: "right" }, { label: "???", value: "bottom" }] }, { name: "icon", label: "??????", type: "icon-picker" }, { name: "className", label: "CSS ??????", type: "input-text" }, { name: "trigger", type: "select", label: "????????????", multiple: !0, pipeIn: function (e) { return Array.isArray(e) ? e.join(",") : [] }, pipeOut: function (e) { return e && e.length ? e.split(",") : void 0 }, options: [{ label: "????????????", value: "hover" }, { label: "??????", value: "click" }] }, { name: "rootClose", visibleOn: '~this.trigger.indexOf("click")', label: "??????????????????", type: "switch" }] }], expression: { type: "input-text", description: "?????? JS ??????????????????`this.xxx == 1`" }, icon: { label: "??????", type: "icon-picker", name: "icon", placeholder: "??????????????????", clearable: !0, description: "" }, size: { label: "????????????", type: "button-group-select", name: "size", size: "sm", clearable: !0, options: [{ label: "??????", value: "xs" }, { label: "???", value: "sm" }, { label: "???", value: "md" }, { label: "???", value: "lg" }] }, name: { label: "??????", name: "name", type: "input-text", description: "????????????????????????????????????????????????????????????????????????????????????", placeholder: "???????????????????????????" }, reload: { label: "??????????????????", name: "reload", type: "input-text", description: "???????????????????????????????????????????????????????????????????????? <code>name</code> ???????????????????????????<code>,</code>??????????????????????????????????????????????????????????????????????????????<code>.</code>??????????????????????????????<code>xxForm.xxControl</code>?????????????????????????????????????????? <code>window</code>??????????????????????????????", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: "??????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" } }, className: { label: "CSS ??????", type: "ae-classname", name: "className", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: '?????????????????? CSS ?????????????????? <a href="https://baidu.github.io/amis/docs/concepts/style" target="_blank">????????????</a>????????????????????????????????????????????????????????????????????????????????????????????????', placement: "left" } }, api: function (e) {
                void 0 === e && (e = {});
                var t = e.name, a = e.label, n = e.value, l = e.description, r = e.sampleBuilder, d = i.__rest(e, ["name", "label", "value", "description", "sampleBuilder"]);
                return i.__assign({
                    type: "fieldSet", className: "", collapsable: !1, body: [{
                        type: "checkbox", label: a || "API", labelRemark: r ? { icon: "", label: "??????", title: "??????????????????", tooltipClassName: "ae-ApiSample-tooltip", render: function (e) { return u.createElement(s.Html, { className: "ae-ApiSample", inline: !1, html: "\n                    <pre><code>" + r(e) + "</code></pre>\n                    " }) }, trigger: "click", className: "m-l-xs", rootClose: !0, placement: "left" } : void 0, option: "????????????", name: t || "api", mode: "inline", className: "w-full m-b-sm", inputClassName: "pull-right text-sm m-t-sm p-t-none", onChange: function () { document.getElementsByClassName("ae-Settings-content")[0].scrollTop = 0 }, pipeIn: function (e) { return e && "string" != typeof e }, pipeOut: function (e, t) {
                            var a = s.buildApi(t);
                            return e ? { method: a.method, url: a.url } : a.url ? (a.method ? a.method + ":" : "") + a.url : ""
                        }
                    }, { name: t || "api", type: "input-text", value: n, placeholder: "http://", description: l, visibleOn: "!this." + (t || "api") + " || typeof this." + (t || "api") + " === 'string'", className: "m-b-none", labelRemark: {} }, {
                        type: "combo", name: t || "api", description: l, syncDefaultValue: !1, multiLine: !0, visibleOn: "this." + (t || "api") + " && typeof this." + (t || "api") + " !== 'string'", className: "m-b-none", messages: { validateFailed: "?????????????????????????????????????????????" }, pipeIn: function (e) {
                            if ("string" == typeof e) {
                                var t = e, a = "get", n = /^(raw:|external:)?(get|post|put|patch|delete):(.*)$/.exec(t);
                                return n && (t = n[1] + n[3], a = n[2]), { method: a, url: t }
                            } return e
                        }, items: [{ label: "????????????", name: "method", value: "get", type: "select", mode: "horizontal", horizontal: { leftFixed: "sm" }, options: [{ value: "get", label: "GET" }, { value: "post", label: "POST" }, { value: "put", label: "PUT" }, { value: "patch", label: "PATCH" }, { value: "delete", label: "DELETE" }] }, { label: "????????????", type: "input-text", name: "url", placeholder: "http://", required: !0 }, { type: "switch", label: "????????????", name: "data", mode: "inline", className: "w-full m-b-xs", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? { "&": "$$" } : null } }, { type: "tpl", visibleOn: "!this.data", inline: !1, className: "text-sm text-muted m-b", tpl: "???????????????????????????????????? API ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" }, {
                            type: "combo", syncDefaultValue: !1, name: "data", visibleOn: "this.data", descriptionClassName: "help-block text-xs m-b-none", description: '<p>?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????<code>{"a": "\\${a}", "b": 2}</code></p><p>???????????????????????????????????????????????????????????? Key ??? `&` Value ??? `\\$$` ??????????????????</p><div>????????? <code>__undefined</code>????????????????????????????????????????????????<code>{"&": "\\$$"}</code>???????????????????????????</div>', multiple: !0, pipeIn: function (e) {
                                if (!o.isObject(e)) return e;
                                var t = [];
                                return Object.keys(e).forEach((function (a) { t.push({ key: a || "", value: "string" == typeof e[a] ? e[a] : JSON.stringify(e[a]) }) })), t
                            }, pipeOut: function (e) {
                                if (!Array.isArray(e)) return e;
                                var t = {};
                                return e.forEach((function (e) {
                                    var a = e.key || "", n = e.value;
                                    try { n = JSON.parse(n) } catch (e) { } t[a] = n
                                })), t
                            }, items: [{ placeholder: "Key", type: "input-text", unique: !0, name: "key", required: !0, columnClassName: "w-xs" }, { placeholder: "Value", type: "input-text", name: "value" }]
                        }, { label: "????????????", type: "input-text", name: "sendOn", placeholder: '??????this.type == "123"', description: "?????????????????????????????????????????????" }, { type: "switch", label: "??????????????????", name: "cache", mode: "inline", className: "w-full m-b-xs", description: "????????????????????????????????????", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? 3e3 : void 0 } }, { type: "input-number", name: "cache", mode: "inline", min: 0, step: 500, visibleOn: "this.cache", pipeIn: function (e) { return "number" == typeof e ? e : 0 } }, { label: "????????????", type: "switch", name: "responseType", mode: "inline", className: "block", pipeIn: function (e) { return "blob" === e }, pipeOut: function (e) { return e ? "blob" : void 0 }, description: "????????????????????????????????????????????????????????????????????????" }, { label: "????????????", type: "button-group-select", name: "dataType", description: '?????????????????????<%= data.dataType === "json" ? "application/json" : data.dataType === "form-data" ? "multipart/form-data" : data.dataType === "form" ? "application/x-www-form-urlencoded" : "" %>??????????????????????????????????????????????????? form-data ?????????', size: "sm", className: "block", mode: "inline", options: [{ label: "JSON", value: "json" }, { label: "FormData", value: "form-data" }, { label: "Form", value: "form" }] }, { type: "switch", label: "????????????", name: "replaceData", mode: "inline", className: "w-full", description: "???????????????????????????????????????????????????????????????" }, { type: "switch", label: "??????????????????", name: "responseData", mode: "inline", className: "w-full m-b-xs", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? { "&": "$$" } : null } }, { type: "tpl", visibleOn: "!this.responseData", inline: !1, className: "text-sm text-muted m-b", tpl: "????????????????????????????????????????????????????????????????????????" }, {
                            type: "combo", syncDefaultValue: !1, name: "responseData", visibleOn: "this.responseData", descriptionClassName: "help-block text-xs m-b-none", multiple: !0, pipeIn: function (e) {
                                if (!o.isObject(e)) return e;
                                var t = [];
                                return Object.keys(e).forEach((function (a) { t.push({ key: a || "", value: "string" == typeof e[a] ? e[a] : JSON.stringify(e[a]) }) })), t
                            }, pipeOut: function (e) {
                                if (!Array.isArray(e)) return e;
                                var t = {};
                                return e.forEach((function (e) {
                                    var a = e.key || "", n = e.value;
                                    try { n = JSON.parse(n) } catch (e) { } t[a] = n
                                })), t
                            }, items: [{ placeholder: "Key", type: "input-text", unique: !0, name: "key", required: !0, columnClassName: "w-xs" }, { placeholder: "Value", type: "input-text", name: "value" }]
                        }, { title: "??????????????????", type: "fieldSet", className: "m-b-none", size: "sm", collapsable: !0, collapsedOn: "!this.requestAdaptor && !this.adaptor", body: [{ name: "requestAdaptor", type: "js-editor", allowFullscreen: !0, label: "???????????????", description: "???????????????(api) => api??? ????????? api.data ????????????????????? api ?????????" }, { name: "adaptor", type: "js-editor", allowFullscreen: !0, label: "???????????????", description: "????????????: (payload, response, api) => payload" }] }]
                    }]
                }, d)
            }, source: function (e) { return void 0 === e && (e = {}), c("api", i.__assign({ name: "source", label: "??????????????????", description: "????????????????????????????????????????????????????????????", sampleBuilder: function (e) { return JSON.stringify({ status: 0, msg: "", data: { options: [{ label: "??????A", value: "a" }, { label: "??????B", value: "b" }] } }, null, 2) } }, e)) }, autoFill: {
                type: "combo", name: "autoFill", label: "????????????", descriptionClassName: "help-block text-xs m-b-none", description: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????", multiple: !0, pipeIn: function (e) {
                    if (!o.isObject(e)) return e;
                    var t = [];
                    return Object.keys(e).forEach((function (a) { t.push({ key: a || "", value: "string" == typeof e[a] ? e[a] : JSON.stringify(e[a]) }) })), t
                }, pipeOut: function (e) {
                    if (!Array.isArray(e)) return e;
                    var t = {};
                    return e.forEach((function (e) {
                        var a = e.key || "", n = e.value;
                        try { n = JSON.parse(n) } catch (e) { } t[a] = n
                    })), console.log("obj", t), t
                }, items: [{ placeholder: "Key", type: "input-text", unique: !0, name: "key", required: !0, columnClassName: "w-xs" }, { placeholder: "Value", type: "input-text", name: "value" }]
            }, apiString: { name: "api", type: "input-text", placeholder: "http://" }, required: { name: "required", type: "switch", mode: "inline", className: "w-full", label: "????????????" }, description: { name: "description", type: "textarea", label: "??????", pipeIn: function (e, t) { return e || t.desc || "" } }, options: {
                label: "?????? Options", name: "options", type: "combo", multiple: !0, draggable: !0, addButtonText: "????????????", scaffold: { label: "", value: "" }, items: [{ type: "input-text", name: "label", placeholder: "??????", required: !0 }, {
                    type: "select", name: "value", pipeIn: function (e) { return "string" == typeof e ? "text" : "boolean" == typeof e ? "boolean" : "number" == typeof e ? "number" : "text" }, pipeOut: function (e, t) {
                        if ("text" === e) return String(t);
                        if ("number" === e) {
                            var a = Number(t);
                            return isNaN(a) ? 0 : a
                        } return "boolean" === e ? Boolean(t) : ""
                    }, options: [{ label: "??????", value: "text" }, { label: "??????", value: "number" }, { label: "??????", value: "boolean" }]
                }, { type: "input-number", name: "value", placeholder: "???", visibleOn: 'typeof data.value === "number"', unique: !0 }, { type: "switch", name: "value", placeholder: "???", visibleOn: 'typeof data.value === "boolean"', unique: !0 }, { type: "input-text", name: "value", placeholder: "???", visibleOn: 'typeof data.value === "undefined" || typeof data.value === "string"', unique: !0 }]
            }, tree: { label: "?????? Options", name: "options", type: "combo", multiple: !0, draggable: !0, addButtonText: "????????????", description: "???????????????????????????????????????????????????????????????????????? source ???????????????", scaffold: { label: "", value: "" }, items: [{ type: "input-text", name: "label", placeholder: "??????", required: !0 }, { type: "input-text", name: "value", placeholder: "???", unique: !0 }] }, horizontalMode: { label: "???????????????????????????", name: "horizontal", type: "switch", onText: "??????", offText: "?????????", mode: "inline", className: "w-full", inputClassName: "text-sm", visibleOn: 'this.mode == "horizontal" && this.label !== false', pipeIn: function (e) { return !e }, pipeOut: function (e, t, a) { return e ? null : a.formHorizontal || { leftFixed: "normal" } } }, horizontal: {
                type: "combo", syncDefaultValue: !1, name: "horizontal", multiLine: !0, visibleOn: 'data.mode == "horizontal" && data.label !== false && data.horizontal', pipeIn: function (e) { return { leftRate: e && "number" == typeof e.left ? e.left : e && /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(e.left) ? parseInt(RegExp.$1, 10) : 2, leftFixed: e && e.leftFixed || "" } }, pipeOut: function (e) {
                    var t = Math.min(11, Math.max(1, e.leftRate || 2));
                    return { leftFixed: e.leftFixed || "", left: t, right: 12 - t }
                }, inputClassName: "no-padder", items: [{ name: "leftFixed", type: "button-group-select", label: "????????????", size: "xs", options: [{ label: "??????", value: "" }, { label: "?????????", value: "sm", visibleOn: "this.leftFixed" }, { label: "????????????", value: "normal" }, { label: "?????????", value: "lg", visibleOn: "this.leftFixed" }] }, { name: "leftRate", type: "input-range", visibleOn: "!this.leftFixed", min: 1, max: 11, step: 1, label: "??????????????????(n/12)", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: "?????? 12 ????????????????????????????????????????????? n/12???", placement: "left" } }]
            }, subFormItemMode: { label: "?????????????????????", name: "subFormMode", type: "button-group-select", size: "sm", option: "??????", pipeIn: m(""), options: [{ label: "??????", value: "" }, { label: "??????", value: "normal" }, { label: "??????", value: "inline" }, { label: "??????", value: "horizontal" }] }, subFormHorizontalMode: { label: "???????????????????????????", name: "subFormHorizontal", type: "switch", onText: "??????", offText: "?????????", mode: "inline", className: "w-full", inputClassName: "text-sm", visibleOn: 'this.subFormMode == "horizontal"', pipeIn: function (e) { return !e }, pipeOut: function (e, t, a) { return e ? null : a.formHorizontal || { leftFixed: "normal" } } }, subFormHorizontal: {
                type: "combo", syncDefaultValue: !1, visibleOn: 'data.subFormMode == "horizontal" && data.subFormHorizontal', name: "subFormHorizontal", multiLine: !0, pipeIn: function (e) { return { leftRate: e && "number" == typeof e.left ? e.left : e && /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(e.left) ? parseInt(RegExp.$1, 10) : 2, leftFixed: e && e.leftFixed || "" } }, pipeOut: function (e) {
                    var t = Math.min(11, Math.max(1, e.leftRate || 2));
                    return { leftFixed: e.leftFixed || "", left: t, right: 12 - t }
                }, inputClassName: "no-padder", items: [{ name: "leftFixed", type: "button-group-select", label: "????????????", size: "xs", options: [{ label: "??????", value: "" }, { label: "?????????", value: "sm", visibleOn: "this.leftFixed" }, { label: "????????????", value: "normal" }, { label: "?????????", value: "lg", visibleOn: "this.leftFixed" }] }, { name: "leftRate", type: "input-range", visibleOn: "!this.leftFixed", min: 1, max: 11, step: 1, label: "??????????????????(n/12)", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: "?????? 12 ????????????????????????????????????????????? n/12???", placement: "left" } }]
            }, validations: (n = [{ label: "????????????", value: "isEmail" }, { label: "Url??????", value: "isUrl" }, { label: "??????", value: "isNumeric" }, { label: "??????", value: "isAlpha" }, { label: "???????????????", value: "isAlphanumeric" }, { label: "????????????", value: "isInt" }, { label: "???????????????", value: "isFloat" }, { label: "????????????", value: "isLength" }, { label: "????????????", value: "maxLength" }, { label: "????????????", value: "minLength" }, { label: "?????????", value: "maximum" }, { label: "?????????", value: "minimum" }, { label: "????????????", value: "isPhoneNumber" }, { label: "????????????", value: "isTelNumber" }, { label: "????????????", value: "isZipcode" }, { label: "???????????????", value: "isId" }, { label: "JSON??????", value: "isJson" }, { label: "??????????????????", value: "equals" }, { label: "????????????????????????", value: "equalsField" }, { label: "???????????????", value: "matchRegexp" }, { label: "???????????????2", value: "matchRegexp1" }, { label: "???????????????3", value: "matchRegexp2" }, { label: "???????????????4", value: "matchRegexp3" }, { label: "???????????????5", value: "matchRegexp4" }], l = ["isEmail", "isUrl", "isNumeric", "isAlpha", "isAlphanumeric", "isInt", "isFloat", "isJson", "isPhoneNumber", "isTelNumber", "isZipcode", "isId"], {
                type: "combo", syncDefaultValue: !1, name: "validations", label: "????????????", addButtonText: "????????????", multiple: !0, pipeIn: function (e) {
                    if ("string" == typeof e && e && (e = s.str2rules(e)), !o.isObject(e)) return e;
                    var t = [];
                    return Object.keys(e).forEach((function (a) {
                        var n;
                        /^\$\$/.test(a) || t.push(((n = { type: a })[a] = Array.isArray(e[a]) ? e[a][0] : e[a], n))
                    })), t
                }, pipeOut: function (e) {
                    if (!Array.isArray(e)) return e;
                    var t = {};
                    return e.forEach((function (e) {
                        var a, i = e.type || ((a = r(n, (function (e) { return !t[e.value] }))) ? a.value : "") || n[0].value;
                        t[i] = e[i] || !!~l.indexOf(i) || ""
                    })), t
                }, items: [{ type: "select", unique: !0, name: "type", options: n, columnClassName: "w-sm" }, { type: "input-number", name: "isLength", visibleOn: 'data.type == "isLength"', placeholder: "????????????", value: "1" }, { type: "input-number", name: "maximum", visibleOn: 'data.type == "maximum"', placeholder: "???????????????" }, { type: "input-number", name: "minimum", visibleOn: 'data.type == "minimum"', placeholder: "???????????????" }, { type: "input-number", name: "maxLength", visibleOn: 'data.type == "maxLength"', placeholder: "?????????????????????" }, { type: "input-number", name: "minLength", visibleOn: 'data.type == "minLength"', placeholder: "?????????????????????" }, { type: "input-text", name: "equals", visibleOn: 'data.type == "equals"', placeholder: "?????????", value: "" }, { type: "input-text", name: "equalsField", visibleOn: 'data.type == "equalsField"', placeholder: "???????????????", value: "" }, { type: "input-text", name: "matchRegexp", visibleOn: 'data.type == "matchRegexp"', placeholder: "??????????????????" }, { type: "input-text", name: "matchRegexp1", visibleOn: 'data.type == "matchRegexp1"', placeholder: "??????????????????" }, { type: "input-text", name: "matchRegexp2", visibleOn: 'data.type == "matchRegexp2"', placeholder: "??????????????????" }, { type: "input-text", name: "matchRegexp3", visibleOn: 'data.type == "matchRegexp3"', placeholder: "??????????????????" }, { type: "input-text", name: "matchRegexp4", visibleOn: 'data.type == "matchRegexp4"', placeholder: "??????????????????" }]
            }), validationErrors: function () {
                var e = [{ label: "????????????", value: "isEmail" }, { label: "Url??????", value: "isUrl" }, { label: "??????", value: "isNumeric" }, { label: "??????", value: "isAlpha" }, { label: "???????????????", value: "isAlphanumeric" }, { label: "????????????", value: "isInt" }, { label: "???????????????", value: "isFloat" }, { label: "????????????", value: "isLength" }, { label: "????????????", value: "maxLength" }, { label: "????????????", value: "minLength" }, { label: "?????????", value: "maximum" }, { label: "?????????", value: "minimum" }, { label: "JSON??????", value: "isJson" }, { label: "????????????", value: "isPhoneNumber" }, { label: "????????????", value: "isTelNumber" }, { label: "????????????", value: "isZipcode" }, { label: "???????????????", value: "isId" }, { label: "??????????????????", value: "equals" }, { label: "????????????????????????", value: "equalsField" }, { label: "???????????????", value: "matchRegexp" }, { label: "???????????????2", value: "matchRegexp1" }, { label: "???????????????3", value: "matchRegexp2" }, { label: "???????????????4", value: "matchRegexp3" }, { label: "???????????????5", value: "matchRegexp4" }], t = { isEmail: "Email ???????????????", isRequired: "???????????????", isUrl: "Url ???????????????", isInt: "?????????????????????", isAlpha: "???????????????", isNumeric: "???????????????", isAlphanumeric: "???????????????????????????", isFloat: "????????????????????????", isWords: "???????????????", isUrlPath: "??????????????????????????????`-` ??? `_`.", matchRegexp: "???????????????, ???????????????????????? `$1` ????????????", minLength: "??????????????????????????????????????? $1 ????????????", maxLength: "?????????????????????, ??????????????? $1 ???????????????", maximum: "?????????????????????????????? $1????????????", minimum: "?????????????????????????????? $1????????????", isJson: "????????? Json ?????????", isPhoneNumber: "??????????????????????????????", isTelNumber: "??????????????????????????????", isZipcode: "??????????????????????????????", isId: "??????????????????????????????", isLength: "?????????????????? $1 ?????????", notEmptyString: "??????????????????????????????", equalsField: "?????????????????? $1 ????????????", equals: "?????????????????? $1 ?????????" };
                return {
                    type: "combo", syncDefaultValue: !1, name: "validationErrors", label: "?????????????????????", description: "?????????????????????????????????????????????", addButtonText: "????????????", multiple: !0, pipeIn: function (e) {
                        if (!o.isObject(e)) return e;
                        var t = [];
                        return Object.keys(e).forEach((function (a) { /^\$\$/.test(a) || t.push({ type: a, msg: e[a] }) })), t
                    }, pipeOut: function (a) {
                        if (!Array.isArray(a)) return a;
                        var n = {};
                        return a.forEach((function (a) {
                            var l, i = a.type || ((l = r(e, (function (e) { return !n[e.value] }))) ? l.value : "") || e[0].value;
                            n[i] = a.msg || t[i] || ""
                        })), n
                    }, items: [{ type: "select", unique: !0, name: "type", options: e, columnClassName: "w-sm" }, { type: "input-text", name: "msg", placeholder: "????????????" }, { type: "formula", name: "msg", initSet: !1, formula: "({\n                        isEmail: 'Email ???????????????',\n                        isRequired: '???????????????',\n                        isUrl: 'Url ???????????????',\n                        isInt: '?????????????????????',\n                        isAlpha: '???????????????',\n                        isNumeric: '???????????????',\n                        isAlphanumeric: '???????????????????????????',\n                        isFloat: '????????????????????????',\n                        isWords: '???????????????',\n                        isUrlPath: '??????????????????????????????`-` ??? `_`.',\n                        matchRegexp: '???????????????, ???????????????????????? `$1` ????????????',\n                        minLength: '??????????????????????????????????????? $1 ????????????',\n                        maxLength: '?????????????????????, ??????????????? $1 ???????????????',\n                        maximum: '?????????????????????????????? $1????????????',\n                        minimum: '?????????????????????????????? $1????????????',\n                        isJson: '????????? Json ?????????',\n                        isLength: '?????????????????? $1 ?????????',\n                        notEmptyString: '??????????????????????????????',\n                        equalsField: '?????????????????? $1 ????????????',\n                        equals: '?????????????????? $1 ?????????',\n                        isPhoneNumber: '??????????????????????????????',\n                        isTelNumber: '??????????????????????????????',\n                        isZipcode: '??????????????????????????????',\n                        isId: '??????????????????????????????',\n                    })[data.type] || ''" }]
                }
            }(), submitOnChange: { label: "???????????????", type: "switch", name: "submitOnChange", mode: "inline", className: "w-full", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: "??????????????????????????????????????????????????????", placement: "left" } }, validateOnChange: { type: "button-group-select", name: "validateOnChange", label: "???????????????????????????", description: "????????????????????????????????????????????????????????????", size: "xs", mode: "inline", className: "w-full", options: [{ label: "??????", value: "" }, { label: "??????", value: !0 }, { label: "??????", value: !1 }], pipeIn: m(""), pipeOut: function (e) { return "" === e ? void 0 : !!e } }, visible: { type: "fieldSet", title: "????????????", collapsable: !0, body: [{ label: "????????????", name: "visible", type: "button-group-select", size: "xs", mode: "inline", className: "w-full", options: [{ label: "????????????", value: 1 }, { label: "?????????", value: 2 }], pipeIn: function (e) { return "boolean" == typeof e ? 1 : 2 }, pipeOut: function (e) { return 1 === e || "" }, onChange: function (e, t, a, n) { e ? n.setValues({ __visibleOn: n.data.visibleOn, visibleOn: "", clearValueOnHidden: !1 }) : n.setValueByName("visibleOn", n.data.__visibleOn) } }, { type: "switch", label: "??????(visible)", name: "visible", visibleOn: 'typeof this.visible === "boolean"', pipeIn: function (e, t) { return !1 !== e && !t.hidden }, mode: "inline", className: "w-full m-b-none", onChange: function (e, t, a, n) { return n.setValueByName("visibleOn", "") } }, { name: "visibleOn", label: "???????????????(visibleOn)", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: '????????? JS ?????????this ?????????????????????????????????<a href="https://baidu.github.io/amis/docs/concepts/expression">???????????????</a>', placement: "left" }, placeholder: "??????this.type === 1", type: "input-text", visibleOn: 'typeof this.visible !== "boolean"', autoComplete: !1, pipeIn: function (e, t) { return e || t.hiddenOn && "!(" + t.hiddenOn + ")" || "" }, className: "m-b-none" }] }, initFetch: { type: "group", label: "??????????????????", visibleOn: "this.initApi", direction: "vertical", className: "m-b-none", labelRemark: { trigger: "click", rootClose: !0, className: "m-l-xs", content: "??????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, body: [{ name: "initFetch", type: "radios", inline: !0, onChange: function () { document.getElementsByClassName("ae-Settings-content")[0].scrollTop = 0 }, options: [{ label: "???", value: !0 }, { label: "???", value: !1 }, { label: "?????????", value: "" }] }, { name: "initFetchOn", autoComplete: !1, visibleOn: 'typeof this.initFetch !== "boolean"', type: "input-text", placeholder: "??????this.id ????????? id ??????????????????", className: "m-t-n-sm" }] }, disabled: function (e) { return void 0 === e && (e = []), { type: "fieldSet", title: "????????????", collapsable: !0, body: i.__spreadArrays(e, [{ label: "????????????", name: "disabled", type: "button-group-select", size: "xs", mode: "inline", className: "w-full", options: [{ label: "????????????", value: 1 }, { label: "?????????", value: 2 }], pipeIn: function (e) { return "boolean" == typeof e ? 1 : 2 }, pipeOut: function (e) { return 1 !== e && "" } }, { type: "switch", label: "??????(disabled)", name: "disabled", visibleOn: 'typeof this.disabled === "boolean"', pipeIn: function (e, t) { return !1 !== e && !t.hidden }, mode: "inline", className: "w-full m-b-none", onChange: function (e, t, a, n) { return n.setValueByName("disabledOn", "") } }, { name: "disabledOn", label: "???????????????(disabledOn)", placeholder: "??????this.type === 1", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: '????????? JS ?????????this ?????????????????????????????????<a href="https://baidu.github.io/amis/docs/concepts/expression">???????????????</a>', placement: "left" }, type: "input-text", visibleOn: 'typeof this.disabled !== "boolean"', className: "m-b-none" }]) } }, switchDefaultValue: { type: "switch", name: "value", label: "???????????????", mode: "inline", className: "w-full", pipeIn: function (e) { return void 0 !== e }, pipeOut: function (e, t, a) { return e ? "" : void 0 }, remark: "?????????????????? name ??????" }, multiple: { label: "????????????", name: "multiple", type: "switch", mode: "inline", className: "w-full" }, joinValues: { type: "switch", name: "joinValues", mode: "inline", className: "w-full", visibleOn: "data.multiple", label: "???????????????", value: !0, description: "??????????????????????????? value ???????????????????????????????????????????????????????????????" }, delimiter: { type: "input-text", name: "delimiter", label: "?????????", visibleOn: "data.multiple && data.joinValues", pipeIn: m(",") }, extractValue: { type: "switch", name: "extractValue", mode: "inline", className: "w-full", label: "????????????value???", visibleOn: "data.joinValues === false", pipeIn: m(!1), description: "??????????????????????????? value ??????????????????????????????????????????????????????" }, creatable: { label: "???????????????", name: "creatable", type: "switch", mode: "inline", className: "w-full" }, createBtnLabel: { label: "??????????????????", name: "createBtnLabel", type: "input-text", mode: "inline", placeholder: "????????????", className: "w-full" }, editable: { label: "???????????????", name: "editable", type: "switch", mode: "inline", className: "w-full" }, removable: { label: "???????????????", name: "removable", type: "switch", mode: "inline", className: "w-full" }, ref: function () { return null }, imageUrl: { type: "input-text", label: "??????" }, markdownBody: { name: "value", type: "textarea", label: "Markdown ??????" }, richText: { label: "?????????", type: "input-rich-text", buttons: ["paragraphFormat", "quote", "color", "|", "bold", "italic", "underline", "strikeThrough", "|", "formatOL", "formatUL", "align", "|", "insertLink", "insertImage", "insertTable", "|", "undo", "redo", "fullscreen"], name: "html", description: '???????????? <code>\\${xxx}</code> ??????????????????????????? lodash.template ???????????????????????????<a target="_blank" href="https://baidu.gitee.io/amis/zh-CN/docs/concepts/template">??????</a>', size: "lg" }, showCounter: { label: "?????????????????????", name: "showCounter", type: "switch", mode: "inline", className: "w-full" }
        };
        function c(e, t) {
            var a = p[e];
            return "function" == typeof a ? a(t) : a ? t ? i.__assign(i.__assign({}, a), t) : a : null
        } function m(e, t) { return void 0 === t && (t = !0), t ? function (t) { return void 0 === t ? e : t } : function (t) { return t || e } } t.getSchemaTpl = c, t.setSchemaTpl = function (e, t) { p[e] = t }, t.valuePipeOut = function (e) {
            try {
                if ("undefined" === e) return;
                return JSON.parse(e)
            } catch (t) { return e }
        }, t.defaultValue = m
    },
    function (e, t) { e.exports = require("cc4bbf0") },
    function (e, t) { e.exports = require("167c905") },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.JSONTraverse = t.patchDiff = t.diff = t.repeatArray = t.reactionWithOldValue = t.camelize = t.removeDragingClass = t.addDragingClass = t.autobind = t.normalizeId = t.persistSet = t.persistGet = t.sortByList = t.blackList = t.filterSchemaForEditor = t.filterSchemaForConfig = t.deepFind = t.createElementFromHTML = t.JSONDuplicate = t.JSONMoveDownById = t.JSONCanMoveDown = t.JSONMoveUpById = t.JSONCanMoveUp = t.JSONChangeInArray = t.JSONMerge = t.JSONDelete = t.JSONUpdate = t.JSONGetParentById = t.JSONGetById = t.JSONGetPathById = t.JSONGetByPath = t.JSONPipeOut = t.JSONPipeIn = t.cleanUndefined = t.__uri = t.omitControls = t.makeHorizontalDeeper = t.noop = t.anyChanged = t.isObject = t.isObjectShallowModified = t.guid = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(31)), o = a(25), r = n.__importDefault(a(51)), s = n.__importDefault(a(32)), d = l.utils.guid, u = l.utils.omitControls, p = l.utils.isObjectShallowModified, c = l.utils.isObject, m = l.utils.anyChanged, h = l.utils.noop, f = l.utils.makeHorizontalDeeper, b = l.utils.findIndex;
        function g(e) { return c(e) ? (Object.keys(e).forEach((function (t) { void 0 === e[t] && delete e[t] })), e) : e } function v(e) {
            if (!c(e) || e.$$typeof) return e;
            if (Array.isArray(e)) return e.map(v);
            var t = {}, a = !1;
            return e.$$id || (a = !0, t.$$id = d()), Object.keys(e).forEach((function (n) {
                var l = e[n];
                if (Array.isArray(l)) {
                    var i = !1, o = l.map((function (e) {
                        var t = v(e);
                        return t !== e && (i = !0), t
                    }));
                    i && (a = !0, t[n] = o)
                } else { (o = v(l)) !== l && (a = !0, t[n] = o) }
            })), a && (e = g(n.__assign(n.__assign({}, e), t))), e
        } function y(e, t) {
            if (Array.isArray(e)) {
                var a = !1, l = e.map((function (e) {
                    var n = y(e, t);
                    return n !== e && (a = !0), n
                }));
                return a ? l : e
            } if (!c(e) || o.isObservable(e)) return e;
            var i = !1, r = {};
            return e.$$id && (i = !0, r.$$id = void 0), Object.keys(e).forEach((function (a) {
                var n = e[a];
                if ("function" == typeof t ? t(a, n) : t && "__" === a.substring(0, 2)) return r[a] = void 0, void (i = !0);
                var l = y(n, t);
                l !== n && (i = !0, r[a] = l)
            })), i && (e = g(n.__assign(n.__assign({}, e), r))), e
        } function _(e, t, a) {
            var n = e;
            return a && a.push(e), t.forEach((function (e) { n = n[e], a && a.push(n) })), n
        } function S(e, t) {
            for (var a = [], n = !1, l = [{ path: ".", data: e }], i = function () {
                var e = l.shift(), i = e.data, o = e.path;
                if (i.$$id === t) return n = !0, a = o.split(".").filter((function (e) { return e })), "break";
                Object.keys(i).forEach((function (e) {
                    var t = i[e];
                    Array.isArray(t) ? t.forEach((function (t, a) { c(t) && l.push({ data: t, path: o + "." + e + "." + a }) })) : c(t) && l.push({ data: t, path: o + "." + e })
                }))
            };
                l.length;
            ) { if ("break" === i()) break } return n ? a : null
        } function x(e, t, a) {
            void 0 === a && (a = !1);
            var n = S(e, t);
            if (null === n || !n.length) return null;
            var l = e, i = [l];
            for (n.pop(), n.forEach((function (e) { l = l[e], i.unshift(l) }));
                a && Array.isArray(i[0]);
            )i.shift();
            return i[0]
        } function C(e, t, a) {
            var l = S(e, t);
            if (null === l) return e;
            var i = parseInt(l.pop(), 10), o = [], r = _(e, l, o);
            if (!Array.isArray(r)) return e;
            for (o[o.length - 1] = r = r.concat(), a(r, r[i], i);
                o.length > 1;
            ) {
                var s = o.pop();
                Array.isArray(o[o.length - 1]) ? o[o.length - 1] = o[o.length - 1].concat() : o[o.length - 1] = n.__assign({}, o[o.length - 1]), o[o.length - 1][l[o.length - 1]] = s
            } return o[0]
        } function w(e, t, a) { return void 0 === a && (a = {}), (null == e ? void 0 : e.$$commonSchema) === t ? a[t] = e : s.default(e) ? Object.keys(e).forEach((function (n) { w(e[n], t, a) })) : Array.isArray(e) && e.map((function (e) { return w(e, t, a) })), a } t.guid = d, t.omitControls = u, t.isObjectShallowModified = p, t.isObject = c, t.anyChanged = m, t.noop = h, t.makeHorizontalDeeper = f, t.__uri = function (e) { return e }, t.cleanUndefined = g, t.JSONPipeIn = v, t.JSONPipeOut = y, t.JSONGetByPath = _, t.JSONGetPathById = S, t.JSONGetById = function (e, t) {
            var a = S(e, t);
            return null === a ? null : _(e, a)
        }, t.JSONGetParentById = x, t.JSONUpdate = function (e, t, a, l) {
            void 0 === l && (l = !1);
            var i = S(e, t);
            if (null === i) return e;
            var o = [], r = _(e, i, o);
            if (Array.isArray(a) && o[o.length - 2] && Array.isArray(o[o.length - 2])) {
                var s = o[o.length - 2].indexOf(o[o.length - 1]);
                o[o.length - 2] = o[o.length - 2].concat(), o[o.length - 2].splice.apply(o[o.length - 2], [s, 1].concat(a)), o.pop()
            } else o[o.length - 1] = r = n.__assign(n.__assign(n.__assign({}, l ? null : r), a), { $$id: t });
            for (;
                o.length > 1;
            ) {
                var d = o.pop();
                Array.isArray(o[o.length - 1]) ? o[o.length - 1] = o[o.length - 1].concat() : o[o.length - 1] = n.__assign({}, o[o.length - 1]), o[o.length - 1][i[o.length - 1]] = d
            } return o[0]
        }, t.JSONDelete = function (e, t, a, l) {
            var i = S(e, t);
            if (null === i) return e;
            Array.isArray(a) && a.push.apply(a, i);
            var o = i.pop(), r = [], s = _(e, i, r);
            for (Array.isArray(s) ? (r[r.length - 1] = s = s.concat(), s.splice(o, 1), l && !s.length && (r[r.length - 1] = void 0)) : (r[r.length - 1] = s = n.__assign({}, s), delete s[o]);
                r.length > 1;
            ) {
                var d = r.pop();
                Array.isArray(r[r.length - 1]) ? r[r.length - 1] = r[r.length - 1].concat() : r[r.length - 1] = n.__assign({}, r[r.length - 1]), void 0 === d ? delete r[r.length - 1][i[r.length - 1]] : r[r.length - 1][i[r.length - 1]] = d
            } return r[0]
        }, t.JSONMerge = function e(t, a) {
            if (!c(t) || !c(a)) return a;
            if (!p(t, a)) return t;
            var n = {};
            return t.$$id && (n.$$id = t.$$id), Object.keys(a).forEach((function (l) { Array.isArray(a[l]) && Array.isArray(t[l]) && a[l] !== t[l] ? n[l] = a[l].map((function (a, n) { return t[l][n] ? e(t[l][n], a) : a })) : void 0 === t[l] ? n[l] = a[l] : n[l] = e(t[l], a[l]) })), n
        }, t.JSONChangeInArray = C, t.JSONCanMoveUp = function (e, t) {
            var a = x(e, t);
            return !(!a || !Array.isArray(a)) && b(a, (function (e) { return e.$$id === t })) > 0
        }, t.JSONMoveUpById = function (e, t) { return C(e, t, (function (e, t, a) { 0 !== a && (e.splice(a, 1), e.splice(a - 1, 0, t)) })) }, t.JSONCanMoveDown = function (e, t) {
            var a = x(e, t);
            if (!a || !Array.isArray(a)) return !1;
            var n = b(a, (function (e) { return e.$$id === t }));
            return ~n && n < a.length - 1
        }, t.JSONMoveDownById = function (e, t) { return C(e, t, (function (e, t, a) { a !== e.length - 1 && (e.splice(a, 1), e.splice(a + 1, 0, t)) })) }, t.JSONDuplicate = function (e, t) {
            return C(e, t, (function (e, t, a) {
                var n = v(y(t));
                e.splice(a + 1, 0, n)
            }))
        }, t.createElementFromHTML = function (e) {
            var t = document.createElement("div");
            return t.innerHTML = e.trim(), t.firstChild
        }, t.deepFind = w, t.filterSchemaForConfig = function e(t, a) {
            if (Array.isArray(t)) return t.map((function (t) { return e(t, a) }));
            if (s.default(t)) {
                var l = {}, i = !1;
                return Object.keys(t).forEach((function (o) {
                    var r = t[o], s = e(r, a);
                    if (t.$$commonSchema ? l[o] && (l[o] = s) : l[o] = s, s !== r && (i = !0), "$$commonSchema" !== o || a) {
                        if ("$$commonSchema" === o && a) {
                            var d = w(a, r);
                            d[r] && (t = l = n.__assign({}, d[r]))
                        }
                    } else t = l = { $$commonSchema: r }
                })), i ? l : t
            } return t
        }, t.filterSchemaForEditor = function e(t) {
            if (Array.isArray(t)) return t.map((function (t) { return e(t) }));
            if (s.default(t)) {
                var a = {}, n = !1;
                return Object.keys(t).forEach((function (l) {
                    var i = t[l];
                    ~["visible", "visibleOn", "hidden", "hiddenOn", "toggled"].indexOf(l) && (l = "$$" + l, n = !0);
                    var o = e(i);
                    a[l] = o, o !== i && (n = !0)
                })), n ? a : t
            } return t
        }, t.blackList = function (e) { return function (t) { return !~e.indexOf(t) } }, t.sortByList = function (e, t) {
            var a = t ? "function" == typeof t ? t : function (e) { return e[t] } : function (e) { return e };
            return function (t, n) {
                var l = e.indexOf(a(t)), i = e.indexOf(a(n));
                return (l = ~l ? l : 999999) > (i = ~i ? i : 999999) ? 1 : l === i ? 0 : -1
            }
        }, t.persistGet = function (e, t) {
            var a = localStorage.getItem("amis-editor-" + e);
            return a && (a = JSON.parse(a)), a || t
        }, t.persistSet = function (e, t) { t = JSON.stringify(t), localStorage.setItem("amis-editor-" + e, t) }, t.normalizeId = function (e) { return e.replace(/\-[a-z0-9]+$/g, "") }, t.autobind = l.utils.autobind, t.addDragingClass = function (e) {
            for (;
                e && (e.classList.add("ae-is-draging"), !(null == (e = e.parentElement) ? void 0 : e.hasAttribute("data-region")));
            );
        }, t.removeDragingClass = function (e) {
            for (;
                e && (e.classList.remove("ae-is-draging"), !(null == (e = e.parentElement) ? void 0 : e.hasAttribute("data-region")));
            );
        }, t.camelize = function (e) { return e.replace(/\W+(.)/g, (function (e, t) { return t.toUpperCase() })) }, t.reactionWithOldValue = function (e, t) {
            var a;
            return o.reaction(e, (function (e) { i.default(e, a) || (t(e, a), a = e) }))
        }, t.repeatArray = function (e, t) {
            void 0 === t && (t = 1);
            for (var a = [];
                t-- > 0;
            )a.push(e);
            return a
        }, t.diff = function (e, t, a) { return r.default.diff(e, t, a) }, t.patchDiff = function (e, t) {
            return t ? t.reduce((function (t, a) {
                return function (e, t, a) {
                    if (e && Array.isArray(null == a ? void 0 : a.path)) {
                        e = e === t ? n.__assign({}, e) : e;
                        var l = a.path.concat();
                        "A" !== a.kind && l.pop(), l.reduce((function (e, t) {
                            var a = e.target, l = e.source[t], i = a[t];
                            return l === i && (i = Array.isArray(i) ? i.concat() : n.__assign({}, i), a[t] = i), { source: l, target: i }
                        }), { target: e, source: t }), r.default.applyChange(e, t, a)
                    } return e
                }(t, e, a)
            }), e) : e
        }, t.JSONTraverse = function e(t, a) {
            Object.keys(t).forEach((function (n) {
                var l = t[n];
                s.default(l) || Array.isArray(l) ? e(l, a) : a(l, n, t)
            }))
        }
    },
    function (e, t) { e.exports = require("fc22630") },
    function (e, t) { e.exports = require("af1cc81") },
    function (e, t) { e.exports = require("70cb05e") },
    function (e, t) { e.exports = require("2426036") },
    function (e, t) { e.exports = require("3c5b02d") },
    function (e, t) { e.exports = require("345ea29") },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.VRenderer = void 0;
        var n = a(0), l = a(10), i = n.__importDefault(a(4)), o = a(11), r = a(21), s = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.componentWillMount = function () {
                var e = this, t = this.props, a = (t.data, t.path, t.widthMutable), l = n.__rest(t, ["data", "path", "widthMutable"]), i = this.context;
                this.editorNode = i.addChild({ id: l.id, label: l.name, path: this.props.path, schemaPath: l.schemaPath, info: l, getData: function () { return e.props.data }, widthMutable: a, memberIndex: l.memberIndex })
            }, t.prototype.componentDidMount = function () { this.markDom(this.editorNode.id) }, t.prototype.componentDidUpdate = function () { this.markDom(this.editorNode.id) }, t.prototype.componentWillUnmount = function () { l.isAlive(this.editorNode) && this.context.removeChild(this.editorNode) }, t.prototype.markDom = function (e) {
                var t = o.findDOMNode(this);
                if (t) {
                    var a = this.editorNode.info, n = a.wrapperResolve ? a.wrapperResolve(t) : t;
                    (Array.isArray(n) ? n : n ? [n] : []).forEach((function (t) { return t.setAttribute("data-editor-id", e) }))
                }
            }, t.prototype.render = function () { return i.default.createElement(r.EditorNodeContext.Provider, { value: this.editorNode }, this.props.children) }, t.contextType = r.EditorNodeContext, t
        }(i.default.Component);
        t.VRenderer = s
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.RegionWrapper = void 0;
        var n = a(0), l = a(10), i = n.__importDefault(a(4)), o = a(11), r = a(21), s = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.componentWillMount = function () {
                var e = this.context;
                e && (this.editorNode = e.addChild({ id: e.id, label: this.props.label, path: e.path + "/" + this.props.name, region: this.props.name, regionInfo: this.props.regionConfig, preferTag: this.props.preferTag }))
            }, t.prototype.componentDidMount = function () { this.markDom(this.editorNode.id, this.props.name, this.props.rendererName) }, t.prototype.componentDidUpdate = function (e) { this.markDom(this.editorNode.id, this.props.name, this.props.rendererName) }, t.prototype.componentWillUnmount = function () { this.editorNode && l.isAlive(this.editorNode) && this.context.removeChild(this.editorNode) }, t.prototype.markDom = function (e, t, a) {
                var n = o.findDOMNode(this);
                if (n) {
                    var l = this.props.wrapperResolve, i = l ? l(n) : n.parentElement;
                    i.setAttribute("data-region", t), i.setAttribute("data-region-host", e), i.setAttribute("data-region-placeholder", this.props.placeholder || this.props.label), a && i.setAttribute("data-renderer", a)
                }
            }, t.prototype.render = function () { return i.default.createElement(r.EditorNodeContext.Provider, { value: this.editorNode }, this.props.children, i.default.createElement("span", { className: "ae-Region-placeholder" })) }, t.contextType = r.EditorNodeContext, t
        }(i.default.Component);
        t.RegionWrapper = s
    },
    function (e, t) { e.exports = require("833ad00") },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.mockValue = void 0;
        var n = a(0).__importDefault(a(19));
        t.mockValue = function (e) {
            var t = "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E";
            return "date" === e.type || "datetime" === e.type || "time" === e.type || "month" === e.type || "static-date" === e.type || "static-datetime" === e.type || "static-time" === e.type || "static-month" === e.type ? n.default().format("X") : "image" === e.type || "static-image" === e.type ? t : "images" === e.type || "static-images" === e.type ? [t] : "?????????"
        }
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.renderThumbToGhost = t.mapReactElement = t.hackIn = t.makeSchemaFormRender = t.makeWrapper = void 0;
        var n = a(0), l = a(26), i = a(10), o = n.__importDefault(a(4)), r = a(27), s = n.__importDefault(a(8)), d = n.__importDefault(a(53)), u = a(14), p = n.__importDefault(a(12)), c = a(36), m = a(7), h = a(21), f = n.__importDefault(a(18)), b = a(11), g = a(6), v = a(9), y = a(54);
        function _(e) {
            var t, a, i = e.body, o = e.definitions, r = e.controls, d = e.onChange, u = e.value, p = e.env, c = e.api, m = e.popOverContainer, h = e.submitOnChange, f = "body";
            Array.isArray(r) && (i = r, f = "controls"), i = Array.isArray(i) ? i.concat() : [], !1 === h && i.push({ type: "submit", label: "??????", level: "primary", block: !0, className: "ae-Settings-actions" });
            var b = ((t = { definitions: o })[f] = i, t.className = s.default("ae-Settings-content", Array.isArray(i) && i.length && "tabs" === (null === (a = i[0]) || void 0 === a ? void 0 : a.type) ? "only-tabs" : "", !1 === h ? "with-actions" : ""), t.wrapperComponent = "div", t.type = "form", t.title = "", t.mode = "normal", t.api = c, t.wrapWithPanel = !1, t.submitOnChange = !1 !== h, t.messages = { validateFailed: "" }, t);
            return l.render(b, { onFinished: function (e) { return d(e, g.diff(u, e)) }, data: u, popOverContainer: m }, n.__assign({}, p))
        } function S(e, t, a, n, l) {
            var i = p.default(a, (function (e) { return !e.matchRegion }));
            if (i) {
                var r = i.wrapper || u.RegionWrapper;
                return "inner" === i.insertPosition && o.default.isValidElement(t) ? o.default.cloneElement(t, { children: o.default.createElement(r, { key: i.key, preferTag: i.preferTag, name: i.key, label: i.label, placeholder: i.placeholder, regionConfig: i, editorStore: l.store, manager: l, children: t.props.children, wrapperResolve: i.wrapperResolve, rendererName: n.renderer.name }) }) : o.default.createElement(r, { key: i.key, preferTag: i.preferTag, name: i.key, label: i.label, placeholder: i.placeholder, regionConfig: i, editorStore: l.store, manager: l, children: t, wrapperResolve: i.wrapperResolve, rendererName: n.renderer.name })
            } if (a.length) {
                var s = function (e, t, a) {
                    var n = -1, l = void 0;
                    return a.some((function (a, i) { return !!a.matchRegion(t, e) && (n = i, l = a, !0) })), [l, n]
                }(e, t, a), d = s[0], c = s[1];
                if (d) {
                    r = d.wrapper || u.RegionWrapper;
                    if (a.splice(c, 1), "outter" === d.insertPosition) return o.default.createElement(r, { key: d.key, preferTag: d.preferTag, name: d.key, label: d.label, placeholder: d.placeholder, regionConfig: d, editorStore: l.store, manager: l, children: t, wrapperResolve: d.wrapperResolve });
                    if (o.default.isValidElement(t)) {
                        var m = t.props.children;
                        return o.default.cloneElement(t, { children: o.default.createElement(r, { key: d.key, preferTag: d.preferTag, name: d.key, label: d.label, placeholder: d.placeholder, regionConfig: d, editorStore: l.store, manager: l, children: m, wrapperResolve: d.wrapperResolve }) })
                    }
                } else if (o.default.isValidElement(t) && t.props.children) {
                    m = t.props.children;
                    return m = Array.isArray(m) ? m.map((function (t) { return S(e, t, a, n, l) })) : S(e, m, a, n, l), o.default.cloneElement(t, { children: m })
                }
            } return t
        } t.makeWrapper = function (e, t, a) {
            var l = e.store, s = a.component;
            return function (e) {
                function a() { return null !== e && e.apply(this, arguments) || this } return n.__extends(a, e), a.prototype.componentWillMount = function () {
                    var e = this, a = this.context || l.root;
                    this.editorNode = t.id ? a.addChild({ id: t.id, label: t.name, isCommonConfig: !!this.props.$$commonSchema, path: this.props.$path, schemaPath: t.schemaPath, info: t, getData: function () { return e.props.data } }) : void 0
                }, a.prototype.componentDidUpdate = function (e) {
                    var t = this.props;
                    this.editorNode && t.$$commonSchema !== e.$$commonSchema && this.editorNode.updateIsCommonConfig(!!this.props.$$commonSchema)
                }, a.prototype.componentWillUnmount = function () { this.editorNode && i.isAlive(this.editorNode) && (this.context || l.root).removeChild(this.editorNode) }, a.prototype.wrapperRef = function (e) {
                    for (;
                        null == e ? void 0 : e.getWrappedInstance;
                    )e = e.getWrappedInstance();
                    this.editorNode && i.isAlive(this.editorNode) && this.editorNode.setComponent(e)
                }, a.prototype.renderChild = function (e, a, l) { return (0, this.props.render)(e, a, n.__assign(n.__assign({}, l), { $$editor: t })) }, a.prototype.render = function () {
                    var e = this.props, a = (e.$$id, n.__rest(e, ["$$id"])), l = this.props.$$commonSchema ? y.CommonConfigWrapper : t.regions ? c.ContainerWrapper : r.NodeWrapper;
                    return o.default.createElement(h.EditorNodeContext.Provider, { value: this.editorNode || this.context }, o.default.createElement(l, n.__assign({}, a, { render: this.renderChild, $$editor: t, $$node: this.editorNode, ref: this.wrapperRef })))
                }, a.displayName = s.displayName, a.propsList = (s && s.propsList || []).concat(["$$id"]), a.contextType = h.EditorNodeContext, n.__decorate([g.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], a.prototype, "wrapperRef", null), n.__decorate([g.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [String, Object, Object]), n.__metadata("design:returntype", void 0)], a.prototype, "renderChild", null), a = n.__decorate([m.observer], a)
            }(o.default.Component)
        }, t.makeSchemaFormRender = function (e, t) {
            var a = n.__assign(n.__assign({}, e.env), { session: "schema-form" });
            return function (l) {
                var i = l.value, r = l.onChange, s = l.popOverContainer, d = l.id, u = l.store, p = n.__assign({}, e.store.ctx);
                return d && Object.defineProperty(p, "__props__", {
                    get: function () {
                        var e, t = u.getNodeById(d);
                        return (null === (e = null == t ? void 0 : t.getComponent()) || void 0 === e ? void 0 : e.props) || {}
                    }
                }), o.default.createElement(_, { key: "" + d, api: t.api, definitions: t.definitions, body: t.body ? f.default(Array.isArray(t.body) ? t.body : [t.body]) : void 0, controls: t.controls ? f.default(Array.isArray(t.controls) ? t.controls : [t.controls]) : void 0, value: v.createObject(p, i), submitOnChange: t.submitOnChange, onChange: r, env: a, popOverContainer: s })
            }
        }, t.hackIn = function (e, t, a) {
            for (var l = e.Renderer;
                l.ComposedComponent;
            )l = l.ComposedComponent;
            var i = l.prototype;
            if (Array.isArray(t)) {
                var o = d.default(t, (function (e) { return e.renderMethod }));
                Object.keys(o).forEach((function (e) {
                    var t;
                    if (!i["__" + e] && i[e]) {
                        var a, l, r = o[e], s = null === (t = r[0]) || void 0 === t ? void 0 : t.renderMethodOverride;
                        i["__" + e] = i[e], i[e] = (a = i["__" + e], l = (null == s ? void 0 : s(r.concat(), S)) || function () {
                            for (var e = [], t = 0;
                                t < arguments.length;
                                t++)e[t] = arguments[t];
                            var a = this.props.$$editor, l = this.super.apply(this, e);
                            if (a && !this.props.$$commonSchema && Array.isArray(a.regions) && r.every((function (e) { return p.default(a.regions, (function (t) { return t.key === e.key })) }))) {
                                var i = r.map((function (e) {
                                    var t = p.default(a.regions, (function (t) { return t.key === e.key && (!e.rendererName || e.rendererName === t.rendererName) }));
                                    return t ? n.__assign(n.__assign({}, e), { label: t.label, preferTag: t.preferTag }) : e
                                }));
                                return S(this, l, i, a, a.plugin.manager)
                            } return l
                        }, "function" != typeof a ? a : function () {
                            var e = this.super;
                            this.super = a.bind(this);
                            var t = l.apply(this, arguments);
                            return this.super = e, t
                        })
                    }
                }))
            } else a && Object.keys(a).forEach((function (e) {
                var t, n;
                i["__" + e] || "function" != typeof i[e] || (i["__" + e] = i[e], i[e] = (t = i["__" + e], n = a[e], "function" != typeof t ? t : function () {
                    var e = this.super;
                    this.super = t.bind(this);
                    var a = n.apply(this, arguments);
                    return this.super = e, a
                }))
            }))
        }, t.mapReactElement = function e(t, a, n) {
            if (!o.default.isValidElement(t)) return t;
            var l = a(t, n);
            if (l === t && t.props.children) {
                var i = t.props.children;
                if (Array.isArray(i)) {
                    var r = [], s = !1;
                    i.forEach((function (t, n) {
                        var l = e(t, a, n);
                        l !== t && (s = !0, o.default.isValidElement(l) && !l.key && (l = o.default.cloneElement(l, { key: n }))), r.push(l)
                    })), s && (l = o.default.cloneElement(l, { children: r }))
                } else {
                    var d = e(i, a, n);
                    d !== i && (l = o.default.cloneElement(l, { children: d }))
                }
            } return l
        };
        var x = document.createElement("div");
        t.renderThumbToGhost = function (e, t, a, i) {
            e.innerHTML = "";
            var o = t.host.getComponent(), r = (null == o ? void 0 : o.renderControl) && "body" === t.region;
            try {
                b.render(l.render({
                    children: function (e) {
                        var n = e.render;
                        return r ? n("", { type: "form", wrapWithPanel: !1, mode: o.props.mode, body: [a] }) : n(t.region, a)
                    }
                }, {}, n.__assign(n.__assign({}, i.env), { theme: (null == o ? void 0 : o.props.theme) || i.env.theme, session: "ghost-thumb" }), ""), x)
            } catch (e) { } var s = x.innerHTML || '<div class="wrapper-sm b-a b-light m-b-sm">????????????</div>';
            e.innerHTML = s, b.unmountComponentAtNode(x), x.innerHTML = ""
        }
    },
    function (e, t) { e.exports = require("3ce129c") },
    function (e, t) { e.exports = require("8a4147a") },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ButtonPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "button", t.$schema = "/schemas/ActionSchema.json", t.name = "??????", t.description = "????????????????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/action", t.tags = ["??????"], t.icon = "fa fa-square", t.scaffold = { type: "button", label: "??????", actionType: "dialog", dialog: { title: "????????????", body: "???????????????" } }, t.previewSchema = { type: "button", label: "??????" }, t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    /(?:\/|^)dialog\/.+$/.test(e.path);
                    var t = /(?:\/|^)dropdown-button\/.+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ label: "??????", type: "input-text", name: "label" }, { label: "??????", type: "button-group-select", name: "type", size: "sm", options: [{ label: "??????", value: "button" }, { label: "??????", value: "submit" }, { label: "??????", value: "reset" }] }, { type: "input-text", name: "tooltip", hidden: t, label: "????????????", description: "??????????????????????????????" }, { type: "button-group-select", name: "tooltipPlacement", visibleOn: "data.tooltip || data.disabledTip", label: "??????????????????", size: "sm", mode: "inline", className: "w-full", value: "bottom", options: [{ label: "???", value: "top" }, { label: "???", value: "right" }, { label: "???", value: "bottom" }, { label: "???", value: "left" }] }, o.getSchemaTpl("icon"), { type: "button-group-select", label: "????????????", clearable: !0, visibleOn: "this.icon", name: "iconClassName", size: "sm", pipeIn: function (e) { return "string" == typeof e && /\bpull\-(left|right)\b/.test(e) ? RegExp.$1 : "" }, pipeOut: function (e, t) { return (t || "").replace(/\bpull\-(left|right)\b/, "").trim() + e ? "pull-" + e : "" }, options: [{ label: "??????", value: "left" }, { label: "??????", value: "right" }] }, o.getSchemaTpl("size", { label: "??????" }), { label: "??????", type: "select", name: "level", hidden: t, clearable: !1, btnActiveLevel: "", options: [{ label: "??????", value: "default", level: "default" }, { label: "??????", value: "link", level: "link" }, { label: "??????", value: "primary", level: "primary" }, { label: "??????", value: "light", level: "light" }, { label: "??????", value: "dark", level: "dark" }, { label: "??????", value: "info", level: "info" }, { label: "??????", value: "success", level: "success" }, { label: "??????", value: "warning", level: "warning" }, { label: "??????", value: "danger", level: "danger" }] }, { name: "block", type: "switch", label: "????????????", mode: "inline" }, o.getSchemaTpl("className", { label: "?????? CSS ??????" }), o.getSchemaTpl("className", { name: "iconClassName", label: "?????? CSS ??????", visibleOn: "this.icon" })] }, { title: "??????", body: [o.getSchemaTpl("disabled", [{ type: "input-text", name: "disabledTip", label: "??????????????????", hidden: t, description: "???????????????????????????????????????????????????" }]), o.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t.prototype.filterProps = function (e) { return e.disabled = !1, e }, t.prototype.getRendererInfo = function (e) {
                var t = e.renderer, a = e.schema;
                if (a.$$id && this.name && this.rendererName && this.rendererName === t.name) return { name: a.label ? a.label : this.name, regions: this.regions, patchContainers: this.patchContainers, vRendererConfig: this.vRendererConfig, wrapperProps: this.wrapperProps, wrapperResolve: this.wrapperResolve, filterProps: this.filterProps, $schema: this.$schema, renderRenderer: this.renderRenderer }
            }, t
        }(i.BasePlugin);
        t.ButtonPlugin = r, l.registerEditorPlugin(r)
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.EditorNodeContext = t.EditorNode = void 0;
        var n = a(0), l = a(10), i = a(6), o = a(5), r = n.__importDefault(a(4)), s = a(15);
        t.EditorNode = l.types.model("EditorNode", { parentId: "", parentRegion: "", isCommonConfig: !1, id: "", label: "", regionInfo: l.types.maybe(l.types.frozen()), path: "", schemaPath: "", region: "", preferTag: "", state: l.types.optional(l.types.frozen(), {}), widthMutable: !1, heightMutable: !1, memberIndex: -1, folded: !1, patched: !1, x: 0, y: 0, w: 0, h: 0, children: l.types.optional(l.types.array(l.types.late((function () { return t.EditorNode }))), []) }).volatile((function () { return { getData: l.types.frozen() } })).views((function (e) {
            var t;
            return {
                get info() { return t }, setInfo: function (e) { t = e }, get isVitualRenderer() { return !!~e.memberIndex }, get clickable() {
                    var e, t;
                    return !1 !== (null === (e = this.info) || void 0 === e ? void 0 : e.editable) || !(null === (t = this.info) || void 0 === t ? void 0 : t.hostId)
                }, get draggable() {
                    var e;
                    return !(!this.moveable || !1 === (null === (e = this.info) || void 0 === e ? void 0 : e.draggable))
                }, get moveable() {
                    var e;
                    return !(this.isRegion || !1 === (null === (e = this.info) || void 0 === e ? void 0 : e.movable) || !Array.isArray(this.schemaParent) || this.host.memberImmutable(this.parent.region))
                }, get removable() {
                    var e;
                    return !(this.isRegion || !1 === (null === (e = this.info) || void 0 === e ? void 0 : e.removable) || !Array.isArray(this.schemaParent) || this.host.memberImmutable(this.parent.region))
                }, get duplicatable() {
                    var e;
                    return !(this.isRegion || !1 === (null === (e = this.info) || void 0 === e ? void 0 : e.duplicatable) || !Array.isArray(this.schemaParent) || this.host.memberImmutable(this.parent.region))
                }, get replaceable() {
                    var e;
                    return !this.isRegion && !1 !== (null === (e = this.info) || void 0 === e ? void 0 : e.replaceable)
                }, memberImmutable: function (e) {
                    var t, a;
                    return !!(!0 === (null === (t = this.info) || void 0 === t ? void 0 : t.memberImmutable) || Array.isArray(null === (a = this.info) || void 0 === a ? void 0 : a.memberImmutable) && ~this.info.memberImmutable.indexOf(e))
                }, get isRegion() { return !!e.region }, get childRegions() {
                    var e, t, a = this.uniqueChildren.filter((function (e, t, a) { return e.isRegion }));
                    if (null === (e = this.info) || void 0 === e ? void 0 : e.multifactor) {
                        var n = this.sameIdChild;
                        null === (t = null == n ? void 0 : n.childRegions) || void 0 === t || t.forEach((function (e) { return a.push(e) }))
                    } return a
                }, get uniqueChildren() {
                    var t = e.children.filter((function (e, t, a) { return a.findIndex((function (t) { return e.isRegion ? t.id === e.id && t.region === e.region : t.id === e.id })) === t }));
                    if (Array.isArray(this.schema)) {
                        var a = this.schema;
                        t = t.sort((function (e, t) { return s(a, (function (t) { return (null == t ? void 0 : t.$$id) === e.id })) - s(a, (function (e) { return (null == e ? void 0 : e.$$id) === t.id })) }))
                    } return t
                }, get sameIdChild() {
                    var t;
                    return null === (t = this.uniqueChildren) || void 0 === t ? void 0 : t.find((function (t) { return !t.isRegion && t.id === e.id }))
                }, get singleRegion() { return !(1 !== this.uniqueChildren.length || !this.uniqueChildren[0].isRegion) }, isExists: function (t) { return e.children.some((function (e) { return e.id === t })) }, getChildById: function (t) { return e.children.find((function (e) { return e.id === t })) }, get parent() {
                    var t = l.getParent(e, 2);
                    return "root" !== (null == t ? void 0 : t.id) ? t : null
                }, get host() {
                    var t = e.parent;
                    return (null == t ? void 0 : t.isRegion) && (t = t.parent), t
                }, get firstChild() {
                    var t = e;
                    if (!t.children.length) return null;
                    for (var a = t.children[0];
                        a;
                    ) {
                        if (!a.isRegion && a.id !== t.id) return a;
                        a = a.children[0]
                    } return null
                }, get index() { return this.parent.uniqueChildren.indexOf(e) }, get prevSibling() {
                    for (var t = this.parent.uniqueChildren, a = t.indexOf(e) - 1;
                        a >= 0 && t[a];
                    ) {
                        if (t[a].id !== e.id) return t[a];
                        a--
                    } return null
                }, get nextSibling() {
                    for (var t = this.parent.uniqueChildren, a = t.length, n = t.indexOf(e) + 1;
                        n < a && t[n];
                    ) {
                        if (t[n].id !== e.id) return t[n];
                        n++
                    } return null
                }, get schema() {
                    var t = l.getRoot(e).getSchema(e.id);
                    return this.isRegion && t && (t = t[e.region]), t
                }, get schemaParent() {
                    var t = l.getRoot(e);
                    return this.isRegion ? t.getSchema(e.id) : t.getSchemaParentById(e.id)
                }
            }
        })).actions((function (e) {
            function t(t) {
                var a = Array.isArray(t) ? t : t ? [t] : [];
                if (a.length) {
                    var n = l.getRoot(e).getIframe(), i = l.getRoot(e).getLayer().getBoundingClientRect(), o = function (e) {
                        for (var t = e.concat(), a = t.shift(), n = a.getBoundingClientRect(), l = { left: n.left, top: n.top, width: n.width, height: n.height, right: n.right, bottom: n.bottom }, i = a.parentElement.closest(".ae-Preview-inner,[data-region]");
                            t.length;
                        ) {
                            var o = t.shift(), r = o.getBoundingClientRect(), s = o.parentElement.closest(".ae-Preview-inner,[data-region],[data-editor-id]");
                            if (!i && s) i = s;
                            else if (s && i && s !== i) continue;
                            l.left = Math.min(l.left, r.left), l.top = Math.min(l.top, r.top), l.right = Math.max(l.right, r.right), l.bottom = Math.max(l.bottom, r.bottom), l.width = l.right - l.left, l.height = l.bottom - l.top
                        } return l
                    }(a), r = { left: o.left - i.left, top: o.top - i.top };
                    if (n) {
                        var s = n.getBoundingClientRect();
                        r.left += s.left, r.top += s.top
                    } var d = o.height;
                    d && (e.x = r.left + 0, e.y = r.top + 0, e.w = o.width, e.h = d)
                }
            } var a;
            return {
                updateIsCommonConfig: function (t) { e.isCommonConfig = !!t }, addChild: function (t) {
                    e.children.push(n.__assign(n.__assign({}, t), { parentId: e.id, parentRegion: e.region }));
                    var a = e.children[e.children.length - 1];
                    return a.setInfo(t.info), a
                }, removeChild: function (t) {
                    var a = e.children.findIndex((function (e) { return e === t }));
                    e.children.splice(a, 1)
                }, toggleFold: function (t) { t.stopPropagation(), t.preventDefault(), e.folded = !e.folded }, patch: function (t, a) {
                    if (void 0 === a && (a = !1), !e.patched || a) {
                        e.patched = !0;
                        var l = t, r = e.info;
                        if (!1 !== r.editable) {
                            var s = l.getSchema(r.id), d = s;
                            (Array.isArray(r.regions) && r.regions.length || Array.isArray(r.patchContainers)) && (d = function e(t, a) {
                                var l = !1, o = {};
                                if (t) return a.forEach((function (a) {
                                    var n = a.split(".");
                                    a = n.shift();
                                    var r = t[a];
                                    if ("string" == typeof r) return l = !0, void (o[a] = [i.JSONPipeIn({ type: "tpl", tpl: r, inline: !1 })]);
                                    if (Array.isArray(r)) {
                                        var s = !1, d = r.map((function (t) {
                                            if ("string" == typeof t && t) return s = !0, i.JSONPipeIn({ type: "tpl", tpl: t, inline: !1 });
                                            if (n.length) {
                                                var a = e(t, [n.join(".")]);
                                                a !== t && (s = !0, t = a)
                                            } return t
                                        }));
                                        s && (l = !0, o[a] = d)
                                    } else r && (o[a] = [i.JSONPipeIn(r)], l = !0)
                                })), l && (t = n.__assign(n.__assign({}, t), o)), t
                            }(d, r.patchContainers || r.regions.map((function (e) { return e.key })))), d = o.filterSchema(d, { component: r.renderer.component }), (d = i.JSONPipeIn(d)) !== s && l.changeValueById(r.id, d, void 0, !0, !0)
                        }
                    }
                }, updateSchema: function (t) {
                    var a = e.info;
                    if (!1 !== a.editable) {
                        var i = l.getRoot(e), o = i.getSchema(a.id);
                        o = n.__assign(n.__assign({}, o), t), i.changeValueById(a.id, o)
                    }
                }, setComponent: function (e) { a = e }, getComponent: function () { return a }, calculateHighlightBox: function (a) {
                    var n;
                    if (void 0 === a && (a = l.getRoot(e)), a.calculateStarted) {
                        var i = l.getRoot(e).getDoc();
                        if (e.isRegion) { t(o = i.querySelector('[data-region="' + e.region + '"][data-region-host="' + e.id + '"]')) } else {
                            var o = [].slice.call(i.querySelectorAll('[data-editor-id="' + e.id + '"]'));
                            t("button" === (null === (n = e.info) || void 0 === n ? void 0 : n.renderer.name) ? null == o ? void 0 : o[0] : o), e.childRegions.forEach((function (e) { return e.calculateHighlightBox(a) }))
                        }
                    }
                }, resetHighlightBox: function (t) { e.x = 0, e.y = 0, e.w = 0, e.h = 0, e.childRegions.forEach((function (e) { return e.resetHighlightBox(t) })) }, updateState: function (t, a) { void 0 === a && (a = !1), e.state = n.__assign(n.__assign({}, a ? null : e.state), t) }, setWidthMutable: function (t) { e.widthMutable = !!t }, setHeightMutable: function (t) { e.heightMutable = !!t }
            }
        })), t.EditorNodeContext = r.default.createContext(null)
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DateControlPlugin = void 0;
        var n = a(0), l = a(5), i = a(3), o = a(1), r = a(2), s = n.__importDefault(a(19)), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-date", t.$schema = "/schemas/DateControlSchema.json", t.order = -450, t.icon = "fa fa-calendar", t.name = "?????????", t.description = "?????????????????????????????????????????????<code>+2days</code>?????????", t.docLink = "/amis/zh-CN/components/form/date", t.tags = ["?????????"], t.scaffold = { type: "input-date", label: "??????", name: "date" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBody = [i.getSchemaTpl("placeholder", { pipeIn: i.defaultValue("???????????????") }), { type: "input-text", name: "format", label: "?????????", description: '????????? <a href="https://momentjs.com/" target="_blank">moment</a> ?????????????????????', pipeIn: i.defaultValue("X"), onChange: function (e, t, a, n) { n.setValueByName("value", ""), n.setValueByName("minDate", ""), n.setValueByName("maxDate", "") } }, i.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"', placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", visibleOn: 'typeof this.value !== "undefined"', body: [{ type: "input-date", name: "value", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }, i.getSchemaTpl("clearable", { pipeIn: i.defaultValue(!0) }), { type: "input-text", name: "minDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "minDate", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }, { type: "divider" }, { type: "input-text", name: "maxDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "maxDate", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(r.BasePlugin);
        t.DateControlPlugin = d, o.registerEditorPlugin(d)
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TextControlPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-text", t.$schema = "/schemas/TextControlSchema.json", t.order = -500, t.name = "?????????", t.icon = "fa fa-terminal", t.description = "??????<code>options</code>????????????????????????????????????<code>select</code>", t.docLink = "/amis/zh-CN/components/form/text", t.tags = ["?????????"], t.scaffold = { type: "input-text", label: "??????", name: "text" }, t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, o.getSchemaTpl("hint"), o.getSchemaTpl("showCounter"), { name: "addOn", label: "?????? addOn", type: "switch", mode: "inline", className: "w-full", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? { label: "??????", type: "button" } : null } }, { type: "combo", multiLine: !0, name: "addOn", visibleOn: "data.addOn", items: [{ name: "type", label: "??????", type: "button-group-select", size: "xs", options: [{ label: "??????", value: "text" }, { label: "??????", value: "button" }, { label: "??????", value: "submit" }] }, { name: "label", label: "??????", type: "input-text", visibleOn: 'this.type === "text"' }, { name: "icon", label: "Icon", type: "icon-picker", visibleOn: 'this.type === "text"' }, o.getSchemaTpl("className", { visibleOn: 'this.type === "text"' }), { name: "position", label: "??????", type: "button-group-select", size: "xs", pipeIn: o.defaultValue("right"), options: [{ label: "??????", value: "left" }, { label: "??????", value: "right" }] }] }, { name: "autoComplete", label: "????????????", mode: "inline", className: "w-full", type: "switch", pipeIn: function (e) { return !1 !== e }, pipeOut: function (e) { return !!e && "" }, onChange: function (e, t, a, n) { "" === t || t ? n.setValues({ __options: n.data.options, options: [] }) : n.setValues({ options: n.data.__options }) } }, o.getSchemaTpl("options", { visibleOn: "data.autoComplete !== false", description: "??????????????????????????????????????????????????????????????????" }), o.getSchemaTpl("source", { visibleOn: "data.autoComplete !== false" }), o.getSchemaTpl("api", { name: "autoComplete", label: "??????????????????", description: "?????????????????????????????????????????????????????????????????????????????????????????????????????? `\\${term}` ??????", visibleOn: "data.autoComplete !== false" }), o.getSchemaTpl("multiple", { visibleOn: "data.options || data.source || data.autoComplete" }), o.getSchemaTpl("joinValues"), o.getSchemaTpl("delimiter"), o.getSchemaTpl("extractValue"), o.getSchemaTpl("autoFill")], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(i.BasePlugin);
        t.TextControlPlugin = r, l.registerEditorPlugin(r)
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        var n = a(0), l = n.__importStar(a(4)), i = n.__importDefault(a(8)), o = n.__importDefault(a(30)), r = a(6), s = a(59), d = a(1), u = a(63), p = a(25), c = a(41), m = n.__importDefault(a(64)), h = a(10), f = a(42), b = a(65), g = function (e) {
            function t(t) {
                var a = e.call(this, t) || this;
                a.mainRef = l.default.createRef(), a.isInternalChange = !1;
                var i = t.value, o = t.isSubEditor, r = void 0 !== o && o, u = (t.onChange, n.__rest(t, ["value", "isSubEditor", "onChange"])), c = n.__assign({}, u);
                return a.store = s.EditorStore.create({ isMobile: t.isMobile, isSubEditor: r, amisDocHost: t.amisDocHost, ctx: t.ctx }, c), a.store.setSchema(i), a.manager = new d.EditorManager(c, a.store), window.editorStore = a.store, a.unReaction = p.reaction((function () { return a.store.schemaRaw }), (function (e) { a.lastResult = e, a.isInternalChange || t.onChange(e) })), a
            } return n.__extends(t, e), t.prototype.componentDidUpdate = function (e) {
                var t = this.props;
                t.value !== e.value && t.value !== this.lastResult && (this.isInternalChange = !0, this.store.setSchema(t.value), this.isInternalChange = !1), t.isMobile !== e.isMobile && this.store.setIsMobile(t.isMobile), t.ctx !== e.ctx && this.store.setCtx(t.ctx)
            }, t.prototype.componentWillUnmount = function () { this.unReaction(), this.manager.dispose(), h.destroy(this.store) }, t.prototype.handleContextMenu = function (e) {
                var t, a, n, l = "", i = "";
                if (this.store.activeId ? l = null === (t = e.target.closest('[data-editor-id="' + this.store.activeId + '"]')) || void 0 === t ? void 0 : t.getAttribute("data-editor-id") : this.store.selections.length && (l = null === (a = e.target.closest(this.store.selections.map((function (e) { return '[data-editor-id="' + e + '"]' })).join(","))) || void 0 === a ? void 0 : a.getAttribute("data-editor-id")), l || (l = null === (n = e.target.closest("[data-editor-id]")) || void 0 === n ? void 0 : n.getAttribute("data-editor-id")), !l) {
                    var o = e.target.closest("[data-node-id]");
                    if (!(l = null == o ? void 0 : o.getAttribute("data-node-id"))) return;
                    i = o.getAttribute("data-node-region")
                } e.preventDefault(), e.stopPropagation(), this.manager.openContextMenu(l, i, { x: window.scrollX + e.clientX, y: window.scrollY + e.clientY })
            }, t.prototype.canUndo = function () { return this.store.canUndo }, t.prototype.canRedo = function () { return this.store.canRedo }, t.prototype.undo = function () { this.store.undo() }, t.prototype.redo = function () { this.store.redo() }, t.prototype.getToolbarContainer = function () { return this.mainRef.current }, t.prototype.render = function () {
                var e = this.props, t = e.preview, a = e.isMobile, r = e.className, s = e.theme, d = e.data, p = e.iframeUrl, h = e.previewProps, g = e.autoFocus;
                return l.default.createElement("div", { ref: this.mainRef, className: i.default("ae-Editor", { preview: t }, r) }, l.default.createElement("div", { className: "ae-Editor-inner", onContextMenu: this.handleContextMenu }, t ? null : l.default.createElement(u.Panels, { store: this.store, manager: this.manager, isLeftPanel: !0 }), l.default.createElement("div", { className: "ae-Main" }, t ? null : l.default.createElement(m.default, { store: this.store, manager: this.manager }), l.default.createElement(o.default, n.__assign({}, h, { iframeUrl: p, editable: !t, isMobile: a, store: this.store, manager: this.manager, theme: s, data: d, autoFocus: g, toolbarContainer: this.getToolbarContainer }))), t ? null : l.default.createElement(u.Panels, { store: this.store, manager: this.manager })), l.default.createElement(c.SubEditor, { store: this.store, manager: this.manager, theme: s }), l.default.createElement(f.ScaffoldModal, { store: this.store, manager: this.manager, theme: s }), l.default.createElement(b.PopOverForm, { store: this.store, manager: this.manager, theme: s }))
            }, t.defaultProps = { autoFocus: !0 }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleContextMenu", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "getToolbarContainer", null), t
        }(l.Component);
        t.default = g
    },
    function (e, t) { e.exports = require("f317306") },
    function (e, t) { e.exports = require("b0224f6") },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.NodeWrapper = void 0;
        var n = a(0), l = a(7), i = (a(10), n.__importDefault(a(4))), o = a(11), r = a(6), s = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.componentDidMount = function () {
                this.markDom(this.props.$$editor.id);
                var e = this.props.$$node;
                e && requestAnimationFrame((function () { }))
            }, t.prototype.componentDidUpdate = function (e) { this.markDom(this.props.$$editor.id) }, t.prototype.getWrappedInstance = function () { return this.ref }, t.prototype.refFn = function (e) { this.ref = e }, t.prototype.markDom = function (e) {
                var t, a, n = o.findDOMNode(this);
                if (n && e) {
                    var l = this.props.$$editor, i = !1 !== this.props.$$visible && !0 !== this.props.$$hidden, r = l.wrapperResolve ? l.wrapperResolve(n) : n;
                    (Array.isArray(r) ? r : r ? [r] : []).forEach((function (t) { t.setAttribute("data-editor-id", e), t.setAttribute("data-visible", i ? "" : "false") })), null === (a = null === (t = l.plugin) || void 0 === t ? void 0 : t.markDom) || void 0 === a || a.call(t, r, this.props)
                }
            }, t.prototype.render = function () {
                var e = this.props, t = e.$$editor, a = e.$$node, l = n.__rest(e, ["$$editor", "$$node"]), o = t.renderer;
                return t.filterProps && (l = t.filterProps.call(t.plugin, l, a)), t.renderRenderer ? t.renderRenderer.call(t.plugin, n.__assign(n.__assign(n.__assign(n.__assign(n.__assign({}, l), null == a ? void 0 : a.state), { $$editor: t }), t.wrapperProps), { ref: this.refFn }), t) : i.default.createElement(o.component, n.__assign({}, l, null == a ? void 0 : a.state, { $$editor: t }, t.wrapperProps, { ref: this.refFn }))
            }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "refFn", null), t = n.__decorate([l.observer], t)
        }(i.default.Component);
        t.NodeWrapper = s
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        var n = a(0), l = n.__importDefault(a(4)), i = n.__importDefault(a(70)), o = a(6), r = n.__importDefault(a(8)), s = a(5), d = a(37), u = a(15), p = a(38), c = a(71), m = /^\/schemas\/(.*).json$/;
        var h = d((function (e) { s.toast.warning("?????????????????????????????????\n " + e.toString().split("\n")[1]) }), 1e3), f = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.state = { wrongSchema: "", value: t.props.value, contents: t.obj2str(t.props.value, t.props) }, t.toDispose = [], t.uri = "isuda://schema/" + o.guid() + ".json", t.emitChange = d((function () {
                    var e = t.props, a = e.onChange, n = e.value, l = t.str2obj(t.state.contents);
                    if (l && c.isPlainObject(l)) {
                        t.setState({ wrongSchema: "" }), delete l.$schema, l = o.filterSchemaForConfig(l, t.props.value);
                        var i = o.diff(t.lastResult || n, l);
                        t.lastResult = l, a(l, i)
                    } else t.setState({ wrongSchema: t.state.contents })
                }), 250, { trailing: !0, leading: !1 }), t.editorFactory = function (e, a, l) {
                    var i = a.Uri.parse(t.uri);
                    return t.model = a.editor.createModel(t.state.contents, "json", i), a.editor.create(e, n.__assign(n.__assign({ autoIndent: !0, formatOnType: !0, formatOnPaste: !0, selectOnLineNumbers: !0, scrollBeyondLastLine: !1, folding: !0, scrollbar: { alwaysConsumeMouseWheel: !1 }, minimap: { enabled: !1 } }, l), { model: t.model }))
                }, t.editorDidMount = function (e, a) { t.editor = e, t.monaco = a, t.changeJsonOptions(t.props), t.props.onPaste && t.toDispose.push(t.editor.onDidPaste(t.props.onPaste).dispose) }, t.editorWillUnmount = function (e, a) { t.toDispose.forEach((function (e) { return e() })), t.toDispose = [] }, t.handleChange = function (e) { t.setState({ contents: e }, t.emitChange) }, t.handleBlur = function () {
                    return n.__awaiter(t, void 0, void 0, (function () {
                        var e, t, a;
                        return n.__generator(this, (function (n) {
                            switch (n.label) {
                                case 0: return e = this.state, t = e.wrongSchema, a = e.value, t ? [4, s.prompt([{ className: "w-full", type: "tpl", label: !1, tpl: "?????????????????????????????????????????????????????????????????????????????????????????????????????????" }, { type: "switch", label: !1, option: "????????????", name: "diff", value: !1 }, { visibleOn: "this.diff", label: !1, type: "diff-editor", allowFullscreen: !0, disabled: !0, name: "newValue", size: "xxl", language: "json", diffValue: "${oldValue}" }], { oldValue: a, newValue: t }, "?????????")] : [2];
                                case 1: return n.sent() ? this.setState({ wrongSchema: "", contents: JSON.stringify(a) }) : this.editor.focus(), [2]
                            }
                        }))
                    }))
                }, t
            } return n.__extends(t, e), t.prototype.componentDidUpdate = function (e) {
                var t = this.props;
                e.$schema !== t.$schema && this.monaco && this.changeJsonOptions(t), o.isObjectShallowModified(t.value, e.value) && o.isObjectShallowModified(t.value, this.lastResult) && (this.lastResult = null, this.setState({ value: t.value, contents: this.obj2str(t.value, t) }))
            }, t.prototype.obj2str = function (e, t) {
                var a;
                return e = o.filterSchemaForConfig(e), !(e = n.__assign({ type: null == e ? void 0 : e.type }, e)).type && (null === (a = t.$schema) || void 0 === a ? void 0 : a.match(/PageSchema/i)) ? e.type = "page" : e.type || delete e.type, delete e.$schema, p.stringify(e)
            }, t.prototype.str2obj = function (e) { try { return "" === e ? {} : p.parse(e) } catch (e) { return h(e), null } }, t.prototype.changeJsonOptions = function (e) {
                var t;
                void 0 === e && (e = this.props);
                var a = this.monaco, n = e.$schemaUrl || window.location.protocol + "//" + window.location.host + "/schema.json";
                0 === n.indexOf("/") && (n = window.location.protocol + "//" + window.location.host + n);
                var l = function (e, t, a, n) {
                    var l = Array.isArray(n) ? n.concat() : [];
                    if (m.test(t)) {
                        var i = RegExp.$1, o = e.replace(/^(\w+\:\/\/[^\/]+)\/.*$/, "$1") + "/schemas/" + i + ".json", r = u(l, (function (e) {
                            var t;
                            return (null === (t = e.fileMatch) || void 0 === t ? void 0 : t[0]) === a
                        }));
                        ~r && l.splice(r, 1), l.push({ uri: o, fileMatch: [a], schema: { $schema: "http://json-schema.org/draft-07/schema#", $ref: e + "#/definitions/" + i } })
                    } return l
                }(n, e.$schema, a.Uri.parse(this.uri).toString(), null === (t = a.languages.json) || void 0 === t ? void 0 : t.jsonDefaults.diagnosticsOptions.schemas);
                a.languages.json.jsonDefaults.setDiagnosticsOptions({ schemas: l, validate: !0, enableSchemaRequest: !0, allowComments: !0 })
            }, t.prototype.render = function () {
                var e = this.props, t = e.disabled, a = e.className, n = e.theme;
                return l.default.createElement(i.default, { className: r.default("amis-code-editor", a), value: this.state.contents, onChange: this.handleChange, onBlur: this.handleBlur, language: "json", theme: n, editorFactory: this.editorFactory, editorDidMount: this.editorDidMount, editorWillUnmount: this.editorWillUnmount, options: { automaticLayout: !0, lineNumbers: "off", glyphMargin: !1, tabSize: 2, wordWrap: "on", lineDecorationsWidth: 0, lineNumbersMinChars: 0, selectOnLineNumbers: !0, scrollBeyondLastLine: !1, folding: !0, minimap: { enabled: !1 }, readOnly: t } })
            }, t
        }(l.default.Component);
        t.default = f
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DatePlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "date", t.$schema = "/schemas/DateSchema.json", t.name = "????????????", t.description = "?????????????????????????????????????????????????????????????????????X??????????????????YYYY-MM-DD HH:mm:ss???", t.tags = ["??????"], t.icon = "fa fa-calendar", t.scaffold = { type: "date" }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { format: "YYYY-MM-DD", value: Math.round(Date.now() / 1e3) }), t.panelTitle = "????????????", t.panelBodyCreator = function (e) { return [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ type: "input-text", name: "format", label: "??????????????????", description: "????????? moment ?????????????????????", pipeIn: o.defaultValue("YYYY-MM-DD") }, { type: "input-text", name: "valueFormat", label: "??????????????????", description: "????????? moment ?????????????????????", pipeIn: o.defaultValue("X") }, { name: "placeholder", type: "input-text", pipeIn: o.defaultValue("-"), label: "?????????" }] }, { title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])] }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.DatePlugin = r, l.registerEditorPlugin(r)
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        var n = a(0), l = a(5), i = n.__importStar(a(4)), o = n.__importDefault(a(8)), r = a(6), s = a(26), d = a(7), u = a(11), p = n.__importDefault(a(52)), c = n.__importDefault(a(33)), m = a(34), h = n.__importDefault(a(35)), f = a(10), b = a(9), g = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.env = n.__assign(n.__assign(n.__assign({}, t.props.manager.env), { notify: function (e, a) { t.props.editable ? console.warn("[Notify]", e, a) : l.toast[e] ? l.toast[e](a, "error" === e ? "????????????" : "????????????") : console.warn("[Notify]", e, a) }, theme: t.props.theme, session: "preview-" + t.props.manager.id, rendererResolver: t.rendererResolver.bind(t) }), t.props.amisEnv), t.doingSelection = !1, t.unReaction = r.reactionWithOldValue((function () { return [t.getHighlightNodes(), t.props.store.activeId] }), (function (e, a) {
                    var n = e[0], l = t.props.store;
                    setTimeout((function () { t.calculateHighlightBox(n) }), 50);
                    var i = null == a ? void 0 : a[0];
                    Array.isArray(i) && (i = i.filter((function (e) { return !~n.indexOf(e) })), l.resetHighlightBox(i))
                })), t
            } return n.__extends(t, e), t.prototype.componentDidMount = function () {
                var e = u.findDOMNode(this);
                e.addEventListener("mouseleave", this.handleMouseLeave), e.addEventListener("mousemove", this.handleMouseMove), e.addEventListener("click", this.handleClick), e.addEventListener("mouseover", this.handeMouseOver), e.addEventListener("mousedown", this.handeMouseDown), this.props.manager.on("after-update", this.handlePanelChange)
            }, t.prototype.componentWillUnmount = function () {
                var e = this, t = u.findDOMNode(this);
                t.removeEventListener("mouseleave", this.handleMouseLeave), t.removeEventListener("mousemove", this.handleMouseMove), t.removeEventListener("click", this.handleClick), t.removeEventListener("mouseover", this.handeMouseOver), t.removeEventListener("mousedown", this.handeMouseDown), this.props.manager.off("after-update", this.handlePanelChange), setTimeout((function () { return s.clearStoresCache([e.env.session]) }), 500)
            }, t.prototype.contentsRef = function (e) {
                var t, a = this;
                e ? (this.layer = e.querySelector(".ae-Preview-widgets"), this.props.store.setLayer(this.layer), this.unSensor = l.resizeSensor(e, (function () { return a.calculateHighlightBox(a.getHighlightNodes()) }))) : (delete this.layer, null === (t = this.unSensor) || void 0 === t || t.call(this), delete this.unSensor)
            }, t.prototype.handlePanelChange = function () {
                var e = this;
                setTimeout((function () { return e.calculateHighlightBox(e.getHighlightNodes()) }), 50)
            }, t.prototype.getHighlightNodes = function () { return this.props.store.highlightNodes.map((function (e) { return e.id })) }, t.prototype.calculateHighlightBox = function (e) {
                var t = this.props.store;
                this.layer && t.calculateHighlightBox(e)
            }, t.prototype.handeMouseDown = function (e) {
                var t, a = this, n = 1 === e.button && null !== window.event || 0 === e.button;
                if (this.props.editable && n && !e.defaultPrevented && !e.defaultPrevented && !(null === (t = e.target) || void 0 === t ? void 0 : t.closest("[draggable]"))) {
                    var l = this.layer;
                    if (l) {
                        var i = null, o = l.getBoundingClientRect(), r = e.pageX, s = e.pageY, d = r - o.left, u = s - o.top, p = function (e) {
                            i || ((i = document.createElement("div")).classList.add("ae-Editor-selectionCursor"), l.appendChild(i)), a.doingSelection = !0;
                            var t = e.pageX - r, n = e.pageY - s;
                            i.style.cssText = "left: " + (d + Math.min(t, 0)) + "px;top: " + (u + Math.min(n, 0)) + "px;width: " + Math.abs(t) + "px;height: " + Math.abs(n) + "px;"
                        }, c = function (e) {
                            a.doingSelection = !1, window.removeEventListener("mousemove", p), window.removeEventListener("mouseup", c), i && l.removeChild(i);
                            var t = e.pageX - r, n = e.pageY - s, o = { x: d + Math.min(t, 0), y: u + Math.min(n, 0), w: Math.abs(t), h: Math.abs(n) };
                            if (!(o.w < 10 && o.h < 10)) {
                                var m = function (e) { window.removeEventListener("click", m, !0), e.preventDefault(), e.stopPropagation() };
                                window.addEventListener("click", m, !0), setTimeout((function () { return window.removeEventListener("click", m, !0) }), 350), a.doSelection(o)
                            }
                        };
                        window.addEventListener("mousemove", p), window.addEventListener("mouseup", c)
                    }
                }
            }, t.prototype.doSelection = function (e) {
                var t = this.layer, a = u.findDOMNode(this);
                if (t && a) {
                    var n = [], l = t.getBoundingClientRect(), i = e.x + l.left, o = e.y + l.top, r = (e.w, e.h, e.x + l.left + e.w), s = e.y + l.top + e.h, d = a.querySelectorAll("[data-editor-id]");
                    [].slice.apply(d).forEach((function (e) {
                        if (!n.some((function (t) { return t.contains(e) }))) {
                            var t = e.getBoundingClientRect();
                            i <= t.left && o <= t.top && r >= t.right && s >= t.bottom && (~n.indexOf(e) || n.push(e))
                        }
                    }));
                    var p = n.map((function (e) { return e.getAttribute("data-editor-id") })).filter((function (e, t, a) { return a.indexOf(e) === t }));
                    p.length && this.props.manager.setSelection(p)
                }
            }, t.prototype.handleClick = function (e) {
                var t, a = this.props.store, n = e.target.closest("[data-editor-id]");
                if (e.defaultPrevented) e.stopPropagation();
                else if (n && (e.metaKey ? this.props.manager.toggleSelection(n.getAttribute("data-editor-id")) : a.setActiveId(n.getAttribute("data-editor-id"))), !(null === (t = this.layer) || void 0 === t ? void 0 : t.contains(e.target)) && this.props.editable) {
                    var l = this.props.manager.trigger("prevent-click", { data: e });
                    l.prevented || l.stoped || (e.preventDefault(), e.stopPropagation())
                }
            }, t.prototype.handleNavSwitch = function (e) { this.props.store.setActiveId(e) }, t.prototype.handleMouseMove = function (e) {
                var t;
                if (!this.doingSelection && !this.props.manager.disableHover) {
                    var a = this.props.store, n = e.target;
                    if (n.closest(".ae-InsertBefore,.ae-InsertAfter")) a.setHoverId("");
                    else if (!(null === (t = this.layer) || void 0 === t ? void 0 : t.contains(n)) && !n.closest(".ae-AddBtn")) {
                        var l = n.closest("[data-editor-id]");
                        l && a.setHoverId(l.getAttribute("data-editor-id"))
                    }
                }
            }, t.prototype.handleMouseLeave = function () { this.props.store.setHoverId("") }, t.prototype.handeMouseOver = function (e) { this.props.editable && (e.preventDefault(), e.stopPropagation()) }, t.prototype.handleDragEnter = function (e) { this.props.manager.dnd.dragEnter(e.nativeEvent) }, t.prototype.handleDragLeave = function (e) { this.props.manager.dnd.dragLeave(e.nativeEvent) }, t.prototype.handleDragOver = function (e) { this.props.manager.dnd.dragOver(e.nativeEvent) }, t.prototype.handleDrop = function (e) { this.props.manager.dnd.drop(e.nativeEvent) }, t.prototype.rendererResolver = function (e, t, a) {
                var i = this.props, o = i.editable, r = i.manager, s = l.resolveRenderer(e, t);
                if (!1 === o) return s;
                s = s || { name: "error", test: function () { return !0 }, component: m.ErrorRenderer };
                var d = r.getEditorInfo(s, e, t);
                return d && (s = n.__assign(n.__assign({}, s), { component: r.makeWrapper(d, s) })), s
            }, t.prototype.render = function () {
                var e = this, t = this.props, a = t.className, l = t.editable, r = t.store, s = t.manager, d = (t.amisEnv, t.theme), u = t.isMobile, m = t.iframeUrl, f = t.autoFocus, b = t.toolbarContainer, g = n.__rest(t, ["className", "editable", "store", "manager", "amisEnv", "theme", "isMobile", "iframeUrl", "autoFocus", "toolbarContainer"]);
                return i.default.createElement("div", { onDragEnter: this.handleDragEnter, onDragLeave: this.handleDragLeave, onDragOver: this.handleDragOver, onDrop: this.handleDrop, className: o.default("ae-Preview", a, l ? "is-edting" : "", u ? "is-mobile" : "is-pc") }, i.default.createElement("div", { className: "ae-Preview-inner", ref: this.contentsRef }, m && u ? i.default.createElement(h.default, n.__assign({}, g, { key: "mobile", className: "ae-PreviewFrame", editable: l, isMobile: u, store: r, env: this.env, manager: s, url: m, theme: d, autoFocus: f })) : i.default.createElement(v, n.__assign({}, g, { editable: l, autoFocus: f, store: r, env: this.env, key: "pc" })), m && u && r.contextId ? i.default.createElement("span", { className: "ae-IframeMask" }) : null, i.default.createElement("div", { className: "ae-Preview-widgets" }, r.highlightNodes.map((function (t) { return i.default.createElement(p.default, { node: t, key: t.id, store: r, id: t.id, title: t.label, toolbarContainer: b, onSwitch: e.handleNavSwitch, manager: s }, t.childRegions.map((function (e) { return !t.memberImmutable(e.region) && r.isRegionActive(e.id, e.region) ? i.default.createElement(c.default, { manager: s, key: e.region, store: r, node: e, id: e.id, name: e.region, title: e.label, preferTag: e.preferTag }) : null }))) })))))
            }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "contentsRef", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handlePanelChange", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Array]), n.__metadata("design:returntype", void 0)], t.prototype, "calculateHighlightBox", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handeMouseDown", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleClick", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [String]), n.__metadata("design:returntype", void 0)], t.prototype, "handleNavSwitch", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleMouseMove", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handleMouseLeave", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handeMouseOver", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDragEnter", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDragLeave", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDragOver", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDrop", null), t = n.__decorate([d.observer], t)
        }(i.Component);
        t.default = g;
        var v = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.componentDidMount = function () {
                var e = this.props.store;
                this.props.autoFocus && setTimeout((function () {
                    if (f.isAlive(e)) {
                        var t = b.findTree(e.outline, (function (e) { return !e.isRegion && e.clickable }));
                        t && f.isAlive(e) && e.setActiveId(t.id)
                    }
                }), 350)
            }, t.prototype.render = function () {
                var e = this.props, t = e.editable, a = e.store, i = (e.autoFocus, e.env), o = e.data, r = n.__rest(e, ["editable", "store", "autoFocus", "env", "data"]);
                return l.render(t ? a.filteredSchema : a.filteredSchemaForPreview, n.__assign(n.__assign({}, r), { key: t ? "edit-mode" : "preview-mode", theme: i.theme, data: null != o ? o : a.ctx }), i)
            }, t = n.__decorate([d.observer], t)
        }(i.default.Component)
    },
    function (e, t) { e.exports = require("eb0cd8e") },
    function (e, t) { e.exports = require("3638093") },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.AddBTNSvg = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = n.__importDefault(a(8)), o = a(7), r = a(6);
        t.AddBTNSvg = '<svg viewBox="0 0 12 12">\n<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n  <g id="plus" fill="currentColor" fill-rule="nonzero">\n    <polygon points="6.6 6.6 6.6 12 5.4 12 5.4 6.6 0 6.6 0 5.4 5.4 5.4 5.4 0 6.6 0 6.6 5.4 12 5.4 12 6.6"></polygon>\n  </g>\n</g>\n</svg>';
        var s = function (e) {
            function a(a) {
                var n = e.call(this, a) || this, l = n.addBtn = document.createElement("a");
                return l.className = "ae-AddBtn", l.innerHTML = t.AddBTNSvg, l.addEventListener("click", n.handleClick), l.addEventListener("mouseenter", n.handleMouseEnter), l.addEventListener("mouseleave", n.handleMouseLeave), n
            } return n.__extends(a, e), a.prototype.componentDidMount = function () { this.attachAddBtn() }, a.prototype.componentDidUpdate = function () { this.attachAddBtn() }, a.prototype.componentWillUnmount = function () {
                var e;
                null === (e = this.addBtn.parentNode) || void 0 === e || e.removeChild(this.addBtn), this.addBtn.removeEventListener("click", this.handleClick), this.addBtn.removeEventListener("mouseenter", this.handleMouseEnter), this.addBtn.removeEventListener("mouseleave", this.handleMouseLeave)
            }, a.prototype.attachAddBtn = function () {
                var e = this.props, t = e.name, a = e.id, n = e.store, l = n.getDoc().querySelector('[data-region="' + t + '"][data-region-host="' + a + '"]');
                if (l) {
                    var i = n.getNodeById(a);
                    if (i && (n.isActive(a) || n.dropId === a) && n.panels.some((function (e) { return "renderers" === e.key })) && !i.memberImmutable(t)) {
                        var o = [].slice.call(l.children), r = o.indexOf(this.addBtn);
                        ~r && r === o.length - 1 || l.appendChild(this.addBtn)
                    } else this.addBtn.parentElement === l && l.removeChild(this.addBtn)
                }
            }, a.prototype.handleClick = function () {
                var e = this.props, t = e.store, a = e.manager, n = e.id, l = e.name, i = e.preferTag, o = t.getNodeById(n);
                o && t.isActive(n) && t.panels.some((function (e) { return "renderers" === e.key })) && !o.memberImmutable(l) && a.showInsertPanel(l, n, i)
            }, a.prototype.handleMouseEnter = function () { this.props.manager.disableHover || this.props.store.setHoverId(this.props.id, this.props.name) }, a.prototype.handleMouseLeave = function () { this.props.store.setHoverId(this.props.id, "") }, a.prototype.render = function () {
                var e = this.props, t = e.store, a = e.id, n = e.name, o = e.title, r = e.node, s = t.isRegionHighlighted(a, n), d = t.isRegionDragEnter(a, n), u = t.getNodeById(a), p = r.x - u.x, c = r.y - u.y;
                return l.default.createElement("div", { "data-renderer": r.host.info.renderer.name, "data-region": n, className: i.default("ae-Editor-rhlbox", d ? "is-dragenter" : "", s ? "is-highlight" : ""), onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave, style: { width: r.w, height: r.h, borderWidth: Math.max(0, c) + "px " + Math.max(0, u.w - p - r.w) + "px " + Math.max(0, u.h - c - r.h) + "px " + Math.max(0, p) + "px" } }, l.default.createElement("div", { onClick: this.handleClick, "data-node-id": a, "data-node-region": n, className: "region-tip" }, o))
            }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], a.prototype, "attachAddBtn", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], a.prototype, "handleClick", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], a.prototype, "handleMouseEnter", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], a.prototype, "handleMouseLeave", null), a = n.__decorate([o.observer, n.__metadata("design:paramtypes", [Object])], a)
        }(l.default.Component);
        t.default = s
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ErrorRenderer = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = function (e) { function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.render = function () { return l.default.createElement("div", { className: "ae-ErrorRenderer" }, "???????????????????????????") }, t }(l.default.Component);
        t.ErrorRenderer = i
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.mountInIframe = void 0;
        var n = a(0), l = a(7), i = a(10), o = n.__importDefault(a(4)), r = a(11), s = a(1), d = a(6), u = n.__importDefault(a(40)), p = function (e) {
            function t(t) {
                var a = e.call(this, t) || this, n = "__amis_editor_bridge_fn_" + d.guid();
                return window[n] = function (e) { return delete window[n], a.bridge = e, a.update(t), t.manager }, a.bridgeFnName = n, a
            } return n.__extends(t, e), t.prototype.componentDidUpdate = function () { this.update() }, t.prototype.componentWillUnmount = function () {
                var e = this.props.store;
                i.isAlive(e) && e.setDoc(document)
            }, t.prototype.iframeRef = function (e) {
                var t = this.props.store;
                i.isAlive(t) && t.setIframe(e)
            }, t.prototype.update = function (e) {
                var t;
                void 0 === e && (e = this.props);
                var a = e.editable, l = e.store;
                null === (t = this.bridge) || void 0 === t || t.update(n.__assign(n.__assign({}, e), { schema: a ? l.filteredSchema : l.filteredSchemaForPreview }))
            }, t.prototype.render = function () {
                var e = this.props, t = e.url, a = e.manager, n = e.className, l = e.editable, i = e.store;
                return this.schema = l ? i.filteredSchema : i.filteredSchemaForPreview, o.default.createElement("iframe", { ref: this.iframeRef, className: n, id: a.id, src: t + "#" + this.bridgeFnName })
            }, n.__decorate([d.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "iframeRef", null), t = n.__decorate([l.observer, n.__metadata("design:paramtypes", [Object])], t)
        }(o.default.PureComponent);
        t.default = p;
        var c = function (e) {
            function t(t) {
                var a = e.call(this, t) || this;
                a.state = {}, a.inited = !1;
                var l = t.bridgeName, i = parent[l];
                if ("function" != typeof i) throw new Error("????????????????????????????????????");
                var o = i({ update: function (e) { return a.inited ? a.setState(n.__assign({}, e)) : a.state = n.__assign({}, e) } });
                if (!o) throw new Error("????????????");
                o.store.setDoc(document);
                var r = new s.EditorManager(o.config, o.store, o);
                return a.manager = r, a.inited = !0, a
            } return n.__extends(t, e), t.prototype.componentWillUnmount = function () {
                var e = this.manager;
                e.toDispose.forEach((function (e) { return e() })), e.toDispose = [], e.listeners.splice(0, e.listeners.length), e.lazyPatchSchema.cancel()
            }, t.prototype.render = function () { return o.default.createElement(u.default, n.__assign({}, this.state, { manager: this.manager, store: this.manager.store, envCreator: this.props.envCreator })) }, t
        }(o.default.Component);
        t.mountInIframe = function (e, t, a) {
            if (!location.hash || parent === window) throw new Error("????????? Iframe ????????????");
            var n = location.hash.substring(1);
            t.render(o.default.createElement(c, { bridgeName: n, envCreator: a }), e), window.onunload = function () { r.unmountComponentAtNode(e) }
        }
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ContainerWrapper = void 0;
        var n = a(0), l = a(27), i = n.__importDefault(a(4)), o = a(7), r = a(6), s = n.__importDefault(a(12)), d = a(14), u = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.getWrappedInstance = function () { return this.ref }, t.prototype.refFn = function (e) { this.ref = e }, t.prototype.renderChild = function (e, t, a) {
                var n = this.props, l = n.render, o = n.$$editor, r = l(e, t, a), u = s.default(o.regions, (function (t) { return t.key === e && !t.matchRegion && !t.renderMethod }));
                if (u) {
                    var p = u.wrapper || d.RegionWrapper;
                    return i.default.createElement(p, { key: null == a ? void 0 : a.key, preferTag: u.preferTag, name: u.key, label: u.label, placeholder: u.placeholder, regionConfig: u, editorStore: o.plugin.manager.store, wrapperResolve: u.wrapperResolve, manager: o.plugin.manager, children: r, rendererName: o.renderer.name })
                } return r
            }, t.prototype.render = function () {
                var e = this.props, t = e.$$editor, a = e.$$node, o = n.__rest(e, ["$$editor", "$$node"]), r = {}, s = t.plugin.manager.store;
                return t.id && (s.isActive(t.id) || s.dropId === t.id) && Array.isArray(t.regions) && t.regions.forEach((function (e) {
                    var t = e.key;
                    if (!e.optional && !(null == a ? void 0 : a.memberImmutable(t))) {
                        var n = Array.isArray(o[t]) ? o[t].concat() : o[t] ? [o[t]] : [];
                        n.length || n.push({ children: function () { return null } }), r[t] = n
                    }
                })), i.default.createElement(l.NodeWrapper, n.__assign({}, o, r, { $$editor: t, $$node: a, render: this.renderChild, ref: this.refFn }))
            }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "refFn", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [String, Object, Object]), n.__metadata("design:returntype", void 0)], t.prototype, "renderChild", null), t = n.__decorate([o.observer], t)
        }(i.default.Component);
        t.ContainerWrapper = u
    },
    function (e, t) { e.exports = require("7f33406") },
    function (e, t) { e.exports = require("09afeaf") },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DefaultDNDMode = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(15)), o = a(17), r = function () {
            function e(e, t) { this.dnd = e, this.region = t, this.exchangeX = 0, this.exchangeY = 0, this.constainer = this.dnd.store.getDoc().querySelector('[data-region="' + t.region + '"][data-region-host="' + t.id + '"]') } return e.prototype.enter = function (e, t) {
                var a = this.dnd.dragElement, n = Array.isArray(this.region.schema) ? this.region.schema : [];
                if (a && a.closest("[data-region]") === this.constainer) {
                    var l = this.getChild(this.constainer, a), r = a.getAttribute("data-editor-id"), s = i.default(n, (function (e) { return e.$$id === r }));
                    ~s && n[s + 1] && (this.dropBeforeId = n[s + 1].$$id), this.constainer.insertBefore(t, l);
                    var d = a.outerHTML.replace("ae-is-draging", "").replace(/\bdata\-editor\-id=(?:'.+?'|".+?")/g, "");
                    t.innerHTML = d
                } else {
                    var u = this.dnd.manager, p = u.store;
                    o.renderThumbToGhost(t, this.region, p.dragSchema, u), this.constainer.appendChild(t)
                }
            }, e.prototype.leave = function (e, t) { this.constainer.removeChild(t) }, e.prototype.over = function (e, t) {
                var a, n, o = this.getTarget(e), r = this.constainer, s = Array.isArray(this.region.schema) ? this.region.schema : [], d = e.clientX - this.exchangeX, u = e.clientY - this.exchangeY;
                Math.abs(u), Math.abs(d);
                if (o && !l.animation.animating) {
                    var p = o.getAttribute("data-editor-id"), c = this.getChild(r, o), m = i.default(s, (function (e) { return e.$$id === p })), h = Array.prototype.indexOf.call(r.children, t), f = Array.prototype.indexOf.call(r.children, c);
                    ~h && h > f && (!this.exchangeY || u < 0 || d < 0) ? (this.exchangeX = e.clientX, this.exchangeY = e.clientY, this.dropBeforeId = null === (a = s[m]) || void 0 === a ? void 0 : a.$$id, h !== f - 1 && (l.animation.capture(r), r.insertBefore(t, c), l.animation.animateAll())) : ~h && h < f && (!this.exchangeY || u > 0 || d > 0) && (this.exchangeX = e.clientX, this.exchangeY = e.clientY, s[m + 1] ? this.dropBeforeId = null === (n = s[m + 1]) || void 0 === n ? void 0 : n.$$id : delete this.dropBeforeId, h !== f + 1 && (l.animation.capture(r), r.insertBefore(t, c.nextSibling), l.animation.animateAll()))
                } t.parentNode !== r && (delete this.dropBeforeId, l.animation.capture(r), r.appendChild(t), l.animation.animateAll())
            }, e.prototype.getDropBeforeId = function () { return this.dropBeforeId }, e.prototype.getTarget = function (e) {
                for (var t, a, n = e.target.closest("[data-editor-id]");
                    n;
                ) {
                    if ((null === (t = n.parentElement) || void 0 === t ? void 0 : t.closest("[data-region]")) === this.constainer) return "grid" === n.getAttribute("data-renderer") ? n.parentElement : n;
                    n = (null === (a = n.parentElement) || void 0 === a ? void 0 : a.closest("[data-editor-id]")) || null
                } return null
            }, e.prototype.getChild = function (e, t) {
                for (var a = t;
                    a && a.parentElement !== e;
                )a = a.parentElement;
                return a
            }, e.prototype.dispose = function () { }, e
        }();
        t.DefaultDNDMode = r
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        var n = a(0), l = n.__importDefault(a(4)), i = a(5), o = a(6), r = a(34), s = n.__importDefault(a(8)), d = a(11), u = a(10), p = a(9), c = function (e) {
            function t() {
                var t, a, l = e.apply(this, arguments) || this;
                return l.env = n.__assign(n.__assign(n.__assign(n.__assign({}, l.props.manager.env), { notify: function (e, t) { l.props.editable ? console.warn("[Notify]", e, t) : i.toast[e] ? i.toast[e](t, "error" === e ? "????????????" : "????????????") : console.warn("[Notify]", e, t) }, theme: l.props.theme, session: "preview-" + l.props.manager.id, rendererResolver: l.rendererResolver }), l.props.manager.env), null === (a = (t = l.props).envCreator) || void 0 === a ? void 0 : a.call(t, l.props)), l
            } return n.__extends(t, e), t.prototype.componentDidMount = function () {
                var e = d.findDOMNode(this);
                if (e.addEventListener("mouseleave", this.handleMouseLeave), e.addEventListener("mousemove", this.handleMouseMove), e.addEventListener("click", this.handleClick), e.addEventListener("mouseover", this.handeMouseOver), this.props.autoFocus) {
                    var t = this.props.manager.store;
                    setTimeout((function () {
                        if (u.isAlive(t)) {
                            var e = p.findTree(t.outline, (function (e) { return !e.isRegion && e.clickable }));
                            e && t.setActiveId(e.id)
                        }
                    }), 350)
                }
            }, t.prototype.componentWillUnmount = function () {
                var e = d.findDOMNode(this);
                e.removeEventListener("mouseleave", this.handleMouseLeave), e.removeEventListener("mousemove", this.handleMouseMove), e.removeEventListener("click", this.handleClick), e.removeEventListener("mouseover", this.handeMouseOver)
            }, t.prototype.contentsRef = function (e) {
                var t, a = this;
                this.dom = e, e ? (this.syncIframeHeight(), this.unSensor = i.resizeSensor(e, (function () { a.syncIframeHeight() }))) : (null === (t = this.unSensor) || void 0 === t || t.call(this), delete this.unSensor)
            }, t.prototype.syncIframeHeight = function () {
                var e = this.props.manager;
                this.dom && (e.store.getIframe().style.cssText += "height: " + this.dom.offsetHeight + "px")
            }, t.prototype.handleClick = function (e) {
                var t = this.props.store, a = e.target.closest("[data-editor-id]");
                if (!e.defaultPrevented && (a && t.setActiveId(a.getAttribute("data-editor-id")), this.props.editable)) {
                    var n = this.props.manager.trigger("prevent-click", { data: e });
                    n.prevented || n.stoped || (e.preventDefault(), e.stopPropagation())
                }
            }, t.prototype.handleMouseMove = function (e) {
                var t = this.props.store, a = e.target;
                if (!a.closest(".ae-AddBtn")) {
                    var n = a.closest("[data-editor-id]");
                    n && t.setHoverId(n.getAttribute("data-editor-id"))
                }
            }, t.prototype.handleMouseLeave = function () { this.props.store.setHoverId("") }, t.prototype.handeMouseOver = function (e) { this.props.editable && (e.preventDefault(), e.stopPropagation()) }, t.prototype.handleDragEnter = function (e) { this.props.manager.dnd.dragEnter(e.nativeEvent) }, t.prototype.handleDragLeave = function (e) { this.props.manager.dnd.dragLeave(e.nativeEvent) }, t.prototype.handleDragOver = function (e) { this.props.manager.dnd.dragOver(e.nativeEvent) }, t.prototype.handleDrop = function (e) { this.props.manager.dnd.drop(e.nativeEvent) }, t.prototype.handleContextMenu = function (e) {
                var t, a = null === (t = e.target.closest("[data-editor-id]")) || void 0 === t ? void 0 : t.getAttribute("data-editor-id"), n = "";
                if (!a) {
                    var l = e.target.closest("[data-node-id]");
                    if (!(a = null == l ? void 0 : l.getAttribute("data-node-id"))) return;
                    n = l.getAttribute("data-node-region")
                } e.preventDefault(), e.stopPropagation();
                var i = this.props.manager, o = i.store.getIframe().getBoundingClientRect();
                i.parent.openContextMenu(a, n, { x: window.scrollX + e.clientX + o.left, y: window.scrollY + e.clientY + o.top })
            }, t.prototype.rendererResolver = function (e, t, a) {
                var l = this.props, o = l.editable, s = l.manager, d = i.resolveRenderer(e, t);
                if (!1 === o) return d;
                d = d || { name: "error", test: function () { return !0 }, component: r.ErrorRenderer };
                var u = s.getEditorInfo(d, e, t);
                return u && (d = n.__assign(n.__assign({}, d), { component: s.makeWrapper(u, d) })), d
            }, t.prototype.render = function () {
                var e = this.props, t = e.store, a = e.editable, o = (e.manager, e.className), r = e.schema, d = e.data, u = n.__rest(e, ["store", "editable", "manager", "className", "schema", "data"]);
                return l.default.createElement("div", { ref: this.contentsRef, onContextMenu: this.handleContextMenu, onDragEnter: this.handleDragEnter, onDragLeave: this.handleDragLeave, onDragOver: this.handleDragOver, onDrop: this.handleDrop, className: s.default("ae-IFramePreview", o, a ? "is-edting" : "") }, i.render(r || { type: "tpl", tpl: "??????????????????" }, n.__assign(n.__assign({}, u), { key: a ? "edit-mode" : "preview-mode", theme: this.env.theme, data: null != d ? d : t.ctx }), this.env))
            }, n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "contentsRef", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleClick", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleMouseMove", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handleMouseLeave", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handeMouseOver", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDragEnter", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDragLeave", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDragOver", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDrop", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleContextMenu", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [String, Object, Object]), n.__metadata("design:returntype", void 0)], t.prototype, "rendererResolver", null), t
        }(l.default.Component);
        t.default = c
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.SubEditor = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(5), o = a(7), r = n.__importDefault(a(24)), s = a(6), d = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.afterResolveEditorInfo = function (e) {
                var t, a, n, l, i, o, r = this.props.store, s = e.context;
                if (null === (t = r.subEditorContext) || void 0 === t ? void 0 : t.slot) {
                    var d = r.subEditorSlotPath;
                    !~s.schemaPath.indexOf(d) && s.data ? (s.data.editable = !1, s.data.memberImmutable = !Array.isArray(null === (l = r.subEditorContext) || void 0 === l ? void 0 : l.value), s.data.memberImmutable || (s.data.name = "??????")) : s.schemaPath === d && s.data && (Array.isArray(null === (i = r.subEditorContext) || void 0 === i ? void 0 : i.value) || (s.data.movable = !1, s.data.removable = !1), s.data.typeMutable = null === (o = r.subEditorContext) || void 0 === o ? void 0 : o.typeMutable)
                } else s.data && !s.schemaPath && (null === (a = r.subEditorContext) || void 0 === a ? void 0 : a.memberImmutable) && (s.data.memberImmutable = null === (n = r.subEditorContext) || void 0 === n ? void 0 : n.memberImmutable)
            }, t.prototype.handleBuildPanels = function (e) {
                var t, a = this.props.store;
                if (null === (t = a.subEditorContext) || void 0 === t ? void 0 : t.slot) {
                    var n = a.subEditorSlotPath, l = e.context;
                    if (!~l.schemaPath.indexOf(n)) {
                        var i = l.data.concat();
                        if (l.data.splice(0, l.data.length), !l.info.memberImmutable) {
                            var o = i.find((function (e) { return "renderers" === e.key }));
                            o && l.data.push(o)
                        }
                    }
                }
            }, t.prototype.buildSchema = function () {
                var e, t = this, a = this.props, i = a.store, o = a.manager, s = i.subEditorContext, d = o.config;
                return {
                    size: "full", title: null === (e = i.subEditorContext) || void 0 === e ? void 0 : e.title, onClose: i.closeSubEditor, onConfirm: i.confirmSubEditor, body: i.subEditorContext ? {
                        type: "form", mode: "normal", wrapperComponent: "div", onValidate: function (e) {
                            return n.__awaiter(t, void 0, void 0, (function () {
                                var t, a, l;
                                return n.__generator(this, (function (n) {
                                    switch (n.label) {
                                        case 0: return [4, null === (l = null === (a = i.subEditorContext) || void 0 === a ? void 0 : a.validate) || void 0 === l ? void 0 : l.call(a, e)];
                                        case 1: return (t = n.sent()) ? [2, { schema: t }] : [2]
                                    }
                                }))
                            }))
                        }, onChange: i.subEditorOnChange, body: [{
                            name: "schema", asFormItem: !0, children: function (e) {
                                var a, n = e.value, s = e.onChange;
                                return l.default.createElement(r.default, { autoFocus: !0, value: n, ref: i.subEditorRef, onChange: s, data: null === (a = i.subEditorContext) || void 0 === a ? void 0 : a.data, schemaFilter: o.config.schemaFilter, theme: o.env.theme, afterResolveEditorInfo: t.afterResolveEditorInfo, onBuildPanels: t.handleBuildPanels, isMobile: i.isMobile, isSubEditor: !0, iframeUrl: d.iframeUrl, ctx: i.ctx, amisEnv: d.amisEnv, plugins: d.plugins, isHiddenProps: d.isHiddenProps, $schemaUrl: d.$schemaUrl })
                            }
                        }]
                    } : { type: "tpl", tpl: "Loading..." }, actions: [[{ children: s ? l.default.createElement("div", { className: "ae-DialogToolbar" }, l.default.createElement("button", { type: "button", "data-tooltip": "??????", disabled: !s.canUndo, onClick: i.undoSubEditor }, l.default.createElement("i", { className: "fa fa-undo" })), l.default.createElement("button", { type: "button", "data-tooltip": "??????", disabled: !s.canRedo, onClick: i.redoSubEditor }, l.default.createElement("i", { className: "fa fa-rotate-right" }))) : null }, { type: "submit", label: "??????", level: "primary" }, { type: "button", label: "??????", actionType: "close" }]], closeOnEsc: !1, bodyClassName: "ae-dialog"
                }
            }, t.prototype.render = function () {
                var e = this.props, t = e.store, a = e.theme, l = e.manager;
                return i.render(n.__assign({ type: "dialog" }, this.buildSchema()), { show: !!t.subEditorContext, data: { schema: t.subEditorValue } }, n.__assign(n.__assign({}, l.env), { seesion: "editor-dialog", theme: a }))
            }, n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "afterResolveEditorInfo", null), n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleBuildPanels", null), t = n.__decorate([o.observer], t)
        }(l.default.Component);
        t.SubEditor = d
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ScaffoldModal = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(5), o = a(7), r = a(6), s = a(9), d = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.handleConfirm = function (e) {
                var t, a, l, i = e[0], o = this.props.store;
                if (i = n.__assign(n.__assign({}, null === (t = o.scaffoldForm) || void 0 === t ? void 0 : t.value), i), null === (a = o.scaffoldForm) || void 0 === a ? void 0 : a.pipeOut) {
                    var r = o.scaffoldForm.pipeOut(i);
                    i = n.__assign({}, r)
                } null === (l = o.scaffoldForm) || void 0 === l || l.callback(i), o.closeScaffoldForm()
            }, t.prototype.buildSchema = function () {
                var e, t, a = this.props.store.scaffoldForm;
                return (e = { type: "form", wrapWithPanel: !1, initApi: a.initApi, api: a.api, mode: a.mode || "normal", wrapperComponent: "div" })[a.controls ? "controls" : "body"] = null !== (t = a.controls) && void 0 !== t ? t : a.body, e
            }, t.prototype.scopeRef = function (e) { this.amisScope = e }, t.prototype.handleConfirmClick = function () {
                var e;
                return n.__awaiter(this, void 0, void 0, (function () {
                    var t, a, l, i;
                    return n.__generator(this, (function (n) {
                        switch (n.label) {
                            case 0: if (!(t = null === (e = this.amisScope) || void 0 === e ? void 0 : e.getComponents()[0])) return [2];
                                a = this.props.store, n.label = 1;
                            case 1: return n.trys.push([1, 3, 4, 5]), a.setScaffoldBuzy(!0), [4, t.doAction({ type: "submit" }, t.props.data, !0)];
                            case 2: return l = n.sent(), this.handleConfirm([l]), [3, 5];
                            case 3: return i = n.sent(), console.log(i.stack), a.setScaffoldError(i.message), [3, 5];
                            case 4: return a.setScaffoldBuzy(!1), [7];
                            case 5: return [2]
                        }
                    }))
                }))
            }, t.prototype.render = function () {
                var e = this.props, t = e.store, a = e.theme, o = e.manager, r = t.scaffoldForm, d = i.getTheme(a || "cxd").classnames;
                return l.default.createElement(i.Modal, { size: (null == r ? void 0 : r.size) || "md", show: !!r, onHide: t.closeScaffoldForm, closeOnEsc: !t.scaffoldFormBuzy }, l.default.createElement("div", { className: d("Modal-header") }, t.scaffoldFormBuzy ? null : l.default.createElement("a", { "data-position": "left", onClick: t.closeScaffoldForm, className: d("Modal-close") }, l.default.createElement(i.Icon, { icon: "close", className: "icon" })), l.default.createElement("div", { className: d("Modal-title") }, null == r ? void 0 : r.title)), l.default.createElement("div", { className: d("Modal-body") }, r ? i.render(this.buildSchema(), { data: s.createObject(t.ctx, null == r ? void 0 : r.value), onValidate: r.validate, scopeRef: this.scopeRef }, n.__assign(n.__assign({}, o.env), { seesion: "scaffold-dialog", theme: a })) : l.default.createElement("p", null, "Loading...")), l.default.createElement("div", { className: d("Modal-footer") }, t.scaffoldFormBuzy || t.scaffoldError ? l.default.createElement("div", { className: d("Dialog-info"), key: "info" }, l.default.createElement(i.Spinner, { size: "sm", key: "info", show: t.scaffoldFormBuzy }), t.scaffoldError ? l.default.createElement("span", { className: d("Dialog-error") }, t.scaffoldError) : null) : null, l.default.createElement(i.Button, { level: "primary", onClick: this.handleConfirmClick, disabled: t.scaffoldFormBuzy }, "??????"), l.default.createElement(i.Button, { onClick: t.closeScaffoldForm }, "??????")))
            }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleConfirm", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "scopeRef", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", Promise)], t.prototype, "handleConfirmClick", null), t = n.__decorate([o.observer], t)
        }(l.default.Component);
        t.ScaffoldModal = d
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.AvailableRenderersPlugin = void 0;
        var n = a(0), l = a(67), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.order = -9999, t
            } return n.__extends(t, e), t.prototype.buildEditorPanel = function (e, t) {
                e.node, e.info;
                var a = this.manager.store;
                e.selections.length || a.activeContainerId && a.subRenderers.length && t.push({ key: "renderers", icon: "fa fa-cube", title: "??????", component: l.AvailableRenderersPanel, position: "left", order: 4e3 })
            }, t
        }(a(2).BasePlugin);
        t.AvailableRenderersPlugin = o, i.registerEditorPlugin(o)
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.BasicToolbarPlugin = void 0;
        var n = a(0), l = a(2), i = a(1), o = a(33), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.order = -9999, t
            } return n.__extends(t, e), t.prototype.buildEditorToolbar = function (e, t) {
                var a, n = this, l = e.id, i = e.schema, r = this.manager.store, s = r.getNodeById(l), d = r.getSchemaParentById(l), u = s.parent;
                if (Array.isArray(d) && (null == u ? void 0 : u.isRegion)) {
                    var p = s.host;
                    s.draggable && t.push({ icon: "fa fa-arrows", tooltip: "????????????????????????", placement: "bottom", draggable: !0, onDragStart: this.manager.startDrag.bind(this.manager, l) });
                    var c = d.indexOf(i);
                    if (!(null == p ? void 0 : p.memberImmutable(u.region)) && r.panels.some((function (e) { return "renderers" === e.key }))) {
                        var m = null === (a = d[c + 1]) || void 0 === a ? void 0 : a.$$id;
                        t.push({ icon: o.AddBTNSvg, tooltip: "??????????????????", level: "special", placement: "bottom", className: "ae-InsertBefore is-vertical", onClick: function () { return n.manager.showInsertPanel(u.region, u.id, u.preferTag, "insert", void 0, l) } }, { icon: o.AddBTNSvg, tooltip: "??????????????????", level: "special", placement: "top", className: "ae-InsertAfter is-vertical", onClick: function () { return n.manager.showInsertPanel(u.region, u.id, u.preferTag, "insert", void 0, m) } })
                    }
                } s.isVitualRenderer || !s.info.plugin.popOverBody && !s.info.plugin.popOverBodyCreator || t.push({ icon: "fa fa-pencil", tooltip: "??????", placement: "bottom", onClick: function (e) { return n.manager.openNodePopOverForm(s.id) } }), t.push({
                    icon: "fa fa-cog", tooltip: "??????", placement: "right", order: 999, onClick: function (e) {
                        if (!e.defaultPrevented) {
                            var t = e.target.parentElement.getBoundingClientRect();
                            n.manager.openContextMenu(l, "", { x: window.scrollX + t.left + t.width - 185, y: window.scrollY + t.top + t.height })
                        }
                    }
                })
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a, n, l = this, i = e.id, o = e.schema, r = e.region, s = e.selections, d = this.manager, u = d.store, p = u.getSchemaParentById(i), c = u.getNodeById(i), m = u.getNodePathById(i), h = m.pop(), f = c.host, b = c.parent;
                if (s.length) t.push({ label: "????????????", disabled: s.some((function (e) { return !e.node.duplicatable })), onSelect: function () { return d.duplicate(s.map((function (e) { return e.id }))) } }), t.push({ label: "????????????", onSelect: function () { return u.setActiveId(i) } }), t.push({ label: "??????", disabled: s.some((function (e) { return !e.node.removable })), className: "text-danger", onSelect: function () { return d.del(s.map((function (e) { return e.id }))) } });
                else if (r) { (y = u.panels.find((function (e) { return "renderers" === e.key }))) && (t.push({ label: "????????????", onHighlight: function (e) { return e && u.setHoverId(i, r) }, onSelect: function () { return d.showInsertPanel(r, i) } }), t.push({ label: "??????", onSelect: function () { return d.emptyRegion(i, r) } }), t.push({ label: "??????", onSelect: function () { return d.paste(i, r) } })) } else {
                    if (t.push({ label: "??????" + h.label, disabled: u.activeId === h.id, data: i, onSelect: function (e) { return u.setActiveId(e) }, onHighlight: function (e, t) { return e && u.setHoverId(t) } }), m.length) {
                        var g = m.filter((function (e) {
                            var t;
                            return !e.isRegion && !1 !== (null === (t = e.info) || void 0 === t ? void 0 : t.editable)
                        })).reverse().map((function (e) { return { label: e.label, data: e.id, onSelect: function (e) { return u.setActiveId(e) }, onHighlight: function (e, t) { return e && u.setHoverId(t) } } }));
                        g.length && t.push({ label: "????????????", children: g })
                    } t.push({ label: "????????????", disabled: !u.activeId || u.activeId !== i, onSelect: function () { return u.setActiveId("") } }), t.push("|"), t.push({ label: "????????????", disabled: !c.duplicatable, onSelect: function () { return d.duplicate(i) } }), t.push({ label: "????????????", onSelect: function () { return d.copy(i) } }), t.push({ label: "????????????", disabled: !c.removable, onSelect: function () { return d.cut(i) } }), t.push({ label: "????????????", disabled: !Array.isArray(p) || !c.parent || !1 === (null === (a = c.info) || void 0 === a ? void 0 : a.typeMutable) || !c.replaceable, onSelect: function () { return d.paste(i) } }), t.push({ label: "??????", disabled: !c.removable, className: "text-danger", onSelect: function () { return d.del(i) } }), t.push("|");
                    var v = Array.isArray(p) ? p.indexOf(o) : -1;
                    t.push({ label: "????????????", disabled: !(Array.isArray(p) && v > 0 && c.moveable && c.prevSibling), onSelect: function () { return d.moveUp() } }), t.push({ label: "????????????", disabled: !(Array.isArray(p) && v < p.length - 1 && c.moveable && c.nextSibling), onSelect: function () { return d.moveDown() } }), t.push({ label: "??????????????????", disabled: !Array.isArray(p) || !b || !b.isRegion || !f || f.memberImmutable(b.region) || !u.panels.some((function (e) { return "renderers" === e.key })), onSelect: function () { return l.manager.showInsertPanel(b.region, b.id, b.preferTag, "insert", void 0, i) } }), t.push({
                        label: "??????????????????", disabled: !Array.isArray(p) || !b || !b.isRegion || !f || f.memberImmutable(b.region) || !u.panels.some((function (e) { return "renderers" === e.key })), onSelect: function () {
                            var e;
                            return l.manager.showInsertPanel(b.region, b.id, b.preferTag, "insert", void 0, null === (e = p[v + 1]) || void 0 === e ? void 0 : e.$$id)
                        }
                    }), t.push("|"), t.push({ label: "?????????Undo???", disabled: !u.canUndo, onSelect: function () { return u.undo() } }), t.push({ label: "?????????Redo???", disabled: !u.canRedo, onSelect: function () { return u.redo() } }), t.push("|");
                    var y = u.panels.find((function (e) { return "renderers" === e.key }));
                    h.childRegions.length && y && (h.childRegions.length > 1 ? t.push({ label: "????????????", children: h.childRegions.map((function (e) { return { label: "" + e.label, data: e.region, onHighlight: function (e, t) { return e ? u.setHoverId(i, t) : u.setHoverId("") }, onSelect: function (e) { return d.showInsertPanel(e, i) } } })) }) : t.push({ label: "????????????", data: h.childRegions[0].region, onHighlight: function (e, t) { return e ? u.setHoverId(i, t) : u.setHoverId("") }, onSelect: function (e) { return d.showInsertPanel(e, i) } })), t.push({ label: "????????????", disabled: !(c.host && !1 !== (null === (n = c.info) || void 0 === n ? void 0 : n.typeMutable) && c.parent.isRegion && u.panels.some((function (e) { return "renderers" === e.key })) && c.replaceable), onSelect: function () { return d.showReplacePanel(i) } })
                }
            }, t.prototype.buildEditorPanel = function (e, t) {
                if (e.selections.length) {
                    var a = [], l = n.__assign(n.__assign({}, e), { data: a, region: "" });
                    (a = this.manager.buildContextMenus(l)).length && t.push({ key: "contextmenu", icon: "fa fa-cog", title: "??????", render: this.manager.makeSchemaFormRender({ body: [{ type: "button-group", block: !0, buttons: a.filter((function (e) { return "|" !== e })).map((function (e) { return n.__assign(n.__assign({}, e), { type: "button", onClick: e.onSelect }) })) }] }) })
                }
            }, t.prototype.afterInsert = function (e) {
                var t, a, n = this, l = e.context;
                if (l.node && (null === (a = null === (t = l.subRenderer) || void 0 === t ? void 0 : t.plugin) || void 0 === a ? void 0 : a.popOverBody)) {
                    var i = l.data.$$id;
                    i && setTimeout((function () { n.manager.setActiveId(i), requestAnimationFrame((function () { n.manager.openNodePopOverForm(i) })) }), 200)
                }
            }, t
        }(l.BasePlugin);
        t.BasicToolbarPlugin = r, i.registerEditorPlugin(r)
    },
    function (e, t) { e.exports = require("a2d3c6a") },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.InlineModal = t.DialogPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(1), o = a(2), r = a(3), s = a(6), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "dialog", t.$schema = "/schemas/DialogSchema.json", t.name = "??????", t.wrapperProps = { wrapperComponent: u, onClose: s.noop, show: !0 }, t.regions = [{
                    key: "body", label: "?????????", renderMethod: "renderBody", renderMethodOverride: function (e, t) {
                        return function () {
                            for (var a = [], n = 0;
                                n < arguments.length;
                                n++)a[n] = arguments[n];
                            var l = this.props.$$editor, i = this.super.apply(this, a);
                            return l && "body" === a[1] ? t(this, i, e, l, l.plugin.manager) : i
                        }
                    }
                }, { key: "actions", label: "?????????", renderMethod: "renderFooter", wrapperResolve: function (e) { return e } }], t.panelTitle = "??????", t.panelBody = [r.getSchemaTpl("tabs", [{
                    title: "??????", body: [{ label: "??????", type: "input-text", name: "title" }, { type: "switch", label: "????????????", name: "data", mode: "inline", className: "block m-b-xs", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? { "&": "$$" } : null } }, { type: "tpl", visibleOn: "!this.data", tpl: '<p class="text-sm text-muted">????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>' }, {
                        type: "combo", syncDefaultValue: !1, name: "data", visibleOn: "this.data", descriptionClassName: "help-block text-xs m-b-none", description: '<p>???????????????????????????????????????????????????????????????????????????????????????????????????<code>{"a": "\\${a}", "b": 2}</code></p><p>???????????????????????????????????????????????????????????? Key ??? `&` Value ??? `\\$$` ??????????????????</p><div>????????? <code>__undefined</code>????????????????????????????????????????????????<code>{"&": "\\$$"}</code>???????????????????????????</div>', multiple: !0, messages: { validateFailed: "?????????????????????????????????????????????" }, pipeIn: function (e) {
                            if (!s.isObject(e)) return e;
                            var t = [];
                            return Object.keys(e).forEach((function (a) { t.push({ key: a || "", value: "string" == typeof e[a] ? e[a] : JSON.stringify(e[a]) }) })), t
                        }, pipeOut: function (e) {
                            if (!Array.isArray(e)) return e;
                            var t = {};
                            return e.forEach((function (e) {
                                var a = e.key || "", n = e.value;
                                try { n = JSON.parse(n) } catch (e) { } t[a] = n
                            })), t
                        }, items: [{ placeholder: "Key", type: "input-text", unique: !0, name: "key", required: !0 }, { placeholder: "Value", type: "input-text", name: "value" }]
                    }, { label: "??? Esc ????????????", type: "switch", name: "closeOnEsc", mode: "inline", className: "block", value: !1 }, { label: "?????????????????????????????????", type: "switch", name: "closeOnOutside", mode: "inline", className: "block", value: !1 }]
                }, { title: "??????", body: [{ label: "??????", type: "button-group-select", name: "size", size: "sm", className: "block", pipeIn: r.defaultValue(""), options: [{ label: "???", value: "sm" }, { label: "??????", value: "" }, { label: "???", value: "md" }, { label: "???", value: "lg" }, { label: "??????", value: "xl" }] }, { label: "????????????????????????", type: "switch", name: "showCloseButton", mode: "inline", className: "block", value: !0 }, r.getSchemaTpl("className", { name: "headerClassName", label: "?????? CSS ??????" }), r.getSchemaTpl("className", { name: "bodyClassName", label: "?????? CSS ??????" })] }])], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function () { }, t
        }(o.BasePlugin);
        t.DialogPlugin = d, i.registerEditorPlugin(d);
        var u = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.componentDidMount = function () { }, t.prototype.render = function () {
                var e = this.props.children;
                return l.default.createElement("div", { className: "ae-InlineModel" }, e)
            }, t
        }(l.default.Component);
        t.InlineModal = u
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.GridPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(13), u = a(14), p = a(48), c = a(6), m = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "grid", t.$schema = "/schemas/GridSchema.json", t.name = "??????", t.tags = ["??????"], t.icon = "fa fa-th", t.scaffolds = [{ name: "??????", description: "bla bla", scaffold: { type: "grid", columns: [{ body: [] }, { body: [] }] }, previewSchema: { type: "grid", columns: [{ body: [{ type: "tpl", tpl: "???", inline: !1, className: "bg-light wrapper" }] }, { body: [{ type: "tpl", tpl: "???", className: "bg-light wrapper", inline: !1 }] }] } }, { name: "??????", description: "bla bla", scaffold: { type: "grid", columns: [{ body: [] }, { body: [] }, { body: [] }] }, previewSchema: { type: "grid", columns: [{ body: [{ type: "tpl", tpl: "???", inline: !1, className: "bg-light wrapper" }] }, { body: [{ type: "tpl", tpl: "???", className: "bg-light wrapper", inline: !1 }] }, { body: [{ type: "tpl", tpl: "???", className: "bg-light wrapper", inline: !1 }] }] } }], t.panelTitle = "????????????", t.panelWithOutOthers = !1, t.vRendererConfig = { regions: { body: { key: "body", label: "?????????", placeholder: "???", wrapperResolve: function (e) { return e } } }, panelTitle: "???", panelBodyCreator: function (e) { return [s.getSchemaTpl("fieldSet", { title: "??????", collapsable: !1, body: [{ type: "wrapper", size: "none", className: "grid grid-cols-2 gap-4", body: [{ children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertRowAfter(e.node.host) } }, i.default.createElement(p.Icon, { className: "icon", icon: "arrow-to-bottom" }), i.default.createElement("span", null, "??????????????????")) }, { children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertRowBefore(e.node.host) } }, i.default.createElement(p.Icon, { className: "icon", icon: "top-arrow-to-top" }), i.default.createElement("span", null, "??????????????????")) }, { children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertColumnBefore(e) } }, i.default.createElement(p.Icon, { className: "icon", icon: "left-arrow-to-left" }), i.default.createElement("span", null, "??????????????????")) }, { children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertColumnAfter(e) } }, i.default.createElement(p.Icon, { className: "icon", icon: "arrow-to-right" }), i.default.createElement("span", null, "??????????????????")) }] }] }), s.getSchemaTpl("fieldSet", { title: "????????????", collapsable: !1, body: [{ type: "button-group-select", name: "md", size: "sm", label: !1, pipeIn: function (e) { return "number" == typeof e ? "manual" : e || "" }, pipeOut: function (e) { return "manual" === e ? 1 : e }, tiled: !0, options: [{ value: "", label: "????????????" }, { value: "auto", label: "????????????" }, { value: "manual", label: "??????" }] }, { visibleOn: 'typeof this.md === "number"', label: "????????????", type: "input-range", name: "md", min: 1, max: 12, step: 1 }] }), s.getSchemaTpl("fieldSet", { title: "????????????", collapsable: !1, body: [{ type: "button-group-select", name: "valign", size: "sm", label: !1, tiled: !0, clearable: !0, options: [{ value: "top", label: "????????????" }, { value: "middle", label: "????????????" }, { value: "bottom", label: "????????????" }, { value: "between", label: "????????????" }] }] }), t.panelWithOutOthers ? null : s.getSchemaTpl("fieldSet", { title: "CSS ??????", body: [s.getSchemaTpl("className", { label: "??? CSS ??????", name: "columnClassName" })] })].filter((function (e) { return e })) } }, t.vWrapperResolve = function (e) { return e }, t.overrides = {
                    renderColumn: function (e, t, a) {
                        var n, l, o = this.super(e, t, a), r = this.props.$$editor;
                        if (r && e.$$id) {
                            var s = r.plugin, p = null === (l = null === (n = s.vRendererConfig) || void 0 === n ? void 0 : n.regions) || void 0 === l ? void 0 : l.body;
                            return p ? i.default.createElement(d.VRenderer, { key: e.$$id + "-" + t, plugin: r.plugin, renderer: r.renderer, $schema: "/schemas/GridColumn.json", hostId: r.id, memberIndex: t, name: "???" + (t + 1) + "???", id: e.$$id, draggable: !1, schemaPath: r.schemaPath + "/grid/" + t, wrapperResolve: s.vWrapperResolve, path: this.props.$path + "/" + t, data: this.props.data, widthMutable: !0 }, p ? i.default.createElement(u.RegionWrapper, { key: p.key, preferTag: p.preferTag, name: p.key, label: p.label, regionConfig: p, placeholder: p.placeholder, editorStore: s.manager.store, manager: s.manager, children: o, wrapperResolve: p.wrapperResolve, rendererName: r.renderer.name }) : o) : o
                        } return o
                    }
                }, t
            } return n.__extends(t, e), t.prototype.panelBodyCreator = function (e) {
                var t = this, a = e.secondFactor;
                return [s.getSchemaTpl("fieldSet", { title: "??????", collapsable: !1, body: [a ? null : { type: "wrapper", size: "none", className: "grid grid-cols-2 gap-4 mb-4", body: [{ children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertRowAfter(e.node) } }, i.default.createElement(p.Icon, { className: "icon", icon: "arrow-to-bottom" }), i.default.createElement("span", null, "??????????????????")) }, { children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertRowBefore(e.node) } }, i.default.createElement(p.Icon, { className: "icon", icon: "top-arrow-to-top" }), i.default.createElement("span", null, "??????????????????")) }] }, { label: "??????", name: "columns", type: "select", pipeIn: function (e) { return Array.isArray(e) ? e.length : void 0 }, pipeOut: function (e, t) { return Array.isArray(t) && (t.length > e ? (t = t.concat()).splice(e - 1, t.length - e) : t = t.concat(c.repeatArray({ body: [] }, e - t.length))), t }, options: c.repeatArray(null, 12).map((function (e, t) { return { label: "" + (t + 1), value: t + 1 } })) }, { type: "button-group-select", name: "gap", label: "?????????", size: "sm", clearable: !0, tiled: !0, options: [{ label: "???", value: "none" }, { label: "??????", value: "xs" }, { label: "???", value: "sm" }, { label: "??????", value: "base" }, { label: "???", value: "md" }, { label: "???", value: "lg" }] }].filter((function (e) { return e })) }), s.getSchemaTpl("fieldSet", { title: "??????", collapsable: !1, body: [{ type: "button-group-select", name: "align", size: "sm", label: "????????????", tiled: !0, pipeIn: s.defaultValue("left"), options: [{ value: "left", label: "?????????" }, { value: "center", label: "????????????" }, { value: "right", label: "?????????" }, { value: "between", label: "????????????" }] }, { type: "button-group-select", name: "valign", size: "sm", label: "????????????", tiled: !0, pipeIn: s.defaultValue("top"), options: [{ value: "top", label: "????????????" }, { value: "middle", label: "????????????" }, { value: "bottom", label: "????????????" }, { value: "between", label: "????????????" }] }] }), this.panelWithOutOthers ? null : s.getSchemaTpl("fieldSet", { title: "??????", collapsable: !0, body: [s.getSchemaTpl("className"), s.getSchemaTpl("subFormItemMode"), s.getSchemaTpl("subFormHorizontalMode"), s.getSchemaTpl("subFormHorizontal")] })].filter((function (e) { return e }))
            }, t.prototype.afterResolveJsonSchema = function (e) {
                var t, a, n = null === (t = e.context.node.parent) || void 0 === t ? void 0 : t.host;
                (null === (a = null == n ? void 0 : n.info) || void 0 === a ? void 0 : a.plugin) === this && e.setData("/schemas/GridColumn.json")
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a, n = this;
                e.selections.length || (null === (a = e.info) || void 0 === a ? void 0 : a.plugin) !== this || (e.node.isVitualRenderer ? (t.push("|"), t.push({ label: "??????????????????", onSelect: function () { return n.insertColumnBefore(e) } }), t.push({ label: "??????????????????", onSelect: function () { return n.insertColumnAfter(e) } }), t.push("|"), t.push({ label: "??????????????????", onSelect: function () { return n.insertRowBefore(e.node.host) } }), t.push({ label: "??????????????????", onSelect: function () { return n.insertRowAfter(e.node.host) } })) : (t.push("|"), t.push({ label: "??????????????????", onSelect: function () { return n.insertRowBefore(e.node) } }), t.push({ label: "??????????????????", onSelect: function () { return n.insertRowAfter(e.node) } })))
            }, t.prototype.onWidthChangeStart = function (e) {
                var t, a, l = e.context, i = l.node;
                if ((null === (t = i.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var o = i.host;
                    if (o && (null === (a = o.info) || void 0 === a ? void 0 : a.plugin) === this) {
                        var r = l.dom, s = r.parentElement;
                        if (s) {
                            var d = l.resizer, u = s.getBoundingClientRect(), p = o.schema.columns, c = i.index, m = p[c].md, h = r.getBoundingClientRect();
                            e.setData({
                                onMove: function (e) {
                                    var t = e.pageX - h.left, a = m = Math.max(1, Math.min(12, Math.round(12 * t / u.width)));
                                    (p = p.concat())[c] = n.__assign(n.__assign({}, p[c]), { md: a }), d.setAttribute("data-value", "" + a), o.updateState({ columns: p }), requestAnimationFrame((function () { i.calculateHighlightBox() }))
                                }, onEnd: function () { o.updateState({}, !0), d.removeAttribute("data-value"), i.updateSchema({ md: m }), requestAnimationFrame((function () { i.calculateHighlightBox() })) }
                            })
                        }
                    }
                }
            }, t.prototype.insertRowAfter = function (e) {
                var t, a = this;
                if ((null === (t = e.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var n = this.manager.store, l = n.schema, i = e.id;
                    n.traceableSetSchema(c.JSONChangeInArray(l, i, (function (e, t, n) { e.splice(n + 1, 0, c.JSONPipeIn({ type: a.rendererName || "grid", align: t.align, valign: t.valign, columns: t.columns.map((function (e) { return { body: [], md: null == e ? void 0 : e.md } })) })) })))
                }
            }, t.prototype.insertRowBefore = function (e) {
                var t, a = this;
                if ((null === (t = e.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var n = this.manager.store, l = n.schema, i = e.id;
                    n.traceableSetSchema(c.JSONChangeInArray(l, i, (function (e, t, n) { e.splice(n, 0, c.JSONPipeIn({ type: a.rendererName || "grid", align: t.align, valign: t.valign, columns: t.columns.map((function (e) { return { body: [], md: null == e ? void 0 : e.md } })) })) })))
                }
            }, t.prototype.insertColumnBefore = function (e) {
                var t;
                if ((null === (t = e.node.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var a = this.manager.store, n = e.id, l = a.schema;
                    a.traceableSetSchema(c.JSONChangeInArray(l, n, (function (e, t, a) { e.splice(a, 0, c.JSONPipeIn({ body: [] })) })))
                }
            }, t.prototype.insertColumnAfter = function (e) {
                var t;
                if ((null === (t = e.node.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var a = this.manager.store, n = a.schema, l = e.id;
                    a.traceableSetSchema(c.JSONChangeInArray(n, l, (function (e, t, a) { e.splice(a + 1, 0, c.JSONPipeIn({ body: [] })) })))
                }
            }, t
        }(r.BasePlugin);
        t.GridPlugin = m, o.registerEditorPlugin(m)
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.Icon = void 0;
        var n = a(0), l = a(5);
        Object.defineProperty(t, "Icon", { enumerable: !0, get: function () { return l.Icon } });
        var i = n.__importDefault(a(159)), o = n.__importDefault(a(160)), r = n.__importDefault(a(161)), s = n.__importDefault(a(162));
        l.registerIcon("arrow-to-right", i.default), l.registerIcon("left-arrow-to-left", o.default), l.registerIcon("top-arrow-to-top", r.default), l.registerIcon("arrow-to-bottom", s.default)
    }, function (e, t, a) { e.exports = a(50) }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.GridPlugin = t.BasicToolbarPlugin = t.AvailableRenderersPlugin = t.IFrameEditor = t.mountInIframe = t.RegionWrapper = t.VRenderer = t.CodeEditor = t.BasicEditor = t.RendererEditor = t.registerEditorPlugin = t.defaultValue = t.setSchemaTpl = t.getSchemaTpl = t.BasePlugin = t.utils = t.MiniEditor = t.Editor = void 0;
        var n = a(0), l = n.__importDefault(a(24));
        t.Editor = l.default, a(66), a(43), a(68), a(72), a(74), a(44), a(75), a(76), a(77), a(78), a(79), a(80), a(81), a(82), a(83), a(84), a(85), a(87), a(22), a(88), a(89), a(90), a(91), a(92), a(93), a(94), a(95), a(96), a(97), a(98), a(99), a(100), a(101), a(102), a(103), a(104), a(105), a(106), a(107), a(108), a(109), a(110), a(111), a(112), a(113), a(114), a(115), a(116), a(117), a(118), a(119), a(120), a(121), a(122), a(123), a(124), a(125), a(126), a(127), a(23), a(128), a(129), a(130), a(131), a(132), a(133), a(134), a(135), a(136), a(137), a(138), a(139), a(20), a(140), a(141), a(142), a(143), a(144), a(145), a(146), a(147), a(148), a(149), a(152), a(29), a(153), a(46), a(154), a(155), a(156), a(157), a(158), a(47), a(163), a(164), a(165), a(166), a(167), a(168), a(169), a(170), a(171), a(172), a(173), a(174), a(175), a(176), a(177), a(178), a(179), a(180), a(181), a(182), a(183), a(184), a(185), a(186), a(187), a(188), a(189), a(190), a(191), a(192), a(193), a(194), a(196), a(197), a(198), a(199), a(201), a(202), a(203);
        var i = n.__importStar(a(6));
        t.utils = i;
        var o = a(3);
        Object.defineProperty(t, "getSchemaTpl", { enumerable: !0, get: function () { return o.getSchemaTpl } }), Object.defineProperty(t, "defaultValue", { enumerable: !0, get: function () { return o.defaultValue } }), Object.defineProperty(t, "setSchemaTpl", { enumerable: !0, get: function () { return o.setSchemaTpl } });
        var r = a(1);
        Object.defineProperty(t, "registerEditorPlugin", { enumerable: !0, get: function () { return r.registerEditorPlugin } });
        var s = a(2);
        Object.defineProperty(t, "BasePlugin", { enumerable: !0, get: function () { return s.BasePlugin } });
        var d = a(205);
        Object.defineProperty(t, "BasicEditor", { enumerable: !0, get: function () { return d.BasicEditor } }), Object.defineProperty(t, "RendererEditor", { enumerable: !0, get: function () { return d.RendererEditor } });
        var u = n.__importDefault(a(206));
        t.MiniEditor = u.default;
        var p = n.__importDefault(a(28));
        t.CodeEditor = p.default;
        var c = n.__importDefault(a(40));
        t.IFrameEditor = c.default;
        var m = a(35);
        Object.defineProperty(t, "mountInIframe", { enumerable: !0, get: function () { return m.mountInIframe } });
        var h = a(43);
        Object.defineProperty(t, "AvailableRenderersPlugin", { enumerable: !0, get: function () { return h.AvailableRenderersPlugin } });
        var f = a(44);
        Object.defineProperty(t, "BasicToolbarPlugin", { enumerable: !0, get: function () { return f.BasicToolbarPlugin } });
        var b = a(13);
        Object.defineProperty(t, "VRenderer", { enumerable: !0, get: function () { return b.VRenderer } });
        var g = a(14);
        Object.defineProperty(t, "RegionWrapper", { enumerable: !0, get: function () { return g.RegionWrapper } });
        var v = a(47);
        Object.defineProperty(t, "GridPlugin", { enumerable: !0, get: function () { return v.GridPlugin } })
    }, function (e, t) { e.exports = require("71cb60f") }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        var n = a(0), l = n.__importDefault(a(4)), i = n.__importDefault(a(8)), o = a(7), r = a(6), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.mainRef = l.default.createRef(), t
            } return n.__extends(t, e), t.prototype.handleWResizerMouseDown = function (e) { return this.startResize(e, "horizontal") }, t.prototype.handleHResizerMouseDown = function (e) { return this.startResize(e, "vertical") }, t.prototype.handleResizerMouseDown = function (e) { return this.startResize(e, "both") }, t.prototype.startResize = function (e, t) {
                var a, n, l, i = this;
                if (void 0 === t && (t = "horizontal"), (1 === e.button && null !== window.event || 0 === e.button) && !e.defaultPrevented) {
                    e.preventDefault();
                    var o = this.props, r = o.manager, s = o.id, d = o.node;
                    if (d) {
                        var u = document.querySelector('[data-editor-id="' + s + '"]');
                        if (u) {
                            r.disableHover = !0;
                            var p = r["both" === t ? "onSizeChangeStart" : "vertical" === t ? "onHeightChangeStart" : "onWidthChangeStart"](e, { dom: u, node: d, resizer: "both" === t ? this.resizerDom : "vertical" === t ? this.hResizerDom : this.wResizerDom }), c = null === (a = p.data) || void 0 === a ? void 0 : a.onMove, m = null === (n = p.data) || void 0 === n ? void 0 : n.onEnd;
                            if (c || m) {
                                null === (l = this.mainRef.current) || void 0 === l || l.setAttribute("data-resizing", "");
                                var h = function (e) { e.preventDefault(), null == c || c(e) }, f = function (e) {
                                    var t;
                                    e.preventDefault(), r.disableHover = !1, null === (t = i.mainRef.current) || void 0 === t || t.removeAttribute("data-resizing"), window.removeEventListener("mousemove", h), window.removeEventListener("mouseup", f), document.body.style.cursor = "default";
                                    var a = function (e) { window.removeEventListener("click", a, !0), e.preventDefault(), e.stopPropagation() };
                                    window.addEventListener("click", a, !0), setTimeout((function () { return window.removeEventListener("click", a, !0) }), 350), null == m || m(e)
                                };
                                window.addEventListener("mousemove", h), window.addEventListener("mouseup", f), document.body.style.cursor = "both" === t ? "nwse-resize" : "vertical" === t ? "ns-resize" : "ew-resize"
                            }
                        }
                    }
                }
            }, t.prototype.wResizerRef = function (e) { e ? e.addEventListener("mousedown", this.handleWResizerMouseDown) : this.wResizerDom.addEventListener("mousedown", this.handleWResizerMouseDown), this.wResizerDom = e }, t.prototype.hResizerRef = function (e) { e ? e.addEventListener("mousedown", this.handleHResizerMouseDown) : this.hResizerDom.addEventListener("mousedown", this.handleHResizerMouseDown), this.hResizerDom = e }, t.prototype.resizerRef = function (e) { e ? e.addEventListener("mousedown", this.handleResizerMouseDown) : this.resizerDom.addEventListener("mousedown", this.handleResizerMouseDown), this.resizerDom = e }, t.prototype.handleMouseEnter = function () { this.props.manager.disableHover || this.props.store.setHoverId(this.props.id) }, t.prototype.render = function () {
                var e = this.props, t = e.className, a = e.store, n = e.id, o = e.title, r = e.children, s = e.node, d = (e.toolbarContainer, e.onSwitch), u = a.sortedToolbars, p = a.sortedSecondaryToolbars, c = a.sortedSpecialToolbars, m = a.isActive(n), h = a.isHoved(n) || a.dropId === n || a.insertOrigId === n;
                return l.default.createElement("div", { className: i.default("ae-Editor-hlbox", { shake: n === a.insertOrigId, selected: m || ~a.selections.indexOf(n), hover: h, regionOn: s.childRegions.some((function (e) { return a.isRegionHighlighted(e.id, e.region) })) }, t), style: { display: s.w && s.h ? "block" : "none", top: s.y, left: s.x, width: s.w, height: s.h }, ref: this.mainRef, onMouseEnter: this.handleMouseEnter }, m ? l.default.createElement("div", { className: "ae-Editor-toolbarPopover" }, l.default.createElement("div", { className: "ae-Editor-nav" }, s.host ? l.default.createElement("div", { className: "ae-Editor-tip parent", onClick: function () { return null == d ? void 0 : d(s.host.id) } }, s.host.label) : null, l.default.createElement("div", { key: "tip", className: "ae-Editor-tip current" }, o), s.firstChild ? l.default.createElement("div", { className: "ae-Editor-tip child", onClick: function () { return null == d ? void 0 : d(s.firstChild.id) } }, s.firstChild.label) : null), l.default.createElement("div", { className: "ae-Editor-toolbar", key: "toolbar" }, u.map((function (e) { return l.default.createElement("button", { key: e.id, type: "button", draggable: e.draggable, onDragStart: e.onDragStart, "data-id": e.id, "data-tooltip": e.tooltip || void 0, "data-position": e.placement || "top", onClick: e.onClick }, ~e.icon.indexOf("<") ? l.default.createElement("span", { dangerouslySetInnerHTML: { __html: e.icon } }) : l.default.createElement("i", { className: e.icon })) })))) : null, m && p.length ? l.default.createElement("div", { className: "ae-Editor-toolbar sencondary", key: "sencondary-toolbar" }, p.map((function (e) { return l.default.createElement("button", { key: e.id, type: "button", className: e.className, "data-id": e.id, "data-tooltip": e.tooltip || void 0, "data-position": e.placement || "top", onClick: e.onClick }, ~e.icon.indexOf("<") ? l.default.createElement("span", { dangerouslySetInnerHTML: { __html: e.icon } }) : l.default.createElement("i", { className: e.icon })) }))) : null, m && c.length ? l.default.createElement("div", { className: "ae-Editor-toolbar special", key: "special-toolbar" }, c.map((function (e) { return l.default.createElement("button", { key: e.id, type: "button", className: e.className, "data-id": e.id, "data-tooltip": e.tooltip || void 0, "data-position": e.placement || "top", onClick: e.onClick }, ~e.icon.indexOf("<") ? l.default.createElement("span", { dangerouslySetInnerHTML: { __html: e.icon } }) : l.default.createElement("i", { className: e.icon })) }))) : null, r, s.widthMutable ? l.default.createElement("span", { className: "ae-WResizer", ref: this.wResizerRef }) : null, s.heightMutable ? l.default.createElement("span", { className: "ae-HResizer", ref: this.hResizerRef }) : null, s.widthMutable && s.heightMutable ? l.default.createElement("span", { className: "ae-Resizer", ref: this.resizerRef }) : null)
            }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleWResizerMouseDown", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleHResizerMouseDown", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleResizerMouseDown", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "wResizerRef", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "hResizerRef", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "resizerRef", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handleMouseEnter", null), t = n.__decorate([o.observer], t)
        }(l.default.Component);
        t.default = s
    }, function (e, t) { e.exports = require("ebad003") }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CommonConfigWrapper = void 0;
        var n = a(0), l = a(11), i = a(6), o = n.__importDefault(a(4)), r = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.componentWillUnmount = function () {
                var e = l.findDOMNode(this);
                if (e) {
                    var t = this.props.$$editor, a = t.wrapperResolve ? t.wrapperResolve(e) : e;
                    (Array.isArray(a) ? a : a ? [a] : []).forEach((function (e) { e.classList.remove("ae-Editor-common-config") }))
                }
            }, t.prototype.markDom = function (e) {
                var t = l.findDOMNode(this);
                if (t && e) {
                    var a = this.props.$$editor, n = a.wrapperResolve ? a.wrapperResolve(t) : t;
                    this.props.$$commonSchema && (Array.isArray(n) ? n : n ? [n] : []).forEach((function (t) { t.setAttribute("data-editor-id", e), t.classList.add("ae-Editor-common-config") }))
                }
            }, t.prototype.render = function () {
                var e = this.props, t = e.$$editor, a = e.$$node, l = e.$schema, r = n.__rest(e, ["$$editor", "$$node", "$schema"]), s = t.renderer;
                return r = i.JSONPipeOut(r), t.filterProps && (r = t.filterProps.call(t.plugin, r, a)), t.renderRenderer ? t.renderRenderer.call(t.plugin, n.__assign(n.__assign(n.__assign(n.__assign({}, r), { $schema: l, $$editor: t }), t.wrapperProps), { ref: this.refFn }), t) : o.default.createElement(s.component, n.__assign({}, r, { $schema: l, $$editor: t }, t.wrapperProps, { ref: this.refFn }))
            }, t
        }(a(27).NodeWrapper);
        t.CommonConfigWrapper = r
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.env = void 0;
        var n = a(0).__importDefault(a(56)), l = a(5);
        t.env = {
            updateLocation: function () { }, jumpTo: function () { }, fetcher: function (e) {
                var t = e.url, a = e.method, l = e.data, i = e.config;
                return (i = i || {}).withCredentials = !0, i.cancelExecutor && (i.cancelToken = new n.default.CancelToken(i.cancelExecutor)), "post" !== a && "put" !== a && "patch" !== a ? (l && (i.params = l), n.default[a](t, i)) : (l && l instanceof FormData || !l || "string" == typeof l || l instanceof Blob || l instanceof ArrayBuffer || (l = JSON.stringify(l), i.headers = i.headers || {}, i.headers["Content-Type"] = "application/json"), n.default[a](t, l, i))
            }, isCancel: function (e) { return n.default.isCancel(e) }, alert: l.alert, confirm: l.confirm, notify: function (e, t) { l.toast[e] ? l.toast[e](t, "error" === e ? "????????????" : "????????????") : console.warn("[Notify]", e, t) }
        }
    }, function (e, t) { e.exports = require("a5149e9") }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.EditorDNDManager = void 0;
        var n = a(0), l = n.__importDefault(a(12)), i = a(6), o = a(39), r = a(58), s = function () {
            function e(e, t) { this.manager = e, this.store = t, this.toDispose = [], this.dragEnterCount = 0, this.lastX = 0, this.lastY = 0, this.lastMoveAt = 0, this.toDispose.push(i.reactionWithOldValue((function () { return "schema" === t.dragType ? t.dragId : "" }), this.updateDragElements), i.reactionWithOldValue((function () { return { id: t.dropId, region: t.dropRegion } }), this.updateDropRegion), i.reactionWithOldValue((function () { return { id: t.planDropId, region: t.planDropRegion } }), this.updatePlanDropRegion)), this.dragGhost = document.createElement("div"), this.dragGhost.classList.add("ae-DragGhost"), this.dragGhost.classList.add("is-ghost") } return e.prototype.createDragImage = function (e, t) {
                var a = document.createElement("div");
                return a.classList.add("ae-DragImage"), a.innerHTML = "<span>" + t.label + "</span>", document.body.appendChild(a), a.style.cssText += "width: " + t.w + "px;height: " + t.h + "px;", this.dragImage = a, a
            }, e.prototype.disposeDragImage = function () {
                var e, t = this.dragImage;
                null === (e = null == t ? void 0 : t.parentElement) || void 0 === e || e.removeChild(t), delete this.dragImage
            }, e.prototype.switchToRegion = function (e, t, a) {
                var n, l, i, o = this.store;
                if (!t || !a || o.dropId === t && o.dropRegion === a) return !1;
                var r = o.getNodeById(t, a), s = r.regionInfo, d = o.dragSchema;
                if (!1 === (null === (n = null == s ? void 0 : s.accept) || void 0 === n ? void 0 : n.call(s, d))) return !1;
                var u = { mode: o.dragMode, sourceType: o.dragType, sourceId: o.dragId, data: o.dragSchema, targetId: t, targetRegion: a };
                return !this.manager.trigger("dnd-accept", u).prevented && (null === (l = this.dndMode) || void 0 === l || l.leave(e, this.dragGhost), null === (i = this.dndMode) || void 0 === i || i.dispose(), o.setDropId(t, a), this.makeDNDModeInstance(r), this.dndMode.enter(e, this.dragGhost), !0)
            }, e.prototype.makeDNDModeInstance = function (e) {
                var t, a = null === (t = e.regionInfo) || void 0 === t ? void 0 : t.dndMode, n = o.DefaultDNDMode;
                "position-h" === a && (n = r.PositionHDNDMode), this.dndMode = new n(this, e)
            }, e.prototype.startDrag = function (e, t) {
                var a, n = this, l = this.store.getNodeById(e), i = this.store.getDoc().querySelector('[data-editor-id="' + e + '"]');
                l && i ? (this.dragElement = i, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setDragImage(this.createDragImage(e, l), 0, 0), t.dataTransfer.setData(("dnd/ae-node-" + e).toLowerCase(), ""), null === (a = t.target) || void 0 === a || a.addEventListener("dragend", this.dragEnd), setTimeout((function () {
                    n.store.setDragId(e);
                    var a = l.parent;
                    n.switchToRegion(t, a.id, a.region)
                }), 4)) : t.preventDefault()
            }, e.prototype.dragEnter = function (e) {
                var t = this.store;
                if (this.dragEnterCount++, !t.dragId && 1 === this.dragEnterCount) for (var a = e.dataTransfer.types, n = a.length - 1;
                    n >= 0;
                    n--)if (/^dnd-dom\/(.*)$/.test(a[n])) {
                        var l = RegExp.$1, i = document.querySelector(l);
                        if (i) {
                            i.addEventListener("dragend", this.dragEnd);
                            var o = i.getAttribute("data-dnd-id"), r = i.getAttribute("data-dnd-type"), s = i.getAttribute("data-dnd-data"), d = s ? JSON.parse(s) : { type: "tpl", tpl: "Unknown" };
                            t.setDragId(o, "copy", r, d);
                            var u = t.activeContainerId;
                            if (u) {
                                var p = t.getNodeById(u);
                                (null == p ? void 0 : p.childRegions.length) && this.switchToRegion(e, p.id, p.childRegions[0].region)
                            } break
                        }
                    }
            }, e.prototype.dragOver = function (e) {
                var t = this.store, a = e.target;
                if (t.dropId && a) {
                    e.preventDefault();
                    var n = e.clientX - this.lastX, l = e.clientY - this.lastY, i = Math.max(Math.abs(n), Math.abs(l)), o = Date.now();
                    if (i < 5) {
                        var r = a.closest("[data-region][data-region-host]"), s = null == r ? void 0 : r.getAttribute("data-region-host"), d = null == r ? void 0 : r.getAttribute("data-region");
                        if (!r || s === t.dropId) return;
                        0 === this.lastMoveAt || (o - this.lastMoveAt > 3e3 ? this.switchToRegion(e, s, d) : o - this.lastMoveAt > 1e3 && d && s && t.setPlanDropId(s, d))
                    } else {
                        t.setPlanDropId("", ""), this.lastMoveAt = o, this.lastX = e.clientX, this.lastY = e.clientY;
                        var u = a.closest('[data-region][data-region-host="' + t.dropId + '"]'), p = null == u ? void 0 : u.getAttribute("data-region");
                        p && p !== t.dropRegion && this.switchToRegion(e, t.dropId, p), this.dndMode.over(e, this.dragGhost)
                    }
                }
            }, e.prototype.drop = function (e) {
                return n.__awaiter(this, void 0, void 0, (function () {
                    var e, t, a, i, o, r;
                    return n.__generator(this, (function (n) {
                        switch (n.label) {
                            case 0: return e = this.store, t = this.dndMode.getDropBeforeId(), "move" !== e.dragMode ? [3, 1] : (this.manager.move(e.dropId, e.dropRegion, e.dragId, t), [3, 4]);
                            case 1: return "copy" !== e.dragMode ? [3, 4] : (a = e.dragSchema, i = e.dropId, o = e.dropRegion, r = void 0, "subrenderer" !== e.dragType ? [3, 3] : (null == (r = l.default(e.subRenderers, (function (t) { return t.id === e.dragId }))) ? void 0 : r.scaffoldForm) ? [4, this.manager.scaffold(r.scaffoldForm, a)] : [3, 3]);
                            case 2: a = n.sent(), n.label = 3;
                            case 3: this.manager.addChild(i, o, a, t, r, { id: e.dragId, type: e.dragType, data: e.dragSchema }), n.label = 4;
                            case 4: return [2]
                        }
                    }))
                }))
            }, e.prototype.dragLeave = function (e) { this.dragEnterCount-- }, e.prototype.dragEnd = function (e) {
                var t, a;
                null === (t = e.target) || void 0 === t || t.removeEventListener("dragend", this.dragEnd), null === (a = this.dndMode) || void 0 === a || a.leave(e, this.dragGhost), delete this.dndMode, this.dragGhost.innerHTML = "", this.store.setDragId(""), this.store.setDropId(""), this.disposeDragImage(), this.dragEnterCount = 0
            }, e.prototype.updateDragElements = function (e) { e ? [].slice.call(this.store.getDoc().querySelectorAll('[data-editor-id="' + e + '"]')).forEach((function (e) { return e.classList.add("ae-is-draging") })) : [].slice.call(this.store.getDoc().querySelectorAll(".ae-is-draging")).forEach((function (e) { return e.classList.remove("ae-is-draging") })) }, e.prototype.updateDropRegion = function (e, t) {
                var a, n;
                (null == t ? void 0 : t.id) && t.region && (null === (a = this.store.getDoc().querySelector('[data-region="' + t.region + '"][data-region-host="' + t.id + '"]')) || void 0 === a || a.classList.remove("is-dragenter")), e.id && e.region && (null === (n = this.store.getDoc().querySelector('[data-region="' + e.region + '"][data-region-host="' + e.id + '"]')) || void 0 === n || n.classList.add("is-dragenter"))
            }, e.prototype.updatePlanDropRegion = function (e, t) {
                var a, n;
                (null == t ? void 0 : t.id) && t.region && (null === (a = this.store.getDoc().querySelector('[data-region="' + t.region + '"][data-region-host="' + t.id + '"]')) || void 0 === a || a.classList.remove("is-entering")), e.id && e.region && (null === (n = this.store.getDoc().querySelector('[data-region="' + e.region + '"][data-region-host="' + e.id + '"]')) || void 0 === n || n.classList.add("is-entering"))
            }, e.prototype.dispose = function () { this.disposeDragImage(), this.toDispose.forEach((function (e) { return e() })), this.toDispose = [] }, n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [DragEvent]), n.__metadata("design:returntype", void 0)], e.prototype, "dragEnter", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [DragEvent]), n.__metadata("design:returntype", void 0)], e.prototype, "dragOver", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [DragEvent]), n.__metadata("design:returntype", Promise)], e.prototype, "drop", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [DragEvent]), n.__metadata("design:returntype", void 0)], e.prototype, "dragLeave", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [DragEvent]), n.__metadata("design:returntype", void 0)], e.prototype, "dragEnd", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [String]), n.__metadata("design:returntype", void 0)], e.prototype, "updateDragElements", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object, Object]), n.__metadata("design:returntype", void 0)], e.prototype, "updateDropRegion", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object, Object]), n.__metadata("design:returntype", void 0)], e.prototype, "updatePlanDropRegion", null), e
        }();
        t.EditorDNDManager = s
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.PositionHDNDMode = void 0;
        var n = a(0), l = n.__importDefault(a(15)), i = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.enter = function (e, t) {
                t.innerHTML = "", t.classList.add("use-position"), t.classList.add("is-horizontal");
                var a = this.dnd.dragElement, n = this.constainer.getBoundingClientRect(), i = Array.isArray(this.region.schema) ? this.region.schema : [];
                if (a && a.closest("[data-region]") === this.constainer) {
                    var o = a.getAttribute("data-editor-id"), r = l.default(i, (function (e) { return e.$$id === o }));
                    if (~r && i[r + 1] && (this.dropBeforeId = i[r + 1].$$id), a.nextElementSibling) {
                        var s = a.nextElementSibling.getBoundingClientRect();
                        t.style.cssText += "top: 0;left: " + (s.x - n.x) + "px;"
                    } else t.style.cssText += "top: 0;left: 100%;"
                } else t.style.cssText += "top: 0;left: -999999%;";
                this.constainer.appendChild(t)
            }, t.prototype.leave = function (e, t) { t.classList.remove("use-position"), t.classList.remove("is-horizontal") }, t.prototype.over = function (e, t) {
                var a, n, l = this.getTarget(e);
                if (l) {
                    if ("table" === (null === (a = this.constainer) || void 0 === a ? void 0 : a.getAttribute("data-renderer"))) {
                        var i = null === (n = l.parentElement) || void 0 === n ? void 0 : n.closest("th[data-editor-id], td[data-editor-id]");
                        i && this.constainer.contains(i) && (l = i)
                    } var o = this.constainer.getBoundingClientRect(), r = (Array.isArray(this.region.schema) && this.region.schema, l.getBoundingClientRect());
                    l.nextElementSibling && l.nextElementSibling.hasAttribute("data-editor-id") ? (t.style.cssText += "left: " + (r.x - o.x) + "px;", this.dropBeforeId = l.getAttribute("data-editor-id")) : e.clientX > r.x + r.width / 2 ? (t.style.cssText += "top: 0;left: " + (r.right - o.x) + "px;", delete this.dropBeforeId) : (t.style.cssText += "left: " + (r.x - o.x) + "px;", this.dropBeforeId = l.getAttribute("data-editor-id"))
                }
            }, t
        }(a(39).DefaultDNDMode);
        t.PositionHDNDMode = i
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.EditorStore = void 0;
        var n = a(0), l = a(9), i = a(10), o = a(6), r = a(6), s = a(60), d = a(5), u = n.__importDefault(a(12)), p = a(61), c = n.__importDefault(a(32)), m = a(21), h = n.__importDefault(a(15));
        t.EditorStore = i.types.model("EditorRoot", { isMobile: !1, isSubEditor: !1, amisDocHost: i.types.optional(i.types.string, "https://baidu.gitee.io"), root: i.types.optional(m.EditorNode, { id: "root", label: "Root" }), hoverId: "", hoverRegion: "", activeId: "", selections: i.types.optional(i.types.frozen(), []), contextId: "", dragMode: "move", dragId: "", dragType: "", dragSchema: i.types.frozen(), dropId: "", dropRegion: "", planDropId: "", planDropRegion: "", insertId: "", insertRegion: "", insertRenderers: i.types.optional(i.types.frozen(), []), insertRenderersKeywords: "", insertTag: "??????", insertSelected: "", insertMode: "insert", insertOrigId: "", insertBeforeId: "", schema: i.types.frozen(), versionId: 0, schemaHistory: i.types.optional(i.types.array(i.types.frozen()), []), toolbars: i.types.optional(i.types.frozen(), []), panels: i.types.optional(i.types.frozen(), []), subRenderersKeywords: "", subRendererRegion: "", subRenderers: i.types.optional(i.types.frozen(), []), panelKey: "", leftPanelKey: "", jsonSchemaUri: "", scaffoldForm: i.types.maybe(i.types.frozen()), scaffoldFormBuzy: !1, scaffoldError: "", popOverForm: i.types.maybe(i.types.frozen()), subEditorContext: i.types.maybe(i.types.frozen()), calculateStarted: !1, targetNames: i.types.optional(i.types.array(i.types.frozen()), []), ctx: i.types.frozen() }).views((function (e) {
            return {
                get filteredSchema() {
                    var t, a, n;
                    return o.filterSchemaForEditor(null !== (n = null === (a = (t = i.getEnv(e)).schemaFilter) || void 0 === a ? void 0 : a.call(t, e.schema)) && void 0 !== n ? n : e.schema)
                }, get filteredSchemaForPreview() {
                    var t, a, n, l = r.JSONPipeOut(e.schema);
                    return null !== (n = null === (a = (t = i.getEnv(e)).schemaFilter) || void 0 === a ? void 0 : a.call(t, l)) && void 0 !== n ? n : l
                }, isHoved: function (t) { return t && e.hoverId === t }, isActive: function (t) { return t && !this.dragging && !e.insertOrigId && e.insertBeforeId !== t && e.activeId === t }, isContextOn: function (t) { return t && e.contextId === t }, get activeContainerId() {
                    var t;
                    if (!e.activeId) return "";
                    for (var a = this.getNodeById(e.activeId);
                        a;
                    ) {
                        if (a.childRegions.length || (null === (t = a.info) || void 0 === t ? void 0 : t.regions)) return a.id;
                        a = a.host
                    } return ""
                }, isRegionHighlighted: function (t, a) { return !e.insertOrigId && t === e.hoverId && a === e.hoverRegion || t === e.dropId && e.dropRegion === a || !e.insertOrigId && t === e.insertId && e.insertRegion === a }, isRegionActive: function (t, a) { return this.isActive(t) || t === e.dropId || this.isRegionHighlighted(t, a) }, isRegionDragEnter: function (t, a) { return this.isRegionActive(t, a) && a === e.dropRegion }, get highlightNodes() {
                    var t = this, a = [];
                    return !e.hoverId || e.dragId || e.contextId || e.activeId === e.hoverId && !e.hoverRegion || e.selections.includes(e.hoverId) || a.push(e.hoverId), e.contextId && a.push(e.contextId), !e.activeId && !e.selections.length || e.dragId || e.insertOrigId || e.insertId || e.hoverId && e.hoverRegion || (e.activeId ? a.push(e.activeId) : a.push.apply(a, e.selections)), "insert" === e.insertMode && e.insertId && a.push(e.insertId), e.insertOrigId && a.push(e.insertOrigId), e.dropId && a.push(e.dropId), e.insertBeforeId && a.push(e.insertBeforeId), a.filter((function (e, t, a) { return e && t === a.indexOf(e) })).map((function (e) { return t.getNodeById(e) })).filter((function (e) { return e }))
                }, getNodeById: function (t, a) {
                    for (var n = e.root.children.concat();
                        n.length;
                    ) {
                        var l = n.shift();
                        if (l.id === t && (!a || l.region === a)) return l;
                        l.children.length && n.push.apply(n, l.children)
                    }
                }, get activeNodeInfo() {
                    var t;
                    return null === (t = this.getNodeById(e.activeId)) || void 0 === t ? void 0 : t.info
                }, getSchema: function (t) { return t ? o.JSONGetById(e.schema, t) : e.schema }, getSchemaParentById: function (t) { return r.JSONGetParentById(e.schema, t) }, getSchemaPath: function (t) {
                    var a = r.JSONGetPathById(e.schema, t);
                    return Array.isArray(a) ? a.join("/") : ""
                }, getPanelKey: function () {
                    var t, a = e.panelKey;
                    if ("none" === a) return a;
                    var n = this.getPanels();
                    return u.default(n, (function (e) { return a && e.key === a })) ? a : (null === (t = n[0]) || void 0 === t ? void 0 : t.key) || "none"
                }, getLeftPanelKey: function () {
                    var t = e.leftPanelKey;
                    if (this.dragging) return "outline";
                    if ("none" === t) return t;
                    var a = this.getLeftPanels();
                    return u.default(a, (function (e) { return t && e.key === t })) ? t : "outline"
                }, get leftPanels() { return e.panels.filter((function (e) { return "left" === e.position })) }, get rightPanels() { return e.panels.filter((function (e) { return "left" !== e.position })) }, getPanels: function () { return [].concat(this.rightPanels || []).sort((function (e, t) { return e.order - t.order })) }, getLeftPanels: function () {
                    var t = [{ key: "outline", icon: "fa fa-navicon", title: "??????", component: s.OutlinePanel, order: -9999 }].concat(this.leftPanels || []);
                    return e.insertId && e.insertRegion && t.push({ key: "insert", icon: "fa fa-bolt", position: "left", title: "replace" === e.insertMode ? "??????" : "??????", component: p.InsertSubRendererPanel, order: 9999 }), t.sort((function (e, t) { return e.order - t.order }))
                }, get sortedToolbars() { return e.toolbars.filter((function (e) { return "secondary" !== e.level && "special" !== e.level })).sort((function (e, t) { return e.order - t.order })) }, get sortedSecondaryToolbars() { return e.toolbars.filter((function (e) { return "secondary" === e.level })).sort((function (e, t) { return e.order - t.order })) }, get sortedSpecialToolbars() { return e.toolbars.filter((function (e) { return "special" === e.level })).sort((function (e, t) { return e.order - t.order })) }, get value() { if (e.activeId) return this.getValueOf(e.activeId) }, getValueOf: function (t) { return r.JSONPipeOut(o.JSONGetById(e.schema, t)) }, get valueWithoutHiddenProps() { if (e.activeId) return r.JSONPipeOut(o.JSONGetById(e.schema, e.activeId), i.getEnv(e).isHiddenProps || function (e) { return "$$" === e.substring(0, 2) && "$$comments" !== e && "$$commonSchema" !== e || "__" === e.substring(0, 2) }) }, get outline() { return e.root.children }, get bcn() {
                    var t = [];
                    return e.activeId && l.findTree(e.root.children, (function (a, n, l, i) { return a.id === e.activeId && (t = i.concat(a), !0) })), t
                }, get activePath() { return this.getNodePathById(e.activeId) }, getNodePathById: function (t) {
                    var a = [];
                    if (!t) return a;
                    var n = function (e, l) { return void 0 === l && (l = []), e.every((function (e) { return e.id === t ? (a = l.concat(e), !1) : !e.children || !e.children.length || n(e.children, l.concat(e)) })) };
                    return n(e.root.children), a
                }, get dragging() { return !(!e.dragId && !e.dropId) }, get needPatch() {
                    var t = function (e) { return e.some((function (e) { return !e.patched && !e.isRegion || !!e.children.length && t(e.children) })) };
                    return t(e.root.children)
                }, get schemaRaw() { return r.JSONPipeOut(e.schema) }, get groupedSubRenderers() {
                    var t = {}, a = e.subRenderersKeywords, n = new RegExp(a, "i");
                    return e.subRenderers.concat().sort((function (e, t) { return e.order - t.order })).forEach((function (e) { a && !["name", "description", "scaffold.type"].some((function (t) { return d.resolveVariable(t, e) && n.test(d.resolveVariable(t, e)) })) || (Array.isArray(e.tags) ? e.tags.concat() : e.tags ? [e.tags] : ["??????"]).forEach((function (a) { t[a] = t[a] || [], t[a].push(e) })) })), t
                }, getSubRendererById: function (t) { return u.default(e.subRenderers || [], (function (e) { return e.id === t })) }, get groupedInsertRenderers() {
                    var t = { "??????": [] }, a = e.insertRenderersKeywords, n = new RegExp(a, "i");
                    return e.insertRenderers.concat().sort((function (e, t) { return e.order - t.order })).forEach((function (e) { a && !["name", "description", "scaffold.type"].some((function (t) { return d.resolveVariable(t, e) && n.test(d.resolveVariable(t, e)) })) || ((Array.isArray(e.tags) ? e.tags.concat() : e.tags ? [e.tags] : ["??????"]).forEach((function (a) { t[a] = t[a] || [], t[a].push(e) })), t["??????"].push(e)) })), t
                }, get selectedInsertRendererInfo() { return u.default(e.insertRenderers, (function (t) { return t.id === e.insertSelected })) }, get subEditorSlotPath() {
                    var t, a = null === (t = e.subEditorContext) || void 0 === t ? void 0 : t.slot;
                    if (!a) return "";
                    var n = [], l = function (e, t) { return void 0 === t && (t = []), !(!Array.isArray(e) || !e.some((function (e, a) { return l(e, t.concat("" + a)) }))) || (c.default(e) ? Object.keys(e).some((function (a) { return l(e[a], t.concat(a)) })) : "$$" === e && (n = t.concat(), !0)) };
                    return l(a), n.length ? n.join("/") : ""
                }, get subEditorValue() { if (e.subEditorContext) return e.subEditorContext.slot ? n.__assign(n.__assign({}, l.mapObject(e.subEditorContext.slot, (function (t) { return "$$" === t ? e.subEditorContext.value : t }))), { isSlot: !0 }) : e.subEditorContext.value }, get canUndo() { return 0 !== e.schemaHistory.findIndex((function (t) { return t.versionId === e.versionId })) }, get canRedo() { return e.schemaHistory.findIndex((function (t) { return t.versionId === e.versionId })) < e.schemaHistory.length - 1 }
            }
        })).actions((function (e) {
            i.getEnv(e);
            var t = 0, a = null, s = void 0, d = document, u = void 0;
            return {
                setLayer: function (e) { s = e }, getLayer: function () { return s }, setDoc: function (e) { d = e }, getDoc: function () { return d }, setIframe: function (e) { u = e }, getIframe: function () { return u }, setIsMobile: function (t) { e.isMobile = !!t }, setCtx: function (t) { e.ctx = t }, setIsSubEditor: function (t) { e.isSubEditor = t }, setSchema: function (t) {
                    var a = r.JSONPipeIn(t || {});
                    if (e.schema) {
                        var n = o.diff(e.schema, a, (function (e, t) { return "$$id" === t }));
                        e.schema = o.patchDiff(e.schema, n)
                    } else e.schema = a;
                    this.resetHistory(), this.updateTargetName()
                }, insertSchema: function (t) {
                    var a, n = t.context.id, l = t.context.region, i = o.JSONGetById(e.schema, n);
                    if (i) {
                        var s = r.JSONPipeIn(t.context.data), d = Array.isArray(i[l]) ? i[l].concat() : i[l] ? [i[l]] : [];
                        if (t.context.beforeId) {
                            var u = h.default(d, (function (e) { return e.$$id === t.context.beforeId }));
                            ~u ? d.splice(u, 0, s) : d.push(s)
                        } else d.push(s);
                        return this.traceableSetSchema(r.JSONUpdate(e.schema, n, ((a = {})[l] = d, a))), t.context.data = s, s
                    }
                }, moveSchema: function (t) {
                    var a, n = t.context, l = e.schema;
                    if (n.sourceId !== n.beforeId) {
                        var i = o.JSONGetById(l, n.sourceId);
                        l = o.JSONDelete(l, n.sourceId, void 0, !0);
                        var s = n.region, d = o.JSONGetById(l, n.id)[s];
                        if (d = Array.isArray(d) ? d.concat() : d ? [d] : [], n.beforeId) {
                            var u = h.default(d, (function (e) { return e.$$id === n.beforeId }));
                            if (!~u) throw new Error("???????????????????????????????????????");
                            d.splice(u, 0, i)
                        } else d.push(i);
                        this.traceableSetSchema(r.JSONUpdate(l, n.id, ((a = {})[s] = d, a)))
                    }
                }, setActiveId: function (t, a) {
                    void 0 === a && (a = []);
                    var n = t ? e.getNodeById(t) : void 0;
                    !1 === (null == n ? void 0 : n.clickable) || t && !n || (e.activeId = t, e.selections = a)
                }, setSelections: function (t) { e.selections = t ? t.concat() : [] }, clearSelection: function () { e.selections = [] }, setHoverId: function (t, a) {
                    var n = t ? e.getNodeById(t) : void 0;
                    !1 !== (null == n ? void 0 : n.clickable) && (e.hoverId = t, e.hoverRegion = a || "")
                }, setInsertId: function (t) { e.insertId = t }, setContextId: function (t) { e.contextId = t }, setDragId: function (t, a, n, l) { void 0 === a && (a = "move"), void 0 === n && (n = "schema"), e.dragId = t, e.dragMode = a, e.dragType = n, e.dragSchema = l || (t ? e.getSchema(t) : null) }, setDropId: function (t, a) { void 0 === a && (a = ""), e.dropId = t, e.dropRegion = a, e.planDropId = "", e.planDropRegion = "" }, setPlanDropId: function (t, a) { e.planDropId = t, e.planDropRegion = a }, setActiveToolbars: function (t) { e.toolbars = t }, setPanels: function (t) { e.panels = t }, setSubRenderers: function (t) { e.subRenderers = t }, changeSubRenderersKeywords: function (t) { e.subRenderersKeywords = t }, resetSubRenderersKeywords: function () { e.subRenderersKeywords = "" }, changeSubRendererRegion: function (t) { e.subRendererRegion = t }, changePanelKey: function (t, a) { void 0 === a && (a = !1), t !== e.getPanelKey() || a ? e.panelKey = t : e.panelKey = "none" }, changeLeftPanelKey: function (t, a) { void 0 === a && (a = !1), "insert" !== t && "insert" !== e.panelKey && (t !== e.getLeftPanelKey() || a ? e.leftPanelKey = t : e.leftPanelKey = "none") }, changeValue: function (t, a) { e.activeId && this.changeValueById(e.activeId, t, a) }, changeValueById: function (t, a, n, l, i) {
                    var s = o.JSONGetById(e.schema, t);
                    if (s) if (n) {
                        var d = o.patchDiff(s, n);
                        this.traceableSetSchema(r.JSONUpdate(e.schema, t, r.JSONPipeIn(d), !0), i)
                    } else this.traceableSetSchema(r.JSONUpdate(e.schema, t, r.JSONPipeIn(a), l), i)
                }, moveUp: function (t) { t && this.traceableSetSchema(r.JSONMoveUpById(e.schema, t)) }, moveDown: function (t) { t && this.traceableSetSchema(r.JSONMoveDownById(e.schema, t)) }, del: function (t) {
                    var a, n;
                    if (t === e.activeId) {
                        var l = null === (a = e.getNodeById(t)) || void 0 === a ? void 0 : a.host;
                        this.setActiveId(l ? l.id : "")
                    } else if (e.activeId) {
                        var i = o.JSONGetById(e.schema, t);
                        if (o.JSONGetById(i, e.activeId)) {
                            l = null === (n = e.getNodeById(t)) || void 0 === n ? void 0 : n.host;
                            this.setActiveId(l ? l.id : "")
                        }
                    } this.traceableSetSchema(o.JSONDelete(e.schema, t))
                }, delMulti: function (t) {
                    var a = this;
                    (Array.isArray(t) ? t : [t]).forEach((function (t) {
                        var n, l;
                        if (t === e.activeId) {
                            var i = null === (n = e.getNodeById(t)) || void 0 === n ? void 0 : n.host;
                            a.setActiveId(i ? i.id : "")
                        } else if (e.activeId) {
                            var r = o.JSONGetById(e.schema, t);
                            if (o.JSONGetById(r, e.activeId)) {
                                i = null === (l = e.getNodeById(t)) || void 0 === l ? void 0 : l.host;
                                a.setActiveId(i ? i.id : "")
                            }
                        }
                    })), this.traceableSetSchema(t.reduce((function (e, t) { return o.JSONDelete(e, t) }), e.schema))
                }, duplicate: function (t) { this.traceableSetSchema((Array.isArray(t) ? t : [t]).reduce((function (e, t) { return r.JSONDuplicate(e, t) }), e.schema)) }, emptyRegion: function (t, a) {
                    var n;
                    this.traceableSetSchema(r.JSONUpdate(e.schema, t, ((n = {})[a] = void 0, n)))
                }, replaceChild: function (t, a) { this.traceableSetSchema(r.JSONUpdate(e.schema, t, r.JSONPipeIn(a), !0)) }, setInsertRegion: function (t, a, n, l, i, o) { void 0 === a && (a = ""), void 0 === n && (n = "??????"), void 0 === l && (l = "insert"), void 0 === i && (i = ""), e.insertId = a, e.insertRegion = t, e.insertTag = n, e.insertMode = l, e.insertOrigId = i, e.insertBeforeId = o || "" }, closeInsertPanel: function () { e.insertOrigId = "", e.insertId = "", e.insertRegion = "", e.insertSelected = "", e.insertRenderersKeywords = "", e.insertBeforeId = "" }, setInsertRenderers: function (t) { e.insertRenderers = t }, changeInsertRenderersKeywords: function (t) { e.insertRenderersKeywords = t }, resetInsertRenderersKeywords: function () { e.insertRenderersKeywords = "" }, setInsertTag: function (t) { e.insertTag = t }, setInsertSelected: function (t) { e.insertSelected = t }, setJSONSchemaUri: function (t) { e.jsonSchemaUri = t }, openSubEditor: function (t) { e.activeId && (e.subEditorContext = n.__assign(n.__assign({}, t), { data: t.data || {} })) }, confirmSubEditor: function (t) {
                    var a, n = t[0], i = e.subEditorContext, r = i.onChange, s = i.slot, d = n.schema, u = (null === (a = n.__pristine) || void 0 === a ? void 0 : a.schema) || d;
                    if (s) {
                        var p = e.subEditorSlotPath.replace(/(?:\/)/g, ".");
                        d = l.getVariable(d, p), u = l.getVariable(u, p), Array.isArray(d) && 1 === d.length && !Array.isArray(u) && (d = d[0])
                    } r(d, r.length > 1 ? o.diff(u, d) : void 0), e.subEditorContext = void 0
                }, closeSubEditor: function () { e.subEditorContext = void 0 }, subEditorOnChange: function () { a && (e.subEditorContext = n.__assign(n.__assign({}, e.subEditorContext), { canUndo: a.canUndo(), canRedo: a.canRedo() })) }, undoSubEditor: function () { a && a.undo() }, redoSubEditor: function () { a && a.redo() }, subEditorRef: function (e) { a = e }, openScaffoldForm: function (t) { e.scaffoldForm = t }, closeScaffoldForm: function () { e.scaffoldForm = void 0 }, setScaffoldBuzy: function (t) { e.scaffoldFormBuzy = !!t }, setScaffoldError: function (t) { void 0 === t && (t = ""), e.scaffoldError = t }, openPopOverForm: function (t) { e.popOverForm = t }, closePopOverForm: function () { e.popOverForm = void 0 }, calculateHighlightBox: function (t) {
                    e.calculateStarted = !0, t.forEach((function (t) {
                        var a = e.getNodeById(t);
                        null == a || a.calculateHighlightBox(e)
                    }))
                }, resetHighlightBox: function (t) {
                    t.forEach((function (t) {
                        var a = e.getNodeById(t);
                        null == a || a.resetHighlightBox(e)
                    }))
                }, updateTargetName: function () {
                    var t = [];
                    o.JSONTraverse(e.schema, (function (e, a, n) { return "name" === a && e && n && ("crud" === n.type || "form" === n.type || "page" === n.type || "service" === n.type || "chart" === n.type || "wizard" === n.type) && t.push({ type: n.type, name: e, editorId: n.$$id }), e })), e.targetNames = i.cast(t)
                }, traceableSetSchema: function (a, n) {
                    var l = e.schemaHistory.findIndex((function (t) { return t.versionId === e.versionId }));
                    ~l && e.schemaHistory.splice(l + 1, e.schemaHistory.length - l - 1), n && e.schemaHistory.pop(), e.schemaHistory.push({ versionId: e.versionId = t++, schema: a }), e.schema = a, this.updateTargetName()
                }, undo: function () {
                    var t = e.schemaHistory.findIndex((function (t) { return t.versionId === e.versionId }));
                    if (t > 0) {
                        var a = e.schemaHistory[t - 1];
                        e.versionId = a.versionId, e.schema = a.schema, this.updateTargetName()
                    }
                }, redo: function () {
                    var t = e.schemaHistory.findIndex((function (t) { return t.versionId === e.versionId }));
                    if (t < e.schemaHistory.length - 1) {
                        var a = e.schemaHistory[t + 1];
                        e.versionId = a.versionId, e.schema = a.schema, this.updateTargetName()
                    }
                }, resetHistory: function () { t = 0, e.versionId = t++, e.schemaHistory.replace([{ versionId: e.versionId, schema: e.schema }]) }, applyPatches: function (t) {
                    var a = e.schema;
                    t.forEach((function (e) {
                        var t, l;
                        if ("update" === e.op) a = r.JSONUpdate(a, e.target, e.value);
                        else if ("replace" === e.op) a = r.JSONUpdate(a, e.target, e.value, !0);
                        else if ("delete" === e.op) a = o.JSONDelete(a, e.target);
                        else if ("push" === e.op) {
                            var i = (s = o.JSONGetById(a, e.target))[e.key];
                            (i = Array.isArray(i) ? i.concat() : i ? [i] : []).push(e.value), s = n.__assign(n.__assign({}, s), ((t = {})[e.key] = i, t)), a = r.JSONUpdate(a, e.target, s)
                        } else if ("splice" === e.op) {
                            var s;
                            i = (s = o.JSONGetById(a, e.target))[e.key];
                            (i = Array.isArray(i) ? i.concat() : i ? [i] : []).splice.apply(i, e.args), s = n.__assign(n.__assign({}, s), ((l = {})[e.key] = i, l)), a = r.JSONUpdate(a, e.target, s)
                        }
                    })), this.traceableSetSchema(a)
                }
            }
        }))
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.OutlinePanel = void 0;
        var n = a(0), l = a(7), i = n.__importDefault(a(4)), o = n.__importDefault(a(8)), r = a(6), s = a(5), d = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.handleClick = function (e) {
                var t = e.currentTarget, a = t.getAttribute("data-node-id"), n = t.getAttribute("data-node-region"), l = this.props.store, i = this.props.manager;
                n ? i.showInsertPanel(n, a) : l.setActiveId(a)
            }, t.prototype.handleEnter = function (e) {
                var t = e.currentTarget, a = t.getAttribute("data-node-id"), n = t.getAttribute("data-node-region");
                this.props.store.setHoverId(a, n)
            }, t.prototype.handleDragStart = function (e) {
                var t = e.currentTarget.getAttribute("data-node-id");
                t && this.props.manager.startDrag(t, e)
            }, t.prototype.handleDragOver = function (e) {
                var t = e.target.closest("[data-node-id][data-node-region]");
                if (t) {
                    var a = this.props.manager, n = t.getAttribute("data-node-id"), l = t.getAttribute("data-node-region");
                    e.preventDefault(), n && l && a.dnd.switchToRegion(e.nativeEvent, n, l)
                }
            }, t.prototype.handleDrop = function (e) { this.props.manager.dnd.drop(e.nativeEvent) }, t.prototype.renderItem = function (e, t) {
                var a, n = this, l = this.props.store, r = !l.dragging && e.singleRegion ? e.uniqueChildren[0].uniqueChildren : e.uniqueChildren, d = r.length;
                return !l.dragging || e.isRegion || e.children.length ? i.default.createElement("li", { className: o.default("ae-Outline-node", { "is-folded": e.folded, "is-active": l.activeId === e.id && !e.region || e.isRegion && l.dropId === e.id && l.dropRegion === e.region, "is-region": e.isRegion, "is-hover": !e.isRegion && (l.isHoved(e.id) || l.isContextOn(e.id)), "has-children": d, "is-dragging": l.dragId === e.id && "schema" === l.dragType }), key: t }, i.default.createElement("a", { onClick: this.handleClick, onMouseEnter: this.handleEnter, "data-node-id": e.id, "data-node-region": e.region, "data-node-common-config": null === (a = e.schema) || void 0 === a ? void 0 : a.$$commonSchema, draggable: e.draggable, onDragStart: this.handleDragStart }, d ? i.default.createElement("span", { onClick: e.toggleFold, className: o.default("ae-Outline-expander", { "is-folded": e.folded }), "data-node-id": e.id, "data-node-region": e.region }, i.default.createElement(s.Icon, { icon: "right-arrow-bold" })) : null, e.isCommonConfig ? e.label + "-[????????????]" : e.label), d ? i.default.createElement("ul", { className: "ae-Outline-sublist" }, r.map((function (e, t) { return n.renderItem(e, t) }))) : null) : null
            }, t.prototype.render = function () {
                var e = this, t = this.props.store, a = t.outline;
                return i.default.createElement("div", { className: o.default("ae-Outline", { "ae-Outline--draging": t.dragging }), onDragOver: this.handleDragOver, onDrop: this.handleDrop, title: "???????????????????????????" }, t.dragging ? i.default.createElement("div", { className: "ae-Outline-tip" }, "???????????????????????????????????????????????????") : null, a.length ? i.default.createElement("ul", { className: "ae-Outline-list" }, a.map((function (t, a) { return e.renderItem(t, a) }))) : i.default.createElement("div", null, "???????????????????????????"))
            }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleClick", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleEnter", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDragStart", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDragOver", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleDrop", null), t = n.__decorate([l.observer], t)
        }(i.default.Component);
        t.OutlinePanel = d
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.InsertSubRendererPanel = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(12)), o = a(7), r = n.__importDefault(a(4)), s = a(6), d = a(62), u = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.handleLeftClick = function (e) {
                var t = e.currentTarget.getAttribute("data-value");
                this.props.store.setInsertTag(t)
            }, t.prototype.handleClick = function (e) {
                var t = e.currentTarget.getAttribute("data-value");
                this.props.store.setInsertSelected(t)
            }, t.prototype.hadnlDBClick = function (e) {
                var t = e.currentTarget.getAttribute("data-value"), a = this.props.store;
                a.setInsertSelected(t);
                var n = this.props.manager;
                "replace" === a.insertMode ? n.replace() : n.insert()
            }, t.prototype.handleInsert = function () { this.props.manager.insert() }, t.prototype.handleReplace = function () { this.props.manager.replace() }, t.prototype.handleCancel = function () { this.props.store.closeInsertPanel() }, t.prototype.render = function () {
                var e, t, a = this, n = this.props.store, o = this.props.manager, s = null === (e = n.getNodeById(n.insertId)) || void 0 === e ? void 0 : e.info, u = null === (t = i.default(s.regions, (function (e) { return e.key === n.insertRegion }))) || void 0 === t ? void 0 : t.label, p = n.groupedInsertRenderers, c = Object.keys(p), m = n.insertTag || "??????", h = p[m];
                return r.default.createElement("div", { className: "ae-InsertPanel" }, "replace" === n.insertMode ? r.default.createElement("div", { className: "ae-InsertPanel-title" }, "??????????????????") : r.default.createElement("div", { className: "ae-InsertPanel-title" }, "???????????????????????", r.default.createElement("code", null, s.name, " > ", u)), r.default.createElement("div", { className: "m-b-xs" }, r.default.createElement(l.InputBox, { value: n.insertRenderersKeywords, onChange: n.changeInsertRenderersKeywords, placeholder: "??????????????????????????????", clearable: !1 }, n.insertRenderersKeywords ? r.default.createElement("a", { onClick: n.resetInsertRenderersKeywords }, r.default.createElement(l.Icon, { icon: "close", className: "icon" })) : r.default.createElement(l.Icon, { icon: "search", className: "icon" }))), r.default.createElement("div", { className: "ae-RenderersPicker-list" }, r.default.createElement("ul", null, c.map((function (e) { return r.default.createElement("li", { key: e, className: m === e ? "is-active" : "" }, r.default.createElement("a", { "data-value": e, onClick: a.handleLeftClick }, e)) }))), r.default.createElement("div", { className: "ae-RenderersPicker-content" }, Array.isArray(h) && h.length ? r.default.createElement("ul", null, h.map((function (e) { return r.default.createElement("li", { key: e.id, className: n.insertSelected === e.id ? "is-active" : "", "data-value": e.id, onClick: a.handleClick, onDoubleClick: a.hadnlDBClick }, r.default.createElement(d.RendererThumb, { theme: o.env.theme, env: o.env, schema: e.previewSchema || { type: "tpl", tpl: "????????????" } }), r.default.createElement("div", { className: "ae-RenderersPicker-info" }, r.default.createElement("h4", null, e.name), r.default.createElement("div", null, r.default.createElement(l.Html, { html: e.description }), e.docLink ? r.default.createElement("a", { target: "_blank", href: n.amisDocHost + e.docLink }, "??????????") : null))) }))) : r.default.createElement("div", null, "??????????????????????????????????????????????????????"))), r.default.createElement("div", { className: "ae-InsertPanel-footer" }, "replace" === n.insertMode ? r.default.createElement(l.Button, { onClick: this.handleReplace, disabled: !n.insertSelected, level: "primary" }, "??????") : r.default.createElement(l.Button, { onClick: this.handleInsert, disabled: !n.insertSelected, level: "primary" }, "??????"), r.default.createElement(l.Button, { onClick: this.handleCancel }, "??????")))
            }, n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleLeftClick", null), n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleClick", null), n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "hadnlDBClick", null), n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handleInsert", null), n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handleReplace", null), n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handleCancel", null), t = n.__decorate([o.observer], t)
        }(r.default.Component);
        t.InsertSubRendererPanel = u
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.RendererThumb = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(5), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.state = { scale: !0 }, t.env = n.__assign({ session: "preview" }, t.props.env), t
            } return n.__extends(t, e), t.prototype.componentWillMount = function () { this.rootRef = this.rootRef.bind(this), this.syncHeight = this.syncHeight.bind(this), this.handleClick = this.handleClick.bind(this) }, t.prototype.componentWillUnmount = function () { this.unSensor && this.unSensor() }, t.prototype.rootRef = function (e) {
                var t;
                this.ref = e, e && (this.syncHeight(), this.unSensor = o.resizeSensor(null === (t = e.firstChild) || void 0 === t ? void 0 : t.firstChild, this.syncHeight))
            }, t.prototype.syncHeight = function () {
                if (this.ref) {
                    var e = this.state.scale, t = this.ref.firstChild;
                    this.ref.style.cssText = "height: " + t.scrollHeight / (e ? 2 : 1) + "px;"
                }
            }, t.prototype.handleClick = function (e) { e.preventDefault(), this.setState({ scale: !this.state.scale }) }, t.prototype.render = function () {
                var e = this, t = this.props, a = t.schema, r = t.theme;
                return i.default.createElement(l.LazyComponent, {
                    unMountOnHidden: !1, schema: a, component: function (t) {
                        var a = t.schema;
                        return i.default.createElement("div", { className: "ae-RenderersPicker-thumb " + (e.state.scale ? "is-scaled" : "") }, i.default.createElement("div", { className: "ae-Editor-rendererThumbWrap" }, i.default.createElement("div", { className: "ae-Editor-rendererThumbIcon", onClick: e.handleClick }, i.default.createElement(l.Icon, { icon: e.state.scale ? "zoom-in" : "zoom-out" })), i.default.createElement("div", { ref: e.rootRef, className: "ae-Editor-rendererThumb" }, i.default.createElement("div", { className: "ae-Editor-rendererThumbInner" }, o.render(n.__assign(n.__assign({}, a), { mode: "horizontal" === a.mode ? "normal" : a.mode }), { theme: r }, e.env)))))
                    }
                })
            }, t
        }(i.default.Component);
        t.RendererThumb = r
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.Panels = void 0;
        var n = a(0), l = a(7), i = n.__importDefault(a(4)), o = n.__importDefault(a(8)), r = a(5), s = a(6), d = a(11), u = n.__importDefault(a(12)), p = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.handleSelect = function (e) {
                var t = this.props.store;
                this.isLeftPanel ? t.changeLeftPanelKey(e) : t.changePanelKey(e)
            }, t.prototype.getPopOverContainer = function () { return d.findDOMNode(this) }, t.prototype.tabsRef = function (e) {
                if (e) {
                    var t = d.findDOMNode(e).parentElement;
                    t.parentElement.style.cssText += "width: " + t.firstChild.offsetWidth + "px;", this.resizeSensor = r.resizeSensor(t.firstChild, (function () { t.parentElement.style.cssText += "width: " + t.firstChild.offsetWidth + "px;" }))
                } else this.resizeSensor && (this.resizeSensor(), delete this.resizeSensor)
            }, t.prototype.render = function () {
                var e = this, t = this.props.store, a = this.props.manager;
                this.isLeftPanel = this.props.isLeftPanel || !1;
                var n = this.isLeftPanel ? t.getLeftPanels() : t.getPanels(), l = this.props.theme, s = t.activeId, d = t.getNodeById(s), p = this.isLeftPanel ? t.getLeftPanelKey() : t.getPanelKey(), c = t.insertId && t.insertRegion && u.default(n, (function (e) { return "insert" === e.key })), m = function (n) { return n.render ? n.render({ id: s, info: null == d ? void 0 : d.info, path: null == d ? void 0 : d.path, value: t.value, onChange: a.panelChangeValue, store: t, manager: a, popOverContainer: e.getPopOverContainer }) : n.component ? i.default.createElement(n.component, { key: n.key, id: s, info: null == d ? void 0 : d.info, path: null == d ? void 0 : d.path, value: t.value, onChange: a.panelChangeValue, store: t, manager: a, popOverContainer: e.getPopOverContainer }) : null };
                return i.default.createElement("div", { className: o.default("ae-Settings", "none" !== p ? "is-active" : "", this.isLeftPanel ? "is-left" : "") }, i.default.createElement("div", { className: "ae-Settings-inner" }, this.isLeftPanel || 1 !== n.length ? i.default.createElement(r.Tabs, { ref: this.tabsRef, theme: l, className: o.default("ae-Settings-tabs", { "ae-LeftSettings-tabs": this.isLeftPanel }), contentClassName: o.default("ae-Settings-tabs-content"), activeKey: p, onSelect: this.handleSelect }, n.map((function (e) { return "insert" !== e.key ? i.default.createElement(r.Tab, { key: e.key, eventKey: e.key, title: e.title, icon: e.icon, className: "ae-Editor-" + e.key + "Pane", mountOnEnter: !0, unmountOnExit: !0 }, m(e)) : null }))) : i.default.createElement("div", { ref: this.tabsRef, className: o.default("ae-Settings-main") }, m(n[0]))), i.default.createElement(r.Drawer, { position: "left", size: "md", show: !!c, onHide: t.closeInsertPanel }, c && c.component ? i.default.createElement(c.component, { key: c.key, id: s, info: null == d ? void 0 : d.info, path: null == d ? void 0 : d.path, value: t.value, onChange: a.panelChangeValue, store: t, manager: a, popOverContainer: this.getPopOverContainer }) : null))
            }, n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [String]), n.__metadata("design:returntype", void 0)], t.prototype, "handleSelect", null), n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "getPopOverContainer", null), n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "tabsRef", null), t = n.__decorate([l.observer], t)
        }(i.default.Component);
        t.Panels = p
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        var n = a(0), l = n.__importDefault(a(4)), i = a(7), o = a(6), r = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.handleClick = function (e) {
                var t, a = e.currentTarget, n = a.getAttribute("data-node-id"), l = a.getAttribute("data-node-region"), i = this.props.store, o = this.props.manager, r = i.getNodeById(n);
                !1 !== (null === (t = null == r ? void 0 : r.info) || void 0 === t ? void 0 : t.editable) && (l ? o.showInsertPanel(l, n) : i.setActiveId(n))
            }, t.prototype.handleMouseEnter = function (e) {
                var t = e.currentTarget, a = t.getAttribute("data-node-id"), n = t.getAttribute("data-node-region");
                this.props.store.setHoverId(a, n)
            }, t.prototype.render = function () {
                var e = this, t = this.props.store.bcn;
                return l.default.createElement("div", { className: "ae-Breadcrumb" }, l.default.createElement("span", null, "???????????????"), t.length ? l.default.createElement("ul", null, t.map((function (t, a) {
                    var n, i = null === (n = t.parent) || void 0 === n ? void 0 : n.uniqueChildren;
                    return l.default.createElement("li", { key: a }, l.default.createElement("a", { "data-node-id": t.id, "data-node-region": t.region, onClick: e.handleClick, onMouseEnter: e.handleMouseEnter }, t.label), (null == i ? void 0 : i.length) > 1 ? l.default.createElement("ul", null, i.map((function (a) { return l.default.createElement("li", { key: a.id + "-" + a.region }, l.default.createElement("a", { "data-node-id": a.id, "data-node-region": a.region, onClick: e.handleClick, onMouseEnter: e.handleMouseEnter, className: a.id === t.id && a.region === t.region ? "is-active" : "" }, a.label)) }))) : null)
                }))) : l.default.createElement("span", null, "????????????????????????"))
            }, n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleClick", null), n.__decorate([o.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleMouseEnter", null), t = n.__decorate([i.observer], t)
        }(l.default.Component);
        t.default = r
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.PopOverForm = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(5), o = a(7), r = a(6), s = a(9), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.overlay = l.default.createRef(), t
            } return n.__extends(t, e), t.prototype.buildSchema = function () {
                var e = this, t = this.props.store.popOverForm;
                return {
                    type: "form", wrapWithPanel: !1, mode: "normal", wrapperComponent: "div", body: t.body, submitOnChange: !0, autoFocus: !0, onFinished: function (a) {
                        var n;
                        null === (n = t.callback) || void 0 === n || n.call(t, a, r.diff(t.value, a)), setTimeout((function () {
                            var t;
                            return null === (t = e.overlay.current) || void 0 === t ? void 0 : t.updatePosition()
                        }), 200)
                    }
                }
            }, t.prototype.render = function () {
                var e = this.props, t = e.store, a = e.theme, o = e.manager, r = t.popOverForm;
                return l.default.createElement(i.Overlay, { target: null == r ? void 0 : r.target, placement: "left-bottom-left-top left-top-left-bottom right-bottom-right-top right-top-right-bottom center", show: !!r, ref: this.overlay }, l.default.createElement(i.PopOver, { overlay: !0, className: "ae-Editor-popOverForm", onHide: t.closePopOverForm }, r ? i.render(this.buildSchema(), { data: s.createObject(t.ctx, null == r ? void 0 : r.value) }, n.__assign(n.__assign({}, o.env), { seesion: "popover-form", theme: a })) : l.default.createElement("p", null, "Loading...")))
            }, t = n.__decorate([o.observer], t)
        }(l.default.Component);
        t.PopOverForm = d
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ClassNameControl = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(11), r = [{ label: "?????????", children: [{ label: "??????", children: [{ label: "??????", value: "m-xs" }, { label: "???", value: "m-sm" }, { label: "??????", value: "m" }, { label: "???", value: "m-md" }, { label: "???", value: "m-lg" }] }, { label: "?????????", children: [{ label: "??????", value: "m-t-xs" }, { label: "???", value: "m-t-sm" }, { label: "??????", value: "m-t" }, { label: "???", value: "m-t-md" }, { label: "???", value: "m-t-lg" }] }, { label: "?????????", children: [{ label: "??????", value: "m-r-xs" }, { label: "???", value: "m-r-sm" }, { label: "??????", value: "m-r" }, { label: "???", value: "m-r-md" }, { label: "???", value: "m-r-lg" }] }, { label: "?????????", children: [{ label: "??????", value: "m-b-xs" }, { label: "???", value: "m-b-sm" }, { label: "??????", value: "m-b" }, { label: "???", value: "m-b-md" }, { label: "???", value: "m-b-lg" }] }, { label: "?????????", children: [{ label: "??????", value: "m-l-xs" }, { label: "???", value: "m-l-sm" }, { label: "??????", value: "m-l" }, { label: "???", value: "m-l-md" }, { label: "???", value: "m-l-lg" }] }, { label: "??????", children: [{ label: "??????", value: "m-none" }, "|", { label: "???", value: "m-t-none" }, { label: "???", value: "m-r-none" }, { label: "???", value: "m-b-none" }, { label: "???", value: "m-l-none" }] }] }, { label: "?????????", children: [{ label: "??????", children: [{ label: "??????", value: "p-xs" }, { label: "???", value: "p-sm" }, { label: "??????", value: "p" }, { label: "???", value: "p-md" }, { label: "???", value: "p-lg" }] }, { label: "?????????", children: [{ label: "??????", value: "p-t-xs" }, { label: "???", value: "p-t-sm" }, { label: "??????", value: "p-t" }, { label: "???", value: "p-t-md" }, { label: "???", value: "p-t-lg" }] }, { label: "?????????", children: [{ label: "??????", value: "p-r-xs" }, { label: "???", value: "p-r-sm" }, { label: "??????", value: "p-r" }, { label: "???", value: "p-r-md" }, { label: "???", value: "p-r-lg" }] }, { label: "?????????", children: [{ label: "??????", value: "p-b-xs" }, { label: "???", value: "p-b-sm" }, { label: "??????", value: "p-b" }, { label: "???", value: "p-b-md" }, { label: "???", value: "p-b-lg" }] }, { label: "?????????", children: [{ label: "??????", value: "p-l-xs" }, { label: "???", value: "p-l-sm" }, { label: "??????", value: "p-l" }, { label: "???", value: "p-l-md" }, { label: "???", value: "p-l-lg" }] }, { label: "??????", children: [{ label: "??????", value: "p-none" }, "|", { label: "???", value: "p-t-none" }, { label: "???", value: "p-r-none" }, { label: "???", value: "p-b-none" }, { label: "???", value: "p-l-none" }] }] }, { label: "??????", className: "w2x", children: [{ label: "??????", children: [{ label: "??????", value: "b-a" }, "|", { label: "???", value: "b-t" }, { label: "???", value: "b-r" }, { label: "???", value: "b-b" }, { label: "???", value: "b-l" }, "|", { label: "??????", value: "no-border" }] }, { label: "??????", children: [{ label: "2x", value: "b-2x" }, { label: "3x", value: "b-3x" }, { label: "4x", value: "b-4x" }, { label: "5x", value: "b-5x" }] }, { label: "??????", children: [{ label: "??????", value: "b-primary", className: "bg-primary" }, { label: "??????", value: "b-info", className: "bg-info" }, { label: "??????", value: "b-warning", className: "bg-warning" }, { label: "??????", value: "b-danger", className: "bg-danger" }, { label: "??????", value: "b-success", className: "bg-success" }, { label: "??????", value: "b-white", className: "bg-white" }, { label: "??????", value: "b-dark", className: "bg-dark" }, { label: "??????", value: "b-light", className: "bg-light" }] }] }, { label: "??????", className: "w2x", children: [{ label: "??????", children: [{ label: "??????", value: "r" }, "|", { label: "???", value: "r-t" }, { label: "???", value: "r-r" }, { label: "???", value: "r-b" }, { label: "???", value: "r-l" }, "|", { label: "2x", value: "r-2x" }, { label: "3x", value: "r-3x" }] }, { label: "??????", children: [{ label: "??????", value: "font-normal" }, { label: "???", value: "font-thin" }, { label: "???", value: "font-bold" }, "|", { label: "??????", value: "text-xs" }, { label: "???", value: "text-sm" }, { label: "??????", value: "text-base" }, { label: "???", value: "text-md" }, { label: "???", value: "text-lg" }] }, { label: "??????", children: [{ label: "??????", value: "text-primary", className: "text-primary" }, { label: "??????", value: "text-info", className: "text-info" }, { label: "??????", value: "text-warning", className: "text-warning" }, { label: "??????", value: "text-danger", className: "text-danger" }, { label: "??????", value: "text-success", className: "text-success" }, { label: "??????", value: "text-white", className: "text-white bg-dark" }, { label: "??????", value: "text-dark", className: "text-dark" }, { label: "??????", value: "text-muted", className: "text-muted" }] }, { label: "??????", children: [{ label: "??????", value: "bg-primary", className: "bg-primary" }, { label: "??????", value: "bg-info", className: "bg-info" }, { label: "??????", value: "bg-warning", className: "bg-warning" }, { label: "??????", value: "bg-danger", className: "bg-danger" }, { label: "??????", value: "bg-success", className: "bg-success" }, { label: "??????", value: "bg-white", className: "bg-white" }, { label: "??????", value: "bg-dark", className: "bg-dark" }, { label: "??????", value: "bg-light", className: "bg-light" }, "|", { label: "??????", value: "no-bg" }] }, { label: "??????", children: [{ label: "??????", value: "w-xxs" }, { label: "??????", value: "w-xs" }, { label: "???", value: "w-sm" }, { label: "??????", value: "w" }, { label: "???", value: "w-md" }, { label: "???", value: "w-lg" }, { label: "??????", value: "w-xl" }, { label: "??????", value: "w-xxl" }, { label: "??????", value: "w-full" }] }] }];
        var s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.state = { isFocused: !1, isOpened: !1 }, t.values = [], t
            } return n.__extends(t, e), t.prototype.open = function () { this.setState({ isOpened: !0 }) }, t.prototype.close = function () { this.setState({ isOpened: !1 }) }, t.prototype.toggle = function () { this.setState({ isOpened: !this.state.isOpened }) }, t.prototype.handleFocus = function (e) { this.setState({ isFocused: !0 }), this.props.onFocus && this.props.onFocus(e) }, t.prototype.handleBlur = function (e) { this.setState({ isFocused: !1 }), this.props.onBlur && this.props.onBlur(e) }, t.prototype.handleChange = function (e) { (0, this.props.onChange)(e.currentTarget.value) }, t.prototype.getParent = function () { return o.findDOMNode(this) }, t.prototype.getTarget = function () { return o.findDOMNode(this) }, t.prototype.handlePopOverChange = function (e) {
                var t = this.props.value || "", a = t.replace(/\s+/g, " ").split(/\s+/), n = a.indexOf(e.value), l = this.props.onChange;
                if (~n) a.splice(n, 1), t = a.join(" ");
                else {
                    if (/(?:^|\s)(m|p)\-(t|r|b|l)(?:\-(?:xs|sm|md|lg))?(?:$|\s)/.test(e.value)) {
                        var i = new RegExp("(?:^|\\s)" + RegExp.$1 + "\\-" + RegExp.$2 + "(?:\\-(?:xs|sm|md|lg))?(?=(\\s|$))", "ig");
                        t = t.replace(i, "")
                    } else if (/(?:^|\s)(m|p)(?:\-(xs|sm|md|lg))?(?:$|\s)/.test(e.value)) {
                        i = new RegExp("(?:^|\\s)" + RegExp.$1 + "(?:\\-(?:xs|sm|md|lg))?(?=(\\s|$))", "ig");
                        t = t.replace(i, "")
                    } else if (/(?:^|\s)(m|p)(?:\-(t|r|b|l))?\-none(?:$|\s)/.test(e.value)) {
                        i = new RegExp(RegExp.$2 ? "(?:^|\\s)" + RegExp.$1 + "(?:(?:\\-" + RegExp.$2 + "(?:\\-(?:xs|sm|md|lg)))|\\-none)?(?=(\\s|$))" : "(?:^|\\s)" + RegExp.$1 + "(?:[^\\s$]+)?(?=(\\s|$))", "ig");
                        t = t.replace(i, "$1")
                    } else /(?:^|\s)w(?:\-\w+)?(?:$|\s)/.test(e.value) ? t = t.replace(/(?:^|\s)w(?:\-\w+)?(?=(\s|$))/g, "") : "b-a" === e.value ? t = (t = t.replace(/(?:^|\s)b\-(?:t|r|b|l)(?=(\s|$))/g, "")).replace(/(?:^|\s)no\-border(?=(\s|$))/g, "") : /(?:^|\s)b\-(?:t|r|b|l)?(?:$|\s)/.test(e.value) ? t = (t = t.replace(/(?:^|\s)b\-a(?=(\s|$))/g, "")).replace(/(?:^|\s)no\-border(?=(\s|$))/g, "") : /(?:^|\s)b\-\dx(?:$|\s)/.test(e.value) ? t = t.replace(/(?:^|\s)b\-\dx(?=(\s|$))/g, "") : "no-border" === e.value ? t = t.replace(/(?:^|\s)b\-(?:\dx|\w+)(?=(\s|$))/g, "") : /(?:^|\s)b\-(?:primary|info|warning|danger|success|white|dark|light)(?:$|\s)/.test(e.value) ? t = t.replace(/(?:^|\s)b\-(?:primary|info|warning|danger|success|white|dark|light)(?=(\s|$))/g, "") : "r" === e.value ? t = t.replace(/(?:^|\s)r\-(?:t|r|b|l)(?=(\s|$))/g, "") : /(?:^|\s)r\-(?:t|r|b|l)?(?:$|\s)/.test(e.value) ? t = t.replace(/(?:^|\s)r(?=(\s|$))/g, "") : /(?:^|\s)r\-\dx(?:$|\s)/.test(e.value) ? t = t.replace(/(?:^|\s)r\-\dx(?=(\s|$))/g, "") : /(?:^|\s)text\-(?:xs|sm|base|md|lg)(?:$|\s)/.test(e.value) ? t = t.replace(/(?:^|\s)text\-(?:xs|sm|base|md|lg)(?=(\s|$))/g, "") : /(?:^|\s)font\-(?:normal|thin|bold)(?:$|\s)/.test(e.value) ? t = t.replace(/(?:^|\s)font\-(?:normal|thin|bold)(?=(\s|$))/g, "") : /(?:^|\s)text\-(?:primary|info|warning|danger|success|white|dark|light)(?:$|\s)/.test(e.value) ? t = t.replace(/(?:^|\s)text\-(?:primary|info|warning|danger|success|white|dark|light)(?=(\s|$))/g, "") : /(?:^|\s)bg\-(?:primary|info|warning|danger|success|white|dark|light)(?:$|\s)/.test(e.value) ? t = (t = t.replace(/(?:^|\s)bg\-(?:primary|info|warning|danger|success|white|dark|light)(?=(\s|$))/g, "")).replace(/(?:^|\s)no\-bg(?=(\s|$))/g, "") : "no-bg" === e.value && (t = t.replace(/(?:^|\s)bg\-(?:primary|info|warning|danger|success|white|dark|light)(?=(\s|$))/g, ""));
                    t = t.replace(/\s+/g, " ").trim(), t += (t ? " " : "") + e.value
                } l(t)
            }, t.prototype.renderGroup = function (e, t) {
                var a = this, n = this.props.classnames;
                return i.default.createElement("div", { key: t, className: n("ae-ClassNameControl-group", e.className) }, i.default.createElement("label", { className: n("ae-ClassNameControl-groupLabel", e.labelClassName) }, e.label), e.children && e.children.length ? e.children[0].value ? this.renderOptions(e.children, t) : e.children.map((function (e, t) { return a.renderGroup(e, t) })) : null)
            }, t.prototype.renderOptions = function (e, t) {
                var a = this, n = this.props.classnames;
                return function (e) {
                    for (var t = [], a = t[0] = [], n = 0, l = e.length;
                        n < l;
                        n++) {
                        var i = e[n];
                        "|" === i ? (a = [], t.push(a)) : a.push(i)
                    } return t
                }(e).map((function (e, t) { return i.default.createElement("div", { className: n("ButtonGroup"), key: t }, e.map((function (e, t) { return i.default.createElement("div", { key: t, onClick: function () { return a.handlePopOverChange(e) }, className: n("Button Button--xs", e.className, ~a.values.indexOf(e.value) ? "Button--primary" : "Button--default") }, e.label) }))) }))
            }, t.prototype.renderPopover = function () {
                var e = this, t = this.props.value;
                return this.values = t ? t.split(" ") : [], i.default.createElement("div", null, r.map((function (t, a) { return e.renderGroup(t, a) })))
            }, t.prototype.render = function () {
                var e, t = this.props, a = t.classnames, n = t.readOnly, o = t.disabled, r = t.value, s = t.className, d = t.name, u = t.popOverContainer;
                return i.default.createElement("div", { className: a(s, "TextControl", (e = {}, e["TextControl--withAddOn"] = !0, e["is-focused"] = this.state.isFocused, e["is-disabled"] = o, e)) }, i.default.createElement("div", { className: a("TextControl-input") }, i.default.createElement("input", { name: d, placeholder: "????????? css ??????", disabled: o, readOnly: n, type: "text", autoComplete: "off", onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur, value: null == r ? "" : "string" == typeof r ? r : JSON.stringify(r) })), i.default.createElement("div", { className: a("TextControl-button") }, i.default.createElement(l.Button, { onClick: this.toggle }, i.default.createElement("i", { className: "fa fa-cog" }))), i.default.createElement(l.Overlay, { placement: "right-bottom-right-top  right-top-right-bottom right-bottom-right-top", target: this.getTarget, container: u || this.getParent, rootClose: !1, show: this.state.isOpened, watchTargetSizeChange: !1 }, i.default.createElement(l.PopOver, { className: "ae-ClassNamePicker-popover", onHide: this.close, overlay: !0 }, this.renderPopover())))
            }, n.__decorate([l.utils.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "open", null), n.__decorate([l.utils.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "close", null), n.__decorate([l.utils.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "toggle", null), n.__decorate([l.utils.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleFocus", null), n.__decorate([l.utils.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleBlur", null), n.__decorate([l.utils.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleChange", null), n.__decorate([l.utils.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "getParent", null), n.__decorate([l.utils.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "getTarget", null), t = n.__decorate([l.FormItem({ type: "ae-classname" })], t)
        }(i.default.Component);
        t.ClassNameControl = s
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.AvailableRenderersPanel = void 0;
        var n = a(0), l = a(5), i = a(7), o = n.__importDefault(a(4)), r = n.__importDefault(a(8)), s = a(6), d = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.handleRegionFilterClick = function (e) {
                var t = e.currentTarget.getAttribute("data-value"), a = this.props, n = a.store, l = a.manager;
                t = t === n.subRendererRegion ? "" : t, l.switchToRegion(t)
            }, t.prototype.handleDragStart = function (e) {
                var t = e.currentTarget.getAttribute("data-id");
                e.dataTransfer.setData('dnd-dom/[data-id="' + t + '"]', "")
            }, t.prototype.renderThumb = function (e) {
                var t = this.props.manager;
                return e ? l.render(e, { onAction: s.noop }, t.env) : o.default.createElement("p", null, "???????????????")
            }, t.prototype.render = function () {
                var e = this, t = this.props.store, a = t.groupedSubRenderers, n = Object.keys(a), i = t.getNodeById(t.activeContainerId);
                return o.default.createElement("div", { className: "ae-RendererList" }, o.default.createElement("div", { className: "p-l p-r m-b-xs" }, o.default.createElement(l.InputBox, { value: t.subRenderersKeywords, onChange: t.changeSubRenderersKeywords, placeholder: "??????????????????????????????", clearable: !1 }, t.subRenderersKeywords ? o.default.createElement("a", { onClick: t.resetSubRenderersKeywords }, o.default.createElement(l.Icon, { icon: "close", className: "icon" })) : o.default.createElement(l.Icon, { icon: "search", className: "icon" }))), o.default.createElement("div", { className: "ae-RendererList-tip" }, "??????????????????????????????", null == i ? void 0 : i.label, "??????"), o.default.createElement("div", { className: "ae-RendererList-groupWrap" }, n.length ? n.map((function (n, i) {
                    var s = a[n];
                    return s && s.length ? o.default.createElement("div", { key: n, className: "ae-RendererList-group" }, o.default.createElement("div", { className: "ae-RendererList-groupLabel" }, n), s.map((function (a) {
                        var n = i + "_" + a.id;
                        return o.default.createElement("div", { onDragStart: e.handleDragStart, "data-id": n, "data-dnd-type": "subrenderer", "data-dnd-id": a.id, "data-dnd-data": JSON.stringify(a.scaffold || { type: a.type }), key: n, draggable: !0, className: "ae-RendererList-item" }, o.default.createElement("i", { className: r.default("fa-fw", a.icon || "fa fa-circle-thin") }), o.default.createElement("div", { className: "ae-RendererList-itemLabel" }, a.name), o.default.createElement("div", { className: "ae-RendererList-itemInfo" }, o.default.createElement(l.TooltipWrapper, { tooltipClassName: "ae-RendererThumb", trigger: "click", rootClose: !0, placement: "right", tooltip: { dom: o.default.createElement("div", { className: "ae-RendererInfo" }, a.description || a.docLink ? o.default.createElement(o.default.Fragment, null, o.default.createElement("div", null, o.default.createElement(l.Html, { html: a.description }), a.docLink ? o.default.createElement("a", { target: "_blank", href: t.amisDocHost + a.docLink }, "??????????") : null), o.default.createElement("div", { className: "ae-RendererDiv" })) : null, o.default.createElement("div", { className: "ae-RendererPreview" }, e.renderThumb(a.previewSchema))) } }, o.default.createElement("a", { className: "ae-RendererIcon", "data-position": "bottom" }, o.default.createElement(l.Icon, { icon: "info", className: "icon" })))))
                    }))) : null
                })) : o.default.createElement("span", null, "??????????????????????????????????????????????????????")))
            }, n.__decorate([s.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleRegionFilterClick", null), t = n.__decorate([i.observer], t)
        }(o.default.Component);
        t.AvailableRenderersPanel = d
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CodePlugin = void 0;
        var n = a(0), l = a(69), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.order = -9999, t
            } return n.__extends(t, e), t.prototype.buildJSONSchema = function (e) { return e.info.$schema }, t.prototype.buildEditorPanel = function (e, t) {
                e.info;
                var a = e.selections;
                this.manager.store.jsonSchemaUri && !a.length && t.push({ key: "code", icon: "fa fa-code", title: "??????", position: "left", component: l.CodeEditorPanel, order: 5e3 })
            }, t
        }(a(2).BasePlugin);
        t.CodePlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeEditorPanel = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(6), o = n.__importDefault(a(28)), r = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.handleResizeMouseDown = function (e) { 3 == e.nativeEvent.which || (this.codeWrap = e.currentTarget.parentElement, document.addEventListener("mousemove", this.handleResizeMouseMove), document.addEventListener("mouseup", this.handleResizeMouseUp), this.startX = e.clientX, this.startWidth = this.codeWrap.offsetWidth) }, t.prototype.handleResizeMouseMove = function (e) {
                var t = e.clientX - this.startX;
                this.codeWrap.style.cssText += "width: " + Math.max(this.startWidth + t, 300) + "px"
            }, t.prototype.handleResizeMouseUp = function () { document.removeEventListener("mousemove", this.handleResizeMouseMove), document.removeEventListener("mouseup", this.handleResizeMouseUp) }, t.prototype.handleCodePaste = function () {
                var e = this;
                setTimeout((function () { e.props.manager.patchSchema(!0) }), 500)
            }, t.prototype.render = function () {
                var e = this.props, t = (e.value, e.onChange), a = (e.info, e.manager), n = e.store;
                return l.default.createElement(l.default.Fragment, null, l.default.createElement(o.default, { value: n.valueWithoutHiddenProps, onChange: t, $schema: n.jsonSchemaUri, $schemaUrl: a.config.$schemaUrl, onPaste: this.handleCodePaste }), l.default.createElement("div", { onMouseDown: this.handleResizeMouseDown, className: "ae-Editor-codeResizor" }))
            }, n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleResizeMouseDown", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleResizeMouseMove", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handleResizeMouseUp", null), n.__decorate([i.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handleCodePaste", null), t
        }(l.default.Component);
        t.CodeEditorPanel = r
    }, function (e, t) { e.exports = require("58cb658") }, function (e, t) { e.exports = require("520d1e1") }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.NamePlugin = void 0;
        var n = a(0), l = a(73), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.order = -9999, t
            } return n.__extends(t, e), t.prototype.buildEditorPanel = function (e, t) {
                e.info, e.selections;
                t.push({ position: "left", key: "name-list", icon: "fa fa-list", title: "??????", component: l.TargetNamePanel, order: 4e3 })
            }, t
        }(a(2).BasePlugin);
        t.NamePlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TargetNamePanel = void 0;
        var n = a(0), l = a(7), i = n.__importDefault(a(8)), o = n.__importDefault(a(4)), r = a(6), s = function (e) {
            function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.handleClick = function (e) {
                var t = this.props, a = t.store, n = (t.manager, e.currentTarget.getAttribute("data-targetname-id"));
                a.setActiveId(n)
            }, t.prototype.handleEnter = function (e) {
                var t = this.props, a = t.store, n = (t.manager, e.currentTarget.getAttribute("data-targetname-id"));
                a.setHoverId(n)
            }, t.prototype.render = function () {
                var e = this, t = this.props, a = t.store, n = (t.manager, this.props.store.targetNames);
                return o.default.createElement("div", { className: "ae-TargetName" }, o.default.createElement("span", null, "?????????????????????????????????????????????????????????????????????"), o.default.createElement("ul", { className: "ae-TargetName-list" }, n.map((function (t) {
                    var n = t.editorId;
                    return o.default.createElement("li", { className: i.default("ae-TargetName-node", { "is-active": a.activeId === n, "is-hover": a.isHoved(n) }), "data-targetname-id": n, onMouseEnter: e.handleEnter, onClick: e.handleClick, key: n }, o.default.createElement("span", { className: "label label-info pull-right" }, t.type), o.default.createElement("a", null, t.name))
                }))))
            }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleClick", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleEnter", null), t = n.__decorate([l.observer], t)
        }(o.default.Component);
        t.TargetNamePanel = s
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ErrorRendererPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.order = -9999, t.rendererName = "error", t.name = "Error", t
            } return n.__extends(t, e), t
        }(a(2).BasePlugin);
        t.ErrorRendererPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.UnkownRendererPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.order = 9999, t
            } return n.__extends(t, e), t.prototype.getRendererInfo = function (e) {
                var t = e.renderer, a = e.schema, n = e.path;
                if (a.$$id && t) {
                    if (/(^|\/)static\-field/.test(n)) return;
                    if ("card-item" === t.name || "list-item-field" === t.name) return;
                    return { name: "Unkown", $schema: "/schemas/UnkownSchema.json" }
                }
            }, t
        }(a(2).BasePlugin);
        t.UnkownRendererPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ArrayControlPlugin = void 0;
        var n = a(0), l = a(5), i = a(1), o = a(2), r = a(3), s = n.__importDefault(a(4)), d = a(6), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-array", t.$schema = "/schemas/ArrayControlSchema.json", t.name = "???????????????", t.icon = "fa fa-bars", t.description = "Array ???????????????????????????????????????????????????????????? Combo ??? flat ??????????????????????????????????????? combo ?????????", t.docLink = "/amis/zh-CN/components/form/array", t.tags = ["?????????"], t.scaffold = { type: "input-array", label: "???????????????", name: "array", items: { type: "input-text", placeholder: "?????????" } }, t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: [n.__assign(n.__assign({}, t.scaffold), { value: ["row1", ""], draggable: !0 })] }, t.panelTitle = "?????????", t.panelBodyCreator = function (e) { return [r.getSchemaTpl("switchDefaultValue"), { type: "textarea", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"', pipeOut: r.valuePipeOut }, { children: s.default.createElement(l.Button, { size: "sm", level: "danger", className: "m-b", block: !0, onClick: t.editDetail.bind(t, e.id) }, "??????????????????") }, { label: "???????????????", type: "switch", name: "addable", mode: "inline", className: "w-full", pipeIn: r.defaultValue(!0) }, { label: "??????????????????", name: "addButtonText", type: "input-text", visibleOn: "data.addable", pipeIn: r.defaultValue("??????") }, { type: "textarea", name: "scaffold", label: "???????????????", visibleOn: "this.addable !== false", pipeOut: r.valuePipeOut, pipeIn: r.defaultValue("") }, { label: "???????????????", type: "switch", name: "removable", mode: "inline", className: "w-full", pipeIn: r.defaultValue(!0) }, r.getSchemaTpl("api", { name: "deleteApi", label: "??????????????????", visibleOn: "data.removable" }), { label: "??????????????????", name: "deleteConfirmText", type: "input-text", visibleOn: "data.deleteApi", pipeIn: r.defaultValue("???????????????") }, { name: "draggable", label: "??????????????????", type: "switch", mode: "inline", className: "w-full" }, { name: "draggableTip", visibleOn: "data.draggable", type: "input-text", label: "???????????????????????????", pipeIn: r.defaultValue("???????????????????????????????????????????????????????????????") }, { name: "addButtonText", type: "input-text", label: "??????????????????", pipeIn: r.defaultValue("??????") }, r.getSchemaTpl("minLength"), r.getSchemaTpl("maxLength")] }, t
            } return n.__extends(t, e), t.prototype.filterProps = function (e) { return (e = d.JSONPipeOut(e)).value || (e.value = [""]), e }, t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.buildEditorToolbar = function (e, t) {
                var a = e.id;
                "input-array" === e.info.renderer.name && t.push({ icon: "fa fa-expand", order: 100, tooltip: "??????????????????", onClick: this.editDetail.bind(this, a) })
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a = e.id;
                e.schema, e.region;
                "input-array" === e.info.renderer.name && t.push("|", { label: "?????????????????????", onSelect: this.editDetail.bind(this, a) })
            }, t.prototype.editDetail = function (e) {
                var t = this.manager, a = t.store, l = a.getNodeById(e), i = a.getValueOf(e);
                l && i && this.manager.openSubEditor({ title: "??????????????????", value: i.items, slot: { type: "form", mode: "normal", body: "$$", wrapWithPanel: !1, className: "wrapper" }, onChange: function (e) { e = n.__assign(n.__assign({}, i), { items: e }), t.panelChangeValue(e, d.diff(i, e)) } })
            }, t
        }(o.BasePlugin);
        t.ArrayControlPlugin = u, i.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ButtonGroupControlPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "button-group-select", t.$schema = "/schemas/ButtonGroupControlSchema.json", t.name = "????????????", t.icon = "fa fa-object-group", t.description = "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/button-group", t.tags = ["?????????", "??????"], t.scaffold = { type: "button-group-select", name: "a", options: [{ label: "??????1", value: "a" }, { label: "??????2", value: "b" }] }, t.previewSchema = { type: "form", wrapWithPanel: !1, mode: "horizontal", body: n.__assign(n.__assign({}, t.scaffold), { value: "a", label: "?????????", description: "??????????????????????????????" }) }, t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("switchDefaultValue", { visibleOn: "!this.defaultCheckAll" }), { type: "button-group-select", name: "value", label: "?????????", source: "${options}", visibleOn: 'typeof this.value !== "undefined"', multiple: !0 }, o.getSchemaTpl("options"), o.getSchemaTpl("source"), o.getSchemaTpl("multiple"), o.getSchemaTpl("joinValues", { visibleOn: !0 }), o.getSchemaTpl("delimiter", { hiddenOn: "this.joinValues === false" }), o.getSchemaTpl("extractValue"), o.getSchemaTpl("autoFill")], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(i.BasePlugin);
        t.ButtonGroupControlPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ButtonToolbarControlPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "button-toolbar", t.$schema = "/schemas/ButtonToolbarControlSchema.json", t.name = "???????????????", t.icon = "fa fa-ellipsis-h", t.description = "?????????????????????", t.docLink = "/amis/zh-CN/components/form/group", t.tags = ["?????????"], t.scaffold = { type: "button-toolbar", buttons: [{ type: "button", label: "??????1", actionType: "dialog", dialog: { title: "????????????", body: "???????????????" } }, { type: "button", label: "??????2", actionType: "dialog", dialog: { title: "????????????", body: "???????????????" } }] }, t.previewSchema = { type: "form", wrapWithPanel: !1, mode: "horizontal", body: n.__assign(n.__assign({}, t.scaffold), { label: "???????????????" }) }, t.regions = [{ key: "buttons", label: "????????????", preferTag: "??????", renderMethod: "renderButtons" }], t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [o.getSchemaTpl("label"), o.getSchemaTpl("description"), o.getSchemaTpl("remark"), o.getSchemaTpl("labelRemark")] }, { title: "??????", body: [o.getSchemaTpl("formItemMode"), o.getSchemaTpl("horizontalMode"), o.getSchemaTpl("horizontal", { label: "", visibleOn: '(data.$$formMode == "horizontal" || data.mode == "horizontal") && data.label !== false && data.horizontal' }), o.getSchemaTpl("className"), o.getSchemaTpl("className", { label: "Label CSS ??????", name: "labelClassName" }), o.getSchemaTpl("className", { label: "Input CSS ??????", name: "inputClassName" }), o.getSchemaTpl("className", { label: "?????? CSS ??????", name: "descriptionClassName", visibleOn: "data.description" })] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(i.BasePlugin);
        t.ButtonToolbarControlPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ChainedSelectControlPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "chained-select", t.$schema = "/schemas/ChainedSelectControlSchema.json", t.name = "???????????????", t.icon = "fa fa-th-list", t.description = "??????<code>source</code>??????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/chained-select", t.tags = ["?????????"], t.scaffold = { type: "chained-select", label: "????????????", name: "chained-select" }, t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: n.__assign({}, t.scaffold) }, t.panelTitle = "????????????", t.panelBody = [o.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"', description: "??????????????? Options ??? value ???" }, o.getSchemaTpl("api", { name: "source", label: "??????????????????", description: "<div>??????????????????</div><ul>\n                                <li><code>value</code>?????????</li>\n                                <li><code>level</code>?????????????????? <code>1</code>?????????</li>\n                                <li><code>parentId</code>?????????????????? <code>value</code> ???</li>\n                                <li><code>parent</code>?????????????????????????????? <code>label</code> ??? <code>value</code> ?????????</li>\n                            </ul>" }), o.getSchemaTpl("joinValues", { visibleOn: !0 }), o.getSchemaTpl("delimiter", { visibleOn: "data.joinValues" }), o.getSchemaTpl("extractValue")], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(i.BasePlugin);
        t.ChainedSelectControlPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CheckboxControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "checkbox", t.$schema = "/schemas/CheckboxControlSchema.json", t.name = "?????????", t.icon = "fa fa-check-square-o", t.description = "?????????", t.docLink = "/amis/zh-CN/components/form/text", t.tags = ["?????????"], t.scaffold = { type: "checkbox", option: "?????????", name: "checkbox" }, t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: [n.__assign(n.__assign({ value: !0 }, t.scaffold), { label: "????????????" })] }, t.panelTitle = "?????????", t.panelBody = [{ name: "option", type: "input-text", label: "????????????" }, l.getSchemaTpl("switchDefaultValue", {
                    name: "value", pipeOut: function (e, t, a) {
                        var n;
                        return e ? null === (n = a.trueValue) || void 0 === n || n : void 0
                    }
                }), {
                    type: "switch", name: "value", label: "????????????", mode: "inline", className: "w-full", visibleOn: 'typeof this.value !== "undefined"', pipeOut: function (e, t, a) {
                        var n, l;
                        return e ? null === (n = a.trueValue) || void 0 === n || n : null !== (l = a.falseValue) && void 0 !== l && l
                    }
                }, { type: "input-text", label: "???????????????", name: "trueValue", pipeIn: l.defaultValue(!0), pipeOut: l.valuePipeOut }, { type: "input-text", label: "???????????????", name: "falseValue", pipeIn: l.defaultValue(!1), pipeOut: l.valuePipeOut }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.CheckboxControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CheckboxesControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "checkboxes", t.$schema = "/schemas/CheckboxesControlSchema.json", t.order = -470, t.name = "?????????", t.icon = "fa fa-check-square", t.description = "??????<code>options</code>???????????????????????????????????????<code>source</code>????????????", t.docLink = "/amis/zh-CN/components/form/checkboxes", t.tags = ["?????????"], t.scaffold = { type: "checkboxes", label: "?????????", name: "checkboxes", options: [{ label: "??????A", value: "A" }, { label: "??????B", value: "B" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({ value: "A" }, t.scaffold)] }, t.panelTitle = "?????????", t.panelBody = [l.getSchemaTpl("switchDefaultValue", { visibleOn: "!this.defaultCheckAll" }), { type: "checkboxes", name: "value", label: "?????????", source: "${options}", visibleOn: 'typeof this.value !== "undefined"', multiple: !0 }, l.getSchemaTpl("fieldSet", { title: "??????", body: [l.getSchemaTpl("options"), l.getSchemaTpl("source"), { name: "checkAll", label: "????????????????????????", type: "switch", mode: "inline", className: "w-full" }, { name: "defaultCheckAll", label: "??????????????????", type: "switch", mode: "inline", className: "w-full", description: "??????????????????????????????????????????", onChange: function (e, t, a, n) { return e && n.setValueByName("value", void 0) } }, l.getSchemaTpl("joinValues", { visibleOn: !0 }), l.getSchemaTpl("delimiter", { hiddenOn: "data.joinValues === false" }), l.getSchemaTpl("extractValue"), l.getSchemaTpl("autoFill"), l.getSchemaTpl("creatable"), l.getSchemaTpl("createBtnLabel"), l.getSchemaTpl("api", { label: "??????????????????", name: "addApi" }), l.getSchemaTpl("editable"), l.getSchemaTpl("api", { label: "??????????????????", name: "editApi" }), l.getSchemaTpl("removable"), l.getSchemaTpl("api", { label: "??????????????????", name: "deleteApi" })] }), l.getSchemaTpl("fieldSet", { title: "??????", body: [{ label: "?????????????????????", name: "inline", type: "switch", visibleOn: 'data.mode != "inline"', mode: "inline", className: "w-full", pipeIn: l.defaultValue(!0) }, { label: "?????????????????????", name: "columnsCount", hiddenOn: 'typeof data.inline === "undefined" || data.inline === true', type: "input-range", min: 1, max: 6, pipeIn: l.defaultValue(1) }, l.getSchemaTpl("className", { label: "?????? Checkbox ??? CSS ??????", name: "itemClassName" })] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.CheckboxesControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CityControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-city", t.$schema = "/schemas/CityControlSchema.json", t.name = "????????????", t.icon = "fa fa-building-o", t.description = "???????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/city", t.tags = ["?????????"], t.scaffold = { type: "input-city", label: "????????????", name: "city" }, t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBody = [{ type: "switch", name: "allowDistrict", label: "??????????????????", mode: "inline", className: "w-full", pipeIn: l.defaultValue(!0) }, { type: "switch", name: "allowCity", label: "??????????????????", mode: "inline", className: "w-full", pipeIn: l.defaultValue(!0) }, l.getSchemaTpl("switchDefaultValue"), { name: "value", type: "input-city", label: "?????????", visibleOn: 'typeof data.value !== "undefined"', validations: "isNumeric", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: "????????????", placement: "left" } }, { type: "switch", name: "searchable", label: "??????????????????", mode: "inline", className: "w-full", pipeIn: l.defaultValue(!1) }, l.getSchemaTpl("extractValue")], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.CityControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ColorControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-color", t.$schema = "/schemas/ColorControlSchema.json", t.name = "?????????", t.icon = "fa fa-eyedropper", t.description = "??????<code>hex???hls???rgb???rgba</code>??????????????????<code>hex</code>??????", t.docLink = "/amis/zh-CN/components/form/color", t.tags = ["?????????"], t.scaffold = { type: "input-color", label: "??????", name: "color" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "?????????", t.panelBody = [{ label: "??????", name: "format", type: "button-group-select", size: "sm", value: "hex", options: ["hex", "hsl", "rgb", "rgba"], onChange: function (e, t, a, n) { n.setValueByName("value", ""), n.setValueByName("presetColors", "") } }, l.getSchemaTpl("switchDefaultValue"), t.getConditionalColorPanel("hex"), t.getConditionalColorPanel("hsl"), t.getConditionalColorPanel("rgb"), t.getConditionalColorPanel("rgba"), l.getSchemaTpl("switchDefaultValue", { name: "presetColors", label: "?????????????????????????????????", description: "??????????????????????????????????????????" }), t.getConditionalColorArray("hex"), t.getConditionalColorArray("hsl"), t.getConditionalColorArray("rgb"), t.getConditionalColorArray("rgba"), l.getSchemaTpl("clearable", { label: "??????????????????", pipeIn: l.defaultValue(!0) })], t
            } return n.__extends(t, e), t.prototype.getConditionalColorPanel = function (e) { return { type: "input-color", name: "value", format: e, visibleOn: 'typeof this.value !== "undefined" && this.format==="' + e + '"', label: "?????????" } }, t.prototype.getConditionalColorArray = function (e) { return { type: "input-array", name: "presetColors", label: "???????????????????????????", addable: !0, removable: !0, visibleOn: 'typeof this.presetColors !== "undefined" && this.format === "' + e + '"', items: { type: "input-color", format: e }, value: ["#D0021B", "#F5A623", "#F8E71C", "#8B572A", "#7ED321", "#417505", "#BD10E0", "#9013FE", "#4A90E2", "#50E3C2", "#B8E986", "#000000", "#4A4A4A", "#9B9B9B", "#FFFFFF"] } }, t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.ColorControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ComboControlPlugin = void 0;
        var n = a(0), l = a(5), i = a(1), o = a(2), r = a(3), s = n.__importDefault(a(4)), d = a(6), u = a(6), p = a(16), c = a(9), m = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "combo", t.$schema = "/schemas/ComboControlSchema.json", t.name = "????????????", t.icon = "fa fa-group", t.description = "??????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/combo", t.tags = ["?????????"], t.scaffold = { type: "combo", label: "????????????", name: "combo", multiple: !0, items: [{ type: "input-text", name: "input-text", placeholder: "??????" }, { type: "select", name: "select", placeholder: "??????", options: [{ label: "A", value: "a" }, { label: "B", value: "b" }] }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign(n.__assign({}, t.scaffold), { value: [{ text: "Row 1", select: "a" }, {}] })] }, t.panelTitle = "????????????", t.panelBodyCreator = function (e) {
                    return [{ name: "conditions", type: "button-group-select", size: "sm", mode: "inline", className: "block", options: [{ label: "??????????????????", value: "1" }, { label: "?????????", value: "2" }], pipeIn: function (e) { return e ? "2" : "1" }, pipeOut: function (e) { return 2 == e ? [{ label: "????????????", test: "", items: [{ type: "input-text", label: "??????", name: "text" }], scaffold: {} }] : void 0 } }, {
                        name: "conditions", visibleOn: "this.conditions", type: "combo", label: "????????????", multiple: !0, multiLine: !0, minLength: 1, items: [{ label: "??????", name: "label", type: "input-text", required: !0 }, { label: "????????????", name: "test", required: !0, type: "input-text", placeholder: '??????: this.type === "text"', description: "?????????????????????????????????????????????" }, {
                            children: function (a) {
                                a.value, a.onChange;
                                return s.default.createElement(l.Button, { size: "sm", level: "danger", className: "m-b", block: !0, onClick: t.editDetail.bind(t, e.id) }, "?????????????????????")
                            }
                        }, { type: "textarea", name: "scaffold", required: !0, label: "???????????????", pipeOut: r.valuePipeOut }], scaffold: { label: "????????????", test: "", items: [{ type: "input-text", label: "??????", name: "text" }], scaffold: {} }
                    }, { name: "typeSwitchable", visibleOn: "this.conditions", label: "?????????????????????", type: "switch", mode: "inline", className: "block", pipeIn: r.defaultValue(!0) }, {
                        name: "items", visibleOn: "!this.conditions", asFormItem: !0, children: function (e) {
                            var a = e.value, n = e.onChange;
                            return s.default.createElement(l.Button, { size: "sm", level: "danger", className: "m-b", block: !0, onClick: function () { t.manager.openSubEditor({ title: "?????????????????????", value: a, slot: { type: "form", mode: "normal", body: "$$", wrapWithPanel: !1, className: "wrapper" }, onChange: function (e) { return n(e) } }) } }, "?????????????????????")
                        }
                    }, r.getSchemaTpl("switchDefaultValue", { visibleOn: "!this.defaultCheckAll" }), { type: "textarea", name: "value", label: "?????????", pipeOut: r.valuePipeOut, visibleOn: 'typeof this.value !== "undefined"' }, { label: "????????????", name: "multiLine", type: "switch", mode: "inline", className: "w-full", value: !1, option: "??????????????????" }, r.getSchemaTpl("multiple"), r.getSchemaTpl("joinValues"), r.getSchemaTpl("delimiter"), { type: "switch", name: "flat", mode: "inline", className: "w-full", label: "??????????????????", visibleOn: "Array.isArray(data.items) && data.items.length === 1 && data.multiple", description: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" }, { label: "???????????????", type: "switch", name: "addable", mode: "inline", className: "w-full", visibleOn: "this.multiple", pipeIn: r.defaultValue(!0) }, { type: "textarea", name: "scaffold", label: "???????????????", visibleOn: "this.multiple && this.addable !== false", pipeOut: r.valuePipeOut, pipeIn: r.defaultValue({}) }, { label: "??????????????????", name: "addButtonText", type: "input-text", visibleOn: "data.addable", pipeIn: r.defaultValue("??????") }, { label: "???????????????", type: "switch", name: "removable", mode: "inline", className: "w-full", visibleOn: "this.multiple", pipeIn: r.defaultValue(!0) }, r.getSchemaTpl("api", { name: "deleteApi", label: "??????????????????", hiddenOn: "!data.removable" }), { label: "??????????????????", name: "deleteConfirmText", type: "input-text", visibleOn: "data.deleteApi", pipeIn: r.defaultValue("???????????????") }, { name: "draggable", label: "?????????????????????", type: "switch", visibleOn: "this.multiple", mode: "inline", className: "w-full" }, { label: "???????????????????????????", name: "draggableTip", type: "input-text", visibleOn: "data.draggable", pipeIn: r.defaultValue("???????????????????????????????????????????????????????????????") }, { name: "noBorder", label: "????????????", type: "switch", visibleOn: "this.multiLine", mode: "inline", className: "w-full" }, { name: "minLength", type: "input-number", label: "??????????????????" }, { name: "maxLength", type: "input-number", label: "??????????????????" }, { label: "??????????????????", type: "combo", name: "messages", multiLine: !0, description: "", items: [{ label: "????????????????????????????????????", type: "input-text", name: "validateFailed" }, { label: "?????????????????????????????????", type: "input-text", name: "minLengthValidateFailed" }, { label: "?????????????????????????????????", type: "input-text", name: "maxLengthValidateFailed" }] }, { name: "canAccessSuperData", label: "????????????????????????????????????", type: "switch", pipeIn: r.defaultValue(!1), mode: "inline", className: "w-full" }, { name: "tabsMode", label: "?????? Tabs ????????????", type: "switch", mode: "inline", className: "w-full", pipeIn: r.defaultValue(!1) }, { name: "tabsStyle", label: "Tabs ???????????????", visibleOn: "data.tabsMode", type: "list-select", options: [{ label: "??????", value: "normal" }, { label: "??????", value: "horizontal" }, { label: "??????", value: "inline" }], mode: "inline", className: "w-full" }, { name: "tabsLabelTpl", label: "??????????????????????????????", visibleOn: "data.tabsMode", type: "input-text", mode: "inline", className: "w-full" }, { name: "lazyLoad", label: "?????????", type: "switch", mode: "inline", className: "w-full", pipeIn: r.defaultValue(!1), description: "???????????????????????????????????????????????????????????????" }, { name: "strictMode", label: "????????????", type: "switch", mode: "inline", className: "w-full", pipeIn: r.defaultValue(!0), description: "???????????????????????????????????????????????? Combo ???????????????????????????" }, { name: "syncFields", visibleOn: "!data.strictMode", label: "??????????????????", type: "input-text", multiple: !0, joinValues: !1, extractValue: !0, description: "?????? Combo ??????????????????????????????????????????????????????????????????????????? combo ???????????????????????????????????????" }, { name: "nullable", label: "????????????", type: "switch", mode: "inline", className: "w-full", pipeIn: r.defaultValue(!1), description: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????" }, { name: "items", label: "?????? CSS ??????", hiddenOn: "this.multiLine", type: "combo", addable: !1, removable: !1, multiple: !0, items: [{ name: "columnClassName", placeholder: "CSS ??????", type: "input-text" }] }, r.getSchemaTpl("subFormItemMode", { visibleOn: "this.multiLine" }), r.getSchemaTpl("subFormHorizontalMode"), r.getSchemaTpl("subFormHorizontal")]
                }, t
            } return n.__extends(t, e), t.prototype.filterProps = function (e) {
                if ((e = u.JSONPipeOut(e)).multiple && !e.value && !e.$ref) {
                    var t = {};
                    Array.isArray(e.items) && e.items.forEach((function (e) { e.name && c.setVariable(t, e.name, p.mockValue(e)) })), e.value = [t]
                } return e
            }, t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.buildEditorToolbar = function (e, t) {
                var a = e.id;
                "combo" === e.info.renderer.name && t.push({ icon: "fa fa-expand", order: 100, tooltip: "??????????????????", onClick: this.editDetail.bind(this, a) })
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a = e.id;
                e.schema, e.region;
                "combo" === e.info.renderer.name && t.push("|", { label: "?????????????????????", onSelect: this.editDetail.bind(this, a) })
            }, t.prototype.editDetail = function (e) {
                var t = this.manager, a = t.store, l = a.getNodeById(e), i = a.getValueOf(e);
                l && i && this.manager.openSubEditor({ title: "??????????????????", value: i.items, slot: { type: "form", mode: "normal", body: "$$", wrapWithPanel: !1, className: "wrapper" }, onChange: function (e) { e = n.__assign(n.__assign({}, i), { items: e }), t.panelChangeValue(e, d.diff(i, e)) } })
            }, t
        }(o.BasePlugin);
        t.ComboControlPlugin = m, i.registerEditorPlugin(m)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ConditionBilderPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = n.__importStar(a(86)), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "condition-builder", t.$schema = "/schemas/ConditionBuilderControlSchema.json", t.name = "????????????", t.icon = "fa fa-group", t.description = "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/condition-builder", t.tags = ["?????????"], t.scaffold = { type: "condition-builder", label: "????????????", name: "conditions", description: "????????????????????????????????????????????????????????????????????? query where", fields: [{ label: "??????", type: "text", name: "text" }, { label: "??????", type: "number", name: "number" }, { label: "??????", type: "boolean", name: "boolean" }, { label: "??????", type: "select", name: "select", options: [{ label: "A", value: "a" }, { label: "B", value: "b" }, { label: "C", value: "c" }, { label: "D", value: "d" }, { label: "E", value: "e" }] }, { label: "??????", type: "date", name: "date" }, { label: "??????", type: "time", name: "time" }, { label: "????????????", type: "datetime", name: "datetime" }] }, t.scaffoldForm = {
                    title: "????????????????????????-CRUD", body: [{
                        type: "combo", name: "fields", multiple: !0, draggable: !0, multiLine: !0, items: [{ type: "group", body: [{ type: "select", name: "type", placeholder: "????????????", options: [{ label: "??????", value: "text" }, { label: "??????", value: "number" }, { label: "??????", value: "boolean" }, { label: "??????", value: "date" }, { label: "????????????", value: "datetime" }, { label: "??????", value: "time" }, { label: "??????", value: "select" }] }, { type: "input-text", name: "name", placeholder: "?????????" }, { type: "input-text", placeholder: "????????????", name: "label" }] }, { type: "group", visibleOn: 'data.type === "number"', body: [{ type: "input-number", name: "minimum", placeholder: "?????????" }, { type: "input-number", name: "maximum", placeholder: "?????????" }, { type: "input-number", name: "step", min: 0, placeholder: "??????" }] }, { type: "group", visibleOn: '!!~["date", "datetime", "time"].indexOf(data.type)', body: [{ type: "input-text", name: "format", placeholder: "?????????" }, { type: "input-text", name: "inputFormat", placeholder: "??????????????????" }, { type: "input-text", name: "timeFormat", placeholder: "??????????????????", visibleOn: 'data.type === "datetime"' }] }, { type: "group", visibleOn: 'data.type === "select"', body: [{ type: "input-text", name: "source", placeholder: "??????????????????????????????????????????????????????" }] }, {
                            type: "group", body: [{ type: "input-text", placeholder: "?????????", name: "placeholder" }, {
                                name: "operators", placeholder: "?????????", asFormItem: !0, children: function (e) {
                                    var t, a, n = e.data, l = e.render, i = e.onChange;
                                    return l("operations", { type: "select", name: "operators", multiple: !0, value: n.value || (null === (t = r.default.types[n.type]) || void 0 === t ? void 0 : t.operators) || [], joinValues: !1, extractValue: !0, options: (null === (a = r.default.types[n.type]) || void 0 === a ? void 0 : a.operators.map((function (e) { return { label: r.OperationMap[e], value: e } }))) || [] }, { onChange: function (e) { return i(e) } })
                                }
                            }]
                        }]
                    }], canRebuild: !0
                }, t.previewSchema = { type: "form", mode: "horizontal", wrapWithPanel: !1, body: [t.scaffold] }, t.panelTitle = "????????????", t.panelBodyCreator = function (e) { return [o.getSchemaTpl("source")] }, t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (e, t) { if (this.name && this.description) return { name: this.name, icon: this.icon, description: this.description, previewSchema: this.previewSchema, tags: this.tags, docLink: this.docLink, type: this.type, scaffold: this.scaffold, scaffoldForm: this.scaffoldForm } }, t
        }(i.BasePlugin);
        t.ConditionBilderPlugin = s, l.registerEditorPlugin(s)
    }, function (e, t) { e.exports = require("1b515ea") }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ControlPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(5), o = a(3), r = a(1), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "control", t.$schema = "/schemas/FormControlSchema.json", t.name = "???????????????", t.icon = "fa fa-object-group", t.description = "???????????????", t.tags = ["??????"], t.scaffold = { type: "control", label: "???????????????", body: [{ type: "tpl", tpl: "a" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.regions = [{ key: "body", label: "????????????", preferTag: "??????" }], t.panelTitle = "???????????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ children: l.default.createElement(i.Button, { className: "m-b", onClick: function () { return t.manager.showInsertPanel("body") }, level: "danger", tooltip: "????????????????????????", size: "sm", block: !0 }, "????????????") }, o.getSchemaTpl("description"), o.getSchemaTpl("placeholder"), o.getSchemaTpl("remark"), o.getSchemaTpl("labelRemark")] }, { title: "??????", body: [o.getSchemaTpl("formItemMode"), o.getSchemaTpl("horizontalMode"), o.getSchemaTpl("horizontal", { label: "", visibleOn: 'data.mode == "horizontal" && data.label !== false && data.horizontal' }), o.getSchemaTpl("formItemInline"), o.getSchemaTpl("className"), o.getSchemaTpl("className", { label: "Label CSS ??????", name: "labelClassName" }), o.getSchemaTpl("className", { label: "?????? CSS ??????", name: "inputClassName" }), o.getSchemaTpl("className", { label: "?????? CSS ??????", name: "descriptionClassName", visibleOn: "this.description" })] }, { title: "??????", body: [o.getSchemaTpl("disabled"), o.getSchemaTpl("visible"), { type: "switch", name: "clearValueOnHidden", label: "???????????????????????????", mode: "inline", className: "w-full" }] }, { title: "??????", body: [o.getSchemaTpl("validations"), o.getSchemaTpl("validationErrors"), o.getSchemaTpl("validateOnChange"), o.getSchemaTpl("submitOnChange")] }])], t
            } return n.__extends(t, e), t
        }(a(2).BasePlugin);
        t.ControlPlugin = s, r.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DateRangeControlPlugin = void 0;
        var n = a(0), l = a(5), i = a(3), o = a(1), r = a(2), s = n.__importDefault(a(19)), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-date-range", t.$schema = "/schemas/DateRangeControlSchema.json", t.order = -440, t.icon = "fa fa-calendar", t.name = "????????????", t.description = "??????????????????????????????<code>minDate</code>???<code>maxDate</code>???????????????????????????", t.docLink = "/amis/zh-CN/components/form/date-range", t.tags = ["?????????"], t.scaffold = { type: "input-date-range", label: "????????????", name: "date-range" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBody = [i.getSchemaTpl("placeholder", { pipeIn: i.defaultValue("?????????????????????") }), { type: "input-text", name: "format", label: "?????????", description: '????????? <a href="https://momentjs.com/" target="_blank">moment</a> ?????????????????????', pipeIn: i.defaultValue("X"), onChange: function (e, t, a, n) { n.setValueByName("value", ""), n.setValueByName("minDate", ""), n.setValueByName("maxDate", "") } }, i.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"', placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????????????????????????????????????????" }, {
                    type: "fieldSet", title: "???????????????", visibleOn: 'typeof this.value !== "undefined"', collapsed: !0, collapsable: !0, className: "fieldset", body: [{
                        type: "input-date-range", name: "value", pipeIn: function (e) { return e ? e.split(",").map((function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") })) : "" }, pipeOut: function (e, t, a) {
                            var n = a.format;
                            if (n) {
                                var l = e.split(",");
                                e = l.map((function (e) { return s.default(parseInt(e, 10), "X").format(n) })).join(",")
                            } return e
                        }
                    }]
                }, i.getSchemaTpl("clearable", { pipeIn: i.defaultValue(!0) }), { type: "input-text", name: "minDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "minDate", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }, { type: "divider" }, { type: "input-text", name: "maxDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "maxDate", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }, { type: "input-text", name: "minDuration", label: "??????????????????", description: "?????? 2days" }, { type: "input-text", name: "ranges", label: "?????????????????????", description: "?????? today, yesterday, 1dayago, 7daysago, 90daysago, prevweek, thismonth, prevmonth, prevquarter, thisquarter" }, { type: "input-text", name: "maxDuration", label: "??????????????????", description: "?????? 1year" }, { name: "utc", label: "???????????? UTC ??????", type: "switch", mode: "inline", className: "block" }, { name: "embed", label: "??????????????????", type: "switch", mode: "inline", className: "block" }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(r.BasePlugin);
        t.DateRangeControlPlugin = d, o.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DateTimeControlPlugin = void 0;
        var n = a(0), l = a(5), i = a(3), o = a(1), r = a(2), s = n.__importDefault(a(19)), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-datetime", t.$schema = "/schemas/DateTimeControlSchema.json", t.icon = "fa fa-calendar", t.name = "????????????", t.description = "?????????????????????", t.docLink = "/amis/zh-CN/components/form/datetime", t.tags = ["?????????"], t.scaffold = { type: "input-datetime", label: "????????????", name: "datetime" }, t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBody = [i.getSchemaTpl("placeholder", { pipeIn: i.defaultValue("?????????????????????") }), { type: "input-text", name: "format", label: "?????????", description: '????????? <a href="https://momentjs.com/" target="_blank">moment</a> ?????????????????????', pipeIn: i.defaultValue("X"), onChange: function (e, t, a, n) { n.setValueByName("value", ""), n.setValueByName("minDate", ""), n.setValueByName("maxDate", "") } }, i.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"', placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", visibleOn: 'typeof this.value !== "undefined"', body: [{ type: "input-datetime", name: "value", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }, i.getSchemaTpl("clearable", { pipeIn: i.defaultValue(!0) }), { type: "input-text", name: "inputFormat", label: "????????????", description: '????????? <a href="https://momentjs.com/" target="_blank">moment</a> ?????????????????????', pipeIn: i.defaultValue("YYYY-MM-DD HH:mm") }, { type: "input-text", name: "minDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "minDate", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }, { type: "divider" }, { type: "input-text", name: "maxDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "maxDate", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(r.BasePlugin);
        t.DateTimeControlPlugin = d, o.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DateTimeRangeControlPlugin = void 0;
        var n = a(0), l = a(5), i = a(3), o = a(1), r = a(2), s = n.__importDefault(a(19)), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-datetime-range", t.$schema = "/schemas/DateTimeRangeControlSchema.json", t.order = -440, t.icon = "fa fa-calendar", t.name = "??????????????????", t.description = "????????????????????????????????????<code>minDate</code>???<code>maxDate</code>???????????????????????????", t.docLink = "/amis/zh-CN/components/form/input-datetime-range", t.tags = ["?????????"], t.scaffold = { type: "input-datetime-range", label: "??????????????????", name: "input-datetime-range" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "??????????????????", t.panelBody = [i.getSchemaTpl("placeholder", { pipeIn: i.defaultValue("???????????????????????????") }), { type: "input-text", name: "format", label: "?????????", description: '????????? <a href="https://momentjs.com/" target="_blank">moment</a> ?????????????????????', pipeIn: i.defaultValue("X"), onChange: function (e, t, a, n) { n.setValueByName("value", ""), n.setValueByName("minDate", ""), n.setValueByName("maxDate", "") } }, i.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"', placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????????????????????????????????????????" }, {
                    type: "fieldSet", title: "???????????????", visibleOn: 'typeof this.value !== "undefined"', collapsed: !0, collapsable: !0, className: "fieldset", body: [{
                        type: "input-datetime-range", name: "value", pipeIn: function (e) { return e ? e.split(",").map((function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") })) : "" }, pipeOut: function (e, t, a) {
                            var n = a.format;
                            if (n) {
                                var l = e.split(",");
                                e = l.map((function (e) { return s.default(parseInt(e, 10), "X").format(n) })).join(",")
                            } return e
                        }
                    }]
                }, i.getSchemaTpl("clearable", { pipeIn: i.defaultValue(!0) }), { type: "input-text", name: "minDate", label: "??????????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-datetime", name: "minDate", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }, { type: "divider" }, { type: "input-text", name: "maxDate", label: "??????????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-datetime", name: "maxDate", pipeIn: function (e) { return s.default(l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e).format("X") }, pipeOut: function (e, t, a) { return s.default(parseInt(e, 10), "X").format(a.format) } }] }, { type: "input-text", name: "minDuration", label: "??????????????????", description: "?????? 2days" }, { type: "input-text", name: "ranges", label: "?????????????????????", description: "?????? today, yesterday, 1dayago, 7daysago, 90daysago, prevweek, thismonth, prevmonth, prevquarter, thisquarter" }, { type: "input-text", name: "maxDuration", label: "??????????????????", description: "?????? 1year" }, { name: "utc", label: "???????????? UTC ??????", type: "switch", mode: "inline", className: "block" }, { name: "embed", label: "??????????????????", type: "switch", mode: "inline", className: "block" }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(r.BasePlugin);
        t.DateTimeRangeControlPlugin = d, o.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DiffEditorControlPlugin = void 0;
        var n = a(0), l = a(45), i = a(3), o = a(1), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "diff-editor", t.$schema = "/schemas/DiffEditorControlSchema.json", t.name = "Diff?????????", t.icon = "fa fa-columns", t.description = "?????????????????????????????????????????????????????????" + l.availableLanguages.slice(0, 10).join("???") + "??????", t.docLink = "/amis/zh-CN/components/form/diff-editor", t.tags = ["?????????"], t.scaffold = { type: "diff-editor", label: "diff?????????", name: "diff" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign(n.__assign({}, t.scaffold), { value: "Hello World\nLine 1\nNew line\nBla Bla", diffValue: "Hello World\nLine 2" })] }, t.panelTitle = "Diff?????????", t.panelBody = [{ type: "textarea", name: "diffValue", label: "?????????", pipeOut: i.valuePipeOut, description: "???????????? <code>\\${xxx}</code> ???????????????" }, i.getSchemaTpl("switchDefaultValue", { label: "?????????????????????" }), { type: "textarea", name: "value", label: "???????????????", pipeOut: i.valuePipeOut, visibleOn: 'typeof this.value !== "undefined"' }, { label: "??????", name: "language", type: "select", value: "javascript", searchable: !0, options: l.availableLanguages.concat() }, { name: "size", type: "button-group-select", size: "sm", pipeIn: i.defaultValue(""), className: "w-full", label: "????????????", options: [{ label: "??????", value: "" }, { label: "???", value: "md" }, { label: "???", value: "lg" }, { label: "??????", value: "xl" }, { label: "?????????", value: "xxl" }] }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.DiffEditorControlPlugin = r, o.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.EditorControlPlugin = void 0;
        var n = a(0), l = a(45), i = a(3), o = a(1), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "editor", t.$schema = "/schemas/EditorControlSchema.json", t.name = "???????????????", t.icon = "fa fa-code", t.description = "???????????????????????? monaco-editor ?????????" + l.availableLanguages.slice(0, 10).join("???") + "??????", t.docLink = "/amis/zh-CN/components/form/editor", t.tags = ["?????????"], t.scaffold = { type: "editor", label: "???????????????", name: "editor" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign(n.__assign({}, t.scaffold), { value: 'console.log("Hello world.");' })] }, t.panelTitle = "Editor", t.panelBody = [{ label: "??????", name: "language", type: "select", value: "javascript", searchable: !0, options: l.availableLanguages.concat() }, { name: "size", type: "button-group-select", size: "xs", pipeIn: i.defaultValue(""), label: "????????????", options: [{ label: "??????", value: "" }, { label: "???", value: "md" }, { label: "???", value: "lg" }, { label: "??????", value: "xl" }, { label: "?????????", value: "xxl" }] }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.EditorControlPlugin = r, o.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.EmailControlPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-email", t.$schema = "/schemas/TextControlSchema.json", t.name = "?????????", t.icon = "fa fa-envelope-o", t.description = "???????????????????????????????????????", t.scaffold = { type: "input-email", label: "??????", name: "email" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: n.__assign({}, t.scaffold) }, t.panelTitle = t.name, t
            } return n.__extends(t, e), t
        }(a(23).TextControlPlugin);
        t.EmailControlPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.FieldSetControlPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(3), r = a(1), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "fieldset", t.$schema = "/schemas/FieldSetControlSchema.json", t.name = "?????????", t.icon = "fa fa-toggle-down", t.description = "????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/fieldset", t.tags = ["?????????"], t.scaffold = { type: "fieldset", title: "??????", collapsable: !0, body: [{ type: "input-text", label: "??????1", name: "text" }, { type: "input-text", label: "??????2", name: "text" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.regions = [{ key: "body", label: "????????????", renderMethod: "renderBody", insertPosition: "inner", preferTag: "?????????" }], t.panelTitle = "?????????", t.panelBodyCreator = function (e) { return [{ label: "??????", name: "title", type: "input-text" }, { name: "collapsable", label: "???????????????", type: "switch", mode: "inline", className: "w-full", pipeIn: o.defaultValue(!1) }, { name: "collapsed", label: "??????????????????", type: "switch", mode: "inline", visibleOn: "this.collapsable", className: "w-full" }, { name: "className", type: "button-group-select", clearable: !0, size: "sm", label: "????????????", className: "w-full", pipeIn: o.defaultValue(""), options: [{ label: "??????", value: "" }, { value: "Collapse--xs", label: "??????" }, { value: "Collapse--sm", label: "???" }, { value: "Collapse--base", label: "??????" }, { value: "Collapse--md", label: "???" }, { value: "Collapse--lg", label: "??????" }] }, o.getSchemaTpl("className", { name: "headingClassName", label: "?????? CSS ??????" }), o.getSchemaTpl("className", { name: "bodyClassName", label: "???????????? CSS ??????" }), { children: i.default.createElement(l.Button, { level: "info", size: "sm", className: "m-b-sm", block: !0, onClick: function () { t.manager.showInsertPanel("body", e.id) } }, "??????????????????") }, o.getSchemaTpl("subFormItemMode"), o.getSchemaTpl("subFormHorizontalMode"), o.getSchemaTpl("subFormHorizontal")] }, t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.filterProps = function (e) { return e.collapsed = !1, e }, t
        }(a(2).BasePlugin);
        t.FieldSetControlPlugin = s, r.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.FileControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-file", t.$schema = "/schemas/FileControlSchema.json", t.name = "????????????", t.icon = "fa fa-upload", t.description = "??????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/file", t.tags = ["?????????"], t.scaffold = { type: "input-file", label: "????????????", name: "file" }, t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "?????????", t.panelBody = [l.getSchemaTpl("fieldSet", { title: "??????", body: [{ type: "input-text", name: "btnLabel", label: "??????????????????", value: "???????????????" }, l.getSchemaTpl("api", { label: "???????????????", name: "receiver", description: "??????????????????????????? bos????????????????????????????????????????????? bos ?????????", value: "/api/upload/file", __isUpload: !0 }), l.getSchemaTpl("autoFill"), { type: "fieldSet", title: "??????????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "button-group-select", name: "useChunk", label: "????????????", size: "xs", pipeOut: l.valuePipeOut, value: "auto", options: [{ label: "??????", value: "auto" }, { label: "??????", value: !0 }, { label: "??????", value: !1 }] }, { name: "chunkSize", type: "input-number", label: "????????????", visibleOn: "data.useChunk != false", value: 5242880 }, l.getSchemaTpl("api", { name: "startChunkApi", label: "startChunkApi", value: "/api/upload/startChunk" }), l.getSchemaTpl("api", { name: "chunkApi", label: "chunkApi", value: "/api/upload/chunk" }), l.getSchemaTpl("api", { name: "finishChunkApi", label: "finishChunkApi", value: "/api/upload/finishChunk" })] }, { type: "input-text", name: "accept", label: "????????????", value: "", description: "?????????????????? <code>mime-types</code>????????? <code>input[type=file]</code> ??? <code>accept</code> ??????" }, l.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, l.getSchemaTpl("multiple", { pipeIn: l.defaultValue(!1) }), l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter"), l.getSchemaTpl("extractValue")] }), l.getSchemaTpl("fieldSet", { title: "??????", collapsed: !0, body: [l.getSchemaTpl("className", { name: "btnClassName", label: "?????? CSS ??????", pipeIn: l.defaultValue("btn-sm btn-info") }), l.getSchemaTpl("className", { name: "btnUploadClassName", label: "???????????? CSS ??????", pipeIn: l.defaultValue("btn-sm btn-success") })] }), l.getSchemaTpl("fieldSet", { title: "??????", collapsed: !0, body: [{ name: "maxSize", type: "input-number", label: "??????????????????", description: "??????????????????????????????????????????" }, { name: "maxLength", type: "input-number", label: "??????????????????", description: "???????????????????????????", visibleOn: "data.multiple != false" }, { name: "fileField", type: "input-text", label: "???????????????", value: "file" }, { name: "asBase64", type: "switch", mode: "inline", className: "block", label: "?????? Base64 ??????", hiddenOn: "data.asBlob", description: "???????????????????????????????????? Form ????????????????????????????????????????????? Form ????????????????????? base64 ??????????????????" }, { name: "asBlob", type: "switch", mode: "inline", className: "block", label: "?????????????????????", hiddenOn: "data.asBase64", description: "File ???????????????????????????????????????????????????????????????????????? Base64 ??????????????????" }, { name: "autoUpload", type: "switch", mode: "inline", className: "block", label: "??????????????????", value: !0 }, { name: "hideUploadButton", type: "switch", mode: "inline", className: "block", label: "????????????????????????", value: !1 }] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.FileControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.FormPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = a(9), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "form", t.$schema = "/schemas/FormSchema.json", t.order = -999, t.name = "?????????API???", t.description = "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/page", t.tags = ["??????"], t.icon = "fa fa-list-alt", t.scaffold = { type: "form", title: "??????", body: [{ label: "?????????", type: "input-text", name: "text" }] }, t.previewSchema = { type: "form", panelClassName: "Panel--default text-left m-b-none", mode: "horizontal", body: [{ label: "??????", name: "a", type: "input-text" }] }, t.regions = [{ key: "body", label: "????????????", matchRegion: function (e) { return !!(null == e ? void 0 : e.props.noValidate) }, renderMethod: "renderBody", preferTag: "?????????" }, { label: "?????????", key: "actions", preferTag: "??????" }], t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var t = /\/crud\/filter\/form$/.test(e.path), a = /(?:\/|^)dialog\/.+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "title", type: "input-text", label: "??????", visibleOn: "this.wrapWithPanel !== false" }, { name: "submitText", type: "input-text", label: "??????????????????", pipeIn: o.defaultValue("??????"), visibleOn: "this.wrapWithPanel !== false && !this.actions && (!Array.isArray(this.body) || !this.body.some(function(item) {return !!~['submit','button','reset','button-group'].indexOf(item.type);}))", description: "????????????????????????????????????" }, { name: "autoFocus", type: "switch", label: "????????????", mode: "inline", className: "block", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "??????????????????????????????????????????????????????????????????", placement: "left" } }, o.getSchemaTpl("submitOnChange"), { label: "????????????????????????", type: "switch", name: "resetAfterSubmit", mode: "inline", className: "block", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "??????????????????????????????????????????????????????????????????", placement: "left" } }, t ? null : { label: "????????????????????????", type: "switch", name: "submitOnInit", mode: "inline", className: "block", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "?????????????????????????????????????????????????????????", placement: "left" } }, a ? { label: "??????????????????????????????", type: "switch", name: "closeDialogOnSubmit", mode: "inline", className: "block", pipeIn: function (e) { return !1 !== e } } : null, t ? null : { label: "?????????????????????", name: "target", type: "input-text", description: "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? <code>name</code> ????????????????????????????????????????????? <code>target</code> ??? <code>window</code> ?????????????????????????????????????????????" }, o.getSchemaTpl("reload", { test: !t }), t ? null : { label: "??????", name: "redirect", type: "input-text", description: "???????????????????????????????????????????????????????????????" }, { name: "canAccessSuperData", label: "????????????????????????????????????", type: "switch", pipeIn: o.defaultValue(!0), mode: "inline", className: "block" }, { name: "persistData", label: "????????????????????????", type: "switch", pipeIn: o.defaultValue(!1), mode: "inline", className: "block", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" } }, { name: "clearPersistDataAfterSubmit", label: "?????????????????????????????????", type: "switch", pipeIn: o.defaultValue(!1), mode: "inline", className: "block", visibleOn: "data.persistData", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" } }, { name: "rules", label: "??????????????????", type: "combo", multiple: !0, multiLine: !0, items: [{ name: "rule", label: "????????????", type: "input-text" }, { name: "message", label: "????????????", type: "input-text" }] }] }, t ? null : {
                        title: "??????", body: [o.getSchemaTpl("api", { label: "????????????", description: "????????????????????????", sampleBuilder: function (e) { return '{\n    "status": 0,\n    "msg": "",\n\n    // ????????????????????????????????????????????? merge ?????????\n    data: {}\n  }' } }), { label: "???????????????????", remark: { trigger: "click", rootClose: !0, title: "????????????????????????", content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, type: "switch", name: "asyncApi", visibleOn: "data.api", pipeIn: function (e) { return null != e }, pipeOut: function (e) { return e ? "" : void 0 }, mode: "inline", className: "block" }, o.getSchemaTpl("api", { name: "asyncApi", label: "??????????????????", visibleOn: "data.asyncApi != null", description: "????????????????????????????????????????????????????????????????????????????????????????????????????????? finished ????????? true ??? ??????" }), { type: "divider" }, o.getSchemaTpl("api", {
                            name: "initApi", label: "???????????????", description: "???????????????????????????", sampleBuilder: function (e) {
                                var t = {};
                                return Array.isArray(e.body) && e.body.forEach((function (e) { e.name && !~["combo", "input-array", "form"].indexOf(e.type) && r.setVariable(t, e.name, "sample") })), JSON.stringify({ status: 0, msg: "", data: t }, null, 2)
                            }
                        }), { label: "??????????????????", type: "switch", name: "interval", visibleOn: "data.initApi", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? 3e3 : void 0 }, mode: "inline" }, { name: "interval", type: "input-number", visibleOn: "data.interval", step: 500, className: "m-t-n-sm", description: "??????????????????????????????????????? ms" }, { name: "silentPolling", label: "????????????", type: "switch", mode: "inline", visibleOn: "!!data.interval", description: "???????????????????????????????????????loading" }, { name: "stopAutoRefreshWhen", label: "?????????????????????????????????", type: "input-text", visibleOn: "!!data.interval", description: "???????????????????????????????????????????????????????????????????????????????????????????????????" }, { label: "?????????????????????", remark: { trigger: "click", rootClose: !0, title: "????????????????????????", content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, type: "switch", name: "initAsyncApi", visibleOn: "data.initApi", pipeIn: function (e) { return null != e }, pipeOut: function (e) { return e ? "" : void 0 }, mode: "inline" }, o.getSchemaTpl("api", { name: "initAsyncApi", label: "??????????????????", visibleOn: "data.initAsyncApi != null", description: "????????????????????????????????? initApi ?????????????????????????????????????????????????????? finished ????????? true ??? ??????" }), { type: "divider" }, t ? { name: "messages", pipeIn: o.defaultValue({ fetchFailed: "???????????????" }), label: "??????????????????", type: "combo", multiLine: !0, description: "????????????????????????????????? msg ????????????????????????", items: [{ label: "??????????????????", name: "fetchSuccess", type: "input-text" }, { label: "??????????????????", name: "fetchFailed", type: "input-text" }] } : { name: "messages", pipeIn: o.defaultValue({ fetchFailed: "???????????????", saveSuccess: "????????????", saveFailed: "????????????" }), label: "??????????????????", type: "combo", multiLine: !0, description: "????????????????????????????????? msg ????????????????????????", items: [{ label: "??????????????????", name: "fetchSuccess", type: "input-text" }, { label: "??????????????????", name: "fetchFailed", type: "input-text" }, { label: "??????????????????", name: "saveSuccess", type: "input-text" }, { label: "??????????????????", name: "saveFailed", type: "input-text" }, { label: "??????????????????", name: "validateFailed", type: "input-text" }] }]
                    }, { title: "??????", body: [{ name: "wrapWithPanel", type: "switch", mode: "inline", className: "block", label: "??? Panel ??????", pipeIn: o.defaultValue(!0), labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "??????????????????????????????????????????????????????????????????????????????", placement: "left" } }, { name: "mode", label: "????????????", type: "button-group-select", size: "sm", pipeIn: o.defaultValue("normal", !1), options: [{ label: "??????", value: "normal" }, { label: "????????????", value: "horizontal" }, { label: "??????", value: "inline" }] }, o.getSchemaTpl("horizontal", { visibleOn: 'this.mode == "horizontal"' }), o.getSchemaTpl("className"), o.getSchemaTpl("className", { name: "panelClassName", visibleOn: "this.wrapWithPanel !== false", label: "Panel ??? CSS ??????", description: "???????????? Panel--info ?????????" })] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("name", { test: !t }), { name: "debug", label: "????????????", type: "switch", mode: "inline", labelRemark: "??????????????????????????????????????????" }, o.getSchemaTpl("disabled"), o.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t.prototype.afterUpdate = function (e) {
                var t, a = e.context;
                ("form" === a.info.renderer.name || a.node.childRegions.some((function (e) { return "body" === e.region })) && (null === (t = a.diff) || void 0 === t ? void 0 : t.some((function (e) {
                    var t;
                    return "wrapWithPanel" === (null === (t = e.path) || void 0 === t ? void 0 : t.join("."))
                })))) && this.manager.buildPanels()
            }, t
        }(i.BasePlugin);
        t.FormPlugin = s, l.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.FormulaControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "formula", t.$schema = "/schemas/FormulaControlSchema.json", t.name = "??????", t.icon = "fa fa-calculator", t.description = "?????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/formula", t.tags = ["?????????", "??????"], t.scaffold = { type: "formula", name: "formula" }, t.previewSchema = { type: "tpl", tpl: "????????????" }, t.panelTitle = "??????", t.panelBody = [{ label: "?????????", name: "name", type: "input-text", description: "???????????????????????????????????????????????????????????????" }, { type: "input-text", name: "value", label: "?????????" }, { type: "input-text", name: "formula", label: "??????", description: "?????? JS ?????????????????? <code>data.var_a + 2</code>?????????????????? <code>var_a</code> ?????????????????????????????????????????????????????? <code>var_a + 2</code> ???????????????????????????????????????????????????" }, { type: "input-text", name: "condition", label: "????????????", description: '????????????<code>\\${xxx}</code>??????<code>data.xxx == "a"</code> ????????????????????????????????????????????????????????????????????????????????????????????????????????????' }, { name: "initSet", type: "switch", label: "??????????????????", pipeIn: l.defaultValue(!0), description: "???????????????????????????????????????????????????????????????????????????", mode: "inline", className: "block" }, { name: "autoSet", type: "switch", label: "??????????????????", pipeIn: l.defaultValue(!0), mode: "inline", className: "block", description: "??????????????????????????????????????????????????????????????????????????????<br />?????????????????????????????????????????????" }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.renderRenderer = function (e) { return this.renderPlaceholder("????????????????????????", e.key) }, t
        }(a(2).BasePlugin);
        t.FormulaControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.GroupControlPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(6), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "group", t.$schema = "/schemas/GroupControlSchema.json", t.name = "?????????", t.icon = "fa fa-id-card-o", t.description = "???????????????????????????", t.docLink = "/amis/zh-CN/components/form/group", t.tags = ["?????????"], t.scaffold = { type: "group", body: [{ type: "input-text", label: "??????", name: "var1" }, { type: "input-text", label: "??????", name: "var2" }], label: !1 }, t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: [n.__assign(n.__assign({}, t.scaffold), { mode: "normal" })] }, t.regions = [{ key: "body", label: "?????????", renderMethod: "renderInput", preferTag: "?????????", wrapperResolve: function (e) { return e } }], t.panelTitle = "?????????", t.panelBody = [s.getSchemaTpl("tabs", [{ title: "??????", body: [s.getSchemaTpl("label"), s.getSchemaTpl("description", { visible: "this.label" }), { children: i.default.createElement(l.Button, { className: "m-b", onClick: function () { return t.manager.showInsertPanel("body") }, level: "danger", tooltip: "????????????????????????", size: "sm", block: !0 }, "????????????") }, s.getSchemaTpl("remark"), s.getSchemaTpl("labelRemark")] }, { title: "??????", body: [s.getSchemaTpl("formItemMode"), s.getSchemaTpl("horizontalMode"), s.getSchemaTpl("horizontal", { visibleOn: '(data.$$formMode == "horizontal" || data.mode == "horizontal") && data.label !== false && data.horizontal', pipeIn: function (e, t) { return { leftRate: (e = e || t.formHorizontal && d.makeHorizontalDeeper(t.formHorizontal, t.body.length)) && "number" == typeof e.left ? e.left : e && /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(e.left) ? parseInt(RegExp.$1, 10) : 2, leftFixed: e && e.leftFixed || "" } } }), s.getSchemaTpl("subFormItemMode"), s.getSchemaTpl("subFormHorizontalMode"), s.getSchemaTpl("subFormHorizontal"), { name: "body", type: "combo", label: "???????????????", multiple: !0, removable: !1, addable: !1, multiLine: !0, visibleOn: 'data.$$formMode != "inline"', items: [{ type: "button-group-select", name: "columnRatio", label: "????????????", tiled: !0, pipeIn: function (e, t) { return "number" == typeof e || t.columnClassName && /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(t.columnClassName) ? "custom" : e || "" }, pipeOut: function (e) { return "custom" === e ? 2 : e }, options: [{ value: "", label: "????????????" }, { value: "auto", label: "????????????" }, { value: "custom", label: "?????????" }] }, { label: "????????????", type: "input-range", name: "columnRatio", visibleOn: 'typeof this.columnRatio === "number" || this.columnClassName && /\\bcol\\-(?:xs|sm|md|lg)\\-(\\d+)\\b/.test(this.columnClassName)', pipeIn: function (e, t) { return "number" == typeof e ? e : t.columnClassName && /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(t.columnClassName) && parseInt(RegExp.$1, 10) || 2 }, min: 1, max: 12, step: 1 }] }, { type: "button-group-select", name: "gap", label: "????????????", pipeIn: s.defaultValue(""), size: "sm", tiled: !0, clearable: !0, options: [{ value: "xs", label: "??????" }, { value: "sm", label: "???" }, { value: "md", label: "???" }, { value: "lg", label: "???" }] }, s.getSchemaTpl("className"), { name: "body", type: "combo", label: "??? CSS ????????????", multiple: !0, removable: !1, addable: !1, items: [{ type: "input-text", name: "columnClassName" }] }] }, { title: "??????", body: [s.getSchemaTpl("ref"), s.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a = this, n = e.id, l = e.schema, i = (e.region, e.selections), o = e.info;
                i.length || o.plugin !== this || !Array.isArray(l.body) || l.body.length < 2 || t.push({
                    label: "????????????", onSelect: function () {
                        var e = a.manager.store, t = e.schema;
                        t = d.JSONUpdate(t, n, d.JSONPipeIn(l.body), !0), e.traceableSetSchema(t)
                    }
                })
            }, t
        }(r.BasePlugin);
        t.GroupControlPlugin = u, o.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.HiddenControlPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "hidden", t.$schema = "/schemas/HiddenControlSchema.json", t.name = "?????????", t.icon = "fa fa-eye-slash", t.description = "???????????????", t.docLink = "/amis/zh-CN/components/form/hidden", t.tags = ["?????????", "??????"], t.scaffold = { type: "hidden", name: "var1" }, t.previewSchema = { type: "tpl", tpl: "?????????" }, t.panelTitle = "?????????", t.panelBody = [{ type: "input-text", name: "value", label: "?????????" }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.renderRenderer = function (e) { return l.default.createElement("div", { key: e.key, className: "wrapper-sm b-a b-light m-b-sm" }, l.default.createElement("span", { className: "text-muted" }, "??????????????????????????????")) }, t
        }(a(2).BasePlugin);
        t.HiddenControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ImageControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-image", t.$schema = "/schemas/ImageControlSchema.json", t.name = "????????????", t.description = "?????????????????????????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/image", t.tags = ["?????????"], t.icon = "fa fa-crop", t.scaffold = { type: "input-image", label: "????????????", name: "image", imageClassName: "r w-full" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, l.getSchemaTpl("multiple", { value: !1, visibleOn: "!data.crop", description: "??????????????????????????????????????????" }), l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter"), l.getSchemaTpl("extractValue"), { name: "maxSize", type: "input-number", label: "??????????????????", description: "??????????????????????????????????????????" }, { name: "maxLength", type: "input-number", label: "??????????????????", visibleOn: "data.multiple", description: "???????????????????????????" }, l.getSchemaTpl("api", { label: "??????????????????", name: "receiver", description: "????????????????????????????????????????????? hiphoto", value: "/api/upload", __isUpload: !0 }), l.getSchemaTpl("autoFill"), { type: "input-text", value: ".jpeg, .jpg, .png, .gif", name: "accept", label: "????????????", description: "??????????????????????????? <code>MimeType</code>??????????????????<code>,</code>??????" }, { type: "input-text", name: "defaultImage", label: "??????????????????" }, { type: "switch", name: "fixedSize", value: !1, label: "????????????????????????", mode: "inline", className: "w-full" }, { type: "switch", name: "hideUploadButton", value: !1, label: "??????????????????", mode: "inline", className: "w-full" }, { type: "switch", name: "autoUpload", value: !1, label: "????????????", mode: "inline", className: "w-full" }, { name: "compress", type: "switch", label: "????????????", value: !0, mode: "inline", className: "w-full", description: "??? hiphoto ?????????????????????????????????" }, { type: "combo", name: "compressOptions", multiLine: !0, label: "????????????", visibleOn: "data.compress", items: [{ type: "input-number", label: "????????????", name: "maxWidth" }, { type: "input-number", label: "????????????", name: "maxHeight" }] }, { name: "showCompressOptions", type: "switch", label: "????????????????????????", mode: "inline", className: "w-full" }, { name: "crop", type: "switch", label: "??????????????????", mode: "inline", visibleOn: "!data.multiple", className: "w-full", description: "??????????????????????????????????????????", pipeIn: function (e) { return !!e } }, { name: "crop.aspectRatio", type: "input-text", label: "????????????", visibleOn: "data.crop", pipeOut: l.valuePipeOut }, { name: "crop.rotatable", type: "switch", label: "????????????????????????", visibleOn: "data.crop", pipeOut: l.valuePipeOut }, { name: "crop.scalable", type: "switch", label: "?????????????????????", visibleOn: "data.crop", pipeOut: l.valuePipeOut }, { name: "crop.viewMode", type: "select", label: "??????????????????", value: 1, options: [{ label: "?????????", value: 0 }, { label: "????????????", value: 1 }], visibleOn: "data.crop", pipeOut: l.valuePipeOut }, { type: "fieldSet", title: "????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-number", name: "limit.width", label: "????????????" }, { type: "input-number", name: "limit.height", label: "????????????" }, { type: "input-number", name: "limit.maxWidth", label: "??????????????????" }, { type: "input-number", name: "limit.maxHeight", label: "??????????????????" }, { type: "input-number", name: "limit.minWidth", label: "??????????????????" }, { type: "input-number", name: "limit.minHeight", label: "??????????????????" }, { type: "input-number", name: "limit.aspectRatio", label: "??????????????????" }, { type: "input-text", name: "limit.??????????????????", label: "???????????????", description: "????????????????????????????????????????????????????????????????????????" }] }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.ImageControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.InputGroupControlPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(5), o = a(3), r = a(1), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-group", t.$schema = "/schemas/InputGroupControlSchema.json", t.name = "????????????", t.icon = "fa fa-object-group", t.description = "????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/input-group", t.tags = ["?????????"], t.scaffold = { type: "input-group", name: "input-group", label: "input ??????", body: [{ type: "input-text", placeholder: "????????????ID/??????", inputClassName: "b-r-none p-r-none", name: "input-group" }, { type: "submit", label: "??????", level: "primary" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "Input ??????", t.panelBody = [[{ name: "body", type: "combo", multiple: !0, addable: !1, draggable: !0, draggableTip: "???????????????????????????????????????????????????????????????", editable: !1, visibleOn: "this.body && this.body.length", items: [{ type: "tpl", inline: !1, className: "p-t-xs", tpl: '<%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%>' }] }, { children: l.default.createElement(i.Button, { className: "m-b", onClick: function () { return t.manager.showInsertPanel("body") }, level: "danger", tooltip: "????????????????????????", size: "sm", block: !0 }, "????????????") }, o.getSchemaTpl("formItemName", { required: !0 })]], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.InputGroupControlPlugin = s, r.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ItemPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = n.__importDefault(a(12)), s = a(6), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.panelTitle = "?????????", t.panelBodyCreator = function (e) {
                    var t = ~["button", "submit", "reset"].indexOf(e.schema.type), a = ~["button-toobar", "container", "fieldSet", "group", "grid", "hbox", "input-group", "panel", "service", "tabs", "table", "elevator"].indexOf(e.schema.type), n = ~["switch", "wizard", "diff-editor", "editor", "input-rating", "input-text", "textarea"].indexOf(e.schema.type), l = e.info.renderer;
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: [t ? null : o.getSchemaTpl("formItemName", { required: !a }), !1 !== l.renderLabel ? o.getSchemaTpl("label") : null, n ? { type: "switch", name: "readOnly", label: "????????????", mode: "inline", className: "w-full" } : null, { type: "switch", name: "disabled", label: "??????", mode: "inline", className: "w-full" }, o.getSchemaTpl("required"), o.getSchemaTpl("description"), o.getSchemaTpl("placeholder"), o.getSchemaTpl("remark"), !1 !== l.renderLabel ? o.getSchemaTpl("labelRemark") : null] }, { title: "??????", body: [o.getSchemaTpl("formItemMode"), o.getSchemaTpl("horizontalMode"), o.getSchemaTpl("horizontal", { label: "", visibleOn: 'data.mode == "horizontal" && data.label !== false && data.horizontal' }), !1 !== l.sizeMutable ? o.getSchemaTpl("formItemSize") : null, o.getSchemaTpl("formItemInline"), o.getSchemaTpl("className"), o.getSchemaTpl("className", { label: "Label CSS ??????", name: "labelClassName" }), o.getSchemaTpl("className", { label: "?????? CSS ??????", name: "inputClassName" }), o.getSchemaTpl("className", { label: "?????? CSS ??????", name: "descriptionClassName", visibleOn: "this.description" })] }, { title: "??????", body: [o.getSchemaTpl("disabled"), o.getSchemaTpl("visible"), { type: "switch", name: "clearValueOnHidden", label: "???????????????????????????", mode: "inline", className: "w-full", disabledOn: 'typeof this.visible === "boolean"' }] }, { title: "??????", body: [o.getSchemaTpl("validations"), o.getSchemaTpl("validationErrors"), o.getSchemaTpl("validateOnChange"), o.getSchemaTpl("submitOnChange"), o.getSchemaTpl("api", { name: "validateApi", label: "????????????", description: "????????????????????????????????????" })] }])]
                }, t
            } return n.__extends(t, e), t.prototype.buildEditorPanel = function (e, t) {
                var a = e.info.renderer;
                e.selections.length || !e.info.hostId && (null == a ? void 0 : a.isFormItem) && t.push({ key: "form-item", icon: "fa fa-desktop", title: this.panelTitle, render: this.manager.makeSchemaFormRender({ body: this.panelBodyCreator(e) }), order: -200 })
            }, t.prototype.onDndAccept = function (e) {
                var t = e.context, a = this.manager.store;
                if ("schema" === t.sourceType) {
                    var n = a.getNodeById(t.sourceId);
                    "body" !== (null == n ? void 0 : n.parentRegion) || "body" === t.targetRegion || ~["button", "reset", "submit"].indexOf(t.data.type) || e.preventDefault()
                }
            }, t.prototype.afterUpdate = function (e) {
                var t, a, n = e.context;
                if (/\$/.test(n.info.renderer.name) && (null === (t = n.diff) || void 0 === t ? void 0 : t.some((function (e) {
                    var t;
                    return "value" === (null === (t = e.path) || void 0 === t ? void 0 : t.join("."))
                })))) {
                    var l = r.default(n.diff, (function (e) {
                        var t;
                        return "value" === (null === (t = e.path) || void 0 === t ? void 0 : t.join("."))
                    })), i = null === (a = this.manager.store.getNodeById(n.id)) || void 0 === a ? void 0 : a.getComponent();
                    null == i || i.props.onChange(null == l ? void 0 : l.rhs)
                }
            }, t.prototype.beforeReplace = function (e) {
                var t = e.context;
                t.info.renderer.isFormItem && t.data && t.subRenderer && !~t.subRenderer.tags.indexOf("?????????") && ~t.subRenderer.tags.indexOf("??????") && (t.data = n.__assign(n.__assign({}, t.data), { type: "static-" + t.data.type, label: t.data.label || t.schema.label, name: t.data.name || t.schema.name })), t.schema && (t.data.name = t.schema.name || t.data.name)
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a, l = this, i = (e.id, e.schema, e.region, e.selections);
                if (i.length && !(i.length > 3)) {
                    var o = i.concat(), r = o.shift(), d = r.node.parent;
                    (null === (a = r.info.renderer) || void 0 === a ? void 0 : a.isFormItem) && !o.some((function (e) { return e.node.parent !== d })) && t.unshift({
                        label: "????????????", onSelect: function () {
                            var e = l.manager.store, t = i.concat(), a = t.shift(), o = e.schema, r = [n.__assign({}, a.schema)];
                            delete r[0].$$id, t.forEach((function (e) { r.push(e.node.schema), o = s.JSONDelete(o, e.id) })), o = s.JSONUpdate(o, a.id, s.JSONPipeIn({ type: "group", body: r }), !0), e.traceableSetSchema(o)
                        }
                    }, "|")
                }
            }, t
        }(i.BasePlugin);
        t.ItemPlugin = d, l.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ListControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "list-select", t.$schema = "/schemas/ListControlSchema.json", t.order = -430, t.name = "????????????", t.icon = "fa fa-ellipsis-h", t.description = "???????????????????????????<code>source</code>?????????????????????????????????????????????????????????<code>HTML</code>??????", t.docLink = "/amis/zh-CN/components/form/list", t.tags = ["?????????"], t.scaffold = { type: "list-select", label: "??????", name: "list", options: [{ label: "??????A", value: "A" }, { label: "??????B", value: "B" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign(n.__assign({}, t.scaffold), { value: "A" })] }, t.panelTitle = "????????????", t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "list-select", name: "value", label: "?????????", description: "??????????????? Options ??? value ???", source: "${options}", visibleOn: 'typeof this.value !== "undefined"' }, l.getSchemaTpl("fieldSet", { title: "??????", body: [l.getSchemaTpl("multiple"), l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter"), l.getSchemaTpl("extractValue"), l.getSchemaTpl("options"), l.getSchemaTpl("source")] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.ListControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.LocationControlPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "location-picker", t.$schema = "/schemas/LocationControlSchema.json", t.name = "??????????????????", t.icon = "fa fa-location-arrow", t.description = "??????????????????", t.docLink = "/amis/zh-CN/components/form/location", t.tags = ["?????????", "??????"], t.scaffold = { type: "location-picker", name: "location" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "??????????????????", t.panelBody = [{ name: "clearable", label: "???????????????", type: "switch", mode: "inline", className: "block" }, { type: "input-text", name: "ak", label: "??????????????? AK", description: '??????<a href="http://lbsyun.baidu.com/" target="_blank">????????????????????????</a>??????' }, { type: "select", name: "coordinatesType", label: "????????????", value: "bd09", options: [{ label: "????????????", value: "bd09" }, { label: "???????????????", value: "gcj02" }] }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.LocationControlPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.UUIDControlPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "uuid", t.$schema = "/schemas/UUIDControlSchema.json", t.name = "UUID", t.icon = "fa fa-eye-slash", t.description = "??????????????? UUID", t.docLink = "/amis/zh-CN/components/form/uuid", t.tags = ["?????????", "??????"], t.scaffold = { type: "uuid", name: "uuid" }, t.previewSchema = { type: "form", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "UUID", t.panelBody = [{ type: "static", value: "????????? UUID v4 ???????????????????????????" }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.renderRenderer = function (e) { return l.default.createElement("div", { key: e.key, className: "wrapper-sm b-a b-light m-b-sm" }, l.default.createElement("span", { className: "text-muted" }, "UUID?????????????????????")) }, t
        }(a(2).BasePlugin);
        t.UUIDControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.MatrixControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "matrix-checkboxes", t.$schema = "/schemas/MatrixControlSchema.json", t.name = "????????????", t.icon = "fa fa-th-large", t.description = "???????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/matrrix", t.tags = ["?????????"], t.scaffold = { type: "matrix-checkboxes", name: "matrix", label: "????????????", rowLabel: "???????????????", columns: [{ label: "???1" }, { label: "???2" }], rows: [{ label: "???1" }, { label: "???2" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBody = [l.getSchemaTpl("api", { name: "source", label: "????????????????????????" }), l.getSchemaTpl("multiple", { value: !0 }), { type: "button-group-select", name: "singleSelectMode", label: "????????????", description: "???????????????????????????????????????", size: "xs", mode: "inline", className: "w-full", visibleOn: "!this.multiple", options: [{ label: "??????", value: "row" }, { label: "??????", value: "column" }, { label: "????????????", value: "cell" }], pipeIn: l.defaultValue("column") }, l.getSchemaTpl("fieldSet", { title: "????????????", body: [{ label: "?????????", name: "columns", type: "combo", multiple: !0, addButtonText: "????????????", scaffold: { label: "?????????" }, items: [{ type: "input-text", name: "label", placeholder: "?????????" }] }, { name: "rowLabel", label: "???????????????", type: "input-text" }, { label: "?????????", name: "rows", type: "combo", multiple: !0, scaffold: { label: "?????????" }, addButtonText: "????????????", items: [{ type: "input-text", name: "label", placeholder: "?????????" }] }] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.MatrixControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.MonthControlPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-month", t.$schema = "/schemas/MonthControlSchema.json", t.name = "Month", t.icon = "fa fa-calendar", t.description = "????????????", t.docLink = "/amis/zh-CN/components/form/month", t.tags = ["?????????"], t.scaffold = { type: "input-month", name: "month" }, t.previewSchema = { type: "form", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "Month", t
            } return n.__extends(t, e), t
        }(a(22).DateControlPlugin);
        t.MonthControlPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.MonthRangeControlPlugin = void 0;
        var n = a(0), l = a(5), i = a(3), o = a(1), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-month-range", t.$schema = "/schemas/MonthRangeControlSchema.json", t.order = -440, t.icon = "fa fa-calendar", t.name = "????????????", t.description = "??????????????????????????????<code>minDate</code>???<code>maxDate</code>???????????????????????????", t.docLink = "/amis/zh-CN/components/form/month-range", t.tags = ["?????????"], t.scaffold = { type: "input-month-range", label: "????????????", name: "month-range" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBody = [i.getSchemaTpl("placeholder", { pipeIn: i.defaultValue("?????????????????????") }), { type: "input-text", name: "format", label: "?????????", description: '????????? <a href="https://momentjs.com/" target="_blank">moment</a> ?????????????????????', pipeIn: i.defaultValue("X") }, i.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"', placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????????????????????????????????????????" }, { type: "fieldSet", title: "???????????????", visibleOn: 'typeof this.value !== "undefined"', collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-month-range", name: "value", pipeIn: function (e) { return e ? e.split(",").map((function (e) { return l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e })) : "" } }] }, i.getSchemaTpl("clearable", { pipeIn: i.defaultValue(!0) }), { type: "input-text", name: "minDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "minDate", pipeIn: function (e) { return l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e } }] }, { type: "divider" }, { type: "input-text", name: "maxDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "maxDate", pipeIn: function (e) { return l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e } }] }, { type: "input-text", name: "minDuration", label: "??????????????????", description: "?????? 2days" }, { type: "input-text", name: "maxDuration", label: "??????????????????", description: "?????? 1year" }, { name: "utc", label: "???????????? UTC ??????", type: "switch", mode: "inline", className: "block" }, { name: "clearable", label: "???????????????", type: "switch", mode: "inline", className: "block" }, { name: "embed", label: "??????????????????", type: "switch", mode: "inline", className: "block" }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.MonthRangeControlPlugin = r, o.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.NestedSelectControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "nested-select", t.$schema = "/schemas/NestedSelectControlSchema.json", t.name = "???????????????", t.icon = "fa fa-indent", t.description = "??????????????????????????????????????????<code>source</code>???????????????????????????", t.docLink = "/amis/zh-CN/components/form/nested-select", t.tags = ["?????????"], t.scaffold = { type: "nested-select", label: "???????????????", name: "nestedSelect", options: [{ label: "??????A", value: "A" }, { label: "??????B", value: "B", children: [{ label: "??????C", value: "C" }, { label: "??????D", value: "D" }] }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelDefinitions = { options: { label: "?????? Options", name: "options", type: "combo", multiple: !0, multiLine: !0, draggable: !0, addButtonText: "????????????", scaffold: { label: "", value: "" }, items: [{ type: "group", body: [{ type: "input-text", name: "label", placeholder: "??????", required: !0 }, { type: "input-text", name: "value", placeholder: "???", unique: !0 }] }, { $ref: "options", label: "?????????", name: "children", addButtonText: "???????????????" }] } }, t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, { type: "switch", name: "searchable", label: "????????????" }, { type: "switch", name: "withChildren", label: "???????????????????????????????????????" }, l.getSchemaTpl("fieldSet", { title: "??????", body: [{ $ref: "options", name: "options" }, l.getSchemaTpl("api", { name: "source", label: "??????????????????" }), l.getSchemaTpl("multiple"), l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter"), l.getSchemaTpl("extractValue"), l.getSchemaTpl("autoFill")] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.NestedSelectControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.NumberControlPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-number", t.$schema = "/schemas/NumberControlSchema.json", t.order = -410, t.name = "?????????", t.icon = "fa fa-sort-numeric-asc", t.description = "?????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/number", t.tags = ["?????????"], t.scaffold = { type: "input-number", label: "??????", name: "number-text" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign(n.__assign({}, t.scaffold), { value: 88 })] }, t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("switchDefaultValue"), { type: "input-number", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, { type: "input-text", name: "min", label: "?????????", description: "???????????????????????? <code>\\${xxx}</code> ??????????????????????????????????????????" }, { type: "input-text", name: "max", label: "?????????", description: "???????????????????????? <code>\\${xxx}</code> ??????????????????????????????????????????" }, { type: "input-number", name: "step", label: "??????" }, { type: "input-number", name: "precision", label: "???????????????", min: 0, max: 100 }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(i.BasePlugin);
        t.NumberControlPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.PasswordControlPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-password", t.$schema = "/schemas/TextControlSchema.json", t.name = "?????????", t.icon = "fa fa-asterisk", t.description = "???????????????????????????????????????", t.scaffold = { type: "input-password", label: "??????", name: "password" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: n.__assign({}, t.scaffold) }, t.panelTitle = t.name, t
            } return n.__extends(t, e), t
        }(a(23).TextControlPlugin);
        t.PasswordControlPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.InputQuarterPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-quarter", t.$schema = "/schemas/QuarterControlSchema.json", t.name = "Quarter", t.icon = "fa fa-calendar", t.description = "????????????", t.docLink = "/amis/zh-CN/components/form/month", t.tags = ["?????????"], t.scaffold = { type: "input-quarter", name: "month" }, t.previewSchema = { type: "form", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "Quarter", t
            } return n.__extends(t, e), t
        }(a(22).DateControlPlugin);
        t.InputQuarterPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.QuarterRangePlugin = void 0;
        var n = a(0), l = a(5), i = a(3), o = a(1), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-quarter-range", t.$schema = "/schemas/MonthRangeControlSchema.json", t.order = -440, t.icon = "fa fa-calendar", t.name = "????????????", t.description = "??????????????????????????????<code>minDate</code>???<code>maxDate</code>???????????????????????????", t.docLink = "/amis/zh-CN/components/form/quarter-range", t.tags = ["?????????"], t.scaffold = { type: "input-quarter-range", label: "????????????", name: "quarter-range" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBody = [i.getSchemaTpl("placeholder", { pipeIn: i.defaultValue("?????????????????????") }), { type: "input-text", name: "format", label: "?????????", description: '????????? <a href="https://momentjs.com/" target="_blank">moment</a> ?????????????????????', pipeIn: i.defaultValue("X") }, i.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"', placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????????????????????????????????????????" }, { type: "fieldSet", title: "???????????????", visibleOn: 'typeof this.value !== "undefined"', collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-quarter-range", name: "value", pipeIn: function (e) { return e ? e.split(",").map((function (e) { return l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e })) : "" } }] }, i.getSchemaTpl("clearable", { pipeIn: i.defaultValue(!0) }), { type: "input-text", name: "minDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "minDate", pipeIn: function (e) { return l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e } }] }, { type: "divider" }, { type: "input-text", name: "maxDate", label: "????????????", placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????????????????????????????<code>\\${start_date}</code>" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", body: [{ type: "input-date", name: "maxDate", pipeIn: function (e) { return l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e } }] }, { type: "input-text", name: "minDuration", label: "??????????????????", description: "?????? 2days" }, { type: "input-text", name: "maxDuration", label: "??????????????????", description: "?????? 1year" }, { name: "utc", label: "???????????? UTC ??????", type: "switch", mode: "inline", className: "block" }, { name: "clearable", label: "???????????????", type: "switch", mode: "inline", className: "block" }, { name: "embed", label: "??????????????????", type: "switch", mode: "inline", className: "block" }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.QuarterRangePlugin = r, o.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.PickerControlPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(5), o = a(3), r = a(1), s = a(2), d = a(6), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "picker", t.$schema = "/schemas/PickerControlSchema.json", t.name = "????????????", t.icon = "fa fa-window-restore", t.description = "??????<code>pickerSchema</code>????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/picker", t.tags = ["?????????"], t.scaffold = { type: "picker", label: "????????????", name: "picker", options: [{ label: "??????A", value: "A" }, { label: "??????B", value: "B" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBodyCreator = function (e) { return [{ type: "switch", name: "embed", mode: "inline", className: "w-full", label: "??????????????????" }, o.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, o.getSchemaTpl("fieldSet", { title: "??????", body: [o.getSchemaTpl("options"), o.getSchemaTpl("api", { name: "source", label: "??????????????????" }), { children: l.default.createElement(i.Button, { size: "sm", level: "danger", className: "m-b", onClick: t.editDetail.bind(t, e.id), block: !0 }, "??????????????????") }, { label: "labelTpl", type: "textarea", name: "labelTpl", labelRemark: "??????????????????????????????", description: '???????????? <code>\\${xxx}</code> ??????????????????????????? lodash.template ???????????????????????????<a target="_blank" href="/amis/zh-CN/docs/concepts/template">??????</a>' }, { type: "button-group-select", name: "modalMode", label: "????????????", value: "dialog", size: "xs", options: [{ label: "??????", value: "dialog" }, { label: "???????????????", value: "drawer" }] }, o.getSchemaTpl("multiple"), o.getSchemaTpl("joinValues"), o.getSchemaTpl("delimiter"), o.getSchemaTpl("extractValue"), o.getSchemaTpl("autoFill")] })] }, t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.buildEditorToolbar = function (e, t) {
                var a = e.id;
                e.info.renderer.name === this.rendererName && t.push({ icon: "fa fa-expand", order: 100, tooltip: "??????????????????", onClick: this.editDetail.bind(this, a) })
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a = e.id;
                e.schema, e.region;
                e.info.renderer.name === this.rendererName && t.push("|", { label: "??????????????????", onSelect: this.editDetail.bind(this, a) })
            }, t.prototype.editDetail = function (e) {
                var t = this.manager, a = t.store, l = a.getNodeById(e), i = a.getValueOf(e);
                if (l && i) {
                    var o = l.getComponent(), r = n.__assign(n.__assign({ type: "crud", mode: "list" }, i.pickerSchema || { listItem: { title: "${label}" } }), { api: i.source, pickerMode: !0, multiple: i.multiple });
                    this.manager.openSubEditor({ title: "??????????????????", value: r, data: { options: o.props.options }, onChange: function (e) { delete (e = n.__assign(n.__assign({}, i), { pickerSchema: n.__assign({}, e), source: e.api })).pickerSchema.api, delete e.pickerSchema.type, delete e.pickerSchema.pickerMode, delete e.pickerSchema.multiple, t.panelChangeValue(e, d.diff(i, e)) } })
                }
            }, t
        }(s.BasePlugin);
        t.PickerControlPlugin = u, r.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.RadiosControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "radios", t.$schema = "/schemas/RadiosControlSchema.json", t.order = -460, t.name = "?????????", t.icon = "fa fa-dot-circle-o", t.description = "??????<code>options</code>????????????????????????<code>source</code>????????????", t.docLink = "/amis/zh-CN/components/form/radios", t.tags = ["?????????"], t.scaffold = { type: "radios", label: "?????????", name: "radios", options: [{ label: "??????A", value: "A" }, { label: "??????B", value: "B" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign(n.__assign({}, t.scaffold), { value: "A" })] }, t.panelTitle = "?????????", t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "radios", name: "value", label: "?????????", source: "${options}", visibleOn: 'typeof this.value !== "undefined"', multiple: !0 }, l.getSchemaTpl("fieldSet", { title: "??????", body: [l.getSchemaTpl("options"), l.getSchemaTpl("source"), l.getSchemaTpl("joinValues", { visibleOn: !0 }), l.getSchemaTpl("extractValue"), l.getSchemaTpl("autoFill")] }), l.getSchemaTpl("fieldSet", { title: "??????", body: [{ label: "?????????????????????", name: "inline", type: "switch", visibleOn: 'data.mode != "inline"', mode: "inline", className: "w-full", pipeIn: l.defaultValue(!0) }, { label: "?????????????????????", name: "columnsCount", hiddenOn: 'typeof data.inline === "undefined" || data.inline === true', type: "input-range", min: 1, max: 6, pipeIn: l.defaultValue(1) }, l.getSchemaTpl("className", { label: "?????? Radio ??? CSS ??????", name: "itemClassName" })] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.RadiosControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.RangeControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-range", t.$schema = "/schemas/RangeControlSchema.json", t.name = "??????", t.icon = "fa fa-sliders", t.description = "?????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/range", t.tags = ["?????????"], t.scaffold = { type: "input-range", label: "??????", name: "range" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "??????", t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "input-number", name: "value", label: "?????????", validations: "isNumeric", visibleOn: 'typeof data.value !== "undefined" && !data.multiple', pipeIn: function (e) { return "number" == typeof e ? e : 0 }, pipeOut: function (e, t, a) { return e < a.min && a.min || e > a.max && a.max || e } }, { type: "combo", name: "value", visibleOn: 'typeof data.value !== "undefined" && this.multiple', items: [{ type: "input-number", validations: "isNumeric", name: "min", label: "??????" }, { type: "input-number", validations: "isNumeric", name: "max", label: "??????" }] }, { label: "?????????", name: "min", type: "input-number", value: 0 }, { label: "?????????", name: "max", type: "input-number", value: 100 }, { label: "??????", name: "step", type: "input-number", value: 1 }, { type: "input-text", name: "unit", label: "??????", value: "" }, { type: "switch", name: "showInput", mode: "inline", label: "?????????????????????", value: !1 }, l.getSchemaTpl("clearable"), l.getSchemaTpl("multiple", { pipeIn: l.defaultValue(!1) }), l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter")], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.RangeControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.RangeControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-rating", t.$schema = "/schemas/RatingControlSchema.json", t.name = "??????", t.icon = "fa fa-star-o", t.description = "???????????????????????????", t.docLink = "/amis/zh-CN/components/form/range", t.tags = ["?????????"], t.scaffold = { type: "input-rating", label: "??????", name: "rating" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign(n.__assign({}, t.scaffold), { value: 3 })] }, t.panelTitle = "??????", t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "input-number", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, { label: "?????????", name: "count", type: "input-number", value: 5 }, { type: "switch", name: "half", mode: "inline", className: "w-full", label: "????????????", value: !1 }, { type: "switch", name: "allowClear", mode: "inline", className: "w-full", label: "?????????", description: "?????????????????????????????????", value: !1 }, l.getSchemaTpl("className", { label: "?????? CSS ??????", name: "descriptionClassName", visibleOn: "data.description" })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.RangeControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.RepeatControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-repeat", t.$schema = "/schemas/RepeatControlSchema.json", t.name = "??????????????????", t.icon = "fa fa-repeat", t.description = "??????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/repeat", t.tags = ["?????????"], t.scaffold = { type: "input-repeat", label: "??????", name: "repeat" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "??????", t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, { name: "options", type: "select", label: "????????????", options: "secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly".split(","), value: "hourly,daily,weekly,monthly", multiple: !0 }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.RepeatControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ResetControlPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "reset", t.name = "??????", t.icon = "fa fa-eraser", t.panelTitle = "??????", t
            } return n.__extends(t, e), t
        }(a(20).ButtonPlugin);
        t.ResetControlPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.RichTextControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-rich-text", t.$schema = "/schemas/RichTextControlSchema.json", t.name = "??????????????????", t.icon = "fa fa-newspaper-o", t.description = "?????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/rich-text", t.tags = ["?????????"], t.scaffold = { type: "input-rich-text", label: "?????????", name: "rich-text" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "?????????", t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "textarea", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, l.getSchemaTpl("api", { name: "receiver", label: "??????????????????", value: "/api/upload/image", __isUpload: !0 }), { type: "select", name: "vendor", label: "???????????????", value: "tinymce", options: ["tinymce", "froala"] }, l.getSchemaTpl("fieldSet", { title: "froala ?????????", visibleOn: 'data.vendor === "froala"', body: [{ type: "combo", name: "options", noBorder: !0, multiLine: !0, items: [{ type: "select", name: "language", label: "??????", labelRemark: "??????????????????????????????????????????????????????", defaultValue: "zh_cn", options: [{ label: "??????", value: "zh_cn" }, { label: "??????", value: "en_us" }] }, { type: "textarea", name: "toolbarButtons", label: "???????????????????????????", labelRemark: "???????????? ??? 1200px", description: '?????????????????????????????????<code>|</code>????????????????????????<a target="_blank" href="https://www.froala.com/wysiwyg-editor/docs/options">????????????</a>', minRows: 5, value: ["paragraphFormat", "quote", "color", "|", "bold", "italic", "underline", "strikeThrough", "|", "formatOL", "formatUL", "align", "|", "insertLink", "insertImage", "insertEmotion", "insertTable", "|", "undo", "redo", "html"], pipeIn: function (e) { return Array.isArray(e) ? e.join(" ") : "" }, pipeOut: function (e) { return e.replace(/\s+/g, " ").split(" ") } }, { type: "textarea", name: "toolbarButtonsMD", label: "???????????????????????????", labelRemark: "???????????? ??? 992px", description: '?????????????????????????????????<code>|</code>????????????????????????<a target="_blank" href="https://www.froala.com/wysiwyg-editor/docs/options">????????????</a>', minRows: 5, pipeIn: function (e) { return Array.isArray(e) ? e.join(" ") : "" }, pipeOut: function (e) { return e.replace(/\s+/g, " ").split(" ") } }, { type: "textarea", name: "toolbarButtonsSM", label: "???????????????????????????", labelRemark: "???????????? ??? 768px", description: '?????????????????????????????????<code>|</code>????????????????????????<a target="_blank" href="https://www.froala.com/wysiwyg-editor/docs/options">????????????</a>', minRows: 5, pipeIn: function (e) { return Array.isArray(e) ? e.join(" ") : "" }, pipeOut: function (e) { return e.replace(/\s+/g, " ").split(" ") } }] }] }), l.getSchemaTpl("fieldSet", { title: "tinymce ?????????", visibleOn: 'data.vendor === "tinymce"', body: [{ type: "combo", name: "options", noBorder: !0, multiLine: !0, items: [{ type: "switch", label: "?????????????????????", value: "true", name: "menubar" }, { type: "input-number", label: "??????", min: 0, value: 400, name: "height" }, { type: "textarea", name: "plugins", label: "???????????????", description: '???????????????????????????<a target="_blank" href="https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/">????????????</a>', value: "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking table emoticons template paste help" }, { type: "textarea", name: "toolbar", label: "?????????", value: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons | help" }] }] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.RichTextControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.SelectControlPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(5), o = a(3), r = a(1), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "select", t.$schema = "/schemas/SelectControlSchema.json", t.order = -480, t.name = "?????????", t.icon = "fa fa-th-list", t.description = "???????????????????????????????????????<code>source</code>????????????", t.docLink = "/amis/zh-CN/components/form/select", t.tags = ["?????????"], t.scaffold = { type: "select", label: "??????", name: "select", options: [{ label: "??????A", value: "A" }, { label: "??????B", value: "B" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("switchDefaultValue"), { type: "select", name: "value", label: "?????????", source: "${options}", visibleOn: '!data.multiple && typeof this.value !== "undefined"' }, { type: "select", name: "value", label: "?????????", source: "${options}", multiple: !0, visibleOn: ' data.multiple && typeof this.value !== "undefined"' }, o.getSchemaTpl("clearable"), { label: "?????????", name: "searchable", type: "switch", mode: "inline", className: "w-full" }, { label: "???????????????????????????", name: "selectFirst", type: "switch", mode: "inline", className: "w-full" }, o.getSchemaTpl("fieldSet", {
                    title: "??????", body: [o.getSchemaTpl("multiple"), { label: "?????????????????????????????????", name: "valuesNoWrap", type: "switch", mode: "inline", className: "w-full", visibleOn: "this.multiple" }, { label: "?????????", name: "checkAll", type: "switch", mode: "inline", value: !1, className: "w-full", onChange: function (e, t, a, n) { e && n.setValueByName("multiple", !0) } }, { label: "?????????????????????", name: "menuTpl", type: "input-text" }, { label: "????????????", name: "defaultCheckAll", type: "switch", value: !1, visibleOn: "this.checkAll", mode: "inline", className: "w-full" }, { type: "input-text", name: "checkAllLabel", label: '????????? "??????" ?????????', visibleOn: "this.checkAll", value: "??????" }, o.getSchemaTpl("options"), o.getSchemaTpl("source"), o.getSchemaTpl("api", { name: "autoComplete", label: "??????????????????", description: "?????????????????????????????????????????????????????????????????????????????????????????????????????? <code>\\${term}</code> ??????" }), o.getSchemaTpl("joinValues"), o.getSchemaTpl("delimiter"), o.getSchemaTpl("extractValue"), o.getSchemaTpl("autoFill"), o.getSchemaTpl("creatable"), o.getSchemaTpl("createBtnLabel", { visibleOn: "data.creatable" }), o.getSchemaTpl("api", { label: "??????????????????", name: "addApi", visibleOn: "data.creatable" }), {
                        name: "addControls", visibleOn: "data.creatable", pipeIn: o.defaultValue([{ type: "input-text", name: "label", label: !1, placeholder: "???????????????" }]), asFormItem: !0, children: function (e) {
                            var a = e.value, n = e.onChange;
                            e.data;
                            return l.default.createElement(i.Button, { size: "sm", level: "danger", className: "m-b", onClick: function () { t.manager.openSubEditor({ title: "???????????????????????????", value: { type: "dialog", body: a || [{ type: "input-text", name: "label", label: !1, placeholder: "???????????????" }] }, onChange: function (e) { return n(e, "addControls") } }) }, block: !0 }, "???????????????????????????")
                        }
                    }, o.getSchemaTpl("editable"), o.getSchemaTpl("api", { label: "??????????????????", name: "editApi" }), o.getSchemaTpl("removable"), o.getSchemaTpl("api", { label: "??????????????????", name: "deleteApi" })]
                })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.SelectControlPlugin = s, r.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.StaticControlPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(5), o = a(3), r = a(1), s = a(2), d = a(16), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "static", t.$schema = "/schemas/StaticControlSchema.json", t.order = -390, t.name = "???????????????", t.icon = "fa fa-info", t.description = "???????????????????????????????????????<code>json???date???image???progress</code>?????????", t.docLink = "/amis/zh-CN/components/form/static", t.tags = ["?????????"], t.scaffold = { type: "static", label: "??????" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign(n.__assign({}, t.scaffold), { value: "?????????" })] }, t.multifactor = !0, t.panelTitle = "????????????", t.panelBodyCreator = function (e) {
                    return [{ children: l.default.createElement(i.Button, { size: "sm", level: "info", className: "m-b", block: !0, onClick: t.exchangeRenderer.bind(t, e.id) }, "?????????????????????") }, o.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, { name: "quickEdit", label: "??????????????????", type: "switch", pipeIn: function (e) { return !!e }, mode: "inline", className: "w-full" }, { visibleOn: "data.quickEdit", name: "quickEdit.mode", type: "button-group-select", value: "popOver", label: "??????????????????", size: "xs", mode: "inline", className: "w-full", options: [{ label: "??????", value: "popOver" }, { label: "??????", value: "inline" }] }, { visibleOn: "data.quickEdit", name: "quickEdit.saveImmediately", label: "??????????????????", type: "switch", mode: "inline", className: "w-full", description: "???????????????????????????????????????????????????????????????", descriptionClassName: "help-block m-b-none", pipeIn: function (e) { return !!e } }, o.getSchemaTpl("api", { label: "??????????????????", description: "???????????????????????????????????????????????????????????????????????????quickSaveItemApi???", name: "quickEdit.saveImmediately.api", visibleOn: "this.quickEdit && this.quickEdit.saveImmediately" }), {
                        visibleOn: "data.quickEdit", name: "quickEdit", asFormItem: !0, children: function (e) {
                            var a = e.value, o = e.onChange, r = e.data;
                            !0 === a && (a = {});
                            var s = a.mode;
                            return delete (a = n.__assign({ type: "input-text", name: r.name }, a)).mode, l.default.createElement(i.Button, { level: "info", className: "m-b", size: "sm", block: !0, onClick: function () { t.manager.openSubEditor({ title: "????????????????????????", value: a, slot: { type: "form", mode: "normal", body: ["$$"], wrapWithPanel: !1 }, onChange: function (e) { return o(n.__assign(n.__assign({}, e), { mode: s }), "quickEdit") } }) } }, "??????????????????")
                        }
                    }, { name: "popOver", label: "????????????????????????", type: "switch", pipeIn: function (e) { return !!e }, mode: "inline", className: "w-full" }, { name: "popOver.mode", label: "????????????????????????", type: "select", visibleOn: "data.popOver", pipeIn: o.defaultValue("popOver"), options: [{ label: "??????", value: "popOver" }, { label: "??????", value: "dialog" }, { label: "???????????????", value: "drawer" }] }, { name: "popOver.position", label: "????????????????????????", type: "select", visibleOn: 'data.popOver && data.popOver.mode === "popOver"', pipeIn: o.defaultValue("center"), options: [{ label: "????????????", value: "center" }, { label: "???????????????", value: "left-top" }, { label: "???????????????", value: "right-top" }, { label: "???????????????", value: "left-bottom" }, { label: "???????????????", value: "right-bottom" }, { label: "???????????????", value: "fixed-left-top" }, { label: "???????????????", value: "fixed-right-top" }, { label: "???????????????", value: "fixed-left-bottom" }, { label: "???????????????", value: "fixed-right-bottom" }] }, {
                        visibleOn: "data.popOver", name: "popOver", asFormItem: !0, children: function (e) {
                            var a = e.value, o = e.onChange;
                            return a = n.__assign({ type: "panel", title: "????????????", body: "????????????" }, a), l.default.createElement(i.Button, { level: "info", className: "m-b", size: "sm", block: !0, onClick: function () { t.manager.openSubEditor({ title: "??????????????????????????????", value: a, onChange: function (e) { return o(e, "quickEdit") } }) } }, "????????????????????????")
                        }
                    }, { name: "copyable", label: "????????????????????????", type: "switch", pipeIn: function (e) { return !!e }, mode: "inline", className: "w-full" }, { visibleOn: "data.copyable", name: "copyable.content", type: "textarea", label: "??????????????????", description: "???????????????????????????????????????" }]
                }, t
            } return n.__extends(t, e), t.prototype.filterProps = function (e, t) { return e.$$id = t.id, void 0 === e.value && (e.value = d.mockValue(e)), e }, t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.exchangeRenderer = function (e) { this.manager.showReplacePanel(e, "??????") }, t
        }(s.BasePlugin);
        t.StaticControlPlugin = u, r.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.SubFormControlPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(6), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-sub-form", t.$schema = "/schemas/SubFormControlSchema.json", t.name = "????????????", t.icon = "fa fa-window-restore", t.description = "SubForm, ???????????????<code>form</code>????????????????????????", t.docLink = "/amis/zh-CN/components/form/subform", t.tags = ["?????????"], t.scaffold = { type: "input-sub-form", name: "subform", label: "?????????", form: { title: "??????", body: [{ type: "input-text", label: "??????", name: "text" }] } }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "????????????", t.panelBodyCreator = function (e) {
                    return [{
                        children: function (a) {
                            a.value, a.onChange;
                            return i.default.createElement(l.Button, { size: "sm", level: "danger", className: "m-b", block: !0, onClick: t.editDetail.bind(t, e.id) }, "?????????????????????")
                        }
                    }, { name: "labelField", type: "input-text", value: "label", label: "???????????????", description: "?????????????????????????????????????????????????????????????????????????????????" }, { name: "btnLabel", label: "???????????????", value: "??????", type: "input-text" }, { name: "minLength", visibleOn: "data.multiple", label: "??????????????????", type: "input-number" }, { name: "maxLength", visibleOn: "data.multiple", label: "??????????????????", type: "input-number" }]
                }, t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.filterProps = function (e) { return (e = s.JSONPipeOut(e)).value || (e.value = [""]), e }, t.prototype.buildEditorToolbar = function (e, t) {
                var a = e.id;
                "input-sub-form" === e.info.renderer.name && t.push({ icon: "fa fa-expand", order: 100, tooltip: "?????????????????????", onClick: this.editDetail.bind(this, a) })
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a = e.id;
                e.schema, e.region;
                "input-sub-form" === e.info.renderer.name && t.push("|", { label: "?????????????????????", onSelect: this.editDetail.bind(this, a) })
            }, t.prototype.editDetail = function (e) {
                var t = this.manager, a = t.store, l = a.getNodeById(e), i = a.getValueOf(e);
                if (l && i) {
                    var o = i.form, r = o.title, d = o.actions, u = o.name, p = o.size, c = o.closeOnEsc, m = o.showCloseButton, h = o.bodyClassName, f = (o.type, n.__rest(o, ["title", "actions", "name", "size", "closeOnEsc", "showCloseButton", "bodyClassName", "type"])), b = { title: r, actions: d, name: u, size: p, closeOnEsc: c, showCloseButton: m, bodyClassName: h, type: "dialog", body: n.__assign({ type: "form" }, f) };
                    this.manager.openSubEditor({
                        title: "??????????????????", value: b, memberImmutable: ["body"], onChange: function (e) {
                            var a = e.body[0];
                            delete (e = n.__assign(n.__assign({}, i), { form: n.__assign(n.__assign({}, e), a) })).form.body, delete e.form.type, t.panelChangeValue(e, s.diff(i, e))
                        }
                    })
                }
            }, t
        }(r.BasePlugin);
        t.SubFormControlPlugin = d, o.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.SubmitControlPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "submit", t.name = "??????", t.panelTitle = "??????", t
            } return n.__extends(t, e), t
        }(a(20).ButtonPlugin);
        t.SubmitControlPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.SwitchControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "switch", t.$schema = "/schemas/SwitchControlSchema.json", t.order = -400, t.name = "??????", t.icon = "fa fa-toggle-on", t.description = "????????????", t.docLink = "/amis/zh-CN/components/form/switch", t.tags = ["?????????"], t.scaffold = { type: "switch", option: "??????", name: "switch" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign(n.__assign({}, t.scaffold), { label: "????????????" })] }, t.panelTitle = "??????", t.panelBody = [l.getSchemaTpl("switchDefaultValue", { pipeOut: function (e, t, a) { return e ? a.trueValue : void 0 } }), { type: "switch", name: "value", label: "????????????", mode: "inline", className: "w-full", visibleOn: 'typeof this.value !== "undefined"', pipeOut: function (e, t, a) { return e ? a.trueValue : a.falseValue } }, { name: "option", type: "input-text", label: "????????????" }, { label: "????????????", name: "optionAtLeft", type: "button-group-select", size: "sm", value: !1, options: [{ label: "???", value: !0 }, { label: "???", value: !1 }] }, { type: "input-text", label: "???????????????", name: "trueValue", value: !0, pipeOut: l.valuePipeOut }, { type: "input-text", label: "???????????????", name: "falseValue", value: !1, pipeOut: l.valuePipeOut }, { name: "onText", type: "input-text", label: "??????????????????" }, { name: "offText", type: "input-text", label: "??????????????????" }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.SwitchControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TableControlPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(18)), o = a(3), r = a(1), s = a(2), d = a(9), u = a(6), p = a(16), c = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-table", t.$schema = "/schemas/TableControlSchema.json", t.name = "???????????????", t.icon = "fa fa-table", t.description = "???????????????????????????,???????????????????????????????????????????????? <code>multiple</code> ?????? <code>form</code>", t.docLink = "/amis/zh-CN/components/form/table", t.tags = ["?????????"], t.scaffold = { type: "input-table", name: "table", label: "????????????", columns: [{ label: "color", name: "color", quickEdit: { type: "input-color" } }, { label: "????????????", name: "name", quickEdit: { type: "input-text", mode: "inline" } }], strictMode: !0 }, t.regions = [{ key: "columns", label: "?????????", renderMethod: "renderTableContent", preferTag: "??????", dndMode: "position-h" }], t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: n.__assign(n.__assign({}, t.scaffold), { value: [{ color: "green", name: "??????" }] }) }, t.scaffoldForm = { title: "??????????????????", body: [{ name: "columns", type: "combo", multiple: !0, label: !1, addButtonText: "????????????", draggable: !0, items: [{ type: "input-text", name: "label", placeholder: "??????" }, { type: "input-text", name: "name", placeholder: "???????????????" }, { type: "select", name: "type", placeholder: "??????", value: "input-text", options: [{ value: "text", label: "?????????" }, { value: "tpl", label: "??????" }, { value: "image", label: "??????" }, { value: "date", label: "??????" }, { value: "progress", label: "??????" }, { value: "status", label: "??????" }, { value: "mapping", label: "??????" }, { value: "operation", label: "?????????" }] }] }], canRebuild: !0 }, t.panelTitle = "????????????", t.panelBodyCreator = function (e) {
                    e.schema.type;
                    return o.getSchemaTpl("tabs", [{ title: "??????", body: i.default([o.getSchemaTpl("formItemName", { required: !0 }), o.getSchemaTpl("label"), o.getSchemaTpl("description"), { label: "???????????????", type: "switch", name: "addable", mode: "inline", className: "w-full" }, { type: "input-text", name: "addBtnLabel", label: "??????????????????", visibleOn: "data.addable", pipeIn: o.defaultValue("") }, { name: "addBtnIcon", label: "??????????????????", type: "icon-picker", visibleOn: "data.addable" }, o.getSchemaTpl("api", { name: "addApi", label: "?????????????????? API", visibleOn: "data.addable" }), { label: "???????????????", type: "switch", name: "removable", mode: "inline", className: "w-full" }, { type: "input-text", name: "deleteBtnLabel", label: "??????????????????", visibleOn: "data.removable", pipeIn: o.defaultValue("") }, { name: "deleteBtnIcon", label: "??????????????????", type: "icon-picker", visibleOn: "data.removable" }, o.getSchemaTpl("api", { name: "deleteApi", label: "?????????????????? API", visibleOn: "data.removable" }), { label: "???????????????", type: "switch", name: "editable", mode: "inline", className: "w-full" }, { type: "input-text", name: "updateBtnLabel", label: "??????????????????", visibleOn: "data.editable", pipeIn: o.defaultValue("") }, { name: "updateBtnIcon", label: "??????????????????", type: "icon-picker", visibleOn: "data.editable" }, o.getSchemaTpl("api", { name: "updateApi", label: "?????????????????? API", visibleOn: "data.editable" }), { type: "input-text", name: "confirmBtnLabel", label: "????????????????????????", visibleOn: "data.editable", pipeIn: o.defaultValue("") }, { name: "confirmBtnIcon", label: "????????????????????????", type: "icon-picker", visibleOn: "data.editable" }, { type: "input-text", name: "cancelBtnLabel", label: "????????????????????????", visibleOn: "data.editable", pipeIn: o.defaultValue("") }, { name: "cancelBtnIcon", label: "????????????????????????", type: "icon-picker", visibleOn: "data.editable" }, { label: "?????????????????????", type: "switch", name: "draggable", mode: "inline", className: "w-full" }, { label: "????????????", type: "switch", name: "needConfirm", mode: "inline", className: "w-full" }, { label: "????????????", type: "switch", name: "strictMode", value: !0, mode: "inline", className: "w-full" }, { label: "??????????????????", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: '??????"canAccessSuperData": true ???????????? "strictMode": false ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????', placement: "left" }, type: "switch", onChange: function (e, t, a, n) { e && !t ? n.setValues({ strictMode: !1 }) : n.setValues({ strictMode: !0 }) }, name: "canAccessSuperData", mode: "inline", className: "w-full" }]) }, { title: "??????", body: [o.getSchemaTpl("formItemMode"), o.getSchemaTpl("horizontalMode"), o.getSchemaTpl("horizontal", { label: "", visibleOn: '(data.$$formMode == "horizontal" || data.mode == "horizontal") && data.label !== false && data.horizontal' }), o.getSchemaTpl("className"), o.getSchemaTpl("className", { label: "Label CSS ??????", name: "labelClassName" }), o.getSchemaTpl("className", { label: "Input CSS ??????", name: "inputClassName" }), o.getSchemaTpl("className", { label: "?????? CSS ??????", name: "descriptionClassName", visibleOn: "data.description" })] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("required"), o.getSchemaTpl("validateOnChange"), o.getSchemaTpl("submitOnChange"), o.getSchemaTpl("disabled"), o.getSchemaTpl("visible")] }])
                }, t
            } return n.__extends(t, e), t.prototype.filterProps = function (e) {
                var t = Array.isArray(e.value) ? e.value : "string" == typeof e.source ? l.resolveVariable(e.source, e.data) : l.resolveVariable("${items}", e.data);
                if (Array.isArray(t) && t.length) e.value = t.slice(0, 10);
                else {
                    var a = {};
                    Array.isArray(e.columns) && e.columns.forEach((function (e) { e.name && d.setVariable(a, e.name, p.mockValue(e)) })), e.value = u.repeatArray(a, 1).map((function (e, t) { return n.__assign(n.__assign({}, e), { id: t + 1 }) }))
                } return e
            }, t.prototype.exchangeRenderer = function (e) { this.manager.showReplacePanel(e, "??????") }, t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t.prototype.beforeInsert = function (e) {
                var t, a, l, i, o = e.context;
                o.info.plugin !== this && (null === (t = o.node.sameIdChild) || void 0 === t ? void 0 : t.info.plugin) !== this || "columns" !== o.region || (o.data = n.__assign(n.__assign({}, o.data), { label: null !== (i = null !== (a = o.data.label) && void 0 !== a ? a : null === (l = o.subRenderer) || void 0 === l ? void 0 : l.name) && void 0 !== i ? i : "?????????" }))
            }, t
        }(s.BasePlugin);
        t.TableControlPlugin = c, r.registerEditorPlugin(c)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TagControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-tag", t.$schema = "/schemas/TagControlSchema.json", t.order = -420, t.name = "??????", t.icon = "fa fa-tag", t.description = "??????<code>options</code>????????????????????????", t.docLink = "/amis/zh-CN/components/form/tag", t.tags = ["?????????"], t.scaffold = { type: "input-tag", label: "??????", name: "tag", options: ["??????", "??????", "??????"] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: n.__assign(n.__assign({}, t.scaffold), { value: "??????" }) }, t.panelTitle = "??????", t.panelBody = [{ type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, l.getSchemaTpl("clearable"), l.getSchemaTpl("fieldSet", { title: "??????", body: [l.getSchemaTpl("options", { visibleOn: "data.autoComplete !== false", description: "??????????????????????????????????????????????????????????????????" }), l.getSchemaTpl("source", { visibleOn: "data.autoComplete !== false" }), { type: "input-text", name: "optionsTip", label: "????????????", value: "????????????????????????" }, l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter"), l.getSchemaTpl("extractValue"), l.getSchemaTpl("autoFill")] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.TagControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TabsTransferPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "tabs-transfer", t.$schema = "/schemas/TransferControlSchema.json", t.name = "???????????????", t.icon = "fa fa-th-list", t.description = "?????????????????????", t.docLink = "/amis/zh-CN/components/form/transfer", t.tags = ["?????????"], t.scaffold = { label: "???????????????", type: "tabs-transfer", name: "a", sortable: !0, searchable: !0, options: [{ label: "??????", selectMode: "tree", children: [{ label: "??????", children: [{ label: "?????????", value: "zhugeliang" }] }, { label: "??????", children: [{ label: "??????", value: "caocao" }, { label: "?????????", value: "zhongwuyan" }] }, { label: "??????", children: [{ label: "??????", value: "libai" }, { label: "??????", value: "hanxin" }, { label: "?????????", value: "yunzhongjun" }] }] }, { label: "??????", selectMode: "chained", children: [{ label: "??????", children: [{ label: "?????????", value: "zhugeliang2" }] }, { label: "??????", children: [{ label: "??????", value: "caocao2" }, { label: "?????????", value: "zhongwuyan2" }] }, { label: "??????", children: [{ label: "??????", value: "libai2" }, { label: "??????", value: "hanxin2" }, { label: "?????????", value: "yunzhongjun2" }] }] }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "???????????????", t.panelDefinitions = { options: { label: "?????? Options", name: "options", type: "combo", multiple: !0, multiLine: !0, draggable: !0, addButtonText: "????????????", scaffold: { label: "", value: "" }, items: [{ type: "group", body: [{ type: "input-text", name: "label", placeholder: "??????", required: !0 }, { type: "input-text", name: "value", placeholder: "???", unique: !0 }] }, { $ref: "options", label: "?????????", name: "children", addButtonText: "???????????????" }] } }, t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "select", name: "value", label: "?????????", source: "${options}", multiple: !0, visibleOn: 'typeof this.value !== "undefined"' }, { label: "?????????", name: "searchable", type: "switch", mode: "inline", className: "w-full" }, l.getSchemaTpl("api", { label: "????????????", name: "searchApi" }), { label: "???????????????????????????", name: "searchResultMode", type: "select", mode: "inline", className: "w-full", options: [{ label: "????????????", value: "list" }, { label: "????????????", value: "table" }, { label: "??????????????????", value: "tree" }, { label: "??????????????????", value: "chained" }] }, { label: "?????????", name: "sortable", type: "switch", mode: "inline", className: "w-full" }, { label: "?????????????????????", name: "selectTitle", type: "input-text" }, { label: "???????????????????????????", name: "resultTitle", type: "input-text" }, l.getSchemaTpl("fieldSet", { title: "??????", body: [{ $ref: "options", name: "options" }, l.getSchemaTpl("source"), l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter"), l.getSchemaTpl("extractValue"), l.getSchemaTpl("autoFill")] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.TabsTransferPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TextareaControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "textarea", t.$schema = "/schemas/TextareaControlSchema.json", t.order = -490, t.name = "???????????????", t.icon = "fa fa-paragraph", t.description = "??????????????????", t.docLink = "/amis/zh-CN/components/form/textarea", t.tags = ["?????????"], t.scaffold = { type: "textarea", label: "????????????", name: "textarea" }, t.previewSchema = { type: "form", className: "text-left", wrapWithPanel: !1, mode: "horizontal", body: n.__assign({}, t.scaffold) }, t.panelTitle = "????????????", t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "textarea", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, { type: "input-number", name: "minRows", value: 3, label: "????????????" }, { type: "input-number", name: "maxRows", value: 20, label: "????????????" }, l.getSchemaTpl("showCounter"), { type: "switch", name: "readOnly", label: "????????????" }, { type: "switch", name: "trimContents", label: "??????????????????", mode: "inline", className: "w-full", description: "????????????????????????????????????????????????" }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.TextareaControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TransferPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "transfer", t.$schema = "/schemas/TransferControlSchema.json", t.name = "?????????", t.icon = "fa fa-th-list", t.description = "???????????????", t.docLink = "/amis/zh-CN/components/form/transfer", t.tags = ["?????????"], t.scaffold = { label: "??????", type: "transfer", name: "transfer", options: [{ label: "??????", children: [{ label: "?????????", value: "zhugeliang" }] }, { label: "??????", children: [{ label: "??????", value: "caocao" }, { label: "?????????", value: "zhongwuyan" }] }, { label: "??????", children: [{ label: "??????", value: "libai" }, { label: "??????", value: "hanxin" }, { label: "?????????", value: "yunzhongjun" }] }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "?????????", t.panelDefinitions = { options: { label: "?????? Options", name: "options", type: "combo", multiple: !0, multiLine: !0, draggable: !0, addButtonText: "????????????", scaffold: { label: "", value: "" }, items: [{ type: "group", body: [{ type: "input-text", name: "label", placeholder: "??????", required: !0 }, { type: "input-text", name: "value", placeholder: "???", unique: !0 }] }, { $ref: "options", label: "?????????", name: "children", addButtonText: "???????????????" }] } }, t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "select", name: "value", label: "?????????", source: "${options}", visibleOn: '!data.multiple && typeof this.value !== "undefined"' }, { type: "select", name: "value", label: "?????????", source: "${options}", multiple: !0, visibleOn: ' data.multiple && typeof this.value !== "undefined"' }, { label: "??????????????????", name: "selectMode", type: "select", mode: "inline", className: "w-full", options: [{ label: "????????????", value: "list" }, { label: "????????????", value: "table" }, { label: "??????????????????", value: "tree" }, { label: "??????????????????", value: "chained" }, { label: "??????????????????", value: "associated" }] }, { name: "columns", type: "combo", multiple: !0, label: !1, strictMode: !1, addButtonText: "????????????", draggable: !1, visibleOn: 'data.selectMode === "table"', items: [{ type: "input-text", name: "label", placeholder: "??????" }, { type: "input-text", name: "name", placeholder: "???????????????" }, { type: "select", name: "type", placeholder: "??????", value: "input-text", options: [{ value: "text", label: "?????????" }, { value: "tpl", label: "??????" }, { value: "image", label: "??????" }, { value: "date", label: "??????" }, { value: "progress", label: "??????" }, { value: "status", label: "??????" }, { value: "mapping", label: "??????" }, { value: "operation", label: "?????????" }] }] }, { $ref: "options", label: "??????????????????", name: "leftOptions", visibleOn: 'data.selectMode === "associated"' }, { label: "??????????????????", name: "leftMode", type: "select", mode: "inline", className: "w-full", visibleOn: 'data.selectMode === "associated"', options: [{ label: "????????????", value: "list" }, { label: "??????????????????", value: "tree" }] }, { label: "??????????????????", name: "rightMode", type: "select", mode: "inline", className: "w-full", visibleOn: 'data.selectMode === "associated"', options: [{ label: "????????????", value: "list" }, { label: "??????????????????", value: "tree" }] }, { label: "?????????", name: "searchable", type: "switch", mode: "inline", className: "w-full" }, l.getSchemaTpl("api", { label: "????????????", name: "searchApi" }), { label: "???????????????????????????", name: "searchResultMode", type: "select", mode: "inline", className: "w-full", options: [{ label: "????????????", value: "list" }, { label: "????????????", value: "table" }, { label: "??????????????????", value: "tree" }, { label: "??????????????????", value: "chained" }] }, { label: "?????????", name: "sortable", type: "switch", mode: "inline", className: "w-full" }, { label: "???????????????????????????", name: "selectFirst", type: "switch", mode: "inline", className: "w-full" }, { label: "????????????????????????", name: "statistics", type: "switch", mode: "inline", className: "w-full" }, { label: "?????????????????????", name: "selectTitle", type: "input-text" }, { label: "???????????????????????????", name: "resultTitle", type: "input-text" }, l.getSchemaTpl("fieldSet", { title: "??????", body: [{ $ref: "options", name: "options" }, l.getSchemaTpl("source"), l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter"), l.getSchemaTpl("extractValue"), l.getSchemaTpl("autoFill")] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.TransferPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TimeControlPlugin = void 0;
        var n = a(0), l = a(5), i = a(3), o = a(1), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-time", t.$schema = "/schemas/TimeControlSchema.json", t.name = "?????????", t.icon = "fa fa-clock-o", t.description = "???????????????", t.docLink = "/amis/zh-CN/components/form/time", t.tags = ["?????????"], t.scaffold = { type: "input-time", label: "??????", name: "time" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: n.__assign({}, t.scaffold) }, t.panelTitle = "?????????", t.panelBody = [i.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"', placeholder: "??????????????????", description: "?????? <code>now???+1day???-2weeks</code>?????????????????????" }, { type: "fieldSet", title: "???????????????", collapsed: !0, collapsable: !0, className: "fieldset", visibleOn: 'typeof this.value !== "undefined"', body: [{ type: "input-time", name: "value", pipeIn: function (e) { return l.relativeValueRe.test(e) || ~["now", "today"].indexOf(e) ? "" : e } }] }, { type: "input-text", name: "timeFormat", label: "?????????", description: '????????? <a href="https://momentjs.com/" target="_blank">moment</a> ?????????????????????', pipeIn: i.defaultValue("HH:mm") }, i.getSchemaTpl("clearable", { pipeIn: i.defaultValue(!0) }), { type: "input-text", name: "inputFormat", label: "????????????", description: '????????? <a href="https://momentjs.com/" target="_blank">moment</a> ?????????????????????', pipeIn: i.defaultValue("HH:mm") }], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.TimeControlPlugin = r, o.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TreeControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-tree", t.$schema = "/schemas/TreeControlSchema.json", t.name = "????????????", t.icon = "fa fa-list-alt", t.description = "?????????????????????????????????<code>options</code>??????????????????????????????<code>source</code>????????????", t.docLink = "/amis/zh-CN/components/form/tree", t.tags = ["?????????"], t.scaffold = { type: "input-tree", label: "???", name: "tree", options: [{ label: "??????A", value: "A", children: [{ label: "??????C", value: "C" }, { label: "??????D", value: "D" }] }, { label: "??????B", value: "B" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: n.__assign({}, t.scaffold) }, t.panelTitle = "?????????", t.panelDefinitions = { options: { label: "?????? Options", name: "options", type: "combo", multiple: !0, multiLine: !0, draggable: !0, addButtonText: "????????????", scaffold: { label: "", value: "" }, items: [{ type: "group", body: [{ type: "input-text", name: "label", placeholder: "??????", required: !0 }, { type: "input-text", name: "value", placeholder: "???", unique: !0 }] }, { $ref: "options", label: "?????????", name: "children", addButtonText: "???????????????" }] } }, t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, l.getSchemaTpl("fieldSet", { title: "??????", body: [{ $ref: "options", name: "options" }, l.getSchemaTpl("source", { sampleBuilder: function (e) { return JSON.stringify({ status: 0, msg: "", data: { options: [{ label: "??????A", value: "a", children: [{ label: "?????????", value: "c" }] }, { label: "??????B", value: "b" }] } }, null, 2) } }), { label: "????????????", name: "hideRoot", type: "switch", mode: "inline", className: "w-full" }, { name: "showIcon", label: "??????????????????", type: "switch", mode: "inline", className: "w-full", pipeIn: l.defaultValue(!0) }, l.getSchemaTpl("multiple"), { name: "cascade", visibleOn: "data.multiple", label: "???????????????????????????", type: "switch", description: "????????????????????????????????????????????????", mode: "inline", className: "w-full" }, { name: "withChildren", visibleOn: "data.cascade !== true && data.multiple", label: "???????????????????????????", type: "switch", disabledOn: "data.onlyChildren", mode: "inline", className: "w-full" }, { name: "onlyChildren", visibleOn: "data.cascade !== true && data.multiple", label: "??????????????????????????????", disabledOn: "data.withChildren", type: "switch", mode: "inline", className: "w-full" }, l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter"), l.getSchemaTpl("extractValue"), l.getSchemaTpl("autoFill")] }), l.getSchemaTpl("fieldSet", { title: "??????", body: [{ label: "????????????", name: "rootLabel", type: "input-text", pipeIn: l.defaultValue("??????"), visibleOn: "data.hideRoot !== true" }, { name: "showIcon", label: "??????????????????", type: "switch", mode: "inline", className: "w-full", pipeIn: l.defaultValue(!0) }, { label: "????????????????????????", name: "showRadio", type: "switch", mode: "inline", className: "w-full", visibleOn: "!data.multiple" }] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.TreeControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TreeSelectControlPlugin = void 0;
        var n = a(0), l = a(3), i = a(1), o = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "tree-select", t.$schema = "/schemas/TreeSelectControlSchema.json", t.name = "????????????", t.icon = "fa fa-chevron-down", t.description = "???????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/tree-select", t.tags = ["?????????"], t.scaffold = { type: "tree-select", label: "????????????", name: "tree-select", options: [{ label: "??????A", value: "A", children: [{ label: "??????C", value: "C" }, { label: "??????D", value: "D" }] }, { label: "??????B", value: "B" }] }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: n.__assign({}, t.scaffold) }, t.panelTitle = "?????????", t.panelDefinitions = { options: { label: "?????? Options", name: "options", type: "combo", multiple: !0, multiLine: !0, draggable: !0, addButtonText: "????????????", scaffold: { label: "", value: "" }, items: [{ type: "group", body: [{ type: "input-text", name: "label", placeholder: "??????", required: !0 }, { type: "input-text", name: "value", placeholder: "???", unique: !0 }] }, { $ref: "options", label: "?????????", name: "children", addButtonText: "???????????????" }] } }, t.panelBody = [l.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", visibleOn: 'typeof this.value !== "undefined"' }, l.getSchemaTpl("clearable"), l.getSchemaTpl("fieldSet", { title: "??????", body: [{ $ref: "options", name: "options" }, l.getSchemaTpl("source", { sampleBuilder: function (e) { return JSON.stringify({ status: 0, msg: "", data: { options: [{ label: "??????A", value: "a", children: [{ label: "?????????", value: "c" }] }, { label: "??????B", value: "b" }] } }, null, 2) } }), l.getSchemaTpl("api", { name: "autoComplete", label: "??????????????????", description: "?????????????????????????????????????????????????????????????????????????????????????????????????????? `\\${term}` ??????<code>?????????????????????????????????????????????</code>" }), { name: "initiallyOpen", label: "???????????????????????????", type: "switch", mode: "inline", className: "w-full", pipeIn: l.defaultValue(!0) }, { type: "input-text", name: "unfoldedLevel", label: "????????????????????????", visibleOn: 'typeof this.initiallyOpen !== "undefined" || !this.initiallyOpen' }, { name: "showIcon", label: "??????????????????", type: "switch", mode: "inline", className: "w-full", pipeIn: l.defaultValue(!0) }, { label: "????????????", name: "searchable", type: "switch", mode: "inline", className: "w-full" }, { label: "????????????????????????", name: "showRadio", type: "switch", mode: "inline", className: "w-full", visibleOn: "!data.multiple" }, l.getSchemaTpl("multiple"), { name: "cascade", visibleOn: "data.multiple", label: "???????????????????????????", description: "????????????????????????????????????????????????", type: "switch", mode: "inline", className: "w-full" }, { name: "withChildren", visibleOn: "data.cascade !== true && data.multiple", label: "???????????????????????????", type: "switch", mode: "inline", className: "w-full" }, l.getSchemaTpl("joinValues"), l.getSchemaTpl("delimiter"), l.getSchemaTpl("extractValue"), l.getSchemaTpl("autoFill"), l.getSchemaTpl("creatable"), l.getSchemaTpl("api", { label: "??????????????????", name: "addApi" }), l.getSchemaTpl("editable"), l.getSchemaTpl("api", { label: "??????????????????", name: "editApi" }), l.getSchemaTpl("removable"), l.getSchemaTpl("api", { label: "??????????????????", name: "deleteApi" })] })], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(a(2).BasePlugin);
        t.TreeSelectControlPlugin = o, i.registerEditorPlugin(o)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.URLControlPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-url", t.$schema = "/schemas/TextControlSchema.json", t.name = "URL?????????", t.icon = "fa fa-link", t.description = "?????????????????????????????? URL", t.scaffold = { type: "input-url", label: "??????", name: "url" }, t.previewSchema = { type: "form", className: "text-left", mode: "horizontal", wrapWithPanel: !1, body: n.__assign({}, t.scaffold) }, t.panelTitle = "URL", t
            } return n.__extends(t, e), t
        }(a(23).TextControlPlugin);
        t.URLControlPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.YearControlPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "input-year", t.$schema = "/schemas/YearControlSchema.json", t.name = "Year", t.icon = "fa fa-calendar", t.description = "?????????", t.docLink = "/amis/zh-CN/components/form/year", t.tags = ["?????????"], t.scaffold = { type: "input-year", name: "year" }, t.previewSchema = { type: "form", wrapWithPanel: !1, body: [n.__assign({}, t.scaffold)] }, t.panelTitle = "Year", t
            } return n.__extends(t, e), t
        }(a(22).DateControlPlugin);
        t.YearControlPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ActionPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var a = /(?:\/|^)dialog\/.+$/.test(e.path);
                    /(?:\/|^)dropdown-button\/.+$/.test(e.path);
                    return [{ label: "????????????", type: "select", name: "actionType", pipeIn: s.defaultValue(""), options: [{ label: "??????", value: "" }, { label: "??????", value: "dialog" }, { label: "??????????????????Drawer???", value: "drawer" }, { label: "????????????", value: "ajax" }, { label: "????????????(????????????)", value: "link" }, { label: "????????????", value: "url" }, { label: "????????????", value: "reload" }, { label: "????????????", value: "copy" }, { label: "??????", value: "submit" }, { label: "??????", value: "reset" }, { label: "???????????????", value: "reset-and-submit" }, { label: "??????", value: "confirm" }, { label: "??????", value: "cancel" }, { label: "???????????????", value: "next" }, { label: "???????????????", value: "prev" }] }, { type: "input-text", name: "content", visibleOn: 'data.actionType == "copy"', label: "??????????????????" }, { type: "input-text", name: "target", visibleOn: 'data.actionType == "reload"', label: "??????????????????", required: !0 }, {
                        name: "dialog", pipeIn: s.defaultValue({ title: "????????????", body: "<p>????????????????????????</p>" }), asFormItem: !0, children: function (e) {
                            var a = e.value, o = e.onChange;
                            return "dialog" === e.data.actionType ? i.default.createElement(l.Button, { size: "sm", level: "danger", className: "m-b", onClick: function () { return t.manager.openSubEditor({ title: "??????????????????", value: n.__assign({ type: "dialog" }, a), onChange: function (e) { return o(e) } }) }, block: !0 }, "??????????????????") : null
                        }
                    }, {
                        visibleOn: 'data.actionType == "drawer"', name: "drawer", pipeIn: s.defaultValue({ title: "????????????", body: "<p>????????????????????????</p>" }), asFormItem: !0, children: function (e) {
                            var a = e.value, o = e.onChange;
                            return "drawer" == e.data.actionType ? i.default.createElement(l.Button, { size: "sm", level: "danger", className: "m-b", onClick: function () { return t.manager.openSubEditor({ title: "???????????????????????????", value: n.__assign({ type: "drawer" }, a), onChange: function (e) { return o(e) } }) }, block: !0 }, "???????????????????????????") : null
                        }
                    }, s.getSchemaTpl("api", { label: "??????API", visibleOn: 'data.actionType == "ajax"' }), {
                        name: "feedback", pipeIn: s.defaultValue({ title: "????????????", body: "<p>??????</p>" }), asFormItem: !0, children: function (e) {
                            var a = e.onChange, o = e.value;
                            return "ajax" == e.data.actionType ? i.default.createElement("div", { className: "m-b" }, i.default.createElement(l.Button, { size: "sm", level: o ? "danger" : "info", onClick: function () { return t.manager.openSubEditor({ title: "????????????????????????", value: n.__assign({ type: "dialog" }, o), onChange: function (e) { return a(e) } }) } }, "????????????????????????"), o ? i.default.createElement(l.Button, { size: "sm", level: "link", className: "m-l", onClick: function () { return a("") } }, "????????????") : null) : null
                        }
                    }, { name: "feedback.visibleOn", label: "?????????????????????", type: "input-text", visibleOn: "this.feedback", autoComplete: !1, description: "????????? JS ???????????????`this.xxx == 1`" }, { name: "feedback.skipRestOnCancel", label: "????????????????????????????????????", type: "switch", mode: "inline", className: "block", visibleOn: "this.feedback" }, { name: "feedback.skipRestOnConfirm", label: "????????????????????????????????????", type: "switch", mode: "inline", className: "block", visibleOn: "this.feedback" }, { type: "input-text", label: "????????????", name: "link", visibleOn: 'data.actionType == "link"' }, { type: "input-text", label: "????????????", name: "url", visibleOn: 'data.actionType == "url"', placeholder: "http://" }, { type: "switch", name: "blank", visibleOn: 'data.actionType == "url"', mode: "inline", className: "w-full", label: "????????????????????????", pipeIn: s.defaultValue(!0) }, a ? { visibleOn: 'data.actionType == "submit" || data.type == "submit"', name: "close", type: "switch", mode: "inline", className: "w-full", pipeIn: s.defaultValue(!0), label: "????????????????????????" } : null, { name: "confirmText", type: "textarea", label: "????????????", description: "???????????????????????????????????????????????????????????????????????????" }, { type: "input-text", name: "reload", label: "??????????????????", visibleOn: 'data.actionType != "link" && data.actionType != "url"', description: "???????????????????????????????????????????????????????????????????????????<code>xxx?a=\\${a}&b=\\${b}</code>??????????????????????????????????????????" }, { type: "input-text", name: "target", visibleOn: 'data.actionType != "reload"', label: "??????????????????", description: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" }]
                }, t
            } return n.__extends(t, e), t.prototype.buildEditorPanel = function (t, a) {
                if (!t.selections.length) if (~["action", "button", "submit", "reset", "sparkline"].indexOf(t.info.renderer.name)) {
                    var n = this.panelBodyCreator(t);
                    "sparkline" === t.info.renderer.name && (n = { name: "clickAction", type: "combo", label: "", noBorder: !0, multiLine: !0, body: n }), a.push({ key: "action", icon: "fa fa-gavel", title: "??????", render: this.manager.makeSchemaFormRender({ body: n }), order: 100 })
                } else e.prototype.buildEditorPanel.call(this, t, a)
            }, t
        }(r.BasePlugin);
        t.ActionPlugin = d, o.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.PagePlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "alert", t.$schema = "/schemas/AlertSchema.json", t.name = "??????", t.description = "?????????????????????????????????????????????????????????????????????????????????????????????????????? <code>visibleOn</code> ??????????????????????????????", t.docLink = "/amis/zh-CN/components/alert", t.icon = "fa fa-exclamation-circle", t.scaffold = { type: "alert", body: { type: "tpl", tpl: "????????????", inline: !1 }, level: "info" }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { className: "text-left", showCloseButton: !0 }), t.regions = [{ key: "body", label: "?????????", placeholder: "????????????" }], t.panelTitle = "??????", t.panelBody = o.getSchemaTpl("tabs", [{ title: "??????", body: [{ type: "switch", name: "showCloseButton", mode: "inline", className: "w-full", label: "??????????????????" }] }, { title: "??????", body: [{ label: "??????", name: "level", type: "select", options: [{ label: "??????", value: "info" }, { label: "??????", value: "success" }, { label: "??????", value: "warning" }, { label: "??????", value: "danger" }] }, o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }]), t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.PagePlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.AudioPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "audio", t.$schema = "/schemas/AudioSchema.json", t.name = "??????", t.description = "??????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-music", t.scaffold = { type: "audio", autoPlay: !1, src: "" }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var t = /\/field\/\w+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{
                        title: "??????", body: [t ? { type: "tpl", inline: !1, className: "text-info text-sm", tpl: "<p>????????????????????????????????????????????????????????????????????????</p>" } : null, { name: "src", type: "input-text", label: "????????????", description: "????????????????????????<code>\\${audioSrc}</code>" }, {
                            type: "select", name: "rates", label: "????????????", description: "???????????????0.1???16??????", multiple: !0, pipeIn: function (e) { return Array.isArray(e) ? e.join(",") : [] }, pipeOut: function (e) {
                                if (e && e.length) {
                                    var t = e.split(",");
                                    return t = t.filter((function (e) { return Number(e) && Number(e) > 0 && Number(e) <= 16 })).map((function (e) { return Number(Number(e).toFixed(1)) })), Array.from(new Set(t))
                                } return []
                            }, options: ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4"]
                        }, { name: "controls", type: "select", label: "????????????", multiple: !0, extractValue: !0, joinValues: !1, options: [{ label: "??????", value: "rates" }, { label: "??????", value: "play" }, { label: "??????", value: "time" }, { label: "??????", value: "process" }, { label: "??????", value: "volume" }], pipeIn: o.defaultValue(["rates", "play", "time", "process", "volume"]), labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: "????????????????????????????????????????????????????????????", placement: "left" } }, { name: "autoPlay", type: "switch", mode: "inline", className: "w-full", label: "????????????" }, { name: "loop", type: "switch", mode: "inline", className: "w-full", label: "????????????" }]
                    }, { title: "??????", body: [o.getSchemaTpl("className"), { name: "inline", type: "switch", mode: "inline", className: "w-full", label: "????????????", pipeIn: o.defaultValue(!0) }] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.AudioPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.AvatarPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "avatar", t.$schema = "/schemas/AvatarSchema.json", t.name = "??????", t.icon = "fa fa-user", t.description = "????????????", t.docLink = "/amis/zh-CN/components/avatar", t.tags = ["??????"], t.scaffold = { type: "avatar", icon: "fa fa-user" }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ type: "input-text", label: "??????", name: "text" }, { type: "select", label: "??????????????????", options: ["cover", "fill", "contain", "none", "scale-down"] }, { type: "radios", name: "shape", inline: !0, value: "circle", label: "??????", options: ["circle", "square"] }, { name: "icon", label: "??????", type: "icon-picker" }, { name: "size", label: "??????", value: 40, type: "input-number" }] }, { title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.AvatarPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ButtonGroupPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "button-group", t.$schema = "/schemas/ButtonGroupSchema.json", t.name = "?????????", t.description = "??????????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-object-group", t.docLink = "/amis/zh-CN/components/button-group", t.scaffold = { type: "button-group", buttons: [{ type: "button", label: "??????1", actionType: "dialog", dialog: { title: "????????????", body: "???????????????" } }, { type: "button", label: "??????2", actionType: "dialog", dialog: { title: "????????????", body: "???????????????" } }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "?????????", t.panelBody = [{ name: "buttons", type: "combo", label: "????????????", multiple: !0, addable: !0, minLength: 1, draggable: !0, draggableTip: "", editable: !1, visibleOn: "this.buttons && this.buttons.length", items: [{ type: "tpl", inline: !1, className: "p-t-xs", tpl: '<span class="label label-default"><% if (data.type === "button-group") { %> ????????? <% } else { %><%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%><% } %></span>' }], addButtonText: "????????????", scaffold: { type: "button", label: "??????" } }], t.regions = [{ key: "buttons", label: "?????????", renderMethod: "render", preferTag: "??????", insertPosition: "inner" }], t
            } return n.__extends(t, e), t
        }(a(2).BasePlugin);
        t.ButtonGroupPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ButtonToolbarPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "button-toolbar", t.$schema = "/schemas/ButtonToolbarSchema.json", t.name = "???????????????", t.description = "????????????????????????????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-ellipsis-h", t.scaffold = { type: "button-toolbar", buttons: [{ type: "button", label: "??????1", actionType: "dialog", dialog: { title: "????????????", body: "???????????????" } }, { type: "button", label: "??????2", actionType: "dialog", dialog: { title: "????????????", body: "???????????????" } }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "???????????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "buttons", type: "combo", label: "????????????", multiple: !0, addable: !0, draggable: !0, draggableTip: "???????????????????????????????????????????????????????????????", editable: !1, visibleOn: "this.buttons && this.buttons.length", items: [{ type: "tpl", inline: !1, className: "p-t-xs", tpl: '<span class="label label-default"><% if (data.type === "button-group") { %> ????????? <% } else { %><%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%><% } %></span>' }], addButtonText: "????????????", scaffold: { type: "button", label: "??????" } }] }, { title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.ButtonToolbarPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.BreadcrumbPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "breadcrumb", t.$schema = "/schemas/BreadcrumbSchema.json", t.name = "?????????", t.icon = "fa fa-list", t.description = "???????????????", t.docLink = "/amis/zh-CN/components/breadcrumb", t.tags = ["??????"], t.scaffold = { type: "breadcrumb", items: [{ label: "??????", href: "/", icon: "fa fa-home" }, { label: "????????????" }, { label: "<b>????????????</b>" }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ label: "?????????", type: "input-text", name: "separator" }, o.getSchemaTpl("api", { label: "????????????", name: "source" }), { label: "?????????", name: "items", type: "combo", multiple: !0, multiLine: !0, draggable: !0, addButtonText: "??????", items: [{ type: "input-text", placeholder: "??????", name: "label" }, { type: "input-text", name: "href", placeholder: "??????" }, { name: "icon", label: "??????", type: "icon-picker" }] }] }, { title: "??????", body: [o.getSchemaTpl("className"), o.getSchemaTpl("className", { name: "itemClassName", label: "???????????? CSS ??????" }), , o.getSchemaTpl("className", { name: "separatorClassName", label: "???????????? CSS ??????" })] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.BreadcrumbPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CardPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = n.__importDefault(a(18)), u = a(13), p = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "card", t.$schema = "/schemas/CardSchema.json", t.name = "??????", t.description = "?????????????????????", t.tags = ["??????"], t.icon = "", t.scaffold = { type: "card", header: { title: "??????", subTitle: "?????????" }, body: "??????", actions: [{ type: "button", label: "??????", actionType: "dialog", dialog: { title: "??????", body: "??????" } }] }, t.previewSchema = n.__assign({}, t.scaffold), t.regions = [{ key: "body", label: "?????????", renderMethod: "renderBody", preferTag: "??????" }, { key: "actions", label: "?????????", renderMethod: "renderActions", wrapperResolve: function (e) { return e }, preferTag: "??????" }], t.panelTitle = "??????", t.panelBodyCreator = function (e) { return [s.getSchemaTpl("tabs", [{ title: "??????", body: d.default([{ children: i.default.createElement(l.Button, { size: "sm", className: "m-b-sm", level: "info", block: !0, onClick: function () { return t.manager.showInsertPanel("actions", e.id) } }, "????????????") }, { children: i.default.createElement("div", null, i.default.createElement(l.Button, { block: !0, level: "primary", size: "sm", onClick: function () { return t.manager.showInsertPanel("body", e.id) } }, "????????????")) }, { type: "divider" }, { name: "header.title", type: "input-text", label: "??????", description: "???????????????????????? <code>\\${xxx}</code>" }, { name: "header.subTitle", type: "input-text", label: "?????????", description: "???????????????????????? <code>\\${xxx}</code>" }, { name: "header.avatar", type: "input-text", label: "????????????", description: "???????????????????????? <code>\\${xxx}</code>" }, { name: "header.desc", type: "textarea", label: "??????", description: "???????????????????????? <code>\\${xxx}</code>" }, { name: "header.highlight", type: "input-text", label: "?????????????????????", description: "?????? <code>this.isOwner</code>" }]) }, { title: "??????", body: [{ type: "input-range", name: "actionsCount", pipeIn: s.defaultValue(4), min: 1, max: 10, step: 1, label: "????????????????????????????????????" }, s.getSchemaTpl("className", { name: "titleClassName", label: "?????? CSS ??????" }), s.getSchemaTpl("className", { name: "highlightClassName", label: "?????? CSS ??????" }), s.getSchemaTpl("className", { name: "subTitleClassName", label: "????????? CSS ??????" }), s.getSchemaTpl("className", { name: "descClassName", label: "?????? CSS ??????" }), s.getSchemaTpl("className", { name: "avatarClassName", label: "???????????? CSS ??????" }), s.getSchemaTpl("className", { name: "imageClassName", label: "?????? CSS ??????" }), s.getSchemaTpl("className", { name: "bodyClassName", label: "????????? CSS ??????" }), s.getSchemaTpl("className")] }, { title: "??????", body: [s.getSchemaTpl("ref"), s.getSchemaTpl("visible")] }])] }, t.fieldWrapperResolve = function (e) { return e }, t.overrides = {
                    renderFeild: function (e, t, a, n) {
                        var l = this.super(e, t, a, n), o = this.props.$$editor;
                        if (!o || !t.$$id) return l;
                        var r = o.plugin, s = t.$$id;
                        return i.default.createElement(u.VRenderer, { plugin: o.plugin, renderer: o.renderer, multifactor: !0, key: s, $schema: "/schemas/CardBodyField.json", hostId: o.id, memberIndex: a, name: "??????" + (a + 1), id: s, draggable: !1, wrapperResolve: r.fieldWrapperResolve, schemaPath: o.schemaPath + "/body/" + a, path: this.props.$path + "/" + a, data: this.props.data }, l)
                    }
                }, t.vRendererConfig = { panelTitle: "??????", panelBodyCreator: function (e) { return [s.getSchemaTpl("label"), s.getSchemaTpl("className", { name: "labelClassName", label: "Label CSS ??????", visibleOn: "this.label" }), { children: i.default.createElement(l.Button, { size: "sm", level: "info", className: "m-b", block: !0, onClick: t.exchangeRenderer.bind(t, e.id) }, "?????????????????????") }] } }, t
            } return n.__extends(t, e), t.prototype.exchangeRenderer = function (e) { this.manager.showReplacePanel(e, "??????") }, t.prototype.beforeInsert = function (e) {
                var t, a, l, i, o = e.context;
                o.info.plugin !== this && (null === (t = o.node.sameIdChild) || void 0 === t ? void 0 : t.info.plugin) !== this || "body" !== o.region || (o.data = n.__assign(n.__assign({}, o.data), { label: null !== (i = null !== (a = o.data.label) && void 0 !== a ? a : null === (l = o.subRenderer) || void 0 === l ? void 0 : l.name) && void 0 !== i ? i : "?????????" }))
            }, t
        }(r.BasePlugin);
        t.CardPlugin = p, o.registerEditorPlugin(p)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CardsPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(6), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "cards", t.$schema = "/schemas/CardsSchema.json", t.name = "????????????", t.description = "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???CRUD??? ?????????", t.tags = ["??????"], t.icon = "fa fa-window-maximize", t.scaffold = { type: "cards", data: { items: [{ a: 1, b: 2 }, { a: 3, b: 4 }] }, columnsCount: 2, card: { type: "card", className: "m-b-none", header: { title: "??????", subTitle: "?????????" }, body: [{ name: "a", label: "A" }, { name: "b", label: "B" }], actions: [{ label: "??????", type: "button" }] } }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { className: "text-left " }), t.panelTitle = "?????????", t.panelBodyCreator = function (e) {
                    var a = "crud" === e.schema.type;
                    return [s.getSchemaTpl("tabs", [{ title: "??????", body: [{ children: i.default.createElement("div", { className: "m-b" }, i.default.createElement(l.Button, { level: "success", size: "sm", block: !0, onClick: t.editDetail.bind(t, e.id) }, "??????????????????")) }, { type: "divider" }, { name: "title", type: "input-text", label: "??????" }, a ? null : { name: "source", type: "input-text", label: "?????????", pipeIn: s.defaultValue("${items}"), description: "????????????????????????", test: !a }, { name: "placeholder", value: "????????????", type: "input-text", label: "???????????????" }] }, { title: "??????", body: [{ name: "showHeader", type: "switch", mode: "inline", className: "block", label: "??????????????????", pipeIn: s.defaultValue(!0) }, { name: "showFooter", type: "switch", mode: "inline", className: "block", label: "??????????????????", pipeIn: s.defaultValue(!0) }, s.getSchemaTpl("className", { label: "CSS ??????" }), s.getSchemaTpl("className", { name: "headerClassName", label: "?????? CSS ??????" }), s.getSchemaTpl("className", { name: "footerClassName", label: "?????? CSS ??????" }), s.getSchemaTpl("className", { name: "itemsClassName", label: "?????? CSS ??????" }), s.getSchemaTpl("className", { pipeIn: s.defaultValue("Grid-col--sm6 Grid-col--md4 Grid-col--lg3"), name: "itemClassName", label: "?????? CSS ??????" }), { name: "columnsCount", type: "input-range", visibleOn: "!this.leftFixed", min: 0, max: 12, step: 1, label: "??????????????????", description: "???????????????????????? CSS ????????????" }, { name: "masonryLayout", type: "switch", mode: "inline", label: "???????????????" }] }, { title: "??????", body: [s.getSchemaTpl("ref"), s.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t.prototype.editDetail = function (e) {
                var t = this.manager, a = t.store, l = a.getNodeById(e), i = a.getValueOf(e);
                l && i && this.manager.openSubEditor({ title: "?????????????????????", value: n.__assign({ type: "card" }, i.card), slot: { type: "container", body: "$$" }, typeMutable: !1, onChange: function (e) { e = n.__assign(n.__assign({}, i), { card: e }), t.panelChangeValue(e, d.diff(i, e)) }, data: { item: "mocked data", index: 0 } })
            }, t.prototype.buildEditorToolbar = function (e, t) {
                var a = e.id, n = e.info, l = e.schema;
                ("cards" === n.renderer.name || "crud" === n.renderer.name && "cards" === l.mode) && t.push({ icon: "fa fa-expand", order: 100, tooltip: "?????????????????????", onClick: this.editDetail.bind(this, a) })
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a = e.id, n = e.schema, l = (e.region, e.info);
                ("cards" === l.renderer.name || "crud" === l.renderer.name && "cards" === n.mode) && t.push("|", { label: "?????????????????????", onSelect: this.editDetail.bind(this, a) })
            }, t.prototype.filterProps = function (e) {
                var t = n.__assign(n.__assign({}, e.defaultData), e.data), a = Array.isArray(e.value) ? e.value : "string" == typeof e.source ? l.resolveVariable(e.source, t) : l.resolveVariable("${items}", t);
                if (!Array.isArray(a) || !a.length) { e.value = d.repeatArray({ id: 666, title: "?????????", description: "?????????", a: "?????????", b: "?????????" }, 1).map((function (e, t) { return n.__assign(n.__assign({}, e), { id: t + 1 }) })) } var i = e.$schema, o = n.__rest(e, ["$schema"]);
                return n.__assign(n.__assign({}, d.JSONPipeOut(o)), { $schema: i })
            }, t.prototype.getRendererInfo = function (t) {
                var a, l = t.renderer, i = t.schema;
                return i.$$id || "crud" !== (null === (a = i.$$editor) || void 0 === a ? void 0 : a.renderer.name) || "cards" !== l.name ? e.prototype.getRendererInfo.call(this, t) : n.__assign(n.__assign({}, { id: i.$$editor.id }), { name: this.name, regions: this.regions, patchContainers: this.patchContainers, vRendererConfig: this.vRendererConfig, wrapperProps: this.wrapperProps, wrapperResolve: this.wrapperResolve, filterProps: this.filterProps, $schema: this.$schema, renderRenderer: this.renderRenderer })
            }, t
        }(r.BasePlugin);
        t.CardsPlugin = u, o.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CarouselPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = a(16), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "carousel", t.$schema = "/schemas/CarouselSchema.json", t.name = "?????????", t.description = "?????????????????????????????????????????????????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-images", t.scaffold = { type: "carousel", options: [{ image: r.mockValue({ type: "image" }) }, { html: '<div style="width: 100%;height: 300px;background: #e3e3e3;text-align: center;line-height: 300px;">carousel data</div>' }, { image: r.mockValue({ type: "image" }) }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "?????????", t.panelBodyCreator = function (e) {
                    var t = /\/field\/\w+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: [t ? { type: "tpl", inline: !1, className: "text-info text-sm", tpl: "<p>????????????????????????????????????????????????????????????????????????</p>" } : null, { type: "formula", name: "__mode", autoSet: !1, formula: "!this.name && !this.source && Array.isArray(this.options) ? 2 : 1" }, { label: "?????????", name: "__mode", type: "button-group-select", size: "xs", mode: "inline", className: "w-full", options: [{ label: "????????????", value: 1 }, { label: "????????????", value: 2 }] }, { label: "?????????", name: "name", type: "input-text", description: "????????????????????????????????????????????????????????????", visibleOn: "this.__mode == 1" }, { type: "combo", name: "options", visibleOn: "this.__mode == 2", label: "??????????????????", multiple: !0, multiLine: !0, addable: !0, removable: !0, typeSwitchable: !1, conditions: [{ label: "??????", test: 'this.type === "image"', items: [o.getSchemaTpl("imageUrl", { name: "content" }), { type: "input-text", label: "????????????", name: "title", visibleOn: 'this.type == "image"' }, o.getSchemaTpl("className", { label: "??????????????????", name: "titleClassName", visibleOn: 'this.type == "image"' }), { type: "textarea", label: "????????????", name: "description", visibleOn: 'this.type == "image"' }, o.getSchemaTpl("className", { label: "??????????????????", name: "descriptionClassName", visibleOn: 'this.type == "image"' })], scaffold: { type: "input-image", image: "" } }, { label: "HTML", test: 'this.type === "html"', items: [o.getSchemaTpl("richText", { label: "??????", name: "content" })], scaffold: { type: "html", content: "<p>html ??????</p>" } }], pipeIn: function (e) { return Array.isArray(e) && e.length ? e.map((function (e) { return e && e.hasOwnProperty("html") ? { type: "html", content: e.html } : { type: "image", content: e.image, title: e.title, titleClassName: e.titleClassName, description: e.description, descriptionClassName: e.descriptionClassName } })) : [] }, pipeOut: function (e, t, a) { return Array.isArray(e) && e.length ? e.map((function (e) { return "html" === e.type ? { html: e.content } : { image: e.content, title: e.title, titleClassName: e.titleClassName, description: e.description, descriptionClassName: e.descriptionClassName } })) : [] } }] }, { title: "??????", body: [{ name: "auto", type: "switch", mode: "inline", className: "w-full", label: "????????????", pipeIn: o.defaultValue(!0) }, { name: "interval", type: "input-range", label: "????????????", min: 1, max: 100, step: 1, unit: "s", pipeIn: function (e) { return (null != e ? e : 3e3) / 1e3 }, pipeOut: function (e, t, a) { return 1e3 * e } }, { name: "duration", type: "input-range", label: "????????????", min: 100, max: 2e3, step: 10, pipeIn: o.defaultValue(500), unit: "ms" }, { name: "animation", label: "????????????", type: "button-group-select", mode: "inline", className: "w-full", size: "sm", pipeIn: o.defaultValue("fade"), options: [{ label: "fade", value: "fade" }, { label: "slide", value: "slide" }] }, { name: "controlsTheme", label: "??????????????????", type: "button-group-select", size: "sm", pipeIn: o.defaultValue("light"), mode: "inline", className: "w-full", options: [{ label: "light", value: "light" }, { label: "dark", value: "dark" }] }, { name: "controls", label: "????????????", type: "button-group-select", size: "sm", mode: "inline", className: "w-full", pipeIn: o.defaultValue("dots,arrows"), multiple: !0, options: [{ label: "????????????", value: "dots" }, { label: "????????????", value: "arrows" }] }, { name: "width", type: "input-text", label: "??????", validations: "isNumeric", addOn: { type: "button", label: "px" } }, { name: "height", type: "input-text", label: "??????", validations: "isNumeric", addOn: { type: "button", label: "px" } }, o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t.prototype.filterProps = function (e) { return e.auto = !1, e }, t.prototype.buildEditorToolbar = function (e, t) {
                if (e.info.plugin === this && "carousel" === e.info.renderer.name && !e.info.hostId) {
                    var a = e.node;
                    t.push({
                        level: "secondary", icon: "fa fa-chevron-left", tooltip: "????????????", onClick: function () {
                            var e, t = a.getComponent();
                            null === (e = null == t ? void 0 : t.prev) || void 0 === e || e.call(t)
                        }
                    }), t.push({
                        level: "secondary", icon: "fa fa-chevron-right", tooltip: "????????????", onClick: function () {
                            var e, t = a.getComponent();
                            null === (e = null == t ? void 0 : t.next) || void 0 === e || e.call(t)
                        }
                    })
                }
            }, t
        }(i.BasePlugin);
        t.CarouselPlugin = s, l.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ChartPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(6), u = n.__importDefault(a(28)), p = function (e) {
            var t = e.value, a = e.onChange;
            return i.default.createElement("div", { className: "ae-JsonEditor" }, i.default.createElement(u.default, { value: t, onChange: a }))
        }, c = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "chart", t.$schema = "/schemas/ChartSchema.json", t.name = "??????", t.description = "??????????????????????????? echarts ????????????????????? echarts ??????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-pie-chart", t.scaffold = { type: "chart", config: { xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }, yAxis: { type: "value" }, series: [{ data: [820, 932, 901, 934, 1290, 1330, 1320], type: "line" }] }, replaceChartOption: !0 }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    return [s.getSchemaTpl("tabs", [{
                        title: "??????", body: [s.getSchemaTpl("api", { label: "????????????", description: "???????????????????????????????????????????????????????????????????????? Echarts ?????????" }), { label: "??????????????????", type: "switch", name: "initFetch", visibleOn: "data.api", pipeIn: s.defaultValue(!0), mode: "inline", className: "block" }, { name: "interval", label: "??????????????????", type: "input-number", step: 500, visibleOn: "data.api", description: "???????????????????????????????????????3000, ?????? ms" }, { name: "config", asFormItem: !0, component: p, label: "Echarts ??????", description: "????????????????????????????????????????????????????????????" }, {
                            name: "clickAction", asFormItem: !0, children: function (a) {
                                var n = a.onChange, o = a.value;
                                return i.default.createElement("div", { className: "m-b" }, i.default.createElement(l.Button, { size: "sm", level: o ? "danger" : "info", onClick: t.editDrillDown.bind(t, e.id) }, "?????? DrillDown"), o ? i.default.createElement(l.Button, { size: "sm", level: "link", className: "m-l", onClick: function () { return n("") } }, "?????? DrillDown") : null)
                            }
                        }, { name: "dataFilter", type: "js-editor", allowFullscreen: !0, label: "????????????", size: "lg", description: "\n              ?????????????????????????????? Echart ????????????????????????????????????????????????\n              <p>?????????(config, echarts, data) => config</p>\n              <p>????????????</p>\n              <ul>\n              <li><code>config</code> ????????????</li>\n              <li><code>echarts</code> echarts ??????</li>\n              <li><code>data</code> ????????????????????????????????????????????????????????????????????????</li>\n              </ul>\n              <p>??????</p>\n              <pre>debugger;// ??????????????????????????????\n\n// ??????????????????\nconsole.log(config)\n\n// ?????????????????? \nreturn {}</pre>\n              " }, { label: "Chart ?????????????????????", labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: "???????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, name: "replaceChartOption", type: "switch", mode: "inline", className: "block" }]
                    }, { title: "??????", body: [s.getSchemaTpl("className")] }, { title: "??????", body: [s.getSchemaTpl("ref"), s.getSchemaTpl("name"), s.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t.prototype.editDrillDown = function (e) {
                var t = this.manager, a = t.store, l = a.getNodeById(e), i = a.getValueOf(e), o = i.clickAction && i.clickAction.dialog || { title: "??????", body: ["<p>?????? <code>${value|json}</code></p>"] };
                l && i && this.manager.openSubEditor({ title: "?????? DrillDown ??????", value: n.__assign({ type: "container" }, o), slot: { type: "container", body: "$$" }, typeMutable: !1, onChange: function (e) { e = n.__assign(n.__assign({}, i), { clickAction: { actionType: "dialog", dialog: e } }), t.panelChangeValue(e, d.diff(i, e)) } })
            }, t
        }(r.BasePlugin);
        t.ChartPlugin = c, o.registerEditorPlugin(c)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CollapsePlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "collapse", t.$schema = "/schemas/CollapseSchema.json", t.name = "?????????", t.description = "?????????????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-window-minimize", t.scaffold = { type: "collapse", body: "??????", title: "??????" }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "title", label: "??????", type: "input-text", required: !0 }, { name: "collapsable", type: "switch", mode: "inline", className: "w-full", label: "???????????????", pipeIn: o.defaultValue(!0) }, { name: "collapsed", type: "switch", mode: "inline", className: "w-full", label: "???????????????" }] }, { title: "??????", body: [o.getSchemaTpl("className", { pipeIn: o.defaultValue("bg-white wrapper") }), o.getSchemaTpl("className", { name: "headingClassName", label: "?????? CSS ??????", pipeIn: o.defaultValue("font-thin b-b b-light text-lg p-b-xs") }), o.getSchemaTpl("className", { name: "bodyClassName", label: "?????? CSS ??????" })] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.CollapsePlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ContainerPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "container", t.$schema = "/schemas/ContainerSchema.json", t.name = "??????", t.description = "??????????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-square-o", t.scaffold = { type: "container", body: "??????" }, t.previewSchema = n.__assign({}, t.scaffold), t.regions = [{ key: "body", label: "?????????" }], t.panelTitle = "??????", t.panelBodyCreator = function (e) { return [o.getSchemaTpl("tabs", [{ title: "??????", body: [o.getSchemaTpl("className")] }])] }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.ContainerPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CRUDPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(150)), o = n.__importDefault(a(151)), r = n.__importDefault(a(4)), s = a(1), d = a(2), u = a(3), p = a(6), c = a(9), m = a(10), h = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "crud", t.$schema = "/schemas/CRUDSchema.json", t.order = -1e3, t.name = "???????????????API???", t.description = "??????????????????????????????????????????????????????????????????table???cards???list. ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/crud", t.tags = ["??????", "??????"], t.icon = "fa fa-table", t.scaffold = { type: "crud", api: "", columns: [{ name: "id", label: "ID", type: "text" }, { name: "engine", label: "????????????", type: "text" }], bulkActions: [], itemActions: [] }, t.sampleBuilder = function (e) {
                    var t = { items: [], total: 0 };
                    if (Array.isArray(e.columns)) {
                        var a = {};
                        e.columns.forEach((function (e) { e.name && c.setVariable(a, e.name, "sample") })), t.items.push(a)
                    } return JSON.stringify({ status: 0, msg: "", data: t }, null, 2)
                }, t.btnSchemas = { create: { label: "??????", type: "button", actionType: "dialog", dialog: { title: "??????", body: { type: "form", api: "xxx/create", body: [{ label: "??????1", text: "??????1", type: "input-text" }] } } }, update: { label: "??????", type: "button", actionType: "dialog", level: "link", dialog: { title: "??????", body: { type: "form", api: "xxx/update", body: [{ label: "??????1", text: "??????1", type: "input-text" }] } } }, view: { label: "??????", type: "button", actionType: "dialog", level: "link", dialog: { title: "????????????", body: { type: "form", body: [{ label: "??????1", text: "??????1", type: "input-text" }] } } }, delete: { type: "button", label: "??????", actionType: "ajax", level: "link", className: "text-danger", confirmText: "??????????????????", api: "/xxx/delete" }, bulkDelete: { type: "button", level: "danger", label: "????????????", actionType: "ajax", confirmText: "??????????????????", api: "/xxx/batch-delete" }, bulkUpdate: { type: "button", level: "danger", label: "????????????", actionType: "dialog", dialog: { title: "????????????", size: "md", body: { type: "form", api: "/xxx/bacth-edit", body: [{ label: "??????1", text: "??????1", type: "input-text" }] } } }, filter: { title: "????????????", body: [{ type: "input-text", name: "keywords", label: "?????????" }] } }, t.scaffoldForm = {
                    title: "????????????????????????-CRUD", body: [{ name: "api", type: "input-text", label: "????????????", placeholder: "http://", labelRemark: t.sampleBuilder ? { icon: "", label: "??????", placement: "right", title: "??????????????????", tooltipClassName: "ae-ApiSample-tooltip", render: function (e) { return r.default.createElement(l.Html, { className: "ae-ApiSample", inline: !1, html: "\n                  <pre><code>" + t.sampleBuilder(e) + "</code></pre>\n                  " }) }, trigger: "click", className: "m-l-xs", rootClose: !0 } : void 0 }, {
                        name: "panelTarget", type: "panel", bodyClassName: "p-0", actionsClassName: "p-0", body: [{ visibleOn: "data.api && data.rows && !data.rows.length", type: "alert", className: "w-full mt-4", body: { type: "html", html: 'API???????????????????????????????????????API?????????????????????????????????????????????<code><a target="_blank" href="//baidu.gitee.io/amis/zh-CN/docs/types/api">API??????</a>??????<a href="https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample" target="_blank">??????API</a>?????????</code>' }, level: "danger" }, { visibleOn: "data.errorMsg", type: "alert", className: "w-full mt-4", body: { type: "html", html: "${errorMsg}" }, level: "danger" }], actions: [{
                            type: "button", label: "???????????????????????????", onClick: function (e, a) {
                                var l = a.store, i = a.data, o = m.getEnv(window.editorStore).schemaFilter, r = "${api | raw}";
                                o && (r = o({ api: i.api }).api);
                                var s = { actionType: "ajax", api: r };
                                l.setCurrentAction(s), l.saveRemote(s.api, a.data).then((function (e) {
                                    return n.__awaiter(t, void 0, void 0, (function () {
                                        var t, l;
                                        return n.__generator(this, (function (n) { return t = [], (null === (l = e.rows) || void 0 === l ? void 0 : l.length) && (Object.keys(e.rows[0]).forEach((function (e) { t.push({ label: e, type: "text", name: e }) })), a.formStore.setValues({ columns: t }), i.features && -1 !== i.features.indexOf("filter") && a.formStore.setValues({ filterSettingSource: t.map((function (e) { return { label: e.label, value: e.name } })) })), [2] }))
                                    }))
                                })).catch((function (e) { a.formStore.setValues({ errorMsg: e }) }))
                            }
                        }]
                    }, { name: "features", label: "????????????", type: "checkboxes", joinValues: !1, extractValue: !0, inline: !0, itemClassName: "max-w-lg", options: [{ label: "??????", value: "create" }, { label: "??????", value: "filter" }, { label: "????????????", value: "bulkDelete" }, { label: "????????????", value: "bulkUpdate" }, { label: "?????????-??????", value: "update" }, { label: "?????????-????????????", value: "view" }, { label: "?????????-??????", value: "delete" }] }, { type: "divider", visibleOn: "features.filter" }, { type: "checkboxes", label: "??????????????????????????????????????????????????????????????????", name: "filterEnabledList", joinValues: !1, source: "${filterSettingSource}", visibleOn: "features.filter" }, { type: "divider", visibleOn: "features.filter" }, { name: "columns", type: "input-table", label: !1, addable: !0, editable: !0, columns: [{ type: "input-text", name: "label", label: "??????" }, { type: "input-text", name: "name", label: "???????????????" }, { type: "select", name: "type", label: "??????", value: "text", options: [{ value: "text", label: "?????????" }, { value: "tpl", label: "??????" }, { value: "image", label: "??????" }, { value: "date", label: "??????" }, { value: "progress", label: "??????" }, { value: "status", label: "??????" }, { value: "mapping", label: "??????" }, { value: "operation", label: "?????????" }] }] }], pipeOut: function (e) {
                        var a = o.default(e), l = a.features, r = { type: "operation", label: "??????", buttons: [] }, s = ["update", "view", "delete"], d = i.default(l, "length");
                        a.bulkActions = [], d && l.forEach((function (l) {
                            var i = o.default(t.btnSchemas[l]);
                            if (s.includes(l)) {
                                var d = i;
                                "delete" !== l && (d.dialog.body.body = e.columns.filter((function (e) {
                                    var t = e.type;
                                    return "progress" !== t && "operation" !== t
                                })).map((function (e) {
                                    var t = e.type, a = n.__rest(e, ["type"]);
                                    return n.__assign(n.__assign({}, a), { type: "tpl" === t ? "input-text" : "status" === t || "mapping" === t ? "select" : "input-" + t })
                                }))), t.addItem(r.buttons, d)
                            } else {
                                l.includes("bulk") && t.addItem(a.bulkActions, i), "create" === l && (a.headerToolbar = [t.btnSchemas[l], "bulkActions", "pagination"]);
                                var u = Object.keys(a.filter || {});
                                "filter" !== l || u.length || (a.filterEnabledList ? (a.filter = { title: "????????????" }, a.filter.body = a.filterEnabledList.map((function (e) { return { type: "input-text", label: e.label, name: e.value } }))) : a.filter = i)
                            }
                        }));
                        var u = a.columns.find((function (e) { return "operation" === e.type }));
                        return d && !u && a.columns.push(r), a
                    }, canRebuild: !0
                }, t.multifactor = !0, t.previewSchema = { syncLocation: !1, type: "crud", className: "text-left", bodyClassName: "m-b-none", affixHeader: !1, data: { items: [{ a: 1, b: 2 }, { a: 3, b: 4 }, { a: 5, b: 6 }] }, source: "${items}", columns: [{ label: "A", name: "a" }, { label: "B", name: "b" }, { type: "operation", label: "??????", buttons: [{ icon: "fa fa-eye", type: "button" }, { icon: "fa fa-edit", type: "button" }] }] }, t.panelTitle = "????????????", t.panelBodyCreator = function (e) {
                    t.manager.store;
                    var a = e.id;
                    return u.getSchemaTpl("tabs", [{
                        title: "??????", body: [{ name: "filter", type: "switch", mode: "inline", className: "block", label: "??????????????????", pipeIn: function (e) { return !!e }, pipeOut: function (e, a) { return e ? t.oldFilter || p.JSONPipeIn({ title: "????????????", body: [{ type: "input-text", name: "keywords", label: "?????????" }] }) : (t.oldFilter = a, null) } }, { type: "divider" }, {
                            label: "????????????", name: "bulkActions", type: "combo", hiddenOn: "data.pickerMode && data.multiple", inputClassName: "ae-BulkActions-control", multiple: !0, draggable: !0, draggableTip: "", scaffold: { label: "??????", type: "button" }, labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, items: [{ type: "tpl", tpl: '<span class="label label-success">${label}</span>', columnClassName: "p-t-xs" }, {
                                columnClassName: "p-t-xs col-edit", children: function (e) {
                                    var n = e.index;
                                    return r.default.createElement("button", { onClick: t.handleBulkActionEdit.bind(t, a, n), "data-tooltip": "??????", "data-position": "bottom", className: "text-muted" }, r.default.createElement("i", { className: "fa fa-pencil" }))
                                }
                            }]
                        }, { type: "divider" }, {
                            label: "????????????", name: "itemActions", type: "combo", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, hiddenOn: 'this.mode && this.mode !== "table" || this.pickerMode', inputClassName: "ae-BulkActions-control", multiple: !0, draggable: !0, scaffold: { label: "??????", type: "button" }, items: [{ type: "tpl", tpl: '<span class="label label-success">${label}</span>', columnClassName: "p-t-xs" }, { type: "checkbox", className: "text-xs", option: "????????????", name: "hiddenOnHover" }, {
                                columnClassName: "p-t-xs col-edit", children: function (e) {
                                    var n = e.index;
                                    return r.default.createElement("button", { onClick: t.handleItemActionEdit.bind(t, a, n), "data-tooltip": "??????", "data-position": "bottom", className: "text-muted" }, r.default.createElement("i", { className: "fa fa-pencil" }))
                                }
                            }]
                        }, { type: "divider", hiddenOn: 'this.mode && this.mode !== "table" || this.pickerMode' }, { name: "syncLocation", label: "???????????????", type: "switch", mode: "inline", className: "block", pipeIn: u.defaultValue(!0), labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" } }, {
                            label: "????????????", type: "combo", name: "defaultParams", multiple: !0, labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "??????????????????????????????????????? <code>perPage:20</code>", placement: "left" }, pipeIn: function (e) {
                                if (!p.isObject(e)) return e;
                                var t = [];
                                return Object.keys(e).forEach((function (a) { "$$id" != a && t.push({ key: a || "", value: "string" == typeof e[a] ? e[a] : JSON.stringify(e[a]) }) })), t
                            }, pipeOut: function (e) {
                                if (!Array.isArray(e)) return e;
                                var t = {};
                                return e.forEach((function (e) {
                                    var a = e.key || "", n = e.value;
                                    try { n = JSON.parse(n) } catch (e) { } t[a] = n
                                })), t
                            }, items: [{ placeholder: "Key", type: "input-text", unique: !0, name: "key", required: !0 }, { placeholder: "Value", type: "input-text", name: "value" }]
                        }, { type: "divider" }, { name: "keepItemSelectionOnPageChange", label: "??????????????????", type: "switch", mode: "inline", className: "block", visbileOn: "this.bulkActions && this.bulkActions.length || this.itemActions && this.itemActions.length", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" } }, { name: "labelTpl", type: "input-text", label: "??????????????????", visibleOn: "this.keepItemSelectionOnPageChange", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" } }, { name: "primaryField", label: "????????????", type: "input-text", pipeIn: u.defaultValue("id"), description: "??????<code>id</code>???????????????????????????????????????" }]
                    }, {
                        title: "??????", body: [u.getSchemaTpl("api", {
                            label: "??????????????????", sampleBuilder: function (e) {
                                var t = { items: [], total: 0 };
                                if (Array.isArray(e.columns)) {
                                    var a = {};
                                    e.columns.forEach((function (e) { e.name && c.setVariable(a, e.name, "sample") })), t.items.push(a)
                                } return JSON.stringify({ status: 0, msg: "", data: t }, null, 2)
                            }
                        }), { name: "initFetch", type: "radios", label: "??????????????????", pipeIn: function (e) { return "boolean" == typeof e && e || "boolean" != typeof e && "" }, inline: !0, onChange: function () { document.getElementsByClassName("ae-Settings-content")[0].scrollTop = 0 }, options: [{ label: "???", value: !0 }, { label: "???", value: !1 }, { label: "?????????", value: "" }] }, { name: "initFetch", autoComplete: !1, visibleOn: 'typeof this.initFetch !== "boolean"', type: "input-text", placeholder: "??? JS ??????????????????", className: "m-t-n-sm" }, { name: "loadDataOnce", label: "???????????????", type: "switch", mode: "inline", className: "block", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" } }, { label: "??????????????????", type: "switch", name: "interval", visibleOn: "data.api", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? 3e3 : void 0 }, mode: "inline", className: "block" }, { name: "interval", type: "input-number", visibleOn: 'typeof data.interval === "number"', step: 500, className: "m-t-n-sm", description: "??????????????????????????????????????? ms" }, { name: "silentPolling", label: "????????????", type: "switch", mode: "inline", visibleOn: "!!data.interval", description: "???????????????????????????????????????loading" }, { name: "stopAutoRefreshWhen", label: "?????????????????????????????????", type: "input-text", visibleOn: "!!data.interval", description: "???????????????????????????????????????????????????????????????????????????????????????????????????" }, { name: "stopAutoRefreshWhenModalIsOpen", label: "?????????????????????????????????", type: "switch", visibleOn: "!!data.interval", mode: "inline", className: "block", description: "??????????????????????????????????????????????????????" }, { type: "divider" }, { name: "draggable", label: "?????????????????????", type: "switch", mode: "inline", className: "block" }, u.getSchemaTpl("api", { label: "??????????????????", name: "saveOrderApi", visibleOn: "data.draggable" }), { type: "divider" }, u.getSchemaTpl("api", { label: "??????????????????", name: "quickSaveApi", description: "??? column ??????????????????????????????????????????????????????????????????" }), { type: "divider" }, u.getSchemaTpl("api", { label: "????????????????????????", name: "quickSaveItemApi", description: "??? column ????????????????????????????????????????????????????????????????????????????????????" }), { type: "divider" }, { label: "??????????????????", type: "combo", name: "messages", multiLine: !0, description: "???????????????????????????????????????????????? api ????????? message", items: [{ label: "??????????????????", type: "input-text", name: "fetchSuccess" }, { label: "??????????????????", type: "input-text", name: "fetchFailed" }, { label: "????????????????????????", type: "input-text", name: "saveOrderSuccess" }, { label: "????????????????????????", type: "input-text", name: "saveOrderFailed" }, { label: "????????????????????????", type: "input-text", name: "quickSaveSuccess" }, { label: "????????????????????????", type: "input-text", name: "quickSaveFailed" }] }]
                    }, {
                        title: "??????", body: [{
                            label: "??????????????????", name: "mode", type: "button-group-select", size: "xs", pipeIn: function (e, t) {
                                var a;
                                return null !== (a = "grid" === e ? "cards" : e) && void 0 !== a ? a : "table"
                            }, onChange: function (e, t, a, n) {
                                var l, i, r, s, d, u, p = null === (i = null === (l = null == n ? void 0 : n.data) || void 0 === l ? void 0 : l.headerToolbar) || void 0 === i ? void 0 : i.some((function (e) { return "columns-toggler" === e.type })), c = o.default(null === (r = null == n ? void 0 : n.data) || void 0 === r ? void 0 : r.headerToolbar);
                                "table" !== e && "table" === t && (u = (null == c ? void 0 : c.find((function (e) { return "columns-toggler" === e.type }))) || { type: "columns-toggler", align: "right" }, n.setValues({ __headerHasColumnsToggler: p })), c = "table" === e ? c : null == c ? void 0 : c.filter((function (e) { return "columns-toggler" !== e.type })), "table" === e ? ((null === (s = null == n ? void 0 : n.data) || void 0 === s ? void 0 : s.__headerHasColumnsToggler) && !p && (null == c || c.push((null === (d = null == n ? void 0 : n.data) || void 0 === d ? void 0 : d.__cacheColumnsToggler) || { type: "columns-toggler", align: "right" })), n.setValues({ headerToolbar: c, columns: n.data.__columns || [{ label: "ID", name: "id" }, { label: "?????????", name: "name" }], __headerHasColumnsToggler: p, __card: n.data.__card || n.data.card, __listItem: n.data.__listItem || n.data.listItem }), n.deleteValueByName("card"), n.deleteValueByName("listItem")) : "cards" === e ? ("table" === t && n.setValues({ __cacheColumnsToggler: u }), n.setValues({ headerToolbar: c, card: n.data.__card || { type: "card", header: { title: "??????", subTitle: "?????????" }, body: [{ name: "a", label: "A" }, { name: "b", label: "B" }], actions: [{ label: "??????", type: "button" }] }, __columns: n.data.__columns || n.data.columns, __listItem: n.data.__listItem || n.data.listItem }), n.deleteValueByName("columns"), n.deleteValueByName("listItem")) : ("table" === t && n.setValues({ __cacheColumnsToggler: u }), n.setValues({ headerToolbar: c, listItem: n.data.__listItem || { body: [{ type: "tpl", tpl: "????????????????????????$a $b" }], actions: [{ icon: "fa fa-eye", type: "button" }] }, __columns: n.data.__columns || n.data.columns, __card: n.data.__card || n.data.card }), n.deleteValueByName("columns"), n.deleteValueByName("card"))
                            }, options: [{ value: "table", label: "??????" }, { value: "cards", label: "??????" }, { value: "list", label: "??????" }]
                        }, {
                            name: "headerToolbar", type: "combo", draggable: !0, draggableTip: "", descrition: "?????????????????????????????????????????????", label: "?????????????????????", pipeIn: function (e) {
                                return Array.isArray(e) || (e = e ? [e] : ["bulkActions", "pagination"]), e.map((function (e) {
                                    var t = e.type;
                                    return "string" == typeof e && ~["bulkActions", "bulk-actions", "pagination", "statistics", "switch-per-page", "filter-toggler", "load-more", "export-csv", "export-excel"].indexOf(e) ? e = { type: t = "bulkActions" === e ? "bulk-actions" : e } : "string" == typeof e && (t = "tpl", e = "string" == typeof e ? { type: "tpl", tpl: e } : e), n.__assign({ type: t }, e)
                                }))
                            }, pipeOut: function (e) { return Array.isArray(e) ? e.map((function (e) { return "button" === e.type ? p.JSONPipeIn(n.__assign({ label: "??????", type: "button" }, e)) : "tpl" === e.type ? p.JSONPipeIn(n.__assign({ type: "tpl", tpl: "??????" }, e)) : e })) : [] }, scaffold: { type: "tpl", tpl: "??????" }, multiple: !0, items: [{ type: "select", name: "type", columnClassName: "w-ssm", options: [{ value: "bulk-actions", label: "?????????" }, { value: "pagination", label: "??????" }, { value: "statistics", label: "????????????" }, { value: "switch-per-page", label: "????????????" }, { value: "load-more", label: "????????????" }, { value: "export-csv", label: "?????? CSV" }, { value: "export-excel", label: "?????? Excel" }, { value: "columns-toggler", label: "????????????", visibleOn: '!this.mode || this.mode === "table"' }, { value: "filter-toggler", label: "??????????????????" }, { value: "drag-toggler", label: "????????????" }, { value: "check-all", label: "??????", hiddenOn: '!this.mode || this.mode === "table"' }, { value: "tpl", label: "??????" }, { value: "button", label: "??????" }] }, { name: "align", placeholder: "????????????", type: "select", size: "xs", options: [{ label: "?????????", value: "left" }, { label: "?????????", value: "right" }] }]
                        }, {
                            name: "footerToolbar", type: "combo", draggable: !0, draggableTip: "", descrition: "?????????????????????????????????????????????", label: "?????????????????????", pipeIn: function (e) {
                                return Array.isArray(e) || (e = e ? [e] : ["bulkActions", "pagination"]), e.map((function (e) {
                                    var t = e.type;
                                    return "string" == typeof e && ~["bulkActions", "bulk-actions", "pagination", "statistics", "switch-per-page", "filter-toggler", "load-more", "export-csv", "export-excel"].indexOf(e) ? e = { type: t = "bulkActions" === e ? "bulk-actions" : e } : "string" == typeof e && (t = "tpl", e = "string" == typeof e ? { type: "tpl", tpl: e } : e), n.__assign({ type: t }, e)
                                }))
                            }, pipeOut: function (e) { return Array.isArray(e) ? e.map((function (e) { return "button" === e.type ? p.JSONPipeIn(n.__assign({ label: "??????", type: "button" }, e)) : "tpl" === e.type ? p.JSONPipeIn(n.__assign({ type: "tpl", tpl: "??????" }, e)) : e })) : [] }, scaffold: { type: "tpl", tpl: "??????" }, multiple: !0, items: [{ type: "select", name: "type", columnClassName: "w-ssm", options: [{ value: "bulk-actions", label: "?????????" }, { value: "pagination", label: "??????" }, { value: "statistics", label: "????????????" }, { value: "switch-per-page", label: "????????????" }, { value: "load-more", label: "????????????" }, { value: "export-csv", label: "?????? CSV" }, { value: "export-excel", label: "?????? Excel" }, { value: "columns-toggler", label: "????????????", hiddenOn: '["grid", "cards", "list"].indexOf(this.mode)' }, { value: "filter-toggler", label: "??????????????????" }, { value: "drag-toggler", label: "????????????" }, { value: "check-all", label: "??????", hiddenOn: '!this.mode || this.mode === "table"' }, { value: "tpl", label: "??????" }, { value: "button", label: "??????" }] }, { name: "align", placeholder: "????????????", size: "xs", type: "select", options: [{ label: "?????????", value: "left" }, { label: "?????????", value: "right" }] }, { type: "remark", content: "????????????????????????????????????????????????", trigger: ["click"], rootClose: !0, placement: "left", visibleOn: '!~["bulkActions", "drag-toggler", "check-all", "bulk-actions", "pagination", "statistics", "switch-per-page", "filter-toggler", "load-more", "export-csv", "export-excel"].indexOf(this.type)', columnClassName: "no-grow w-3x p-t-xs", className: "m-l-none" }]
                        }, { name: "filterTogglable", type: "switch", label: "???????????????????????????", mode: "inline", className: "block", visibleOn: "data.filter" }, { name: "filterDefaultVisible", type: "switch", label: "??????????????????????????????", pipeIn: u.defaultValue(!0), mode: "inline", className: "block", visibleOn: "data.filter && data.filterTogglable" }, { name: "hideQuickSaveBtn", label: "??????????????????????????????", type: "switch", mode: "inline", className: "block" }, { name: "alwaysShowPagination", label: "????????????????????????", type: "switch", mode: "inline", className: "block" }, { name: "hideCheckToggler", type: "switch", label: "??????????????????", mode: "inline", className: "block", visibleOn: "data.checkOnItemClick" }, u.getSchemaTpl("className"), u.getSchemaTpl("className", { name: "bodyClassName", label: "?????? CSS ??????" })]
                    }, { title: "??????", body: [u.getSchemaTpl("ref"), { name: "source", label: "?????????", type: "input-text", description: "??????????????????????????????????????? items ?????? rows ??????????????????????????????????????????????????? <code>\\${xxxx}</code>" }, { name: "perPage", label: "????????????", type: "input-number" }, { name: "keepItemSelectionOnPageChange", label: "?????????????????????", type: "switch", mode: "inline", className: "block" }, { name: "maxKeepItemSelectionLength", label: "??????????????????", type: "input-number", mode: "inline", className: "block" }, { name: "pageField", label: "???????????????", type: "input-text", pipeIn: u.defaultValue("page") }, { name: "perPageField", label: "?????????????????????", type: "input-text", pipeIn: u.defaultValue("perPage") }, { name: "orderField", label: "??????????????????", type: "input-text", labelRemark: { className: "m-l-xs", trigger: "click", rootClose: !0, content: "??????????????????????????????????????????????????????????????????????????????????????????", placement: "left" } }, { name: "perPageAvailable", label: "???????????????", type: "input-array", hiddenOn: "data.loadDataOnce", items: { type: "input-number", required: !0 }, value: [10] }, u.getSchemaTpl("name"), { name: "itemCheckableOn", type: "input-text", label: "?????????????????????????????????", description: "????????? js ????????????????????????????????????????????????", visibleOn: "data.bulkActions && data.bulkActions.length || data.pickerMode" }, { name: "checkOnItemClick", type: "switch", label: "????????????????????????????????????", mode: "inline", className: "block", visibleOn: "data.bulkActions && data.bulkActions.length || data.pickerMode" }, { name: "autoJumpToTopOnPagerChange", type: "switch", label: "???????????????", mode: "inline", className: "block", description: "?????????????????????????????????????????????" }, { name: "syncResponse2Query", type: "switch", label: "??????????????????", mode: "inline", className: "block", description: "???????????????????????????????????????????????????" }] }])
                }, t.wrapperProps = { affixHeader: !1 }, t
            } return n.__extends(t, e), t.prototype.addItem = function (e, t) { e.find((function (e) { return e.label === t.label })) || e.push(t) }, t.prototype.handleBulkActionEdit = function (e, t) {
                var a = this.manager.store, n = a.getSchema(e), l = null == n ? void 0 : n.bulkActions[t];
                l && l.$$id && a.setActiveId(l.$$id)
            }, t.prototype.handleItemActionEdit = function (e, t) {
                var a = this.manager.store, n = a.getSchema(e), l = null == n ? void 0 : n.itemActions[t];
                l && l.$$id && a.setActiveId(l.$$id)
            }, t.prototype.buildSubRenderers = function (e, t) { if (this.name && this.description) return { name: this.name, icon: this.icon, description: this.description, previewSchema: this.previewSchema, tags: this.tags, docLink: this.docLink, type: this.type, scaffold: this.scaffold, scaffoldForm: this.scaffoldForm } }, t.prototype.getRendererInfo = function (t) {
                var a = e.prototype.getRendererInfo.call(this, t);
                return a && (a.scaffoldForm = this.scaffoldForm), a
            }, t.prototype.renderEditableComponents = function (e) {
                var t = e.render, a = e.bulkActions, l = e.itemActions, i = [];
                return Array.isArray(a) && a.length && i.push(r.default.createElement("div", { key: "bulkActions", className: "ae-EditableRender" }, r.default.createElement("div", { className: "ae-EditableRender-title" }, "????????????"), r.default.createElement("div", { className: "ae-EditableRender-body" }, a.map((function (e) { return t("bulk-action", n.__assign({ type: "button", size: "sm" }, e), { key: e.$$id }) }))))), Array.isArray(l) && l.length && i.push(r.default.createElement("div", { key: "itemActions", className: "ae-EditableRender" }, r.default.createElement("div", { className: "ae-EditableRender-title" }, "????????????"), r.default.createElement("div", { className: "ae-EditableRender-body" }, l.map((function (e) { return t("bulk-action", n.__assign({ type: "button", size: "sm" }, e), { key: e.$$id }) }))))), i.length ? r.default.createElement("div", { className: "ae-EditableRenderers" }, r.default.createElement("div", { className: "ae-EditableRenderers-tip" }, "?????????????????????????????????"), i) : null
            }, t.prototype.renderRenderer = function (e) {
                var t = e.$$editor.renderer;
                return r.default.createElement("div", { className: "ae-CRUDEditor" }, this.renderEditableComponents(e), r.default.createElement(t.component, n.__assign({}, e)))
            }, t.prototype.filterProps = function (e) { return e.pickerMode && (e.options = e.data.options), e }, t.prototype.afterUpdate = function (e) {
                var t, a = this, n = e.context;
                n.info.plugin === this && (null === (t = n.diff) || void 0 === t ? void 0 : t.some((function (e) {
                    var t;
                    return "mode" === (null === (t = e.path) || void 0 === t ? void 0 : t.join("."))
                }))) && setTimeout((function () { a.manager.buildPanels(), a.manager.buildToolbars() }), 20)
            }, t
        }(d.BasePlugin);
        t.CRUDPlugin = h, s.registerEditorPlugin(h)
    }, function (e, t) { e.exports = require("855772d") }, function (e, t) { e.exports = require("5850c09") }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CustomPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "custom", t.$schema = "/schemas/CustomSchema.json", t.name = "???????????????", t.description = "?????????????????????????????????", t.tags = ["??????", "?????????"], t.icon = "fa fa-gears", t.scaffold = { type: "custom", onMount: "\n      const button = document.createElement('button');\n      button.innerText = '??????????????????';\n      button.onclick = event => {\n        event.preventDefault();\n      };\n      dom.appendChild(button);" }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "???????????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "onMount", body: [{ name: "onMount", type: "editor", allowFullscreen: !0, size: "xxl", label: "onMount ??????", options: { lineNumbers: "off", glyphMargin: !1, lineDecorationsWidth: 0, lineNumbersMinChars: 0 } }] }, { title: "onUpdate", body: [{ name: "onUpdate", type: "editor", allowFullscreen: !0, size: "xxl", label: "onUpdate ??????" }] }, { title: "onUnmount", body: [{ name: "onUnmount", type: "editor", allowFullscreen: !0, size: "xxl", label: "onUnmount ??????" }] }])], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) {
                var n = e.prototype.buildSubRenderers.call(this, t, a);
                return n.scaffold.onMount = "\n        const button = document.createElement('button');\n        button.innerText = '??????????????????ddd';\n        button.onclick = event => {\n          onChange('new name');\n          event.preventDefault();\n        };\n        dom.appendChild(button);", n
            }, t
        }(i.BasePlugin);
        t.CustomPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DatetimePlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "datetime", t.scaffold = { type: "datetime" }, t.name = "??????????????????", t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { format: "YYYY-MM-DD HH:mm:ss", value: Math.round(Date.now() / 1e3) }), t
            } return n.__extends(t, e), t
        }(a(29).DatePlugin);
        t.DatetimePlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DividerPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "divider", t.$schema = "/schemas/DividerSchema.json", t.name = "?????????", t.icon = "fa fa-minus", t.description = "???????????????????????????????????????????????????????????????", t.scaffold = { type: "divider" }, t.previewSchema = { type: "divider", className: "m-t-none m-b-none" }, t.panelTitle = "?????????", t.panelBody = o.getSchemaTpl("tabs", [{ title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }]), t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.DividerPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DrawerPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = a(6), s = a(46), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "drawer", t.$schema = "/schemas/DrawerSchema.json", t.name = "???????????????", t.wrapperProps = { wrapperComponent: s.InlineModal, onClose: r.noop, resizable: !1, show: !0 }, t.regions = [{
                    key: "body", label: "?????????", renderMethod: "renderBody", renderMethodOverride: function (e, t) {
                        return function () {
                            for (var a = [], n = 0;
                                n < arguments.length;
                                n++)a[n] = arguments[n];
                            var l = this.props.$$editor, i = this.super.apply(this, a);
                            return l && "body" === a[1] ? t(this, i, e, l, l.plugin.manager) : i
                        }
                    }
                }, { key: "actions", label: "?????????", renderMethod: "renderFooter", wrapperResolve: function (e) { return e } }], t.panelTitle = "??????", t.panelBody = [o.getSchemaTpl("tabs", [{
                    title: "??????", body: [{ label: "??????", type: "input-text", name: "title" }, { type: "divider" }, { label: "??????", type: "button-group-select", name: "position", value: "right", size: "sm", mode: "inline", className: "block", options: [{ label: "???", value: "left" }, { label: "???", value: "top" }, { label: "???", value: "right" }, { label: "???", value: "bottom" }], description: "?????????????????????????????????" }, { type: "switch", label: "????????????", name: "data", mode: "inline", className: "w-full m-b-xs", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? { "&": "$$" } : null } }, { type: "tpl", visibleOn: "!this.data", tpl: '<p class="text-sm text-muted">????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>' }, {
                        type: "combo", syncDefaultValue: !1, name: "data", visibleOn: "this.data", descriptionClassName: "help-block text-xs m-b-none", description: '<p>???????????????????????????????????????????????????????????????????????????????????????????????????<code>{"a": "\\${a}", "b": 2}</code></p><p>???????????????????????????????????????????????????????????? Key ??? `&` Value ??? `\\$$` ??????????????????</p><div>????????? <code>__undefined</code>????????????????????????????????????????????????<code>{"&": "\\$$"}</code>???????????????????????????</div>', multiple: !0, pipeIn: function (e) {
                            if (!r.isObject(e)) return e;
                            var t = [];
                            return Object.keys(e).forEach((function (a) { t.push({ key: a || "", value: "string" == typeof e[a] ? e[a] : JSON.stringify(e[a]) }) })), t
                        }, pipeOut: function (e) {
                            if (!Array.isArray(e)) return e;
                            var t = {};
                            return e.forEach((function (e) {
                                var a = e.key || "", n = e.value;
                                try { n = JSON.parse(n) } catch (e) { } t[a] = n
                            })), t
                        }, items: [{ placeholder: "Key", type: "input-text", unique: !0, name: "key" }, { placeholder: "Value", type: "input-text", name: "value" }]
                    }, { type: "switch", name: "closeOnOutside", label: "????????????????????????", mode: "inline", className: "block" }, { label: "??? Esc ????????????", type: "switch", name: "closeOnEsc", mode: "inline", className: "block" }]
                }, { title: "??????", body: [{ label: "??????", type: "button-group-select", name: "size", size: "sm", mode: "inline", className: "block", options: [{ label: "??????", value: "xs" }, { label: "???", value: "sm" }, { label: "???", value: "md" }, { label: "???", value: "lg" }, { label: "??????", value: "xl" }] }, { type: "switch", name: "overlay", label: "??????????????????", mode: "inline", className: "block", pipeIn: o.defaultValue(!0) }, { type: "switch", name: "resizable", label: "?????????", mode: "inline", className: "block", pipeIn: o.defaultValue(!1), description: "???????????????????????????????????????" }, o.getSchemaTpl("className"), o.getSchemaTpl("className", { label: "bodyClassName ??????", name: "bodyClassName" })] }])], t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function () { }, t
        }(i.BasePlugin);
        t.DrawerPlugin = d, l.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DropDownButtonPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(6), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "dropdown-button", t.$schema = "/schemas/DropdownButtonSchema.json", t.name = "????????????", t.description = "????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-chevron-down", t.docLink = "/amis/zh-CN/components/dropdown-button", t.scaffold = { type: "dropdown-button", label: "????????????", buttons: [{ type: "button", label: "??????1", actionType: "dialog", dialog: { title: "????????????", body: "???????????????" } }, { type: "button", label: "??????2", actionType: "dialog", dialog: { title: "????????????", body: "???????????????" } }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "????????????", t.panelBodyCreator = function (e) { return s.getSchemaTpl("tabs", [{ title: "??????", body: [{ children: i.default.createElement(l.Button, { level: "info", size: "sm", className: "m-b-sm", block: !0, onClick: t.editDetail.bind(t, e.id) }, "????????????????????????") }, { label: "??????", type: "input-text", name: "label" }, { name: "closeOnOutside", label: "??????????????????", type: "switch", mode: "inline", className: "block", pipeIn: s.defaultValue(!0) }, { name: "closeOnClick", label: "??????????????????", type: "switch", mode: "inline", className: "block" }] }, { title: "??????", body: [s.getSchemaTpl("size"), { label: "????????????", type: "button-group-select", size: "xs", name: "level", btnActiveClassName: "active", clearable: !1, options: [{ label: "??????", value: "default", level: "default" }, { label: "???", value: "link", level: "link" }, { label: "??????", value: "primary", level: "primary" }, { label: "??????", value: "info", level: "info" }, { label: "??????", value: "success", level: "success" }, { label: "??????", value: "warning", level: "warning" }, { label: "??????", value: "danger", level: "danger" }] }, s.getSchemaTpl("className")] }, { title: "??????", body: [s.getSchemaTpl("ref"), s.getSchemaTpl("disabled"), s.getSchemaTpl("visible")] }]) }, t
            } return n.__extends(t, e), t.prototype.buildEditorToolbar = function (e, t) {
                var a = e.id;
                "dropdown-button" === e.info.renderer.name && t.push({ icon: "fa fa-expand", order: 100, tooltip: "????????????????????????", onClick: this.editDetail.bind(this, a) })
            }, t.prototype.editDetail = function (e) {
                var t = this.manager, a = t.store, l = a.getNodeById(e), i = a.getValueOf(e);
                l && i && this.manager.openSubEditor({ title: "????????????????????????", value: i.buttons, slot: { type: "button-group", buttons: "$$", block: !0 }, onChange: function (e) { e = n.__assign(n.__assign({}, i), { buttons: e }), t.panelChangeValue(e, d.diff(i, e)) } })
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a = e.id;
                e.schema, e.region;
                "dropdown-button" === e.info.renderer.name && t.push("|", { label: "????????????????????????", onSelect: this.editDetail.bind(this, a) })
            }, t
        }(r.BasePlugin);
        t.DropDownButtonPlugin = u, o.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.EachPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(6), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "each", t.$schema = "/schemas/EachSchema.json", t.name = "?????? Each", t.description = "??????????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-repeat", t.scaffold = { type: "each", name: "arr", items: { type: "tpl", tpl: "<%= data.index + 1 %>. ?????????<%= data.item %>", inline: !1 } }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { value: ["a", "b", "c"] }), t.panelTitle = "??????", t.panelBodyCreator = function (e) { return [{ type: "input-text", name: "name", label: "????????????", placeholder: "varname", description: "??????????????????????????? value ???????????????????????????????????????????????????????????????????????????a.b???????????????a????????????b????????????????????????????????????????????????????????????" }, { children: i.default.createElement(l.Button, { size: "sm", level: "danger", className: "m-b", block: !0, onClick: t.editDetail.bind(t, e.id) }, "?????????????????????") }, { name: "placeholder", type: "input-text", label: "?????????", pipeIn: s.defaultValue("????????????"), description: "??????????????????????????????????????????????????????????????????????????????????????????" }, s.getSchemaTpl("className")] }, t
            } return n.__extends(t, e), t.prototype.filterProps = function (e) { return (e = d.JSONPipeOut(e)).value || (e.value = [{ item: "mocked data" }]), e }, t.prototype.buildEditorToolbar = function (e, t) {
                var a = e.id;
                "each" === e.info.renderer.name && t.push({ icon: "fa fa-expand", order: 100, tooltip: "?????????????????????", onClick: this.editDetail.bind(this, a) })
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a = e.id;
                e.schema, e.region;
                "each" === e.info.renderer.name && t.push("|", { label: "?????????????????????", onSelect: this.editDetail.bind(this, a) })
            }, t.prototype.editDetail = function (e) {
                var t = this.manager, a = t.store, l = a.getNodeById(e), i = a.getValueOf(e);
                l && i && this.manager.openSubEditor({ title: "?????????????????????", value: i.items, slot: { type: "container", body: "$$" }, typeMutable: !0, onChange: function (e) { e = n.__assign(n.__assign({}, i), { items: e }), t.panelChangeValue(e, d.diff(i, e)) }, data: { item: "mocked data", index: 0 } })
            }, t.prototype.buildSubRenderers = function (t, a) { return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(r.BasePlugin);
        t.EachPlugin = u, o.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.FlexPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "flex", t.$schema = "/schemas/FlexSchema.json", t.name = "Flex ??????", t.icon = "fa fa-columns", t.description = "flex ??????", t.tags = ["??????"], t.scaffold = { type: "flex", items: [{ type: "wrapper", body: "?????????" }, { type: "wrapper", body: "?????????" }, { type: "wrapper", body: "?????????" }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "Flex", t.panelBody = [{ name: "items", label: "????????????", type: "combo", scaffold: { type: "wrapper", body: "???????????????" }, minLength: 2, multiple: !0, draggableTip: "", items: [{ type: "tpl", tpl: '<span class="label label-default">?????????${index | plus}</span>' }] }, { name: "justify", type: "select", value: "center", label: "???????????????????????????", options: ["start", "flex-start", "center", "end", "flex-end", "space-around", "space-between", "space-evenly"] }, { name: "alignItems", type: "select", value: "center", label: "???????????????????????????", options: ["stretch", "start", "flex-start", "flex-end", "end", "center", "baseline"] }, { name: "direction", type: "radios", label: "????????????", value: "column", inline: !0, options: [{ label: "??????", value: "row" }, { label: "??????", value: "column" }] }, o.getSchemaTpl("className"), o.getSchemaTpl("visible")], t.regions = [{ key: "items", label: "???????????????", renderMethod: "render", dndMode: "position-h" }], t
            } return n.__extends(t, e), t.prototype.exchangeRenderer = function (e) { this.manager.showReplacePanel(e) }, t.prototype.afterResolveJsonSchema = function (e) {
                var t, a, n = null === (t = e.context.node.parent) || void 0 === t ? void 0 : t.host;
                (null === (a = null == n ? void 0 : n.info) || void 0 === a ? void 0 : a.plugin) === this && e.setData("/schemas/FlexColumn.json")
            }, t
        }(i.BasePlugin);
        t.FlexPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        a.r(t);
        var n, l = a(4);
        function i() {
            return (i = Object.assign || function (e) {
                for (var t = 1;
                    t < arguments.length;
                    t++) {
                    var a = arguments[t];
                    for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n])
                } return e
            }).apply(this, arguments)
        } t.default = function (e) { return l.createElement("svg", i({ viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg" }, e), n || (n = l.createElement("path", { d: "M755.627 481.707L584.96 311.04a42.667 42.667 0 10-60.587 60.587l98.134 97.706H128a42.667 42.667 0 000 85.334h494.507l-98.134 97.706a42.667 42.667 0 000 60.587 42.667 42.667 0 0060.587 0l170.667-170.667a42.667 42.667 0 008.96-14.08 42.667 42.667 0 000-32.426 42.667 42.667 0 00-8.96-14.08zM896 170.667a42.667 42.667 0 00-42.667 42.666v597.334a42.667 42.667 0 0085.334 0V213.333A42.667 42.667 0 00896 170.667z" }))) }
    }, function (e, t, a) {
        "use strict";
        a.r(t);
        var n, l = a(4);
        function i() {
            return (i = Object.assign || function (e) {
                for (var t = 1;
                    t < arguments.length;
                    t++) {
                    var a = arguments[t];
                    for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n])
                } return e
            }).apply(this, arguments)
        } t.default = function (e) { return l.createElement("svg", i({ viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", width: 200, height: 200 }, e), n || (n = l.createElement("path", { d: "M896 469.333H401.493l98.134-97.706a42.667 42.667 0 10-60.587-60.587L268.373 481.707a42.667 42.667 0 00-8.96 14.08 42.667 42.667 0 000 32.426 42.667 42.667 0 008.96 14.08L439.04 712.96a42.667 42.667 0 0060.587 0 42.667 42.667 0 000-60.587l-98.134-97.706H896a42.667 42.667 0 000-85.334zM128 128a42.667 42.667 0 00-42.667 42.667v682.666a42.667 42.667 0 0085.334 0V170.667A42.667 42.667 0 00128 128z" }))) }
    }, function (e, t, a) {
        "use strict";
        a.r(t);
        var n, l = a(4);
        function i() {
            return (i = Object.assign || function (e) {
                for (var t = 1;
                    t < arguments.length;
                    t++) {
                    var a = arguments[t];
                    for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n])
                } return e
            }).apply(this, arguments)
        } t.default = function (e) { return l.createElement("svg", i({ viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", width: 200, height: 200 }, e), n || (n = l.createElement("path", { d: "M542.293 268.373a42.667 42.667 0 00-14.08-8.96 42.667 42.667 0 00-32.426 0 42.667 42.667 0 00-14.08 8.96L311.04 439.04a42.667 42.667 0 1060.587 60.587l97.706-98.134V896a42.667 42.667 0 0085.334 0V401.493l97.706 98.134a42.667 42.667 0 0060.587 0 42.667 42.667 0 000-60.587zm268.374-183.04H213.333a42.667 42.667 0 000 85.334h597.334a42.667 42.667 0 000-85.334z" }))) }
    }, function (e, t, a) {
        "use strict";
        a.r(t);
        var n, l = a(4);
        function i() {
            return (i = Object.assign || function (e) {
                for (var t = 1;
                    t < arguments.length;
                    t++) {
                    var a = arguments[t];
                    for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n])
                } return e
            }).apply(this, arguments)
        } t.default = function (e) { return l.createElement("svg", i({ viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", width: 200, height: 200 }, e), n || (n = l.createElement("path", { d: "M810.667 853.333H213.333a42.667 42.667 0 000 85.334h597.334a42.667 42.667 0 000-85.334zm-328.96-97.706a42.667 42.667 0 0014.08 8.96 40.107 40.107 0 0032.426 0 42.667 42.667 0 0014.08-8.96L712.96 584.96a42.667 42.667 0 00-60.587-60.587l-97.706 98.134V128a42.667 42.667 0 00-85.334 0v494.507l-97.706-98.134a42.667 42.667 0 10-60.587 60.587z" }))) }
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.HBoxPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(13), u = a(14), p = a(6), c = a(48), m = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "hbox", t.$schema = "/schemas/HBoxSchema.json", t.name = "HBox", t.icon = "fa fa-columns", t.description = "?????????????????????????????????????????????????????????????????? columnClassName ????????????????????????", t.tags = ["??????"], t.scaffold = { type: "hbox", gap: "base", columns: [{ body: [] }, { body: [] }] }, t.previewSchema = { type: "hbox", columns: [{ type: "tpl", tpl: "????????????<br />w-xs", columnClassName: "bg-primary w-xs" }, { type: "tpl", tpl: "????????????", columnClassName: "bg-success" }] }, t.panelTitle = "HBox", t.panelBodyCreator = function (e) { return [s.getSchemaTpl("fieldSet", { title: "??????", collapsable: !1, body: [{ type: "wrapper", size: "none", className: "grid grid-cols-2 gap-4 mb-4", body: [{ children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertRowAfter(e.node) } }, i.default.createElement(c.Icon, { className: "icon", icon: "arrow-to-bottom" }), i.default.createElement("span", null, "??????????????????")) }, { children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertRowBefore(e.node) } }, i.default.createElement(c.Icon, { className: "icon", icon: "top-arrow-to-top" }), i.default.createElement("span", null, "??????????????????")) }] }, { label: "??????", name: "columns", type: "select", pipeIn: function (e) { return Array.isArray(e) ? e.length : void 0 }, pipeOut: function (e, t) { return Array.isArray(t) && (t.length > e ? (t = t.concat()).splice(e - 1, t.length - e) : t = t.concat(p.repeatArray({ body: [] }, e - t.length))), t }, options: p.repeatArray(null, 12).map((function (e, t) { return { label: "" + (t + 1), value: t + 1 } })) }] }), { type: "list-select", name: "gap", label: "?????????", size: "sm", clearable: !0, tiled: !0, options: [{ label: "??????", value: "xs" }, { label: "???", value: "sm" }, { label: "??????", value: "base" }, { label: "???", value: "md" }, { label: "???", value: "lg" }] }, { name: "columns", label: "?????????", type: "combo", scaffold: { body: [] }, minLength: 1, multiple: !0, draggableTip: "", items: [{ type: "tpl", tpl: '<span class="label label-default">???${index | plus}</span>', columnClassName: "no-grow v-middle" }, s.getSchemaTpl("className", { name: "columnClassName", labelRemark: "", label: "" })] }, s.getSchemaTpl("fieldSet", { title: "????????????", collapsable: !1, body: [{ type: "button-group-select", name: "align", size: "sm", label: !1, tiled: !0, pipeIn: s.defaultValue("left"), options: [{ value: "left", label: "?????????" }, { value: "center", label: "????????????" }, { value: "right", label: "?????????" }, { value: "between", label: "????????????" }] }] }), s.getSchemaTpl("fieldSet", { title: "????????????", collapsable: !1, body: [{ type: "button-group-select", name: "valign", size: "sm", label: !1, tiled: !0, pipeIn: s.defaultValue("top"), options: [{ value: "top", label: "????????????" }, { value: "middle", label: "????????????" }, { value: "bottom", label: "????????????" }, { value: "between", label: "????????????" }] }] }), s.getSchemaTpl("className"), s.getSchemaTpl("subFormItemMode"), s.getSchemaTpl("subFormHorizontalMode"), s.getSchemaTpl("subFormHorizontal"), s.getSchemaTpl("visible")] }, t.vRendererConfig = { regions: { body: { key: "body", label: "?????????", placeholder: "???", wrapperResolve: function (e) { return e } } }, panelTitle: "???", panelBodyCreator: function (e) { return [s.getSchemaTpl("className", { name: "columnClassName", label: "??? CSS ??????", description: "????????????????????????????????????????????????????????????????????????" }), s.getSchemaTpl("fieldSet", { title: "??????", collapsable: !1, body: [{ type: "wrapper", size: "none", className: "grid grid-cols-2 gap-4", body: [{ children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertRowAfter(e.node.host) } }, i.default.createElement(c.Icon, { className: "icon", icon: "arrow-to-bottom" }), i.default.createElement("span", null, "??????????????????")) }, { children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertRowBefore(e.node.host) } }, i.default.createElement(c.Icon, { className: "icon", icon: "top-arrow-to-top" }), i.default.createElement("span", null, "??????????????????")) }, { children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertColumnBefore(e) } }, i.default.createElement(c.Icon, { className: "icon", icon: "left-arrow-to-left" }), i.default.createElement("span", null, "??????????????????")) }, { children: i.default.createElement(l.Button, { size: "sm", onClick: function () { return t.insertColumnAfter(e) } }, i.default.createElement(c.Icon, { className: "icon", icon: "arrow-to-right" }), i.default.createElement("span", null, "??????????????????")) }] }] }), s.getSchemaTpl("fieldSet", { title: "????????????", collapsable: !1, body: [{ type: "button-group-select", name: "width", size: "sm", label: !1, pipeIn: function (e) { return e && "auto" !== e ? "manual" : e || "" }, pipeOut: function (e) { return "manual" === e ? "20%" : e }, options: [{ value: "", label: "????????????" }, { value: "auto", label: "????????????" }, { value: "manual", label: "??????" }], description: '<% if (this.width && this.width !== "auto") {%>????????????????????????????????????????????????<%}%>' }] }), s.getSchemaTpl("fieldSet", { title: "????????????", collapsable: !1, body: [{ type: "button-group-select", name: "valign", size: "sm", label: !1, tiled: !0, clearable: !0, options: [{ value: "top", label: "????????????" }, { value: "middle", label: "????????????" }, { value: "bottom", label: "????????????" }, { value: "between", label: "????????????" }] }] })] } }, t.vWrapperResolve = function (e) { return e }, t.overrides = {
                    renderColumn: function (e, t) {
                        var a, n, l = this.super(e, t), o = this.props.$$editor;
                        if (o && e.$$id) {
                            var r = o.plugin, s = null === (n = null === (a = r.vRendererConfig) || void 0 === a ? void 0 : a.regions) || void 0 === n ? void 0 : n.body;
                            return s ? i.default.createElement(d.VRenderer, { key: e.$$id, plugin: o.plugin, renderer: o.renderer, $schema: "", hostId: o.id, memberIndex: t, name: "???" + (t + 1) + "???", id: e.$$id, draggable: !1, schemaPath: o.schemaPath + "/hbox/" + t, wrapperResolve: r.vWrapperResolve, path: this.props.$path + "/" + t, data: this.props.data, widthMutable: !0 }, s ? i.default.createElement(u.RegionWrapper, { key: s.key, preferTag: s.preferTag, name: s.key, label: s.label, regionConfig: s, placeholder: s.placeholder, editorStore: r.manager.store, manager: r.manager, children: l, wrapperResolve: s.wrapperResolve, rendererName: o.renderer.name }) : l) : l
                        } return l
                    }
                }, t
            } return n.__extends(t, e), t.prototype.exchangeRenderer = function (e) { this.manager.showReplacePanel(e) }, t.prototype.afterResolveJsonSchema = function (e) {
                var t, a, n = null === (t = e.context.node.parent) || void 0 === t ? void 0 : t.host;
                (null === (a = null == n ? void 0 : n.info) || void 0 === a ? void 0 : a.plugin) === this && e.setData("/schemas/HBoxColumn.json")
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a, n = this;
                e.selections.length || (null === (a = e.info) || void 0 === a ? void 0 : a.plugin) !== this || (e.node.isVitualRenderer ? (t.push("|"), t.push({ label: "??????????????????", onSelect: function () { return n.insertColumnBefore(e) } }), t.push({ label: "??????????????????", onSelect: function () { return n.insertColumnAfter(e) } }), t.push("|"), t.push({ label: "??????????????????", onSelect: function () { return n.insertRowBefore(e.node.host) } }), t.push({ label: "??????????????????", onSelect: function () { return n.insertRowAfter(e.node.host) } })) : (t.push("|"), t.push({ label: "??????????????????", onSelect: function () { return n.insertRowBefore(e.node) } }), t.push({ label: "??????????????????", onSelect: function () { return n.insertRowAfter(e.node) } })))
            }, t.prototype.onWidthChangeStart = function (e) {
                var t, a, l = e.context, i = l.node;
                if ((null === (t = i.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var o = i.host;
                    if (o && (null === (a = o.info) || void 0 === a ? void 0 : a.plugin) === this) {
                        var r = l.dom, s = r.parentElement;
                        if (s) {
                            var d = l.resizer, u = s.getBoundingClientRect(), p = o.schema.columns, c = i.index, m = p[c].width, h = r.getBoundingClientRect();
                            e.setData({
                                onMove: function (e) {
                                    var t = e.pageX - h.left, a = m = Math.max(1, Math.min(99, Math.round(100 * t / u.width))) + "%";
                                    (p = p.concat())[c] = n.__assign(n.__assign({}, p[c]), { width: a }), d.setAttribute("data-value", a), o.updateState({ columns: p }), requestAnimationFrame((function () { i.calculateHighlightBox() }))
                                }, onEnd: function () { o.updateState({}, !0), d.removeAttribute("data-value"), i.updateSchema({ width: m }), requestAnimationFrame((function () { i.calculateHighlightBox() })) }
                            })
                        }
                    }
                }
            }, t.prototype.insertRowAfter = function (e) {
                var t;
                if ((null === (t = e.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var a = this.manager.store, n = a.schema, l = e.id;
                    a.traceableSetSchema(p.JSONChangeInArray(n, l, (function (e, t, a) { e.splice(a + 1, 0, p.JSONPipeIn({ type: "hbox", align: t.align, valign: t.valign, columns: t.columns.map((function (e) { return { body: [], width: null == e ? void 0 : e.width } })) })) })))
                }
            }, t.prototype.insertRowBefore = function (e) {
                var t;
                if ((null === (t = e.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var a = this.manager.store, n = e.id, l = a.schema;
                    a.traceableSetSchema(p.JSONChangeInArray(l, n, (function (e, t, a) { e.splice(a, 0, p.JSONPipeIn({ type: "hbox", align: t.align, valign: t.valign, columns: t.columns.map((function (e) { return { body: [], width: null == e ? void 0 : e.width } })) })) })))
                }
            }, t.prototype.insertColumnBefore = function (e) {
                var t;
                if ((null === (t = e.node.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var a = this.manager.store, n = a.schema, l = e.id;
                    a.traceableSetSchema(p.JSONChangeInArray(n, l, (function (e, t, a) { e.splice(a, 0, p.JSONPipeIn({ body: [] })) })))
                }
            }, t.prototype.insertColumnAfter = function (e) {
                var t;
                if ((null === (t = e.node.info) || void 0 === t ? void 0 : t.plugin) === this) {
                    var a = e.id, n = this.manager.store, l = n.schema;
                    n.traceableSetSchema(p.JSONChangeInArray(l, a, (function (e, t, a) { e.splice(a + 1, 0, p.JSONPipeIn({ body: [] })) })))
                }
            }, t
        }(r.BasePlugin);
        t.HBoxPlugin = m, o.registerEditorPlugin(m)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.IFramePlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "iframe", t.$schema = "/schemas/IFrameSchema.json", t.name = "iFrame", t.description = "?????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-window-maximize", t.scaffold = { type: "iframe", src: "//www.baidu.com" }, t.previewSchema = { type: "tpl", tpl: "iFrame" }, t.panelTitle = "iFrame", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "src", label: "????????????", type: "input-text", description: "" }] }, { title: "??????", body: [{ name: "width", label: "iFrame ??????", type: "input-text", pipeIn: o.defaultValue("100%"), pipeOut: o.valuePipeOut }, { name: "height", label: "iFrame ??????", type: "input-text", pipeOut: o.valuePipeOut }, o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t.prototype.renderRenderer = function (e) { return this.renderPlaceholder("IFrame ?????????" + e.src + "???") }, t
        }(i.BasePlugin);
        t.IFramePlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ImagePlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = a(16), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "image", t.$schema = "/schemas/ImageSchema.json", t.name = "????????????", t.description = "????????????????????????????????????????????????????????????????????????????????? <code>name</code> ??????????????????", t.tags = ["??????"], t.icon = "fa fa-photo", t.scaffold = { type: "image" }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { thumbMode: "cover", value: r.mockValue({ type: "image" }) }), t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var t = /\/field\/\w+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "imageMode", label: "????????????", type: "select", pipeIn: o.defaultValue("thumb"), options: [{ label: "?????????", value: "thumb" }, { label: "??????", value: "original" }] }, { name: "title", type: "input-text", label: "????????????" }, { name: "imageCaption", type: "input-text", label: "????????????" }, o.getSchemaTpl("imageUrl", { name: "defaultImage", label: "??????????????????" }), { name: "width", label: "??????", type: "input-number" }, { name: "height", label: "??????", type: "input-number" }, t ? null : o.getSchemaTpl("imageUrl", { name: "src", type: "input-text", label: "???????????????", description: "??????????????????????????????????????????????????????????????????" })] }, { title: "??????", body: [{ type: "switch", name: "enlargeAble", label: "????????????????????????", mode: "inline", className: "w-full" }, o.getSchemaTpl("imageUrl", { name: "originalSrc", visibleOn: "this.enlargeAble", label: "????????????", description: "????????????????????????????????????????????????" }), { type: "switch", name: "showDimensions", label: "????????????????????????", mode: "inline", className: "w-full" }, { name: "thumbMode", type: "button-group-select", label: "?????????????????????", size: "sm", pipeIn: o.defaultValue("contain"), options: [{ label: "????????????", value: "w-full" }, { label: "????????????", value: "h-full" }, { label: "??????", value: "contain" }, { label: "??????", value: "cover" }] }, { name: "thumbRatio", type: "button-group-select", label: "???????????????", size: "sm", pipeIn: o.defaultValue("1:1"), options: [{ label: "1:1", value: "1:1" }, { label: "4:3", value: "4:3" }, { label: "16:9", value: "16:9" }] }, o.getSchemaTpl("className", { autoComplete: !1 }), o.getSchemaTpl("className", { name: "imageClassName", label: "?????? CSS ??????" }), o.getSchemaTpl("className", { name: "thumbClassName", label: "????????? CSS ??????" })] }, { title: "??????", body: [o.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t.prototype.onActive = function (e) {
                var t, a = e.context;
                if ((null === (t = a.info) || void 0 === t ? void 0 : t.plugin) === this && a.node) {
                    var n = a.node;
                    n.setHeightMutable(!0), n.setWidthMutable(!0)
                }
            }, t.prototype.onWidthChangeStart = function (e) { return this.onSizeChangeStart(e, "horizontal") }, t.prototype.onHeightChangeStart = function (e) { return this.onSizeChangeStart(e, "vertical") }, t.prototype.onSizeChangeStart = function (e, t) {
                var a;
                void 0 === t && (t = "both");
                var n = e.context, l = n.node;
                if ((null === (a = l.info) || void 0 === a ? void 0 : a.plugin) === this) {
                    var i = n.resizer, o = n.dom, r = o.parentElement.getBoundingClientRect(), s = o.getBoundingClientRect(), d = n.nativeEvent.pageX, u = n.nativeEvent.pageY;
                    e.setData({
                        onMove: function (e) {
                            var a = e.pageY - u, n = e.pageX - d, o = Math.max(50, s.height + a), p = Math.max(100, Math.min(s.width + n, r.width)), c = { width: p, height: o };
                            "both" === t ? i.setAttribute("data-value", p + "px x " + o + "px") : "vertical" === t ? (i.setAttribute("data-value", o + "px"), delete c.width) : (i.setAttribute("data-value", p + "px"), delete c.height), l.updateState(c), requestAnimationFrame((function () { l.calculateHighlightBox() }))
                        }, onEnd: function (e) {
                            var a = e.pageY - u, n = e.pageX - d, o = Math.max(50, s.height + a), p = { width: Math.max(100, Math.min(s.width + n, r.width)), height: o };
                            "vertical" === t ? delete p.width : "horizontal" === t && delete p.height, i.removeAttribute("data-value"), l.updateSchema(p), requestAnimationFrame((function () { l.calculateHighlightBox() }))
                        }
                    })
                }
            }, t
        }(i.BasePlugin);
        t.ImagePlugin = s, l.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ImagesPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = a(16), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "images", t.$schema = "/schemas/ImagesSchema.json", t.name = "?????????", t.description = "??????????????????", t.tags = ["??????"], t.icon = "fa fa-clone", t.scaffold = { type: "images" }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { listClassName: "nowrap", thumbMode: "cover", value: [{ title: "??????1", image: r.mockValue({ type: "image" }), src: r.mockValue({ type: "image" }) }, { title: "??????2", image: r.mockValue({ type: "image" }), src: r.mockValue({ type: "image" }) }] }), t.panelTitle = "?????????", t.panelBodyCreator = function (e) {
                    var t = /\/field\/\w+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: [o.getSchemaTpl("imageUrl", { name: "defaultImage", label: "??????????????????" })].concat(t ? [] : [{ type: "formula", name: "__mode", autoSet: !1, formula: "!this.name && !this.source && Array.isArray(this.options) ? 2 : 1" }, { label: "?????????", name: "__mode", type: "button-group-select", size: "xs", mode: "inline", className: "w-full", options: [{ label: "????????????", value: 1 }, { label: "????????????", value: 2 }], onChange: function (e, t, a, n) { e !== t && 1 == e && n.deleteValueByName("options") } }, { name: "source", type: "input-text", label: "????????????", description: "?????????\\${listVar}?????????????????????????????????????????????", visibleOn: "this.__mode == 1" }, { type: "combo", name: "options", visibleOn: "this.__mode == 2", minLength: 1, label: "???????????????", multiple: !0, multiLine: !0, addable: !0, removable: !0, items: [o.getSchemaTpl("imageUrl", { name: "image", label: "?????????" }), o.getSchemaTpl("imageUrl", { name: "src", label: "??????" }), { type: "input-text", label: "????????????", name: "title" }, { type: "textarea", label: "????????????", name: "caption" }] }]) }, { title: "??????", body: [{ type: "switch", name: "enlargeAble", label: "????????????????????????", mode: "inline", className: "w-full" }, { name: "originalSrc", visibleOn: "this.enlargeAble", type: "input-text", label: "????????????", description: "????????????????????????????????????????????????" }, { type: "switch", name: "showDimensions", label: "????????????????????????", mode: "inline", className: "w-full" }, { name: "thumbMode", type: "button-group-select", label: "?????????????????????", size: "sm", pipeIn: o.defaultValue("contain"), options: [{ label: "????????????", value: "w-full" }, { label: "????????????", value: "h-full" }, { label: "??????", value: "contain" }, { label: "??????", value: "cover" }] }, { name: "thumbRatio", type: "button-group-select", label: "???????????????", size: "sm", pipeIn: o.defaultValue("1:1"), options: [{ label: "1:1", value: "1:1" }, { label: "4:3", value: "4:3" }, { label: "16:9", value: "16:9" }] }, o.getSchemaTpl("className", { autoComplete: !1 }), o.getSchemaTpl("className", { name: "listClassName", label: "???????????? CSS ??????" })] }, { title: "??????", body: [o.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.ImagesPlugin = s, l.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.JsonPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = a(18), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "json", t.$schema = "/schemas/JsonSchema.json", t.name = "JSON??????", t.description = "???????????? JSON ?????????", t.tags = ["??????"], t.icon = "fa fa-code", t.scaffold = { type: "json" }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { name: "json", value: { a: 1, b: { c: 2 } } }), t.panelTitle = "JSON", t.panelBodyCreator = function (e) {
                    var t = /\/field\/\w+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: r([t ? { type: "tpl", inline: !1, className: "text-info text-sm", tpl: "<p>????????????????????????????????????????????????????????????????????????</p>" } : null, { name: "levelExpand", type: "input-number", label: "??????????????????", pipeIn: o.defaultValue(1) }]) }, { title: "??????", body: r([o.getSchemaTpl("className")]) }, { title: "??????", body: r([o.getSchemaTpl("ref"), o.getSchemaTpl("visible")]) }])]
                }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.JsonPlugin = s, l.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.LinkPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "link", t.$schema = "/schemas/LinkSchema.json", t.name = "??????", t.description = "????????????????????????", t.tags = ["??????"], t.icon = "fa fa-link", t.scaffold = { type: "link", value: "http://www.baidu.com/" }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { label: t.name }), t.panelTitle = "??????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "href", type: "input-text", label: "????????????, ??????????????????", description: "?????????????????????????????????????????????" }, { name: "body", type: "input-text", label: "??????", description: "??????????????????????????????????????????" }, { name: "blank", type: "switch", label: "?????????????????????", mode: "inline", className: "w-full" }] }, { title: "??????", body: [o.getSchemaTpl("className", { autoComplete: !1 })] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.LinkPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ListPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(6), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "list", t.$schema = "/schemas/ListSchema.json", t.name = "??????", t.description = "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???CRUD??? ?????????", t.tags = ["??????"], t.icon = "fa fa-list", t.scaffold = { type: "list", listItem: { body: [{ type: "tpl", tpl: "????????????????????????$a $b" }], actions: [{ icon: "fa fa-eye", type: "button" }] } }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { items: [{ a: 1, b: 2 }, { a: 3, b: 4 }, { a: 5, b: 6 }] }), t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var a = "crud" === e.schema.type;
                    return s.getSchemaTpl("tabs", [{ title: "??????", body: [{ children: i.default.createElement(l.Button, { level: "danger", size: "sm", block: !0, onClick: t.editDetail.bind(t, e.id) }, "??????????????????") }, { type: "divider" }, { name: "title", type: "input-text", label: "??????" }, a ? null : { name: "source", type: "input-text", label: "?????????", pipeIn: s.defaultValue("${items}"), description: "????????????????????????" }, { name: "placeholder", pipeIn: s.defaultValue("????????????"), type: "input-text", label: "???????????????" }] }, { title: "??????", body: [{ name: "showHeader", type: "switch", mode: "inline", className: "block", label: "??????????????????", pipeIn: s.defaultValue(!0) }, { name: "showFooter", type: "switch", mode: "inline", className: "block", label: "??????????????????", pipeIn: s.defaultValue(!0) }, s.getSchemaTpl("className", { label: "CSS ??????" }), s.getSchemaTpl("className", { name: "listClassName", label: "List div CSS ??????" }), s.getSchemaTpl("className", { name: "headerClassName", label: "?????? CSS ??????" }), s.getSchemaTpl("className", { name: "footerClassName", label: "?????? CSS ??????" })] }, { title: "??????", body: [s.getSchemaTpl("ref"), s.getSchemaTpl("visible")] }])
                }, t
            } return n.__extends(t, e), t.prototype.filterProps = function (e) {
                if (e.isSlot) return e.value = [e.data], e;
                var t = n.__assign(n.__assign({}, e.defaultData), e.data), a = Array.isArray(e.value) ? e.value : "string" == typeof e.source ? l.resolveVariable(e.source, t) : l.resolveVariable("${items}", t);
                if (!Array.isArray(a) || !a.length) {
                    var i = this.buildMockData();
                    e.value = d.repeatArray(i, 1).map((function (e, t) { return n.__assign(n.__assign({}, e), { id: t + 1 }) }))
                } var o = e.$schema, r = n.__rest(e, ["$schema"]);
                return n.__assign(n.__assign({}, d.JSONPipeOut(r)), { $schema: o })
            }, t.prototype.buildMockData = function () { return { id: 666, title: "?????????", description: "?????????", a: "?????????", b: "?????????" } }, t.prototype.editDetail = function (e) {
                var t = this.manager, a = t.store, l = a.getNodeById(e), i = a.getValueOf(e);
                l && i && this.manager.openSubEditor({ title: "??????????????????", value: n.__assign({}, i.listItem), slot: { type: "list", listItem: "$$" }, onChange: function (e) { e = n.__assign(n.__assign({}, i), { listItem: e }), t.panelChangeValue(e, d.diff(i, e)) }, data: { items: [this.buildMockData()] } })
            }, t.prototype.buildEditorToolbar = function (e, t) {
                var a = e.id, n = e.info, l = e.schema;
                ("list" === n.renderer.name || "crud" === n.renderer.name && "list" === l.mode) && t.push({ icon: "fa fa-expand", order: 100, tooltip: "?????????????????????", onClick: this.editDetail.bind(this, a) })
            }, t.prototype.buildEditorContextMenu = function (e, t) {
                var a = e.id, n = e.schema, l = (e.region, e.info);
                ("list" === l.renderer.name || "crud" === l.renderer.name && "list" === n.mode) && t.push("|", { label: "??????????????????", onSelect: this.editDetail.bind(this, a) })
            }, t.prototype.getRendererInfo = function (t) {
                var a, l = t.renderer, i = t.schema;
                return i.$$id || "crud" !== (null === (a = i.$$editor) || void 0 === a ? void 0 : a.renderer.name) || "list" !== l.name ? e.prototype.getRendererInfo.call(this, t) : n.__assign(n.__assign({}, { id: i.$$editor.id }), { name: this.name, regions: this.regions, patchContainers: this.patchContainers, vRendererConfig: this.vRendererConfig, wrapperProps: this.wrapperProps, wrapperResolve: this.wrapperResolve, filterProps: this.filterProps, $schema: this.$schema, renderRenderer: this.renderRenderer })
            }, t
        }(r.BasePlugin);
        t.ListPlugin = u, o.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ListItemPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(13), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "list-item", t.$schema = "/schemas/ListItemSchema.json", t.regions = [{ key: "body", label: "?????????", renderMethod: "renderBody", preferTag: "??????" }, { key: "actions", label: "????????????", preferTag: "??????", renderMethod: "renderRight", insertPosition: "inner" }], t.panelTitle = "?????????", t.panelBody = s.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "title", type: "input-text", label: "??????", descrition: "???????????????????????? ${xxx}" }, { name: "subTitle", type: "input-text", label: "?????????", descrition: "???????????????????????? ${xxx}" }, { name: "avatar", type: "input-text", label: "????????????", descrition: "???????????????????????? ${xxx}" }, { name: "desc", type: "textarea", label: "??????", descrition: "???????????????????????? ${xxx}" }] }, { title: "??????", body: [s.getSchemaTpl("className", { name: "avatarClassName", label: "?????? CSS ??????", pipeIn: s.defaultValue("thumb-sm avatar m-r") }), s.getSchemaTpl("className", { name: "titleClassName", label: "?????? CSS ??????" })] }]), t.fieldWrapperResolve = function (e) { return e }, t.overrides = {
                    renderFeild: function (e, t, a, n) {
                        var l = this.super(e, t, a, n), o = this.props.$$editor;
                        if (!o || !t.$$id) return l;
                        var r = o.plugin, s = t.$$id;
                        return i.default.createElement(d.VRenderer, { plugin: o.plugin, renderer: o.renderer, multifactor: !0, key: s, $schema: "/schemas/ListBodyField.json", hostId: o.id, memberIndex: a, name: "??????" + (a + 1), id: s, draggable: !1, wrapperResolve: r.fieldWrapperResolve, schemaPath: o.schemaPath + "/body/" + a, path: this.props.$path + "/" + a, data: this.props.data }, l)
                    }
                }, t.vRendererConfig = { panelTitle: "??????", panelBodyCreator: function (e) { return [s.getSchemaTpl("label"), s.getSchemaTpl("className", { name: "labelClassName", label: "Label CSS ??????", visibleOn: "this.label" }), { children: i.default.createElement(l.Button, { size: "sm", level: "info", className: "m-b", block: !0, onClick: t.exchangeRenderer.bind(t, e.id) }, "?????????????????????") }] } }, t
            } return n.__extends(t, e), t.prototype.getRendererInfo = function (e) {
                var t = e.renderer;
                if (e.schema.$$id && this.rendererName === t.name) return { name: this.panelTitle, regions: this.regions, $schema: this.$schema }
            }, t.prototype.exchangeRenderer = function (e) { this.manager.showReplacePanel(e, "??????") }, t.prototype.beforeInsert = function (e) {
                var t, a, l, i, o = e.context;
                o.info.plugin !== this && (null === (t = o.node.sameIdChild) || void 0 === t ? void 0 : t.info.plugin) !== this || "body" !== o.region || (o.data = n.__assign(n.__assign({}, o.data), { label: null !== (i = null !== (a = o.data.label) && void 0 !== a ? a : null === (l = o.subRenderer) || void 0 === l ? void 0 : l.name) && void 0 !== i ? i : "?????????" }))
            }, t
        }(r.BasePlugin);
        t.ListItemPlugin = u, o.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.LogPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "log", t.$schema = "/schemas/LogSchema.json", t.name = "??????", t.icon = "fa fa-file-text-o", t.description = "????????????????????????", t.docLink = "/amis/zh-CN/components/log", t.tags = ["??????"], t.previewSchema = { type: "log" }, t.scaffold = { type: "log" }, t.panelTitle = "??????", t.panelBodyCreator = function (e) { return o.getSchemaTpl("tabs", [{ title: "??????", body: [o.getSchemaTpl("api", { label: "???????????????", name: "source" })] }, { title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }]) }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.LogPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.MappingPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = a(6), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "mapping", t.$schema = "/schemas/MappingSchema.json", t.name = "??????", t.description = "???????????????????????????????????????????????????1???2???3...??????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-exchange", t.scaffold = { type: "mapping", value: 2, map: { 0: '<span class="label label-info">???</span>', 1: '<span class="label label-success">???</span>', 2: '<span class="label label-danger">???</span>', 3: '<span class="label label-warning">???</span>', 4: '<span class="label label-primary">???</span>', "*": '<span class="label label-default">-</span>' } }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var t = /\/field\/\w+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{
                        title: "??????", body: [t ? { type: "tpl", inline: !1, className: "text-info text-sm", tpl: "<p>????????????????????????????????????????????????????????????????????????</p>" } : null, {
                            label: "?????????", type: "combo", scaffold: { key: "key-{index}", value: "value-{index}" }, required: !0, name: "map", descriptionClassName: "help-block text-xs m-b-none", description: "<p>?????????????????? Key ???????????????????????????????????????????????????????????? Key ??? <code>*</code>?????????</div>(?????????key?????????)", multiple: !0, pipeIn: function (e) {
                                if (!r.isObject(e)) return [{ key: "*", value: "?????????" }];
                                var t = [];
                                return Object.keys(e).forEach((function (a) { t.push({ key: a || "", value: "string" == typeof e[a] ? e[a] : JSON.stringify(e[a]) }) })), t
                            }, pipeOut: function (e) {
                                if (!Array.isArray(e)) return e;
                                var t = {};
                                return e.forEach((function (e, a) {
                                    var n = e.key || "", l = e.value;
                                    "key-{index}" === n && "value-{index}" === l && (n = n.replace("-{index}", "" + a), l = l.replace("-{index}", "" + a));
                                    try { l = JSON.parse(l) } catch (e) { } t[n] = l
                                })), t
                            }, items: [{ placeholder: "Key", type: "input-text", unique: !0, name: "key", required: !0, columnClassName: "w-xs" }, { placeholder: "??????", type: "input-text", name: "value" }]
                        }, { name: "placeholder", type: "input-text", pipeIn: o.defaultValue("-"), label: "?????????" }]
                    }, { title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.MappingPlugin = s, l.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.MarkdownPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "markdown", t.$schema = "/schemas/MarkdownSchema.json", t.name = "Markdown", t.description = "?????? markdown ??????", t.tags = ["??????"], t.icon = "fa fa-file-text", t.scaffold = { type: "markdown", value: "## ????????????" }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "MD", t.panelBodyCreator = function (e) {
                    /\/field\/\w+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: [o.getSchemaTpl("markdownBody")] }, { title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.MarkdownPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.NavPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "nav", t.$schema = "/schemas/NavSchema.json", t.name = "??????", t.description = "???????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-map-signs", t.scaffold = { type: "nav", stacked: !0, links: [{ label: "??????1", to: "?id=1" }, { label: "??????2", to: "?id=2" }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "??????", t.panelDefinitions = { links: { label: "????????????", name: "links", type: "combo", multiple: !0, draggable: !0, addButtonText: "????????????", multiLine: !0, messages: { validateFailed: "?????????????????????????????????????????????" }, scaffold: { label: "", to: "" }, items: [{ type: "input-text", name: "label", label: "??????", required: !0 }, { type: "input-text", name: "to", label: "????????????", required: !0 }, { type: "icon-picker", name: "icon", label: "??????" }, { type: "group", label: "????????????", direction: "vertical", className: "m-b-none", labelRemark: { trigger: "click", rootClose: !0, className: "m-l-xs", content: "????????????????????????????????????", placement: "left" }, body: [{ name: "active", type: "radios", inline: !0, options: [{ label: "???", value: !0 }, { label: "???", value: !1 }, { label: "?????????", value: "" }] }, { name: "activeOn", autoComplete: !1, visibleOn: 'typeof this.active !== "boolean"', type: "input-text", placeholder: "?????????????????????????????????", className: "m-t-n-sm" }] }, { type: "switch", label: "???????????????", name: "children", mode: "inline", className: "block", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? [{ label: "", to: "" }] : void 0 }, messages: { validateFailed: "????????????????????????????????????????????????" } }, { name: "children", $ref: "links", visibleOn: 'this.hasOwnProperty("children") && this.children', label: "???????????????", addButtonText: "???????????????" }] } }, t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ $ref: "links", name: "links" }, { type: "divider" }, o.getSchemaTpl("api", { name: "source", label: "??????????????????", description: "????????????????????????????????????????????????????????????????????????" })] }, { title: "??????", body: [{ name: "stacked", type: "switch", mode: "inline", className: "block", label: "??????????????????" }, o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.NavPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.OperationPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "operation", t.$schema = "/schemas/OperationSchema.json", t.name = "?????????", t.description = "???????????????????????????", t.tags = ["??????"], t.icon = "", t.scaffold = { type: "operation", label: "??????", buttons: [{ label: "??????", type: "button" }] }, t.previewSchema = { type: "tpl", tpl: "?????????" }, t.regions = [{ key: "buttons", label: "?????????", renderMethod: "render", insertPosition: "inner", preferTag: "??????" }], t.panelTitle = "?????????", t.panelBodyCreator = function (e) { return [s.getSchemaTpl("className", { name: "innerClassName" }), { children: i.default.createElement(l.Button, { level: "info", size: "sm", className: "m-b-sm", block: !0, onClick: function () { t.manager.showInsertPanel("buttons", e.id, "??????") } }, "????????????") }] }, t
            } return n.__extends(t, e), t.prototype.buildSubRenderers = function (t, a) { if ("table" === t.info.renderer.name || "crud" === t.info.renderer.name) return e.prototype.buildSubRenderers.call(this, t, a) }, t
        }(r.BasePlugin);
        t.OperationPlugin = d, o.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.PagePlugin = void 0;
        var n = a(0), l = a(36), i = a(1), o = a(2), r = a(3), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "page", t.$schema = "/schemas/PageSchema.json", t.name = "??????", t.docLink = "/amis/zh-CN/components/page", t.tags = "??????", t.icon = "fa fa-desktop", t.scaffold = { type: "page", body: [{ type: "tpl", tpl: "??????" }] }, t.previewSchema = { type: "page", className: "text-left b-a", asideClassName: "w-xs", title: "??????", subTitle: "?????????", aside: "??????", body: "??????" }, t.regions = [{ key: "toolbar", label: "?????????", preferTag: "???????????????" }, { key: "aside", label: "??????", placeholder: "????????????" }, { key: "body", label: "?????????", placeholder: "????????????" }], t.wrapper = l.ContainerWrapper, t.panelTitle = "??????", t.panelBody = [r.getSchemaTpl("tabs", [{ title: "??????", body: [{ type: "checkboxes", name: "regions", label: "????????????", pipeIn: function (e) { return Array.isArray(e) ? e : ["auto", "body", "toolbar", "aside", "header"] }, pipeOut: function (e) { return Array.isArray(e) && ~e.indexOf("auto") ? void 0 : e.length ? e : ["auto", "body", "toolbar", "aside", "header"] }, joinValues: !1, extractValue: !0, inline: !1, options: [{ label: "??????", value: "auto" }, { label: "?????????", value: "body", disabledOn: '!Array.isArray(this.regions) || ~this.regions.indexOf("auto")' }, { label: "??????", value: "aside", disabledOn: '!Array.isArray(this.regions) ||~this.regions.indexOf("auto")' }, { label: "?????????", value: "toolbar", disabledOn: '!Array.isArray(this.regions) ||~this.regions.indexOf("auto")' }, { label: "??????", value: "header", disabledOn: '!Array.isArray(this.regions) ||~this.regions.indexOf("auto")' }] }, { label: "??????", name: "title", type: "input-text" }, { label: "?????????", name: "subTitle", type: "input-text" }, { label: "??????", name: "remark", type: "textarea", visibleOn: "data.title", description: "??????????????????????????????????????????????????????????????????????????????" }] }, { title: "??????", body: [r.getSchemaTpl("api", { label: "?????????????????????", name: "initApi", sampleBuilder: function (e) { return '{\n  "status": 0,\n  "msg": "",\n\n  data: {\n    // ????????????\n    "id": 1,\n    "a": "sample"\n  }\n}' } }), r.getSchemaTpl("initFetch"), { label: "??????????????????", type: "switch", name: "interval", visibleOn: "data.initApi", pipeIn: function (e) { return !!e }, pipeOut: function (e) { return e ? 3e3 : void 0 }, mode: "inline" }, { name: "interval", type: "input-number", visibleOn: 'typeof this.interval === "number"', step: 500 }, { name: "silentPolling", label: "????????????", type: "switch", mode: "inline", visibleOn: "!!data.interval", description: "???????????????????????????????????????loading" }, { name: "stopAutoRefreshWhen", label: "?????????????????????????????????", type: "input-text", visibleOn: "!!data.interval", description: "???????????????????????????????????????????????????????????????????????????????????????????????????" }, { label: "??????????????????", type: "combo", name: "messages", multiLine: !0, description: "?????? ajax ???????????????????????? ajax ???????????? msg ???????????????????????? ajax ??????????????? msg ?????????????????? ajax ????????????", items: [{ label: "??????????????????", type: "input-text", name: "fetchSuccess" }, { label: "??????????????????", type: "input-text", name: "fetchFailed" }, { label: "??????????????????", type: "input-text", name: "saveSuccess" }, { label: "??????????????????", type: "input-text", name: "saveFailed" }] }] }, { title: "??????", body: [r.getSchemaTpl("className"), r.getSchemaTpl("className", { name: "headerClassName", label: "??????CSS??????" }), r.getSchemaTpl("className", { name: "bodyClassName", label: "??????CSS??????" }), r.getSchemaTpl("className", { name: "asideClassName", label: "??????CSS??????" }), r.getSchemaTpl("className", { name: "toolbarClassName", label: "?????????CSS??????" })] }, { title: "??????", body: [r.getSchemaTpl("name")] }])], t
            } return n.__extends(t, e), t
        }(o.BasePlugin);
        t.PagePlugin = s, i.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.PanelPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "panel", t.$schema = "/schemas/PanelSchema.json", t.name = "??????", t.icon = "fa fa-window-maximize", t.description = "??????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/panel", t.tags = "??????", t.scaffold = { type: "panel", title: "??????", body: "??????" }, t.previewSchema = { type: "panel", title: "??????????????????", body: "???????????????", className: "Panel--default text-left m-b-none", actions: [{ label: "??????1", type: "button" }, { label: "??????2", type: "button" }] }, t.regions = [{
                    key: "body", label: "?????????", renderMethod: "renderBody", renderMethodOverride: function (e, t) {
                        return function () {
                            for (var a = [], n = 0;
                                n < arguments.length;
                                n++)a[n] = arguments[n];
                            var l = this.props.$$editor, i = this.super.apply(this, a);
                            return l && !this.props.children ? t(this, i, e, l, l.plugin.manager) : i
                        }
                    }
                }, { key: "actions", label: "?????????", renderMethod: "renderActions", preferTag: "??????" }], t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var a = /(?:^|\/)form$/.test(e.path);
                    return [s.getSchemaTpl("tabs", [{ title: "??????", body: [{ label: "??????", name: "title", type: "input-text" }, a ? null : { children: i.default.createElement(l.Button, { size: "sm", level: "info", className: "m-b", onClick: function () { return t.manager.showInsertPanel("body") }, block: !0 }, "?????????????????????") }] }, { title: "??????", body: [{ name: "affixFooter", label: "????????????", type: "switch", value: !1, mode: "inline", className: "block" }, s.getSchemaTpl("horizontal", { visibleOn: '(data.mode || data.$$formMode) == "horizontal" && data.$$mode == "form"' }), { name: a ? "panelClassName" : "className", label: "??????", type: "button-group-select", size: "sm", pipeIn: function (e) { return "string" == typeof e && /(?:^|\s)(Panel\-\-(\w+))(?:$|\s)/.test(e) ? RegExp.$1 : "" }, pipeOut: function (e, t) { return t ? (t.replace(/(?:^|\s)(Panel\-\-(\w+))(?=($|\s))/g, "") + " " + e).replace(/\s+/g, " ").trim() : e }, options: [{ label: "??????", value: "Panel--default" }, { label: "??????", value: "Panel--primary" }, { label: "??????", value: "Panel--info" }, { label: "??????", value: "Panel--success" }, { label: "??????", value: "Panel--warning" }, { label: "??????", value: "Panel--danger" }] }, s.getSchemaTpl("className", { name: a ? "panelClassName" : "className", pipeIn: s.defaultValue("Panel--default") }), s.getSchemaTpl("className", { name: "headerClassName", label: "???????????? CSS ??????" }), s.getSchemaTpl("className", { name: "bodyClassName", label: "???????????? CSS ??????" }), s.getSchemaTpl("className", { name: "footerClassName", label: "???????????? CSS ??????" }), s.getSchemaTpl("className", { name: "actionsClassName", label: "???????????? CSS ??????" }), s.getSchemaTpl("subFormItemMode"), s.getSchemaTpl("subFormHorizontalMode"), s.getSchemaTpl("subFormHorizontal")] }, { title: "??????", body: [s.getSchemaTpl("ref"), s.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t.prototype.buildEditorPanel = function (t, a) {
                t.path;
                var n = t.schema;
                "form" !== t.info.renderer.name || !1 === n.wrapWithPanel || t.selections.length ? e.prototype.buildEditorPanel.call(this, t, a) : a.push({ key: "panel", icon: "fa fa-list-alt", title: this.panelTitle, render: this.manager.makeSchemaFormRender({ body: this.panelBodyCreator(t) }) })
            }, t
        }(r.BasePlugin);
        t.PanelPlugin = d, o.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.PlainPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "plain", t.$schema = "/schemas/PlainSchema.json", t.name = "?????????", t.icon = "fa fa-file-text-o", t.description = "????????????????????????html ?????????????????????", t.docLink = "/amis/zh-CN/components/plain", t.tags = ["??????"], t.previewSchema = { type: "plain", text: "???????????????", className: "text-center", inline: !1 }, t.scaffold = { type: "plain", tpl: "??????", inline: !1 }, t.panelTitle = "?????????", t.panelBodyCreator = function (e) {
                    var t = "table-cell" === e.info.renderer.name;
                    return o.getSchemaTpl("tabs", [{ title: "??????", body: [{ label: "??????", type: "textarea", pipeIn: function (e, t) { return e || t && t.text }, name: "tpl", description: '???????????????????????????????????????????????????????????????????????? <code>\\${xxx}</code> ??????????????????????????? lodash.template ???????????????????????????<a target="_blank" href="/amis/zh-CN/docs/concepts/template">??????</a>' }, { name: "placeholder", label: "?????????", type: "input-text", pipeIn: o.defaultValue("-") }] }, t ? null : { title: "??????", body: [{ label: "????????????", type: "switch", name: "inline", mode: "inline", className: "w-full", value: !0 }, o.getSchemaTpl("className")] }, t ? null : { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])
                }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.PlainPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ProgressPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "progress", t.$schema = "/schemas/ProgressSchema.json", t.name = "????????????", t.description = "????????????????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-angle-double-right", t.scaffold = { type: "progress", value: 66.66 }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var t = /\/field\/\w+$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: [t ? { type: "tpl", inline: !1, className: "text-info text-sm", tpl: "<p>????????????????????????????????????????????????????????????????????????</p>" } : null, { name: "showLabel", type: "switch", mode: "inline", pipeIn: o.defaultValue(!0), label: "??????????????????" }, { name: "stripe", type: "switch", mode: "inline", label: "??????????????????" }, { name: "animate", type: "switch", mode: "inline", label: "??????????????????" }, { name: "map", label: "????????????", type: "input-array", items: { type: "input-text" }, descrition: "??????????????????????????????????????????????????????", pipeIn: o.defaultValue(["bg-danger", "bg-warning", "bg-info", "bg-success", "bg-success"]) }, o.getSchemaTpl("switchDefaultValue"), { type: "input-text", name: "value", label: "?????????", validations: "isNumeric", visibleOn: 'typeof this.value !== "undefined"' }, { name: "placeholder", type: "input-text", pipeIn: o.defaultValue("-"), label: "?????????" }] }, { title: "??????", body: [o.getSchemaTpl("className"), o.getSchemaTpl("className", { name: "progressClassName", label: "???????????? CSS ??????", pipeIn: o.defaultValue("progress-xs progress-striped active m-t-xs m-b-none") }), o.getSchemaTpl("className", { name: "progressBarClassName", label: "????????? CSS ??????" })] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])]
                }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.ProgressPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.PropertyPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "property", t.$schema = "/schemas/PropertySchema.json", t.name = "?????????", t.icon = "fa fa-list", t.description = "?????????", t.docLink = "/amis/zh-CN/components/property", t.tags = ["??????"], t.scaffold = { type: "property", title: "????????????", items: [{ label: "cpu", content: "1 core" }, { label: "memory", content: "4G" }, { label: "disk", content: "80G" }, { label: "network", content: "4M", span: 2 }, { label: "IDC", content: "beijing" }, { label: "Note", content: "????????????", span: 3 }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ label: "??????", type: "input-text", name: "title" }, { label: "??????????????????", type: "input-number", value: 3, name: "column" }, { type: "radios", name: "mode", inline: !0, value: "table", label: "????????????", options: ["table", "simple"] }, { label: "?????????", type: "input-text", name: "separator", visibleOn: 'data.mode === "simple"' }, { label: "??????????????????", type: "input-text", name: "source" }, { label: "????????????", name: "items", type: "combo", multiple: !0, multiLine: !0, draggable: !0, addButtonText: "??????", items: [{ type: "input-text", mode: "inline", size: "sm", label: "?????????", name: "label" }, { type: "input-text", mode: "inline", size: "sm", label: "?????????", name: "content" }, { type: "input-number", mode: "inline", size: "sm", label: "?????????", value: 1, name: "span" }] }] }, { title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.PropertyPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.QRCodePlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "qrcode", t.$schema = "/schemas/QRCodeSchema.json", t.name = "?????????", t.description = "???????????????????????????", t.tags = ["??????"], t.icon = "fa fa-qrcode", t.scaffold = { type: "qrcode", value: "https://amis.baidu.com" }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "?????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "value", type: "input-text", label: "????????????", pipeIn: o.defaultValue("https://www.baidu.com"), description: "???????????? <code>\\${xxx}</code> ???????????????" }, { name: "level", type: "select", label: "?????????", pipeIn: o.defaultValue("L"), options: [{ label: "L", value: "L" }, { label: "M", value: "M" }, { label: "Q", value: "Q" }, { label: "H", value: "H" }] }] }, { title: "??????", body: [{ name: "codeSize", type: "input-number", label: "?????????", pipeIn: o.defaultValue(128) }, { name: "backgroundColor", type: "input-color", label: "?????????", pipeIn: o.defaultValue("#fff") }, { name: "foregroundColor", type: "input-color", label: "?????????", pipeIn: o.defaultValue("#000") }, o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.QRCodePlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ResetPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "reset", t.name = "??????", t.icon = "fa fa-eraser", t.description = "?????????????????????????????????????????????", t.docLink = "", t.panelTitle = "??????", t.scaffold = { type: "reset", label: "??????" }, t.previewSchema = n.__assign({}, t.scaffold), t
            } return n.__extends(t, e), t
        }(a(20).ButtonPlugin);
        t.ResetPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.ServicePlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "service", t.$schema = "/schemas/ServiceSchema.json", t.name = "??????(Service)", t.description = "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-server", t.scaffold = { type: "service", body: [{ type: "tpl", tpl: "??????", inline: !1 }] }, t.previewSchema = { type: "tpl", tpl: "???????????????????????????????????????" }, t.regions = [{ key: "body", label: "?????????" }], t.panelTitle = "??????", t.panelBodyCreator = function (e) { return s.getSchemaTpl("tabs", [{ title: "??????", body: [{ children: i.default.createElement(l.Button, { level: "info", size: "sm", className: "m-b-sm", block: !0, onClick: function () { t.manager.showInsertPanel("body", e.id) } }, "????????????") }, { type: "divider" }, s.getSchemaTpl("api", { label: "????????????" }), { name: "ws", type: "input-text", label: "WebSocket ??????????????????" }, s.getSchemaTpl("initFetch"), { name: "interval", label: "??????????????????", visibleOn: "this.api", type: "input-number", step: 500, description: "??????????????????????????????????????? ms" }, { name: "silentPolling", label: "????????????", mode: "inline", className: "block", type: "switch", visibleOn: "!!data.interval", description: "????????????????????????????????????????????????" }, { name: "stopAutoRefreshWhen", label: "????????????????????????", type: "input-text", visibleOn: "!!data.interval", description: "???????????????????????????????????????????????????????????????????????????????????????????????????" }, { type: "divider" }, s.getSchemaTpl("api", { name: "schemaApi", label: "?????? Schema ??????" }), { type: "divider" }, s.getSchemaTpl("initFetch", { name: "initFetchSchema", visibleOn: "data.schemaApi", label: "???????????????????????? Schema ??????" }), { label: "??????????????????", type: "combo", name: "messages", multiLine: !0, description: "?????? service ???????????????????????? service ???????????? msg ???????????????????????? service ??????????????? msg ?????????????????? service ????????????", items: [{ label: "????????????", type: "input-text", name: "fetchSuccess" }, { label: "????????????", type: "input-text", name: "fetchFailed" }] }] }, { title: "??????", body: [s.getSchemaTpl("className")] }, { title: "??????", body: [s.getSchemaTpl("ref"), s.getSchemaTpl("name"), s.getSchemaTpl("visible")] }]) }, t
            } return n.__extends(t, e), t
        }(r.BasePlugin);
        t.ServicePlugin = d, o.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.StatusPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "status", t.$schema = "/schemas/StatusSchema.json", t.name = "????????????", t.description = "??????????????????????????????????????????????????? 1 ?????? ??????0 ?????? x??????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-check-square-o", t.scaffold = { type: "status", value: 1 }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "??????", t.panelBodyCreator = function (e) { return [/\/field\/\w+$/.test(e.path) ? { type: "tpl", inline: !1, className: "text-info text-sm", tpl: "<p>????????????????????????????????????????????????????????????????????????</p>" } : null, { name: "map", label: "????????????", type: "input-array", items: { type: "input-text" }, descrition: "??????????????????????????????????????????????????????", pipeIn: o.defaultValue(["fa fa-times text-danger", "fa fa-check text-success"]) }, { name: "placeholder", type: "input-text", pipeIn: o.defaultValue("-"), label: "?????????" }, o.getSchemaTpl("className"), o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }, t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.StatusPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.StepsPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "steps", t.$schema = "/schemas/StepsSchema.json", t.name = "Steps ?????????", t.icon = "fa fa-forward", t.description = "Steps ?????????", t.tags = ["??????"], t.scaffold = { type: "steps", value: 1, steps: [{ title: "?????????", subTitle: "?????????", description: "??????" }, { title: "?????????" }, { title: "?????????" }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "Steps", t.panelBody = [{ type: "tabs", tabs: [{ title: "??????", body: [{ name: "steps", label: "????????????", type: "combo", scaffold: { type: "wrapper", body: "???????????????" }, minLength: 2, multiple: !0, draggable: !0, items: [{ type: "input-text", name: "title", label: !1, placeholder: "??????" }, { type: "input-text", name: "subTitle", label: !1, placeholder: "?????????" }, { type: "input-text", name: "description", label: !1, placeholder: "??????" }] }, { name: "value", type: "input-text", label: "????????????", description: "???????????????" }, { name: "status", type: "select", label: "????????????", creatable: !0, value: "finish", options: [{ label: "?????????", value: "process" }, { label: "??????", value: "wait" }, { label: "??????", value: "finish" }, { label: "??????", value: "error" }] }, o.getSchemaTpl("api", { name: "source", label: "??????????????????" })] }, { title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("visible")] }] }], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.StepsPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.SparklinePlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "sparkline", t.$schema = "/schemas/SparklineSchema.json", t.name = "?????????", t.description = "??????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-area-chart", t.scaffold = { type: "sparkline", height: 30, value: [3, 5, 2, 4, 1, 8, 3, 7] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "?????????", t.panelBody = [{ name: "height", type: "input-number", label: "??????" }], t
            } return n.__extends(t, e), t
        }(a(2).BasePlugin);
        t.SparklinePlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.SubmitPlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "submit", t.name = "??????", t.description = "????????????????????????????????????????????????????????????????????????????????????", t.docLink = "", t.panelTitle = "??????", t.scaffold = { type: "submit", label: "??????", level: "primary" }, t.previewSchema = n.__assign({}, t.scaffold), t
            } return n.__extends(t, e), t
        }(a(20).ButtonPlugin);
        t.SubmitPlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TablePlugin = void 0;
        var n = a(0), l = a(5), i = a(1), o = a(2), r = a(3), s = a(6), d = a(9), u = a(16), p = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "table", t.$schema = "/schemas/TableSchema.json", t.name = "??????", t.description = "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???CRUD??? ?????????", t.docLink = "/amis/zh-CN/components/table", t.icon = "fa fa-table", t.scaffold = { type: "table", columns: [{ label: "?????????", name: "a" }] }, t.regions = [{ key: "columns", label: "?????????", renderMethod: "renderTableContent", preferTag: "??????", dndMode: "position-h" }], t.previewSchema = { type: "table", className: "text-left m-b-none", affixHeader: !1, items: [{ a: 1, b: 2 }, { a: 3, b: 4 }, { a: 5, b: 6 }], columns: [{ label: "A", name: "a" }, { label: "B", name: "b" }] }, t.scaffoldForm = { title: "??????????????????", body: [{ name: "columns", type: "combo", multiple: !0, label: !1, addButtonText: "????????????", draggable: !0, items: [{ type: "input-text", name: "label", placeholder: "??????" }, { type: "input-text", name: "name", placeholder: "???????????????" }, { type: "select", name: "type", placeholder: "??????", value: "text", options: [{ value: "text", label: "?????????" }, { value: "tpl", label: "??????" }, { value: "image", label: "??????" }, { value: "date", label: "??????" }, { value: "progress", label: "??????" }, { value: "status", label: "??????" }, { value: "mapping", label: "??????" }, { value: "operation", label: "?????????" }] }] }], canRebuild: !0 }, t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var t = "crud" === e.schema.type;
                    return r.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "title", type: "input-text", label: "??????" }, t ? null : { name: "source", type: "input-text", label: "?????????", pipeIn: r.defaultValue("${items}"), description: "????????????????????????" }, { name: "combineNum", label: "?????????????????????", type: "input-number", placeholder: "????????????", description: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????" }] }, { title: "??????", body: [{ name: "columnsTogglable", label: "?????????????????????", type: "button-group-select", pipeIn: r.defaultValue("auto"), mode: "inline", className: "w-full", size: "xs", options: [{ label: "??????", value: "auto" }, { label: "??????", value: !0 }, { label: "??????", value: !1 }], description: "????????????????????????5??????????????????" }, { name: "affixHeader", type: "switch", label: "??????????????????", mode: "inline", className: "w-full", pipeIn: r.defaultValue(!0) }, { name: "showHeader", type: "switch", mode: "inline", className: "w-full", label: "??????????????????", pipeIn: r.defaultValue(!0) }, { name: "showFooter", type: "switch", mode: "inline", className: "w-full", label: "??????????????????", pipeIn: r.defaultValue(!0) }, { name: "footable", type: "switch", mode: "inline", className: "w-full", label: "??????????????????????????????", description: "??????????????????????????????????????????????????????????????????????????????????????????", pipeIn: function (e) { return !!e } }, { name: "footable.expand", type: "button-group-select", size: "xs", visibleOn: "data.footable", label: "??????????????????", pipeIn: r.defaultValue("none"), mode: "inline", className: "w-full", options: [{ label: "?????????", value: "first" }, { label: "??????", value: "all" }, { label: "?????????", value: "none" }] }, { name: "placeholder", pipeIn: r.defaultValue("????????????"), type: "input-text", label: "???????????????" }, { name: "rowClassNameExpr", type: "input-text", label: "???????????????", placeholder: "???????????????????????? <%= data.id % 2 ? 'bg-success' : '' %>" }, r.getSchemaTpl("className", { label: "?????? CSS ??????" }), r.getSchemaTpl("className", { name: "tableClassName", label: "?????? CSS ??????" }), r.getSchemaTpl("className", { name: "headerClassName", label: "???????????? CSS ??????" }), r.getSchemaTpl("className", { name: "footerClassName", label: "???????????? CSS ??????" }), r.getSchemaTpl("className", { name: "toolbarClassName", label: "????????? CSS ??????" })] }, { title: "??????", body: [r.getSchemaTpl("ref"), r.getSchemaTpl("visible")] }])
                }, t
            } return n.__extends(t, e), t.prototype.filterProps = function (e) {
                var t = Array.isArray(e.value) ? e.value : "string" == typeof e.source ? l.resolveVariable(e.source, e.data) : l.resolveVariable("${items}", e.data);
                if (Array.isArray(t) && t.length) e.value = t.slice(0, 10);
                else {
                    var a = {};
                    Array.isArray(e.columns) && e.columns.forEach((function (e) { e.name && d.setVariable(a, e.name, u.mockValue(e)) })), e.value = s.repeatArray(a, 1).map((function (e, t) { return n.__assign(n.__assign({}, e), { id: t + 1 }) }))
                } return e
            }, t.prototype.getRendererInfo = function (t) {
                var a, l = t.schema, i = t.renderer;
                return l.$$id || "crud" !== (null === (a = l.$$editor) || void 0 === a ? void 0 : a.renderer.name) || "table" !== i.name ? e.prototype.getRendererInfo.call(this, t) : n.__assign(n.__assign({}, { id: l.$$editor.id }), { name: this.name, regions: this.regions, patchContainers: this.patchContainers, vRendererConfig: this.vRendererConfig, wrapperProps: this.wrapperProps, wrapperResolve: this.wrapperResolve, filterProps: this.filterProps, $schema: this.$schema, renderRenderer: this.renderRenderer })
            }, t.prototype.beforeInsert = function (e) {
                var t, a, l, i, o = e.context;
                o.info.plugin !== this && (null === (t = o.node.sameIdChild) || void 0 === t ? void 0 : t.info.plugin) !== this || "columns" !== o.region || (o.data = n.__assign(n.__assign({}, o.data), { label: null !== (i = null !== (a = o.data.label) && void 0 !== a ? a : null === (l = o.subRenderer) || void 0 === l ? void 0 : l.name) && void 0 !== i ? i : "?????????" }))
            }, t
        }(o.BasePlugin);
        t.TablePlugin = p, i.registerEditorPlugin(p)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TableCellPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = a(9), u = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.panelTitle = "?????????", t.panelIcon = "fa fa-columns", t.panelBodyCreator = function (e) {
                    return [s.getSchemaTpl("tabs", [{ title: "??????", body: [{ children: i.default.createElement(l.Button, { size: "sm", level: "info", className: "m-b", block: !0, onClick: t.exchangeRenderer.bind(t, e.id) }, "?????????????????????") }, { name: "label", label: "?????????", type: "input-text" }, { name: "name", type: "input-text", label: "???????????????" }, { name: "remark", label: "??????", type: "input-text", description: "???????????????????????????????????????????????????????????????" }, { name: "placeholder", type: "input-text", label: "?????????", value: "-", description: "???????????????????????????????????????" }, { name: "sortable", type: "switch", label: "???????????????", mode: "inline", className: "w-full", description: "????????????????????????????????????(????????????)???" }] }, {
                        title: "??????", body: [{ name: "groupName", label: "???????????????", type: "input-text", description: '????????????????????????????????????????????????????????????????????????????????????????????????<a href="https://baidu.github.io/amis/crud/header-group" target="_blank">??????</a>' }, { name: "quickEdit", label: "??????????????????", type: "switch", pipeIn: function (e) { return !!e }, mode: "inline", className: "w-full" }, { visibleOn: "data.quickEdit", name: "quickEdit.mode", type: "button-group-select", value: "popOver", label: "??????????????????", size: "xs", mode: "inline", className: "w-full", options: [{ label: "??????", value: "popOver" }, { label: "??????", value: "inline" }] }, { visibleOn: "data.quickEdit", name: "quickEdit.saveImmediately", label: "??????????????????", type: "switch", mode: "inline", className: "w-full", description: "???????????????????????????????????????????????????????????????", descriptionClassName: "help-block m-b-none", pipeIn: function (e) { return !!e } }, s.getSchemaTpl("api", { label: "??????????????????", description: "???????????????????????????????????????????????????????????????????????????quickSaveItemApi???", name: "quickEdit.saveImmediately.api", visibleOn: "this.quickEdit && this.quickEdit.saveImmediately" }), {
                            visibleOn: "data.quickEdit", name: "quickEdit", asFormItem: !0, children: function (e) {
                                var a = e.value, o = e.onChange, r = e.data;
                                !0 === a ? a = {} : void 0 === a && (a = d.getVariable(r, "quickEdit"));
                                var s = a.mode;
                                return delete (a = n.__assign({ type: "input-text", name: r.name }, a)).mode, i.default.createElement(l.Button, { level: "info", className: "m-b", size: "sm", block: !0, onClick: function () { t.manager.openSubEditor({ title: "????????????????????????", value: a, slot: { type: "form", mode: "normal", body: ["$$"], wrapWithPanel: !1 }, onChange: function (e) { return o(n.__assign(n.__assign({}, e), { mode: s }), "quickEdit") } }) } }, "??????????????????")
                            }
                        }, { name: "popOver", label: "????????????????????????", type: "switch", pipeIn: function (e) { return !!e }, mode: "inline", className: "w-full" }, { name: "popOver.mode", label: "????????????????????????", type: "select", visibleOn: "data.popOver", pipeIn: s.defaultValue("popOver"), options: [{ label: "??????", value: "popOver" }, { label: "??????", value: "dialog" }, { label: "???????????????", value: "drawer" }] }, { name: "popOver.position", label: "????????????????????????", type: "select", visibleOn: 'data.popOver && data.popOver.mode === "popOver"', pipeIn: s.defaultValue("center"), options: [{ label: "????????????", value: "center" }, { label: "???????????????", value: "left-top" }, { label: "???????????????", value: "right-top" }, { label: "???????????????", value: "left-bottom" }, { label: "???????????????", value: "right-bottom" }, { label: "???????????????", value: "fixed-left-top" }, { label: "???????????????", value: "fixed-right-top" }, { label: "???????????????", value: "fixed-left-bottom" }, { label: "???????????????", value: "fixed-right-bottom" }] }, {
                            visibleOn: "data.popOver", name: "popOver", asFormItem: !0, children: function (e) {
                                var a = e.value, o = e.onChange;
                                return a = n.__assign({ type: "panel", title: "????????????", body: "????????????" }, a), i.default.createElement(l.Button, { level: "info", className: "m-b", size: "sm", block: !0, onClick: function () { t.manager.openSubEditor({ title: "??????????????????????????????", value: a, onChange: function (e) { return o(e, "popOver") } }) } }, "????????????????????????")
                            }
                        }, { name: "copyable", label: "????????????????????????", type: "switch", pipeIn: function (e) { return !!e }, mode: "inline", className: "w-full" }, { visibleOn: "data.copyable", name: "copyable.content", type: "textarea", label: "??????????????????", description: "???????????????????????????????????????" }]
                    }, { title: "??????", body: [{ name: "fixed", type: "button-group-select", label: "????????????", pipeIn: s.defaultValue(""), size: "xs", mode: "inline", className: "w-full", options: [{ value: "", label: "?????????" }, { value: "left", label: "??????" }, { value: "right", label: "??????" }] }, { name: "toggled", type: "switch", label: "????????????", mode: "inline", className: "w-full", pipeIn: s.defaultValue(!0) }, { name: "breakpoint", type: "button-group-select", label: "????????????????????????", visibleOn: "data.tableFootableEnabled", size: "xs", multiple: !0, options: [{ label: "??????", value: "*" }, { label: "?????????", value: "xs" }, { label: "??????", value: "sm" }, { label: "PC??????", value: "md" }, { label: "PC??????", value: "lg" }], pipeIn: function (e) { return e ? "string" == typeof e ? e : "*" : "" }, pipeOut: function (e) { return "string" == typeof e && ~e.indexOf("*") && /xs|sm|md|lg/.test(e) ? e.replace(/\*\s*,\s*|\s*,\s*\*/g, "") : e } }, { type: "switch", name: "className", label: "??????????????????", mode: "inline", className: "w-full", pipeIn: function (e) { return "string" == typeof e && /\word\-break\b/.test(e) }, pipeOut: function (e, t) { return (e ? "word-break " : "") + (t || "").replace(/\bword\-break\b/g, "").trim() } }, s.getSchemaTpl("className"), s.getSchemaTpl("className", { name: "innerClassName", label: "?????? CSS ??????" }), { name: "width", type: "input-number", label: "??????", description: "???????????????????????????????????????" }] }])]
                }, t
            } return n.__extends(t, e), t.prototype.getRendererInfo = function (e) {
                var t = e.renderer, a = e.schema;
                if ("table-cell" === t.name) return {
                    name: a.label ? "<" + a.label + ">???" : "?????????", $schema: "/schemas/TableColumn.json", multifactor: !0, wrapperResolve: function (e) {
                        var t = [].slice.call(e.parentElement.children).indexOf(e) + 1, n = e.closest("table");
                        return [].slice.call(n.querySelectorAll("th:nth-child(" + t + '):not([data-editor-id="' + a.id + '"]),\n              td:nth-child(' + t + '):not([data-editor-id="' + a.id + '"])'))
                    }
                }
            }, t.prototype.exchangeRenderer = function (e) { this.manager.showReplacePanel(e, "??????") }, t.prototype.beforeReplace = function (e) {
                var t = e.context;
                t.info.plugin === this && t.data && (t.data.label = t.data.label || t.schema.label, t.data.name = t.data.name || t.schema.name)
            }, t
        }(r.BasePlugin);
        t.TableCellPlugin = u, o.registerEditorPlugin(u)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TabsPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(1), o = a(2), r = a(3), s = a(17), d = a(13), u = n.__importDefault(a(15)), p = a(14), c = a(5), m = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "tabs", t.$schema = "/schemas/TabsSchema.json", t.name = "?????????", t.description = "??????????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/tabs", t.tags = ["??????"], t.icon = "fa fa-folder-o", t.scaffold = { type: "tabs", tabs: [{ title: "?????????1", body: "??????1" }, { title: "?????????2", body: "??????2" }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "?????????", t.panelBody = [r.getSchemaTpl("fieldSet", { title: "??????", body: [{ name: "tabs", type: "combo", label: "???????????????", multiple: !0, draggable: !0, minLength: 1, items: [{ type: "input-text", name: "title", required: !0 }], scaffold: { title: "?????????", body: { type: "tpl", tpl: "??????", inline: !1 } }, addButtonText: "???????????????", draggableTip: "" }] }), r.getSchemaTpl("fieldSet", { title: "??????", body: [{ name: "tabsMode", label: "??????", type: "select", className: "block", pipeIn: r.defaultValue(""), options: [{ label: "??????", value: "" }, { label: "??????", value: "line" }, { label: "??????", value: "card" }, { label: "??? Chrome", value: "chrome" }, { label: "????????????", value: "tiled" }, { label: "?????????", value: "radio" }, { label: "??????", value: "vertical" }] }, r.getSchemaTpl("className"), r.getSchemaTpl("className", { name: "contentClassName", label: "??????????????? CSS ??????" }), r.getSchemaTpl("subFormItemMode"), r.getSchemaTpl("subFormHorizontalMode"), r.getSchemaTpl("subFormHorizontal")] }), r.getSchemaTpl("fieldSet", { title: "??????", body: [{ type: "switch", name: "mountOnEnter", label: "??????????????????", mode: "inline", className: "block", description: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" }, { type: "switch", name: "unmountOnExit", label: "???????????????", mode: "inline", className: "block", description: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" }, r.getSchemaTpl("visible")] })], t.patchContainers = ["tabs.body"], t.vRendererConfig = { regions: { body: { key: "body", label: "?????????" } }, panelTitle: "??????", panelBody: [r.getSchemaTpl("fieldSet", { title: "??????", body: [{ name: "title", label: "??????", type: "input-text", required: !0 }, r.getSchemaTpl("icon"), { label: "Hash", name: "hash", type: "input-text", description: "??????????????????????????????????????? Hash???" }] }), r.getSchemaTpl("fieldSet", { title: "??????", body: [r.getSchemaTpl("className")], collapsed: !0 }), r.getSchemaTpl("fieldSet", { title: "??????", body: [{ type: "switch", name: "reload", label: "????????????", mode: "inline", className: "block", description: "????????????????????????????????????????????????????????????????????????????????????????????????????????????" }, { type: "switch", name: "mountOnEnter", visibleOn: "!this.reload", label: "??????????????????", mode: "inline", className: "block", description: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" }, { visibleOn: "!this.reload", type: "switch", name: "unmountOnExit", label: "???????????????", mode: "inline", className: "block", description: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" }, r.getSchemaTpl("visible"), r.getSchemaTpl("disabled")] })] }, t.wrapperProps = { unmountOnExit: !0, mountOnEnter: !0 }, t.tabWrapperResolve = function (e) { return e.parentElement }, t.overrides = {
                    renderTabs: function () {
                        var e = this, t = this.super();
                        if (!this.renderTab && this.props.$$editor && t) {
                            var a = this.props.tabs;
                            return s.mapReactElement(t, (function (t) {
                                var n, i;
                                if (t.type === c.Tab && t.props.$$id) {
                                    var o = t.props.$$id, r = u.default(a, (function (e) { return e.$$id === o })), s = e.props.$$editor, m = s.plugin;
                                    if (~r) {
                                        var h = null === (i = null === (n = m.vRendererConfig) || void 0 === n ? void 0 : n.regions) || void 0 === i ? void 0 : i.body;
                                        return h ? l.default.cloneElement(t, { children: l.default.createElement(d.VRenderer, { key: o, plugin: s.plugin, renderer: s.renderer, $schema: "/schemas/TabSchema.json", hostId: s.id, memberIndex: r, name: "" + (t.props.title || "??????" + (r + 1)), id: o, draggable: !1, wrapperResolve: m.tabWrapperResolve, schemaPath: s.schemaPath + "/tabs/" + r, path: e.props.$path + "/" + r, data: e.props.data }, l.default.createElement(p.RegionWrapper, { key: h.key, preferTag: h.preferTag, name: h.key, label: h.label, regionConfig: h, placeholder: h.placeholder, editorStore: m.manager.store, manager: m.manager, children: t.props.children, wrapperResolve: h.wrapperResolve, rendererName: s.renderer.name })) }) : t
                                    }
                                } return t
                            }))
                        } return t
                    }
                }, t
            } return n.__extends(t, e), t.prototype.buildEditorToolbar = function (e, t) {
                if (e.info.plugin === this && "tabs" === e.info.renderer.name && !e.info.hostId) {
                    var a = e.node;
                    t.push({
                        level: "secondary", icon: "fa fa-chevron-left", tooltip: "????????????", onClick: function () {
                            var e = a.getComponent();
                            if (null == e ? void 0 : e.switchTo) {
                                var t = e.currentIndex();
                                e.switchTo(t - 1)
                            }
                        }
                    }), t.push({
                        level: "secondary", icon: "fa fa-chevron-right", tooltip: "????????????", onClick: function () {
                            var e = a.getComponent();
                            if (null == e ? void 0 : e.switchTo) {
                                var t = e.currentIndex();
                                e.switchTo(t + 1)
                            }
                        }
                    })
                }
            }, t.prototype.onPreventClick = function (e) {
                var t = e.context.data;
                return !t.defaultPrevented && (!t.target.closest("[role=tablist]>li") && void 0)
            }, t
        }(o.BasePlugin);
        t.TabsPlugin = m, i.registerEditorPlugin(m)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TasksPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "tasks", t.$schema = "/schemas/TasksSchema.json", t.name = "????????????", t.description = "??????????????????????????????????????????", t.tags = ["??????"], t.icon = "", t.scaffold = { type: "tasks", name: "tasks", items: [{ label: "hive ??????", key: "hive", status: 4, remark: '????????????<a target="_blank" href="http://www.baidu.com">??????</a>???' }, { label: "?????????", key: "partial", status: 4 }, { label: "??????", key: "full", status: 4 }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "????????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "items", label: "??????????????????", type: "combo", multiple: !0, multiLine: !0, items: [{ name: "label", type: "input-text", label: "????????????" }, { name: "key", type: "input-text", label: "??????ID" }, { name: "status", type: "input-number", label: "????????????" }, { name: "remark", type: "textarea", label: "????????????" }], addButtonText: "??????????????????", scaffold: { label: "??????", key: "key", status: 0, remark: "??????" }, description: "???????????????????????????????????????????????????????????????" }, o.getSchemaTpl("api", { name: "checkApi", label: "??????????????????" }), { name: "interval", type: "input-number", min: 3e3, step: 500, visibleOn: "data.checkApi", pipeIn: o.defaultValue(3e3), label: "??????????????????" }, o.getSchemaTpl("api", { name: "submitApi", label: "????????????" }), o.getSchemaTpl("api", { name: "reSubmitApi", label: "????????????" }), { name: "taskNameLabel", type: "input-text", pipeIn: o.defaultValue("????????????"), label: "?????????????????????" }, { name: "operationLabel", type: "input-text", pipeIn: o.defaultValue("??????"), label: "???????????????" }, { name: "statusLabel", type: "input-text", pipeIn: o.defaultValue("??????"), label: "???????????????" }, { name: "remarkLabel", type: "input-text", pipeIn: o.defaultValue("????????????"), label: "???????????????" }, { name: "btnText", label: "????????????", type: "input-text", pipeIn: o.defaultValue("??????") }, { name: "retryBtnText", label: "??????????????????", type: "input-text", pipeIn: o.defaultValue("??????") }, { name: "statusTextMap", pipeIn: o.defaultValue(["?????????", "??????", "?????????", "??????", "?????????", "??????"]), type: "input-array", label: "????????????????????????", multiple: !0, addable: !1, removable: !1, items: { type: "input-text", placeholder: "??????" } }, { name: "initialStatusCode", label: "???????????????", pipeIn: o.defaultValue(0), type: "input-number" }, { name: "readyStatusCode", label: "???????????????", pipeIn: o.defaultValue(1), type: "input-number" }, { name: "loadingStatusCode", label: "??????????????????", pipeIn: o.defaultValue(2), type: "input-number" }, { name: "errorStatusCode", label: "???????????????", pipeIn: o.defaultValue(3), type: "input-number" }, { name: "finishStatusCode", label: "???????????????", pipeIn: o.defaultValue(4), type: "input-number" }, { name: "canRetryStatusCode", label: "???????????????????????????", pipeIn: o.defaultValue(5), type: "input-number" }] }, { title: "??????", body: [o.getSchemaTpl("className", { pipeIn: o.defaultValue("b-a bg-white table-responsive") }), o.getSchemaTpl("className", { name: "tableClassName", label: "?????? CSS ??????", pipeIn: o.defaultValue("table table-striped m-b-none") }), o.getSchemaTpl("className", { name: "btnClassName", label: "?????? CSS ??????", pipeIn: o.defaultValue("btn-sm btn-default") }), o.getSchemaTpl("className", { name: "retryBtnClassName", label: "???????????? CSS ??????", pipeIn: o.defaultValue("btn-sm btn-danger") }), { name: "statusLabelMap", pipeIn: o.defaultValue(["label-warning", "label-info", "label-info", "label-danger", "label-success", "label-danger"]), type: "input-array", label: "???????????? CSS ????????????", multiple: !0, addable: !1, removable: !1, items: { type: "input-text", placeholder: "CSS ??????" } }] }, { title: "??????", body: [o.getSchemaTpl("visible")] }, { title: "??????", body: [o.getSchemaTpl("ref")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.TasksPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TimePlugin = void 0;
        var n = a(0), l = a(1), i = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "time", t.name = "????????????", t.scaffold = { type: "time" }, t.previewSchema = n.__assign(n.__assign({}, t.scaffold), { format: "HH:mm:ss", value: Math.round(Date.now() / 1e3) }), t
            } return n.__extends(t, e), t
        }(a(29).DatePlugin);
        t.TimePlugin = i, l.registerEditorPlugin(i)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TplPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3);
        o.setSchemaTpl("tpl:content", { label: "??????", type: "textarea", required: !0, minRows: 5, language: "html", pipeIn: function (e, t) { return e || t && t.html }, name: "tpl", description: '???????????? <code>\\${xxx}</code> ??????????????????????????? lodash.template ???????????????????????????<a target="_blank" href="/amis/zh-CN/docs/concepts/template">??????</a>' }), o.setSchemaTpl("tpl:wrapperComponent", { name: "wrapperComponent", type: "select", pipeIn: o.defaultValue("div"), label: "??????", options: [{ label: "????????????", value: "div" }, { label: "??????", value: "p" }, { label: "????????????", value: "h1" }, { label: "????????????", value: "h2" }, { label: "????????????", value: "h3" }, { label: "????????????", value: "h4" }, { label: "????????????", value: "h5" }, { label: "????????????", value: "h6" }] }), o.setSchemaTpl("tpl:inline", { label: "????????????", type: "switch", name: "inline", mode: "inline", className: "w-full", pipeIn: o.defaultValue(!0), labelRemark: { trigger: "click", className: "m-l-xs", rootClose: !0, content: "?????????????????? <code>span</code> ??????????????????????????? <code>div</code> ?????????????????????", placement: "left" } });
        var r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "tpl", t.$schema = "/schemas/TplSchema.json", t.name = "??????", t.icon = "fa fa-file-o", t.description = "?????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/tpl", t.tags = ["??????"], t.previewSchema = { type: "tpl", tpl: "??????????????????????????????<%- new Date() %>" }, t.scaffold = { type: "tpl", tpl: "???????????????", inline: !1 }, t.panelTitle = "??????", t.panelBodyCreator = function (e) {
                    var t = /\/cell\/field\/tpl$/.test(e.path);
                    return [o.getSchemaTpl("tabs", [{ title: "??????", body: [o.getSchemaTpl("tpl:content"), t ? null : o.getSchemaTpl("tpl:wrapperComponent")] }, { title: "??????", body: [o.getSchemaTpl("tpl:inline"), o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])]
                }, t.popOverBody = [o.getSchemaTpl("tpl:content"), o.getSchemaTpl("tpl:wrapperComponent")], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.TplPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.AnchorNavPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(1), o = a(3), r = a(2), s = a(13), d = a(17), u = n.__importDefault(a(15)), p = a(14), c = a(195), m = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "anchor-nav", t.$schema = "/schemas/AnchorNavSchema.json", t.name = "????????????", t.description = "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/anchor-nav", t.tags = ["??????"], t.icon = "fa fa-link", t.scaffold = { type: "anchor-nav", links: [{ title: "????????????", body: "????????????" }, { title: "??????????????????", body: [{ type: "form", body: [{ type: "fieldSet", title: "??????????????????", body: [{ type: "input-email", name: "email", placeholder: "?????????????????????", label: "??????" }] }] }] }, { title: "????????????", body: [{ type: "form", body: [{ type: "fieldSet", title: "????????????", body: [{ type: "input-email", name: "email", placeholder: "?????????????????????", label: "??????" }] }] }] }, { title: "????????????", body: "????????????" }, { title: "??????????????????", body: "??????????????????" }] }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "????????????", t.panelBody = [o.getSchemaTpl("fieldSet", { title: "??????", body: [{ name: "links", type: "combo", label: "????????????", multiple: !0, draggable: !0, minLength: 1, items: [{ type: "input-text", name: "title", required: !0 }], scaffold: { title: "????????????", body: { type: "tpl", tpl: "??????", inline: !1 } }, addButtonText: "????????????", draggableTip: "" }] }), o.getSchemaTpl("fieldSet", { title: "??????", body: [o.getSchemaTpl("className"), o.getSchemaTpl("className", { name: "linkClassName", label: "?????? CSS ??????" }), o.getSchemaTpl("className", { name: "sectionClassName", label: "???????????? CSS ??????" })] })], t.patchContainers = ["anchor-nav.body"], t.vRendererConfig = { regions: { body: { key: "body", label: "?????????" } }, panelTitle: "????????????", panelBody: [o.getSchemaTpl("fieldSet", { title: "??????", body: [{ name: "title", label: "??????", type: "input-text", required: !0 }] }), o.getSchemaTpl("fieldSet", { title: "??????", body: [o.getSchemaTpl("className")] })] }, t.wrapperProps = { unmountOnExit: !0, mountOnEnter: !0 }, t.sectionWrapperResolve = function (e) { return e.parentElement }, t.overrides = {
                    render: function () {
                        var e = this, t = this.super();
                        if (!this.renderSection && this.props.$$editor && t) {
                            var a = this.props.links;
                            return d.mapReactElement(t, (function (t) {
                                var n, i;
                                if (t.type === c.AnchorNavSection && t.props.$$id) {
                                    var o = t.props.$$id, r = u.default(a, (function (e) { return e.$$id === o })), d = e.props.$$editor, m = d.plugin;
                                    if (~r) {
                                        var h = null === (i = null === (n = m.vRendererConfig) || void 0 === n ? void 0 : n.regions) || void 0 === i ? void 0 : i.body;
                                        return h ? l.default.cloneElement(t, { children: l.default.createElement(s.VRenderer, { key: o, plugin: d.plugin, renderer: d.renderer, $schema: "/schemas/SectionSchema.json", hostId: d.id, memberIndex: r, name: "" + (t.props.title || "????????????" + (r + 1)), id: o, draggable: !1, wrapperResolve: m.sectionWrapperResolve, schemaPath: d.schemaPath + "/anchor-nav/" + r, path: e.props.$path + "/" + r, data: e.props.data }, l.default.createElement(p.RegionWrapper, { key: h.key, preferTag: h.preferTag, name: h.key, label: h.label, regionConfig: h, placeholder: h.placeholder, editorStore: m.manager.store, manager: m.manager, children: t.props.children, wrapperResolve: h.wrapperResolve, rendererName: d.renderer.name })) }) : t
                                    }
                                } return t
                            }))
                        } return t
                    }
                }, t
            } return n.__extends(t, e), t
        }(r.BasePlugin);
        t.AnchorNavPlugin = m, i.registerEditorPlugin(m)
    }, function (e, t) { e.exports = require("deb4712") }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.VideoPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = a(6), s = a(16), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "video", t.$schema = "/schemas/VideoSchema.json", t.name = "??????", t.description = "???????????????????????????????????????????????????????????? flv ??? hls ?????????", t.tags = ["??????"], t.icon = "fa fa-video-camera", t.scaffold = { type: "video", autoPlay: !1, src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4", poster: s.mockValue({ type: "image" }) }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "??????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "src", type: "input-text", label: "????????????", description: "???????????????????????????????????????????????????<code>\\${videoSrc}</code>" }, { name: "poster", type: "input-text", label: "????????????????????????", description: "???????????????????????????????????????????????????<code>\\${videoPoster}</code>" }, { name: "autoPlay", type: "switch", mode: "inline", className: "block", label: "????????????" }, { name: "muted", type: "switch", mode: "inline", className: "block", label: "??????" }, { name: "isLive", type: "switch", mode: "inline", className: "block", label: "?????????", description: "?????????????????????????????????????????????????????????????????????" }] }, { title: "??????", body: [{ name: "aspectRatio", label: "????????????", type: "button-group-select", size: "sm", mode: "inline", className: "block", value: "auto", options: [{ label: "??????", value: "auto" }, { label: "4:3", value: "4:3" }, { label: "16:9", value: "16:9" }] }, { name: "splitPoster", type: "switch", mode: "inline", className: "block", label: "??????????????????" }, o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("visible")] }, { title: "??????", body: [o.getSchemaTpl("ref"), { type: "input-text", name: "rates", label: "????????????", multiple: !0, joinValues: !1, extractValue: !0, options: [.5, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((function (e) { return { label: e, value: e } })) }, { name: "frames", type: "input-text", label: "???????????????", description: "???????????????<code>\\${videoFrames}</code>?????????????????????????????? videoFrames ?????????????????????????????????????????????????????????????????????????????????????????????" }] }])], t
            } return n.__extends(t, e), t.prototype.filterProps = function (e) { return e.frames = r.JSONPipeOut(e.frames), e }, t
        }(i.BasePlugin);
        t.VideoPlugin = d, l.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.WizardPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = n.__importDefault(a(4)), s = a(13), d = a(17), u = a(14), p = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "wizard", t.$schema = "/schemas/WizardSchema.json", t.name = "??????", t.description = "???????????????????????????????????????????????????????????????????????????????????????????????????????????????", t.docLink = "/amis/zh-CN/components/form/wizard", t.tags = ["??????"], t.icon = "fa fa-list-ol", t.scaffold = { type: "wizard", steps: [{ title: "?????????", body: [{ type: "input-text", label: "??????", name: "var1" }] }, { title: "?????????", body: [{ type: "input-text", label: "??????2", name: "var2" }] }] }, t.previewSchema = { type: "wizard", className: "text-left m-b-none", steps: [{ title: "?????????", body: [{ type: "input-text", label: "??????", name: "var1" }] }, { title: "?????????", body: [] }] }, t.panelTitle = "??????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "steps", label: "????????????", type: "combo", multiple: !0, multiLine: !0, addButtonText: "????????????", scaffold: { title: "??????", items: [{ type: "input-text", name: "var1", label: "??????" }] }, items: [{ name: "title", type: "input-text", label: "??????", pipeIn: function (e, t) { return e || t.label } }, { type: "fieldSet", title: "????????????", collapsed: !0, collapsable: !0, className: "fieldset m-b-none", body: [{ name: "mode", label: "????????????", type: "button-group-select", size: "xs", mode: "inline", className: "w-full", value: "normal", options: [{ label: "??????", value: "normal" }, { label: "????????????", value: "horizontal" }, { label: "??????", value: "inline" }] }, o.getSchemaTpl("horizontal", { visibleOn: 'data.mode == "horizontal"' }), o.getSchemaTpl("api", { label: "????????????", description: "????????????????????? <code>step</code> ?????????????????????????????????????????? <code>3</code>??????????????????????????? 3 ???" }), { label: "???????????????????", remark: { trigger: "click", rootClose: !0, title: "????????????????????????", content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, type: "switch", name: "asyncApi", visibleOn: "data.api", pipeIn: function (e) { return null != e }, pipeOut: function (e) { return e ? "" : void 0 }, mode: "inline", className: "block" }, o.getSchemaTpl("api", { name: "asyncApi", label: "??????????????????", visibleOn: "data.asyncApi != null", description: "????????????????????????????????????????????????????????????????????????????????????????????????????????? finished ????????? true ??? ??????" }), { type: "divider" }, o.getSchemaTpl("api", { name: "initApi", label: "???????????????", description: "???????????????????????????" }), { label: "?????????????????????", remark: { trigger: "click", rootClose: !0, title: "????????????????????????", content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, type: "switch", name: "initAsyncApi", visibleOn: "data.initApi", pipeIn: function (e) { return null != e }, pipeOut: function (e) { return e ? "" : void 0 }, mode: "inline", className: "block" }, o.getSchemaTpl("api", { name: "initAsyncApi", label: "??????????????????", visibleOn: "data.initAsyncApi != null", description: "????????????????????????????????? initApi ?????????????????????????????????????????????????????? finished ????????? true ??? ??????" }), o.getSchemaTpl("initFetch"), { label: "??????????????????", type: "input-text", name: "jumpableOn", description: "??????????????????????????????????????????????????????????????????????????????currentStep ?????????????????????" }] }] }, { type: "input-text", name: "startStep", label: "???????????????", description: "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????step????????????startStep??????" }] }, { title: "??????", body: [o.getSchemaTpl("api", { name: "initApi", label: "???????????????", description: "???????????????????????????????????????????????? <code>step</code> ??????????????????????????????????????????????????????????????????????????????????????????????????? <code>submiting</code> ???????????????????????????????????????????????????????????? wizard ?????????????????????????????????" }), { label: "?????????????????????", remark: { trigger: "click", rootClose: !0, title: "????????????????????????", content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, type: "switch", name: "initAsyncApi", visibleOn: "data.initApi", pipeIn: function (e) { return null != e }, pipeOut: function (e) { return e ? "" : void 0 }, mode: "inline" }, o.getSchemaTpl("api", { name: "initAsyncApi", label: "??????????????????", visibleOn: "data.initAsyncApi != null", description: "????????????????????????????????? initApi ?????????????????????????????????????????????????????? finished ????????? true ??? ??????" }), { name: "initFetch", type: "radios", label: "??????????????????", inline: !0, onChange: function () { document.getElementsByClassName("ae-Settings-content")[0].scrollTop = 0 }, options: [{ label: "???", value: !0 }, { label: "???", value: !1 }, { label: "?????????", value: "" }] }, { name: "initFetch", autoComplete: !1, visibleOn: 'typeof this.initFetch !== "boolean"', type: "input-text", placeholder: "", className: "m-t-n-sm" }, { type: "divider" }, o.getSchemaTpl("api", { label: "????????????", description: "????????????????????????, ?????????????????????????????????<code>????????????????????????????????????????????????????????????????????????</code>" }), { label: "???????????????????", remark: { trigger: "click", rootClose: !0, title: "????????????????????????", content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, type: "switch", name: "asyncApi", visibleOn: "data.api", pipeIn: function (e) { return null != e }, pipeOut: function (e) { return e ? "" : void 0 }, mode: "inline" }, o.getSchemaTpl("api", { name: "asyncApi", label: "??????????????????", visibleOn: "data.asyncApi != null", description: "????????????????????????????????????????????????????????????????????????????????????????????????????????? finished ????????? true ??? ??????" })] }, { title: "??????", body: [{ name: "mode", label: "????????????", type: "button-group-select", size: "sm", mode: "inline", className: "w-full", value: "horizontal", options: [{ label: "??????", value: "horizontal" }, { label: "??????", value: "vertical" }] }, { name: "actionPrevLabel", label: "?????????????????????", type: "input-text", pipeIn: o.defaultValue("?????????") }, { name: "actionNextLabel", label: "?????????????????????", type: "input-text", pipeIn: o.defaultValue("?????????") }, { name: "actionNextSaveLabel", label: "??????????????????????????????", type: "input-text", pipeIn: o.defaultValue("??????????????????") }, { name: "actionFinishLabel", label: "??????????????????", type: "input-text", pipeIn: o.defaultValue("??????") }, o.getSchemaTpl("className"), o.getSchemaTpl("className", { name: "actionClassName", label: "?????? CSS ??????" })] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("name"), o.getSchemaTpl("reload"), { label: "??????", name: "redirect", type: "input-text", description: "???????????????????????????????????????????????????????????????" }, o.getSchemaTpl("visible")] }])], t.patchContainers = ["steps.body"], t.vRendererConfig = { regions: { body: { key: "body", label: "????????????", wrapperResolve: function (e) { return e } }, actions: { label: "?????????", key: "actions", preferTag: "??????", wrapperResolve: function (e) { return e } } }, panelTitle: "??????", panelBodyCreator: function (e) { return o.getSchemaTpl("tabs", [{ title: "??????", body: [{ name: "title", type: "input-text", label: "??????", pipeIn: function (e, t) { return e || t.label } }, o.getSchemaTpl("api", { label: "????????????", description: "????????????????????? <code>step</code> ?????????????????????????????????????????? <code>3</code>??????????????????????????? 3 ???" }), { label: "???????????????????", remark: { trigger: "click", rootClose: !0, title: "????????????????????????", content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, type: "switch", name: "asyncApi", visibleOn: "data.api", pipeIn: function (e) { return null != e }, pipeOut: function (e) { return e ? "" : void 0 }, mode: "inline", className: "block" }, o.getSchemaTpl("api", { name: "asyncApi", label: "??????????????????", visibleOn: "data.asyncApi != null", description: "????????????????????????????????????????????????????????????????????????????????????????????????????????? finished ????????? true ??? ??????" }), { type: "divider" }, o.getSchemaTpl("api", { name: "initApi", label: "???????????????", description: "???????????????????????????" }), { label: "?????????????????????", remark: { trigger: "click", rootClose: !0, title: "????????????????????????", content: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", placement: "left" }, type: "switch", name: "initAsyncApi", visibleOn: "data.initApi", pipeIn: function (e) { return null != e }, pipeOut: function (e) { return e ? "" : void 0 }, mode: "inline", className: "block" }, o.getSchemaTpl("api", { name: "initAsyncApi", label: "??????????????????", visibleOn: "data.initAsyncApi != null", description: "????????????????????????????????? initApi ?????????????????????????????????????????????????????? finished ????????? true ??? ??????" }), o.getSchemaTpl("initFetch")] }, { title: "??????", body: [{ name: "mode", label: "????????????", type: "button-group-select", size: "xs", mode: "inline", className: "w-full", value: "normal", options: [{ label: "??????", value: "normal" }, { label: "????????????", value: "horizontal" }, { label: "??????", value: "inline" }] }, o.getSchemaTpl("horizontal", { visibleOn: 'data.mode == "horizontal"' })] }, { title: "??????", body: [{ label: "??????????????????", type: "input-text", name: "jumpableOn", description: "??????????????????????????????????????????????????????????????????????????????currentStep ?????????????????????" }] }]) } }, t.wizardWrapperResolve = function (e) { return [].slice.call(e.querySelectorAll('[role="wizard-body"],[role="wizard-footer"]')) }, t.overrides = {
                    renderWizard: function () {
                        var e = this, t = this.props.$$editor, a = this.props.steps, l = this.state.currentStep, i = this.super();
                        if (!t || !(null == a ? void 0 : a[l - 1])) return i;
                        var o = l - 1, p = a[o], c = p.$$id, m = t.plugin;
                        return d.mapReactElement(i, (function (a) {
                            return /Wizard-step\b/.test(a.props.className) ? r.default.createElement(s.VRenderer, { key: c, plugin: t.plugin, renderer: t.renderer, $schema: "/schemas/WizardStepSchema.json", hostId: t.id, memberIndex: o, name: p.title || "??????" + (o + 1), id: c, draggable: !1, wrapperResolve: m.wizardWrapperResolve, schemaPath: t.schemaPath + "/steps/" + o, path: e.props.$path + "/" + o, data: e.props.data }, d.mapReactElement(a, (function (e, a) {
                                var l, i, o;
                                if ((null === (l = e.props.schema) || void 0 === l ? void 0 : l.body) && e.props.schema.$$id) {
                                    var s = null === (o = null === (i = m.vRendererConfig) || void 0 === i ? void 0 : i.regions) || void 0 === o ? void 0 : o.body;
                                    if (!s) return e;
                                    var d = n.__assign({}, e.props.schema);
                                    return delete d.$$id, r.default.createElement(u.RegionWrapper, { key: s.key, preferTag: s.preferTag, name: s.key, label: s.label, regionConfig: s, placeholder: s.placeholder, editorStore: m.manager.store, manager: m.manager, children: r.default.cloneElement(e, { schema: d }), wrapperResolve: s.wrapperResolve, rendererName: t.renderer.name })
                                } return e
                            }))) : a
                        }))
                    }, renderFooter: function () {
                        var e, t, a = this.props.$$editor, n = this.props.steps, l = this.state.currentStep, i = this.super();
                        if (!a || !(null == n ? void 0 : n[l - 1])) return i;
                        var o = a.plugin, s = null === (t = null === (e = o.vRendererConfig) || void 0 === e ? void 0 : e.regions) || void 0 === t ? void 0 : t.actions;
                        return s ? r.default.createElement(u.RegionWrapper, { key: s.key, preferTag: s.preferTag, name: s.key, label: s.label, regionConfig: s, placeholder: s.placeholder, editorStore: o.manager.store, manager: o.manager, children: i, wrapperResolve: s.wrapperResolve, rendererName: a.renderer.name }) : i
                    }
                }, t
            } return n.__extends(t, e), t.prototype.buildEditorToolbar = function (e, t) {
                if (e.info.plugin === this && e.info.renderer.name === this.rendererName && !e.info.hostId) {
                    var a = e.node;
                    t.push({
                        level: "secondary", icon: "fa fa-chevron-left", tooltip: "????????????", onClick: function () {
                            var e = a.getComponent();
                            if (null == e ? void 0 : e.gotoStep) {
                                var t = e.state.currentStep;
                                e.gotoStep(t - 1)
                            }
                        }
                    }), t.push({
                        level: "secondary", icon: "fa fa-chevron-right", tooltip: "????????????", onClick: function () {
                            var e = a.getComponent();
                            if (null == e ? void 0 : e.gotoStep) {
                                var t = e.state.currentStep;
                                e.gotoStep(t + 1)
                            }
                        }
                    })
                }
            }, t.prototype.filterProps = function (e) { return e.affixFooter = !1, e }, t
        }(i.BasePlugin);
        t.WizardPlugin = p, l.registerEditorPlugin(p)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.WrapperPlugin = void 0;
        var n = a(0), l = a(5), i = n.__importDefault(a(4)), o = a(1), r = a(2), s = a(3), d = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "wrapper", t.$schema = "/schemas/WrapperSchema.json", t.name = "??????", t.description = "????????????????????????????????????????????????????????????????????????", t.tags = ["??????"], t.icon = "fa fa-square-o", t.scaffold = { type: "wrapper", body: "??????" }, t.previewSchema = n.__assign({}, t.scaffold), t.regions = [{ key: "body", label: "?????????" }], t.panelTitle = "??????", t.panelBody = [{ children: i.default.createElement(l.Button, { size: "sm", className: "m-b-sm", level: "info", block: !0, onClick: function () { t.manager.showInsertPanel("body") } }, "????????????") }, { type: "divider" }, s.getSchemaTpl("size", { label: "???????????????", options: [{ label: "??????", value: "xs" }, { label: "???", value: "sm" }, { label: "??????", value: "" }, { label: "???", value: "md" }, { label: "???", value: "lg" }, { label: "???", value: "none" }], pipeIn: s.defaultValue("") }), s.getSchemaTpl("className", { description: "??????????????????????????????????????????", pipeIn: s.defaultValue("bg-white") })], t
            } return n.__extends(t, e), t
        }(r.BasePlugin);
        t.WrapperPlugin = d, o.registerEditorPlugin(d)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TableViewPlugin = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = a(1), o = a(2), r = a(3), s = a(13), d = a(200), u = a(6), p = { body: { type: "tpl", tpl: "---" } };
        function c(e) {
            if (!e) return { trs: [] };
            for (var t = [], a = 0, n = 0, l = e.trs || [];
                n < l.length;
                n++) {
                for (var i = 0, o = 0, r = l[n].tds || [];
                    o < r.length;
                    o++) {
                    for (var s = r[o];
                        t[a] && t[a][i];
                    )i += 1;
                    var d = s.rowspan || 1, u = s.colspan || 1;
                    if (d > 1 || u > 1) for (var p = 0;
                        p < d;
                        p++) {
                        var c = a + p;
                        t[c] || (t[c] = []);
                        for (var m = 0;
                            m < u;
                            m++) {
                            var h = i + m;
                            t[c][h] = !0
                        }
                    } s.$$row = a, s.$$col = i, i += 1
                } a += 1
            } return e
        } var m = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "table-view", t.$schema = "/schemas/TableViewSchema.json", t.name = "????????????", t.icon = "fa fa-columns", t.description = "?????????????????????", t.tags = ["??????"], t.scaffold = { type: "table-view", trs: [{ background: "#F7F7F7", tds: [{ body: { type: "tpl", tpl: "??????" } }, { body: { type: "tpl", tpl: "??????" } }, { body: { type: "tpl", tpl: "??????" } }] }, { tds: [{ rowspan: 2, body: { type: "tpl", tpl: "??????" } }, { body: { type: "tpl", tpl: "??????" } }, { body: { type: "tpl", tpl: "${beijing}" } }] }, { tds: [{ body: { type: "tpl", tpl: "??????" } }, { body: { type: "tpl", tpl: "${tianjing}" } }] }] }, t.previewSchema = n.__assign({}, t.scaffold), t.regions = [{ key: "body", label: "?????????", renderMethod: "renderTdBody", preferTag: "??????" }], t.panelTitle = "????????????", t.panelBody = [{ type: "input-text", label: "??????", name: "width", clearable: !0 }, { type: "input-text", label: "???????????????", name: "padding", clearable: !0 }, { type: "switch", name: "border", mode: "inline", className: "w-full", label: "??????????????????" }, { label: "????????????", type: "input-color", name: "borderColor" }, r.getSchemaTpl("className"), r.getSchemaTpl("visible")], t.fieldWrapperResolve = function (e) { return e }, t.overrides = {
                    renderTd: function (e, t, a) {
                        var n = this.super(e, t, a), i = this.props.$$editor;
                        if (!i || !e.$$id) return n;
                        var o = i.plugin, r = e.$$id;
                        return l.default.createElement(s.VRenderer, { plugin: i.plugin, renderer: i.renderer, key: r, $schema: "/schemas/TdObject.json", hostId: i.id, memberIndex: t, name: "????????? " + (a + 1) + "," + (t + 1), id: r, draggable: !1, wrapperResolve: o.fieldWrapperResolve, schemaPath: i.schemaPath + "/td", path: this.props.$path + "/tr/" + a + "/td/" + t, data: this.props.data, children: n })
                    }, renderTr: function (e, t) {
                        var a = this.super(e, t), n = this.props.$$editor;
                        if (!n || !e.$$id) return a;
                        var i = n.plugin, o = e.$$id;
                        return l.default.createElement(s.VRenderer, { plugin: n.plugin, renderer: n.renderer, key: o, $schema: "/schemas/TrObject.json", hostId: n.id, memberIndex: t, name: "??? " + (t + 1), id: o, draggable: !1, wrapperResolve: i.fieldWrapperResolve, schemaPath: n.schemaPath + "/tr", path: this.props.$path + "/tr/" + t, data: this.props.data, children: a })
                    }
                }, t.tdVRendererConfig = { panelTitle: "?????????", panelBodyCreator: function (e) { return [{ label: "??????????????????", type: "input-color", name: "background" }, { label: "????????????", type: "input-color", name: "color" }, { type: "switch", name: "bold", mode: "inline", className: "w-full", label: "????????????" }, { type: "input-number", name: "padding", label: "?????????" }, { type: "select", name: "align", label: "????????????", options: [{ label: "???", value: "left" }, { label: "???", value: "center" }, { label: "???", value: "right" }] }, { type: "select", name: "valign", label: "????????????", options: [{ label: "???", value: "top" }, { label: "???", value: "middle" }, { label: "???", value: "bottom" }] }, { type: "input-number", name: "rowspan", label: "?????????" }, { type: "input-number", name: "colspan", label: "?????????" }] } }, t.trVRendererConfig = { panelTitle: " ???", panelBodyCreator: function (e) { return [{ label: "????????????", type: "input-color", name: "background" }, { label: "?????????", type: "input-number", name: "height" }] } }, t
            } return n.__extends(t, e), t.prototype.renderRenderer = function (e) {
                var t = e.$$editor.renderer, a = e.$schema;
                return c(a), l.default.createElement(d.TableViewEditor, { schema: a, manager: this.manager }, l.default.createElement(t.component, n.__assign({}, e)))
            }, t.prototype.buildEditorPanel = function (t, a) { e.prototype.buildEditorPanel.call(this, t, a), t.info.schemaPath.endsWith("/td") ? a.push({ key: "td", order: 100, icon: this.tdVRendererConfig.panelIcon || "fa fa-tablet", title: this.tdVRendererConfig.panelTitle || "??????", render: this.manager.makeSchemaFormRender({ controls: this.tdVRendererConfig.panelControlsCreator ? this.tdVRendererConfig.panelControlsCreator(t) : this.tdVRendererConfig.panelControls, body: this.tdVRendererConfig.panelBodyCreator ? this.tdVRendererConfig.panelBodyCreator(t) : this.tdVRendererConfig.panelBody }) }) : t.info.schemaPath.endsWith("/tr") && a.push({ key: "tr", order: 100, icon: this.trVRendererConfig.panelIcon || "fa fa-tablet", title: this.trVRendererConfig.panelTitle || "??????", render: this.manager.makeSchemaFormRender({ controls: this.trVRendererConfig.panelControlsCreator ? this.trVRendererConfig.panelControlsCreator(t) : this.trVRendererConfig.panelControls, body: this.trVRendererConfig.panelBodyCreator ? this.trVRendererConfig.panelBodyCreator(t) : this.trVRendererConfig.panelBody }) }) }, t.prototype.insertRow = function (e, t) {
                var a = this.manager.store, n = a.getNodePathById(e), l = n[n.length - 3].id, i = a.getSchema(l);
                c(i);
                var o = u.JSONGetById(i, e);
                if (o) {
                    var r = o.$$row;
                    "below" === t && (r += 1);
                    var s = i.trs[0], d = s.tds[s.tds.length - 1];
                    if (d) {
                        for (var m = d.$$col + (d.colspan || 1), h = i.trs.length, f = 0;
                            f < i.trs.length;
                            f++)for (var b = 0, g = i.trs[f].tds || [];
                                b < g.length;
                                b++) {
                                var v = g[b], y = v.$$row, _ = v.rowspan || 1, S = v.colspan || 1;
                                if (_ > 1) y + _ > r && (v.rowspan = _ + 1, m -= S);
                                if (y === r) {
                                    h = f;
                                    break
                                }
                            } for (var x = [], C = 0;
                            C < m;
                            C++)x.push(p);
                        i.trs.splice(h, 0, { tds: x }), this.manager.store.changeValueById(l, i)
                    } else console.warn("??????????????????")
                } else console.warn("?????????????????? td id")
            }, t.prototype.insertCol = function (e, t) {
                var a = this.manager.store, n = a.getNodePathById(e), l = n[n.length - 3].id, i = a.getSchema(l);
                c(i);
                var o = u.JSONGetById(i, e);
                if (o) {
                    var r = o.$$col;
                    "right" === t && (r += 1);
                    for (var s = 0, d = i.trs || [];
                        s < d.length;
                        s++) {
                        for (var m = d[s].tds || [], h = !1, f = 0;
                            f < m.length;
                            f++) {
                            var b = m[f], g = b.colspan || 1, v = b.$$col;
                            if (g > 1) if (v + g > r) {
                                b.colspan = g + 1, h = !0;
                                break
                            } if (r <= v) {
                                m.splice(f, 0, p), h = !0;
                                break
                            }
                        } h || m.push(p)
                    } this.manager.store.changeValueById(l, i)
                } else console.warn("?????????????????? td id")
            }, t.prototype.splitCell = function (e) {
                var t = this.manager.store, a = t.getNodePathById(e), n = a[a.length - 3].id, l = t.getSchema(n);
                c(l);
                var i = u.JSONGetById(l, e);
                if (i) {
                    var o = i.rowspan || 1, r = i.colspan || 1;
                    i.colspan = 1, i.rowspan = 1;
                    for (var s = i.$$row, d = i.$$col, m = [], h = 0;
                        h < o;
                        h++)for (var f = 0;
                            f < r;
                            f++)0 === h && 0 === f || m.push({ row: s + h, col: d + f });
                    m.sort((function (e, t) { return t.col - e.col }));
                    for (var b = 0, g = l.trs;
                        b < g.length;
                        b++)for (var v = g[b], y = 0;
                            y < v.tds.length;
                            y++)for (var _ = v.tds[y], S = _.$$row, x = _.$$col, C = m.length;
                                C--;
                            ) {
                                var w = m[C];
                                S === w.row && (w.col <= x ? v.tds.splice(y, 0, p) : v.tds.push(p), m.splice(C, 1))
                            } if (m.length) {
                                var N = [];
                                for (h = 0;
                                    h < m.length;
                                    h++)N.push(p);
                                l.trs.push({ tds: N })
                            } this.manager.store.changeValueById(n, l)
                } else console.warn("?????????????????? td id")
            }, t.prototype.buildEditorToolbar = function (e, t) {
                var a = this, n = e.schema;
                if (e.info.schemaPath.endsWith("/td")) {
                    var l = n.$$id;
                    t.push({ icon: "fa fa-chevron-left", order: 100, tooltip: "???????????????", onClick: function () { a.insertCol(l, "left") } }), t.push({ icon: "fa fa-chevron-down", order: 100, tooltip: "???????????????", onClick: function () { a.insertRow(l, "below") } }), t.push({ icon: "fa fa-chevron-up", order: 100, tooltip: "???????????????", onClick: function () { a.insertRow(l, "above") } }), t.push({ icon: "fa fa-chevron-right", order: 100, tooltip: "???????????????", onClick: function () { a.insertCol(l, "right") } });
                    var i = n.colspan || 1, o = n.rowspan || 1;
                    (i > 1 || o > 1) && t.push({ icon: "fa fa-columns", order: 100, tooltip: "???????????????", onClick: function () { a.splitCell(l) } })
                }
            }, t
        }(o.BasePlugin);
        t.TableViewPlugin = m, i.registerEditorPlugin(m)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.TableViewEditor = void 0;
        var n = a(0), l = n.__importDefault(a(4)), i = n.__importDefault(a(31)), o = a(5), r = a(6);
        function s(e) {
            for (var t = 0, a = 0, n = 0;
                n < e.length;
                n++) {
                var l = (e[n].tds || []).length;
                l > t && (a = n, t = l)
            } return a
        } var d = function (e) {
            function t(t) {
                var a = e.call(this, t) || this;
                a.preventTableClick = !1, a.tableViewWrapperRef = l.default.createRef(), a.store = a.props.manager.store;
                var n = a.props.schema.trs || [];
                if (n.length) {
                    var i = n.map((function (e) { return e.$$id })), o = s(n);
                    a.maxChildTrIndex = o;
                    var r = (n[o].tds || []).map((function (e) { return e.$$id }));
                    a.state = { trIds: i, tdIds: r, displayMergeCell: !1 }
                } else a.state = { trIds: [], tdIds: [], displayMergeCell: !1 };
                return a.listenTdSelection(), a
            } return n.__extends(t, e), t.prototype.componentDidMount = function () { this.syncLinePos(), this.listenTdSelection() }, t.prototype.componentWillUnmount = function () { this.removeListenTdSelection() }, t.prototype.syncLineState = function () {
                var e = this, t = this.props.schema.trs || [];
                if (t.length) {
                    var a = t.map((function (e) { return e.$$id })), n = s(t);
                    this.maxChildTrIndex = n;
                    var l = (t[n].tds || []).map((function (e) { return e.$$id }));
                    this.setState({ trIds: a, tdIds: l }, (function () { e.syncLinePos() }))
                }
            }, t.prototype.removeListenTdSelection = function () {
                var e = this.tableViewWrapperRef.current;
                if (e) {
                    var t = e.querySelector("tbody");
                    t.removeEventListener("mousedown", this.handleCellMouseDown), t.removeEventListener("mousemove", this.handleCellMouseMove), t.removeEventListener("mouseup", this.handleCellMouseUp), t.removeEventListener("click", this.handleCellMouseClick)
                }
            }, t.prototype.listenTdSelection = function () {
                var e = this.tableViewWrapperRef.current;
                if (e) {
                    var t = e.querySelector("tbody");
                    t.addEventListener("mousedown", this.handleCellMouseDown), t.addEventListener("mousemove", this.handleCellMouseMove), t.addEventListener("mouseup", this.handleCellMouseUp), t.addEventListener("click", this.handleCellMouseClick)
                }
            }, t.prototype.handleCellMouseDown = function (e) {
                var t, a = e.target;
                if (!a || "TD" === a.tagName) {
                    this.removeAllSelectionMark(), this.setState({ displayMergeCell: !1 });
                    var n = a.getAttribute("data-editor-id");
                    this.isSelectionCell = !0, this.selectedCell = ((t = {})[n] = r.JSONGetById(this.props.schema, n), t)
                }
            }, t.prototype.handleCellMouseMove = function (e) {
                if (this.isSelectionCell) {
                    this.preventTableClick = !0;
                    var t = e.target;
                    if (t && "TD" !== t.tagName) return;
                    var a = t.getAttribute("data-editor-id");
                    a in this.selectedCell || (this.selectedCell[a] = r.JSONGetById(this.props.schema, a), this.markSelectingCell(), this.setState({ displayMergeCell: !0 }))
                }
            }, t.prototype.findFirstAndLastCell = function () {
                var e = [];
                for (var t in this.selectedCell) e.push(this.selectedCell[t]);
                e.length || console.warn("????????? td");
                for (var a = e[0].$$col, n = e[0].$$row, l = 0, i = 0, o = null, r = 0, s = e;
                    r < s.length;
                    r++) {
                    var d = s[r], u = d.$$col + (d.colspan || 1) - 1, p = d.$$row + (d.rowspan || 1) - 1;
                    u >= l && (l = u), p >= i && (i = p), d.$$col <= a && (a = d.$$col), d.$$row <= n && (n = d.$$row), d.$$col === a && d.$$row === n && (o = d)
                } return { minRow: n, minCol: a, maxRow: i, maxCol: l, firstCell: o, lastCell: null }
            }, t.prototype.markSelectingCell = function () {
                for (var e = this, t = this.findFirstAndLastCell(), a = t.minRow, n = t.minCol, l = t.maxRow, i = t.maxCol, o = 0, r = this.props.schema.trs;
                    o < r.length;
                    o++)for (var s = 0, d = r[o].tds;
                        s < d.length;
                        s++) {
                        var u = d[s], p = u;
                        p.$$col >= n && p.$$col <= i && p.$$row >= a && p.$$row <= l && (p.$$id in this.selectedCell || (this.selectedCell[p.$$id] = u))
                    } var c = this.tableViewWrapperRef.current;
                c && c.querySelectorAll("td").forEach((function (t) { t.getAttribute("data-editor-id") in e.selectedCell && t.setAttribute("data-selected", "1") }))
            }, t.prototype.removeAllSelectionMark = function () {
                var e = this.tableViewWrapperRef.current;
                e && e.querySelectorAll("td").forEach((function (e) { e.removeAttribute("data-selected") }))
            }, t.prototype.handleCellMouseUp = function (e) { this.isSelectionCell = !1 }, t.prototype.handleCellMouseClick = function (e) { this.preventTableClick && (e.stopPropagation(), e.preventDefault(), this.preventTableClick = !1) }, t.prototype.handleMergeCell = function () {
                var e = this.findFirstAndLastCell(), t = e.firstCell, a = e.minRow, n = e.minCol, l = e.maxRow, i = e.maxCol;
                if (t) {
                    var o = t.$$id, r = i - n + 1, s = l - a + 1;
                    t.colspan = r, t.rowspan = s;
                    var d = [];
                    for (var u in this.selectedCell) d.push(this.selectedCell[u]);
                    for (var p = d.filter((function (e) { return e.$$id !== o })).map((function (e) { return e.$$id })), c = this.props.schema.trs, m = c.length;
                        m--;
                    ) {
                        var h = c[m];
                        h.tds = h.tds.filter((function (e) { return !p.includes(e.$$id) })), h.tds.length || c.splice(m, 1)
                    } var f = this.props.schema.$$id;
                    this.store.changeValueById(f, this.props.schema), this.setState({ displayMergeCell: !1 })
                } else console.warn("?????????????????? cell")
            }, t.prototype.syncLinePos = function () {
                var e = this.tableViewWrapperRef.current;
                if (e) {
                    var t = e.querySelector("table").getBoundingClientRect(), a = e.querySelectorAll("tr");
                    if (!a.length || void 0 === this.maxChildTrIndex) return;
                    for (var n = Array.from(e.querySelectorAll(".ae-TableViewEditor-rowLine")), l = 0;
                        l < a.length;
                        l++)if (a[l]) {
                            var i = a[l].getBoundingClientRect();
                            n[l] ? n[l].style.top = i.top + i.height - t.top - 3.5 + "px" : console.warn("??????????????????")
                        } for (var o = a[this.maxChildTrIndex].querySelectorAll("td"), r = Array.from(e.querySelectorAll(".ae-TableViewEditor-colLine")), s = 0;
                        s < o.length;
                        s++) {
                        var d = o[s];
                        if (d) {
                            var u = d.getBoundingClientRect();
                            r[s] ? r[s].style.left = u.left + u.width - t.left - 3.5 + "px" : console.warn("??????????????????")
                        }
                    }
                }
            }, t.prototype.componentDidUpdate = function (e) {
                var t = e.schema, a = this.props.schema;
                i.default(t, a) || this.syncLineState()
            }, t.prototype.lineMouseDownCommon = function (e) {
                this.startY = e.clientY, this.startX = e.clientX;
                var t = e.currentTarget;
                this.draggingElement = t, this.draggingElementTop = parseInt(this.draggingElement.style.top, 10), this.draggingElementLeft = parseInt(this.draggingElement.style.left, 10), t.style.background = "#4285f4", this.draggingId = t.getAttribute("data-id"), t.addEventListener("click", this.handleLineClick, { once: !0 })
            }, t.prototype.handleRowMouseDown = function (e) { this.lineMouseDownCommon(e), document.addEventListener("mousemove", this.handleRowMouseMove), document.addEventListener("mouseup", this.handleRowMouseUp) }, t.prototype.handleRowMouseMove = function (e) {
                var t = e.clientY - this.startY;
                this.draggingElement.style.top = this.draggingElementTop + t + "px"
            }, t.prototype.handleRowMouseUp = function (e) {
                document.removeEventListener("mousemove", this.handleRowMouseMove), document.removeEventListener("mouseup", this.handleRowMouseUp);
                var t = e.clientY - this.startY, a = this.store, l = this.draggingId, i = a.getValueOf(l), r = this.tableViewWrapperRef.current.querySelector('tr[data-editor-id="' + l + '"]');
                if (this.draggingElement.style.background = "none", i && r) {
                    var s = r.getBoundingClientRect().height + t;
                    a.changeValueById(l, n.__assign(n.__assign({}, i), { height: s })), 42 - s > 20 && o.toast.warning("???????????????????????????????????????????????????????????????????????????????????????")
                } else console.warn("?????????????????? id", l)
            }, t.prototype.handleColMouseDown = function (e) { this.lineMouseDownCommon(e), document.addEventListener("mousemove", this.handleColMouseMove), document.addEventListener("mouseup", this.handleColMouseUp) }, t.prototype.handleColMouseMove = function (e) {
                var t = e.clientX - this.startX;
                this.draggingElement.style.left = this.draggingElementLeft + t + "px"
            }, t.prototype.handleColMouseUp = function (e) {
                document.removeEventListener("mousemove", this.handleColMouseMove), document.removeEventListener("mouseup", this.handleColMouseUp);
                var t = e.clientX - this.startX, a = this.store, l = this.draggingId, i = a.getValueOf(l), o = this.tableViewWrapperRef.current.querySelector('td[data-editor-id="' + l + '"]');
                if (this.draggingElement.style.background = "none", i && o) {
                    var r = o.getBoundingClientRect().width + t;
                    a.changeValueById(l, n.__assign(n.__assign({}, i), { width: r }))
                } else console.warn("?????????????????? id", l)
            }, t.prototype.handleLineClick = function (e) { e.stopPropagation(), e.preventDefault() }, t.prototype.renderMergeIcon = function () { return this.state.displayMergeCell ? l.default.createElement("div", { className: "ae-TableViewEditor-mergeIcon", onMouseDown: this.handleMergeCell }, "???????????????") : null }, t.prototype.render = function () {
                var e = this, t = this.state.trIds.map((function (t) { return l.default.createElement("div", { className: "ae-TableViewEditor-rowLine", key: "row-" + t, "data-id": t, onMouseDown: e.handleRowMouseDown }) })), a = this.state.tdIds.map((function (t) { return l.default.createElement("div", { className: "ae-TableViewEditor-colLine", key: "row-" + t, "data-id": t, onMouseDown: e.handleColMouseDown }) }));
                return l.default.createElement("div", { className: "ae-TableViewEditor", ref: this.tableViewWrapperRef }, this.props.children, this.renderMergeIcon(), t, a)
            }, n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "removeListenTdSelection", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "listenTdSelection", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleCellMouseDown", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleCellMouseMove", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleCellMouseUp", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleCellMouseClick", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", []), n.__metadata("design:returntype", void 0)], t.prototype, "handleMergeCell", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleRowMouseDown", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleRowMouseMove", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleRowMouseUp", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "handleColMouseDown", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleColMouseMove", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleColMouseUp", null), n.__decorate([r.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [MouseEvent]), n.__metadata("design:returntype", void 0)], t.prototype, "handleLineClick", null), t
        }(l.default.Component);
        t.TableViewEditor = d
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeViewPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = a(3), r = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "code", t.$schema = "/schemas/CodeSchema.json", t.name = "????????????", t.icon = "fa fa-code", t.description = "????????????", t.docLink = "/amis/zh-CN/components/code", t.tags = ["??????"], t.scaffold = { type: "code", language: "html", value: "<div>html</div>" }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "????????????", t.panelBody = [o.getSchemaTpl("tabs", [{ title: "??????", body: [{ type: "input-text", label: "??????", name: "name" }, { type: "editor", label: "?????????", allowFullscreen: !0, name: "value" }] }, { title: "??????", body: [o.getSchemaTpl("className")] }, { title: "??????", body: [o.getSchemaTpl("ref"), o.getSchemaTpl("visible")] }])], t
            } return n.__extends(t, e), t
        }(i.BasePlugin);
        t.CodeViewPlugin = r, l.registerEditorPlugin(r)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.WebComponentPlugin = void 0;
        var n = a(0), l = a(5), i = a(1), o = a(2), r = function (e) { function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t.prototype.connectedCallback = function () { this.attachShadow({ mode: "open" }).textContent = "web-component-demo" }, t }(HTMLElement);
        customElements.define("web-component-demo", r);
        var s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rendererName = "web-component", t.$schema = "/schemas/WebComponentSchema.json", t.name = "Web Component", t.description = "???????????? Web Component ??????", t.tags = ["??????"], t.icon = "fa fa-square-o", t.scaffold = { type: "web-component", tag: "web-component-demo" }, t.previewSchema = n.__assign({}, t.scaffold), t.panelTitle = "??????", t.panelBody = [{ type: "input-text", label: "??????", name: "tag" }, {
                    type: "combo", label: "??????", name: "props", multiple: !0, pipeIn: function (e) {
                        if (!l.utils.isObject(e)) return e;
                        var t = [];
                        return Object.keys(e).forEach((function (a) { t.push({ key: a || "", value: "string" == typeof e[a] ? e[a] : JSON.stringify(e[a]) }) })), t
                    }, pipeOut: function (e) {
                        if (!Array.isArray(e)) return e;
                        var t = {};
                        return e.forEach((function (e) {
                            var a = e.key || "", n = e.value;
                            try { n = JSON.parse(n) } catch (e) { } t[a] = n
                        })), t
                    }, controls: [{ placeholder: "Key", type: "text", unique: !0, name: "key", columnClassName: "w-xs" }, { placeholder: "Value", type: "text", name: "value" }]
                }], t
            } return n.__extends(t, e), t
        }(o.BasePlugin);
        t.WebComponentPlugin = s, i.registerEditorPlugin(s)
    }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.DataDebugPlugin = void 0;
        var n = a(0), l = a(1), i = a(2), o = n.__importDefault(a(4)), r = n.__importDefault(a(204)), s = function (e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.dataViewer = {
                    type: "json", name: "ctx", asFormItem: !0, className: "m-b-none", component: function (e) {
                        for (var t = e.value, a = e.onChange, n = e.readOnly, l = o.default.useState(0), i = l[0], s = l[1], d = t || {}, u = [d];
                            Object.getPrototypeOf(d) !== Object.prototype;
                        ) {
                            var p = Object.getPrototypeOf(d);
                            if ("[object Object]" !== Object.prototype.toString.call(p)) break;
                            u.push(p), d = p
                        } function c(e) {
                            var t = Object.create(u[1] || Object.prototype);
                            Object.keys(e.updated_src).forEach((function (a) { return t[a] = e.updated_src[a] })), a(t)
                        } return o.default.createElement("div", { className: "aeDataChain" }, o.default.createElement("div", { className: "aeDataChain-aside" }, o.default.createElement("ul", null, u.map((function (e, t) { return o.default.createElement("li", { className: t === i ? "is-active" : "", key: t, onClick: function () { return s(t) } }, 0 === t ? "??????" : 1 === t ? "??????" : "???" + t + "???") })))), o.default.createElement("div", { className: "aeDataChain-main" }, o.default.createElement(r.default, { name: !1, src: u[i], enableClipboard: !1, iconStyle: "square", onAdd: 0 === i && !n && c, onEdit: 0 === i && !n && c, onDelete: 0 === i && !n && c, collapsed: 2 })))
                    }
                }, t
            } return n.__extends(t, e), t.prototype.buildEditorToolbar = function (e, t) {
                var a = this, n = (e.id, e.schema, e.node.getComponent());
                if (n && n.props.data && n.props.store) {
                    var l = n.props.store;
                    t.push({ icon: "fa fa-bug", placement: "bottom", tooltip: "???????????????", onClick: function () { return a.openDebugForm(n.props.data, l.updateData && l.data === n.props.data ? function (e) { return l.updateData(e) } : void 0) } })
                }
            }, t.prototype.openDebugForm = function (e, t) {
                return n.__awaiter(this, void 0, void 0, (function () {
                    var a;
                    return n.__generator(this, (function (l) {
                        switch (l.label) {
                            case 0: return [4, this.manager.scaffold({ title: "???????????????", body: [n.__assign(n.__assign({}, this.dataViewer), { readOnly: !t })] }, { ctx: e })];
                            case 1: return a = l.sent(), null == t || t(a.ctx), [2]
                        }
                    }))
                }))
            }, t
        }(i.BasePlugin);
        t.DataDebugPlugin = s, l.registerEditorPlugin(s)
    }, function (e, t) { e.exports = require("2f854eb") }, function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }), t.BasicEditor = t.RendererEditor = void 0;
        var n = a(0), l = a(1), i = a(2);
        t.RendererEditor = function (e, t) {
            return function (a) {
                l.registerEditorPlugin(function (a) {
                    function l(n) {
                        var l = a.call(this, n) || this;
                        return l.rendererName = e, l.name = l.tipName || t.name, l.description = t.description, l.scaffold = t.scaffold || { type: t.type }, l.previewSchema = t.previewSchema || l.scaffold, l.settingsSchema && (l.panelTitle = l.settingsSchema.title, l.panelControls = l.settingsSchema.body), l
                    } return n.__extends(l, a), l
                }(a))
            }
        };
        var o = function (e) { function t() { return null !== e && e.apply(this, arguments) || this } return n.__extends(t, e), t }(i.BasePlugin);
        t.BasicEditor = o
    },
    function (e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        var n = a(0), l = n.__importDefault(a(4)), i = n.__importDefault(a(24)), o = n.__importDefault(a(8)), r = n.__importDefault(a(30)), s = a(41), d = a(42), u = a(6), p = function (e) {
            function t(t) {
                var a = e.call(this, t) || this;
                return a.manager.on("build-panels", a.buildPanels), a
            } return n.__extends(t, e), t.prototype.componentWillUnmount = function () { this.manager.off("build-panels", this.buildPanels) }, t.prototype.buildPanels = function (e) {
                var t = e.context.data;
                Array.isArray(t) && t.splice(0, t.length)
            }, t.prototype.render = function () {
                var e = this.props, t = e.preview, a = e.className, n = e.theme, i = e.data;
                return l.default.createElement("div", { className: o.default("ae-Editor", { preview: t }, a) }, l.default.createElement("div", { className: "ae-Editor-inner", onContextMenu: this.handleContextMenu }, l.default.createElement("div", { className: "ae-Main" }, l.default.createElement(r.default, { editable: !t, store: this.store, manager: this.manager, theme: n, data: i }))), l.default.createElement(s.SubEditor, { store: this.store, manager: this.manager, theme: n }), l.default.createElement(d.ScaffoldModal, { store: this.store, manager: this.manager, theme: n }))
            }, n.__decorate([u.autobind, n.__metadata("design:type", Function), n.__metadata("design:paramtypes", [Object]), n.__metadata("design:returntype", void 0)], t.prototype, "buildPanels", null), t
        }(i.default);
        t.default = p
    }
]));

