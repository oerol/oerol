"use strict";
(self.webpackChunkguse = self.webpackChunkguse || []).push([
  [179],
  {
    313: () => {
      function re(e) {
        return "function" == typeof e;
      }
      function so(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (n.prototype = Object.create(Error.prototype)), (n.prototype.constructor = n), n;
      }
      const ao = so(
        (e) =>
          function (n) {
            e(this),
              (this.message = n ? `${n.length} errors occurred during unsubscription:\n${n.map((r, o) => `${o + 1}) ${r.toString()}`).join("\n  ")}` : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function ar(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class yt {
        constructor(t) {
          (this.initialTeardown = t), (this.closed = !1), (this._parentage = null), (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n))) for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (re(r))
              try {
                r();
              } catch (i) {
                t = i instanceof ao ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  ac(i);
                } catch (s) {
                  (t = t ?? []), s instanceof ao ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new ao(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) ac(t);
            else {
              if (t instanceof yt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers = null !== (n = this._finalizers) && void 0 !== n ? n : []).push(t);
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && ar(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && ar(n, t), t instanceof yt && t._removeParent(this);
        }
      }
      yt.EMPTY = (() => {
        const e = new yt();
        return (e.closed = !0), e;
      })();
      const ic = yt.EMPTY;
      function sc(e) {
        return e instanceof yt || (e && "closed" in e && re(e.remove) && re(e.add) && re(e.unsubscribe));
      }
      function ac(e) {
        re(e) ? e() : e.unsubscribe();
      }
      const Xt = { onUnhandledError: null, onStoppedNotification: null, Promise: void 0, useDeprecatedSynchronousErrorHandling: !1, useDeprecatedNextContext: !1 },
        uo = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = uo;
            return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = uo;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function uc(e) {
        uo.setTimeout(() => {
          const { onUnhandledError: t } = Xt;
          if (!t) throw e;
          t(e);
        });
      }
      function cc() {}
      const lm = ji("C", void 0, void 0);
      function ji(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let en = null;
      function co(e) {
        if (Xt.useDeprecatedSynchronousErrorHandling) {
          const t = !en;
          if ((t && (en = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = en;
            if (((en = null), n)) throw r;
          }
        } else e();
      }
      class Hi extends yt {
        constructor(t) {
          super(), (this.isStopped = !1), t ? ((this.destination = t), sc(t) && t.add(this)) : (this.destination = ym);
        }
        static create(t, n, r) {
          return new ur(t, n, r);
        }
        next(t) {
          this.isStopped
            ? Ui(
                (function fm(e) {
                  return ji("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? Ui(
                (function dm(e) {
                  return ji("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped ? Ui(lm, this) : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const pm = Function.prototype.bind;
      function $i(e, t) {
        return pm.call(e, t);
      }
      class gm {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              lo(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              lo(r);
            }
          else lo(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              lo(n);
            }
        }
      }
      class ur extends Hi {
        constructor(t, n, r) {
          let o;
          if ((super(), re(t) || !t)) o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
          else {
            let i;
            this && Xt.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = { next: t.next && $i(t.next, i), error: t.error && $i(t.error, i), complete: t.complete && $i(t.complete, i) }))
              : (o = t);
          }
          this.destination = new gm(o);
        }
      }
      function lo(e) {
        Xt.useDeprecatedSynchronousErrorHandling
          ? (function hm(e) {
              Xt.useDeprecatedSynchronousErrorHandling && en && ((en.errorThrown = !0), (en.error = e));
            })(e)
          : uc(e);
      }
      function Ui(e, t) {
        const { onStoppedNotification: n } = Xt;
        n && uo.setTimeout(() => n(e, t));
      }
      const ym = {
          closed: !0,
          next: cc,
          error: function mm(e) {
            throw e;
          },
          complete: cc,
        },
        Gi = ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function lc(e) {
        return e;
      }
      let Fe = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function vm(e) {
              return (
                (e && e instanceof Hi) ||
                ((function Dm(e) {
                  return e && re(e.next) && re(e.error) && re(e.complete);
                })(e) &&
                  sc(e))
              );
            })(n)
              ? n
              : new ur(n, r, o);
            return (
              co(() => {
                const { operator: s, source: a } = this;
                i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i));
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = fc(r))((o, i) => {
              const s = new ur({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r ? void 0 : r.subscribe(n);
          }
          [Gi]() {
            return this;
          }
          pipe(...n) {
            return (function dc(e) {
              return 0 === e.length
                ? lc
                : 1 === e.length
                ? e[0]
                : function (n) {
                    return e.reduce((r, o) => o(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = fc(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function fc(e) {
        var t;
        return null !== (t = e ?? Xt.Promise) && void 0 !== t ? t : Promise;
      }
      const _m = so(
        (e) =>
          function () {
            e(this), (this.name = "ObjectUnsubscribedError"), (this.message = "object unsubscribed");
          }
      );
      let cr = (() => {
        class e extends Fe {
          constructor() {
            super(), (this.closed = !1), (this.currentObservers = null), (this.observers = []), (this.isStopped = !1), (this.hasError = !1), (this.thrownError = null);
          }
          lift(n) {
            const r = new hc(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new _m();
          }
          next(n) {
            co(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers || (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            co(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            co(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (null === (n = this.observers) || void 0 === n ? void 0 : n.length) > 0;
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n);
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? ic
              : ((this.currentObservers = null),
                i.push(n),
                new yt(() => {
                  (this.currentObservers = null), ar(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new Fe();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new hc(t, n)), e;
      })();
      class hc extends cr {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.next) || void 0 === r || r.call(n, t);
        }
        error(t) {
          var n, r;
          null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.error) || void 0 === r || r.call(n, t);
        }
        complete() {
          var t, n;
          null === (n = null === (t = this.destination) || void 0 === t ? void 0 : t.complete) || void 0 === n || n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !== (r = null === (n = this.source) || void 0 === n ? void 0 : n.subscribe(t)) && void 0 !== r ? r : ic;
        }
      }
      function lr(e) {
        return (t) => {
          if (
            (function Cm(e) {
              return re(e?.lift);
            })(t)
          )
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function fo(e, t, n, r, o) {
        return new wm(e, t, n, r, o);
      }
      class wm extends Hi {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(), !n && (null === (t = this.onFinalize) || void 0 === t || t.call(this));
          }
        }
      }
      function tn(e) {
        return this instanceof tn ? ((this.v = e), this) : new tn(e);
      }
      function Mm(e, t, n) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var o,
          r = n.apply(e, t || []),
          i = [];
        return (
          (o = {}),
          s("next"),
          s("throw"),
          s("return"),
          (o[Symbol.asyncIterator] = function () {
            return this;
          }),
          o
        );
        function s(f) {
          r[f] &&
            (o[f] = function (h) {
              return new Promise(function (p, g) {
                i.push([f, h, p, g]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function u(f) {
              f.value instanceof tn ? Promise.resolve(f.value.v).then(c, l) : d(i[0][2], f);
            })(r[f](h));
          } catch (p) {
            d(i[0][3], p);
          }
        }
        function c(f) {
          a("next", f);
        }
        function l(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
        }
      }
      function Tm(e) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function mc(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
                  },
                };
              throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (c) {
                    i({ value: c, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      const yc = (e) => e && "number" == typeof e.length && "function" != typeof e;
      function Dc(e) {
        return re(e?.then);
      }
      function vc(e) {
        return re(e[Gi]);
      }
      function _c(e) {
        return Symbol.asyncIterator && re(e?.[Symbol.asyncIterator]);
      }
      function Cc(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const wc = (function xm() {
        return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";
      })();
      function Ec(e) {
        return re(e?.[wc]);
      }
      function bc(e) {
        return Mm(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield tn(n.read());
              if (o) return yield tn(void 0);
              yield yield tn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Ic(e) {
        return re(e?.getReader);
      }
      function nn(e) {
        if (e instanceof Fe) return e;
        if (null != e) {
          if (vc(e))
            return (function Am(e) {
              return new Fe((t) => {
                const n = e[Gi]();
                if (re(n.subscribe)) return n.subscribe(t);
                throw new TypeError("Provided object does not correctly implement Symbol.observable");
              });
            })(e);
          if (yc(e))
            return (function Pm(e) {
              return new Fe((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (Dc(e))
            return (function Nm(e) {
              return new Fe((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, uc);
              });
            })(e);
          if (_c(e)) return Mc(e);
          if (Ec(e))
            return (function Om(e) {
              return new Fe((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (Ic(e))
            return (function Fm(e) {
              return Mc(bc(e));
            })(e);
        }
        throw Cc(e);
      }
      function Mc(e) {
        return new Fe((t) => {
          (function Rm(e, t) {
            var n, r, o, i;
            return (function bm(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(l) {
                  try {
                    c(r.next(l));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(l) {
                  try {
                    c(r.throw(l));
                  } catch (d) {
                    s(d);
                  }
                }
                function c(l) {
                  l.done
                    ? i(l.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(l.value).then(a, u);
                }
                c((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = Tm(e); !(r = yield n.next()).done; ) if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function $t(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function Tc(e, t, n = 1 / 0) {
        return re(t)
          ? Tc(
              (r, o) =>
                (function Em(e, t) {
                  return lr((n, r) => {
                    let o = 0;
                    n.subscribe(
                      fo(r, (i) => {
                        r.next(e.call(t, i, o++));
                      })
                    );
                  });
                })((i, s) => t(r, i, o, s))(nn(e(r, o))),
              n
            )
          : ("number" == typeof t && (n = t),
            lr((r, o) =>
              (function km(e, t, n, r, o, i, s, a) {
                const u = [];
                let c = 0,
                  l = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !c && t.complete();
                  },
                  h = (g) => (c < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && t.next(g), c++;
                    let D = !1;
                    nn(n(g, l++)).subscribe(
                      fo(
                        t,
                        (v) => {
                          o?.(v), i ? h(v) : t.next(v);
                        },
                        () => {
                          D = !0;
                        },
                        void 0,
                        () => {
                          if (D)
                            try {
                              for (c--; u.length && c < r; ) {
                                const v = u.shift();
                                s ? $t(t, s, () => p(v)) : p(v);
                              }
                              f();
                            } catch (v) {
                              t.error(v);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    fo(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n)
            ));
      }
      const Sc = new Fe((e) => e.complete());
      function Wi(e) {
        return e[e.length - 1];
      }
      function xc(e, t = 0) {
        return lr((n, r) => {
          n.subscribe(
            fo(
              r,
              (o) => $t(r, e, () => r.next(o), t),
              () => $t(r, e, () => r.complete(), t),
              (o) => $t(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function Ac(e, t = 0) {
        return lr((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Pc(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new Fe((n) => {
          $t(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            $t(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Qm(...e) {
        const t = (function jm(e) {
            return (function Vm(e) {
              return e && re(e.schedule);
            })(Wi(e))
              ? e.pop()
              : void 0;
          })(e),
          n = (function Hm(e, t) {
            return "number" == typeof Wi(e) ? e.pop() : t;
          })(e, 1 / 0),
          r = e;
        return r.length
          ? 1 === r.length
            ? nn(r[0])
            : (function Lm(e = 1 / 0) {
                return Tc(lc, e);
              })(n)(
                (function Ym(e, t) {
                  return t
                    ? (function qm(e, t) {
                        if (null != e) {
                          if (vc(e))
                            return (function $m(e, t) {
                              return nn(e).pipe(Ac(t), xc(t));
                            })(e, t);
                          if (yc(e))
                            return (function Gm(e, t) {
                              return new Fe((n) => {
                                let r = 0;
                                return t.schedule(function () {
                                  r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
                                });
                              });
                            })(e, t);
                          if (Dc(e))
                            return (function Um(e, t) {
                              return nn(e).pipe(Ac(t), xc(t));
                            })(e, t);
                          if (_c(e)) return Pc(e, t);
                          if (Ec(e))
                            return (function zm(e, t) {
                              return new Fe((n) => {
                                let r;
                                return (
                                  $t(n, t, () => {
                                    (r = e[wc]()),
                                      $t(
                                        n,
                                        t,
                                        () => {
                                          let o, i;
                                          try {
                                            ({ value: o, done: i } = r.next());
                                          } catch (s) {
                                            return void n.error(s);
                                          }
                                          i ? n.complete() : n.next(o);
                                        },
                                        0,
                                        !0
                                      );
                                  }),
                                  () => re(r?.return) && r.return()
                                );
                              });
                            })(e, t);
                          if (Ic(e))
                            return (function Wm(e, t) {
                              return Pc(bc(e), t);
                            })(e, t);
                        }
                        throw Cc(e);
                      })(e, t)
                    : nn(e);
                })(r, t)
              )
          : Sc;
      }
      function qi(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new ur({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return t(...n).subscribe(r);
      }
      function Q(e) {
        for (let t in e) if (e[t] === Q) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function Z(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(Z).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function Qi(e, t) {
        return null == e || "" === e ? (null === t ? "" : t) : null == t || "" === t ? e : e + " " + t;
      }
      const Km = Q({ __forward_ref__: Q });
      function Zi(e) {
        return (
          (e.__forward_ref__ = Zi),
          (e.toString = function () {
            return Z(this());
          }),
          e
        );
      }
      function T(e) {
        return (function Ki(e) {
          return "function" == typeof e && e.hasOwnProperty(Km) && e.__forward_ref__ === Zi;
        })(e)
          ? e()
          : e;
      }
      class I extends Error {
        constructor(t, n) {
          super(
            (function ho(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t.trim() : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function P(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function po(e, t) {
        throw new I(-201, !1);
      }
      function He(e, t) {
        null == e &&
          (function z(e, t, n, r) {
            throw new Error(`ASSERTION ERROR: ${e}` + (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`));
          })(t, e, null, "!=");
      }
      function q(e) {
        return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
      }
      function Dn(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function go(e) {
        return Nc(e, mo) || Nc(e, Fc);
      }
      function Nc(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Oc(e) {
        return e && (e.hasOwnProperty(Ji) || e.hasOwnProperty(iy)) ? e[Ji] : null;
      }
      const mo = Q({ ɵprov: Q }),
        Ji = Q({ ɵinj: Q }),
        Fc = Q({ ngInjectableDef: Q }),
        iy = Q({ ngInjectorDef: Q });
      var x = (() => (
        ((x = x || {})[(x.Default = 0)] = "Default"), (x[(x.Host = 1)] = "Host"), (x[(x.Self = 2)] = "Self"), (x[(x.SkipSelf = 4)] = "SkipSelf"), (x[(x.Optional = 8)] = "Optional"), x
      ))();
      let Xi;
      function Ze(e) {
        const t = Xi;
        return (Xi = e), t;
      }
      function Rc(e, t, n) {
        const r = go(e);
        return r && "root" == r.providedIn ? (void 0 === r.value ? (r.value = r.factory()) : r.value) : n & x.Optional ? null : void 0 !== t ? t : void po(Z(e));
      }
      function Ut(e) {
        return { toString: e }.toString();
      }
      var it = (() => (((it = it || {})[(it.OnPush = 0)] = "OnPush"), (it[(it.Default = 1)] = "Default"), it))(),
        Dt = (() => {
          return ((e = Dt || (Dt = {}))[(e.Emulated = 0)] = "Emulated"), (e[(e.None = 2)] = "None"), (e[(e.ShadowDom = 3)] = "ShadowDom"), Dt;
          var e;
        })();
      const K = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" && typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && self))(),
        vn = {},
        U = [],
        yo = Q({ ɵcmp: Q }),
        es = Q({ ɵdir: Q }),
        ts = Q({ ɵpipe: Q }),
        kc = Q({ ɵmod: Q }),
        Tt = Q({ ɵfac: Q }),
        dr = Q({ __NG_ELEMENT_ID__: Q });
      let ay = 0;
      function St(e) {
        return Ut(() => {
          const n = !0 === e.standalone,
            r = {},
            o = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === it.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: n,
              dependencies: (n && e.dependencies) || null,
              getStandaloneInjector: null,
              selectors: e.selectors || U,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || Dt.Emulated,
              id: "c" + ay++,
              styles: e.styles || U,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            i = e.dependencies,
            s = e.features;
          return (
            (o.inputs = Vc(e.inputs, r)),
            (o.outputs = Vc(e.outputs)),
            s && s.forEach((a) => a(o)),
            (o.directiveDefs = i ? () => ("function" == typeof i ? i() : i).map(Lc).filter(Bc) : null),
            (o.pipeDefs = i ? () => ("function" == typeof i ? i() : i).map(Se).filter(Bc) : null),
            o
          );
        });
      }
      function Lc(e) {
        return W(e) || Te(e);
      }
      function Bc(e) {
        return null !== e;
      }
      function fr(e) {
        return Ut(() => ({
          type: e.type,
          bootstrap: e.bootstrap || U,
          declarations: e.declarations || U,
          imports: e.imports || U,
          exports: e.exports || U,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function Vc(e, t) {
        if (null == e) return vn;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])), (n[o] = r), t && (t[o] = i);
          }
        return n;
      }
      const Ke = St;
      function W(e) {
        return e[yo] || null;
      }
      function Te(e) {
        return e[es] || null;
      }
      function Se(e) {
        return e[ts] || null;
      }
      const k = 11,
        J = 22;
      function ke(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function at(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function os(e) {
        return 0 != (8 & e.flags);
      }
      function Co(e) {
        return 2 == (2 & e.flags);
      }
      function wo(e) {
        return 1 == (1 & e.flags);
      }
      function ut(e) {
        return null !== e.template;
      }
      function hy(e) {
        return 0 != (256 & e[2]);
      }
      function un(e, t) {
        return e.hasOwnProperty(Tt) ? e[Tt] : null;
      }
      class my {
        constructor(t, n, r) {
          (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function $c(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = Dy), yy;
      }
      function yy() {
        const e = Gc(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === vn) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function Dy(e, t, n, r) {
        const o =
            Gc(e) ||
            (function vy(e, t) {
              return (e[Uc] = t);
            })(e, { previous: vn, current: null }),
          i = o.current || (o.current = {}),
          s = o.previous,
          a = this.declaredInputs[n],
          u = s[a];
        (i[a] = new my(u && u.currentValue, t, s === vn)), (e[r] = t);
      }
      const Uc = "__ngSimpleChanges__";
      function Gc(e) {
        return e[Uc] || null;
      }
      function le(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function bo(e, t) {
        return le(t[e]);
      }
      function et(e, t) {
        return le(t[e.index]);
      }
      function cs(e, t) {
        return e.data[t];
      }
      function Ge(e, t) {
        const n = t[e];
        return ke(n) ? n : n[0];
      }
      function Io(e) {
        return 64 == (64 & e[2]);
      }
      function Gt(e, t) {
        return null == t ? null : e[t];
      }
      function zc(e) {
        e[18] = 0;
      }
      function ls(e, t) {
        e[5] += t;
        let n = e,
          r = e[3];
        for (; null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5])); ) (r[5] += t), (n = r), (r = r[3]);
      }
      const A = { lFrame: tl(null), bindingsEnabled: !0 };
      function qc() {
        return A.bindingsEnabled;
      }
      function y() {
        return A.lFrame.lView;
      }
      function j() {
        return A.lFrame.tView;
      }
      function ze(e) {
        return (A.lFrame.contextLView = e), e[8];
      }
      function We(e) {
        return (A.lFrame.contextLView = null), e;
      }
      function pe() {
        let e = Yc();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Yc() {
        return A.lFrame.currentTNode;
      }
      function vt(e, t) {
        const n = A.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function ds() {
        return A.lFrame.isParent;
      }
      function bn() {
        return A.lFrame.bindingIndex++;
      }
      function At(e) {
        const t = A.lFrame,
          n = t.bindingIndex;
        return (t.bindingIndex = t.bindingIndex + e), n;
      }
      function Fy(e, t) {
        const n = A.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), hs(t);
      }
      function hs(e) {
        A.lFrame.currentDirectiveIndex = e;
      }
      function gs(e) {
        A.lFrame.currentQueryIndex = e;
      }
      function ky(e) {
        const t = e[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
      }
      function Xc(e, t, n) {
        if (n & x.SkipSelf) {
          let o = t,
            i = e;
          for (; !((o = o.parent), null !== o || n & x.Host || ((o = ky(i)), null === o || ((i = i[15]), 10 & o.type))); );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (A.lFrame = el());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function ms(e) {
        const t = el(),
          n = e[1];
        (A.lFrame = t), (t.currentTNode = n.firstChild), (t.lView = e), (t.tView = n), (t.contextLView = e), (t.bindingIndex = n.bindingStartIndex), (t.inI18n = !1);
      }
      function el() {
        const e = A.lFrame,
          t = null === e ? null : e.child;
        return null === t ? tl(e) : t;
      }
      function tl(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function nl() {
        const e = A.lFrame;
        return (A.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
      }
      const rl = nl;
      function ys() {
        const e = nl();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Ae() {
        return A.lFrame.selectedIndex;
      }
      function zt(e) {
        A.lFrame.selectedIndex = e;
      }
      function Mo(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            { ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: u, ngAfterViewChecked: c, ngOnDestroy: l } = i;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a && ((e.contentHooks || (e.contentHooks = [])).push(n, a), (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            u && (e.viewHooks || (e.viewHooks = [])).push(-n, u),
            c && ((e.viewHooks || (e.viewHooks = [])).push(n, c), (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, c)),
            null != l && (e.destroyHooks || (e.destroyHooks = [])).push(n, l);
        }
      }
      function To(e, t, n) {
        ol(e, t, 3, n);
      }
      function So(e, t, n, r) {
        (3 & e[2]) === n && ol(e, t, n, r);
      }
      function Ds(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
      }
      function ol(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[18] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else t[u] < 0 && (e[18] += 65536), (a < i || -1 == i) && (zy(e, n, t, u), (e[18] = (4294901760 & e[18]) + u + 2)), u++;
      }
      function zy(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        if (o) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
            e[2] += 2048;
            try {
              i.call(a);
            } finally {
            }
          }
        } else
          try {
            i.call(a);
          } finally {
          }
      }
      class vr {
        constructor(t, n, r) {
          (this.factory = t), (this.resolving = !1), (this.canSeeViewProviders = n), (this.injectImpl = r);
        }
      }
      function xo(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            sl(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function il(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function sl(e) {
        return 64 === e.charCodeAt(0);
      }
      function Ao(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o ? (n = o) : 0 === n || al(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function al(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)), e.splice(i++, 0, n), null !== r && e.splice(i++, 0, r), null !== o && e.splice(i++, 0, o);
      }
      function ul(e) {
        return -1 !== e;
      }
      function In(e) {
        return 32767 & e;
      }
      function Mn(e, t) {
        let n = (function Zy(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let _s = !0;
      function Po(e) {
        const t = _s;
        return (_s = e), t;
      }
      let Ky = 0;
      const _t = {};
      function Cr(e, t) {
        const n = ws(e, t);
        if (-1 !== n) return n;
        const r = t[1];
        r.firstCreatePass && ((e.injectorIndex = t.length), Cs(r.data, e), Cs(t, null), Cs(r.blueprint, null));
        const o = No(e, t),
          i = e.injectorIndex;
        if (ul(o)) {
          const s = In(o),
            a = Mn(o, t),
            u = a[1].data;
          for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c];
        }
        return (t[i + 8] = o), i;
      }
      function Cs(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function ws(e, t) {
        return -1 === e.injectorIndex || (e.parent && e.parent.injectorIndex === e.injectorIndex) || null === t[e.injectorIndex + 8] ? -1 : e.injectorIndex;
      }
      function No(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = yl(o)), null === r)) return -1;
          if ((n++, (o = o[15]), -1 !== r.injectorIndex)) return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function Oo(e, t, n) {
        !(function Jy(e, t, n) {
          let r;
          "string" == typeof n ? (r = n.charCodeAt(0) || 0) : n.hasOwnProperty(dr) && (r = n[dr]), null == r && (r = n[dr] = Ky++);
          const o = 255 & r;
          t.data[e + (o >> 5)] |= 1 << o;
        })(e, t, n);
      }
      function dl(e, t, n) {
        if (n & x.Optional || void 0 !== e) return e;
        po();
      }
      function fl(e, t, n, r) {
        if ((n & x.Optional && void 0 === r && (r = null), 0 == (n & (x.Self | x.Host)))) {
          const o = e[9],
            i = Ze(void 0);
          try {
            return o ? o.get(t, r, n & x.Optional) : Rc(t, r, n & x.Optional);
          } finally {
            Ze(i);
          }
        }
        return dl(r, 0, n);
      }
      function hl(e, t, n, r = x.Default, o) {
        if (null !== e) {
          if (1024 & t[2]) {
            const s = (function oD(e, t, n, r, o) {
              let i = e,
                s = t;
              for (; null !== i && null !== s && 1024 & s[2] && !(256 & s[2]); ) {
                const a = pl(i, s, n, r | x.Self, _t);
                if (a !== _t) return a;
                let u = i.parent;
                if (!u) {
                  const c = s[21];
                  if (c) {
                    const l = c.get(n, _t, r);
                    if (l !== _t) return l;
                  }
                  (u = yl(s)), (s = s[15]);
                }
                i = u;
              }
              return o;
            })(e, t, n, r, _t);
            if (s !== _t) return s;
          }
          const i = pl(e, t, n, r, _t);
          if (i !== _t) return i;
        }
        return fl(t, n, r, o);
      }
      function pl(e, t, n, r, o) {
        const i = (function tD(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(dr) ? e[dr] : void 0;
          return "number" == typeof t ? (t >= 0 ? 255 & t : nD) : t;
        })(n);
        if ("function" == typeof i) {
          if (!Xc(t, e, r)) return r & x.Host ? dl(o, 0, r) : fl(t, n, r, o);
          try {
            const s = i(r);
            if (null != s || r & x.Optional) return s;
            po();
          } finally {
            rl();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = ws(e, t),
            u = -1,
            c = r & x.Host ? t[16][6] : null;
          for ((-1 === a || r & x.SkipSelf) && ((u = -1 === a ? No(e, t) : t[a + 8]), -1 !== u && ml(r, !1) ? ((s = t[1]), (a = In(u)), (t = Mn(u, t))) : (a = -1)); -1 !== a; ) {
            const l = t[1];
            if (gl(i, a, l.data)) {
              const d = eD(a, t, n, s, r, c);
              if (d !== _t) return d;
            }
            (u = t[a + 8]), -1 !== u && ml(r, t[1].data[a + 8] === c) && gl(i, a, t) ? ((s = l), (a = In(u)), (t = Mn(u, t))) : (a = -1);
          }
        }
        return o;
      }
      function eD(e, t, n, r, o, i) {
        const s = t[1],
          a = s.data[e + 8],
          l = (function Fo(e, t, n, r, o) {
            const i = e.providerIndexes,
              s = t.data,
              a = 1048575 & i,
              u = e.directiveStart,
              l = i >> 20,
              f = o ? a + l : e.directiveEnd;
            for (let h = r ? a : a + l; h < f; h++) {
              const p = s[h];
              if ((h < u && n === p) || (h >= u && p.type === n)) return h;
            }
            if (o) {
              const h = s[u];
              if (h && ut(h) && h.type === n) return u;
            }
            return null;
          })(a, s, n, null == r ? Co(a) && _s : r != s && 0 != (3 & a.type), o & x.Host && i === a);
        return null !== l ? wr(t, s, l, a) : _t;
      }
      function wr(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function Wy(e) {
            return e instanceof vr;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function Jm(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new I(-200, `Circular dependency in DI detected for ${e}${n}`);
            })(
              (function $(e) {
                return "function" == typeof e ? e.name || e.toString() : "object" == typeof e && null != e && "function" == typeof e.type ? e.type.name || e.type.toString() : P(e);
              })(i[n])
            );
          const a = Po(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? Ze(s.injectImpl) : null;
          Xc(e, r, x.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function Gy(e, t, n) {
                  const { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
                  if (r) {
                    const s = $c(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s), (n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, s);
                  }
                  o && (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
                    i && ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i), (n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== u && Ze(u), Po(a), (s.resolving = !1), rl();
          }
        }
        return o;
      }
      function gl(e, t, n) {
        return !!(n[t + (e >> 5)] & (1 << e));
      }
      function ml(e, t) {
        return !(e & x.Self || (e & x.Host && t));
      }
      class Tn {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return hl(this._tNode, this._lView, t, r, n);
        }
      }
      function nD() {
        return new Tn(pe(), y());
      }
      function yl(e) {
        const t = e[1],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[6] : null;
      }
      const xn = "__parameters__";
      function Pn(e, t, n) {
        return Ut(() => {
          const r = (function Is(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(u, c, l) {
              const d = u.hasOwnProperty(xn) ? u[xn] : Object.defineProperty(u, xn, { value: [] })[xn];
              for (; d.length <= l; ) d.push(null);
              return (d[l] = d[l] || []).push(s), u;
            }
          }
          return n && (o.prototype = Object.create(n.prototype)), (o.prototype.ngMetadataName = e), (o.annotationCls = o), o;
        });
      }
      class B {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n ? (this.__NG_ELEMENT_ID__ = n) : void 0 !== n && (this.ɵprov = q({ token: this, providedIn: n.providedIn || "root", factory: n.factory }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function Pt(e, t) {
        e.forEach((n) => (Array.isArray(n) ? Pt(n, t) : t(n)));
      }
      function vl(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Ro(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function Ye(e, t, n) {
        let r = Nn(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function uD(e, t, n, r) {
                let o = e.length;
                if (o == t) e.push(n, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = n);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > t; ) (e[o] = e[o - 2]), o--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function Ts(e, t) {
        const n = Nn(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Nn(e, t) {
        return (function wl(e, t, n) {
          let r = 0,
            o = e.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << n];
            if (t === s) return i << n;
            s > t ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(e, t, 1);
      }
      const Mr = {},
        xs = "__NG_DI_FLAG__",
        Lo = "ngTempTokenPath",
        mD = /\n/gm,
        El = "__source";
      let Tr;
      function On(e) {
        const t = Tr;
        return (Tr = e), t;
      }
      function DD(e, t = x.Default) {
        if (void 0 === Tr) throw new I(-203, !1);
        return null === Tr ? Rc(e, void 0, t) : Tr.get(e, t & x.Optional ? null : void 0, t);
      }
      function G(e, t = x.Default) {
        return (
          (function sy() {
            return Xi;
          })() || DD
        )(T(e), t);
      }
      function As(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = T(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new I(900, !1);
            let o,
              i = x.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = _D(a);
              "number" == typeof u ? (-1 === u ? (o = a.token) : (i |= u)) : (o = a);
            }
            t.push(G(o, i));
          } else t.push(G(r));
        }
        return t;
      }
      function Sr(e, t) {
        return (e[xs] = t), (e.prototype[xs] = t), e;
      }
      function _D(e) {
        return e[xs];
      }
      const Bo = Sr(Pn("Optional"), 8),
        Vo = Sr(Pn("SkipSelf"), 4);
      let Ns;
      const zl = new B("ENVIRONMENT_INITIALIZER"),
        Wl = new B("INJECTOR", -1),
        ql = new B("INJECTOR_DEF_TYPES");
      class Yl {
        get(t, n = Mr) {
          if (n === Mr) {
            const r = new Error(`NullInjectorError: No provider for ${Z(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function ov(...e) {
        return { ɵproviders: Ql(0, e) };
      }
      function Ql(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        return (
          Pt(t, (i) => {
            const s = i;
            Vs(s, n, [], r) && (o || (o = []), o.push(s));
          }),
          void 0 !== o && Zl(o, n),
          n
        );
      }
      function Zl(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: o } = e[n];
          Pt(o, (i) => {
            t.push(i);
          });
        }
      }
      function Vs(e, t, n, r) {
        if (!(e = T(e))) return !1;
        let o = null,
          i = Oc(e);
        const s = !i && W(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = Oc(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u = "function" == typeof s.dependencies ? s.dependencies() : s.dependencies;
            for (const c of u) Vs(c, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let c;
              r.add(o);
              try {
                Pt(i.imports, (l) => {
                  Vs(l, t, n, r) && (c || (c = []), c.push(l));
                });
              } finally {
              }
              void 0 !== c && Zl(c, t);
            }
            if (!a) {
              const c = un(o) || (() => new o());
              t.push({ provide: o, useFactory: c, deps: U }, { provide: ql, useValue: o, multi: !0 }, { provide: zl, useValue: () => G(o), multi: !0 });
            }
            const u = i.providers;
            null == u ||
              a ||
              Pt(u, (l) => {
                t.push(l);
              });
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      const iv = Q({ provide: String, useValue: Q });
      function js(e) {
        return null !== e && "object" == typeof e && iv in e;
      }
      function cn(e) {
        return "function" == typeof e;
      }
      const Hs = new B("Set Injector scope."),
        zo = {},
        av = {};
      let $s;
      function Wo() {
        return void 0 === $s && ($s = new Yl()), $s;
      }
      class kn {}
      class Xl extends kn {
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Gs(t, (s) => this.processProvider(s)),
            this.records.set(Wl, Ln(void 0, this)),
            o.has("environment") && this.records.set(kn, Ln(void 0, this));
          const i = this.records.get(Hs);
          null != i && "string" == typeof i.value && this.scopes.add(i.value), (this.injectorDefTypes = new Set(this.get(ql.multi, U, x.Self)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = On(this),
            r = Ze(void 0);
          try {
            return t();
          } finally {
            On(n), Ze(r);
          }
        }
        get(t, n = Mr, r = x.Default) {
          this.assertNotDestroyed();
          const o = On(this),
            i = Ze(void 0);
          try {
            if (!(r & x.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const u =
                  (function fv(e) {
                    return "function" == typeof e || ("object" == typeof e && e instanceof B);
                  })(t) && go(t);
                (a = u && this.injectableDefInScope(u) ? Ln(Us(t), zo) : null), this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & x.Self ? Wo() : this.parent).get(t, (n = r & x.Optional && n === Mr ? null : n));
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Lo] = s[Lo] || []).unshift(Z(t)), o)) throw s;
              return (function CD(e, t, n, r) {
                const o = e[Lo];
                throw (
                  (t[El] && o.unshift(t[El]),
                  (e.message = (function wD(e, t, n, r = null) {
                    e = e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1) ? e.slice(2) : e;
                    let o = Z(t);
                    if (Array.isArray(t)) o = t.map(Z).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(s + ":" + ("string" == typeof a ? JSON.stringify(a) : Z(a)));
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(mD, "\n  ")}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[Lo] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Ze(i), On(o);
          }
        }
        resolveInjectorInitializers() {
          const t = On(this),
            n = Ze(void 0);
          try {
            const r = this.get(zl.multi, U, x.Self);
            for (const o of r) o();
          } finally {
            On(t), Ze(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(Z(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new I(205, !1);
        }
        processProvider(t) {
          let n = cn((t = T(t))) ? t : T(t && t.provide);
          const r = (function cv(e) {
            return js(e)
              ? Ln(void 0, e.useValue)
              : Ln(
                  (function ed(e, t, n) {
                    let r;
                    if (cn(e)) {
                      const o = T(e);
                      return un(o) || Us(o);
                    }
                    if (js(e)) r = () => T(e.useValue);
                    else if (
                      (function Jl(e) {
                        return !(!e || !e.useFactory);
                      })(e)
                    )
                      r = () => e.useFactory(...As(e.deps || []));
                    else if (
                      (function Kl(e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      r = () => G(T(e.useExisting));
                    else {
                      const o = T(e && (e.useClass || e.provide));
                      if (
                        !(function lv(e) {
                          return !!e.deps;
                        })(e)
                      )
                        return un(o) || Us(o);
                      r = () => new o(...As(e.deps));
                    }
                    return r;
                  })(e),
                  zo
                );
          })(t);
          if (cn(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o || ((o = Ln(void 0, zo, !0)), (o.factory = () => As(o.multi)), this.records.set(n, o)), (n = t), o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === zo && ((n.value = av), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function dv(e) {
                return null !== e && "object" == typeof e && "function" == typeof e.ngOnDestroy;
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = T(t.providedIn);
          return "string" == typeof n ? "any" === n || this.scopes.has(n) : this.injectorDefTypes.has(n);
        }
      }
      function Us(e) {
        const t = go(e),
          n = null !== t ? t.factory : un(e);
        if (null !== n) return n;
        if (e instanceof B) throw new I(204, !1);
        if (e instanceof Function)
          return (function uv(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function Ir(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new I(204, !1))
              );
            const n = (function ry(e) {
              const t = e && (e[mo] || e[Fc]);
              if (t) {
                const n = (function oy(e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const t = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new I(204, !1);
      }
      function Ln(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function hv(e) {
        return !!e.ɵproviders;
      }
      function Gs(e, t) {
        for (const n of e) Array.isArray(n) ? Gs(n, t) : hv(n) ? Gs(n.ɵproviders, t) : t(n);
      }
      class td {}
      class mv {
        resolveComponentFactory(t) {
          throw (function gv(e) {
            const t = Error(`No component factory found for ${Z(e)}. Did you add it to @NgModule.entryComponents?`);
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let qo = (() => {
        class e {}
        return (e.NULL = new mv()), e;
      })();
      function yv() {
        return Bn(pe(), y());
      }
      function Bn(e, t) {
        return new Vn(et(e, t));
      }
      let Vn = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = yv), e;
      })();
      class rd {}
      let od = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function vv() {
                const e = y(),
                  n = Ge(pe().index, e);
                return (ke(n) ? n : e)[k];
              })()),
            e
          );
        })(),
        _v = (() => {
          class e {}
          return (e.ɵprov = q({ token: e, providedIn: "root", factory: () => null })), e;
        })();
      class zs {
        constructor(t) {
          (this.full = t), (this.major = t.split(".")[0]), (this.minor = t.split(".")[1]), (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const Cv = new zs("14.2.8"),
        Ws = {};
      function Ks(e) {
        return e.ngOriginalError;
      }
      class jn {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t), n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Ks(t);
          for (; n && Ks(n); ) n = Ks(n);
          return n || null;
        }
      }
      const Js = new Map();
      let Ov = 0;
      const ea = "__ngContext__";
      function Ee(e, t) {
        ke(t)
          ? ((e[ea] = t[20]),
            (function Rv(e) {
              Js.set(e[20], e);
            })(t))
          : (e[ea] = t);
      }
      var Le = (() => (((Le = Le || {})[(Le.Important = 1)] = "Important"), (Le[(Le.DashCase = 2)] = "DashCase"), Le))();
      function na(e, t) {
        return undefined(e, t);
      }
      function Rr(e) {
        const t = e[3];
        return at(t) ? t[3] : t;
      }
      function ra(e) {
        return Dd(e[13]);
      }
      function oa(e) {
        return Dd(e[4]);
      }
      function Dd(e) {
        for (; null !== e && !at(e); ) e = e[4];
        return e;
      }
      function $n(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          at(r) ? (i = r) : ke(r) && ((s = !0), (r = r[0]));
          const a = le(r);
          0 === e && null !== n
            ? null == o
              ? bd(t, n, a)
              : ln(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? ln(t, n, a, o || null, !0)
            : 2 === e
            ? (function Pd(e, t, n) {
                const r = Yo(e, t);
                r &&
                  (function u_(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function d_(e, t, n, r, o) {
                const i = n[7];
                i !== le(n) && $n(t, e, r, i, o);
                for (let a = 10; a < n.length; a++) {
                  const u = n[a];
                  kr(u[1], u, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function sa(e, t, n) {
        return e.createElement(t, n);
      }
      function _d(e, t) {
        const n = e[9],
          r = n.indexOf(t),
          o = t[3];
        512 & t[2] && ((t[2] &= -513), ls(o, -1)), n.splice(r, 1);
      }
      function aa(e, t) {
        if (e.length <= 10) return;
        const n = 10 + t,
          r = e[n];
        if (r) {
          const o = r[17];
          null !== o && o !== e && _d(o, r), t > 0 && (e[n - 1][4] = r[4]);
          const i = Ro(e, 10 + t);
          !(function e_(e, t) {
            kr(e, t, t[k], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = i[19];
          null !== s && s.detachView(i[1]), (r[3] = null), (r[4] = null), (r[2] &= -65);
        }
        return r;
      }
      function Cd(e, t) {
        if (!(128 & t[2])) {
          const n = t[k];
          n.destroyNode && kr(e, t, n, 3, null, null),
            (function r_(e) {
              let t = e[13];
              if (!t) return ua(e[1], e);
              for (; t; ) {
                let n = null;
                if (ke(t)) n = t[13];
                else {
                  const r = t[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; ) ke(t) && ua(t[1], t), (t = t[3]);
                  null === t && (t = e), ke(t) && ua(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function ua(e, t) {
        if (!(128 & t[2])) {
          (t[2] &= -65),
            (t[2] |= 128),
            (function a_(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof vr)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        try {
                          u.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        i.call(o);
                      } finally {
                      }
                  }
                }
            })(e, t),
            (function s_(e, t) {
              const n = e.cleanup,
                r = t[7];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 1],
                      a = "function" == typeof s ? s(t) : le(t[s]),
                      u = r[(o = n[i + 2])],
                      c = n[i + 3];
                    "boolean" == typeof c ? a.removeEventListener(n[i], u, c) : c >= 0 ? r[(o = c)]() : r[(o = -c)].unsubscribe(), (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) (0, r[i])();
                t[7] = null;
              }
            })(e, t),
            1 === t[1].type && t[k].destroy();
          const n = t[17];
          if (null !== n && at(t[3])) {
            n !== t[3] && _d(n, t);
            const r = t[19];
            null !== r && r.detachView(e);
          }
          !(function kv(e) {
            Js.delete(e[20]);
          })(t);
        }
      }
      function wd(e, t, n) {
        return (function Ed(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[0];
          if (2 & r.flags) {
            const o = e.data[r.directiveStart].encapsulation;
            if (o === Dt.None || o === Dt.Emulated) return null;
          }
          return et(r, n);
        })(e, t.parent, n);
      }
      function ln(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function bd(e, t, n) {
        e.appendChild(t, n);
      }
      function Id(e, t, n, r, o) {
        null !== r ? ln(e, t, n, r, o) : bd(e, t, n);
      }
      function Yo(e, t) {
        return e.parentNode(t);
      }
      let Sd = function Td(e, t, n) {
        return 40 & e.type ? et(e, n) : null;
      };
      function Qo(e, t, n, r) {
        const o = wd(e, r, t),
          i = t[k],
          a = (function Md(e, t, n) {
            return Sd(e, t, n);
          })(r.parent || t[6], r, t);
        if (null != o)
          if (Array.isArray(n)) for (let u = 0; u < n.length; u++) Id(i, o, n[u], a, !1);
          else Id(i, o, n, a, !1);
      }
      function Zo(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return et(t, e);
          if (4 & n) return la(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return Zo(e, r);
            {
              const o = e[t.index];
              return at(o) ? la(-1, o) : le(o);
            }
          }
          if (32 & n) return na(t, e)() || le(e[t.index]);
          {
            const r = Ad(e, t);
            return null !== r ? (Array.isArray(r) ? r[0] : Zo(Rr(e[16]), r)) : Zo(e, t.next);
          }
        }
        return null;
      }
      function Ad(e, t) {
        return null !== t ? e[16][6].projection[t.projection] : null;
      }
      function la(e, t) {
        const n = 10 + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[1].firstChild;
          if (null !== o) return Zo(r, o);
        }
        return t[7];
      }
      function da(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if ((s && 0 === t && (a && Ee(le(a), r), (n.flags |= 4)), 64 != (64 & n.flags)))
            if (8 & u) da(e, t, n.child, r, o, i, !1), $n(t, e, o, a, i);
            else if (32 & u) {
              const c = na(n, r);
              let l;
              for (; (l = c()); ) $n(t, e, o, l, i);
              $n(t, e, o, a, i);
            } else 16 & u ? Nd(e, t, r, n, o, i) : $n(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function kr(e, t, n, r, o, i) {
        da(n, r, e.firstChild, t, o, i, !1);
      }
      function Nd(e, t, n, r, o, i) {
        const s = n[16],
          u = s[6].projection[r.projection];
        if (Array.isArray(u)) for (let c = 0; c < u.length; c++) $n(t, e, o, u[c], i);
        else da(e, t, u, s[3], o, i, !0);
      }
      function Od(e, t, n) {
        e.setAttribute(t, "style", n);
      }
      function fa(e, t, n) {
        "" === n ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
      }
      function Fd(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const Rd = "ng-template";
      function h_(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let o = e[r++];
          if (n && "class" === o) {
            if (((o = e[r]), -1 !== Fd(o.toLowerCase(), t, 0))) return !0;
          } else if (1 === o) {
            for (; r < e.length && "string" == typeof (o = e[r++]); ) if (o.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function kd(e) {
        return 4 === e.type && e.value !== Rd;
      }
      function p_(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Rd);
      }
      function g_(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function D_(e) {
            for (let t = 0; t < e.length; t++) if (il(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (((r = 2 | (1 & r)), ("" !== u && !p_(e, u, n)) || ("" === u && 1 === t.length))) {
                  if (ct(r)) return !1;
                  s = !0;
                }
              } else {
                const c = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!h_(e.attrs, c, n)) {
                    if (ct(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = m_(8 & r ? "class" : u, o, kd(e), n);
                if (-1 === d) {
                  if (ct(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== c) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Fd(h, c, 0)) || (2 & r && c !== f)) {
                    if (ct(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !ct(r) && !ct(u)) return !1;
            if (s && ct(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return ct(r) || s;
      }
      function ct(e) {
        return 0 == (1 & e);
      }
      function m_(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function v_(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function Ld(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (g_(e, t[r], n)) return !0;
        return !1;
      }
      function Bd(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function C_(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else "" !== o && !ct(s) && ((t += Bd(i, o)), (o = "")), (r = s), (i = i || !ct(r));
          n++;
        }
        return "" !== o && (t += Bd(i, o)), t;
      }
      const N = {};
      function Y(e) {
        Vd(j(), y(), Ae() + e, !1);
      }
      function Vd(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const i = e.preOrderCheckHooks;
            null !== i && To(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && So(t, i, 0, n);
          }
        zt(n);
      }
      function Ud(e, t = null, n = null, r) {
        const o = Gd(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function Gd(e, t = null, n = null, r, o = new Set()) {
        const i = [n || U, ov(e)];
        return (r = r || ("object" == typeof e ? void 0 : Z(e))), new Xl(i, t || Wo(), r || null, o);
      }
      let dn = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return Ud({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return Ud({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (e.THROW_IF_NOT_FOUND = Mr), (e.NULL = new Yl()), (e.ɵprov = q({ token: e, providedIn: "any", factory: () => G(Wl) })), (e.__NG_ELEMENT_ID__ = -1), e;
      })();
      function S(e, t = x.Default) {
        const n = y();
        return null === n ? G(e, t) : hl(pe(), n, T(e), t);
      }
      function Jo(e, t) {
        return (e << 17) | (t << 2);
      }
      function lt(e) {
        return (e >> 17) & 32767;
      }
      function ya(e) {
        return 2 | e;
      }
      function Ft(e) {
        return (131068 & e) >> 2;
      }
      function Da(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function va(e) {
        return 1 | e;
      }
      function uf(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const o = n[r],
              i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              gs(o), s.contentQueries(2, t[i], i);
            }
          }
      }
      function ti(e, t, n, r, o, i, s, a, u, c, l) {
        const d = t.blueprint.slice();
        return (
          (d[0] = o),
          (d[2] = 76 | r),
          (null !== l || (e && 1024 & e[2])) && (d[2] |= 1024),
          zc(d),
          (d[3] = d[15] = e),
          (d[8] = n),
          (d[10] = s || (e && e[10])),
          (d[k] = a || (e && e[k])),
          (d[12] = u || (e && e[12]) || null),
          (d[9] = c || (e && e[9]) || null),
          (d[6] = i),
          (d[20] = (function Fv() {
            return Ov++;
          })()),
          (d[21] = l),
          (d[16] = 2 == t.type ? e[16] : d),
          d
        );
      }
      function Gn(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function Ta(e, t, n, r, o) {
            const i = Yc(),
              s = ds(),
              u = (e.data[t] = (function oC(e, t, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, t, r, o));
            return null === e.firstChild && (e.firstChild = u), null !== i && (s ? null == i.child && null !== u.parent && (i.child = u) : null === i.next && (i.next = u)), u;
          })(e, t, n, r, o)),
            (function Oy() {
              return A.lFrame.inI18n;
            })() && (i.flags |= 64);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function Dr() {
            const e = A.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return vt(i, !0), i;
      }
      function zn(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Sa(e, t, n) {
        ms(t);
        try {
          const r = e.viewQuery;
          null !== r && ka(1, r, n);
          const o = e.template;
          null !== o && cf(e, t, o, 1, n), e.firstCreatePass && (e.firstCreatePass = !1), e.staticContentQueries && uf(e, t), e.staticViewQueries && ka(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function tC(e, t) {
              for (let n = 0; n < t.length; n++) _C(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
        } finally {
          (t[2] &= -5), ys();
        }
      }
      function ni(e, t, n, r) {
        const o = t[2];
        if (128 != (128 & o)) {
          ms(t);
          try {
            zc(t),
              (function Zc(e) {
                return (A.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && cf(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const c = e.preOrderCheckHooks;
              null !== c && To(t, c, null);
            } else {
              const c = e.preOrderHooks;
              null !== c && So(t, c, 0, null), Ds(t, 0);
            }
            if (
              ((function DC(e) {
                for (let t = ra(e); null !== t; t = oa(t)) {
                  if (!t[2]) continue;
                  const n = t[9];
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r],
                      i = o[3];
                    0 == (512 & o[2]) && ls(i, 1), (o[2] |= 512);
                  }
                }
              })(t),
              (function yC(e) {
                for (let t = ra(e); null !== t; t = oa(t))
                  for (let n = 10; n < t.length; n++) {
                    const r = t[n],
                      o = r[1];
                    Io(r) && ni(o, r, o.template, r[8]);
                  }
              })(t),
              null !== e.contentQueries && uf(e, t),
              s)
            ) {
              const c = e.contentCheckHooks;
              null !== c && To(t, c);
            } else {
              const c = e.contentHooks;
              null !== c && So(t, c, 1), Ds(t, 1);
            }
            !(function X_(e, t) {
              const n = e.hostBindingOpCodes;
              if (null !== n)
                try {
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    if (o < 0) zt(~o);
                    else {
                      const i = o,
                        s = n[++r],
                        a = n[++r];
                      Fy(s, i), a(2, t[i]);
                    }
                  }
                } finally {
                  zt(-1);
                }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function eC(e, t) {
                for (let n = 0; n < t.length; n++) vC(e, t[n]);
              })(t, a);
            const u = e.viewQuery;
            if ((null !== u && ka(2, u, r), s)) {
              const c = e.viewCheckHooks;
              null !== c && To(t, c);
            } else {
              const c = e.viewHooks;
              null !== c && So(t, c, 2), Ds(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1), (t[2] &= -41), 512 & t[2] && ((t[2] &= -513), ls(t[3], -1));
          } finally {
            ys();
          }
        }
      }
      function cf(e, t, n, r, o) {
        const i = Ae(),
          s = 2 & r;
        try {
          zt(-1), s && t.length > J && Vd(e, t, J, !1), n(r, o);
        } finally {
          zt(i);
        }
      }
      function xa(e, t, n) {
        !qc() ||
          ((function cC(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            e.firstCreatePass || Cr(n, t), Ee(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const u = e.data[a],
                c = ut(u);
              c && pC(t, n, u);
              const l = wr(t, e, a, n);
              Ee(l, t), null !== s && gC(0, a - o, l, u, 0, s), c && (Ge(n.index, t)[8] = l);
            }
          })(e, t, n, et(n, t)),
          128 == (128 & n.flags) &&
            (function lC(e, t, n) {
              const r = n.directiveStart,
                o = n.directiveEnd,
                i = n.index,
                s = (function Ry() {
                  return A.lFrame.currentDirectiveIndex;
                })();
              try {
                zt(i);
                for (let a = r; a < o; a++) {
                  const u = e.data[a],
                    c = t[a];
                  hs(a), (null !== u.hostBindings || 0 !== u.hostVars || null !== u.hostAttrs) && yf(u, c);
                }
              } finally {
                zt(-1), hs(s);
              }
            })(e, t, n));
      }
      function Aa(e, t, n = et) {
        const r = t.localNames;
        if (null !== r) {
          let o = t.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function df(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass ? (e.tView = Pa(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts)) : t;
      }
      function Pa(e, t, n, r, o, i, s, a, u, c) {
        const l = J + r,
          d = l + o,
          f = (function nC(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : N);
            return n;
          })(l, d),
          h = "function" == typeof c ? c() : c;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, l),
          bindingStartIndex: l,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function hf(e, t, n) {
        for (let r in e)
          if (e.hasOwnProperty(r)) {
            const o = e[r];
            (n = null === n ? {} : n).hasOwnProperty(r) ? n[r].push(t, o) : (n[r] = [t, o]);
          }
        return n;
      }
      function pf(e, t) {
        const r = t.directiveEnd,
          o = e.data,
          i = t.attrs,
          s = [];
        let a = null,
          u = null;
        for (let c = t.directiveStart; c < r; c++) {
          const l = o[c],
            d = l.inputs,
            f = null === i || kd(t) ? null : mC(d, i);
          s.push(f), (a = hf(d, c, a)), (u = hf(l.outputs, c, u));
        }
        null !== a && (a.hasOwnProperty("class") && (t.flags |= 16), a.hasOwnProperty("style") && (t.flags |= 32)), (t.initialInputs = s), (t.inputs = a), (t.outputs = u);
      }
      function gf(e, t) {
        const n = Ge(t, e);
        16 & n[2] || (n[2] |= 32);
      }
      function Na(e, t, n, r) {
        let o = !1;
        if (qc()) {
          const i = (function dC(e, t, n) {
              const r = e.directiveRegistry;
              let o = null;
              if (r)
                for (let i = 0; i < r.length; i++) {
                  const s = r[i];
                  Ld(n, s.selectors, !1) && (o || (o = []), Oo(Cr(n, t), e, s.type), ut(s) ? (Df(e, n), o.unshift(s)) : o.push(s));
                }
              return o;
            })(e, t, n),
            s = null === r ? null : { "": -1 };
          if (null !== i) {
            (o = !0), vf(n, e.data.length, i.length);
            for (let l = 0; l < i.length; l++) {
              const d = i[l];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              u = !1,
              c = zn(e, t, i.length, null);
            for (let l = 0; l < i.length; l++) {
              const d = i[l];
              (n.mergedAttrs = Ao(n.mergedAttrs, d.hostAttrs)),
                _f(e, n, t, c, d),
                hC(c, d, s),
                null !== d.contentQueries && (n.flags |= 8),
                (null !== d.hostBindings || null !== d.hostAttrs || 0 !== d.hostVars) && (n.flags |= 128);
              const f = d.type.prototype;
              !a && (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) && ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index), (a = !0)),
                !u && (f.ngOnChanges || f.ngDoCheck) && ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(n.index), (u = !0)),
                c++;
            }
            pf(e, n);
          }
          s &&
            (function fC(e, t, n) {
              if (t) {
                const r = (e.localNames = []);
                for (let o = 0; o < t.length; o += 2) {
                  const i = n[t[o + 1]];
                  if (null == i) throw new I(-301, !1);
                  r.push(t[o], i);
                }
              }
            })(n, r, s);
        }
        return (n.mergedAttrs = Ao(n.mergedAttrs, n.attrs)), o;
      }
      function mf(e, t, n, r, o, i) {
        const s = i.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const u = ~t.index;
          (function uC(e) {
            let t = e.length;
            for (; t > 0; ) {
              const n = e[--t];
              if ("number" == typeof n && n < 0) return n;
            }
            return 0;
          })(a) != u && a.push(u),
            a.push(r, o, s);
        }
      }
      function yf(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Df(e, t) {
        (t.flags |= 2), (e.components || (e.components = [])).push(t.index);
      }
      function hC(e, t, n) {
        if (n) {
          if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          ut(t) && (n[""] = e);
        }
      }
      function vf(e, t, n) {
        (e.flags |= 1), (e.directiveStart = t), (e.directiveEnd = t + n), (e.providerIndexes = t);
      }
      function _f(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = un(o.type)),
          s = new vr(i, ut(o), S);
        (e.blueprint[r] = s), (n[r] = s), mf(e, t, 0, r, zn(e, n, o.hostVars, N), o);
      }
      function pC(e, t, n) {
        const r = et(t, e),
          o = df(n),
          i = e[10],
          s = ri(e, ti(e, o, null, n.onPush ? 32 : 16, r, t, i, i.createRenderer(r, n), null, null, null));
        e[t.index] = s;
      }
      function gC(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s) {
          const a = r.setInput;
          for (let u = 0; u < s.length; ) {
            const c = s[u++],
              l = s[u++],
              d = s[u++];
            null !== a ? r.setInput(n, d, c, l) : (n[l] = d);
          }
        }
      }
      function mC(e, t) {
        let n = null,
          r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              e.hasOwnProperty(o) && (null === n && (n = []), n.push(o, e[o], t[r + 1])), (r += 2);
            } else r += 2;
          else r += 4;
        }
        return n;
      }
      function Cf(e, t, n, r) {
        return new Array(e, !0, !1, t, null, 0, r, n, null, null);
      }
      function vC(e, t) {
        const n = Ge(t, e);
        if (Io(n)) {
          const r = n[1];
          48 & n[2] ? ni(r, n, r.template, n[8]) : n[5] > 0 && Fa(n);
        }
      }
      function Fa(e) {
        for (let r = ra(e); null !== r; r = oa(r))
          for (let o = 10; o < r.length; o++) {
            const i = r[o];
            if (Io(i))
              if (512 & i[2]) {
                const s = i[1];
                ni(s, i, s.template, i[8]);
              } else i[5] > 0 && Fa(i);
          }
        const n = e[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = Ge(n[r], e);
            Io(o) && o[5] > 0 && Fa(o);
          }
      }
      function _C(e, t) {
        const n = Ge(t, e),
          r = n[1];
        (function CC(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
        })(r, n),
          Sa(r, n, n[8]);
      }
      function ri(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function Ra(e) {
        for (; e; ) {
          e[2] |= 32;
          const t = Rr(e);
          if (hy(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function oi(e, t, n, r = !0) {
        const o = t[10];
        o.begin && o.begin();
        try {
          ni(e, t, e.template, n);
        } catch (s) {
          throw (r && If(t, s), s);
        } finally {
          o.end && o.end();
        }
      }
      function ka(e, t, n) {
        gs(0), t(e, n);
      }
      function wf(e) {
        return e[7] || (e[7] = []);
      }
      function Ef(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function If(e, t) {
        const n = e[9],
          r = n ? n.get(jn, null) : null;
        r && r.handleError(t);
      }
      function La(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            u = t[s],
            c = e.data[s];
          null !== c.setInput ? c.setInput(u, o, r, a) : (u[a] = o);
        }
      }
      function Rt(e, t, n) {
        const r = bo(t, e);
        !(function vd(e, t, n) {
          e.setValue(t, n);
        })(e[k], r, n);
      }
      function ii(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a ? (i = a) : 1 == i ? (o = Qi(o, a)) : 2 == i && (r = Qi(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r), n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function si(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(le(i)), at(i)))
            for (let a = 10; a < i.length; a++) {
              const u = i[a],
                c = u[1].firstChild;
              null !== c && si(u[1], u, c, r);
            }
          const s = n.type;
          if (8 & s) si(e, t, n.child, r);
          else if (32 & s) {
            const a = na(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = Ad(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = Rr(t[16]);
              si(u[1], u, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class Lr {
        constructor(t, n) {
          (this._lView = t), (this._cdRefInjectingView = n), (this._appRef = null), (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const t = this._lView,
            n = t[1];
          return si(n, t, n.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (at(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (aa(t, r), Ro(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          Cd(this._lView[1], this._lView);
        }
        onDestroy(t) {
          !(function ff(e, t, n, r) {
            const o = wf(t);
            null === n ? o.push(r) : (o.push(n), e.firstCreatePass && Ef(e).push(r, o.length - 1));
          })(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          Ra(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          oi(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new I(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function n_(e, t) {
              kr(e, t, t[k], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new I(902, !1);
          this._appRef = t;
        }
      }
      class wC extends Lr {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          oi(t[1], t, t[8], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class Ba extends qo {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = W(t);
          return new Br(n, this.ngModule);
        }
      }
      function Mf(e) {
        const t = [];
        for (let n in e) e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class bC {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          const o = this.injector.get(t, Ws, r);
          return o !== Ws || n === Ws ? o : this.parentInjector.get(t, n, r);
        }
      }
      class Br extends td {
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function w_(e) {
              return e.map(C_).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors ? t.ngContentSelectors : []),
            (this.isBoundToModule = !!n);
        }
        get inputs() {
          return Mf(this.componentDef.inputs);
        }
        get outputs() {
          return Mf(this.componentDef.outputs);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof kn ? o : o?.injector;
          i && null !== this.componentDef.getStandaloneInjector && (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new bC(t, i) : t,
            a = s.get(rd, null);
          if (null === a) throw new I(407, !1);
          const u = s.get(_v, null),
            c = a.createRenderer(null, this.componentDef),
            l = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function rC(e, t, n) {
                  return e.selectRootElement(t, n === Dt.ShadowDom);
                })(c, r, this.componentDef.encapsulation)
              : sa(
                  a.createRenderer(null, this.componentDef),
                  l,
                  (function EC(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(l)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = Pa(0, null, null, 1, 0, null, null, null, null, null),
            p = ti(null, h, null, f, null, null, a, c, u, s, null);
          let g, D;
          ms(p);
          try {
            const v = (function TC(e, t, n, r, o, i) {
              const s = n[1];
              n[22] = e;
              const u = Gn(s, 22, 2, "#host", null),
                c = (u.mergedAttrs = t.hostAttrs);
              null !== c && (ii(u, c, !0), null !== e && (xo(o, e, c), null !== u.classes && fa(o, e, u.classes), null !== u.styles && Od(o, e, u.styles)));
              const l = r.createRenderer(e, t),
                d = ti(n, df(t), null, t.onPush ? 32 : 16, n[22], u, r, l, i || null, null, null);
              return s.firstCreatePass && (Oo(Cr(u, n), s, t.type), Df(s, u), vf(u, n.length, 1)), ri(n, d), (n[22] = d);
            })(d, this.componentDef, p, a, c);
            if (d)
              if (r) xo(c, d, ["ng-version", Cv.full]);
              else {
                const { attrs: w, classes: m } = (function E_(e) {
                  const t = [],
                    n = [];
                  let r = 1,
                    o = 2;
                  for (; r < e.length; ) {
                    let i = e[r];
                    if ("string" == typeof i) 2 === o ? "" !== i && t.push(i, e[++r]) : 8 === o && n.push(i);
                    else {
                      if (!ct(o)) break;
                      o = i;
                    }
                    r++;
                  }
                  return { attrs: t, classes: n };
                })(this.componentDef.selectors[0]);
                w && xo(c, d, w), m && m.length > 0 && fa(c, d, m.join(" "));
              }
            if (((D = cs(h, J)), void 0 !== n)) {
              const w = (D.projection = []);
              for (let m = 0; m < this.ngContentSelectors.length; m++) {
                const E = n[m];
                w.push(null != E ? Array.from(E) : null);
              }
            }
            (g = (function SC(e, t, n, r) {
              const o = n[1],
                i = (function aC(e, t, n) {
                  const r = pe();
                  e.firstCreatePass && (n.providersResolver && n.providersResolver(n), _f(e, r, t, zn(e, t, 1, null), n), pf(e, r));
                  const o = wr(t, e, r.directiveStart, r);
                  Ee(o, t);
                  const i = et(r, t);
                  return i && Ee(i, t), o;
                })(o, n, t);
              if (((e[8] = n[8] = i), null !== r)) for (const a of r) a(i, t);
              if (t.contentQueries) {
                const a = pe();
                t.contentQueries(1, i, a.directiveStart);
              }
              const s = pe();
              return !o.firstCreatePass || (null === t.hostBindings && null === t.hostAttrs) || (zt(s.index), mf(n[1], s, 0, s.directiveStart, s.directiveEnd, t), yf(t, i)), i;
            })(v, this.componentDef, p, [xC])),
              Sa(h, p, null);
          } finally {
            ys();
          }
          return new MC(this.componentType, g, Bn(D, p), p, D);
        }
      }
      class MC extends class pv {} {
        constructor(t, n, r, o, i) {
          super(), (this.location = r), (this._rootLView = o), (this._tNode = i), (this.instance = n), (this.hostView = this.changeDetectorRef = new wC(o)), (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            const i = this._rootLView;
            La(i[1], i, o, t, n), gf(i, this._tNode.index);
          }
        }
        get injector() {
          return new Tn(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function xC() {
        const e = pe();
        Mo(y()[1], e);
      }
      let ai = null;
      function fn() {
        if (!ai) {
          const e = K.Symbol;
          if (e && e.iterator) ai = e.iterator;
          else {
            const t = Object.getOwnPropertyNames(Map.prototype);
            for (let n = 0; n < t.length; ++n) {
              const r = t[n];
              "entries" !== r && "size" !== r && Map.prototype[r] === Map.prototype.entries && (ai = r);
            }
          }
        }
        return ai;
      }
      function Vr(e) {
        return !!ja(e) && (Array.isArray(e) || (!(e instanceof Map) && fn() in e));
      }
      function ja(e) {
        return null !== e && ("function" == typeof e || "object" == typeof e);
      }
      function be(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function Yn(e, t, n, r, o, i) {
        const a = (function hn(e, t, n, r) {
          const o = be(e, t, n);
          return be(e, t + 1, r) || o;
        })(
          e,
          (function xt() {
            return A.lFrame.bindingIndex;
          })(),
          n,
          o
        );
        return At(2), a ? t + P(n) + r + P(o) + i : N;
      }
      function Be(e, t, n, r, o, i, s, a) {
        const u = y(),
          c = j(),
          l = e + J,
          d = c.firstCreatePass
            ? (function HC(e, t, n, r, o, i, s, a, u) {
                const c = t.consts,
                  l = Gn(t, e, 4, s || null, Gt(c, a));
                Na(t, n, l, Gt(c, u)), Mo(t, l);
                const d = (l.tViews = Pa(2, l, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, c));
                return null !== t.queries && (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))), l;
              })(l, c, u, t, n, r, o, i, s)
            : c.data[l];
        vt(d, !1);
        const f = u[k].createComment("");
        Qo(c, u, f, d), Ee(f, u), ri(u, (u[l] = Cf(f, u, f, d))), wo(d) && xa(c, u, d), null != s && Aa(u, d, a);
      }
      function me(e, t, n) {
        const r = y();
        return (
          be(r, bn(), t) &&
            (function Qe(e, t, n, r, o, i, s, a) {
              const u = et(t, n);
              let l,
                c = t.inputs;
              !a && null != c && (l = c[r])
                ? (La(e, n, l, r, o), Co(t) && gf(n, t.index))
                : 3 & t.type &&
                  ((r = (function iC(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, t.value || "", r) : o),
                  i.setProperty(u, r, o));
            })(
              j(),
              (function ie() {
                const e = A.lFrame;
                return cs(e.tView, e.selectedIndex);
              })(),
              r,
              e,
              t,
              r[k],
              n,
              !1
            ),
          me
        );
      }
      function Ha(e, t, n, r, o) {
        const s = o ? "class" : "style";
        La(e, n, t.inputs[s], s, r);
      }
      function O(e, t, n, r) {
        const o = y(),
          i = j(),
          s = J + e,
          a = o[k],
          u = (o[s] = sa(
            a,
            t,
            (function Uy() {
              return A.lFrame.currentNamespace;
            })()
          )),
          c = i.firstCreatePass
            ? (function GC(e, t, n, r, o, i, s) {
                const a = t.consts,
                  c = Gn(t, e, 2, o, Gt(a, i));
                return Na(t, n, c, Gt(a, s)), null !== c.attrs && ii(c, c.attrs, !1), null !== c.mergedAttrs && ii(c, c.mergedAttrs, !0), null !== t.queries && t.queries.elementStart(t, c), c;
              })(s, i, o, 0, t, n, r)
            : i.data[s];
        vt(c, !0);
        const l = c.mergedAttrs;
        null !== l && xo(a, u, l);
        const d = c.classes;
        null !== d && fa(a, u, d);
        const f = c.styles;
        return (
          null !== f && Od(a, u, f),
          64 != (64 & c.flags) && Qo(i, o, u, c),
          0 ===
            (function Ty() {
              return A.lFrame.elementDepthCount;
            })() && Ee(u, o),
          (function Sy() {
            A.lFrame.elementDepthCount++;
          })(),
          wo(c) &&
            (xa(i, o, c),
            (function lf(e, t, n) {
              if (os(t)) {
                const o = t.directiveEnd;
                for (let i = t.directiveStart; i < o; i++) {
                  const s = e.data[i];
                  s.contentQueries && s.contentQueries(1, n[i], i);
                }
              }
            })(i, c, o)),
          null !== r && Aa(o, c),
          O
        );
      }
      function L() {
        let e = pe();
        ds()
          ? (function fs() {
              A.lFrame.isParent = !1;
            })()
          : ((e = e.parent), vt(e, !1));
        const t = e;
        !(function xy() {
          A.lFrame.elementDepthCount--;
        })();
        const n = j();
        return (
          n.firstCreatePass && (Mo(n, e), os(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function Yy(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Ha(n, t, y(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function Qy(e) {
              return 0 != (32 & e.flags);
            })(t) &&
            Ha(n, t, y(), t.stylesWithoutHost, !1),
          L
        );
      }
      function nt(e, t, n, r) {
        return O(e, t, n, r), L(), nt;
      }
      function dt() {
        return y();
      }
      function Ga(e) {
        return !!e && "function" == typeof e.then;
      }
      const WC = function jf(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function _e(e, t, n, r) {
        const o = y(),
          i = j(),
          s = pe();
        return (
          (function $f(e, t, n, r, o, i, s, a) {
            const u = wo(r),
              l = e.firstCreatePass && Ef(e),
              d = t[8],
              f = wf(t);
            let h = !0;
            if (3 & r.type || a) {
              const D = et(r, t),
                v = a ? a(D) : D,
                w = f.length,
                m = a ? (H) => a(le(H[r.index])) : r.index;
              let E = null;
              if (
                (!a &&
                  u &&
                  (E = (function qC(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[7],
                            u = o[i + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, t, o, r.index)),
                null !== E)
              )
                ((E.__ngLastListenerFn__ || E).__ngNextListenerFn__ = i), (E.__ngLastListenerFn__ = i), (h = !1);
              else {
                i = Gf(r, t, d, i, !1);
                const H = n.listen(v, o, i);
                f.push(i, H), l && l.push(o, m, w, w + 1);
              }
            } else i = Gf(r, t, d, i, !1);
            const p = r.outputs;
            let g;
            if (h && null !== p && (g = p[o])) {
              const D = g.length;
              if (D)
                for (let v = 0; v < D; v += 2) {
                  const te = t[g[v]][g[v + 1]].subscribe(i),
                    yn = f.length;
                  f.push(i, te), l && l.push(o, r.index, yn, -(yn + 1));
                }
            }
          })(i, o, o[k], s, e, t, 0, r),
          _e
        );
      }
      function Uf(e, t, n, r) {
        try {
          return !1 !== n(r);
        } catch (o) {
          return If(e, o), !1;
        }
      }
      function Gf(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          Ra(2 & e.flags ? Ge(e.index, t) : t);
          let u = Uf(t, 0, r, s),
            c = i.__ngNextListenerFn__;
          for (; c; ) (u = Uf(t, 0, c, s) && u), (c = c.__ngNextListenerFn__);
          return o && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
        };
      }
      function ue(e = 1) {
        return (function Ly(e) {
          return (A.lFrame.contextLView = (function By(e, t) {
            for (; e > 0; ) (t = t[15]), e--;
            return t;
          })(e, A.lFrame.contextLView))[8];
        })(e);
      }
      function eh(e, t, n, r, o) {
        const i = e[n + 1],
          s = null === t;
        let a = r ? lt(i) : Ft(i),
          u = !1;
        for (; 0 !== a && (!1 === u || s); ) {
          const l = e[a + 1];
          XC(e[a], t) && ((u = !0), (e[a + 1] = r ? va(l) : ya(l))), (a = r ? lt(l) : Ft(l));
        }
        u && (e[n + 1] = r ? ya(i) : va(i));
      }
      function XC(e, t) {
        return null === e || null == t || (Array.isArray(e) ? e[1] : e) === t || (!(!Array.isArray(e) || "string" != typeof t) && Nn(e, t) >= 0);
      }
      const ye = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
      function th(e) {
        return e.substring(ye.key, ye.keyEnd);
      }
      function nh(e, t) {
        const n = ye.textEnd;
        return n === t
          ? -1
          : ((t = ye.keyEnd =
              (function rw(e, t, n) {
                for (; t < n && e.charCodeAt(t) > 32; ) t++;
                return t;
              })(e, (ye.key = t), n)),
            tr(e, t, n));
      }
      function tr(e, t, n) {
        for (; t < n && e.charCodeAt(t) <= 32; ) t++;
        return t;
      }
      function pn(e) {
        !(function ht(e, t, n, r) {
          const o = j(),
            i = At(2);
          o.firstUpdatePass &&
            (function lh(e, t, n, r) {
              const o = e.data;
              if (null === o[n + 1]) {
                const i = o[Ae()],
                  s = ch(e, n);
                ph(i, r) && null === t && !s && (t = !1),
                  (t = (function aw(e, t, n, r) {
                    const o = (function ps(e) {
                      const t = A.lFrame.currentDirectiveIndex;
                      return -1 === t ? null : e[t];
                    })(e);
                    let i = r ? t.residualClasses : t.residualStyles;
                    if (null === o) 0 === (r ? t.classBindings : t.styleBindings) && ((n = Hr((n = Wa(null, e, t, n, r)), t.attrs, r)), (i = null));
                    else {
                      const s = t.directiveStylingLast;
                      if (-1 === s || e[s] !== o)
                        if (((n = Wa(o, e, t, n, r)), null === i)) {
                          let u = (function uw(e, t, n) {
                            const r = n ? t.classBindings : t.styleBindings;
                            if (0 !== Ft(r)) return e[lt(r)];
                          })(e, t, r);
                          void 0 !== u &&
                            Array.isArray(u) &&
                            ((u = Wa(null, e, t, u[1], r)),
                            (u = Hr(u, t.attrs, r)),
                            (function cw(e, t, n, r) {
                              e[lt(n ? t.classBindings : t.styleBindings)] = r;
                            })(e, t, r, u));
                        } else
                          i = (function lw(e, t, n) {
                            let r;
                            const o = t.directiveEnd;
                            for (let i = 1 + t.directiveStylingLast; i < o; i++) r = Hr(r, e[i].hostAttrs, n);
                            return Hr(r, t.attrs, n);
                          })(e, t, r);
                    }
                    return void 0 !== i && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n;
                  })(o, i, t, r)),
                  (function KC(e, t, n, r, o, i) {
                    let s = i ? t.classBindings : t.styleBindings,
                      a = lt(s),
                      u = Ft(s);
                    e[r] = n;
                    let l,
                      c = !1;
                    if (Array.isArray(n)) {
                      const d = n;
                      (l = d[1]), (null === l || Nn(d, l) > 0) && (c = !0);
                    } else l = n;
                    if (o)
                      if (0 !== u) {
                        const f = lt(e[a + 1]);
                        (e[r + 1] = Jo(f, a)),
                          0 !== f && (e[f + 1] = Da(e[f + 1], r)),
                          (e[a + 1] = (function U_(e, t) {
                            return (131071 & e) | (t << 17);
                          })(e[a + 1], r));
                      } else (e[r + 1] = Jo(a, 0)), 0 !== a && (e[a + 1] = Da(e[a + 1], r)), (a = r);
                    else (e[r + 1] = Jo(u, 0)), 0 === a ? (a = r) : (e[u + 1] = Da(e[u + 1], r)), (u = r);
                    c && (e[r + 1] = ya(e[r + 1])),
                      eh(e, l, r, !0),
                      eh(e, l, r, !1),
                      (function JC(e, t, n, r, o) {
                        const i = o ? e.residualClasses : e.residualStyles;
                        null != i && "string" == typeof t && Nn(i, t) >= 0 && (n[r + 1] = va(n[r + 1]));
                      })(t, l, e, r, i),
                      (s = Jo(a, u)),
                      i ? (t.classBindings = s) : (t.styleBindings = s);
                  })(o, i, t, n, s, r);
              }
            })(o, null, i, r);
          const s = y();
          if (n !== N && be(s, i, n)) {
            const a = o.data[Ae()];
            if (ph(a, r) && !ch(o, i)) {
              let u = r ? a.classesWithoutHost : a.stylesWithoutHost;
              null !== u && (n = Qi(u, n || "")), Ha(o, a, s, n, r);
            } else
              !(function fw(e, t, n, r, o, i, s, a) {
                o === N && (o = U);
                let u = 0,
                  c = 0,
                  l = 0 < o.length ? o[0] : null,
                  d = 0 < i.length ? i[0] : null;
                for (; null !== l || null !== d; ) {
                  const f = u < o.length ? o[u + 1] : void 0,
                    h = c < i.length ? i[c + 1] : void 0;
                  let g,
                    p = null;
                  l === d ? ((u += 2), (c += 2), f !== h && ((p = d), (g = h))) : null === d || (null !== l && l < d) ? ((u += 2), (p = l)) : ((c += 2), (p = d), (g = h)),
                    null !== p && fh(e, t, n, r, p, g, s, a),
                    (l = u < o.length ? o[u] : null),
                    (d = c < i.length ? i[c] : null);
                }
              })(
                o,
                a,
                s,
                s[k],
                s[i + 1],
                (s[i + 1] = (function dw(e, t, n) {
                  if (null == n || "" === n) return U;
                  const r = [],
                    o = (function qt(e) {
                      return e instanceof
                        class kl {
                          constructor(t) {
                            this.changingThisBreaksApplicationSecurity = t;
                          }
                          toString() {
                            return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
                          }
                        }
                        ? e.changingThisBreaksApplicationSecurity
                        : e;
                    })(n);
                  if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(r, o[i], !0);
                  else if ("object" == typeof o) for (const i in o) o.hasOwnProperty(i) && e(r, i, o[i]);
                  else "string" == typeof o && t(r, o);
                  return r;
                })(e, t, n)),
                r,
                i
              );
          }
        })(Ye, bt, e, !0);
      }
      function bt(e, t) {
        for (
          let n = (function tw(e) {
            return (
              (function oh(e) {
                (ye.key = 0), (ye.keyEnd = 0), (ye.value = 0), (ye.valueEnd = 0), (ye.textEnd = e.length);
              })(e),
              nh(e, tr(e, 0, ye.textEnd))
            );
          })(t);
          n >= 0;
          n = nh(t, n)
        )
          Ye(e, th(t), !0);
      }
      function ch(e, t) {
        return t >= e.expandoStartIndex;
      }
      function Wa(e, t, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (-1 === a ? (a = n.directiveStart) : a++; a < s && ((i = t[a]), (r = Hr(r, i.hostAttrs, o)), i !== e); ) a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function Hr(e, t, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const s = t[i];
            "number" == typeof s ? (o = s) : o === r && (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]), Ye(e, s, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function fh(e, t, n, r, o, i, s, a) {
        if (!(3 & t.type)) return;
        const u = e.data,
          c = u[a + 1];
        ci(
          (function Xd(e) {
            return 1 == (1 & e);
          })(c)
            ? hh(u, t, n, o, Ft(c), s)
            : void 0
        ) ||
          (ci(i) ||
            ((function Jd(e) {
              return 2 == (2 & e);
            })(c) &&
              (i = hh(u, null, n, o, a, s))),
          (function f_(e, t, n, r, o) {
            if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
            else {
              let i = -1 === r.indexOf("-") ? void 0 : Le.DashCase;
              null == o ? e.removeStyle(n, r, i) : ("string" == typeof o && o.endsWith("!important") && ((o = o.slice(0, -10)), (i |= Le.Important)), e.setStyle(n, r, o, i));
            }
          })(r, s, bo(Ae(), n), o, i));
      }
      function hh(e, t, n, r, o, i) {
        const s = null === t;
        let a;
        for (; o > 0; ) {
          const u = e[o],
            c = Array.isArray(u),
            l = c ? u[1] : u,
            d = null === l;
          let f = n[o + 1];
          f === N && (f = d ? U : void 0);
          let h = d ? Ts(f, r) : l === r ? f : void 0;
          if ((c && !ci(h) && (h = Ts(u, r)), ci(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? lt(p) : Ft(p);
        }
        if (null !== t) {
          let u = i ? t.residualClasses : t.residualStyles;
          null != u && (a = Ts(u, r));
        }
        return a;
      }
      function ci(e) {
        return void 0 !== e;
      }
      function ph(e, t) {
        return 0 != (e.flags & (t ? 16 : 32));
      }
      function se(e, t = "") {
        const n = y(),
          r = j(),
          o = e + J,
          i = r.firstCreatePass ? Gn(r, o, 1, t, null) : r.data[o],
          s = (n[o] = (function ia(e, t) {
            return e.createText(t);
          })(n[k], t));
        Qo(r, n, s, i), vt(i, !1);
      }
      function Zt(e) {
        return $r("", e, ""), Zt;
      }
      function $r(e, t, n) {
        const r = y(),
          o = (function qn(e, t, n, r) {
            return be(e, bn(), n) ? t + P(n) + r : N;
          })(r, e, t, n);
        return o !== N && Rt(r, Ae(), o), $r;
      }
      function qa(e, t, n, r, o) {
        const i = y(),
          s = Yn(i, e, t, n, r, o);
        return s !== N && Rt(i, Ae(), s), qa;
      }
      const rr = "en-US";
      let Rh = rr;
      class or {}
      class ap extends or {
        constructor(t, n) {
          super(), (this._parent = n), (this._bootstrapComponents = []), (this.destroyCbs = []), (this.componentFactoryResolver = new Ba(this));
          const r = (function $e(e, t) {
            const n = e[kc] || null;
            if (!n && !0 === t) throw new Error(`Type ${Z(e)} does not have '\u0275mod' property.`);
            return n;
          })(t);
          (this._bootstrapComponents = (function Ot(e) {
            return e instanceof Function ? e() : e;
          })(r.bootstrap)),
            (this._r3Injector = Gd(
              t,
              n,
              [
                { provide: or, useValue: this },
                { provide: qo, useValue: this.componentFactoryResolver },
              ],
              Z(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(), this.destroyCbs.forEach((n) => n()), (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class eu extends class OE {} {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new ap(this.moduleType, t);
        }
      }
      function gp(e, t, n, r) {
        return (function mp(e, t, n, r, o, i) {
          const s = t + n;
          return be(e, s, o)
            ? (function wt(e, t, n) {
                return (e[t] = n);
              })(e, s + 1, i ? r.call(i, o) : r(o))
            : (function Yr(e, t) {
                const n = e[t];
                return n === N ? void 0 : n;
              })(e, s + 1);
        })(
          y(),
          (function xe() {
            const e = A.lFrame;
            let t = e.bindingRootIndex;
            return -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
          })(),
          e,
          t,
          n,
          r
        );
      }
      function nu(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const kt = class ub extends cr {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const u = t;
            (o = u.next?.bind(u)), (i = u.error?.bind(u)), (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = nu(i)), o && (o = nu(o)), s && (s = nu(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof yt && t.add(a), a;
        }
      };
      let Lt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = fb), e;
      })();
      const lb = Lt,
        db = class extends lb {
          constructor(t, n, r) {
            super(), (this._declarationLView = t), (this._declarationTContainer = n), (this.elementRef = r);
          }
          createEmbeddedView(t, n) {
            const r = this._declarationTContainer.tViews,
              o = ti(this._declarationLView, r, t, 16, null, r.declTNode, null, null, null, null, n || null);
            o[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return null !== s && (o[19] = s.createEmbeddedView(r)), Sa(r, o, t), new Lr(o);
          }
        };
      function fb() {
        return (function pi(e, t) {
          return 4 & e.type ? new db(t, e, Bn(e, t)) : null;
        })(pe(), y());
      }
      let It = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = hb), e;
      })();
      function hb() {
        return (function Ep(e, t) {
          let n;
          const r = t[e.index];
          if (at(r)) n = r;
          else {
            let o;
            if (8 & e.type) o = le(r);
            else {
              const i = t[k];
              o = i.createComment("");
              const s = et(e, t);
              ln(
                i,
                Yo(i, s),
                o,
                (function c_(e, t) {
                  return e.nextSibling(t);
                })(i, s),
                !1
              );
            }
            (t[e.index] = n = Cf(r, t, o, e)), ri(t, n);
          }
          return new Cp(n, e, t);
        })(pe(), y());
      }
      const pb = It,
        Cp = class extends pb {
          constructor(t, n, r) {
            super(), (this._lContainer = t), (this._hostTNode = n), (this._hostLView = r);
          }
          get element() {
            return Bn(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Tn(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = No(this._hostTNode, this._hostLView);
            if (ul(t)) {
              const n = Mn(t, this._hostLView),
                r = In(t);
              return new Tn(n[1].data[r + 8], n);
            }
            return new Tn(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = wp(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r ? (o = r) : null != r && ((o = r.index), (i = r.injector));
            const s = t.createEmbeddedView(n || {}, i);
            return this.insert(s, o), s;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function br(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index), (r = d.injector), (o = d.projectableNodes), (i = d.environmentInjector || d.ngModuleRef);
            }
            const u = s ? t : new Br(W(t)),
              c = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const f = (s ? c : this.parentInjector).get(kn, null);
              f && (i = f);
            }
            const l = u.create(c, o, void 0, i);
            return this.insert(l.hostView, a), l;
          }
          insert(t, n) {
            const r = t._lView,
              o = r[1];
            if (
              (function My(e) {
                return at(e[3]);
              })(r)
            ) {
              const l = this.indexOf(t);
              if (-1 !== l) this.detach(l);
              else {
                const d = r[3],
                  f = new Cp(d, d[6], d[3]);
                f.detach(f.indexOf(t));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function o_(e, t, n, r) {
              const o = 10 + r,
                i = n.length;
              r > 0 && (n[o - 1][4] = t), r < i - 10 ? ((t[4] = n[o]), vl(n, 10 + r, t)) : (n.push(t), (t[4] = null)), (t[3] = n);
              const s = t[17];
              null !== s &&
                n !== s &&
                (function i_(e, t) {
                  const n = e[9];
                  t[16] !== t[3][3][16] && (e[2] = !0), null === n ? (e[9] = [t]) : n.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(e), (t[2] |= 64);
            })(o, r, s, i);
            const a = la(i, s),
              u = r[k],
              c = Yo(u, s[7]);
            return (
              null !== c &&
                (function t_(e, t, n, r, o, i) {
                  (r[0] = o), (r[6] = t), kr(e, r, n, 1, o, i);
                })(o, s[6], u, r, c, a),
              t.attachToViewContainerRef(),
              vl(ou(s), i, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = wp(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = aa(this._lContainer, n);
            r && (Ro(ou(this._lContainer), n), Cd(r[1], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = aa(this._lContainer, n);
            return r && null != Ro(ou(this._lContainer), n) ? new Lr(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function wp(e) {
        return e[8];
      }
      function ou(e) {
        return e[8] || (e[8] = []);
      }
      function mi(...e) {}
      const qp = new B("Application Initializer");
      let yi = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = mi),
              (this.reject = mi),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if (Ga(i)) n.push(i);
                else if (WC(i)) {
                  const s = new Promise((a, u) => {
                    i.subscribe({ complete: a, error: u });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(G(qp, 8));
          }),
          (e.ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Kr = new B("AppId", {
        providedIn: "root",
        factory: function Yp() {
          return `${pu()}${pu()}${pu()}`;
        },
      });
      function pu() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Qp = new B("Platform Initializer"),
        Zp = new B("Platform ID", { providedIn: "platform", factory: () => "unknown" }),
        qb = new B("appBootstrapListener"),
        Bt = new B("LocaleId", {
          providedIn: "root",
          factory: () =>
            (function vD(e, t = x.Default) {
              return "number" != typeof t && (t = 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4)), G(e, t);
            })(Bt, x.Optional | x.SkipSelf) ||
            (function Yb() {
              return (typeof $localize < "u" && $localize.locale) || rr;
            })(),
        }),
        Xb = (() => Promise.resolve(0))();
      function gu(e) {
        typeof Zone > "u"
          ? Xb.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class Ie {
        constructor({ enableLongStackTrace: t = !1, shouldCoalesceEventChangeDetection: n = !1, shouldCoalesceRunChangeDetection: r = !1 }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new kt(!1)),
            (this.onMicrotaskEmpty = new kt(!1)),
            (this.onStable = new kt(!1)),
            (this.onError = new kt(!1)),
            typeof Zone > "u")
          )
            throw new I(908, !1);
          Zone.assertZonePatched();
          const o = this;
          if (((o._nesting = 0), (o._outer = o._inner = Zone.current), Zone.AsyncStackTaggingZoneSpec)) {
            const i = Zone.AsyncStackTaggingZoneSpec;
            o._inner = o._inner.fork(new i("Angular"));
          }
          Zone.TaskTrackingZoneSpec && (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t && Zone.longStackTraceZoneSpec && (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function eI() {
              let e = K.requestAnimationFrame,
                t = K.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: t };
            })().nativeRequestAnimationFrame),
            (function rI(e) {
              const t = () => {
                !(function nI(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(K, () => {
                      e.fakeTopEventTask ||
                        (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                          "fakeTopEventTask",
                          () => {
                            (e.lastRequestAnimationFrameId = -1), yu(e), (e.isCheckStableRunning = !0), mu(e), (e.isCheckStableRunning = !1);
                          },
                          void 0,
                          () => {},
                          () => {}
                        )),
                        e.fakeTopEventTask.invoke();
                    })),
                    yu(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return Xp(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection && "eventTask" === i.type) || e.shouldCoalesceRunChangeDetection) && t(), eg(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, u) => {
                  try {
                    return Xp(e), n.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), eg(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i), r === o && ("microTask" == i.change ? ((e._hasPendingMicrotasks = i.microTask), yu(e), mu(e)) : "macroTask" == i.change && (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (n.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!Ie.isInAngularZone()) throw new I(909, !1);
        }
        static assertNotInAngularZone() {
          if (Ie.isInAngularZone()) throw new I(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, tI, mi, mi);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const tI = {};
      function mu(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function yu(e) {
        e.hasPendingMicrotasks = !!(e._hasPendingMicrotasks || ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && -1 !== e.lastRequestAnimationFrameId));
      }
      function Xp(e) {
        e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function eg(e) {
        e._nesting--, mu(e);
      }
      class oI {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new kt()),
            (this.onMicrotaskEmpty = new kt()),
            (this.onStable = new kt()),
            (this.onError = new kt());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const tg = new B(""),
        Di = new B("");
      let _u,
        Du = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                _u ||
                  ((function iI(e) {
                    _u = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone = typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      Ie.assertNotInAngularZone(),
                        gu(() => {
                          (this._isZoneStable = !0), this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (this._pendingCount += 1), (this._didWork = !0), this._pendingCount;
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0)) throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks;
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                gu(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter((r) => !r.updateCb || !r.updateCb(n) || (clearTimeout(r.timeoutId), !1))), (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone ? this.taskTrackingZone.macroTasks.map((n) => ({ source: n.source, creationLocation: n.creationLocation, data: n.data })) : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter((s) => s.timeoutId !== i)), n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone) throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?');
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(G(Ie), G(vu), G(Di));
            }),
            (e.ɵprov = q({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        vu = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return _u?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "platform" })),
            e
          );
        })(),
        Kt = null;
      const ng = new B("AllowMultipleToken"),
        Cu = new B("PlatformDestroyListeners");
      function og(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new B(r);
        return (i = []) => {
          let s = wu();
          if (!s || s.injector.get(ng, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function uI(e) {
                  if (Kt && !Kt.get(ng, !1)) throw new I(400, !1);
                  Kt = e;
                  const t = e.get(sg);
                  (function rg(e) {
                    const t = e.get(Qp, null);
                    t && t.forEach((n) => n());
                  })(e);
                })(
                  (function ig(e = [], t) {
                    return dn.create({ name: t, providers: [{ provide: Hs, useValue: "platform" }, { provide: Cu, useValue: new Set([() => (Kt = null)]) }, ...e] });
                  })(a, r)
                );
          }
          return (function lI(e) {
            const t = wu();
            if (!t) throw new I(401, !1);
            return t;
          })();
        };
      }
      function wu() {
        return Kt?.get(sg) ?? null;
      }
      let sg = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this._modules = []), (this._destroyListeners = []), (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function ug(e, t) {
                let n;
                return (n = "noop" === e ? new oI() : ("zone.js" === e ? void 0 : e) || new Ie(t)), n;
              })(
                r?.ngZone,
                (function ag(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection: !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection: !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              i = [{ provide: Ie, useValue: o }];
            return o.run(() => {
              const s = dn.create({ providers: i, parent: this.injector, name: n.moduleType.name }),
                a = n.create(s),
                u = a.injector.get(jn, null);
              if (!u) throw new I(402, !1);
              return (
                o.runOutsideAngular(() => {
                  const c = o.onError.subscribe({
                    next: (l) => {
                      u.handleError(l);
                    },
                  });
                  a.onDestroy(() => {
                    vi(this._modules, a), c.unsubscribe();
                  });
                }),
                (function cg(e, t, n) {
                  try {
                    const r = n();
                    return Ga(r)
                      ? r.catch((o) => {
                          throw (t.runOutsideAngular(() => e.handleError(o)), o);
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(u, o, () => {
                  const c = a.injector.get(yi);
                  return (
                    c.runInitializers(),
                    c.donePromise.then(
                      () => (
                        (function kh(e) {
                          He(e, "Expected localeId to be defined"), "string" == typeof e && (Rh = e.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(Bt, rr) || rr),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = lg({}, r);
            return (function sI(e, t, n) {
              const r = new eu(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(Eu);
            if (n._bootstrapComponents.length > 0) n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new I(403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new I(404, !1);
            this._modules.slice().forEach((r) => r.destroy()), this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Cu, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(G(dn));
          }),
          (e.ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function lg(e, t) {
        return Array.isArray(t) ? t.reduce(lg, e) : { ...e, ...t };
      }
      let Eu = (() => {
        class e {
          constructor(n, r, o) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
                next: () => {
                  this._zone.run(() => {
                    this.tick();
                  });
                },
              }));
            const i = new Fe((a) => {
                (this._stable = this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new Fe((a) => {
                let u;
                this._zone.runOutsideAngular(() => {
                  u = this._zone.onStable.subscribe(() => {
                    Ie.assertNotInAngularZone(),
                      gu(() => {
                        !this._stable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks && ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const c = this._zone.onUnstable.subscribe(() => {
                  Ie.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  u.unsubscribe(), c.unsubscribe();
                };
              });
            this.isStable = Qm(
              i,
              s.pipe(
                (function Zm(e = {}) {
                  const { connector: t = () => new cr(), resetOnError: n = !0, resetOnComplete: r = !0, resetOnRefCountZero: o = !0 } = e;
                  return (i) => {
                    let s,
                      a,
                      u,
                      c = 0,
                      l = !1,
                      d = !1;
                    const f = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      h = () => {
                        f(), (s = u = void 0), (l = d = !1);
                      },
                      p = () => {
                        const g = s;
                        h(), g?.unsubscribe();
                      };
                    return lr((g, D) => {
                      c++, !d && !l && f();
                      const v = (u = u ?? t());
                      D.add(() => {
                        c--, 0 === c && !d && !l && (a = qi(p, o));
                      }),
                        v.subscribe(D),
                        !s &&
                          c > 0 &&
                          ((s = new ur({
                            next: (w) => v.next(w),
                            error: (w) => {
                              (d = !0), f(), (a = qi(h, n, w)), v.error(w);
                            },
                            complete: () => {
                              (l = !0), f(), (a = qi(h, r)), v.complete();
                            },
                          })),
                          nn(g).subscribe(s));
                    })(i);
                  };
                })()
              )
            );
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const o = n instanceof td;
            if (!this._injector.get(yi).done)
              throw (
                (!o &&
                  (function hr(e) {
                    const t = W(e) || Te(e) || Se(e);
                    return null !== t && t.standalone;
                  })(n),
                new I(405, false))
              );
            let s;
            (s = o ? n : this._injector.get(qo).resolveComponentFactory(n)), this.componentTypes.push(s.componentType);
            const a = (function aI(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(or),
              c = s.create(dn.NULL, [], r || s.selector, a),
              l = c.location.nativeElement,
              d = c.injector.get(tg, null);
            return (
              d?.registerApplication(l),
              c.onDestroy(() => {
                this.detachView(c.hostView), vi(this.components, c), d?.unregisterApplication(l);
              }),
              this._loadComponent(c),
              c
            );
          }
          tick() {
            if (this._runningTick) throw new I(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(n));
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            vi(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView),
              this.tick(),
              this.components.push(n),
              this._injector
                .get(qb, [])
                .concat(this._bootstrapListeners)
                .forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()), this._views.slice().forEach((n) => n.destroy()), this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0), (this._views = []), (this._bootstrapListeners = []), (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return this._destroyListeners.push(n), () => vi(this._destroyListeners, n);
          }
          destroy() {
            if (this._destroyed) throw new I(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(G(Ie), G(kn), G(jn));
          }),
          (e.ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function vi(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      let fg = !0;
      class yg {
        constructor() {}
        supports(t) {
          return Vr(t);
        }
        create(t) {
          return new CI(t);
        }
      }
      const _I = (e, t) => t;
      class CI {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || _I);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < vg(r, o, i)) ? n : r,
              a = vg(s, o, i),
              u = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const c = a - o,
                l = u - o;
              if (c != l) {
                for (let f = 0; f < c; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  l <= p && p < c && (i[f] = h + 1);
                }
                i[s.previousIndex] = l - c;
              }
            }
            a !== u && t(s, a, u);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (n = this._identityChangesHead; null !== n; n = n._nextIdentityChange) t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !Vr(t))) throw new I(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (i = t[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)), Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function BC(e, t) {
                if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[fn()]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)), Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return null !== this._additionsHead || null !== this._movesHead || null !== this._removalsHead || null !== this._identityChangesHead;
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (t = this._previousItHead = this._itHead; null !== t; t = t._next) t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded) t.previousIndex = t.currentIndex;
            for (this._additionsHead = this._additionsTail = null, t = this._movesHead; null !== t; t = t._nextMoved) t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null), (this._removalsHead = this._removalsTail = null), (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, o) {
          let i;
          return (
            null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
            null !== (t = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, o))
              : null !== (t = null === this._linkedRecords ? null : this._linkedRecords.get(r, o))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, o))
              : (t = this._addAfter(new wI(n, r), i, o)),
            t
          );
        }
        _verifyReinsertion(t, n, r, o) {
          let i = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null);
          return null !== i ? (t = this._reinsertAfter(i, t._prev, o)) : t.currentIndex != o && ((t.currentIndex = o), this._addToMoves(t, o)), t;
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail && (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail && (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const o = t._prevRemoved,
            i = t._nextRemoved;
          return null === o ? (this._removalsHead = i) : (o._nextRemoved = i), null === i ? (this._removalsTail = o) : (i._prevRemoved = o), this._insertAfter(t, n, r), this._addToMoves(t, r), t;
        }
        _moveAfter(t, n, r) {
          return this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t;
        }
        _addAfter(t, n, r) {
          return this._insertAfter(t, n, r), (this._additionsTail = null === this._additionsTail ? (this._additionsHead = t) : (this._additionsTail._nextAdded = t)), t;
        }
        _insertAfter(t, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (t._next = o),
            (t._prev = n),
            null === o ? (this._itTail = t) : (o._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new Dg()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return null === n ? (this._itHead = r) : (n._next = r), null === r ? (this._itTail = n) : (r._prev = n), t;
        }
        _addToMoves(t, n) {
          return t.previousIndex === n || (this._movesTail = null === this._movesTail ? (this._movesHead = t) : (this._movesTail._nextMoved = t)), t;
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords && (this._unlinkedRecords = new Dg()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t), (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail), (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (t.item = n), (this._identityChangesTail = null === this._identityChangesTail ? (this._identityChangesHead = t) : (this._identityChangesTail._nextIdentityChange = t)), t;
        }
      }
      class wI {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class EI {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t), (t._nextDup = null), (t._prevDup = null))
            : ((this._tail._nextDup = t), (t._prevDup = this._tail), (t._nextDup = null), (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup) if ((null === n || n <= r.currentIndex) && Object.is(r.trackById, t)) return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return null === n ? (this._head = r) : (n._nextDup = r), null === r ? (this._tail = n) : (r._prevDup = n), null === this._head;
        }
      }
      class Dg {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new EI()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const o = this.map.get(t);
          return o ? o.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function vg(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      class _g {
        constructor() {}
        supports(t) {
          return t instanceof Map || ja(t);
        }
        create() {
          return new bI();
        }
      }
      class bI {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return null !== this._additionsHead || null !== this._changesHead || null !== this._removalsHead;
        }
        forEachItem(t) {
          let n;
          for (n = this._mapHead; null !== n; n = n._next) t(n);
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousMapHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachChangedItem(t) {
          let n;
          for (n = this._changesHead; null !== n; n = n._nextChanged) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        diff(t) {
          if (t) {
            if (!(t instanceof Map || ja(t))) throw new I(900, !1);
          } else t = new Map();
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let n = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(t, (r, o) => {
              if (n && n.key === o) this._maybeAddToChanges(n, r), (this._appendAfter = n), (n = n._next);
              else {
                const i = this._getOrCreateRecordForKey(o, r);
                n = this._insertBeforeOrAppend(n, i);
              }
            }),
            n)
          ) {
            n._prev && (n._prev._next = null), (this._removalsHead = n);
            for (let r = n; null !== r; r = r._nextRemoved)
              r === this._mapHead && (this._mapHead = null),
                this._records.delete(r.key),
                (r._nextRemoved = r._next),
                (r.previousValue = r.currentValue),
                (r.currentValue = null),
                (r._prev = null),
                (r._next = null);
          }
          return this._changesTail && (this._changesTail._nextChanged = null), this._additionsTail && (this._additionsTail._nextAdded = null), this.isDirty;
        }
        _insertBeforeOrAppend(t, n) {
          if (t) {
            const r = t._prev;
            return (n._next = t), (n._prev = r), (t._prev = n), r && (r._next = n), t === this._mapHead && (this._mapHead = n), (this._appendAfter = t), t;
          }
          return this._appendAfter ? ((this._appendAfter._next = n), (n._prev = this._appendAfter)) : (this._mapHead = n), (this._appendAfter = n), null;
        }
        _getOrCreateRecordForKey(t, n) {
          if (this._records.has(t)) {
            const o = this._records.get(t);
            this._maybeAddToChanges(o, n);
            const i = o._prev,
              s = o._next;
            return i && (i._next = s), s && (s._prev = i), (o._next = null), (o._prev = null), o;
          }
          const r = new II(t);
          return this._records.set(t, r), (r.currentValue = n), this._addToAdditions(r), r;
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (this._previousMapHead = this._mapHead, t = this._previousMapHead; null !== t; t = t._next) t._nextPrevious = t._next;
            for (t = this._changesHead; null !== t; t = t._nextChanged) t.previousValue = t.currentValue;
            for (t = this._additionsHead; null != t; t = t._nextAdded) t.previousValue = t.currentValue;
            (this._changesHead = this._changesTail = null), (this._additionsHead = this._additionsTail = null), (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(t, n) {
          Object.is(n, t.currentValue) || ((t.previousValue = t.currentValue), (t.currentValue = n), this._addToChanges(t));
        }
        _addToAdditions(t) {
          null === this._additionsHead ? (this._additionsHead = this._additionsTail = t) : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
        }
        _addToChanges(t) {
          null === this._changesHead ? (this._changesHead = this._changesTail = t) : ((this._changesTail._nextChanged = t), (this._changesTail = t));
        }
        _forEach(t, n) {
          t instanceof Map ? t.forEach(n) : Object.keys(t).forEach((r) => n(t[r], r));
        }
      }
      class II {
        constructor(t) {
          (this.key = t),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function Cg() {
        return new wi([new yg()]);
      }
      let wi = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return { provide: e, useFactory: (r) => e.create(n, r || Cg()), deps: [[e, new Vo(), new Bo()]] };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new I(901, !1);
          }
        }
        return (e.ɵprov = q({ token: e, providedIn: "root", factory: Cg })), e;
      })();
      function wg() {
        return new Jr([new _g()]);
      }
      let Jr = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return { provide: e, useFactory: (r) => e.create(n, r || wg()), deps: [[e, new Vo(), new Bo()]] };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (r) return r;
            throw new I(901, !1);
          }
        }
        return (e.ɵprov = q({ token: e, providedIn: "root", factory: wg })), e;
      })();
      const SI = og(null, "core", []);
      let xI = (() => {
          class e {
            constructor(n) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(G(Eu));
            }),
            (e.ɵmod = fr({ type: e })),
            (e.ɵinj = Dn({})),
            e
          );
        })(),
        Ei = null;
      function Xr() {
        return Ei;
      }
      const jt = new B("DocumentToken");
      class _M {
        constructor(t, n, r, o) {
          (this.$implicit = t), (this.ngForOf = n), (this.index = r), (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let no = (() => {
        class e {
          constructor(n, r, o) {
            (this._viewContainer = n), (this._template = r), (this._differs = o), (this._ngForOf = null), (this._ngForOfDirty = !0), (this._differ = null);
          }
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ && n && (this._differ = this._differs.find(n).create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex) r.createEmbeddedView(this._template, new _M(o.item, this._ngForOf, -1, -1), null === s ? void 0 : s);
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), Fg(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              Fg(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(It), S(Lt), S(wi));
          }),
          (e.ɵdir = Ke({ type: e, selectors: [["", "ngFor", "", "ngForOf", ""]], inputs: { ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate" }, standalone: !0 })),
          e
        );
      })();
      function Fg(e, t) {
        e.context.$implicit = t.item;
      }
      let Oi = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new wM()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n), this._updateView();
          }
          set ngIfThen(n) {
            Rg("ngIfThen", n), (this._thenTemplateRef = n), (this._thenViewRef = null), this._updateView();
          }
          set ngIfElse(n) {
            Rg("ngIfElse", n), (this._elseTemplateRef = n), (this._elseViewRef = null), this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(), (this._elseViewRef = null), this._thenTemplateRef && (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context)))
              : this._elseViewRef ||
                (this._viewContainer.clear(), (this._thenViewRef = null), this._elseTemplateRef && (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(It), S(Lt));
          }),
          (e.ɵdir = Ke({ type: e, selectors: [["", "ngIf", ""]], inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" }, standalone: !0 })),
          e
        );
      })();
      class wM {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function Rg(e, t) {
        if (t && !t.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${Z(t)}'.`);
      }
      let Lg = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngEl = n), (this._differs = r), (this._renderer = o), (this._ngStyle = null), (this._differ = null);
            }
            set ngStyle(n) {
              (this._ngStyle = n), !this._differ && n && (this._differ = this._differs.find(n).create());
            }
            ngDoCheck() {
              if (this._differ) {
                const n = this._differ.diff(this._ngStyle);
                n && this._applyChanges(n);
              }
            }
            _setStyle(n, r) {
              const [o, i] = n.split("."),
                s = -1 === o.indexOf("-") ? void 0 : Le.DashCase;
              null != r ? this._renderer.setStyle(this._ngEl.nativeElement, o, i ? `${r}${i}` : r, s) : this._renderer.removeStyle(this._ngEl.nativeElement, o, s);
            }
            _applyChanges(n) {
              n.forEachRemovedItem((r) => this._setStyle(r.key, null)),
                n.forEachAddedItem((r) => this._setStyle(r.key, r.currentValue)),
                n.forEachChangedItem((r) => this._setStyle(r.key, r.currentValue));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Vn), S(Jr), S(od));
            }),
            (e.ɵdir = Ke({ type: e, selectors: [["", "ngStyle", ""]], inputs: { ngStyle: "ngStyle" }, standalone: !0 })),
            e
          );
        })(),
        YM = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = fr({ type: e })),
            (e.ɵinj = Dn({})),
            e
          );
        })();
      class Uu extends class D0 extends class NI {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function PI(e) {
            Ei || (Ei = e);
          })(new Uu());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n ? window : "document" === n ? t : "body" === n ? t.body : null;
        }
        getBaseHref(t) {
          const n = (function v0() {
            return (oo = oo || document.querySelector("base")), oo ? oo.getAttribute("href") : null;
          })();
          return null == n
            ? null
            : (function _0(e) {
                (Ri = Ri || document.createElement("a")), Ri.setAttribute("href", e);
                const t = Ri.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          oo = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function yM(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
              const r = n.indexOf("="),
                [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
              if (o.trim() === t) return decodeURIComponent(i);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let Ri,
        oo = null;
      const Gg = new B("TRANSITION_ID"),
        w0 = [
          {
            provide: qp,
            useFactory: function C0(e, t, n) {
              return () => {
                n.get(yi).donePromise.then(() => {
                  const r = Xr(),
                    o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [Gg, jt, dn],
            multi: !0,
          },
        ];
      let b0 = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = q({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const ki = new B("EventManagerPlugins");
      let Li = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r), (this._eventNameToPlugin = new Map()), n.forEach((o) => (o.manager = this)), (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(G(ki), G(Ie));
          }),
          (e.ɵprov = q({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class zg {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const o = Xr().getGlobalEventTarget(this._doc, t);
          if (!o) throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let Wg = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((o) => {
                this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = q({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        io = (() => {
          class e extends Wg {
            constructor(n) {
              super(), (this._doc = n), (this._hostNodes = new Map()), this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, o) {
              n.forEach((i) => {
                const s = this._doc.createElement("style");
                (s.textContent = i), o.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r), this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(qg), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, o) => {
                this._addStylesToHost(n, o, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(qg));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(G(jt));
            }),
            (e.ɵprov = q({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function qg(e) {
        Xr().remove(e);
      }
      const Gu = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        zu = /%COMP%/g;
      function Bi(e, t, n) {
        for (let r = 0; r < t.length; r++) {
          let o = t[r];
          Array.isArray(o) ? Bi(e, o, n) : ((o = o.replace(zu, e)), n.push(o));
        }
        return n;
      }
      function Zg(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let Wu = (() => {
        class e {
          constructor(n, r, o) {
            (this.eventManager = n), (this.sharedStylesHost = r), (this.appId = o), (this.rendererByCompId = new Map()), (this.defaultRenderer = new qu(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case Dt.Emulated: {
                let o = this.rendererByCompId.get(r.id);
                return o || ((o = new A0(this.eventManager, this.sharedStylesHost, r, this.appId)), this.rendererByCompId.set(r.id, o)), o.applyToHost(n), o;
              }
              case 1:
              case Dt.ShadowDom:
                return new P0(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const o = Bi(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(o), this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(G(Li), G(io), G(Kr));
          }),
          (e.ɵprov = q({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class qu {
        constructor(t) {
          (this.eventManager = t), (this.data = Object.create(null)), (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n ? document.createElementNS(Gu[n] || n, t) : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          (Jg(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (Jg(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r) throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = Gu[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = Gu[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (Le.DashCase | Le.Important) ? t.style.setProperty(n, r, o & Le.Important ? "important" : "") : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & Le.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t ? this.eventManager.addGlobalEventListener(t, n, Zg(r)) : this.eventManager.addEventListener(t, n, Zg(r));
        }
      }
      function Jg(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class A0 extends qu {
        constructor(t, n, r, o) {
          super(t), (this.component = r);
          const i = Bi(o + "-" + r.id, r.styles, []);
          n.addStyles(i),
            (this.contentAttr = (function T0(e) {
              return "_ngcontent-%COMP%".replace(zu, e);
            })(o + "-" + r.id)),
            (this.hostAttr = (function S0(e) {
              return "_nghost-%COMP%".replace(zu, e);
            })(o + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class P0 extends qu {
        constructor(t, n, r, o) {
          super(t), (this.sharedStylesHost = n), (this.hostEl = r), (this.shadowRoot = r.attachShadow({ mode: "open" })), this.sharedStylesHost.addHost(this.shadowRoot);
          const i = Bi(o.id, o.styles, []);
          for (let s = 0; s < i.length; s++) {
            const a = document.createElement("style");
            (a.textContent = i[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
        }
      }
      let N0 = (() => {
        class e extends zg {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o);
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(G(jt));
          }),
          (e.ɵprov = q({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Xg = ["alt", "control", "meta", "shift"],
        O0 = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        F0 = { alt: (e) => e.altKey, control: (e) => e.ctrlKey, meta: (e) => e.metaKey, shift: (e) => e.shiftKey };
      let R0 = (() => {
        class e extends zg {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager.getZone().runOutsideAngular(() => Xr().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o)) return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              Xg.forEach((c) => {
                const l = r.indexOf(c);
                l > -1 && (r.splice(l, 1), (s += c + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(n, r) {
            let o = O0[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                Xg.forEach((s) => {
                  s !== o && (0, F0[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(G(jt));
          }),
          (e.ɵprov = q({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const V0 = og(SI, "browser", [
          { provide: Zp, useValue: "browser" },
          {
            provide: Qp,
            useValue: function k0() {
              Uu.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: jt,
            useFactory: function B0() {
              return (
                (function ND(e) {
                  Ns = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        nm = new B(""),
        rm = [
          {
            provide: Di,
            useClass: class E0 {
              addToWindow(t) {
                (K.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i) throw new Error("Could not find testability for element.");
                  return i;
                }),
                  (K.getAllAngularTestabilities = () => t.getAllTestabilities()),
                  (K.getAllAngularRootElements = () => t.getAllRootElements()),
                  K.frameworkStabilizers || (K.frameworkStabilizers = []),
                  K.frameworkStabilizers.push((r) => {
                    const o = K.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach(function (u) {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n ? null : t.getTestability(n) ?? (r ? (Xr().isShadowRoot(n) ? this.findTestabilityInTree(t, n.host, !0) : this.findTestabilityInTree(t, n.parentElement, !0)) : null);
              }
            },
            deps: [],
          },
          { provide: tg, useClass: Du, deps: [Ie, vu, Di] },
          { provide: Du, useClass: Du, deps: [Ie, vu, Di] },
        ],
        om = [
          { provide: Hs, useValue: "root" },
          {
            provide: jn,
            useFactory: function L0() {
              return new jn();
            },
            deps: [],
          },
          { provide: ki, useClass: N0, multi: !0, deps: [jt, Ie, Zp] },
          { provide: ki, useClass: R0, multi: !0, deps: [jt] },
          { provide: Wu, useClass: Wu, deps: [Li, io, Kr] },
          { provide: rd, useExisting: Wu },
          { provide: Wg, useExisting: io },
          { provide: io, useClass: io, deps: [jt] },
          { provide: Li, useClass: Li, deps: [ki, Ie] },
          { provide: class XM {}, useClass: b0, deps: [] },
          [],
        ];
      let j0 = (() => {
        class e {
          constructor(n) {}
          static withServerTransition(n) {
            return { ngModule: e, providers: [{ provide: Kr, useValue: n.appId }, { provide: Gg, useExisting: Kr }, w0] };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(G(nm, 12));
          }),
          (e.ɵmod = fr({ type: e })),
          (e.ɵinj = Dn({ providers: [...om, ...rm], imports: [YM, xI] })),
          e
        );
      })();
      typeof window < "u" && window;
      let Vi = (() => {
          class e {
            constructor() {
              (this.count = 0),
                (this.MIN_BOX_HEIGHT = 20),
                (this.HEIGHT_INCREMENT = 20),
                (this.HEIGHT_IN_HOURS = 0.25),
                (this.convertBoxHeightToHours = (n) => {
                  let r = n * this.HEIGHT_IN_HOURS,
                    o = Math.floor(r);
                  return r % 1 == 0 ? `${o}:00` : r % 1 == 0.25 ? `${o}:15` : r % 1 == 0.5 ? `${o}:30` : r % 1 == 0.75 ? `${o}:45` : "ERROR";
                }),
                (this.handleActivityGhostElement = (n, r) => {
                  (r.style.top = n.clientY - this.MIN_BOX_HEIGHT / 2 + "px"), (r.style.left = `${n.clientX + 5}px`);
                }),
                (this.handleGhostElement = (n, r) => {
                  (r.style.top = n.clientY - this.MIN_BOX_HEIGHT / 2 + "px"), (r.style.left = n.clientX - 100 + "px"), (r.style.height = `${this.MIN_BOX_HEIGHT}px`);
                }),
                (this.insertable = !1),
                (this.handleInsertionElement = (n, r) => {
                  let o = n.clientY,
                    i = n.clientX,
                    a = document.getElementsByClassName("day")[0].getBoundingClientRect();
                  if (i > a.left - 10 && i < a.right + 10) {
                    let l = Array.from(document.getElementsByClassName("box"));
                    l = l.filter((d) => "box-ghost" !== d.id);
                    for (let d of l) {
                      let f = d.getBoundingClientRect(),
                        p = o >= f.bottom - 10 && o <= f.bottom;
                      if ((o >= f.top && o <= f.top + 10) || p) return (r.style.opacity = "0.95"), (r.style.boxShadow = "0px 0px 10px 5px rgba(0,0,0,0.4)"), void (this.insertable = !0);
                    }
                  }
                  (r.style.boxShadow = "none"), (r.style.opacity = "0.5"), (this.insertable = !1);
                }),
                (this.boxes = [
                  { title: "meditate", height: 1, group: "green" },
                  { title: "read", height: 2, group: "blue" },
                  { title: "breakfast", height: 1 },
                  { title: "work", height: 4, group: "gray" },
                  { title: "rest", height: 1 },
                  { title: "workout", height: 2, group: "green" },
                  { title: "rest", height: 2 },
                  { title: "game", height: 3, group: "blueviolet" },
                  { title: "piano", height: 2, group: "yellow" },
                  { title: "study", height: 5, group: "blue" },
                  { title: "rest", height: 1 },
                ]),
                (this.dragBoxElementIndex = -1),
                (this.getHeightOfAllBoxes = () => {
                  let n = 0;
                  return (
                    this.boxes.forEach((r) => {
                      n += r.height;
                    }),
                    n
                  );
                }),
                (this.boxCanBeAdded = () => this.getHeightOfAllBoxes() < 16 / this.HEIGHT_IN_HOURS),
                (this.applyDrag = (n, r) => {
                  let o = n.clientY,
                    i = Array.from(document.getElementsByClassName("box"));
                  i = i.filter((u) => "box-ghost" !== u.id);
                  let s = this.dragBoxElement.height;
                  this.dragBoxElement.height = 0;
                  let a = 0;
                  if (this.insertable) {
                    if (!this.boxCanBeAdded()) return;
                    o >= i[i.length - 1].getBoundingClientRect().top && (a = i.length);
                    for (let l of i)
                      if (o <= l.getBoundingClientRect().bottom - 10) {
                        a = parseInt(l.id.split("-")[1]) - 1;
                        break;
                      }
                    this.insertable = !1;
                  } else if ("box-ghost" == r.id) a = this.dragBoxElementIndex;
                  else if ("activity-box-ghost" == r.id) return;
                  this.boxes.splice(a, 0, this.dragBoxElement),
                    setTimeout(() => {
                      this.boxes[a].height = s;
                    }, 1),
                    "box-ghost" === r.id && r.remove(),
                    "activity-box-ghost" === r.id && ((r.style.boxShadow = "none"), (r.style.opacity = "0.5"));
                }),
                (this.addToBoxes = (n) => {
                  if (this.boxCanBeAdded()) {
                    let r = n.height;
                    (n.height = 0),
                      this.boxes.push(n),
                      setTimeout(() => {
                        this.boxes[this.boxes.length - 1].height = r;
                      }, 1);
                  }
                }),
                (this.setGlobalCursor = (n) => {
                  const r = document.createElement("style");
                  (r.innerHTML = `*{cursor: ${n}!important;}`), (r.id = `global-cursor-style-${n}`), document.head.appendChild(r);
                }),
                (this.removeGlobalCursor = (n) => {
                  document.getElementById(`global-cursor-style-${n}`).remove();
                }),
                (this.getHeightOfPreviousBoxes = (n) => {
                  let r = 0;
                  for (let o = 0; o < n; o++) r += this.boxes[o].height;
                  return r;
                }),
                (this.getStartEndOfBox = (n) => {
                  let o = 7 / this.HEIGHT_IN_HOURS,
                    s = this.boxes[n].height,
                    a = this.getHeightOfPreviousBoxes(n),
                    c = o + a + s,
                    l = this.convertBoxHeightToHours(o + a),
                    d = this.convertBoxHeightToHours(c);
                  return console.log(l, d), l + "-" + d;
                });
            }
            callService() {
              this.count++;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        am = (() => {
          class e {
            constructor() {
              (this.mouseIsPressedDown = !1),
                (this.indicateMouseUp = () => {
                  this.mouseIsPressedDown = !1;
                }),
                (this.indicateMouseDown = () => {
                  this.mouseIsPressedDown = !0;
                }),
                (this.userIntendsToDrag = () =>
                  new Promise((n, r) => {
                    let o = !1;
                    setTimeout(() => {
                      this.mouseIsPressedDown && (o = !0), n(o);
                    }, 150);
                  })),
                document.addEventListener("mouseup", this.indicateMouseUp),
                document.addEventListener("mousedown", this.indicateMouseDown);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        um = (() => {
          class e {
            constructor(n) {
              (this.dayService = n),
                (this.TODO_LIST_ALL = [
                  { activity: "read", title: "Write a review on Goodreads", ticked: !0 },
                  { activity: "read", title: "Do some research on the author", ticked: !1 },
                  { activity: "work", title: "Ask the team for a review", ticked: !0 },
                ]),
                (this.GOALS_LIST_ALL = [
                  { activity: "read", title: "Read 10 pages", ticked: !1 },
                  { activity: "meditate", title: "Meditate for 10 minutes", ticked: !1 },
                ]),
                (this.TODO_LIST = []),
                (this.GOALS_LIST = []),
                (this.activeBoxIndex = 0),
                (this.startEndTime = ""),
                (this.activeBoxChange = new cr()),
                (this.getStartEndTimeForActiveBox = () => {
                  this.startEndTime = this.dayService.getStartEndOfBox(this.activeBoxIndex);
                }),
                (this.changeActiveBox = (r) => {
                  (this.activeBoxIndex = r),
                    (this.activeBox = this.dayService.boxes[this.activeBoxIndex]),
                    this.getTodosForCurrentActivity(),
                    this.getStartEndTimeForActiveBox(),
                    this.activeBoxChange.next(this.startEndTime);
                }),
                (this.clearActiveBox = () => {
                  (this.activeBoxIndex = 0), (this.activeBox = {}), this.getTodosForCurrentActivity(), (this.startEndTime = ""), this.activeBoxChange.next(this.startEndTime);
                }),
                (this.getTodosForCurrentActivity = () => {
                  (this.TODO_LIST = this.TODO_LIST_ALL.filter((r) => this.activeBox.title === r.activity)), (this.GOALS_LIST = this.GOALS_LIST_ALL.filter((r) => this.activeBox.title === r.activity));
                });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(G(Vi));
            }),
            (e.ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      function Z0(e, t) {
        if ((1 & e && (O(0, "div", 8), se(1), L()), 2 & e)) {
          const n = t.$implicit;
          Y(1), Zt(n + ":00");
        }
      }
      const K0 = function (e) {
        return { height: e };
      };
      function J0(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 9),
            _e("mousemove", function (o) {
              return ze(n), We(ue().handleMouseMove(o));
            })("mousedown", function (o) {
              return ze(n), We(ue().dragBox(o));
            }),
            O(1, "div", 10),
            se(2),
            L(),
            O(3, "div", 11),
            se(4),
            L(),
            O(5, "div", 12),
            _e("mousedown", function (o) {
              return ze(n), We(ue().startBoxResize(o));
            }),
            L()();
        }
        if (2 & e) {
          const n = t.$implicit,
            r = t.index,
            o = ue();
          pn(o.getBoxClassName(r)), me("ngStyle", gp(6, K0, n.height * o.HEIGHT_INCREMENT + "px"))("id", "box-" + (r + 1)), Y(2), Zt(n.title), Y(2), $r(" ", o.getBoxDuration(n.height), " ");
        }
      }
      let X0 = (() => {
          class e {
            constructor(n, r, o) {
              (this.dayService = n),
                (this.mouseService = r),
                (this.todoService = o),
                (this.mousePosition = "y: ?px"),
                (this.boxes = []),
                (this.currentBoxIndex = -1),
                (this.contextMenuBoxElementIndex = -1),
                (this.TIME_SPENT_AWAKE = 16),
                (this.USER_DAY_START = 7),
                (this.USER_DAY_END = 23),
                (this.USER_DAY_TICKS = []),
                (this.isResizing = !1),
                (this.getBoxClassName = (s) => {
                  let a = "box",
                    u = this.boxes[s].group;
                  return (a += u ? ` ${u}` : " black"), a;
                }),
                (this.getHeightOfOtherBoxes = () => {
                  let s = 0;
                  return (
                    this.boxes.forEach((a, u) => {
                      u !== this.currentBoxIndex && (s += a.height);
                    }),
                    s
                  );
                }),
                (this.getMousePosition = (s) => {
                  this.mousePosition = `y: ${s.clientY}px`;
                }),
                (this.onMouseMove = (s) => {
                  let f,
                    u = document.getElementsByClassName("box")[this.currentBoxIndex].getBoundingClientRect(),
                    l = Math.floor((s.clientY - u.top) / this.HEIGHT_INCREMENT),
                    d = this.getHeightOfOtherBoxes();
                  (f = l < 1 ? 1 : l + d > this.DAY_LENGTH ? this.DAY_LENGTH - d : l), console.log(f), (this.boxes[this.currentBoxIndex].height = f);
                }),
                (this.onMouseUp = (s) => {
                  (this.isResizing = !1),
                    this.dayService.removeGlobalCursor("ns-resize"),
                    document.removeEventListener("mousemove", this.onMouseMove),
                    document.removeEventListener("mouseup", this.onMouseUp);
                }),
                (this.setCurrentBoxIndex = (s) => {
                  let u = s.parentElement.id.split("-")[1];
                  this.currentBoxIndex = parseInt(u) - 1;
                }),
                (this.startBoxResize = (s) => {
                  s.preventDefault(),
                    this.setCurrentBoxIndex(s.target),
                    (this.isResizing = !0),
                    this.dayService.setGlobalCursor("ns-resize"),
                    document.addEventListener("mousemove", this.onMouseMove),
                    document.addEventListener("mouseup", this.onMouseUp);
                }),
                (this.setContextMenuBoxElementIndex = (s) => {
                  let u;
                  u = s.classList.contains("box") ? s : s.parentElement;
                  let c = u.id.split("-")[1];
                  this.contextMenuBoxElementIndex = parseInt(c) - 1;
                }),
                (this.handleMouseMove = (s) => {
                  if (!this.isResizing) {
                    this.setContextMenuBoxElementIndex(s.target);
                    let u = document.getElementsByClassName("box")[this.contextMenuBoxElementIndex];
                    this.showContextMenu(u);
                  }
                }),
                (this.changeCategory = (s) => {
                  this.boxes[this.contextMenuBoxElementIndex].group = s;
                }),
                (this.createGhostElement = (s) => {
                  let a = s.cloneNode(!0);
                  (a.id = "box-ghost"), (a.style.position = "absolute"), (a.style.padding = "5px"), document.body.append(a);
                }),
                (this.handleGhostElement = (s) => {
                  let a = document.getElementById("box-ghost");
                  (a.style.top = s.clientY - this.MIN_BOX_HEIGHT / 2 + "px"), (a.style.left = s.clientX - 100 + "px"), (a.style.height = `${this.MIN_BOX_HEIGHT}px`);
                }),
                (this.fadeOutBox = (s, a) => {
                  (s.style.height = "0px"),
                    (s.style.padding = "0px"),
                    setTimeout(() => {
                      (s.style.border = "none"), (this.dayService.dragBoxElement = this.boxes.splice(a, 1)[0]);
                    }, 150);
                }),
                (this.dragBox = (s) => {
                  let a = s.target;
                  if (a.id.includes("box")) {
                    let u = parseInt(a.id.split("-")[1]) - 1;
                    (this.dayService.dragBoxElementIndex = u),
                      this.mouseService.userIntendsToDrag().then((c) => {
                        c
                          ? (this.dayService.setGlobalCursor("grabbing"),
                            this.fadeOutBox(a, this.dayService.dragBoxElementIndex),
                            this.createGhostElement(a),
                            this.handleGhostElement(s),
                            document.addEventListener("mousemove", this.ghostDragBox),
                            document.addEventListener("mouseup", this.endDragBox))
                          : this.highlightBox(u);
                      });
                  }
                }),
                (this.highlightBoxElementIndex = -1),
                (this.highlightBox = (s) => {
                  let a = Array.from(document.getElementsByClassName("box"));
                  if (s === this.highlightBoxElementIndex) {
                    for (let u = 0; u < a.length; u++) a[u].classList.remove("transparent");
                    (this.highlightBoxElementIndex = -1), this.todoService.clearActiveBox();
                  } else {
                    for (let u = 0; u < a.length; u++) a[u].classList.add("transparent"), a[s].classList.remove("transparent");
                    this.todoService.changeActiveBox(s), (this.highlightBoxElementIndex = s);
                  }
                }),
                (this.insertable = !1),
                (this.handleInsertionElement = (s) => {
                  let a = s.clientY,
                    u = Array.from(document.getElementsByClassName("box"));
                  u = u.filter((l) => "box-ghost" !== l.id);
                  let c = document.getElementById("box-ghost");
                  for (let l of u) {
                    let d = l.getBoundingClientRect(),
                      h = a >= d.bottom - 10 && a <= d.bottom;
                    if ((a >= d.top && a <= d.top + 10) || h) return (c.style.opacity = "0.95"), (c.style.boxShadow = "0px 0px 10px 5px rgba(0,0,0,0.4)"), void (this.insertable = !0);
                  }
                  (c.style.boxShadow = "none"), (c.style.opacity = "0.5"), (this.insertable = !1);
                }),
                (this.ghostDragBox = (s) => {
                  let a = document.getElementById("box-ghost");
                  this.dayService.handleGhostElement(s, a), this.dayService.handleInsertionElement(s, a);
                }),
                (this.endDragBox = (s) => {
                  this.dayService.removeGlobalCursor("grabbing");
                  let a = document.getElementById("box-ghost");
                  this.dayService.applyDrag(s, a), document.removeEventListener("mousemove", this.ghostDragBox), document.removeEventListener("mouseup", this.endDragBox);
                }),
                (this.removeBox = () => {
                  let s = document.getElementsByClassName("box")[this.contextMenuBoxElementIndex];
                  this.fadeOutBox(s, this.contextMenuBoxElementIndex);
                }),
                (this.USER_DAY_TICKS = Array.from({ length: this.USER_DAY_END - this.USER_DAY_START + 1 }, (s, a) => a + this.USER_DAY_START)),
                n.callService(),
                (this.boxes = n.boxes),
                (this.HEIGHT_INCREMENT = n.HEIGHT_INCREMENT),
                (this.DAY_LENGTH = 4 * this.TIME_SPENT_AWAKE),
                (this.MIN_BOX_HEIGHT = 1 * n.HEIGHT_INCREMENT);
            }
            ngOnInit() {
              document.onmousemove = this.getMousePosition;
            }
            boxesToString() {
              return JSON.stringify(this.boxes);
            }
            createNewBox() {
              this.boxes.push({ title: "new box", height: this.MIN_BOX_HEIGHT });
            }
            getBoxDuration(n) {
              return this.dayService.convertBoxHeightToHours(n);
            }
            showContextMenu(n) {
              let r = document.getElementById("box-context-menu"),
                o = n.getBoundingClientRect();
              (r.style.display = "flex"), (r.style.left = `${o.right}px`), (r.style.top = `${o.top + 2}px`);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Vi), S(am), S(um));
            }),
            (e.ɵcmp = St({
              type: e,
              selectors: [["app-day"]],
              decls: 8,
              vars: 2,
              consts: [
                [1, "day-wrapper"],
                [1, "day-duration"],
                ["class", "day-tick", 4, "ngFor", "ngForOf"],
                [1, "day"],
                [3, "ngStyle", "class", "id", "mousemove", "mousedown", 4, "ngFor", "ngForOf"],
                ["id", "box-context-menu"],
                [1, "remove-box", 3, "click"],
                ["id", "insertion-indicator", "src", "/demos/guse/assets/insertion-indicator.svg", "alt", ""],
                [1, "day-tick"],
                [3, "ngStyle", "id", "mousemove", "mousedown"],
                [1, "box-text"],
                [1, "box-duration"],
                [1, "lower-drag-handle", "drag-handle", 3, "mousedown"],
              ],
              template: function (n, r) {
                1 & n &&
                  (O(0, "div", 0)(1, "div", 1),
                  Be(2, Z0, 2, 1, "div", 2),
                  L(),
                  O(3, "div", 3),
                  Be(4, J0, 6, 8, "div", 4),
                  L(),
                  O(5, "div", 5)(6, "div", 6),
                  _e("click", function () {
                    return r.removeBox();
                  }),
                  L()()(),
                  nt(7, "img", 7)),
                  2 & n && (Y(2), me("ngForOf", r.USER_DAY_TICKS), Y(2), me("ngForOf", r.boxes));
              },
              dependencies: [no, Lg],
              styles: [
                '.red[_ngcontent-%COMP%]{background-color:red}.green[_ngcontent-%COMP%]{background-color:green}.blue[_ngcontent-%COMP%]{background-color:#00f}.white[_ngcontent-%COMP%]{background-color:#fff}.crimson[_ngcontent-%COMP%]{background-color:#dc143c}.yellow[_ngcontent-%COMP%]{background-color:#ff0}.gray[_ngcontent-%COMP%]{background-color:gray}.lightblue[_ngcontent-%COMP%]{background-color:#add8e6}.burlywood[_ngcontent-%COMP%]{background-color:#deb887}.blueviolet[_ngcontent-%COMP%]{background-color:#8a2be2}.brown[_ngcontent-%COMP%]{background-color:#b47934}.plum[_ngcontent-%COMP%]{background-color:plum}.goldenrod[_ngcontent-%COMP%]{background-color:#daa520}.darkseagreen[_ngcontent-%COMP%]{background-color:#8fbc8f}.black[_ngcontent-%COMP%]{background-color:#000}.day-wrapper[_ngcontent-%COMP%]{display:flex;overflow-y:scroll;height:900px;scrollbar-width:none;-ms-overflow-style:none;padding:10px 0}.day-wrapper[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}.day-duration[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:space-between;position:relative;top:-7px;margin-right:50px;height:1293px;font-size:10px;color:#8f8f8f}.day-tick[_ngcontent-%COMP%]:after{content:"-------------------------------------------------------";position:absolute;width:700px}.box[_ngcontent-%COMP%]{width:200px;font-size:12px;position:relative;margin-bottom:0;padding:5px;box-sizing:border-box;border:2px solid #e2ded9;border-left:5px solid #c6c2bb;border-radius:5px;color:#fff;transition:.2s ease-out height,.2s ease-out padding,.2s ease-out opacity;cursor:pointer;-webkit-user-select:none;user-select:none}.box-text[_ngcontent-%COMP%]{position:absolute;top:1px}#box-ghost[_ngcontent-%COMP%]{border:none;border-left:5px solid #c6c2bb;transition:.2s ease-out width,.2s ease-out opacity,.2s ease-out box-shadow;opacity:.5}.drag-handle[_ngcontent-%COMP%]{width:100%;height:7px;cursor:ns-resize}.lower-drag-handle[_ngcontent-%COMP%], .box-duration[_ngcontent-%COMP%]{position:absolute;bottom:0}.box-duration[_ngcontent-%COMP%]{right:4px}.group-a[_ngcontent-%COMP%]{background-color:#3f3b6c}.group-b[_ngcontent-%COMP%]{background-color:#624f82}.group-c[_ngcontent-%COMP%]{background-color:#9f73ab}.group-d[_ngcontent-%COMP%]{background-color:#a3c7d6}.group-e[_ngcontent-%COMP%]{background-color:#ff731d}.group-red[_ngcontent-%COMP%]{background-color:red}.group-green[_ngcontent-%COMP%]{background-color:green}.group-blue[_ngcontent-%COMP%]{background-color:#00f}.group-gray[_ngcontent-%COMP%]{background-color:#969393}.group-purple[_ngcontent-%COMP%]{background-color:purple}.group-yellow[_ngcontent-%COMP%]{background-color:#a0a000}#box-context-menu[_ngcontent-%COMP%], #insertion-indicator[_ngcontent-%COMP%]{display:none;position:absolute}#box-context-menu[_ngcontent-%COMP%]{height:21px}#box-context-menu[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{height:10px;width:10px;border-radius:2px}.first-category[_ngcontent-%COMP%]{background-color:red}.second-category[_ngcontent-%COMP%]{background-color:green}.third-category[_ngcontent-%COMP%]{background-color:#6d6dff}.remove-box[_ngcontent-%COMP%]{cursor:pointer}.remove-box[_ngcontent-%COMP%]:after{content:"-";position:relative;top:-6px;color:red}.transparent[_ngcontent-%COMP%]{opacity:.2}',
              ],
            })),
            e
          );
        })(),
        cm = (() => {
          class e {
            constructor() {
              (this.ACTIVITY_ITEMS = [
                { category: "Skills", name: "3D Modelling" },
                { category: "Passion", name: "Chess" },
                { category: "Health", name: "Run" },
                { category: "Books", name: "Educated" },
                { category: "Skills", name: "Photoshop" },
                { category: "Music", name: "Piano" },
                { category: "Books", name: "Notes" },
                { category: "Skills", name: "Code" },
                { category: "Language", name: "English" },
                { category: "Health", name: "Gym" },
                { category: "Self-Development", name: "Journal" },
                { category: "Books", name: "Pragmatic" },
                { category: "Language", name: "Japanese" },
                { category: "Passion", name: "Morse Code" },
                { category: "Health", name: "Meditate" },
                { category: "Skills", name: "Video Editing" },
                { category: "Books", name: "C&P" },
                { category: "Learning", name: "Linux" },
              ]),
                (this.activitesChange = new cr()),
                (this.currentFilteredCategory = ""),
                (this.filterActivites = (n) => {
                  this.currentFilteredCategory = n;
                  let r = this.ACTIVITY_ITEMS.filter((o) => o.category === n);
                  this.activitesChange.next(r);
                }),
                (this.resetFilter = () => {
                  this.activitesChange.next(this.ACTIVITY_ITEMS);
                }),
                this.ACTIVITY_ITEMS.sort((n, r) => n.name.localeCompare(r.name));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      function eT(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 8),
            _e("click", function (o) {
              const s = ze(n).$implicit;
              return We(ue(2).filterActivities(o, s));
            }),
            nt(1, "div"),
            O(2, "div", 9),
            se(3),
            L()();
        }
        if (2 & e) {
          const n = t.$implicit;
          Y(1), pn("category-item-color " + n.color), Y(2), Zt(n.name);
        }
      }
      function tT(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 10),
            nt(1, "div", 11),
            O(2, "input", 12),
            _e("keydown.enter", function (o) {
              return ze(n), We(ue(2).onKeyDownEvent(o));
            }),
            L()();
        }
      }
      function nT(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 4),
            Be(1, eT, 4, 3, "div", 5),
            Be(2, tT, 3, 0, "div", 6),
            O(3, "div", 7),
            _e("click", function (o) {
              return ze(n), We(ue().createNewCategoryItem(o));
            }),
            se(4, "+ Add new"),
            L()();
        }
        if (2 & e) {
          const n = ue();
          Y(1), me("ngForOf", n.CATEGORY_ITEMS), Y(1), me("ngIf", n.creatingNewCategoryItem);
        }
      }
      let rT = (() => {
        class e {
          constructor(n) {
            (this.activityService = n),
              (this.CATEGORY_ITEMS = []),
              (this.creatingNewCategoryItem = !1),
              (this.isVisible = !0),
              (this.handleCategoriesVisibility = () => {
                (this.isVisible = !this.isVisible), (document.getElementById("categories-menu-item-arrow").style.transform = this.isVisible ? "rotate(0deg)" : "rotate(90deg)");
              }),
              (this.createNewCategoryItem = (r) => {
                this.creatingNewCategoryItem = !0;
              }),
              (this.onKeyDownEvent = (r) => {
                console.log(r), this.CATEGORY_ITEMS.push({ color: "white", name: r.target.value }), (this.creatingNewCategoryItem = !1);
              }),
              (this.filteredCategoryIndex = -1),
              (this.handleFilterIndicator = (r, o) => {
                let i = document.getElementsByClassName("category-item-name")[r];
                i.textContent = o ? "\u2192 " + i.textContent : i.textContent.replace("\u2192 ", "");
              }),
              (this.filterActivities = (r, o) => {
                let i = this.CATEGORY_ITEMS.indexOf(o);
                this.filteredCategoryIndex !== i
                  ? (-1 !== this.filteredCategoryIndex && this.handleFilterIndicator(this.filteredCategoryIndex, !1),
                    this.activityService.resetFilter(),
                    this.handleFilterIndicator(i, !0),
                    this.activityService.filterActivites(o.name),
                    (this.filteredCategoryIndex = i))
                  : (this.activityService.resetFilter(), this.handleFilterIndicator(i, !1), (this.filteredCategoryIndex = -1));
              });
          }
          ngOnInit() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(cm));
          }),
          (e.ɵcmp = St({
            type: e,
            selectors: [["app-categories"]],
            inputs: { CATEGORY_ITEMS: "CATEGORY_ITEMS" },
            decls: 5,
            vars: 1,
            consts: [
              ["id", "categories-wrapper"],
              [1, "menu-item", 3, "click"],
              ["id", "categories-menu-item-arrow", "src", "/demos/guse/assets/menu-item-arrow.svg", "alt", ""],
              ["class", "categories-content", 4, "ngIf"],
              [1, "categories-content"],
              ["class", "category-item", 3, "click", 4, "ngFor", "ngForOf"],
              ["class", "new-category-item", 4, "ngIf"],
              [1, "create-new-category-item", 3, "click"],
              [1, "category-item", 3, "click"],
              [1, "category-item-name"],
              [1, "new-category-item"],
              [1, "category-item-color", "white"],
              ["type", "text", "name", "", "id", "", 3, "keydown.enter"],
            ],
            template: function (n, r) {
              1 & n &&
                (O(0, "div", 0)(1, "h4", 1),
                _e("click", function () {
                  return r.handleCategoriesVisibility();
                }),
                nt(2, "img", 2),
                se(3, "CATEGORIES "),
                L(),
                Be(4, nT, 5, 2, "div", 3),
                L()),
                2 & n && (Y(4), me("ngIf", r.isVisible));
            },
            dependencies: [no, Oi],
            styles: [
              ".red[_ngcontent-%COMP%]{background-color:red}.green[_ngcontent-%COMP%]{background-color:green}.blue[_ngcontent-%COMP%]{background-color:#00f}.white[_ngcontent-%COMP%]{background-color:#fff}.crimson[_ngcontent-%COMP%]{background-color:#dc143c}.yellow[_ngcontent-%COMP%]{background-color:#ff0}.gray[_ngcontent-%COMP%]{background-color:gray}.lightblue[_ngcontent-%COMP%]{background-color:#add8e6}.burlywood[_ngcontent-%COMP%]{background-color:#deb887}.blueviolet[_ngcontent-%COMP%]{background-color:#8a2be2}.brown[_ngcontent-%COMP%]{background-color:#b47934}.plum[_ngcontent-%COMP%]{background-color:plum}.goldenrod[_ngcontent-%COMP%]{background-color:#daa520}.darkseagreen[_ngcontent-%COMP%]{background-color:#8fbc8f}.black[_ngcontent-%COMP%]{background-color:#000}#side-menu-wrapper[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:15px;width:190px}#categories-wrapper[_ngcontent-%COMP%], #activities-wrapper[_ngcontent-%COMP%]{box-sizing:border-box}.category-item[_ngcontent-%COMP%], .activity-item[_ngcontent-%COMP%]{display:flex;gap:5px;align-items:center;margin-bottom:5px}.category-item[_ngcontent-%COMP%], .activity-item[_ngcontent-%COMP%]{cursor:pointer;-webkit-user-select:none;user-select:none}.category-item-color[_ngcontent-%COMP%], .activity-item-color[_ngcontent-%COMP%]{width:15px;height:15px;border-radius:4px}h4[_ngcontent-%COMP%]{cursor:pointer;margin-top:0;margin-bottom:5px;color:#797676}.new-category-item[_ngcontent-%COMP%], #new-activity-item[_ngcontent-%COMP%]{display:flex;gap:5px;align-items:center}.new-category-item[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], #new-activity-item[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:80px;outline:none;border:none;border-bottom:1px solid gray;background-color:#e2ded9}.menu-item[_ngcontent-%COMP%]{-webkit-user-select:none;user-select:none}#categories-menu-item-arrow[_ngcontent-%COMP%], #activities-menu-item-arrow[_ngcontent-%COMP%]{width:6px;margin-right:5px;transition:.2s ease-out transform}.create-new-category-item[_ngcontent-%COMP%], .create-new-activity-item[_ngcontent-%COMP%]{cursor:pointer}[contenteditable][_ngcontent-%COMP%]{outline:0px solid transparent;cursor:text}",
            ],
          })),
          e
        );
      })();
      function oT(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 9),
            _e("mousedown", function (o) {
              return ze(n), We(ue(2).handleMouseDown(o));
            }),
            nt(1, "div"),
            O(2, "div", 10),
            se(3),
            L()();
        }
        if (2 & e) {
          const n = t.$implicit,
            r = t.index,
            o = ue(2);
          me("id", "activity-" + (r + 1)), Y(1), pn("activity-item-color " + o.getColorForActivity(n.category)), Y(2), Zt(n.name);
        }
      }
      function iT(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 11),
            nt(1, "div"),
            O(2, "input", 12),
            _e("keydown.enter", function (o) {
              return ze(n), We(ue(2).onKeyDownEvent(o));
            }),
            L()();
        }
        if (2 & e) {
          const n = ue(2);
          Y(1), pn("activity-item-color " + n.currentCategoryColor);
        }
      }
      function sT(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 4),
            Be(1, oT, 4, 4, "div", 5),
            Be(2, iT, 3, 2, "div", 6),
            O(3, "div", 7),
            _e("click", function (o) {
              return ze(n), We(ue().createNewActivityItem(o));
            }),
            se(4, "+ Add new"),
            L(),
            nt(5, "div", 8),
            L();
        }
        if (2 & e) {
          const n = ue();
          Y(1), me("ngForOf", n.ACTIVITY_ITEMS), Y(1), me("ngIf", n.creatingNewActivityItem);
        }
      }
      let aT = (() => {
          class e {
            constructor(n, r, o) {
              (this.dayService = n),
                (this.activityService = r),
                (this.mouseService = o),
                (this.CATEGORY_ITEMS = []),
                (this.getColorForActivity = (i) => {
                  let s = this.CATEGORY_ITEMS.find((a) => a.name === i);
                  return s ? s.color : "white";
                }),
                (this.creatingNewActivityItem = !1),
                (this.isVisible = !0),
                (this.ACTIVITY_ITEMS = []),
                (this.handleActivitiesVisibility = () => {
                  (this.isVisible = !this.isVisible), (document.getElementById("activities-menu-item-arrow").style.transform = this.isVisible ? "rotate(0deg)" : "rotate(90deg)");
                }),
                (this.currentCategoryColor = ""),
                (this.createNewActivityItem = (i) => {
                  let s = this.activityService.currentFilteredCategory;
                  (this.currentCategoryColor = this.getColorForActivity(s)), s ? (this.creatingNewActivityItem = !0) : alert("Please select a category first!");
                }),
                (this.onKeyDownEvent = (i) => {
                  this.ACTIVITY_ITEMS.push({ category: this.activityService.currentFilteredCategory, name: i.target.value }), (this.creatingNewActivityItem = !1);
                }),
                (this.activityIndex = 0),
                (this.handleMouseDown = (i) => {
                  let s = i.target;
                  "" === s.id && (s = s.parentElement), (this.activityIndex = parseInt(s.id.split("-")[1]) - 1);
                  let a = this.ACTIVITY_ITEMS[this.activityIndex],
                    u = this.getColorForActivity(a.category);
                  this.mouseService.userIntendsToDrag().then((c) => {
                    if (c) {
                      this.dayService.setGlobalCursor("grabbing");
                      let l = document.getElementById("activity-box-ghost");
                      (l.innerText = a.name),
                        (l.style.display = "block"),
                        l.classList.add(u),
                        this.dayService.handleActivityGhostElement(i, l),
                        document.addEventListener("mousemove", this.handleMouseMove),
                        document.addEventListener("mouseup", this.handleMouseUp);
                    } else this.dayService.addToBoxes({ height: 1, title: a.name, group: u });
                  });
                }),
                (this.handleMouseMove = (i) => {
                  let s = document.getElementById("activity-box-ghost");
                  this.dayService.handleActivityGhostElement(i, s), this.dayService.handleInsertionElement(i, s);
                }),
                (this.handleMouseUp = (i) => {
                  this.dayService.removeGlobalCursor("grabbing");
                  let s = document.getElementById("activity-box-ghost");
                  (s.innerText = ""), (s.style.display = "none");
                  let a = this.ACTIVITY_ITEMS[this.activityIndex],
                    u = this.getColorForActivity(a.category);
                  s.classList.remove(u),
                    (this.dayService.dragBoxElement = { height: 1, title: a.name, group: u }),
                    this.dayService.applyDrag(i, s),
                    document.removeEventListener("mousemove", this.handleMouseMove),
                    document.removeEventListener("mouseup", this.handleMouseUp);
                }),
                n.callService(),
                (this.ACTIVITY_ITEMS = r.ACTIVITY_ITEMS),
                (this._subscription = r.activitesChange.subscribe((i) => {
                  this.ACTIVITY_ITEMS = i;
                }));
            }
            ngOnInit() {}
            ngOnDestroy() {
              this._subscription.unsubscribe();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Vi), S(cm), S(am));
            }),
            (e.ɵcmp = St({
              type: e,
              selectors: [["app-activities"]],
              inputs: { CATEGORY_ITEMS: "CATEGORY_ITEMS" },
              decls: 5,
              vars: 1,
              consts: [
                ["id", "activities-wrapper"],
                [1, "menu-item", 3, "click"],
                ["id", "activities-menu-item-arrow", "src", "/demos/guse/assets/menu-item-arrow.svg", "alt", ""],
                ["class", "activities-content", 4, "ngIf"],
                [1, "activities-content"],
                ["class", "activity-item", 3, "id", "mousedown", 4, "ngFor", "ngForOf"],
                ["id", "new-activity-item", 4, "ngIf"],
                [1, "create-new-activity-item", 3, "click"],
                ["id", "activity-box-ghost"],
                [1, "activity-item", 3, "id", "mousedown"],
                [1, "activity-item-name"],
                ["id", "new-activity-item"],
                ["type", "text", "name", "", "id", "", 3, "keydown.enter"],
              ],
              template: function (n, r) {
                1 & n &&
                  (O(0, "div", 0)(1, "h4", 1),
                  _e("click", function () {
                    return r.handleActivitiesVisibility();
                  }),
                  nt(2, "img", 2),
                  se(3, "ACTIVITIES "),
                  L(),
                  Be(4, sT, 6, 2, "div", 3),
                  L()),
                  2 & n && (Y(4), me("ngIf", r.isVisible));
              },
              dependencies: [no, Oi],
              styles: [
                ".red[_ngcontent-%COMP%]{background-color:red}.green[_ngcontent-%COMP%]{background-color:green}.blue[_ngcontent-%COMP%]{background-color:#00f}.white[_ngcontent-%COMP%]{background-color:#fff}.crimson[_ngcontent-%COMP%]{background-color:#dc143c}.yellow[_ngcontent-%COMP%]{background-color:#ff0}.gray[_ngcontent-%COMP%]{background-color:gray}.lightblue[_ngcontent-%COMP%]{background-color:#add8e6}.burlywood[_ngcontent-%COMP%]{background-color:#deb887}.blueviolet[_ngcontent-%COMP%]{background-color:#8a2be2}.brown[_ngcontent-%COMP%]{background-color:#b47934}.plum[_ngcontent-%COMP%]{background-color:plum}.goldenrod[_ngcontent-%COMP%]{background-color:#daa520}.darkseagreen[_ngcontent-%COMP%]{background-color:#8fbc8f}.black[_ngcontent-%COMP%]{background-color:#000}#side-menu-wrapper[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:15px;width:190px}#categories-wrapper[_ngcontent-%COMP%], #activities-wrapper[_ngcontent-%COMP%]{box-sizing:border-box}.category-item[_ngcontent-%COMP%], .activity-item[_ngcontent-%COMP%]{display:flex;gap:5px;align-items:center;margin-bottom:5px}.category-item[_ngcontent-%COMP%], .activity-item[_ngcontent-%COMP%]{cursor:pointer;-webkit-user-select:none;user-select:none}.category-item-color[_ngcontent-%COMP%], .activity-item-color[_ngcontent-%COMP%]{width:15px;height:15px;border-radius:4px}h4[_ngcontent-%COMP%]{cursor:pointer;margin-top:0;margin-bottom:5px;color:#797676}.new-category-item[_ngcontent-%COMP%], #new-activity-item[_ngcontent-%COMP%]{display:flex;gap:5px;align-items:center}.new-category-item[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], #new-activity-item[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:80px;outline:none;border:none;border-bottom:1px solid gray;background-color:#e2ded9}.menu-item[_ngcontent-%COMP%]{-webkit-user-select:none;user-select:none}#categories-menu-item-arrow[_ngcontent-%COMP%], #activities-menu-item-arrow[_ngcontent-%COMP%]{width:6px;margin-right:5px;transition:.2s ease-out transform}.create-new-category-item[_ngcontent-%COMP%], .create-new-activity-item[_ngcontent-%COMP%]{cursor:pointer}[contenteditable][_ngcontent-%COMP%]{outline:0px solid transparent;cursor:text}#activity-box-ghost[_ngcontent-%COMP%]{display:none;z-index:1;width:200px;height:25px;font-size:12px;position:absolute;margin-bottom:0;box-sizing:border-box;padding:5px;border-left:5px solid #c6c2bb;border-radius:5px;color:#fff;transition:.2s ease-out height,.2s ease-out padding,.2s ease-out width,.2s ease-out opacity,.2s ease-out box-shadow;opacity:.5;cursor:grab;-webkit-user-select:none;user-select:none}",
              ],
            })),
            e
          );
        })(),
        uT = (() => {
          class e {
            constructor() {
              (this.dayCounter = 1), (this.date = new Date().toLocaleDateString("de"));
            }
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = St({
              type: e,
              selectors: [["app-dashboard"]],
              decls: 2,
              vars: 2,
              consts: [["id", "day-counter"]],
              template: function (n, r) {
                1 & n && (O(0, "div", 0), se(1), L()), 2 & n && (Y(1), qa("Day ", r.dayCounter, ", ", r.date, ""));
              },
            })),
            e
          );
        })(),
        cT = (() => {
          class e {
            constructor() {
              (this.CATEGORY_ITEMS = [
                { color: "blue", name: "Learning" },
                { color: "plum", name: "Skills" },
                { color: "green", name: "Health" },
                { color: "crimson", name: "Language" },
                { color: "yellow", name: "Music" },
                { color: "burlywood", name: "Life" },
                { color: "lightblue", name: "Passion" },
                { color: "blueviolet", name: "Books" },
                { color: "brown", name: "Entertainment" },
                { color: "darkseagreen", name: "Self-Development" },
              ]),
                this.CATEGORY_ITEMS.sort((n, r) => n.name.localeCompare(r.name));
            }
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = St({
              type: e,
              selectors: [["app-side-menu"]],
              decls: 4,
              vars: 2,
              consts: [
                ["id", "side-menu-wrapper"],
                [3, "CATEGORY_ITEMS"],
              ],
              template: function (n, r) {
                1 & n && (O(0, "div", 0), nt(1, "app-dashboard")(2, "app-categories", 1)(3, "app-activities", 1), L()),
                  2 & n && (Y(2), me("CATEGORY_ITEMS", r.CATEGORY_ITEMS), Y(1), me("CATEGORY_ITEMS", r.CATEGORY_ITEMS));
              },
              dependencies: [rT, aT, uT],
              styles: [
                ".red[_ngcontent-%COMP%]{background-color:red}.green[_ngcontent-%COMP%]{background-color:green}.blue[_ngcontent-%COMP%]{background-color:#00f}.white[_ngcontent-%COMP%]{background-color:#fff}.crimson[_ngcontent-%COMP%]{background-color:#dc143c}.yellow[_ngcontent-%COMP%]{background-color:#ff0}.gray[_ngcontent-%COMP%]{background-color:gray}.lightblue[_ngcontent-%COMP%]{background-color:#add8e6}.burlywood[_ngcontent-%COMP%]{background-color:#deb887}.blueviolet[_ngcontent-%COMP%]{background-color:#8a2be2}.brown[_ngcontent-%COMP%]{background-color:#b47934}.plum[_ngcontent-%COMP%]{background-color:plum}.goldenrod[_ngcontent-%COMP%]{background-color:#daa520}.darkseagreen[_ngcontent-%COMP%]{background-color:#8fbc8f}.black[_ngcontent-%COMP%]{background-color:#000}#side-menu-wrapper[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:15px;width:190px}#categories-wrapper[_ngcontent-%COMP%], #activities-wrapper[_ngcontent-%COMP%]{box-sizing:border-box}.category-item[_ngcontent-%COMP%], .activity-item[_ngcontent-%COMP%]{display:flex;gap:5px;align-items:center;margin-bottom:5px}.category-item[_ngcontent-%COMP%], .activity-item[_ngcontent-%COMP%]{cursor:pointer;-webkit-user-select:none;user-select:none}.category-item-color[_ngcontent-%COMP%], .activity-item-color[_ngcontent-%COMP%]{width:15px;height:15px;border-radius:4px}h4[_ngcontent-%COMP%]{cursor:pointer;margin-top:0;margin-bottom:5px;color:#797676}.new-category-item[_ngcontent-%COMP%], #new-activity-item[_ngcontent-%COMP%]{display:flex;gap:5px;align-items:center}.new-category-item[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], #new-activity-item[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:80px;outline:none;border:none;border-bottom:1px solid gray;background-color:#e2ded9}.menu-item[_ngcontent-%COMP%]{-webkit-user-select:none;user-select:none}#categories-menu-item-arrow[_ngcontent-%COMP%], #activities-menu-item-arrow[_ngcontent-%COMP%]{width:6px;margin-right:5px;transition:.2s ease-out transform}.create-new-category-item[_ngcontent-%COMP%], .create-new-activity-item[_ngcontent-%COMP%]{cursor:pointer}[contenteditable][_ngcontent-%COMP%]{outline:0px solid transparent;cursor:text}",
              ],
            })),
            e
          );
        })();
      function lT(e, t) {
        if ((1 & e && (O(0, "div", 9), se(1), L()), 2 & e)) {
          const n = ue();
          Y(1), $r("\u2192 ", n.startEndTime, "");
        }
      }
      function dT(e, t) {
        1 & e && (O(0, "div", 9), se(1, "\u2192 Select a box!"), L());
      }
      function fT(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 10),
            _e("click", function () {
              const i = ze(n).index;
              return We(ue().tickTodoItem(i));
            }),
            O(1, "div", 11),
            se(2, "\u2022"),
            L(),
            O(3, "div", 12),
            se(4),
            L()();
        }
        if (2 & e) {
          const n = t.$implicit;
          pn(ue().getClassName(n)), Y(4), Zt(n.title);
        }
      }
      function hT(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 13)(1, "div", 11),
            se(2, "\u2022"),
            L(),
            O(3, "div", 14),
            _e("keydown.enter", function (o) {
              return ze(n), We(ue().createNewTask(o));
            }),
            L()();
        }
      }
      function pT(e, t) {
        if (1 & e) {
          const n = dt();
          O(0, "div", 10),
            _e("click", function () {
              const i = ze(n).index;
              return We(ue().tickGoalItem(i));
            }),
            O(1, "div", 11),
            se(2, "\u2022"),
            L(),
            O(3, "div", 12),
            se(4),
            L()();
        }
        if (2 & e) {
          const n = t.$implicit;
          pn(ue().getClassName(n)), Y(4), Zt(n.title);
        }
      }
      let gT = (() => {
          class e {
            constructor(n, r) {
              (this.todoService = n),
                (this.dayService = r),
                (this.getClassName = (o) => {
                  let i = "todo-item";
                  return o.ticked && (i += " ticked"), i;
                }),
                (this.tickTodoItem = (o) => {
                  this.TODO_LIST[o].ticked = !this.TODO_LIST[o].ticked;
                }),
                (this.tickGoalItem = (o) => {
                  this.GOALS_LIST[o].ticked = !this.GOALS_LIST[o].ticked;
                }),
                (this.creatingNewTask = !1),
                (this.initiateNewTask = () => {
                  this.todoService.activeBox ? (this.creatingNewTask = !0) : alert("Please select a box first by clicking on it!");
                }),
                (this.createNewTask = (o) => {
                  this.TODO_LIST.push({ activity: "", ticked: !1, title: o.target.innerText }), (this.creatingNewTask = !1);
                }),
                (this.TODO_LIST = n.TODO_LIST),
                (this.GOALS_LIST = n.GOALS_LIST),
                (this.startEndTime = n.startEndTime),
                (this.activeBox = n.activeBox),
                (this._subscription = n.activeBoxChange.subscribe((o) => {
                  (this.startEndTime = o), console.log(n.TODO_LIST), (this.TODO_LIST = n.TODO_LIST), (this.GOALS_LIST = n.GOALS_LIST);
                }));
            }
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(um), S(Vi));
            }),
            (e.ɵcmp = St({
              type: e,
              selectors: [["app-todo"]],
              decls: 16,
              vars: 5,
              consts: [
                ["id", "todos-header"],
                ["id", "todos-title"],
                ["id", "todo-time", 4, "ngIf"],
                ["id", "new-task-button", 3, "click"],
                ["id", "todo-title"],
                ["id", "todos-container"],
                [3, "class", "click", 4, "ngFor", "ngForOf"],
                ["id", "new-todo-item", "class", "todo-item", 4, "ngIf"],
                ["id", "goals-title"],
                ["id", "todo-time"],
                [3, "click"],
                [1, "todo-icon"],
                [1, "todo-item-title"],
                ["id", "new-todo-item", 1, "todo-item"],
                ["contenteditable", "true", 1, "todo-item-title", 3, "keydown.enter"],
              ],
              template: function (n, r) {
                1 & n &&
                  (O(0, "div", 0)(1, "div", 1)(2, "h2"),
                  se(3, "Tasks"),
                  L(),
                  Be(4, lT, 2, 1, "div", 2),
                  Be(5, dT, 2, 0, "div", 2),
                  L(),
                  O(6, "button", 3),
                  _e("click", function () {
                    return r.initiateNewTask();
                  }),
                  se(7, "+ New Task"),
                  L()(),
                  O(8, "div", 4),
                  se(9, "Todos:"),
                  L(),
                  O(10, "div", 5),
                  Be(11, fT, 5, 3, "div", 6),
                  Be(12, hT, 4, 0, "div", 7),
                  L(),
                  O(13, "div", 8),
                  se(14, "Goals:"),
                  L(),
                  Be(15, pT, 5, 3, "div", 6)),
                  2 & n &&
                    (Y(4), me("ngIf", r.startEndTime), Y(1), me("ngIf", !r.startEndTime), Y(6), me("ngForOf", r.TODO_LIST), Y(1), me("ngIf", r.creatingNewTask), Y(3), me("ngForOf", r.GOALS_LIST));
              },
              dependencies: [no, Oi],
              styles: [
                "#todos-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;width:300px;margin-top:3px}h2[_ngcontent-%COMP%]{margin:0}#todo-time[_ngcontent-%COMP%]{color:#797676}#new-task-button[_ngcontent-%COMP%]{background-color:#fff;border:none;border-radius:5px;padding:0 30px;height:50px;cursor:pointer}.todo-item[_ngcontent-%COMP%]{display:flex;gap:10px;height:30px;box-sizing:border-box;padding:5px 0;cursor:pointer}#todo-title[_ngcontent-%COMP%], #goals-title[_ngcontent-%COMP%]{margin-top:20px}.ticked[_ngcontent-%COMP%] > .todo-item-title[_ngcontent-%COMP%]{text-decoration:line-through}[contenteditable][_ngcontent-%COMP%]{outline:0px solid transparent;cursor:text}#new-todo-item[_ngcontent-%COMP%]{border-bottom:1px solid gray}",
              ],
            })),
            e
          );
        })(),
        mT = (() => {
          class e {
            constructor() {
              this.title = "guse";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = St({
              type: e,
              selectors: [["app-root"]],
              decls: 5,
              vars: 0,
              consts: [[1, "vertical-seperator"]],
              template: function (n, r) {
                1 & n && (O(0, "main"), nt(1, "app-side-menu")(2, "div", 0)(3, "app-day")(4, "app-todo"), L());
              },
              dependencies: [X0, cT, gT],
              styles: [
                "main[_ngcontent-%COMP%]{display:flex;gap:50px;padding:20px;overflow:hidden}.vertical-seperator[_ngcontent-%COMP%]{width:1px;height:947px;background-color:gray;margin:-20px 0}",
              ],
            })),
            e
          );
        })(),
        yT = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = fr({ type: e, bootstrap: [mT] })),
            (e.ɵinj = Dn({ imports: [j0] })),
            e
          );
        })();
      (function fI() {
        fg = !1;
      })(),
        V0()
          .bootstrapModule(yT)
          .catch((e) => console.error(e));
    },
  },
  (re) => {
    re((re.s = 313));
  },
]);
