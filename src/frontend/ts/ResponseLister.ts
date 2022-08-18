interface ResponseLister{

    handlerResponse(status: number, response: string);
    handlerResponseActualizar(status:number,response:string);
    handlerResponseBorrar(status:number,response:string);
    handlerResponseCrear(status:number,response:string);
}