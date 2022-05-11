async function setNav() {
    const res = await fetch('/template/nav');
    const resHtml = await res.text();

    document.getElementById('nav-holder').innerHTML = resHtml;
}

setNav();