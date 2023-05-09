//import $ from "jquery";
//document.oncontextmenu = rightClick;

/*function rightClick(clickEvent) {
  clickEvent.preventDefault();

  for (const path of Object.values(clickEvent.path)) {
    var id = "";
    var htmlx = clickEvent.x;
    var htmly = clickEvent.y;

    if (path.localName == "tr") {
      id = path.id;
      $(".dropdown-menu").removeClass("show");
      for (const classL of Object.values(path?.classList)) {
        if (classL == "sag-menu") {
          $(".dropdown-menu").removeClass("show");
          $("#k" + id).addClass("show");
          $("#k" + id).css({ position: "fixed", left: htmlx - 20, top: htmly - 120 });
          $("#k" + id).css({ transform: "translate3d(30px, 100px, 0px)" });
          $("html").click(function () {
            $(".dropdown-menu").removeClass("show");
          });
          break;
        }
      }
      break;
    } else if (path.localName == "input") {
      $(".right-click-input").removeClass("right-click-input");
      path.classList.add("right-click-input");
      $(".hesapMakineItem").removeClass("d-none");

      $(".yeniSekmeItem").addClass("d-none");
      $(".dropdown-menu").removeClass("show");
      $(".sayfa-dropdown").addClass("show");
      $(".sayfa-dropdown").css({ left: htmlx - 25 }); //'left',clickEvent.layerX+20+' !important');
      $(".sayfa-dropdown").css({ top: htmly - 20 });
      $(".sayfa-dropdown").css({ position: "fixed" });
      $(".sayfa-dropdown").css({ "z-index": "9999999" });
      $(".sayfa-dropdown").css({ transform: "translate3d(30px, 0px, 0px)" });
      $("html").click(function () {
        $(".dropdown-menu").removeClass("show");
      });
      break;
    } else if (path.localName == "a" && path.href != "#" && path.href != "javascript:void(0);" && path.href != undefined) {
      $(".yeniSekmeItem").removeClass("d-none");
      $(".yeniSekmeItem").attr("href", path.href);
      $(".yeniSekmeItem").attr("target", "_blank");

      $(".hesapMakineItem").addClass("d-none");
      $(".dropdown-menu").removeClass("show");
      $(".sayfa-dropdown").addClass("show");
      $(".sayfa-dropdown").css({ left: htmlx - 25 }); //'left',clickEvent.layerX+20+' !important');
      $(".sayfa-dropdown").css({ top: htmly - 20 });
      $(".sayfa-dropdown").css({ position: "fixed" });
      $(".sayfa-dropdown").css({ "z-index": "9999999" });
      $(".sayfa-dropdown").css({ transform: "translate3d(30px, 0px, 0px)" });
      $("html").click(function () {
        $(".dropdown-menu").removeClass("show");
      });
      break;
    } else if (path.localName == "html") {
      $(".yeniSekmeItem").addClass("d-none");
      $(".hesapMakineItem").addClass("d-none");
      $(".dropdown-menu").removeClass("show");
      $(".sayfa-dropdown").addClass("show");
      $(".sayfa-dropdown").css({ left: htmlx - 25 }); //'left',clickEvent.layerX+20+' !important');
      $(".sayfa-dropdown").css({ top: htmly - 20 });
      $(".sayfa-dropdown").css({ position: "fixed" });
      $(".sayfa-dropdown").css({ "z-index": "9999999" });
      $(".sayfa-dropdown").css({ transform: "translate3d(30px, 0px, 0px)" });
      $("html").click(function () {
        $(".dropdown-menu").removeClass("show");
      });
      break;
    }
  }
  // return false;
  $("html").append("<!--Erdoğan Yeşil-->");
}
*/
