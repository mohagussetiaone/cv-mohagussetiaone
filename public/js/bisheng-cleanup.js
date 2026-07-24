(function(){
  try {
    function cleanAttrs() {
      var els = document.querySelectorAll("[bis_skin_checked]");
      for (var i = 0; i < els.length; i++) {
        els[i].removeAttribute("bis_skin_checked");
      }
    }
    cleanAttrs();
    var observer = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "attributes" && m.attributeName === "bis_skin_checked") {
          m.target.removeAttribute("bis_skin_checked");
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["bis_skin_checked"],
      subtree: true,
    });
    setTimeout(function() { observer.disconnect(); }, 3000);
  } catch(e){}
})();
