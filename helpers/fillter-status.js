module.exports = (query)=>{
    let filterStatus = [
        {
          name: "Tất Cả",
          status: "",
          class: ""
        },
        {
          name: "Hoạt Động",
          status: "active",
          class: ""
        },
        {
           name: "Dừng Hoạt Động",
           status: "inactive",
           class: ""
        }
  ];
  
     if(query.status){
       const index = filterStatus.findIndex(item => item.status == query.status);
       filterStatus[index].class = "active";
     }else{
        const index = filterStatus .findIndex(item => item.status == "");
        filterStatus[index].class= "active";
  
     }
     
     return filterStatus;
}