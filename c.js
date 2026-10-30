// 도전장 페이지 — 프레임워크 없음 (docs/rival_link.md §6.3). 문구는 §8.2.
(function () {
  var PKG = "com.zeeing.braingame";
  var HOST = "zeeingkajama.github.io";
  var PLAY = "https://play.google.com/store/apps/details?id=" + PKG;
  var T = {
    ko: { title: "친구의 도전장", line: "친구가 브레인 콤보 도전장을 보냈어요", open: "앱에서 도전하기", install: "앱 설치하기", label: "도전 코드", copy: "코드 복사", copied: "복사했어요", hint: "앱이 열리지 않으면 앱의 랭킹 → 친구 도전장에 코드를 붙여 넣어요", notAndroid: "Android 앱이에요. Android 휴대폰에서 열어 주세요", none: "도전 코드가 없는 주소예요", word: "브레인 콤보", stop: ". " },
    en: { title: "A friend's challenge", line: "A friend sent you a Brain Combo challenge", open: "Take it on in the app", install: "Get the app", label: "Challenge code", copy: "Copy code", copied: "Copied", hint: "If the app doesn't open, paste the code under Ranks → Friend challenge", notAndroid: "Brain Combo is an Android app. Open this on an Android phone", none: "This link has no challenge code", word: "Brain Combo", stop: ". " },
    ja: { title: "友だちの挑戦状", line: "友だちから Brain Combo の挑戦状が届きました", open: "アプリで挑戦する", install: "アプリを入手", label: "挑戦コード", copy: "コードをコピー", copied: "コピーしました", hint: "アプリが開かないときは「ランキング」→「友だちの挑戦状」にコードを貼り付けてください", notAndroid: "Android 向けのアプリです。Android のスマートフォンで開いてください", none: "挑戦コードのないリンクです", word: "Brain Combo", stop: "。" }
  };
  var m = location.pathname.match(/\/(ko|en|ja)\/c\//);
  var page = m ? m[1] : "ko";
  var nav = (navigator.language || "").slice(0, 2).toLowerCase();
  var lang = T[nav] ? nav : page;
  var t = T[lang];
  var cm = location.search.match(/BM-?([0-9A-Z]{4})-?([0-9A-Z]{4})/i);
  var code = cm ? ("BM-" + cm[1] + "-" + cm[2]).toUpperCase() : "";
  var android = /Android/i.test(navigator.userAgent);

  function $(id) { return document.getElementById(id); }
  function show(id, on) { $(id).hidden = !on; }
  function select() {
    var r = document.createRange();
    r.selectNodeContents($("code"));
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  document.documentElement.lang = lang;
  $("word").textContent = t.word;
  $("title").textContent = t.title;
  $("hint").textContent = t.hint;
  $("label").textContent = t.label;
  $("copy").textContent = t.copy;
  $("install").textContent = t.install;
  $("open").textContent = t.open;

  var line = code ? t.line : t.none;
  if (!android) { line += t.stop + t.notAndroid; }
  $("line").textContent = line;

  show("code-box", !!code);
  show("hint", !!code);
  show("open", android && !!code);
  if (code) {
    $("code").textContent = code;
    // 앱이 없어 넘어가는 Play 도 [앱 설치하기]와 같은 주소 — 설치 뒤 첫 실행에 도전장이 기다린다(리퍼러, L8).
    var install = PLAY + "&referrer=" + encodeURIComponent(code);
    $("open").href = "intent://" + HOST + "/" + page + "/c/?" + code +
      "#Intent;scheme=https;package=" + PKG + ";S.browser_fallback_url=" + encodeURIComponent(install) + ";end";
    $("install").href = install;
    $("copy").addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () { $("copy").textContent = t.copied; }, select);
      } else { select(); }
    });
  } else {
    $("install").href = PLAY;
  }
  $("install").classList.toggle("main", !(android && code));
}());
