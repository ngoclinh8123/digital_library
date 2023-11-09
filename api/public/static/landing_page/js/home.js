// filter

const filterTypeButton = document.querySelector(".filter_type__title");
const filterTypeListBlock = document.querySelector(".filter_type__list");
const filterTypeList = Array.from(
  filterTypeListBlock.querySelectorAll(".filter_type__item")
);

if (filterTypeButton) {
  filterTypeButton.addEventListener("click", function () {
    filterTypeListBlock.classList.toggle("show");
  });

  document.addEventListener("click", function (event) {
    if (
      !event.target.classList.contains("filter_type__title") &&
      !event.target.parentElement.classList.contains("filter_type__title")
    ) {
      if (filterTypeListBlock.classList.contains("show")) {
        filterTypeListBlock.classList.remove("show");
      }
    }
  });
}

if (filterTypeList.length > 0) {
  filterTypeList.forEach((item, index) => {
    item.addEventListener("click", function () {
      let value = item.querySelector("span").textContent;
      //   display selected value
      if (filterTypeButton) {
        filterTypeButton.querySelector("span").innerText = value;
        filterTypeButton.classList.add("selected");
      }
      if (filterTypeListBlock.classList.contains("show")) {
        filterTypeListBlock.classList.remove("show");
      }
    });
  });
}

// menu
const menuBtn = document.querySelector(".header_menu_btn");
const menu = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".menu_close_btn");

if (menuBtn) {
  menuBtn.addEventListener("click", function () {
    menu.style.right = 0;

    if (overlay) {
      if (!overlay.classList.contains("display")) {
        overlay.classList.add("display");
      }
    }
  });
}

if (overlay) {
  overlay.addEventListener("click", function () {
    menu.style.right = "-280px";
    if (overlay.classList.contains("display")) {
      overlay.classList.remove("display");
    }
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", function () {
    menu.style.right = "-280px";
    if (overlay.classList.contains("display")) {
      overlay.classList.remove("display");
    }
  });
}

// sub item in menu
const openSublistBtns = Array.from(
  document.querySelectorAll(".menu_block__item--action")
);
const subListItemBlock = Array.from(
  document.querySelectorAll(".menu_subitem_list")
);

if (openSublistBtns.length > 0) {
  openSublistBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      const menuItem = btn.parentElement.parentElement;
      const listSubitem = menuItem.querySelector(".menu_subitem_list");

      if (btn.classList.contains("show_item")) {
        btn.classList.remove("show_item");
        if (listSubitem.classList.contains("show")) {
          listSubitem.classList.remove("show");
        }
      } else {
        openSublistBtns.forEach((btn) => {
          if (btn.classList.contains("show_item")) {
            btn.classList.remove("show_item");
          }
        });
        subListItemBlock.forEach((block) => {
          if (block.classList.contains("show")) {
            block.classList.remove("show");
          }
        });

        btn.classList.add("show_item");
        if (!listSubitem.classList.contains("show")) {
          listSubitem.classList.add("show");
        }
      }
    });
  });
}

// pagination
const paginationItems = Array.from(
  document.querySelectorAll(".pagination_item")
);

paginationItems.forEach((item) => {
  let page = item.innerText.trim();
  let link = item.href.trim();

  if (page != "1") {
    link = link + "?page=" + page;
    item.href = link;
  }
});
