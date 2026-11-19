document.querySelectorAll("a[data-rev]").forEach((a) => {
  const addr = [...a.dataset.rev].reverse().join("");
  a.href = "mailto:" + addr;
  const t = a.querySelector(".email-link__text");
  if (t) t.replaceWith(addr);
});
