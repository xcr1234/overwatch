var navigator = {};     //这里只是兼容一下


function BigInteger(t, i, e) {
    null != t && ("number" == typeof t ? this.fromNumber(t, i, e) : null == i && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, i))
}
function nbi() {
    return new BigInteger(null)
}
function am1(t, i, e, r, n, s) {
    for (; --s >= 0;) {
        var o = i * this[t++] + e[r] + n;
        n = Math.floor(o / 67108864), e[r++] = 67108863 & o
    }
    return n
}
function am2(t, i, e, r, n, s) {
    for (var o = 32767 & i, h = i >> 15; --s >= 0;) {
        var c = 32767 & this[t], a = this[t++] >> 15, u = h * c + a * o;
        c = o * c + ((32767 & u) << 15) + e[r] + (1073741823 & n), n = (c >>> 30) + (u >>> 15) + h * a + (n >>> 30), e[r++] = 1073741823 & c
    }
    return n
}
function am3(t, i, e, r, n, s) {
    for (var o = 16383 & i, h = i >> 14; --s >= 0;) {
        var c = 16383 & this[t], a = this[t++] >> 14, u = h * c + a * o;
        c = o * c + ((16383 & u) << 14) + e[r] + n, n = (c >> 28) + (u >> 14) + h * a, e[r++] = 268435455 & c
    }
    return n
}
function int2char(t) {
    return BI_RM.charAt(t)
}
function intAt(t, i) {
    var e = BI_RC[t.charCodeAt(i)];
    return null == e ? -1 : e
}
function bnpCopyTo(t) {
    for (var i = this.t - 1; i >= 0; --i)t[i] = this[i];
    t.t = this.t, t.s = this.s
}
function bnpFromInt(t) {
    this.t = 1, this.s = 0 > t ? -1 : 0, t > 0 ? this[0] = t : -1 > t ? this[0] = t + DV : this.t = 0
}
function nbv(t) {
    var i = nbi();
    return i.fromInt(t), i
}
function bnpFromString(t, i) {
    var e;
    if (16 == i) e = 4; else if (8 == i) e = 3; else if (256 == i) e = 8; else if (2 == i) e = 1; else if (32 == i) e = 5; else {
        if (4 != i)return void this.fromRadix(t, i);
        e = 2
    }
    this.t = 0, this.s = 0;
    for (var r = t.length, n = !1, s = 0; --r >= 0;) {
        var o = 8 == e ? 255 & t[r] : intAt(t, r);
        0 > o ? "-" == t.charAt(r) && (n = !0) : (n = !1, 0 == s ? this[this.t++] = o : s + e > this.DB ? (this[this.t - 1] |= (o & (1 << this.DB - s) - 1) << s, this[this.t++] = o >> this.DB - s) : this[this.t - 1] |= o << s, s += e, s >= this.DB && (s -= this.DB))
    }
    8 == e && 0 != (128 & t[0]) && (this.s = -1, s > 0 && (this[this.t - 1] |= (1 << this.DB - s) - 1 << s)), this.clamp(), n && BigInteger.ZERO.subTo(this, this)
}
function bnpClamp() {
    for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t;)--this.t
}
function bnToString(t) {
    if (this.s < 0)return "-" + this.negate().toString(t);
    var i;
    if (16 == t) i = 4; else if (8 == t) i = 3; else if (2 == t) i = 1; else if (32 == t) i = 5; else {
        if (4 != t)return this.toRadix(t);
        i = 2
    }
    var e, r = (1 << i) - 1, n = !1, s = "", o = this.t, h = this.DB - o * this.DB % i;
    if (o-- > 0)for (h < this.DB && (e = this[o] >> h) > 0 && (n = !0, s = int2char(e)); o >= 0;)i > h ? (e = (this[o] & (1 << h) - 1) << i - h, e |= this[--o] >> (h += this.DB - i)) : (e = this[o] >> (h -= i) & r, 0 >= h && (h += this.DB, --o)), e > 0 && (n = !0), n && (s += int2char(e));
    return n ? s : "0"
}
function bnNegate() {
    var t = nbi();
    return BigInteger.ZERO.subTo(this, t), t
}
function bnAbs() {
    return this.s < 0 ? this.negate() : this
}
function bnCompareTo(t) {
    var i = this.s - t.s;
    if (0 != i)return i;
    var e = this.t;
    if (i = e - t.t, 0 != i)return this.s < 0 ? -i : i;
    for (; --e >= 0;)if (0 != (i = this[e] - t[e]))return i;
    return 0
}
function nbits(t) {
    var i, e = 1;
    return 0 != (i = t >>> 16) && (t = i, e += 16), 0 != (i = t >> 8) && (t = i, e += 8), 0 != (i = t >> 4) && (t = i, e += 4), 0 != (i = t >> 2) && (t = i, e += 2), 0 != (i = t >> 1) && (t = i, e += 1), e
}
function bnBitLength() {
    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}
