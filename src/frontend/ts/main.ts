declare const M;
class Main implements EventListenerObject, ResponseLister {
    public listaPersonas: Array<Persona> = new Array();
    public etidadesAcciones: Array<Acciones> = new Array();
    public nombre: string;
    public framework: FrameWork = new FrameWork();
    private listaTipos: Map<string, string> = new Map()
    constructor() {
        
        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices", this)
 
        this.listaPersonas.push(new Usuario("Juan", 12, "jPerez"));
        this.listaPersonas.push(new Administrador("Pedro", 35));
        this.listaPersonas.push(new Persona("S", 12));
        this.etidadesAcciones.push(new Usuario("Juan", 12, "jPerez"));
        this.etidadesAcciones.push(new Administrador("Juan", 12));

        this.listaTipos["Luz"] = "lightbulb";
        this.listaTipos["Ventilador"] = "window";
    }

    public handlerResponse(status: number, response: string) {
        if (status == 200) {
            let respuestaString: string = response;
            let respuesta: Array<Device> = JSON.parse(respuestaString);
            
            let cajaDiv = document.getElementById("caja");
            cajaDiv.innerHTML = this.getDevicesPage(respuesta);

            for (let disp of respuesta) {
                let botonEdicion = document.getElementById("btn_edit_"+ disp.id)
                let botonGuardado = document.getElementById("btn_save_"+ disp.id)
                let botonEliminar = document.getElementById("btn_delete_"+ disp.id)

                botonEdicion.addEventListener("click",this)
                botonGuardado.addEventListener("click",this)
                botonEliminar.addEventListener("click",this)
            }
          } else {
              alert("Algo salio mal")
          }
    }
    
    handlerResponseActualizar(status: number, response: string) {
        if (status == 200) {
            //this.changeStatus(id, "block", "none")
            alert("Se acutlizo correctamente")    
        } else {
            alert("Error")    
        }
        
    }

    public handleEvent(e:Event): void {
        let objetoEvento = <HTMLInputElement>e.target;
        let action = objetoEvento.getAttribute("action")
        let id = objetoEvento.getAttribute("code")
        
        if(action == "edit"){
            this.changeStatus(id, "none", "block")
        }
        
        if(action == "save"){
            let datos = { 
                "id": id, 
                "state": objetoEvento.checked,
                "name": (<HTMLInputElement>document.getElementById("name_edit_" + id)).value,
                "description": (<HTMLInputElement>document.getElementById("descr_edit_" + id)).value,
                "intensity": (<HTMLInputElement>document.getElementById("intensity_edit_" + id)).value
            };
            this.framework.ejecutarRequest("POST","http://localhost:8000/actualizar", this, datos)
            this.changeStatus(id, "block", "none")
        }

        if(action == "delete"){
            this.framework.ejecutarRequest("DELETE","http://localhost:8000/borrar/" + id, this)
        }
        
    }

    changeStatus(id: string, estadoEdicion: string, estadoInformativo: string) : void {
        document.getElementById("name_" + id).style.display = estadoEdicion
        document.getElementById("descr_" + id).style.display = estadoEdicion
        document.getElementById("intensity_" + id).style.display = estadoEdicion
        document.getElementById("btn_edit_" + id).style.display = estadoEdicion
        document.getElementById("btn_edit_a_" + id).style.display = estadoEdicion

        document.getElementById("name_edit_" + id).style.display = estadoInformativo
        document.getElementById("descr_edit_" + id).style.display = estadoInformativo    
        document.getElementById("intensity_edit_" + id).style.display = estadoInformativo     
        document.getElementById("btn_save_" + id).style.display = estadoInformativo
        document.getElementById("btn_save_a_" + id).style.display = estadoInformativo
    }

    getDevicesPage(respuesta: Array<Device>) : string {
        let datosVisuales = 
        `<ul class="collection">`
            for (let disp of respuesta) {
                datosVisuales += ` 
                <li class="collection-item avatar row">
                    <div class="col s6">
                
                        <img src="../static/images/${this.listaTipos[disp.type]}.png" alt="" class="circle">
                        <p>
                            <span class="title nombreDisp" id="name_${disp.id}">${disp.name}</span>
                            <input type="text" id="name_edit_${disp.id}" value="${disp.name}" style="display: none"/>
                        </p>
                        <p>
                            <span id="descr_${disp.id}">${disp.description}</span>
                            <input type="text" id="descr_edit_${disp.id}" value="${disp.description}" style="display: none"/>
                        </p>
                    </div>

                    <div href="#!" class="col s6">
                        <div class="col s8">
                            <span id="intensity_${disp.id}">Intensidad: ${disp.intensity}%</span>
                            <input type="number" min="1" max="100" id="intensity_edit_${disp.id}" value="${disp.intensity}" style="display: none"/>
                        </div>
                        <div class="col s2">
                            <a class="btn-floating btn-large waves-effect waves-light green" id="btn_edit_a_${disp.id}">
                                <i class="material-icons" action="edit" code="${disp.id}" id="btn_edit_${disp.id}">edit</i>
                            </a>
                            <a class="btn-floating btn-large waves-effect waves-light green" id="btn_save_a_${disp.id}" style="display:none">
                                <i class="material-icons" action="save" code="${disp.id}" id="btn_save_${disp.id}">save</i>
                            </a>
                        </div>
                        <div class="col s2">
                            <a class="btn-floating btn-large waves-effect waves-light red" id="btn_delete_a_${disp.id}">
                                <i class="material-icons" action="delete" code="${disp.id}" id="btn_delete_${disp.id}">delete</i>
                            </a>
                        </div>
                    </div>
                </li>`
            }
            datosVisuales += `</ul>`

            return datosVisuales
    }
}

window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,"");
    let main: Main = new Main();
    main.nombre = "Matias"

    var elemsf = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elemsf);
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);
  });







