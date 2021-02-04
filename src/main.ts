import Vue from "vue"
import axios from "axios"
import {
    makeHot,
    reload
} from "./util/hot-reload"
import { createRouter } from "./router"
import { DataModel } from "./models/dataModel";

import "./sass/main.scss"
import './style.scss';

const navbarComponent = () => import("./components/navbar").then(({NavbarComponent}) => NavbarComponent)
if (process.env.ENV === "development" && module.hot) {
    const navbarModuleId = "./components/navbar"
    makeHot(navbarModuleId, navbarComponent,
        module.hot.accept("./components/navbar", () => reload(navbarModuleId, (require("./components/navbar") as any).NavbarComponent)))
}

let dataUrl = "./data/sampledata.json";
// tslint:disable-next-line:no-unused-expression
new Vue({
    el: "#app-main",
    router: createRouter(),
    components: {
        "navbar": navbarComponent
    },
    data: {
        dataLoading: false
    },
    mounted () {
        this.loadData();
    },
    methods: {
        loadData() {
            // TODO! can load data to MAIN MODEL from here
            this.dataLoading = true;
            DataModel.requestPromise = new Promise((resolve, reject)=>{
                axios.get(dataUrl)
                    .then((response) => {
                        console.log(response);
                        this.dataLoading = false;
                        DataModel.data = response.data.articles;
                        resolve();
                    })
                    .catch(function (error) {
                        reject();
                        alert("An error occurred: " + error);
                    })
            });

        }
    }
})
