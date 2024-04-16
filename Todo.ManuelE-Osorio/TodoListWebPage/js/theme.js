window.onload = function() {
    if(getCookie("isDark").includes("true")){
        themeSwitch()
    }
}

document.getElementById('btnSwitch').addEventListener('click',()=>{
    themeSwitch()
})

function themeSwitch() {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light') 
        setCookie("isDark", "false", 2)
        document.querySelector("use[id=toggle-icon]").setAttribute('href','#sun-fill')
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark')
        setCookie("isDark", "true", 2)
        document.querySelector("use[id=toggle-icon]").setAttribute('href','#moon-stars-fill')
    }
}

function setCookie(cookieName, cookieValue, expirationDays) {
    const cookieDate = new Date();
    cookieDate.setTime(cookieDate.getTime() + (expirationDays*24*60*60*1000));
    let expires = "expires="+ cookieDate.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/;SameSite=Strict";
}

function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');
    for(let i = 0; i <cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, c.length);
      }
    }
    return "";
}