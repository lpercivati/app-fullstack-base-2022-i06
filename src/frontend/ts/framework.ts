class FrameWork{
                     
  public ejecutarRequest(metodo: string, url: string,lister:ResponseLister,data?:any) {
    let xmlHttp: XMLHttpRequest = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
          if (xmlHttp.readyState == 4) {
            if (metodo == "GET") {
              lister.handlerResponse(xmlHttp.status,xmlHttp.responseText)
            }

            if (metodo == "PUT"){
              lister.handlerResponseActualizar(xmlHttp.status,xmlHttp.responseText)
            }

            if (metodo == "POST"){
              lister.handlerResponseCrear(xmlHttp.status,xmlHttp.responseText)
            }

            if (metodo == "DELETE"){
              lister.handlerResponseBorrar(xmlHttp.status, xmlHttp.responseText)
            }    
          }
    }
    
      xmlHttp.open(metodo, url, true);
      if (metodo == "POST" || metodo == "PUT") {
        xmlHttp.setRequestHeader("Content-Type", "application/json")
        xmlHttp.send(JSON.stringify(data))
      } else {
        xmlHttp.send();  
      }
     
  }
}