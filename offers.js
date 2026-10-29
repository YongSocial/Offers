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
    { image: "https://example.com/ad1.jpg", link: "https://example.com/offer1", button: "Get offer",  title: "Offer one" },
    { image: "https://example.com/ad2.jpg", link: "https://example.com/offer2", button: "Shop now",   title: "Offer two" },
    { image: "https://example.com/ad3.jpg", link: "https://example.com/offer3", button: "Learn more", title: "Offer three" }
  ]
};
