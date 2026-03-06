const select = document.getElementById("datasetSelect");

Object.entries(DATASETS).forEach(([key, val]) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = val.name;
  select.appendChild(option);
});

select.addEventListener("change", () => {
  loadDataset(select.value);
});

function loadDataset(key){

  const config = DATASETS[key];

  Papa.parse(config.file,{
    download:true,
    header:true,
    complete:function(results){

      buildTable(results.data);

    }
  });

}

function buildTable(data){

  const columns = Object.keys(data[0]);

  if ($.fn.DataTable.isDataTable("#table")) {
    $("#table").DataTable().destroy();
  }

  const head = document.getElementById("table-head");
  const filter = document.getElementById("table-filter");

  head.innerHTML="";
  filter.innerHTML="";

  columns.forEach(col=>{
    head.innerHTML += `<th>${col}</th>`;
    filter.innerHTML += `<th><input placeholder="Search ${col}"></th>`;
  });

  const table = $("#table").DataTable({
    data:data,
    columns:columns.map(c=>({data:c})),
    pageLength:25
  });

  $("#table tfoot input").on("keyup change",function(){
    const col=$(this).parent().index();
    table.column(col).search(this.value).draw();
  });

}

loadDataset(Object.keys(DATASETS)[0]);
