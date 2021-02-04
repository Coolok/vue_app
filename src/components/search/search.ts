import {
    Component,
    Vue
} from "vue-property-decorator"
import { TemplateTextCommentConstant } from "../constants";

@Component({
    template: require("./search.html"),
    props: ["placeholder", "textToSearch"],
    components: {}
})
export class SearchComponent extends Vue {

    public emitBlur(event): void {
        this.$emit(TemplateTextCommentConstant.events.change_blur, event.target.value);
        event.target.value = "";
    }

    public emitInput(event): void {
        this.$emit(TemplateTextCommentConstant.events.change_input, event.target.value);
    }

    public emitFocus(event): void {
        this.$emit(TemplateTextCommentConstant.events.change_focus, event.target.value);
    }
}
