import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import {
    makeHot,
    reload
} from "./util/hot-reload"

const homeComponent = () => import("./components/home").then(({HomeComponent}) => HomeComponent)
const listComponent = () => import("./components/articles").then(({ArticlesComponent}) => ArticlesComponent)

if (process.env.ENV === "development" && module.hot) {
    const homeModuleId = "./components/home"
    const listModuleId = "./components/articles"

    // first arguments for `module.hot.accept` and `require` methods have to be static strings
    // see https://github.com/webpack/webpack/issues/5668
    makeHot(homeModuleId, homeComponent,
        module.hot.accept("./components/home", () => reload(homeModuleId, (require("./components/home") as any).HomeComponent)))

    makeHot(listModuleId, listComponent,
        module.hot.accept("./components/articles", () => reload(listModuleId, (require("./components/articles") as any).ListComponent)))
}

Vue.use(VueRouter)

export const createRoutes: () => RouteConfig[] = () => [
    {
        path: "/",
        component: homeComponent
    },
    {
        path: "/articles",
        component: listComponent
    }
]

export const createRouter = () => new VueRouter({mode: "history", routes: createRoutes()})