function bnpDLShiftTo(t, i) {
    var e;
    for (e = this.t - 1; e >= 0; --e)i[e + t] = this[e];
    for (e = t - 1; e >= 0; --e)i[e] = 0;
    i.t = this.t + t, i.s = this.s
}
function bnpDRShiftTo(t, i) {
    for (var e = t; e < this.t; ++e)i[e - t] = this[e];
    i.t = Math.max(this.t - t, 0), i.s = this.s
}
function bnpLShiftTo(t, i) {
    var e, r = t % this.DB, n = this.DB - r, s = (1 << n) - 1, o = Math.floor(t / this.DB), h = this.s << r & this.DM;
    for (e = this.t - 1; e >= 0; --e)i[e + o + 1] = this[e] >> n | h, h = (this[e] & s) << r;
    for (e = o - 1; e >= 0; --e)i[e] = 0;
    i[o] = h, i.t = this.t + o + 1, i.s = this.s, i.clamp()
}
function bnpRShiftTo(t, i) {
    i.s = this.s;
    var e = Math.floor(t / this.DB);
    if (e >= this.t)return void(i.t = 0);
    var r = t % this.DB, n = this.DB - r, s = (1 << r) - 1;
    i[0] = this[e] >> r;
    for (var o = e + 1; o < this.t; ++o)i[o - e - 1] |= (this[o] & s) << n, i[o - e] = this[o] >> r;
    r > 0 && (i[this.t - e - 1] |= (this.s & s) << n), i.t = this.t - e, i.clamp()
}
function bnpSubTo(t, i) {
    for (var e = 0, r = 0, n = Math.min(t.t, this.t); n > e;)r += this[e] - t[e], i[e++] = r & this.DM, r >>= this.DB;
    if (t.t < this.t) {
        for (r -= t.s; e < this.t;)r += this[e], i[e++] = r & this.DM, r >>= this.DB;
        r += this.s
    } else {
        for (r += this.s; e < t.t;)r -= t[e], i[e++] = r & this.DM, r >>= this.DB;
        r -= t.s
    }
    i.s = 0 > r ? -1 : 0, -1 > r ? i[e++] = this.DV + r : r > 0 && (i[e++] = r), i.t = e, i.clamp()
}
function bnpMultiplyTo(t, i) {
    var e = this.abs(), r = t.abs(), n = e.t;
    for (i.t = n + r.t; --n >= 0;)i[n] = 0;
    for (n = 0; n < r.t; ++n)i[n + e.t] = e.am(0, r[n], i, n, 0, e.t);
    i.s = 0, i.clamp(), this.s != t.s && BigInteger.ZERO.subTo(i, i)
}
function bnpSquareTo(t) {
    for (var i = this.abs(), e = t.t = 2 * i.t; --e >= 0;)t[e] = 0;
    for (e = 0; e < i.t - 1; ++e) {
        var r = i.am(e, i[e], t, 2 * e, 0, 1);
        (t[e + i.t] += i.am(e + 1, 2 * i[e], t, 2 * e + 1, r, i.t - e - 1)) >= i.DV && (t[e + i.t] -= i.DV, t[e + i.t + 1] = 1)
    }
    t.t > 0 && (t[t.t - 1] += i.am(e, i[e], t, 2 * e, 0, 1)), t.s = 0, t.clamp()
}
function bnpDivRemTo(t, i, e) {
    var r = t.abs();
    if (!(r.t <= 0)) {
        var n = this.abs();
        if (n.t < r.t)return null != i && i.fromInt(0), void(null != e && this.copyTo(e));
        null == e && (e = nbi());
        var s = nbi(), o = this.s, h = t.s, c = this.DB - nbits(r[r.t - 1]);
        c > 0 ? (r.lShiftTo(c, s), n.lShiftTo(c, e)) : (r.copyTo(s), n.copyTo(e));
        var a = s.t, u = s[a - 1];
        if (0 != u) {
            var l = u * (1 << this.F1) + (a > 1 ? s[a - 2] >> this.F2 : 0), p = this.FV / l, f = (1 << this.F1) / l, g = 1 << this.F2, m = e.t, b = m - a, d = null == i ? nbi() : i;
            for (s.dlShiftTo(b, d), e.compareTo(d) >= 0 && (e[e.t++] = 1, e.subTo(d, e)), BigInteger.ONE.dlShiftTo(a, d), d.subTo(s, s); s.t < a;)s[s.t++] = 0;
            for (; --b >= 0;) {
                var v = e[--m] == u ? this.DM : Math.floor(e[m] * p + (e[m - 1] + g) * f);
                if ((e[m] += s.am(0, v, e, b, 0, a)) < v)for (s.dlShiftTo(b, d), e.subTo(d, e); e[m] < --v;)e.subTo(d, e)
            }
            null != i && (e.drShiftTo(a, i), o != h && BigInteger.ZERO.subTo(i, i)), e.t = a, e.clamp(), c > 0 && e.rShiftTo(c, e), 0 > o && BigInteger.ZERO.subTo(e, e)
        }
    }
}
function bnMod(t) {
    var i = nbi();
    return this.abs().divRemTo(t, null, i), this.s < 0 && i.compareTo(BigInteger.ZERO) > 0 && t.subTo(i, i), i
}
function Classic(t) {
    this.m = t
}
function cConvert(t) {
    return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
}
function cRevert(t) {
    return t
}
function cReduce(t) {
    t.divRemTo(this.m, null, t)
}
function cMulTo(t, i, e) {
    t.multiplyTo(i, e), this.reduce(e)
}
function cSqrTo(t, i) {
    t.squareTo(i), this.reduce(i)
}
function bnpInvDigit() {
    if (this.t < 1)return 0;
    var t = this[0];
    if (0 == (1 & t))return 0;
    var i = 3 & t;
    return i = i * (2 - (15 & t) * i) & 15, i = i * (2 - (255 & t) * i) & 255, i = i * (2 - ((65535 & t) * i & 65535)) & 65535, i = i * (2 - t * i % this.DV) % this.DV, i > 0 ? this.DV - i : -i
}
function Montgomery(t) {
    this.m = t, this.mp = t.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << t.DB - 15) - 1, this.mt2 = 2 * t.t
}
function montConvert(t) {
    var i = nbi();
    return t.abs().dlShiftTo(this.m.t, i), i.divRemTo(this.m, null, i), t.s < 0 && i.compareTo(BigInteger.ZERO) > 0 && this.m.subTo(i, i), i
}
function montRevert(t) {
    var i = nbi();
    return t.copyTo(i), this.reduce(i), i
}
function montReduce(t) {
    for (; t.t <= this.mt2;)t[t.t++] = 0;
    for (var i = 0; i < this.m.t; ++i) {
        var e = 32767 & t[i], r = e * this.mpl + ((e * this.mph + (t[i] >> 15) * this.mpl & this.um) << 15) & t.DM;
        for (e = i + this.m.t, t[e] += this.m.am(0, r, t, i, 0, this.m.t); t[e] >= t.DV;)t[e] -= t.DV, t[++e]++
    }
    t.clamp(), t.drShiftTo(this.m.t, t), t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
}
function montSqrTo(t, i) {
    t.squareTo(i), this.reduce(i)
}
function montMulTo(t, i, e) {
    t.multiplyTo(i, e), this.reduce(e)
}
function bnpIsEven() {
    return 0 == (this.t > 0 ? 1 & this[0] : this.s)
}
function bnpExp(t, i) {
    if (t > 4294967295 || 1 > t)return BigInteger.ONE;
    var e = nbi(), r = nbi(), n = i.convert(this), s = nbits(t) - 1;
    for (n.copyTo(e); --s >= 0;)if (i.sqrTo(e, r), (t & 1 << s) > 0) i.mulTo(r, n, e); else {
        var o = e;
        e = r, r = o
    }
    return i.revert(e)
}
function bnModPowInt(t, i) {
    var e;
    return e = 256 > t || i.isEven() ? new Classic(i) : new Montgomery(i), this.exp(t, e)
}
function bnClone() {
    var t = nbi();
    return this.copyTo(t), t
}
function bnIntValue() {
    if (this.s < 0) {
        if (1 == this.t)return this[0] - this.DV;
        if (0 == this.t)return -1
    } else {
        if (1 == this.t)return this[0];
        if (0 == this.t)return 0
    }
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
}
function bnByteValue() {
    return 0 == this.t ? this.s : this[0] << 24 >> 24
}
function bnShortValue() {
    return 0 == this.t ? this.s : this[0] << 16 >> 16
}
function bnpChunkSize(t) {
    return Math.floor(Math.LN2 * this.DB / Math.log(t))
}
function bnSigNum() {
    return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
}
function bnpToRadix(t) {
    if (null == t && (t = 10), 0 == this.signum() || 2 > t || t > 36)return "0";
    var i = this.chunkSize(t), e = Math.pow(t, i), r = nbv(e), n = nbi(), s = nbi(), o = "";
    for (this.divRemTo(r, n, s); n.signum() > 0;)o = (e + s.intValue()).toString(t).substr(1) + o, n.divRemTo(r, n, s);
    return s.intValue().toString(t) + o
}
function bnpFromRadix(t, i) {
    this.fromInt(0), null == i && (i = 10);
    for (var e = this.chunkSize(i), r = Math.pow(i, e), n = !1, s = 0, o = 0, h = 0; h < t.length; ++h) {
        var c = intAt(t, h);
        0 > c ? "-" == t.charAt(h) && 0 == this.signum() && (n = !0) : (o = i * o + c, ++s >= e && (this.dMultiply(r), this.dAddOffset(o, 0), s = 0, o = 0))
    }
    s > 0 && (this.dMultiply(Math.pow(i, s)), this.dAddOffset(o, 0)), n && BigInteger.ZERO.subTo(this, this)
}
function bnpFromNumber(t, i, e) {
    if ("number" == typeof i)if (2 > t) this.fromInt(1); else for (this.fromNumber(t, e), this.testBit(t - 1) || this.bitwiseTo(BigInteger.ONE.shiftLeft(t - 1), op_or, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(i);)this.dAddOffset(2, 0), this.bitLength() > t && this.subTo(BigInteger.ONE.shiftLeft(t - 1), this); else {
        var r = new Array, n = 7 & t;
        r.length = (t >> 3) + 1, i.nextBytes(r), n > 0 ? r[0] &= (1 << n) - 1 : r[0] = 0, this.fromString(r, 256)
    }
}
function bnToByteArray() {
    var t = this.t, i = new Array;
    i[0] = this.s;
    var e, r = this.DB - t * this.DB % 8, n = 0;
    if (t-- > 0)for (r < this.DB && (e = this[t] >> r) != (this.s & this.DM) >> r && (i[n++] = e | this.s << this.DB - r); t >= 0;)8 > r ? (e = (this[t] & (1 << r) - 1) << 8 - r, e |= this[--t] >> (r += this.DB - 8)) : (e = this[t] >> (r -= 8) & 255, 0 >= r && (r += this.DB, --t)), 0 != (128 & e) && (e |= -256), 0 == n && (128 & this.s) != (128 & e) && ++n, (n > 0 || e != this.s) && (i[n++] = e);
    return i
}
function bnEquals(t) {
    return 0 == this.compareTo(t)
}
function bnMin(t) {
    return this.compareTo(t) < 0 ? this : t
}
function bnMax(t) {
    return this.compareTo(t) > 0 ? this : t
}
function bnpBitwiseTo(t, i, e) {
    var r, n, s = Math.min(t.t, this.t);
    for (r = 0; s > r; ++r)e[r] = i(this[r], t[r]);
    if (t.t < this.t) {
        for (n = t.s & this.DM, r = s; r < this.t; ++r)e[r] = i(this[r], n);
        e.t = this.t
    } else {
        for (n = this.s & this.DM, r = s; r < t.t; ++r)e[r] = i(n, t[r]);
        e.t = t.t
    }
    e.s = i(this.s, t.s), e.clamp()
}
function op_and(t, i) {
    return t & i
}
function bnAnd(t) {
    var i = nbi();
    return this.bitwiseTo(t, op_and, i), i
}
function op_or(t, i) {
    return t | i
}
function bnOr(t) {
    var i = nbi();
    return this.bitwiseTo(t, op_or, i), i
}
function op_xor(t, i) {
    return t ^ i
}
function bnXor(t) {
    var i = nbi();
    return this.bitwiseTo(t, op_xor, i), i
}
function op_andnot(t, i) {
    return t & ~i
}
function bnAndNot(t) {
    var i = nbi();
    return this.bitwiseTo(t, op_andnot, i), i
}
function bnNot() {
    for (var t = nbi(), i = 0; i < this.t; ++i)t[i] = this.DM & ~this[i];
    return t.t = this.t, t.s = ~this.s, t
}
function bnShiftLeft(t) {
    var i = nbi();
    return 0 > t ? this.rShiftTo(-t, i) : this.lShiftTo(t, i), i
}
function bnShiftRight(t) {
    var i = nbi();
    return 0 > t ? this.lShiftTo(-t, i) : this.rShiftTo(t, i), i
}
function lbit(t) {
    if (0 == t)return -1;
    var i = 0;
    return 0 == (65535 & t) && (t >>= 16, i += 16), 0 == (255 & t) && (t >>= 8, i += 8), 0 == (15 & t) && (t >>= 4, i += 4), 0 == (3 & t) && (t >>= 2, i += 2), 0 == (1 & t) && ++i, i
}
function bnGetLowestSetBit() {
    for (var t = 0; t < this.t; ++t)if (0 != this[t])return t * this.DB + lbit(this[t]);
    return this.s < 0 ? this.t * this.DB : -1
}
function cbit(t) {
    for (var i = 0; 0 != t;)t &= t - 1, ++i;
    return i
}
function bnBitCount() {
    for (var t = 0, i = this.s & this.DM, e = 0; e < this.t; ++e)t += cbit(this[e] ^ i);
    return t
}
function bnTestBit(t) {
    var i = Math.floor(t / this.DB);
    return i >= this.t ? 0 != this.s : 0 != (this[i] & 1 << t % this.DB)
}
function bnpChangeBit(t, i) {
    var e = BigInteger.ONE.shiftLeft(t);
    return this.bitwiseTo(e, i, e), e
}
function bnSetBit(t) {
    return this.changeBit(t, op_or)
}
function bnClearBit(t) {
    return this.changeBit(t, op_andnot)
}
function bnFlipBit(t) {
    return this.changeBit(t, op_xor)
}
function bnpAddTo(t, i) {
    for (var e = 0, r = 0, n = Math.min(t.t, this.t); n > e;)r += this[e] + t[e], i[e++] = r & this.DM, r >>= this.DB;
    if (t.t < this.t) {
        for (r += t.s; e < this.t;)r += this[e], i[e++] = r & this.DM, r >>= this.DB;
        r += this.s
    } else {
        for (r += this.s; e < t.t;)r += t[e], i[e++] = r & this.DM, r >>= this.DB;
        r += t.s
    }
    i.s = 0 > r ? -1 : 0, r > 0 ? i[e++] = r : -1 > r && (i[e++] = this.DV + r), i.t = e, i.clamp()
}
function bnAdd(t) {
    var i = nbi();
    return this.addTo(t, i), i
}
function bnSubtract(t) {
    var i = nbi();
    return this.subTo(t, i), i
}
function bnMultiply(t) {
    var i = nbi();
    return this.multiplyTo(t, i), i
}
function bnSquare() {
    var t = nbi();
    return this.squareTo(t), t
}
function bnDivide(t) {
    var i = nbi();
    return this.divRemTo(t, i, null), i
}
function bnRemainder(t) {
    var i = nbi();
    return this.divRemTo(t, null, i), i
}
function bnDivideAndRemainder(t) {
    var i = nbi(), e = nbi();
    return this.divRemTo(t, i, e), new Array(i, e)
}
function bnpDMultiply(t) {
    this[this.t] = this.am(0, t - 1, this, 0, 0, this.t), ++this.t, this.clamp()
}
function bnpDAddOffset(t, i) {
    if (0 != t) {
        for (; this.t <= i;)this[this.t++] = 0;
        for (this[i] += t; this[i] >= this.DV;)this[i] -= this.DV, ++i >= this.t && (this[this.t++] = 0), ++this[i]
    }
}
function NullExp() {
}
function nNop(t) {
    return t
}
function nMulTo(t, i, e) {
    t.multiplyTo(i, e)
}
function nSqrTo(t, i) {
    t.squareTo(i)
}
function bnPow(t) {
    return this.exp(t, new NullExp)
}
function bnpMultiplyLowerTo(t, i, e) {
    var r = Math.min(this.t + t.t, i);
    for (e.s = 0, e.t = r; r > 0;)e[--r] = 0;
    var n;
    for (n = e.t - this.t; n > r; ++r)e[r + this.t] = this.am(0, t[r], e, r, 0, this.t);
    for (n = Math.min(t.t, i); n > r; ++r)this.am(0, t[r], e, r, 0, i - r);
    e.clamp()
}
function bnpMultiplyUpperTo(t, i, e) {
    --i;
    var r = e.t = this.t + t.t - i;
    for (e.s = 0; --r >= 0;)e[r] = 0;
    for (r = Math.max(i - this.t, 0); r < t.t; ++r)e[this.t + r - i] = this.am(i - r, t[r], e, 0, 0, this.t + r - i);
    e.clamp(), e.drShiftTo(1, e)
}
function Barrett(t) {
    this.r2 = nbi(), this.q3 = nbi(), BigInteger.ONE.dlShiftTo(2 * t.t, this.r2), this.mu = this.r2.divide(t), this.m = t
}
function barrettConvert(t) {
    if (t.s < 0 || t.t > 2 * this.m.t)return t.mod(this.m);
    if (t.compareTo(this.m) < 0)return t;
    var i = nbi();
    return t.copyTo(i), this.reduce(i), i
}
function barrettRevert(t) {
    return t
}
function barrettReduce(t) {
    for (t.drShiftTo(this.m.t - 1, this.r2), t.t > this.m.t + 1 && (t.t = this.m.t + 1, t.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t.compareTo(this.r2) < 0;)t.dAddOffset(1, this.m.t + 1);
    for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0;)t.subTo(this.m, t)
}
function barrettSqrTo(t, i) {
    t.squareTo(i), this.reduce(i)
}
function barrettMulTo(t, i, e) {
    t.multiplyTo(i, e), this.reduce(e)
}
function bnModPow(t, i) {
    var e, r, n = t.bitLength(), s = nbv(1);
    if (0 >= n)return s;
    e = 18 > n ? 1 : 48 > n ? 3 : 144 > n ? 4 : 768 > n ? 5 : 6, r = 8 > n ? new Classic(i) : i.isEven() ? new Barrett(i) : new Montgomery(i);
    var o = new Array, h = 3, c = e - 1, a = (1 << e) - 1;
    if (o[1] = r.convert(this), e > 1) {
        var u = nbi();
        for (r.sqrTo(o[1], u); a >= h;)o[h] = nbi(), r.mulTo(u, o[h - 2], o[h]), h += 2
    }
    var l, p, f = t.t - 1, g = !0, m = nbi();
    for (n = nbits(t[f]) - 1; f >= 0;) {
        for (n >= c ? l = t[f] >> n - c & a : (l = (t[f] & (1 << n + 1) - 1) << c - n, f > 0 && (l |= t[f - 1] >> this.DB + n - c)), h = e; 0 == (1 & l);)l >>= 1, --h;
        if ((n -= h) < 0 && (n += this.DB, --f), g) o[l].copyTo(s), g = !1; else {
            for (; h > 1;)r.sqrTo(s, m), r.sqrTo(m, s), h -= 2;
            h > 0 ? r.sqrTo(s, m) : (p = s, s = m, m = p), r.mulTo(m, o[l], s)
        }
        for (; f >= 0 && 0 == (t[f] & 1 << n);)r.sqrTo(s, m), p = s, s = m, m = p, --n < 0 && (n = this.DB - 1, --f)
    }
    return r.revert(s)
}
function bnGCD(t) {
    var i = this.s < 0 ? this.negate() : this.clone(), e = t.s < 0 ? t.negate() : t.clone();
    if (i.compareTo(e) < 0) {
        var r = i;
        i = e, e = r
    }
    var n = i.getLowestSetBit(), s = e.getLowestSetBit();
    if (0 > s)return i;
    for (s > n && (s = n), s > 0 && (i.rShiftTo(s, i), e.rShiftTo(s, e)); i.signum() > 0;)(n = i.getLowestSetBit()) > 0 && i.rShiftTo(n, i), (n = e.getLowestSetBit()) > 0 && e.rShiftTo(n, e), i.compareTo(e) >= 0 ? (i.subTo(e, i), i.rShiftTo(1, i)) : (e.subTo(i, e), e.rShiftTo(1, e));
    return s > 0 && e.lShiftTo(s, e), e
}
function bnpModInt(t) {
    if (0 >= t)return 0;
    var i = this.DV % t, e = this.s < 0 ? t - 1 : 0;
    if (this.t > 0)if (0 == i) e = this[0] % t; else for (var r = this.t - 1; r >= 0; --r)e = (i * e + this[r]) % t;
    return e
}
function bnModInverse(t) {
    var i = t.isEven();
    if (this.isEven() && i || 0 == t.signum())return BigInteger.ZERO;
    for (var e = t.clone(), r = this.clone(), n = nbv(1), s = nbv(0), o = nbv(0), h = nbv(1); 0 != e.signum();) {
        for (; e.isEven();)e.rShiftTo(1, e), i ? (n.isEven() && s.isEven() || (n.addTo(this, n), s.subTo(t, s)), n.rShiftTo(1, n)) : s.isEven() || s.subTo(t, s), s.rShiftTo(1, s);
        for (; r.isEven();)r.rShiftTo(1, r), i ? (o.isEven() && h.isEven() || (o.addTo(this, o), h.subTo(t, h)), o.rShiftTo(1, o)) : h.isEven() || h.subTo(t, h), h.rShiftTo(1, h);
        e.compareTo(r) >= 0 ? (e.subTo(r, e), i && n.subTo(o, n), s.subTo(h, s)) : (r.subTo(e, r), i && o.subTo(n, o), h.subTo(s, h))
    }
    return 0 != r.compareTo(BigInteger.ONE) ? BigInteger.ZERO : h.compareTo(t) >= 0 ? h.subtract(t) : h.signum() < 0 ? (h.addTo(t, h), h.signum() < 0 ? h.add(t) : h) : h
}
function bnIsProbablePrime(t) {
    var i, e = this.abs();
    if (1 == e.t && e[0] <= lowprimes[lowprimes.length - 1]) {
        for (i = 0; i < lowprimes.length; ++i)if (e[0] == lowprimes[i])return !0;
        return !1
    }
    if (e.isEven())return !1;
    for (i = 1; i < lowprimes.length;) {
        for (var r = lowprimes[i], n = i + 1; n < lowprimes.length && lplim > r;)r *= lowprimes[n++];
        for (r = e.modInt(r); n > i;)if (r % lowprimes[i++] == 0)return !1
    }
    return e.millerRabin(t)
}
function bnpMillerRabin(t) {
    var i = this.subtract(BigInteger.ONE), e = i.getLowestSetBit();
    if (0 >= e)return !1;
    var r = i.shiftRight(e);
    t = t + 1 >> 1, t > lowprimes.length && (t = lowprimes.length);
    for (var n = nbi(), s = 0; t > s; ++s) {
        n.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var o = n.modPow(r, this);
        if (0 != o.compareTo(BigInteger.ONE) && 0 != o.compareTo(i)) {
            for (var h = 1; h++ < e && 0 != o.compareTo(i);)if (o = o.modPowInt(2, this), 0 == o.compareTo(BigInteger.ONE))return !1;
            if (0 != o.compareTo(i))return !1
        }
    }
    return !0
}
function q(t) {
    throw t
}
function y(t, i, e) {
    4 !== i.length && q(new sjcl.exception.invalid("invalid aes block size"));
    var r = t.a[e], n = i[0] ^ r[0], s = i[e ? 3 : 1] ^ r[1], o = i[2] ^ r[2];
    i = i[e ? 1 : 3] ^ r[3];
    var h, c, a, u, l = r.length / 4 - 2, p = 4, f = [0, 0, 0, 0];
    h = t.j[e], t = h[0];
    var g = h[1], m = h[2], b = h[3], d = h[4];
    for (u = 0; l > u; u++)h = t[n >>> 24] ^ g[s >> 16 & 255] ^ m[o >> 8 & 255] ^ b[255 & i] ^ r[p], c = t[s >>> 24] ^ g[o >> 16 & 255] ^ m[i >> 8 & 255] ^ b[255 & n] ^ r[p + 1], a = t[o >>> 24] ^ g[i >> 16 & 255] ^ m[n >> 8 & 255] ^ b[255 & s] ^ r[p + 2], i = t[i >>> 24] ^ g[n >> 16 & 255] ^ m[s >> 8 & 255] ^ b[255 & o] ^ r[p + 3], p += 4, n = h, s = c, o = a;
    for (u = 0; 4 > u; u++)f[e ? 3 & -u : u] = d[n >>> 24] << 24 ^ d[s >> 16 & 255] << 16 ^ d[o >> 8 & 255] << 8 ^ d[255 & i] ^ r[p++], h = n, n = s, s = o, o = i, i = h;
    return f
}
function z(t, i) {
    var e, r, n, s = i.slice(0), o = t.q, h = t.a, c = o[0], a = o[1], u = o[2], l = o[3], p = o[4], f = o[5], g = o[6], m = o[7];
    for (e = 0; 64 > e; e++)16 > e ? r = s[e] : (r = s[e + 1 & 15], n = s[e + 14 & 15], r = s[15 & e] = (r >>> 7 ^ r >>> 18 ^ r >>> 3 ^ r << 25 ^ r << 14) + (n >>> 17 ^ n >>> 19 ^ n >>> 10 ^ n << 15 ^ n << 13) + s[15 & e] + s[e + 9 & 15] | 0), r = r + m + (p >>> 6 ^ p >>> 11 ^ p >>> 25 ^ p << 26 ^ p << 21 ^ p << 7) + (g ^ p & (f ^ g)) + h[e], m = g, g = f, f = p, p = l + r | 0, l = u, u = a, a = c, c = r + (a & u ^ l & (a ^ u)) + (a >>> 2 ^ a >>> 13 ^ a >>> 22 ^ a << 30 ^ a << 19 ^ a << 10) | 0;
    o[0] = o[0] + c | 0, o[1] = o[1] + a | 0, o[2] = o[2] + u | 0, o[3] = o[3] + l | 0, o[4] = o[4] + p | 0, o[5] = o[5] + f | 0, o[6] = o[6] + g | 0, o[7] = o[7] + m | 0
}
function C(t, i) {
    var e, r = sjcl.random.z[t], n = [];
    for (e in r)r.hasOwnProperty(e) && n.push(r[e]);
    for (e = 0; e < n.length; e++)n[e](i)
}
function A(t) {
    t.a = B(t).concat(B(t)), t.A = new sjcl.cipher.aes(t.a)
}
function B(t) {
    for (var i = 0; 4 > i && (t.e[i] = t.e[i] + 1 | 0, !t.e[i]); i++);
    return t.A.encrypt(t.e)
}
var dbits, canary = 0xdeadbeefcafe, j_lm = 15715070 == (16777215 & canary);
j_lm && "Microsoft Internet Explorer" == navigator.appName ? (BigInteger.prototype.am = am2, dbits = 30) : j_lm && "Netscape" != navigator.appName ? (BigInteger.prototype.am = am1, dbits = 26) : (BigInteger.prototype.am = am3, dbits = 28), BigInteger.prototype.DB = dbits, BigInteger.prototype.DM = (1 << dbits) - 1, BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP), BigInteger.prototype.F1 = BI_FP - dbits, BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz", BI_RC = new Array, rr, vv;
for (rr = "0".charCodeAt(0), vv = 0; 9 >= vv; ++vv)BI_RC[rr++] = vv;
for (rr = "a".charCodeAt(0), vv = 10; 36 > vv; ++vv)BI_RC[rr++] = vv;
for (rr = "A".charCodeAt(0), vv = 10; 36 > vv; ++vv)BI_RC[rr++] = vv;
Classic.prototype.convert = cConvert, Classic.prototype.revert = cRevert, Classic.prototype.reduce = cReduce, Classic.prototype.mulTo = cMulTo, Classic.prototype.sqrTo = cSqrTo, Montgomery.prototype.convert = montConvert, Montgomery.prototype.revert = montRevert, Montgomery.prototype.reduce = montReduce, Montgomery.prototype.mulTo = montMulTo, Montgomery.prototype.sqrTo = montSqrTo, BigInteger.prototype.copyTo = bnpCopyTo, BigInteger.prototype.fromInt = bnpFromInt, BigInteger.prototype.fromString = bnpFromString, BigInteger.prototype.clamp = bnpClamp, BigInteger.prototype.dlShiftTo = bnpDLShiftTo, BigInteger.prototype.drShiftTo = bnpDRShiftTo, BigInteger.prototype.lShiftTo = bnpLShiftTo, BigInteger.prototype.rShiftTo = bnpRShiftTo, BigInteger.prototype.subTo = bnpSubTo, BigInteger.prototype.multiplyTo = bnpMultiplyTo, BigInteger.prototype.squareTo = bnpSquareTo, BigInteger.prototype.divRemTo = bnpDivRemTo, BigInteger.prototype.invDigit = bnpInvDigit, BigInteger.prototype.isEven = bnpIsEven, BigInteger.prototype.exp = bnpExp, BigInteger.prototype.toString = bnToString, BigInteger.prototype.negate = bnNegate, BigInteger.prototype.abs = bnAbs, BigInteger.prototype.compareTo = bnCompareTo, BigInteger.prototype.bitLength = bnBitLength, BigInteger.prototype.mod = bnMod, BigInteger.prototype.modPowInt = bnModPowInt, BigInteger.ZERO = nbv(0), BigInteger.ONE = nbv(1), NullExp.prototype.convert = nNop, NullExp.prototype.revert = nNop, NullExp.prototype.mulTo = nMulTo, NullExp.prototype.sqrTo = nSqrTo, Barrett.prototype.convert = barrettConvert, Barrett.prototype.revert = barrettRevert, Barrett.prototype.reduce = barrettReduce, Barrett.prototype.mulTo = barrettMulTo, Barrett.prototype.sqrTo = barrettSqrTo;
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997], lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
BigInteger.prototype.chunkSize = bnpChunkSize, BigInteger.prototype.toRadix = bnpToRadix, BigInteger.prototype.fromRadix = bnpFromRadix, BigInteger.prototype.fromNumber = bnpFromNumber, BigInteger.prototype.bitwiseTo = bnpBitwiseTo, BigInteger.prototype.changeBit = bnpChangeBit, BigInteger.prototype.addTo = bnpAddTo, BigInteger.prototype.dMultiply = bnpDMultiply, BigInteger.prototype.dAddOffset = bnpDAddOffset, BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo, BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo, BigInteger.prototype.modInt = bnpModInt, BigInteger.prototype.millerRabin = bnpMillerRabin, BigInteger.prototype.clone = bnClone, BigInteger.prototype.intValue = bnIntValue, BigInteger.prototype.byteValue = bnByteValue, BigInteger.prototype.shortValue = bnShortValue, BigInteger.prototype.signum = bnSigNum, BigInteger.prototype.toByteArray = bnToByteArray, BigInteger.prototype.equals = bnEquals, BigInteger.prototype.min = bnMin, BigInteger.prototype.max = bnMax, BigInteger.prototype.and = bnAnd, BigInteger.prototype.or = bnOr, BigInteger.prototype.xor = bnXor, BigInteger.prototype.andNot = bnAndNot, BigInteger.prototype.not = bnNot, BigInteger.prototype.shiftLeft = bnShiftLeft, BigInteger.prototype.shiftRight = bnShiftRight, BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit, BigInteger.prototype.bitCount = bnBitCount, BigInteger.prototype.testBit = bnTestBit, BigInteger.prototype.setBit = bnSetBit, BigInteger.prototype.clearBit = bnClearBit, BigInteger.prototype.flipBit = bnFlipBit, BigInteger.prototype.add = bnAdd, BigInteger.prototype.subtract = bnSubtract, BigInteger.prototype.multiply = bnMultiply, BigInteger.prototype.divide = bnDivide, BigInteger.prototype.remainder = bnRemainder, BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder, BigInteger.prototype.modPow = bnModPow, BigInteger.prototype.modInverse = bnModInverse, BigInteger.prototype.pow = bnPow, BigInteger.prototype.gcd = bnGCD, BigInteger.prototype.isProbablePrime = bnIsProbablePrime, BigInteger.prototype.square = bnSquare;
var t = void 0, u = !1, sjcl = {
    cipher: {},
    hash: {},
    keyexchange: {},
    mode: {},
    misc: {},
    codec: {},
    exception: {
        corrupt: function (t) {
            this.toString = function () {
                return "CORRUPT: " + this.message
            }, this.message = t
        }, invalid: function (t) {
            this.toString = function () {
                return "INVALID: " + this.message
            }, this.message = t
        }, bug: function (t) {
            this.toString = function () {
                return "BUG: " + this.message
            }, this.message = t
        }, notReady: function (t) {
            this.toString = function () {
                return "NOT READY: " + this.message
            }, this.message = t
        }
    }
};
"undefined" != typeof module && module.exports && (module.exports = sjcl), sjcl.cipher.aes = function (t) {
    this.j[0][0][0] || this.D();
    var i, e, r, n, s = this.j[0][4], o = this.j[1];
    i = t.length;
    var h = 1;
    for (4 !== i && 6 !== i && 8 !== i && q(new sjcl.exception.invalid("invalid aes key size")), this.a = [r = t.slice(0), n = []], t = i; 4 * i + 28 > t; t++)e = r[t - 1], (0 === t % i || 8 === i && 4 === t % i) && (e = s[e >>> 24] << 24 ^ s[e >> 16 & 255] << 16 ^ s[e >> 8 & 255] << 8 ^ s[255 & e], 0 === t % i && (e = e << 8 ^ e >>> 24 ^ h << 24, h = h << 1 ^ 283 * (h >> 7))), r[t] = r[t - i] ^ e;
    for (i = 0; t; i++, t--)e = r[3 & i ? t : t - 4], n[i] = 4 >= t || 4 > i ? e : o[0][s[e >>> 24]] ^ o[1][s[e >> 16 & 255]] ^ o[2][s[e >> 8 & 255]] ^ o[3][s[255 & e]]
}, sjcl.cipher.aes.prototype = {
    encrypt: function (t) {
        return y(this, t, 0)
    }, decrypt: function (t) {
        return y(this, t, 1)
    }, j: [[[], [], [], [], []], [[], [], [], [], []]], D: function () {
        var t, i, e, r, n, s, o, h = this.j[0], c = this.j[1], a = h[4], u = c[4], l = [], p = [];
        for (t = 0; 256 > t; t++)p[(l[t] = t << 1 ^ 283 * (t >> 7)) ^ t] = t;
        for (i = e = 0; !a[i]; i ^= r || 1, e = p[e] || 1)for (s = e ^ e << 1 ^ e << 2 ^ e << 3 ^ e << 4, s = s >> 8 ^ 255 & s ^ 99, a[i] = s, u[s] = i, n = l[t = l[r = l[i]]], o = 16843009 * n ^ 65537 * t ^ 257 * r ^ 16843008 * i, n = 257 * l[s] ^ 16843008 * s, t = 0; 4 > t; t++)h[t][i] = n = n << 24 ^ n >>> 8, c[t][s] = o = o << 24 ^ o >>> 8;
        for (t = 0; 5 > t; t++)h[t] = h[t].slice(0), c[t] = c[t].slice(0)
    }
}, sjcl.bitArray = {
    bitSlice: function (i, e, r) {
        return i = sjcl.bitArray.O(i.slice(e / 32), 32 - (31 & e)).slice(1), r === t ? i : sjcl.bitArray.clamp(i, r - e)
    }, extract: function (t, i, e) {
        var r = Math.floor(-i - e & 31);
        return (-32 & (i + e - 1 ^ i) ? t[i / 32 | 0] << 32 - r ^ t[i / 32 + 1 | 0] >>> r : t[i / 32 | 0] >>> r) & (1 << e) - 1
    }, concat: function (t, i) {
        if (0 === t.length || 0 === i.length)return t.concat(i);
        var e = t[t.length - 1], r = sjcl.bitArray.getPartial(e);
        return 32 === r ? t.concat(i) : sjcl.bitArray.O(i, r, 0 | e, t.slice(0, t.length - 1))
    }, bitLength: function (t) {
        var i = t.length;
        return 0 === i ? 0 : 32 * (i - 1) + sjcl.bitArray.getPartial(t[i - 1])
    }, clamp: function (t, i) {
        if (32 * t.length < i)return t;
        t = t.slice(0, Math.ceil(i / 32));
        var e = t.length;
        return i &= 31, e > 0 && i && (t[e - 1] = sjcl.bitArray.partial(i, t[e - 1] & 2147483648 >> i - 1, 1)), t
    }, partial: function (t, i, e) {
        return 32 === t ? i : (e ? 0 | i : i << 32 - t) + 1099511627776 * t
    }, getPartial: function (t) {
        return Math.round(t / 1099511627776) || 32
    }, equal: function (t, i) {
        if (sjcl.bitArray.bitLength(t) !== sjcl.bitArray.bitLength(i))return u;
        var e, r = 0;
        for (e = 0; e < t.length; e++)r |= t[e] ^ i[e];
        return 0 === r
    }, O: function (i, e, r, n) {
        var s;
        for (s = 0, n === t && (n = []); e >= 32; e -= 32)n.push(r), r = 0;
        if (0 === e)return n.concat(i);
        for (s = 0; s < i.length; s++)n.push(r | i[s] >>> e), r = i[s] << 32 - e;
        return s = i.length ? i[i.length - 1] : 0, i = sjcl.bitArray.getPartial(s), n.push(sjcl.bitArray.partial(e + i & 31, e + i > 32 ? r : n.pop(), 1)), n
    }, k: function (t, i) {
        return [t[0] ^ i[0], t[1] ^ i[1], t[2] ^ i[2], t[3] ^ i[3]]
    }
}, sjcl.codec.utf8String = {
    fromBits: function (t) {
        var i, e, r = "", n = sjcl.bitArray.bitLength(t);
        for (i = 0; n / 8 > i; i++)0 === (3 & i) && (e = t[i / 4]), r += String.fromCharCode(e >>> 24), e <<= 8;
        return decodeURIComponent(escape(r))
    }, toBits: function (t) {
        t = unescape(encodeURIComponent(t));
        var i, e = [], r = 0;
        for (i = 0; i < t.length; i++)r = r << 8 | t.charCodeAt(i), 3 === (3 & i) && (e.push(r), r = 0);
        return 3 & i && e.push(sjcl.bitArray.partial(8 * (3 & i), r)), e
    }
}, sjcl.codec.hex = {
    fromBits: function (t) {
        var i, e = "";
        for (i = 0; i < t.length; i++)e += ((0 | t[i]) + 0xf00000000000).toString(16).substr(4);
        return e.substr(0, sjcl.bitArray.bitLength(t) / 4)
    }, toBits: function (t) {
        var i, e, r = [];
        for (t = t.replace(/\s|0x/g, ""), e = t.length, t += "00000000", i = 0; i < t.length; i += 8)r.push(0 ^ parseInt(t.substr(i, 8), 16));
        return sjcl.bitArray.clamp(r, 4 * e)
    }
}, sjcl.codec.base64 = {
    I: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    fromBits: function (t, i, e) {
        var r = "", n = 0, s = sjcl.codec.base64.I, o = 0, h = sjcl.bitArray.bitLength(t);
        for (e && (s = s.substr(0, 62) + "-_"), e = 0; 6 * r.length < h;)r += s.charAt((o ^ t[e] >>> n) >>> 26), 6 > n ? (o = t[e] << 6 - n, n += 26, e++) : (o <<= 6, n -= 6);
        for (; 3 & r.length && !i;)r += "=";
        return r
    },
    toBits: function (t, i) {
        t = t.replace(/\s|=/g, "");
        var e, r, n = [], s = 0, o = sjcl.codec.base64.I, h = 0;
        for (i && (o = o.substr(0, 62) + "-_"), e = 0; e < t.length; e++)r = o.indexOf(t.charAt(e)), 0 > r && q(new sjcl.exception.invalid("this isn't base64!")), s > 26 ? (s -= 26, n.push(h ^ r >>> s), h = r << 32 - s) : (s += 6, h ^= r << 32 - s);
        return 56 & s && n.push(sjcl.bitArray.partial(56 & s, h, 1)), n
    }
}, sjcl.codec.base64url = {
    fromBits: function (t) {
        return sjcl.codec.base64.fromBits(t, 1, 1)
    }, toBits: function (t) {
        return sjcl.codec.base64.toBits(t, 1)
    }
}, sjcl.hash.sha256 = function (t) {
    this.a[0] || this.D(), t ? (this.q = t.q.slice(0), this.m = t.m.slice(0), this.g = t.g) : this.reset()
}, sjcl.hash.sha256.hash = function (t) {
    return (new sjcl.hash.sha256).update(t).finalize()
}, sjcl.hash.sha256.prototype = {
    blockSize: 512, reset: function () {
        return this.q = this.M.slice(0), this.m = [], this.g = 0, this
    }, update: function (t) {
        "string" == typeof t && (t = sjcl.codec.utf8String.toBits(t));
        var i, e = this.m = sjcl.bitArray.concat(this.m, t);
        for (i = this.g, t = this.g = i + sjcl.bitArray.bitLength(t), i = 512 + i & -512; t >= i; i += 512)z(this, e.splice(0, 16));
        return this
    }, finalize: function () {
        var t, i = this.m, e = this.q, i = sjcl.bitArray.concat(i, [sjcl.bitArray.partial(1, 1)]);
        for (t = i.length + 2; 15 & t; t++)i.push(0);
        for (i.push(Math.floor(this.g / 4294967296)), i.push(0 | this.g); i.length;)z(this, i.splice(0, 16));
        return this.reset(), e
    }, M: [], a: [], D: function () {
        function t(t) {
            return 4294967296 * (t - Math.floor(t)) | 0
        }

        var i, e = 0, r = 2;
        t:for (; 64 > e; r++) {
            for (i = 2; r >= i * i; i++)if (0 === r % i)continue t;
            8 > e && (this.M[e] = t(Math.pow(r, .5))), this.a[e] = t(Math.pow(r, 1 / 3)), e++
        }
    }
}, sjcl.mode.ccm = {
    name: "ccm", encrypt: function (t, i, e, r, n) {
        var s, o = i.slice(0), h = sjcl.bitArray, c = h.bitLength(e) / 8, a = h.bitLength(o) / 8;
        for (n = n || 64, r = r || [], 7 > c && q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes")), s = 2; 4 > s && a >>> 8 * s; s++);
        return 15 - c > s && (s = 15 - c), e = h.clamp(e, 8 * (15 - s)), i = sjcl.mode.ccm.K(t, i, e, r, n, s), o = sjcl.mode.ccm.n(t, o, e, i, n, s), h.concat(o.data, o.tag)
    }, decrypt: function (t, i, e, r, n) {
        n = n || 64, r = r || [];
        var s = sjcl.bitArray, o = s.bitLength(e) / 8, h = s.bitLength(i), c = s.clamp(i, h - n), a = s.bitSlice(i, h - n), h = (h - n) / 8;
        for (7 > o && q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes")), i = 2; 4 > i && h >>> 8 * i; i++);
        return 15 - o > i && (i = 15 - o), e = s.clamp(e, 8 * (15 - i)), c = sjcl.mode.ccm.n(t, c, e, a, n, i), t = sjcl.mode.ccm.K(t, c.data, e, r, n, i), s.equal(c.tag, t) || q(new sjcl.exception.corrupt("ccm: tag doesn't match")), c.data
    }, K: function (t, i, e, r, n, s) {
        var o = [], h = sjcl.bitArray, c = h.k;
        if (n /= 8, (n % 2 || 4 > n || n > 16) && q(new sjcl.exception.invalid("ccm: invalid tag length")), (4294967295 < r.length || 4294967295 < i.length) && q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data")), s = [h.partial(8, (r.length ? 64 : 0) | n - 2 << 2 | s - 1)], s = h.concat(s, e), s[3] |= h.bitLength(i) / 8, s = t.encrypt(s), r.length)for (e = h.bitLength(r) / 8, 65279 >= e ? o = [h.partial(16, e)] : 4294967295 >= e && (o = h.concat([h.partial(16, 65534)], [e])), o = h.concat(o, r), r = 0; r < o.length; r += 4)s = t.encrypt(c(s, o.slice(r, r + 4).concat([0, 0, 0])));
        for (r = 0; r < i.length; r += 4)s = t.encrypt(c(s, i.slice(r, r + 4).concat([0, 0, 0])));
        return h.clamp(s, 8 * n)
    }, n: function (t, i, e, r, n, s) {
        var o, h = sjcl.bitArray;
        o = h.k;
        var c = i.length, a = h.bitLength(i);
        if (e = h.concat([h.partial(8, s - 1)], e).concat([0, 0, 0]).slice(0, 4), r = h.bitSlice(o(r, t.encrypt(e)), 0, n), !c)return {
            tag: r,
            data: []
        };
        for (o = 0; c > o; o += 4)e[3]++, n = t.encrypt(e), i[o] ^= n[0], i[o + 1] ^= n[1], i[o + 2] ^= n[2], i[o + 3] ^= n[3];
        return {tag: r, data: h.clamp(i, a)}
    }
}, sjcl.mode.ocb2 = {
    name: "ocb2", encrypt: function (t, i, e, r, n, s) {
        128 !== sjcl.bitArray.bitLength(e) && q(new sjcl.exception.invalid("ocb iv must be 128 bits"));
        var o, h = sjcl.mode.ocb2.G, c = sjcl.bitArray, a = c.k, u = [0, 0, 0, 0];
        e = h(t.encrypt(e));
        var l, p = [];
        for (r = r || [], n = n || 64, o = 0; o + 4 < i.length; o += 4)l = i.slice(o, o + 4), u = a(u, l), p = p.concat(a(e, t.encrypt(a(e, l)))), e = h(e);
        return l = i.slice(o), i = c.bitLength(l), o = t.encrypt(a(e, [0, 0, 0, i])), l = c.clamp(a(l.concat([0, 0, 0]), o), i), u = a(u, a(l.concat([0, 0, 0]), o)), u = t.encrypt(a(u, a(e, h(e)))), r.length && (u = a(u, s ? r : sjcl.mode.ocb2.pmac(t, r))), p.concat(c.concat(l, c.clamp(u, n)))
    }, decrypt: function (t, i, e, r, n, s) {
        128 !== sjcl.bitArray.bitLength(e) && q(new sjcl.exception.invalid("ocb iv must be 128 bits")), n = n || 64;
        var o, h, c = sjcl.mode.ocb2.G, a = sjcl.bitArray, u = a.k, l = [0, 0, 0, 0], p = c(t.encrypt(e)), f = sjcl.bitArray.bitLength(i) - n, g = [];
        for (r = r || [], e = 0; f / 32 > e + 4; e += 4)o = u(p, t.decrypt(u(p, i.slice(e, e + 4)))), l = u(l, o), g = g.concat(o), p = c(p);
        return h = f - 32 * e, o = t.encrypt(u(p, [0, 0, 0, h])), o = u(o, a.clamp(i.slice(e), h).concat([0, 0, 0])), l = u(l, o), l = t.encrypt(u(l, u(p, c(p)))), r.length && (l = u(l, s ? r : sjcl.mode.ocb2.pmac(t, r))), a.equal(a.clamp(l, n), a.bitSlice(i, f)) || q(new sjcl.exception.corrupt("ocb: tag doesn't match")), g.concat(a.clamp(o, h))
    }, pmac: function (t, i) {
        var e, r = sjcl.mode.ocb2.G, n = sjcl.bitArray, s = n.k, o = [0, 0, 0, 0], h = t.encrypt([0, 0, 0, 0]), h = s(h, r(r(h)));
        for (e = 0; e + 4 < i.length; e += 4)h = r(h), o = s(o, t.encrypt(s(h, i.slice(e, e + 4))));
        return e = i.slice(e), 128 > n.bitLength(e) && (h = s(h, r(h)), e = n.concat(e, [-2147483648, 0, 0, 0])), o = s(o, e), t.encrypt(s(r(s(h, r(h))), o))
    }, G: function (t) {
        return [t[0] << 1 ^ t[1] >>> 31, t[1] << 1 ^ t[2] >>> 31, t[2] << 1 ^ t[3] >>> 31, t[3] << 1 ^ 135 * (t[0] >>> 31)]
    }
}, sjcl.mode.gcm = {
    name: "gcm", encrypt: function (t, i, e, r, n) {
        var s = i.slice(0);
        return i = sjcl.bitArray, r = r || [], t = sjcl.mode.gcm.n(!0, t, s, r, e, n || 128), i.concat(t.data, t.tag)
    }, decrypt: function (t, i, e, r, n) {
        var s = i.slice(0), o = sjcl.bitArray, h = o.bitLength(s);
        return n = n || 128, r = r || [], h >= n ? (i = o.bitSlice(s, h - n), s = o.bitSlice(s, 0, h - n)) : (i = s, s = []), t = sjcl.mode.gcm.n(u, t, s, r, e, n), o.equal(t.tag, i) || q(new sjcl.exception.corrupt("gcm: tag doesn't match")), t.data
    }, U: function (t, i) {
        var e, r, n, s, o, h = sjcl.bitArray.k;

        for (n = [0, 0, 0, 0], s = i.slice(0), e = 0; 128 > e; e++) {
            for ((r = 0 !== (t[Math.floor(e / 32)] & 1 << 31 - e % 32)) && (n = h(n, s)), o = 0 !== (1 & s[3]), r = 3; r > 0; r--)s[r] = s[r] >>> 1 | (1 & s[r - 1]) << 31;
            s[0] >>>= 1, o && (s[0] ^= -520093696)
        }
        return n
    }, f: function (t, i, e) {
        var r, n = e.length;
        for (i = i.slice(0), r = 0; n > r; r += 4)i[0] ^= 4294967295 & e[r], i[1] ^= 4294967295 & e[r + 1], i[2] ^= 4294967295 & e[r + 2], i[3] ^= 4294967295 & e[r + 3], i = sjcl.mode.gcm.U(i, t);
        return i
    }, n: function (t, i, e, r, n, s) {
        var o, h, c, a, u, l, p, f, g = sjcl.bitArray;
        for (l = e.length, p = g.bitLength(e), f = g.bitLength(r), h = g.bitLength(n), o = i.encrypt([0, 0, 0, 0]), 96 === h ? (n = n.slice(0), n = g.concat(n, [1])) : (n = sjcl.mode.gcm.f(o, [0, 0, 0, 0], n), n = sjcl.mode.gcm.f(o, n, [0, 0, Math.floor(h / 4294967296), 4294967295 & h])), h = sjcl.mode.gcm.f(o, [0, 0, 0, 0], r), u = n.slice(0), r = h.slice(0), t || (r = sjcl.mode.gcm.f(o, h, e)), a = 0; l > a; a += 4)u[3]++, c = i.encrypt(u), e[a] ^= c[0], e[a + 1] ^= c[1], e[a + 2] ^= c[2], e[a + 3] ^= c[3];
        return e = g.clamp(e, p), t && (r = sjcl.mode.gcm.f(o, h, e)), t = [Math.floor(f / 4294967296), 4294967295 & f, Math.floor(p / 4294967296), 4294967295 & p], r = sjcl.mode.gcm.f(o, r, t), c = i.encrypt(n), r[0] ^= c[0], r[1] ^= c[1], r[2] ^= c[2], r[3] ^= c[3], {
            tag: g.bitSlice(r, 0, s),
            data: e
        }
    }
}, sjcl.misc.hmac = function (t, i) {
    this.L = i = i || sjcl.hash.sha256;
    var e, r = [[], []], n = i.prototype.blockSize / 32;
    for (this.o = [new i, new i], t.length > n && (t = i.hash(t)), e = 0; n > e; e++)r[0][e] = 909522486 ^ t[e], r[1][e] = 1549556828 ^ t[e];
    this.o[0].update(r[0]), this.o[1].update(r[1])
}, sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function (t) {
    return t = new this.L(this.o[0]).update(t).finalize(), new this.L(this.o[1]).update(t).finalize()
}, sjcl.misc.pbkdf2 = function (t, i, e, r, n) {
    e = e || 1e3, (0 > r || 0 > e) && q(sjcl.exception.invalid("invalid params to pbkdf2")), "string" == typeof t && (t = sjcl.codec.utf8String.toBits(t)), n = n || sjcl.misc.hmac, t = new n(t);
    var s, o, h, c, a = [], u = sjcl.bitArray;
    for (c = 1; 32 * a.length < (r || 1); c++) {
        for (n = s = t.encrypt(u.concat(i, [c])), o = 1; e > o; o++)for (s = t.encrypt(s), h = 0; h < s.length; h++)n[h] ^= s[h];
        a = a.concat(n)
    }
    return r && (a = u.clamp(a, r)), a
}, sjcl.prng = function (i) {
    this.b = [new sjcl.hash.sha256], this.h = [0], this.F = 0, this.t = {}, this.C = 0, this.J = {}, this.N = this.c = this.i = this.T = 0, this.a = [0, 0, 0, 0, 0, 0, 0, 0], this.e = [0, 0, 0, 0], this.A = t, this.B = i, this.p = u, this.z = {
        progress: {},
        seeded: {}
    }, this.l = this.S = 0, this.u = 1, this.w = 2, this.Q = 65536, this.H = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024], this.R = 3e4, this.P = 80
}, sjcl.prng.prototype = {
    randomWords: function (t, i) {
        var e, r = [];
        e = this.isReady(i);
        var n;
        if (e === this.l && q(new sjcl.exception.notReady("generator isn't seeded")), e & this.w) {
            e = !(e & this.u), n = [];
            var s, o = 0;
            for (this.N = n[0] = (new Date).valueOf() + this.R, s = 0; 16 > s; s++)n.push(4294967296 * Math.random() | 0);
            for (s = 0; s < this.b.length && (n = n.concat(this.b[s].finalize()), o += this.h[s], this.h[s] = 0, !(!e && this.F & 1 << s)); s++);
            for (this.F >= 1 << this.b.length && (this.b.push(new sjcl.hash.sha256), this.h.push(0)), this.c -= o, o > this.i && (this.i = o), this.F++, this.a = sjcl.hash.sha256.hash(this.a.concat(n)), this.A = new sjcl.cipher.aes(this.a), e = 0; 4 > e && (this.e[e] = this.e[e] + 1 | 0, !this.e[e]); e++);
        }
        for (e = 0; t > e; e += 4)0 === (e + 1) % this.Q && A(this), n = B(this), r.push(n[0], n[1], n[2], n[3]);
        return A(this), r.slice(0, t)
    }, setDefaultParanoia: function (t) {
        this.B = t
    }, addEntropy: function (i, e, r) {
        r = r || "user";
        var n, s, o = (new Date).valueOf(), h = this.t[r], c = this.isReady(), a = 0;
        switch (n = this.J[r], n === t && (n = this.J[r] = this.T++), h === t && (h = this.t[r] = 0), this.t[r] = (this.t[r] + 1) % this.b.length, typeof i) {
            case"number":
                e === t && (e = 1), this.b[h].update([n, this.C++, 1, e, o, 1, 0 | i]);
                break;
            case"object":
                if (r = Object.prototype.toString.call(i), "[object Uint32Array]" === r) {
                    for (s = [], r = 0; r < i.length; r++)s.push(i[r]);
                    i = s
                } else for ("[object Array]" !== r && (a = 1), r = 0; r < i.length && !a; r++)"number" != typeof i[r] && (a = 1);
                if (!a) {
                    if (e === t)for (r = e = 0; r < i.length; r++)for (s = i[r]; s > 0;)e++, s >>>= 1;
                    this.b[h].update([n, this.C++, 2, e, o, i.length].concat(i))
                }
                break;
            case"string":
                e === t && (e = i.length), this.b[h].update([n, this.C++, 3, e, o, i.length]), this.b[h].update(i);
                break;
            default:
                a = 1
        }
        a && q(new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string")), this.h[h] += e, this.c += e, c === this.l && (this.isReady() !== this.l && C("seeded", Math.max(this.i, this.c)), C("progress", this.getProgress()))
    }, isReady: function (i) {
        return i = this.H[i !== t ? i : this.B], this.i && this.i >= i ? this.h[0] > this.P && (new Date).valueOf() > this.N ? this.w | this.u : this.u : this.c >= i ? this.w | this.l : this.l
    }, getProgress: function (t) {
        return t = this.H[t ? t : this.B], this.i >= t ? 1 : this.c > t ? 1 : this.c / t
    }, startCollectors: function () {
        this.p || (window.addEventListener ? (window.addEventListener("load", this.r, u), window.addEventListener("mousemove", this.s, u)) : document.attachEvent ? (document.attachEvent("onload", this.r), document.attachEvent("onmousemove", this.s)) : q(new sjcl.exception.bug("can't attach event")), this.p = !0)
    }, stopCollectors: function () {
        this.p && (window.removeEventListener ? (window.removeEventListener("load", this.r, u), window.removeEventListener("mousemove", this.s, u)) : window.detachEvent && (window.detachEvent("onload", this.r), window.detachEvent("onmousemove", this.s)), this.p = u)
    }, addEventListener: function (t, i) {
        this.z[t][this.S++] = i
    }, removeEventListener: function (t, i) {
        var e, r, n = this.z[t], s = [];
        for (r in n)n.hasOwnProperty(r) && n[r] === i && s.push(r);
        for (e = 0; e < s.length; e++)r = s[e], delete n[r]
    }, s: function (t) {
        sjcl.random.addEntropy([t.x || t.clientX || t.offsetX || 0, t.y || t.clientY || t.offsetY || 0], 2, "mouse")
    }, r: function () {
        sjcl.random.addEntropy((new Date).valueOf(), 2, "loadtime")
    }
}, sjcl.random = new sjcl.prng(6);
try {
    var D = new Uint32Array(32);
    crypto.getRandomValues(D), sjcl.random.addEntropy(D, 1024, "crypto['getRandomValues']")
} catch (E) {
}
sjcl.json = {
    defaults: {v: 1, iter: 1e3, ks: 128, ts: 64, mode: "ccm", adata: "", cipher: "aes"},
    encrypt: function (t, i, e, r) {
        e = e || {}, r = r || {};
        var n, s = sjcl.json, o = s.d({iv: sjcl.random.randomWords(4, 0)}, s.defaults);
        return s.d(o, e), e = o.adata, "string" == typeof o.salt && (o.salt = sjcl.codec.base64.toBits(o.salt)), "string" == typeof o.iv && (o.iv = sjcl.codec.base64.toBits(o.iv)), (!sjcl.mode[o.mode] || !sjcl.cipher[o.cipher] || "string" == typeof t && 100 >= o.iter || 64 !== o.ts && 96 !== o.ts && 128 !== o.ts || 128 !== o.ks && 192 !== o.ks && 256 !== o.ks || 2 > o.iv.length || 4 < o.iv.length) && q(new sjcl.exception.invalid("json encrypt: invalid parameters")), "string" == typeof t ? (n = sjcl.misc.cachedPbkdf2(t, o), t = n.key.slice(0, o.ks / 32), o.salt = n.salt) : sjcl.ecc && t instanceof sjcl.ecc.elGamal.publicKey && (n = t.kem(), o.kemtag = n.tag, t = n.key.slice(0, o.ks / 32)), "string" == typeof i && (i = sjcl.codec.utf8String.toBits(i)), "string" == typeof e && (e = sjcl.codec.utf8String.toBits(e)), n = new sjcl.cipher[o.cipher](t), s.d(r, o), r.key = t, o.ct = sjcl.mode[o.mode].encrypt(n, i, o.iv, e, o.ts), s.encode(o)
    },
    decrypt: function (t, i, e, r) {
        e = e || {}, r = r || {};
        var n = sjcl.json;
        i = n.d(n.d(n.d({}, n.defaults), n.decode(i)), e, !0);
        var s;
        return e = i.adata, "string" == typeof i.salt && (i.salt = sjcl.codec.base64.toBits(i.salt)), "string" == typeof i.iv && (i.iv = sjcl.codec.base64.toBits(i.iv)), (!sjcl.mode[i.mode] || !sjcl.cipher[i.cipher] || "string" == typeof t && 100 >= i.iter || 64 !== i.ts && 96 !== i.ts && 128 !== i.ts || 128 !== i.ks && 192 !== i.ks && 256 !== i.ks || !i.iv || 2 > i.iv.length || 4 < i.iv.length) && q(new sjcl.exception.invalid("json decrypt: invalid parameters")), "string" == typeof t ? (s = sjcl.misc.cachedPbkdf2(t, i), t = s.key.slice(0, i.ks / 32), i.salt = s.salt) : sjcl.ecc && t instanceof sjcl.ecc.elGamal.secretKey && (t = t.unkem(sjcl.codec.base64.toBits(i.kemtag)).slice(0, i.ks / 32)), "string" == typeof e && (e = sjcl.codec.utf8String.toBits(e)), s = new sjcl.cipher[i.cipher](t), e = sjcl.mode[i.mode].decrypt(s, i.ct, i.iv, e, i.ts), n.d(r, i), r.key = t, sjcl.codec.utf8String.fromBits(e)
    },
    encode: function (t) {
        var i, e = "{", r = "";
        for (i in t)if (t.hasOwnProperty(i))switch (i.match(/^[a-z0-9]+$/i) || q(new sjcl.exception.invalid("json encode: invalid property name")), e += r + '"' + i + '":', r = ",", typeof t[i]) {
            case"number":
            case"boolean":
                e += t[i];
                break;
            case"string":
                e += '"' + escape(t[i]) + '"';
                break;
            case"object":
                e += '"' + sjcl.codec.base64.fromBits(t[i], 0) + '"';
                break;
            default:
                q(new sjcl.exception.bug("json encode: unsupported type"))
        }
        return e + "}"
    },
    decode: function (t) {
        t = t.replace(/\s/g, ""), t.match(/^\{.*\}$/) || q(new sjcl.exception.invalid("json decode: this isn't json!")), t = t.replace(/^\{|\}$/g, "").split(/,/);
        var i, e, r = {};
        for (i = 0; i < t.length; i++)(e = t[i].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i)) || q(new sjcl.exception.invalid("json decode: this isn't json!")), r[e[2]] = e[3] ? parseInt(e[3], 10) : e[2].match(/^(ct|salt|iv)$/) ? sjcl.codec.base64.toBits(e[4]) : unescape(e[4]);
        return r
    },
    d: function (i, e, r) {
        if (i === t && (i = {}), e === t)return i;
        for (var n in e)e.hasOwnProperty(n) && (r && i[n] !== t && i[n] !== e[n] && q(new sjcl.exception.invalid("required parameter overridden")), i[n] = e[n]);
        return i
    },
    X: function (t, i) {
        var e, r = {};
        for (e in t)t.hasOwnProperty(e) && t[e] !== i[e] && (r[e] = t[e]);
        return r
    },
    W: function (i, e) {
        var r, n = {};
        for (r = 0; r < e.length; r++)i[e[r]] !== t && (n[e[r]] = i[e[r]]);
        return n
    }
}, sjcl.encrypt = sjcl.json.encrypt, sjcl.decrypt = sjcl.json.decrypt, sjcl.misc.V = {}, sjcl.misc.cachedPbkdf2 = function (i, e) {
    var r, n = sjcl.misc.V;
    return e = e || {}, r = e.iter || 1e3, n = n[i] = n[i] || {}, r = n[r] = n[r] || {firstSalt: e.salt && e.salt.length ? e.salt.slice(0) : sjcl.random.randomWords(2, 0)}, n = e.salt === t ? r.firstSalt : e.salt, r[n] = r[n] || sjcl.misc.pbkdf2(i, n, e.iter), {
        key: r[n].slice(0),
        salt: n.slice(0)
    }
};
var SrpClientSession = function (t, i, e) {
    this.modulus = new BigInteger(t, 16), this.generator = new BigInteger(i, 16), this.hashFunction = e.toLowerCase(), this.sessionKeyS = null
};
SrpClientSession.prototype = {
    step1: function (t, i, e, r) {
        var n, s, o, h, c, a, u, l;
        if (h = new BigInteger(r, 16), !this.isValidPublicValue(this.modulus, h))throw"Invalid public B value";
        if (s = this.generatePrivateValue(), o = this.computePublicClientValueA(this.modulus, this.generator, s), c = this.computeU(this.modulus, o, h), !this.isValidUValue(c))throw"Invalid u value";
        return a = this.computeK(this.modulus, this.generator), u = this.computeX(t, i, e), this.sessionKeyS = this.computeSessionKeyS(this.modulus, this.generator, a, u, c, s, h), l = this.computeClientEvidenceM1(o, h, this.sessionKeyS),n = {
            publicA: o,
            clientEvidenceM1: l
        }
    }, step2: function (t, i) {
        return this.computeServerEvidenceM2(new BigInteger(t, 16), new BigInteger(i, 16), this.sessionKeyS)
    }, computeX: function (t, e, r) {
        var n, s, o = "";
        for (n = this.hash(t + ":" + e.toUpperCase()), s = this.hash(r + n, !0), i = 0; i < s.length; i += 2)o += s[s.length - i - 2] + s[s.length - i - 1];
        return new BigInteger(o, 16)
    }, generatePrivateValue: function () {
        var t, i = 0;
        t = sjcl.codec.hex.fromBits(sjcl.random.randomWords(32, i));
        var m = new BigInteger(t, 16);
        return m;
    }, computePublicClientValueA: function (t, i, e) {
        return i.modPow(e, t)
    }, computeK: function (t, i) {
        return this.hashPaddedPair(t, t.toString(16), i.toString(16))
    }, computeU: function (t, i, e) {
        return this.hashPaddedPair(t, i.toString(16), e.toString(16))
    }, computeSessionKeyS: function (t, i, e, r, n, s, o) {
        var h, c;
        return h = n.multiply(r).add(s), c = i.modPow(r, t).multiply(e), o.subtract(c).modPow(h, t)
    }, computeClientEvidenceM1: function (t, i, e) {
        switch (this.hashFunction) {
            case"sha-256":
                var r = new sjcl.hash.sha256;
                return r.update(this.bytesToBitArray(t.toByteArray())), r.update(this.bytesToBitArray(i.toByteArray())), r.update(this.bytesToBitArray(e.toByteArray())), new BigInteger(sjcl.codec.hex.fromBits(r.finalize()), 16);
            default:
                throw"Unsupported hash function: " + this.hashFunction
        }
    }, computeServerEvidenceM2: function (t, i, e) {
        switch (this.hashFunction) {
            case"sha-256":
                var r = new sjcl.hash.sha256;
                return r.update(this.bytesToBitArray(t.toByteArray())), r.update(this.bytesToBitArray(i.toByteArray())), r.update(this.bytesToBitArray(e.toByteArray())), new BigInteger(sjcl.codec.hex.fromBits(r.finalize()), 16);
            default:
                throw"Unsupported hash function: " + this.hashFunction
        }
    }, bytesToBitArray: function (t) {
        var i, e = [], r = 0;
        for (i = 0; i < t.length; i++)r = r << 8 | 255 & t[i], 3 === (3 & i) && (e.push(0 ^ r), r = 0);
        return 3 & i && e.push(sjcl.bitArray.partial(8 * (3 & i), r)), e
    }, isValidPublicValue: function (t, i) {
        return !i.mod(t).equals(new BigInteger("0", 16))
    }, isValidUValue: function (t) {
        return !t.equals(new BigInteger("0", 16))
    }, hash: function (t, i) {
        switch (this.hashFunction) {
            case"sha-256":
                i && (t = sjcl.codec.hex.toBits(t));
                var e = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(t));
                return this.pad(64, e);
            default:
                throw"Unsupported hash function: " + this.hashFunction
        }
    }, pad: function (t, i) {
        var e = Array(t + 1).join("0");
        return (e + i).slice(-e.length)
    }, hashPaddedPair: function (t, i, e) {
        var r = 2 * (4 * t.toString(16).length + 7 >> 3), n = "";
        return n += this.pad(r, i), n += this.pad(r, e), new BigInteger(this.hash(n, !0), 16)
    }
};