(function() {
  try {
    var theme = localStorage.getItem("cv-theme");
    if (theme === "retro" || theme === "neobrutalism" || theme === "default") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.setAttribute("data-theme", "default");
    }
  } catch(e) {
    document.documentElement.setAttribute("data-theme", "default");
  }
})();
