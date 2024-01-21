$(document).ready(() => {
    console.log("Document ready");
   // Attach a click event handler to the checkboxes
    $(".task-checkbox").click(function () {
        // const id = this.id; // Get the index from data attribute            //Front end changed
        // const form = $(`#task-${id}`); // Select the corresponding form
        // form.submit(); // Submit the form when the checkbox is checked
        // console.log("clicked");
        // console.log(id);

        // this.form.submit();    //Much simpler way

        $(this).closest('li').toggleClass('strike');
    });
});


