import { Http, Response } from '@angular/http';
import {Injectable} from "@angular/core";

Injectable()
export class APIService{
    private baseUrl: string = localStorage.getItem("api");
    constructor(private http : Http){
    }


    // other code...
}