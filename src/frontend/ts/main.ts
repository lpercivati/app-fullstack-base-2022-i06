declare const M;
class Main implements EventListenerObject, ResponseLister {
    public listaPersonas: Array<Persona> = new Array();
    public etidadesAcciones: Array<Acciones> = new Array();
    public nombre: string;
    public framework: FrameWork = new FrameWork();
    private listaTipos: Map<string, string> = new Map()
    constructor() {
        this.listaTipos["Luz"] = "lightbulb";
        this.listaTipos["Ventilador"] = "window";
        this.listaTipos["Camara"] = "camera";
        this.listaTipos["Sensor"] = "sensor";

        this.loadDevices();
    }

    public loadDevices(){
        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices", this)
    }
   
    public handlerResponse(status: number, response: string) {
        if (status == 200) {
            let respuestaString: string = response;
            let respuesta: Array<Device> = JSON.parse(respuestaString);

            let cajaDiv = document.getElementById("caja");
            cajaDiv.innerHTML = this.getDevicesPage(respuesta);

            let agregarDispositivoDiv = document.getElementById("agregar-elemento");
            agregarDispositivoDiv.innerHTML = this.getAddDevicePage();

            var elems = document.querySelectorAll('.collapsible');
            M.Collapsible.init(elems, {accordion: false});  
            elems = document.querySelectorAll('select');
            M.FormSelect.init(elems, "");

            let botones = document.querySelectorAll(".boton")
            for (let boton of botones){
                boton.addEventListener("click", this)
            }
            
        } else {
            M.toast({html: "Ocurrió un error"})
        }
    }

    handlerResponseActualizar(status: number, response: string) {
        if (status == 200) {
            this.changeStatus(response, "block", "none")
            document.getElementById("name_" + response).textContent = (<HTMLInputElement>document.getElementById("name_edit_" + response)).value
            document.getElementById("descr_" + response).textContent = (<HTMLInputElement>document.getElementById("descr_edit_" + response)).value
            document.getElementById("intensity_" + response).textContent = "Intensidad: " + (<HTMLInputElement>document.getElementById("intensity_edit_" + response)).value + "%"

            M.toast({html: "Se actualizó el dispositivo correctamente"})
        } else {
            M.toast({html: response})
        }

    }

    handlerResponseBorrar(status: number, response: string) {
        if (status == 200) {
            M.toast({html: "Se borró el dispositivo correctamente"})
            this.loadDevices()
        } else {
            M.toast({html: response})
        }
    }
    handlerResponseCrear(status: number, response: string) {
        if (status == 200) {
            M.toast({html: "Se creó el dispositivo correctamente"})
            this.loadDevices()
        } else {
            M.toast({html: response})
        }
    }

    public handleEvent(e: Event): void {
        let objetoEvento = <HTMLInputElement>e.target;
        let action = objetoEvento.getAttribute("action")
        let id = objetoEvento.getAttribute("code")

        if (action == "edit") {
            this.changeStatus(id, "none", "block")
        }

        if (action == "save") {
            let datos = {
                "id": id,
                "name": (<HTMLInputElement>document.getElementById("name_edit_" + id)).value,
                "description": (<HTMLInputElement>document.getElementById("descr_edit_" + id)).value,
                "intensity": (<HTMLInputElement>document.getElementById("intensity_edit_" + id)).value
            };
            this.framework.ejecutarRequest("PUT", "http://localhost:8000/actualizar", this, datos)
        }

        if (action == "delete") {
            this.framework.ejecutarRequest("DELETE", "http://localhost:8000/borrar/" + id, this)
        }

        if(action == "add"){
            let datos = {
                "id": (<HTMLInputElement>document.getElementById("input-id")).value,
                "name": (<HTMLInputElement>document.getElementById("input-nombre")).value,
                "description": (<HTMLInputElement>document.getElementById("input-descr")).value,
                "intensity": (<HTMLInputElement>document.getElementById("input-intensity")).value,
                "type": (<HTMLInputElement>document.getElementById("input-tipo")).value
            };

            this.framework.ejecutarRequest("POST", "http://localhost:8000/crear", this, datos)
        }
    }

    changeStatus(id: string, estadoEdicion: string, estadoInformativo: string): void {
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

    getDevicesPage(respuesta: Array<Device>): string {
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
                                <i class="material-icons boton" action="edit" code="${disp.id}" id="btn_edit_${disp.id}">edit</i>
                            </a>
                            <a class="btn-floating btn-large waves-effect waves-light green" id="btn_save_a_${disp.id}" style="display:none">
                                <i class="material-icons boton" action="save" code="${disp.id}" id="btn_save_${disp.id}">save</i>
                            </a>
                        </div>
                        <div class="col s2">
                            <a class="btn-floating btn-large waves-effect waves-light red" id="btn_delete_a_${disp.id}">
                                <i class="material-icons boton" action="delete" code="${disp.id}" id="btn_delete_${disp.id}">delete</i>
                            </a>
                        </div>
                    </div>
                </li>`
        }
        datosVisuales += `</ul>`

        return datosVisuales
    }

    getAddDevicePage(): string {
        return `
        <ul class="collapsible" id="">
            <li>
                <div class="collapsible-header"><i class="material-icons">add</i>Agregar dispositivo</div>
                <div class="collapsible-body row">
                <div class="input-field col s2">
                        <input id="input-id" type="number">
                        <label for="input-id">Id</label>
                    </div>
                    <div class="input-field col s2">
                        <input id="input-nombre" type="text">
                        <label for="input-nombre">Nombre</label>
                    </div>
                    <div class="input-field col s3">
                        <input id="input-descr" type="text">
                        <label for="input-descr">Descripción</label>
                    </div>
                    <div class="input-field col s3">
                        <select id="input-tipo">
                            <option value="" disabled selected>Elija su dispositivo</option>
                            <option value="Luz">Luz</option>
                            <option value="Ventilador">Ventilador</option>
                            <option value="Sensor">Sensor</option>
                            <option value="Camara">Cámara</option>
                        </select>
                    </div>
                    <div class="input-field col s2">
                        <input id="input-intensity" min="0" max="100" type="number">
                        <label for="input-intensity">Intensidad</label>
                    </div>

                    <div class="col s12 center">
                        <a class="waves-effect waves-light btn boton" action="add">
                            <i class="material-icons left" >add</i>Agregar dispositivo
                        </a>
                    </div>
                </div>
            </li>
        </ul>`
    }
}

window.addEventListener("load", () => {
    let main: Main = new Main();
    main.nombre = "Matias"
});
