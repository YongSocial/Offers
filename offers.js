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
    { image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtQOa5KttHGRy_L160G65FAJCcRlTyA7DeW8pqaj8OEqn2ieMiA7Z6cn_84ENmD0KZIdg9wQw-pFHhgXqqb0YK78kdmnwpHhq0k-olG6JflDZXwQmB-8CEUPMEiw3fiCJ8nNWDeNvd3FtzT-MF3DZG7PLMdzyrBgePhIdKnFttHciy24RjAJO3Ex2q4sup/s588/55182.jpg", link: "https://www.yongsocial.com/2026/10/nvidia-micron-sp500-earnings-growth-q3-2026.html", button: "Get offer",  title: "Offer one" },
    { image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtQOa5KttHGRy_L160G65FAJCcRlTyA7DeW8pqaj8OEqn2ieMiA7Z6cn_84ENmD0KZIdg9wQw-pFHhgXqqb0YK78kdmnwpHhq0k-olG6JflDZXwQmB-8CEUPMEiw3fiCJ8nNWDeNvd3FtzT-MF3DZG7PLMdzyrBgePhIdKnFttHciy24RjAJO3Ex2q4sup/s588/55182.jpg", link: "https://www.yongsocial.com/2026/10/bitcoin-vs-ethereum-understanding-btc-and-eth.html", button: "Shop now",   title: "Offer two" },
    { image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtQOa5KttHGRy_L160G65FAJCcRlTyA7DeW8pqaj8OEqn2ieMiA7Z6cn_84ENmD0KZIdg9wQw-pFHhgXqqb0YK78kdmnwpHhq0k-olG6JflDZXwQmB-8CEUPMEiw3fiCJ8nNWDeNvd3FtzT-MF3DZG7PLMdzyrBgePhIdKnFttHciy24RjAJO3Ex2q4sup/s588/55182.jpg", link: "https://www.yongsocial.com/2026/10/bitcoin-vs-ethereum-understanding-btc-and-eth.html", button: "Learn more", title: "Offer three" }
  ]
};
