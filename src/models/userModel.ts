import { TemplateTextCommentConstant } from "../components/constants";

export class UserModel {
    public static getUserId(): string {
        // TODO! add login form
        // to get permission to edit comments
        return TemplateTextCommentConstant.author;
    }
}