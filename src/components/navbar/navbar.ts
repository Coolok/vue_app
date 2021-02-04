import {
    Component,
    Vue,
    Watch
} from "vue-property-decorator"

import { Link } from "./link"
import { Logger } from "../../util/log"

@Component({
    template: require("./navbar.html"),
    components: {}
})
export class NavbarComponent extends Vue {

    protected logger: Logger;
    private object: { default: string } = {default: "Default object property!"};
    private links: Link[] = [
        new Link("Home", "/"),
        new Link("Articles", "/articles")
    ];

    @Watch("$route.path")
    public pathChanged(): void {
        this.logger.info("Changed current path to: " + this.$route.path)
    }

    public mounted(): void {
        if (!this.logger) this.logger = new Logger()
        this.$nextTick(() => this.logger.info(this.object.default))
    }
}
