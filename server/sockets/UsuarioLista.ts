import { SucusalSocket } from "./Usuario";

export class SucListaSocket{
    private lista: SucusalSocket[] = [];

    constructor(){

    }

    public agregar(usuario: SucusalSocket){
        this.lista.push(usuario);
    }

    
}