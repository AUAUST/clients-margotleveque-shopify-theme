document.addEventListener("DOMContentLoaded", function () {
  //lets
  let w = window.innerWidth,
    h = window.innerHeight;

  //Consts
  const b = $("body");

  //Window Height let
  document.documentElement.style.setProperty("--h", h + "px");

  //Functions
  function dateToText(d) {
    let h = d.getHours(),
      m = d.getMinutes();
    if (m < 10) m = "0" + m;
    if (h < 10) h = "0" + h;
    return h + ":" + m;
  }
  function updateClocks() {
    for (let i = 0; i < window.arrClocks.length; i++) {
      let clock = window.arrClocks[i],
        offset = window.arrOffsets[i];
      clock.innerHTML = dateToText(new Date(new Date().getTime() + offset));
    }
  }
  function startClocks() {
    clockElements = document.getElementsByClassName("clock");
    window.arrClocks = [];
    window.arrOffsets = [];
    let j = 0;
    for (let i = 0; i < clockElements.length; i++) {
      el = clockElements[i];
      timezone = parseInt(el.getAttribute("timezone"));
      if (!isNaN(timezone)) {
        let tzDifference = timezone * 60 + new Date().getTimezoneOffset(),
          offset = tzDifference * 60 * 1000;
        window.arrClocks.push(el);
        window.arrOffsets.push(offset);
      }
    }
    updateClocks();
    clockID = setInterval(updateClocks, 1000);
  }
  /*!!!*/
  setTimeout(startClocks, 100);

  //Function Sliders
  function nextSlide() {
    let t = $(".slider-tracker.focus");
    if (!t.hasClass("transition") && !$("#type-row span").is(":focus")) {
      t.addClass("transition").animate({ left: "-100%" }, 0, function () {
        t.append(t.find(".slide:first-child"));
        t.css("left", "0");
        t.removeClass("transition");
      });
      t.parents(".slider")
        .next()
        .find(".counter span")
        .text(t.find(".slide:first-child").data("slide"));
    }
  }
  function prevSlide() {
    let t = $(".slider-tracker.focus");
    if (!t.hasClass("transition") && !$("#type-row span").is(":focus")) {
      t.prepend($(".slider-tracker.focus .slide:last-child"));
      t.addClass("transition").css("left", "-100%");
      t.animate({ left: "0" }, 0, function () {
        t.removeClass("transition");
      });
      t.parents(".slider")
        .next()
        .find(".counter span")
        .text(t.find(".slide:first-child").data("slide"));
    }
  }
  function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == "37") {
      if (
        $("body").hasClass("template-collection") &&
        $(window).width() < 813
      ) {
        prevSlide();
      } else if (!$("body").hasClass("template-collection")) {
        prevSlide();
      }
    } else if (e.keyCode == "39") {
      if (
        $("body").hasClass("template-collection") &&
        $(window).width() < 813
      ) {
        nextSlide();
      } else if (!$("body").hasClass("template-collection")) {
        nextSlide();
      }
    }
  }

  //Device detection
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    $("html").addClass("device");
    //Pseudoclass :active on devices
    document.addEventListener("touchstart", function () {}, { passive: true });
  } else {
    $("html").addClass("desktop");
    //Slider
    document.onkeydown = checkKey;
  }

  //Loader
  setTimeout(function () {
    $("#loader").fadeOut();
  }, 200);

  //Replace &nbsp;
  if ($("#content").length) {
    $("#content").html(function (i, html) {
      return html.replace(/&nbsp;/g, " ");
    });
  }

  //Scroll
  let scroll = $("#scroll-down");
  if (scroll.length) {
    $(window).scroll(function (e) {
      if (window.innerWidth > 812) {
        if ($(window).scrollTop() > 0) {
          scroll.fadeOut("medium", "easeOutQuint");
        } else {
          scroll.fadeIn("medium", "easeOutQuint");
        }
      }
    });
    scroll.click(function () {
      $("html, body").animate(
        {
          scrollTop: scroll.next().offset().top - 20,
        },
        "medium",
        "easeOutQuint"
      );
    });
  }

  //Slider
  $(".slider .next").click(function () {
    if (b.hasClass("template-page-work")) {
      $(".slider-tracker").removeClass("focus");
      $(this).parent().find(".slider-tracker").addClass("focus");
    }
    nextSlide();
  });
  $(".slider .prev").click(function () {
    if (b.hasClass("template-page-work")) {
      $(".slider-tracker").removeClass("focus");
      $(this).parent().find(".slider-tracker").addClass("focus");
    }
    prevSlide();
  });

  //Projects navigation
  $(".project").each(function () {
    $("header ul").append(
      '<li class="link-bar" data-id="' +
        $(this).data("id") +
        '">' +
        $(this).data("title") +
        "</li>"
    );
  });
  $("header ul li").click(function () {
    let rem = $("#projects").css("padding-top"),
      px = parseInt(rem, 10);
    $("html, body").animate(
      {
        scrollTop:
          $('.project[data-id="' + $(this).data("id") + '"]').offset().top - px,
      },
      "medium",
      "easeInOutQuint"
    );
  });

  //Project activation
  let P = [].slice.call(document.querySelectorAll(".project"));
  if ("IntersectionObserver" in window) {
    let o = new IntersectionObserver(
      function (E, observer) {
        E.forEach(function (e) {
          if (e.isIntersecting) {
            let p = e.target;
            $("header ul li").removeClass("active");
            $('header ul li[data-id="' + p.dataset.id + '"]').addClass(
              "active"
            );
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    P.forEach(function (p) {
      o.observe(p);
    });
  }

  //Set editable rows font-size to full width
  let pure = document.getElementsByClassName("pure");
  if (pure.length > 0) {
    const text = document.getElementById("editable");
    text.parentNode.style.setProperty("--font-multiplier", "1.25");
  }

  //Size Type Selector
  $(".type-handler").each(function () {
    $(this).on("input", function () {
      $("#type-row").css("--font-multiplier", $(this).val());
      $("#editable").removeClass("pure");
    });
  });

  //Avoid Enter on type rows
  $("#type-row").on("keyup keypress", function (e) {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      return false;
    }
  });

  //Breaks auto adjust the type size
  $("#editable").on("keyup keypress", function () {
    $(this).removeClass("pure");
  });

  //Adjust select width
  if ($("#styles").length) {
    $("#styles").width($("#hidden-select-option").outerWidth());
  }

  //Change Styles function
  $("#styles").change(function () {
    let t = $(this),
      v = t.find("option:selected").attr("value"),
      T = t.find("option:selected").data("title"),
      o = t.children("option:selected").text();
    $("#type-row").removeClass().css("font-family", v);
    $("#editable").text(T);
    //Adjust select width
    $("#hidden-select-option").text(t.find("option:selected").text());
    t.width($("#hidden-select-option").outerWidth());

    const text = document.getElementById("editable");
    function calcTextSize() {
      const parentContainerWidth = text.parentNode.clientWidth;
      const currentTextWidth = text.scrollWidth;
      const currentFontSize = parseInt(window.getComputedStyle(text).fontSize);
      const newValue = Math.min(
        Math.max(
          16,
          (parentContainerWidth / currentTextWidth) * currentFontSize
        ),
        500
      );
      text.parentNode.style.setProperty("--fontSize", newValue + "px");
    }
    calcTextSize();
  });

  //Colors
  $(".color").click(function () {
    $(".color").removeClass("active");
    $(this).addClass("active");
    b.removeClass("white black gray");
    b.addClass($(this).attr("id"));
    window.localStorage.setItem("color", $(this).attr("id"));
  });
  let color = window.localStorage.getItem("color");
  if (color) {
    $(".color").removeClass("active");
    $("#" + color).addClass("active");
    b.removeClass("white black gray");
    b.addClass(color);
  }

  //Buy products
  $("#buy").click(function () {
    let t = $(this),
      T = t.data("title"),
      n = t.parent().next();
    t.text(function (i, v) {
      return v === "Close" ? T : "Close";
    });
    t.toggleClass("active");
    n.slideToggle("fast");
  });
  $(".style.product-selector").click(function (e) {
    let t = $(this),
      v = t.data("value"),
      T = $('.product-selector[data-value="' + v + '"]');
    $(".style.product-selector").removeClass("active");
    T.addClass("active");
    // T.siblings().removeClass('active');
    $("form#product-" + t.data("id") + " .options-wrapper ").removeClass(
      "disabled"
    );
    if (t.hasClass("style")) {
      if (!$("#product-options form").is(":visible")) {
        $("form#product-" + t.data("id")).slideDown("fast");
      } else {
        $("form:not(#product-" + t.data("id") + ")").hide();
        $("form#product-" + t.data("id")).show();
      }
    } else {
      T.prev().click();
      T.parents(".options-wrapper").next().slideDown("fast");
      T.parents(".options-wrapper").next().removeClass("disabled");
    }
  });

  $(".option.product-selector").click(function (e) {
    let t = $(this),
      v = t.data("value"),
      T = $('.product-selector[data-value="' + v + '"]');
    $(".option.product-selector").removeClass("active");
    T.addClass("active");
    // T.siblings().removeClass('active');
    $("form#product-" + t.data("id") + " .options-wrapper ").removeClass(
      "disabled"
    );
    if (t.hasClass("style")) {
      if (!$("#product-options form").is(":visible")) {
        $("form#product-" + t.data("id")).slideDown("fast");
      } else {
        $("form:not(#product-" + t.data("id") + ")").hide();
        $("form#product-" + t.data("id")).show();
      }
    } else {
      T.prev().click();
      T.parents(".options-wrapper").next().slideDown("fast");
      T.parents(".options-wrapper").next().removeClass("disabled");
    }
  });

  // hide logo on scroll
  $(document).scroll(function () {
    if ($(window).scrollTop() !== 0) {
      $("#logo").addClass("hide");
    } else {
      $("#logo").removeClass("hide");
    }
  });

  $("#burger").click(function (e) {
    e.preventDefault();
    $("#burger, #mobileMenu").toggleClass("active");
  });

  //Terms Cart
  $("#terms").click(function () {
    $("#terms, #checkout").toggleClass("active");
    $("#checkout").toggleClass("inactive");
  });

  //Lazy Loading
  let L = [].slice.call(document.querySelectorAll("img.lazy"));
  if ("IntersectionObserver" in window) {
    let o = new IntersectionObserver(function (E, observer) {
      E.forEach(function (e) {
        if (e.isIntersecting) {
          let l = e.target;
          l.src = l.dataset.src;
          l.classList.remove("lazy");
          o.unobserve(l);
        }
      });
    });
    L.forEach(function (l) {
      o.observe(l);
    });
  }
});
//Resize Functions
window.onresize = function () {
  //Window Height let
  document.documentElement.style.setProperty("--h", window.innerHeight + "px");

  //Set type row font-size full width
  let pure = document.getElementsByClassName("pure");
  if (pure.length > 0) {
    const text = document.getElementById("editable");
    function calcTextSize() {
      const parentContainerWidth = text.parentNode.clientWidth;
      const currentTextWidth = text.scrollWidth;
      const currentFontSize = parseInt(window.getComputedStyle(text).fontSize);
      const newValue = Math.min(
        Math.max(
          16,
          (parentContainerWidth / currentTextWidth) * currentFontSize
        ),
        500
      );
      text.parentNode.style.setProperty("--fontSize", newValue + "px");
    }
    calcTextSize();
    function resizeBox() {
      calcTextSize();
    }
    resizeBox();
  }

  //Set editable rows text and input range correct value
  if ($("#type-row").length) {
    let s = $("#type-row").css("font-size"),
      S = s.replace("px", "");
    $(".type-handler").val(S);
  }
  if ($(".pure").length) {
    let s = $("#type-row").css("font-size"),
      S = s.replace("px", "");
    $(".type-handler").attr("max", S * 2);
  }

  //Adjust select width
  $("#styles").width($("#hidden-select-option").outerWidth());
};
