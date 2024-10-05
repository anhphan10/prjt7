const buttonStatus = document.querySelectorAll("[button-status]");
// console.log(buttonStatus)
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);



  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      }
      else {
        url.searchParams.delete("status");
      }

      window.location.href = url.href;
    });
  });
}

// Form Search
const formSearch = document.querySelector("#form-search")
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    }
    else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}

//pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
  let url = new URL(window.location.href);

  buttonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);
      window.location.href = url.href;
    })
  })
}
// end
// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
  const inputCheckAll = document.querySelector("input[name='checkall']")
  const inputId = checkboxMulti.querySelectorAll("input[name='id']")
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputId.forEach(input => {
        input.checked = true;
      })
    } else {
      inputId.forEach(input => {
        input.checked = false;
      })
    }
  });

  inputId.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name = 'id']:checked").length;
      if (countChecked == inputId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;

      }
    });
  })

}
// End Checkboc Multi

//form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll("input[name = 'id']:checked");

    const typeChange = e.target.elements.type.value;
    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này");

      if (!isConfirm) {
        return
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name = 'ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;
        if (typeChange == "change-position") {
          const position = input.closest("tr").querySelector("input[name='position']").value;

          ids.push(`${id}-${position}`)
        } else {
          ids.push(id);
        }

      });

      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    }
    else {
      alert("Vui lòng chọn ít nhất 1 bản ghi!")
    }


  });
}

//end form change multi

//show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = document.querySelector("[close-alert]")

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, 3000);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  })
}
// end show alert

//upload images
const uploadImage = document.querySelector("[upload-image]")
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]")
  uploadImage.addEventListener("change", (e) => {
    console.log(e)
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file)
    }
  });
}

//end upload images

//sort
const sort = document.querySelector("[sort]")
if(sort){
 let url = new URL(window.location.href);
 const sortSelect = sort.querySelector("[sort-select]")
 const sortClear = sort.querySelector("[sort-clear]");
  sortSelect.addEventListener("change" , (e) => {
    const value = e.target.value
    // console.log(e.target.value);
    // console.log(value.split("-"));
    const[sortKey, sortValue] = value.split("-");

    url.searchParams.set("sortKey" , sortKey);
    url.searchParams.set("sortValue" , sortValue);

    window.location.href = url.href;

  });

sortClear.addEventListener("click" , () => {
  url.searchParams.delete("sortKey");
  url.searchParams.delete("sortValue");
  window.location.href = url.href;
})

  //thêm selected cho option
   const sortKey = url.searchParams.get("sortKey")
   const sortValue = url.searchParams.get("sortValue")

  //  console.log(sortKey);
  //  console.log(sortValue);
  if(sortKey && sortValue){
    const stringSort = `${sortKey}-${sortValue}`;
    //console.log(stringSort)
    const optionSelect = sortSelect.querySelector(`option[value=${stringSort}]`);
    //console.log(optionSelect)
    optionSelect.selected = true;
  }
}
//end sort

