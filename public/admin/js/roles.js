//Permissions
const tablePermissions = document.querySelector("[table-permissions]")
if(tablePermissions){
    const buttonSubmit = document.querySelector("[button-submit]")
    buttonSubmit.addEventListener("click", () => {
        let permissions = [];
        const rows = tablePermissions.querySelectorAll("[data-name]")
        rows.forEach(row =>{
         const name = row.getAttribute("data-name");
         const inputs = row.querySelectorAll("input")
         if(name == "id"){
          inputs.forEach(input => {
            const id = input.value;
            permissions.push({
                id: id,
                permissions: []
            })
          })
         }
         else{
            inputs.forEach((input , index) => {
                const checked = input.checked;
                // console.log(name);
                // console.log(index);
                // console.log(checked)
                if(checked){
                    permissions[index].permissions.push(name); 
                }
            })
         }
        //  console.log(name);
       });
       console.log(permissions)
       if(permissions.length > 0){
        const formChangePermissions = document.querySelector("#form-change-permissions")
        const inputPermissions = formChangePermissions.querySelector("input[name=permissions]")
        inputPermissions.value = JSON.stringify(permissions);
        formChangePermissions.submit();
       }
    });
}
//End permissions

//Permissions data-default
const dataRecords = document.querySelector("[data-records]")
if(dataRecords){
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");
    records.forEach((records,index) =>{
        const permissions = records.permissions;
        permissions.forEach(permissions => {
         const row = tablePermissions.querySelector(`[data-name="${permissions}"]`)
         const input = row.querySelectorAll("input")[index];
         input.checked = true;
        })
    })

}
// end

//delete role
const buttonDeleteRole = document.querySelectorAll("[button-delete-role]")
if(buttonDeleteRole.length > 0 ){
    const formDeleteRole = document.querySelector("#form-delete-role")
    const path = formDeleteRole.getAttribute("data-path")

    buttonDeleteRole.forEach(button => {
        button.addEventListener("click" , () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa quyền này")
            if(isConfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteRole.action = action;
                formDeleteRole.submit();
               
            }
        });
    });
}
//end