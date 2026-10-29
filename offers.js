/* ===== 1. Redirect offers (used by offers.yongsocial.com) ===== */
var offers = [
    "https://omg10.com/4/10922269",
    "https://omg10.com/4/10470895",
    "https://omg10.com/4/10470895",
    "https://omg10.com/4/10922272",
    "https://omg10.com/4/10242701",
    "https://omg10.com/4/10242827",
    "https://omg10.com/4/10242701"
];

/* ===== 2. Rotating ads shown inside app.yongsocial.com =====
   Edit this block any time. The app picks up changes within about 5 minutes, no app redeploy needed.

   - enabled : set to false to hide all ads
   - seconds : how long each ad stays on screen
   - image   : full https link to the ad image (1200x628 works best, same size for all)
   - link    : full https link opened when someone taps the image or the button
   - button  : text on the button
   - title   : optional, used as the image description
*/
window.YS_PROMOS = {
  enabled: true,
  label: "Advertisement",
  seconds: 6,
  items: [
    { image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjOrxxeocWLbZE2DmRkGJa79llGExxQbXk642930vch-4a6u2F4Nf0bvbMzD19Pu9YhnCkXY-tLEQ3j6Gk49l2cG8v9jTE2xtGYJDSOfIB3sllKaCEc3lKlwS-OKpqOqA-vJSQH5MTCaQz8p53cRSfGNHKuS8YVOm9jWt_IYhTbajPhyWZK3k8DSQmYRb3E/s2172/51122.png", link: "https://www.x.com/YSFNews", button: "YSFNews On X",  title: "Yong Social Finance" },
    { image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjOrxxeocWLbZE2DmRkGJa79llGExxQbXk642930vch-4a6u2F4Nf0bvbMzD19Pu9YhnCkXY-tLEQ3j6Gk49l2cG8v9jTE2xtGYJDSOfIB3sllKaCEc3lKlwS-OKpqOqA-vJSQH5MTCaQz8p53cRSfGNHKuS8YVOm9jWt_IYhTbajPhyWZK3k8DSQmYRb3E/s2172/51122.png", link: "https://www.x.com/YSFNews", button: "YSFNews On X",   title: "Yong Social Finance" },
    { image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjOrxxeocWLbZE2DmRkGJa79llGExxQbXk642930vch-4a6u2F4Nf0bvbMzD19Pu9YhnCkXY-tLEQ3j6Gk49l2cG8v9jTE2xtGYJDSOfIB3sllKaCEc3lKlwS-OKpqOqA-vJSQH5MTCaQz8p53cRSfGNHKuS8YVOm9jWt_IYhTbajPhyWZK3k8DSQmYRb3E/s2172/51122.png", link: "https://www.x.com/YSFNews", button: "YSFNews On X", title: "Yong Social Finance" }
  ]
};
