$(document).ready(() => {
  $("[data-rating] .star").on("click", function(){
    const selectedCssClass = "selected";
    const $this = $(this);
    $this.siblings("." + selectedCssClass).removeClass(selectedCssClass);
    $this
    .addClass(selectedCssClass)
    .parent().addClass("is-voted");
});
});
