import {
    Component,
    Vue
} from "vue-property-decorator"

import { TemplateTextCommentConstant } from "../constants";
import { Article } from "../interfaces/Article";
import { TextComment } from "../interfaces/TextComment";
import { SearchComponent } from "../search/search";
import { DataModel } from "../../models/dataModel";
import { UserModel } from "../../models/userModel";

//NB! one way to add CSS or by WEBPACK loader
import "./article.scss"

@Component({
    template: require("./articles.html"),
    components: {
        "div-search": SearchComponent
    }
})

export class ArticlesComponent extends Vue {
    private articles: Article[] = [];
    private initialArticles: Article[] = [];
    private selectedArticle: string = "";
    private filterByTextEnabled: boolean = false;
    private selectedCategory = TemplateTextCommentConstant.categoryAllId;
    private categories = [TemplateTextCommentConstant.categoryAllId];

    private mounted(): void {
        this.$nextTick(() => {
            if (DataModel.data.length > 0) {
                this.setDataItems(DataModel.data);
            } else {
                DataModel.requestPromise.then(() => {
                    this.setDataItems(DataModel.data);
                });
            }
        })
    }

    private initCategories(): void {
        this.articles.forEach(article => {
            if (this.categories.indexOf(article.category) < 0) {
                this.categories.push(article.category);
            }
        })
    }

    private updateListByFilterByText(textToSearch: string): void {
        let articleText: string;
        this.articles = this.initialArticles.filter((article: Article) => {
            articleText = article.text.toLocaleLowerCase();
            return articleText.indexOf(textToSearch) >= 0 &&
                (
                    this.selectedCategory === TemplateTextCommentConstant.categoryAllId ||
                    article.category === this.selectedCategory
                );
        });
    }

    private updateList(event): void {
        let category: string = event.target.value;

        if (category === TemplateTextCommentConstant.categoryAllId) {
            this.articles = this.initialArticles;
        } else {
            this.articles = this.initialArticles.filter((article: Article) => {
                return article.category === category;
            });
        }
    }

    private getText(article: Article): string {
        return this.selectedArticle === article.id ? article.text : article.text.substring(0, TemplateTextCommentConstant.searchTextLength)
    }

    private getComments(article): string {
        return this.selectedArticle === article.id ? article.comments : [];
    }

    private ifAnyCommentsInArticle(article: Article): boolean {
        return article.comments.some((comment: TextComment) => {
            return comment.text ? comment.text.length > 0 : false;
        });
    }

    private getEditableComments(article: Article): TextComment[] {
        return this.selectedArticle === article.id ? [{
            text: TemplateTextCommentConstant.text,
            author: TemplateTextCommentConstant.author
        }] : [];
    }

    private setActiveArticle(article: Article): void {
        this.selectedArticle === article.id ? this.selectedArticle = "" : this.selectedArticle = article.id;
    }

    private isArticleActive(article: Article): boolean {
        return this.getCurrentArticle() ? this.getCurrentArticle().id === article.id : false;
    }

    private getLoggedUserName(): string {
        return UserModel.getUserId();
    }

    private addComment(comment: TextComment): void {
        const currentArticle: Article = this.getCurrentArticle();
        const commentId: string = Date.now().toString(10);
        currentArticle.comments.push({author: comment.author, text: comment.text, id: commentId});
        this.updateComments(currentArticle);
    }

    private removeComment(comment: TextComment): void {
        const currentArticle: Article = this.getCurrentArticle();
        let index: number = -1;
        currentArticle.comments.forEach((commentItem: TextComment, indexItem: number) => {
            if (comment.id === commentItem.id) {
                index = indexItem;
            }
        });
        currentArticle.comments.splice(index, 1);
        this.updateComments(currentArticle);
    }

    private updateComments(currentArticle: Article): void {
        // FAKE!
        // TODO! add server CRUD
        DataModel.updateComment(currentArticle).then(() => {
            // FAKE!
            // TODO! add server CRUD update articles after server response
            this.setDataItems(DataModel.data);
        });
    }

    private getPlaceholderText(): string {
        return TemplateTextCommentConstant.placeholder;
    }

    private getPlaceholderForSearchText(): string {
        return TemplateTextCommentConstant.searchTextPlaceholder;
    }

    private clearPlaceholderText(comment: TextComment): void {
        comment.text = "";
    }

    private getCurrentArticle(): Article {
        return this.articles.filter(article => this.selectedArticle === article.id)[0];
    }

    private setDataItems(responseData: Article[]): void {
        this.articles = responseData;
        this.initialArticles = responseData;
        this.initCategories();
    }

    private activateFilterByText(): void {
        this.filterByTextEnabled = true;
    }

    private deactivateFilterByText(): void {
        this.filterByTextEnabled = false;
    }
}