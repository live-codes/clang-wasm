var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/fflate/esm/browser.js
var browser_exports = {};
__export(browser_exports, {
  AsyncCompress: () => AsyncGzip,
  AsyncDecompress: () => AsyncDecompress,
  AsyncDeflate: () => AsyncDeflate,
  AsyncGunzip: () => AsyncGunzip,
  AsyncGzip: () => AsyncGzip,
  AsyncInflate: () => AsyncInflate,
  AsyncUnzipInflate: () => AsyncUnzipInflate,
  AsyncUnzlib: () => AsyncUnzlib,
  AsyncZipDeflate: () => AsyncZipDeflate,
  AsyncZlib: () => AsyncZlib,
  Compress: () => Gzip,
  DecodeUTF8: () => DecodeUTF8,
  Decompress: () => Decompress,
  Deflate: () => Deflate,
  EncodeUTF8: () => EncodeUTF8,
  FlateErrorCode: () => FlateErrorCode,
  Gunzip: () => Gunzip,
  Gzip: () => Gzip,
  Inflate: () => Inflate,
  Unzip: () => Unzip,
  UnzipInflate: () => UnzipInflate,
  UnzipPassThrough: () => UnzipPassThrough,
  Unzlib: () => Unzlib,
  Zip: () => Zip,
  ZipDeflate: () => ZipDeflate,
  ZipPassThrough: () => ZipPassThrough,
  Zlib: () => Zlib,
  compress: () => gzip,
  compressSync: () => gzipSync,
  decompress: () => decompress,
  decompressSync: () => decompressSync,
  deflate: () => deflate,
  deflateSync: () => deflateSync,
  gunzip: () => gunzip,
  gunzipSync: () => gunzipSync,
  gzip: () => gzip,
  gzipSync: () => gzipSync,
  inflate: () => inflate,
  inflateSync: () => inflateSync,
  strFromU8: () => strFromU8,
  strToU8: () => strToU8,
  unzip: () => unzip,
  unzipSync: () => unzipSync,
  unzlib: () => unzlib,
  unzlibSync: () => unzlibSync,
  zip: () => zip,
  zipSync: () => zipSync,
  zlib: () => zlib,
  zlibSync: () => zlibSync
});
function StrmOpt(opts, cb) {
  if (typeof opts == "function")
    cb = opts, opts = {};
  this.ondata = cb;
  return opts;
}
function deflate(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt
  ], function(ev) {
    return pbf(deflateSync(ev.data[0], ev.data[1]));
  }, 0, cb);
}
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
function inflate(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt
  ], function(ev) {
    return pbf(inflateSync(ev.data[0], gopt(ev.data[1])));
  }, 1, cb);
}
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function gzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt,
    gze,
    function() {
      return [gzipSync];
    }
  ], function(ev) {
    return pbf(gzipSync(ev.data[0], ev.data[1]));
  }, 2, cb);
}
function gzipSync(data, opts) {
  if (!opts)
    opts = {};
  var c = crc(), l = data.length;
  c.p(data);
  var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
  return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
function gunzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt,
    guze,
    function() {
      return [gunzipSync];
    }
  ], function(ev) {
    return pbf(gunzipSync(ev.data[0], ev.data[1]));
  }, 3, cb);
}
function gunzipSync(data, opts) {
  var st = gzs(data);
  if (st + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
function zlib(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt,
    zle,
    function() {
      return [zlibSync];
    }
  ], function(ev) {
    return pbf(zlibSync(ev.data[0], ev.data[1]));
  }, 4, cb);
}
function zlibSync(data, opts) {
  if (!opts)
    opts = {};
  var a = adler();
  a.p(data);
  var d = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
  return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
function unzlib(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt,
    zule,
    function() {
      return [unzlibSync];
    }
  ], function(ev) {
    return pbf(unzlibSync(ev.data[0], gopt(ev.data[1])));
  }, 5, cb);
}
function unzlibSync(data, opts) {
  return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function decompress(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzip(data, opts, cb) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflate(data, opts, cb) : unzlib(data, opts, cb);
}
function decompressSync(data, opts) {
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, opts) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, opts) : unzlibSync(data, opts);
}
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i = 0; i < str.length; ++i)
      ar_1[i] = str.charCodeAt(i);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w = function(v) {
    ar[ai++] = v;
  };
  for (var i = 0; i < l; ++i) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i << 1));
      n.set(ar);
      ar = n;
    }
    var c = str.charCodeAt(i);
    if (c < 128 || latin1)
      w(c);
    else if (c < 2048)
      w(192 | c >> 6), w(128 | c & 63);
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
    else
      w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
  }
  return slc(ar, 0, ai);
}
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
function zip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var r = {};
  fltn(data, "", r, opts);
  var k = Object.keys(r);
  var lft = k.length, o = 0, tot = 0;
  var slft = lft, files = new Array(lft);
  var term = [];
  var tAll = function() {
    for (var i2 = 0; i2 < term.length; ++i2)
      term[i2]();
  };
  var cbd = function(a, b) {
    mt(function() {
      cb(a, b);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var cbf = function() {
    var out = new u8(tot + 22), oe = o, cdl = tot - o;
    tot = 0;
    for (var i2 = 0; i2 < slft; ++i2) {
      var f = files[i2];
      try {
        var l = f.c.length;
        wzh(out, tot, f, f.f, f.u, l);
        var badd = 30 + f.f.length + exfl(f.extra);
        var loc = tot + badd;
        out.set(f.c, loc);
        wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
      } catch (e) {
        return cbd(e, null);
      }
    }
    wzf(out, o, files.length, cdl, oe);
    cbd(null, out);
  };
  if (!lft)
    cbf();
  var _loop_1 = function(i2) {
    var fn = k[i2];
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var c = crc(), size = file.length;
    c.p(file);
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    var compression = p.level == 0 ? 0 : 8;
    var cbl = function(e, d) {
      if (e) {
        tAll();
        cbd(e, null);
      } else {
        var l = d.length;
        files[i2] = mrg(p, {
          size,
          crc: c.d(),
          c: d,
          f,
          m,
          u: s != fn.length || m && com.length != ms,
          compression
        });
        o += 30 + s + exl + l;
        tot += 76 + 2 * (s + exl) + (ms || 0) + l;
        if (!--lft)
          cbf();
      }
    };
    if (s > 65535)
      cbl(err(11, 0, 1), null);
    if (!compression)
      cbl(null, file);
    else if (size < 16e4) {
      try {
        cbl(null, deflateSync(file, p));
      } catch (e) {
        cbl(e, null);
      }
    } else
      term.push(deflate(file, p, cbl));
  };
  for (var i = 0; i < slft; ++i) {
    _loop_1(i);
  }
  return tAll;
}
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r = {};
  var files = [];
  fltn(data, "", r, opts);
  var o = 0;
  var tot = 0;
  for (var fn in r) {
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var compression = p.level == 0 ? 0 : 8;
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    if (s > 65535)
      err(11);
    var d = compression ? deflateSync(file, p) : file, l = d.length;
    var c = crc();
    c.p(file);
    files.push(mrg(p, {
      size: file.length,
      crc: c.d(),
      c: d,
      f,
      m,
      u: s != fn.length || m && com.length != ms,
      o,
      compression
    }));
    o += 30 + s + exl + l;
    tot += 76 + 2 * (s + exl) + (ms || 0) + l;
  }
  var out = new u8(tot + 22), oe = o, cdl = tot - o;
  for (var i = 0; i < files.length; ++i) {
    var f = files[i];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd);
    wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
  }
  wzf(out, o, files.length, cdl, oe);
  return out;
}
function unzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var term = [];
  var tAll = function() {
    for (var i2 = 0; i2 < term.length; ++i2)
      term[i2]();
  };
  var files = {};
  var cbd = function(a, b) {
    mt(function() {
      cb(a, b);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558) {
      cbd(err(13, 0, 1), null);
      return tAll;
    }
  }
  ;
  var lft = b2(data, e + 8);
  if (lft) {
    var c = lft;
    var o = b4(data, e + 16);
    var z = b4(data, e - 20) == 117853008;
    if (z) {
      var ze = b4(data, e - 12);
      z = b4(data, ze) == 101075792;
      if (z) {
        c = lft = b4(data, ze + 32);
        o = b4(data, ze + 48);
      }
    }
    var fltr = opts && opts.filter;
    var _loop_3 = function(i2) {
      var _a2 = zh(data, o, z), c_1 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
      o = no;
      var cbl = function(e2, d) {
        if (e2) {
          tAll();
          cbd(e2, null);
        } else {
          if (d)
            files[fn] = d;
          if (!--lft)
            cbd(null, files);
        }
      };
      if (!fltr || fltr({
        name: fn,
        size: sc,
        originalSize: su,
        compression: c_1
      })) {
        if (!c_1)
          cbl(null, slc(data, b, b + sc));
        else if (c_1 == 8) {
          var infl = data.subarray(b, b + sc);
          if (su < 524288 || sc > 0.8 * su) {
            try {
              cbl(null, inflateSync(infl, { out: new u8(su) }));
            } catch (e2) {
              cbl(e2, null);
            }
          } else
            term.push(inflate(infl, { size: su }, cbl));
        } else
          cbl(err(14, "unknown compression type " + c_1, 1), null);
      } else
        cbl(null, null);
    };
    for (var i = 0; i < c; ++i) {
      _loop_3(i);
    }
  } else
    cbd(null, {});
  return tAll;
}
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = b4(data, e - 20) == 117853008;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0; i < c; ++i) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}
var ch2, wk, u8, u16, i32, fleb, fdeb, clim, freb, _a, fl, revfl, _b, fd, revfd, rev, x, i, hMap, flt, i, i, i, i, fdt, i, flm, flrm, fdm, fdrm, max, bits, bits16, shft, slc, FlateErrorCode, ec, err, inflt, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, deo, et, dflt, crct, crc, adler, dopt, mrg, wcln, ch, cbfs, wrkr, bInflt, bDflt, gze, guze, zle, zule, pbf, gopt, cbify, astrm, astrmify, b2, b4, b8, wbytes, gzh, gzs, gzl, gzhl, zlh, zls, Deflate, AsyncDeflate, Inflate, AsyncInflate, Gzip, AsyncGzip, Gunzip, AsyncGunzip, Zlib, AsyncZlib, Unzlib, AsyncUnzlib, Decompress, AsyncDecompress, fltn, te, td, tds, dutf8, DecodeUTF8, EncodeUTF8, dbf, slzh, zh, z64hs, exfl, wzh, wzf, ZipPassThrough, ZipDeflate, AsyncZipDeflate, Zip, UnzipPassThrough, UnzipInflate, AsyncUnzipInflate, Unzip, mt;
var init_browser = __esm({
  "node_modules/fflate/esm/browser.js"() {
    ch2 = {};
    wk = (function(c, id, msg, transfer, cb) {
      var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
        c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
      ], { type: "text/javascript" }))));
      w.onmessage = function(e) {
        var d = e.data, ed = d.$e$;
        if (ed) {
          var err2 = new Error(ed[0]);
          err2["code"] = ed[1];
          err2.stack = ed[2];
          cb(err2, null);
        } else
          cb(null, d);
      };
      w.postMessage(msg, transfer);
      return w;
    });
    u8 = Uint8Array;
    u16 = Uint16Array;
    i32 = Int32Array;
    fleb = new u8([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      4,
      4,
      4,
      4,
      5,
      5,
      5,
      5,
      0,
      /* unused */
      0,
      0,
      /* impossible */
      0
    ]);
    fdeb = new u8([
      0,
      0,
      0,
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13,
      /* unused */
      0,
      0
    ]);
    clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    freb = function(eb, start) {
      var b = new u16(31);
      for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
      }
      var r = new i32(b[30]);
      for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
          r[j] = j - b[i] << 5 | i;
        }
      }
      return { b, r };
    };
    _a = freb(fleb, 2);
    fl = _a.b;
    revfl = _a.r;
    fl[28] = 258, revfl[258] = 28;
    _b = freb(fdeb, 0);
    fd = _b.b;
    revfd = _b.r;
    rev = new u16(32768);
    for (i = 0; i < 32768; ++i) {
      x = (i & 43690) >> 1 | (i & 21845) << 1;
      x = (x & 52428) >> 2 | (x & 13107) << 2;
      x = (x & 61680) >> 4 | (x & 3855) << 4;
      rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
    }
    hMap = (function(cd, mb, r) {
      var s = cd.length;
      var i = 0;
      var l = new u16(mb);
      for (; i < s; ++i) {
        if (cd[i])
          ++l[cd[i] - 1];
      }
      var le = new u16(mb);
      for (i = 1; i < mb; ++i) {
        le[i] = le[i - 1] + l[i - 1] << 1;
      }
      var co;
      if (r) {
        co = new u16(1 << mb);
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
          if (cd[i]) {
            var sv = i << 4 | cd[i];
            var r_1 = mb - cd[i];
            var v = le[cd[i] - 1]++ << r_1;
            for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
              co[rev[v] >> rvb] = sv;
            }
          }
        }
      } else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
          if (cd[i]) {
            co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
          }
        }
      }
      return co;
    });
    flt = new u8(288);
    for (i = 0; i < 144; ++i)
      flt[i] = 8;
    for (i = 144; i < 256; ++i)
      flt[i] = 9;
    for (i = 256; i < 280; ++i)
      flt[i] = 7;
    for (i = 280; i < 288; ++i)
      flt[i] = 8;
    fdt = new u8(32);
    for (i = 0; i < 32; ++i)
      fdt[i] = 5;
    flm = /* @__PURE__ */ hMap(flt, 9, 0);
    flrm = /* @__PURE__ */ hMap(flt, 9, 1);
    fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
    fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
    max = function(a) {
      var m = a[0];
      for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
          m = a[i];
      }
      return m;
    };
    bits = function(d, p, m) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
    };
    bits16 = function(d, p) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
    };
    shft = function(p) {
      return (p + 7) / 8 | 0;
    };
    slc = function(v, s, e) {
      if (s == null || s < 0)
        s = 0;
      if (e == null || e > v.length)
        e = v.length;
      return new u8(v.subarray(s, e));
    };
    FlateErrorCode = {
      UnexpectedEOF: 0,
      InvalidBlockType: 1,
      InvalidLengthLiteral: 2,
      InvalidDistance: 3,
      StreamFinished: 4,
      NoStreamHandler: 5,
      InvalidHeader: 6,
      NoCallback: 7,
      InvalidUTF8: 8,
      ExtraFieldTooLong: 9,
      InvalidDate: 10,
      FilenameTooLong: 11,
      StreamFinishing: 12,
      InvalidZipData: 13,
      UnknownCompressionMethod: 14
    };
    ec = [
      "unexpected EOF",
      "invalid block type",
      "invalid length/literal",
      "invalid distance",
      "stream finished",
      "no stream handler",
      ,
      // determined by compression function
      "no callback",
      "invalid UTF-8 data",
      "extra field too long",
      "date not in range 1980-2099",
      "filename too long",
      "stream finishing",
      "invalid zip data"
      // determined by unknown compression method
    ];
    err = function(ind, msg, nt) {
      var e = new Error(msg || ec[ind]);
      e.code = ind;
      if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
      if (!nt)
        throw e;
      return e;
    };
    inflt = function(dat, st, buf, dict) {
      var sl = dat.length, dl = dict ? dict.length : 0;
      if (!sl || st.f && !st.l)
        return buf || new u8(0);
      var noBuf = !buf;
      var resize = noBuf || st.i != 2;
      var noSt = st.i;
      if (noBuf)
        buf = new u8(sl * 3);
      var cbuf = function(l2) {
        var bl = buf.length;
        if (l2 > bl) {
          var nbuf = new u8(Math.max(bl * 2, l2));
          nbuf.set(buf);
          buf = nbuf;
        }
      };
      var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
      var tbts = sl * 8;
      do {
        if (!lm) {
          final = bits(dat, pos, 1);
          var type = bits(dat, pos + 1, 3);
          pos += 3;
          if (!type) {
            var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
            if (t > sl) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt + l);
            buf.set(dat.subarray(s, t), bt);
            st.b = bt += l, st.p = pos = t * 8, st.f = final;
            continue;
          } else if (type == 1)
            lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
          else if (type == 2) {
            var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
            var tl = hLit + bits(dat, pos + 5, 31) + 1;
            pos += 14;
            var ldt = new u8(tl);
            var clt = new u8(19);
            for (var i = 0; i < hcLen; ++i) {
              clt[clim[i]] = bits(dat, pos + i * 3, 7);
            }
            pos += hcLen * 3;
            var clb = max(clt), clbmsk = (1 << clb) - 1;
            var clm = hMap(clt, clb, 1);
            for (var i = 0; i < tl; ) {
              var r = clm[bits(dat, pos, clbmsk)];
              pos += r & 15;
              var s = r >> 4;
              if (s < 16) {
                ldt[i++] = s;
              } else {
                var c = 0, n = 0;
                if (s == 16)
                  n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                else if (s == 17)
                  n = 3 + bits(dat, pos, 7), pos += 3;
                else if (s == 18)
                  n = 11 + bits(dat, pos, 127), pos += 7;
                while (n--)
                  ldt[i++] = c;
              }
            }
            var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
            lbt = max(lt);
            dbt = max(dt);
            lm = hMap(lt, lbt, 1);
            dm = hMap(dt, dbt, 1);
          } else
            err(1);
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
        }
        if (resize)
          cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (; ; lpos = pos) {
          var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
          pos += c & 15;
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (!c)
            err(2);
          if (sym < 256)
            buf[bt++] = sym;
          else if (sym == 256) {
            lpos = pos, lm = null;
            break;
          } else {
            var add = sym - 254;
            if (sym > 264) {
              var i = sym - 257, b = fleb[i];
              add = bits(dat, pos, (1 << b) - 1) + fl[i];
              pos += b;
            }
            var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
            if (!d)
              err(3);
            pos += d & 15;
            var dt = fd[dsym];
            if (dsym > 3) {
              var b = fdeb[dsym];
              dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
            }
            if (pos > tbts) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt + 131072);
            var end = bt + add;
            if (bt < dt) {
              var shift = dl - dt, dend = Math.min(dt, end);
              if (shift + bt < 0)
                err(3);
              for (; bt < dend; ++bt)
                buf[bt] = dict[shift + bt];
            }
            for (; bt < end; ++bt)
              buf[bt] = buf[bt - dt];
          }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
          final = 1, st.m = lbt, st.d = dm, st.n = dbt;
      } while (!final);
      return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
    };
    wbits = function(d, p, v) {
      v <<= p & 7;
      var o = p / 8 | 0;
      d[o] |= v;
      d[o + 1] |= v >> 8;
    };
    wbits16 = function(d, p, v) {
      v <<= p & 7;
      var o = p / 8 | 0;
      d[o] |= v;
      d[o + 1] |= v >> 8;
      d[o + 2] |= v >> 16;
    };
    hTree = function(d, mb) {
      var t = [];
      for (var i = 0; i < d.length; ++i) {
        if (d[i])
          t.push({ s: i, f: d[i] });
      }
      var s = t.length;
      var t2 = t.slice();
      if (!s)
        return { t: et, l: 0 };
      if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return { t: v, l: 1 };
      }
      t.sort(function(a, b) {
        return a.f - b.f;
      });
      t.push({ s: -1, f: 25001 });
      var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
      t[0] = { s: -1, f: l.f + r.f, l, r };
      while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l, r };
      }
      var maxSym = t2[0].s;
      for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
          maxSym = t2[i].s;
      }
      var tr = new u16(maxSym + 1);
      var mbt = ln(t[i1 - 1], tr, 0);
      if (mbt > mb) {
        var i = 0, dt = 0;
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function(a, b) {
          return tr[b.s] - tr[a.s] || a.f - b.f;
        });
        for (; i < s; ++i) {
          var i2_1 = t2[i].s;
          if (tr[i2_1] > mb) {
            dt += cst - (1 << mbt - tr[i2_1]);
            tr[i2_1] = mb;
          } else
            break;
        }
        dt >>= lft;
        while (dt > 0) {
          var i2_2 = t2[i].s;
          if (tr[i2_2] < mb)
            dt -= 1 << mb - tr[i2_2]++ - 1;
          else
            ++i;
        }
        for (; i >= 0 && dt; --i) {
          var i2_3 = t2[i].s;
          if (tr[i2_3] == mb) {
            --tr[i2_3];
            ++dt;
          }
        }
        mbt = mb;
      }
      return { t: new u8(tr), l: mbt };
    };
    ln = function(n, l, d) {
      return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
    };
    lc = function(c) {
      var s = c.length;
      while (s && !c[--s])
        ;
      var cl = new u16(++s);
      var cli = 0, cln = c[0], cls = 1;
      var w = function(v) {
        cl[cli++] = v;
      };
      for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
          ++cls;
        else {
          if (!cln && cls > 2) {
            for (; cls > 138; cls -= 138)
              w(32754);
            if (cls > 2) {
              w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
              cls = 0;
            }
          } else if (cls > 3) {
            w(cln), --cls;
            for (; cls > 6; cls -= 6)
              w(8304);
            if (cls > 2)
              w(cls - 3 << 5 | 8208), cls = 0;
          }
          while (cls--)
            w(cln);
          cls = 1;
          cln = c[i];
        }
      }
      return { c: cl.subarray(0, cli), n: s };
    };
    clen = function(cf, cl) {
      var l = 0;
      for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
      return l;
    };
    wfblk = function(out, pos, dat) {
      var s = dat.length;
      var o = shft(pos + 2);
      out[o] = s & 255;
      out[o + 1] = s >> 8;
      out[o + 2] = out[o] ^ 255;
      out[o + 3] = out[o + 1] ^ 255;
      for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
      return (o + 4 + s) * 8;
    };
    wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
      wbits(out, p++, final);
      ++lf[256];
      var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
      var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
      var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
      var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
      var lcfreq = new u16(19);
      for (var i = 0; i < lclt.length; ++i)
        ++lcfreq[lclt[i] & 31];
      for (var i = 0; i < lcdt.length; ++i)
        ++lcfreq[lcdt[i] & 31];
      var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
      var nlcc = 19;
      for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
      var flen = bl + 5 << 3;
      var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
      var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
      if (bs >= 0 && flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
      var lm, ll, dm, dl;
      wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
      if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
          wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
          var clct = lcts[it];
          for (var i = 0; i < clct.length; ++i) {
            var len = clct[i] & 31;
            wbits(out, p, llm[len]), p += lct[len];
            if (len > 15)
              wbits(out, p, clct[i] >> 5 & 127), p += clct[i] >> 12;
          }
        }
      } else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
      }
      for (var i = 0; i < li; ++i) {
        var sym = syms[i];
        if (sym > 255) {
          var len = sym >> 18 & 31;
          wbits16(out, p, lm[len + 257]), p += ll[len + 257];
          if (len > 7)
            wbits(out, p, sym >> 23 & 31), p += fleb[len];
          var dst = sym & 31;
          wbits16(out, p, dm[dst]), p += dl[dst];
          if (dst > 3)
            wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
        } else {
          wbits16(out, p, lm[sym]), p += ll[sym];
        }
      }
      wbits16(out, p, lm[256]);
      return p + ll[256];
    };
    deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
    et = /* @__PURE__ */ new u8(0);
    dflt = function(dat, lvl, plvl, pre, post, st) {
      var s = st.z || dat.length;
      var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
      var w = o.subarray(pre, o.length - post);
      var lst = st.l;
      var pos = (st.r || 0) & 7;
      if (lvl) {
        if (pos)
          w[0] = st.r >> 3;
        var opt = deo[lvl - 1];
        var n = opt >> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function(i2) {
          return (dat[i2] ^ dat[i2 + 1] << bs1_1 ^ dat[i2 + 2] << bs2_1) & msk_1;
        };
        var syms = new i32(25e3);
        var lf = new u16(288), df = new u16(32);
        var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
        for (; i + 2 < s; ++i) {
          var hv = hsh(i);
          var imod = i & 32767, pimod = head[hv];
          prev[imod] = pimod;
          head[hv] = imod;
          if (wi <= i) {
            var rem = s - i;
            if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
              pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
              li = lc_1 = eb = 0, bs = i;
              for (var j = 0; j < 286; ++j)
                lf[j] = 0;
              for (var j = 0; j < 30; ++j)
                df[j] = 0;
            }
            var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
            if (rem > 2 && hv == hsh(i - dif)) {
              var maxn = Math.min(n, rem) - 1;
              var maxd = Math.min(32767, i);
              var ml = Math.min(258, rem);
              while (dif <= maxd && --ch_1 && imod != pimod) {
                if (dat[i + l] == dat[i + l - dif]) {
                  var nl = 0;
                  for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                    ;
                  if (nl > l) {
                    l = nl, d = dif;
                    if (nl > maxn)
                      break;
                    var mmd = Math.min(dif, nl - 2);
                    var md = 0;
                    for (var j = 0; j < mmd; ++j) {
                      var ti = i - dif + j & 32767;
                      var pti = prev[ti];
                      var cd = ti - pti & 32767;
                      if (cd > md)
                        md = cd, pimod = ti;
                    }
                  }
                }
                imod = pimod, pimod = prev[imod];
                dif += imod - pimod & 32767;
              }
            }
            if (d) {
              syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
              var lin = revfl[l] & 31, din = revfd[d] & 31;
              eb += fleb[lin] + fdeb[din];
              ++lf[257 + lin];
              ++df[din];
              wi = i + l;
              ++lc_1;
            } else {
              syms[li++] = dat[i];
              ++lf[dat[i]];
            }
          }
        }
        for (i = Math.max(i, wi); i < s; ++i) {
          syms[li++] = dat[i];
          ++lf[dat[i]];
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        if (!lst) {
          st.r = pos & 7 | w[pos / 8 | 0] << 3;
          pos -= 7;
          st.h = head, st.p = prev, st.i = i, st.w = wi;
        }
      } else {
        for (var i = st.w || 0; i < s + lst; i += 65535) {
          var e = i + 65535;
          if (e >= s) {
            w[pos / 8 | 0] = lst;
            e = s;
          }
          pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
        st.i = s;
      }
      return slc(o, 0, pre + shft(pos) + post);
    };
    crct = /* @__PURE__ */ (function() {
      var t = new Int32Array(256);
      for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
          c = (c & 1 && -306674912) ^ c >>> 1;
        t[i] = c;
      }
      return t;
    })();
    crc = function() {
      var c = -1;
      return {
        p: function(d) {
          var cr = c;
          for (var i = 0; i < d.length; ++i)
            cr = crct[cr & 255 ^ d[i]] ^ cr >>> 8;
          c = cr;
        },
        d: function() {
          return ~c;
        }
      };
    };
    adler = function() {
      var a = 1, b = 0;
      return {
        p: function(d) {
          var n = a, m = b;
          var l = d.length | 0;
          for (var i = 0; i != l; ) {
            var e = Math.min(i + 2655, l);
            for (; i < e; ++i)
              m += n += d[i];
            n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
          }
          a = n, b = m;
        },
        d: function() {
          a %= 65521, b %= 65521;
          return (a & 255) << 24 | (a & 65280) << 8 | (b & 255) << 8 | b >> 8;
        }
      };
    };
    dopt = function(dat, opt, pre, post, st) {
      if (!st) {
        st = { l: 1 };
        if (opt.dictionary) {
          var dict = opt.dictionary.subarray(-32768);
          var newDat = new u8(dict.length + dat.length);
          newDat.set(dict);
          newDat.set(dat, dict.length);
          dat = newDat;
          st.w = dict.length;
        }
      }
      return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
    };
    mrg = function(a, b) {
      var o = {};
      for (var k in a)
        o[k] = a[k];
      for (var k in b)
        o[k] = b[k];
      return o;
    };
    wcln = function(fn, fnStr, td2) {
      var dt = fn();
      var st = fn.toString();
      var ks = st.slice(st.indexOf("[") + 1, st.lastIndexOf("]")).replace(/\s+/g, "").split(",");
      for (var i = 0; i < dt.length; ++i) {
        var v = dt[i], k = ks[i];
        if (typeof v == "function") {
          fnStr += ";" + k + "=";
          var st_1 = v.toString();
          if (v.prototype) {
            if (st_1.indexOf("[native code]") != -1) {
              var spInd = st_1.indexOf(" ", 8) + 1;
              fnStr += st_1.slice(spInd, st_1.indexOf("(", spInd));
            } else {
              fnStr += st_1;
              for (var t in v.prototype)
                fnStr += ";" + k + ".prototype." + t + "=" + v.prototype[t].toString();
            }
          } else
            fnStr += st_1;
        } else
          td2[k] = v;
      }
      return fnStr;
    };
    ch = [];
    cbfs = function(v) {
      var tl = [];
      for (var k in v) {
        if (v[k].buffer) {
          tl.push((v[k] = new v[k].constructor(v[k])).buffer);
        }
      }
      return tl;
    };
    wrkr = function(fns, init, id, cb) {
      if (!ch[id]) {
        var fnStr = "", td_1 = {}, m = fns.length - 1;
        for (var i = 0; i < m; ++i)
          fnStr = wcln(fns[i], fnStr, td_1);
        ch[id] = { c: wcln(fns[m], fnStr, td_1), e: td_1 };
      }
      var td2 = mrg({}, ch[id].e);
      return wk(ch[id].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + init.toString() + "}", id, td2, cbfs(td2), cb);
    };
    bInflt = function() {
      return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt];
    };
    bDflt = function() {
      return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf];
    };
    gze = function() {
      return [gzh, gzhl, wbytes, crc, crct];
    };
    guze = function() {
      return [gzs, gzl];
    };
    zle = function() {
      return [zlh, wbytes, adler];
    };
    zule = function() {
      return [zls];
    };
    pbf = function(msg) {
      return postMessage(msg, [msg.buffer]);
    };
    gopt = function(o) {
      return o && {
        out: o.size && new u8(o.size),
        dictionary: o.dictionary
      };
    };
    cbify = function(dat, opts, fns, init, id, cb) {
      var w = wrkr(fns, init, id, function(err2, dat2) {
        w.terminate();
        cb(err2, dat2);
      });
      w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
      return function() {
        w.terminate();
      };
    };
    astrm = function(strm) {
      strm.ondata = function(dat, final) {
        return postMessage([dat, final], [dat.buffer]);
      };
      return function(ev) {
        if (ev.data[0]) {
          strm.push(ev.data[0], ev.data[1]);
          postMessage([ev.data[0].length]);
        } else
          strm.flush(ev.data[1]);
      };
    };
    astrmify = function(fns, strm, opts, init, id, flush, ext) {
      var t;
      var w = wrkr(fns, init, id, function(err2, dat) {
        if (err2)
          w.terminate(), strm.ondata.call(strm, err2);
        else if (!Array.isArray(dat))
          ext(dat);
        else if (dat.length == 1) {
          strm.queuedSize -= dat[0];
          if (strm.ondrain)
            strm.ondrain(dat[0]);
        } else {
          if (dat[1])
            w.terminate();
          strm.ondata.call(strm, err2, dat[0], dat[1]);
        }
      });
      w.postMessage(opts);
      strm.queuedSize = 0;
      strm.push = function(d, f) {
        if (!strm.ondata)
          err(5);
        if (t)
          strm.ondata(err(4, 0, 1), null, !!f);
        strm.queuedSize += d.length;
        w.postMessage([d, t = f], d.buffer instanceof ArrayBuffer ? [d.buffer] : []);
      };
      strm.terminate = function() {
        w.terminate();
      };
      if (flush) {
        strm.flush = function(sync) {
          w.postMessage([0, sync]);
        };
      }
    };
    b2 = function(d, b) {
      return d[b] | d[b + 1] << 8;
    };
    b4 = function(d, b) {
      return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
    };
    b8 = function(d, b) {
      return b4(d, b) + b4(d, b + 4) * 4294967296;
    };
    wbytes = function(d, b, v) {
      for (; v; ++b)
        d[b] = v, v >>>= 8;
    };
    gzh = function(c, o) {
      var fn = o.filename;
      c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3;
      if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1e3));
      if (fn) {
        c[3] = 8;
        for (var i = 0; i <= fn.length; ++i)
          c[i + 10] = fn.charCodeAt(i);
      }
    };
    gzs = function(d) {
      if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        err(6, "invalid gzip data");
      var flg = d[3];
      var st = 10;
      if (flg & 4)
        st += (d[10] | d[11] << 8) + 2;
      for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
      return st + (flg & 2);
    };
    gzl = function(d) {
      var l = d.length;
      return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
    };
    gzhl = function(o) {
      return 10 + (o.filename ? o.filename.length + 1 : 0);
    };
    zlh = function(c, o) {
      var lv = o.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
      c[0] = 120, c[1] = fl2 << 6 | (o.dictionary && 32);
      c[1] |= 31 - (c[0] << 8 | c[1]) % 31;
      if (o.dictionary) {
        var h = adler();
        h.p(o.dictionary);
        wbytes(c, 2, h.d());
      }
    };
    zls = function(d, dict) {
      if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || (d[0] << 8 | d[1]) % 31)
        err(6, "invalid zlib data");
      if ((d[1] >> 5 & 1) == +!dict)
        err(6, "invalid zlib data: " + (d[1] & 32 ? "need" : "unexpected") + " dictionary");
      return (d[1] >> 3 & 4) + 2;
    };
    Deflate = /* @__PURE__ */ (function() {
      function Deflate2(opts, cb) {
        if (typeof opts == "function")
          cb = opts, opts = {};
        this.ondata = cb;
        this.o = opts || {};
        this.s = { l: 0, i: 32768, w: 32768, z: 32768 };
        this.b = new u8(98304);
        if (this.o.dictionary) {
          var dict = this.o.dictionary.subarray(-32768);
          this.b.set(dict, 32768 - dict.length);
          this.s.i = 32768 - dict.length;
        }
      }
      Deflate2.prototype.p = function(c, f) {
        this.ondata(dopt(c, this.o, 0, 0, this.s), f);
      };
      Deflate2.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        if (this.s.l)
          err(4);
        var endLen = chunk.length + this.s.z;
        if (endLen > this.b.length) {
          if (endLen > 2 * this.b.length - 32768) {
            var newBuf = new u8(endLen & -32768);
            newBuf.set(this.b.subarray(0, this.s.z));
            this.b = newBuf;
          }
          var split = this.b.length - this.s.z;
          this.b.set(chunk.subarray(0, split), this.s.z);
          this.s.z = this.b.length;
          this.p(this.b, false);
          this.b.set(this.b.subarray(-32768));
          this.b.set(chunk.subarray(split), 32768);
          this.s.z = chunk.length - split + 32768;
          this.s.i = 32766, this.s.w = 32768;
        } else {
          this.b.set(chunk, this.s.z);
          this.s.z += chunk.length;
        }
        this.s.l = final & 1;
        if (this.s.z > this.s.w + 8191 || final) {
          this.p(this.b, final || false);
          this.s.w = this.s.i, this.s.i -= 2;
        }
        if (final) {
          this.s = this.o = {};
          this.b = et;
        }
      };
      Deflate2.prototype.flush = function(sync) {
        if (!this.ondata)
          err(5);
        if (this.s.l)
          err(4);
        this.p(this.b, false);
        this.s.w = this.s.i, this.s.i -= 2;
        if (sync) {
          var c = new u8(6);
          c[0] = this.s.r >> 3;
          var ep = wfblk(c, this.s.r, et);
          this.s.r = 0;
          this.ondata(c.subarray(0, ep >> 3), false);
        }
      };
      return Deflate2;
    })();
    AsyncDeflate = /* @__PURE__ */ (function() {
      function AsyncDeflate2(opts, cb) {
        astrmify([
          bDflt,
          function() {
            return [astrm, Deflate];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Deflate(ev.data);
          onmessage = astrm(strm);
        }, 6, 1);
      }
      return AsyncDeflate2;
    })();
    Inflate = /* @__PURE__ */ (function() {
      function Inflate2(opts, cb) {
        if (typeof opts == "function")
          cb = opts, opts = {};
        this.ondata = cb;
        var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
        this.s = { i: 0, b: dict ? dict.length : 0 };
        this.o = new u8(32768);
        this.p = new u8(0);
        if (dict)
          this.o.set(dict);
      }
      Inflate2.prototype.e = function(c) {
        if (!this.ondata)
          err(5);
        if (this.d)
          err(4);
        if (!this.p.length)
          this.p = c;
        else if (c.length) {
          var n = new u8(this.p.length + c.length);
          n.set(this.p), n.set(c, this.p.length), this.p = n;
        }
      };
      Inflate2.prototype.c = function(final) {
        this.s.i = +(this.d = final || false);
        var bts = this.s.b;
        var dt = inflt(this.p, this.s, this.o);
        this.ondata(slc(dt, bts, this.s.b), this.d);
        this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
        this.p = slc(this.p, this.s.p / 8 | 0), this.s.p &= 7;
      };
      Inflate2.prototype.push = function(chunk, final) {
        this.e(chunk), this.c(final);
      };
      return Inflate2;
    })();
    AsyncInflate = /* @__PURE__ */ (function() {
      function AsyncInflate2(opts, cb) {
        astrmify([
          bInflt,
          function() {
            return [astrm, Inflate];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Inflate(ev.data);
          onmessage = astrm(strm);
        }, 7, 0);
      }
      return AsyncInflate2;
    })();
    Gzip = /* @__PURE__ */ (function() {
      function Gzip2(opts, cb) {
        this.c = crc();
        this.l = 0;
        this.v = 1;
        Deflate.call(this, opts, cb);
      }
      Gzip2.prototype.push = function(chunk, final) {
        this.c.p(chunk);
        this.l += chunk.length;
        Deflate.prototype.push.call(this, chunk, final);
      };
      Gzip2.prototype.p = function(c, f) {
        var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, this.s);
        if (this.v)
          gzh(raw, this.o), this.v = 0;
        if (f)
          wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
        this.ondata(raw, f);
      };
      Gzip2.prototype.flush = function(sync) {
        Deflate.prototype.flush.call(this, sync);
      };
      return Gzip2;
    })();
    AsyncGzip = /* @__PURE__ */ (function() {
      function AsyncGzip2(opts, cb) {
        astrmify([
          bDflt,
          gze,
          function() {
            return [astrm, Deflate, Gzip];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Gzip(ev.data);
          onmessage = astrm(strm);
        }, 8, 1);
      }
      return AsyncGzip2;
    })();
    Gunzip = /* @__PURE__ */ (function() {
      function Gunzip2(opts, cb) {
        this.v = 1;
        this.r = 0;
        Inflate.call(this, opts, cb);
      }
      Gunzip2.prototype.push = function(chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        this.r += chunk.length;
        if (this.v) {
          var p = this.p.subarray(this.v - 1);
          var s = p.length > 3 ? gzs(p) : 4;
          if (s > p.length) {
            if (!final)
              return;
          } else if (this.v > 1 && this.onmember) {
            this.onmember(this.r - p.length);
          }
          this.p = p.subarray(s), this.v = 0;
        }
        Inflate.prototype.c.call(this, 0);
        if (this.s.f && !this.s.l) {
          this.v = shft(this.s.p) + 9;
          this.s = { i: 0 };
          this.o = new u8(0);
          this.push(new u8(0), final);
        } else if (final) {
          Inflate.prototype.c.call(this, final);
        }
      };
      return Gunzip2;
    })();
    AsyncGunzip = /* @__PURE__ */ (function() {
      function AsyncGunzip2(opts, cb) {
        var _this = this;
        astrmify([
          bInflt,
          guze,
          function() {
            return [astrm, Inflate, Gunzip];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Gunzip(ev.data);
          strm.onmember = function(offset) {
            return postMessage(offset);
          };
          onmessage = astrm(strm);
        }, 9, 0, function(offset) {
          return _this.onmember && _this.onmember(offset);
        });
      }
      return AsyncGunzip2;
    })();
    Zlib = /* @__PURE__ */ (function() {
      function Zlib2(opts, cb) {
        this.c = adler();
        this.v = 1;
        Deflate.call(this, opts, cb);
      }
      Zlib2.prototype.push = function(chunk, final) {
        this.c.p(chunk);
        Deflate.prototype.push.call(this, chunk, final);
      };
      Zlib2.prototype.p = function(c, f) {
        var raw = dopt(c, this.o, this.v && (this.o.dictionary ? 6 : 2), f && 4, this.s);
        if (this.v)
          zlh(raw, this.o), this.v = 0;
        if (f)
          wbytes(raw, raw.length - 4, this.c.d());
        this.ondata(raw, f);
      };
      Zlib2.prototype.flush = function(sync) {
        Deflate.prototype.flush.call(this, sync);
      };
      return Zlib2;
    })();
    AsyncZlib = /* @__PURE__ */ (function() {
      function AsyncZlib2(opts, cb) {
        astrmify([
          bDflt,
          zle,
          function() {
            return [astrm, Deflate, Zlib];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Zlib(ev.data);
          onmessage = astrm(strm);
        }, 10, 1);
      }
      return AsyncZlib2;
    })();
    Unzlib = /* @__PURE__ */ (function() {
      function Unzlib2(opts, cb) {
        Inflate.call(this, opts, cb);
        this.v = opts && opts.dictionary ? 2 : 1;
      }
      Unzlib2.prototype.push = function(chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
          if (this.p.length < 6 && !final)
            return;
          this.p = this.p.subarray(zls(this.p, this.v - 1)), this.v = 0;
        }
        if (final) {
          if (this.p.length < 4)
            err(6, "invalid zlib data");
          this.p = this.p.subarray(0, -4);
        }
        Inflate.prototype.c.call(this, final);
      };
      return Unzlib2;
    })();
    AsyncUnzlib = /* @__PURE__ */ (function() {
      function AsyncUnzlib2(opts, cb) {
        astrmify([
          bInflt,
          zule,
          function() {
            return [astrm, Inflate, Unzlib];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Unzlib(ev.data);
          onmessage = astrm(strm);
        }, 11, 0);
      }
      return AsyncUnzlib2;
    })();
    Decompress = /* @__PURE__ */ (function() {
      function Decompress2(opts, cb) {
        this.o = StrmOpt.call(this, opts, cb) || {};
        this.G = Gunzip;
        this.I = Inflate;
        this.Z = Unzlib;
      }
      Decompress2.prototype.i = function() {
        var _this = this;
        this.s.ondata = function(dat, final) {
          _this.ondata(dat, final);
        };
      };
      Decompress2.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        if (!this.s) {
          if (this.p && this.p.length) {
            var n = new u8(this.p.length + chunk.length);
            n.set(this.p), n.set(chunk, this.p.length);
          } else
            this.p = chunk;
          if (this.p.length > 2) {
            this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(this.o) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(this.o) : new this.Z(this.o);
            this.i();
            this.s.push(this.p, final);
            this.p = null;
          }
        } else
          this.s.push(chunk, final);
      };
      return Decompress2;
    })();
    AsyncDecompress = /* @__PURE__ */ (function() {
      function AsyncDecompress2(opts, cb) {
        Decompress.call(this, opts, cb);
        this.queuedSize = 0;
        this.G = AsyncGunzip;
        this.I = AsyncInflate;
        this.Z = AsyncUnzlib;
      }
      AsyncDecompress2.prototype.i = function() {
        var _this = this;
        this.s.ondata = function(err2, dat, final) {
          _this.ondata(err2, dat, final);
        };
        this.s.ondrain = function(size) {
          _this.queuedSize -= size;
          if (_this.ondrain)
            _this.ondrain(size);
        };
      };
      AsyncDecompress2.prototype.push = function(chunk, final) {
        this.queuedSize += chunk.length;
        Decompress.prototype.push.call(this, chunk, final);
      };
      return AsyncDecompress2;
    })();
    fltn = function(d, p, t, o) {
      for (var k in d) {
        var val = d[k], n = p + k, op = o;
        if (Array.isArray(val))
          op = mrg(o, val[1]), val = val[0];
        if (ArrayBuffer.isView(val))
          t[n] = [val, op];
        else {
          t[n += "/"] = [new u8(0), op];
          fltn(val, n, t, o);
        }
      }
    };
    te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
    td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
    tds = 0;
    try {
      td.decode(et, { stream: true });
      tds = 1;
    } catch (e) {
    }
    dutf8 = function(d) {
      for (var r = "", i = 0; ; ) {
        var c = d[i++];
        var eb = (c > 127) + (c > 223) + (c > 239);
        if (i + eb > d.length)
          return { s: r, r: slc(d, i - 1) };
        if (!eb)
          r += String.fromCharCode(c);
        else if (eb == 3) {
          c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
        } else if (eb & 1)
          r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
        else
          r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
      }
    };
    DecodeUTF8 = /* @__PURE__ */ (function() {
      function DecodeUTF82(cb) {
        this.ondata = cb;
        if (tds)
          this.t = new TextDecoder();
        else
          this.p = et;
      }
      DecodeUTF82.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        final = !!final;
        if (this.t) {
          this.ondata(this.t.decode(chunk, { stream: true }), final);
          if (final) {
            if (this.t.decode().length)
              err(8);
            this.t = null;
          }
          return;
        }
        if (!this.p)
          err(4);
        var dat = new u8(this.p.length + chunk.length);
        dat.set(this.p);
        dat.set(chunk, this.p.length);
        var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
        if (final) {
          if (r.length)
            err(8);
          this.p = null;
        } else
          this.p = r;
        this.ondata(s, final);
      };
      return DecodeUTF82;
    })();
    EncodeUTF8 = /* @__PURE__ */ (function() {
      function EncodeUTF82(cb) {
        this.ondata = cb;
      }
      EncodeUTF82.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        if (this.d)
          err(4);
        this.ondata(strToU8(chunk), this.d = final || false);
      };
      return EncodeUTF82;
    })();
    dbf = function(l) {
      return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0;
    };
    slzh = function(d, b) {
      return b + 30 + b2(d, b + 26) + b2(d, b + 28);
    };
    zh = function(d, b, z) {
      var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
      var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
      return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
    };
    z64hs = function(d, b, l, z, sc, su, off) {
      var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
      var nf = nsc + nsu + noff;
      if (z && nf) {
        for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
          if (b2(d, b) == 1) {
            return [
              nsc ? b8(d, b + 4 + 8 * nsu) : sc,
              nsu ? b8(d, b + 4) : su,
              noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
              1
            ];
          }
        }
        if (z < 2)
          err(13);
      }
      return [sc, su, off, 0];
    };
    exfl = function(ex) {
      var le = 0;
      if (ex) {
        for (var k in ex) {
          var l = ex[k].length;
          if (l > 65535)
            err(9);
          le += l + 4;
        }
      }
      return le;
    };
    wzh = function(d, b, f, fn, u, c, ce, co) {
      var fl2 = fn.length, ex = f.extra, col = co && co.length;
      var exl = exfl(ex);
      wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
      if (ce != null)
        d[b++] = 20, d[b++] = f.os;
      d[b] = 20, b += 2;
      d[b++] = f.flag << 1 | (c < 0 && 8), d[b++] = u && 8;
      d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
      var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
      if (y < 0 || y > 119)
        err(10);
      wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
      if (c != -1) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c < 0 ? -c - 2 : c);
        wbytes(d, b + 8, f.size);
      }
      wbytes(d, b + 12, fl2);
      wbytes(d, b + 14, exl), b += 16;
      if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
      }
      d.set(fn, b);
      b += fl2;
      if (exl) {
        for (var k in ex) {
          var exf = ex[k], l = exf.length;
          wbytes(d, b, +k);
          wbytes(d, b + 2, l);
          d.set(exf, b + 4), b += 4 + l;
        }
      }
      if (col)
        d.set(co, b), b += col;
      return b;
    };
    wzf = function(o, b, c, d, e) {
      wbytes(o, b, 101010256);
      wbytes(o, b + 8, c);
      wbytes(o, b + 10, c);
      wbytes(o, b + 12, d);
      wbytes(o, b + 16, e);
    };
    ZipPassThrough = /* @__PURE__ */ (function() {
      function ZipPassThrough2(filename) {
        this.filename = filename;
        this.c = crc();
        this.size = 0;
        this.compression = 0;
      }
      ZipPassThrough2.prototype.process = function(chunk, final) {
        this.ondata(null, chunk, final);
      };
      ZipPassThrough2.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        this.c.p(chunk);
        this.size += chunk.length;
        if (final)
          this.crc = this.c.d();
        this.process(chunk, final || false);
      };
      return ZipPassThrough2;
    })();
    ZipDeflate = /* @__PURE__ */ (function() {
      function ZipDeflate2(filename, opts) {
        var _this = this;
        if (!opts)
          opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new Deflate(opts, function(dat, final) {
          _this.ondata(null, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
      }
      ZipDeflate2.prototype.process = function(chunk, final) {
        try {
          this.d.push(chunk, final);
        } catch (e) {
          this.ondata(e, null, final);
        }
      };
      ZipDeflate2.prototype.push = function(chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
      };
      return ZipDeflate2;
    })();
    AsyncZipDeflate = /* @__PURE__ */ (function() {
      function AsyncZipDeflate2(filename, opts) {
        var _this = this;
        if (!opts)
          opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new AsyncDeflate(opts, function(err2, dat, final) {
          _this.ondata(err2, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
        this.terminate = this.d.terminate;
      }
      AsyncZipDeflate2.prototype.process = function(chunk, final) {
        this.d.push(chunk, final);
      };
      AsyncZipDeflate2.prototype.push = function(chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
      };
      return AsyncZipDeflate2;
    })();
    Zip = /* @__PURE__ */ (function() {
      function Zip2(cb) {
        this.ondata = cb;
        this.u = [];
        this.d = 1;
      }
      Zip2.prototype.add = function(file) {
        var _this = this;
        if (!this.ondata)
          err(5);
        if (this.d & 2)
          this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
        else {
          var f = strToU8(file.filename), fl_1 = f.length;
          var com = file.comment, o = com && strToU8(com);
          var u = fl_1 != file.filename.length || o && com.length != o.length;
          var hl_1 = fl_1 + exfl(file.extra) + 30;
          if (fl_1 > 65535)
            this.ondata(err(11, 0, 1), null, false);
          var header = new u8(hl_1);
          wzh(header, 0, file, f, u, -1);
          var chks_1 = [header];
          var pAll_1 = function() {
            for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
              var chk = chks_2[_i];
              _this.ondata(null, chk, false);
            }
            chks_1 = [];
          };
          var tr_1 = this.d;
          this.d = 0;
          var ind_1 = this.u.length;
          var uf_1 = mrg(file, {
            f,
            u,
            o,
            t: function() {
              if (file.terminate)
                file.terminate();
            },
            r: function() {
              pAll_1();
              if (tr_1) {
                var nxt = _this.u[ind_1 + 1];
                if (nxt)
                  nxt.r();
                else
                  _this.d = 1;
              }
              tr_1 = 1;
            }
          });
          var cl_1 = 0;
          file.ondata = function(err2, dat, final) {
            if (err2) {
              _this.ondata(err2, dat, final);
              _this.terminate();
            } else {
              cl_1 += dat.length;
              chks_1.push(dat);
              if (final) {
                var dd = new u8(16);
                wbytes(dd, 0, 134695760);
                wbytes(dd, 4, file.crc);
                wbytes(dd, 8, cl_1);
                wbytes(dd, 12, file.size);
                chks_1.push(dd);
                uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                if (tr_1)
                  uf_1.r();
                tr_1 = 1;
              } else if (tr_1)
                pAll_1();
            }
          };
          this.u.push(uf_1);
        }
      };
      Zip2.prototype.end = function() {
        var _this = this;
        if (this.d & 2) {
          this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
          return;
        }
        if (this.d)
          this.e();
        else
          this.u.push({
            r: function() {
              if (!(_this.d & 1))
                return;
              _this.u.splice(-1, 1);
              _this.e();
            },
            t: function() {
            }
          });
        this.d = 3;
      };
      Zip2.prototype.e = function() {
        var bt = 0, l = 0, tl = 0;
        for (var _i = 0, _a2 = this.u; _i < _a2.length; _i++) {
          var f = _a2[_i];
          tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b2 = 0, _c = this.u; _b2 < _c.length; _b2++) {
          var f = _c[_b2];
          wzh(out, bt, f, f.f, f.u, -f.c - 2, l, f.o);
          bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
        }
        wzf(out, bt, this.u.length, tl, l);
        this.ondata(null, out, true);
        this.d = 2;
      };
      Zip2.prototype.terminate = function() {
        for (var _i = 0, _a2 = this.u; _i < _a2.length; _i++) {
          var f = _a2[_i];
          f.t();
        }
        this.d = 2;
      };
      return Zip2;
    })();
    UnzipPassThrough = /* @__PURE__ */ (function() {
      function UnzipPassThrough2() {
      }
      UnzipPassThrough2.prototype.push = function(chunk, final) {
        this.ondata(null, chunk, final);
      };
      UnzipPassThrough2.compression = 0;
      return UnzipPassThrough2;
    })();
    UnzipInflate = /* @__PURE__ */ (function() {
      function UnzipInflate2() {
        var _this = this;
        this.i = new Inflate(function(dat, final) {
          _this.ondata(null, dat, final);
        });
      }
      UnzipInflate2.prototype.push = function(chunk, final) {
        try {
          this.i.push(chunk, final);
        } catch (e) {
          this.ondata(e, null, final);
        }
      };
      UnzipInflate2.compression = 8;
      return UnzipInflate2;
    })();
    AsyncUnzipInflate = /* @__PURE__ */ (function() {
      function AsyncUnzipInflate2(_, sz) {
        var _this = this;
        if (sz < 32e4) {
          this.i = new Inflate(function(dat, final) {
            _this.ondata(null, dat, final);
          });
        } else {
          this.i = new AsyncInflate(function(err2, dat, final) {
            _this.ondata(err2, dat, final);
          });
          this.terminate = this.i.terminate;
        }
      }
      AsyncUnzipInflate2.prototype.push = function(chunk, final) {
        if (this.i.terminate)
          chunk = slc(chunk, 0);
        this.i.push(chunk, final);
      };
      AsyncUnzipInflate2.compression = 8;
      return AsyncUnzipInflate2;
    })();
    Unzip = /* @__PURE__ */ (function() {
      function Unzip2(cb) {
        this.onfile = cb;
        this.k = [];
        this.o = {
          0: UnzipPassThrough
        };
        this.p = et;
      }
      Unzip2.prototype.push = function(chunk, final) {
        var _this = this;
        if (!this.onfile)
          err(5);
        if (!this.p)
          err(4);
        if (this.c > 0) {
          var len = Math.min(this.c, chunk.length);
          var toAdd = chunk.subarray(0, len);
          this.c -= len;
          if (this.d)
            this.d.push(toAdd, !this.c);
          else
            this.k[0].push(toAdd);
          chunk = chunk.subarray(len);
          if (chunk.length)
            return this.push(chunk, final);
        } else {
          var f = 0, i = 0, is = void 0, buf = void 0;
          if (!this.p.length)
            buf = chunk;
          else if (!chunk.length)
            buf = this.p;
          else {
            buf = new u8(this.p.length + chunk.length);
            buf.set(this.p), buf.set(chunk, this.p.length);
          }
          var l = buf.length, oc = this.c, add = oc && this.d;
          var _loop_2 = function() {
            var sig = b4(buf, i);
            if (sig == 67324752) {
              f = 1, is = i;
              this_1.d = null;
              this_1.c = 0;
              var bf = b2(buf, i + 6), cmp_1 = b2(buf, i + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i + 26), es = b2(buf, i + 28);
              if (l > i + 30 + fnl + es) {
                var chks_3 = [];
                this_1.k.unshift(chks_3);
                f = 2;
                var lsc = b4(buf, i + 18), lsu = b4(buf, i + 22);
                var fn_1 = strFromU8(buf.subarray(i + 30, i += 30 + fnl), !u);
                var _a2 = z64hs(buf, i, es, 2, lsc, lsu, 0), sc_1 = _a2[0], su_1 = _a2[1], z64 = _a2[3];
                if (dd)
                  sc_1 = -1 - z64;
                i += es;
                this_1.c = sc_1;
                var d_1;
                var file_1 = {
                  name: fn_1,
                  compression: cmp_1,
                  start: function() {
                    if (!file_1.ondata)
                      err(5);
                    if (!sc_1)
                      file_1.ondata(null, et, true);
                    else {
                      var ctr = _this.o[cmp_1];
                      if (!ctr)
                        file_1.ondata(err(14, "unknown compression type " + cmp_1, 1), null, false);
                      d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                      d_1.ondata = function(err2, dat3, final2) {
                        file_1.ondata(err2, dat3, final2);
                      };
                      for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                        var dat2 = chks_4[_i];
                        d_1.push(dat2, false);
                      }
                      if (_this.k[0] == chks_3 && _this.c)
                        _this.d = d_1;
                      else
                        d_1.push(et, true);
                    }
                  },
                  terminate: function() {
                    if (d_1 && d_1.terminate)
                      d_1.terminate();
                  }
                };
                if (sc_1 >= 0)
                  file_1.size = sc_1, file_1.originalSize = su_1;
                this_1.onfile(file_1);
              }
              return "break";
            } else if (oc) {
              if (sig == 134695760) {
                is = i += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
                return "break";
              } else if (sig == 33639248) {
                is = i -= 4, f = 3, this_1.c = 0;
                return "break";
              }
            }
          };
          var this_1 = this;
          for (; i < l - 4; ++i) {
            var state_1 = _loop_2();
            if (state_1 === "break")
              break;
          }
          this.p = et;
          if (oc < 0) {
            var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 134695760 && 4)) : buf.subarray(0, i);
            if (add)
              add.push(dat, !!f);
            else
              this.k[+(f == 2)].push(dat);
          }
          if (f & 2)
            return this.push(buf.subarray(i), final);
          this.p = buf.subarray(i);
        }
        if (final) {
          if (this.c)
            err(13);
          this.p = null;
        }
      };
      Unzip2.prototype.register = function(decoder2) {
        this.o[decoder2.compression] = decoder2;
      };
      return Unzip2;
    })();
    mt = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(fn) {
      fn();
    };
  }
});

// node_modules/@wasm-idle/llvm-core/dist/clang/src/types.js
function resolveDebugMode(options) {
  if (options.debugMode !== void 0) {
    if (options.debugMode === "none" || options.debugMode === "trace" || options.debugMode === "lldb") {
      return options.debugMode;
    }
    throw new Error(`unsupported wasm-clang debug mode: ${String(options.debugMode)}`);
  }
  return options.debug ? "trace" : "none";
}

// node_modules/@wasm-idle/llvm-core/dist/core/src/apply.js
function bindNew(obj, ...names) {
  const result = {};
  for (const name of names)
    result[name] = (obj[name] || (() => 0)).bind(obj);
  return result;
}

// node_modules/@wasm-idle/llvm-core/dist/core/src/encode.js
function readStr(u82, o, len = -1) {
  const end = len === -1 ? u82.length : o + len;
  let str = "";
  for (let i = o; i < end && u82[i]; ++i)
    str += String.fromCharCode(u82[i]);
  return str;
}
function readStrR(u82, o, len = -1) {
  const end = len === -1 ? u82.length : o + len;
  const str = [];
  for (let i = o; i < end && u82[i]; ++i)
    str.push(u82[i]);
  return new TextDecoder().decode(Uint8Array.from(str));
}
function readOct(u82, o, len) {
  return parseInt(readStr(u82, o, len), 8);
}

// node_modules/@wasm-idle/llvm-core/dist/core/src/memory.js
var Memory = class {
  memory;
  view;
  buffer;
  u8;
  u32;
  constructor(memory) {
    this.memory = memory;
    this.buffer = memory.buffer;
    this.view = new DataView(this.buffer);
    this.u8 = new Uint8Array(this.buffer);
    this.u32 = new Uint32Array(this.buffer);
  }
  check() {
    if (this.buffer.byteLength === 0) {
      this.buffer = this.memory.buffer;
      this.view = new DataView(this.buffer);
      this.u8 = new Uint8Array(this.buffer);
      this.u32 = new Uint32Array(this.buffer);
    }
  }
  read8(o) {
    return this.u8[o];
  }
  read32(o) {
    return this.u32[o >> 2];
  }
  readInt32(o) {
    return this.view.getInt32(o, true);
  }
  readFloat32(o) {
    return this.view.getFloat32(o, true);
  }
  readFloat64(o) {
    return this.view.getFloat64(o, true);
  }
  readStr(o, len) {
    return readStr(this.u8, o, len);
  }
  readStrR(o, len) {
    return readStrR(this.u8, o, len);
  }
  write8(o, v) {
    this.u8[o] = v;
  }
  write32(o, v) {
    this.u32[o >> 2] = v;
  }
  write64(o, vlo, vhi = 0) {
    this.write32(o, vlo);
    this.write32(o + 4, vhi);
  }
  writeStr(o, str) {
    o += this.write(o, str);
    this.write8(o, 0);
    return str.length + 1;
  }
  writeUint8(o, arr) {
    new Uint8Array(this.buffer, o, arr.length).set(arr);
    return arr.length;
  }
  write(o, buf) {
    if (buf instanceof ArrayBuffer)
      return this.writeUint8(o, new Uint8Array(buf));
    if (buf instanceof SharedArrayBuffer)
      return this.writeUint8(o, new Uint8Array(buf));
    else if (typeof buf === "string")
      return this.writeUint8(o, buf.split("").map((x) => x.charCodeAt(0)));
    else
      return this.writeUint8(o, buf);
  }
};

// node_modules/@wasm-idle/llvm-core/dist/core/src/wasm.js
var store = /* @__PURE__ */ new Map();
var bufferStore = /* @__PURE__ */ new Map();
var isGzip = (bytes) => bytes.byteLength >= 2 && bytes[0] === 31 && bytes[1] === 139;
var DEFAULT_MAX_DECOMPRESSED_ASSET_BYTES = 128 * 1024 * 1024;
var DEFAULT_MAX_RUNTIME_JSON_BYTES = 4 * 1024 * 1024;
var DEFAULT_DECOMPRESSION_BUFFER_BYTES = 64 * 1024;
async function readBoundedDecompressionStream(stream, assetUrl, maxOutputBytes, signal) {
  const reader = stream.getReader();
  const abortSignal = signal;
  let readerCancelled = false;
  if (abortSignal?.aborted) {
    readerCancelled = true;
    const reason = runtimeAbortReason(abortSignal);
    try {
      void Promise.resolve(reader.cancel(reason)).catch(() => {
      });
    } catch {
    }
    try {
      reader.releaseLock();
    } catch {
    }
    throw reason;
  }
  let cancelOnAbort;
  const aborted = abortSignal ? new Promise((_resolve, reject) => {
    cancelOnAbort = () => {
      if (readerCancelled)
        return;
      readerCancelled = true;
      const reason = runtimeAbortReason(abortSignal);
      try {
        void Promise.resolve(reader.cancel(reason)).catch(() => {
        });
      } catch {
      }
      reject(reason);
    };
    abortSignal.addEventListener("abort", cancelOnAbort, { once: true });
  }) : void 0;
  let bytes = new Uint8Array(Math.min(DEFAULT_DECOMPRESSION_BUFFER_BYTES, maxOutputBytes));
  let receivedLength = 0;
  let completed = false;
  let result;
  let releaseFailure;
  try {
    throwIfRuntimeAssetAborted(abortSignal);
    while (true) {
      const pendingRead = reader.read();
      const { done, value } = aborted ? await Promise.race([pendingRead, aborted]) : await pendingRead;
      throwIfRuntimeAssetAborted(abortSignal);
      if (done)
        break;
      if (!value)
        continue;
      const nextLength = receivedLength + value.byteLength;
      if (nextLength > maxOutputBytes) {
        throw new Error(`Runtime asset ${assetUrl} decompressed size exceeds the ${maxOutputBytes} byte limit`);
      }
      if (nextLength > bytes.byteLength) {
        const nextCapacity = Math.min(maxOutputBytes, Math.max(nextLength, Math.max(bytes.byteLength * 2, 1)));
        const grown = new Uint8Array(nextCapacity);
        grown.set(bytes.subarray(0, receivedLength));
        bytes = grown;
      }
      bytes.set(value, receivedLength);
      receivedLength = nextLength;
    }
    throwIfRuntimeAssetAborted(abortSignal);
    result = bytes.subarray(0, receivedLength);
    completed = true;
  } catch (error) {
    if (abortSignal?.aborted)
      throw runtimeAbortReason(abortSignal);
    if (!readerCancelled) {
      readerCancelled = true;
      try {
        void Promise.resolve(reader.cancel(error)).catch(() => {
        });
      } catch {
      }
    }
    throw error;
  } finally {
    if (cancelOnAbort)
      abortSignal?.removeEventListener("abort", cancelOnAbort);
    try {
      reader.releaseLock();
    } catch (error) {
      if (completed)
        releaseFailure = { error };
    }
  }
  if (releaseFailure)
    throw releaseFailure.error;
  return result;
}
function resolveRuntimeAssetUrl(name) {
  let resolvedUrl;
  try {
    resolvedUrl = new URL(name, typeof location !== "undefined" ? location.href : void 0);
  } catch {
    throw new Error("Runtime asset URL must be absolute outside a browser document");
  }
  if (resolvedUrl.protocol !== "http:" && resolvedUrl.protocol !== "https:") {
    throw new Error("Runtime assets must use HTTP(S)");
  }
  if (resolvedUrl.username || resolvedUrl.password) {
    throw new Error("Runtime asset URLs must not include credentials");
  }
  if (resolvedUrl.hash)
    throw new Error("Runtime asset URLs must not include fragments");
  return resolvedUrl;
}
function readContentLength(response) {
  const value = response.headers.get("Content-Length");
  if (value === null)
    return 0;
  const contentLength = Number(value);
  if (!/^\d+$/u.test(value) || !Number.isSafeInteger(contentLength)) {
    throw new Error("Runtime asset has an invalid Content-Length");
  }
  return contentLength;
}
function runtimeAbortReason(signal) {
  return signal.reason ?? new DOMException("Runtime asset load aborted", "AbortError");
}
function waitForRuntimeAssetOperation(operation, signal, onLateValue) {
  if (!signal)
    return operation;
  return new Promise((resolve, reject) => {
    let settled = false;
    const cancelOnAbort = () => {
      if (settled)
        return;
      settled = true;
      signal.removeEventListener("abort", cancelOnAbort);
      reject(runtimeAbortReason(signal));
    };
    signal.addEventListener("abort", cancelOnAbort, { once: true });
    operation.then((value) => {
      if (settled) {
        if (onLateValue) {
          void Promise.resolve().then(() => onLateValue(value, signal.reason)).catch(() => {
          });
        }
        return;
      }
      settled = true;
      signal.removeEventListener("abort", cancelOnAbort);
      resolve(value);
    }, (error) => {
      if (settled)
        return;
      settled = true;
      signal.removeEventListener("abort", cancelOnAbort);
      reject(error);
    });
    if (signal.aborted)
      cancelOnAbort();
  });
}
function throwIfRuntimeAssetAborted(signal) {
  if (signal?.aborted)
    throw runtimeAbortReason(signal);
}
function cancelResponseBody(response, reason) {
  try {
    void response.body?.cancel(reason).catch(() => {
    });
  } catch {
  }
}
async function readResponseBytes(response, assetUrl, maxOutputBytes, progress, signal) {
  if (signal?.aborted) {
    const reason = runtimeAbortReason(signal);
    cancelResponseBody(response, reason);
    throw reason;
  }
  let contentLength;
  try {
    contentLength = readContentLength(response);
  } catch (error) {
    cancelResponseBody(response, error);
    throw error;
  }
  if (contentLength > maxOutputBytes) {
    cancelResponseBody(response);
    throw new Error(`Runtime asset ${assetUrl} size exceeds the ${maxOutputBytes} byte limit`);
  }
  if (!response.body) {
    const bytes2 = new Uint8Array(await waitForRuntimeAssetOperation(response.arrayBuffer(), signal));
    if (signal?.aborted)
      throw runtimeAbortReason(signal);
    if (bytes2.byteLength > maxOutputBytes) {
      throw new Error(`Runtime asset ${assetUrl} size exceeds the ${maxOutputBytes} byte limit`);
    }
    progress?.set?.(1);
    return bytes2;
  }
  const abortSignal = signal;
  const reader = response.body.getReader();
  let readerCancelled = false;
  const cancelReader = (reason) => {
    if (readerCancelled)
      return;
    readerCancelled = true;
    try {
      void Promise.resolve(reader.cancel(reason)).catch(() => {
      });
    } catch {
    }
  };
  if (abortSignal?.aborted) {
    const reason = runtimeAbortReason(abortSignal);
    cancelReader(reason);
    try {
      reader.releaseLock();
    } catch {
    }
    throw reason;
  }
  let cancelOnAbort;
  const aborted = abortSignal ? new Promise((_resolve, reject) => {
    cancelOnAbort = () => {
      const reason = runtimeAbortReason(abortSignal);
      cancelReader(reason);
      reject(reason);
    };
    abortSignal.addEventListener("abort", cancelOnAbort, { once: true });
  }) : void 0;
  let bytes;
  let receivedLength = 0;
  let receivedBytes;
  let releaseFailure;
  try {
    bytes = new Uint8Array(Math.min(maxOutputBytes, contentLength || DEFAULT_DECOMPRESSION_BUFFER_BYTES));
    while (true) {
      throwIfRuntimeAssetAborted(abortSignal);
      const pendingRead = reader.read();
      const { done, value } = aborted ? await Promise.race([pendingRead, aborted]) : await pendingRead;
      throwIfRuntimeAssetAborted(abortSignal);
      if (done)
        break;
      if (!value)
        continue;
      const nextLength = receivedLength + value.byteLength;
      if (nextLength > maxOutputBytes) {
        const error = new Error(`Runtime asset ${assetUrl} size exceeds the ${maxOutputBytes} byte limit`);
        cancelReader(error);
        throw error;
      }
      if (nextLength > bytes.byteLength) {
        const nextCapacity = Math.min(maxOutputBytes, Math.max(nextLength, Math.max(bytes.byteLength * 2, 1)));
        const grown = new Uint8Array(nextCapacity);
        grown.set(bytes.subarray(0, receivedLength));
        bytes = grown;
      }
      bytes.set(value, receivedLength);
      receivedLength = nextLength;
      if (contentLength > 0)
        progress?.set?.(receivedLength / contentLength);
    }
    throwIfRuntimeAssetAborted(abortSignal);
    receivedBytes = bytes.subarray(0, receivedLength);
  } catch (error) {
    if (abortSignal?.aborted) {
      const reason = runtimeAbortReason(abortSignal);
      cancelReader(reason);
      throw reason;
    }
    cancelReader(error);
    throw error;
  } finally {
    if (cancelOnAbort)
      abortSignal?.removeEventListener("abort", cancelOnAbort);
    try {
      reader.releaseLock();
    } catch (error) {
      if (!abortSignal?.aborted)
        releaseFailure = { error };
    }
  }
  if (abortSignal?.aborted) {
    const reason = runtimeAbortReason(abortSignal);
    cancelReader(reason);
    throw reason;
  }
  if (releaseFailure)
    throw releaseFailure.error;
  return receivedBytes;
}
async function fetchRuntimeJson(url, options = {}) {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_RUNTIME_JSON_BYTES;
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) {
    throw new Error("Runtime JSON byte limit must be a positive safe integer");
  }
  const resolvedUrl = resolveRuntimeAssetUrl(url.toString());
  const label = options.label?.trim() || "runtime JSON";
  const fetchImpl = options.fetchImpl ?? globalThis.fetch?.bind(globalThis);
  if (!fetchImpl)
    throw new Error(`Fetch is unavailable while loading ${label}`);
  if (options.signal?.aborted)
    throw runtimeAbortReason(options.signal);
  const requestInit = {
    cache: "no-store",
    credentials: "omit",
    redirect: "error",
    referrerPolicy: "no-referrer"
  };
  if (options.signal)
    requestInit.signal = options.signal;
  const pendingResponse = Promise.resolve(fetchImpl(resolvedUrl.toString(), requestInit));
  const response = await waitForRuntimeAssetOperation(pendingResponse, options.signal, (lateResponse, reason) => {
    cancelResponseBody(lateResponse, reason);
  });
  if (options.signal?.aborted) {
    const reason = runtimeAbortReason(options.signal);
    cancelResponseBody(response, reason);
    throw reason;
  }
  if (response.url) {
    let finalUrl;
    try {
      finalUrl = new URL(response.url);
    } catch {
      cancelResponseBody(response);
      throw new Error(`${label} returned an invalid final URL`);
    }
    if (finalUrl.href !== resolvedUrl.href) {
      cancelResponseBody(response);
      throw new Error(`${label} returned an unexpected final URL`);
    }
  }
  if (!response.ok) {
    cancelResponseBody(response);
    throw new Error(`Failed to load ${label} from ${resolvedUrl}: ${response.status}`);
  }
  const bytes = await readResponseBytes(response, resolvedUrl, maxBytes, void 0, options.signal);
  let source;
  try {
    source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (error) {
    throw new Error(`${label} is not valid UTF-8`, { cause: error });
  }
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`${label} is not valid JSON`, { cause: error });
  }
}
async function decompressGzip(bytes, assetUrl = "runtime asset", maxOutputBytes = DEFAULT_MAX_DECOMPRESSED_ASSET_BYTES, signal) {
  if (!Number.isSafeInteger(maxOutputBytes) || maxOutputBytes < 0) {
    throw new Error("Runtime asset decompression limit must be a non-negative safe integer");
  }
  throwIfRuntimeAssetAborted(signal);
  if (!isGzip(bytes)) {
    if (bytes.byteLength > maxOutputBytes) {
      throw new Error(`Runtime asset ${assetUrl} decompressed size exceeds the ${maxOutputBytes} byte limit`);
    }
    return bytes;
  }
  if (typeof DecompressionStream !== "function") {
    throw new Error(`Failed to decompress runtime asset ${assetUrl}: DecompressionStream('gzip') is unavailable`);
  }
  try {
    const compressed = Uint8Array.from(bytes);
    const source = new ReadableStream({
      start(controller) {
        controller.enqueue(compressed);
        controller.close();
      }
    });
    const decompressor = new DecompressionStream("gzip");
    const stream = source.pipeThrough({
      readable: decompressor.readable,
      writable: decompressor.writable
    });
    return await readBoundedDecompressionStream(stream, assetUrl, maxOutputBytes, signal);
  } catch (error) {
    if (signal?.aborted)
      throw runtimeAbortReason(signal);
    throw new Error(`Failed to decompress runtime asset ${assetUrl}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
async function readGzipResponse(response, assetUrl, maxOutputBytes, progress, signal) {
  if (signal?.aborted) {
    const reason = runtimeAbortReason(signal);
    cancelResponseBody(response, reason);
    throw reason;
  }
  let contentLength;
  try {
    contentLength = readContentLength(response);
  } catch (error) {
    cancelResponseBody(response, error);
    throw error;
  }
  if (contentLength > maxOutputBytes) {
    cancelResponseBody(response);
    throw new Error(`Runtime asset ${assetUrl} download size exceeds the ${maxOutputBytes} byte limit`);
  }
  if (!response.body) {
    const source2 = new Uint8Array(await waitForRuntimeAssetOperation(response.arrayBuffer(), signal));
    throwIfRuntimeAssetAborted(signal);
    if (source2.byteLength > maxOutputBytes) {
      throw new Error(`Runtime asset ${assetUrl} download size exceeds the ${maxOutputBytes} byte limit`);
    }
    const result = await decompressGzip(source2, assetUrl, maxOutputBytes, signal);
    throwIfRuntimeAssetAborted(signal);
    progress?.set?.(1);
    return result;
  }
  const reader = response.body.getReader();
  const leadingChunks = [];
  let leadingLength = 0;
  let receivedLength = 0;
  let readerDone = false;
  let readerReleased = false;
  let readerCancelled = false;
  const releaseReader = () => {
    if (readerReleased)
      return;
    readerReleased = true;
    reader.releaseLock();
  };
  const cancelReader = (reason) => {
    if (readerReleased || readerCancelled)
      return;
    readerCancelled = true;
    try {
      void Promise.resolve(reader.cancel(reason)).catch(() => {
      });
    } catch {
    }
    try {
      releaseReader();
    } catch {
    }
  };
  if (signal?.aborted) {
    const reason = runtimeAbortReason(signal);
    cancelReader(reason);
    throw reason;
  }
  let cancelOnAbort;
  const aborted = signal ? new Promise((_resolve, reject) => {
    cancelOnAbort = () => {
      const reason = runtimeAbortReason(signal);
      cancelReader(reason);
      reject(reason);
    };
    signal.addEventListener("abort", cancelOnAbort, { once: true });
  }) : void 0;
  try {
    throwIfRuntimeAssetAborted(signal);
    while (leadingLength < 2) {
      const pendingRead = reader.read();
      const { done, value } = aborted ? await Promise.race([pendingRead, aborted]) : await pendingRead;
      throwIfRuntimeAssetAborted(signal);
      if (done) {
        readerDone = true;
        releaseReader();
        break;
      }
      if (!value)
        continue;
      const nextLength = receivedLength + value.byteLength;
      if (nextLength > maxOutputBytes) {
        const error = new Error(`Runtime asset ${assetUrl} download size exceeds the ${maxOutputBytes} byte limit`);
        cancelReader(error);
        throw error;
      }
      leadingChunks.push(value);
      leadingLength += value.byteLength;
      receivedLength = nextLength;
      if (contentLength > 0) {
        progress?.set?.(Math.min(receivedLength / contentLength, 1));
      }
    }
    throwIfRuntimeAssetAborted(signal);
  } catch (error) {
    cancelReader(error);
    if (signal?.aborted)
      throw runtimeAbortReason(signal);
    throw error;
  } finally {
    if (cancelOnAbort)
      signal?.removeEventListener("abort", cancelOnAbort);
  }
  let firstByte;
  let secondByte;
  for (const chunk of leadingChunks) {
    for (const byte of chunk) {
      if (firstByte === void 0)
        firstByte = byte;
      else if (secondByte === void 0)
        secondByte = byte;
      if (secondByte !== void 0)
        break;
    }
    if (secondByte !== void 0)
      break;
  }
  let leadingIndex = 0;
  const source = new ReadableStream({
    async pull(controller) {
      if (leadingIndex < leadingChunks.length) {
        controller.enqueue(leadingChunks[leadingIndex++]);
        return;
      }
      if (readerDone) {
        controller.close();
        return;
      }
      try {
        const { done, value } = await reader.read();
        throwIfRuntimeAssetAborted(signal);
        if (done) {
          readerDone = true;
          releaseReader();
          controller.close();
          return;
        }
        if (!value)
          return;
        const nextLength = receivedLength + value.byteLength;
        if (nextLength > maxOutputBytes) {
          const error = new Error(`Runtime asset ${assetUrl} download size exceeds the ${maxOutputBytes} byte limit`);
          cancelReader(error);
          controller.error(error);
          return;
        }
        receivedLength = nextLength;
        if (contentLength > 0) {
          progress?.set?.(Math.min(receivedLength / contentLength, 1));
        }
        controller.enqueue(value);
      } catch (error) {
        cancelReader(error);
        controller.error(error);
      }
    },
    cancel(reason) {
      cancelReader(reason);
    }
  });
  let output = source;
  if (firstByte === 31 && secondByte === 139) {
    if (typeof DecompressionStream !== "function") {
      const error = new Error(`Failed to decompress runtime asset ${assetUrl}: DecompressionStream('gzip') is unavailable`);
      cancelReader(error);
      throw error;
    }
    const decompressor = new DecompressionStream("gzip");
    output = source.pipeThrough({
      readable: decompressor.readable,
      writable: decompressor.writable
    });
  }
  try {
    const result = await readBoundedDecompressionStream(output, assetUrl, maxOutputBytes, signal);
    progress?.set?.(1);
    return result;
  } catch (error) {
    cancelReader(error);
    if (signal?.aborted)
      throw runtimeAbortReason(signal);
    throw new Error(`Failed to decompress runtime asset ${assetUrl}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
async function unzipFirstFile(bytes, assetUrl, maxOutputBytes, signal) {
  throwIfRuntimeAssetAborted(signal);
  const { unzipSync: unzipSync2 } = await Promise.resolve().then(() => (init_browser(), browser_exports));
  throwIfRuntimeAssetAborted(signal);
  let selectedFile;
  const entries = unzipSync2(bytes, {
    filter(file) {
      if (file.name.endsWith("/") || selectedFile !== void 0)
        return false;
      if (file.originalSize > maxOutputBytes) {
        throw new Error(`Runtime asset ${assetUrl} extracted size exceeds the ${maxOutputBytes} byte limit`);
      }
      selectedFile = file.name;
      return true;
    }
  });
  throwIfRuntimeAssetAborted(signal);
  for (const [entryName, entryBytes] of Object.entries(entries)) {
    if (!entryName.endsWith("/"))
      return entryBytes;
  }
  throw new Error("No entry found");
}
var readBuffer = async (name, progress, maxOutputBytes = DEFAULT_MAX_DECOMPRESSED_ASSET_BYTES, signal) => {
  if (!Number.isSafeInteger(maxOutputBytes) || maxOutputBytes < 0) {
    throw new Error("Runtime asset byte limit must be a non-negative safe integer");
  }
  throwIfRuntimeAssetAborted(signal);
  const cacheKey = `${name}\0${maxOutputBytes}`;
  let pending = signal ? void 0 : bufferStore.get(cacheKey);
  if (!pending) {
    pending = (async () => {
      const resolvedUrl = resolveRuntimeAssetUrl(name);
      const requestInit = {
        credentials: "omit",
        redirect: "error",
        referrerPolicy: "no-referrer"
      };
      if (signal)
        requestInit.signal = signal;
      let response;
      try {
        const pendingResponse = Promise.resolve(fetch(resolvedUrl, requestInit));
        response = await waitForRuntimeAssetOperation(pendingResponse, signal, (lateResponse, reason) => {
          cancelResponseBody(lateResponse, reason);
        });
      } catch (error) {
        if (signal?.aborted)
          throw runtimeAbortReason(signal);
        throw error;
      }
      if (signal?.aborted) {
        const reason = runtimeAbortReason(signal);
        cancelResponseBody(response, reason);
        throw reason;
      }
      if (response.url) {
        let finalUrl;
        try {
          finalUrl = new URL(response.url);
        } catch {
          cancelResponseBody(response);
          throw new Error("Runtime asset returned an invalid final URL");
        }
        if (finalUrl.href !== resolvedUrl.href) {
          cancelResponseBody(response);
          throw new Error("Runtime asset returned an unexpected final URL");
        }
      }
      if (!response.ok) {
        cancelResponseBody(response);
        throw new Error(`Failed to load runtime asset ${resolvedUrl}: ${response.status}`);
      }
      if (resolvedUrl.pathname.endsWith(".gz")) {
        return await readGzipResponse(response, resolvedUrl, maxOutputBytes, progress, signal);
      }
      const source = await readResponseBytes(response, resolvedUrl, maxOutputBytes, progress, signal);
      if (resolvedUrl.pathname.endsWith(".zip")) {
        return await unzipFirstFile(source, resolvedUrl, maxOutputBytes, signal);
      }
      return source;
    })();
    if (!signal) {
      pending = pending.catch((error) => {
        if (bufferStore.get(cacheKey) === pending)
          bufferStore.delete(cacheKey);
        throw error;
      });
      bufferStore.set(cacheKey, pending);
    }
  }
  const data = await pending;
  throwIfRuntimeAssetAborted(signal);
  progress?.set?.(1);
  return Uint8Array.from(data);
};
async function compile(filename, progress, signal, maxOutputBytes = DEFAULT_MAX_DECOMPRESSED_ASSET_BYTES) {
  throwIfRuntimeAssetAborted(signal);
  const cacheKey = `${filename}\0${maxOutputBytes}`;
  const cached = signal ? void 0 : store.get(cacheKey);
  if (cached)
    return cached;
  let pending = (async () => {
    const bytes = await readBuffer(filename, progress, maxOutputBytes, signal);
    throwIfRuntimeAssetAborted(signal);
    const module = await waitForRuntimeAssetOperation(WebAssembly.compile(bytes), signal);
    throwIfRuntimeAssetAborted(signal);
    return module;
  })();
  if (!signal) {
    pending = pending.catch((error) => {
      if (store.get(cacheKey) === pending)
        store.delete(cacheKey);
      throw error;
    });
    store.set(cacheKey, pending);
  }
  return pending;
}
function getInstance(module, imports) {
  return WebAssembly.instantiate(module, imports);
}

// node_modules/@wasm-idle/llvm-core/dist/core/src/error.js
var ProcExit = class extends Error {
  code;
  constructor(code) {
    super(`process exited with code ${code}.`);
    this.code = code;
  }
};
var NotImplemented = class extends Error {
  constructor(modname, fieldname) {
    super(`${modname}.${fieldname} not implemented.`);
  }
};
var AbortError = class extends Error {
  constructor(msg = "abort") {
    super(msg);
  }
};
var AssertError = class extends Error {
  constructor(msg) {
    super(msg);
  }
};
function assert(cond) {
  if (!cond) {
    throw new AssertError("assertion failed.");
  }
}

// node_modules/@wasm-idle/llvm-core/dist/clang/src/debug/expression.js
var operators = ["&&", "||", "==", "!=", "<=", ">=", "+", "-", "*", "/", "%", "<", ">", "!"];
var isDebugExpressionIndexedValue = (value) => !!value && typeof value === "object" && !Array.isArray(value) && value.__debugExpressionKind === "array";
var isDebugExpressionObjectValue = (value) => !!value && typeof value === "object" && !Array.isArray(value) && value.__debugExpressionKind === "object";
var parseQuotedValue = (text, start) => {
  const quote = text[start];
  if (quote !== "'" && quote !== '"')
    throw new Error("expected quoted string");
  let index = start + 1;
  let value = "";
  while (index < text.length) {
    const character = text[index];
    if (!character)
      break;
    if (character === "\\") {
      const escaped = text[index + 1];
      if (!escaped)
        throw new Error("unterminated string literal");
      if (escaped === "n")
        value += "\n";
      else if (escaped === "r")
        value += "\r";
      else if (escaped === "t")
        value += "	";
      else
        value += escaped;
      index += 2;
      continue;
    }
    if (character === quote)
      return { value, next: index + 1 };
    value += character;
    index += 1;
  }
  throw new Error("unterminated string literal");
};
var tokenizeDebugExpression = (source) => {
  const tokens = [];
  for (let index = 0; index < source.length; ) {
    const character = source[index];
    if (!character)
      break;
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }
    if (character === "(" || character === ")") {
      tokens.push({ type: "paren", value: character });
      index += 1;
      continue;
    }
    if (character === "[" || character === "]") {
      tokens.push({ type: "bracket", value: character });
      index += 1;
      continue;
    }
    if (character === ".") {
      tokens.push({ type: "dot" });
      index += 1;
      continue;
    }
    const operator = operators.find((candidate) => source.startsWith(candidate, index));
    if (operator) {
      tokens.push({ type: "operator", value: operator });
      index += operator.length;
      continue;
    }
    if (character === "'" || character === '"') {
      const parsed = parseQuotedValue(source, index);
      tokens.push({ type: "string", value: parsed.value });
      index = parsed.next;
      continue;
    }
    const number = source.slice(index).match(/^\d+(?:\.\d+)?/);
    if (number?.[0]) {
      tokens.push({ type: "number", value: number[0] });
      index += number[0].length;
      continue;
    }
    const identifier = source.slice(index).match(/^[A-Za-z_]\w*/);
    if (identifier?.[0]) {
      if (identifier[0] === "true" || identifier[0] === "false" || identifier[0] === "True" || identifier[0] === "False") {
        tokens.push({
          type: "boolean",
          value: identifier[0] === "true" || identifier[0] === "True"
        });
      } else if (identifier[0] === "null" || identifier[0] === "None") {
        tokens.push({ type: "null" });
      } else if (identifier[0] === "and") {
        tokens.push({ type: "operator", value: "&&" });
      } else if (identifier[0] === "or") {
        tokens.push({ type: "operator", value: "||" });
      } else if (identifier[0] === "not") {
        tokens.push({ type: "operator", value: "!" });
      } else {
        tokens.push({ type: "identifier", value: identifier[0] });
      }
      index += identifier[0].length;
      continue;
    }
    throw new Error(`unsupported token near "${source.slice(index)}"`);
  }
  return tokens;
};
var parseDebugPreviewValueAt = (text, start = 0) => {
  let index = start;
  while (/\s/.test(text[index] || ""))
    index += 1;
  const character = text[index];
  if (character === "[") {
    index += 1;
    const items = [];
    while (true) {
      while (/\s/.test(text[index] || ""))
        index += 1;
      if (text[index] === "]")
        return { value: items, next: index + 1 };
      if (text.startsWith("...", index)) {
        items.truncated = true;
        index += 3;
        while (/\s/.test(text[index] || ""))
          index += 1;
        if (text[index] === "]")
          return { value: items, next: index + 1 };
        throw new Error("unsupported array preview");
      }
      const item = parseDebugPreviewValueAt(text, index);
      items.push(item.value);
      index = item.next;
      while (/\s/.test(text[index] || ""))
        index += 1;
      if (text[index] === ",") {
        index += 1;
        continue;
      }
      if (text[index] === "]")
        return { value: items, next: index + 1 };
      throw new Error("unsupported array preview");
    }
  }
  if (character === "(") {
    index += 1;
    const items = [];
    while (true) {
      while (/\s/.test(text[index] || ""))
        index += 1;
      if (text[index] === ")")
        return { value: items, next: index + 1 };
      if (text.startsWith("...", index)) {
        items.truncated = true;
        index += 3;
        while (/\s/.test(text[index] || ""))
          index += 1;
        if (text[index] === ")")
          return { value: items, next: index + 1 };
        throw new Error("unsupported tuple preview");
      }
      const item = parseDebugPreviewValueAt(text, index);
      items.push(item.value);
      index = item.next;
      while (/\s/.test(text[index] || ""))
        index += 1;
      if (text[index] === ",") {
        index += 1;
        continue;
      }
      if (text[index] === ")")
        return { value: items, next: index + 1 };
      throw new Error("unsupported tuple preview");
    }
  }
  if (character === "{") {
    index += 1;
    const entries = {};
    while (true) {
      while (/\s/.test(text[index] || ""))
        index += 1;
      if (text[index] === "}")
        return { value: entries, next: index + 1 };
      if (text.startsWith("...", index))
        throw new Error("unavailable");
      let key = "";
      if (text[index] === "'" || text[index] === '"') {
        const parsedKey = parseQuotedValue(text, index);
        key = parsedKey.value;
        index = parsedKey.next;
      } else {
        const identifier = text.slice(index).match(/^[A-Za-z_]\w*/)?.[0];
        if (!identifier)
          throw new Error("unsupported object preview");
        key = identifier;
        index += identifier.length;
      }
      while (/\s/.test(text[index] || ""))
        index += 1;
      if (text[index] !== ":")
        throw new Error("unsupported object preview");
      index += 1;
      const entry = parseDebugPreviewValueAt(text, index);
      entries[key] = entry.value;
      index = entry.next;
      while (/\s/.test(text[index] || ""))
        index += 1;
      if (text[index] === ",") {
        index += 1;
        continue;
      }
      if (text[index] === "}")
        return { value: entries, next: index + 1 };
      throw new Error("unsupported object preview");
    }
  }
  if (character === "'" || character === '"')
    return parseQuotedValue(text, index);
  if (text.startsWith("true", index))
    return { value: true, next: index + 4 };
  if (text.startsWith("false", index))
    return { value: false, next: index + 5 };
  if (text.startsWith("True", index))
    return { value: true, next: index + 4 };
  if (text.startsWith("False", index))
    return { value: false, next: index + 5 };
  if (text.startsWith("null", index))
    return { value: null, next: index + 4 };
  if (text.startsWith("None", index))
    return { value: null, next: index + 4 };
  const number = text.slice(index).match(/^-?\d+(?:\.\d+)?/);
  if (number?.[0])
    return { value: Number(number[0]), next: index + number[0].length };
  throw new Error("unsupported preview");
};
var parseStoredDebugValue = (value) => {
  const source = value.trim();
  if (!source || source === "?")
    throw new Error("unavailable");
  if (source === "true" || source === "false" || source === "True" || source === "False") {
    return source === "true" || source === "True";
  }
  if (source === "null" || source === "None")
    return null;
  const numeric = Number(source);
  if (!Number.isNaN(numeric))
    return numeric;
  if (source.startsWith("[") || source.startsWith("(") || source.startsWith("{") || source.startsWith("'") || source.startsWith('"')) {
    const parsed = parseDebugPreviewValueAt(source);
    const trailing = source.slice(parsed.next).trim();
    if (trailing)
      throw new Error("unsupported preview");
    return parsed.value;
  }
  throw new Error("unsupported preview");
};
var quoteDebugString = (value) => `'${value.replaceAll("\\", "\\\\").replaceAll("'", "\\'").replaceAll("\n", "\\n").replaceAll("\r", "\\r").replaceAll("	", "\\t")}'`;
var formatDebugExpressionValueInternal = (value, nested, depth) => {
  if (value === null)
    return "null";
  if (typeof value === "number" || typeof value === "boolean")
    return `${value}`;
  if (typeof value === "string")
    return nested ? quoteDebugString(value) : value;
  if (depth >= 4)
    return "...";
  if (Array.isArray(value)) {
    const previewLength2 = Math.min(value.length, 8);
    const items = value.slice(0, previewLength2).map((entry) => formatDebugExpressionValueInternal(entry, true, depth + 1));
    return `[${items.join(", ")}${value.truncated || value.length > previewLength2 ? ", ..." : ""}]`;
  }
  if (isDebugExpressionIndexedValue(value)) {
    const indexes = value.keys?.() || [];
    const previewLength2 = Math.min(indexes.length || value.length || 0, 8);
    const items = [];
    for (let index = 0; index < previewLength2; index += 1) {
      const resolvedIndex = indexes[index] ?? index;
      items.push(formatDebugExpressionValueInternal(value.get(resolvedIndex), true, depth + 1));
    }
    const isTruncated = value.truncated || value.length != null && value.length > previewLength2;
    return `[${items.join(", ")}${isTruncated ? ", ..." : ""}]`;
  }
  if (isDebugExpressionObjectValue(value)) {
    const keys2 = value.keys?.() || [];
    const previewLength2 = Math.min(keys2.length, 8);
    const entries2 = keys2.slice(0, previewLength2).map((key) => {
      return `${key}: ${formatDebugExpressionValueInternal(value.get(key), true, depth + 1)}`;
    });
    return `{${entries2.join(", ")}${keys2.length > previewLength2 ? ", ..." : ""}}`;
  }
  const keys = Object.keys(value);
  const previewLength = Math.min(keys.length, 8);
  const entries = keys.slice(0, previewLength).map((key) => {
    return `${key}: ${formatDebugExpressionValueInternal(value[key], true, depth + 1)}`;
  });
  return `{${entries.join(", ")}${keys.length > previewLength ? ", ..." : ""}}`;
};
var formatDebugExpressionValue = (value) => formatDebugExpressionValueInternal(value, false, 0);
var evaluateDebugExpressionWithResolver = (expression, resolveIdentifier) => {
  const source = expression.trim();
  if (!source)
    throw new Error("empty expression");
  const tokens = tokenizeDebugExpression(source);
  const parsedValues = /* @__PURE__ */ new Map();
  const resolveIdentifierValue = (name) => {
    if (parsedValues.has(name))
      return parsedValues.get(name);
    const value = resolveIdentifier(name);
    parsedValues.set(name, value);
    return value;
  };
  const readIndexedValue = (value, index) => {
    if (!Number.isInteger(index))
      throw new Error("unsupported index access");
    if (Array.isArray(value)) {
      if (index < 0 || index >= value.length)
        throw new Error("unavailable");
      return value[index];
    }
    if (isDebugExpressionIndexedValue(value)) {
      if (value.length != null && (index < 0 || index >= value.length)) {
        throw new Error("unavailable");
      }
      return value.get(index);
    }
    throw new Error("unsupported index access");
  };
  const readMemberValue = (value, name) => {
    if (Array.isArray(value) || isDebugExpressionIndexedValue(value) || !value) {
      throw new Error("unsupported member access");
    }
    if (isDebugExpressionObjectValue(value)) {
      if (!value.has(name))
        throw new Error("unavailable");
      return value.get(name);
    }
    if (typeof value !== "object" || !Object.hasOwn(value, name))
      throw new Error("unavailable");
    return value[name];
  };
  let cursor = 0;
  let evaluationEnabled = true;
  const parseWithoutEvaluation = (parse) => {
    const previous = evaluationEnabled;
    evaluationEnabled = false;
    try {
      return parse();
    } finally {
      evaluationEnabled = previous;
    }
  };
  const parsePrimary = () => {
    const token = tokens[cursor];
    if (!token)
      throw new Error("unexpected end of expression");
    if (token.type === "number") {
      cursor += 1;
      return Number(token.value);
    }
    if (token.type === "boolean") {
      cursor += 1;
      return token.value;
    }
    if (token.type === "null") {
      cursor += 1;
      return null;
    }
    if (token.type === "string") {
      cursor += 1;
      return token.value;
    }
    if (token.type === "identifier") {
      cursor += 1;
      let resolved = evaluationEnabled ? resolveIdentifierValue(token.value) : null;
      while (true) {
        const bracket = tokens[cursor];
        if (bracket?.type === "bracket" && bracket.value === "[") {
          cursor += 1;
          const index = Number(parseOr());
          const closing = tokens[cursor];
          if (!closing || closing.type !== "bracket" || closing.value !== "]")
            throw new Error("missing closing bracket");
          cursor += 1;
          resolved = evaluationEnabled ? readIndexedValue(resolved, index) : null;
          continue;
        }
        if (bracket?.type === "dot") {
          cursor += 1;
          const property = tokens[cursor];
          if (!property || property.type !== "identifier")
            throw new Error("missing property name");
          cursor += 1;
          resolved = evaluationEnabled ? readMemberValue(resolved, property.value) : null;
          continue;
        }
        break;
      }
      return resolved;
    }
    if (token.type === "paren" && token.value === "(") {
      cursor += 1;
      const result2 = parseOr();
      const closing = tokens[cursor];
      if (!closing || closing.type !== "paren" || closing.value !== ")")
        throw new Error("missing closing parenthesis");
      cursor += 1;
      return result2;
    }
    throw new Error("expected value");
  };
  const parseUnary = () => {
    const token = tokens[cursor];
    if (token?.type === "operator" && token.value === "!") {
      cursor += 1;
      return !Boolean(parseUnary());
    }
    if (token?.type === "operator" && token.value === "-") {
      cursor += 1;
      return -Number(parseUnary());
    }
    if (token?.type === "operator" && token.value === "+") {
      cursor += 1;
      return Number(parseUnary());
    }
    return parsePrimary();
  };
  const parseMul = () => {
    let left = parseUnary();
    while (true) {
      const operator = tokens[cursor];
      if (operator?.type !== "operator" || !["*", "/", "%"].includes(operator.value)) {
        return left;
      }
      cursor += 1;
      const right = parseUnary();
      if (operator.value === "*")
        left = Number(left) * Number(right);
      if (operator.value === "/")
        left = Number(left) / Number(right);
      if (operator.value === "%")
        left = Number(left) % Number(right);
    }
  };
  const parseAdd = () => {
    let left = parseMul();
    while (true) {
      const operator = tokens[cursor];
      if (operator?.type !== "operator" || !["+", "-"].includes(operator.value))
        return left;
      cursor += 1;
      const right = parseMul();
      if (operator.value === "+") {
        if (typeof left === "string" || typeof right === "string") {
          left = `${left ?? "null"}${right ?? "null"}`;
        } else {
          left = Number(left) + Number(right);
        }
      }
      if (operator.value === "-")
        left = Number(left) - Number(right);
    }
  };
  const parseCompare = () => {
    let left = parseAdd();
    while (true) {
      const operator = tokens[cursor];
      if (operator?.type !== "operator" || !["<", "<=", ">", ">="].includes(operator.value)) {
        return left;
      }
      cursor += 1;
      const right = parseAdd();
      const leftValue = typeof left === "string" && typeof right === "string" ? left : Number(left);
      const rightValue = typeof left === "string" && typeof right === "string" ? right : Number(right);
      if (operator.value === "<")
        left = leftValue < rightValue;
      if (operator.value === "<=")
        left = leftValue <= rightValue;
      if (operator.value === ">")
        left = leftValue > rightValue;
      if (operator.value === ">=")
        left = leftValue >= rightValue;
    }
  };
  const parseEquality = () => {
    let left = parseCompare();
    while (true) {
      const operator = tokens[cursor];
      if (operator?.type !== "operator" || !["==", "!="].includes(operator.value))
        return left;
      cursor += 1;
      const right = parseCompare();
      if (operator.value === "==")
        left = left === right;
      if (operator.value === "!=")
        left = left !== right;
    }
  };
  const parseAnd = () => {
    let left = parseEquality();
    while (true) {
      const operator = tokens[cursor];
      if (!operator || operator.type !== "operator" || operator.value !== "&&")
        break;
      cursor += 1;
      const right = evaluationEnabled && Boolean(left) ? parseEquality() : parseWithoutEvaluation(parseEquality);
      if (evaluationEnabled)
        left = Boolean(left) && Boolean(right);
    }
    return left;
  };
  const parseOr = () => {
    let left = parseAnd();
    while (true) {
      const operator = tokens[cursor];
      if (!operator || operator.type !== "operator" || operator.value !== "||")
        break;
      cursor += 1;
      const right = evaluationEnabled && !Boolean(left) ? parseAnd() : parseWithoutEvaluation(parseAnd);
      if (evaluationEnabled)
        left = Boolean(left) || Boolean(right);
    }
    return left;
  };
  const result = parseOr();
  if (cursor !== tokens.length)
    throw new Error("unexpected trailing tokens");
  return formatDebugExpressionValue(result);
};

// node_modules/@wasm-idle/llvm-core/dist/clang/src/stdin-buffer.js
var SEQUENCE_INDEX = 0;
var LENGTH_INDEX = 1;
var HEADER_BYTES = Int32Array.BYTES_PER_ELEMENT * 2;
var EOF_LENGTH = -1;
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var controlViewOf = (buffer) => buffer instanceof Int32Array ? buffer : new Int32Array(buffer);
var payloadViewOf = (control) => new Uint8Array(control.buffer, control.byteOffset + HEADER_BYTES, control.byteLength - HEADER_BYTES);
var splitChunk = (input, maxBytes) => {
  const encoded = encoder.encode(input);
  if (encoded.length <= maxBytes) {
    return { bytes: encoded, rest: "" };
  }
  let left = 0;
  let right = input.length;
  while (left < right) {
    const middle = Math.ceil((left + right) / 2);
    if (encoder.encode(input.slice(0, middle)).length <= maxBytes) {
      left = middle;
    } else {
      right = middle - 1;
    }
  }
  const chunk = input.slice(0, left);
  return {
    bytes: encoder.encode(chunk),
    rest: input.slice(left)
  };
};
var flushQueuedStdin = (queue, buffer) => {
  if (!queue.length)
    return false;
  const control = controlViewOf(buffer);
  const payload = payloadViewOf(control);
  const next = queue[0] || "";
  const { bytes, rest } = splitChunk(next, payload.length);
  payload.fill(0);
  payload.set(bytes);
  Atomics.store(control, LENGTH_INDEX, bytes.length);
  Atomics.add(control, SEQUENCE_INDEX, 1);
  Atomics.notify(control, SEQUENCE_INDEX);
  if (rest) {
    queue[0] = rest;
  } else {
    queue.shift();
  }
  return true;
};
var readBufferedStdin = (buffer) => {
  const control = controlViewOf(buffer);
  const length = Atomics.load(control, LENGTH_INDEX);
  if (length === EOF_LENGTH)
    return null;
  const payload = payloadViewOf(control);
  return decoder.decode(payload.slice(0, length));
};
var bufferedSequence = (buffer) => Atomics.load(controlViewOf(buffer), SEQUENCE_INDEX);
var waitForBufferedSequenceChange = (buffer, sequence, timeoutMs = 5e3) => new Promise((resolve, reject) => {
  const startedAt = Date.now();
  const poll = () => {
    if (bufferedSequence(buffer) !== sequence) {
      resolve(readBufferedStdin(buffer));
      return;
    }
    if (Date.now() - startedAt >= timeoutMs) {
      reject(new Error("Timed out waiting for buffered value"));
      return;
    }
    setTimeout(poll, 10);
  };
  poll();
});
var resetBufferedStdin = (buffer) => {
  const control = controlViewOf(buffer);
  const payload = payloadViewOf(control);
  payload.fill(0);
  Atomics.store(control, SEQUENCE_INDEX, 0);
  Atomics.store(control, LENGTH_INDEX, 0);
};

// node_modules/@wasm-idle/llvm-core/dist/clang/src/app.js
var ESUCCESS = 0;
var ENOENT = 44;
var ENOTSUP = 58;
var WASI_RIGHT_FD_READ = 1 << 1;
var WASI_RIGHT_FD_SEEK = 1 << 2;
var WASI_RIGHT_FD_SYNC = 1 << 4;
var WASI_RIGHT_FD_TELL = 1 << 5;
var WASI_RIGHT_FD_WRITE = 1 << 6;
var WASI_RIGHT_FD_FILESTAT_GET = 1 << 21;
var WASI_RIGHT_FD_FILESTAT_SET_SIZE = 1 << 22;
var WASI_O_CREAT = 1 << 0;
var WASI_O_TRUNC = 1 << 3;
var WASI_FILETYPE_REGULAR_FILE = 4;
var WASI_SEEK_SET = 0;
var WASI_SEEK_CUR = 1;
var WASI_SEEK_END = 2;
var RAF_PROC_EXIT_CODE = 789514;
var App = class {
  ready;
  mem = null;
  memfs;
  instance = null;
  exports;
  trace = () => {
  };
  debugSession;
  useJsReadOverlay = false;
  useJsSourceReadOverlay = false;
  argv;
  environ;
  handles = /* @__PURE__ */ new Map();
  nextHandle = 1024;
  syntheticFileHandles = /* @__PURE__ */ new Set();
  nextSyntheticInode = 1;
  syntheticInodes = /* @__PURE__ */ new Map();
  readFileHandles = /* @__PURE__ */ new Map();
  writeFileHandles = /* @__PURE__ */ new Map();
  constructor(module, memfs, name, ...argsAndOptions) {
    const lastArgument = argsAndOptions.at(-1);
    const options = lastArgument && typeof lastArgument === "object" ? argsAndOptions.pop() : {};
    const args = argsAndOptions;
    this.argv = [name, ...args];
    this.environ = { USER: "wasm-clang" };
    this.memfs = memfs;
    this.useJsReadOverlay = name === "wasm-ld" || name === "ld.lld" || name === "lld";
    this.useJsSourceReadOverlay = name === "clang" || name === "clang++" || name === "cobc";
    const env = bindNew(this, "__wasm_idle_debug_enter", "__wasm_idle_debug_leave", "__wasm_idle_debug_line", "__wasm_idle_debug_value_num", "__wasm_idle_debug_value_bool", "__wasm_idle_debug_value_addr", "__wasm_idle_debug_value_text");
    const wasi = {
      ...bindNew(this, "proc_exit", "environ_sizes_get", "environ_get", "args_sizes_get", "args_get", "random_get", "clock_time_get", "poll_oneoff", "fd_filestat_set_times", "path_filestat_set_times", "sock_accept", "sock_recv", "sock_send", "sock_shutdown", "path_link", "path_rename"),
      ...this.memfs.exports,
      ...bindNew(this, "path_open", "path_filestat_get", "path_readlink", "path_unlink_file", "fd_fdstat_get", "fd_fdstat_set_flags", "fd_filestat_get", "fd_filestat_set_size", "fd_datasync", "fd_read", "fd_pread", "fd_seek", "fd_tell", "fd_write", "fd_close")
    };
    const extraEnv = options.extraImports?.env || {};
    this.ready = getInstance(module, {
      ...options.extraImports,
      wasi_unstable: wasi,
      wasi_snapshot_preview1: wasi,
      env: { ...extraEnv, ...env }
    }).then((instance) => {
      this.instance = instance;
      if (options.instanceRef)
        options.instanceRef.current = instance;
      this.exports = this.instance.exports;
      this.mem = new Memory(this.exports.memory);
      this.memfs.hostMem = this.mem;
    });
  }
  async run() {
    await this.ready;
    this.trace(`start(argv=${JSON.stringify(this.argv)}, exports=${JSON.stringify(Object.keys(this.exports || {}))})`);
    try {
      this.exports._start();
    } catch (exn) {
      let writeStack = true;
      if (exn instanceof ProcExit) {
        this.trace(`proc_exit(code=${exn.code})`);
        if (exn.code === RAF_PROC_EXIT_CODE) {
          this.trace("allow_rAF_after_exit");
          return true;
        }
        this.trace(`disallow_rAF_after_exit(code=${exn.code})`);
        if (exn.code == 0)
          return false;
        writeStack = false;
      }
      if (exn instanceof NotImplemented)
        this.trace(`not_implemented(${exn.message})`);
      let msg = `\x1B[91mError: ${exn.message}`;
      if (writeStack)
        msg = msg + `
${exn.stack}`;
      msg += "\x1B[0m\n";
      this.memfs.stdout(msg);
      throw exn;
    }
    this.trace("start() returned without proc_exit");
  }
  proc_exit(code) {
    this.trace(`proc_exit_throw(code=${code})`);
    throw new ProcExit(code);
  }
  toNumber(value) {
    return typeof value === "bigint" ? Number(value) : value;
  }
  writeU32(ptr, value) {
    this.mem.view.setUint32(ptr, value >>> 0, true);
  }
  writeU64(ptr, value) {
    const wide = BigInt(value);
    this.mem.view.setUint32(ptr, Number(wide & 0xffffffffn), true);
    this.mem.view.setUint32(ptr + 4, Number(wide >> 32n & 0xffffffffn), true);
  }
  readMemfsFile(path) {
    const candidates = [
      path,
      path.replace(/^\/+/, ""),
      path.replace(/^\.\//, ""),
      path.replace(/^\/+/, "").replace(/^\.\//, "")
    ];
    for (const candidate of candidates) {
      if (!this.memfs.hasFile(candidate))
        continue;
      try {
        return Uint8Array.from(this.memfs.getFileContents(candidate));
      } catch {
      }
    }
    return null;
  }
  shouldUseJsReadForPath(path) {
    if (this.useJsReadOverlay)
      return true;
    return this.useJsSourceReadOverlay;
  }
  syntheticInodeForPath(path) {
    const normalized = path.replace(/^\/+/, "").replace(/^\.\//, "");
    const key = normalized || path;
    let inode = this.syntheticInodes.get(key);
    if (!inode) {
      inode = this.nextSyntheticInode++;
      this.syntheticInodes.set(key, inode);
    }
    return inode;
  }
  copyFileToIovs(contents, position, iovs, iovsLen, nread) {
    this.mem.check();
    let copied = 0;
    for (let index = 0; index < iovsLen; index += 1) {
      const buffer = this.mem.read32(iovs);
      iovs += 4;
      const length = this.mem.read32(iovs);
      iovs += 4;
      if (length <= 0)
        continue;
      const available = Math.max(0, contents.length - position);
      const chunkLength = Math.min(length, available);
      if (chunkLength > 0) {
        this.mem.write(buffer, contents.subarray(position, position + chunkLength));
        position += chunkLength;
        copied += chunkLength;
      }
      if (chunkLength < length)
        break;
    }
    this.writeU32(nread, copied);
    return { copied, position };
  }
  writeRegularFileStat(statPtr, size, path) {
    this.mem.check();
    this.writeU64(statPtr, 1);
    this.writeU64(statPtr + 8, this.syntheticInodeForPath(path));
    this.mem.write8(statPtr + 16, WASI_FILETYPE_REGULAR_FILE);
    this.writeU64(statPtr + 24, 1);
    this.writeU64(statPtr + 32, size);
    this.writeU64(statPtr + 40, 0);
    this.writeU64(statPtr + 48, 0);
    this.writeU64(statPtr + 56, 0);
  }
  seekPosition(current, size, offset, whence) {
    const numericOffset = this.toNumber(offset);
    if (whence === WASI_SEEK_SET)
      return Math.max(0, numericOffset);
    if (whence === WASI_SEEK_CUR)
      return Math.max(0, current + numericOffset);
    if (whence === WASI_SEEK_END)
      return Math.max(0, size + numericOffset);
    return null;
  }
  ensureWriteCapacity(handle, capacity) {
    if (handle.contents.length >= capacity)
      return;
    let nextCapacity = Math.max(1024, handle.contents.length);
    while (nextCapacity < capacity)
      nextCapacity *= 2;
    const next = new Uint8Array(nextCapacity);
    next.set(handle.contents.subarray(0, handle.size));
    handle.contents = next;
  }
  atomicOutputTarget(path) {
    const match = path.match(/^(.+)-[0-9a-f]+(\.[^.]+)\.tmp$/);
    if (!match)
      return null;
    return `${match[1]}${match[2]}`;
  }
  storeFileContents(path, contents) {
    if (this.useJsReadOverlay || this.useJsSourceReadOverlay) {
      this.memfs.setFile(path, contents);
      return;
    }
    this.memfs.addFile(path, contents);
  }
  path_open(dirfd, dirflags, pathPtr, pathLen, oflags, fsRightsBase, fsRightsInheriting, fdflags, openedFd) {
    this.mem.check();
    const path = this.mem.readStr(pathPtr, pathLen);
    const rights = this.toNumber(fsRightsBase);
    const writesFile = (rights & WASI_RIGHT_FD_WRITE) !== 0 || (oflags & (WASI_O_CREAT | WASI_O_TRUNC)) !== 0;
    this.trace(`path_open_request(path=${JSON.stringify(path)}, rights=${rights}, oflags=${oflags}, write=${writesFile})`);
    const overlayReadContents = !writesFile && this.shouldUseJsReadForPath(path) && (rights & WASI_RIGHT_FD_READ) !== 0 ? this.readMemfsFile(path) : null;
    if (!writesFile && this.shouldUseJsReadForPath(path) && (rights & WASI_RIGHT_FD_READ) !== 0 && !overlayReadContents) {
      this.trace(`path_open_read_missing(path=${JSON.stringify(path)})`);
      return ENOENT;
    }
    let result = ESUCCESS;
    let fd2;
    if (this.useJsReadOverlay && (writesFile || overlayReadContents)) {
      fd2 = this.nextHandle++;
      this.syntheticFileHandles.add(fd2);
      this.writeU32(openedFd, fd2);
      this.trace(`path_open_overlay(fd=${fd2}, path=${JSON.stringify(path)})`);
    } else {
      result = this.memfs.exports.path_open(dirfd, dirflags, pathPtr, pathLen, oflags, fsRightsBase, fsRightsInheriting, fdflags, openedFd);
      if (result !== ESUCCESS)
        return result;
      fd2 = this.mem.read32(openedFd);
    }
    if (writesFile) {
      const existing = (oflags & WASI_O_TRUNC) === 0 ? this.readMemfsFile(path) : null;
      const contents2 = existing ? Uint8Array.from(existing) : new Uint8Array(0);
      this.writeFileHandles.set(fd2, {
        path,
        contents: contents2,
        position: 0,
        size: contents2.length
      });
      this.readFileHandles.delete(fd2);
      this.trace(`path_open_write(fd=${fd2}, path=${JSON.stringify(path)}, size=${contents2.length})`);
      return result;
    }
    if (!this.shouldUseJsReadForPath(path) || (rights & WASI_RIGHT_FD_READ) === 0) {
      return result;
    }
    const contents = overlayReadContents || this.readMemfsFile(path);
    if (!contents)
      return result;
    this.readFileHandles.set(fd2, { path, contents, position: 0 });
    this.trace(`path_open_read(fd=${fd2}, path=${JSON.stringify(path)}, size=${contents.length})`);
    return result;
  }
  path_filestat_get(dirfd, flags, pathPtr, pathLen, statPtr) {
    this.mem.check();
    const path = this.mem.readStr(pathPtr, pathLen);
    if (!this.shouldUseJsReadForPath(path)) {
      return this.memfs.exports.path_filestat_get(dirfd, flags, pathPtr, pathLen, statPtr);
    }
    const contents = this.readMemfsFile(path);
    if (!contents) {
      return this.memfs.exports.path_filestat_get(dirfd, flags, pathPtr, pathLen, statPtr);
    }
    this.writeRegularFileStat(statPtr, contents.length, path);
    this.trace(`path_filestat_get(path=${JSON.stringify(path)}, size=${contents.length})`);
    return ESUCCESS;
  }
  fd_fdstat_get(fd2, fdstatPtr) {
    const handle = this.readFileHandles.get(fd2) || this.writeFileHandles.get(fd2);
    if (!handle)
      return this.memfs.exports.fd_fdstat_get(fd2, fdstatPtr);
    const rights = this.writeFileHandles.has(fd2) ? WASI_RIGHT_FD_WRITE | WASI_RIGHT_FD_SEEK | WASI_RIGHT_FD_TELL | WASI_RIGHT_FD_SYNC | WASI_RIGHT_FD_FILESTAT_GET | WASI_RIGHT_FD_FILESTAT_SET_SIZE : WASI_RIGHT_FD_READ | WASI_RIGHT_FD_SEEK | WASI_RIGHT_FD_TELL | WASI_RIGHT_FD_FILESTAT_GET;
    this.mem.check();
    this.mem.write8(fdstatPtr, WASI_FILETYPE_REGULAR_FILE);
    this.mem.write8(fdstatPtr + 1, 0);
    this.mem.write8(fdstatPtr + 2, 0);
    this.mem.write8(fdstatPtr + 3, 0);
    this.writeU64(fdstatPtr + 8, rights);
    this.writeU64(fdstatPtr + 16, 0);
    this.trace(`fd_fdstat_get(fd=${fd2}, path=${JSON.stringify(handle.path)})`);
    return ESUCCESS;
  }
  fd_filestat_get(fd2, statPtr) {
    const writeHandle = this.writeFileHandles.get(fd2);
    const readHandle = this.readFileHandles.get(fd2);
    const handle = writeHandle || readHandle;
    if (!handle)
      return this.memfs.exports.fd_filestat_get(fd2, statPtr);
    const size = writeHandle ? writeHandle.size : readHandle?.contents.length || 0;
    this.writeRegularFileStat(statPtr, size, handle.path);
    this.trace(`fd_filestat_get(fd=${fd2}, path=${JSON.stringify(handle.path)}, size=${size})`);
    return ESUCCESS;
  }
  fd_filestat_set_size(fd2, size) {
    const handle = this.writeFileHandles.get(fd2);
    if (!handle)
      return this.memfs.exports.fd_filestat_set_size(fd2, size);
    const nextSize = this.toNumber(size);
    this.ensureWriteCapacity(handle, nextSize);
    if (nextSize > handle.size)
      handle.contents.fill(0, handle.size, nextSize);
    handle.size = nextSize;
    if (handle.position > nextSize)
      handle.position = nextSize;
    this.trace(`fd_filestat_set_size(fd=${fd2}, size=${nextSize})`);
    return ESUCCESS;
  }
  fd_read(fd2, iovs, iovsLen, nread) {
    const handle = this.readFileHandles.get(fd2);
    if (!handle)
      return this.memfs.exports.fd_read(fd2, iovs, iovsLen, nread);
    const result = this.copyFileToIovs(handle.contents, handle.position, iovs, iovsLen, nread);
    handle.position = result.position;
    this.trace(`fd_read(fd=${fd2}, bytes=${result.copied})`);
    return ESUCCESS;
  }
  fd_pread(fd2, iovs, iovsLen, offset, nread) {
    const handle = this.readFileHandles.get(fd2);
    if (!handle)
      return this.memfs.exports.fd_pread(fd2, iovs, iovsLen, offset, nread);
    const result = this.copyFileToIovs(handle.contents, this.toNumber(offset), iovs, iovsLen, nread);
    this.trace(`fd_pread(fd=${fd2}, offset=${this.toNumber(offset)}, bytes=${result.copied})`);
    return ESUCCESS;
  }
  fd_seek(fd2, offset, whence, newOffset) {
    const writeHandle = this.writeFileHandles.get(fd2);
    if (writeHandle) {
      const position2 = this.seekPosition(writeHandle.position, writeHandle.size, offset, whence);
      if (position2 == null) {
        return this.memfs.exports.fd_seek(fd2, offset, whence, newOffset);
      }
      writeHandle.position = position2;
      this.mem.check();
      this.writeU64(newOffset, writeHandle.position);
      this.trace(`fd_seek_write(fd=${fd2}, offset=${this.toNumber(offset)}, whence=${whence})`);
      return ESUCCESS;
    }
    const handle = this.readFileHandles.get(fd2);
    if (!handle) {
      return this.memfs.exports.fd_seek(fd2, offset, whence, newOffset);
    }
    const position = this.seekPosition(handle.position, handle.contents.length, offset, whence);
    if (position == null) {
      return this.memfs.exports.fd_seek(fd2, offset, whence, newOffset);
    }
    handle.position = position;
    this.mem.check();
    this.writeU64(newOffset, handle.position);
    this.trace(`fd_seek(fd=${fd2}, offset=${this.toNumber(offset)}, whence=${whence})`);
    return ESUCCESS;
  }
  fd_tell(fd2, newOffset) {
    const position = this.writeFileHandles.get(fd2)?.position ?? this.readFileHandles.get(fd2)?.position;
    if (position == null) {
      const fallback = this.memfs.exports.fd_tell;
      return typeof fallback === "function" ? fallback(fd2, newOffset) : ENOENT;
    }
    this.mem.check();
    this.writeU64(newOffset, position);
    this.trace(`fd_tell(fd=${fd2}, offset=${position})`);
    return ESUCCESS;
  }
  fd_datasync(fd2) {
    if (this.writeFileHandles.has(fd2) || this.readFileHandles.has(fd2))
      return ESUCCESS;
    const fallback = this.memfs.exports.fd_datasync;
    return typeof fallback === "function" ? fallback(fd2) : ESUCCESS;
  }
  fd_fdstat_set_flags(fd2, flags) {
    if (this.writeFileHandles.has(fd2) || this.readFileHandles.has(fd2))
      return ESUCCESS;
    const fallback = this.memfs.exports.fd_fdstat_set_flags;
    return typeof fallback === "function" ? fallback(fd2, flags) : ESUCCESS;
  }
  path_readlink(_fd, pathPointer, pathLength, _buffer, _bufferLength, bytesUsed) {
    this.mem.check();
    this.writeU32(bytesUsed, 0);
    this.trace(`path_readlink(path=${JSON.stringify(this.mem.readStr(pathPointer, pathLength))})`);
    return ENOENT;
  }
  path_unlink_file(_fd, pathPointer, pathLength) {
    this.mem.check();
    const path = this.mem.readStr(pathPointer, pathLength);
    this.trace(`path_unlink_file(path=${JSON.stringify(path)})`);
    return ESUCCESS;
  }
  fd_write(fd2, iovs, iovsLen, nwritten) {
    const handle = this.writeFileHandles.get(fd2);
    if (!handle) {
      return this.memfs.exports.fd_write(fd2, iovs, iovsLen, nwritten);
    }
    this.mem.check();
    let copied = 0;
    for (let index = 0; index < iovsLen; index += 1) {
      const buffer = this.mem.read32(iovs);
      iovs += 4;
      const length = this.mem.read32(iovs);
      iovs += 4;
      if (length <= 0)
        continue;
      this.ensureWriteCapacity(handle, handle.position + length);
      handle.contents.set(new Uint8Array(this.mem.buffer, buffer, length), handle.position);
      handle.position += length;
      handle.size = Math.max(handle.size, handle.position);
      copied += length;
    }
    this.writeU32(nwritten, copied);
    this.trace(`fd_write(fd=${fd2}, bytes=${copied})`);
    return ESUCCESS;
  }
  fd_close(fd2) {
    const synthetic = this.syntheticFileHandles.delete(fd2);
    if (this.readFileHandles.has(fd2)) {
      this.readFileHandles.delete(fd2);
      const closeResult = synthetic ? ESUCCESS : this.memfs.exports.fd_close(fd2);
      this.trace(`fd_close_read(fd=${fd2}, close=${closeResult})`);
      return closeResult;
    }
    const writeHandle = this.writeFileHandles.get(fd2);
    if (writeHandle) {
      this.writeFileHandles.delete(fd2);
      const closeResult = synthetic ? ESUCCESS : this.memfs.exports.fd_close(fd2);
      const contents = writeHandle.contents.subarray(0, writeHandle.size);
      this.storeFileContents(writeHandle.path, contents);
      const target = this.atomicOutputTarget(writeHandle.path);
      if (target)
        this.storeFileContents(target, contents);
      this.trace(`fd_close_write(fd=${fd2}, path=${JSON.stringify(writeHandle.path)}, size=${writeHandle.size}, close=${closeResult}, target=${JSON.stringify(target)})`);
      return ESUCCESS;
    }
    if (synthetic)
      return ESUCCESS;
    return this.memfs.exports.fd_close(fd2);
  }
  debugEvaluate(expression) {
    const session = this.debugSession;
    if (!session)
      throw new Error("unavailable");
    const frame = [...session.frames].reverse().find((candidate) => candidate.functionId === session.currentFunctionId);
    const activeLine = session.currentLine;
    const activeLocals = [...session.variableMetadata[session.currentFunctionId] || []].reverse().filter((variable) => activeLine >= variable.fromLine && activeLine <= variable.toLine);
    const activeGlobals = [...session.globalVariableMetadata || []].reverse().filter((variable) => activeLine >= variable.fromLine && activeLine <= variable.toLine);
    return evaluateDebugExpressionWithResolver(expression, (name) => {
      const resolveArrayValue = (variable, addressValue) => {
        const dimensions = variable.dimensions?.length ? variable.dimensions : variable.length ? [variable.length] : [];
        const address = Number(addressValue);
        if (!Number.isFinite(address) || address <= 0 || !dimensions.length || !variable.elementKind && !variable.structFields?.length) {
          throw new Error("unavailable");
        }
        this.mem?.check?.();
        const scalarSize = variable.structFields?.length && variable.structSize ? variable.structSize : variable.elementKind === "double" ? 8 : variable.elementKind === "bool" || variable.elementKind === "char" ? 1 : 4;
        const readScalar = (kind, offset) => {
          if (kind === "bool")
            return !!this.mem.read8(offset);
          if (kind === "char") {
            const charCode = this.mem.read8(offset);
            return charCode >= 32 && charCode <= 126 ? String.fromCharCode(charCode) : charCode;
          }
          if (kind === "float")
            return this.mem.readFloat32(offset);
          if (kind === "double")
            return this.mem.readFloat64(offset);
          return this.mem.readInt32(offset);
        };
        const buildStructValue = (baseAddress) => ({
          __debugExpressionKind: "object",
          has: (fieldName) => !!variable.structFields?.some((field) => field.name === fieldName),
          get: (fieldName) => {
            const field = variable.structFields?.find((candidate) => candidate.name === fieldName);
            if (!field)
              throw new Error("unavailable");
            return readScalar(field.kind, baseAddress + field.offset);
          },
          keys: () => variable.structFields?.map((field) => field.name) || []
        });
        const buildArrayValue = (baseAddress, remainingDimensions) => ({
          __debugExpressionKind: "array",
          length: remainingDimensions[0],
          truncated: remainingDimensions[0] > 8,
          get: (index) => {
            if (!Number.isInteger(index) || index < 0 || index >= remainingDimensions[0]) {
              throw new Error("unavailable");
            }
            if (remainingDimensions.length > 1) {
              const nestedStride = remainingDimensions.slice(1).reduce((total, size) => total * size, 1) * scalarSize;
              return buildArrayValue(baseAddress + index * nestedStride, remainingDimensions.slice(1));
            }
            if (variable.structFields?.length && variable.structSize) {
              return buildStructValue(baseAddress + index * variable.structSize);
            }
            if (!variable.elementKind)
              throw new Error("unavailable");
            return readScalar(variable.elementKind, baseAddress + index * scalarSize);
          },
          keys: () => Array.from({ length: Math.min(remainingDimensions[0], 8) }, (_, index) => index)
        });
        return buildArrayValue(address, dimensions);
      };
      const resolveVariableValue = (variable, storedValue) => {
        if (storedValue == null || storedValue === "?")
          throw new Error("unavailable");
        if (variable.kind === "array")
          return resolveArrayValue(variable, storedValue);
        return parseStoredDebugValue(storedValue);
      };
      const localVariable = activeLocals.find((variable) => variable.name === name);
      if (localVariable) {
        return resolveVariableValue(localVariable, frame?.values.get(localVariable.slot));
      }
      const globalVariable = activeGlobals.find((variable) => variable.name === name);
      if (globalVariable) {
        return resolveVariableValue(globalVariable, session.globalValues.get(globalVariable.slot));
      }
      throw new Error("unavailable");
    });
  }
  pauseDebugSession(session, functionId, line, reason) {
    const buffer = session.buffer;
    if (!buffer)
      return ESUCCESS;
    session.currentFunctionId = functionId;
    session.currentLine = line;
    const frame = [...session.frames].reverse().find((candidate) => candidate.functionId === functionId);
    if (frame)
      frame.line = line;
    session.pauseOnEntry = false;
    session.stepArmed = false;
    session.nextLineArmed = false;
    session.nextLineDepth = 0;
    session.stepOutArmed = false;
    this.trace(`pause(function=${functionId}, line=${line}, reason=${reason})`);
    const locals = session.variableMetadata[functionId]?.flatMap((variable) => {
      if (line < variable.fromLine || line > variable.toLine)
        return [];
      if (variable.kind === "array") {
        this.mem?.check?.();
        const address = Number(frame?.values.get(variable.slot) ?? Number.NaN);
        const dimensions = variable.dimensions?.length ? variable.dimensions : variable.length ? [variable.length] : [];
        if (!Number.isFinite(address) || address <= 0 || !dimensions.length || !variable.elementKind && !variable.structFields?.length) {
          return [{ name: variable.name, value: "?" }];
        }
        if (variable.structFields?.length && variable.structSize) {
          const previewLength2 = Math.min(dimensions[0], 8);
          const values2 = [];
          for (let index = 0; index < previewLength2; index += 1) {
            const fieldValues = [];
            for (const field of variable.structFields) {
              const offset = address + index * variable.structSize + field.offset;
              if (field.kind === "bool") {
                fieldValues.push(`${field.name}: ${this.mem.read8(offset) ? "true" : "false"}`);
                continue;
              }
              if (field.kind === "char") {
                const charCode = this.mem.read8(offset);
                fieldValues.push(`${field.name}: ${charCode >= 32 && charCode <= 126 ? `'${String.fromCharCode(charCode)}'` : `${charCode}`}`);
                continue;
              }
              if (field.kind === "float") {
                fieldValues.push(`${field.name}: ${this.mem.readFloat32(offset)}`);
                continue;
              }
              if (field.kind === "double") {
                fieldValues.push(`${field.name}: ${this.mem.readFloat64(offset)}`);
                continue;
              }
              fieldValues.push(`${field.name}: ${this.mem.readInt32(offset)}`);
            }
            values2.push(`{${fieldValues.join(", ")}}`);
          }
          return [
            {
              name: variable.name,
              value: `[${values2.join(", ")}${dimensions[0] > previewLength2 ? ", ..." : ""}]`
            }
          ];
        }
        if (!variable.elementKind)
          return [{ name: variable.name, value: "?" }];
        const elementStride = variable.elementKind === "double" ? 8 : variable.elementKind === "bool" || variable.elementKind === "char" ? 1 : 4;
        if (dimensions.length === 2) {
          const previewRows = Math.min(dimensions[0], 4);
          const previewCols = Math.min(dimensions[1], 8);
          const rows = [];
          for (let row = 0; row < previewRows; row += 1) {
            const values2 = [];
            for (let col = 0; col < previewCols; col += 1) {
              const offset = address + (row * dimensions[1] + col) * elementStride;
              if (variable.elementKind === "bool") {
                values2.push(this.mem.read8(offset) ? "true" : "false");
                continue;
              }
              if (variable.elementKind === "char") {
                const charCode = this.mem.read8(offset);
                values2.push(charCode >= 32 && charCode <= 126 ? `'${String.fromCharCode(charCode)}'` : `${charCode}`);
                continue;
              }
              if (variable.elementKind === "float") {
                values2.push(`${this.mem.readFloat32(offset)}`);
                continue;
              }
              if (variable.elementKind === "double") {
                values2.push(`${this.mem.readFloat64(offset)}`);
                continue;
              }
              values2.push(`${this.mem.readInt32(offset)}`);
            }
            rows.push(`[${values2.join(", ")}${dimensions[1] > previewCols ? ", ..." : ""}]`);
          }
          return [
            {
              name: variable.name,
              value: `[${rows.join(", ")}${dimensions[0] > previewRows ? ", ..." : ""}]`
            }
          ];
        }
        const previewLength = Math.min(dimensions[0], 8);
        const values = [];
        for (let index = 0; index < previewLength; index += 1) {
          const offset = address + index * elementStride;
          if (variable.elementKind === "bool") {
            values.push(this.mem.read8(offset) ? "true" : "false");
            continue;
          }
          if (variable.elementKind === "char") {
            const charCode = this.mem.read8(offset);
            values.push(charCode >= 32 && charCode <= 126 ? `'${String.fromCharCode(charCode)}'` : `${charCode}`);
            continue;
          }
          if (variable.elementKind === "float") {
            values.push(`${this.mem.readFloat32(offset)}`);
            continue;
          }
          if (variable.elementKind === "double") {
            values.push(`${this.mem.readFloat64(offset)}`);
            continue;
          }
          values.push(`${this.mem.readInt32(offset)}`);
        }
        return [
          {
            name: variable.name,
            value: `[${values.join(", ")}${dimensions[0] > previewLength ? ", ..." : ""}]`
          }
        ];
      }
      const value = frame?.values.get(variable.slot) ?? "?";
      return [{ name: variable.name, value }];
    }) || [];
    const localNames = new Set(locals.map((variable) => variable.name));
    const globals = (session.globalVariableMetadata || []).flatMap((variable) => {
      if (localNames.has(variable.name))
        return [];
      if (line < variable.fromLine || line > variable.toLine)
        return [];
      if (variable.kind === "array") {
        this.mem?.check?.();
        const address = Number(session.globalValues?.get(variable.slot) ?? Number.NaN);
        const dimensions = variable.dimensions?.length ? variable.dimensions : variable.length ? [variable.length] : [];
        if (!Number.isFinite(address) || address <= 0 || !dimensions.length || !variable.elementKind && !variable.structFields?.length) {
          return [{ name: variable.name, value: "?" }];
        }
        if (variable.structFields?.length && variable.structSize) {
          const previewLength2 = Math.min(dimensions[0], 8);
          const values2 = [];
          for (let index = 0; index < previewLength2; index += 1) {
            const fieldValues = [];
            for (const field of variable.structFields) {
              const offset = address + index * variable.structSize + field.offset;
              if (field.kind === "bool") {
                fieldValues.push(`${field.name}: ${this.mem.read8(offset) ? "true" : "false"}`);
                continue;
              }
              if (field.kind === "char") {
                const charCode = this.mem.read8(offset);
                fieldValues.push(`${field.name}: ${charCode >= 32 && charCode <= 126 ? `'${String.fromCharCode(charCode)}'` : `${charCode}`}`);
                continue;
              }
              if (field.kind === "float") {
                fieldValues.push(`${field.name}: ${this.mem.readFloat32(offset)}`);
                continue;
              }
              if (field.kind === "double") {
                fieldValues.push(`${field.name}: ${this.mem.readFloat64(offset)}`);
                continue;
              }
              fieldValues.push(`${field.name}: ${this.mem.readInt32(offset)}`);
            }
            values2.push(`{${fieldValues.join(", ")}}`);
          }
          return [
            {
              name: variable.name,
              value: `[${values2.join(", ")}${dimensions[0] > previewLength2 ? ", ..." : ""}]`
            }
          ];
        }
        if (!variable.elementKind)
          return [{ name: variable.name, value: "?" }];
        const elementStride = variable.elementKind === "double" ? 8 : variable.elementKind === "bool" || variable.elementKind === "char" ? 1 : 4;
        if (dimensions.length === 2) {
          const previewRows = Math.min(dimensions[0], 4);
          const previewCols = Math.min(dimensions[1], 8);
          const rows = [];
          for (let row = 0; row < previewRows; row += 1) {
            const values2 = [];
            for (let col = 0; col < previewCols; col += 1) {
              const offset = address + (row * dimensions[1] + col) * elementStride;
              if (variable.elementKind === "bool") {
                values2.push(this.mem.read8(offset) ? "true" : "false");
                continue;
              }
              if (variable.elementKind === "char") {
                const charCode = this.mem.read8(offset);
                values2.push(charCode >= 32 && charCode <= 126 ? `'${String.fromCharCode(charCode)}'` : `${charCode}`);
                continue;
              }
              if (variable.elementKind === "float") {
                values2.push(`${this.mem.readFloat32(offset)}`);
                continue;
              }
              if (variable.elementKind === "double") {
                values2.push(`${this.mem.readFloat64(offset)}`);
                continue;
              }
              values2.push(`${this.mem.readInt32(offset)}`);
            }
            rows.push(`[${values2.join(", ")}${dimensions[1] > previewCols ? ", ..." : ""}]`);
          }
          return [
            {
              name: variable.name,
              value: `[${rows.join(", ")}${dimensions[0] > previewRows ? ", ..." : ""}]`
            }
          ];
        }
        const previewLength = Math.min(dimensions[0], 8);
        const values = [];
        for (let index = 0; index < previewLength; index += 1) {
          const offset = address + index * elementStride;
          if (variable.elementKind === "bool") {
            values.push(this.mem.read8(offset) ? "true" : "false");
            continue;
          }
          if (variable.elementKind === "char") {
            const charCode = this.mem.read8(offset);
            values.push(charCode >= 32 && charCode <= 126 ? `'${String.fromCharCode(charCode)}'` : `${charCode}`);
            continue;
          }
          if (variable.elementKind === "float") {
            values.push(`${this.mem.readFloat32(offset)}`);
            continue;
          }
          if (variable.elementKind === "double") {
            values.push(`${this.mem.readFloat64(offset)}`);
            continue;
          }
          values.push(`${this.mem.readInt32(offset)}`);
        }
        return [
          {
            name: variable.name,
            value: `[${values.join(", ")}${dimensions[0] > previewLength ? ", ..." : ""}]`
          }
        ];
      }
      const value = session.globalValues?.get(variable.slot) ?? "?";
      return [{ name: variable.name, value }];
    }) || [];
    const effectiveLocals = new Map(locals.map((variable) => [variable.name, variable]));
    const effectiveGlobals = new Map(globals.map((variable) => [variable.name, variable]));
    for (const name of effectiveLocals.keys())
      effectiveGlobals.delete(name);
    session.onPause?.({
      type: "pause",
      line,
      reason,
      locals: [...effectiveLocals.values(), ...effectiveGlobals.values()],
      callStack: [...session.frames].reverse().map((stackFrame) => ({
        functionName: stackFrame.functionName,
        line: stackFrame.line
      }))
    });
    const sequence = Atomics.load(buffer, 0);
    while (true) {
      if (session.interruptBuffer?.[0] === 2)
        throw new AbortError();
      Atomics.wait(buffer, 0, sequence, 100);
      if (session.interruptBuffer?.[0] === 2)
        throw new AbortError();
      const command = Atomics.exchange(buffer, 1, 0);
      if (command === 1) {
        session.resumeSkipActive = true;
        session.resumeSkipFunctionId = session.currentFunctionId;
        session.resumeSkipLine = session.currentLine;
        return ESUCCESS;
      }
      if (command === 2) {
        session.stepArmed = true;
        session.resumeSkipActive = true;
        session.resumeSkipFunctionId = session.currentFunctionId;
        session.resumeSkipLine = session.currentLine;
        return ESUCCESS;
      }
      if (command === 3) {
        session.nextLineArmed = true;
        session.nextLineFunctionId = session.currentFunctionId;
        session.nextLineLine = session.currentLine;
        session.nextLineDepth = session.callDepth;
        session.resumeSkipActive = true;
        session.resumeSkipFunctionId = session.currentFunctionId;
        session.resumeSkipLine = session.currentLine;
        return ESUCCESS;
      }
      if (command === 4) {
        session.stepOutArmed = true;
        session.stepOutDepth = Math.max(0, session.callDepth - 1);
        session.resumeSkipActive = true;
        session.resumeSkipFunctionId = session.currentFunctionId;
        session.resumeSkipLine = session.currentLine;
        return ESUCCESS;
      }
      if (command === 5) {
        const expression = session.watchBuffer ? readBufferedStdin(session.watchBuffer) : "";
        let result = "?";
        try {
          result = expression ? this.debugEvaluate(expression) : "?";
        } catch (error) {
          result = error instanceof Error && error.message === "unavailable" ? "?" : "error";
        }
        if (session.watchResultBuffer)
          flushQueuedStdin([result], session.watchResultBuffer);
      }
    }
  }
  __wasm_idle_debug_enter(functionId, line) {
    const session = this.debugSession;
    if (!session?.buffer)
      return ESUCCESS;
    session.callDepth += 1;
    session.currentFunctionId = functionId;
    session.currentLine = line;
    session.frames.push({
      functionId,
      functionName: session.functionMetadata[functionId] || `fn_${functionId}`,
      line,
      values: /* @__PURE__ */ new Map()
    });
    this.trace(`enter(function=${functionId}, line=${line}, depth=${session.callDepth})`);
    if (session.pauseOnEntry) {
      return this.pauseDebugSession(session, functionId, line, "entry");
    }
    if (session.stepArmed) {
      return this.pauseDebugSession(session, functionId, line, "step");
    }
    return ESUCCESS;
  }
  __wasm_idle_debug_leave(functionId) {
    const session = this.debugSession;
    if (!session?.buffer)
      return ESUCCESS;
    this.trace(`leave(function=${functionId}, depth=${session.callDepth})`);
    if (session.nextLineArmed && functionId === session.nextLineFunctionId && session.callDepth <= (session.nextLineDepth ?? session.callDepth)) {
      session.nextLineArmed = false;
      session.nextLineDepth = 0;
      session.stepArmed = true;
    }
    session.callDepth = Math.max(0, session.callDepth - 1);
    if (session.currentFunctionId === functionId)
      session.currentFunctionId = 0;
    for (let index = session.frames.length - 1; index >= 0; index -= 1) {
      if (session.frames[index]?.functionId === functionId) {
        session.frames.splice(index, 1);
        break;
      }
    }
    return ESUCCESS;
  }
  __wasm_idle_debug_value_num(functionId, slot, value) {
    const session = this.debugSession;
    if (!session?.buffer)
      return ESUCCESS;
    if (functionId === 0) {
      session.globalValues.set(slot, Number.isInteger(value) ? String(value) : `${value}`);
      return ESUCCESS;
    }
    for (let index = session.frames.length - 1; index >= 0; index -= 1) {
      const frame = session.frames[index];
      if (frame?.functionId !== functionId)
        continue;
      frame.values.set(slot, Number.isInteger(value) ? String(value) : `${value}`);
      break;
    }
    return ESUCCESS;
  }
  __wasm_idle_debug_value_bool(functionId, slot, value) {
    const session = this.debugSession;
    if (!session?.buffer)
      return ESUCCESS;
    if (functionId === 0) {
      session.globalValues.set(slot, value ? "true" : "false");
      return ESUCCESS;
    }
    for (let index = session.frames.length - 1; index >= 0; index -= 1) {
      const frame = session.frames[index];
      if (frame?.functionId !== functionId)
        continue;
      frame.values.set(slot, value ? "true" : "false");
      break;
    }
    return ESUCCESS;
  }
  __wasm_idle_debug_value_addr(functionId, slot, value) {
    const session = this.debugSession;
    if (!session?.buffer)
      return ESUCCESS;
    if (functionId === 0) {
      session.globalValues.set(slot, String(value >>> 0));
      return ESUCCESS;
    }
    for (let index = session.frames.length - 1; index >= 0; index -= 1) {
      const frame = session.frames[index];
      if (frame?.functionId !== functionId)
        continue;
      frame.values.set(slot, String(value >>> 0));
      break;
    }
    return ESUCCESS;
  }
  __wasm_idle_debug_value_text(functionId, slot, ptr, len) {
    const session = this.debugSession;
    if (!session?.buffer)
      return ESUCCESS;
    this.mem?.check?.();
    const text = this.mem?.readStr ? this.mem.readStr(ptr, len) : "?";
    if (functionId === 0) {
      session.globalValues.set(slot, text);
      return ESUCCESS;
    }
    for (let index = session.frames.length - 1; index >= 0; index -= 1) {
      const frame = session.frames[index];
      if (frame?.functionId !== functionId)
        continue;
      frame.values.set(slot, text);
      break;
    }
    return ESUCCESS;
  }
  __wasm_idle_debug_line(functionId, line) {
    const session = this.debugSession;
    if (!session?.buffer)
      return ESUCCESS;
    const sharedBreakpointVersion = Atomics.load(session.buffer, 2);
    if (sharedBreakpointVersion !== session.breakpointVersion) {
      const count = Math.max(0, Atomics.load(session.buffer, 3));
      const nextBreakpoints = /* @__PURE__ */ new Set();
      for (let index = 0; index < count && index + 4 < session.buffer.length; index += 1) {
        const breakpoint = Atomics.load(session.buffer, index + 4);
        if (breakpoint > 0)
          nextBreakpoints.add(breakpoint);
      }
      session.breakpoints = nextBreakpoints;
      session.breakpointVersion = sharedBreakpointVersion;
    }
    if (session.resumeSkipActive) {
      if (functionId === session.resumeSkipFunctionId && line === session.resumeSkipLine) {
        return ESUCCESS;
      }
      session.resumeSkipActive = false;
      session.resumeSkipFunctionId = 0;
      session.resumeSkipLine = 0;
    }
    let reason = "";
    if (session.pauseOnEntry)
      reason = "entry";
    else if (session.breakpoints.has(line))
      reason = "breakpoint";
    else if (session.stepArmed)
      reason = "step";
    else if (session.nextLineArmed && session.callDepth <= (session.nextLineDepth ?? session.callDepth) && functionId === session.nextLineFunctionId && line !== session.nextLineLine) {
      reason = "nextLine";
    } else if (session.stepOutArmed && session.callDepth <= session.stepOutDepth) {
      reason = "stepOut";
    }
    if (!reason)
      return ESUCCESS;
    return this.pauseDebugSession(session, functionId, line, reason);
  }
  environ_sizes_get(environ_count_out, environ_buf_size_out) {
    this.mem.check();
    let size = 0;
    const names = Object.getOwnPropertyNames(this.environ);
    for (const name of names) {
      const value = this.environ[name];
      size += name.length + value.length + 2;
    }
    this.mem.write32(environ_count_out, names.length);
    this.mem.write32(environ_buf_size_out, size);
    this.trace(`environ_sizes_get(count=${names.length}, bytes=${size})`);
    return ESUCCESS;
  }
  environ_get(environ_ptrs, environ_buf) {
    this.mem.check();
    const names = Object.getOwnPropertyNames(this.environ);
    this.trace(`environ_get(entries=${JSON.stringify(names)})`);
    for (const name of names) {
      this.mem.write32(environ_ptrs, environ_buf);
      environ_ptrs += 4;
      environ_buf += this.mem.writeStr(environ_buf, `${name}=${this.environ[name]}`);
    }
    return ESUCCESS;
  }
  args_sizes_get(argc_out, argv_buf_size_out) {
    this.mem.check();
    let size = 0;
    for (let arg of this.argv) {
      size += arg.length + 1;
    }
    this.mem.write32(argc_out, this.argv.length);
    this.mem.write32(argv_buf_size_out, size);
    this.trace(`args_sizes_get(count=${this.argv.length}, bytes=${size})`);
    return ESUCCESS;
  }
  args_get(argv_ptrs, argv_buf) {
    this.mem.check();
    this.trace(`args_get(argv=${JSON.stringify(this.argv)})`);
    for (let arg of this.argv) {
      this.mem.write32(argv_ptrs, argv_buf);
      argv_ptrs += 4;
      argv_buf += this.mem.writeStr(argv_buf, arg);
    }
    return ESUCCESS;
  }
  random_get(buf, buf_len) {
    const data = new Uint8Array(this.mem.buffer, buf, buf_len);
    for (let i = 0; i < buf_len; ++i)
      data[i] = Math.random() * 256 | 0;
  }
  clock_time_get(clockId, _precision, timeOut) {
    this.mem.check();
    const milliseconds = clockId === 1 && typeof performance !== "undefined" ? performance.now() : Date.now();
    const nanoseconds = BigInt(Math.floor(milliseconds * 1e6));
    this.mem.view.setBigUint64(timeOut, nanoseconds, true);
    this.trace(`clock_time_get(clock=${clockId}, ns=${nanoseconds})`);
    return ESUCCESS;
  }
  poll_oneoff() {
    throw new NotImplemented("wasi_unstable", "poll_oneoff");
  }
  fd_filestat_set_times() {
    this.trace("fd_filestat_set_times()");
    return ESUCCESS;
  }
  path_filestat_set_times() {
    this.trace("path_filestat_set_times()");
    return ESUCCESS;
  }
  sock_accept() {
    this.trace("sock_accept() unsupported");
    return ENOTSUP;
  }
  sock_recv() {
    this.trace("sock_recv() unsupported");
    return ENOTSUP;
  }
  sock_send() {
    this.trace("sock_send() unsupported");
    return ENOTSUP;
  }
  sock_shutdown() {
    this.trace("sock_shutdown() unsupported");
    return ENOTSUP;
  }
  path_link(_oldFd, _oldFlags, oldPath, oldPathLen, _newFd, newPath, newPathLen) {
    this.mem.check();
    const source = this.mem.readStr(oldPath, oldPathLen).replace(/^\/+/, "");
    const target = this.mem.readStr(newPath, newPathLen).replace(/^\/+/, "");
    this.trace(`path_link(source=${JSON.stringify(source)}, target=${JSON.stringify(target)})`);
    this.storeFileContents(target, new Uint8Array(this.memfs.getFileContents(source)));
    return ESUCCESS;
  }
  path_rename(_oldFd, oldPath, oldPathLen, _newFd, newPath, newPathLen) {
    this.mem.check();
    const source = this.mem.readStr(oldPath, oldPathLen).replace(/^\/+/, "");
    const target = this.mem.readStr(newPath, newPathLen).replace(/^\/+/, "");
    this.trace(`path_rename(source=${JSON.stringify(source)}, target=${JSON.stringify(target)})`);
    this.storeFileContents(target, new Uint8Array(this.memfs.getFileContents(source)));
    return ESUCCESS;
  }
};

// node_modules/@wasm-idle/llvm-core/dist/core/src/clang-profile.js
var CLANG_WASI_TARGET = "wasm32-wasi";
var OBJECTIVE_C_RUNTIME_FLAGS = ["-fobjc-runtime=gnustep-2.0", "-fblocks"];
var defaultCppStandardArg = "-std=gnu++20";
var defaultCStandardArg = "-std=gnu11";
function normalizeStandardCode(value) {
  return (value || "").trim().toUpperCase().replaceAll(/\s+/g, "");
}
function resolveCppStandardArg(version) {
  switch (normalizeStandardCode(version)) {
    case "03":
    case "CPP03":
    case "C++03":
    case "GNU++03":
    case "GNUC++03":
      return "-std=gnu++03";
    case "11":
    case "CPP11":
    case "C++11":
    case "GNU++11":
    case "GNUC++11":
      return "-std=gnu++11";
    case "14":
    case "CPP14":
    case "C++14":
    case "GNU++14":
    case "GNUC++14":
      return "-std=gnu++14";
    case "17":
    case "CPP17":
    case "C++17":
    case "GNU++17":
    case "GNUC++17":
      return "-std=gnu++17";
    case "20":
    case "CPP20":
    case "C++20":
    case "GNU++20":
    case "GNUC++20":
      return "-std=gnu++20";
    case "23":
    case "CPP23":
    case "C++23":
    case "GNU++23":
    case "GNUC++23":
      return "-std=gnu++23";
    case "26":
    case "CPP26":
    case "C++26":
    case "GNU++26":
    case "GNUC++26":
      return "-std=gnu++26";
    default:
      return defaultCppStandardArg;
  }
}
function resolveCStandardArg(version) {
  switch (normalizeStandardCode(version)) {
    case "99":
    case "C99":
    case "GNU99":
    case "GNUC99":
      return "-std=gnu99";
    case "11":
    case "C11":
    case "GNU11":
    case "GNUC11":
      return "-std=gnu11";
    case "17":
    case "18":
    case "C17":
    case "C18":
    case "GNU17":
    case "GNU18":
    case "GNUC17":
    case "GNUC18":
      return "-std=gnu17";
    default:
      return defaultCStandardArg;
  }
}
function resolveClangLanguageArgs(language, options) {
  if (language === "C") {
    return {
      languageArg: "c",
      standardArg: resolveCStandardArg(options.cVersion)
    };
  }
  if (language === "OBJC") {
    return {
      languageArg: "objective-c",
      standardArg: resolveCStandardArg(options.cVersion)
    };
  }
  return {
    languageArg: "c++",
    standardArg: resolveCppStandardArg(options.cppVersion)
  };
}
function clangSystemIncludePaths(language, root = "", resourceDir) {
  return [
    ...["CPP", "OBJCXX"].includes(language) ? [`${root}/include/c++/v1`, `${root}/include/wasm32-wasi/c++/v1`] : [],
    ...resourceDir ? [`${resourceDir.replace(/\/+$/, "")}/include`] : [],
    `${root}/include/wasm32-wasi`,
    `${root}/include`
  ];
}

// node_modules/@wasm-idle/llvm-core/dist/core/src/gcc-compat.js
var treePolicyHeader = String.raw`#ifndef WASM_CLANG_EXT_PB_DS_TREE_POLICY_HPP
#define WASM_CLANG_EXT_PB_DS_TREE_POLICY_HPP

#include <cstddef>

namespace __gnu_pbds {

struct null_type {};
struct rb_tree_tag {};
struct splay_tree_tag {};
struct ov_tree_tag {};

template <typename Node_CItr, typename Node_Itr, typename Cmp_Fn, typename Allocator>
class null_node_update {
public:
	typedef Node_CItr node_const_iterator;
	typedef Node_Itr node_iterator;
	typedef Cmp_Fn cmp_fn;
	typedef Allocator allocator_type;
};

template <typename Node_CItr, typename Node_Itr, typename Cmp_Fn, typename Allocator>
class tree_order_statistics_node_update {
public:
	typedef Node_CItr node_const_iterator;
	typedef Node_Itr node_iterator;
	typedef Cmp_Fn cmp_fn;
	typedef Allocator allocator_type;
};

} // namespace __gnu_pbds

#endif
`;
var assocContainerHeader = String.raw`#ifndef WASM_CLANG_EXT_PB_DS_ASSOC_CONTAINER_HPP
#define WASM_CLANG_EXT_PB_DS_ASSOC_CONTAINER_HPP

#include <algorithm>
#include <cstddef>
#include <functional>
#include <iterator>
#include <map>
#include <memory>
#include <set>
#include <type_traits>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <ext/pb_ds/tree_policy.hpp>

namespace __gnu_pbds {

namespace detail {

template <typename Allocator, typename Value>
struct rebind_allocator {
	typedef typename std::allocator_traits<Allocator>::template rebind_alloc<Value> type;
};

template <typename Iterator>
Iterator advance_to_order(Iterator first, Iterator last, std::size_t order) {
	if (order >= static_cast<std::size_t>(std::distance(first, last))) return last;
	std::advance(
		first,
		static_cast<typename std::iterator_traits<Iterator>::difference_type>(order)
	);
	return first;
}

template <
	typename Key,
	typename Mapped,
	typename Hash_Fn,
	typename Eq_Fn,
	typename Allocator
>
struct hash_table_selector {
	typedef std::pair<const Key, Mapped> value_type;
	typedef typename rebind_allocator<Allocator, value_type>::type allocator_type;
	typedef std::unordered_map<Key, Mapped, Hash_Fn, Eq_Fn, allocator_type> type;
};

template <typename Key, typename Hash_Fn, typename Eq_Fn, typename Allocator>
struct hash_table_selector<Key, null_type, Hash_Fn, Eq_Fn, Allocator> {
	typedef typename rebind_allocator<Allocator, Key>::type allocator_type;
	typedef std::unordered_set<Key, Hash_Fn, Eq_Fn, allocator_type> type;
};

} // namespace detail

template <
	typename Key,
	typename Mapped,
	typename Cmp_Fn = std::less<Key>,
	typename Tag = rb_tree_tag,
	template <typename Node_CItr, typename Node_Itr, typename Cmp_Fn_, typename Allocator_>
	class Node_Update = null_node_update,
	typename Allocator = std::allocator<char>
>
class tree {
public:
	typedef Key key_type;
	typedef Mapped mapped_type;
	typedef std::pair<const Key, Mapped> value_type;
	typedef Cmp_Fn cmp_fn;
	typedef Tag container_category;
	typedef Allocator allocator_type;
	typedef std::size_t size_type;

private:
	typedef typename detail::rebind_allocator<Allocator, value_type>::type value_allocator_type;
	typedef std::map<Key, Mapped, Cmp_Fn, value_allocator_type> container_type;

public:
	typedef typename container_type::iterator iterator;
	typedef typename container_type::const_iterator const_iterator;
	typedef typename container_type::iterator point_iterator;
	typedef typename container_type::const_iterator const_point_iterator;
	typedef typename container_type::reverse_iterator reverse_iterator;
	typedef typename container_type::const_reverse_iterator const_reverse_iterator;

	tree() = default;
	explicit tree(const Cmp_Fn& compare) : values_(compare) {}

	template <typename InputIt>
	tree(InputIt first, InputIt last) : values_(first, last) {}

	bool empty() const { return values_.empty(); }
	size_type size() const { return values_.size(); }
	size_type max_size() const { return values_.max_size(); }

	iterator begin() { return values_.begin(); }
	const_iterator begin() const { return values_.begin(); }
	const_iterator cbegin() const { return values_.cbegin(); }
	iterator end() { return values_.end(); }
	const_iterator end() const { return values_.end(); }
	const_iterator cend() const { return values_.cend(); }
	reverse_iterator rbegin() { return values_.rbegin(); }
	const_reverse_iterator rbegin() const { return values_.rbegin(); }
	reverse_iterator rend() { return values_.rend(); }
	const_reverse_iterator rend() const { return values_.rend(); }

	std::pair<iterator, bool> insert(const value_type& value) { return values_.insert(value); }
	std::pair<iterator, bool> insert(value_type&& value) { return values_.insert(std::move(value)); }

	template <typename InputIt>
	void insert(InputIt first, InputIt last) {
		values_.insert(first, last);
	}

	mapped_type& operator[](const key_type& key) { return values_[key]; }
	mapped_type& at(const key_type& key) { return values_.at(key); }
	const mapped_type& at(const key_type& key) const { return values_.at(key); }

	iterator find(const key_type& key) { return values_.find(key); }
	const_iterator find(const key_type& key) const { return values_.find(key); }
	bool contains(const key_type& key) const { return values_.find(key) != values_.end(); }
	size_type count(const key_type& key) const { return values_.count(key); }

	iterator lower_bound(const key_type& key) { return values_.lower_bound(key); }
	const_iterator lower_bound(const key_type& key) const { return values_.lower_bound(key); }
	iterator upper_bound(const key_type& key) { return values_.upper_bound(key); }
	const_iterator upper_bound(const key_type& key) const { return values_.upper_bound(key); }

	size_type erase(const key_type& key) { return values_.erase(key); }
	iterator erase(const_iterator position) { return values_.erase(position); }
	iterator erase(const_iterator first, const_iterator last) { return values_.erase(first, last); }
	void clear() { values_.clear(); }
	void swap(tree& other) { values_.swap(other.values_); }

	iterator find_by_order(size_type order) {
		return detail::advance_to_order(values_.begin(), values_.end(), order);
	}

	const_iterator find_by_order(size_type order) const {
		return detail::advance_to_order(values_.begin(), values_.end(), order);
	}

	size_type order_of_key(const key_type& key) const {
		return static_cast<size_type>(std::distance(values_.begin(), values_.lower_bound(key)));
	}

	void join(tree& other) {
		values_.insert(other.values_.begin(), other.values_.end());
		other.values_.clear();
	}

	void split(const key_type& key, tree& other) {
		iterator first = values_.upper_bound(key);
		other.values_.insert(first, values_.end());
		values_.erase(first, values_.end());
	}

private:
	container_type values_;
};

template <
	typename Key,
	typename Cmp_Fn,
	typename Tag,
	template <typename Node_CItr, typename Node_Itr, typename Cmp_Fn_, typename Allocator_>
	class Node_Update,
	typename Allocator
>
class tree<Key, null_type, Cmp_Fn, Tag, Node_Update, Allocator> {
public:
	typedef Key key_type;
	typedef null_type mapped_type;
	typedef Key value_type;
	typedef Cmp_Fn cmp_fn;
	typedef Tag container_category;
	typedef Allocator allocator_type;
	typedef std::size_t size_type;

private:
	typedef typename detail::rebind_allocator<Allocator, value_type>::type value_allocator_type;
	typedef std::set<Key, Cmp_Fn, value_allocator_type> container_type;

public:
	typedef typename container_type::iterator iterator;
	typedef typename container_type::const_iterator const_iterator;
	typedef typename container_type::iterator point_iterator;
	typedef typename container_type::const_iterator const_point_iterator;
	typedef typename container_type::reverse_iterator reverse_iterator;
	typedef typename container_type::const_reverse_iterator const_reverse_iterator;

	tree() = default;
	explicit tree(const Cmp_Fn& compare) : values_(compare) {}

	template <typename InputIt>
	tree(InputIt first, InputIt last) : values_(first, last) {}

	bool empty() const { return values_.empty(); }
	size_type size() const { return values_.size(); }
	size_type max_size() const { return values_.max_size(); }

	iterator begin() { return values_.begin(); }
	const_iterator begin() const { return values_.begin(); }
	const_iterator cbegin() const { return values_.cbegin(); }
	iterator end() { return values_.end(); }
	const_iterator end() const { return values_.end(); }
	const_iterator cend() const { return values_.cend(); }
	reverse_iterator rbegin() { return values_.rbegin(); }
	const_reverse_iterator rbegin() const { return values_.rbegin(); }
	reverse_iterator rend() { return values_.rend(); }
	const_reverse_iterator rend() const { return values_.rend(); }

	std::pair<iterator, bool> insert(const value_type& value) { return values_.insert(value); }
	std::pair<iterator, bool> insert(value_type&& value) { return values_.insert(std::move(value)); }

	template <typename InputIt>
	void insert(InputIt first, InputIt last) {
		values_.insert(first, last);
	}

	iterator find(const key_type& key) { return values_.find(key); }
	const_iterator find(const key_type& key) const { return values_.find(key); }
	bool contains(const key_type& key) const { return values_.find(key) != values_.end(); }
	size_type count(const key_type& key) const { return values_.count(key); }

	iterator lower_bound(const key_type& key) { return values_.lower_bound(key); }
	const_iterator lower_bound(const key_type& key) const { return values_.lower_bound(key); }
	iterator upper_bound(const key_type& key) { return values_.upper_bound(key); }
	const_iterator upper_bound(const key_type& key) const { return values_.upper_bound(key); }

	size_type erase(const key_type& key) { return values_.erase(key); }
	iterator erase(const_iterator position) { return values_.erase(position); }
	iterator erase(const_iterator first, const_iterator last) { return values_.erase(first, last); }
	void clear() { values_.clear(); }
	void swap(tree& other) { values_.swap(other.values_); }

	iterator find_by_order(size_type order) {
		return detail::advance_to_order(values_.begin(), values_.end(), order);
	}

	const_iterator find_by_order(size_type order) const {
		return detail::advance_to_order(values_.begin(), values_.end(), order);
	}

	size_type order_of_key(const key_type& key) const {
		return static_cast<size_type>(std::distance(values_.begin(), values_.lower_bound(key)));
	}

	void join(tree& other) {
		values_.insert(other.values_.begin(), other.values_.end());
		other.values_.clear();
	}

	void split(const key_type& key, tree& other) {
		iterator first = values_.upper_bound(key);
		other.values_.insert(first, values_.end());
		values_.erase(first, values_.end());
	}

private:
	container_type values_;
};

template <
	typename Key,
	typename Mapped,
	typename Hash_Fn = std::hash<Key>,
	typename Eq_Fn = std::equal_to<Key>,
	typename Comb_Hash_Fn = void,
	typename Resize_Policy = void,
	bool Store_Hash = false,
	typename Allocator = std::allocator<char>
>
using gp_hash_table = typename detail::hash_table_selector<
	Key,
	Mapped,
	Hash_Fn,
	Eq_Fn,
	Allocator
>::type;

template <
	typename Key,
	typename Mapped,
	typename Hash_Fn = std::hash<Key>,
	typename Eq_Fn = std::equal_to<Key>,
	typename Comb_Hash_Fn = void,
	typename Resize_Policy = void,
	bool Store_Hash = false,
	typename Allocator = std::allocator<char>
>
using cc_hash_table = typename detail::hash_table_selector<
	Key,
	Mapped,
	Hash_Fn,
	Eq_Fn,
	Allocator
>::type;

} // namespace __gnu_pbds

#endif
`;
var hashPolicyHeader = String.raw`#ifndef WASM_CLANG_EXT_PB_DS_HASH_POLICY_HPP
#define WASM_CLANG_EXT_PB_DS_HASH_POLICY_HPP

#include <cstddef>

namespace __gnu_pbds {

template <typename Size_Type = std::size_t>
class direct_mask_range_hashing {
public:
	typedef Size_Type size_type;
};

template <typename Size_Type = std::size_t>
class direct_mod_range_hashing {
public:
	typedef Size_Type size_type;
};

template <typename Size_Type = std::size_t>
class linear_probe_fn {
public:
	typedef Size_Type size_type;
};

template <typename Size_Type = std::size_t>
class quadratic_probe_fn {
public:
	typedef Size_Type size_type;
};

class hash_exponential_size_policy {};
class hash_prime_size_policy {};

template <bool External_Load_Access = false, typename Size_Type = std::size_t>
class hash_load_check_resize_trigger {
public:
	typedef Size_Type size_type;
	explicit hash_load_check_resize_trigger(float = 0.125, float = 0.5) {}
};

template <bool External_Load_Access = false, typename Size_Type = std::size_t>
class cc_hash_max_collision_check_resize_trigger {
public:
	typedef Size_Type size_type;
	explicit cc_hash_max_collision_check_resize_trigger(float = 0.5) {}
};

template <
	typename Size_Policy = hash_exponential_size_policy,
	typename Trigger_Policy = hash_load_check_resize_trigger<>,
	bool External_Size_Access = false,
	typename Size_Type = std::size_t
>
class hash_standard_resize_policy {
public:
	typedef Size_Type size_type;
	hash_standard_resize_policy() = default;
	explicit hash_standard_resize_policy(const Size_Policy&) {}
	hash_standard_resize_policy(const Size_Policy&, const Trigger_Policy&) {}
};

} // namespace __gnu_pbds

#endif
`;
var priorityQueueHeader = String.raw`#ifndef WASM_CLANG_EXT_PB_DS_PRIORITY_QUEUE_HPP
#define WASM_CLANG_EXT_PB_DS_PRIORITY_QUEUE_HPP

#include <algorithm>
#include <cstddef>
#include <functional>
#include <memory>
#include <queue>
#include <utility>
#include <vector>

namespace __gnu_pbds {

struct pairing_heap_tag {};
struct binary_heap_tag {};
struct binomial_heap_tag {};
struct rc_binomial_heap_tag {};
struct thin_heap_tag {};

namespace detail {

template <typename Allocator, typename Value>
struct priority_queue_rebind_allocator {
	typedef typename std::allocator_traits<Allocator>::template rebind_alloc<Value> type;
};

} // namespace detail

template <
	typename Value_Type,
	typename Cmp_Fn = std::less<Value_Type>,
	typename Tag = pairing_heap_tag,
	typename Allocator = std::allocator<char>
>
class priority_queue {
public:
	typedef Value_Type value_type;
	typedef Cmp_Fn cmp_fn;
	typedef Tag container_category;
	typedef Allocator allocator_type;
	typedef std::size_t size_type;
	typedef value_type& reference;
	typedef const value_type& const_reference;

private:
	typedef typename detail::priority_queue_rebind_allocator<Allocator, value_type>::type value_allocator_type;
	typedef std::vector<value_type, value_allocator_type> container_type;

public:
	typedef typename container_type::iterator point_iterator;
	typedef typename container_type::const_iterator const_point_iterator;

	priority_queue() : values_(), compare_() {
		std::make_heap(values_.begin(), values_.end(), compare_);
	}

	explicit priority_queue(const Cmp_Fn& compare) : values_(), compare_(compare) {
		std::make_heap(values_.begin(), values_.end(), compare_);
	}

	template <typename InputIt>
	priority_queue(InputIt first, InputIt last) : values_(first, last), compare_() {
		std::make_heap(values_.begin(), values_.end(), compare_);
	}

	bool empty() const { return values_.empty(); }
	size_type size() const { return values_.size(); }
	const_reference top() const { return values_.front(); }
	void clear() { values_.clear(); }
	void swap(priority_queue& other) {
		values_.swap(other.values_);
		std::swap(compare_, other.compare_);
	}

	point_iterator push(const_reference value) {
		values_.push_back(value);
		std::push_heap(values_.begin(), values_.end(), compare_);
		return values_.empty() ? values_.end() : values_.begin();
	}

	void pop() {
		std::pop_heap(values_.begin(), values_.end(), compare_);
		values_.pop_back();
	}

	void modify(point_iterator position, const_reference value) {
		if (position == values_.end()) return;
		*position = value;
		std::make_heap(values_.begin(), values_.end(), compare_);
	}

	void erase(point_iterator position) {
		if (position == values_.end()) return;
		values_.erase(position);
		std::make_heap(values_.begin(), values_.end(), compare_);
	}

	void join(priority_queue& other) {
		values_.insert(values_.end(), other.values_.begin(), other.values_.end());
		other.values_.clear();
		std::make_heap(values_.begin(), values_.end(), compare_);
	}

private:
	container_type values_;
	Cmp_Fn compare_;
};

} // namespace __gnu_pbds

#endif
`;
var ropeHeader = String.raw`#ifndef WASM_CLANG_EXT_ROPE
#define WASM_CLANG_EXT_ROPE

#include <algorithm>
#include <cstddef>
#include <iosfwd>
#include <iterator>
#include <memory>
#include <ostream>
#include <string>
#include <utility>

namespace __gnu_cxx {

template <typename CharT, typename Alloc = std::allocator<CharT>>
class rope {
public:
	typedef CharT value_type;
	typedef Alloc allocator_type;
	typedef std::basic_string<CharT, std::char_traits<CharT>, Alloc> string_type;
	typedef typename string_type::traits_type traits_type;
	typedef typename string_type::size_type size_type;
	typedef typename string_type::difference_type difference_type;
	typedef typename string_type::reference reference;
	typedef typename string_type::const_reference const_reference;
	typedef typename string_type::iterator iterator;
	typedef typename string_type::const_iterator const_iterator;

	static const size_type npos = string_type::npos;

	rope() = default;
	rope(const rope&) = default;
	rope(rope&&) = default;
	rope& operator=(const rope&) = default;
	rope& operator=(rope&&) = default;

	rope(const CharT* value) : data_(value ? value : empty_c_str()) {}
	rope(const CharT* value, size_type count) : data_(value, count) {}
	rope(size_type count, CharT value) : data_(count, value) {}
	rope(const string_type& value) : data_(value) {}
	rope(string_type&& value) : data_(std::move(value)) {}

	template <typename InputIt>
	rope(InputIt first, InputIt last) : data_(first, last) {}

	bool empty() const { return data_.empty(); }
	size_type size() const { return data_.size(); }
	size_type length() const { return data_.length(); }
	size_type max_size() const { return data_.max_size(); }
	void clear() { data_.clear(); }

	const CharT* c_str() const { return data_.c_str(); }
	const string_type& str() const { return data_; }

	iterator begin() { return data_.begin(); }
	const_iterator begin() const { return data_.begin(); }
	const_iterator cbegin() const { return data_.cbegin(); }
	iterator end() { return data_.end(); }
	const_iterator end() const { return data_.end(); }
	const_iterator cend() const { return data_.cend(); }

	reference operator[](size_type index) { return data_[index]; }
	const_reference operator[](size_type index) const { return data_[index]; }
	reference at(size_type index) { return data_.at(index); }
	const_reference at(size_type index) const { return data_.at(index); }
	reference mutable_reference_at(size_type index) { return data_.at(index); }

	void push_back(CharT value) { data_.push_back(value); }
	void pop_back() { data_.pop_back(); }

	rope& append(const rope& value) {
		data_.append(value.data_);
		return *this;
	}

	rope& append(const CharT* value) {
		data_.append(value ? value : empty_c_str());
		return *this;
	}

	rope& append(const CharT* value, size_type count) {
		data_.append(value, count);
		return *this;
	}

	rope& append(size_type count, CharT value) {
		data_.append(count, value);
		return *this;
	}

	rope& insert(size_type position, const rope& value) {
		data_.insert(position, value.data_);
		return *this;
	}

	rope& insert(size_type position, const CharT* value) {
		data_.insert(position, value ? value : empty_c_str());
		return *this;
	}

	rope& insert(size_type position, const CharT* value, size_type count) {
		data_.insert(position, value, count);
		return *this;
	}

	rope& insert(size_type position, size_type count, CharT value) {
		data_.insert(position, count, value);
		return *this;
	}

	rope& erase(size_type position = 0, size_type count = npos) {
		data_.erase(position, count);
		return *this;
	}

	rope& replace(size_type position, size_type count, const rope& value) {
		data_.replace(position, count, value.data_);
		return *this;
	}

	rope& replace(size_type position, size_type count, const CharT* value) {
		data_.replace(position, count, value ? value : empty_c_str());
		return *this;
	}

	rope substr(size_type position = 0, size_type count = npos) const {
		return rope(data_.substr(position, count));
	}

	size_type copy(size_type position, size_type count, CharT* target) const {
		if (position > data_.size()) return 0;
		const size_type copied = std::min(count, data_.size() - position);
		traits_type::copy(target, data_.data() + position, copied);
		return copied;
	}

	int compare(const rope& value) const { return data_.compare(value.data_); }

	rope& operator+=(const rope& value) { return append(value); }
	rope& operator+=(const CharT* value) { return append(value); }
	rope& operator+=(CharT value) {
		push_back(value);
		return *this;
	}

private:
	static const CharT* empty_c_str() {
		static const CharT empty[1] = {};
		return empty;
	}

	string_type data_;
};

template <typename CharT, typename Alloc>
rope<CharT, Alloc> operator+(rope<CharT, Alloc> left, const rope<CharT, Alloc>& right) {
	left += right;
	return left;
}

template <typename CharT, typename Alloc>
bool operator==(const rope<CharT, Alloc>& left, const rope<CharT, Alloc>& right) {
	return left.compare(right) == 0;
}

template <typename CharT, typename Alloc>
bool operator!=(const rope<CharT, Alloc>& left, const rope<CharT, Alloc>& right) {
	return !(left == right);
}

template <typename CharT, typename Alloc>
bool operator<(const rope<CharT, Alloc>& left, const rope<CharT, Alloc>& right) {
	return left.compare(right) < 0;
}

template <typename CharT, typename Alloc>
std::basic_ostream<CharT>& operator<<(
	std::basic_ostream<CharT>& output,
	const rope<CharT, Alloc>& value
) {
	return output << value.str();
}

typedef rope<char> crope;
typedef rope<wchar_t> wrope;

} // namespace __gnu_cxx

#endif
`;
var setjmpHeader = String.raw`#ifndef WASM_CLANG_SETJMP_H
#define WASM_CLANG_SETJMP_H

#ifdef __cplusplus
extern "C" {
#endif

typedef long jmp_buf[32];
int setjmp(jmp_buf);
__attribute__((noreturn)) void longjmp(jmp_buf, int);

#ifdef __cplusplus
}
#endif

#endif
`;
var bitsStdCppHeader = String.raw`#ifndef WASM_CLANG_BITS_STDCPP_H
#define WASM_CLANG_BITS_STDCPP_H

#include <algorithm>
#include <array>
#include <bitset>
#include <cassert>
#include <cctype>
#include <cerrno>
#include <cfloat>
#include <climits>
#include <cmath>
#include <cstddef>
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <deque>
#include <functional>
#include <iomanip>
#include <iostream>
#include <iterator>
#include <limits>
#include <list>
#include <map>
#include <memory>
#include <numeric>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <string>
#include <string_view>
#include <tuple>
#include <type_traits>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>

#endif
`;
var bitsExtcxxHeader = String.raw`#ifndef WASM_CLANG_BITS_EXTCXX_H
#define WASM_CLANG_BITS_EXTCXX_H

#include <bits/stdc++.h>
#include <ext/hash_map>
#include <ext/hash_set>
#include <ext/rope>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/hash_policy.hpp>
#include <ext/pb_ds/priority_queue.hpp>
#include <ext/pb_ds/tree_policy.hpp>

#endif
`;
var GCC_COMPATIBILITY_HEADERS = [
  {
    path: "include/setjmp.h",
    contents: setjmpHeader
  },
  {
    path: "include/bits/stdc++.h",
    contents: bitsStdCppHeader
  },
  {
    path: "include/bits/extc++.h",
    contents: bitsExtcxxHeader
  },
  {
    path: "include/c++/v1/ext/rope",
    contents: ropeHeader
  },
  {
    path: "include/c++/v1/ext/pb_ds/tree_policy.hpp",
    contents: treePolicyHeader
  },
  {
    path: "include/c++/v1/ext/pb_ds/assoc_container.hpp",
    contents: assocContainerHeader
  },
  {
    path: "include/c++/v1/ext/pb_ds/hash_policy.hpp",
    contents: hashPolicyHeader
  },
  {
    path: "include/c++/v1/ext/pb_ds/priority_queue.hpp",
    contents: priorityQueueHeader
  }
];
function installGccCompatibilityHeaders(memfs) {
  memfs.addDirectory("include/c++/v1/ext/pb_ds");
  memfs.addDirectory("include/bits");
  for (const header of GCC_COMPATIBILITY_HEADERS) {
    memfs.addFile(header.path, header.contents);
  }
}

// node_modules/@wasm-idle/llvm-core/dist/core/src/clang-resource-headers.generated.js
var CLANG_RESOURCE_HEADERS = Object.freeze({
  "builtins.h": "/*===---- builtins.h - Standard header for extra builtins -----------------===*\\\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n\\*===----------------------------------------------------------------------===*/\n\n/// Some legacy compilers have builtin definitions in a file named builtins.h.\n/// This header file has been added to allow compatibility with code that was\n/// written for those compilers. Code may have an include line for this file\n/// and to avoid an error an empty file with this name is provided.\n#ifndef __BUILTINS_H\n#define __BUILTINS_H\n\n#if defined(__MVS__) && __has_include_next(<builtins.h>)\n#include_next <builtins.h>\n#endif /* __MVS__ */\n#endif /* __BUILTINS_H */\n",
  "float.h": "/*===---- float.h - Characteristics of floating point types ----------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#if defined(__MVS__) && __has_include_next(<float.h>)\n#include <__float_header_macro.h>\n#include_next <float.h>\n#else\n\n#if !defined(__need_infinity_nan)\n#define __need_float_float\n#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L) ||              \\\n    !defined(__STRICT_ANSI__)\n#define __need_infinity_nan\n#endif\n#include <__float_header_macro.h>\n#endif\n\n#ifdef __need_float_float\n/* If we're on MinGW, fall back to the system's float.h, which might have\n * additional definitions provided for Windows.\n * For more details see http://msdn.microsoft.com/en-us/library/y0ybw9fy.aspx\n *\n * Also fall back on AIX to allow additional definitions and\n * implementation-defined values.\n */\n#if (defined(__MINGW32__) || defined(_MSC_VER) || defined(_AIX)) &&            \\\n    __STDC_HOSTED__ && __has_include_next(<float.h>)\n\n#  include_next <float.h>\n\n#endif\n\n#include <__float_float.h>\n#undef __need_float_float\n#endif\n\n#ifdef __need_infinity_nan\n#include <__float_infinity_nan.h>\n#undef __need_infinity_nan\n#endif\n\n#endif /* __MVS__ */\n",
  "__float_float.h": `/*===---- __float_float.h --------------------------------------------------===
 *
 * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
 * See https://llvm.org/LICENSE.txt for license information.
 * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
 *
 *===-----------------------------------------------------------------------===
 */

#ifndef __CLANG_FLOAT_FLOAT_H
#define __CLANG_FLOAT_FLOAT_H

#if (defined(__MINGW32__) || defined(_MSC_VER) || defined(_AIX)) &&            \\
    __STDC_HOSTED__

/* Undefine anything that we'll be redefining below. */
#  undef FLT_EVAL_METHOD
#  undef FLT_ROUNDS
#  undef FLT_RADIX
#  undef FLT_MANT_DIG
#  undef DBL_MANT_DIG
#  undef LDBL_MANT_DIG
#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 199901L) ||              \\
    !defined(__STRICT_ANSI__) ||                                               \\
    (defined(__cplusplus) && __cplusplus >= 201103L) ||                        \\
    (__STDC_HOSTED__ && defined(_AIX) && defined(_ALL_SOURCE))
#    undef DECIMAL_DIG
#  endif
#  undef FLT_DIG
#  undef DBL_DIG
#  undef LDBL_DIG
#  undef FLT_MIN_EXP
#  undef DBL_MIN_EXP
#  undef LDBL_MIN_EXP
#  undef FLT_MIN_10_EXP
#  undef DBL_MIN_10_EXP
#  undef LDBL_MIN_10_EXP
#  undef FLT_MAX_EXP
#  undef DBL_MAX_EXP
#  undef LDBL_MAX_EXP
#  undef FLT_MAX_10_EXP
#  undef DBL_MAX_10_EXP
#  undef LDBL_MAX_10_EXP
#  undef FLT_MAX
#  undef DBL_MAX
#  undef LDBL_MAX
#  undef FLT_EPSILON
#  undef DBL_EPSILON
#  undef LDBL_EPSILON
#  undef FLT_MIN
#  undef DBL_MIN
#  undef LDBL_MIN
#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 201112L) ||              \\
    !defined(__STRICT_ANSI__) ||                                               \\
    (defined(__cplusplus) && __cplusplus >= 201703L) ||                        \\
    (__STDC_HOSTED__ && defined(_AIX) && defined(_ALL_SOURCE))
#    undef FLT_TRUE_MIN
#    undef DBL_TRUE_MIN
#    undef LDBL_TRUE_MIN
#    undef FLT_DECIMAL_DIG
#    undef DBL_DECIMAL_DIG
#    undef LDBL_DECIMAL_DIG
#    undef FLT_HAS_SUBNORM
#    undef DBL_HAS_SUBNORM
#    undef LDBL_HAS_SUBNORM
#  endif
#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L) ||              \\
    !defined(__STRICT_ANSI__)
#    undef FLT_NORM_MAX
#    undef DBL_NORM_MAX
#    undef LDBL_NORM_MAX
#endif
#endif

#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L) ||              \\
    !defined(__STRICT_ANSI__)
#  undef FLT_SNAN
#  undef DBL_SNAN
#  undef LDBL_SNAN
#endif

/* Characteristics of floating point types, C99 5.2.4.2.2 */

#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 199901L) ||              \\
    (defined(__cplusplus) && __cplusplus >= 201103L)
#define FLT_EVAL_METHOD __FLT_EVAL_METHOD__
#endif
#define FLT_ROUNDS (__builtin_flt_rounds())
#define FLT_RADIX __FLT_RADIX__

#define FLT_MANT_DIG __FLT_MANT_DIG__
#define DBL_MANT_DIG __DBL_MANT_DIG__
#define LDBL_MANT_DIG __LDBL_MANT_DIG__

#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 199901L) ||              \\
    !defined(__STRICT_ANSI__) ||                                               \\
    (defined(__cplusplus) && __cplusplus >= 201103L) ||                        \\
    (__STDC_HOSTED__ && defined(_AIX) && defined(_ALL_SOURCE))
#  define DECIMAL_DIG __DECIMAL_DIG__
#endif

#define FLT_DIG __FLT_DIG__
#define DBL_DIG __DBL_DIG__
#define LDBL_DIG __LDBL_DIG__

#define FLT_MIN_EXP __FLT_MIN_EXP__
#define DBL_MIN_EXP __DBL_MIN_EXP__
#define LDBL_MIN_EXP __LDBL_MIN_EXP__

#define FLT_MIN_10_EXP __FLT_MIN_10_EXP__
#define DBL_MIN_10_EXP __DBL_MIN_10_EXP__
#define LDBL_MIN_10_EXP __LDBL_MIN_10_EXP__

#define FLT_MAX_EXP __FLT_MAX_EXP__
#define DBL_MAX_EXP __DBL_MAX_EXP__
#define LDBL_MAX_EXP __LDBL_MAX_EXP__

#define FLT_MAX_10_EXP __FLT_MAX_10_EXP__
#define DBL_MAX_10_EXP __DBL_MAX_10_EXP__
#define LDBL_MAX_10_EXP __LDBL_MAX_10_EXP__

#define FLT_MAX __FLT_MAX__
#define DBL_MAX __DBL_MAX__
#define LDBL_MAX __LDBL_MAX__

#define FLT_EPSILON __FLT_EPSILON__
#define DBL_EPSILON __DBL_EPSILON__
#define LDBL_EPSILON __LDBL_EPSILON__

#define FLT_MIN __FLT_MIN__
#define DBL_MIN __DBL_MIN__
#define LDBL_MIN __LDBL_MIN__

#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 201112L) ||              \\
    !defined(__STRICT_ANSI__) ||                                               \\
    (defined(__cplusplus) && __cplusplus >= 201703L) ||                        \\
    (__STDC_HOSTED__ && defined(_AIX) && defined(_ALL_SOURCE))
#  define FLT_TRUE_MIN __FLT_DENORM_MIN__
#  define DBL_TRUE_MIN __DBL_DENORM_MIN__
#  define LDBL_TRUE_MIN __LDBL_DENORM_MIN__
#  define FLT_DECIMAL_DIG __FLT_DECIMAL_DIG__
#  define DBL_DECIMAL_DIG __DBL_DECIMAL_DIG__
#  define LDBL_DECIMAL_DIG __LDBL_DECIMAL_DIG__
#  define FLT_HAS_SUBNORM __FLT_HAS_DENORM__
#  define DBL_HAS_SUBNORM __DBL_HAS_DENORM__
#  define LDBL_HAS_SUBNORM __LDBL_HAS_DENORM__
#endif

#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L) ||              \\
    !defined(__STRICT_ANSI__)
   /* C23 5.2.5.3.2p28 */
#  define FLT_SNAN (__builtin_nansf(""))
#  define DBL_SNAN (__builtin_nans(""))
#  define LDBL_SNAN (__builtin_nansl(""))

   /* C23 5.2.5.3.3p32 */
#  define FLT_NORM_MAX __FLT_NORM_MAX__
#  define DBL_NORM_MAX __DBL_NORM_MAX__
#  define LDBL_NORM_MAX __LDBL_NORM_MAX__
#endif

#ifdef __STDC_WANT_IEC_60559_TYPES_EXT__
#  define FLT16_MANT_DIG    __FLT16_MANT_DIG__
#  define FLT16_DECIMAL_DIG __FLT16_DECIMAL_DIG__
#  define FLT16_DIG         __FLT16_DIG__
#  define FLT16_MIN_EXP     __FLT16_MIN_EXP__
#  define FLT16_MIN_10_EXP  __FLT16_MIN_10_EXP__
#  define FLT16_MAX_EXP     __FLT16_MAX_EXP__
#  define FLT16_MAX_10_EXP  __FLT16_MAX_10_EXP__
#  define FLT16_MAX         __FLT16_MAX__
#  define FLT16_EPSILON     __FLT16_EPSILON__
#  define FLT16_MIN         __FLT16_MIN__
#  define FLT16_TRUE_MIN    __FLT16_TRUE_MIN__
#endif /* __STDC_WANT_IEC_60559_TYPES_EXT__ */

#endif /* __CLANG_FLOAT_FLOAT_H */
`,
  "__float_header_macro.h": "/*===---- __float_header_macro.h -------------------------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __CLANG_FLOAT_H\n#define __CLANG_FLOAT_H\n#endif /* __CLANG_FLOAT_H */\n",
  "__float_infinity_nan.h": '/*===---- __float_infinity_nan.h -------------------------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __CLANG_FLOAT_INFINITY_NAN_H\n#define __CLANG_FLOAT_INFINITY_NAN_H\n\n/* C23 5.2.5.3.3p29-30 */\n#undef INFINITY\n#undef NAN\n\n#define INFINITY (__builtin_inff())\n#define NAN (__builtin_nanf(""))\n\n#endif /* __CLANG_FLOAT_INFINITY_NAN_H */\n',
  "inttypes.h": '/*===---- inttypes.h - Standard header for integer printf macros ----------===*\\\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n\\*===----------------------------------------------------------------------===*/\n\n#ifndef __CLANG_INTTYPES_H\n// AIX system headers need inttypes.h to be re-enterable while _STD_TYPES_T\n// is defined until an inclusion of it without _STD_TYPES_T occurs, in which\n// case the header guard macro is defined.\n#if !defined(_AIX) || !defined(_STD_TYPES_T)\n#define __CLANG_INTTYPES_H\n#endif\n#if defined(__MVS__) && __has_include_next(<inttypes.h>)\n#include_next <inttypes.h>\n#else\n\n#if defined(_MSC_VER) && _MSC_VER < 1800\n#error MSVC does not have inttypes.h prior to Visual Studio 2013\n#endif\n\n#include_next <inttypes.h>\n\n#if defined(_MSC_VER) && _MSC_VER < 1900\n/* MSVC headers define int32_t as int, but PRIx32 as "lx" instead of "x".\n * This triggers format warnings, so fix it up here. */\n#undef PRId32\n#undef PRIdLEAST32\n#undef PRIdFAST32\n#undef PRIi32\n#undef PRIiLEAST32\n#undef PRIiFAST32\n#undef PRIo32\n#undef PRIoLEAST32\n#undef PRIoFAST32\n#undef PRIu32\n#undef PRIuLEAST32\n#undef PRIuFAST32\n#undef PRIx32\n#undef PRIxLEAST32\n#undef PRIxFAST32\n#undef PRIX32\n#undef PRIXLEAST32\n#undef PRIXFAST32\n\n#undef SCNd32\n#undef SCNdLEAST32\n#undef SCNdFAST32\n#undef SCNi32\n#undef SCNiLEAST32\n#undef SCNiFAST32\n#undef SCNo32\n#undef SCNoLEAST32\n#undef SCNoFAST32\n#undef SCNu32\n#undef SCNuLEAST32\n#undef SCNuFAST32\n#undef SCNx32\n#undef SCNxLEAST32\n#undef SCNxFAST32\n\n#define PRId32 "d"\n#define PRIdLEAST32 "d"\n#define PRIdFAST32 "d"\n#define PRIi32 "i"\n#define PRIiLEAST32 "i"\n#define PRIiFAST32 "i"\n#define PRIo32 "o"\n#define PRIoLEAST32 "o"\n#define PRIoFAST32 "o"\n#define PRIu32 "u"\n#define PRIuLEAST32 "u"\n#define PRIuFAST32 "u"\n#define PRIx32 "x"\n#define PRIxLEAST32 "x"\n#define PRIxFAST32 "x"\n#define PRIX32 "X"\n#define PRIXLEAST32 "X"\n#define PRIXFAST32 "X"\n\n#define SCNd32 "d"\n#define SCNdLEAST32 "d"\n#define SCNdFAST32 "d"\n#define SCNi32 "i"\n#define SCNiLEAST32 "i"\n#define SCNiFAST32 "i"\n#define SCNo32 "o"\n#define SCNoLEAST32 "o"\n#define SCNoFAST32 "o"\n#define SCNu32 "u"\n#define SCNuLEAST32 "u"\n#define SCNuFAST32 "u"\n#define SCNx32 "x"\n#define SCNxLEAST32 "x"\n#define SCNxFAST32 "x"\n#endif\n\n#endif /* __MVS__ */\n#endif /* __CLANG_INTTYPES_H */\n',
  "iso646.h": "/*===---- iso646.h - Standard header for alternate spellings of operators---===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __ISO646_H\n#define __ISO646_H\n#if defined(__MVS__) && __has_include_next(<iso646.h>)\n#include_next <iso646.h>\n#else\n\n#ifndef __cplusplus\n#define and    &&\n#define and_eq &=\n#define bitand &\n#define bitor  |\n#define compl  ~\n#define not    !\n#define not_eq !=\n#define or     ||\n#define or_eq  |=\n#define xor    ^\n#define xor_eq ^=\n#endif\n\n#endif /* __MVS__ */\n#endif /* __ISO646_H */\n",
  "limits.h": `/*===---- limits.h - Standard header for integer sizes --------------------===*\\
 *
 * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
 * See https://llvm.org/LICENSE.txt for license information.
 * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
 *
\\*===----------------------------------------------------------------------===*/

#ifndef __CLANG_LIMITS_H
#define __CLANG_LIMITS_H

#if defined(__MVS__) && __has_include_next(<limits.h>)
#include_next <limits.h>
#else

/* The system's limits.h may, in turn, try to #include_next GCC's limits.h.
   Avert this #include_next madness. */
#if defined __GNUC__ && !defined _GCC_LIMITS_H_
#define _GCC_LIMITS_H_
#endif

/* System headers include a number of constants from POSIX in <limits.h>.
   Include it if we're hosted. */
#if __STDC_HOSTED__ && __has_include_next(<limits.h>)
#include_next <limits.h>
#endif

/* Many system headers try to "help us out" by defining these.  No really, we
   know how big each datatype is. */
#undef  SCHAR_MIN
#undef  SCHAR_MAX
#undef  UCHAR_MAX
#undef  SHRT_MIN
#undef  SHRT_MAX
#undef  USHRT_MAX
#undef  INT_MIN
#undef  INT_MAX
#undef  UINT_MAX
#undef  LONG_MIN
#undef  LONG_MAX
#undef  ULONG_MAX

#undef  CHAR_BIT
#undef  CHAR_MIN
#undef  CHAR_MAX

/* C90/99 5.2.4.2.1 */
#define SCHAR_MAX __SCHAR_MAX__
#define SHRT_MAX  __SHRT_MAX__
#define INT_MAX   __INT_MAX__
#define LONG_MAX  __LONG_MAX__

#define SCHAR_MIN (-__SCHAR_MAX__-1)
#define SHRT_MIN  (-__SHRT_MAX__ -1)
#define INT_MIN   (-__INT_MAX__  -1)
#define LONG_MIN  (-__LONG_MAX__ -1L)

#define UCHAR_MAX (__SCHAR_MAX__*2  +1)
#if __SHRT_WIDTH__ < __INT_WIDTH__
#define USHRT_MAX (__SHRT_MAX__ * 2 + 1)
#else
#define USHRT_MAX (__SHRT_MAX__ * 2U + 1U)
#endif
#define UINT_MAX  (__INT_MAX__  *2U +1U)
#define ULONG_MAX (__LONG_MAX__ *2UL+1UL)

#ifndef MB_LEN_MAX
#define MB_LEN_MAX 1
#endif

#define CHAR_BIT  __CHAR_BIT__

/* C23 5.2.4.2.1 */
#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L
#define BOOL_WIDTH   __BOOL_WIDTH__
#define CHAR_WIDTH   CHAR_BIT
#define SCHAR_WIDTH  CHAR_BIT
#define UCHAR_WIDTH  CHAR_BIT
#define USHRT_WIDTH  __SHRT_WIDTH__
#define SHRT_WIDTH   __SHRT_WIDTH__
#define UINT_WIDTH   __INT_WIDTH__
#define INT_WIDTH    __INT_WIDTH__
#define ULONG_WIDTH  __LONG_WIDTH__
#define LONG_WIDTH   __LONG_WIDTH__
#define ULLONG_WIDTH __LLONG_WIDTH__
#define LLONG_WIDTH  __LLONG_WIDTH__

#define BITINT_MAXWIDTH __BITINT_MAXWIDTH__
#endif

#ifdef __CHAR_UNSIGNED__  /* -funsigned-char */
#define CHAR_MIN 0
#define CHAR_MAX UCHAR_MAX
#else
#define CHAR_MIN SCHAR_MIN
#define CHAR_MAX __SCHAR_MAX__
#endif

/* C99 5.2.4.2.1: Added long long.
   C++11 18.3.3.2: same contents as the Standard C Library header <limits.h>.
 */
#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 199901L) ||              \\
    (defined(__cplusplus) && __cplusplus >= 201103L)

#undef  LLONG_MIN
#undef  LLONG_MAX
#undef  ULLONG_MAX

#define LLONG_MAX  __LONG_LONG_MAX__
#define LLONG_MIN  (-__LONG_LONG_MAX__-1LL)
#define ULLONG_MAX (__LONG_LONG_MAX__*2ULL+1ULL)
#endif

/* LONG_LONG_MIN/LONG_LONG_MAX/ULONG_LONG_MAX are a GNU extension. Android's
   bionic also defines them. It's too bad that we don't have something like
   #pragma poison that could be used to deprecate a macro - the code should just
   use LLONG_MAX and friends.
 */
#if (defined(__GNU_LIBRARY__) ? defined(__USE_GNU)                             \\
                              : !defined(__STRICT_ANSI__)) ||                  \\
    defined(__BIONIC__)

#undef   LONG_LONG_MIN
#undef   LONG_LONG_MAX
#undef   ULONG_LONG_MAX

#define LONG_LONG_MAX  __LONG_LONG_MAX__
#define LONG_LONG_MIN  (-__LONG_LONG_MAX__-1LL)
#define ULONG_LONG_MAX (__LONG_LONG_MAX__*2ULL+1ULL)
#endif

#endif /* __MVS__ */
#endif /* __CLANG_LIMITS_H */
`,
  "stdalign.h": "/*===---- stdalign.h - Standard header for alignment ------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __STDALIGN_H\n#define __STDALIGN_H\n\n#if defined(__cplusplus) ||                                                    \\\n    (defined(__STDC_VERSION__) && __STDC_VERSION__ < 202311L)\n#ifndef __cplusplus\n#define alignas _Alignas\n#define alignof _Alignof\n#endif\n\n#define __alignas_is_defined 1\n#define __alignof_is_defined 1\n#endif /* __STDC_VERSION__ */\n\n#endif /* __STDALIGN_H */\n",
  "stdarg.h": "/*===---- stdarg.h - Variable argument handling ----------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n/*\n * This header is designed to be included multiple times. If any of the __need_\n * macros are defined, then only that subset of interfaces are provided. This\n * can be useful for POSIX headers that need to not expose all of stdarg.h, but\n * need to use some of its interfaces. Otherwise this header provides all of\n * the expected interfaces.\n *\n * When clang modules are enabled, this header is a textual header to support\n * the multiple include behavior. As such, it doesn't directly declare anything\n * so that it doesn't add duplicate declarations to all of its includers'\n * modules.\n */\n#if defined(__MVS__) && __has_include_next(<stdarg.h>)\n#undef __need___va_list\n#undef __need_va_list\n#undef __need_va_arg\n#undef __need___va_copy\n#undef __need_va_copy\n#include <__stdarg_header_macro.h>\n#include_next <stdarg.h>\n\n#else\n#if !defined(__need___va_list) && !defined(__need_va_list) &&                  \\\n    !defined(__need_va_arg) && !defined(__need___va_copy) &&                   \\\n    !defined(__need_va_copy)\n#define __need___va_list\n#define __need_va_list\n#define __need_va_arg\n#define __need___va_copy\n/* GCC always defines __va_copy, but does not define va_copy unless in c99 mode\n * or -ansi is not specified, since it was not part of C90.\n */\n#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 199901L) ||              \\\n    (defined(__cplusplus) && __cplusplus >= 201103L) ||                        \\\n    !defined(__STRICT_ANSI__)\n#define __need_va_copy\n#endif\n#include <__stdarg_header_macro.h>\n#endif\n\n#ifdef __need___va_list\n#include <__stdarg___gnuc_va_list.h>\n#undef __need___va_list\n#endif /* defined(__need___va_list) */\n\n#ifdef __need_va_list\n#include <__stdarg_va_list.h>\n#undef __need_va_list\n#endif /* defined(__need_va_list) */\n\n#ifdef __need_va_arg\n#include <__stdarg_va_arg.h>\n#undef __need_va_arg\n#endif /* defined(__need_va_arg) */\n\n#ifdef __need___va_copy\n#include <__stdarg___va_copy.h>\n#undef __need___va_copy\n#endif /* defined(__need___va_copy) */\n\n#ifdef __need_va_copy\n#include <__stdarg_va_copy.h>\n#undef __need_va_copy\n#endif /* defined(__need_va_copy) */\n\n#endif /* __MVS__ */\n",
  "__stdarg___gnuc_va_list.h": "/*===---- __stdarg___gnuc_va_list.h - Definition of __gnuc_va_list ---------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __GNUC_VA_LIST\n#define __GNUC_VA_LIST\ntypedef __builtin_va_list __gnuc_va_list;\n#endif\n",
  "__stdarg___va_copy.h": "/*===---- __stdarg___va_copy.h - Definition of __va_copy -------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __va_copy\n#define __va_copy(d, s) __builtin_va_copy(d, s)\n#endif\n",
  "__stdarg_header_macro.h": "/*===---- __stdarg_header_macro.h ------------------------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __STDARG_H\n#define __STDARG_H\n#endif\n",
  "__stdarg_va_arg.h": "/*===---- __stdarg_va_arg.h - Definitions of va_start, va_arg, va_end-------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef va_arg\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n/* C23 uses a special builtin. */\n#define va_start(...) __builtin_c23_va_start(__VA_ARGS__)\n#else\n/* Versions before C23 do require the second parameter. */\n#define va_start(ap, param) __builtin_va_start(ap, param)\n#endif\n#define va_end(ap) __builtin_va_end(ap)\n#define va_arg(ap, type) __builtin_va_arg(ap, type)\n\n#endif\n",
  "__stdarg_va_copy.h": "/*===---- __stdarg_va_copy.h - Definition of va_copy------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef va_copy\n#define va_copy(dest, src) __builtin_va_copy(dest, src)\n#endif\n",
  "__stdarg_va_list.h": "/*===---- __stdarg_va_list.h - Definition of va_list -----------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef _VA_LIST\n#define _VA_LIST\ntypedef __builtin_va_list va_list;\n#endif\n",
  "stdatomic.h": "/*===---- stdatomic.h - Standard header for atomic types and operations -----===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __CLANG_STDATOMIC_H\n#define __CLANG_STDATOMIC_H\n\n/* If we're hosted, fall back to the system's stdatomic.h. FreeBSD, for\n * example, already has a Clang-compatible stdatomic.h header.\n *\n * Exclude the MSVC path as well as the MSVC header as of the 14.31.30818\n * explicitly disallows `stdatomic.h` in the C mode via an `#error`.  Fallback\n * to the clang resource header until that is fully supported.  The\n * `stdatomic.h` header requires C++23 or newer.\n */\n#if __STDC_HOSTED__ &&                                                         \\\n    __has_include_next(<stdatomic.h>) &&                                       \\\n    (!defined(_MSC_VER) || (defined(__cplusplus) && __cplusplus >= 202002L))\n# include_next <stdatomic.h>\n#else\n\n#include <stddef.h>\n#include <stdint.h>\n\n#ifdef __cplusplus\nextern \"C\" {\n#endif\n\n/* 7.17.1 Introduction */\n\n#define ATOMIC_BOOL_LOCK_FREE       __CLANG_ATOMIC_BOOL_LOCK_FREE\n#define ATOMIC_CHAR_LOCK_FREE       __CLANG_ATOMIC_CHAR_LOCK_FREE\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n#define ATOMIC_CHAR8_T_LOCK_FREE    __CLANG_ATOMIC_CHAR8_T_LOCK_FREE\n#endif\n#define ATOMIC_CHAR16_T_LOCK_FREE   __CLANG_ATOMIC_CHAR16_T_LOCK_FREE\n#define ATOMIC_CHAR32_T_LOCK_FREE   __CLANG_ATOMIC_CHAR32_T_LOCK_FREE\n#define ATOMIC_WCHAR_T_LOCK_FREE    __CLANG_ATOMIC_WCHAR_T_LOCK_FREE\n#define ATOMIC_SHORT_LOCK_FREE      __CLANG_ATOMIC_SHORT_LOCK_FREE\n#define ATOMIC_INT_LOCK_FREE        __CLANG_ATOMIC_INT_LOCK_FREE\n#define ATOMIC_LONG_LOCK_FREE       __CLANG_ATOMIC_LONG_LOCK_FREE\n#define ATOMIC_LLONG_LOCK_FREE      __CLANG_ATOMIC_LLONG_LOCK_FREE\n#define ATOMIC_POINTER_LOCK_FREE    __CLANG_ATOMIC_POINTER_LOCK_FREE\n\n/* 7.17.2 Initialization */\n#if (defined(__STDC_VERSION__) && __STDC_VERSION__ < 202311L) ||               \\\n    defined(__cplusplus)\n/* ATOMIC_VAR_INIT was removed in C23, but still remains in C++23. */\n#define ATOMIC_VAR_INIT(value) (value)\n#endif\n\n#if ((defined(__STDC_VERSION__) && __STDC_VERSION__ >= 201710L &&              \\\n      __STDC_VERSION__ < 202311L) ||                                           \\\n     (defined(__cplusplus) && __cplusplus >= 202002L)) &&                      \\\n    !defined(_CLANG_DISABLE_CRT_DEPRECATION_WARNINGS)\n/* ATOMIC_VAR_INIT was deprecated in C17 and C++20. */\n#pragma clang deprecated(ATOMIC_VAR_INIT)\n#endif\n#define atomic_init __c11_atomic_init\n\n/* 7.17.3 Order and consistency */\n\ntypedef enum memory_order {\n  memory_order_relaxed = __ATOMIC_RELAXED,\n  memory_order_consume = __ATOMIC_CONSUME,\n  memory_order_acquire = __ATOMIC_ACQUIRE,\n  memory_order_release = __ATOMIC_RELEASE,\n  memory_order_acq_rel = __ATOMIC_ACQ_REL,\n  memory_order_seq_cst = __ATOMIC_SEQ_CST\n} memory_order;\n\n#define kill_dependency(y) (y)\n\n/* 7.17.4 Fences */\n\n/* These should be provided by the libc implementation. */\nvoid atomic_thread_fence(memory_order);\nvoid atomic_signal_fence(memory_order);\n\n#define atomic_thread_fence(order) __c11_atomic_thread_fence(order)\n#define atomic_signal_fence(order) __c11_atomic_signal_fence(order)\n\n/* 7.17.5 Lock-free property */\n\n#define atomic_is_lock_free(obj) __c11_atomic_is_lock_free(sizeof(*(obj)))\n\n/* 7.17.6 Atomic integer types */\n\n#ifdef __cplusplus\ntypedef _Atomic(bool)               atomic_bool;\n#else\ntypedef _Atomic(_Bool)              atomic_bool;\n#endif\ntypedef _Atomic(char)               atomic_char;\ntypedef _Atomic(signed char)        atomic_schar;\ntypedef _Atomic(unsigned char)      atomic_uchar;\ntypedef _Atomic(short)              atomic_short;\ntypedef _Atomic(unsigned short)     atomic_ushort;\ntypedef _Atomic(int)                atomic_int;\ntypedef _Atomic(unsigned int)       atomic_uint;\ntypedef _Atomic(long)               atomic_long;\ntypedef _Atomic(unsigned long)      atomic_ulong;\ntypedef _Atomic(long long)          atomic_llong;\ntypedef _Atomic(unsigned long long) atomic_ullong;\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\ntypedef _Atomic(unsigned char)      atomic_char8_t;\n#endif\ntypedef _Atomic(uint_least16_t)     atomic_char16_t;\ntypedef _Atomic(uint_least32_t)     atomic_char32_t;\ntypedef _Atomic(wchar_t)            atomic_wchar_t;\ntypedef _Atomic(int_least8_t)       atomic_int_least8_t;\ntypedef _Atomic(uint_least8_t)      atomic_uint_least8_t;\ntypedef _Atomic(int_least16_t)      atomic_int_least16_t;\ntypedef _Atomic(uint_least16_t)     atomic_uint_least16_t;\ntypedef _Atomic(int_least32_t)      atomic_int_least32_t;\ntypedef _Atomic(uint_least32_t)     atomic_uint_least32_t;\ntypedef _Atomic(int_least64_t)      atomic_int_least64_t;\ntypedef _Atomic(uint_least64_t)     atomic_uint_least64_t;\ntypedef _Atomic(int_fast8_t)        atomic_int_fast8_t;\ntypedef _Atomic(uint_fast8_t)       atomic_uint_fast8_t;\ntypedef _Atomic(int_fast16_t)       atomic_int_fast16_t;\ntypedef _Atomic(uint_fast16_t)      atomic_uint_fast16_t;\ntypedef _Atomic(int_fast32_t)       atomic_int_fast32_t;\ntypedef _Atomic(uint_fast32_t)      atomic_uint_fast32_t;\ntypedef _Atomic(int_fast64_t)       atomic_int_fast64_t;\ntypedef _Atomic(uint_fast64_t)      atomic_uint_fast64_t;\ntypedef _Atomic(intptr_t)           atomic_intptr_t;\ntypedef _Atomic(uintptr_t)          atomic_uintptr_t;\ntypedef _Atomic(size_t)             atomic_size_t;\ntypedef _Atomic(ptrdiff_t)          atomic_ptrdiff_t;\ntypedef _Atomic(intmax_t)           atomic_intmax_t;\ntypedef _Atomic(uintmax_t)          atomic_uintmax_t;\n\n/* 7.17.7 Operations on atomic types */\n\n#define atomic_store(object, desired) __c11_atomic_store(object, desired, __ATOMIC_SEQ_CST)\n#define atomic_store_explicit __c11_atomic_store\n\n#define atomic_load(object) __c11_atomic_load(object, __ATOMIC_SEQ_CST)\n#define atomic_load_explicit __c11_atomic_load\n\n#define atomic_exchange(object, desired) __c11_atomic_exchange(object, desired, __ATOMIC_SEQ_CST)\n#define atomic_exchange_explicit __c11_atomic_exchange\n\n#define atomic_compare_exchange_strong(object, expected, desired) __c11_atomic_compare_exchange_strong(object, expected, desired, __ATOMIC_SEQ_CST, __ATOMIC_SEQ_CST)\n#define atomic_compare_exchange_strong_explicit __c11_atomic_compare_exchange_strong\n\n#define atomic_compare_exchange_weak(object, expected, desired) __c11_atomic_compare_exchange_weak(object, expected, desired, __ATOMIC_SEQ_CST, __ATOMIC_SEQ_CST)\n#define atomic_compare_exchange_weak_explicit __c11_atomic_compare_exchange_weak\n\n#define atomic_fetch_add(object, operand) __c11_atomic_fetch_add(object, operand, __ATOMIC_SEQ_CST)\n#define atomic_fetch_add_explicit __c11_atomic_fetch_add\n\n#define atomic_fetch_sub(object, operand) __c11_atomic_fetch_sub(object, operand, __ATOMIC_SEQ_CST)\n#define atomic_fetch_sub_explicit __c11_atomic_fetch_sub\n\n#define atomic_fetch_or(object, operand) __c11_atomic_fetch_or(object, operand, __ATOMIC_SEQ_CST)\n#define atomic_fetch_or_explicit __c11_atomic_fetch_or\n\n#define atomic_fetch_xor(object, operand) __c11_atomic_fetch_xor(object, operand, __ATOMIC_SEQ_CST)\n#define atomic_fetch_xor_explicit __c11_atomic_fetch_xor\n\n#define atomic_fetch_and(object, operand) __c11_atomic_fetch_and(object, operand, __ATOMIC_SEQ_CST)\n#define atomic_fetch_and_explicit __c11_atomic_fetch_and\n\n/* 7.17.8 Atomic flag type and operations */\n\ntypedef struct atomic_flag { atomic_bool _Value; } atomic_flag;\n\n#ifdef __cplusplus\n#define ATOMIC_FLAG_INIT {false}\n#else\n#define ATOMIC_FLAG_INIT { 0 }\n#endif\n\n/* These should be provided by the libc implementation. */\n#ifdef __cplusplus\nbool atomic_flag_test_and_set(volatile atomic_flag *);\nbool atomic_flag_test_and_set_explicit(volatile atomic_flag *, memory_order);\n#else\n_Bool atomic_flag_test_and_set(volatile atomic_flag *);\n_Bool atomic_flag_test_and_set_explicit(volatile atomic_flag *, memory_order);\n#endif\nvoid atomic_flag_clear(volatile atomic_flag *);\nvoid atomic_flag_clear_explicit(volatile atomic_flag *, memory_order);\n\n#define atomic_flag_test_and_set(object) __c11_atomic_exchange(&(object)->_Value, 1, __ATOMIC_SEQ_CST)\n#define atomic_flag_test_and_set_explicit(object, order) __c11_atomic_exchange(&(object)->_Value, 1, order)\n\n#define atomic_flag_clear(object) __c11_atomic_store(&(object)->_Value, 0, __ATOMIC_SEQ_CST)\n#define atomic_flag_clear_explicit(object, order) __c11_atomic_store(&(object)->_Value, 0, order)\n\n#ifdef __cplusplus\n}\n#endif\n\n#endif /* __STDC_HOSTED__ */\n#endif /* __CLANG_STDATOMIC_H */\n\n",
  "stdbool.h": "/*===---- stdbool.h - Standard header for booleans -------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __STDBOOL_H\n#define __STDBOOL_H\n\n#define __bool_true_false_are_defined 1\n\n#if defined(__MVS__) && __has_include_next(<stdbool.h>)\n#include_next <stdbool.h>\n#else\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ > 201710L\n/* FIXME: We should be issuing a deprecation warning here, but cannot yet due\n * to system headers which include this header file unconditionally.\n */\n#elif !defined(__cplusplus)\n#define bool _Bool\n#define true 1\n#define false 0\n#elif defined(__GNUC__) && !defined(__STRICT_ANSI__)\n/* Define _Bool as a GNU extension. */\n#define _Bool bool\n#if defined(__cplusplus) && __cplusplus < 201103L\n/* For C++98, define bool, false, true as a GNU extension. */\n#define bool bool\n#define false false\n#define true true\n#endif\n#endif\n\n#endif /* __MVS__ */\n#endif /* __STDBOOL_H */\n",
  "stdcountof.h": "/*===---- stdcountof.h - Standard header for countof -----------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __STDCOUNTOF_H\n#define __STDCOUNTOF_H\n\n#define countof _Countof\n\n#endif /* __STDCOUNTOF_H */\n",
  "stdckdint.h": `/*===---- stdckdint.h - Standard header for checking integer----------------===
 *
 * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
 * See https://llvm.org/LICENSE.txt for license information.
 * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
 *
 *===-----------------------------------------------------------------------===
 */

#ifndef __STDCKDINT_H
#define __STDCKDINT_H

/* If we're hosted, fall back to the system's stdckdint.h. FreeBSD, for
 * example, already has a Clang-compatible stdckdint.h header.
 *
 * The \`stdckdint.h\` header requires C 23 or newer.
 */
#if __STDC_HOSTED__ && __has_include_next(<stdckdint.h>)
#include_next <stdckdint.h>
#else

/* C23 7.20.1 Defines several macros for performing checked integer arithmetic*/

#define __STDC_VERSION_STDCKDINT_H__ 202311L

// Both A and B shall be any integer type other than "plain" char, bool, a bit-
// precise integer type, or an enumerated type, and they need not be the same.

// R shall be a modifiable lvalue of any integer type other than "plain" char,
// bool, a bit-precise integer type, or an enumerated type. It shouldn't be
// short type, either. Otherwise, it may be unable to hold two the result of
// operating two 'int's.

// A diagnostic message will be produced if A or B are not suitable integer
// types, or if R is not a modifiable lvalue of a suitable integer type or R
// is short type.
#define ckd_add(R, A, B) __builtin_add_overflow((A), (B), (R))
#define ckd_sub(R, A, B) __builtin_sub_overflow((A), (B), (R))
#define ckd_mul(R, A, B) __builtin_mul_overflow((A), (B), (R))

#endif /* __STDC_HOSTED__ */
#endif /* __STDCKDINT_H */
`,
  "stddef.h": "/*===---- stddef.h - Basic type definitions --------------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n/*\n * This header is designed to be included multiple times. If any of the __need_\n * macros are defined, then only that subset of interfaces are provided. This\n * can be useful for POSIX headers that need to not expose all of stddef.h, but\n * need to use some of its interfaces. Otherwise this header provides all of\n * the expected interfaces.\n *\n * When clang modules are enabled, this header is a textual header to support\n * the multiple include behavior. As such, it doesn't directly declare anything\n * so that it doesn't add duplicate declarations to all of its includers'\n * modules.\n */\n#if defined(__MVS__) && __has_include_next(<stddef.h>)\n#undef __need_ptrdiff_t\n#undef __need_size_t\n#undef __need_rsize_t\n#undef __need_wchar_t\n#undef __need_NULL\n#undef __need_nullptr_t\n#undef __need_unreachable\n#undef __need_max_align_t\n#undef __need_offsetof\n#undef __need_wint_t\n#include <__stddef_header_macro.h>\n#include_next <stddef.h>\n\n#else\n\n#if !defined(__need_ptrdiff_t) && !defined(__need_size_t) &&                   \\\n    !defined(__need_rsize_t) && !defined(__need_wchar_t) &&                    \\\n    !defined(__need_NULL) && !defined(__need_nullptr_t) &&                     \\\n    !defined(__need_unreachable) && !defined(__need_max_align_t) &&            \\\n    !defined(__need_offsetof) && !defined(__need_wint_t)\n#define __need_ptrdiff_t\n#define __need_size_t\n/* ISO9899:2011 7.20 (C11 Annex K): Define rsize_t if __STDC_WANT_LIB_EXT1__ is\n * enabled. */\n#if defined(__STDC_WANT_LIB_EXT1__) && __STDC_WANT_LIB_EXT1__ >= 1\n#define __need_rsize_t\n#endif\n#define __need_wchar_t\n#if !defined(__STDDEF_H) || __has_feature(modules)\n/*\n * __stddef_null.h is special when building without modules: if __need_NULL is\n * set, then it will unconditionally redefine NULL. To avoid stepping on client\n * definitions of NULL, __need_NULL should only be set the first time this\n * header is included, that is when __STDDEF_H is not defined. However, when\n * building with modules, this header is a textual header and needs to\n * unconditionally include __stdef_null.h to support multiple submodules\n * exporting _Builtin_stddef.null. Take module SM with submodules A and B, whose\n * headers both include stddef.h When SM.A builds, __STDDEF_H will be defined.\n * When SM.B builds, the definition from SM.A will leak when building without\n * local submodule visibility. stddef.h wouldn't include __stddef_null.h, and\n * SM.B wouldn't import _Builtin_stddef.null, and SM.B's `export *` wouldn't\n * export NULL as expected. When building with modules, always include\n * __stddef_null.h so that everything works as expected.\n */\n#define __need_NULL\n#endif\n#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L) ||              \\\n    defined(__cplusplus)\n#define __need_nullptr_t\n#endif\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n#define __need_unreachable\n#endif\n#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 201112L) ||              \\\n    (defined(__cplusplus) && __cplusplus >= 201103L)\n#define __need_max_align_t\n#endif\n#define __need_offsetof\n/* wint_t is provided by <wchar.h> and not <stddef.h>. It's here\n * for compatibility, but must be explicitly requested. Therefore\n * __need_wint_t is intentionally not defined here. */\n#include <__stddef_header_macro.h>\n#endif\n\n#if defined(__need_ptrdiff_t)\n#include <__stddef_ptrdiff_t.h>\n#undef __need_ptrdiff_t\n#endif /* defined(__need_ptrdiff_t) */\n\n#if defined(__need_size_t)\n#include <__stddef_size_t.h>\n#undef __need_size_t\n#endif /*defined(__need_size_t) */\n\n#if defined(__need_rsize_t)\n#include <__stddef_rsize_t.h>\n#undef __need_rsize_t\n#endif /* defined(__need_rsize_t) */\n\n#if defined(__need_wchar_t)\n#include <__stddef_wchar_t.h>\n#undef __need_wchar_t\n#endif /* defined(__need_wchar_t) */\n\n#if defined(__need_NULL)\n#include <__stddef_null.h>\n#undef __need_NULL\n#endif /* defined(__need_NULL) */\n\n#if defined(__need_nullptr_t)\n#include <__stddef_nullptr_t.h>\n#undef __need_nullptr_t\n#endif /* defined(__need_nullptr_t) */\n\n#if defined(__need_unreachable)\n#include <__stddef_unreachable.h>\n#undef __need_unreachable\n#endif /* defined(__need_unreachable) */\n\n#if defined(__need_max_align_t)\n#include <__stddef_max_align_t.h>\n#undef __need_max_align_t\n#endif /* defined(__need_max_align_t) */\n\n#if defined(__need_offsetof)\n#include <__stddef_offsetof.h>\n#undef __need_offsetof\n#endif /* defined(__need_offsetof) */\n\n/* Some C libraries expect to see a wint_t here. Others (notably MinGW) will use\n__WINT_TYPE__ directly; accommodate both by requiring __need_wint_t */\n#if defined(__need_wint_t)\n#include <__stddef_wint_t.h>\n#undef __need_wint_t\n#endif /* __need_wint_t */\n\n#endif /* __MVS__ */\n",
  "stddefer.h": "/*===---- stddefer.h - Standard header for 'defer' -------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __CLANG_STDDEFER_H\n#define __CLANG_STDDEFER_H\n\n/* Provide 'defer' if '_Defer' is supported. */\n#ifdef __STDC_DEFER_TS25755__\n#define __STDC_VERSION_STDDEFER_H__ 202602L\n#define defer _Defer\n#endif\n\n#endif /* __CLANG_STDDEFER_H */\n",
  "__stddef_header_macro.h": "/*===---- __stddef_header_macro.h ------------------------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __STDDEF_H\n#define __STDDEF_H\n#endif\n",
  "__stddef_max_align_t.h": "/*===---- __stddef_max_align_t.h - Definition of max_align_t ---------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __CLANG_MAX_ALIGN_T_DEFINED\n#define __CLANG_MAX_ALIGN_T_DEFINED\n\n#if defined(_MSC_VER)\ntypedef double max_align_t;\n#elif defined(__APPLE__)\ntypedef long double max_align_t;\n#else\n// Define 'max_align_t' to match the GCC definition.\ntypedef struct {\n  long long __clang_max_align_nonce1\n      __attribute__((__aligned__(__alignof__(long long))));\n  long double __clang_max_align_nonce2\n      __attribute__((__aligned__(__alignof__(long double))));\n} max_align_t;\n#endif\n\n#endif\n",
  "__stddef_null.h": "/*===---- __stddef_null.h - Definition of NULL -----------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#if !defined(NULL) || !__building_module(_Builtin_stddef)\n\n/* linux/stddef.h will define NULL to 0. glibc (and other) headers then define\n * __need_NULL and rely on stddef.h to redefine NULL to the correct value again.\n * Modules don't support redefining macros like that, but support that pattern\n * in the non-modules case.\n */\n#undef NULL\n\n#ifdef __cplusplus\n#if !defined(__MINGW32__) && !defined(_MSC_VER)\n#define NULL __null\n#else\n#define NULL 0\n#endif\n#else\n#define NULL ((void*)0)\n#endif\n\n#endif\n",
  "__stddef_nullptr_t.h": "/*===---- __stddef_nullptr_t.h - Definition of nullptr_t -------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n/*\n * When -fbuiltin-headers-in-system-modules is set this is a non-modular header\n * and needs to behave as if it was textual.\n */\n#if !defined(_NULLPTR_T) ||                                                    \\\n    (__has_feature(modules) && !__building_module(_Builtin_stddef))\n#define _NULLPTR_T\n\n#ifdef __cplusplus\n#if defined(_MSC_EXTENSIONS) && defined(_NATIVE_NULLPTR_SUPPORTED)\nnamespace std {\ntypedef decltype(nullptr) nullptr_t;\n}\nusing ::std::nullptr_t;\n#endif\n#elif defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\ntypedef typeof(nullptr) nullptr_t;\n#endif\n\n#endif\n",
  "__stddef_offsetof.h": "/*===---- __stddef_offsetof.h - Definition of offsetof ---------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n/*\n * When -fbuiltin-headers-in-system-modules is set this is a non-modular header\n * and needs to behave as if it was textual.\n */\n#if !defined(offsetof) ||                                                      \\\n    (__has_feature(modules) && !__building_module(_Builtin_stddef))\n#define offsetof(t, d) __builtin_offsetof(t, d)\n#endif\n",
  "__stddef_ptrdiff_t.h": "/*===---- __stddef_ptrdiff_t.h - Definition of ptrdiff_t -------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n/*\n * When -fbuiltin-headers-in-system-modules is set this is a non-modular header\n * and needs to behave as if it was textual.\n */\n#if !defined(_PTRDIFF_T) ||                                                    \\\n    (__has_feature(modules) && !__building_module(_Builtin_stddef))\n#define _PTRDIFF_T\n\ntypedef __PTRDIFF_TYPE__ ptrdiff_t;\n\n#endif\n",
  "__stddef_rsize_t.h": "/*===---- __stddef_rsize_t.h - Definition of rsize_t -----------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n/*\n * When -fbuiltin-headers-in-system-modules is set this is a non-modular header\n * and needs to behave as if it was textual.\n */\n#if !defined(_RSIZE_T) ||                                                      \\\n    (__has_feature(modules) && !__building_module(_Builtin_stddef))\n#define _RSIZE_T\n\ntypedef __SIZE_TYPE__ rsize_t;\n\n#endif\n",
  "__stddef_size_t.h": "/*===---- __stddef_size_t.h - Definition of size_t -------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n/*\n * When -fbuiltin-headers-in-system-modules is set this is a non-modular header\n * and needs to behave as if it was textual.\n */\n#if !defined(_SIZE_T) ||                                                       \\\n    (__has_feature(modules) && !__building_module(_Builtin_stddef))\n#define _SIZE_T\n\ntypedef __SIZE_TYPE__ size_t;\n\n#endif\n",
  "__stddef_unreachable.h": "/*===---- __stddef_unreachable.h - Definition of unreachable ---------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __cplusplus\n\n/*\n * When -fbuiltin-headers-in-system-modules is set this is a non-modular header\n * and needs to behave as if it was textual.\n */\n#if !defined(unreachable) ||                                                   \\\n    (__has_feature(modules) && !__building_module(_Builtin_stddef))\n#define unreachable() __builtin_unreachable()\n#endif\n\n#endif\n",
  "__stddef_wchar_t.h": "/*===---- __stddef_wchar.h - Definition of wchar_t -------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#if !defined(__cplusplus) || (defined(_MSC_VER) && !_NATIVE_WCHAR_T_DEFINED)\n\n/*\n * When -fbuiltin-headers-in-system-modules is set this is a non-modular header\n * and needs to behave as if it was textual.\n */\n#if !defined(_WCHAR_T) ||                                                      \\\n    (__has_feature(modules) && !__building_module(_Builtin_stddef))\n#define _WCHAR_T\n\n#ifdef _MSC_EXTENSIONS\n#define _WCHAR_T_DEFINED\n#endif\n\ntypedef __WCHAR_TYPE__ wchar_t;\n\n#endif\n\n#endif\n",
  "__stddef_wint_t.h": "/*===---- __stddef_wint.h - Definition of wint_t ---------------------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef _WINT_T\n#define _WINT_T\n\ntypedef __WINT_TYPE__ wint_t;\n\n#endif\n",
  "stdint.h": "/*===---- stdint.h - Standard header for sized integer types --------------===*\\\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n\\*===----------------------------------------------------------------------===*/\n\n#ifndef __CLANG_STDINT_H\n// AIX system headers need stdint.h to be re-enterable while _STD_TYPES_T\n// is defined until an inclusion of it without _STD_TYPES_T occurs, in which\n// case the header guard macro is defined.\n#if !defined(_AIX) || !defined(_STD_TYPES_T) || !defined(__STDC_HOSTED__)\n#define __CLANG_STDINT_H\n#endif\n\n#if defined(__MVS__) && __has_include_next(<stdint.h>)\n#include_next <stdint.h>\n#else\n\n/* If we're hosted, fall back to the system's stdint.h, which might have\n * additional definitions.\n */\n#if __STDC_HOSTED__ && __has_include_next(<stdint.h>)\n\n// C99 7.18.3 Limits of other integer types\n//\n//  Footnote 219, 220: C++ implementations should define these macros only when\n//  __STDC_LIMIT_MACROS is defined before <stdint.h> is included.\n//\n//  Footnote 222: C++ implementations should define these macros only when\n//  __STDC_CONSTANT_MACROS is defined before <stdint.h> is included.\n//\n// C++11 [cstdint.syn]p2:\n//\n//  The macros defined by <cstdint> are provided unconditionally. In particular,\n//  the symbols __STDC_LIMIT_MACROS and __STDC_CONSTANT_MACROS (mentioned in\n//  footnotes 219, 220, and 222 in the C standard) play no role in C++.\n//\n// C11 removed the problematic footnotes.\n//\n// Work around this inconsistency by always defining those macros in C++ mode,\n// so that a C library implementation which follows the C99 standard can be\n// used in C++.\n# ifdef __cplusplus\n#  if !defined(__STDC_LIMIT_MACROS)\n#   define __STDC_LIMIT_MACROS\n#   define __STDC_LIMIT_MACROS_DEFINED_BY_CLANG\n#  endif\n#  if !defined(__STDC_CONSTANT_MACROS)\n#   define __STDC_CONSTANT_MACROS\n#   define __STDC_CONSTANT_MACROS_DEFINED_BY_CLANG\n#  endif\n# endif\n\n# include_next <stdint.h>\n\n# ifdef __STDC_LIMIT_MACROS_DEFINED_BY_CLANG\n#  undef __STDC_LIMIT_MACROS\n#  undef __STDC_LIMIT_MACROS_DEFINED_BY_CLANG\n# endif\n# ifdef __STDC_CONSTANT_MACROS_DEFINED_BY_CLANG\n#  undef __STDC_CONSTANT_MACROS\n#  undef __STDC_CONSTANT_MACROS_DEFINED_BY_CLANG\n# endif\n\n#else\n\n/* C99 7.18.1.1 Exact-width integer types.\n * C99 7.18.1.2 Minimum-width integer types.\n * C99 7.18.1.3 Fastest minimum-width integer types.\n *\n * The standard requires that exact-width type be defined for 8-, 16-, 32-, and\n * 64-bit types if they are implemented. Other exact width types are optional.\n * This implementation defines an exact-width types for every integer width\n * that is represented in the standard integer types.\n *\n * The standard also requires minimum-width types be defined for 8-, 16-, 32-,\n * and 64-bit widths regardless of whether there are corresponding exact-width\n * types.\n *\n * To accommodate targets that are missing types that are exactly 8, 16, 32, or\n * 64 bits wide, this implementation takes an approach of cascading\n * redefinitions, redefining __int_leastN_t to successively smaller exact-width\n * types. It is therefore important that the types are defined in order of\n * descending widths.\n *\n * We currently assume that the minimum-width types and the fastest\n * minimum-width types are the same. This is allowed by the standard, but is\n * suboptimal.\n *\n * In violation of the standard, some targets do not implement a type that is\n * wide enough to represent all of the required widths (8-, 16-, 32-, 64-bit).\n * To accommodate these targets, a required minimum-width type is only\n * defined if there exists an exact-width type of equal or greater width.\n */\n\n#ifdef __INT64_TYPE__\n# ifndef __int8_t_defined /* glibc sys/types.h also defines int64_t*/\ntypedef __INT64_TYPE__ int64_t;\n# endif /* __int8_t_defined */\ntypedef __UINT64_TYPE__ uint64_t;\n# undef __int_least64_t\n# define __int_least64_t int64_t\n# undef __uint_least64_t\n# define __uint_least64_t uint64_t\n# undef __int_least32_t\n# define __int_least32_t int64_t\n# undef __uint_least32_t\n# define __uint_least32_t uint64_t\n# undef __int_least16_t\n# define __int_least16_t int64_t\n# undef __uint_least16_t\n# define __uint_least16_t uint64_t\n# undef __int_least8_t\n# define __int_least8_t int64_t\n# undef __uint_least8_t\n# define __uint_least8_t uint64_t\n#endif /* __INT64_TYPE__ */\n\n#ifdef __int_least64_t\ntypedef __int_least64_t int_least64_t;\ntypedef __uint_least64_t uint_least64_t;\ntypedef __int_least64_t int_fast64_t;\ntypedef __uint_least64_t uint_fast64_t;\n#endif /* __int_least64_t */\n\n#ifdef __INT56_TYPE__\ntypedef __INT56_TYPE__ int56_t;\ntypedef __UINT56_TYPE__ uint56_t;\ntypedef int56_t int_least56_t;\ntypedef uint56_t uint_least56_t;\ntypedef int56_t int_fast56_t;\ntypedef uint56_t uint_fast56_t;\n# undef __int_least32_t\n# define __int_least32_t int56_t\n# undef __uint_least32_t\n# define __uint_least32_t uint56_t\n# undef __int_least16_t\n# define __int_least16_t int56_t\n# undef __uint_least16_t\n# define __uint_least16_t uint56_t\n# undef __int_least8_t\n# define __int_least8_t int56_t\n# undef __uint_least8_t\n# define __uint_least8_t uint56_t\n#endif /* __INT56_TYPE__ */\n\n\n#ifdef __INT48_TYPE__\ntypedef __INT48_TYPE__ int48_t;\ntypedef __UINT48_TYPE__ uint48_t;\ntypedef int48_t int_least48_t;\ntypedef uint48_t uint_least48_t;\ntypedef int48_t int_fast48_t;\ntypedef uint48_t uint_fast48_t;\n# undef __int_least32_t\n# define __int_least32_t int48_t\n# undef __uint_least32_t\n# define __uint_least32_t uint48_t\n# undef __int_least16_t\n# define __int_least16_t int48_t\n# undef __uint_least16_t\n# define __uint_least16_t uint48_t\n# undef __int_least8_t\n# define __int_least8_t int48_t\n# undef __uint_least8_t\n# define __uint_least8_t uint48_t\n#endif /* __INT48_TYPE__ */\n\n\n#ifdef __INT40_TYPE__\ntypedef __INT40_TYPE__ int40_t;\ntypedef __UINT40_TYPE__ uint40_t;\ntypedef int40_t int_least40_t;\ntypedef uint40_t uint_least40_t;\ntypedef int40_t int_fast40_t;\ntypedef uint40_t uint_fast40_t;\n# undef __int_least32_t\n# define __int_least32_t int40_t\n# undef __uint_least32_t\n# define __uint_least32_t uint40_t\n# undef __int_least16_t\n# define __int_least16_t int40_t\n# undef __uint_least16_t\n# define __uint_least16_t uint40_t\n# undef __int_least8_t\n# define __int_least8_t int40_t\n# undef __uint_least8_t\n# define __uint_least8_t uint40_t\n#endif /* __INT40_TYPE__ */\n\n\n#ifdef __INT32_TYPE__\n\n# ifndef __int8_t_defined /* glibc sys/types.h also defines int32_t*/\ntypedef __INT32_TYPE__ int32_t;\n# endif /* __int8_t_defined */\n\n# ifndef __uint32_t_defined  /* more glibc compatibility */\n# define __uint32_t_defined\ntypedef __UINT32_TYPE__ uint32_t;\n# endif /* __uint32_t_defined */\n\n# undef __int_least32_t\n# define __int_least32_t int32_t\n# undef __uint_least32_t\n# define __uint_least32_t uint32_t\n# undef __int_least16_t\n# define __int_least16_t int32_t\n# undef __uint_least16_t\n# define __uint_least16_t uint32_t\n# undef __int_least8_t\n# define __int_least8_t int32_t\n# undef __uint_least8_t\n# define __uint_least8_t uint32_t\n#endif /* __INT32_TYPE__ */\n\n#ifdef __int_least32_t\ntypedef __int_least32_t int_least32_t;\ntypedef __uint_least32_t uint_least32_t;\ntypedef __int_least32_t int_fast32_t;\ntypedef __uint_least32_t uint_fast32_t;\n#endif /* __int_least32_t */\n\n#ifdef __INT24_TYPE__\ntypedef __INT24_TYPE__ int24_t;\ntypedef __UINT24_TYPE__ uint24_t;\ntypedef int24_t int_least24_t;\ntypedef uint24_t uint_least24_t;\ntypedef int24_t int_fast24_t;\ntypedef uint24_t uint_fast24_t;\n# undef __int_least16_t\n# define __int_least16_t int24_t\n# undef __uint_least16_t\n# define __uint_least16_t uint24_t\n# undef __int_least8_t\n# define __int_least8_t int24_t\n# undef __uint_least8_t\n# define __uint_least8_t uint24_t\n#endif /* __INT24_TYPE__ */\n\n#ifdef __INT16_TYPE__\n#ifndef __int8_t_defined /* glibc sys/types.h also defines int16_t*/\ntypedef __INT16_TYPE__ int16_t;\n#endif /* __int8_t_defined */\ntypedef __UINT16_TYPE__ uint16_t;\n# undef __int_least16_t\n# define __int_least16_t int16_t\n# undef __uint_least16_t\n# define __uint_least16_t uint16_t\n# undef __int_least8_t\n# define __int_least8_t int16_t\n# undef __uint_least8_t\n# define __uint_least8_t uint16_t\n#endif /* __INT16_TYPE__ */\n\n#ifdef __int_least16_t\ntypedef __int_least16_t int_least16_t;\ntypedef __uint_least16_t uint_least16_t;\ntypedef __int_least16_t int_fast16_t;\ntypedef __uint_least16_t uint_fast16_t;\n#endif /* __int_least16_t */\n\n\n#ifdef __INT8_TYPE__\n#ifndef __int8_t_defined  /* glibc sys/types.h also defines int8_t*/\ntypedef __INT8_TYPE__ int8_t;\n#endif /* __int8_t_defined */\ntypedef __UINT8_TYPE__ uint8_t;\n# undef __int_least8_t\n# define __int_least8_t int8_t\n# undef __uint_least8_t\n# define __uint_least8_t uint8_t\n#endif /* __INT8_TYPE__ */\n\n#ifdef __int_least8_t\ntypedef __int_least8_t int_least8_t;\ntypedef __uint_least8_t uint_least8_t;\ntypedef __int_least8_t int_fast8_t;\ntypedef __uint_least8_t uint_fast8_t;\n#endif /* __int_least8_t */\n\n/* prevent glibc sys/types.h from defining conflicting types */\n#ifndef __int8_t_defined\n# define __int8_t_defined\n#endif /* __int8_t_defined */\n\n/* C99 7.18.1.4 Integer types capable of holding object pointers.\n */\n#define __stdint_join3(a,b,c) a ## b ## c\n\n#ifndef _INTPTR_T\n#ifndef __intptr_t_defined\ntypedef __INTPTR_TYPE__ intptr_t;\n#define __intptr_t_defined\n#define _INTPTR_T\n#endif\n#endif\n\n#ifndef _UINTPTR_T\ntypedef __UINTPTR_TYPE__ uintptr_t;\n#define _UINTPTR_T\n#endif\n\n/* C99 7.18.1.5 Greatest-width integer types.\n */\ntypedef __INTMAX_TYPE__  intmax_t;\ntypedef __UINTMAX_TYPE__ uintmax_t;\n\n/* C99 7.18.4 Macros for minimum-width integer constants.\n *\n * The standard requires that integer constant macros be defined for all the\n * minimum-width types defined above. As 8-, 16-, 32-, and 64-bit minimum-width\n * types are required, the corresponding integer constant macros are defined\n * here. This implementation also defines minimum-width types for every other\n * integer width that the target implements, so corresponding macros are\n * defined below, too.\n *\n * Note that C++ should not check __STDC_CONSTANT_MACROS here, contrary to the\n * claims of the C standard (see C++ 18.3.1p2, [cstdint.syn]).\n */\n\n#ifdef __int_least64_t\n#define INT64_C(v) __INT64_C(v)\n#define UINT64_C(v) __UINT64_C(v)\n#endif /* __int_least64_t */\n\n\n#ifdef __INT56_TYPE__\n#define INT56_C(v) __INT56_C(v)\n#define UINT56_C(v) __UINT56_C(v)\n#endif /* __INT56_TYPE__ */\n\n\n#ifdef __INT48_TYPE__\n#define INT48_C(v) __INT48_C(v)\n#define UINT48_C(v) __UINT48_C(v)\n#endif /* __INT48_TYPE__ */\n\n\n#ifdef __INT40_TYPE__\n#define INT40_C(v) __INT40_C(v)\n#define UINT40_C(v) __UINT40_C(v)\n#endif /* __INT40_TYPE__ */\n\n\n#ifdef __int_least32_t\n#define INT32_C(v) __INT32_C(v)\n#define UINT32_C(v) __UINT32_C(v)\n#endif /* __int_least32_t */\n\n\n#ifdef __INT24_TYPE__\n#define INT24_C(v) __INT24_C(v)\n#define UINT24_C(v) __UINT24_C(v)\n#endif /* __INT24_TYPE__ */\n\n\n#ifdef __int_least16_t\n#define INT16_C(v) __INT16_C(v)\n#define UINT16_C(v) __UINT16_C(v)\n#endif /* __int_least16_t */\n\n\n#ifdef __int_least8_t\n#define INT8_C(v) __INT8_C(v)\n#define UINT8_C(v) __UINT8_C(v)\n#endif /* __int_least8_t */\n\n\n/* C99 7.18.2.1 Limits of exact-width integer types.\n * C99 7.18.2.2 Limits of minimum-width integer types.\n * C99 7.18.2.3 Limits of fastest minimum-width integer types.\n *\n * The presence of limit macros are completely optional in C99.  This\n * implementation defines limits for all of the types (exact- and\n * minimum-width) that it defines above, using the limits of the minimum-width\n * type for any types that do not have exact-width representations.\n *\n * As in the type definitions, this section takes an approach of\n * successive-shrinking to determine which limits to use for the standard (8,\n * 16, 32, 64) bit widths when they don't have exact representations. It is\n * therefore important that the definitions be kept in order of decending\n * widths.\n *\n * Note that C++ should not check __STDC_LIMIT_MACROS here, contrary to the\n * claims of the C standard (see C++ 18.3.1p2, [cstdint.syn]).\n */\n\n#ifdef __INT64_TYPE__\n# define INT64_MAX           INT64_C( 9223372036854775807)\n# define INT64_MIN         (-INT64_C( 9223372036854775807)-1)\n# define UINT64_MAX         UINT64_C(18446744073709551615)\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT64_WIDTH         64\n# define INT64_WIDTH          UINT64_WIDTH\n\n# define __UINT_LEAST64_WIDTH UINT64_WIDTH\n# undef __UINT_LEAST32_WIDTH\n# define __UINT_LEAST32_WIDTH UINT64_WIDTH\n# undef __UINT_LEAST16_WIDTH\n# define __UINT_LEAST16_WIDTH UINT64_WIDTH\n# undef __UINT_LEAST8_MAX\n# define __UINT_LEAST8_MAX UINT64_MAX\n#endif /* __STDC_VERSION__ */\n\n# define __INT_LEAST64_MIN   INT64_MIN\n# define __INT_LEAST64_MAX   INT64_MAX\n# define __UINT_LEAST64_MAX UINT64_MAX\n# undef __INT_LEAST32_MIN\n# define __INT_LEAST32_MIN   INT64_MIN\n# undef __INT_LEAST32_MAX\n# define __INT_LEAST32_MAX   INT64_MAX\n# undef __UINT_LEAST32_MAX\n# define __UINT_LEAST32_MAX UINT64_MAX\n# undef __INT_LEAST16_MIN\n# define __INT_LEAST16_MIN   INT64_MIN\n# undef __INT_LEAST16_MAX\n# define __INT_LEAST16_MAX   INT64_MAX\n# undef __UINT_LEAST16_MAX\n# define __UINT_LEAST16_MAX UINT64_MAX\n# undef __INT_LEAST8_MIN\n# define __INT_LEAST8_MIN    INT64_MIN\n# undef __INT_LEAST8_MAX\n# define __INT_LEAST8_MAX    INT64_MAX\n# undef __UINT_LEAST8_MAX\n# define __UINT_LEAST8_MAX  UINT64_MAX\n#endif /* __INT64_TYPE__ */\n\n#ifdef __INT_LEAST64_MIN\n# define INT_LEAST64_MIN   __INT_LEAST64_MIN\n# define INT_LEAST64_MAX   __INT_LEAST64_MAX\n# define UINT_LEAST64_MAX __UINT_LEAST64_MAX\n# define INT_FAST64_MIN    __INT_LEAST64_MIN\n# define INT_FAST64_MAX    __INT_LEAST64_MAX\n# define UINT_FAST64_MAX  __UINT_LEAST64_MAX\n\n#if defined(__STDC_VERSION__) &&  __STDC_VERSION__ >= 202311L\n# define UINT_LEAST64_WIDTH __UINT_LEAST64_WIDTH\n# define INT_LEAST64_WIDTH  UINT_LEAST64_WIDTH\n# define UINT_FAST64_WIDTH  __UINT_LEAST64_WIDTH\n# define INT_FAST64_WIDTH   UINT_FAST64_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT_LEAST64_MIN */\n\n\n#ifdef __INT56_TYPE__\n# define INT56_MAX           INT56_C(36028797018963967)\n# define INT56_MIN         (-INT56_C(36028797018963967)-1)\n# define UINT56_MAX         UINT56_C(72057594037927935)\n# define INT_LEAST56_MIN     INT56_MIN\n# define INT_LEAST56_MAX     INT56_MAX\n# define UINT_LEAST56_MAX   UINT56_MAX\n# define INT_FAST56_MIN      INT56_MIN\n# define INT_FAST56_MAX      INT56_MAX\n# define UINT_FAST56_MAX    UINT56_MAX\n\n# undef __INT_LEAST32_MIN\n# define __INT_LEAST32_MIN   INT56_MIN\n# undef __INT_LEAST32_MAX\n# define __INT_LEAST32_MAX   INT56_MAX\n# undef __UINT_LEAST32_MAX\n# define __UINT_LEAST32_MAX UINT56_MAX\n# undef __INT_LEAST16_MIN\n# define __INT_LEAST16_MIN   INT56_MIN\n# undef __INT_LEAST16_MAX\n# define __INT_LEAST16_MAX   INT56_MAX\n# undef __UINT_LEAST16_MAX\n# define __UINT_LEAST16_MAX UINT56_MAX\n# undef __INT_LEAST8_MIN\n# define __INT_LEAST8_MIN    INT56_MIN\n# undef __INT_LEAST8_MAX\n# define __INT_LEAST8_MAX    INT56_MAX\n# undef __UINT_LEAST8_MAX\n# define __UINT_LEAST8_MAX  UINT56_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT56_WIDTH         56\n# define INT56_WIDTH          UINT56_WIDTH\n# define UINT_LEAST56_WIDTH   UINT56_WIDTH\n# define INT_LEAST56_WIDTH    UINT_LEAST56_WIDTH\n# define UINT_FAST56_WIDTH    UINT56_WIDTH\n# define INT_FAST56_WIDTH     UINT_FAST56_WIDTH\n# undef __UINT_LEAST32_WIDTH\n# define __UINT_LEAST32_WIDTH UINT56_WIDTH\n# undef __UINT_LEAST16_WIDTH\n# define __UINT_LEAST16_WIDTH UINT56_WIDTH\n# undef __UINT_LEAST8_WIDTH\n# define __UINT_LEAST8_WIDTH  UINT56_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT56_TYPE__ */\n\n\n#ifdef __INT48_TYPE__\n# define INT48_MAX           INT48_C(140737488355327)\n# define INT48_MIN         (-INT48_C(140737488355327)-1)\n# define UINT48_MAX         UINT48_C(281474976710655)\n# define INT_LEAST48_MIN     INT48_MIN\n# define INT_LEAST48_MAX     INT48_MAX\n# define UINT_LEAST48_MAX   UINT48_MAX\n# define INT_FAST48_MIN      INT48_MIN\n# define INT_FAST48_MAX      INT48_MAX\n# define UINT_FAST48_MAX    UINT48_MAX\n\n# undef __INT_LEAST32_MIN\n# define __INT_LEAST32_MIN   INT48_MIN\n# undef __INT_LEAST32_MAX\n# define __INT_LEAST32_MAX   INT48_MAX\n# undef __UINT_LEAST32_MAX\n# define __UINT_LEAST32_MAX UINT48_MAX\n# undef __INT_LEAST16_MIN\n# define __INT_LEAST16_MIN   INT48_MIN\n# undef __INT_LEAST16_MAX\n# define __INT_LEAST16_MAX   INT48_MAX\n# undef __UINT_LEAST16_MAX\n# define __UINT_LEAST16_MAX UINT48_MAX\n# undef __INT_LEAST8_MIN\n# define __INT_LEAST8_MIN    INT48_MIN\n# undef __INT_LEAST8_MAX\n# define __INT_LEAST8_MAX    INT48_MAX\n# undef __UINT_LEAST8_MAX\n# define __UINT_LEAST8_MAX  UINT48_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n#define UINT48_WIDTH         48\n#define INT48_WIDTH          UINT48_WIDTH\n#define UINT_LEAST48_WIDTH   UINT48_WIDTH\n#define INT_LEAST48_WIDTH    UINT_LEAST48_WIDTH\n#define UINT_FAST48_WIDTH    UINT48_WIDTH\n#define INT_FAST48_WIDTH     UINT_FAST48_WIDTH\n#undef __UINT_LEAST32_WIDTH\n#define __UINT_LEAST32_WIDTH UINT48_WIDTH\n# undef __UINT_LEAST16_WIDTH\n#define __UINT_LEAST16_WIDTH UINT48_WIDTH\n# undef __UINT_LEAST8_WIDTH\n#define __UINT_LEAST8_WIDTH  UINT48_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT48_TYPE__ */\n\n\n#ifdef __INT40_TYPE__\n# define INT40_MAX           INT40_C(549755813887)\n# define INT40_MIN         (-INT40_C(549755813887)-1)\n# define UINT40_MAX         UINT40_C(1099511627775)\n# define INT_LEAST40_MIN     INT40_MIN\n# define INT_LEAST40_MAX     INT40_MAX\n# define UINT_LEAST40_MAX   UINT40_MAX\n# define INT_FAST40_MIN      INT40_MIN\n# define INT_FAST40_MAX      INT40_MAX\n# define UINT_FAST40_MAX    UINT40_MAX\n\n# undef __INT_LEAST32_MIN\n# define __INT_LEAST32_MIN   INT40_MIN\n# undef __INT_LEAST32_MAX\n# define __INT_LEAST32_MAX   INT40_MAX\n# undef __UINT_LEAST32_MAX\n# define __UINT_LEAST32_MAX UINT40_MAX\n# undef __INT_LEAST16_MIN\n# define __INT_LEAST16_MIN   INT40_MIN\n# undef __INT_LEAST16_MAX\n# define __INT_LEAST16_MAX   INT40_MAX\n# undef __UINT_LEAST16_MAX\n# define __UINT_LEAST16_MAX UINT40_MAX\n# undef __INT_LEAST8_MIN\n# define __INT_LEAST8_MIN    INT40_MIN\n# undef __INT_LEAST8_MAX\n# define __INT_LEAST8_MAX    INT40_MAX\n# undef __UINT_LEAST8_MAX\n# define __UINT_LEAST8_MAX  UINT40_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT40_WIDTH         40\n# define INT40_WIDTH          UINT40_WIDTH\n# define UINT_LEAST40_WIDTH   UINT40_WIDTH\n# define INT_LEAST40_WIDTH    UINT_LEAST40_WIDTH\n# define UINT_FAST40_WIDTH    UINT40_WIDTH\n# define INT_FAST40_WIDTH     UINT_FAST40_WIDTH\n# undef __UINT_LEAST32_WIDTH\n# define __UINT_LEAST32_WIDTH UINT40_WIDTH\n# undef __UINT_LEAST16_WIDTH\n# define __UINT_LEAST16_WIDTH UINT40_WIDTH\n# undef __UINT_LEAST8_WIDTH\n# define __UINT_LEAST8_WIDTH  UINT40_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT40_TYPE__ */\n\n\n#ifdef __INT32_TYPE__\n# define INT32_MAX           INT32_C(2147483647)\n# define INT32_MIN         (-INT32_C(2147483647)-1)\n# define UINT32_MAX         UINT32_C(4294967295)\n\n# undef __INT_LEAST32_MIN\n# define __INT_LEAST32_MIN   INT32_MIN\n# undef __INT_LEAST32_MAX\n# define __INT_LEAST32_MAX   INT32_MAX\n# undef __UINT_LEAST32_MAX\n# define __UINT_LEAST32_MAX UINT32_MAX\n# undef __INT_LEAST16_MIN\n# define __INT_LEAST16_MIN   INT32_MIN\n# undef __INT_LEAST16_MAX\n# define __INT_LEAST16_MAX   INT32_MAX\n# undef __UINT_LEAST16_MAX\n# define __UINT_LEAST16_MAX UINT32_MAX\n# undef __INT_LEAST8_MIN\n# define __INT_LEAST8_MIN    INT32_MIN\n# undef __INT_LEAST8_MAX\n# define __INT_LEAST8_MAX    INT32_MAX\n# undef __UINT_LEAST8_MAX\n# define __UINT_LEAST8_MAX  UINT32_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT32_WIDTH         32\n# define INT32_WIDTH          UINT32_WIDTH\n# undef __UINT_LEAST32_WIDTH\n# define __UINT_LEAST32_WIDTH UINT32_WIDTH\n# undef __UINT_LEAST16_WIDTH\n# define __UINT_LEAST16_WIDTH UINT32_WIDTH\n# undef __UINT_LEAST8_WIDTH\n# define __UINT_LEAST8_WIDTH  UINT32_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT32_TYPE__ */\n\n#ifdef __INT_LEAST32_MIN\n# define INT_LEAST32_MIN   __INT_LEAST32_MIN\n# define INT_LEAST32_MAX   __INT_LEAST32_MAX\n# define UINT_LEAST32_MAX __UINT_LEAST32_MAX\n# define INT_FAST32_MIN    __INT_LEAST32_MIN\n# define INT_FAST32_MAX    __INT_LEAST32_MAX\n# define UINT_FAST32_MAX  __UINT_LEAST32_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT_LEAST32_WIDTH __UINT_LEAST32_WIDTH\n# define INT_LEAST32_WIDTH  UINT_LEAST32_WIDTH\n# define UINT_FAST32_WIDTH  __UINT_LEAST32_WIDTH\n# define INT_FAST32_WIDTH   UINT_FAST32_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT_LEAST32_MIN */\n\n\n#ifdef __INT24_TYPE__\n# define INT24_MAX           INT24_C(8388607)\n# define INT24_MIN         (-INT24_C(8388607)-1)\n# define UINT24_MAX         UINT24_C(16777215)\n# define INT_LEAST24_MIN     INT24_MIN\n# define INT_LEAST24_MAX     INT24_MAX\n# define UINT_LEAST24_MAX   UINT24_MAX\n# define INT_FAST24_MIN      INT24_MIN\n# define INT_FAST24_MAX      INT24_MAX\n# define UINT_FAST24_MAX    UINT24_MAX\n\n# undef __INT_LEAST16_MIN\n# define __INT_LEAST16_MIN   INT24_MIN\n# undef __INT_LEAST16_MAX\n# define __INT_LEAST16_MAX   INT24_MAX\n# undef __UINT_LEAST16_MAX\n# define __UINT_LEAST16_MAX UINT24_MAX\n# undef __INT_LEAST8_MIN\n# define __INT_LEAST8_MIN    INT24_MIN\n# undef __INT_LEAST8_MAX\n# define __INT_LEAST8_MAX    INT24_MAX\n# undef __UINT_LEAST8_MAX\n# define __UINT_LEAST8_MAX  UINT24_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT24_WIDTH         24\n# define INT24_WIDTH          UINT24_WIDTH\n# define UINT_LEAST24_WIDTH   UINT24_WIDTH\n# define INT_LEAST24_WIDTH    UINT_LEAST24_WIDTH\n# define UINT_FAST24_WIDTH    UINT24_WIDTH\n# define INT_FAST24_WIDTH     UINT_FAST24_WIDTH\n# undef __UINT_LEAST16_WIDTH\n# define __UINT_LEAST16_WIDTH UINT24_WIDTH\n# undef __UINT_LEAST8_WIDTH\n# define __UINT_LEAST8_WIDTH  UINT24_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT24_TYPE__ */\n\n\n#ifdef __INT16_TYPE__\n#define INT16_MAX            INT16_C(32767)\n#define INT16_MIN          (-INT16_C(32767)-1)\n#define UINT16_MAX          UINT16_C(65535)\n\n# undef __INT_LEAST16_MIN\n# define __INT_LEAST16_MIN   INT16_MIN\n# undef __INT_LEAST16_MAX\n# define __INT_LEAST16_MAX   INT16_MAX\n# undef __UINT_LEAST16_MAX\n# define __UINT_LEAST16_MAX UINT16_MAX\n# undef __INT_LEAST8_MIN\n# define __INT_LEAST8_MIN    INT16_MIN\n# undef __INT_LEAST8_MAX\n# define __INT_LEAST8_MAX    INT16_MAX\n# undef __UINT_LEAST8_MAX\n# define __UINT_LEAST8_MAX  UINT16_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT16_WIDTH         16\n# define INT16_WIDTH          UINT16_WIDTH\n# undef __UINT_LEAST16_WIDTH\n# define __UINT_LEAST16_WIDTH UINT16_WIDTH\n# undef __UINT_LEAST8_WIDTH\n# define __UINT_LEAST8_WIDTH  UINT16_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT16_TYPE__ */\n\n#ifdef __INT_LEAST16_MIN\n# define INT_LEAST16_MIN   __INT_LEAST16_MIN\n# define INT_LEAST16_MAX   __INT_LEAST16_MAX\n# define UINT_LEAST16_MAX __UINT_LEAST16_MAX\n# define INT_FAST16_MIN    __INT_LEAST16_MIN\n# define INT_FAST16_MAX    __INT_LEAST16_MAX\n# define UINT_FAST16_MAX  __UINT_LEAST16_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT_LEAST16_WIDTH __UINT_LEAST16_WIDTH\n# define INT_LEAST16_WIDTH  UINT_LEAST16_WIDTH\n# define UINT_FAST16_WIDTH  __UINT_LEAST16_WIDTH\n# define INT_FAST16_WIDTH   UINT_FAST16_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT_LEAST16_MIN */\n\n\n#ifdef __INT8_TYPE__\n# define INT8_MAX            INT8_C(127)\n# define INT8_MIN          (-INT8_C(127)-1)\n# define UINT8_MAX          UINT8_C(255)\n\n# undef __INT_LEAST8_MIN\n# define __INT_LEAST8_MIN    INT8_MIN\n# undef __INT_LEAST8_MAX\n# define __INT_LEAST8_MAX    INT8_MAX\n# undef __UINT_LEAST8_MAX\n# define __UINT_LEAST8_MAX  UINT8_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT8_WIDTH         8\n# define INT8_WIDTH          UINT8_WIDTH\n# undef __UINT_LEAST8_WIDTH\n# define __UINT_LEAST8_WIDTH UINT8_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT8_TYPE__ */\n\n#ifdef __INT_LEAST8_MIN\n# define INT_LEAST8_MIN   __INT_LEAST8_MIN\n# define INT_LEAST8_MAX   __INT_LEAST8_MAX\n# define UINT_LEAST8_MAX __UINT_LEAST8_MAX\n# define INT_FAST8_MIN    __INT_LEAST8_MIN\n# define INT_FAST8_MAX    __INT_LEAST8_MAX\n# define UINT_FAST8_MAX  __UINT_LEAST8_MAX\n\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n# define UINT_LEAST8_WIDTH __UINT_LEAST8_WIDTH\n# define INT_LEAST8_WIDTH  UINT_LEAST8_WIDTH\n# define UINT_FAST8_WIDTH  __UINT_LEAST8_WIDTH\n# define INT_FAST8_WIDTH   UINT_FAST8_WIDTH\n#endif /* __STDC_VERSION__ */\n#endif /* __INT_LEAST8_MIN */\n\n/* Some utility macros */\n#define  __INTN_MIN(n)  __stdint_join3( INT, n, _MIN)\n#define  __INTN_MAX(n)  __stdint_join3( INT, n, _MAX)\n#define __UINTN_MAX(n)  __stdint_join3(UINT, n, _MAX)\n#define  __INTN_C(n, v) __stdint_join3( INT, n, _C(v))\n#define __UINTN_C(n, v) __stdint_join3(UINT, n, _C(v))\n\n/* C99 7.18.2.4 Limits of integer types capable of holding object pointers. */\n/* C99 7.18.3 Limits of other integer types. */\n\n#define  INTPTR_MIN  (-__INTPTR_MAX__-1)\n#define  INTPTR_MAX    __INTPTR_MAX__\n#define UINTPTR_MAX   __UINTPTR_MAX__\n#define PTRDIFF_MIN (-__PTRDIFF_MAX__-1)\n#define PTRDIFF_MAX   __PTRDIFF_MAX__\n#define    SIZE_MAX      __SIZE_MAX__\n\n/* C23 7.22.2.4 Width of integer types capable of holding object pointers. */\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n/* NB: The C standard requires that these be the same value, but the compiler\n   exposes separate internal width macros. */\n#define INTPTR_WIDTH  __INTPTR_WIDTH__\n#define UINTPTR_WIDTH __UINTPTR_WIDTH__\n#endif\n\n/* ISO9899:2011 7.20 (C11 Annex K): Define RSIZE_MAX if __STDC_WANT_LIB_EXT1__\n * is enabled. */\n#if defined(__STDC_WANT_LIB_EXT1__) && __STDC_WANT_LIB_EXT1__ >= 1\n#define   RSIZE_MAX            (SIZE_MAX >> 1)\n#endif\n\n/* C99 7.18.2.5 Limits of greatest-width integer types. */\n#define  INTMAX_MIN (-__INTMAX_MAX__-1)\n#define  INTMAX_MAX   __INTMAX_MAX__\n#define UINTMAX_MAX  __UINTMAX_MAX__\n\n/* C23 7.22.2.5 Width of greatest-width integer types. */\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n/* NB: The C standard requires that these be the same value, but the compiler\n   exposes separate internal width macros. */\n#define INTMAX_WIDTH __INTMAX_WIDTH__\n#define UINTMAX_WIDTH __UINTMAX_WIDTH__\n#endif\n\n/* C99 7.18.3 Limits of other integer types. */\n#define SIG_ATOMIC_MIN __INTN_MIN(__SIG_ATOMIC_WIDTH__)\n#define SIG_ATOMIC_MAX __INTN_MAX(__SIG_ATOMIC_WIDTH__)\n#ifdef __WINT_UNSIGNED__\n# define WINT_MIN       __UINTN_C(__WINT_WIDTH__, 0)\n# define WINT_MAX       __UINTN_MAX(__WINT_WIDTH__)\n#else\n# define WINT_MIN       __INTN_MIN(__WINT_WIDTH__)\n# define WINT_MAX       __INTN_MAX(__WINT_WIDTH__)\n#endif\n\n#ifndef WCHAR_MAX\n# define WCHAR_MAX __WCHAR_MAX__\n#endif\n#ifndef WCHAR_MIN\n# if __WCHAR_MAX__ == __INTN_MAX(__WCHAR_WIDTH__)\n#  define WCHAR_MIN __INTN_MIN(__WCHAR_WIDTH__)\n# else\n#  define WCHAR_MIN __UINTN_C(__WCHAR_WIDTH__, 0)\n# endif\n#endif\n\n/* 7.18.4.2 Macros for greatest-width integer constants. */\n#define  INTMAX_C(v) __INTMAX_C(v)\n#define UINTMAX_C(v) __UINTMAX_C(v)\n\n/* C23 7.22.3.x Width of other integer types. */\n#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L\n#define PTRDIFF_WIDTH    __PTRDIFF_WIDTH__\n#define SIG_ATOMIC_WIDTH __SIG_ATOMIC_WIDTH__\n#define SIZE_WIDTH       __SIZE_WIDTH__\n#define WCHAR_WIDTH      __WCHAR_WIDTH__\n#define WINT_WIDTH       __WINT_WIDTH__\n#endif\n\n#endif /* __STDC_HOSTED__ */\n#endif /* __MVS__ */\n#endif /* __CLANG_STDINT_H */\n",
  "stdnoreturn.h": "/*===---- stdnoreturn.h - Standard header for noreturn macro ---------------===\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n *===-----------------------------------------------------------------------===\n */\n\n#ifndef __STDNORETURN_H\n#define __STDNORETURN_H\n\n#if defined(__MVS__) && __has_include_next(<stdnoreturn.h>)\n#include_next <stdnoreturn.h>\n#else\n\n#define noreturn _Noreturn\n#define __noreturn_is_defined 1\n\n#endif /* __MVS__ */\n\n#if (defined(__STDC_VERSION__) && __STDC_VERSION__ > 201710L) &&               \\\n    !defined(_CLANG_DISABLE_CRT_DEPRECATION_WARNINGS)\n/* The noreturn macro is deprecated in C23. We do not mark it as such because\n   including the header file in C23 is also deprecated and we do not want to\n   issue a confusing diagnostic for code which includes <stdnoreturn.h>\n   followed by code that writes [[noreturn]]. The issue with such code is not\n   with the attribute, or the use of 'noreturn', but the inclusion of the\n   header. */\n/* FIXME: We should be issuing a deprecation warning here, but cannot yet due\n * to system headers which include this header file unconditionally.\n */\n#endif\n\n#endif /* __STDNORETURN_H */\n",
  "tgmath.h": "/*===---- tgmath.h - Standard header for type generic math ----------------===*\\\n *\n * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n * See https://llvm.org/LICENSE.txt for license information.\n * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n *\n\\*===----------------------------------------------------------------------===*/\n\n#ifndef __CLANG_TGMATH_H\n#define __CLANG_TGMATH_H\n\n/* C99 7.22 Type-generic math <tgmath.h>. */\n#include <math.h>\n\n/*\n * Allow additional definitions and implementation-defined values on Apple\n * platforms. This is done after #include <math.h> to avoid depcycle conflicts\n * between libcxx and darwin in C++ modules builds.\n */\n#if defined(__APPLE__) && __STDC_HOSTED__ && __has_include_next(<tgmath.h>)\n#  include_next <tgmath.h>\n#else\n\n/* C++ handles type genericity with overloading in math.h. */\n#ifndef __cplusplus\n#include <complex.h>\n\n#define _TG_ATTRSp __attribute__((__overloadable__))\n#define _TG_ATTRS __attribute__((__overloadable__, __always_inline__))\n\n// promotion\n\ntypedef void _Argument_type_is_not_arithmetic;\nstatic _Argument_type_is_not_arithmetic __tg_promote(...)\n  __attribute__((__unavailable__,__overloadable__));\nstatic double               _TG_ATTRSp __tg_promote(int);\nstatic double               _TG_ATTRSp __tg_promote(unsigned int);\nstatic double               _TG_ATTRSp __tg_promote(long);\nstatic double               _TG_ATTRSp __tg_promote(unsigned long);\nstatic double               _TG_ATTRSp __tg_promote(long long);\nstatic double               _TG_ATTRSp __tg_promote(unsigned long long);\nstatic float                _TG_ATTRSp __tg_promote(float);\nstatic double               _TG_ATTRSp __tg_promote(double);\nstatic long double          _TG_ATTRSp __tg_promote(long double);\nstatic float _Complex       _TG_ATTRSp __tg_promote(float _Complex);\nstatic double _Complex      _TG_ATTRSp __tg_promote(double _Complex);\nstatic long double _Complex _TG_ATTRSp __tg_promote(long double _Complex);\n\n#define __tg_promote1(__x)           (__typeof__(__tg_promote(__x)))\n#define __tg_promote2(__x, __y)      (__typeof__(__tg_promote(__x) + \\\n                                                 __tg_promote(__y)))\n#define __tg_promote3(__x, __y, __z) (__typeof__(__tg_promote(__x) + \\\n                                                 __tg_promote(__y) + \\\n                                                 __tg_promote(__z)))\n\n// acos\n\nstatic float\n    _TG_ATTRS\n    __tg_acos(float __x) {return acosf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_acos(double __x) {return acos(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_acos(long double __x) {return acosl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_acos(float _Complex __x) {return cacosf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_acos(double _Complex __x) {return cacos(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_acos(long double _Complex __x) {return cacosl(__x);}\n\n#undef acos\n#define acos(__x) __tg_acos(__tg_promote1((__x))(__x))\n\n// asin\n\nstatic float\n    _TG_ATTRS\n    __tg_asin(float __x) {return asinf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_asin(double __x) {return asin(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_asin(long double __x) {return asinl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_asin(float _Complex __x) {return casinf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_asin(double _Complex __x) {return casin(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_asin(long double _Complex __x) {return casinl(__x);}\n\n#undef asin\n#define asin(__x) __tg_asin(__tg_promote1((__x))(__x))\n\n// atan\n\nstatic float\n    _TG_ATTRS\n    __tg_atan(float __x) {return atanf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_atan(double __x) {return atan(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_atan(long double __x) {return atanl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_atan(float _Complex __x) {return catanf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_atan(double _Complex __x) {return catan(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_atan(long double _Complex __x) {return catanl(__x);}\n\n#undef atan\n#define atan(__x) __tg_atan(__tg_promote1((__x))(__x))\n\n// acosh\n\nstatic float\n    _TG_ATTRS\n    __tg_acosh(float __x) {return acoshf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_acosh(double __x) {return acosh(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_acosh(long double __x) {return acoshl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_acosh(float _Complex __x) {return cacoshf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_acosh(double _Complex __x) {return cacosh(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_acosh(long double _Complex __x) {return cacoshl(__x);}\n\n#undef acosh\n#define acosh(__x) __tg_acosh(__tg_promote1((__x))(__x))\n\n// asinh\n\nstatic float\n    _TG_ATTRS\n    __tg_asinh(float __x) {return asinhf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_asinh(double __x) {return asinh(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_asinh(long double __x) {return asinhl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_asinh(float _Complex __x) {return casinhf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_asinh(double _Complex __x) {return casinh(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_asinh(long double _Complex __x) {return casinhl(__x);}\n\n#undef asinh\n#define asinh(__x) __tg_asinh(__tg_promote1((__x))(__x))\n\n// atanh\n\nstatic float\n    _TG_ATTRS\n    __tg_atanh(float __x) {return atanhf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_atanh(double __x) {return atanh(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_atanh(long double __x) {return atanhl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_atanh(float _Complex __x) {return catanhf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_atanh(double _Complex __x) {return catanh(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_atanh(long double _Complex __x) {return catanhl(__x);}\n\n#undef atanh\n#define atanh(__x) __tg_atanh(__tg_promote1((__x))(__x))\n\n// cos\n\nstatic float\n    _TG_ATTRS\n    __tg_cos(float __x) {return cosf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_cos(double __x) {return cos(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_cos(long double __x) {return cosl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_cos(float _Complex __x) {return ccosf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_cos(double _Complex __x) {return ccos(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_cos(long double _Complex __x) {return ccosl(__x);}\n\n#undef cos\n#define cos(__x) __tg_cos(__tg_promote1((__x))(__x))\n\n// sin\n\nstatic float\n    _TG_ATTRS\n    __tg_sin(float __x) {return sinf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_sin(double __x) {return sin(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_sin(long double __x) {return sinl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_sin(float _Complex __x) {return csinf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_sin(double _Complex __x) {return csin(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_sin(long double _Complex __x) {return csinl(__x);}\n\n#undef sin\n#define sin(__x) __tg_sin(__tg_promote1((__x))(__x))\n\n// tan\n\nstatic float\n    _TG_ATTRS\n    __tg_tan(float __x) {return tanf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_tan(double __x) {return tan(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_tan(long double __x) {return tanl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_tan(float _Complex __x) {return ctanf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_tan(double _Complex __x) {return ctan(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_tan(long double _Complex __x) {return ctanl(__x);}\n\n#undef tan\n#define tan(__x) __tg_tan(__tg_promote1((__x))(__x))\n\n// cosh\n\nstatic float\n    _TG_ATTRS\n    __tg_cosh(float __x) {return coshf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_cosh(double __x) {return cosh(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_cosh(long double __x) {return coshl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_cosh(float _Complex __x) {return ccoshf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_cosh(double _Complex __x) {return ccosh(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_cosh(long double _Complex __x) {return ccoshl(__x);}\n\n#undef cosh\n#define cosh(__x) __tg_cosh(__tg_promote1((__x))(__x))\n\n// sinh\n\nstatic float\n    _TG_ATTRS\n    __tg_sinh(float __x) {return sinhf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_sinh(double __x) {return sinh(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_sinh(long double __x) {return sinhl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_sinh(float _Complex __x) {return csinhf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_sinh(double _Complex __x) {return csinh(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_sinh(long double _Complex __x) {return csinhl(__x);}\n\n#undef sinh\n#define sinh(__x) __tg_sinh(__tg_promote1((__x))(__x))\n\n// tanh\n\nstatic float\n    _TG_ATTRS\n    __tg_tanh(float __x) {return tanhf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_tanh(double __x) {return tanh(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_tanh(long double __x) {return tanhl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_tanh(float _Complex __x) {return ctanhf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_tanh(double _Complex __x) {return ctanh(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_tanh(long double _Complex __x) {return ctanhl(__x);}\n\n#undef tanh\n#define tanh(__x) __tg_tanh(__tg_promote1((__x))(__x))\n\n// exp\n\nstatic float\n    _TG_ATTRS\n    __tg_exp(float __x) {return expf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_exp(double __x) {return exp(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_exp(long double __x) {return expl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_exp(float _Complex __x) {return cexpf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_exp(double _Complex __x) {return cexp(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_exp(long double _Complex __x) {return cexpl(__x);}\n\n#undef exp\n#define exp(__x) __tg_exp(__tg_promote1((__x))(__x))\n\n// log\n\nstatic float\n    _TG_ATTRS\n    __tg_log(float __x) {return logf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_log(double __x) {return log(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_log(long double __x) {return logl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_log(float _Complex __x) {return clogf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_log(double _Complex __x) {return clog(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_log(long double _Complex __x) {return clogl(__x);}\n\n#undef log\n#define log(__x) __tg_log(__tg_promote1((__x))(__x))\n\n// pow\n\nstatic float\n    _TG_ATTRS\n    __tg_pow(float __x, float __y) {return powf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_pow(double __x, double __y) {return pow(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_pow(long double __x, long double __y) {return powl(__x, __y);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_pow(float _Complex __x, float _Complex __y) {return cpowf(__x, __y);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_pow(double _Complex __x, double _Complex __y) {return cpow(__x, __y);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_pow(long double _Complex __x, long double _Complex __y)\n    {return cpowl(__x, __y);}\n\n#undef pow\n#define pow(__x, __y) __tg_pow(__tg_promote2((__x), (__y))(__x), \\\n                               __tg_promote2((__x), (__y))(__y))\n\n// sqrt\n\nstatic float\n    _TG_ATTRS\n    __tg_sqrt(float __x) {return sqrtf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_sqrt(double __x) {return sqrt(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_sqrt(long double __x) {return sqrtl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_sqrt(float _Complex __x) {return csqrtf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_sqrt(double _Complex __x) {return csqrt(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_sqrt(long double _Complex __x) {return csqrtl(__x);}\n\n#undef sqrt\n#define sqrt(__x) __tg_sqrt(__tg_promote1((__x))(__x))\n\n// fabs\n\nstatic float\n    _TG_ATTRS\n    __tg_fabs(float __x) {return fabsf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_fabs(double __x) {return fabs(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_fabs(long double __x) {return fabsl(__x);}\n\nstatic float\n    _TG_ATTRS\n    __tg_fabs(float _Complex __x) {return cabsf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_fabs(double _Complex __x) {return cabs(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_fabs(long double _Complex __x) {return cabsl(__x);}\n\n#undef fabs\n#define fabs(__x) __tg_fabs(__tg_promote1((__x))(__x))\n\n// atan2\n\nstatic float\n    _TG_ATTRS\n    __tg_atan2(float __x, float __y) {return atan2f(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_atan2(double __x, double __y) {return atan2(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_atan2(long double __x, long double __y) {return atan2l(__x, __y);}\n\n#undef atan2\n#define atan2(__x, __y) __tg_atan2(__tg_promote2((__x), (__y))(__x), \\\n                                   __tg_promote2((__x), (__y))(__y))\n\n// cbrt\n\nstatic float\n    _TG_ATTRS\n    __tg_cbrt(float __x) {return cbrtf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_cbrt(double __x) {return cbrt(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_cbrt(long double __x) {return cbrtl(__x);}\n\n#undef cbrt\n#define cbrt(__x) __tg_cbrt(__tg_promote1((__x))(__x))\n\n// ceil\n\nstatic float\n    _TG_ATTRS\n    __tg_ceil(float __x) {return ceilf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_ceil(double __x) {return ceil(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_ceil(long double __x) {return ceill(__x);}\n\n#undef ceil\n#define ceil(__x) __tg_ceil(__tg_promote1((__x))(__x))\n\n// copysign\n\nstatic float\n    _TG_ATTRS\n    __tg_copysign(float __x, float __y) {return copysignf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_copysign(double __x, double __y) {return copysign(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_copysign(long double __x, long double __y) {return copysignl(__x, __y);}\n\n#undef copysign\n#define copysign(__x, __y) __tg_copysign(__tg_promote2((__x), (__y))(__x), \\\n                                         __tg_promote2((__x), (__y))(__y))\n\n// erf\n\nstatic float\n    _TG_ATTRS\n    __tg_erf(float __x) {return erff(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_erf(double __x) {return erf(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_erf(long double __x) {return erfl(__x);}\n\n#undef erf\n#define erf(__x) __tg_erf(__tg_promote1((__x))(__x))\n\n// erfc\n\nstatic float\n    _TG_ATTRS\n    __tg_erfc(float __x) {return erfcf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_erfc(double __x) {return erfc(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_erfc(long double __x) {return erfcl(__x);}\n\n#undef erfc\n#define erfc(__x) __tg_erfc(__tg_promote1((__x))(__x))\n\n// exp2\n\nstatic float\n    _TG_ATTRS\n    __tg_exp2(float __x) {return exp2f(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_exp2(double __x) {return exp2(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_exp2(long double __x) {return exp2l(__x);}\n\n#undef exp2\n#define exp2(__x) __tg_exp2(__tg_promote1((__x))(__x))\n\n// expm1\n\nstatic float\n    _TG_ATTRS\n    __tg_expm1(float __x) {return expm1f(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_expm1(double __x) {return expm1(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_expm1(long double __x) {return expm1l(__x);}\n\n#undef expm1\n#define expm1(__x) __tg_expm1(__tg_promote1((__x))(__x))\n\n// fdim\n\nstatic float\n    _TG_ATTRS\n    __tg_fdim(float __x, float __y) {return fdimf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_fdim(double __x, double __y) {return fdim(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_fdim(long double __x, long double __y) {return fdiml(__x, __y);}\n\n#undef fdim\n#define fdim(__x, __y) __tg_fdim(__tg_promote2((__x), (__y))(__x), \\\n                                 __tg_promote2((__x), (__y))(__y))\n\n// floor\n\nstatic float\n    _TG_ATTRS\n    __tg_floor(float __x) {return floorf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_floor(double __x) {return floor(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_floor(long double __x) {return floorl(__x);}\n\n#undef floor\n#define floor(__x) __tg_floor(__tg_promote1((__x))(__x))\n\n// fma\n\nstatic float\n    _TG_ATTRS\n    __tg_fma(float __x, float __y, float __z)\n    {return fmaf(__x, __y, __z);}\n\nstatic double\n    _TG_ATTRS\n    __tg_fma(double __x, double __y, double __z)\n    {return fma(__x, __y, __z);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_fma(long double __x,long double __y, long double __z)\n    {return fmal(__x, __y, __z);}\n\n#undef fma\n#define fma(__x, __y, __z)                                \\\n        __tg_fma(__tg_promote3((__x), (__y), (__z))(__x), \\\n                 __tg_promote3((__x), (__y), (__z))(__y), \\\n                 __tg_promote3((__x), (__y), (__z))(__z))\n\n// fmax\n\nstatic float\n    _TG_ATTRS\n    __tg_fmax(float __x, float __y) {return fmaxf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_fmax(double __x, double __y) {return fmax(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_fmax(long double __x, long double __y) {return fmaxl(__x, __y);}\n\n#undef fmax\n#define fmax(__x, __y) __tg_fmax(__tg_promote2((__x), (__y))(__x), \\\n                                 __tg_promote2((__x), (__y))(__y))\n\n// fmin\n\nstatic float\n    _TG_ATTRS\n    __tg_fmin(float __x, float __y) {return fminf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_fmin(double __x, double __y) {return fmin(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_fmin(long double __x, long double __y) {return fminl(__x, __y);}\n\n#undef fmin\n#define fmin(__x, __y) __tg_fmin(__tg_promote2((__x), (__y))(__x), \\\n                                 __tg_promote2((__x), (__y))(__y))\n\n// fmod\n\nstatic float\n    _TG_ATTRS\n    __tg_fmod(float __x, float __y) {return fmodf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_fmod(double __x, double __y) {return fmod(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_fmod(long double __x, long double __y) {return fmodl(__x, __y);}\n\n#undef fmod\n#define fmod(__x, __y) __tg_fmod(__tg_promote2((__x), (__y))(__x), \\\n                                 __tg_promote2((__x), (__y))(__y))\n\n// frexp\n\nstatic float\n    _TG_ATTRS\n    __tg_frexp(float __x, int* __y) {return frexpf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_frexp(double __x, int* __y) {return frexp(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_frexp(long double __x, int* __y) {return frexpl(__x, __y);}\n\n#undef frexp\n#define frexp(__x, __y) __tg_frexp(__tg_promote1((__x))(__x), __y)\n\n// hypot\n\nstatic float\n    _TG_ATTRS\n    __tg_hypot(float __x, float __y) {return hypotf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_hypot(double __x, double __y) {return hypot(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_hypot(long double __x, long double __y) {return hypotl(__x, __y);}\n\n#undef hypot\n#define hypot(__x, __y) __tg_hypot(__tg_promote2((__x), (__y))(__x), \\\n                                   __tg_promote2((__x), (__y))(__y))\n\n// ilogb\n\nstatic int\n    _TG_ATTRS\n    __tg_ilogb(float __x) {return ilogbf(__x);}\n\nstatic int\n    _TG_ATTRS\n    __tg_ilogb(double __x) {return ilogb(__x);}\n\nstatic int\n    _TG_ATTRS\n    __tg_ilogb(long double __x) {return ilogbl(__x);}\n\n#undef ilogb\n#define ilogb(__x) __tg_ilogb(__tg_promote1((__x))(__x))\n\n// ldexp\n\nstatic float\n    _TG_ATTRS\n    __tg_ldexp(float __x, int __y) {return ldexpf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_ldexp(double __x, int __y) {return ldexp(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_ldexp(long double __x, int __y) {return ldexpl(__x, __y);}\n\n#undef ldexp\n#define ldexp(__x, __y) __tg_ldexp(__tg_promote1((__x))(__x), __y)\n\n// lgamma\n\nstatic float\n    _TG_ATTRS\n    __tg_lgamma(float __x) {return lgammaf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_lgamma(double __x) {return lgamma(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_lgamma(long double __x) {return lgammal(__x);}\n\n#undef lgamma\n#define lgamma(__x) __tg_lgamma(__tg_promote1((__x))(__x))\n\n// llrint\n\nstatic long long\n    _TG_ATTRS\n    __tg_llrint(float __x) {return llrintf(__x);}\n\nstatic long long\n    _TG_ATTRS\n    __tg_llrint(double __x) {return llrint(__x);}\n\nstatic long long\n    _TG_ATTRS\n    __tg_llrint(long double __x) {return llrintl(__x);}\n\n#undef llrint\n#define llrint(__x) __tg_llrint(__tg_promote1((__x))(__x))\n\n// llround\n\nstatic long long\n    _TG_ATTRS\n    __tg_llround(float __x) {return llroundf(__x);}\n\nstatic long long\n    _TG_ATTRS\n    __tg_llround(double __x) {return llround(__x);}\n\nstatic long long\n    _TG_ATTRS\n    __tg_llround(long double __x) {return llroundl(__x);}\n\n#undef llround\n#define llround(__x) __tg_llround(__tg_promote1((__x))(__x))\n\n// log10\n\nstatic float\n    _TG_ATTRS\n    __tg_log10(float __x) {return log10f(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_log10(double __x) {return log10(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_log10(long double __x) {return log10l(__x);}\n\n#undef log10\n#define log10(__x) __tg_log10(__tg_promote1((__x))(__x))\n\n// log1p\n\nstatic float\n    _TG_ATTRS\n    __tg_log1p(float __x) {return log1pf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_log1p(double __x) {return log1p(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_log1p(long double __x) {return log1pl(__x);}\n\n#undef log1p\n#define log1p(__x) __tg_log1p(__tg_promote1((__x))(__x))\n\n// log2\n\nstatic float\n    _TG_ATTRS\n    __tg_log2(float __x) {return log2f(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_log2(double __x) {return log2(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_log2(long double __x) {return log2l(__x);}\n\n#undef log2\n#define log2(__x) __tg_log2(__tg_promote1((__x))(__x))\n\n// logb\n\nstatic float\n    _TG_ATTRS\n    __tg_logb(float __x) {return logbf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_logb(double __x) {return logb(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_logb(long double __x) {return logbl(__x);}\n\n#undef logb\n#define logb(__x) __tg_logb(__tg_promote1((__x))(__x))\n\n// lrint\n\nstatic long\n    _TG_ATTRS\n    __tg_lrint(float __x) {return lrintf(__x);}\n\nstatic long\n    _TG_ATTRS\n    __tg_lrint(double __x) {return lrint(__x);}\n\nstatic long\n    _TG_ATTRS\n    __tg_lrint(long double __x) {return lrintl(__x);}\n\n#undef lrint\n#define lrint(__x) __tg_lrint(__tg_promote1((__x))(__x))\n\n// lround\n\nstatic long\n    _TG_ATTRS\n    __tg_lround(float __x) {return lroundf(__x);}\n\nstatic long\n    _TG_ATTRS\n    __tg_lround(double __x) {return lround(__x);}\n\nstatic long\n    _TG_ATTRS\n    __tg_lround(long double __x) {return lroundl(__x);}\n\n#undef lround\n#define lround(__x) __tg_lround(__tg_promote1((__x))(__x))\n\n// nearbyint\n\nstatic float\n    _TG_ATTRS\n    __tg_nearbyint(float __x) {return nearbyintf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_nearbyint(double __x) {return nearbyint(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_nearbyint(long double __x) {return nearbyintl(__x);}\n\n#undef nearbyint\n#define nearbyint(__x) __tg_nearbyint(__tg_promote1((__x))(__x))\n\n// nextafter\n\nstatic float\n    _TG_ATTRS\n    __tg_nextafter(float __x, float __y) {return nextafterf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_nextafter(double __x, double __y) {return nextafter(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_nextafter(long double __x, long double __y) {return nextafterl(__x, __y);}\n\n#undef nextafter\n#define nextafter(__x, __y) __tg_nextafter(__tg_promote2((__x), (__y))(__x), \\\n                                           __tg_promote2((__x), (__y))(__y))\n\n// nexttoward\n\nstatic float\n    _TG_ATTRS\n    __tg_nexttoward(float __x, long double __y) {return nexttowardf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_nexttoward(double __x, long double __y) {return nexttoward(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_nexttoward(long double __x, long double __y) {return nexttowardl(__x, __y);}\n\n#undef nexttoward\n#define nexttoward(__x, __y) __tg_nexttoward(__tg_promote1((__x))(__x), (__y))\n\n// remainder\n\nstatic float\n    _TG_ATTRS\n    __tg_remainder(float __x, float __y) {return remainderf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_remainder(double __x, double __y) {return remainder(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_remainder(long double __x, long double __y) {return remainderl(__x, __y);}\n\n#undef remainder\n#define remainder(__x, __y) __tg_remainder(__tg_promote2((__x), (__y))(__x), \\\n                                           __tg_promote2((__x), (__y))(__y))\n\n// remquo\n\nstatic float\n    _TG_ATTRS\n    __tg_remquo(float __x, float __y, int* __z)\n    {return remquof(__x, __y, __z);}\n\nstatic double\n    _TG_ATTRS\n    __tg_remquo(double __x, double __y, int* __z)\n    {return remquo(__x, __y, __z);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_remquo(long double __x,long double __y, int* __z)\n    {return remquol(__x, __y, __z);}\n\n#undef remquo\n#define remquo(__x, __y, __z)                         \\\n        __tg_remquo(__tg_promote2((__x), (__y))(__x), \\\n                    __tg_promote2((__x), (__y))(__y), \\\n                    (__z))\n\n// rint\n\nstatic float\n    _TG_ATTRS\n    __tg_rint(float __x) {return rintf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_rint(double __x) {return rint(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_rint(long double __x) {return rintl(__x);}\n\n#undef rint\n#define rint(__x) __tg_rint(__tg_promote1((__x))(__x))\n\n// round\n\nstatic float\n    _TG_ATTRS\n    __tg_round(float __x) {return roundf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_round(double __x) {return round(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_round(long double __x) {return roundl(__x);}\n\n#undef round\n#define round(__x) __tg_round(__tg_promote1((__x))(__x))\n\n// scalbn\n\nstatic float\n    _TG_ATTRS\n    __tg_scalbn(float __x, int __y) {return scalbnf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_scalbn(double __x, int __y) {return scalbn(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_scalbn(long double __x, int __y) {return scalbnl(__x, __y);}\n\n#undef scalbn\n#define scalbn(__x, __y) __tg_scalbn(__tg_promote1((__x))(__x), __y)\n\n// scalbln\n\nstatic float\n    _TG_ATTRS\n    __tg_scalbln(float __x, long __y) {return scalblnf(__x, __y);}\n\nstatic double\n    _TG_ATTRS\n    __tg_scalbln(double __x, long __y) {return scalbln(__x, __y);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_scalbln(long double __x, long __y) {return scalblnl(__x, __y);}\n\n#undef scalbln\n#define scalbln(__x, __y) __tg_scalbln(__tg_promote1((__x))(__x), __y)\n\n// tgamma\n\nstatic float\n    _TG_ATTRS\n    __tg_tgamma(float __x) {return tgammaf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_tgamma(double __x) {return tgamma(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_tgamma(long double __x) {return tgammal(__x);}\n\n#undef tgamma\n#define tgamma(__x) __tg_tgamma(__tg_promote1((__x))(__x))\n\n// trunc\n\nstatic float\n    _TG_ATTRS\n    __tg_trunc(float __x) {return truncf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_trunc(double __x) {return trunc(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_trunc(long double __x) {return truncl(__x);}\n\n#undef trunc\n#define trunc(__x) __tg_trunc(__tg_promote1((__x))(__x))\n\n// carg\n\nstatic float\n    _TG_ATTRS\n    __tg_carg(float __x) {return atan2f(0.F, __x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_carg(double __x) {return atan2(0., __x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_carg(long double __x) {return atan2l(0.L, __x);}\n\nstatic float\n    _TG_ATTRS\n    __tg_carg(float _Complex __x) {return cargf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_carg(double _Complex __x) {return carg(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_carg(long double _Complex __x) {return cargl(__x);}\n\n#undef carg\n#define carg(__x) __tg_carg(__tg_promote1((__x))(__x))\n\n// cimag\n\nstatic float\n    _TG_ATTRS\n    __tg_cimag(float __x) {return 0;}\n\nstatic double\n    _TG_ATTRS\n    __tg_cimag(double __x) {return 0;}\n\nstatic long double\n    _TG_ATTRS\n    __tg_cimag(long double __x) {return 0;}\n\nstatic float\n    _TG_ATTRS\n    __tg_cimag(float _Complex __x) {return cimagf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_cimag(double _Complex __x) {return cimag(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_cimag(long double _Complex __x) {return cimagl(__x);}\n\n#undef cimag\n#define cimag(__x) __tg_cimag(__tg_promote1((__x))(__x))\n\n// conj\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_conj(float __x) {return __x;}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_conj(double __x) {return __x;}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_conj(long double __x) {return __x;}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_conj(float _Complex __x) {return conjf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_conj(double _Complex __x) {return conj(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_conj(long double _Complex __x) {return conjl(__x);}\n\n#undef conj\n#define conj(__x) __tg_conj(__tg_promote1((__x))(__x))\n\n// cproj\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_cproj(float __x) {return cprojf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_cproj(double __x) {return cproj(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_cproj(long double __x) {return cprojl(__x);}\n\nstatic float _Complex\n    _TG_ATTRS\n    __tg_cproj(float _Complex __x) {return cprojf(__x);}\n\nstatic double _Complex\n    _TG_ATTRS\n    __tg_cproj(double _Complex __x) {return cproj(__x);}\n\nstatic long double _Complex\n    _TG_ATTRS\n    __tg_cproj(long double _Complex __x) {return cprojl(__x);}\n\n#undef cproj\n#define cproj(__x) __tg_cproj(__tg_promote1((__x))(__x))\n\n// creal\n\nstatic float\n    _TG_ATTRS\n    __tg_creal(float __x) {return __x;}\n\nstatic double\n    _TG_ATTRS\n    __tg_creal(double __x) {return __x;}\n\nstatic long double\n    _TG_ATTRS\n    __tg_creal(long double __x) {return __x;}\n\nstatic float\n    _TG_ATTRS\n    __tg_creal(float _Complex __x) {return crealf(__x);}\n\nstatic double\n    _TG_ATTRS\n    __tg_creal(double _Complex __x) {return creal(__x);}\n\nstatic long double\n    _TG_ATTRS\n    __tg_creal(long double _Complex __x) {return creall(__x);}\n\n#undef creal\n#define creal(__x) __tg_creal(__tg_promote1((__x))(__x))\n\n#undef _TG_ATTRSp\n#undef _TG_ATTRS\n\n#endif /* __cplusplus */\n#endif /* __has_include_next */\n#endif /* __CLANG_TGMATH_H */\n",
  "unwind.h": `/*===---- unwind.h - Stack unwinding ----------------------------------------===
 *
 * Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
 * See https://llvm.org/LICENSE.txt for license information.
 * SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
 *
 *===-----------------------------------------------------------------------===
 */

/* See "Data Definitions for libgcc_s" in the Linux Standard Base.*/

#ifndef __CLANG_UNWIND_H
#define __CLANG_UNWIND_H

#if defined(__APPLE__) && __has_include_next(<unwind.h>)
/* Darwin (from 11.x on) provide an unwind.h. If that's available,
 * use it. libunwind wraps some of its definitions in #ifdef _GNU_SOURCE,
 * so define that around the include.*/
# ifndef _GNU_SOURCE
#  define _SHOULD_UNDEFINE_GNU_SOURCE
#  define _GNU_SOURCE
# endif
// libunwind's unwind.h reflects the current visibility.  However, Mozilla
// builds with -fvisibility=hidden and relies on gcc's unwind.h to reset the
// visibility to default and export its contents.  gcc also allows users to
// override its override by #defining HIDE_EXPORTS (but note, this only obeys
// the user's -fvisibility setting; it doesn't hide any exports on its own).  We
// imitate gcc's header here:
# ifdef HIDE_EXPORTS
#  include_next <unwind.h>
# else
#  pragma GCC visibility push(default)
#  include_next <unwind.h>
#  pragma GCC visibility pop
# endif
# ifdef _SHOULD_UNDEFINE_GNU_SOURCE
#  undef _GNU_SOURCE
#  undef _SHOULD_UNDEFINE_GNU_SOURCE
# endif
#else

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/* It is a bit strange for a header to play with the visibility of the
   symbols it declares, but this matches gcc's behavior and some programs
   depend on it */
#ifndef HIDE_EXPORTS
#pragma GCC visibility push(default)
#endif

typedef uintptr_t _Unwind_Word __attribute__((__mode__(__unwind_word__)));
typedef intptr_t _Unwind_Sword __attribute__((__mode__(__unwind_word__)));
typedef uintptr_t _Unwind_Ptr;
typedef uintptr_t _Unwind_Internal_Ptr;
typedef uint64_t _Unwind_Exception_Class;

typedef intptr_t _sleb128_t;
typedef uintptr_t _uleb128_t;

struct _Unwind_Context;
#if defined(__arm__) && !(defined(__USING_SJLJ_EXCEPTIONS__) || \\
                          defined(__ARM_DWARF_EH__) || defined(__SEH__))
struct _Unwind_Control_Block;
typedef struct _Unwind_Control_Block _Unwind_Control_Block;
#define _Unwind_Exception _Unwind_Control_Block /* Alias */
#else
struct _Unwind_Exception;
typedef struct _Unwind_Exception _Unwind_Exception;
#endif
typedef enum {
  _URC_NO_REASON = 0,
#if defined(__arm__) && !defined(__USING_SJLJ_EXCEPTIONS__) && \\
    !defined(__ARM_DWARF_EH__) && !defined(__SEH__)
  _URC_OK = 0, /* used by ARM EHABI */
#endif
  _URC_FOREIGN_EXCEPTION_CAUGHT = 1,

  _URC_FATAL_PHASE2_ERROR = 2,
  _URC_FATAL_PHASE1_ERROR = 3,
  _URC_NORMAL_STOP = 4,

  _URC_END_OF_STACK = 5,
  _URC_HANDLER_FOUND = 6,
  _URC_INSTALL_CONTEXT = 7,
  _URC_CONTINUE_UNWIND = 8,
#if defined(__arm__) && !defined(__USING_SJLJ_EXCEPTIONS__) && \\
    !defined(__ARM_DWARF_EH__) && !defined(__SEH__)
  _URC_FAILURE = 9 /* used by ARM EHABI */
#endif
} _Unwind_Reason_Code;

typedef enum {
  _UA_SEARCH_PHASE = 1,
  _UA_CLEANUP_PHASE = 2,

  _UA_HANDLER_FRAME = 4,
  _UA_FORCE_UNWIND = 8,
  _UA_END_OF_STACK = 16 /* gcc extension to C++ ABI */
} _Unwind_Action;

typedef void (*_Unwind_Exception_Cleanup_Fn)(_Unwind_Reason_Code,
                                             _Unwind_Exception *);

#if defined(__arm__) && !(defined(__USING_SJLJ_EXCEPTIONS__) || \\
                          defined(__ARM_DWARF_EH__) || defined(__SEH__))
typedef struct _Unwind_Control_Block _Unwind_Control_Block;
typedef uint32_t _Unwind_EHT_Header;

struct _Unwind_Control_Block {
  uint64_t exception_class;
  void (*exception_cleanup)(_Unwind_Reason_Code, _Unwind_Control_Block *);
  /* unwinder cache (private fields for the unwinder's use) */
  struct {
    uint32_t reserved1; /* forced unwind stop function, 0 if not forced */
    uint32_t reserved2; /* personality routine */
    uint32_t reserved3; /* callsite */
    uint32_t reserved4; /* forced unwind stop argument */
    uint32_t reserved5;
  } unwinder_cache;
  /* propagation barrier cache (valid after phase 1) */
  struct {
    uint32_t sp;
    uint32_t bitpattern[5];
  } barrier_cache;
  /* cleanup cache (preserved over cleanup) */
  struct {
    uint32_t bitpattern[4];
  } cleanup_cache;
  /* personality cache (for personality's benefit) */
  struct {
    uint32_t fnstart;         /* function start address */
    _Unwind_EHT_Header *ehtp; /* pointer to EHT entry header word */
    uint32_t additional;      /* additional data */
    uint32_t reserved1;
  } pr_cache;
  long long int : 0; /* force alignment of next item to 8-byte boundary */
} __attribute__((__aligned__(8)));
#else
struct _Unwind_Exception {
  _Unwind_Exception_Class exception_class;
  _Unwind_Exception_Cleanup_Fn exception_cleanup;
#if !defined (__USING_SJLJ_EXCEPTIONS__) && defined (__SEH__)
  _Unwind_Word private_[6];
#else
  _Unwind_Word private_1;
  _Unwind_Word private_2;
#endif
  /* The Itanium ABI requires that _Unwind_Exception objects are "double-word
   * aligned".  GCC has interpreted this to mean "use the maximum useful
   * alignment for the target"; so do we. */
} __attribute__((__aligned__));
#endif

typedef _Unwind_Reason_Code (*_Unwind_Stop_Fn)(int, _Unwind_Action,
                                               _Unwind_Exception_Class,
                                               _Unwind_Exception *,
                                               struct _Unwind_Context *,
                                               void *);

typedef _Unwind_Reason_Code (*_Unwind_Personality_Fn)(int, _Unwind_Action,
                                                      _Unwind_Exception_Class,
                                                      _Unwind_Exception *,
                                                      struct _Unwind_Context *);
typedef _Unwind_Personality_Fn __personality_routine;

typedef _Unwind_Reason_Code (*_Unwind_Trace_Fn)(struct _Unwind_Context *,
                                                void *);

#if defined(__arm__) && !(defined(__USING_SJLJ_EXCEPTIONS__) ||                \\
                          defined(__ARM_DWARF_EH__) || defined(__SEH__))
typedef enum {
  _UVRSC_CORE = 0,        /* integer register */
  _UVRSC_VFP = 1,         /* vfp */
  _UVRSC_WMMXD = 3,       /* Intel WMMX data register */
  _UVRSC_WMMXC = 4,       /* Intel WMMX control register */
  _UVRSC_PSEUDO = 5       /* Special purpose pseudo register */
} _Unwind_VRS_RegClass;

typedef enum {
  _UVRSD_UINT32 = 0,
  _UVRSD_VFPX = 1,
  _UVRSD_UINT64 = 3,
  _UVRSD_FLOAT = 4,
  _UVRSD_DOUBLE = 5
} _Unwind_VRS_DataRepresentation;

typedef enum {
  _UVRSR_OK = 0,
  _UVRSR_NOT_IMPLEMENTED = 1,
  _UVRSR_FAILED = 2
} _Unwind_VRS_Result;

typedef uint32_t _Unwind_State;
#define _US_VIRTUAL_UNWIND_FRAME  ((_Unwind_State)0)
#define _US_UNWIND_FRAME_STARTING ((_Unwind_State)1)
#define _US_UNWIND_FRAME_RESUME   ((_Unwind_State)2)
#define _US_ACTION_MASK           ((_Unwind_State)3)
#define _US_FORCE_UNWIND          ((_Unwind_State)8)

_Unwind_VRS_Result _Unwind_VRS_Get(struct _Unwind_Context *__context,
  _Unwind_VRS_RegClass __regclass,
  uint32_t __regno,
  _Unwind_VRS_DataRepresentation __representation,
  void *__valuep);

_Unwind_VRS_Result _Unwind_VRS_Set(struct _Unwind_Context *__context,
  _Unwind_VRS_RegClass __regclass,
  uint32_t __regno,
  _Unwind_VRS_DataRepresentation __representation,
  void *__valuep);

static __inline__
_Unwind_Word _Unwind_GetGR(struct _Unwind_Context *__context, int __index) {
  _Unwind_Word __value;
  _Unwind_VRS_Get(__context, _UVRSC_CORE, __index, _UVRSD_UINT32, &__value);
  return __value;
}

static __inline__
void _Unwind_SetGR(struct _Unwind_Context *__context, int __index,
                   _Unwind_Word __value) {
  _Unwind_VRS_Set(__context, _UVRSC_CORE, __index, _UVRSD_UINT32, &__value);
}

static __inline__
_Unwind_Word _Unwind_GetIP(struct _Unwind_Context *__context) {
  _Unwind_Word __ip = _Unwind_GetGR(__context, 15);
  return __ip & ~(_Unwind_Word)(0x1); /* Remove thumb mode bit. */
}

static __inline__
void _Unwind_SetIP(struct _Unwind_Context *__context, _Unwind_Word __value) {
  _Unwind_Word __thumb_mode_bit = _Unwind_GetGR(__context, 15) & 0x1;
  _Unwind_SetGR(__context, 15, __value | __thumb_mode_bit);
}
#else
_Unwind_Word _Unwind_GetGR(struct _Unwind_Context *, int);
void _Unwind_SetGR(struct _Unwind_Context *, int, _Unwind_Word);

_Unwind_Word _Unwind_GetIP(struct _Unwind_Context *);
void _Unwind_SetIP(struct _Unwind_Context *, _Unwind_Word);
#endif


_Unwind_Word _Unwind_GetIPInfo(struct _Unwind_Context *, int *);

_Unwind_Word _Unwind_GetCFA(struct _Unwind_Context *);

_Unwind_Word _Unwind_GetBSP(struct _Unwind_Context *);

void *_Unwind_GetLanguageSpecificData(struct _Unwind_Context *);

_Unwind_Ptr _Unwind_GetRegionStart(struct _Unwind_Context *);

/* DWARF EH functions; currently not available on Darwin/ARM */
#if !defined(__APPLE__) || !defined(__arm__)
_Unwind_Reason_Code _Unwind_RaiseException(_Unwind_Exception *);
_Unwind_Reason_Code _Unwind_ForcedUnwind(_Unwind_Exception *, _Unwind_Stop_Fn,
                                         void *);
void _Unwind_DeleteException(_Unwind_Exception *);
void _Unwind_Resume(_Unwind_Exception *);
_Unwind_Reason_Code _Unwind_Resume_or_Rethrow(_Unwind_Exception *);

#endif

_Unwind_Reason_Code _Unwind_Backtrace(_Unwind_Trace_Fn, void *);

/* setjmp(3)/longjmp(3) stuff */
typedef struct SjLj_Function_Context *_Unwind_FunctionContext_t;

void _Unwind_SjLj_Register(_Unwind_FunctionContext_t);
void _Unwind_SjLj_Unregister(_Unwind_FunctionContext_t);
_Unwind_Reason_Code _Unwind_SjLj_RaiseException(_Unwind_Exception *);
_Unwind_Reason_Code _Unwind_SjLj_ForcedUnwind(_Unwind_Exception *,
                                              _Unwind_Stop_Fn, void *);
void _Unwind_SjLj_Resume(_Unwind_Exception *);
_Unwind_Reason_Code _Unwind_SjLj_Resume_or_Rethrow(_Unwind_Exception *);

void *_Unwind_FindEnclosingFunction(void *);

#ifdef __APPLE__

_Unwind_Ptr _Unwind_GetDataRelBase(struct _Unwind_Context *)
    __attribute__((__unavailable__));
_Unwind_Ptr _Unwind_GetTextRelBase(struct _Unwind_Context *)
    __attribute__((__unavailable__));

/* Darwin-specific functions */
void __register_frame(const void *);
void __deregister_frame(const void *);

struct dwarf_eh_bases {
  uintptr_t tbase;
  uintptr_t dbase;
  uintptr_t func;
};
void *_Unwind_Find_FDE(const void *, struct dwarf_eh_bases *);

void __register_frame_info_bases(const void *, void *, void *, void *)
  __attribute__((__unavailable__));
void __register_frame_info(const void *, void *) __attribute__((__unavailable__));
void __register_frame_info_table_bases(const void *, void*, void *, void *)
  __attribute__((__unavailable__));
void __register_frame_info_table(const void *, void *)
  __attribute__((__unavailable__));
void __register_frame_table(const void *) __attribute__((__unavailable__));
void __deregister_frame_info(const void *) __attribute__((__unavailable__));
void __deregister_frame_info_bases(const void *)__attribute__((__unavailable__));

#else

_Unwind_Ptr _Unwind_GetDataRelBase(struct _Unwind_Context *);
_Unwind_Ptr _Unwind_GetTextRelBase(struct _Unwind_Context *);

#endif


#ifndef HIDE_EXPORTS
#pragma GCC visibility pop
#endif

#ifdef __cplusplus
}
#endif

#endif

#endif /* __CLANG_UNWIND_H */
`,
  "varargs.h": '/*===---- varargs.h - Variable argument handling -------------------------------------===\n*\n* Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.\n* See https://llvm.org/LICENSE.txt for license information.\n* SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception\n*\n*===-----------------------------------------------------------------------===\n*/\n#ifndef __VARARGS_H\n#define __VARARGS_H\n#if defined(__MVS__) && __has_include_next(<varargs.h>)\n#include_next <varargs.h>\n#else\n#error "Please use <stdarg.h> instead of <varargs.h>"\n#endif /* __MVS__ */\n#endif\n'
});

// node_modules/@wasm-idle/llvm-core/dist/core/src/clang-resource-headers.js
var CLANG_RESOURCE_HEADER_PROVENANCE = Object.freeze({
  name: "clang",
  version: "22.1.8",
  revision: "ca7933e47d3a3451d81e72ac174dcb5aa28b59d1"
});
var CLANG_RESOURCE_HEADER_DIRECTORY = "/lib/clang/22";
function installClangResourceHeaders(fs, provenance, resourceDir) {
  if (provenance?.name !== CLANG_RESOURCE_HEADER_PROVENANCE.name || provenance.version !== CLANG_RESOURCE_HEADER_PROVENANCE.version || provenance.revision !== CLANG_RESOURCE_HEADER_PROVENANCE.revision || resourceDir !== CLANG_RESOURCE_HEADER_DIRECTORY)
    return false;
  const decoder2 = new TextDecoder("utf-8", { fatal: true });
  const missing = [];
  for (const [name, contents] of Object.entries(CLANG_RESOURCE_HEADERS)) {
    const path = `${resourceDir}/include/${name}`;
    try {
      const existing = fs.readFile(path);
      if (existing !== null) {
        if (decoder2.decode(existing) !== contents) {
          throw new Error(`Clang ${provenance.version} resource header differs from its pinned source: ${name}`);
        }
      } else {
        missing.push([path, contents]);
      }
    } catch (error) {
      throw new Error(`Unable to inspect Clang ${provenance.version} resource header ${name}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
  }
  if (missing.length) {
    try {
      fs.mkdirTree(`${resourceDir}/include`);
    } catch (error) {
      throw new Error(`Unable to prepare Clang ${provenance.version} resource header directory: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
  }
  const encoder2 = new TextEncoder();
  for (const [path, contents] of missing) {
    try {
      fs.writeFile(path, encoder2.encode(contents));
    } catch (error) {
      throw new Error(`Unable to install Clang ${provenance.version} resource header ${path.slice(path.lastIndexOf("/") + 1)}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
  }
  return true;
}

// node_modules/@wasm-idle/llvm-core/dist/core/src/memfs.js
var ESUCCESS2 = 0;
var previewText = (text) => JSON.stringify(text.length > 96 ? text.slice(0, 93) + "..." : text);
var MemFS = class {
  ready;
  mem = null;
  hostMem_ = null;
  stdinStr;
  stdin;
  stdout;
  trace;
  instance = null;
  exports;
  out = true;
  filePaths = /* @__PURE__ */ new Set();
  fileOverlays = /* @__PURE__ */ new Map();
  directoryPaths = /* @__PURE__ */ new Set();
  constructor(options) {
    this.stdin = options.stdin;
    this.stdout = options.stdout;
    this.stdinStr = options.stdinStr || "";
    this.trace = options.trace || (() => {
    });
    const env = bindNew(this, "abort", "host_write", "host_read", "memfs_log", "copy_in", "copy_out");
    this.ready = (options.maxAssetBytes !== void 0 ? compile(options.moduleUrl, options.progress, options.signal, options.maxAssetBytes) : options.signal ? compile(options.moduleUrl, options.progress, options.signal) : compile(options.moduleUrl, options.progress)).then((module) => WebAssembly.instantiate(module, {
      env
    })).then((instance) => {
      this.instance = instance;
      this.exports = instance.exports;
      this.mem = new Memory(this.exports.memory);
      this.exports.init();
    });
  }
  set hostMem(mem) {
    this.hostMem_ = mem;
  }
  setStdinStr(str) {
    this.stdinStr = str;
  }
  addDirectory(path) {
    const normalizedPath = this.normalizePath(path);
    if (this.directoryPaths.has(normalizedPath))
      return;
    this.mem.check();
    this.mem.write(this.exports.GetPathBuf(), path);
    this.exports.AddDirectoryNode(path.length);
    this.directoryPaths.add(normalizedPath);
  }
  addFile(path, contents) {
    const length = contents instanceof ArrayBuffer ? contents.byteLength : contents.length;
    this.mem.check();
    this.mem.write(this.exports.GetPathBuf(), path);
    const inode = this.exports.AddFileNode(path.length, length);
    const addr = this.exports.GetFileNodeAddress(inode);
    this.mem.check();
    this.mem.write(addr, contents);
    this.filePaths.add(this.normalizePath(path));
  }
  setFile(path, contents) {
    const normalizedPath = this.normalizePath(path);
    this.filePaths.add(normalizedPath);
    this.fileOverlays.set(normalizedPath, Uint8Array.from(contents));
  }
  hasFile(path) {
    return this.filePaths.has(this.normalizePath(path));
  }
  normalizePath(path) {
    return path.replaceAll("\\", "/").replace(/^\.\//, "").replace(/^\/+/, "");
  }
  getFileContents(path) {
    const overlay = this.fileOverlays.get(this.normalizePath(path));
    if (overlay)
      return overlay;
    this.mem.check();
    this.mem.write(this.exports.GetPathBuf(), path);
    const inode = this.exports.FindNode(path.length);
    const addr = this.exports.GetFileNodeAddress(inode);
    const size = this.exports.GetFileNodeSize(inode);
    return new Uint8Array(this.mem.buffer, addr, size);
  }
  abort() {
    this.trace("abort()");
    throw new AbortError();
  }
  host_write(fd2, iovs, iovs_len, nwritten_out) {
    this.hostMem_.check();
    assert(fd2 <= 2);
    let size = 0;
    let str = "";
    for (let i = 0; i < iovs_len; ++i) {
      const buf = this.hostMem_.read32(iovs);
      iovs += 4;
      const len = this.hostMem_.read32(iovs);
      iovs += 4;
      str += this.hostMem_.readStrR(buf, len);
      size += len;
    }
    this.hostMem_.write32(nwritten_out, size);
    this.trace(`host_write(fd=${fd2}, bytes=${size}, data=${previewText(str)})`);
    if (this.out)
      this.stdout(str);
    return ESUCCESS2;
  }
  host_read(fd2, iovs, iovs_len, nread) {
    this.hostMem_.check();
    assert(fd2 === 0);
    let size = 0;
    for (let i = 0; i < iovs_len; ++i) {
      const buf = this.hostMem_.read32(iovs);
      iovs += 4;
      const len = this.hostMem_.read32(iovs);
      iovs += 4;
      if (!this.stdinStr.length)
        this.stdinStr = this.stdin();
      const lenToWrite = Math.min(len, this.stdinStr.length);
      if (lenToWrite === 0)
        break;
      const chunk = this.stdinStr.substring(0, lenToWrite);
      this.hostMem_.write(buf, this.stdinStr.substring(0, lenToWrite));
      this.stdinStr = this.stdinStr.substring(lenToWrite);
      size += lenToWrite;
      this.trace(`host_read(fd=${fd2}, bytes=${lenToWrite}, data=${previewText(chunk)})`);
      if (lenToWrite !== len)
        break;
    }
    this.hostMem_.write32(nread, size);
    if (size === 0)
      this.trace(`host_read(fd=${fd2}, bytes=0)`);
    return ESUCCESS2;
  }
  memfs_log(buf, len) {
    this.mem.check();
    const message = this.mem.readStr(buf, len);
    this.trace(`memfs_log(${previewText(message)})`);
  }
  copy_out(clang_dst, memfs_src, size) {
    this.hostMem_.check();
    const dst = new Uint8Array(this.hostMem_.buffer, clang_dst, size);
    this.mem.check();
    const src = new Uint8Array(this.mem.buffer, memfs_src, size);
    dst.set(src);
  }
  copy_in(memfs_dst, clang_src, size) {
    this.mem.check();
    const dst = new Uint8Array(this.mem.buffer, memfs_dst, size);
    this.hostMem_.check();
    const src = new Uint8Array(this.hostMem_.buffer, clang_src, size);
    dst.set(src);
  }
};

// node_modules/@wasm-idle/llvm-core/dist/core/src/tar.js
function* readEntry(buffer) {
  const u82 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let offset = 0;
  let nextFilename = "";
  const str = (len) => {
    offset += len;
    return readStr(u82, offset - len, len);
  }, oct = (len) => {
    offset += len;
    return readOct(u82, offset - len, len);
  }, align = () => offset = offset + 511 & ~511;
  while (offset + 512 <= u82.length) {
    const entryInit = {
      filename: str(100),
      mode: oct(8),
      owner: oct(8),
      group: oct(8),
      size: oct(12),
      mtime: oct(12),
      checksum: oct(8),
      type: str(1),
      linkname: str(100),
      ustar: str(8)
    };
    if (!entryInit.ustar)
      return;
    const entry = {
      ...entryInit,
      ownerName: str(32),
      groupName: str(32),
      devMajor: str(8),
      devMinor: str(8),
      filenamePrefix: str(155)
    };
    align();
    if (entry.size > 0 || entry.type === "0" || entry.type === "" || entry.type === "L") {
      const contents = u82.subarray(offset, offset + entry.size);
      entry.contents = contents;
      offset += entry.size;
      align();
    }
    if (entry.type === "L") {
      if (entry.contents)
        nextFilename = readStr(entry.contents, 0, entry.size);
      continue;
    }
    entry.filename = nextFilename || (entry.filenamePrefix ? `${entry.filenamePrefix}/${entry.filename}` : entry.filename);
    nextFilename = "";
    yield entry;
  }
}
function untar(buffer, memfs) {
  for (const entry of readEntry(buffer)) {
    switch (entry.type) {
      case "":
      // Regular file.
      case "0":
        memfs.addFile(entry.filename, entry.contents);
        break;
      case "5":
        memfs.addDirectory(entry.filename);
        break;
      default:
        throw new Error(`unsupported tar entry type: ${entry.type}`);
    }
  }
}

// node_modules/@wasm-idle/llvm-core/dist/core/src/color.js
var green = "\x1B[92m";
var normal = "\x1B[0m";
var yellow = "\x1B[1;93m";

// node_modules/@wasm-idle/llvm-core/dist/clang/src/progress.js
var clamp = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
function createCombinedProgress(report) {
  const state = {
    clang: 0,
    lld: 0,
    memfs: 0
  };
  const emit = () => {
    report((state.clang + state.lld + state.memfs) / 3);
  };
  const createSink = (key) => ({
    set(value) {
      state[key] = clamp(value);
      emit();
    }
  });
  return {
    clang: createSink("clang"),
    lld: createSink("lld"),
    memfs: createSink("memfs")
  };
}

// node_modules/@wasm-idle/llvm-core/dist/clang/src/url.js
var resolveHostedRuntimeUrl = (value, label) => {
  const href = value?.toString().trim();
  if (!href) {
    throw new Error(`${label} is required`);
  }
  let resolved;
  try {
    resolved = new URL(href, typeof location !== "undefined" ? location.href : void 0);
  } catch {
    throw new Error(`${label} must be an absolute HTTP(S) URL`);
  }
  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
    throw new Error(`${label} must use HTTP(S)`);
  }
  return resolved;
};
var normalizeBaseUrl = (prefix) => {
  const resolved = resolveHostedRuntimeUrl(prefix, "wasm-clang runtime base URL");
  if (!resolved.pathname.endsWith("/"))
    resolved.pathname += "/";
  resolved.hash = "";
  return resolved;
};
var resolveVersionedAssetUrl = (prefix, assetPath) => new URL(assetPath, normalizeBaseUrl(prefix)).toString();
var resolveRuntimeAssetUrl2 = (prefix, assetPath) => resolveVersionedAssetUrl(prefix, assetPath);
var resolveRuntimeBaseUrl = (prefix) => normalizeBaseUrl(prefix).toString();
var resolveRuntimeBaseUrlFromManifestUrl = (manifestUrl) => normalizeBaseUrl(new URL("./", resolveHostedRuntimeUrl(manifestUrl, "wasm-clang runtime manifest URL"))).toString();
var runtimeManifestUrl = (prefix) => resolveRuntimeAssetUrl2(prefix, "runtime-manifest.v1.json");
var memfsUrl = (prefix) => resolveRuntimeAssetUrl2(prefix, "bin/memfs.wasm.gz");

// node_modules/@wasm-idle/llvm-core/dist/clang/src/runtime-assets.js
function resolveRuntimeAssetUrls(baseUrl, manifest) {
  const runtimeBaseUrl = resolveRuntimeBaseUrl(baseUrl);
  return {
    manifest: runtimeManifestUrl(runtimeBaseUrl).toString(),
    memfs: resolveVersionedAssetUrl(runtimeBaseUrl, manifest?.compiler.memfs.asset || "bin/memfs.wasm.gz").toString(),
    clang: resolveVersionedAssetUrl(runtimeBaseUrl, manifest?.compiler.clang.asset || "bin/clang.wasm.gz").toString(),
    lld: resolveVersionedAssetUrl(runtimeBaseUrl, manifest?.compiler.lld.asset || "bin/lld.wasm.gz").toString(),
    sysroot: resolveVersionedAssetUrl(runtimeBaseUrl, manifest?.compiler.sysroot.asset || "bin/sysroot.tar.gz").toString(),
    clangdJs: resolveVersionedAssetUrl(runtimeBaseUrl, manifest?.clangd.js || "clangd/clangd.js").toString(),
    clangdWasm: resolveVersionedAssetUrl(runtimeBaseUrl, manifest?.clangd.wasm || "clangd/clangd.wasm.gz").toString()
  };
}

// node_modules/@wasm-idle/llvm-core/dist/clang/src/workspace.js
var normalizeWorkspacePath = (path) => path.replaceAll("\\", "/").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
var normalizeDwarfWorkspacePath = (path) => {
  const normalized = normalizeWorkspacePath(path);
  return normalized.startsWith("workspace/") ? normalized.slice("workspace/".length) : normalized;
};
function resolveBuildArtifactNames(language, fileName) {
  const normalizedFileName = normalizeWorkspacePath(fileName || "");
  const defaultStem = "main";
  const input = normalizedFileName && /\.[A-Za-z0-9_-]+$/.test(normalizedFileName) ? normalizedFileName : `${normalizedFileName || defaultStem}.${language === "C" ? "c" : language === "OBJC" ? "m" : "cc"}`;
  const stem = (input.split("/").pop() || input).replace(/\.[^.]+$/, "") || defaultStem;
  return {
    input,
    obj: `${stem}.o`,
    wasm: `${stem}.wasm`
  };
}

// node_modules/@wasm-idle/llvm-core/dist/clang/src/dwarf.js
async function sha256Hex(value) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value instanceof Uint8Array ? new Uint8Array(value) : new Uint8Array(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function createDwarfDebugDescriptor(request, artifactBytes, provenance) {
  if (!provenance) {
    throw new Error("LLDB debug compilation requires compiler provenance in the wasm-clang runtime manifest");
  }
  const language = request.language || "CPP";
  const requestedInput = normalizeDwarfWorkspacePath(request.activePath || "") || normalizeDwarfWorkspacePath(request.fileName || "") || void 0;
  const { input } = resolveBuildArtifactNames(language, requestedInput);
  const sources = /* @__PURE__ */ new Map();
  for (const file of request.workspaceFiles || []) {
    const sourcePath = normalizeDwarfWorkspacePath(file.path);
    if (sourcePath)
      sources.set(sourcePath, file.content);
  }
  sources.set(input, request.code);
  const sourceEntries = [...sources.entries()].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
  return {
    kind: "dwarf",
    sourceRoot: "/workspace",
    moduleSha256: await sha256Hex(artifactBytes),
    files: await Promise.all(sourceEntries.map(async ([path, content]) => ({
      path: `/workspace/${path}`,
      contentSha256: await sha256Hex(content)
    }))),
    compiler: provenance
  };
}

// node_modules/@wasm-idle/llvm-core/dist/clang/src/runtime.js
if (typeof globalThis.document === "undefined") {
  globalThis.document = {
    querySelectorAll: (() => [])
  };
}
var defaultClangResourceDir = "/lib/clang/8.0.1";
var defaultCompilerRuntimeLibDir = "lib/clang/8.0.1/lib/wasi";
var internalBuildRoot = "__wasm_idle_build";
var workspaceTranslationUnitPattern = /\.(?:c|cc|cpp|cxx)$/;
var lldbForbiddenCompileArgs = /* @__PURE__ */ new Set([
  "-target",
  "--target",
  "-triple",
  "-target-feature",
  "-target-cpu",
  "-target-abi",
  "-mcpu",
  "-march",
  "-mattr",
  "-mthread-model",
  "-mllvm",
  "-pthread",
  "-fopenmp",
  "-msimd128",
  "-mno-simd128",
  "-matomics",
  "-mno-atomics",
  "-mmemory64",
  "-mno-memory64",
  "-mshared-memory",
  "-mno-shared-memory",
  "-mmulti-memory",
  "-mno-multi-memory"
]);
var lldbForbiddenCompileArgPrefixes = [
  "-target=",
  "--target=",
  "-triple=",
  "-target-feature=",
  "-target-cpu=",
  "-target-abi=",
  "-mcpu=",
  "-march=",
  "-mattr=",
  "-mthread-model=",
  "-mllvm="
];
var toUtf8 = (text) => {
  const surrogate = encodeURIComponent(text);
  let result = "";
  for (let i = 0; i < surrogate.length; ) {
    const character = surrogate[i];
    i += 1;
    if (character == "%") {
      const hex = surrogate.substring(i, i += 2);
      if (hex)
        result += String.fromCharCode(parseInt(hex, 16));
    } else {
      result += character;
    }
  }
  return result;
};
function maskDebugSyntax(line, startsInBlockComment) {
  const masked = [...line];
  let inBlockComment = startsInBlockComment;
  let quote;
  let escaped = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];
    if (inBlockComment) {
      masked[index] = " ";
      if (character === "*" && nextCharacter === "/") {
        masked[index + 1] = " ";
        index += 1;
        inBlockComment = false;
      }
      continue;
    }
    if (quote) {
      masked[index] = " ";
      if (escaped)
        escaped = false;
      else if (character === "\\")
        escaped = true;
      else if (character === quote)
        quote = void 0;
      continue;
    }
    if (character === "/" && nextCharacter === "*") {
      masked[index] = " ";
      masked[index + 1] = " ";
      index += 1;
      inBlockComment = true;
      continue;
    }
    if (character === "/" && nextCharacter === "/") {
      for (let commentIndex = index; commentIndex < line.length; commentIndex += 1) {
        masked[commentIndex] = " ";
      }
      break;
    }
    if (character === '"' || character === "'") {
      masked[index] = " ";
      quote = character;
    }
  }
  return { line: masked.join(""), inBlockComment };
}
var Clang = class {
  ready;
  memfs;
  stdout;
  moduleCache;
  showTiming;
  log;
  debug = false;
  debugBreakpoints = /* @__PURE__ */ new Set();
  debugPauseOnEntry = false;
  debugBuffer;
  debugInterruptBuffer;
  debugWatchBuffer;
  debugWatchResultBuffer;
  onDebugEvent;
  debugVariableMetadata = {};
  debugGlobalMetadata = [];
  debugFunctionMetadata = {};
  lastBuildKey = "";
  path;
  assetUrls;
  compilerConfig;
  wasm;
  lastArtifactPath = "main.wasm";
  traceStartedAt = 0;
  progress;
  maxAssetBytes;
  constructor(options) {
    const maxAssetBytes = options.maxAssetBytes ?? DEFAULT_MAX_DECOMPRESSED_ASSET_BYTES;
    if (!Number.isSafeInteger(maxAssetBytes) || maxAssetBytes <= 0) {
      throw new TypeError("Clang maxAssetBytes must be a positive safe integer");
    }
    this.maxAssetBytes = maxAssetBytes;
    this.moduleCache = {};
    this.stdout = options.stdout || (() => {
    });
    this.showTiming = options.showTiming || false;
    this.log = options.log || false;
    this.path = options.runtimeBaseUrl.toString();
    this.assetUrls = resolveRuntimeAssetUrls(this.path, options.manifest);
    this.compilerConfig = options.manifest?.compiler;
    this.onDebugEvent = options.onDebugEvent;
    this.progress = createCombinedProgress((value) => options.progress?.(value));
    this.memfs = new MemFS({
      stdout: this.stdout,
      stdin: options.stdin || (() => ""),
      moduleUrl: this.assetUrls.memfs,
      progress: this.progress.memfs,
      signal: options.signal,
      maxAssetBytes,
      trace: (message) => this.trace(message)
    });
    const clangReady = this.getModule(this.assetUrls.clang, this.progress.clang, options.signal);
    const lldReady = this.getModule(this.assetUrls.lld, this.progress.lld, options.signal);
    const fileSystemReady = this.memfs.ready.then(async () => {
      const sysrootReady = options.signal ? readBuffer(this.assetUrls.sysroot, void 0, maxAssetBytes, options.signal) : readBuffer(this.assetUrls.sysroot, void 0, maxAssetBytes);
      await this.hostLogAsync(`Untarring ${this.assetUrls.sysroot}`, sysrootReady.then((buffer) => untar(buffer, this.memfs)));
      installClangResourceHeaders({
        readFile: (path) => this.memfs.hasFile(path) ? this.memfs.getFileContents(path.replace(/^\/+/, "")) : null,
        mkdirTree: (path) => this.memfs.addDirectory(path.replace(/^\/+/, "")),
        writeFile: (path, contents) => this.memfs.addFile(path.replace(/^\/+/, ""), contents)
      }, this.compilerConfig?.provenance, this.compilerConfig?.resourceDir);
      installGccCompatibilityHeaders(this.memfs);
    });
    this.ready = Promise.all([clangReady, lldReady, fileSystemReady]).then(() => void 0);
  }
  hostLog(message) {
    if (!this.log)
      return;
    const yellowArrow = `${yellow}>${normal} `;
    this.stdout(`${yellowArrow}${message}`);
  }
  beginTrace(debug2) {
    this.debug = debug2;
    this.traceStartedAt = Date.now();
  }
  trace(message) {
    if (!this.debug || !this.log)
      return;
    const elapsed = Date.now() - this.traceStartedAt;
    this.stdout(`\x1B[2m[debug +${elapsed}ms] ${message}\x1B[0m
`);
  }
  async hostLogAsync(message, promise) {
    const start = +/* @__PURE__ */ new Date();
    this.hostLog(`${message}...`);
    const result = await promise;
    const end = +/* @__PURE__ */ new Date();
    if (this.log)
      this.stdout(" done.");
    if (this.showTiming)
      this.stdout(` ${green}(${end - start}ms)${normal}
`);
    if (this.log)
      this.stdout("\n");
    return result;
  }
  async getModule(name, progress, signal) {
    if (this.moduleCache[name])
      return this.moduleCache[name];
    const module = await this.hostLogAsync(`Fetching and compiling ${name}`, compile(name, progress, signal, this.maxAssetBytes));
    this.moduleCache[name] = module;
    return module;
  }
  addWorkspaceDirectories(path, addedDirectories = /* @__PURE__ */ new Set()) {
    const parts = normalizeWorkspacePath(path).split("/").slice(0, -1);
    let directory = "";
    for (const part of parts) {
      directory = directory ? `${directory}/${part}` : part;
      if (!addedDirectories.has(directory)) {
        this.memfs.addDirectory(directory);
        addedDirectories.add(directory);
      }
    }
  }
  addWorkspaceFiles(files = [], activePath = "") {
    const addedDirectories = /* @__PURE__ */ new Set();
    const normalizedActivePath = normalizeWorkspacePath(activePath);
    for (const file of files) {
      const safePath = normalizeWorkspacePath(file.path);
      if (!safePath || safePath === normalizedActivePath)
        continue;
      this.addWorkspaceDirectories(safePath, addedDirectories);
      this.memfs.addFile(safePath, toUtf8(file.content));
    }
  }
  async compile(options) {
    const input = normalizeWorkspacePath(options.input || "main.cc") || "main.cc";
    let source = options.code;
    const obj = options.obj;
    const language = options.language === "C" ? "C" : options.language === "OBJC" ? "OBJC" : "CPP";
    const compileArgs = options.compileArgs ?? options.args ?? [];
    const { languageArg, standardArg } = resolveClangLanguageArgs(language, options);
    const debugMode = resolveDebugMode(options);
    const traceDebug = debugMode === "trace";
    const lldbDebug = debugMode === "lldb";
    if (lldbDebug) {
      for (const argument of compileArgs) {
        if (typeof argument !== "string") {
          throw new TypeError("LLDB compile arguments must be strings");
        }
        if (lldbForbiddenCompileArgs.has(argument) || lldbForbiddenCompileArgPrefixes.some((prefix) => argument.startsWith(prefix))) {
          throw new Error(`LLDB compile argument ${JSON.stringify(argument)} cannot change the WAMR debug target profile`);
        }
      }
    }
    const opt = debugMode === "none" ? options.opt || "2" : "0";
    if (traceDebug) {
      const lines = source.split("\n");
      let parsingBlockComment = false;
      const analysisLines = lines.map((line) => {
        const masked = maskDebugSyntax(line, parsingBlockComment);
        parsingBlockComment = masked.inBlockComment;
        return masked.line;
      });
      const expectsUnbracedBody = (normalized) => {
        if (/^(?:do|else)$/.test(normalized))
          return true;
        if (!/^(?:else\s+)?(?:if|for|while)\s*\(/.test(normalized))
          return false;
        const openIndex = normalized.indexOf("(");
        let parenDepth = 0;
        for (let index = openIndex; index < normalized.length; index += 1) {
          if (normalized[index] === "(")
            parenDepth += 1;
          if (normalized[index] === ")") {
            parenDepth -= 1;
            if (parenDepth === 0)
              return normalized.slice(index + 1).trim() === "";
          }
        }
        return false;
      };
      const unsafeStandaloneInstrumentationLines = /* @__PURE__ */ new Set();
      let nextSignificantLineIsUnbracedBody = false;
      let unbracedBodyContinues = false;
      for (let index = 0; index < analysisLines.length; index += 1) {
        const normalized = analysisLines[index].trim();
        if (!normalized)
          continue;
        const continuingUnbracedBody = unbracedBodyContinues;
        let suppressStandaloneInstrumentation = continuingUnbracedBody;
        if (continuingUnbracedBody && normalized.includes(";")) {
          unbracedBodyContinues = false;
        }
        if (nextSignificantLineIsUnbracedBody) {
          nextSignificantLineIsUnbracedBody = false;
          if (normalized !== "{") {
            suppressStandaloneInstrumentation = true;
            if (!normalized.includes(";") && !normalized.includes("{") && !expectsUnbracedBody(normalized)) {
              unbracedBodyContinues = true;
            }
          }
        }
        if (/^while\s*\(.*\)\s*;$/.test(normalized)) {
          suppressStandaloneInstrumentation = true;
        }
        if (suppressStandaloneInstrumentation) {
          unsafeStandaloneInstrumentationLines.add(index);
        }
        if (expectsUnbracedBody(normalized)) {
          nextSignificantLineIsUnbracedBody = true;
        }
      }
      let braceDepth = 0;
      let functionDepth = 0;
      let currentFunctionId = 0;
      let nextFunctionId = 1;
      let nextVariableSlot = 1;
      let currentFunctionVariables = /* @__PURE__ */ new Map();
      let globalVariables = /* @__PURE__ */ new Map();
      let currentFunctionContainers = /* @__PURE__ */ new Map();
      let pendingFunctionHeader;
      const debugStructTypes = /* @__PURE__ */ new Map();
      let structName = "";
      let structFields = [];
      let structInBlockComment = false;
      for (const rawLine of lines) {
        let structLine = rawLine;
        if (structInBlockComment) {
          const commentEnd = structLine.indexOf("*/");
          if (commentEnd === -1)
            continue;
          structLine = structLine.slice(commentEnd + 2);
          structInBlockComment = false;
        }
        const commentStart = structLine.indexOf("/*");
        if (commentStart !== -1) {
          const commentEnd = structLine.indexOf("*/", commentStart + 2);
          if (commentEnd === -1) {
            structInBlockComment = true;
            structLine = structLine.slice(0, commentStart);
          } else {
            structLine = structLine.slice(0, commentStart) + structLine.slice(commentEnd + 2);
          }
        }
        const lineComment = structLine.indexOf("//");
        if (lineComment !== -1)
          structLine = structLine.slice(0, lineComment);
        const normalizedStructLine = structLine.trim();
        if (!structName) {
          const structMatch = normalizedStructLine.match(/^struct\s+([A-Za-z_]\w*)\s*\{$/);
          if (structMatch?.[1]) {
            structName = structMatch[1];
            structFields = [];
          }
          continue;
        }
        if (normalizedStructLine === "};") {
          let structOffset = 0;
          let structAlignment = 1;
          const resolvedFields = [];
          for (const field of structFields) {
            const fieldSize = field.kind === "double" ? 8 : field.kind === "bool" || field.kind === "char" ? 1 : 4;
            if (structOffset % fieldSize !== 0) {
              structOffset += fieldSize - structOffset % fieldSize;
            }
            resolvedFields.push({
              name: field.name,
              kind: field.kind,
              offset: structOffset
            });
            structOffset += fieldSize;
            structAlignment = Math.max(structAlignment, fieldSize);
          }
          if (structOffset % structAlignment !== 0) {
            structOffset += structAlignment - structOffset % structAlignment;
          }
          debugStructTypes.set(structName, {
            fields: resolvedFields,
            size: Math.max(structOffset, 1)
          });
          structName = "";
          structFields = [];
          continue;
        }
        const structFieldMatch = normalizedStructLine.match(/^(?:const\s+)?(?:(?:unsigned|signed)\s+)?(?:(?:short|long long|long)\s+)?(int|float|double|bool|char)\s+(.+);$/);
        if (!structFieldMatch)
          continue;
        for (const declaration of structFieldMatch[2].split(",")) {
          const declarator = declaration.split("=")[0]?.trim() || "";
          if (!declarator || /[*&\[]/.test(declarator))
            continue;
          const name = declarator.match(/([A-Za-z_]\w*)\s*$/)?.[1];
          if (!name)
            continue;
          structFields.push({
            name,
            kind: structFieldMatch[1]
          });
        }
      }
      this.debugVariableMetadata = {};
      this.debugGlobalMetadata = [];
      this.debugFunctionMetadata = {};
      const globalInitialization = [];
      const debugLinkage = language === "CPP" ? 'extern "C" ' : "";
      const debugDeclarations = [
        `${debugLinkage}__attribute__((import_module("env"), import_name("__wasm_idle_debug_enter"))) void __wasm_idle_debug_enter(int functionId, int line);`,
        `${debugLinkage}__attribute__((import_module("env"), import_name("__wasm_idle_debug_leave"))) void __wasm_idle_debug_leave(int functionId);`,
        `${debugLinkage}__attribute__((import_module("env"), import_name("__wasm_idle_debug_value_num"))) void __wasm_idle_debug_value_num(int functionId, int slot, double value);`,
        `${debugLinkage}__attribute__((import_module("env"), import_name("__wasm_idle_debug_value_bool"))) void __wasm_idle_debug_value_bool(int functionId, int slot, int value);`,
        `${debugLinkage}__attribute__((import_module("env"), import_name("__wasm_idle_debug_value_addr"))) void __wasm_idle_debug_value_addr(int functionId, int slot, int value);`,
        `${debugLinkage}__attribute__((import_module("env"), import_name("__wasm_idle_debug_value_text"))) void __wasm_idle_debug_value_text(int functionId, int slot, const char* ptr, int len);`,
        `${debugLinkage}__attribute__((import_module("env"), import_name("__wasm_idle_debug_line"))) void __wasm_idle_debug_line(int functionId, int line);`
      ];
      const instrumented = language === "CPP" ? [
        "#include <cstdio>",
        "#include <iostream>",
        "#include <map>",
        "#include <set>",
        "#include <string>",
        "#include <type_traits>",
        "#include <vector>",
        ...debugDeclarations,
        "template <typename T>",
        "static inline std::string __wasm_idle_debug_format_value(const T& value) {",
        '    if constexpr (std::is_same_v<T, bool>) return value ? "true" : "false";',
        `    else if constexpr (std::is_same_v<T, char>) return std::string("'") + value + "'";`,
        "    else if constexpr (std::is_same_v<T, signed char> || std::is_same_v<T, unsigned char>) return std::to_string((int)value);",
        "    else if constexpr (std::is_integral_v<T> || std::is_floating_point_v<T>) return std::to_string(value);",
        '    else return "?";',
        "}",
        "template <typename T>",
        "static inline void __wasm_idle_debug_emit_vector(int functionId, int slot, const std::vector<T>& values) {",
        '    std::string text = "[";',
        "    int count = 0;",
        "    for (const auto& value : values) {",
        '        if (count > 0) text += ", ";',
        '        if (count >= 8) { text += "..."; break; }',
        "        text += __wasm_idle_debug_format_value(value);",
        "        count += 1;",
        "    }",
        '    text += "]";',
        "    __wasm_idle_debug_value_text(functionId, slot, text.c_str(), (int)text.size());",
        "}",
        "template <typename T>",
        "static inline void __wasm_idle_debug_emit_set(int functionId, int slot, const std::set<T>& values) {",
        '    std::string text = "{";',
        "    int count = 0;",
        "    for (const auto& value : values) {",
        '        if (count > 0) text += ", ";',
        '        if (count >= 8) { text += "..."; break; }',
        "        text += __wasm_idle_debug_format_value(value);",
        "        count += 1;",
        "    }",
        '    text += "}";',
        "    __wasm_idle_debug_value_text(functionId, slot, text.c_str(), (int)text.size());",
        "}",
        "template <typename K, typename V>",
        "static inline void __wasm_idle_debug_emit_map(int functionId, int slot, const std::map<K, V>& values) {",
        '    std::string text = "{";',
        "    int count = 0;",
        "    for (const auto& entry : values) {",
        '        if (count > 0) text += ", ";',
        '        if (count >= 8) { text += "..."; break; }',
        "        text += __wasm_idle_debug_format_value(entry.first);",
        '        text += ": ";',
        "        text += __wasm_idle_debug_format_value(entry.second);",
        "        count += 1;",
        "    }",
        '    text += "}";',
        "    __wasm_idle_debug_value_text(functionId, slot, text.c_str(), (int)text.size());",
        "}"
      ] : ["#include <stdio.h>", ...debugDeclarations];
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const indent = line.match(/^\s*/)?.[0] || "";
        let rewrittenLine = line;
        const analysisLine = analysisLines[index];
        const normalized = analysisLine.trim();
        const suppressStandaloneInstrumentation = unsafeStandaloneInstrumentationLines.has(index);
        const inFunctionBody = functionDepth > 0 && braceDepth >= functionDepth;
        const isTopLevelDeclarationContext = functionDepth === 0 && braceDepth === 0 && !normalized.includes("(") && !normalized.startsWith("#");
        const controlHeaderWithoutInlineBlock = /^(while|if|for)\s*\(/.test(normalized) && !normalized.includes("{");
        const leadingInstrumentation = [];
        const trailingInstrumentation = [];
        const declaredContainerNames = /* @__PURE__ */ new Set();
        const globalDeclarationMatch = isTopLevelDeclarationContext && normalized.match(/^(?:const\s+)?(?:(?:unsigned|signed)\s+)?(?:(?:short|long long|long)\s+)?(int|float|double|bool|char)\s+(.+);$/);
        if (globalDeclarationMatch) {
          const kind = globalDeclarationMatch[1] === "bool" ? "bool" : "number";
          const declarations = [];
          let declarationBuffer = "";
          let declarationBraceDepth = 0;
          for (const character of globalDeclarationMatch[2]) {
            if (character === "," && declarationBraceDepth === 0) {
              if (declarationBuffer.trim())
                declarations.push(declarationBuffer.trim());
              declarationBuffer = "";
              continue;
            }
            if (character === "{")
              declarationBraceDepth += 1;
            if (character === "}")
              declarationBraceDepth = Math.max(0, declarationBraceDepth - 1);
            declarationBuffer += character;
          }
          if (declarationBuffer.trim())
            declarations.push(declarationBuffer.trim());
          for (const declaration of declarations) {
            const [left] = declaration.split("=");
            const declarator = left?.trim() || "";
            if (/[*&\[]/.test(declarator))
              continue;
            const name = declarator.match(/([A-Za-z_]\w*)\s*$/)?.[1];
            if (!name)
              continue;
            const slot = nextVariableSlot++;
            globalVariables.set(name, {
              slot,
              kind,
              fromLine: index + 1,
              toLine: Number.MAX_SAFE_INTEGER
            });
            this.debugGlobalMetadata = [
              ...this.debugGlobalMetadata,
              {
                slot,
                name,
                kind,
                fromLine: index + 1,
                toLine: Number.MAX_SAFE_INTEGER
              }
            ];
            globalInitialization.push(`${kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(0, ${slot}, ${name});`);
          }
        }
        const globalStructArrayMatch = isTopLevelDeclarationContext && normalized.match(/^(?:const\s+)?([A-Za-z_]\w*)\s+([A-Za-z_]\w*)\s*\[(\d+)\]\s*(?:=.*)?;$/);
        if (globalStructArrayMatch) {
          const structType = debugStructTypes.get(globalStructArrayMatch[1]);
          if (structType) {
            const slot = nextVariableSlot++;
            this.debugGlobalMetadata = [
              ...this.debugGlobalMetadata,
              {
                slot,
                name: globalStructArrayMatch[2],
                kind: "array",
                length: Number(globalStructArrayMatch[3]),
                dimensions: [Number(globalStructArrayMatch[3])],
                structFields: structType.fields,
                structSize: structType.size,
                fromLine: index + 1,
                toLine: Number.MAX_SAFE_INTEGER
              }
            ];
            globalInitialization.push(`__wasm_idle_debug_value_addr(0, ${slot}, (int)((unsigned long long)(${globalStructArrayMatch[2]})));`);
          }
        }
        if (inFunctionBody && !suppressStandaloneInstrumentation && normalized && !normalized.startsWith("#") && normalized !== "{" && normalized !== "}" && !normalized.startsWith("else") && !normalized.startsWith("case ") && normalized !== "case" && !normalized.startsWith("default") && !normalized.startsWith("catch") && !/^(public|private|protected)\s*:/.test(normalized) && !normalized.endsWith(":") && !normalized.includes(" else ")) {
          leadingInstrumentation.push(`${indent}__wasm_idle_debug_line(${currentFunctionId}, ${index + 1});`);
          const declarationMatch = normalized.match(/^(?:const\s+)?(?:(?:unsigned|signed)\s+)?(?:(?:short|long long|long)\s+)?(int|float|double|bool|char)\s+(.+);$/);
          const containerDeclarationMatch = normalized.match(/^(?:const\s+)?(?:(?:std::)?(vector|set|map))\s*<(.+)>\s+([A-Za-z_]\w*)\s*(?:=.*)?;$/);
          if (containerDeclarationMatch && currentFunctionId) {
            const slot = nextVariableSlot++;
            const container = containerDeclarationMatch[1];
            const name = containerDeclarationMatch[3];
            declaredContainerNames.add(name);
            currentFunctionContainers.set(name, {
              slot,
              container,
              fromLine: index + 1,
              toLine: Number.MAX_SAFE_INTEGER
            });
            this.debugVariableMetadata[currentFunctionId] = [
              ...this.debugVariableMetadata[currentFunctionId] || [],
              {
                slot,
                name,
                kind: "text",
                fromLine: index + 1,
                toLine: Number.MAX_SAFE_INTEGER
              }
            ];
            trailingInstrumentation.push(`${indent}__wasm_idle_debug_emit_${container}(${currentFunctionId}, ${slot}, ${name});`);
          }
          if (declarationMatch && currentFunctionId) {
            const kind = declarationMatch[1] === "bool" ? "bool" : "number";
            const declarations = [];
            let declarationBuffer = "";
            let declarationParenDepth = 0;
            let declarationBraceDepth = 0;
            for (const character of declarationMatch[2]) {
              if (character === "," && declarationParenDepth === 0 && declarationBraceDepth === 0) {
                if (declarationBuffer.trim())
                  declarations.push(declarationBuffer.trim());
                declarationBuffer = "";
                continue;
              }
              if (character === "(")
                declarationParenDepth += 1;
              if (character === ")")
                declarationParenDepth = Math.max(0, declarationParenDepth - 1);
              if (character === "{")
                declarationBraceDepth += 1;
              if (character === "}")
                declarationBraceDepth = Math.max(0, declarationBraceDepth - 1);
              declarationBuffer += character;
            }
            if (declarationBuffer.trim())
              declarations.push(declarationBuffer.trim());
            for (const declaration of declarations) {
              const [left] = declaration.split("=");
              const declarator = left?.trim() || "";
              const arrayDimensions = [];
              for (const match of declarator.matchAll(/\[(\d+)\]/g)) {
                arrayDimensions.push(Number(match[1]));
              }
              const arrayName = declarator.match(/([A-Za-z_]\w*)\s*(?=\[\d+\])/);
              if (arrayDimensions.length && arrayName) {
                const slot = nextVariableSlot++;
                this.debugVariableMetadata[currentFunctionId] = [
                  ...this.debugVariableMetadata[currentFunctionId] || [],
                  {
                    slot,
                    name: arrayName[1],
                    kind: "array",
                    elementKind: declarationMatch[1],
                    length: arrayDimensions[0],
                    dimensions: arrayDimensions,
                    fromLine: index + 1,
                    toLine: Number.MAX_SAFE_INTEGER
                  }
                ];
                trailingInstrumentation.push(`${indent}__wasm_idle_debug_value_addr(${currentFunctionId}, ${slot}, (int)((unsigned long long)(${arrayName[1]})));`);
                continue;
              }
              if (/[*&]/.test(declarator))
                continue;
              const name = declarator.match(/([A-Za-z_]\w*)\s*(?:\[[^\]]*\])?$/)?.[1];
              if (!name)
                continue;
              if (!currentFunctionVariables.has(name)) {
                const slot = nextVariableSlot++;
                currentFunctionVariables.set(name, {
                  slot,
                  kind,
                  fromLine: index + 1,
                  toLine: Number.MAX_SAFE_INTEGER
                });
                this.debugVariableMetadata[currentFunctionId] = [
                  ...this.debugVariableMetadata[currentFunctionId] || [],
                  {
                    slot,
                    name,
                    kind,
                    fromLine: index + 1,
                    toLine: Number.MAX_SAFE_INTEGER
                  }
                ];
              }
              if (declaration.includes("=")) {
                const variable = currentFunctionVariables.get(name);
                if (variable) {
                  trailingInstrumentation.push(`${indent}${variable.kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(${currentFunctionId}, ${variable.slot}, ${name});`);
                }
              }
            }
          }
          const forDeclarationMatch = normalized.match(/^for\s*\(\s*(?:const\s+)?(?:(?:unsigned|signed)\s+)?(?:(?:short|long long|long)\s+)?(int|float|double|bool|char)\s+([A-Za-z_]\w*)\s*=/);
          if (forDeclarationMatch && currentFunctionId) {
            const kind = forDeclarationMatch[1] === "bool" ? "bool" : "number";
            const name = forDeclarationMatch[2];
            if (!currentFunctionVariables.has(name)) {
              const slot = nextVariableSlot++;
              currentFunctionVariables.set(name, {
                slot,
                kind,
                fromLine: index + 1,
                toLine: Number.MAX_SAFE_INTEGER
              });
              this.debugVariableMetadata[currentFunctionId] = [
                ...this.debugVariableMetadata[currentFunctionId] || [],
                {
                  slot,
                  name,
                  kind,
                  fromLine: index + 1,
                  toLine: Number.MAX_SAFE_INTEGER
                }
              ];
            }
          }
          if (!controlHeaderWithoutInlineBlock) {
            for (const [name, container] of currentFunctionContainers) {
              if (declaredContainerNames.has(name))
                continue;
              const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              if (!new RegExp(`\\b${escapedName}\\b`).test(normalized))
                continue;
              trailingInstrumentation.push(`${indent}__wasm_idle_debug_emit_${container.container}(${currentFunctionId}, ${container.slot}, ${name});`);
            }
            for (const [name, variable] of currentFunctionVariables) {
              const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              if (normalized.startsWith("for") && variable.toLine === index + 1)
                continue;
              if (new RegExp(`(?:^|[^\\w])(?:\\+\\+|--)\\s*${escapedName}\\b`).test(normalized) || new RegExp(`\\b${escapedName}\\s*(?:(?:<<|>>|[+\\-*/%&|^])?=|\\+\\+|--)`).test(normalized) || new RegExp(`&\\s*${escapedName}\\b`).test(normalized) || new RegExp(`\\b(?:cin|std::cin)\\b[^;]*>>\\s*${escapedName}\\b`).test(normalized)) {
                trailingInstrumentation.push(`${indent}${variable.kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(${currentFunctionId}, ${variable.slot}, ${name});`);
              }
            }
            for (const [name, variable] of globalVariables) {
              if (currentFunctionVariables.has(name) || currentFunctionContainers.has(name))
                continue;
              const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              if (new RegExp(`(?:^|[^\\w])(?:\\+\\+|--)\\s*${escapedName}\\b`).test(normalized) || new RegExp(`\\b${escapedName}\\s*(?:(?:<<|>>|[+\\-*/%&|^])?=|\\+\\+|--)`).test(normalized) || new RegExp(`&\\s*${escapedName}\\b`).test(normalized) || new RegExp(`\\b(?:cin|std::cin)\\b[^;]*>>\\s*${escapedName}\\b`).test(normalized)) {
                trailingInstrumentation.push(`${indent}${variable.kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(0, ${variable.slot}, ${name});`);
              }
            }
          }
          if (/^return\b/.test(normalized))
            leadingInstrumentation.push(`${indent}__wasm_idle_debug_leave(${currentFunctionId});`);
        }
        if (functionDepth > 0 && braceDepth === functionDepth && normalized === "}") {
          leadingInstrumentation.push(`${indent}__wasm_idle_debug_leave(${currentFunctionId});`);
        }
        if (inFunctionBody && currentFunctionId && (/^(while|if)\s*\(/.test(normalized) || /^for\s*\(/.test(normalized))) {
          const keywordMatch = normalized.match(/^(while|if|for)\b/);
          const keyword = keywordMatch?.[1];
          const keywordIndex = line.indexOf(keyword || "");
          const openIndex = keywordIndex >= 0 ? line.indexOf("(", keywordIndex) : -1;
          if (openIndex >= 0) {
            let closeIndex = -1;
            let parenDepth = 0;
            for (let cursor = openIndex; cursor < line.length; cursor += 1) {
              const character = line[cursor];
              if (character === "(")
                parenDepth += 1;
              if (character === ")") {
                parenDepth -= 1;
                if (parenDepth === 0) {
                  closeIndex = cursor;
                  break;
                }
              }
              for (const [name, variable] of globalVariables) {
                if (currentFunctionVariables.has(name) || currentFunctionContainers.has(name))
                  continue;
                const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                if (!controlHeaderWithoutInlineBlock && (new RegExp(`(?:^|[^\\w])(?:\\+\\+|--)\\s*${escapedName}\\b`).test(normalized) || new RegExp(`\\b${escapedName}\\s*(?:(?:<<|>>|[+\\-*/%&|^])?=|\\+\\+|--)`).test(normalized) || new RegExp(`&\\s*${escapedName}\\b`).test(normalized))) {
                  trailingInstrumentation.push(`${indent}${variable.kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(0, ${variable.slot}, ${name});`);
                }
              }
            }
            if (closeIndex > openIndex) {
              const conditionSource = line.slice(openIndex + 1, closeIndex);
              if (keyword === "for") {
                const segments = [];
                let segmentBuffer = "";
                let segmentDepth = 0;
                for (const character of conditionSource) {
                  if (character === ";" && segmentDepth === 0) {
                    segments.push(segmentBuffer);
                    segmentBuffer = "";
                    continue;
                  }
                  if (character === "(")
                    segmentDepth += 1;
                  if (character === ")")
                    segmentDepth = Math.max(0, segmentDepth - 1);
                  segmentBuffer += character;
                }
                segments.push(segmentBuffer);
                if (segments.length === 3 && segments[1]?.trim()) {
                  const initSource = segments[0].trim();
                  const updateSource = segments[2].trim();
                  const initHooks = [];
                  const conditionHooks = [];
                  const updateHooks = [];
                  const initLooksLikeDeclaration = /^(?:const\s+)?(?:(?:unsigned|signed)\s+)?(?:(?:short|long long|long)\s+)?(?:int|float|double|bool|char)\b/.test(initSource);
                  for (const [name, variable] of currentFunctionVariables) {
                    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    const mutationPattern = new RegExp(`(?:^|[^\\w])(?:\\+\\+|--)\\s*${escapedName}\\b|\\b${escapedName}\\s*(?:(?:<<|>>|[+\\-*/%&|^])?=|\\+\\+|--)`);
                    if (!initLooksLikeDeclaration && mutationPattern.test(initSource)) {
                      initHooks.push(`${variable.kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(${currentFunctionId}, ${variable.slot}, ${name})`);
                    }
                    if (initLooksLikeDeclaration && mutationPattern.test(initSource)) {
                      conditionHooks.push(`${variable.kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(${currentFunctionId}, ${variable.slot}, ${name})`);
                    }
                    if (mutationPattern.test(updateSource)) {
                      updateHooks.push(`${variable.kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(${currentFunctionId}, ${variable.slot}, ${name})`);
                    }
                  }
                  const instrumentedInit = initHooks.length && initSource ? `(${initSource}, ${initHooks.join(", ")})` : segments[0];
                  const instrumentedUpdate = updateHooks.length && updateSource ? `(${updateSource}, ${updateHooks.join(", ")})` : segments[2];
                  rewrittenLine = line.slice(0, openIndex + 1) + `${instrumentedInit}; (${conditionHooks.length ? `${conditionHooks.join(", ")}, ` : ""}__wasm_idle_debug_line(${currentFunctionId}, ${index + 1}), (${segments[1].trim()})); ${instrumentedUpdate}` + line.slice(closeIndex);
                }
              } else {
                const conditionMutationHooks = [];
                if (controlHeaderWithoutInlineBlock) {
                  for (const [name, variable] of currentFunctionVariables) {
                    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    const mutationPattern = new RegExp(`(?:^|[^\\w])(?:\\+\\+|--)\\s*${escapedName}\\b|\\b${escapedName}\\s*(?:(?:<<|>>|[+\\-*/%&|^])?=|\\+\\+|--)`);
                    if (mutationPattern.test(conditionSource)) {
                      conditionMutationHooks.push(`${variable.kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(${currentFunctionId}, ${variable.slot}, ${name})`);
                    }
                  }
                  for (const [name, variable] of globalVariables) {
                    if (currentFunctionVariables.has(name) || currentFunctionContainers.has(name))
                      continue;
                    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    const mutationPattern = new RegExp(`(?:^|[^\\w])(?:\\+\\+|--)\\s*${escapedName}\\b|\\b${escapedName}\\s*(?:(?:<<|>>|[+\\-*/%&|^])?=|\\+\\+|--)`);
                    if (mutationPattern.test(conditionSource)) {
                      conditionMutationHooks.push(`${variable.kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(0, ${variable.slot}, ${name})`);
                    }
                  }
                }
                const instrumentedCondition = conditionMutationHooks.length ? `((${conditionSource.trim()}) ? (${conditionMutationHooks.join(", ")}, 1) : (${conditionMutationHooks.join(", ")}, 0))` : `(${conditionSource.trim()})`;
                rewrittenLine = line.slice(0, openIndex + 1) + `(__wasm_idle_debug_line(${currentFunctionId}, ${index + 1}), ${instrumentedCondition})` + line.slice(closeIndex);
              }
            }
          }
        }
        instrumented.push(...leadingInstrumentation);
        instrumented.push(rewrittenLine);
        instrumented.push(...trailingInstrumentation);
        const startsInlineFunctionBody = functionDepth === 0 && normalized.includes("(") && normalized.includes(")") && normalized.includes("{") && (analysisLine.match(/{/g) || []).length > (analysisLine.match(/}/g) || []).length && !/^(if|for|while|switch|catch)\b/.test(normalized) && !/^(class|struct|namespace|enum|union)\b/.test(normalized);
        const startsPendingFunctionBody = functionDepth === 0 && !!pendingFunctionHeader && normalized === "{";
        braceDepth += (analysisLine.match(/{/g) || []).length;
        braceDepth -= (analysisLine.match(/}/g) || []).length;
        if (startsInlineFunctionBody || startsPendingFunctionBody) {
          functionDepth = braceDepth;
          currentFunctionId = nextFunctionId++;
          let functionName = "anonymous";
          const objectiveCMethod = language === "OBJC" && startsInlineFunctionBody ? normalized.match(/^([-+])\s*\([^)]*\)\s*([A-Za-z_]\w*)/) : null;
          if (startsInlineFunctionBody) {
            const beforeParen = normalized.slice(0, normalized.indexOf("(")).trim();
            functionName = beforeParen.split(/\s+/).pop() || functionName;
            if (objectiveCMethod) {
              functionName = `${objectiveCMethod[1]}${objectiveCMethod[2]}`;
            }
          } else if (pendingFunctionHeader) {
            functionName = pendingFunctionHeader.functionName || functionName;
          }
          this.debugFunctionMetadata[currentFunctionId] = functionName;
          nextVariableSlot = 1;
          currentFunctionVariables = /* @__PURE__ */ new Map();
          currentFunctionContainers = /* @__PURE__ */ new Map();
          instrumented.push(`${indent}    __wasm_idle_debug_enter(${currentFunctionId}, ${index + 1});`);
          if (functionName === "main") {
            if (language === "CPP") {
              instrumented.push(`${indent}    std::cout.setf(std::ios::unitbuf);`);
              instrumented.push(`${indent}    std::cerr.setf(std::ios::unitbuf);`);
            }
            const nullPointer = language === "CPP" ? "nullptr" : "NULL";
            instrumented.push(`${indent}    setvbuf(stdout, ${nullPointer}, _IONBF, 0);`);
            instrumented.push(`${indent}    setvbuf(stderr, ${nullPointer}, _IONBF, 0);`);
          }
          const parameterSource = startsInlineFunctionBody ? objectiveCMethod ? "" : normalized.slice(normalized.indexOf("(") + 1, normalized.lastIndexOf(")")) : pendingFunctionHeader?.parameters || "";
          for (const parameter of parameterSource.split(",").map((value) => value.trim()).filter(Boolean)) {
            const cleaned = parameter.split("=")[0]?.trim() || "";
            const containerParameterMatch = cleaned.match(/^(?:const\s+)?(?:(?:std::)?(vector|set|map)\s*<.+>)\s*&?\s*([A-Za-z_]\w*)\s*$/);
            if (containerParameterMatch) {
              const slot2 = nextVariableSlot++;
              const container = containerParameterMatch[1];
              const name2 = containerParameterMatch[2];
              currentFunctionContainers.set(name2, {
                slot: slot2,
                container,
                fromLine: index + 1,
                toLine: Number.MAX_SAFE_INTEGER
              });
              this.debugVariableMetadata[currentFunctionId] = [
                ...this.debugVariableMetadata[currentFunctionId] || [],
                {
                  slot: slot2,
                  name: name2,
                  kind: "text",
                  fromLine: index + 1,
                  toLine: Number.MAX_SAFE_INTEGER
                }
              ];
              instrumented.push(`${indent}    __wasm_idle_debug_emit_${container}(${currentFunctionId}, ${slot2}, ${name2});`);
              continue;
            }
            const parameterArrayDimensions = [];
            for (const match of cleaned.matchAll(/\[(\d+)\]/g)) {
              parameterArrayDimensions.push(Number(match[1]));
            }
            const parameterArrayName = cleaned.match(/([A-Za-z_]\w*)\s*(?=\[\d+\])/);
            if (parameterArrayDimensions.length && parameterArrayName && /\b(int|float|double|bool|char)\b/.test(cleaned)) {
              const slot2 = nextVariableSlot++;
              this.debugVariableMetadata[currentFunctionId] = [
                ...this.debugVariableMetadata[currentFunctionId] || [],
                {
                  slot: slot2,
                  name: parameterArrayName[1],
                  kind: "array",
                  elementKind: cleaned.match(/\b(int|float|double|bool|char)\b/)?.[1] || "int",
                  length: parameterArrayDimensions[0],
                  dimensions: parameterArrayDimensions,
                  fromLine: index + 1,
                  toLine: Number.MAX_SAFE_INTEGER
                }
              ];
              instrumented.push(`${indent}    __wasm_idle_debug_value_addr(${currentFunctionId}, ${slot2}, (int)((unsigned long long)(${parameterArrayName[1]})));`);
              continue;
            }
            if (/[*&\[]/.test(cleaned))
              continue;
            const nameMatch = cleaned.match(/([A-Za-z_]\w*)\s*(?:\[[^\]]*\])?\s*$/);
            if (!nameMatch)
              continue;
            const name = nameMatch[1];
            const kind = /\bbool\b/.test(cleaned) ? "bool" : /\b(?:int|float|double|char|short|long)\b/.test(cleaned) ? "number" : "";
            if (!kind)
              continue;
            const slot = nextVariableSlot++;
            currentFunctionVariables.set(name, {
              slot,
              kind,
              fromLine: index + 1,
              toLine: Number.MAX_SAFE_INTEGER
            });
            this.debugVariableMetadata[currentFunctionId] = [
              ...this.debugVariableMetadata[currentFunctionId] || [],
              {
                slot,
                name,
                kind,
                fromLine: index + 1,
                toLine: Number.MAX_SAFE_INTEGER
              }
            ];
            instrumented.push(`${indent}    ${kind === "bool" ? "__wasm_idle_debug_value_bool" : "__wasm_idle_debug_value_num"}(${currentFunctionId}, ${slot}, ${name});`);
          }
          pendingFunctionHeader = void 0;
        } else if (functionDepth === 0 && normalized.includes("(") && normalized.includes(")") && !normalized.includes("{") && !normalized.endsWith(";") && !/^(if|for|while|switch|catch)\b/.test(normalized) && !/^(class|struct|namespace|enum|union)\b/.test(normalized)) {
          const beforeParen = normalized.slice(0, normalized.indexOf("(")).trim();
          pendingFunctionHeader = {
            functionName: beforeParen.split(/\s+/).pop() || "anonymous",
            parameters: normalized.slice(normalized.indexOf("(") + 1, normalized.lastIndexOf(")"))
          };
        } else if (normalized && normalized !== "{") {
          pendingFunctionHeader = void 0;
        }
        if (functionDepth > 0 && braceDepth < functionDepth) {
          functionDepth = 0;
          currentFunctionId = 0;
          currentFunctionVariables = /* @__PURE__ */ new Map();
          currentFunctionContainers = /* @__PURE__ */ new Map();
        }
      }
      if (globalInitialization.length) {
        if (language === "CPP") {
          instrumented.push("struct __wasm_idle_debug_globals_init {");
          instrumented.push("    __wasm_idle_debug_globals_init() {");
          instrumented.push(...globalInitialization.map((line) => `        ${line}`));
          instrumented.push("    }");
          instrumented.push("} __wasm_idle_debug_globals_init_instance;");
        } else {
          instrumented.push("__attribute__((constructor)) static void __wasm_idle_debug_globals_init(void) {");
          instrumented.push(...globalInitialization.map((line) => `    ${line}`));
          instrumented.push("}");
        }
      }
      source = instrumented.join("\n");
    } else {
      this.debugVariableMetadata = {};
      this.debugGlobalMetadata = [];
      this.debugFunctionMetadata = {};
    }
    if (typeof options.transformSource === "function") {
      source = options.transformSource(source);
    }
    const code = toUtf8(source);
    await this.ready;
    if (!options.sourceAlreadyMounted) {
      this.addWorkspaceFiles(options.workspaceFiles, input);
      this.addWorkspaceDirectories(input);
      this.memfs.addFile(input, code);
    }
    this.memfs.addFile(obj, new Uint8Array(0));
    const clang2 = await this.getModule(this.assetUrls.clang);
    const clangResourceDir = this.compilerConfig?.resourceDir || defaultClangResourceDir;
    const includeArgs = clangSystemIncludePaths(language, "", clangResourceDir).flatMap((path) => ["-internal-isystem", path]);
    const compilerArgs = [
      "-cc1",
      "-triple",
      CLANG_WASI_TARGET,
      "-emit-obj",
      "-disable-free",
      "-isysroot",
      "/",
      "-resource-dir",
      clangResourceDir,
      ...includeArgs,
      ...language === "OBJC" ? ["-I."] : [],
      "-ferror-limit",
      "19",
      "-fcolor-diagnostics",
      ...lldbDebug ? [] : ["-O" + opt],
      "-o",
      obj,
      standardArg,
      "-x",
      languageArg,
      ...language === "OBJC" ? OBJECTIVE_C_RUNTIME_FLAGS : [],
      input,
      ...compileArgs,
      ...lldbDebug ? [
        "-O0",
        "-debug-info-kind=standalone",
        "-dwarf-version=4",
        "-debugger-tuning=gdb",
        "-fdebug-compilation-dir=/workspace"
      ] : []
    ];
    this.trace(`compile ${input} -> ${obj}`);
    try {
      return await this.run(clang2, true, "clang", ...compilerArgs);
    } catch (error) {
      const artifact = Uint8Array.from(this.memfs.getFileContents(obj));
      if (artifact.length > 0) {
        this.trace(`recover ${obj} after clang output stream exit`);
        return null;
      }
      throw error;
    }
  }
  async link(obj, wasm, debugModeOrLegacyDebug = "none") {
    const objects = typeof obj === "string" ? [obj] : [...obj];
    if (objects.length === 0 || objects.some((object) => typeof object !== "string" || object.length === 0)) {
      throw new TypeError("At least one nonempty object file is required for linking");
    }
    const debugMode = typeof debugModeOrLegacyDebug === "boolean" ? resolveDebugMode({ debug: debugModeOrLegacyDebug }) : resolveDebugMode({ debugMode: debugModeOrLegacyDebug });
    const stackSize = 1024 * 1024;
    const libdir = "lib/wasm32-wasi";
    const compilerRuntimeLibDir = this.compilerConfig?.compilerRuntimeLibDir || defaultCompilerRuntimeLibDir;
    const crt1 = `${libdir}/crt1.o`;
    await this.ready;
    const lld = await this.getModule(this.assetUrls.lld);
    this.trace(`link ${objects.join(", ")} -> ${wasm}`);
    return await this.run(
      lld,
      this.log,
      "wasm-ld",
      "--export-dynamic",
      ...debugMode === "trace" ? ["--allow-undefined"] : [],
      "-z",
      `stack-size=${stackSize}`,
      `-L${libdir}/noeh`,
      `-L${libdir}`,
      crt1,
      ...objects,
      "-lc",
      "-lc++",
      "-lc++abi",
      "-lm",
      `-L${compilerRuntimeLibDir}`,
      "-lclang_rt.builtins-wasm32",
      "-o",
      wasm
    );
  }
  async run(module, out, ...args) {
    return this.runWithOptions(module, out, args);
  }
  async runWithOptions(module, out, args, environ = {}, extraImports, instanceRef) {
    this.memfs.out = out;
    this.hostLog(`${args.join(" ")}
`);
    this.trace(`run ${args.join(" ")}`);
    const start = +/* @__PURE__ */ new Date();
    const app = new App(module, this.memfs, args[0], ...args.slice(1), {
      extraImports,
      instanceRef
    });
    app.environ = { ...app.environ, ...environ };
    app.trace = (message) => this.trace(message);
    app.debugSession = {
      buffer: this.debugBuffer,
      interruptBuffer: this.debugInterruptBuffer,
      watchBuffer: this.debugWatchBuffer,
      watchResultBuffer: this.debugWatchResultBuffer,
      breakpoints: new Set(this.debugBreakpoints),
      breakpointVersion: 0,
      pauseOnEntry: this.debugPauseOnEntry,
      stepArmed: this.debugPauseOnEntry,
      nextLineArmed: false,
      stepOutArmed: false,
      callDepth: 0,
      stepOutDepth: 0,
      currentFunctionId: 0,
      currentLine: 0,
      resumeSkipActive: false,
      resumeSkipFunctionId: 0,
      resumeSkipLine: 0,
      nextLineFunctionId: 0,
      nextLineLine: 0,
      variableMetadata: this.debugVariableMetadata,
      globalVariableMetadata: this.debugGlobalMetadata,
      functionMetadata: this.debugFunctionMetadata,
      frames: [],
      globalValues: /* @__PURE__ */ new Map(),
      onPause: (event) => this.onDebugEvent?.(event)
    };
    const instantiate = +/* @__PURE__ */ new Date();
    const stillRunning = await app.run();
    const end = +/* @__PURE__ */ new Date();
    if (this.log)
      this.stdout("\n");
    if (this.showTiming)
      this.stdout(`${green}(${start - instantiate}ms/${end - instantiate}ms)${normal}
`);
    return stillRunning ? app : null;
  }
  async compileLink(code, options = {}) {
    const { language = "CPP", fileName, activePath, workspaceFiles = [], args = [], compileArgs = args, debugMode: requestedDebugMode, debug: debug2, breakpoints = [], pauseOnEntry = false, cppVersion, cVersion, debugBuffer, interruptBuffer, watchBuffer, watchResultBuffer } = options;
    const debugMode = resolveDebugMode({ debugMode: requestedDebugMode, debug: debug2 });
    const normalizeRequestedPath = debugMode === "lldb" ? normalizeDwarfWorkspacePath : normalizeWorkspacePath;
    const normalizedWorkspaceFiles = workspaceFiles.map((file) => ({
      ...file,
      path: normalizeRequestedPath(file.path)
    }));
    const requestedInput = normalizeRequestedPath(activePath || "") || normalizeRequestedPath(fileName || "") || void 0;
    const { input, obj, wasm } = resolveBuildArtifactNames(language, requestedInput);
    const workspaceByPath = /* @__PURE__ */ new Map();
    for (const file of normalizedWorkspaceFiles) {
      if (!file.path)
        continue;
      if (file.path === internalBuildRoot || file.path.startsWith(`${internalBuildRoot}/`)) {
        throw new Error(`Workspace path uses reserved build namespace ${JSON.stringify(internalBuildRoot)}`);
      }
      workspaceByPath.set(file.path, file);
    }
    if (input === internalBuildRoot || input.startsWith(`${internalBuildRoot}/`)) {
      throw new Error(`Active source path uses reserved build namespace ${JSON.stringify(internalBuildRoot)}`);
    }
    workspaceByPath.set(input, { path: input, content: code });
    const workspaceSnapshot = [...workspaceByPath.values()].sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
    const translationUnits = workspaceSnapshot.filter((file) => file.path === input || workspaceTranslationUnitPattern.test(file.path));
    const traceDebug = debugMode === "trace";
    if (traceDebug && translationUnits.length > 1) {
      throw new Error("Trace debug mode does not support multiple C/C++ translation units");
    }
    this.beginTrace(traceDebug);
    this.debugBreakpoints = new Set(traceDebug ? breakpoints : []);
    this.debugPauseOnEntry = traceDebug && pauseOnEntry;
    this.debugBuffer = debugBuffer;
    this.debugInterruptBuffer = interruptBuffer;
    this.debugWatchBuffer = watchBuffer;
    this.debugWatchResultBuffer = watchResultBuffer;
    this.lastArtifactPath = wasm;
    const buildKey = JSON.stringify({
      code,
      input,
      wasm,
      language,
      compileArgs,
      workspaceFiles: workspaceSnapshot,
      cppVersion,
      cVersion,
      debugMode
    });
    if (this.lastBuildKey === buildKey) {
      this.trace(`reuse ${wasm}`);
      return this.wasm;
    }
    if (translationUnits.length === 1) {
      await this.compile({
        input,
        code,
        obj,
        language,
        compileArgs,
        workspaceFiles: normalizedWorkspaceFiles,
        cppVersion,
        cVersion,
        debugMode
      });
      await this.link(obj, wasm, debugMode);
    } else {
      await this.ready;
      this.addWorkspaceFiles(workspaceSnapshot);
      this.memfs.addDirectory(internalBuildRoot);
      this.memfs.addDirectory(`${internalBuildRoot}/objects`);
      const objects = [];
      for (const [index, unit] of translationUnits.entries()) {
        const unitObject = `${internalBuildRoot}/objects/${index.toString().padStart(4, "0")}.o`;
        objects.push(unitObject);
        await this.compile({
          input: unit.path,
          code: unit.content,
          obj: unitObject,
          language: unit.path === input ? language : unit.path.endsWith(".c") ? "C" : "CPP",
          compileArgs,
          workspaceFiles: [],
          cppVersion,
          cVersion,
          debugMode,
          sourceAlreadyMounted: true
        });
      }
      await this.link(objects, wasm, debugMode);
    }
    this.lastBuildKey = buildKey;
    const wasmBytes = Uint8Array.from(this.memfs.getFileContents(wasm));
    return this.wasm = await this.hostLogAsync(`Compiling ${wasm}`, WebAssembly.compile(wasmBytes));
  }
  async compileArtifact(code, options = {}) {
    const debugMode = resolveDebugMode(options);
    const wasm = await this.compileLink(code, options);
    const bytes = Uint8Array.from(this.memfs.getFileContents(this.lastArtifactPath));
    const language = options.language || "CPP";
    const request = {
      code,
      language,
      fileName: options.fileName,
      activePath: options.activePath,
      workspaceFiles: options.workspaceFiles,
      compileArgs: options.compileArgs,
      cppVersion: options.cppVersion,
      cVersion: options.cVersion,
      debugMode
    };
    return {
      bytes,
      wasm,
      target: "wasm32-wasi",
      format: "wasi-core-wasm",
      fileName: this.lastArtifactPath,
      language,
      ...debugMode === "trace" ? {
        debugMetadata: {
          variableMetadata: this.debugVariableMetadata,
          globalVariableMetadata: this.debugGlobalMetadata,
          functionMetadata: this.debugFunctionMetadata
        }
      } : {},
      ...debugMode === "lldb" ? {
        debug: await createDwarfDebugDescriptor(request, bytes, this.compilerConfig?.provenance)
      } : {}
    };
  }
  async compileLinkRun(code, options = {}) {
    const { language = "CPP", fileName, activePath, workspaceFiles = [], args = [], compileArgs = args, programArgs = [], debugMode: requestedDebugMode, debug: debug2, breakpoints = [], pauseOnEntry = false, cppVersion, cVersion, debugBuffer, interruptBuffer, watchBuffer, watchResultBuffer } = options;
    const debugMode = resolveDebugMode({ debugMode: requestedDebugMode, debug: debug2 });
    if (debugMode === "lldb") {
      throw new Error("compileLinkRun() cannot execute LLDB artifacts in the browser WebAssembly engine. Use compileArtifact() and @wasm-idle/llvm-core/debug instead.");
    }
    this.debug = debugMode === "trace";
    const requestedInput = normalizeWorkspacePath(activePath || "") || normalizeWorkspacePath(fileName || "") || void 0;
    const { wasm } = resolveBuildArtifactNames(language, requestedInput);
    return await this.run(await this.compileLink(code, {
      language,
      fileName,
      activePath,
      workspaceFiles,
      compileArgs,
      debugMode,
      breakpoints,
      pauseOnEntry,
      cppVersion,
      cVersion,
      debugBuffer,
      interruptBuffer,
      watchBuffer,
      watchResultBuffer
    }), true, wasm, ...programArgs);
  }
};
var runtime_default = Clang;

// node_modules/@wasm-idle/llvm-core/dist/clang/src/runtime-manifest.js
function expectObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`invalid ${label} in wasm-clang runtime manifest`);
  }
  return value;
}
function expectString(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`invalid ${label} in wasm-clang runtime manifest`);
  }
  return value;
}
function expectTarget(value, label) {
  if (value !== "wasm32-wasi") {
    throw new Error(`invalid ${label} in wasm-clang runtime manifest`);
  }
  return value;
}
function parseCompilerProvenance(value) {
  const provenance = expectObject(value, "root.compiler.provenance");
  if (provenance.name !== "clang") {
    throw new Error("invalid root.compiler.provenance.name in wasm-clang runtime manifest");
  }
  return {
    name: "clang",
    version: expectString(provenance.version, "root.compiler.provenance.version"),
    revision: expectString(provenance.revision, "root.compiler.provenance.revision")
  };
}
function parseCompilerConfig(value) {
  const compiler = expectObject(value, "root.compiler");
  const sysroot = expectObject(compiler.sysroot, "root.compiler.sysroot");
  return {
    memfs: {
      asset: expectString(expectObject(compiler.memfs, "root.compiler.memfs").asset, "root.compiler.memfs.asset"),
      argv0: expectString(expectObject(compiler.memfs, "root.compiler.memfs").argv0, "root.compiler.memfs.argv0")
    },
    clang: {
      asset: expectString(expectObject(compiler.clang, "root.compiler.clang").asset, "root.compiler.clang.asset"),
      argv0: expectString(expectObject(compiler.clang, "root.compiler.clang").argv0, "root.compiler.clang.argv0")
    },
    lld: {
      asset: expectString(expectObject(compiler.lld, "root.compiler.lld").asset, "root.compiler.lld.asset"),
      argv0: expectString(expectObject(compiler.lld, "root.compiler.lld").argv0, "root.compiler.lld.argv0")
    },
    sysroot: {
      asset: expectString(sysroot.asset, "root.compiler.sysroot.asset"),
      ...typeof sysroot.runtimeRoot === "string" ? { runtimeRoot: sysroot.runtimeRoot } : {}
    },
    ...compiler.resourceDir !== void 0 ? { resourceDir: expectString(compiler.resourceDir, "root.compiler.resourceDir") } : {},
    ...compiler.compilerRuntimeLibDir !== void 0 ? {
      compilerRuntimeLibDir: expectString(compiler.compilerRuntimeLibDir, "root.compiler.compilerRuntimeLibDir")
    } : {},
    ...typeof compiler.defaultCppStandard === "string" ? { defaultCppStandard: compiler.defaultCppStandard } : {},
    ...typeof compiler.defaultCStandard === "string" ? { defaultCStandard: compiler.defaultCStandard } : {},
    ...compiler.provenance !== void 0 ? { provenance: parseCompilerProvenance(compiler.provenance) } : {}
  };
}
function parseClangdConfig(value) {
  const clangd = expectObject(value, "root.clangd");
  return {
    js: expectString(clangd.js, "root.clangd.js"),
    wasm: expectString(clangd.wasm, "root.clangd.wasm")
  };
}
function parseTargetConfig(value, label) {
  const target = expectObject(value, label);
  const execution = expectObject(target.execution, `${label}.execution`);
  if (execution.kind !== "wasi-preview1") {
    throw new Error(`invalid ${label}.execution.kind in wasm-clang runtime manifest`);
  }
  if (target.artifactFormat !== "wasi-core-wasm") {
    throw new Error(`invalid ${label}.artifactFormat in wasm-clang runtime manifest`);
  }
  return {
    artifactFormat: "wasi-core-wasm",
    execution: {
      kind: "wasi-preview1"
    }
  };
}
function parseTargets(value) {
  const targetsObject = expectObject(value, "root.targets");
  return {
    "wasm32-wasi": parseTargetConfig(targetsObject["wasm32-wasi"], "root.targets.wasm32-wasi")
  };
}
function parseRuntimeManifest(value) {
  const root = expectObject(value, "root");
  if (root.manifestVersion !== 1) {
    throw new Error("invalid root.manifestVersion in wasm-clang runtime manifest");
  }
  return {
    manifestVersion: 1,
    version: expectString(root.version, "root.version"),
    defaultTarget: expectTarget(root.defaultTarget, "root.defaultTarget"),
    compiler: parseCompilerConfig(root.compiler),
    clangd: parseClangdConfig(root.clangd),
    targets: parseTargets(root.targets)
  };
}
async function loadRuntimeManifest(manifestUrl, fetchImpl = fetch, signal, maxBytes = DEFAULT_MAX_RUNTIME_JSON_BYTES) {
  const resolvedUrl = resolveHostedRuntimeUrl(manifestUrl, "wasm-clang runtime manifest URL");
  return parseRuntimeManifest(await fetchRuntimeJson(resolvedUrl, {
    fetchImpl,
    label: "wasm-clang runtime manifest",
    maxBytes: Math.min(maxBytes, DEFAULT_MAX_RUNTIME_JSON_BYTES),
    signal
  }));
}
function resolveRuntimeManifestUrl(baseUrl) {
  return runtimeManifestUrl(baseUrl);
}

// node_modules/@wasm-idle/llvm-core/dist/clang/src/compiler.js
function resolveMaxAssetBytes(maxAssetBytes) {
  const resolved = maxAssetBytes ?? DEFAULT_MAX_DECOMPRESSED_ASSET_BYTES;
  if (!Number.isSafeInteger(resolved) || resolved <= 0) {
    throw new TypeError("Clang maxAssetBytes must be a positive safe integer");
  }
  return resolved;
}
function toStandaloneBytes(value) {
  return value instanceof Uint8Array ? new Uint8Array(value) : new Uint8Array(value);
}
function pushRecord(records, enabled, message, level = "log") {
  if (!enabled)
    return;
  records.push({ level, message });
}
function emitProgress(request, stage, percent, message) {
  request.onProgress?.({
    stage,
    completed: Math.round(percent),
    total: 100,
    percent,
    message
  });
}
function extractCompilerDiagnostics(output) {
  const diagnostics = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^(.*?):(\d+):(?:(\d+):)?\s*(fatal error|error|warning|note):\s*(.+)$/);
    if (!match)
      continue;
    diagnostics.push({
      fileName: match[1] || void 0,
      lineNumber: Number(match[2]),
      columnNumber: match[3] ? Number(match[3]) : void 0,
      severity: match[4] === "warning" ? "warning" : match[4] === "note" ? "other" : "error",
      message: match[5]
    });
  }
  return diagnostics;
}
function createLogResult(records, enabled) {
  return enabled ? {
    logRecords: records,
    logs: records.map((record) => record.message)
  } : {};
}
async function resolveRuntimeLocation(options) {
  const maxAssetBytes = resolveMaxAssetBytes(options.maxAssetBytes);
  const runtimeBaseUrl = options.runtimeBaseUrl !== void 0 ? resolveRuntimeBaseUrl(options.runtimeBaseUrl) : resolveRuntimeBaseUrlFromManifestUrl(options.manifestUrl);
  const manifestUrl = options.manifestUrl || resolveRuntimeManifestUrl(runtimeBaseUrl);
  const manifest = options.manifest || await loadRuntimeManifest(manifestUrl, options.fetchImpl || fetch, options.signal, Math.min(maxAssetBytes, DEFAULT_MAX_RUNTIME_JSON_BYTES));
  return { manifest, maxAssetBytes, runtimeBaseUrl };
}
async function preloadBrowserClangRuntime(options) {
  if (options.signal?.aborted)
    throw options.signal.reason;
  const { manifest, maxAssetBytes, runtimeBaseUrl } = await resolveRuntimeLocation(options);
  const runtime = new runtime_default({
    stdin: () => "",
    stdout: () => {
    },
    progress: () => {
    },
    signal: options.signal,
    log: false,
    maxAssetBytes,
    runtimeBaseUrl,
    manifest
  });
  await runtime.ready;
}
async function compileClang(request, options) {
  if (options.signal?.aborted)
    throw options.signal.reason;
  if (!request.code || typeof request.code !== "string") {
    return {
      success: false,
      stderr: "wasm-clang requires a non-empty source string"
    };
  }
  if (request.target && request.target !== "wasm32-wasi") {
    return {
      success: false,
      stderr: `unsupported wasm-clang target: ${request.target}`
    };
  }
  const enabledLogs = request.log ?? options.log ?? false;
  const debugMode = resolveDebugMode(request);
  const logRecords = [];
  const compilerOutput = [];
  emitProgress(request, "bootstrap", 0, "loading runtime manifest");
  const { manifest, maxAssetBytes, runtimeBaseUrl } = await resolveRuntimeLocation(options);
  pushRecord(logRecords, enabledLogs, "[wasm-clang] runtime manifest loaded");
  let lastPercent = 0;
  const runtimeOptions = {
    stdin: () => "",
    stdout: (chunk) => compilerOutput.push(chunk),
    progress: (value) => {
      const percent = Math.round(Math.max(lastPercent, value * 100));
      lastPercent = percent;
      const stage = percent < 34 ? "bootstrap" : percent < 90 ? "compile" : "link";
      emitProgress(request, stage, percent, stage === "link" ? "linking wasm module" : stage === "compile" ? "compiling source" : "loading runtime");
    },
    log: enabledLogs,
    maxAssetBytes,
    signal: options.signal,
    showTiming: request.showTiming ?? options.showTiming ?? false,
    runtimeBaseUrl,
    manifest
  };
  const runtime = new runtime_default(runtimeOptions);
  try {
    await runtime.ready;
    pushRecord(logRecords, enabledLogs, "[wasm-clang] runtime ready");
    const wasmModule = await runtime.compileLink(request.code, {
      language: request.language || "CPP",
      fileName: request.fileName,
      activePath: request.activePath,
      workspaceFiles: request.workspaceFiles || [],
      compileArgs: request.compileArgs || [],
      debugMode,
      breakpoints: request.breakpoints,
      pauseOnEntry: request.pauseOnEntry,
      cppVersion: request.cppVersion,
      cVersion: request.cVersion
    });
    const output = compilerOutput.join("");
    const diagnostics = extractCompilerDiagnostics(output);
    const artifactBytes = toStandaloneBytes(runtime.memfs.getFileContents(runtime.lastArtifactPath));
    const artifact = {
      bytes: artifactBytes,
      wasm: wasmModule,
      target: "wasm32-wasi",
      format: "wasi-core-wasm",
      fileName: runtime.lastArtifactPath,
      language: request.language || "CPP",
      ...debugMode === "trace" ? {
        debugMetadata: {
          variableMetadata: runtime.debugVariableMetadata,
          globalVariableMetadata: runtime.debugGlobalMetadata,
          functionMetadata: runtime.debugFunctionMetadata
        }
      } : {},
      ...debugMode === "lldb" ? {
        debug: await createDwarfDebugDescriptor(request, artifactBytes, manifest.compiler.provenance)
      } : {}
    };
    emitProgress(request, "done", 100, "done");
    return {
      success: true,
      artifact,
      stdout: output,
      ...diagnostics.length ? { diagnostics } : {},
      ...createLogResult(logRecords, enabledLogs)
    };
  } catch (error) {
    if (options.signal?.aborted)
      throw options.signal.reason;
    pushRecord(logRecords, enabledLogs, error instanceof Error ? error.message : String(error), "error");
    const output = compilerOutput.join("");
    const diagnostics = extractCompilerDiagnostics(output);
    return {
      success: false,
      stdout: output,
      stderr: output || (error instanceof Error ? error.message : String(error)),
      ...diagnostics.length ? { diagnostics } : {},
      ...createLogResult(logRecords, enabledLogs)
    };
  }
}
async function createClangCompiler(options) {
  return {
    compile: (request) => compileClang(request, options)
  };
}

// node_modules/@bjorn3/browser_wasi_shim/dist/wasi_defs.js
var wasi_defs_exports = {};
__export(wasi_defs_exports, {
  ADVICE_DONTNEED: () => ADVICE_DONTNEED,
  ADVICE_NOREUSE: () => ADVICE_NOREUSE,
  ADVICE_NORMAL: () => ADVICE_NORMAL,
  ADVICE_RANDOM: () => ADVICE_RANDOM,
  ADVICE_SEQUENTIAL: () => ADVICE_SEQUENTIAL,
  ADVICE_WILLNEED: () => ADVICE_WILLNEED,
  CLOCKID_MONOTONIC: () => CLOCKID_MONOTONIC,
  CLOCKID_PROCESS_CPUTIME_ID: () => CLOCKID_PROCESS_CPUTIME_ID,
  CLOCKID_REALTIME: () => CLOCKID_REALTIME,
  CLOCKID_THREAD_CPUTIME_ID: () => CLOCKID_THREAD_CPUTIME_ID,
  Ciovec: () => Ciovec,
  Dirent: () => Dirent,
  ERRNO_2BIG: () => ERRNO_2BIG,
  ERRNO_ACCES: () => ERRNO_ACCES,
  ERRNO_ADDRINUSE: () => ERRNO_ADDRINUSE,
  ERRNO_ADDRNOTAVAIL: () => ERRNO_ADDRNOTAVAIL,
  ERRNO_AFNOSUPPORT: () => ERRNO_AFNOSUPPORT,
  ERRNO_AGAIN: () => ERRNO_AGAIN,
  ERRNO_ALREADY: () => ERRNO_ALREADY,
  ERRNO_BADF: () => ERRNO_BADF,
  ERRNO_BADMSG: () => ERRNO_BADMSG,
  ERRNO_BUSY: () => ERRNO_BUSY,
  ERRNO_CANCELED: () => ERRNO_CANCELED,
  ERRNO_CHILD: () => ERRNO_CHILD,
  ERRNO_CONNABORTED: () => ERRNO_CONNABORTED,
  ERRNO_CONNREFUSED: () => ERRNO_CONNREFUSED,
  ERRNO_CONNRESET: () => ERRNO_CONNRESET,
  ERRNO_DEADLK: () => ERRNO_DEADLK,
  ERRNO_DESTADDRREQ: () => ERRNO_DESTADDRREQ,
  ERRNO_DOM: () => ERRNO_DOM,
  ERRNO_DQUOT: () => ERRNO_DQUOT,
  ERRNO_EXIST: () => ERRNO_EXIST,
  ERRNO_FAULT: () => ERRNO_FAULT,
  ERRNO_FBIG: () => ERRNO_FBIG,
  ERRNO_HOSTUNREACH: () => ERRNO_HOSTUNREACH,
  ERRNO_IDRM: () => ERRNO_IDRM,
  ERRNO_ILSEQ: () => ERRNO_ILSEQ,
  ERRNO_INPROGRESS: () => ERRNO_INPROGRESS,
  ERRNO_INTR: () => ERRNO_INTR,
  ERRNO_INVAL: () => ERRNO_INVAL,
  ERRNO_IO: () => ERRNO_IO,
  ERRNO_ISCONN: () => ERRNO_ISCONN,
  ERRNO_ISDIR: () => ERRNO_ISDIR,
  ERRNO_LOOP: () => ERRNO_LOOP,
  ERRNO_MFILE: () => ERRNO_MFILE,
  ERRNO_MLINK: () => ERRNO_MLINK,
  ERRNO_MSGSIZE: () => ERRNO_MSGSIZE,
  ERRNO_MULTIHOP: () => ERRNO_MULTIHOP,
  ERRNO_NAMETOOLONG: () => ERRNO_NAMETOOLONG,
  ERRNO_NETDOWN: () => ERRNO_NETDOWN,
  ERRNO_NETRESET: () => ERRNO_NETRESET,
  ERRNO_NETUNREACH: () => ERRNO_NETUNREACH,
  ERRNO_NFILE: () => ERRNO_NFILE,
  ERRNO_NOBUFS: () => ERRNO_NOBUFS,
  ERRNO_NODEV: () => ERRNO_NODEV,
  ERRNO_NOENT: () => ERRNO_NOENT,
  ERRNO_NOEXEC: () => ERRNO_NOEXEC,
  ERRNO_NOLCK: () => ERRNO_NOLCK,
  ERRNO_NOLINK: () => ERRNO_NOLINK,
  ERRNO_NOMEM: () => ERRNO_NOMEM,
  ERRNO_NOMSG: () => ERRNO_NOMSG,
  ERRNO_NOPROTOOPT: () => ERRNO_NOPROTOOPT,
  ERRNO_NOSPC: () => ERRNO_NOSPC,
  ERRNO_NOSYS: () => ERRNO_NOSYS,
  ERRNO_NOTCAPABLE: () => ERRNO_NOTCAPABLE,
  ERRNO_NOTCONN: () => ERRNO_NOTCONN,
  ERRNO_NOTDIR: () => ERRNO_NOTDIR,
  ERRNO_NOTEMPTY: () => ERRNO_NOTEMPTY,
  ERRNO_NOTRECOVERABLE: () => ERRNO_NOTRECOVERABLE,
  ERRNO_NOTSOCK: () => ERRNO_NOTSOCK,
  ERRNO_NOTSUP: () => ERRNO_NOTSUP,
  ERRNO_NOTTY: () => ERRNO_NOTTY,
  ERRNO_NXIO: () => ERRNO_NXIO,
  ERRNO_OVERFLOW: () => ERRNO_OVERFLOW,
  ERRNO_OWNERDEAD: () => ERRNO_OWNERDEAD,
  ERRNO_PERM: () => ERRNO_PERM,
  ERRNO_PIPE: () => ERRNO_PIPE,
  ERRNO_PROTO: () => ERRNO_PROTO,
  ERRNO_PROTONOSUPPORT: () => ERRNO_PROTONOSUPPORT,
  ERRNO_PROTOTYPE: () => ERRNO_PROTOTYPE,
  ERRNO_RANGE: () => ERRNO_RANGE,
  ERRNO_ROFS: () => ERRNO_ROFS,
  ERRNO_SPIPE: () => ERRNO_SPIPE,
  ERRNO_SRCH: () => ERRNO_SRCH,
  ERRNO_STALE: () => ERRNO_STALE,
  ERRNO_SUCCESS: () => ERRNO_SUCCESS,
  ERRNO_TIMEDOUT: () => ERRNO_TIMEDOUT,
  ERRNO_TXTBSY: () => ERRNO_TXTBSY,
  ERRNO_XDEV: () => ERRNO_XDEV,
  EVENTRWFLAGS_FD_READWRITE_HANGUP: () => EVENTRWFLAGS_FD_READWRITE_HANGUP,
  EVENTTYPE_CLOCK: () => EVENTTYPE_CLOCK,
  EVENTTYPE_FD_READ: () => EVENTTYPE_FD_READ,
  EVENTTYPE_FD_WRITE: () => EVENTTYPE_FD_WRITE,
  Event: () => Event,
  FDFLAGS_APPEND: () => FDFLAGS_APPEND,
  FDFLAGS_DSYNC: () => FDFLAGS_DSYNC,
  FDFLAGS_NONBLOCK: () => FDFLAGS_NONBLOCK,
  FDFLAGS_RSYNC: () => FDFLAGS_RSYNC,
  FDFLAGS_SYNC: () => FDFLAGS_SYNC,
  FD_STDERR: () => FD_STDERR,
  FD_STDIN: () => FD_STDIN,
  FD_STDOUT: () => FD_STDOUT,
  FILETYPE_BLOCK_DEVICE: () => FILETYPE_BLOCK_DEVICE,
  FILETYPE_CHARACTER_DEVICE: () => FILETYPE_CHARACTER_DEVICE,
  FILETYPE_DIRECTORY: () => FILETYPE_DIRECTORY,
  FILETYPE_REGULAR_FILE: () => FILETYPE_REGULAR_FILE,
  FILETYPE_SOCKET_DGRAM: () => FILETYPE_SOCKET_DGRAM,
  FILETYPE_SOCKET_STREAM: () => FILETYPE_SOCKET_STREAM,
  FILETYPE_SYMBOLIC_LINK: () => FILETYPE_SYMBOLIC_LINK,
  FILETYPE_UNKNOWN: () => FILETYPE_UNKNOWN,
  FSTFLAGS_ATIM: () => FSTFLAGS_ATIM,
  FSTFLAGS_ATIM_NOW: () => FSTFLAGS_ATIM_NOW,
  FSTFLAGS_MTIM: () => FSTFLAGS_MTIM,
  FSTFLAGS_MTIM_NOW: () => FSTFLAGS_MTIM_NOW,
  Fdstat: () => Fdstat,
  Filestat: () => Filestat,
  Iovec: () => Iovec,
  OFLAGS_CREAT: () => OFLAGS_CREAT,
  OFLAGS_DIRECTORY: () => OFLAGS_DIRECTORY,
  OFLAGS_EXCL: () => OFLAGS_EXCL,
  OFLAGS_TRUNC: () => OFLAGS_TRUNC,
  PREOPENTYPE_DIR: () => PREOPENTYPE_DIR,
  Prestat: () => Prestat,
  PrestatDir: () => PrestatDir,
  RIFLAGS_RECV_PEEK: () => RIFLAGS_RECV_PEEK,
  RIFLAGS_RECV_WAITALL: () => RIFLAGS_RECV_WAITALL,
  RIGHTS_FD_ADVISE: () => RIGHTS_FD_ADVISE,
  RIGHTS_FD_ALLOCATE: () => RIGHTS_FD_ALLOCATE,
  RIGHTS_FD_DATASYNC: () => RIGHTS_FD_DATASYNC,
  RIGHTS_FD_FDSTAT_SET_FLAGS: () => RIGHTS_FD_FDSTAT_SET_FLAGS,
  RIGHTS_FD_FILESTAT_GET: () => RIGHTS_FD_FILESTAT_GET,
  RIGHTS_FD_FILESTAT_SET_SIZE: () => RIGHTS_FD_FILESTAT_SET_SIZE,
  RIGHTS_FD_FILESTAT_SET_TIMES: () => RIGHTS_FD_FILESTAT_SET_TIMES,
  RIGHTS_FD_READ: () => RIGHTS_FD_READ,
  RIGHTS_FD_READDIR: () => RIGHTS_FD_READDIR,
  RIGHTS_FD_SEEK: () => RIGHTS_FD_SEEK,
  RIGHTS_FD_SYNC: () => RIGHTS_FD_SYNC,
  RIGHTS_FD_TELL: () => RIGHTS_FD_TELL,
  RIGHTS_FD_WRITE: () => RIGHTS_FD_WRITE,
  RIGHTS_PATH_CREATE_DIRECTORY: () => RIGHTS_PATH_CREATE_DIRECTORY,
  RIGHTS_PATH_CREATE_FILE: () => RIGHTS_PATH_CREATE_FILE,
  RIGHTS_PATH_FILESTAT_GET: () => RIGHTS_PATH_FILESTAT_GET,
  RIGHTS_PATH_FILESTAT_SET_SIZE: () => RIGHTS_PATH_FILESTAT_SET_SIZE,
  RIGHTS_PATH_FILESTAT_SET_TIMES: () => RIGHTS_PATH_FILESTAT_SET_TIMES,
  RIGHTS_PATH_LINK_SOURCE: () => RIGHTS_PATH_LINK_SOURCE,
  RIGHTS_PATH_LINK_TARGET: () => RIGHTS_PATH_LINK_TARGET,
  RIGHTS_PATH_OPEN: () => RIGHTS_PATH_OPEN,
  RIGHTS_PATH_READLINK: () => RIGHTS_PATH_READLINK,
  RIGHTS_PATH_REMOVE_DIRECTORY: () => RIGHTS_PATH_REMOVE_DIRECTORY,
  RIGHTS_PATH_RENAME_SOURCE: () => RIGHTS_PATH_RENAME_SOURCE,
  RIGHTS_PATH_RENAME_TARGET: () => RIGHTS_PATH_RENAME_TARGET,
  RIGHTS_PATH_SYMLINK: () => RIGHTS_PATH_SYMLINK,
  RIGHTS_PATH_UNLINK_FILE: () => RIGHTS_PATH_UNLINK_FILE,
  RIGHTS_POLL_FD_READWRITE: () => RIGHTS_POLL_FD_READWRITE,
  RIGHTS_SOCK_SHUTDOWN: () => RIGHTS_SOCK_SHUTDOWN,
  ROFLAGS_RECV_DATA_TRUNCATED: () => ROFLAGS_RECV_DATA_TRUNCATED,
  SDFLAGS_RD: () => SDFLAGS_RD,
  SDFLAGS_WR: () => SDFLAGS_WR,
  SIGNAL_ABRT: () => SIGNAL_ABRT,
  SIGNAL_ALRM: () => SIGNAL_ALRM,
  SIGNAL_BUS: () => SIGNAL_BUS,
  SIGNAL_CHLD: () => SIGNAL_CHLD,
  SIGNAL_CONT: () => SIGNAL_CONT,
  SIGNAL_FPE: () => SIGNAL_FPE,
  SIGNAL_HUP: () => SIGNAL_HUP,
  SIGNAL_ILL: () => SIGNAL_ILL,
  SIGNAL_INT: () => SIGNAL_INT,
  SIGNAL_KILL: () => SIGNAL_KILL,
  SIGNAL_NONE: () => SIGNAL_NONE,
  SIGNAL_PIPE: () => SIGNAL_PIPE,
  SIGNAL_POLL: () => SIGNAL_POLL,
  SIGNAL_PROF: () => SIGNAL_PROF,
  SIGNAL_PWR: () => SIGNAL_PWR,
  SIGNAL_QUIT: () => SIGNAL_QUIT,
  SIGNAL_SEGV: () => SIGNAL_SEGV,
  SIGNAL_STOP: () => SIGNAL_STOP,
  SIGNAL_SYS: () => SIGNAL_SYS,
  SIGNAL_TERM: () => SIGNAL_TERM,
  SIGNAL_TRAP: () => SIGNAL_TRAP,
  SIGNAL_TSTP: () => SIGNAL_TSTP,
  SIGNAL_TTIN: () => SIGNAL_TTIN,
  SIGNAL_TTOU: () => SIGNAL_TTOU,
  SIGNAL_URG: () => SIGNAL_URG,
  SIGNAL_USR1: () => SIGNAL_USR1,
  SIGNAL_USR2: () => SIGNAL_USR2,
  SIGNAL_VTALRM: () => SIGNAL_VTALRM,
  SIGNAL_WINCH: () => SIGNAL_WINCH,
  SIGNAL_XCPU: () => SIGNAL_XCPU,
  SIGNAL_XFSZ: () => SIGNAL_XFSZ,
  SUBCLOCKFLAGS_SUBSCRIPTION_CLOCK_ABSTIME: () => SUBCLOCKFLAGS_SUBSCRIPTION_CLOCK_ABSTIME,
  Subscription: () => Subscription,
  WHENCE_CUR: () => WHENCE_CUR,
  WHENCE_END: () => WHENCE_END,
  WHENCE_SET: () => WHENCE_SET
});
var FD_STDIN = 0;
var FD_STDOUT = 1;
var FD_STDERR = 2;
var CLOCKID_REALTIME = 0;
var CLOCKID_MONOTONIC = 1;
var CLOCKID_PROCESS_CPUTIME_ID = 2;
var CLOCKID_THREAD_CPUTIME_ID = 3;
var ERRNO_SUCCESS = 0;
var ERRNO_2BIG = 1;
var ERRNO_ACCES = 2;
var ERRNO_ADDRINUSE = 3;
var ERRNO_ADDRNOTAVAIL = 4;
var ERRNO_AFNOSUPPORT = 5;
var ERRNO_AGAIN = 6;
var ERRNO_ALREADY = 7;
var ERRNO_BADF = 8;
var ERRNO_BADMSG = 9;
var ERRNO_BUSY = 10;
var ERRNO_CANCELED = 11;
var ERRNO_CHILD = 12;
var ERRNO_CONNABORTED = 13;
var ERRNO_CONNREFUSED = 14;
var ERRNO_CONNRESET = 15;
var ERRNO_DEADLK = 16;
var ERRNO_DESTADDRREQ = 17;
var ERRNO_DOM = 18;
var ERRNO_DQUOT = 19;
var ERRNO_EXIST = 20;
var ERRNO_FAULT = 21;
var ERRNO_FBIG = 22;
var ERRNO_HOSTUNREACH = 23;
var ERRNO_IDRM = 24;
var ERRNO_ILSEQ = 25;
var ERRNO_INPROGRESS = 26;
var ERRNO_INTR = 27;
var ERRNO_INVAL = 28;
var ERRNO_IO = 29;
var ERRNO_ISCONN = 30;
var ERRNO_ISDIR = 31;
var ERRNO_LOOP = 32;
var ERRNO_MFILE = 33;
var ERRNO_MLINK = 34;
var ERRNO_MSGSIZE = 35;
var ERRNO_MULTIHOP = 36;
var ERRNO_NAMETOOLONG = 37;
var ERRNO_NETDOWN = 38;
var ERRNO_NETRESET = 39;
var ERRNO_NETUNREACH = 40;
var ERRNO_NFILE = 41;
var ERRNO_NOBUFS = 42;
var ERRNO_NODEV = 43;
var ERRNO_NOENT = 44;
var ERRNO_NOEXEC = 45;
var ERRNO_NOLCK = 46;
var ERRNO_NOLINK = 47;
var ERRNO_NOMEM = 48;
var ERRNO_NOMSG = 49;
var ERRNO_NOPROTOOPT = 50;
var ERRNO_NOSPC = 51;
var ERRNO_NOSYS = 52;
var ERRNO_NOTCONN = 53;
var ERRNO_NOTDIR = 54;
var ERRNO_NOTEMPTY = 55;
var ERRNO_NOTRECOVERABLE = 56;
var ERRNO_NOTSOCK = 57;
var ERRNO_NOTSUP = 58;
var ERRNO_NOTTY = 59;
var ERRNO_NXIO = 60;
var ERRNO_OVERFLOW = 61;
var ERRNO_OWNERDEAD = 62;
var ERRNO_PERM = 63;
var ERRNO_PIPE = 64;
var ERRNO_PROTO = 65;
var ERRNO_PROTONOSUPPORT = 66;
var ERRNO_PROTOTYPE = 67;
var ERRNO_RANGE = 68;
var ERRNO_ROFS = 69;
var ERRNO_SPIPE = 70;
var ERRNO_SRCH = 71;
var ERRNO_STALE = 72;
var ERRNO_TIMEDOUT = 73;
var ERRNO_TXTBSY = 74;
var ERRNO_XDEV = 75;
var ERRNO_NOTCAPABLE = 76;
var RIGHTS_FD_DATASYNC = 1 << 0;
var RIGHTS_FD_READ = 1 << 1;
var RIGHTS_FD_SEEK = 1 << 2;
var RIGHTS_FD_FDSTAT_SET_FLAGS = 1 << 3;
var RIGHTS_FD_SYNC = 1 << 4;
var RIGHTS_FD_TELL = 1 << 5;
var RIGHTS_FD_WRITE = 1 << 6;
var RIGHTS_FD_ADVISE = 1 << 7;
var RIGHTS_FD_ALLOCATE = 1 << 8;
var RIGHTS_PATH_CREATE_DIRECTORY = 1 << 9;
var RIGHTS_PATH_CREATE_FILE = 1 << 10;
var RIGHTS_PATH_LINK_SOURCE = 1 << 11;
var RIGHTS_PATH_LINK_TARGET = 1 << 12;
var RIGHTS_PATH_OPEN = 1 << 13;
var RIGHTS_FD_READDIR = 1 << 14;
var RIGHTS_PATH_READLINK = 1 << 15;
var RIGHTS_PATH_RENAME_SOURCE = 1 << 16;
var RIGHTS_PATH_RENAME_TARGET = 1 << 17;
var RIGHTS_PATH_FILESTAT_GET = 1 << 18;
var RIGHTS_PATH_FILESTAT_SET_SIZE = 1 << 19;
var RIGHTS_PATH_FILESTAT_SET_TIMES = 1 << 20;
var RIGHTS_FD_FILESTAT_GET = 1 << 21;
var RIGHTS_FD_FILESTAT_SET_SIZE = 1 << 22;
var RIGHTS_FD_FILESTAT_SET_TIMES = 1 << 23;
var RIGHTS_PATH_SYMLINK = 1 << 24;
var RIGHTS_PATH_REMOVE_DIRECTORY = 1 << 25;
var RIGHTS_PATH_UNLINK_FILE = 1 << 26;
var RIGHTS_POLL_FD_READWRITE = 1 << 27;
var RIGHTS_SOCK_SHUTDOWN = 1 << 28;
var Iovec = class _Iovec {
  static read_bytes(view, ptr) {
    const iovec = new _Iovec();
    iovec.buf = view.getUint32(ptr, true);
    iovec.buf_len = view.getUint32(ptr + 4, true);
    return iovec;
  }
  static read_bytes_array(view, ptr, len) {
    const iovecs = [];
    for (let i = 0; i < len; i++) {
      iovecs.push(_Iovec.read_bytes(view, ptr + 8 * i));
    }
    return iovecs;
  }
};
var Ciovec = class _Ciovec {
  static read_bytes(view, ptr) {
    const iovec = new _Ciovec();
    iovec.buf = view.getUint32(ptr, true);
    iovec.buf_len = view.getUint32(ptr + 4, true);
    return iovec;
  }
  static read_bytes_array(view, ptr, len) {
    const iovecs = [];
    for (let i = 0; i < len; i++) {
      iovecs.push(_Ciovec.read_bytes(view, ptr + 8 * i));
    }
    return iovecs;
  }
};
var WHENCE_SET = 0;
var WHENCE_CUR = 1;
var WHENCE_END = 2;
var FILETYPE_UNKNOWN = 0;
var FILETYPE_BLOCK_DEVICE = 1;
var FILETYPE_CHARACTER_DEVICE = 2;
var FILETYPE_DIRECTORY = 3;
var FILETYPE_REGULAR_FILE = 4;
var FILETYPE_SOCKET_DGRAM = 5;
var FILETYPE_SOCKET_STREAM = 6;
var FILETYPE_SYMBOLIC_LINK = 7;
var Dirent = class {
  head_length() {
    return 24;
  }
  name_length() {
    return this.dir_name.byteLength;
  }
  write_head_bytes(view, ptr) {
    view.setBigUint64(ptr, this.d_next, true);
    view.setBigUint64(ptr + 8, this.d_ino, true);
    view.setUint32(ptr + 16, this.dir_name.length, true);
    view.setUint8(ptr + 20, this.d_type);
  }
  write_name_bytes(view8, ptr, buf_len) {
    view8.set(this.dir_name.slice(0, Math.min(this.dir_name.byteLength, buf_len)), ptr);
  }
  constructor(next_cookie, d_ino, name, type) {
    const encoded_name = new TextEncoder().encode(name);
    this.d_next = next_cookie;
    this.d_ino = d_ino;
    this.d_namlen = encoded_name.byteLength;
    this.d_type = type;
    this.dir_name = encoded_name;
  }
};
var ADVICE_NORMAL = 0;
var ADVICE_SEQUENTIAL = 1;
var ADVICE_RANDOM = 2;
var ADVICE_WILLNEED = 3;
var ADVICE_DONTNEED = 4;
var ADVICE_NOREUSE = 5;
var FDFLAGS_APPEND = 1 << 0;
var FDFLAGS_DSYNC = 1 << 1;
var FDFLAGS_NONBLOCK = 1 << 2;
var FDFLAGS_RSYNC = 1 << 3;
var FDFLAGS_SYNC = 1 << 4;
var Fdstat = class {
  write_bytes(view, ptr) {
    view.setUint8(ptr, this.fs_filetype);
    view.setUint16(ptr + 2, this.fs_flags, true);
    view.setBigUint64(ptr + 8, this.fs_rights_base, true);
    view.setBigUint64(ptr + 16, this.fs_rights_inherited, true);
  }
  constructor(filetype, flags) {
    this.fs_rights_base = 0n;
    this.fs_rights_inherited = 0n;
    this.fs_filetype = filetype;
    this.fs_flags = flags;
  }
};
var FSTFLAGS_ATIM = 1 << 0;
var FSTFLAGS_ATIM_NOW = 1 << 1;
var FSTFLAGS_MTIM = 1 << 2;
var FSTFLAGS_MTIM_NOW = 1 << 3;
var OFLAGS_CREAT = 1 << 0;
var OFLAGS_DIRECTORY = 1 << 1;
var OFLAGS_EXCL = 1 << 2;
var OFLAGS_TRUNC = 1 << 3;
var Filestat = class {
  write_bytes(view, ptr) {
    view.setBigUint64(ptr, this.dev, true);
    view.setBigUint64(ptr + 8, this.ino, true);
    view.setUint8(ptr + 16, this.filetype);
    view.setBigUint64(ptr + 24, this.nlink, true);
    view.setBigUint64(ptr + 32, this.size, true);
    view.setBigUint64(ptr + 38, this.atim, true);
    view.setBigUint64(ptr + 46, this.mtim, true);
    view.setBigUint64(ptr + 52, this.ctim, true);
  }
  constructor(ino, filetype, size) {
    this.dev = 0n;
    this.nlink = 0n;
    this.atim = 0n;
    this.mtim = 0n;
    this.ctim = 0n;
    this.ino = ino;
    this.filetype = filetype;
    this.size = size;
  }
};
var EVENTTYPE_CLOCK = 0;
var EVENTTYPE_FD_READ = 1;
var EVENTTYPE_FD_WRITE = 2;
var EVENTRWFLAGS_FD_READWRITE_HANGUP = 1 << 0;
var SUBCLOCKFLAGS_SUBSCRIPTION_CLOCK_ABSTIME = 1 << 0;
var Subscription = class _Subscription {
  static read_bytes(view, ptr) {
    return new _Subscription(view.getBigUint64(ptr, true), view.getUint8(ptr + 8), view.getUint32(ptr + 16, true), view.getBigUint64(ptr + 24, true), view.getUint16(ptr + 36, true));
  }
  constructor(userdata, eventtype, clockid, timeout, flags) {
    this.userdata = userdata;
    this.eventtype = eventtype;
    this.clockid = clockid;
    this.timeout = timeout;
    this.flags = flags;
  }
};
var Event = class {
  write_bytes(view, ptr) {
    view.setBigUint64(ptr, this.userdata, true);
    view.setUint16(ptr + 8, this.error, true);
    view.setUint8(ptr + 10, this.eventtype);
  }
  constructor(userdata, error, eventtype) {
    this.userdata = userdata;
    this.error = error;
    this.eventtype = eventtype;
  }
};
var SIGNAL_NONE = 0;
var SIGNAL_HUP = 1;
var SIGNAL_INT = 2;
var SIGNAL_QUIT = 3;
var SIGNAL_ILL = 4;
var SIGNAL_TRAP = 5;
var SIGNAL_ABRT = 6;
var SIGNAL_BUS = 7;
var SIGNAL_FPE = 8;
var SIGNAL_KILL = 9;
var SIGNAL_USR1 = 10;
var SIGNAL_SEGV = 11;
var SIGNAL_USR2 = 12;
var SIGNAL_PIPE = 13;
var SIGNAL_ALRM = 14;
var SIGNAL_TERM = 15;
var SIGNAL_CHLD = 16;
var SIGNAL_CONT = 17;
var SIGNAL_STOP = 18;
var SIGNAL_TSTP = 19;
var SIGNAL_TTIN = 20;
var SIGNAL_TTOU = 21;
var SIGNAL_URG = 22;
var SIGNAL_XCPU = 23;
var SIGNAL_XFSZ = 24;
var SIGNAL_VTALRM = 25;
var SIGNAL_PROF = 26;
var SIGNAL_WINCH = 27;
var SIGNAL_POLL = 28;
var SIGNAL_PWR = 29;
var SIGNAL_SYS = 30;
var RIFLAGS_RECV_PEEK = 1 << 0;
var RIFLAGS_RECV_WAITALL = 1 << 1;
var ROFLAGS_RECV_DATA_TRUNCATED = 1 << 0;
var SDFLAGS_RD = 1 << 0;
var SDFLAGS_WR = 1 << 1;
var PREOPENTYPE_DIR = 0;
var PrestatDir = class {
  write_bytes(view, ptr) {
    view.setUint32(ptr, this.pr_name.byteLength, true);
  }
  constructor(name) {
    this.pr_name = new TextEncoder().encode(name);
  }
};
var Prestat = class _Prestat {
  static dir(name) {
    const prestat = new _Prestat();
    prestat.tag = PREOPENTYPE_DIR;
    prestat.inner = new PrestatDir(name);
    return prestat;
  }
  write_bytes(view, ptr) {
    view.setUint32(ptr, this.tag, true);
    this.inner.write_bytes(view, ptr + 4);
  }
};

// node_modules/@bjorn3/browser_wasi_shim/dist/debug.js
var Debug = class Debug2 {
  enable(enabled) {
    this.log = createLogger(enabled === void 0 ? true : enabled, this.prefix);
  }
  get enabled() {
    return this.isEnabled;
  }
  constructor(isEnabled) {
    this.isEnabled = isEnabled;
    this.prefix = "wasi:";
    this.enable(isEnabled);
  }
};
function createLogger(enabled, prefix) {
  if (enabled) {
    const a = console.log.bind(console, "%c%s", "color: #265BA0", prefix);
    return a;
  } else {
    return () => {
    };
  }
}
var debug = new Debug(false);

// node_modules/@bjorn3/browser_wasi_shim/dist/wasi.js
var WASIProcExit = class extends Error {
  constructor(code) {
    super("exit with exit code " + code);
    this.code = code;
  }
};
var WASI = class WASI2 {
  start(instance) {
    this.inst = instance;
    try {
      instance.exports._start();
      return 0;
    } catch (e) {
      if (e instanceof WASIProcExit) {
        return e.code;
      } else {
        throw e;
      }
    }
  }
  initialize(instance) {
    this.inst = instance;
    if (instance.exports._initialize) {
      instance.exports._initialize();
    }
  }
  constructor(args, env, fds, options = {}) {
    this.args = [];
    this.env = [];
    this.fds = [];
    debug.enable(options.debug);
    this.args = args;
    this.env = env;
    this.fds = fds;
    const self = this;
    this.wasiImport = { args_sizes_get(argc, argv_buf_size) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      buffer.setUint32(argc, self.args.length, true);
      let buf_size = 0;
      for (const arg of self.args) {
        buf_size += arg.length + 1;
      }
      buffer.setUint32(argv_buf_size, buf_size, true);
      debug.log(buffer.getUint32(argc, true), buffer.getUint32(argv_buf_size, true));
      return 0;
    }, args_get(argv, argv_buf) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      const orig_argv_buf = argv_buf;
      for (let i = 0; i < self.args.length; i++) {
        buffer.setUint32(argv, argv_buf, true);
        argv += 4;
        const arg = new TextEncoder().encode(self.args[i]);
        buffer8.set(arg, argv_buf);
        buffer.setUint8(argv_buf + arg.length, 0);
        argv_buf += arg.length + 1;
      }
      if (debug.enabled) {
        debug.log(new TextDecoder("utf-8").decode(buffer8.slice(orig_argv_buf, argv_buf)));
      }
      return 0;
    }, environ_sizes_get(environ_count, environ_size) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      buffer.setUint32(environ_count, self.env.length, true);
      let buf_size = 0;
      for (const environ of self.env) {
        buf_size += new TextEncoder().encode(environ).length + 1;
      }
      buffer.setUint32(environ_size, buf_size, true);
      debug.log(buffer.getUint32(environ_count, true), buffer.getUint32(environ_size, true));
      return 0;
    }, environ_get(environ, environ_buf) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      const orig_environ_buf = environ_buf;
      for (let i = 0; i < self.env.length; i++) {
        buffer.setUint32(environ, environ_buf, true);
        environ += 4;
        const e = new TextEncoder().encode(self.env[i]);
        buffer8.set(e, environ_buf);
        buffer.setUint8(environ_buf + e.length, 0);
        environ_buf += e.length + 1;
      }
      if (debug.enabled) {
        debug.log(new TextDecoder("utf-8").decode(buffer8.slice(orig_environ_buf, environ_buf)));
      }
      return 0;
    }, clock_res_get(id, res_ptr) {
      let resolutionValue;
      switch (id) {
        case CLOCKID_MONOTONIC: {
          resolutionValue = 5000n;
          break;
        }
        case CLOCKID_REALTIME: {
          resolutionValue = 1000000n;
          break;
        }
        default:
          return ERRNO_NOSYS;
      }
      const view = new DataView(self.inst.exports.memory.buffer);
      view.setBigUint64(res_ptr, resolutionValue, true);
      return ERRNO_SUCCESS;
    }, clock_time_get(id, precision, time) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      if (id === CLOCKID_REALTIME) {
        buffer.setBigUint64(time, BigInt((/* @__PURE__ */ new Date()).getTime()) * 1000000n, true);
      } else if (id == CLOCKID_MONOTONIC) {
        let monotonic_time;
        try {
          monotonic_time = BigInt(Math.round(performance.now() * 1e6));
        } catch (e) {
          monotonic_time = 0n;
        }
        buffer.setBigUint64(time, monotonic_time, true);
      } else {
        buffer.setBigUint64(time, 0n, true);
      }
      return 0;
    }, fd_advise(fd2, offset, len, advice) {
      if (self.fds[fd2] != void 0) {
        return ERRNO_SUCCESS;
      } else {
        return ERRNO_BADF;
      }
    }, fd_allocate(fd2, offset, len) {
      if (self.fds[fd2] != void 0) {
        return self.fds[fd2].fd_allocate(offset, len);
      } else {
        return ERRNO_BADF;
      }
    }, fd_close(fd2) {
      if (self.fds[fd2] != void 0) {
        const ret = self.fds[fd2].fd_close();
        self.fds[fd2] = void 0;
        return ret;
      } else {
        return ERRNO_BADF;
      }
    }, fd_datasync(fd2) {
      if (self.fds[fd2] != void 0) {
        return self.fds[fd2].fd_sync();
      } else {
        return ERRNO_BADF;
      }
    }, fd_fdstat_get(fd2, fdstat_ptr) {
      if (self.fds[fd2] != void 0) {
        const { ret, fdstat } = self.fds[fd2].fd_fdstat_get();
        if (fdstat != null) {
          fdstat.write_bytes(new DataView(self.inst.exports.memory.buffer), fdstat_ptr);
        }
        return ret;
      } else {
        return ERRNO_BADF;
      }
    }, fd_fdstat_set_flags(fd2, flags) {
      if (self.fds[fd2] != void 0) {
        return self.fds[fd2].fd_fdstat_set_flags(flags);
      } else {
        return ERRNO_BADF;
      }
    }, fd_fdstat_set_rights(fd2, fs_rights_base, fs_rights_inheriting) {
      if (self.fds[fd2] != void 0) {
        return self.fds[fd2].fd_fdstat_set_rights(fs_rights_base, fs_rights_inheriting);
      } else {
        return ERRNO_BADF;
      }
    }, fd_filestat_get(fd2, filestat_ptr) {
      if (self.fds[fd2] != void 0) {
        const { ret, filestat } = self.fds[fd2].fd_filestat_get();
        if (filestat != null) {
          filestat.write_bytes(new DataView(self.inst.exports.memory.buffer), filestat_ptr);
        }
        return ret;
      } else {
        return ERRNO_BADF;
      }
    }, fd_filestat_set_size(fd2, size) {
      if (self.fds[fd2] != void 0) {
        return self.fds[fd2].fd_filestat_set_size(size);
      } else {
        return ERRNO_BADF;
      }
    }, fd_filestat_set_times(fd2, atim, mtim, fst_flags) {
      if (self.fds[fd2] != void 0) {
        return self.fds[fd2].fd_filestat_set_times(atim, mtim, fst_flags);
      } else {
        return ERRNO_BADF;
      }
    }, fd_pread(fd2, iovs_ptr, iovs_len, offset, nread_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const iovecs = Iovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
        let nread = 0;
        for (const iovec of iovecs) {
          const { ret, data } = self.fds[fd2].fd_pread(iovec.buf_len, offset);
          if (ret != ERRNO_SUCCESS) {
            buffer.setUint32(nread_ptr, nread, true);
            return ret;
          }
          buffer8.set(data, iovec.buf);
          nread += data.length;
          offset += BigInt(data.length);
          if (data.length != iovec.buf_len) {
            break;
          }
        }
        buffer.setUint32(nread_ptr, nread, true);
        return ERRNO_SUCCESS;
      } else {
        return ERRNO_BADF;
      }
    }, fd_prestat_get(fd2, buf_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const { ret, prestat } = self.fds[fd2].fd_prestat_get();
        if (prestat != null) {
          prestat.write_bytes(buffer, buf_ptr);
        }
        return ret;
      } else {
        return ERRNO_BADF;
      }
    }, fd_prestat_dir_name(fd2, path_ptr, path_len) {
      if (self.fds[fd2] != void 0) {
        const { ret, prestat } = self.fds[fd2].fd_prestat_get();
        if (prestat == null) {
          return ret;
        }
        const prestat_dir_name = prestat.inner.pr_name;
        const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
        buffer8.set(prestat_dir_name.slice(0, path_len), path_ptr);
        return prestat_dir_name.byteLength > path_len ? ERRNO_NAMETOOLONG : ERRNO_SUCCESS;
      } else {
        return ERRNO_BADF;
      }
    }, fd_pwrite(fd2, iovs_ptr, iovs_len, offset, nwritten_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const iovecs = Ciovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
        let nwritten = 0;
        for (const iovec of iovecs) {
          const data = buffer8.slice(iovec.buf, iovec.buf + iovec.buf_len);
          const { ret, nwritten: nwritten_part } = self.fds[fd2].fd_pwrite(data, offset);
          if (ret != ERRNO_SUCCESS) {
            buffer.setUint32(nwritten_ptr, nwritten, true);
            return ret;
          }
          nwritten += nwritten_part;
          offset += BigInt(nwritten_part);
          if (nwritten_part != data.byteLength) {
            break;
          }
        }
        buffer.setUint32(nwritten_ptr, nwritten, true);
        return ERRNO_SUCCESS;
      } else {
        return ERRNO_BADF;
      }
    }, fd_read(fd2, iovs_ptr, iovs_len, nread_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const iovecs = Iovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
        let nread = 0;
        for (const iovec of iovecs) {
          const { ret, data } = self.fds[fd2].fd_read(iovec.buf_len);
          if (ret != ERRNO_SUCCESS) {
            buffer.setUint32(nread_ptr, nread, true);
            return ret;
          }
          buffer8.set(data, iovec.buf);
          nread += data.length;
          if (data.length != iovec.buf_len) {
            break;
          }
        }
        buffer.setUint32(nread_ptr, nread, true);
        return ERRNO_SUCCESS;
      } else {
        return ERRNO_BADF;
      }
    }, fd_readdir(fd2, buf, buf_len, cookie, bufused_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        let bufused = 0;
        while (true) {
          const { ret, dirent } = self.fds[fd2].fd_readdir_single(cookie);
          if (ret != 0) {
            buffer.setUint32(bufused_ptr, bufused, true);
            return ret;
          }
          if (dirent == null) {
            break;
          }
          if (buf_len - bufused < dirent.head_length()) {
            bufused = buf_len;
            break;
          }
          const head_bytes = new ArrayBuffer(dirent.head_length());
          dirent.write_head_bytes(new DataView(head_bytes), 0);
          buffer8.set(new Uint8Array(head_bytes).slice(0, Math.min(head_bytes.byteLength, buf_len - bufused)), buf);
          buf += dirent.head_length();
          bufused += dirent.head_length();
          if (buf_len - bufused < dirent.name_length()) {
            bufused = buf_len;
            break;
          }
          dirent.write_name_bytes(buffer8, buf, buf_len - bufused);
          buf += dirent.name_length();
          bufused += dirent.name_length();
          cookie = dirent.d_next;
        }
        buffer.setUint32(bufused_ptr, bufused, true);
        return 0;
      } else {
        return ERRNO_BADF;
      }
    }, fd_renumber(fd2, to) {
      if (self.fds[fd2] != void 0 && self.fds[to] != void 0) {
        const ret = self.fds[to].fd_close();
        if (ret != 0) {
          return ret;
        }
        self.fds[to] = self.fds[fd2];
        self.fds[fd2] = void 0;
        return 0;
      } else {
        return ERRNO_BADF;
      }
    }, fd_seek(fd2, offset, whence, offset_out_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const { ret, offset: offset_out } = self.fds[fd2].fd_seek(offset, whence);
        buffer.setBigInt64(offset_out_ptr, offset_out, true);
        return ret;
      } else {
        return ERRNO_BADF;
      }
    }, fd_sync(fd2) {
      if (self.fds[fd2] != void 0) {
        return self.fds[fd2].fd_sync();
      } else {
        return ERRNO_BADF;
      }
    }, fd_tell(fd2, offset_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const { ret, offset } = self.fds[fd2].fd_tell();
        buffer.setBigUint64(offset_ptr, offset, true);
        return ret;
      } else {
        return ERRNO_BADF;
      }
    }, fd_write(fd2, iovs_ptr, iovs_len, nwritten_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const iovecs = Ciovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
        let nwritten = 0;
        for (const iovec of iovecs) {
          const data = buffer8.slice(iovec.buf, iovec.buf + iovec.buf_len);
          const { ret, nwritten: nwritten_part } = self.fds[fd2].fd_write(data);
          if (ret != ERRNO_SUCCESS) {
            buffer.setUint32(nwritten_ptr, nwritten, true);
            return ret;
          }
          nwritten += nwritten_part;
          if (nwritten_part != data.byteLength) {
            break;
          }
        }
        buffer.setUint32(nwritten_ptr, nwritten, true);
        return ERRNO_SUCCESS;
      } else {
        return ERRNO_BADF;
      }
    }, path_create_directory(fd2, path_ptr, path_len) {
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
        return self.fds[fd2].path_create_directory(path);
      } else {
        return ERRNO_BADF;
      }
    }, path_filestat_get(fd2, flags, path_ptr, path_len, filestat_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
        const { ret, filestat } = self.fds[fd2].path_filestat_get(flags, path);
        if (filestat != null) {
          filestat.write_bytes(buffer, filestat_ptr);
        }
        return ret;
      } else {
        return ERRNO_BADF;
      }
    }, path_filestat_set_times(fd2, flags, path_ptr, path_len, atim, mtim, fst_flags) {
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
        return self.fds[fd2].path_filestat_set_times(flags, path, atim, mtim, fst_flags);
      } else {
        return ERRNO_BADF;
      }
    }, path_link(old_fd, old_flags, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) {
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[old_fd] != void 0 && self.fds[new_fd] != void 0) {
        const old_path = new TextDecoder("utf-8").decode(buffer8.slice(old_path_ptr, old_path_ptr + old_path_len));
        const new_path = new TextDecoder("utf-8").decode(buffer8.slice(new_path_ptr, new_path_ptr + new_path_len));
        const { ret, inode_obj } = self.fds[old_fd].path_lookup(old_path, old_flags);
        if (inode_obj == null) {
          return ret;
        }
        return self.fds[new_fd].path_link(new_path, inode_obj, false);
      } else {
        return ERRNO_BADF;
      }
    }, path_open(fd2, dirflags, path_ptr, path_len, oflags, fs_rights_base, fs_rights_inheriting, fd_flags, opened_fd_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
        debug.log(path);
        const { ret, fd_obj } = self.fds[fd2].path_open(dirflags, path, oflags, fs_rights_base, fs_rights_inheriting, fd_flags);
        if (ret != 0) {
          return ret;
        }
        self.fds.push(fd_obj);
        const opened_fd = self.fds.length - 1;
        buffer.setUint32(opened_fd_ptr, opened_fd, true);
        return 0;
      } else {
        return ERRNO_BADF;
      }
    }, path_readlink(fd2, path_ptr, path_len, buf_ptr, buf_len, nread_ptr) {
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
        debug.log(path);
        const { ret, data } = self.fds[fd2].path_readlink(path);
        if (data != null) {
          const data_buf = new TextEncoder().encode(data);
          if (data_buf.length > buf_len) {
            buffer.setUint32(nread_ptr, 0, true);
            return ERRNO_BADF;
          }
          buffer8.set(data_buf, buf_ptr);
          buffer.setUint32(nread_ptr, data_buf.length, true);
        }
        return ret;
      } else {
        return ERRNO_BADF;
      }
    }, path_remove_directory(fd2, path_ptr, path_len) {
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
        return self.fds[fd2].path_remove_directory(path);
      } else {
        return ERRNO_BADF;
      }
    }, path_rename(fd2, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) {
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0 && self.fds[new_fd] != void 0) {
        const old_path = new TextDecoder("utf-8").decode(buffer8.slice(old_path_ptr, old_path_ptr + old_path_len));
        const new_path = new TextDecoder("utf-8").decode(buffer8.slice(new_path_ptr, new_path_ptr + new_path_len));
        let { ret, inode_obj } = self.fds[fd2].path_unlink(old_path);
        if (inode_obj == null) {
          return ret;
        }
        ret = self.fds[new_fd].path_link(new_path, inode_obj, true);
        if (ret != ERRNO_SUCCESS) {
          if (self.fds[fd2].path_link(old_path, inode_obj, true) != ERRNO_SUCCESS) {
            throw "path_link should always return success when relinking an inode back to the original place";
          }
        }
        return ret;
      } else {
        return ERRNO_BADF;
      }
    }, path_symlink(old_path_ptr, old_path_len, fd2, new_path_ptr, new_path_len) {
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const old_path = new TextDecoder("utf-8").decode(buffer8.slice(old_path_ptr, old_path_ptr + old_path_len));
        const new_path = new TextDecoder("utf-8").decode(buffer8.slice(new_path_ptr, new_path_ptr + new_path_len));
        return ERRNO_NOTSUP;
      } else {
        return ERRNO_BADF;
      }
    }, path_unlink_file(fd2, path_ptr, path_len) {
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer);
      if (self.fds[fd2] != void 0) {
        const path = new TextDecoder("utf-8").decode(buffer8.slice(path_ptr, path_ptr + path_len));
        return self.fds[fd2].path_unlink_file(path);
      } else {
        return ERRNO_BADF;
      }
    }, poll_oneoff(in_ptr, out_ptr, nsubscriptions) {
      if (nsubscriptions === 0) {
        return ERRNO_INVAL;
      }
      if (nsubscriptions > 1) {
        debug.log("poll_oneoff: only a single subscription is supported");
        return ERRNO_NOTSUP;
      }
      const buffer = new DataView(self.inst.exports.memory.buffer);
      const s = Subscription.read_bytes(buffer, in_ptr);
      const eventtype = s.eventtype;
      const clockid = s.clockid;
      const timeout = s.timeout;
      if (eventtype !== EVENTTYPE_CLOCK) {
        debug.log("poll_oneoff: only clock subscriptions are supported");
        return ERRNO_NOTSUP;
      }
      let getNow = void 0;
      if (clockid === CLOCKID_MONOTONIC) {
        getNow = () => BigInt(Math.round(performance.now() * 1e6));
      } else if (clockid === CLOCKID_REALTIME) {
        getNow = () => BigInt((/* @__PURE__ */ new Date()).getTime()) * 1000000n;
      } else {
        return ERRNO_INVAL;
      }
      const endTime = (s.flags & SUBCLOCKFLAGS_SUBSCRIPTION_CLOCK_ABSTIME) !== 0 ? timeout : getNow() + timeout;
      while (endTime > getNow()) {
      }
      const event = new Event(s.userdata, ERRNO_SUCCESS, eventtype);
      event.write_bytes(buffer, out_ptr);
      return ERRNO_SUCCESS;
    }, proc_exit(exit_code) {
      throw new WASIProcExit(exit_code);
    }, proc_raise(sig) {
      throw "raised signal " + sig;
    }, sched_yield() {
    }, random_get(buf, buf_len) {
      const buffer8 = new Uint8Array(self.inst.exports.memory.buffer).subarray(buf, buf + buf_len);
      if ("crypto" in globalThis && (typeof SharedArrayBuffer === "undefined" || !(self.inst.exports.memory.buffer instanceof SharedArrayBuffer))) {
        for (let i = 0; i < buf_len; i += 65536) {
          crypto.getRandomValues(buffer8.subarray(i, i + 65536));
        }
      } else {
        for (let i = 0; i < buf_len; i++) {
          buffer8[i] = Math.random() * 256 | 0;
        }
      }
    }, sock_recv(fd2, ri_data, ri_flags) {
      throw "sockets not supported";
    }, sock_send(fd2, si_data, si_flags) {
      throw "sockets not supported";
    }, sock_shutdown(fd2, how) {
      throw "sockets not supported";
    }, sock_accept(fd2, flags) {
      throw "sockets not supported";
    } };
  }
};

// node_modules/@bjorn3/browser_wasi_shim/dist/fd.js
var Fd = class {
  fd_allocate(offset, len) {
    return ERRNO_NOTSUP;
  }
  fd_close() {
    return 0;
  }
  fd_fdstat_get() {
    return { ret: ERRNO_NOTSUP, fdstat: null };
  }
  fd_fdstat_set_flags(flags) {
    return ERRNO_NOTSUP;
  }
  fd_fdstat_set_rights(fs_rights_base, fs_rights_inheriting) {
    return ERRNO_NOTSUP;
  }
  fd_filestat_get() {
    return { ret: ERRNO_NOTSUP, filestat: null };
  }
  fd_filestat_set_size(size) {
    return ERRNO_NOTSUP;
  }
  fd_filestat_set_times(atim, mtim, fst_flags) {
    return ERRNO_NOTSUP;
  }
  fd_pread(size, offset) {
    return { ret: ERRNO_NOTSUP, data: new Uint8Array() };
  }
  fd_prestat_get() {
    return { ret: ERRNO_NOTSUP, prestat: null };
  }
  fd_pwrite(data, offset) {
    return { ret: ERRNO_NOTSUP, nwritten: 0 };
  }
  fd_read(size) {
    return { ret: ERRNO_NOTSUP, data: new Uint8Array() };
  }
  fd_readdir_single(cookie) {
    return { ret: ERRNO_NOTSUP, dirent: null };
  }
  fd_seek(offset, whence) {
    return { ret: ERRNO_NOTSUP, offset: 0n };
  }
  fd_sync() {
    return 0;
  }
  fd_tell() {
    return { ret: ERRNO_NOTSUP, offset: 0n };
  }
  fd_write(data) {
    return { ret: ERRNO_NOTSUP, nwritten: 0 };
  }
  path_create_directory(path) {
    return ERRNO_NOTSUP;
  }
  path_filestat_get(flags, path) {
    return { ret: ERRNO_NOTSUP, filestat: null };
  }
  path_filestat_set_times(flags, path, atim, mtim, fst_flags) {
    return ERRNO_NOTSUP;
  }
  path_link(path, inode, allow_dir) {
    return ERRNO_NOTSUP;
  }
  path_unlink(path) {
    return { ret: ERRNO_NOTSUP, inode_obj: null };
  }
  path_lookup(path, dirflags) {
    return { ret: ERRNO_NOTSUP, inode_obj: null };
  }
  path_open(dirflags, path, oflags, fs_rights_base, fs_rights_inheriting, fd_flags) {
    return { ret: ERRNO_NOTDIR, fd_obj: null };
  }
  path_readlink(path) {
    return { ret: ERRNO_NOTSUP, data: null };
  }
  path_remove_directory(path) {
    return ERRNO_NOTSUP;
  }
  path_rename(old_path, new_fd, new_path) {
    return ERRNO_NOTSUP;
  }
  path_unlink_file(path) {
    return ERRNO_NOTSUP;
  }
};
var Inode = class _Inode {
  static issue_ino() {
    return _Inode.next_ino++;
  }
  static root_ino() {
    return 0n;
  }
  constructor() {
    this.ino = _Inode.issue_ino();
  }
};
Inode.next_ino = 1n;

// node_modules/@bjorn3/browser_wasi_shim/dist/fs_mem.js
var OpenFile = class extends Fd {
  fd_allocate(offset, len) {
    if (this.file.size > offset + len) {
    } else {
      const new_data = new Uint8Array(Number(offset + len));
      new_data.set(this.file.data, 0);
      this.file.data = new_data;
    }
    return ERRNO_SUCCESS;
  }
  fd_fdstat_get() {
    return { ret: 0, fdstat: new Fdstat(FILETYPE_REGULAR_FILE, 0) };
  }
  fd_filestat_set_size(size) {
    if (this.file.size > size) {
      this.file.data = new Uint8Array(this.file.data.buffer.slice(0, Number(size)));
    } else {
      const new_data = new Uint8Array(Number(size));
      new_data.set(this.file.data, 0);
      this.file.data = new_data;
    }
    return ERRNO_SUCCESS;
  }
  fd_read(size) {
    const slice = this.file.data.slice(Number(this.file_pos), Number(this.file_pos + BigInt(size)));
    this.file_pos += BigInt(slice.length);
    return { ret: 0, data: slice };
  }
  fd_pread(size, offset) {
    const slice = this.file.data.slice(Number(offset), Number(offset + BigInt(size)));
    return { ret: 0, data: slice };
  }
  fd_seek(offset, whence) {
    let calculated_offset;
    switch (whence) {
      case WHENCE_SET:
        calculated_offset = offset;
        break;
      case WHENCE_CUR:
        calculated_offset = this.file_pos + offset;
        break;
      case WHENCE_END:
        calculated_offset = BigInt(this.file.data.byteLength) + offset;
        break;
      default:
        return { ret: ERRNO_INVAL, offset: 0n };
    }
    if (calculated_offset < 0) {
      return { ret: ERRNO_INVAL, offset: 0n };
    }
    this.file_pos = calculated_offset;
    return { ret: 0, offset: this.file_pos };
  }
  fd_tell() {
    return { ret: 0, offset: this.file_pos };
  }
  fd_write(data) {
    if (this.file.readonly) return { ret: ERRNO_BADF, nwritten: 0 };
    if (this.file_pos + BigInt(data.byteLength) > this.file.size) {
      const old = this.file.data;
      this.file.data = new Uint8Array(Number(this.file_pos + BigInt(data.byteLength)));
      this.file.data.set(old);
    }
    this.file.data.set(data, Number(this.file_pos));
    this.file_pos += BigInt(data.byteLength);
    return { ret: 0, nwritten: data.byteLength };
  }
  fd_pwrite(data, offset) {
    if (this.file.readonly) return { ret: ERRNO_BADF, nwritten: 0 };
    if (offset + BigInt(data.byteLength) > this.file.size) {
      const old = this.file.data;
      this.file.data = new Uint8Array(Number(offset + BigInt(data.byteLength)));
      this.file.data.set(old);
    }
    this.file.data.set(data, Number(offset));
    return { ret: 0, nwritten: data.byteLength };
  }
  fd_filestat_get() {
    return { ret: 0, filestat: this.file.stat() };
  }
  constructor(file) {
    super();
    this.file_pos = 0n;
    this.file = file;
  }
};
var OpenDirectory = class extends Fd {
  fd_seek(offset, whence) {
    return { ret: ERRNO_BADF, offset: 0n };
  }
  fd_tell() {
    return { ret: ERRNO_BADF, offset: 0n };
  }
  fd_allocate(offset, len) {
    return ERRNO_BADF;
  }
  fd_fdstat_get() {
    return { ret: 0, fdstat: new Fdstat(FILETYPE_DIRECTORY, 0) };
  }
  fd_readdir_single(cookie) {
    if (debug.enabled) {
      debug.log("readdir_single", cookie);
      debug.log(cookie, this.dir.contents.keys());
    }
    if (cookie == 0n) {
      return { ret: ERRNO_SUCCESS, dirent: new Dirent(1n, this.dir.ino, ".", FILETYPE_DIRECTORY) };
    } else if (cookie == 1n) {
      return { ret: ERRNO_SUCCESS, dirent: new Dirent(2n, this.dir.parent_ino(), "..", FILETYPE_DIRECTORY) };
    }
    if (cookie >= BigInt(this.dir.contents.size) + 2n) {
      return { ret: 0, dirent: null };
    }
    const [name, entry] = Array.from(this.dir.contents.entries())[Number(cookie - 2n)];
    return { ret: 0, dirent: new Dirent(cookie + 1n, entry.ino, name, entry.stat().filetype) };
  }
  path_filestat_get(flags, path_str) {
    const { ret: path_err, path } = Path.from(path_str);
    if (path == null) {
      return { ret: path_err, filestat: null };
    }
    const { ret, entry } = this.dir.get_entry_for_path(path);
    if (entry == null) {
      return { ret, filestat: null };
    }
    return { ret: 0, filestat: entry.stat() };
  }
  path_lookup(path_str, dirflags) {
    const { ret: path_ret, path } = Path.from(path_str);
    if (path == null) {
      return { ret: path_ret, inode_obj: null };
    }
    const { ret, entry } = this.dir.get_entry_for_path(path);
    if (entry == null) {
      return { ret, inode_obj: null };
    }
    return { ret: ERRNO_SUCCESS, inode_obj: entry };
  }
  path_open(dirflags, path_str, oflags, fs_rights_base, fs_rights_inheriting, fd_flags) {
    const { ret: path_ret, path } = Path.from(path_str);
    if (path == null) {
      return { ret: path_ret, fd_obj: null };
    }
    let { ret, entry } = this.dir.get_entry_for_path(path);
    if (entry == null) {
      if (ret != ERRNO_NOENT) {
        return { ret, fd_obj: null };
      }
      if ((oflags & OFLAGS_CREAT) == OFLAGS_CREAT) {
        const { ret: ret2, entry: new_entry } = this.dir.create_entry_for_path(path_str, (oflags & OFLAGS_DIRECTORY) == OFLAGS_DIRECTORY);
        if (new_entry == null) {
          return { ret: ret2, fd_obj: null };
        }
        entry = new_entry;
      } else {
        return { ret: ERRNO_NOENT, fd_obj: null };
      }
    } else if ((oflags & OFLAGS_EXCL) == OFLAGS_EXCL) {
      return { ret: ERRNO_EXIST, fd_obj: null };
    }
    if ((oflags & OFLAGS_DIRECTORY) == OFLAGS_DIRECTORY && entry.stat().filetype !== FILETYPE_DIRECTORY) {
      return { ret: ERRNO_NOTDIR, fd_obj: null };
    }
    return entry.path_open(oflags, fs_rights_base, fd_flags);
  }
  path_create_directory(path) {
    return this.path_open(0, path, OFLAGS_CREAT | OFLAGS_DIRECTORY, 0n, 0n, 0).ret;
  }
  path_link(path_str, inode, allow_dir) {
    const { ret: path_ret, path } = Path.from(path_str);
    if (path == null) {
      return path_ret;
    }
    if (path.is_dir) {
      return ERRNO_NOENT;
    }
    const { ret: parent_ret, parent_entry, filename, entry } = this.dir.get_parent_dir_and_entry_for_path(path, true);
    if (parent_entry == null || filename == null) {
      return parent_ret;
    }
    if (entry != null) {
      const source_is_dir = inode.stat().filetype == FILETYPE_DIRECTORY;
      const target_is_dir = entry.stat().filetype == FILETYPE_DIRECTORY;
      if (source_is_dir && target_is_dir) {
        if (allow_dir && entry instanceof Directory) {
          if (entry.contents.size == 0) {
          } else {
            return ERRNO_NOTEMPTY;
          }
        } else {
          return ERRNO_EXIST;
        }
      } else if (source_is_dir && !target_is_dir) {
        return ERRNO_NOTDIR;
      } else if (!source_is_dir && target_is_dir) {
        return ERRNO_ISDIR;
      } else if (inode.stat().filetype == FILETYPE_REGULAR_FILE && entry.stat().filetype == FILETYPE_REGULAR_FILE) {
      } else {
        return ERRNO_EXIST;
      }
    }
    if (!allow_dir && inode.stat().filetype == FILETYPE_DIRECTORY) {
      return ERRNO_PERM;
    }
    parent_entry.contents.set(filename, inode);
    return ERRNO_SUCCESS;
  }
  path_unlink(path_str) {
    const { ret: path_ret, path } = Path.from(path_str);
    if (path == null) {
      return { ret: path_ret, inode_obj: null };
    }
    const { ret: parent_ret, parent_entry, filename, entry } = this.dir.get_parent_dir_and_entry_for_path(path, true);
    if (parent_entry == null || filename == null) {
      return { ret: parent_ret, inode_obj: null };
    }
    if (entry == null) {
      return { ret: ERRNO_NOENT, inode_obj: null };
    }
    parent_entry.contents.delete(filename);
    return { ret: ERRNO_SUCCESS, inode_obj: entry };
  }
  path_unlink_file(path_str) {
    const { ret: path_ret, path } = Path.from(path_str);
    if (path == null) {
      return path_ret;
    }
    const { ret: parent_ret, parent_entry, filename, entry } = this.dir.get_parent_dir_and_entry_for_path(path, false);
    if (parent_entry == null || filename == null || entry == null) {
      return parent_ret;
    }
    if (entry.stat().filetype === FILETYPE_DIRECTORY) {
      return ERRNO_ISDIR;
    }
    parent_entry.contents.delete(filename);
    return ERRNO_SUCCESS;
  }
  path_remove_directory(path_str) {
    const { ret: path_ret, path } = Path.from(path_str);
    if (path == null) {
      return path_ret;
    }
    const { ret: parent_ret, parent_entry, filename, entry } = this.dir.get_parent_dir_and_entry_for_path(path, false);
    if (parent_entry == null || filename == null || entry == null) {
      return parent_ret;
    }
    if (!(entry instanceof Directory) || entry.stat().filetype !== FILETYPE_DIRECTORY) {
      return ERRNO_NOTDIR;
    }
    if (entry.contents.size !== 0) {
      return ERRNO_NOTEMPTY;
    }
    if (!parent_entry.contents.delete(filename)) {
      return ERRNO_NOENT;
    }
    return ERRNO_SUCCESS;
  }
  fd_filestat_get() {
    return { ret: 0, filestat: this.dir.stat() };
  }
  fd_filestat_set_size(size) {
    return ERRNO_BADF;
  }
  fd_read(size) {
    return { ret: ERRNO_BADF, data: new Uint8Array() };
  }
  fd_pread(size, offset) {
    return { ret: ERRNO_BADF, data: new Uint8Array() };
  }
  fd_write(data) {
    return { ret: ERRNO_BADF, nwritten: 0 };
  }
  fd_pwrite(data, offset) {
    return { ret: ERRNO_BADF, nwritten: 0 };
  }
  constructor(dir) {
    super();
    this.dir = dir;
  }
};
var PreopenDirectory = class extends OpenDirectory {
  fd_prestat_get() {
    return { ret: 0, prestat: Prestat.dir(this.prestat_name) };
  }
  constructor(name, contents) {
    super(new Directory(contents));
    this.prestat_name = name;
  }
};
var File = class extends Inode {
  path_open(oflags, fs_rights_base, fd_flags) {
    if (this.readonly && (fs_rights_base & BigInt(RIGHTS_FD_WRITE)) == BigInt(RIGHTS_FD_WRITE)) {
      return { ret: ERRNO_PERM, fd_obj: null };
    }
    if ((oflags & OFLAGS_TRUNC) == OFLAGS_TRUNC) {
      if (this.readonly) return { ret: ERRNO_PERM, fd_obj: null };
      this.data = new Uint8Array([]);
    }
    const file = new OpenFile(this);
    if (fd_flags & FDFLAGS_APPEND) file.fd_seek(0n, WHENCE_END);
    return { ret: ERRNO_SUCCESS, fd_obj: file };
  }
  get size() {
    return BigInt(this.data.byteLength);
  }
  stat() {
    return new Filestat(this.ino, FILETYPE_REGULAR_FILE, this.size);
  }
  constructor(data, options) {
    super();
    this.data = new Uint8Array(data);
    this.readonly = !!options?.readonly;
  }
};
var Path = class Path2 {
  static from(path) {
    const self = new Path2();
    self.is_dir = path.endsWith("/");
    if (path.startsWith("/")) {
      return { ret: ERRNO_NOTCAPABLE, path: null };
    }
    if (path.includes("\0")) {
      return { ret: ERRNO_INVAL, path: null };
    }
    for (const component of path.split("/")) {
      if (component === "" || component === ".") {
        continue;
      }
      if (component === "..") {
        if (self.parts.pop() == void 0) {
          return { ret: ERRNO_NOTCAPABLE, path: null };
        }
        continue;
      }
      self.parts.push(component);
    }
    return { ret: ERRNO_SUCCESS, path: self };
  }
  to_path_string() {
    let s = this.parts.join("/");
    if (this.is_dir) {
      s += "/";
    }
    return s;
  }
  constructor() {
    this.parts = [];
    this.is_dir = false;
  }
};
var Directory = class _Directory extends Inode {
  parent_ino() {
    if (this.parent == null) {
      return Inode.root_ino();
    }
    return this.parent.ino;
  }
  path_open(oflags, fs_rights_base, fd_flags) {
    return { ret: ERRNO_SUCCESS, fd_obj: new OpenDirectory(this) };
  }
  stat() {
    return new Filestat(this.ino, FILETYPE_DIRECTORY, 0n);
  }
  get_entry_for_path(path) {
    let entry = this;
    for (const component of path.parts) {
      if (!(entry instanceof _Directory)) {
        return { ret: ERRNO_NOTDIR, entry: null };
      }
      const child = entry.contents.get(component);
      if (child !== void 0) {
        entry = child;
      } else {
        debug.log(component);
        return { ret: ERRNO_NOENT, entry: null };
      }
    }
    if (path.is_dir) {
      if (entry.stat().filetype != FILETYPE_DIRECTORY) {
        return { ret: ERRNO_NOTDIR, entry: null };
      }
    }
    return { ret: ERRNO_SUCCESS, entry };
  }
  get_parent_dir_and_entry_for_path(path, allow_undefined) {
    const filename = path.parts.pop();
    if (filename === void 0) {
      return { ret: ERRNO_INVAL, parent_entry: null, filename: null, entry: null };
    }
    const { ret: entry_ret, entry: parent_entry } = this.get_entry_for_path(path);
    if (parent_entry == null) {
      return { ret: entry_ret, parent_entry: null, filename: null, entry: null };
    }
    if (!(parent_entry instanceof _Directory)) {
      return { ret: ERRNO_NOTDIR, parent_entry: null, filename: null, entry: null };
    }
    const entry = parent_entry.contents.get(filename);
    if (entry === void 0) {
      if (!allow_undefined) {
        return { ret: ERRNO_NOENT, parent_entry: null, filename: null, entry: null };
      } else {
        return { ret: ERRNO_SUCCESS, parent_entry, filename, entry: null };
      }
    }
    if (path.is_dir) {
      if (entry.stat().filetype != FILETYPE_DIRECTORY) {
        return { ret: ERRNO_NOTDIR, parent_entry: null, filename: null, entry: null };
      }
    }
    return { ret: ERRNO_SUCCESS, parent_entry, filename, entry };
  }
  create_entry_for_path(path_str, is_dir) {
    const { ret: path_ret, path } = Path.from(path_str);
    if (path == null) {
      return { ret: path_ret, entry: null };
    }
    let { ret: parent_ret, parent_entry, filename, entry } = this.get_parent_dir_and_entry_for_path(path, true);
    if (parent_entry == null || filename == null) {
      return { ret: parent_ret, entry: null };
    }
    if (entry != null) {
      return { ret: ERRNO_EXIST, entry: null };
    }
    debug.log("create", path);
    let new_child;
    if (!is_dir) {
      new_child = new File(new ArrayBuffer(0));
    } else {
      new_child = new _Directory(/* @__PURE__ */ new Map());
    }
    parent_entry.contents.set(filename, new_child);
    entry = new_child;
    return { ret: ERRNO_SUCCESS, entry };
  }
  constructor(contents) {
    super();
    this.parent = null;
    if (contents instanceof Array) {
      this.contents = new Map(contents);
    } else {
      this.contents = contents;
    }
    for (const entry of this.contents.values()) {
      if (entry instanceof _Directory) {
        entry.parent = this;
      }
    }
  }
};

// node_modules/@wasm-idle/llvm-core/dist/clang/src/browser-execution.js
function normalizeGuestPath(value) {
  const normalized = value.replace(/\\/g, "/");
  const absolute = normalized.startsWith("/") ? normalized : `/${normalized}`;
  const segments = [];
  for (const segment of absolute.split("/")) {
    if (!segment || segment === ".")
      continue;
    if (segment === "..") {
      throw new Error(`wasm-clang does not allow guest path traversal: ${value}`);
    }
    segments.push(segment);
  }
  return `/${segments.join("/")}`;
}
function toStandaloneBytes2(value) {
  if (typeof value === "string") {
    return new TextEncoder().encode(value);
  }
  return value instanceof Uint8Array ? new Uint8Array(value) : new Uint8Array(value);
}
var CaptureFd = class extends Fd {
  ino = Inode.issue_ino();
  decoder = new TextDecoder();
  chunks = [];
  output;
  constructor(output) {
    super();
    this.output = output;
  }
  fd_filestat_get() {
    return {
      ret: wasi_defs_exports.ERRNO_SUCCESS,
      filestat: new wasi_defs_exports.Filestat(this.ino, wasi_defs_exports.FILETYPE_CHARACTER_DEVICE, 0n)
    };
  }
  fd_fdstat_get() {
    const fdstat = new wasi_defs_exports.Fdstat(wasi_defs_exports.FILETYPE_CHARACTER_DEVICE, 0);
    fdstat.fs_rights_base = BigInt(wasi_defs_exports.RIGHTS_FD_WRITE);
    return {
      ret: wasi_defs_exports.ERRNO_SUCCESS,
      fdstat
    };
  }
  fd_write(data) {
    const chunk = this.decoder.decode(data, { stream: true });
    this.chunks.push(chunk);
    this.output?.(chunk);
    return {
      ret: wasi_defs_exports.ERRNO_SUCCESS,
      nwritten: data.byteLength
    };
  }
  getText() {
    const trailing = this.decoder.decode();
    if (trailing) {
      this.chunks.push(trailing);
      this.output?.(trailing);
    }
    return this.chunks.join("");
  }
};
var BufferedExecutionInput = class {
  currentChunk = new Uint8Array(0);
  currentOffset = 0;
  readInput;
  constructor(readInput) {
    this.readInput = readInput;
  }
  read(size) {
    while (this.currentOffset >= this.currentChunk.length) {
      const nextChunk = this.readInput?.();
      if (nextChunk == null) {
        return new Uint8Array(0);
      }
      this.currentChunk = toStandaloneBytes2(nextChunk);
      this.currentOffset = 0;
      if (this.currentChunk.byteLength === 0)
        continue;
    }
    const data = this.currentChunk.slice(this.currentOffset, this.currentOffset + size);
    this.currentOffset += data.byteLength;
    return data;
  }
};
var StdinFd = class extends Fd {
  ino = Inode.issue_ino();
  source;
  constructor(source) {
    super();
    this.source = source;
  }
  fd_filestat_get() {
    return {
      ret: wasi_defs_exports.ERRNO_SUCCESS,
      filestat: new wasi_defs_exports.Filestat(this.ino, wasi_defs_exports.FILETYPE_CHARACTER_DEVICE, 0n)
    };
  }
  fd_fdstat_get() {
    const fdstat = new wasi_defs_exports.Fdstat(wasi_defs_exports.FILETYPE_CHARACTER_DEVICE, 0);
    fdstat.fs_rights_base = BigInt(wasi_defs_exports.RIGHTS_FD_READ);
    return {
      ret: wasi_defs_exports.ERRNO_SUCCESS,
      fdstat
    };
  }
  fd_read(size) {
    return {
      ret: wasi_defs_exports.ERRNO_SUCCESS,
      data: this.source.read(size)
    };
  }
};
function createBrowserWasiHost(options = {}) {
  const rootDirectory = new Directory(/* @__PURE__ */ new Map());
  for (const file of options.files || []) {
    const guestPath = normalizeGuestPath(file.path);
    const segments = guestPath.slice(1).split("/");
    let directory = rootDirectory;
    for (const segment of segments.slice(0, -1)) {
      const existing = directory.contents.get(segment);
      if (existing instanceof Directory) {
        directory = existing;
        continue;
      }
      const nextDirectory = new Directory(/* @__PURE__ */ new Map());
      directory.contents.set(segment, nextDirectory);
      directory = nextDirectory;
    }
    directory.contents.set(segments.at(-1), new File(toStandaloneBytes2(file.contents)));
  }
  const stdin = new BufferedExecutionInput(options.stdin);
  const stdout = new CaptureFd(options.stdout);
  const stderr = new CaptureFd(options.stderr);
  const env = /* @__PURE__ */ new Map([["PWD", "/"]]);
  for (const [key, value] of Object.entries(options.env || {})) {
    env.set(key, value);
  }
  return {
    args: [options.programName || "main.wasm", ...options.args || []],
    envEntries: Array.from(env.entries()).map(([key, value]) => `${key}=${value}`),
    rootDirectory,
    stdout,
    stderr,
    fds: [
      new StdinFd(stdin),
      stdout,
      stderr,
      new PreopenDirectory("/tmp", /* @__PURE__ */ new Map()),
      new PreopenDirectory("/", rootDirectory.contents)
    ]
  };
}
async function executeBrowserClangArtifact(artifact, options = {}) {
  if (artifact.target !== "wasm32-wasi" || artifact.format !== "wasi-core-wasm") {
    throw new Error("wasm-clang currently executes only wasm32-wasi preview1 core wasm artifacts.");
  }
  const host = createBrowserWasiHost({
    ...options,
    programName: options.programName || artifact.fileName
  });
  const wasiInstance = new WASI(host.args, host.envEntries, host.fds, { debug: false });
  const bytes = artifact.bytes instanceof Uint8Array ? new Uint8Array(artifact.bytes) : new Uint8Array(artifact.bytes);
  const module = artifact.wasm || await WebAssembly.compile(bytes);
  const instanceRef = { current: null };
  const extraImports = typeof options.extraImports === "function" ? await options.extraImports({ host, module, instance: instanceRef }) : options.extraImports || {};
  const instance = await WebAssembly.instantiate(module, {
    ...extraImports,
    wasi_unstable: wasiInstance.wasiImport,
    wasi_snapshot_preview1: wasiInstance.wasiImport
  });
  instanceRef.current = instance;
  const exitCode = wasiInstance.start(instance);
  return {
    exitCode,
    stdout: host.stdout.getText(),
    stderr: host.stderr.getText()
  };
}

// node_modules/@wasm-idle/llvm-core/dist/clang/src/memory/memFs.js
var MemFS2 = class extends MemFS {
  constructor(options) {
    const { memfsModuleUrl, path, ...coreOptions } = options;
    super({
      ...coreOptions,
      moduleUrl: memfsModuleUrl || memfsUrl(path)
    });
  }
};

// node_modules/@wasm-idle/llvm-core/dist/clang/src/debug/controller.js
var DEFAULT_DEBUG_BREAKPOINT_BUFFER_INTS = 1028;
var DEFAULT_DEBUG_WATCH_BUFFER_BYTES = 1024;
var COMMAND_INDEX = 1;
var BREAKPOINT_VERSION_INDEX = 2;
var BREAKPOINT_COUNT_INDEX = 3;
var FIRST_BREAKPOINT_INDEX = 4;
var BrowserClangDebugController = class {
  debugBuffer;
  watchBuffer;
  watchResultBuffer;
  interruptBuffer;
  constructor(options = {}) {
    const breakpointBufferInts = Math.max(FIRST_BREAKPOINT_INDEX + 1, Math.trunc(options.breakpointBufferInts || DEFAULT_DEBUG_BREAKPOINT_BUFFER_INTS));
    const watchBufferBytes = Math.max(Int32Array.BYTES_PER_ELEMENT * 4, Math.ceil((options.watchBufferBytes || DEFAULT_DEBUG_WATCH_BUFFER_BYTES) / Int32Array.BYTES_PER_ELEMENT) * Int32Array.BYTES_PER_ELEMENT);
    this.debugBuffer = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * breakpointBufferInts));
    this.watchBuffer = new Int32Array(new SharedArrayBuffer(watchBufferBytes));
    this.watchResultBuffer = new Int32Array(new SharedArrayBuffer(watchBufferBytes));
    this.interruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
    this.setBreakpoints(options.breakpoints || []);
  }
  get breakpoints() {
    const count = Math.max(0, Atomics.load(this.debugBuffer, BREAKPOINT_COUNT_INDEX));
    return Array.from({ length: count }, (_, index) => Atomics.load(this.debugBuffer, FIRST_BREAKPOINT_INDEX + index)).filter((line) => line > 0);
  }
  notify(command = 0) {
    if (command > 0) {
      Atomics.store(this.debugBuffer, COMMAND_INDEX, command);
    }
    Atomics.add(this.debugBuffer, 0, 1);
    Atomics.notify(this.debugBuffer, 0);
  }
  setBreakpoints(lines) {
    const next = [...new Set(lines.filter((line) => Number.isInteger(line) && line > 0))].sort((left, right) => left - right).slice(0, Math.max(0, this.debugBuffer.length - FIRST_BREAKPOINT_INDEX));
    for (let index = FIRST_BREAKPOINT_INDEX; index < this.debugBuffer.length; index += 1) {
      Atomics.store(this.debugBuffer, index, next[index - FIRST_BREAKPOINT_INDEX] || 0);
    }
    Atomics.store(this.debugBuffer, BREAKPOINT_COUNT_INDEX, next.length);
    Atomics.add(this.debugBuffer, BREAKPOINT_VERSION_INDEX, 1);
  }
  dispatch(command) {
    this.notify(command === "stepInto" ? 2 : command === "nextLine" ? 3 : command === "stepOut" ? 4 : 1);
  }
  resume() {
    this.dispatch("continue");
  }
  stepInto() {
    this.dispatch("stepInto");
  }
  nextLine() {
    this.dispatch("nextLine");
  }
  stepOut() {
    this.dispatch("stepOut");
  }
  async evaluate(expression, timeoutMs = 5e3) {
    resetBufferedStdin(this.watchResultBuffer);
    const previousSequence = bufferedSequence(this.watchResultBuffer);
    flushQueuedStdin([expression], this.watchBuffer);
    this.notify(5);
    return await waitForBufferedSequenceChange(this.watchResultBuffer, previousSequence, timeoutMs) ?? "?";
  }
  interrupt() {
    this.interruptBuffer[0] = 2;
    this.notify();
  }
  clear() {
    this.interruptBuffer[0] = 0;
    resetBufferedStdin(this.watchBuffer);
    resetBufferedStdin(this.watchResultBuffer);
    this.debugBuffer.fill(0);
  }
  createRuntimeRunOptions(options = {}) {
    if (options.breakpoints) {
      this.setBreakpoints(options.breakpoints);
    }
    this.interruptBuffer[0] = 0;
    resetBufferedStdin(this.watchBuffer);
    resetBufferedStdin(this.watchResultBuffer);
    return {
      debug: true,
      breakpoints: this.breakpoints,
      pauseOnEntry: !!options.pauseOnEntry,
      debugBuffer: this.debugBuffer,
      interruptBuffer: this.interruptBuffer,
      watchBuffer: this.watchBuffer,
      watchResultBuffer: this.watchResultBuffer
    };
  }
};
var createBrowserClangDebugController = (options = {}) => new BrowserClangDebugController(options);

// node_modules/@wasm-idle/llvm-core/dist/clang/src/debug/driver.js
var BrowserClangDebugDriver = class {
  runtime;
  controller;
  constructor(runtime, controller) {
    this.runtime = runtime;
    this.controller = controller;
  }
  get breakpoints() {
    return this.controller.breakpoints;
  }
  setBreakpoints(lines) {
    this.controller.setBreakpoints(lines);
  }
  resume() {
    this.controller.resume();
  }
  stepInto() {
    this.controller.stepInto();
  }
  nextLine() {
    this.controller.nextLine();
  }
  stepOut() {
    this.controller.stepOut();
  }
  evaluate(expression, timeoutMs) {
    return this.controller.evaluate(expression, timeoutMs);
  }
  interrupt() {
    this.controller.interrupt();
  }
  clear() {
    this.controller.clear();
  }
  async run(request) {
    const { code, breakpoints, pauseOnEntry, ...runtimeOptions } = request;
    await this.runtime.compileLinkRun(code, {
      ...runtimeOptions,
      ...this.controller.createRuntimeRunOptions({
        breakpoints,
        pauseOnEntry
      })
    });
  }
};
async function createBrowserClangDebugDriver(options) {
  const runtime = new runtime_default(options);
  await runtime.ready;
  const controller = new BrowserClangDebugController(options);
  return new BrowserClangDebugDriver(runtime, controller);
}

// node_modules/@wasm-idle/llvm-core/dist/objective-c/src/worker.js
var OBJECTIVEC_ASSET_NAMES = [
  "libobjc.a",
  "headers.json",
  "libgnustep-base.a",
  "libgnustep-base.o",
  "foundation-headers.json",
  "libffi.a"
];
var workerScope = null;
var workerDependencies = null;
var postMessage2 = (message) => workerScope?.postMessage(message);
var configureWorkerRuntimeAssets = (config) => workerDependencies?.configureRuntimeAssets(config);
var handleWorkerAssetMessage = (message) => workerDependencies?.handleAssetMessage(message) ?? false;
var waitForBufferedStdin = (buffer, requestInput) => {
  if (!workerDependencies)
    throw new Error("Objective-C worker dependencies are not installed.");
  return workerDependencies.waitForStdin(buffer, requestInput);
};
var textDecoder = new TextDecoder("utf-8", { fatal: true });
var textEncoder = new TextEncoder();
var MAX_OBJECTIVEC_HEADER_ENTRIES = 4096;
var MAX_OBJECTIVEC_HEADER_PATH_BYTES = 1024;
var OBJECTIVEC_HEADER_CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/u;
var FFI_TYPE_VOID = 0;
var FFI_TYPE_INT = 1;
var FFI_TYPE_FLOAT = 2;
var FFI_TYPE_DOUBLE = 3;
var FFI_TYPE_UINT8 = 5;
var FFI_TYPE_SINT8 = 6;
var FFI_TYPE_UINT16 = 7;
var FFI_TYPE_SINT16 = 8;
var FFI_TYPE_UINT32 = 9;
var FFI_TYPE_SINT32 = 10;
var FFI_TYPE_UINT64 = 11;
var FFI_TYPE_SINT64 = 12;
var FFI_TYPE_POINTER = 14;
var freeObjectiveCTableIndexes = [];
var FOUNDATION_INCLUDE_PATTERN = /^\s*#\s*(?:include|import)(?:_next)?\s+[<"]([^>"]+)[>"]/gm;
var FOUNDATION_DIRECT_HEADER_PREFIXES = ["Foundation/", "GNUstepBase/", "CoreFoundation/"];
var FOUNDATION_OBJECTIVEC2_BLOCKS_HEADER = "ObjectiveC2/blocks_runtime.h";
var FOUNDATION_OBJECTIVEC2_RUNTIME_HEADER = "ObjectiveC2/objc/runtime.h";
var FOUNDATION_BLOCKS_MACRO_SHIM = `
#ifndef BLOCK_SCOPE
#define BLOCK_SCOPE __block
#endif
#ifndef DEFINE_BLOCK_TYPE
#define DEFINE_BLOCK_TYPE(name, retTy, argTys, ...) typedef retTy(^name)(argTys, ## __VA_ARGS__)
#endif
#ifndef DEFINE_BLOCK_TYPE_NO_ARGS
#define DEFINE_BLOCK_TYPE_NO_ARGS(name, retTy) typedef retTy(^name)()
#endif
#ifndef CALL_NON_NULL_BLOCK
#define CALL_NON_NULL_BLOCK(block, args, ...) block(args, ## __VA_ARGS__)
#endif
#ifndef CALL_NON_NULL_BLOCK_NO_ARGS
#define CALL_NON_NULL_BLOCK_NO_ARGS(block) block()
#endif
`;
var OBJC_CONSTRUCTOR_SOURCE = `extern void __wasm_idle_objc_load(void) __asm__(".objcv2_load_function") __attribute__((weak));

__attribute__((constructor))
static void __wasm_idle_objc_ctor(void)
{
    if (__wasm_idle_objc_load) __wasm_idle_objc_load();
}
`;
var FOUNDATION_LINK_ROOT_SYMBOLS = [
  "._OBJC_CLASS_NSObject",
  "._OBJC_CLASS_NSConstantString",
  "GSPrivateNotifyASAP"
];
var stdinBufferObjectiveC = null;
var clang = null;
var objectiveCAssetsObjectiveC = null;
var buildCounter = 0;
var preparedArtifactObjectiveC = null;
var preparedArtifactKeyObjectiveC = "";
var foundationAssetsLoadedObjectiveC = false;
var foundationHeadersObjectiveC = null;
var libgnustepBaseBytesObjectiveC = null;
var libffiBytesObjectiveC = null;
var foundationLibrariesInstalledObjectiveC = false;
var installedHeaderPathsObjectiveC = /* @__PURE__ */ new Set();
var hasInitialStdinObjectiveC = false;
var initialStdinObjectiveC = null;
var initialStdinConsumedObjectiveC = false;
var normalizeWorkspacePath2 = (value) => value.replaceAll("\\", "/").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
var basename = (value) => value.split("/").pop() || value;
var stemOf = (value) => basename(value).replace(/\.[^.]+$/, "") || "main";
var ensureTrailingNewline = (source) => source.endsWith("\n") ? source : `${source}
`;
function resolveHostedAssetUrl(value, label) {
  const href = value?.trim();
  if (!href)
    throw new Error(`${label} is required.`);
  let resolved;
  try {
    resolved = new URL(href, typeof location !== "undefined" ? location.href : void 0);
  } catch {
    throw new Error(`${label} must be an absolute HTTP(S) URL.`);
  }
  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
    throw new Error(`${label} must use HTTP(S).`);
  }
  return resolved.toString();
}
function resolveObjectiveCAssetConfig(assets) {
  if (typeof workerDependencies?.verifyRuntimeAssetIntegrity !== "function") {
    throw new Error("Objective-C runtime asset integrity verifier is not installed.");
  }
  const integrity = assets.integrity;
  const maxAssetBytes = assets.maxAssetBytes ?? DEFAULT_MAX_DECOMPRESSED_ASSET_BYTES;
  if (!Number.isSafeInteger(maxAssetBytes) || maxAssetBytes <= 0) {
    throw new Error("Objective-C maxAssetBytes must be a positive safe integer.");
  }
  if (!integrity || typeof integrity !== "object" || Array.isArray(integrity)) {
    throw new Error("Objective-C runtime asset integrity receipt is required.");
  }
  const receivedAssetNames = Object.keys(integrity).sort();
  const expectedAssetNames = [...OBJECTIVEC_ASSET_NAMES].sort();
  if (receivedAssetNames.length !== expectedAssetNames.length || receivedAssetNames.some((assetName, index) => assetName !== expectedAssetNames[index])) {
    throw new Error("Objective-C runtime asset integrity receipt is incomplete.");
  }
  const verifiedIntegrity = Object.freeze(Object.fromEntries(OBJECTIVEC_ASSET_NAMES.map((assetName) => {
    const receipt = integrity[assetName];
    if (!receipt || typeof receipt !== "object" || !Number.isSafeInteger(receipt.bytes) || receipt.bytes <= 0 || typeof receipt.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(receipt.sha256)) {
      throw new Error(`Objective-C runtime asset integrity receipt is invalid for ${assetName}.`);
    }
    if (receipt.bytes > maxAssetBytes) {
      throw new Error(`Objective-C runtime asset ${assetName} exceeds the ${maxAssetBytes} byte limit.`);
    }
    return [assetName, Object.freeze({ bytes: receipt.bytes, sha256: receipt.sha256 })];
  })));
  return {
    libobjcUrl: resolveHostedAssetUrl(assets.libobjcUrl, "Objective-C libobjc URL"),
    headersUrl: resolveHostedAssetUrl(assets.headersUrl, "Objective-C headers URL"),
    libgnustepBaseUrl: resolveHostedAssetUrl(assets.libgnustepBaseUrl, "Objective-C GNUstep Base URL"),
    libgnustepBaseObjectUrl: resolveHostedAssetUrl(assets.libgnustepBaseObjectUrl, "Objective-C GNUstep Base object URL"),
    foundationHeadersUrl: resolveHostedAssetUrl(assets.foundationHeadersUrl, "Objective-C Foundation headers URL"),
    libffiUrl: resolveHostedAssetUrl(assets.libffiUrl, "Objective-C libffi URL"),
    integrity: verifiedIntegrity,
    maxAssetBytes
  };
}
var resolveInputPath = (activePath) => {
  const normalized = normalizeWorkspacePath2(activePath || "");
  if (!normalized)
    return "main.m";
  return /\.[A-Za-z0-9_-]+$/.test(normalized) ? normalized : `${normalized}.m`;
};
async function fetchBytes(url, label, assetName, integrity, maxOutputBytes = integrity[assetName].bytes) {
  const receipt = integrity[assetName];
  const byteLimit = Math.min(maxOutputBytes, receipt.bytes);
  const resolvedUrl = new URL(url).href;
  const requestSignal = new AbortController().signal;
  let bytes;
  try {
    bytes = await readBuffer(resolvedUrl, void 0, byteLimit, requestSignal);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const failedResponsePrefix = `Failed to load runtime asset ${resolvedUrl}: `;
    if (!message.startsWith(failedResponsePrefix))
      throw error;
    const compressedAssetUrl = new URL(resolvedUrl);
    compressedAssetUrl.pathname += ".gz";
    const compressedUrl = compressedAssetUrl.href;
    try {
      bytes = await readBuffer(compressedUrl, void 0, byteLimit, requestSignal);
    } catch (compressedError) {
      const compressedMessage = compressedError instanceof Error ? compressedError.message : String(compressedError);
      if (!compressedMessage.startsWith(`Failed to load runtime asset ${compressedUrl}: `)) {
        throw compressedError;
      }
      throw new Error(`Failed to load ${label}: ${message.slice(failedResponsePrefix.length)}`, {
        cause: compressedError
      });
    }
  }
  const verifyIntegrity = workerDependencies?.verifyRuntimeAssetIntegrity;
  if (!verifyIntegrity) {
    throw new Error("Objective-C runtime asset integrity verifier is not installed.");
  }
  await verifyIntegrity({
    asset: assetName,
    bytes,
    expected: {
      sha256: receipt.sha256,
      bytes: receipt.bytes,
      uncompressedSha256: receipt.sha256,
      uncompressedBytes: receipt.bytes
    },
    stage: "uncompressed",
    runtimeId: "OBJC",
    profileId: "wasm-llvm/objective-c-browser"
  });
  return bytes;
}
async function fetchJson(url, label, assetName, integrity) {
  const bytes = await fetchBytes(url, label, assetName, integrity, DEFAULT_MAX_RUNTIME_JSON_BYTES);
  let parsed;
  try {
    parsed = JSON.parse(textDecoder.decode(bytes));
  } catch (error) {
    throw new Error(`${label} metadata is not valid UTF-8 JSON.`, { cause: error });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed) || Object.getPrototypeOf(parsed) !== Object.prototype) {
    throw new Error(`${label} metadata must be a plain object.`);
  }
  const entries = Object.entries(parsed);
  if (entries.length > MAX_OBJECTIVEC_HEADER_ENTRIES) {
    throw new Error(`${label} metadata exceeds the ${MAX_OBJECTIVEC_HEADER_ENTRIES} header entry limit.`);
  }
  const headers = /* @__PURE__ */ Object.create(null);
  const filePaths = /* @__PURE__ */ new Set();
  const directoryPaths = /* @__PURE__ */ new Set();
  for (const [headerPath, headerSource] of entries) {
    if (typeof headerSource !== "string") {
      throw new Error(`${label} metadata contains a non-string header source.`);
    }
    const pathParts = headerPath.split("/");
    if (!headerPath || headerPath.startsWith("/") || /^[A-Za-z]:\//u.test(headerPath) || headerPath.includes("\\") || OBJECTIVEC_HEADER_CONTROL_CHARACTER_PATTERN.test(headerPath) || pathParts.some((part) => !part || part === "." || part === "..")) {
      throw new Error(`${label} metadata contains an unsafe header path.`);
    }
    if (textEncoder.encode(headerPath).byteLength > MAX_OBJECTIVEC_HEADER_PATH_BYTES) {
      throw new Error(`${label} metadata header path exceeds the ${MAX_OBJECTIVEC_HEADER_PATH_BYTES} byte limit.`);
    }
    if (directoryPaths.has(headerPath)) {
      throw new Error(`${label} metadata contains a file/directory path collision.`);
    }
    let parentPath = "";
    for (const part of pathParts.slice(0, -1)) {
      parentPath = parentPath ? `${parentPath}/${part}` : part;
      if (filePaths.has(parentPath)) {
        throw new Error(`${label} metadata contains a file/directory path collision.`);
      }
      directoryPaths.add(parentPath);
    }
    filePaths.add(headerPath);
    headers[headerPath] = headerSource;
  }
  return headers;
}
function createObjectiveCLibffiImports(instanceRef) {
  const dataView = () => {
    const memory = instanceRef.current?.exports.memory;
    if (!(memory instanceof WebAssembly.Memory)) {
      throw new Error("Objective-C libffi bridge missing exported memory");
    }
    return new DataView(memory.buffer);
  };
  const functionTable = () => {
    const table = instanceRef.current?.exports.__indirect_function_table;
    if (!(table instanceof WebAssembly.Table)) {
      throw new Error("Objective-C libffi bridge missing exported function table");
    }
    return table;
  };
  const malloc = () => {
    const exportedMalloc = instanceRef.current?.exports.malloc;
    if (typeof exportedMalloc !== "function") {
      throw new Error("Objective-C libffi bridge missing exported malloc");
    }
    return exportedMalloc;
  };
  const free = () => {
    const exportedFree = instanceRef.current?.exports.free;
    if (typeof exportedFree !== "function") {
      throw new Error("Objective-C libffi bridge missing exported free");
    }
    return exportedFree;
  };
  const emptyTableSlot = () => {
    const table = functionTable();
    const reused = freeObjectiveCTableIndexes.pop();
    if (reused != null)
      return reused;
    const index = table.length;
    table.grow(1);
    return index;
  };
  const readU32 = (view, pointer) => view.getUint32(pointer, true);
  const readTypeId = (view, typePointer) => view.getUint16(typePointer + 6, true);
  const readArgument = (view, argPointer, typeId) => {
    switch (typeId) {
      case FFI_TYPE_INT:
      case FFI_TYPE_UINT32:
        return view.getUint32(argPointer, true);
      case FFI_TYPE_SINT32:
        return view.getInt32(argPointer, true);
      case FFI_TYPE_FLOAT:
        return view.getFloat32(argPointer, true);
      case FFI_TYPE_DOUBLE:
        return view.getFloat64(argPointer, true);
      case FFI_TYPE_UINT8:
        return view.getUint8(argPointer);
      case FFI_TYPE_SINT8:
        return view.getInt8(argPointer);
      case FFI_TYPE_UINT16:
        return view.getUint16(argPointer, true);
      case FFI_TYPE_SINT16:
        return view.getInt16(argPointer, true);
      case FFI_TYPE_UINT64:
        return view.getBigUint64(argPointer, true);
      case FFI_TYPE_SINT64:
        return view.getBigInt64(argPointer, true);
      case FFI_TYPE_POINTER:
        return view.getUint32(argPointer, true);
      default:
        throw new Error(`Objective-C libffi bridge cannot marshal argument type ${typeId}`);
    }
  };
  const writeResult = (view, rvalue, typeId, result) => {
    if (!rvalue || typeId === FFI_TYPE_VOID)
      return;
    switch (typeId) {
      case FFI_TYPE_INT:
      case FFI_TYPE_UINT32:
        view.setUint32(rvalue, Number(result), true);
        break;
      case FFI_TYPE_SINT32:
        view.setInt32(rvalue, Number(result), true);
        break;
      case FFI_TYPE_FLOAT:
        view.setFloat32(rvalue, Number(result), true);
        break;
      case FFI_TYPE_DOUBLE:
        view.setFloat64(rvalue, Number(result), true);
        break;
      case FFI_TYPE_UINT8:
        view.setUint8(rvalue, Number(result));
        break;
      case FFI_TYPE_SINT8:
        view.setInt8(rvalue, Number(result));
        break;
      case FFI_TYPE_UINT16:
        view.setUint16(rvalue, Number(result), true);
        break;
      case FFI_TYPE_SINT16:
        view.setInt16(rvalue, Number(result), true);
        break;
      case FFI_TYPE_UINT64:
        view.setBigUint64(rvalue, BigInt(result), true);
        break;
      case FFI_TYPE_SINT64:
        view.setBigInt64(rvalue, BigInt(result), true);
        break;
      case FFI_TYPE_POINTER:
        view.setUint32(rvalue, Number(result), true);
        break;
      default:
        throw new Error(`Objective-C libffi bridge cannot marshal return type ${typeId}`);
    }
  };
  return {
    env: {
      ffi_call_js: (cif, fn, rvalue, avalue) => {
        const view = dataView();
        const nargs = readU32(view, cif + 4);
        const argTypesPointer = readU32(view, cif + 8);
        const returnTypePointer = readU32(view, cif + 12);
        const returnTypeId = readTypeId(view, returnTypePointer);
        const args = [];
        for (let index = 0; index < nargs; index += 1) {
          const argPointer = readU32(view, avalue + index * 4);
          const argTypePointer = readU32(view, argTypesPointer + index * 4);
          args.push(readArgument(view, argPointer, readTypeId(view, argTypePointer)));
        }
        const callable = functionTable().get(fn);
        if (typeof callable !== "function") {
          throw new Error(`Objective-C libffi bridge missing function table entry ${fn}`);
        }
        writeResult(view, rvalue, returnTypeId, callable(...args));
      },
      ffi_closure_alloc_js: (size, code) => {
        const view = dataView();
        const closure = malloc()(size);
        const index = emptyTableSlot();
        if (code)
          view.setUint32(code, index, true);
        view.setUint32(closure, index, true);
        return closure;
      },
      ffi_closure_free_js: (closure) => {
        const view = dataView();
        const index = readU32(view, closure);
        freeObjectiveCTableIndexes.push(index);
        free()(closure);
      },
      ffi_prep_closure_loc_js: () => 2,
      GSLeftInsertionPointForKeyInSortedRange: (_key, _buffer, location2 = 0) => location2,
      GSRightInsertionPointForKeyInSortedRange: (_key, _buffer, location2 = 0) => location2,
      GSSortStable: () => void 0,
      GSSortStableConcurrent: () => void 0,
      GSSortUnstable: () => void 0,
      GSSortUnstableConcurrent: () => void 0
    }
  };
}
async function addFileWithDirectories(runtime, filePath, contents) {
  const parts = normalizeWorkspacePath2(filePath).split("/").slice(0, -1);
  let directory = "";
  for (const part of parts) {
    directory = directory ? `${directory}/${part}` : part;
    try {
      runtime.memfs.addDirectory(directory);
    } catch {
    }
  }
  runtime.memfs.addFile(filePath, contents);
}
async function loadObjectiveCRuntime(clangAssets, objectivecAssets, log) {
  const trace = (stage) => {
    if (log)
      console.log(`[wasm-idle:objectivec-worker] load: ${stage}`);
  };
  trace("resolving asset configuration");
  const hostedObjectiveCAssets = resolveObjectiveCAssetConfig(objectivecAssets);
  configureWorkerRuntimeAssets(clangAssets || null);
  const clangBaseUrl = clangAssets?.baseUrl || "";
  const manifest = await loadRuntimeManifest(resolveRuntimeManifestUrl(clangBaseUrl), fetch, void 0, hostedObjectiveCAssets.maxAssetBytes);
  trace("compiler manifest loaded");
  clang = new runtime_default({
    stdout: (output) => postMessage2({ output }),
    stdin: () => "",
    progress: (value) => postMessage2({ progress: value }),
    onDebugEvent: (debugEvent) => postMessage2({ debugEvent }),
    log,
    maxAssetBytes: hostedObjectiveCAssets.maxAssetBytes,
    runtimeBaseUrl: clangBaseUrl,
    manifest
  });
  trace("compiler host constructed");
  objectiveCAssetsObjectiveC = hostedObjectiveCAssets;
  foundationAssetsLoadedObjectiveC = false;
  libgnustepBaseBytesObjectiveC = null;
  libffiBytesObjectiveC = null;
  foundationLibrariesInstalledObjectiveC = false;
  installedHeaderPathsObjectiveC.clear();
  const [libobjcBytes, headers] = await Promise.all([
    fetchBytes(hostedObjectiveCAssets.libobjcUrl, "libobjc.a", "libobjc.a", hostedObjectiveCAssets.integrity),
    fetchJson(hostedObjectiveCAssets.headersUrl, "Objective-C headers", "headers.json", hostedObjectiveCAssets.integrity)
  ]);
  trace("Objective-C base assets loaded");
  await clang.ready;
  trace("compiler host ready");
  trace("installing Objective-C headers and runtime");
  postMessage2({
    progress: { percent: 99, stage: "Installing Objective-C headers and runtime" }
  });
  for (const [headerPath, headerSource] of Object.entries(headers)) {
    installedHeaderPathsObjectiveC.add(headerPath);
    await addFileWithDirectories(clang, headerPath, headerSource);
  }
  clang.memfs.addFile("libobjc.a", libobjcBytes);
  trace("Objective-C headers and runtime installed");
}
async function ensureObjectiveCFoundationAssets() {
  if (!clang)
    throw new Error("Objective-C runtime is not loaded.");
  if (!objectiveCAssetsObjectiveC) {
    throw new Error("Objective-C runtime asset config is not loaded.");
  }
  if (foundationAssetsLoadedObjectiveC)
    return;
  const foundationHeaders = await fetchJson(objectiveCAssetsObjectiveC.foundationHeadersUrl, "Objective-C Foundation headers", "foundation-headers.json", objectiveCAssetsObjectiveC.integrity);
  foundationHeadersObjectiveC = foundationHeaders;
  if (foundationHeaders["blocks_runtime.h"] != null && !installedHeaderPathsObjectiveC.has("blocks_runtime.h")) {
    installedHeaderPathsObjectiveC.add("blocks_runtime.h");
    await addFileWithDirectories(clang, "blocks_runtime.h", foundationHeaders["blocks_runtime.h"]);
  }
  foundationAssetsLoadedObjectiveC = true;
}
async function installObjectiveCFoundationLibraries() {
  if (!clang)
    throw new Error("Objective-C runtime is not loaded.");
  if (!objectiveCAssetsObjectiveC) {
    throw new Error("Objective-C runtime asset config is not loaded.");
  }
  if (foundationLibrariesInstalledObjectiveC)
    return;
  if (!libgnustepBaseBytesObjectiveC || !libffiBytesObjectiveC) {
    const [libgnustepBaseBytes, libffiBytes] = await Promise.all([
      fetchBytes(objectiveCAssetsObjectiveC.libgnustepBaseUrl, "libgnustep-base.a", "libgnustep-base.a", objectiveCAssetsObjectiveC.integrity),
      fetchBytes(objectiveCAssetsObjectiveC.libffiUrl, "libffi.a", "libffi.a", objectiveCAssetsObjectiveC.integrity)
    ]);
    libgnustepBaseBytesObjectiveC = libgnustepBaseBytes;
    libffiBytesObjectiveC = libffiBytes;
  }
  clang.memfs.addFile("libffi.a", libffiBytesObjectiveC);
  clang.memfs.addFile("libgnustep-base.a", libgnustepBaseBytesObjectiveC);
  foundationLibrariesInstalledObjectiveC = true;
}
function readProgramStdin() {
  if (hasInitialStdinObjectiveC) {
    if (initialStdinConsumedObjectiveC)
      return null;
    initialStdinConsumedObjectiveC = true;
    return initialStdinObjectiveC ?? "";
  }
  return waitForBufferedStdin(stdinBufferObjectiveC, () => postMessage2({ buffer: true }));
}
function sourceLanguageForPath(filePath) {
  const normalized = filePath.toLowerCase();
  if (normalized.endsWith(".mm"))
    return "objective-c++";
  if (normalized.endsWith(".m"))
    return "objective-c";
  if (normalized.endsWith(".c"))
    return "c";
  return null;
}
function usesObjectiveCRuntime(language) {
  return language === "objective-c" || language === "objective-c++";
}
function sourceImportsFoundation(source) {
  return /#\s*(?:include|import)\s+[<"]Foundation\/|@import\s+Foundation\b/u.test(source);
}
function resolveFoundationHeaderPath(currentPath, includeName, headers) {
  if (includeName.startsWith("ObjectiveC2/")) {
    const aliasedHeader = includeName.slice("ObjectiveC2/".length);
    if (headers[aliasedHeader] != null)
      return aliasedHeader;
    if (headers[`objc/${aliasedHeader}`] != null)
      return `objc/${aliasedHeader}`;
    return resolveFoundationHeaderPath(currentPath, aliasedHeader, headers);
  }
  if (headers[includeName] != null)
    return includeName;
  const currentDirectory = currentPath.includes("/") ? currentPath.split("/").slice(0, -1).join("/") : "";
  if (currentDirectory && !includeName.includes("/")) {
    const relativePath = `${currentDirectory}/${includeName}`;
    if (headers[relativePath] != null)
      return relativePath;
  }
  for (const prefix of ["Foundation", "CoreFoundation", "GNUstepBase"]) {
    const prefixedPath = `${prefix}/${includeName}`;
    if (headers[prefixedPath] != null)
      return prefixedPath;
  }
  return null;
}
function foundationHeaderSourceForInline(headerPath, headers) {
  const source = headers[headerPath];
  if (source == null)
    return "";
  if (headerPath === "Foundation/NSObjCRuntime.h") {
    return `#include <stdint.h>
@class NSString;
#ifndef GSNativeChar
typedef char GSNativeChar;
#endif
${source.replace(/^\s*#\s*import\s*<GNUstepBase\/GSBlocks\.h>\s*$/m, FOUNDATION_BLOCKS_MACRO_SHIM).replace(/^\s*#\s*import\s*<GNUstepBase\/GSObjCRuntime\.h>\s*$/m, "")}`;
  }
  return source;
}
function inlineFoundationHeader(headerPath, headers, seen = /* @__PURE__ */ new Set()) {
  if (seen.has(headerPath))
    return "";
  seen.add(headerPath);
  const source = foundationHeaderSourceForInline(headerPath, headers);
  if (!source)
    return "";
  let rewritten = "";
  let lastIndex = 0;
  FOUNDATION_INCLUDE_PATTERN.lastIndex = 0;
  for (const match of source.matchAll(FOUNDATION_INCLUDE_PATTERN)) {
    const includeName = match[1];
    const resolvedPath = resolveFoundationHeaderPath(headerPath, includeName, headers);
    const shouldInlineHeader = resolvedPath != null && FOUNDATION_DIRECT_HEADER_PREFIXES.some((prefix) => resolvedPath.startsWith(prefix));
    rewritten += source.slice(lastIndex, match.index);
    if (resolvedPath && shouldInlineHeader && resolvedPath !== "GNUstepBase/GSBlocks.h" && resolvedPath !== "GNUstepBase/GSObjCRuntime.h") {
      rewritten += `
${inlineFoundationHeader(resolvedPath, headers, seen)}
`;
    } else if (includeName === FOUNDATION_OBJECTIVEC2_BLOCKS_HEADER) {
      rewritten += match[0].replace(includeName, "blocks_runtime.h");
    } else if (includeName === FOUNDATION_OBJECTIVEC2_RUNTIME_HEADER) {
      rewritten += match[0].replace(includeName, "objc/runtime.h");
    } else {
      rewritten += match[0];
    }
    lastIndex = match.index + match[0].length;
  }
  return rewritten + source.slice(lastIndex);
}
function inlineFoundationImportsForSource(sourcePath, source) {
  if (!foundationHeadersObjectiveC)
    return source;
  const seen = /* @__PURE__ */ new Set();
  let rewritten = "";
  let lastIndex = 0;
  FOUNDATION_INCLUDE_PATTERN.lastIndex = 0;
  for (const match of source.matchAll(FOUNDATION_INCLUDE_PATTERN)) {
    if (!FOUNDATION_DIRECT_HEADER_PREFIXES.some((prefix) => match[1].startsWith(prefix)) && match[1] !== "Foundation.h") {
      continue;
    }
    const headerPath = resolveFoundationHeaderPath(sourcePath, match[1], foundationHeadersObjectiveC);
    if (!headerPath)
      continue;
    rewritten += source.slice(lastIndex, match.index);
    rewritten += `
${inlineFoundationHeader(headerPath, foundationHeadersObjectiveC, seen)}
`;
    lastIndex = match.index + match[0].length;
  }
  return rewritten + source.slice(lastIndex);
}
async function compileObjectiveCObject(input, code, obj, language, compileArgs = [], debug2 = false, transformSource) {
  if (!clang)
    throw new Error("Objective-C runtime is not loaded.");
  if (debug2) {
    if (language === "objective-c++") {
      throw new Error("Objective-C++ trace debugging is not supported.");
    }
    if (code == null) {
      throw new Error("Objective-C debug compilation requires the active source text.");
    }
    await clang.compile({
      input,
      code,
      obj,
      language: language === "objective-c" ? "OBJC" : "C",
      compileArgs,
      debug: true,
      transformSource
    });
    return;
  }
  if (code != null)
    await addFileWithDirectories(clang, input, code);
  clang.memfs.addFile(obj, new Uint8Array(0));
  const clangModule = await clang.getModule(clang.assetUrls.clang);
  const clangRuntime = clang;
  const originalStdout = clangRuntime.stdout;
  const compileOutput = [];
  const resourceDir = clang.compilerConfig?.resourceDir || "/lib/clang/8.0.1";
  const args = [
    "-cc1",
    "-triple",
    CLANG_WASI_TARGET,
    "-emit-obj",
    "-disable-free",
    "-isysroot",
    "/",
    "-resource-dir",
    resourceDir,
    ...clangSystemIncludePaths(language === "objective-c++" ? "OBJCXX" : "OBJC", "", resourceDir).flatMap((path) => ["-internal-isystem", path]),
    "-I.",
    "-ferror-limit",
    "20",
    "-O2",
    "-o",
    obj,
    resolveClangLanguageArgs(language === "objective-c++" ? "CPP" : "C", {}).standardArg,
    "-x",
    language,
    ...usesObjectiveCRuntime(language) ? OBJECTIVE_C_RUNTIME_FLAGS : [],
    input,
    ...compileArgs
  ];
  try {
    clangRuntime.stdout = (chunk) => compileOutput.push(chunk);
    await clang.run(clangModule, true, "clang", ...args);
  } catch (error) {
    const objectBytes = Uint8Array.from(clang.memfs.getFileContents(obj));
    if (objectBytes.length > 0)
      return;
    for (const chunk of compileOutput)
      postMessage2({ output: chunk });
    throw error;
  } finally {
    clangRuntime.stdout = originalStdout;
  }
}
async function compileAndLinkObjectiveC(code, activePath, workspaceFiles, compileArgs = [], debug2 = false) {
  if (!clang)
    throw new Error("Objective-C runtime is not loaded.");
  const trace = (message) => console.log(`[wasm-idle:objectivec-worker] ${message}`);
  const inputPath = resolveInputPath(activePath);
  const prefix = `__wasm_idle_objc_${++buildCounter}`;
  const auxiliarySources = [];
  const seenWorkspaceFiles = /* @__PURE__ */ new Set();
  for (const file of workspaceFiles) {
    const safePath = normalizeWorkspacePath2(file.path);
    if (!safePath || safePath === inputPath || seenWorkspaceFiles.has(safePath))
      continue;
    seenWorkspaceFiles.add(safePath);
    const prefixedPath = `${prefix}/${safePath}`;
    await addFileWithDirectories(clang, prefixedPath, file.content);
    const language = sourceLanguageForPath(safePath);
    if (language)
      auxiliarySources.push({ path: safePath, prefixedPath, language });
  }
  const stem = stemOf(inputPath);
  const input = `${prefix}/${inputPath}`;
  const mainObj = `${prefix}/${stem}.o`;
  const ctorSource = `${prefix}/objc_ctor.c`;
  const ctorObj = `${prefix}/objc_ctor.o`;
  const wasmPath = `${prefix}/${stem}.wasm`;
  const auxiliaryObjects = [];
  const mainLanguage = sourceLanguageForPath(inputPath) || "objective-c";
  const needsFoundation = sourceImportsFoundation(code) || workspaceFiles.some((file) => sourceImportsFoundation(file.content));
  const needsObjectiveCLoad = !needsFoundation && usesObjectiveCRuntime(mainLanguage) && (/@\s*(?:interface|implementation|protocol)\b/u.test(code) || workspaceFiles.some((file) => {
    const language = sourceLanguageForPath(file.path);
    return language !== null && usesObjectiveCRuntime(language) && /@\s*(?:interface|implementation|protocol)\b/u.test(file.content);
  }));
  const foundationCompileArgs = needsFoundation ? ["-Wno-macro-redefined", "-Wno-nullability-completeness"] : [];
  let mainCode = code;
  if (needsFoundation) {
    await ensureObjectiveCFoundationAssets();
    if (!debug2)
      mainCode = inlineFoundationImportsForSource(inputPath, code);
  }
  if (needsObjectiveCLoad) {
    trace("compiling Objective-C load constructor");
    await compileObjectiveCObject(ctorSource, OBJC_CONSTRUCTOR_SOURCE, ctorObj, "c");
  }
  trace(`compiling ${inputPath}`);
  await compileObjectiveCObject(input, ensureTrailingNewline(mainCode), mainObj, mainLanguage, ["-I", prefix, ...foundationCompileArgs, ...compileArgs], debug2, debug2 && needsFoundation ? (source) => inlineFoundationImportsForSource(inputPath, source) : void 0);
  for (const source of auxiliarySources) {
    const objectName = source.path.replace(/[^A-Za-z0-9_.-]/g, "_").replace(/\.[^.]+$/, "");
    const objectPath = `${prefix}/${objectName}.o`;
    trace(`compiling ${source.path}`);
    await compileObjectiveCObject(source.prefixedPath, null, objectPath, source.language, [
      "-I",
      prefix,
      ...foundationCompileArgs,
      ...compileArgs
    ]);
    auxiliaryObjects.push(objectPath);
  }
  const stackSize = 1024 * 1024;
  const libdir = "lib/wasm32-wasi";
  const compilerRuntimeLibDir = clang.compilerConfig?.compilerRuntimeLibDir || "lib/clang/8.0.1/lib/wasi";
  const lld = await clang.getModule(clang.assetUrls.lld);
  if (needsFoundation) {
    await installObjectiveCFoundationLibraries();
  }
  await clang.run(lld, clang.log, "wasm-ld", ...needsFoundation ? ["--export=malloc", "--export=free"] : ["--export-dynamic"], "--gc-sections", ...needsFoundation || debug2 ? ["--allow-undefined"] : [], ...needsFoundation ? ["--export-table"] : [], "-z", `stack-size=${stackSize}`, `-L${libdir}/noeh`, `-L${libdir}`, `${libdir}/crt1.o`, ...needsObjectiveCLoad ? [ctorObj] : [], mainObj, ...auxiliaryObjects, ...needsFoundation ? FOUNDATION_LINK_ROOT_SYMBOLS.flatMap((symbol) => ["-u", symbol]) : [], ...needsFoundation ? ["libgnustep-base.a"] : [], "libobjc.a", ...needsFoundation ? ["libffi.a"] : [], "-lwasi-emulated-mman", "-lc", "-lc++", "-lc++abi", "-lm", `-L${compilerRuntimeLibDir}`, "-lclang_rt.builtins-wasm32", "-o", wasmPath);
  const bytes = Uint8Array.from(clang.memfs.getFileContents(wasmPath));
  const wasm = await WebAssembly.compile(bytes);
  return {
    bytes,
    wasm,
    target: "wasm32-wasi",
    format: "wasi-core-wasm",
    fileName: wasmPath,
    language: "C",
    debugMetadata: debug2 ? {
      variableMetadata: clang.debugVariableMetadata,
      globalVariableMetadata: clang.debugGlobalMetadata,
      functionMetadata: clang.debugFunctionMetadata
    } : void 0,
    needsLibffi: needsFoundation
  };
}
function artifactCacheKey(code, activePath, workspaceFiles, compileArgs, debug2) {
  return JSON.stringify({
    code,
    activePath: activePath || "",
    workspaceFiles,
    compileArgs,
    debug: debug2
  });
}
var handleObjectiveCWorkerMessage = async (event) => {
  if (handleWorkerAssetMessage(event.data))
    return;
  const { code, buffer, load, log, prepare, compileArgs, programArgs, activePath, workspaceFiles, stdin, debug: debug2, breakpoints, pauseOnEntry, debugBuffer, watchBuffer, watchResultBuffer, interrupt, clangAssets, objectivecAssets } = event.data;
  if (load) {
    try {
      await loadObjectiveCRuntime(clangAssets, objectivecAssets, log);
      postMessage2({ load: true });
    } catch (error) {
      postMessage2({ error: error.message });
    }
  } else if (typeof log === "boolean" && !code) {
    if (clang)
      clang.log = log;
    if (typeof code === "string")
      postMessage2({ results: true });
  } else if (code) {
    if (!clang) {
      postMessage2({ error: "Objective-C runtime is not loaded." });
      return;
    }
    clang.log = log;
    stdinBufferObjectiveC = new Int32Array(buffer);
    hasInitialStdinObjectiveC = typeof stdin === "string";
    initialStdinObjectiveC = hasInitialStdinObjectiveC ? stdin : null;
    initialStdinConsumedObjectiveC = false;
    try {
      const normalizedWorkspaceFiles = workspaceFiles || [];
      const normalizedCompileArgs = compileArgs || [];
      const debugEnabled = !!debug2;
      clang.beginTrace(debugEnabled);
      clang.debugBreakpoints = new Set(debugEnabled ? breakpoints || [] : []);
      clang.debugPauseOnEntry = debugEnabled && !!pauseOnEntry;
      clang.debugBuffer = debugBuffer ? new Int32Array(debugBuffer) : void 0;
      clang.debugWatchBuffer = watchBuffer ? new Int32Array(watchBuffer) : void 0;
      clang.debugWatchResultBuffer = watchResultBuffer ? new Int32Array(watchResultBuffer) : void 0;
      clang.debugInterruptBuffer = interrupt ? new Uint8Array(interrupt) : void 0;
      const cacheKey = artifactCacheKey(code, activePath, normalizedWorkspaceFiles, normalizedCompileArgs, debugEnabled);
      let artifact;
      if (prepare) {
        artifact = await compileAndLinkObjectiveC(code, activePath, normalizedWorkspaceFiles, normalizedCompileArgs, debugEnabled);
        preparedArtifactObjectiveC = artifact;
        preparedArtifactKeyObjectiveC = cacheKey;
        postMessage2({ results: true });
        return;
      }
      if (preparedArtifactObjectiveC && preparedArtifactKeyObjectiveC === cacheKey) {
        artifact = preparedArtifactObjectiveC;
      } else {
        artifact = await compileAndLinkObjectiveC(code, activePath, normalizedWorkspaceFiles, normalizedCompileArgs, debugEnabled);
        preparedArtifactObjectiveC = artifact;
        preparedArtifactKeyObjectiveC = cacheKey;
      }
      if (!prepare && debugEnabled) {
        clang.memfs.stdin = () => readProgramStdin() ?? "";
        const instanceRef = { current: null };
        await clang.runWithOptions(artifact.wasm, true, [artifact.fileName || "main.wasm", ...programArgs || []], {}, artifact.needsLibffi ? createObjectiveCLibffiImports(instanceRef) : void 0, instanceRef);
      } else if (!prepare) {
        const result = await executeBrowserClangArtifact(artifact, {
          args: programArgs || [],
          stdin: readProgramStdin,
          stdout: (output) => postMessage2({ output }),
          stderr: (output) => postMessage2({ output }),
          extraImports: artifact.needsLibffi ? ({ instance }) => createObjectiveCLibffiImports(instance) : void 0
        });
        if (result.exitCode) {
          throw new Error(`Objective-C program exited with ${result.exitCode}`);
        }
      }
      postMessage2({ results: true });
    } catch (error) {
      postMessage2({ error: error.message || error.stack });
    }
  }
};
function installObjectiveCWorker(scope, dependencies) {
  workerScope = scope;
  workerDependencies = dependencies;
  scope.document = {
    querySelectorAll() {
      return [];
    }
  };
  scope.onmessage = handleObjectiveCWorkerMessage;
}
export {
  BrowserClangDebugController,
  BrowserClangDebugDriver,
  runtime_default as BrowserClangRuntime,
  MemFS2 as MemFS,
  Memory,
  compile,
  compileClang,
  createBrowserClangDebugController,
  createBrowserClangDebugDriver,
  createBrowserWasiHost,
  createClangCompiler,
  executeBrowserClangArtifact,
  getInstance,
  installObjectiveCWorker,
  loadRuntimeManifest,
  normalizeDwarfWorkspacePath,
  parseRuntimeManifest,
  preloadBrowserClangRuntime,
  readBuffer,
  resolveDebugMode,
  resolveRuntimeAssetUrls,
  resolveRuntimeBaseUrl,
  resolveRuntimeBaseUrlFromManifestUrl,
  resolveRuntimeManifestUrl,
  untar
};
